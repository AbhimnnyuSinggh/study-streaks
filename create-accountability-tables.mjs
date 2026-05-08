import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function checkDatabase() {
    console.log("SQL to run in Supabase SQL Editor:");
    console.log(`
-- Add new Accountability tracking columns to daily_plans
ALTER TABLE daily_plans ADD COLUMN IF NOT EXISTS check_in_completed BOOLEAN DEFAULT false;
ALTER TABLE daily_plans ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMPTZ;
ALTER TABLE daily_plans ADD COLUMN IF NOT EXISTS reflection_reason TEXT;
ALTER TABLE daily_plans ADD COLUMN IF NOT EXISTS self_rating INTEGER;

-- Create weekly_reflections table to hold Sunday tracking
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 5),
  biggest_obstacle TEXT,
  improvement_plan TEXT,
  tasks_completed INTEGER,
  tasks_total INTEGER,
  hours_studied DECIMAL,
  xp_earned INTEGER,
  streak_at_week_end INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own reflections" ON weekly_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can select own reflections" ON weekly_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service Role Full Access" ON weekly_reflections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create pattern_insights table for the algorithm intelligence
CREATE TABLE IF NOT EXISTS pattern_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  suggestion_text TEXT,
  is_shown BOOLEAN DEFAULT false,
  shown_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pattern_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own insights" ON pattern_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insights (mark read)" ON pattern_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service Role Full Access" ON pattern_insights FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add Streak Freezes to users profile
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_freeze_used_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bare_minimum_mode BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_bare_minimum_days INTEGER DEFAULT 0;
    `);
}

checkDatabase();
