import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import MockAd from '@/components/mock-ad';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
        title: `${title} | StudyStreaks Blog`,
        description: `Read our comprehensive guide on ${title} to improve your competitive exam preparation strategy.`,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="w-full bg-white">

            <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
                <Link href="/blog" className="inline-flex items-center text-sm font-bold text-primary hover:text-emerald-700 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
                </Link>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Strategy
                        </span>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Feb 14, 2026</span>
                        <span className="flex items-center gap-2"><User className="w-4 h-4" /> Priya Verma</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                        {title}
                    </h1>

                    <div className="w-full h-64 md:h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold mb-8">
                        Article Cover Image Placeholder
                    </div>
                </header>

                {/* Article Body */}
                <article className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed space-y-8">
                    <p className="text-xl leading-relaxed text-gray-600 font-medium">
                        Competitive exam preparation isn't just about reading everything—it's about reading the right things at the right time. Your strategy is the multiplier on your intelligence.
                    </p>

                    <MockAd className="my-10 border-gray-200" />

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Understanding the Weightage</h2>
                    <p>
                        Start by breaking down the syllabus. We built StudyStreaks specifically because too many students spend 40% of their time on topics that yield 5% of the marks. For example, in IBPS PO, Data Interpretation holds immense weight, while specific rare arithmetic chapters do not.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. The Spaced Repetition Protocol</h2>
                    <p>
                        If you study a concept on Day 1, you will forget 80% of it by Day 7 unless you revise. Our algorithm automatically schedules revisions on Day 3, Day 7, Day 21, and Day 45. Try to mimic this organically if you study on your own. Keep flashcards or digital notes.
                    </p>

                    <div className="bg-emerald-50 border-l-4 border-primary p-6 my-8 rounded-r-xl">
                        <h4 className="text-lg font-bold text-emerald-900 mb-2">Pro Tip:</h4>
                        <p className="text-emerald-800 text-sm md:text-base m-0">When reviewing mocks, spend as much time analyzing the unattempted and wrong questions as you did taking the mock itself. That is where growth hiding.</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Managing Burnout</h2>
                    <p>
                        It is a marathon, not a sprint. Taking a scheduled rest day where you do absolutely <strong>zero</strong> studying is healthier for your brain's consolidation processes than pushing 10 hours a day for 5 months straight.
                    </p>

                    <MockAd className="my-10" />

                    <hr className="mt-12 mb-8 border-gray-200" />

                    {/* Article Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 rounded-2xl">
                        <div className="mb-4 sm:mb-0 text-center sm:text-left">
                            <div className="font-bold text-gray-900 mb-1">Found this helpful?</div>
                            <div className="text-sm text-gray-500">Sign up to get personalized study plans automatically tailored to your strengths.</div>
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-white border rounded-full p-3 hover:bg-gray-100 transition-colors shadow-sm text-gray-700">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <Link href="/signup" className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-emerald-600 transition-colors shadow-md">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    );
}
