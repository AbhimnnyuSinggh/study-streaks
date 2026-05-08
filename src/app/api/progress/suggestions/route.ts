import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all of the user's completed topics
        const { data: topicProgress } = await supabase
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_completed', true);

        if (!topicProgress || topicProgress.length === 0) {
            return NextResponse.json({ suggestions: [] });
        }

        const low = topicProgress.filter((t: any) => t.confidence_level === 'low');
        const medium = topicProgress.filter((t: any) => t.confidence_level === 'medium');
        const highMastered = topicProgress.filter((t: any) => t.confidence_level === 'high' || t.confidence_level === 'mastered');

        const suggestions = [];

        // Insight 1: Foundational Struggles
        if (low.length > 0) {
            suggestions.push({
                type: 'critical',
                title: 'Address Foundational Gaps',
                description: "You have " + low.length + " topics marked as 'Struggling'. These are your highest ROI areas. We recommend adding dedicated revision specific to these into tomorrow's plan.",
                actionText: 'Focus Plan on Weaknesses'
            });
        }

        // Insight 2: Promotion Opportunity
        if (medium.length > 3) {
            suggestions.push({
                type: 'opportunity',
                title: 'Ready for Mastery',
                description: "You're almost there on " + medium.length + " topics. A focused session practicing active recall (e.g., past year questions) on these could push them to High Confidence.",
                actionText: 'Generate Practice Quiz'
            });
        }

        // Insight 3: Success Acknowledgement
        if (highMastered.length > 10) {
            suggestions.push({
                type: 'praise',
                title: 'Solid Knowledge Base',
                description: "You've mastered " + highMastered.length + " topics! Make sure not to ignore them completely; your Spaced Repetition engine will naturally surface them when they are about to fade.",
                actionText: 'View Confidence Map'
            });
        }

        return NextResponse.json({ suggestions });

    } catch (error: any) {
        console.error('Error generating suggestions:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
