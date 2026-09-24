'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, FileText, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const courseId = params?.courseId as string;
  const courseTitle = decodeURIComponent(courseId || 'Module');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{courseTitle}</h1>
          <p className="text-zinc-500 mt-2">Module 1 • Estimated completion: 2 hours</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Back to Pathway
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Course Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed">
                Welcome to <strong>{courseTitle}</strong>. In this module, we will explore the foundational concepts required to master this topic. Our AI has curated this specific curriculum for you based on your diagnostic performance.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-4 text-zinc-900">Learning Objectives</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-zinc-700">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Understand the core theoretical principles underlying the topic.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-700">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Apply knowledge to practical, real-world engineering problems.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-700">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Identify and resolve common misconceptions and edge cases.</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-8 mb-4 text-zinc-900">1. Core Concepts</h3>
              <p className="text-zinc-700 mb-4 leading-relaxed">
                Before diving into complex implementations, it is critical to understand the architecture. Think of this as the building blocks of your understanding. When our diagnostic engine evaluated your profile, it determined that reinforcing these fundamentals will drastically accelerate your advanced learning later in the pathway.
              </p>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg my-8">
                <h4 className="font-bold text-indigo-900 mb-2">Key Takeaway</h4>
                <p className="text-indigo-800">
                  Mastery of {courseTitle} is not about memorization, but about structural understanding. Focus on the 'why' rather than the 'how' during this first chapter.
                </p>
              </div>

              <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-100">
                <Button variant="outline" disabled>Previous Lesson</Button>
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => {
                  toast({ title: "Module Completed", description: "This concludes the interactive presentation demo." });
                  router.push('/pathway-recommendations?completed=true');
                }}>Continue to Lesson 2</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm sticky top-6">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-lg">Syllabus</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                <button className="w-full flex items-center justify-between p-4 bg-indigo-50/50 border-l-2 border-indigo-600 text-left hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-900 text-sm">1. Introduction</span>
                  </div>
                  <Clock className="h-4 w-4 text-zinc-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <PlayCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">2. Core Architecture</span>
                  </div>
                  <Clock className="h-4 w-4 text-zinc-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium text-sm">3. Practical Application</span>
                  </div>
                  <Clock className="h-4 w-4 text-zinc-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">4. Module Quiz</span>
                  </div>
                  <Clock className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
