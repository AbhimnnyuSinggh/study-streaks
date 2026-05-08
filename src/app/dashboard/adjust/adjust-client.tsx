'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Battery, Settings2, Loader2 } from 'lucide-react';

export default function AdjustClient({ availableSubjects }: { availableSubjects: string[] }) {
    const [hours, setHours] = useState('3.0');
    const [energy, setEnergy] = useState('normal');
    const [preference, setPreference] = useState('follow_plan');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAdjust = async () => {
        setLoading(true);
        await fetch('/api/plan/adjust', {
            method: 'POST',
            body: JSON.stringify({ hours: parseFloat(hours), energy, preference })
        });
        router.push('/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-100 p-2 rounded-full"><Settings2 className="w-6 h-6 text-primary" /></div>
                    <h1 className="text-3xl font-bold text-gray-900">Adjust Today's Plan</h1>
                </div>
                <p className="text-gray-500 mb-8 ml-12">Take 30 seconds to recalibrate. Not every day needs to be max effort.</p>

                <div className="space-y-10">

                    {/* Question 1: Hours */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" /> How much time do you have today?</h2>
                        <div className="pt-6 pb-2 px-2">
                            <input
                                type="range" min="0.5" max="8.0" step="0.5"
                                value={hours} onChange={(e) => setHours(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="text-center mt-6 flex justify-between px-2 text-sm text-gray-400 font-medium">
                                <span>Very Busy (0.5h)</span>
                                <span className="text-2xl font-black text-primary -mt-3">{hours}h</span>
                                <span>Extra Time (8h)</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Question 2: Energy */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Battery className="w-5 h-5 text-gray-400" /> How's your energy level?</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                { id: 'high', icon: '🔥', title: 'High Energy', desc: 'Give me hard topics, I\'m ready' },
                                { id: 'normal', icon: '😊', title: 'Normal', desc: 'Balanced plan, mix of everything' },
                                { id: 'low', icon: '😴', title: 'Low Energy', desc: 'Keep it light — revision and easy topics' },
                                { id: 'minimum', icon: '😫', title: 'Bare Minimum', desc: 'Just enough to keep my streak alive' }
                            ].map(lvl => (
                                <button
                                    key={lvl.id}
                                    onClick={() => setEnergy(lvl.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${energy === lvl.id ? 'border-primary bg-emerald-50' : 'border-gray-100 hover:border-primary'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{lvl.icon}</span>
                                        <div>
                                            <div className="font-bold text-gray-800">{lvl.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{lvl.desc}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Question 3: Preference */}
                    {energy !== 'minimum' && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95">
                            <h2 className="text-xl font-bold">Any preference for today?</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <button
                                    onClick={() => setPreference('follow_plan')}
                                    className={`p-3 text-sm rounded-xl border-2 font-medium transition-colors ${preference === 'follow_plan' ? 'border-primary bg-primary text-white' : 'border-gray-100 hover:border-primary text-gray-700'}`}
                                >
                                    📋 Standard Plan
                                </button>
                                <button
                                    onClick={() => setPreference('revision_only')}
                                    className={`p-3 text-sm rounded-xl border-2 font-medium transition-colors ${preference === 'revision_only' ? 'border-primary bg-primary text-white' : 'border-gray-100 hover:border-primary text-gray-700'}`}
                                >
                                    📖 Only Revision
                                </button>
                                <button
                                    onClick={() => setPreference('mock_day')}
                                    className={`p-3 text-sm rounded-xl border-2 font-medium transition-colors ${preference === 'mock_day' ? 'border-primary bg-primary text-white' : 'border-gray-100 hover:border-primary text-gray-700'}`}
                                >
                                    📝 Mock Day
                                </button>

                                {/* Dynamically render subjects specific to this user's exam */}
                                {availableSubjects.map((subject) => {
                                    const prefId = `more_${subject.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                                    return (
                                        <button
                                            key={prefId}
                                            onClick={() => setPreference(prefId)}
                                            className={`p-3 text-sm rounded-xl border-2 font-medium transition-colors ${preference === prefId ? 'border-primary bg-primary text-white' : 'border-gray-100 hover:border-primary text-gray-700'}`}
                                        >
                                            🎯 More {subject}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAdjust}
                        disabled={loading}
                        className="w-full bg-primary text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors flex justify-center items-center shadow-lg shadow-emerald-200"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update Today's Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
