import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { addDays, format } from 'date-fns';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topicName, confidenceLevel, examId } = await req.json();

        if (!topicName || !confidenceLevel || !examId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Adaptive Spaced Repetition Engine Logic
        // Calculate the next revision date based on self-reported confidence
        let daysToAdd = 1;
        switch (confidenceLevel) {
            case 'low': daysToAdd = 1; break; // Revise tomorrow
            case 'medium': daysToAdd = 3; break; // Revise in 3 days
            case 'high': daysToAdd = 7; break; // Revise in a week
            case 'mastered': daysToAdd = 21; break; // Revise in 3 weeks
        }

        const nextRevisionDate = format(addDays(new Date(), daysToAdd), 'yyyy-MM-dd');

        // Fetch existing progress
        const { data: existingProgress } = await supabase
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('exam_id', examId)
            .eq('topic_name', topicName)
            .single();

        let currentCycle = existingProgress?.current_revision_cycle || 0;

        // If they rated it, we increment the cycle count (unless they dropped back to low)
        if (confidenceLevel !== 'low') {
            currentCycle += 1;
        }

        if (existingProgress) {
            // Update existing record
            const { error: updateError } = await supabase
                .from('topic_progress')
                .update({
                    is_completed: true,
                    confidence_level: confidenceLevel,
                    next_revision_date: nextRevisionDate,
                    current_revision_cycle: currentCycle,
                    // If they mastered the topic, ensure subtopics are visually complete (optional, UI usually handles this)
                })
                .eq('id', existingProgress.id);

            if (updateError) throw updateError;
        } else {
            // Insert new record if they somehow completed it without taking a plan task
            const { error: insertError } = await supabase
                .from('topic_progress')
                .insert({
                    user_id: user.id,
                    exam_id: examId,
                    topic_name: topicName,
                    is_completed: true,
                    confidence_level: confidenceLevel,
                    next_revision_date: nextRevisionDate,
                    current_revision_cycle: 1
                });

            if (insertError) throw insertError;
        }

        return NextResponse.json({
            success: true,
            next_revision_date: nextRevisionDate,
            confidence: confidenceLevel
        });

    } catch (error: any) {
        console.error('Error updating confidence:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
