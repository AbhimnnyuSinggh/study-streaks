import OnboardingWizard from '@/components/onboarding-wizard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if they already onboarded
    const { data: profile } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

    if (profile?.onboarding_completed) {
        redirect('/dashboard');
    }

    // Fetch available exams for the first question
    const { data: exams, error } = await supabase
        .from('exams')
        .select('id, name, category, sections')
        .eq('is_active', true)
        .order('category', { ascending: true });

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <OnboardingWizard
                initialExams={exams || []}
                userId={user.id}
                userName={user.user_metadata?.first_name || user.user_metadata?.full_name || 'Aspirant'}
                userEmail={user.email || ''}
            />
        </div>
    );
}
