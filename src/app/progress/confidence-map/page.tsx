import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ConfidenceMapClient from '@/components/confidence-map-client';

export default async function ConfidenceMapPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all topic progress for the user
    const { data: topicProgress } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true);

    return (
        <div className="max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen pb-12">
            <div className="bg-gradient-to-tr from-indigo-700 to-violet-800 text-white p-8 rounded-b-3xl shadow-lg mb-8">
                <h1 className="text-3xl font-black">Confidence Map</h1>
                <p className="opacity-90 mt-2 font-medium">Your entire syllabus categorized by mastery. Focus your energy where it matters most.</p>
            </div>
            <div className="px-4 md:px-8">
                <ConfidenceMapClient topics={topicProgress || []} />
            </div>
        </div>
    );
}
