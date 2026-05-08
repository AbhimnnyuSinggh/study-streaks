'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    AreaChart, Area
} from 'recharts';
import { Flame, Trophy, TrendingUp, Target, Award, Star, Map } from 'lucide-react';
import SundayReflection from './sunday-reflection';
import Link from 'next/link';

export default function ProgressClient({ user, sectionMastery, recentPlans, hasReflected }: { user: any, sectionMastery: any[], recentPlans: any[], hasReflected?: boolean }) {

    // Format dates for charts
    const formatVelocityData = recentPlans.map(p => ({
        name: new Date(p.plan_date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: p.completed_tasks,
        total: p.total_tasks
    }));

    // Calculate XP progress to next level
    const baseXP = (user?.level - 1) * 1000;
    const nextTarget = user?.level * 1000;
    const currentLevelProgress = user?.total_xp - baseXP;
    const percentageToNext = Math.min(100, Math.max(0, (currentLevelProgress / 1000) * 100));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            <div className="flex justify-end">
                <Link href="/progress/confidence-map" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md transition-all active:scale-95">
                    <Map className="w-4 h-4" />
                    View Confidence Map
                </Link>
            </div>

            <SundayReflection
                userId={user?.id}
                weeklyData={recentPlans}
                hasReflectedThisWeek={hasReflected}
            />

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{user?.current_streak || 0}</div>
                    <div className="text-xs uppercase font-bold text-gray-500 mt-1">Current Streak</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{user?.longest_streak || user?.current_streak || 0}</div>
                    <div className="text-xs uppercase font-bold text-gray-500 mt-1">Highest Streak</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Star className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{user?.total_xp || 0}</div>
                    <div className="text-xs uppercase font-bold text-gray-500 mt-1">Total XP</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{user?.topic_progress?.filter((t: any) => t.status === 'completed')?.length || 0}</div>
                    <div className="text-xs uppercase font-bold text-gray-500 mt-1">Topics Mastered</div>
                </div>
            </div>

            {/* Level Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-primary p-1 rounded-2xl shadow-md">
                <div className="bg-white p-6 rounded-xl flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-primary flex items-center justify-center font-black text-3xl text-primary shrink-0 relative">
                        {user?.level || 1}
                        <div className="absolute -bottom-2 bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border-2 border-white">Level</div>
                    </div>
                    <div className="flex-1 w-full space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Aspirant Rank</h3>
                                <p className="text-sm text-gray-500">{1000 - currentLevelProgress} XP to Level {user?.level + 1}</p>
                            </div>
                            <span className="font-bold text-primary">{user?.total_xp} / {nextTarget}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className="bg-primary h-3 rounded-full transition-all duration-1000 relative"
                                style={{ width: `${percentageToNext}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 rounded-r-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart: Section Mastery */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-purple-500" />
                        <h3 className="font-bold text-gray-900 text-lg">Subject Mastery</h3>
                    </div>
                    <div className="h-64 sm:h-80">
                        {sectionMastery && sectionMastery.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sectionMastery}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                                    <Radar name="Mastery Level" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium text-sm">No section data yet</div>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-gray-500 leading-relaxed border-t pt-4">
                        <strong>How to read this:</strong> The Radar chart visualizes your competence across all sections of the syllabus. The further out the green shape stretches towards a particular subject, the higher your mastery level (Basics Done, Moderate, Strong) in that area. Subjects near the center need more attention!
                    </p>
                </div>

                {/* Bar Chart: Recent Velocity */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-gray-900 text-lg">Weekly Consistency</h3>
                    </div>
                    <div className="h-64 sm:h-80">
                        {formatVelocityData && formatVelocityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formatVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="#e5e7eb" radius={[4, 4, 4, 4]} name="Scheduled Tasks" />
                                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 4, 4]} name="Completed Tasks" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium text-sm">Complete daily plans to see consistency</div>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-gray-500 leading-relaxed border-t pt-4">
                        <strong>How to read this:</strong> This Bar chart tracks your daily study volume over the last 7 days. The grey bars show how many tasks the algorithm scheduled, and the green bars show how many you actually completed. Use it to gauge if you're keeping up with the plan!
                    </p>
                </div>
            </div>

        </div>
    );
}
