import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Award, Flame, Zap, CheckCircle, Lock, Star, Shield, Target } from 'lucide-react';
import Link from 'next/link';

export default async function BadgesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('name, current_streak, highest_streak, total_xp, level, topic_progress(status)')
        .eq('id', user.id)
        .single();

    const totalTopicsMastered = profile?.topic_progress?.filter((t: any) => t.status === 'completed')?.length || 0;

    // Define Badge Dictionary
    const badges = [
        { id: 'b1', name: 'First Steps', desc: 'Complete your first task', icon: Zap, unlocked: profile?.total_xp > 0, bg: 'bg-yellow-100', text: 'text-yellow-600' },
        { id: 'b2', name: '3-Day Fire', desc: 'Maintain a 3-day streak', icon: Flame, unlocked: profile?.highest_streak >= 3, bg: 'bg-orange-100', text: 'text-orange-600' },
        { id: 'b3', name: '1-Week Warrior', desc: 'Maintain a 7-day streak', icon: Shield, unlocked: profile?.highest_streak >= 7, bg: 'bg-emerald-100', text: 'text-emerald-600' },
        { id: 'b4', name: 'Dedicated', desc: 'Reach Level 5', icon: Star, unlocked: profile?.level >= 5, bg: 'bg-blue-100', text: 'text-blue-600' },
        { id: 'b5', name: 'Mastermind', desc: 'Master 10 topics', icon: Target, unlocked: totalTopicsMastered >= 10, bg: 'bg-purple-100', text: 'text-purple-600' },
        { id: 'b6', name: 'Unstoppable', desc: 'Maintain a 30-day streak', icon: Award, unlocked: profile?.highest_streak >= 30, bg: 'bg-red-100', text: 'text-red-600' },
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <div className="max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen pb-12">
            <div className="bg-amber-500 text-white p-8 rounded-b-3xl shadow-lg flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Achievement Badges</h1>
                    <p className="mt-2 text-amber-50 font-medium">Keep hitting those goals to unlock them all.</p>
                </div>
                <div className="hidden sm:block text-right">
                    <div className="text-4xl font-black">{unlockedCount} / {badges.length}</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-amber-100">Unlocked</div>
                </div>
            </div>

            <div className="px-4 md:px-8 space-y-8">
                <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider">
                    ← Back to Dashboard
                </Link>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {badges.map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.id}
                                className={`relative p-6 rounded-2xl border transition-all duration-300 ${badge.unlocked
                                        ? 'bg-white shadow-sm hover:shadow-md'
                                        : 'bg-gray-100 border-dashed border-gray-300 opacity-60 grayscale'
                                    }`}
                            >
                                {!badge.unlocked && (
                                    <div className="absolute top-4 right-4 bg-gray-200 p-1.5 rounded-full">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}
                                {badge.unlocked && (
                                    <div className="absolute -top-3 -right-3 bg-primary text-white p-1 rounded-full shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${badge.unlocked ? badge.bg : 'bg-gray-200'}`}>
                                    <Icon className={`w-8 h-8 ${badge.unlocked ? badge.text : 'text-gray-400'}`} />
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{badge.name}</h3>
                                <p className="text-sm text-gray-500">{badge.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
