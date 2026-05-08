import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topicName, subtopicName, examId } = await req.json();

        if (!topicName || !subtopicName || !examId) {
            return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
        }

        // Fetch existing
        const { data: existingProgress } = await supabase
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('exam_id', examId)
            .eq('topic_name', topicName)
            .single();

        let customSubtopics = existingProgress?.custom_subtopics || [];
        customSubtopics.push({ name: subtopicName, hours: 1 });

        if (existingProgress) {
            const { error: updateError } = await supabase
                .from('topic_progress')
                .update({ custom_subtopics: customSubtopics })
                .eq('id', existingProgress.id);
            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from('topic_progress')
                .insert({
                    user_id: user.id,
                    exam_id: examId,
                    topic_name: topicName,
                    custom_subtopics: customSubtopics
                });
            if (insertError) throw insertError;
        }

        return NextResponse.json({ success: true, custom_subtopics: customSubtopics });
    } catch (error: any) {
        console.error('Add Subtopic Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
