import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function createTable() {
    // Standard Supabase client doesn't support executing arbitrary DDL SQL directly
    // Let's create a generic RPC function in supabase if we need to, 
    // but in this case, we have to instruct the user to run it in the SQL Editor.
    console.log("SQL to run manually:");
    console.log(`
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can select own sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service Role Full Access" ON study_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
    `);
}

createTable();
