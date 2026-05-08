import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function checkDatabase() {
    const { data: users, error } = await supabase.from('users').select('id, name, total_xp, current_streak').limit(10);
    console.log("USERS:", users?.length);
    console.log(users);
}

checkDatabase();
