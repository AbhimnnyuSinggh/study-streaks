import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateFullPlan } from '@/lib/algorithm/generatePlan';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { hours, energy, preference } = await req.json();

    try {
        // For MVP: We update the user profile's available hours based on energy/hours selected.
        // A robust v2 algorithm would only adjust today's hours dynamically.
        const effectiveHours = energy === 'minimum' ? 1.0 : hours;

        await supabase.from('users').update({
            available_hours: effectiveHours
        }).eq('id', user.id);

        // Regenerate plan with updated hours
        await generateFullPlan(supabase, user.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
