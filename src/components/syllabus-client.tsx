'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock, BookOpen, Clock, PlusCircle, CheckCircle } from 'lucide-react';

export default function SyllabusClient({ syllabusData, topicProgress, targetExamId }: { syllabusData: any[], topicProgress: any[], targetExamId: string }) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

    // Confidence Modal State
    const [activeTopicForRating, setActiveTopicForRating] = useState<string | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    // Custom Topics/Subtopics State
    const [addingSubtopicTo, setAddingSubtopicTo] = useState<string | null>(null);
    const [newSubtopicName, setNewSubtopicName] = useState('');

    const [addingTopicToSection, setAddingTopicToSection] = useState<string | null>(null);
    const [newTopicName, setNewTopicName] = useState('');

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
    };

    const toggleTopic = (topicName: string) => {
        setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
    };

    const getProgress = (topicName: string) => {
        return topicProgress.find(t => t.topic_name === topicName) || null;
    };

    const handleRatingSubmit = async (level: string) => {
        if (!activeTopicForRating) return;
        setIsSubmittingRating(true);
        // Use the passed down targetExamId instead of relying on the progress array which could be empty
        const examId = targetExamId;

        try {
            const res = await fetch('/api/progress/confidence', {
                method: 'POST',
                body: JSON.stringify({
                    topicName: activeTopicForRating,
                    confidenceLevel: level,
                    examId: examId
                })
            });
            if (res.ok) {
                // In a prod app we'd optimally mutate the local cache right here to update the UI instantly
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
        setIsSubmittingRating(false);
        setActiveTopicForRating(null);
    };

    const handleAddSubtopic = async (topicName: string) => {
        if (!newSubtopicName.trim()) return;

        try {
            const res = await fetch('/api/progress/add-subtopic', {
                method: 'POST',
                body: JSON.stringify({
                    topicName,
                    subtopicName: newSubtopicName,
                    examId: targetExamId
                })
            });
            if (res.ok) {
                setNewSubtopicName('');
                setAddingSubtopicTo(null);
                window.location.reload();
            } else {
                console.error("Failed to add subtopic");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddTopic = async (sectionName: string) => {
        if (!newTopicName.trim()) return;

        try {
            const res = await fetch('/api/progress/add-topic', {
                method: 'POST',
                body: JSON.stringify({
                    sectionName,
                    topicName: newTopicName,
                    examId: targetExamId
                })
            });
            if (res.ok) {
                setNewTopicName('');
                setAddingTopicToSection(null);
                window.location.reload();
            } else {
                console.error("Failed to add topic");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getPrereqsMissing = (topic: any) => {
        if (!topic.prerequisites) return [];
        return topic.prerequisites.filter((req: string) => {
            const prog = getProgress(req);
            return !prog || prog.confidence_level === 'low' || !prog.is_completed;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Your Complete Syllabus</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Master every node to guarantee your success.</p>
                </div>
            </div>

            {activeTopicForRating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Topic Completed!</h2>
                        <p className="text-slate-500 font-medium mb-8">You finished <strong className="text-slate-700">{activeTopicForRating}</strong>. How confident do you feel about this material?</p>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            <button disabled={isSubmittingRating} onClick={() => handleRatingSubmit('mastered')} className="p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-indigo-900 text-left flex justify-between group transition-all">
                                <span>🔥 Mastered it</span> <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmittingRating} onClick={() => handleRatingSubmit('high')} className="p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 font-bold text-emerald-900 text-left flex justify-between group transition-all">
                                <span>💪 High confidence</span> <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmittingRating} onClick={() => handleRatingSubmit('medium')} className="p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 hover:bg-amber-50 font-bold text-amber-900 text-left flex justify-between group transition-all">
                                <span>😊 Getting there</span> <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button disabled={isSubmittingRating} onClick={() => handleRatingSubmit('low')} className="p-4 rounded-xl border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 font-bold text-rose-900 text-left flex justify-between group transition-all">
                                <span>😫 Still struggling</span> <span className="text-rose-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {syllabusData.map((section: any, sIdx: number) => {
                const isSectionExpanded = expandedSections[section.name] !== false;

                const baseSectionTopics = section.topics || [];
                const customSectionTopics = topicProgress
                    .filter((t: any) => t.custom_section_name === section.name)
                    .map((t: any) => ({ name: t.topic_name, hours: 1, subtopics: [] }));

                const sectionTopics = [...baseSectionTopics, ...customSectionTopics];
                const completedCount = sectionTopics.filter((t: any) => getProgress(t.name)?.is_completed).length;
                const sectionProgress = sectionTopics.length > 0 ? Math.round((completedCount / sectionTopics.length) * 100) : 0;

                return (
                    <div key={sIdx} className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm transition-all hover:border-slate-300">
                        <div onClick={() => toggleSection(section.name)} className="p-5 flex items-center justify-between cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-slate-400">
                                    {isSectionExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" /> {section.name}
                                        <span className="text-xs text-slate-400 font-medium">({section.weightage}% weightage)</span>
                                    </h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${sectionProgress}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{sectionProgress}% ({completedCount}/{sectionTopics.length} topics)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isSectionExpanded && (
                            <div className="border-t border-slate-100 divide-y divide-slate-100">
                                {sectionTopics.map((topic: any, tIdx: number) => {
                                    const isTopicExpanded = expandedTopics[topic.name];
                                    const progress = getProgress(topic.name);
                                    const isCompleted = progress?.is_completed;
                                    const missingPrereqs = getPrereqsMissing(topic);
                                    const baseSubtopics = topic.subtopics || [];
                                    const customSubtopics = progress?.custom_subtopics || [];
                                    const subtopics = [...baseSubtopics, ...customSubtopics];
                                    const completedSubtopics = progress?.completed_subtopics || [];

                                    let statusColor = "bg-slate-50 border-slate-200 text-slate-700";
                                    let statusDot = "border-slate-300";
                                    let statusText = "Not Started";

                                    if (isCompleted) {
                                        statusColor = "bg-emerald-50 border-emerald-200 text-emerald-800";
                                        statusDot = "bg-emerald-500 border-emerald-500";
                                        statusText = "Completed";
                                    } else if (completedSubtopics.length > 0) {
                                        statusColor = "bg-amber-50 border-amber-200 text-amber-800";
                                        statusDot = "bg-amber-500 border-amber-500";
                                        statusText = "In Progress";
                                    }

                                    return (
                                        <div key={tIdx} className="flex flex-col">
                                            <div onClick={() => toggleTopic(topic.name)} className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${statusDot}`}>
                                                        {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold ${isCompleted ? 'text-slate-600' : 'text-slate-800'}`}>{topic.name}</h3>
                                                        <div className="flex gap-3 text-xs text-slate-500 mt-1 font-medium">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>{statusText}</span>
                                                    <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform ${isTopicExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>

                                            {isTopicExpanded && (
                                                <div className="pl-14 pr-6 pb-5 pt-2 bg-slate-50/50 border-b border-slate-100">
                                                    {missingPrereqs.length > 0 && (
                                                        <div className="mb-4 bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-200 text-sm flex gap-2 items-start">
                                                            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                            <div>
                                                                <span className="font-bold">Recommended Prerequisites:</span> You haven't mastered {missingPrereqs.join(', ')} yet.
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Subtopics to Complete</h4>
                                                        {subtopics.map((sub: any, subIdx: number) => {
                                                            const isSubDone = completedSubtopics.includes(sub.name);
                                                            return (
                                                                <div key={subIdx} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                                                    <button className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSubDone ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                                                        {isSubDone && <CheckCircle className="w-3 h-3 text-white" />}
                                                                    </button>
                                                                    <span className={`text-sm font-medium ${isSubDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                                        {sub.name}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}

                                                        {subtopics.length === 0 && (
                                                            <div className="text-sm text-slate-500 italic p-2">This topic has no defined subtopics yet.</div>
                                                        )}

                                                        {addingSubtopicTo === topic.name ? (
                                                            <div className="flex items-center gap-2 mt-2 bg-white rounded-lg p-1 border border-indigo-200 shadow-sm">
                                                                <input
                                                                    autoFocus
                                                                    type="text"
                                                                    value={newSubtopicName}
                                                                    onChange={e => setNewSubtopicName(e.target.value)}
                                                                    className="flex-1 bg-transparent text-sm p-2 outline-none"
                                                                    placeholder="e.g., Practicing Advanced Mock Test 04..."
                                                                    onKeyDown={e => e.key === 'Enter' && handleAddSubtopic(topic.name)}
                                                                />
                                                                <button onClick={() => setAddingSubtopicTo(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">✕</button>
                                                                <button onClick={() => handleAddSubtopic(topic.name)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-bold shadow-sm transition-colors">Add</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setAddingSubtopicTo(topic.name)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 p-2 mt-2 transition-colors">
                                                                <PlusCircle className="w-4 h-4" /> Add custom subtopic
                                                            </button>
                                                        )}
                                                    </div>

                                                    {!isCompleted && (
                                                        <button
                                                            onClick={() => setActiveTopicForRating(topic.name)}
                                                            className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                                                        >
                                                            Mark Topic Complete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="p-4 bg-slate-50/50 flex justify-center border-t border-dashed border-slate-200">
                                    {addingTopicToSection === section.name ? (
                                        <div className="w-full max-w-sm flex items-center gap-2 bg-white rounded-xl p-1.5 border-2 border-indigo-200 shadow-md">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={newTopicName}
                                                onChange={e => setNewTopicName(e.target.value)}
                                                className="flex-1 bg-transparent text-sm font-medium p-2 outline-none text-slate-800"
                                                placeholder="Enter new custom topic name..."
                                                onKeyDown={e => e.key === 'Enter' && handleAddTopic(section.name)}
                                            />
                                            <button onClick={() => setAddingTopicToSection(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">✕</button>
                                            <button onClick={() => handleAddTopic(section.name)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors block shrink-0">Add Topic</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAddingTopicToSection(section.name)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                                            <PlusCircle className="w-4 h-4" /> Add custom topic to {section.name}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
