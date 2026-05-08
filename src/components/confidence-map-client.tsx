'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function ConfidenceMapClient({ topics }: { topics: any[] }) {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch('/api/progress/suggestions');
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.suggestions || []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        if (topics.length > 0) {
            fetchSuggestions();
        }
    }, [topics.length]);

    const mastered = topics.filter(t => t.confidence_level === 'mastered');
    const high = topics.filter(t => t.confidence_level === 'high');
    const medium = topics.filter(t => t.confidence_level === 'medium');
    const low = topics.filter(t => t.confidence_level === 'low');

    const totalRated = topics.length;

    const sections = [
        {
            id: 'mastered',
            title: '🔥 Mastered',
            data: mastered,
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-100',
            ring: 'ring-emerald-50',
            borderActive: 'border-emerald-500',
            textStrong: 'text-emerald-600',
            desc: 'Secure. Ready for the exam.'
        },
        {
            id: 'high',
            title: '💪 High Confidence',
            data: high,
            bg: 'bg-indigo-50',
            text: 'text-indigo-700',
            border: 'border-indigo-100',
            ring: 'ring-indigo-50',
            borderActive: 'border-indigo-500',
            textStrong: 'text-indigo-600',
            desc: 'Solid grasp. Keep reviewing.'
        },
        {
            id: 'medium',
            title: '😊 Getting There',
            data: medium,
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-100',
            ring: 'ring-amber-50',
            borderActive: 'border-amber-500',
            textStrong: 'text-amber-600',
            desc: 'Needs practice and active recall.'
        },
        {
            id: 'low',
            title: '😫 Still Struggling',
            data: low,
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            border: 'border-rose-100',
            ring: 'ring-rose-50',
            borderActive: 'border-rose-500',
            textStrong: 'text-rose-600',
            desc: 'Your biggest ROI opportunities.'
        }
    ];

    if (totalRated === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                    <BrainCircuit className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No data yet</h3>
                <p className="text-slate-500 max-w-sm mb-8">Complete topics from your Syllabus to populate your Confidence Map and unlock smart suggestions.</p>
                <Link href="/dashboard/syllabus" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                    Go to Syllabus
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link href="/progress" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Progress
            </Link>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sections.map(s => {
                    const percentage = Math.round((s.data.length / totalRated) * 100) || 0;
                    const isActive = selectedTier === s.id;
                    const actCls = isActive ? s.borderActive + " shadow-md ring-4 " + s.ring : "border-slate-100 hover:border-slate-300 shadow-sm";

                    return (
                        <div
                            key={s.id}
                            onClick={() => setSelectedTier(isActive ? null : s.id)}
                            className={"cursor-pointer bg-white rounded-2xl p-5 border-2 transition-all " + actCls}
                        >
                            <div className="text-4xl font-black mb-1">{s.data.length}</div>
                            <div className={"text-sm font-bold " + s.textStrong}>{s.title}</div>
                            <div className="text-xs font-medium text-slate-400 mt-1">{percentage}% of syllabus</div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">
                            {selectedTier ? sections.find(s => s.id === selectedTier)?.title + ' Topics' : 'All Rated Topics'}
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">
                            {selectedTier ? sections.find(s => s.id === selectedTier)?.desc : 'Select a bucket above to filter.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {sections.map(s => {
                        if (selectedTier !== null && selectedTier !== s.id) return null;

                        return s.data.map((topic, i) => (
                            <span
                                key={s.id + "-" + i}
                                className={"px-3 py-1.5 rounded-lg text-sm font-bold border " + s.bg + " " + s.text + " " + s.border}
                            >
                                {topic.topic_name}
                            </span>
                        ));
                    })}
                </div>
            </div>

            {/* Smart Suggestions Engine Widget based on Map State */}
            {suggestions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800">Smart Action Plan</h3>
                    {suggestions.map((s, idx) => (
                        <div key={idx} className={`rounded-3xl p-8 border relative overflow-hidden ${s.type === 'critical' ? 'bg-rose-50 text-rose-900 border-rose-100' :
                                s.type === 'opportunity' ? 'bg-amber-50 text-amber-900 border-amber-100' : 'bg-emerald-50 text-emerald-900 border-emerald-100'
                            }`}>
                            <div className="relative z-10">
                                <h4 className="text-lg font-black mb-2">{s.title}</h4>
                                <p className="font-medium opacity-80 mb-6 max-w-xl">{s.description}</p>
                                <button className={`px-5 py-2.5 font-bold rounded-xl transition-all shadow-sm active:scale-95 ${s.type === 'critical' ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' :
                                        s.type === 'opportunity' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                    }`}>
                                    {s.actionText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
