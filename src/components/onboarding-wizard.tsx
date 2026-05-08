'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, ChevronRight, GraduationCap, Flame, ArrowRight, Loader2 } from 'lucide-react';

type WizardProps = {
    userId: string;
    userName: string;
    userEmail: string;
    initialExams: any[];
};

export default function OnboardingWizard({ userId, userName, userEmail, initialExams }: WizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [examId, setExamId] = useState('');
    const [examDate, setExamDate] = useState('');
    const [unknownDate, setUnknownDate] = useState(false);
    const [availableHours, setAvailableHours] = useState('3');
    const [studyDays, setStudyDays] = useState(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    const [preferredTime, setPreferredTime] = useState('mixed');
    const [sectionLevels, setSectionLevels] = useState<Record<string, string>>({});
    const [hasAppeared, setHasAppeared] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [isWorking, setIsWorking] = useState('');
    const [workHours, setWorkHours] = useState('8');
    const [resourceType, setResourceType] = useState('mix');
    const [resources, setResources] = useState<Record<string, string>>({});
    const [motivation, setMotivation] = useState('');
    const [wantsPod, setWantsPod] = useState('');
    const [targetTier, setTargetTier] = useState('');

    const totalSteps = 11;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const selectedExamData = initialExams.find(e => e.id === examId);

    const handleSubmit = async () => {
        setLoading(true);

        // Simulate deliberate loading delay for perceived value
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        // Calculate generic exam date if unknown (6 months from now)
        let finalDate = examDate;
        if (unknownDate || !examDate) {
            const d = new Date();
            d.setMonth(d.getMonth() + 6);
            finalDate = d.toISOString().split('T')[0];
        }

        try {
            // 1. Update User Profile
            const { error: upsertErr } = await supabase.from('users').upsert({
                id: userId,
                name: userName,
                email: userEmail,
                exam_id: examId,
                exam_date: finalDate,
                available_hours: parseFloat(availableHours),
                study_days: studyDays,
                preferred_time: preferredTime,
                is_working_professional: isWorking === 'yes',
                work_hours: isWorking === 'yes' ? parseFloat(workHours) : 0,
                has_appeared_before: hasAppeared.startsWith('yes'),
                attempt_count: hasAppeared === 'yes_3' ? 3 : (hasAppeared === 'yes_1' ? 1 : 0),
                motivation_reason: motivation,
                preparation_source: resourceType,
                wants_pod: wantsPod === 'yes',
                onboarding_completed: true,
                plan_generated_at: new Date().toISOString()
            });

            if (upsertErr) {
                console.error("UPSERT ERR:", upsertErr);
                throw new Error(upsertErr.message);
            }

            // 2. Insert Section Levels
            if (selectedExamData?.sections) {
                const levelsToInsert = selectedExamData.sections.map((s: any) => ({
                    user_id: userId,
                    section_name: s.name,
                    level: sectionLevels[s.name] || 'not_started'
                }));
                await supabase.from('user_section_levels').insert(levelsToInsert);

                // 3. Insert Resources
                const resourcesToInsert = selectedExamData.sections.map((s: any) => {
                    // Basic heuristic for resource type if free text
                    const text = (resources[s.name] || '').toLowerCase();
                    let rType = 'other';
                    if (text.includes('youtube')) rType = 'youtube';
                    else if (text.includes('course') || text.includes('testbook') || text.includes('unacademy')) rType = 'paid_course';
                    else if (text.includes('book')) rType = 'book';

                    return {
                        user_id: userId,
                        section_name: s.name,
                        resource_name: resources[s.name] || 'Self Study',
                        resource_type: rType,
                        is_primary: true
                    };
                });
                await supabase.from('user_resources').insert(resourcesToInsert);
            }

            // Generate Plan Mode 1 (API call to backend algorithm or mock for now)
            // Since this is MVP sprint 2, we will call an empty generation logic that we'll flesh out next
            await fetch('/api/plan/generate', { method: 'POST' });

            await delay(2000); // UI Polish for "Analyzing syllabus..."
            router.push('/dashboard');
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-primary text-primary-foreground space-y-8 p-6 text-center">
                <Loader2 className="h-16 w-16 animate-spin" />
                <h2 className="text-3xl font-bold">Analyzing your exam syllabus...</h2>
                <p className="text-emerald-100 max-w-sm animate-pulse">
                    Calculating topic priorities and building your personalized revision schedule.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center pt-8 sm:pt-16 pb-12 px-4 w-full">
            {/* ProgressBar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
                    <span>Question {step} of {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-10 border relative overflow-hidden">

                {/* Step 1: Exam */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Which exam are you preparing for?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {initialExams.map((exam) => (
                                <button
                                    key={exam.id}
                                    onClick={() => { setExamId(exam.id); setTimeout(nextStep, 200); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary ${examId === exam.id ? 'border-primary bg-emerald-50' : 'border-gray-100 bg-white'}`}
                                >
                                    <div className="font-bold text-lg">{exam.name}</div>
                                    <div className="text-sm text-gray-500">{exam.category}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Tier */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Which stage are you targeting right now?</h2>
                        <div className="grid gap-4">
                            {[
                                { id: 'prelims', label: 'Prelims Only', desc: 'Focus strictly on the preliminary syllabus.' },
                                { id: 'mains', label: 'Mains Only', desc: 'Deep dive into advanced topics and mains-specific sections.' },
                                { id: 'both', label: 'Both / Comprehensive', desc: 'I want a combined plan covering everything from scratch.' }
                            ].map((tier) => (
                                <button
                                    key={tier.id}
                                    onClick={() => { setTargetTier(tier.id); setTimeout(nextStep, 200); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary ${targetTier === tier.id ? 'border-primary bg-emerald-50' : 'border-gray-100 bg-white'}`}
                                >
                                    <div className="font-bold text-lg">{tier.label}</div>
                                    <div className="text-sm text-gray-500">{tier.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Date */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When is your target exam date?</h2>
                        <div className="space-y-4">
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => { setExamDate(e.target.value); setUnknownDate(false); }}
                                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                disabled={unknownDate}
                            />

                            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-primary rounded"
                                    checked={unknownDate}
                                    onChange={(e) => {
                                        setUnknownDate(e.target.checked);
                                        if (e.target.checked) setExamDate('');
                                    }}
                                />
                                <span className="font-medium">I don't know yet / Just started</span>
                            </label>
                        </div>
                        <button
                            disabled={!examDate && !unknownDate}
                            onClick={nextStep}
                            className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-50 mt-4 flex justify-between items-center"
                        >
                            Continue <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 4: Hours */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How many hours per day can you REALISTICALLY study?</h2>
                        <p className="text-gray-500">Be honest! An over-ambitious plan is worse than no plan.</p>

                        <div className="pt-8 pb-4">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={availableHours}
                                onChange={(e) => setAvailableHours(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="text-center mt-6">
                                <span className="text-4xl font-black text-primary">{availableHours}</span>
                                <span className="text-xl font-medium text-gray-500 ml-2">hours / day</span>
                            </div>
                        </div>

                        <button onClick={nextStep} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4 transition-colors">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 5: Days */}
                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What days do you study?</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { id: 'mon', label: 'Monday' }, { id: 'tue', label: 'Tuesday' },
                                { id: 'wed', label: 'Wednesday' }, { id: 'thu', label: 'Thursday' },
                                { id: 'fri', label: 'Friday' }, { id: 'sat', label: 'Saturday' },
                                { id: 'sun', label: 'Sunday' }
                            ].map((day) => (
                                <button
                                    key={day.id}
                                    onClick={() => {
                                        if (studyDays.includes(day.id)) {
                                            setStudyDays(studyDays.filter(d => d !== day.id));
                                        } else {
                                            setStudyDays([...studyDays, day.id]);
                                        }
                                    }}
                                    className={`p-3 rounded-lg border font-medium transition-all ${studyDays.includes(day.id) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>

                        <button onClick={nextStep} disabled={studyDays.length === 0} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4 disabled:opacity-50">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 6: Time of Day */}
                {step === 6 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When do you prefer to study?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'morning', icon: '☀️', label: 'Morning', sub: '5 AM - 12 PM' },
                                { id: 'afternoon', icon: '🌤️', label: 'Afternoon', sub: '12 PM - 6 PM' },
                                { id: 'evening', icon: '🌙', label: 'Evening', sub: '6 PM - 11 PM' },
                                { id: 'mixed', icon: '🔄', label: 'Mixed / Varies', sub: 'Schedule changes' }
                            ].map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => { setPreferredTime(slot.id); setTimeout(nextStep, 200); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary flex items-center gap-4 ${preferredTime === slot.id ? 'border-primary bg-emerald-50' : 'border-gray-100 bg-white'}`}
                                >
                                    <span className="text-3xl">{slot.icon}</span>
                                    <div>
                                        <div className="font-bold text-lg">{slot.label}</div>
                                        <div className="text-sm text-gray-500">{slot.sub}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 7: Level Rating */}
                {step === 7 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Rate your current level</h2>
                        <p className="text-gray-500">We'll allocate more hours to your weak areas.</p>

                        <div className="space-y-6">
                            {selectedExamData?.sections?.map((section: any) => (
                                <div key={section.name} className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-bold mb-3">{section.name}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {[
                                            { id: 'not_started', label: '🔴 Not Started' },
                                            { id: 'basics_done', label: '🟡 Basics Done' },
                                            { id: 'moderate', label: '🟢 Moderate' },
                                            { id: 'strong', label: '💪 Strong' },
                                        ].map(lvl => (
                                            <button
                                                key={lvl.id}
                                                onClick={() => setSectionLevels({ ...sectionLevels, [section.name]: lvl.id })}
                                                className={`p-2 text-sm rounded-lg border font-medium transition-colors ${sectionLevels[section.name] === lvl.id ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white hover:border-primary'}`}
                                            >
                                                {lvl.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={nextStep} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 8: Appeared Before */}
                {step === 8 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Have you appeared for this exam before?</h2>
                        <div className="space-y-4">
                            {[
                                { id: 'no', label: 'No — First attempt' },
                                { id: 'yes_1', label: 'Yes — 1-2 times' },
                                { id: 'yes_3', label: 'Yes — 3+ times (serious re-attempter)' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => { setHasAppeared(opt.id); setTimeout(nextStep, 200); }}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all hover:border-primary ${hasAppeared === opt.id ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-100 bg-white'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 9: Working Professional */}
                {step === 9 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Are you a working professional?</h2>
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setIsWorking('no')}
                                className={`flex-1 p-4 rounded-xl border-2 font-medium transition-all ${isWorking === 'no' ? 'border-primary bg-emerald-50' : 'border-gray-100 hover:border-primary'}`}
                            >
                                No — Full-time preparation
                            </button>
                            <button
                                onClick={() => setIsWorking('yes')}
                                className={`flex-1 p-4 rounded-xl border-2 font-medium transition-all ${isWorking === 'yes' ? 'border-primary bg-emerald-50' : 'border-gray-100 hover:border-primary'}`}
                            >
                                Yes — Working simultaneously
                            </button>
                        </div>

                        {isWorking === 'yes' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 p-4 bg-gray-50 rounded-xl space-y-4">
                                <label className="font-medium text-gray-700 block">How many hours does your job take daily?</label>
                                <input
                                    type="range" min="4" max="14" step="1"
                                    value={workHours} onChange={(e) => setWorkHours(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="text-center font-bold text-xl text-primary">{workHours} hours</div>
                            </div>
                        )}

                        <button onClick={nextStep} disabled={!isWorking} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4 disabled:opacity-50">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 10: Resources */}
                {step === 10 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What are your study sources?</h2>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="font-bold mb-2 block">Resource Type</label>
                            <select className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary" value={resourceType} onChange={e => setResourceType(e.target.value)}>
                                <option value="mix">Mix of both</option>
                                <option value="free">Free (YouTube, PDFs)</option>
                                <option value="paid">Paid courses (Testbook, Adda247, etc.)</option>
                            </select>
                        </div>

                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                            {selectedExamData?.sections?.map((section: any) => (
                                <div key={section.name}>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">For <span className="font-bold text-primary">{section.name}</span>, who/what do you study from?</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Rakesh Yadav, YouTube channel, Book Name"
                                        value={resources[section.name] || ''}
                                        onChange={e => setResources({ ...resources, [section.name]: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            ))}
                        </div>

                        <button onClick={nextStep} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 11: Motivation */}
                {step === 11 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why are you preparing for this exam?</h2>
                        <p className="text-gray-500">Pick your core motivation. We'll remind you when things get tough. 💪</p>

                        <div className="space-y-3">
                            {[
                                "I want to make my family proud",
                                "I want financial independence & stability",
                                "I want to serve my country",
                                "I want to prove myself",
                                "I promised someone I'd clear this exam",
                                "This is my dream since childhood"
                            ].map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => { setMotivation(reason); setTimeout(nextStep, 200); }}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all hover:border-primary ${motivation === reason ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-100 bg-white'}`}
                                >
                                    {reason}
                                </button>
                            ))}

                            <input
                                type="text"
                                placeholder="Or write your own reason..."
                                onFocus={() => { if (![...Array(6)].some((_, i) => motivation === "reason" + i)) setMotivation('') }}
                                value={motivation && ![
                                    "I want to make my family proud",
                                    "I want financial independence & stability",
                                    "I want to serve my country",
                                    "I want to prove myself",
                                    "I promised someone I'd clear this exam",
                                    "This is my dream since childhood"
                                ].includes(motivation) ? motivation : ''}
                                onChange={(e) => setMotivation(e.target.value)}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                            />
                        </div>
                        {motivation && ![
                            "I want to make my family proud",
                            "I want financial independence & stability",
                            "I want to serve my country",
                            "I want to prove myself",
                            "I promised someone I'd clear this exam",
                            "This is my dream since childhood"
                        ].includes(motivation) && (
                                <button onClick={nextStep} className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-4">
                                    Continue
                                </button>
                            )}
                    </div>
                )}

                {/* Step 11: Pods */}
                {step === 11 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Would you like to join an accountability pod?</h2>
                        <p className="text-gray-500 bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm">
                            Pods are groups of 5 aspirants who keep each other accountable. If all 5 complete their daily tasks, the pod streak grows!
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => setWantsPod('yes')}
                                className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 hover:border-primary ${wantsPod === 'yes' ? 'border-primary bg-emerald-50' : 'border-gray-100'}`}
                            >
                                <div className="bg-emerald-100 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-primary" /></div>
                                <div>
                                    <div className="font-bold text-lg">Yes — Match Me</div>
                                    <div className="text-sm text-gray-500">Study with 4 peers for the same exam</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setWantsPod('no')}
                                className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 hover:border-primary ${wantsPod === 'no' ? 'border-primary bg-emerald-50' : 'border-gray-100'}`}
                            >
                                <div className="bg-gray-100 p-2 rounded-full"><ChevronRight className="w-6 h-6 text-gray-500" /></div>
                                <div>
                                    <div className="font-bold text-lg">Not Now</div>
                                    <div className="text-sm text-gray-500">I'll study solo for now (you can join later)</div>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!wantsPod || loading}
                            className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-emerald-600 mt-8 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all flex justify-center items-center"
                        >
                            Generate My Plan 🚀
                        </button>
                    </div>
                )}

            </div>

            {/* Footer Navigation */}
            {step > 1 && !loading && (
                <button onClick={prevStep} className="mt-8 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
                    ← Back to previous question
                </button>
            )}
        </div>
    );
}
