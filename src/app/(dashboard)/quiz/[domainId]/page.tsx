"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Sparkles, BookOpen, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  conceptTarget: string;
}

interface DiagnosticReviewData {
  score: number;
  flaws: Array<{ conceptName: string; description: string }>;
  questions: Question[];
  answers: Record<string, string>;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticReview, setDiagnosticReview] = useState<DiagnosticReviewData | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    
    async function initializeQuiz() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 15000)
        );
        
        const fetchLogic = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            router.push('/login');
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('academic_level, prior_knowledge')
            .eq('id', user.id)
            .single();

          const domainId = params?.domainId as string;
          const decodedDomain = decodeURIComponent(domainId || '');

          const response = await fetch('/api/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetDomain: decodedDomain,
              academicLevel: profile?.academic_level || 'Beginner',
              priorKnowledge: profile?.prior_knowledge || []
            })
          });

          const data = await response.json();
          
          if (response.ok && data.quiz) {
            if (isMounted) setQuestions(data.quiz);
          } else {
            if (isMounted) toast({ title: "Generation Failed", description: data.error || "Failed to generate AI quiz.", variant: "destructive" });
          }
        };

        await Promise.race([fetchLogic(), timeoutPromise]);
      } catch (error: any) {
        console.error("Quiz Init Error:", error);
        if (isMounted) toast({ title: "Error", description: error?.message || "An unexpected error occurred connecting to the AI engine.", variant: "destructive" });
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    }

    initializeQuiz();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.domainId]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900">Initializing Diagnostic Engine</h2>
          <p className="text-zinc-500 mt-2">Our AI is analyzing your competency profile and crafting an adaptive assessment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-zinc-900">Assessment Generation Failed</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry Generator</Button>
      </div>
    );
  }

  const handleNext = () => {
    const updatedAnswers = { ...answers, [question.id]: selectedAnswer };
    setAnswers(updatedAnswers);
    setSelectedAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .from('domain_profiles')
        .select('id')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const response = await fetch('/api/extract-flaws', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: session?.user.id,
          domainProfileId: profile?.id || 'temp-id',
          questions,
          answers: finalAnswers
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Instead of immediate redirect, show the diagnostic review scorecard!
        setDiagnosticReview({
          score: Math.round(data.score ?? 50),
          flaws: data.flaws || [],
          questions,
          answers: finalAnswers
        });
      } else {
        toast({ title: "Submission Failed", description: "Failed to process results.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error during evaluation", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- POST-ASSESSMENT REVIEW SCREEN ---
  if (diagnosticReview) {
    const isPassing = diagnosticReview.score >= 80;
    
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 space-y-8">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Diagnostic Evaluation Complete
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Your Diagnostic Scorecard & Concept Breakdown
          </h1>
          <p className="text-zinc-600 max-w-xl mx-auto text-sm">
            Our AI evaluated your semantic comprehension across {diagnosticReview.questions.length} core competencies. Below is your detailed performance analysis.
          </p>
        </div>

        {/* Score & Flaw Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-200 shadow-sm flex flex-col items-center justify-center p-6 text-center bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Mastery Score</span>
            <div className={`text-5xl font-black mb-2 ${isPassing ? 'text-emerald-600' : 'text-indigo-600'}`}>
              {diagnosticReview.score}%
            </div>
            <Badge className={isPassing ? 'bg-emerald-100 text-emerald-800 border-none' : 'bg-indigo-100 text-indigo-800 border-none'}>
              {isPassing ? 'Strong Conceptual Foundation' : 'Knowledge Gaps Identified'}
            </Badge>
          </Card>

          <Card className="border-zinc-200 shadow-sm p-6 md:col-span-2 bg-gradient-to-br from-zinc-50 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">AI Diagnostic Diagnosis</span>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  {diagnosticReview.flaws.length} Actionable Flaw{diagnosticReview.flaws.length !== 1 ? 's' : ''}
                </span>
              </div>
              {diagnosticReview.flaws.length > 0 ? (
                <div className="space-y-2">
                  {diagnosticReview.flaws.map((flaw, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-xs">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-950 font-semibold">{flaw.conceptName}: </strong>
                        <span className="text-rose-900/90">{flaw.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-800 bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  Flawless performance! No foundational blockers detected. You are ready to dive straight into advanced coursework.
                </p>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Curriculum generated based on these results.</span>
              <Button
                onClick={() => router.push('/pathway-recommendations')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md text-sm"
              >
                View Personalized Learning Pathway <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Detailed Question Review Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Question-by-Question Diagnostic Review
          </h2>

          <div className="space-y-4">
            {diagnosticReview.questions.map((q, qIndex) => {
              const studentAnswer = diagnosticReview.answers[q.id];
              const isCorrect = studentAnswer === q.correctOption;

              return (
                <Card
                  key={q.id}
                  className={`border shadow-sm transition-all ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-500">Question {qIndex + 1}</span>
                          <span className="text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200">
                            {q.conceptTarget}
                          </span>
                        </div>
                        <CardTitle className="text-base font-semibold text-zinc-900 mt-1">
                          {q.text}
                        </CardTitle>
                      </div>

                      {isCorrect ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Correct
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-full shrink-0">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          Incorrect
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isStudentChoice = studentAnswer === opt;
                        const isCorrectChoice = q.correctOption === opt;

                        let styleClasses = 'border-zinc-200 bg-white text-zinc-700';
                        if (isCorrectChoice) {
                          styleClasses = 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-900 ring-1 ring-emerald-500';
                        } else if (isStudentChoice && !isCorrect) {
                          styleClasses = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border flex items-center justify-between ${styleClasses}`}
                          >
                            <span>{opt}</span>
                            {isCorrectChoice && (
                              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded">
                                Correct Answer
                              </span>
                            )}
                            {isStudentChoice && !isCorrect && (
                              <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-200/60 px-1.5 py-0.5 rounded">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-zinc-200 flex justify-end">
          <Button
            onClick={() => router.push('/pathway-recommendations')}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg px-8"
          >
            Continue to Recommended Pathway <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  // --- SUBMITTING SPINNER ---
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900">Performing Cognitive Diagnostics</h2>
          <p className="text-zinc-500 mt-2 max-w-md mx-auto text-sm">
            Applying Chain-of-Thought (CoT) reasoning to evaluate misconceptions and isolate knowledge gaps...
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-zinc-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2 bg-zinc-100 [&>div]:bg-indigo-600" />
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
              Sub-concept: {question.conceptTarget}
            </span>
          </div>
          <CardTitle className="text-2xl leading-relaxed text-zinc-900">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {question.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswer === option ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mr-4 text-indigo-600" />
                <span className="font-medium text-zinc-800 text-base">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="bg-zinc-50 border-t border-zinc-100 py-4 px-6 flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!selectedAnswer}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-8"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
