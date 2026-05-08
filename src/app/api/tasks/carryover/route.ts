import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { missedTasks, targetPlanId, targetPlanDateStr } = await req.json();

    if (!missedTasks || missedTasks.length === 0 || !targetPlanId) {
        return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    try {
        // Mark old tasks as rescheduled
        const missedTaskIds = missedTasks.map((t: any) => t.id);
        await adminSupabase
            .from('tasks')
            .update({ status: 'rescheduled' })
            .in('id', missedTaskIds)
            .eq('user_id', user.id);

        // Fetch current highest task_order in today's plan
        const { data: currentTasks } = await adminSupabase
            .from('tasks')
            .select('task_order')
            .eq('daily_plan_id', targetPlanId)
            .order('task_order', { ascending: false })
            .limit(1);

        let startingOrder = currentTasks && currentTasks.length > 0 ? currentTasks[0].task_order + 1 : 1;

        // Insert new carried-over tasks
        const newTasks = missedTasks.map((t: any) => ({
            daily_plan_id: targetPlanId,
            user_id: user.id,
            task_order: startingOrder++,
            section_name: t.section_name,
            topic_name: t.topic_name,
            task_type: t.task_type,
            duration_minutes: t.duration_minutes,
            resource_name: t.resource_name,
            resource_type: t.resource_type,
            tip: "Carried over from yesterday.",
            revision_number: t.revision_number,
            status: 'pending',
            plan_date: targetPlanDateStr
        }));

        const { data: insertedTasks, error: insertErr } = await adminSupabase
            .from('tasks')
            .insert(newTasks)
            .select('*');

        if (insertErr) throw insertErr;

        // Update target plan total_tasks
        const { data: targetPlan } = await adminSupabase
            .from('daily_plans')
            .select('total_tasks')
            .eq('id', targetPlanId)
            .single();

        if (targetPlan) {
            await adminSupabase
                .from('daily_plans')
                .update({ total_tasks: (targetPlan.total_tasks || 0) + newTasks.length })
                .eq('id', targetPlanId);
        }

        revalidatePath('/dashboard');

        return NextResponse.json({ success: true, tasks: insertedTasks });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
