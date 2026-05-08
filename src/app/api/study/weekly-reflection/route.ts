import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { startOfWeek, format } from 'date-fns';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { rating, obstacle, plan, weekData } = await req.json();

    if (!rating || !obstacle || !weekData) {
        return NextResponse.json({ error: 'Missing required reflection fields' }, { status: 400 });
    }

    try {
        // Calculate totals for the week
        const tasksTotal = weekData.reduce((acc: number, curr: any) => acc + (curr.total_tasks || 0), 0);
        const tasksCompleted = weekData.reduce((acc: number, curr: any) => acc + (curr.completed_tasks || 0), 0);

        // Ensure we always align on the same Sunday definition for the current week
        const today = new Date();
        const weekStartStr = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');

        // Fetch User profile to capture streak state at time of evaluation
        const { data: profile } = await adminSupabase
            .from('users')
            .select('current_streak, total_xp')
            .eq('id', user.id)
            .single();

        // Upsert the weekly reflection
        const { error: reflectionErr } = await adminSupabase
            .from('weekly_reflections')
            .upsert({
                user_id: user.id,
                week_start: weekStartStr,
                self_rating: rating,
                biggest_obstacle: obstacle,
                improvement_plan: plan || null,
                tasks_completed: tasksCompleted,
                tasks_total: tasksTotal,
                xp_earned: 0, // In MVP, we aren't tracking weekly distinct XP, just total
                streak_at_week_end: profile?.current_streak || 0,
            }, { onConflict: 'user_id, week_start' });

        if (reflectionErr) throw new Error(`Failed to save weekly reflection: ${reflectionErr.message}`);

        return NextResponse.json({ success: true, message: 'Reflection saved' });
    } catch (error: any) {
        console.error("Weekly Reflection Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
