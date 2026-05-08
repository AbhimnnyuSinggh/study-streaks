import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateFullPlan } from '@/lib/algorithm/generatePlan';

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // -------------------------------------------------------------
    // SPRINT 10 SILENT SCHEMA MIGRATION 
    // Ensures older databases have the Syllabus/Spaced Repetition tracking columns
    await supabase.rpc('run_sql', {
        sql_query: `
          ALTER TABLE topic_progress 
          ADD COLUMN IF NOT EXISTS completed_subtopics JSONB DEFAULT '[]':: jsonb,
    ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK(confidence_level IN('low', 'medium', 'high', 'mastered')),
        ADD COLUMN IF NOT EXISTS next_revision_date TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS current_revision_cycle INTEGER DEFAULT 0;
`
    });
    // -------------------------------------------------------------

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await generateFullPlan(supabase, user.id);
        return NextResponse.json({ success: true, message: 'Study plan generated successfully.' });
    } catch (error: any) {
        console.error("Plan Gen Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
