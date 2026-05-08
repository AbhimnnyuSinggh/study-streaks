import { createClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/dashboard-client';
import RevisionRemindersClient from '@/components/revision-reminders-client';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // Fetch user stats
    const { data: profile } = await supabase
        .from('users')
        .select('name, current_streak, total_xp, level, onboarding_completed')
        .eq('id', user!.id)
        .single();

    if (!profile || !profile.onboarding_completed) {
        redirect('/signup/onboarding');
    }

    // Fetch today's plan
    const { data: todayPlan } = await supabase
        .from('daily_plans')
        .select('*, tasks(*)')
        .eq('user_id', user!.id)
        .eq('plan_date', todayStr)
        .single();

    // Fetch previous plan to check for missed tasks
    const { data: recentPlans } = await supabase
        .from('daily_plans')
        .select('*, tasks(*)')
        .eq('user_id', user!.id)
        .lt('plan_date', todayStr)
        .order('plan_date', { ascending: false })
        .limit(1);

    const previousPlan = recentPlans && recentPlans.length > 0 ? recentPlans[0] : null;
    const missedTasks = previousPlan?.tasks?.filter((t: any) => t.status === 'pending') || [];

    // Fetch Spaced Repetition Due Topics
    const { data: dueRevisions } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_completed', true)
        .lte('next_revision_date', todayStr)
        .order('next_revision_date', { ascending: true });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {dueRevisions && dueRevisions.length > 0 && (
                <RevisionRemindersClient dueRevisions={dueRevisions} />
            )}
            <DashboardClient
                planId={todayPlan?.id}
                tasks={todayPlan?.tasks || []}
                profile={profile}
                dateStr={todayStr}
                missedTasks={missedTasks}
                hasCheckedIn={todayPlan?.check_in_completed}
            />
        </div>
    );
}
