import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://keulawhjenxfhutvaloq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ'
);

async function run() {
    console.log("Fetching Number System rows");
    const { data: tp, error } = await supabase.from('topic_progress').select('*');
    if (error) {
        console.error("Fetch failed:", error);
        return;
    }
    const matched = tp.filter(t => t.topic_name && t.topic_name.includes('Number System'));
    console.log(JSON.stringify(matched, null, 2));

}

run();
