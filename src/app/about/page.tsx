import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-emerald-600 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4">About StudyStreaks</h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    We believe every student deserves a personalized, stress-free path to success.
                </p>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12 text-lg text-gray-700 leading-relaxed">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p>
                        Preparing for Indian competitive exams (Banking, SSC, Railways, State PSCs) is a daunting journey. Millions of aspirants face burnout, confusion over syllabus tracking, and an overwhelming amount of raw material. Our mission at StudyStreaks is to automate the planning so you can focus 100% on the studying.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Started</h2>
                    <p>
                        Built by former aspirants for future toppers. We realized that the difference between clearing an exam and missing the cutoff often comes down to consistency, not just intelligence. We combined Duolingo's streak gamification with advanced spaced-repetition algorithms to create a tool that actually keeps you accountable.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border shadow-sm text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your streak?</h3>
                    <Link href="/signup" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-emerald-600 transition-colors">
                        Generate Your Plan Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
