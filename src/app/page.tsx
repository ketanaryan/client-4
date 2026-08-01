import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="flex h-16 items-center px-8 border-b border-zinc-100 bg-white">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-zinc-900" />
          <span className="font-semibold text-lg text-zinc-900 tracking-tight">EduPredict</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-800 px-6 text-sm font-medium">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-24">
        <div className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 mb-8 bg-zinc-50">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
          Intelligent Academic Pathway Engine
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
          Personalized Learning, <br className="hidden md:block" />
          <span className="text-zinc-400">Powered by Data.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl leading-relaxed">
          Move beyond static curriculum. Our diagnostic engine evaluates your core competencies, isolates knowledge gaps, and constructs the optimal pathway to mastery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/register" className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 h-12 text-base font-medium">Start Diagnostic Quiz</Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-full px-8 h-12 text-base font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50">View Enterprise Demo</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-zinc-500 border-t border-zinc-100 mt-auto">
        &copy; {new Date().getFullYear()} EduPredict Capstone Project. All rights reserved.
      </footer>
    </div>
  );
}
