import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import MockAd from '@/components/mock-ad';

export const metadata: Metadata = {
    title: 'Blog | StudyStreaks',
    description: 'Exam preparation strategies, study tips, and success stories for Indian competitive exam aspirants.',
};

const MOCK_POSTS = [
    {
        slug: 'how-to-study-10-hours-a-day-without-burning-out',
        title: 'How to Study 10 Hours a Day Without Burning Out',
        excerpt: 'The secret is not superhuman willpower—it\'s smart scheduling, spaced repetition, and acknowledging your energy levels. Here is the ultimate guide to stamina.',
        date: '2026-02-14',
        author: 'Priya Verma',
        category: 'Productivity'
    },
    {
        slug: 'ibps-po-mains-strategy',
        title: 'IBPS PO Mains Strategy: Focusing on the Missing 20%',
        excerpt: 'Everyone studies the basics, but the Mains selection relies on puzzle difficulty scaling and current affairs retention. Here\'s how to shift your focus.',
        date: '2026-01-28',
        author: 'Rahul Sharma',
        category: 'Banking'
    },
    {
        slug: 'ssc-cgl-tier-2-maths-hacks',
        title: 'SSC CGL Tier 2: 5 Geometry Hacks Valid in 2026',
        excerpt: 'TCS has changed pattern priorities. Trigonometry and Geometry now demand specific visual intuition. Let\'s break down 5 reliable spatial hacks.',
        date: '2026-01-10',
        author: 'Ankit Gupta',
        category: 'SSC'
    }
];

export default function BlogLanding() {
    return (
        <div className="flex flex-col w-full bg-gray-50 min-h-screen">

            <section className="bg-white border-b py-16">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Aspirant's Journal</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Tactical advice, syllabus breakdowns, and proven scheduling templates from toppers who made it.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <MockAd />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-16">
                    {MOCK_POSTS.map(post => (
                        <article key={post.slug} className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden">
                            <div className="h-48 bg-gray-100 relative group overflow-hidden">
                                {/* Placeholder for cover image */}
                                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary/20 font-black text-6xl group-hover:scale-105 transition-transform duration-500">
                                    {post.category.charAt(0)}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                                    {post.category}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="text-primary hover:text-emerald-700 p-2 -mr-2">
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <MockAd className="mb-12" />

            </div>
        </div>
    );
}
