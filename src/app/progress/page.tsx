import { createClient } from '@/lib/supabase/server';
import ProgressClient from '@/components/progress-client';
import { redirect } from 'next/navigation';
import { startOfWeek, format } from 'date-fns';

export default async function ProgressPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch full user profile along with relations to section levels
    const { data: profile } = await supabase
        .from('users')
        .select('name, current_streak, longest_streak, total_xp, level, user_section_levels(*), topic_progress(*)')
        .eq('id', user.id)
        .single();

    // Fetch the last 7 days of daily plans to plot velocity chart
    const { data: recentPlans } = await supabase
        .from('daily_plans')
        .select('plan_date, total_tasks, completed_tasks')
        .eq('user_id', user.id)
        .order('plan_date', { ascending: false })
        .limit(7);

    // Check if user has already reflected this Sunday/Week
    const today = new Date();
    // Get the most recent Sunday safely
    const weekStartStr = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');

    const { data: pastReflection } = await supabase
        .from('weekly_reflections')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start', weekStartStr)
        .single();

    // Parse section mastery for radar chart
    const sectionMasteryMap = (profile?.user_section_levels || []).reduce((acc: any, row: any) => {
        let score = 0;
        switch (row.level) {
            case 'not_started': score = 10; break;
            case 'basics_done': score = 40; break;
            case 'moderate': score = 70; break;
            case 'strong': score = 100; break;
        }
        acc.push({ subject: row.section_name, A: score, fullMark: 100 });
        return acc;
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen pb-12">
            <div className="bg-emerald-600 text-white p-8 rounded-b-3xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold">Your Progress Report</h1>
                <p className="opacity-80 mt-2">Track your journey, streaks, and subject mastery.</p>
            </div>
            <div className="px-4 md:px-8">
                <ProgressClient
                    user={profile}
                    sectionMastery={sectionMasteryMap}
                    recentPlans={recentPlans?.reverse() || []}
                    hasReflected={!!pastReflection}
                />
            </div>
        </div>
    );
}
