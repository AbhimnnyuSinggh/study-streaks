'use client';

import { useState } from 'react';
import { CalendarClock, CheckCircle, ChevronRight, X } from 'lucide-react';

export default function RevisionRemindersClient({ dueRevisions }: { dueRevisions: any[] }) {
    const [revisions, setRevisions] = useState(dueRevisions);
    const [activeRevision, setActiveRevision] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (revisions.length === 0) return null;

    const handleSnooze = async (topicName: string, examId: string) => {
        // Optimistic UI update
        setRevisions(prev => prev.filter(r => r.topic_name !== topicName));
        try {
            // Ideally we'd hit an API to push the date back by 1-2 days
            await fetch('/api/progress/confidence', {
                method: 'POST',
                body: JSON.stringify({
                    topicName,
                    confidenceLevel: 'low', // Pushing back implies they need more time or it resets to 'low' interval
                    examId
                })
            });
        } catch (e) {
            console.error(e);
        }
    }

    const handleRatingSubmit = async (level: string) => {
        if (!activeRevision) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/progress/confidence', {
                method: 'POST',
                body: JSON.stringify({
                    topicName: activeRevision.topic_name,
                    confidenceLevel: level,
                    examId: activeRevision.exam_id
                })
            });
            if (res.ok) {
                setRevisions(prev => prev.filter(r => r.topic_name !== activeRevision.topic_name));
            }
        } catch (e) {
            console.error(e);
        }
        setIsSubmitting(false);
        setActiveRevision(null);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <CalendarClock className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CalendarClock className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-black">Spaced Repetition Due</h2>
                    <p className="text-indigo-100 text-sm font-medium">Review these to lock them into long-term memory.</p>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {revisions.slice(0, 3).map((rev, idx) => (
                    <div key={idx} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/20 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
                        <div>
                            <h3 className="font-bold text-lg">{rev.topic_name}</h3>
                            <div className="flex gap-3 text-xs text-indigo-100 mt-1">
                                <span className="uppercase font-bold tracking-wider">Cycle {rev.current_revision_cycle}</span>
                                <span>• Last rated: {rev.confidence_level}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleSnooze(rev.topic_name, rev.exam_id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-indigo-100 hover:text-white" title="Snooze 1 day">
                                <X className="w-5 h-5" />
                            </button>
                            <button onClick={() => setActiveRevision(rev)} className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all text-sm flex items-center gap-1">
                                Review <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {revisions.length > 3 && (
                    <div className="text-center text-sm font-bold text-indigo-200 pt-2">
                        + {revisions.length - 3} more pending reviews
                    </div>
                )}
            </div>

            {/* Same rating modal logic re-used from Syllabus for immediate friction-free rating */}
            {activeRevision && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center text-slate-800">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Review Complete!</h2>
                        <p className="text-slate-500 font-medium mb-8">You reviewed <strong className="text-slate-700">{activeRevision.topic_name}</strong>. How confident do you feel now?</p>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            <button disabled={isSubmitting} onClick={() => handleRatingSubmit('mastered')} className="p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-indigo-900 text-left flex justify-between group transition-all">
                                <span>🔥 Mastered it</span> <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmitting} onClick={() => handleRatingSubmit('high')} className="p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 font-bold text-emerald-900 text-left flex justify-between group transition-all">
                                <span>💪 High confidence</span> <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmitting} onClick={() => handleRatingSubmit('medium')} className="p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 hover:bg-amber-50 font-bold text-amber-900 text-left flex justify-between group transition-all">
                                <span>😊 Getting there</span> <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmitting} onClick={() => handleRatingSubmit('low')} className="p-4 rounded-xl border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 font-bold text-rose-900 text-left flex justify-between group transition-all">
                                <span>😫 Still struggling</span> <span className="text-rose-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                        <button onClick={() => setActiveRevision(null)} className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider">Cancel Review</button>
                    </div>
                </div>
            )}
        </div>
    );
}
