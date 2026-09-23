"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  conceptTarget: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function initializeQuiz() {
      try {
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
          setQuestions(data.quiz);
        } else {
          toast({ title: "Generation Failed", description: data.error || "Failed to generate AI quiz.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Quiz Init Error:", error);
        toast({ title: "Error", description: "An unexpected error occurred connecting to the AI engine.", variant: "destructive" });
      } finally {
        setIsInitializing(false);
      }
    }

    initializeQuiz();
  }, [params, router, supabase, toast]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900">Initializing Diagnostic Engine</h2>
          <p className="text-zinc-500 mt-2">Gemini AI is analyzing your competency profile and crafting an adaptive assessment...</p>
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

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleNext = () => {
    setAnswers({ ...answers, [question.id]: selectedAnswer });
    setSelectedAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz({ ...answers, [question.id]: selectedAnswer });
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
          domainProfileId: profile?.id || 'temp-id', // In a real app ensure profile exists
          questions,
          answers: finalAnswers
        })
      });

      if (response.ok) {
        router.push('/pathway-recommendations');
      } else {
        toast({ title: "Submission Failed", description: "Failed to process results.", variant: "destructive" });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900">Analyzing Responses</h2>
          <p className="text-zinc-500 mt-2">The AI is extracting sub-concept flaws and building your predictive pathway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-zinc-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl leading-relaxed text-zinc-900">{question.text}</CardTitle>
          <p className="text-xs font-mono text-zinc-400 mt-2">Target Concept: {question.conceptTarget}</p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {question.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswer === option ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mr-4" />
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
