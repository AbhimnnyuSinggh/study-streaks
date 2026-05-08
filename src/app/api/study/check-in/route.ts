import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId, reason, completedRatio } = await req.json();

    if (!planId) return NextResponse.json({ error: 'Missing planId' }, { status: 400 });

    try {
        // 1. Mark Check-In as complete on today's plan
        const { error: planErr } = await adminSupabase
            .from('daily_plans')
            .update({
                check_in_completed: true,
                check_in_time: new Date().toISOString(),
                reflection_reason: reason || null
            })
            .eq('id', planId)
            .eq('user_id', user.id);

        if (planErr) throw new Error(`Failed to update daily plan check-in status: ${planErr.message}`);

        // 2. Adjust tomorrow's plan generation based on the reason (The Algorithmic edge)
        // Note: For now, we store it. `generatePlan.ts` logic will read the historical reasons 
        // to dynamically generate the user's workload.

        return NextResponse.json({ success: true, message: 'Check-in complete' });
    } catch (error: any) {
        console.error("Check-in Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
