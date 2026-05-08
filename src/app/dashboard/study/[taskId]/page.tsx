import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StudyTimerClient from '@/components/study-timer-client';

export default async function StudyTimerPage({ params }: { params: Promise<{ taskId: string }> }) {
    const { taskId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single();

    if (!task) {
        redirect('/dashboard');
    }

    return <StudyTimerClient task={task} />;
}
