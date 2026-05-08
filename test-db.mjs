import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keulawhjenxfhutvaloq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ'
);

async function run() {
    const { data, error } = await supabase.from('users').select('id, name, target_exam_id').limit(5);
    console.log("Users API Response:");
    console.log(JSON.stringify(data, null, 2));
    if (error) console.error("Error:", error);
}

run();
