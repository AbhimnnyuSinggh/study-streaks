import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, Layers, Flame } from 'lucide-react';

export default async function ExamsGlobalPage() {
    const supabase = await createClient();
    const { data: exams } = await supabase.from('exams').select('name, slug, category, description, total_topics').eq('is_active', true);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-white border-b py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Supported Exams</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Select your target exam to view the detailed syllabus and generate your personalized study plan.
                </p>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {exams?.map((exam) => (
                        <Link key={exam.slug} href={`/exams/${exam.slug}`} className="group bg-white rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {exam.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
                                        <Layers className="w-4 h-4" /> {exam.total_topics} Topics
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{exam.name}</h2>
                                <p className="text-gray-600 line-clamp-3 mb-6">{exam.description}</p>
                            </div>

                            <div className="flex items-center text-primary font-bold">
                                View Syllabus & Setup <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}

                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 min-h-[250px]">
                        <Flame className="w-8 h-8 mb-3 opacity-50" />
                        <h3 className="font-bold text-lg mb-2">More exams coming soon</h3>
                        <p className="text-sm">We are constantly adding new exam patterns. Stay tuned!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
