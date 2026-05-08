import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, MessageCircle, Flame, Users, BellRing, Target } from 'lucide-react';
import Link from 'next/link';

export default async function PodPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('users')
        .select('name, current_streak, level')
        .eq('id', user.id)
        .single();

    // Mock Pod Data for MVP
    const podMembers = [
        { id: 1, name: profile?.name || 'You', avatar: '👨‍🎓', streak: profile?.current_streak || 0, level: profile?.level || 1, status: 'Completed Today', isYou: true },
        { id: 2, name: 'Rahul S.', avatar: '🧑‍💻', streak: 12, level: 4, status: 'Studying now...', isYou: false },
        { id: 3, name: 'Priya M.', avatar: '👩‍💼', streak: 45, level: 12, status: 'Completed Today', isYou: false },
        { id: 4, name: 'Amit K.', avatar: '👨‍🚀', streak: 2, level: 1, status: 'Snoozed', isYou: false },
        { id: 5, name: 'Neha V.', avatar: '🥷', streak: 8, level: 3, status: 'Not started', isYou: false }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 bg-gray-50 min-h-screen pb-12">

            {/* Hero Header */}
            <div className="bg-blue-600 text-white p-8 rounded-b-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <Shield className="w-8 h-8 text-blue-200" />
                            <h1 className="text-3xl font-bold">Delta Squad</h1>
                        </div>
                        <p className="text-blue-100">IBPS PO Target 2026 • 5/5 Members</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl flex items-center gap-6 text-center">
                        <div>
                            <div className="text-3xl font-black flex items-center gap-2">
                                <Flame className="w-6 h-6 text-amber-400" /> 14
                            </div>
                            <div className="text-xs text-blue-200 font-bold uppercase mt-1">Shared Streak</div>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div>
                            <div className="text-3xl font-black flex items-center gap-2 space-x-2">
                                <Target className="w-6 h-6 text-emerald-400" /> 80%
                            </div>
                            <div className="text-xs text-blue-200 font-bold uppercase mt-1">Avg Completion</div>
                        </div>
                    </div>
                </div>
                {/* Decorative background elements */}
                <Shield className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
            </div>

            <div className="px-4 md:px-8 space-y-8">
                <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider">
                    ← Back to Dashboard
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Members List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" /> Squad Members
                        </h2>
                        <div className="space-y-3">
                            {podMembers.map(member => (
                                <div key={member.id} className={`bg-white p-4 rounded-2xl border flex items-center justify-between transition-shadow hover:shadow-sm ${member.isYou ? 'border-primary ring-1 ring-primary/20 bg-emerald-50/30' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                {member.name}
                                                {member.isYou && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Lvl {member.level}</span>
                                                • {member.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center hidden sm:block">
                                            <div className="font-bold flex items-center gap-1">
                                                <Flame className={`w-4 h-4 ${member.streak > 0 ? 'text-accent fill-accent' : 'text-gray-300'}`} /> {member.streak}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400">Streak</div>
                                        </div>

                                        {!member.isYou && (
                                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-full transition-colors relative group">
                                                <BellRing className="w-5 h-5" />
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    Nudge {member.name.split(' ')[0]}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat / Feed */}
                    <div className="bg-white rounded-2xl border flex flex-col h-[500px] shadow-sm">
                        <div className="p-4 border-b bg-gray-50 rounded-t-2xl flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-gray-500" />
                            <h2 className="font-bold text-gray-900">Squad Chatter</h2>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-50">
                            {/* Messages */}
                            <div className="flex flex-col gap-1 items-start">
                                <span className="text-xs text-gray-400 font-medium ml-1">Priya M. • 10:42 AM</span>
                                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none text-sm">
                                    Just finished the mock test! Quant was really tough today. 🥵
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-xs text-gray-400 font-medium mr-1">You • 1:15 PM</span>
                                <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm">
                                    I'm starting my session in 30 mins!
                                </div>
                            </div>

                            <div className="flex justify-center my-4">
                                <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm border border-amber-200">
                                    <BellRing className="w-3 h-3" /> Rahul S. nudged Amit K.
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 items-start">
                                <span className="text-xs text-gray-400 font-medium ml-1">Rahul S. • 5:02 PM</span>
                                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none text-sm">
                                    Amit wake up bro, we need the group streak! 🔪
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-white rounded-b-2xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Hype up the squad..."
                                    className="w-full bg-gray-100 border-none rounded-full px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full hover:bg-emerald-600 transition-colors">
                                    <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
