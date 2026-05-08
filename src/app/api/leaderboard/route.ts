import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'xp'; // 'xp', 'today', 'week', 'month'

        let leaders: any[] = [];

        if (type === 'xp') {
            const { data } = await adminSupabase
                .from('users')
                .select('id, name, total_xp, current_streak, level')
                .order('total_xp', { ascending: false })
                .limit(50);
            leaders = data || [];
        } else {
            // Data grouping by date filters
            let dateFilter = new Date();
            if (type === 'today') {
                dateFilter.setHours(0, 0, 0, 0);
            } else if (type === 'week') {
                dateFilter.setDate(dateFilter.getDate() - 7);
            } else if (type === 'month') {
                dateFilter.setMonth(dateFilter.getMonth() - 1);
            }

            const dateStr = dateFilter.toISOString().split('T')[0];

            // Aggregate study sessions
            const { data: sessions, error } = await adminSupabase
                .from('study_sessions')
                .select('user_id, duration_minutes, users(id, name, current_streak, level)')
                .gte('session_date', dateStr);

            if (error) throw error;

            // Group by user
            const aggregated = (sessions || []).reduce((acc: Record<string, any>, curr: any) => {
                const uid = curr.user_id;
                // Workaround for Supabase 1:N join returning an array vs single object
                const userObj = Array.isArray(curr.users) ? curr.users[0] : curr.users;

                if (!acc[uid]) {
                    acc[uid] = {
                        id: uid,
                        name: userObj?.name || 'Unknown User',
                        current_streak: userObj?.current_streak || 0,
                        level: userObj?.level || 1,
                        total_time: 0
                    };
                }
                acc[uid].total_time += curr.duration_minutes;
                return acc;
            }, {});

            leaders = Object.values(aggregated)
                .sort((a: any, b: any) => b.total_time - a.total_time)
                .slice(0, 50);
        }

        const currentUserObj = leaders.find((l: any) => l.id === user.id);
        const currentUserRank = currentUserObj ? leaders.indexOf(currentUserObj) + 1 : -1;

        return NextResponse.json({
            leaders,
            currentUserRank,
            currentUserScore: currentUserObj ? (type === 'xp' ? currentUserObj.total_xp : currentUserObj.total_time) : 0
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
