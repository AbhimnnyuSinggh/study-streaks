const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function check() {
  const { data: users } = await supabase.from('users').select('*');
  console.log("USERS:", users.length);
  
  if (users.length > 0) {
    const userId = users[0].id;
    const { data: user } = await supabase.from('users').select('*, exams(id, sections)').eq('id', userId).single();
    console.log("Exam relation:", !!user.exams);

    const { data: plans } = await supabase.from('daily_plans').select('*');
    console.log("DAILY PLANS:", plans.map(p => ({ id: p.id, d: p.plan_date, t: p.total_tasks })));
    
    const { data: tasks } = await supabase.from('tasks').select('*').limit(3);
    console.log("TASKS SAMPLE:", tasks.length);
  }
}
check();
