import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import MockAd from '@/components/mock-ad';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: exam } = await supabase.from('exams').select('name, category, description').eq('slug', slug).single();

    if (!exam) return { title: 'Exam Not Found' };

    return {
        title: `${exam.name} Study Plan Generator & Syllabus tracking | StudyStreaks`,
        description: `Free auto-generated daily study plan for ${exam.name}. Track your syllabus, take quizzes, and maintain streaks for ${exam.category} exams. ${exam.description?.substring(0, 100)}...`,
        keywords: [`${exam.name} study plan`, `${exam.name} syllabus`, `${exam.category} preparation`, `free ${exam.name} tracker`]
    };
}

// Optional: you can generate static params if you want true SSG
// export async function generateStaticParams() {
//   ...
// }

export default async function ExamSeoPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: exam, error } = await supabase
        .from('exams')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !exam) {
        notFound();
    }

    const sections = exam.sections || [];

    return (
        <div className="flex flex-col w-full bg-white">
            {/* SEO Hero Section */}
            <section className="w-full py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-white text-center border-b">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-6">
                        {exam.category} Exam Preparation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
                        The Ultimate <span className="text-primary">{exam.name}</span> Study Plan
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {exam.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/signup" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-transform hover:scale-105 shadow-lg flex items-center gap-2">
                            Generate Free Study Plan <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-sm font-medium text-gray-500 sm:ml-4">Takes only 3 minutes.</p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 py-12">
                <MockAd />

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content: Syllabus */}
                    <div className="md:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Layers className="text-primary" /> {exam.name} Complete Syllabus ({exam.total_topics} Topics)
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Our algorithm breaks down the entire {exam.name} syllabus into bite-sized daily tasks. We cover everything from basics to advanced topics. Here is the comprehensive topic list we track:
                            </p>

                            <div className="space-y-6">
                                {sections.map((section: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{section.name}</h3>
                                            <span className="bg-white border text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-500">
                                                Weight: {section.weightage}%
                                            </span>
                                        </div>
                                        <ul className="grid sm:grid-cols-2 gap-3">
                                            {section.topics?.map((topic: any, tIdx: number) => (
                                                <li key={tIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span>{topic.name} <span className="text-xs text-gray-400 ml-1">({topic.hours}h)</span></span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <MockAd />

                        <section className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
                            <h2 className="text-3xl font-bold mb-4">Stop manually planning your {exam.name} prep.</h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Join thousands of aspirants who let our algorithm schedule their day, track their revisions, and maintain their streaks.
                            </p>
                            <Link href="/signup" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-colors">
                                Start Tracking for Free
                            </Link>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-emerald-900">Why use StudyStreaks?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-emerald-800 text-sm">
                                    <Clock className="w-5 h-5 shrink-0 text-emerald-600" /> Auto-adapts to how many hours you have each day.
                                </li>
                                <li className="flex gap-3 text-emerald-800 text-sm">
                                    <BookOpen className="w-5 h-5 shrink-0 text-emerald-600" /> Smart spaced-repetition schedules revisions automatically.
                                </li>
                                <li className="flex gap-3 text-emerald-800 text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> Gamified streaks and XP to keep you motivated.
                                </li>
                            </ul>
                        </div>

                        <MockAd className="min-h-[250px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
