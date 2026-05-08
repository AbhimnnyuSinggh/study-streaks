import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient('https://keulawhjenxfhutvaloq.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldWxhd2hqZW54Zmh1dHZhbG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUyNDAsImV4cCI6MjA4NzQxMTI0MH0.7Ah0LAK8R_ofAjtZ7oHtL-7jNsacEg7_vsELqFnM6kQ');

async function seedLeaderboard() {
    console.log("Fetching known user...");
    const { data: users } = await supabase.from('users').select('id, name');

    if (!users || users.length === 0) {
        console.error("No active users found to attach sessions to.");
        return;
    }

    const testUser = users[0];
    const sessions = [];
    const today = new Date();

    // Generate 45 sessions for the user to make them #1 on the leaderboard
    for (let i = 0; i < 45; i++) {
        // Distribute sessions over the last 30 days, heavily weighted towards today/this week
        const pastDate = new Date();
        const daysAgo = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 30);
        pastDate.setDate(today.getDate() - daysAgo);

        sessions.push({
            user_id: testUser.id,
            duration_minutes: Math.floor(Math.random() * 60) + 15, // 15 to 75 mins
            session_date: pastDate.toISOString().split('T')[0]
        });
    }

    const { error: sessionErr } = await supabase.from('study_sessions').insert(sessions);
    if (sessionErr) {
        console.error("Failed to insert mock sessions:", sessionErr.message);
        return;
    }

    console.log(`Inserted ${sessions.length} dummy study sessions for ${testUser.name}.`);

    // Update user XP manually for test data
    await supabase.from('users').update({ total_xp: 4500, level: 7, current_streak: 12 }).eq('id', testUser.id);

    console.log("Database seeded successfully! View the leaderboard frontend to see populated data.");
}

seedLeaderboard();
