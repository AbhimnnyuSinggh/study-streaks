import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdjustClient from './adjust-client';

export default async function AdjustPlanPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the user's section levels to know what subjects they actually study
    const { data: sections } = await supabase
        .from('user_section_levels')
        .select('section_name')
        .eq('user_id', user.id);

    // Extract just the section names
    const availableSubjects = sections?.map(s => s.section_name) || [];

    return <AdjustClient availableSubjects={availableSubjects} />;
}
