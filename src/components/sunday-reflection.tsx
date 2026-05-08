'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, TrendingUp, Calendar, AlertCircle, ArrowRight, X, ShieldCheck } from 'lucide-react';

type SundayProps = {
    userId: string;
    weeklyData: any[]; // The last 7 plans
    hasReflectedThisWeek?: boolean;
};

export default function SundayReflection({ userId, weeklyData, hasReflectedThisWeek }: SundayProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState<number>(0);
    const [obstacle, setObstacle] = useState<string | null>(null);
    const [plan, setPlan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-trigger on Sunday if not already reflected
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const lastSunday = new Date(now.setDate(now.getDate() - now.getDay()));
            const sundayKey = lastSunday.toLocaleDateString('en-CA');

            // 0 = Sunday
            if (new Date().getDay() === 0 && !hasReflectedThisWeek && !localStorage.getItem(`sunday_reflected_${sundayKey}`)) {
                setIsOpen(true);
            }
        };

        checkTime();
    }, [hasReflectedThisWeek]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await fetch('/api/study/weekly-reflection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, obstacle, plan, weekData: weeklyData })
            });

            const now = new Date();
            const sundayKey = new Date(now.setDate(now.getDate() - now.getDay())).toLocaleDateString('en-CA');
            localStorage.setItem(`sunday_reflected_${sundayKey}`, 'true');

            setStep(4); // Move to final report screen
        } catch (error) {
            console.error("Failed to submit reflection", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Calculate actual performance for the report
    const tasksTotal = weeklyData.reduce((acc, curr) => acc + (curr.total_tasks || 0), 0);
    const tasksCompleted = weeklyData.reduce((acc, curr) => acc + (curr.completed_tasks || 0), 0);
    const actualPercentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    // Map objective completion to 1-5 scale for psychological comparison
    let objectiveRating = 1;
    if (actualPercentage >= 90) objectiveRating = 5;
    else if (actualPercentage >= 70) objectiveRating = 4;
    else if (actualPercentage >= 50) objectiveRating = 3;
    else if (actualPercentage >= 30) objectiveRating = 2;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    {step === 4 && (
                        <button onClick={() => { setIsOpen(false); router.refresh(); }} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <Calendar className="w-7 h-7 text-indigo-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-1">Weekly Reflection</h2>
                            <p className="text-white/70 font-medium text-sm">Sunday check-in for Aspirants</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Step 1: Subjective Rating */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8">
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-black text-slate-900">How was your week?</h3>
                                <p className="text-slate-500 font-medium">Be honest. Rate your consistency over the last 7 days.</p>
                            </div>

                            <div className="flex justify-center gap-2 sm:gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`p-3 sm:p-4 rounded-2xl transition-all ${rating >= star ? 'bg-amber-100 text-amber-500 scale-110 shadow-sm' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                                    >
                                        <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${rating >= star ? 'fill-amber-500' : ''}`} />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={rating === 0}
                                className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 mt-8"
                            >
                                Next <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Obstacle Identification */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">What was your biggest obstacle?</h3>
                                <p className="text-sm text-slate-500 mb-6">Identifying the pattern is the first step to beating it.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'time', label: 'Time management' },
                                    { id: 'motivation', label: 'Motivation / procrastination' },
                                    { id: 'difficulty', label: 'Topics were too difficult' },
                                    { id: 'distractions', label: 'Constant distractions (phone, etc)' },
                                    { id: 'burnout', label: 'Energy / health / burnout' },
                                    { id: 'none', label: 'Actually, it was a great week! 🎉' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setObstacle(opt.id)}
                                        className={`text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${obstacle === opt.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-indigo-200 text-slate-700'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Back</button>
                                <button onClick={() => setStep(3)} disabled={!obstacle} className="flex-1 font-bold py-4 rounded-xl flex items-center justify-center transition-all bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Actionable Intent */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">One thing for next week</h3>
                                <p className="text-sm text-slate-500 mb-6">What is ONE tiny change you will make next week to improve?</p>
                            </div>

                            <textarea
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                placeholder="e.g. Leave my phone in the other room during the first hour of study..."
                                className="w-full h-32 p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none resize-none"
                            />

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Back</button>
                                <button disabled={isSubmitting} onClick={handleSubmit} className="flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-70 shadow-md">
                                    {isSubmitting ? 'Analyzing...' : 'View My Report'} <TrendingUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: The Mirror (Data Analysis) */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-8">
                            <div className="text-center pb-4 border-b border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your Objective Reality</h3>
                                <div className="text-4xl font-black text-slate-900">{actualPercentage}%</div>
                                <div className="text-sm text-slate-500 font-medium">Task Completion Rate</div>
                            </div>

                            {/* The Psychological Calibration */}
                            <div className={`p-5 rounded-2xl border-2 ${rating < objectiveRating ? 'bg-blue-50 border-blue-200 text-blue-900' : rating > objectiveRating ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                                <div className="flex items-start gap-3">
                                    {rating < objectiveRating ? <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" /> : rating > objectiveRating ? <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" /> : <Star className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />}

                                    <div>
                                        <h4 className="font-bold mb-1">
                                            {rating < objectiveRating ? 'You are being too hard on yourself' : rating > objectiveRating ? 'Your plan is too ambitious' : 'Accurate Self-Assessment'}
                                        </h4>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            {rating < objectiveRating
                                                ? `You rated your week ${rating} stars, but your data shows a ${actualPercentage}% completion rate (equivalent to a ${objectiveRating}-star performance). Progress isn't always visible in the moment. The numbers don't lie — you're doing better than you feel.`
                                                : rating > objectiveRating
                                                    ? `You felt great about this week (${rating} stars!), but your completion was only ${actualPercentage}%. A plan you can complete feels better. Let's slightly reduce tomorrow's load so you can hit 100%.`
                                                    : `You rated yourself ${rating} stars, which perfectly matches your data. You have a great handle on your pacing and capability. Let's attack next week.`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-2xl font-black text-slate-800">{tasksCompleted}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Tasks Done</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-2xl font-black text-slate-800">{weeklyData.length}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Days Active</div>
                                </div>
                            </div>

                            <button onClick={() => { setIsOpen(false); router.refresh(); }} className="w-full font-bold py-4 rounded-xl flex items-center justify-center transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                Acknowledge & Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
