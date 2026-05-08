import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { missedTasks } = await req.json();

    try {
        if (missedTasks && missedTasks.length > 0) {
            const taskIds = missedTasks.map((t: any) => t.id);
            // Mark them as skipped so they are no longer "pending" in the DB, preventing the carryover prompt from re-appearing on refresh.
            const { error: updateErr } = await supabase
                .from('tasks')
                .update({ status: 'skipped' })
                .in('id', taskIds)
                .eq('user_id', user.id);

            if (updateErr) throw new Error(updateErr.message);
        }
        return NextResponse.json({ success: true, message: 'Carryover dismissed' });
    } catch (error: any) {
        console.error("Dismiss Carryover Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
