import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { taskId } = await req.json();
    if (!taskId) return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });

    try {
        // 1. Fetch task details to update related tables
        const { data: task, error: taskErr } = await adminSupabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single();

        if (taskErr || !task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // 2. Mark task complete
        await adminSupabase.from('tasks').update({
            status: 'completed',
            xp_awarded: 50,
            completed_at: new Date().toISOString()
        }).eq('id', taskId);

        // 3. Fetch user profile (to get current XP and streaks)
        const { data: profile } = await adminSupabase
            .from('users')
            .select('total_xp, current_streak, longest_streak')
            .eq('id', user.id)
            .single();

        // 4. Update Daily Plan completion count
        let planCompletedRatio = 0;
        let streakEarnedToday = false;

        if (task.daily_plan_id) {
            const { data: plan } = await adminSupabase.from('daily_plans').select('completed_tasks, total_tasks').eq('id', task.daily_plan_id).single();
            if (plan) {
                const newCompletedCount = (plan.completed_tasks || 0) + 1;

                // Calculate completion ratio (Gentle Accountability System)
                if (plan.total_tasks > 0) {
                    planCompletedRatio = newCompletedCount / plan.total_tasks;
                }

                // If they crossed the 70% threshold with this very task, they earn their streak for today
                const previousRatio = (plan.completed_tasks || 0) / (plan.total_tasks || 1);
                if (previousRatio < 0.7 && planCompletedRatio >= 0.7) {
                    streakEarnedToday = true;
                }

                await adminSupabase.from('daily_plans').update({
                    completed_tasks: newCompletedCount
                }).eq('id', task.daily_plan_id);
            }
        }

        // 5. Award XP and Increment Streak (if 70% threshold crossed today)
        let newStreak = profile?.current_streak || 0;
        let newLongest = profile?.longest_streak || 0;

        if (streakEarnedToday) {
            newStreak += 1;
            if (newStreak > newLongest) newLongest = newStreak;
        }

        const { error: xpError } = await adminSupabase.from('users').update({
            total_xp: (profile?.total_xp || 0) + 50,
            current_streak: newStreak,
            longest_streak: newLongest
        }).eq('id', user.id);

        if (xpError) throw new Error(`User XP update failed: ${xpError.message}`);

        // 6. Upsert Topic Progress (so it counts towards Topics Mastered)
        // Fetch existing to see if we need to update or insert
        const { data: existingProgress } = await adminSupabase
            .from('topic_progress')
            .select('id, total_time_minutes')
            .eq('user_id', user.id)
            .eq('section_name', task.section_name)
            .eq('topic_name', task.topic_name)
            .single();

        if (existingProgress) {
            const { error: updateProgErr } = await adminSupabase.from('topic_progress').update({
                status: 'completed', // Using 'completed' to match the frontend filter in progress-client.tsx
                last_studied_date: new Date().toISOString(),
                total_time_minutes: (existingProgress.total_time_minutes || 0) + task.duration_minutes
            }).eq('id', existingProgress.id);
            if (updateProgErr) throw new Error(`Topic progress update failed: ${updateProgErr.message}`);
        } else {
            // Needed to fetch exam_id from users table for the insert constraint
            const { data: userRow } = await adminSupabase.from('users').select('exam_id').eq('id', user.id).single();

            const { error: insertProgErr } = await adminSupabase.from('topic_progress').insert({
                user_id: user.id,
                exam_id: userRow?.exam_id,
                section_name: task.section_name,
                topic_name: task.topic_name,
                status: 'completed', // Required by frontend check
                first_studied_date: new Date().toISOString(),
                last_studied_date: new Date().toISOString(),
                total_time_minutes: task.duration_minutes,
                resource_used: task.resource_name
            });
            if (insertProgErr) throw new Error(`Topic progress insert failed: ${insertProgErr.message}`);
        }

        revalidatePath('/dashboard');
        revalidatePath('/progress');
        return NextResponse.json({ success: true, message: 'Task marked complete' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
