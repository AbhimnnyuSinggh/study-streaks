import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sectionName, topicName, examId } = await req.json();

        if (!sectionName || !topicName || !examId) {
            return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
        }

        // Check if there's already progress (unlikely for a new custom topic, but safe)
        const { data: existingProgress } = await supabase
            .from('topic_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('exam_id', examId)
            .eq('topic_name', topicName)
            .single();

        if (existingProgress) {
            return NextResponse.json({ error: 'Topic already exists in your progress tracker' }, { status: 400 });
        }

        // Insert new record as an empty shell linked to the custom section
        const { error: insertError } = await supabase
            .from('topic_progress')
            .insert({
                user_id: user.id,
                exam_id: examId,
                topic_name: topicName,
                custom_section_name: sectionName,
                is_completed: false,
                custom_subtopics: []
            });

        if (insertError) throw insertError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Add Topic Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
