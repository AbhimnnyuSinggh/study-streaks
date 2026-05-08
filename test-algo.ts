import { createClient } from '@supabase/supabase-js';
import { generateFullPlan } from './src/lib/algorithm/generatePlan';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users } = await supabase.from('users').select('id');
  if (users && users.length > 0) {
    const userId = users[0].id;
    console.log("Generating for user:", userId);
    try {
        await generateFullPlan(supabase, userId);
        console.log("Success");
    } catch(e) {
        console.error("Algo Error:", e);
    }
  } else {
    console.log("No users found");
  }
}
run();
