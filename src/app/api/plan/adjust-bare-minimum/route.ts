import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { dateStr } = await req.json();

    try {
        // 1. Fetch user to ensure they haven't maxed out bare minimum days (anti-abuse)
        const { data: profile } = await adminSupabase
            .from('users')
            .select('bare_minimum_mode, total_bare_minimum_days')
            .eq('id', user.id)
            .single();

        // 2. Find today's plan
        const { data: todayPlan } = await adminSupabase
            .from('daily_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_date', dateStr)
            .single();

        if (!todayPlan) {
            return NextResponse.json({ error: 'No plan found for today to compress.' }, { status: 404 });
        }

        // 3. Mark the user as having used a bare minimum day
        await adminSupabase.from('users').update({
            total_bare_minimum_days: (profile?.total_bare_minimum_days || 0) + 1
        }).eq('id', user.id);

        // 4. Fetch all pending tasks for today
        const { data: pendingTasks } = await adminSupabase
            .from('tasks')
            .select('*')
            .eq('daily_plan_id', todayPlan.id)
            .eq('status', 'pending')
            .order('task_order', { ascending: true });

        if (!pendingTasks || pendingTasks.length === 0) {
            return NextResponse.json({ success: true, message: 'No tasks to compress' });
        }

        // 5. Keep the first task, skip the rest
        const taskToHighlight = pendingTasks[0];
        const tasksToSkip = pendingTasks.slice(1);

        // Update the highlighted task to indicate it's the bare minimum anchor
        await adminSupabase.from('tasks').update({
            duration_minutes: 15, // Cap it to 15 mins to make it easy
            tip: `[BARE MINIMUM MODE] Just 15 minutes. Show up. That counts as a victory today.`
        }).eq('id', taskToHighlight.id);

        // Skip the rest
        if (tasksToSkip.length > 0) {
            const taskIds = tasksToSkip.map(t => t.id);
            await adminSupabase.from('tasks').update({
                status: 'skipped'
            }).in('id', taskIds);
        }

        // 6. Update the Daily Plan to only require 1 task for 100% completion
        // We set total_tasks to the number of completed tasks + 1 (the one we just left pending)
        const completedCount = todayPlan.completed_tasks || 0;
        await adminSupabase.from('daily_plans').update({
            total_tasks: completedCount + 1,
            energy_level: 'low',
        }).eq('id', todayPlan.id);

        return NextResponse.json({ success: true, message: 'Switched to Bare Minimum Mode' });

    } catch (error: any) {
        console.error('Bare Minimum Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
