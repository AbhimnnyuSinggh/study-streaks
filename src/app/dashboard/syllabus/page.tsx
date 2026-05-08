import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SyllabusClient from '@/components/syllabus-client';

export default async function SyllabusPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Fetch user's active exam
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    let targetExamId = userData?.target_exam_id;

    if (!targetExamId) {
        // Fallback: If no target exam is set (due to seed/testing defaults), just grab the first exam
        const { data: fallbackExam } = await supabase.from('exams').select('id').limit(1).single();
        if (!fallbackExam) {
            redirect('/dashboard');
        }
        targetExamId = fallbackExam.id;
    }

    // Fetch the Exam definition (which holds the JSON topics and subtopics)
    const { data: examData } = await supabase
        .from('exams')
        .select('sections')
        .eq('id', targetExamId)
        .single();

    // Fetch the User's Progress on those chunks
    const { data: topicProgress } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_id', targetExamId);

    return (
        <main className="min-h-screen bg-slate-50 border-t border-slate-200 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <SyllabusClient
                    syllabusData={examData?.sections || []}
                    topicProgress={topicProgress || []}
                    targetExamId={targetExamId}
                />
            </div>
        </main>
    );
}
