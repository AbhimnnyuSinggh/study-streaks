import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function checkData() {
    const { data: users, error: err } = await supabase.from('users').select('id, name, total_xp, topic_progress(*)');
    console.log("USERS:", JSON.stringify(users, null, 2));

    const { data: tasks } = await supabase.from('tasks').select('id, topic_name, status, xp_awarded');
    console.log("TASKS:", JSON.stringify(tasks, null, 2));
}

checkData();
