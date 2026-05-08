import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keulawhjenxfhutvaloq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ'
);

async function run() {
    const { data: user } = await supabase.auth.getUser();
    console.log("Has User Session?", !!user);
    
    // Check topic_progress logic
    const { data: tp, error } = await supabase.from('topic_progress').select('*');
    if (error) {
        console.error("Fetch Error:", error);
    } else {
        console.log("Topic Progress rows:", tp.length);
        if (tp.length > 0) {
            console.log("Sample:", tp[0]);
        }
    }
}

run();
