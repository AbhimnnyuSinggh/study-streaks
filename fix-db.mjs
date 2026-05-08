import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keulawhjenxfhutvaloq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ'
);

async function run() {
    console.log("Running migration...");
    const { data, error } = await supabase.rpc('run_sql', {
        sql_query: `
          ALTER TABLE topic_progress 
          ADD COLUMN IF NOT EXISTS completed_subtopics JSONB DEFAULT '[]':: jsonb,
          ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK(confidence_level IN('low', 'medium', 'high', 'mastered')),
          ADD COLUMN IF NOT EXISTS next_revision_date TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS current_revision_cycle INTEGER DEFAULT 0;
          NOTIFY pgrst, 'reload schema';
        `
    });
    
    if (error) {
        console.error("Migration Error:", error);
    } else {
        console.log("Migration complete.", data);
    }
}

run();
