import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const taskData = await req.json();

    // Strip client-only temp ID
    const { id, ...insertData } = taskData;
    insertData.user_id = user.id;

    const { data, error } = await adminSupabase.from('tasks').insert([insertData]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Also update daily plan task count
    const { data: dp } = await adminSupabase.from('daily_plans').select('total_tasks').eq('id', insertData.daily_plan_id).single();
    if (dp) {
        await adminSupabase.from('daily_plans').update({ total_tasks: dp.total_tasks + 1 }).eq('id', insertData.daily_plan_id);
    }

    return NextResponse.json({ success: true, task: data });
}
