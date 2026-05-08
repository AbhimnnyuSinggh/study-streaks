import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users, error: userError } = await supabase.from('users').select('*');
  console.log("USERS:", users?.map(u => ({ id: u.id, name: u.name, selected_exam: u.exam_id, study_days: u.study_days })));

  if (users && users.length > 0) {
    const userId = users[0].id;
    const { data: fullUser, error: fuErr } = await supabase
      .from('users')
      .select('*, exams(id, sections, total_topics, exam_pattern), user_section_levels(section_name, level), user_resources(section_name, resource_name, resource_type)')
      .eq('id', userId)
      .single();

    console.log("FULL USER fetch exam:", fullUser?.exams ? 'YES' : 'NO', "Error:", fuErr);
  }

  const { data: plans, error: planError } = await supabase.from('daily_plans').select('plan_date, total_tasks, user_id');
  console.log("PLANS:", plans);
}
run();
