import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { taskId } = await req.json();

    // Fetch the task to get its daily_plan_id before removing it
    const { data: task, error: fetchErr } = await adminSupabase
        .from('tasks')
        .select('daily_plan_id')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single();

    if (fetchErr || !task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // 1. Delete the task
    const { error: deleteErr } = await adminSupabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

    if (deleteErr) return NextResponse.json({ error: deleteErr.message }, { status: 500 });

    // 2. Decrement the total_tasks count in the daily plan
    const { data: dp } = await adminSupabase
        .from('daily_plans')
        .select('total_tasks')
        .eq('id', task.daily_plan_id)
        .single();

    if (dp && dp.total_tasks > 0) {
        await adminSupabase
            .from('daily_plans')
            .update({ total_tasks: dp.total_tasks - 1 })
            .eq('id', task.daily_plan_id);
    }

    return NextResponse.json({ success: true });
}
