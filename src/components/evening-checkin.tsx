'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Award, ShieldAlert, Sparkles, Check, ArrowRight, X } from 'lucide-react';

type CheckInProps = {
    planId: string;
    completedRatio: number;
    completedCount: number;
    totalCount: number;
    streak: number;
    hasCheckedIn?: boolean;
};

export default function EveningCheckIn({ planId, completedRatio, completedCount, totalCount, streak, hasCheckedIn }: CheckInProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-trigger at 9PM local time if not already checked in
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const todayKey = now.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format locally

            // If it's past 9 PM and we haven't shown it yet this session
            if (now.getHours() >= 21 && !hasCheckedIn && !localStorage.getItem(`checked_in_${todayKey}`)) {
                setIsOpen(true);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await fetch('/api/study/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, reason, completedRatio })
            });
            const todayKey = new Date().toLocaleDateString('en-CA');
            localStorage.setItem(`checked_in_${todayKey}`, 'true');
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to check in", error);
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const streakSafe = completedRatio >= 0.7;
    const allDone = completedRatio === 1;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">

                {/* Header */}
                <div className={`p-6 text-white relative overflow-hidden ${allDone ? 'bg-emerald-600' : streakSafe ? 'bg-indigo-600' : 'bg-amber-500'}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            {allDone ? <Sparkles className="w-7 h-7" /> : streakSafe ? <Target className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-1">Evening Check-In</h2>
                            <p className="text-white/80 font-medium text-sm">Let's review today's progress</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Step 1: The Reality Check */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">

                            <div className="text-center space-y-2">
                                <div className="text-5xl font-black mb-2 flex justify-center items-end gap-1">
                                    {completedCount} <span className="text-2xl text-slate-400 font-bold mb-1">/ {totalCount}</span>
                                </div>
                                <p className="text-slate-600 font-medium">Tasks completed today</p>
                            </div>

                            <div className={`p-5 rounded-2xl border-2 ${allDone ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : streakSafe ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    {allDone ? "🎉 Perfect Day!" : streakSafe ? "✅ Streak Secured!" : "⚠️ Streak at Risk"}
                                </h3>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {allDone
                                        ? `You crushed the entire plan today. Your ${streak} day streak continues to grow strong.`
                                        : streakSafe
                                            ? `You hit the 70% threshold! Remaining tasks will be safely rescheduled. Your ${streak} day streak is safe.`
                                            : `You're below the 70% completion threshold to maintain your streak. You have until midnight to finish more tasks or use a streak freeze.`}
                                </p>
                            </div>

                            <button
                                onClick={() => allDone ? handleSubmit() : setStep(2)}
                                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${allDone ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                {allDone ? "Awesome, log it!" : "Continue"} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: The Reflection (Only if not perfect) */}
                    {step === 2 && !allDone && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">What happened today?</h3>
                                <p className="text-sm text-slate-500 mb-6">Honesty helps us build a better schedule for tomorrow. No judgment.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'busy', label: 'Busy with work or family' },
                                    { id: 'tired', label: 'Felt tired or unwell' },
                                    { id: 'hard_topics', label: 'Topics felt too hard' },
                                    { id: 'unmotivated', label: 'Was not feeling motivated' },
                                    { id: 'distracted', label: 'Got distracted frequently' },
                                    { id: 'ran_out_of_time', label: 'Ran out of time' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setReason(opt.id)}
                                        className={`text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${reason === opt.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {opt.label}
                                            {reason === opt.id && <Check className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!reason || isSubmitting}
                                    className={`flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50`}
                                >
                                    {isSubmitting ? 'Logging...' : 'Log Check-In'} <Award className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
