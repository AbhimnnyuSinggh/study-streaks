'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Square, CheckCircle2, ArrowLeft, Settings2, Sparkles, Image as ImageIcon, Flame, Trophy } from 'lucide-react';

const THEMES = [
    { id: 'lofi', name: 'Lo-Fi Glow', class: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x text-white' },
    { id: 'forest', name: 'Forest Retreat', class: 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative' },
    { id: 'deep', name: 'Deep Space', class: 'bg-slate-950 text-indigo-100 relative overflow-hidden' },
    { id: 'sunset', name: 'Golden Sunset', class: 'bg-gradient-to-br from-orange-400 via-rose-400 to-amber-500 text-white' }
];

export default function StudyTimerClient({ task }: { task: any }) {
    const router = useRouter();
    const [theme, setTheme] = useState(THEMES[0]);
    const [showSettings, setShowSettings] = useState(false);

    // Timer State
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [focusMinutes, setFocusMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Stats for logging
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);

    // Post-session view states
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [xpEarnedThisSession, setXpEarnedThisSession] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Watch for mode/settings changes to reset timer if inactive
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
        }
    }, [mode, focusMinutes, breakMinutes, isActive]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                if (mode === 'focus') {
                    setTotalFocusSeconds((prev) => prev + 1);
                }
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Timer Finished Sound Component could go here
            if (mode === 'focus') setMode('break');
            else setMode('focus');
            setIsActive(false);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const handleStop = async (markComplete = false) => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);

        const sessionMinutes = Math.floor(totalFocusSeconds / 60);
        setIsSubmitting(true);

        if (sessionMinutes > 0 || markComplete) {
            try {
                // Log time to API
                const res = await fetch('/api/study/log-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        taskId: task.id,
                        sessionMinutes: sessionMinutes,
                        markComplete
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setXpEarnedThisSession(data.xpEarned + (markComplete ? 50 : 0));
                }
            } catch (error) {
                console.error("Failed to log session", error);
            }
        }

        setIsSubmitting(false);
        setIsSessionComplete(true);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`min-h-screen w-full flex flex-col transition-all duration-1000 selection:bg-white/30 ${theme.class}`}>

            {/* Post-session celebratory View */}
            {isSessionComplete && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="bg-white max-w-lg w-full rounded-3xl p-8 md:p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>

                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl mb-6 relative z-10 animate-bounce">
                            <Flame className="w-12 h-12" />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">Session Logged!</h2>
                        <p className="text-gray-500 font-medium mb-8">Great focus! Consistency is the key to cracking the exam.</p>

                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border">
                                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Time Studied</div>
                                <div className="text-3xl font-black text-indigo-600">{Math.floor(totalFocusSeconds / 60)} <span className="text-lg">min</span></div>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                <div className="text-purple-500 text-sm font-bold uppercase tracking-wider mb-1">XP Earned</div>
                                <div className="text-3xl font-black text-purple-600">+{xpEarnedThisSession}</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => router.push('/leaderboard')}
                                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-indigo-200"
                            >
                                <Trophy className="w-5 h-5" />
                                Check Rank
                            </button>
                            <button
                                onClick={() => { router.push('/dashboard'); router.refresh(); }}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Added decorative background elements for specific themes */}
            {theme.id === 'deep' && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
            )}

            {theme.id === 'forest' && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply"></div>
            )}

            {/* Top Navigation Bar */}
            <nav className="p-6 flex justify-between items-center relative z-10 w-full max-w-6xl mx-auto">
                <button
                    onClick={() => handleStop(false)}
                    className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full transition-colors font-medium backdrop-blur-sm"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all shadow-sm"
                    >
                        <Settings2 className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {showSettings && (
                <div className="absolute top-20 right-6 max-w-xs w-full bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-2"><Settings2 className="w-5 h-5" /> Settings</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium opacity-90 block mb-1">Focus Duration (min)</label>
                            <input type="range" min="5" max="90" step="5" value={focusMinutes} onChange={(e) => setFocusMinutes(Number(e.target.value))} className="w-full accent-white" />
                            <div className="text-right text-xs font-bold">{focusMinutes}m</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium opacity-90 block mb-1">Break Duration (min)</label>
                            <input type="range" min="1" max="30" step="1" value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} className="w-full accent-white" />
                            <div className="text-right text-xs font-bold">{breakMinutes}m</div>
                        </div>

                        <div className="pt-2 border-t border-white/20">
                            <label className="text-sm font-medium opacity-90 block mb-2"><ImageIcon className="w-4 h-4 inline mr-1" /> Theme</label>
                            <div className="grid grid-cols-2 gap-2">
                                {THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t)}
                                        className={`text-xs py-2 rounded-lg font-bold transition-all ${theme.id === t.id ? 'bg-white text-gray-900 border-2 border-white' : 'bg-white/10 border border-white/20 hover:bg-white/20'}`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Timer Area */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">

                {/* Task Info Pill */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3 mb-10 shadow-lg animate-in slide-in-from-bottom-4">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span className="font-medium">Studying: <strong className="font-bold">{task.topic_name}</strong></span>
                </div>

                {/* Mode Selectors */}
                <div className="flex bg-black/20 backdrop-blur-md rounded-full p-1 mb-8 border border-white/10">
                    <button
                        onClick={() => { setMode('focus'); setIsActive(false); }}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'focus' ? 'bg-white text-gray-900 shadow-md' : 'text-white/70 hover:text-white'}`}
                    >
                        Focus Focus
                    </button>
                    <button
                        onClick={() => { setMode('break'); setIsActive(false); }}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'break' ? 'bg-white text-gray-900 shadow-md' : 'text-white/70 hover:text-white'}`}
                    >
                        Short Break
                    </button>
                </div>

                {/* Big Clock */}
                <div className="text-[140px] md:text-[200px] font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl mb-12">
                    {formatTime(timeLeft)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleTimer}
                        className="w-20 h-20 md:w-24 md:h-24 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-white/50"
                    >
                        {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                    </button>

                    <button
                        onClick={() => handleStop(false)}
                        disabled={isSubmitting}
                        className={`w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Stop and Log Time"
                    >
                        {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Square className="w-6 h-6 fill-current" />}
                    </button>
                </div>

                {/* Complete Button */}
                <button
                    onClick={() => handleStop(true)}
                    disabled={isSubmitting}
                    className={`mt-12 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg hover:-translate-y-1 transition-all border border-emerald-400/50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <CheckCircle2 className="w-6 h-6" />}
                    I've Mastered This Topic!
                </button>

            </main>

            {/* Bottom Info Bar */}
            <footer className="p-6 text-center text-white/60 font-medium text-sm z-10">
                You've focused for {Math.floor(totalFocusSeconds / 60)} minutes this session. Keep going!
            </footer>
        </div>
    );
}
