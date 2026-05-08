'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, CheckCircle2, Circle, Clock, Target, ArrowRight, Share } from 'lucide-react';
import Link from 'next/link';

import { Loader2 } from 'lucide-react';
import EveningCheckIn from './evening-checkin';

export default function DashboardClient({
    planId,
    tasks: initialTasks,
    profile,
    dateStr,
    missedTasks,
    hasCheckedIn
}: {
    planId: string;
    tasks: any[];
    profile: any;
    dateStr: string;
    missedTasks?: any[];
    hasCheckedIn?: boolean;
}) {
    const [tasks, setTasks] = useState(initialTasks?.sort((a: any, b: any) => a.task_order - b.task_order) || []);
    const [isAllComplete, setIsAllComplete] = useState(tasks.every(t => t.status === 'completed') && tasks.length > 0);
    const [showCarryover, setShowCarryover] = useState(missedTasks && missedTasks.length > 0);
    const [isCarryingOver, setIsCarryingOver] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    // Custom task states
    const [editingResource, setEditingResource] = useState<string | null>(null);
    const [newResourceName, setNewResourceName] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskData, setNewTaskData] = useState({ topic_name: '', duration_minutes: 30, section_name: 'Custom', resource_name: 'Self Study' });

    const handleUpdateResource = async (taskId: string) => {
        if (!newResourceName.trim()) return;
        setTasks(tasks.map((t: any) => t.id === taskId ? { ...t, resource_name: newResourceName } : t));
        setEditingResource(null);
        await fetch('/api/tasks/update', { method: 'PATCH', body: JSON.stringify({ taskId, updates: { resource_name: newResourceName } }) });
    };

    const handleAddTask = async () => {
        if (!newTaskData.topic_name.trim()) return;
        const tempId = 'temp-' + Date.now();
        const newTask = {
            id: tempId,
            daily_plan_id: planId, // Changed from plan.id
            task_order: tasks.length + 1,
            section_name: newTaskData.section_name,
            topic_name: newTaskData.topic_name,
            task_type: 'custom',
            duration_minutes: newTaskData.duration_minutes,
            resource_name: newTaskData.resource_name,
            status: 'pending',
            plan_date: dateStr
        };
        setTasks([...tasks, newTask]);
        setIsAddingTask(false);
        setNewTaskData({ topic_name: '', duration_minutes: 30, section_name: 'Custom', resource_name: 'Self Study' });

        const res = await fetch('/api/tasks/create', { method: 'POST', body: JSON.stringify(newTask) });
        const data = await res.json();
        if (data.task) setTasks((prev: any[]) => prev.map((t: any) => t.id === tempId ? data.task : t));
    };

    const handleComplete = async (taskId: string) => {
        // Optimistic UI
        setTasks(tasks.map((t: any) => t.id === taskId ? { ...t, status: 'completed' } : t));

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#34D399', '#059669']
        });

        // Check if all complete
        const completedCount = tasks.filter((t: any) => t.id === taskId || t.status === 'completed').length;
        if (completedCount === tasks.length) {
            setTimeout(() => {
                setIsAllComplete(true);
                confetti({
                    particleCount: 300,
                    spread: 120,
                    origin: { y: 0.5 },
                });
            }, 500);
        }

        // Call API (will implement route next)
        await fetch('/api/tasks/complete', {
            method: 'POST',
            body: JSON.stringify({ taskId })
        });
    };

    const handleSkip = async (taskId: string) => {
        if (!confirm("This topic will be rescheduled. Are you sure?")) return;
        setTasks(tasks.map((t: any) => t.id === taskId ? { ...t, status: 'skipped' } : t));

        await fetch('/api/tasks/skip', {
            method: 'POST',
            body: JSON.stringify({ taskId })
        });
    };

    const handleRemove = async (taskId: string) => {
        if (!confirm("Are you sure you want to remove this task from today's plan?")) return;
        setTasks(tasks.filter((t: any) => t.id !== taskId));

        await fetch('/api/tasks/remove', {
            method: 'DELETE',
            body: JSON.stringify({ taskId })
        });
    };

    const handleCarryover = async () => {
        setIsCarryingOver(true);
        try {
            const res = await fetch('/api/tasks/carryover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    missedTasks,
                    targetPlanId: planId, // Changed from plan.id
                    targetPlanDateStr: dateStr
                })
            });
            const data = await res.json();
            if (data.success && data.tasks) {
                setTasks([...tasks, ...data.tasks]);
            }
        } catch (error) {
            console.error("Failed to carry over", error);
        }
        setIsCarryingOver(false);
        setShowCarryover(false);
    };

    const handleBareMinimum = async () => {
        setIsCompressing(true);
        try {
            const res = await fetch('/api/plan/adjust-bare-minimum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dateStr })
            });
            const data = await res.json();
            if (data.success) {
                window.location.reload(); // Quick dirty refresh to pull the new skipped database state
            }
        } catch (error) {
            console.error("Failed to compress plan", error);
        }
        setIsCompressing(false);
    };

    if (!tasks || tasks.length === 0) { // Adjusted condition for no tasks
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4">
                <h2 className="text-2xl font-bold">You're all caught up!</h2>
                <p className="text-gray-500">No tasks scheduled for today. Take a breather or adjust your plan to generate more tasks.</p>
                <Link href="/dashboard/adjust" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold">
                    Adjust Today's Plan
                </Link>
            </div>
        );
    }

    const completedCount = tasks.filter((t: any) => t.status === 'completed').length;
    const pendingCount = tasks.length - completedCount;
    const progressPerc = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    if (isAllComplete) {
        return (
            <div className="bg-white p-10 rounded-2xl shadow-xl border text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="text-6xl mx-auto">🎉</div>
                <h2 className="text-3xl font-black text-gray-900">AMAZING DAY, {profile?.name?.toUpperCase() || 'ASPIRANT'}!</h2>
                <div className="bg-emerald-50 text-primary font-bold px-4 py-2 rounded-full inline-block">
                    {tasks.length}/{tasks.length} tasks completed
                </div>
                <p className="text-lg text-gray-600 max-w-sm mx-auto">
                    You earned <strong className="text-amber-500">+300 XP</strong> today.
                </p>
                <div className="flex gap-4 justify-center mt-8">
                    <Link href="/progress" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-colors">
                        View Progress
                    </Link>
                    <button className="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Share className="w-5 h-5" /> Share Achievement
                    </button>
                </div>
            </div>
        );
    }

    const isEvening = new Date().getHours() >= 17;
    const tasksRemaining = tasks.length - completedCount;

    return (
        <>
            {/* The Evening Check-In Modal will only show after 9PM if not completed */}
            <EveningCheckIn
                planId={planId}
                completedRatio={progressPerc / 100}
                completedCount={completedCount}
                totalCount={tasks.length}
                streak={profile.current_streak}
                hasCheckedIn={hasCheckedIn}
            />

            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Good morning, {profile?.name || 'Aspirant'}!</h1>
                    <p className="text-gray-500">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-accent font-black text-xl">
                            <Flame className="w-6 h-6 fill-accent" /> {profile?.current_streak || 0}
                        </div>
                        <span className="text-xs text-gray-500 font-bold uppercase">Streak</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-center pl-4 border-l">
                        <div className="font-black text-xl text-primary">Lvl {profile?.level || 1}</div>
                        <span className="text-xs text-gray-500 font-bold uppercase">{profile?.total_xp || 0} XP</span>
                    </div>
                </div>
            </div>

            {isEvening && tasksRemaining > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 animate-pulse" />
                        <span className="font-medium">{tasksRemaining} tasks left — don't lose your {profile?.current_streak}-day streak!</span>
                    </div>
                    {tasksRemaining > 1 && (
                        <button onClick={handleBareMinimum} disabled={isCompressing} className="text-sm underline font-bold flex items-center gap-1 hover:text-amber-900 transition-colors">
                            {isCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Switch to Bare Minimum Mode"}
                        </button>
                    )}
                </div>
            )}

            {/* Adjust Plan Prompt */}
            {!isEvening && completedCount === 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                    <button className="bg-white border-2 border-primary text-primary p-4 rounded-xl font-bold flex items-center justify-between hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Today's plan looks good!</div>
                    </button>
                    <Link href="/dashboard/adjust" className="bg-white border-2 text-gray-600 p-4 rounded-xl font-bold flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">🔄 Different day? Let's adjust.</div>
                    </Link>
                </div>
            )}

            {/* Carryover Prompt */}
            {showCarryover && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1">You left {missedTasks?.length} tasks unfinished yesterday.</h3>
                        <p className="text-sm opacity-90">Do you want to add them to today's study plan?</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            disabled={isCarryingOver}
                            onClick={() => {
                                setShowCarryover(false);
                                fetch('/api/tasks/carryover-dismiss', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ missedTasks })
                                });
                            }}
                            className="px-4 py-2 border border-blue-300 rounded-xl hover:bg-blue-100 font-bold text-sm bg-white transition-colors"
                        >
                            No, skip
                        </button>
                        <button
                            disabled={isCarryingOver}
                            onClick={handleCarryover}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors whitespace-nowrap"
                        >
                            {isCarryingOver ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, add them"}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your Tasks ({completedCount}/{tasks.length})</h2>

                {tasks.map((task: any) => (
                    <div key={task.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${task.status === 'completed' ? 'opacity-50 pointer-events-none translate-x-2' : 'hover:shadow-md'}`}>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                {task.status === 'completed' ?
                                    <CheckCircle2 className="w-6 h-6 text-primary" /> :
                                    <button onClick={() => handleComplete(task.id)} className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-primary transition-colors"></button>
                                }
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{task.topic_name}</h3>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 mb-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded w-fit ${task.task_type === 'new_topic' ? 'bg-blue-100 text-blue-700' :
                                                task.task_type === 'revision' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {task.task_type.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> Self-Paced
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                <Target className="w-4 h-4" /> {task.section_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    {editingResource === task.id ? (
                                        <div className="flex gap-2 w-full">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={newResourceName}
                                                onChange={e => setNewResourceName(e.target.value)}
                                                className="flex-1 px-2 py-1 text-sm border rounded outline-none focus:border-primary"
                                                placeholder="Enter new resource website/book..."
                                                onKeyDown={e => e.key === 'Enter' && handleUpdateResource(task.id)}
                                            />
                                            <button onClick={() => handleUpdateResource(task.id)} className="bg-primary hover:bg-emerald-600 transition-colors text-white text-xs px-3 py-1 rounded font-bold">Save</button>
                                            <button onClick={() => setEditingResource(null)} className="text-gray-500 hover:bg-gray-200 text-xs px-2 rounded transition-colors">Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-sm font-medium">📚 Resource: <span className="text-primary">{task.resource_name}</span></span>
                                            <button onClick={() => { setEditingResource(task.id); setNewResourceName(task.resource_name || ''); }} className="text-xs text-gray-500 underline hover:text-gray-900">Change Source ▾</button>
                                        </>
                                    )}
                                </div>

                                {task.tip && (
                                    <p className="text-sm italic text-gray-600 mt-3 border-l-2 border-accent pl-2">
                                        💡 "{task.tip}"
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 md:gap-3 mt-5">
                                    <Link
                                        href={`/dashboard/study/${task.id}`}
                                        className="flex-1 sm:flex-none bg-blue-50 border-blue-200 border text-blue-700 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Clock className="w-4 h-4" /> Study Now
                                    </Link>
                                    <button onClick={() => handleComplete(task.id)} className="flex-1 sm:flex-none bg-primary border border-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm">
                                        Mark Complete
                                    </button>
                                    <button onClick={() => handleSkip(task.id)} className="flex-1 sm:flex-none border border-transparent text-gray-600 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                                        Skip
                                    </button>
                                    <button onClick={() => handleRemove(task.id)} className="flex-1 sm:flex-none border border-transparent text-red-500 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
                                        Remove
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}

                {isAddingTask ? (
                    <div className="bg-white p-5 rounded-xl border-2 border-primary shadow-lg space-y-4 animate-in zoom-in-95 duration-200" >
                        <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Add Custom Task</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <input
                                type="text" placeholder="Topic Name (e.g., Simplification Mock)"
                                value={newTaskData.topic_name} onChange={e => setNewTaskData({ ...newTaskData, topic_name: e.target.value })}
                                className="border p-2 rounded w-full text-sm focus:border-primary outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text" placeholder="Resource"
                                    value={newTaskData.resource_name} onChange={e => setNewTaskData({ ...newTaskData, resource_name: e.target.value })}
                                    className="border p-2 rounded flex-1 text-sm focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <button onClick={() => setIsAddingTask(false)} className="text-sm font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                            <button onClick={handleAddTask} className="text-sm bg-primary text-white font-bold px-6 py-2 rounded hover:bg-emerald-600 transition-colors shadow-sm">Save Task</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-primary hover:text-primary transition-all hover:bg-emerald-50 flex items-center justify-center gap-2 mt-4"
                    >
                        <span>+ Add Custom Study Task</span>
                    </button>
                )}

            </div >
        </>
    );
}
