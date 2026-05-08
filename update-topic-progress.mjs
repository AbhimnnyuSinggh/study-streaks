import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log("Starting Syllabus Tracker Migration...");

    const { error: topicsProgressMigrationError } = await supabase.rpc('run_sql', {
        sql_query: `
        -- Alter topic_progress to support Spaced Repetition and Subtopics
        ALTER TABLE topic_progress 
        ADD COLUMN IF NOT EXISTS completed_subtopics JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'mastered')),
        ADD COLUMN IF NOT EXISTS next_revision_date TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS current_revision_cycle INTEGER DEFAULT 0;
      `
    });

    // Note: if 'run_sql' RPC is not defined on the Supabase instance, this fails gracefully. 
    // We will print the SQL for the user to run manually if it fails.
    if (topicsProgressMigrationError) {
        console.warn("Could not execute SQL via RPC (normal if 'run_sql' function is missing). Please run this manually in Supabase SQL Editor:");
        console.log(`
        ALTER TABLE topic_progress 
        ADD COLUMN IF NOT EXISTS completed_subtopics JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'mastered')),
        ADD COLUMN IF NOT EXISTS next_revision_date TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS current_revision_cycle INTEGER DEFAULT 0;
      `);
    } else {
        console.log("Successfully migrated topic_progress table.");
    }

    console.log("Migration script finished.");
}

runMigration();
