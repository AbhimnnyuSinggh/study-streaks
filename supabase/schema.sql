-- Table: exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "IBPS PO"
  slug TEXT UNIQUE NOT NULL,             -- "ibps-po" (for URLs)
  category TEXT NOT NULL,                -- "Banking" | "SSC" | "Insurance" | "Railways" | "UPSC" | "Defence"
  description TEXT,                      -- Short exam description for SEO pages
  exam_pattern TEXT,                     -- Exam pattern notes
  total_topics INTEGER NOT NULL,
  sections JSONB NOT NULL,               -- Full syllabus structure (see Syllabus JSON below)
  meta_title TEXT,                       -- SEO meta title
  meta_description TEXT,                 -- SEO meta description
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  exam_id UUID REFERENCES exams(id),
  exam_date DATE,                        -- Target exam date (nullable if unknown)
  available_hours DECIMAL NOT NULL DEFAULT 3,
  study_days TEXT[] DEFAULT '{mon,tue,wed,thu,fri,sat,sun}',
  preferred_time TEXT DEFAULT 'mixed',   -- "morning" | "afternoon" | "evening" | "mixed"
  is_working_professional BOOLEAN DEFAULT false,
  work_hours DECIMAL DEFAULT 0,
  has_appeared_before BOOLEAN DEFAULT false,
  attempt_count INTEGER DEFAULT 0,
  motivation_reason TEXT,                -- WHY they're preparing (personal anchor)
  preparation_source TEXT DEFAULT 'mix', -- "free" | "paid" | "mix"
  
  -- Gamification
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_freezes_available INTEGER DEFAULT 1,
  
  -- Settings
  wants_pod BOOLEAN DEFAULT false,
  email_alerts_enabled BOOLEAN DEFAULT true,
  push_alerts_enabled BOOLEAN DEFAULT true,
  plan_generated_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_section_levels
CREATE TABLE user_section_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,            -- "Quantitative Aptitude"
  level TEXT NOT NULL DEFAULT 'not_started', -- "not_started" | "basics_done" | "moderate" | "strong"
  UNIQUE(user_id, section_name)
);

-- Table: user_resources
CREATE TABLE user_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,            -- "Quantitative Aptitude"
  resource_name TEXT NOT NULL,           -- "Rakesh Yadav"
  resource_type TEXT NOT NULL,           -- "youtube" | "paid_course" | "book" | "pdf" | "app"
  resource_platform TEXT,               -- "YouTube" | "Testbook" | "Adda247" | "Oliveboard" | "Unacademy" | "Other"
  resource_url TEXT,                    -- Optional URL
  is_primary BOOLEAN DEFAULT true,      -- Primary source for this section
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: daily_plans
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  available_hours DECIMAL NOT NULL,      -- Hours for this specific day (can differ from default)
  energy_level TEXT DEFAULT 'normal',    -- "high" | "normal" | "low" | "minimum"
  topic_preference TEXT DEFAULT 'follow_plan', -- "follow_plan" | "more_quant" | "more_reasoning" | "revision_only" | "mock_day"
  was_customized BOOLEAN DEFAULT false,  -- Did user adjust today's plan?
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);

-- Table: tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_plan_id UUID REFERENCES daily_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_order INTEGER NOT NULL,           -- Display order (1, 2, 3...)
  section_name TEXT NOT NULL,            -- "Quantitative Aptitude"
  topic_name TEXT NOT NULL,              -- "Percentage"
  task_type TEXT NOT NULL,               -- "new_topic" | "revision" | "practice" | "mock_test" | "current_affairs"
  duration_minutes INTEGER NOT NULL,
  resource_name TEXT,                    -- User's chosen resource for this task
  resource_type TEXT,                    -- "youtube" | "paid_course" | "book" etc.
  tip TEXT,                             -- Contextual tip for this task
  revision_number INTEGER,              -- null for new, 1/2/3/4 for revision cycles
  status TEXT DEFAULT 'pending',         -- "pending" | "completed" | "skipped" | "rescheduled"
  completed_at TIMESTAMPTZ,
  xp_awarded INTEGER DEFAULT 0,
  plan_date DATE NOT NULL,              -- Denormalized for easier queries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: topic_progress
CREATE TABLE topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id),
  section_name TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',     -- "not_started" | "in_progress" | "first_pass_done" | "revision_1" | "revision_2" | "revision_3" | "mastered"
  first_studied_date DATE,
  last_studied_date DATE,
  total_time_minutes INTEGER DEFAULT 0,
  revision_dates JSONB DEFAULT '[]',     -- Scheduled revision dates
  resource_used TEXT,                    -- Which resource user studied from
  UNIQUE(user_id, section_name, topic_name)
);

-- Table: streaks_log
CREATE TABLE streaks_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  tasks_total INTEGER NOT NULL,
  tasks_completed INTEGER NOT NULL,
  completion_percentage DECIMAL NOT NULL,
  streak_maintained BOOLEAN NOT NULL,
  freeze_used BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, log_date)
);

-- Table: badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,              -- See badge list below
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- Table: pods
CREATE TABLE pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  exam_id UUID REFERENCES exams(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0 CHECK (member_count <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pod_members
CREATE TABLE pod_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pod_id, user_id)
);

-- Table: pod_messages
CREATE TABLE pod_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',      -- "text" | "encouragement" | "system"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: resource_usage_log (SILENT DATA COLLECTION FOR TOPPERPATH)
CREATE TABLE resource_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id),
  section_name TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_platform TEXT,
  teacher_name TEXT,
  task_completed BOOLEAN NOT NULL,
  duration_minutes INTEGER,
  switched_from_resource TEXT,           -- Previous resource for same topic (if switched)
  log_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: blog_posts (For SEO)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,                 -- Markdown content
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT,                         -- "banking" | "ssc" | "tips" | "motivation"
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
