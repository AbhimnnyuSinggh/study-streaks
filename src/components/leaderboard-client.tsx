'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Clock, CalendarDays, Calendar as CalendarIcon, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardClient() {
    const [activeTab, setActiveTab] = useState<'xp' | 'today' | 'week' | 'month'>('xp');
    const [leaders, setLeaders] = useState<any[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState(-1);
    const [currentUserScore, setCurrentUserScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchLeaders = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?type=${activeTab}`);
                if (!res.ok) throw new Error('Failed to fetch data');
                const data = await res.json();

                if (isMounted) {
                    setLeaders(data.leaders || []);
                    setCurrentUserRank(data.currentUserRank || -1);
                    setCurrentUserScore(data.currentUserScore || 0);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchLeaders();
        return () => { isMounted = false; };
    }, [activeTab]);

    const rankDisplay = currentUserRank !== -1 ? currentUserRank : '100+';

    const tabs = [
        { id: 'xp', label: 'All-Time XP', icon: Zap },
        { id: 'today', label: 'Today', icon: Clock },
        { id: 'week', label: 'This Week', icon: CalendarDays },
        { id: 'month', label: 'This Month', icon: CalendarIcon }
    ] as const;

    const formatScore = (score: number) => {
        if (activeTab === 'xp') return `${score.toLocaleString()} XP`;

        // Convert total minutes to Hours & Mins
        const hours = Math.floor(score / 60);
        const mins = score % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 bg-gray-50 min-h-screen pb-12">

            <div className="bg-gradient-to-br from-indigo-700 via-purple-600 to-fuchsia-600 text-white p-8 rounded-b-3xl shadow-lg flex justify-between items-center mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-md" />
                        <h1 className="text-3xl font-black tracking-tight">Global Leaderboard</h1>
                    </div>
                    <p className="text-purple-200 font-medium text-lg">Top 50 Aspirants Nationwide</p>
                </div>
                <div className="relative z-10 flex flex-col items-end">
                    <div className="text-sm font-bold uppercase tracking-wider text-purple-200">Your Rank</div>
                    <div className="text-5xl font-black text-white drop-shadow-lg">#{rankDisplay}</div>
                </div>
                {/* Decorative overlapping circles */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute left-1/2 -bottom-32 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
                <Trophy className="absolute -right-6 -bottom-10 w-48 h-48 text-white opacity-10 rotate-12" />
            </div>

            <div className="px-4 md:px-8 space-y-8 mb-4">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-wider mb-2">
                    ← Back to Dashboard
                </Link>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 bg-white p-2 rounded-2xl shadow-sm border">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 whitespace-nowrap px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    {/* Header Row */}
                    <div className="bg-gray-50/80 p-5 border-b grid grid-cols-12 text-xs font-black text-gray-500 uppercase tracking-widest">
                        <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
                        <div className="col-span-6 sm:col-span-5">Aspirant</div>
                        <div className="hidden sm:block sm:col-span-3 text-center">Progression</div>
                        <div className="col-span-4 sm:col-span-3 text-right pr-4">{activeTab === 'xp' ? 'Total XP' : 'Study Time'}</div>
                    </div>

                    {/* Listing */}
                    <div className="divide-y relative min-h-[300px]">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : leaders.length === 0 ? (
                            <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                                <Clock className="w-12 h-12 opacity-20 mb-3" />
                                <p className="font-medium text-lg">No data yet for this period.</p>
                                <p className="text-sm opacity-70">Start studying to secure rank #1!</p>
                            </div>
                        ) : (
                            leaders.map((leader, index) => {
                                let RankIcon = null;
                                let rankClass = "text-gray-400";
                                if (index === 0) { RankIcon = <Medal className="w-7 h-7 fill-yellow-400 text-yellow-500 drop-shadow-sm" />; rankClass = "text-yellow-600"; }
                                else if (index === 1) { RankIcon = <Medal className="w-7 h-7 fill-gray-300 text-gray-400 drop-shadow-sm" />; rankClass = "text-gray-500"; }
                                else if (index === 2) { RankIcon = <Medal className="w-7 h-7 fill-amber-600 text-amber-700 drop-shadow-sm" />; rankClass = "text-amber-700"; }

                                return (
                                    <div key={leader.id} className="p-4 sm:p-5 grid grid-cols-12 items-center transition-colors hover:bg-gray-50/80 group">
                                        <div className={`col-span-2 sm:col-span-1 flex justify-center text-xl font-black ${rankClass}`}>
                                            {RankIcon ? RankIcon : index + 1}
                                        </div>

                                        <div className="col-span-6 sm:col-span-5 flex items-center gap-4 pl-2">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-inner flex-shrink-0 text-lg">
                                                {leader.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-gray-900 truncate flex items-center gap-2">
                                                    <span className="truncate">{leader.name}</span>
                                                    {leader.id === 'YOU' /* Replace with actual ID check later */ &&
                                                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest leading-none flex-shrink-0">You</span>
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium truncate mt-0.5">
                                                    🔥 {leader.current_streak} Day Streak
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block sm:col-span-3 text-center">
                                            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-indigo-100">
                                                <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                                                Level {leader.level}
                                            </span>
                                        </div>

                                        <div className="col-span-4 sm:col-span-3 text-right pr-4 font-black sm:text-lg text-indigo-900">
                                            {formatScore(activeTab === 'xp' ? leader.total_xp : leader.total_time)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
