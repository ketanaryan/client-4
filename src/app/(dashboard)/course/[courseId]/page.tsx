'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, FileText, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentLesson, setCurrentLesson] = useState(1);
  
  const courseId = params?.courseId as string;
  const courseTitle = decodeURIComponent(courseId || 'Module');

  const lessons = [
    { id: 1, title: '1. Introduction', icon: BookOpen },
    { id: 2, title: '2. Core Architecture', icon: PlayCircle },
    { id: 3, title: '3. Practical Application', icon: FileText },
    { id: 4, title: '4. Module Quiz', icon: CheckCircle }
  ];

  const renderContent = () => {
    switch (currentLesson) {
      case 1:
        return (
          <>
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
          </>
        );
      case 2:
        return (
          <>
            <p className="text-lg text-zinc-700 leading-relaxed">
              Now that you understand the high-level objectives, let's dive into the <strong>Core Architecture</strong> of {courseTitle}.
            </p>
            <div className="my-8 p-8 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 flex items-center justify-center flex-col text-center">
              <PlayCircle className="h-16 w-16 text-zinc-300 mb-4" />
              <h4 className="text-lg font-bold text-zinc-700">Video Lesson Placeholder</h4>
              <p className="text-sm text-zinc-500 mt-2 max-w-sm">In a full production environment, this would be a dynamic video lecture explaining the architectural flow of {courseTitle}.</p>
            </div>
            <h3 className="text-xl font-bold mt-8 mb-4 text-zinc-900">Architectural Components</h3>
            <p className="text-zinc-700 mb-4 leading-relaxed">
              Every system is composed of interacting subsystems. By isolating these subsystems, we can analyze their individual responsibilities and how they communicate. 
              The state of the application is synchronized across these boundaries using defined protocols.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 mb-8">
              <li>Component Isolation & Abstraction</li>
              <li>State Management & Synchronization</li>
              <li>Event-driven Communication</li>
            </ul>
          </>
        );
      case 3:
        return (
          <>
            <p className="text-lg text-zinc-700 leading-relaxed">
              Let's apply the architectural concepts to a <strong>Practical Application</strong>. Theory is only useful when it translates to working systems.
            </p>
            <div className="bg-zinc-900 rounded-lg p-6 my-6 overflow-x-auto">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-sm text-green-400 font-mono">
                <code>
{`// Example Implementation
function initializeSystem(config) {
  console.log("Bootstrapping architecture...");
  const state = new StateManager(config.initialState);
  
  // Register core events
  state.on('update', (payload) => {
    syncWithDatabase(payload);
    notifyClients(payload);
  });
  
  return state;
}`}
                </code>
              </pre>
            </div>
            <p className="text-zinc-700 mb-4 leading-relaxed">
              Notice how the state manager acts as the single source of truth. When an update occurs, it automatically triggers side-effects (database sync, client notifications) without the caller needing to orchestrate them manually.
            </p>
          </>
        );
      case 4:
        return (
          <>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Module Quiz: {courseTitle}</h2>
              <p className="text-zinc-600 max-w-md mx-auto mb-8">
                You've completed all the lessons for this module. Are you ready to test your knowledge?
              </p>
              
              <div className="bg-white border border-zinc-200 rounded-xl p-6 max-w-lg mx-auto text-left shadow-sm">
                <h4 className="font-bold text-zinc-900 mb-4">Question 1 of 1</h4>
                <p className="text-zinc-700 mb-6">What is the primary benefit of the state synchronization pattern discussed in Lesson 3?</p>
                
                <div className="space-y-3">
                  <div className="p-4 border border-zinc-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors">
                    It reduces the overall line count of the codebase.
                  </div>
                  <div className="p-4 border border-indigo-600 bg-indigo-50 rounded-lg cursor-pointer transition-colors relative overflow-hidden">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    It centralizes side-effects, making state changes predictable.
                  </div>
                  <div className="p-4 border border-zinc-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors">
                    It allows the database to be bypassed entirely.
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{courseTitle}</h1>
          <p className="text-zinc-500 mt-2">Module 1 • Estimated completion: 2 hours</p>
        </div>
        <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
          Back to Pathway
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-sm min-h-[600px] flex flex-col">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-xl flex items-center gap-2">
                {currentLesson === 1 && <BookOpen className="h-5 w-5 text-indigo-600" />}
                {currentLesson === 2 && <PlayCircle className="h-5 w-5 text-indigo-600" />}
                {currentLesson === 3 && <FileText className="h-5 w-5 text-indigo-600" />}
                {currentLesson === 4 && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                {lessons.find(l => l.id === currentLesson)?.title.split('. ')[1]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose prose-zinc max-w-none flex-grow">
              {renderContent()}
            </CardContent>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/30">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  disabled={currentLesson === 1}
                  onClick={() => setCurrentLesson(prev => Math.max(1, prev - 1))}
                >
                  Previous Lesson
                </Button>
                
                {currentLesson < 4 ? (
                  <Button 
                    className="bg-zinc-900 text-white hover:bg-zinc-800" 
                    onClick={() => setCurrentLesson(prev => Math.min(4, prev + 1))}
                  >
                    Continue to {lessons.find(l => l.id === currentLesson + 1)?.title.split('. ')[1]}
                  </Button>
                ) : (
                  <Button 
                    className="bg-green-600 text-white hover:bg-green-700" 
                    onClick={() => {
                      toast({ title: "Module Completed", description: "You have successfully passed the module quiz!" });
                      router.push('/pathway-recommendations?completed=true');
                    }}
                  >
                    Complete Module
                  </Button>
                )}
              </div>
            </div>
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
                {lessons.map((lesson) => (
                  <button 
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson.id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                      currentLesson === lesson.id 
                        ? 'bg-indigo-50/50 border-l-2 border-indigo-600 hover:bg-indigo-50' 
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${currentLesson === lesson.id ? 'text-indigo-900' : 'text-zinc-600'}`}>
                      <lesson.icon className={`h-4 w-4 ${currentLesson === lesson.id ? 'text-indigo-600' : ''}`} />
                      <span className={`font-medium text-sm ${currentLesson === lesson.id ? '' : ''}`}>{lesson.title}</span>
                    </div>
                    {lesson.id < currentLesson ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
