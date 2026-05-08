import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Flame } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/sign-out-button';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'StudyStreaks — Free Personalized Study Plans for Competitive Exams',
  description:
    'Auto-generated daily study plans for IBPS PO, SBI, SSC CGL, RRB exams. Gamified streaks, smart revision, accountability pods. 100% free.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Flame className="w-6 h-6 text-accent fill-accent" />
              <span>StudyStreaks</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground mr-6">
              <Link href="/exams" className="hover:text-primary transition-colors">
                Exams
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <nav className="flex items-center gap-6 text-sm font-medium pr-6 border-r mr-2">
                    <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/syllabus" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                      Syllabus
                    </Link>
                    <Link href="/progress" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                      Progress
                    </Link>
                  </nav>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-10 px-4 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-emerald-600 h-10 px-4 py-2 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="border-t bg-white">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0 px-4">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © 2026 StudyStreaks. Made with ❤️ for aspirants.
              </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
