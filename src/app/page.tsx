import Link from "next/link";
import { ArrowRight, BookCheck, CalendarDays, Flame, Users, BookOpen, BarChart3, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-emerald-50 to-background flex justify-center text-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Stop Planning. <br className="hidden sm:block" />
              <span className="text-primary">Start Studying.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Auto-generated daily study plans for Banking, SSC, Railways, and UPSC exams.
              Gamified. Personalized. Free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition-transform hover:scale-105"
              >
                Generate Your Free Study Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4 font-medium animate-pulse">
              Join 12,430+ aspirants already preparing smarter
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-16 lg:py-24 flex justify-center bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Tell us your exam</h3>
              <p className="text-muted-foreground">Select your target exam and answer a 3-minute quiz about your strengths and goals.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <CalendarDays className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Get your daily plan</h3>
              <p className="text-muted-foreground">Our algorithm creates a day-by-day roadmap tailored to the hours you can study.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Flame className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Stay consistent</h3>
              <p className="text-muted-foreground">Check off tasks, earn XP, maintain your streak, and join accountability pods!</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMS GRID */}
      <section className="w-full py-16 lg:py-24 flex justify-center bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Top Exams We Cover</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Select your target to see syllabus breakdowns, sample plans, and more.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Sample Exam Cards */}
            {['IBPS PO', 'SBI PO', 'SSC CGL', 'RRB NTPC'].map((examName) => (
              <Link key={examName} href={`/exams/${examName.toLowerCase().replace(' ', '-')}`} className="group relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="font-semibold text-lg">{examName}</div>
                <div className="text-sm text-muted-foreground mt-2 mb-4">Full syllabus tracking</div>
                <div className="text-primary font-medium text-sm flex items-center">
                  View Setup <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/exams" className="text-primary font-medium hover:underline">View all supported exams →</Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-16 lg:py-24 flex justify-center bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <BookCheck className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Auto-Generated Daily Plan</h3>
              <p className="text-muted-foreground text-sm">No more confusion about what to study. Wake up and know exactly what topics to cover.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <CalendarDays className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Smart Revision Scheduling</h3>
              <p className="text-muted-foreground text-sm">Spaced repetition built into your plan. Forget forgetting.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <Flame className="h-6 w-6 text-accent mb-4" />
              <h3 className="font-bold text-lg mb-2">Duolingo-Style Streaks</h3>
              <p className="text-muted-foreground text-sm">Build consistency with daily streaks. If you miss a day, don't worry, we have freezes.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <Users className="h-6 w-6 text-secondary mb-4" />
              <h3 className="font-bold text-lg mb-2">Accountability Pods</h3>
              <p className="text-muted-foreground text-sm">Study with 4 other aspirants who keep you on track and motivated daily.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <BookOpen className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Your Resources, Your Way</h3>
              <p className="text-muted-foreground text-sm">Bring your own YouTube playlists, paid courses, or books. We track it all.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border">
              <BarChart3 className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Beautiful Progress Tracking</h3>
              <p className="text-muted-foreground text-sm">Infographic dashboards that motivate you and show exactly where you stand.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
