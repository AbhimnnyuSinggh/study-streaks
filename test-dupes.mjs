import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keulawhjenxfhutvaloq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ'
);

async function run() {
  console.log("Fetching duplicates for Number System");
  const { data: dups, error } = await supabase.from('topic_progress').select('*').eq('topic_name', 'Number System');
  console.log("Rows:", dups ? dups.length : 0);
  console.log("Data:", JSON.stringify(dups, null, 2));
}

run();
