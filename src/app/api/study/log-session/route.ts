import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { taskId, sessionMinutes, markComplete } = await req.json();

    if (!taskId || !sessionMinutes) {
        return NextResponse.json({ error: 'Missing req fields' }, { status: 400 });
    }

    try {
        // 1. Fetch Task Info
        const { data: task } = await adminSupabase.from('tasks').select('*').eq('id', taskId).eq('user_id', user.id).single();
        if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

        // 2. Fetch or Create Topic Progress
        const { data: existingProgress } = await adminSupabase
            .from('topic_progress')
            .select('id, total_time_minutes')
            .eq('user_id', user.id)
            .eq('section_name', task.section_name)
            .eq('topic_name', task.topic_name)
            .single();

        if (existingProgress) {
            await adminSupabase.from('topic_progress').update({
                total_time_minutes: (existingProgress.total_time_minutes || 0) + sessionMinutes,
                last_studied_date: new Date().toISOString(),
                ...(markComplete ? { status: 'completed' } : { status: 'in_progress' })
            }).eq('id', existingProgress.id);
        } else {
            const { data: userRow } = await adminSupabase.from('users').select('exam_id').eq('id', user.id).single();
            await adminSupabase.from('topic_progress').insert({
                user_id: user.id,
                exam_id: userRow?.exam_id,
                section_name: task.section_name,
                topic_name: task.topic_name,
                status: markComplete ? 'completed' : 'in_progress',
                first_studied_date: new Date().toISOString(),
                last_studied_date: new Date().toISOString(),
                total_time_minutes: sessionMinutes,
                resource_used: task.resource_name
            });
        }

        // 3. Award XP for time studied (e.g., 2 XP per minute)
        const xpEarned = Math.floor(sessionMinutes * 2);
        const { data: profile } = await adminSupabase.from('users').select('total_xp').eq('id', user.id).single();

        await adminSupabase.from('users').update({
            total_xp: (profile?.total_xp || 0) + xpEarned
        }).eq('id', user.id);

        if (markComplete) {
            // Re-use logic for marking task as complete if requested via the timer
            await adminSupabase.from('tasks').update({
                status: 'completed',
                xp_awarded: xpEarned + 50, // bonus for completion
                completed_at: new Date().toISOString()
            }).eq('id', taskId);

            // Increment daily plans completed tasks count
            if (task.daily_plan_id) {
                const { data: plan } = await adminSupabase.from('daily_plans').select('completed_tasks').eq('id', task.daily_plan_id).single();
                if (plan) {
                    await adminSupabase.from('daily_plans').update({
                        completed_tasks: (plan.completed_tasks || 0) + 1
                    }).eq('id', task.daily_plan_id);
                }
            }
        }

        // 4. Log the actual session for the Leaderboard
        const sessionDate = new Date();
        const { error: sessionErr } = await adminSupabase.from('study_sessions').insert({
            user_id: user.id,
            task_id: taskId,
            duration_minutes: sessionMinutes,
            session_date: sessionDate.toISOString().split('T')[0]
        });

        if (sessionErr) console.error("Failed to insert study session:", sessionErr.message);

        revalidatePath('/dashboard');
        revalidatePath('/progress');
        revalidatePath('/leaderboard');
        return NextResponse.json({ success: true, xpEarned, message: 'Session logged' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
