"use client";

import { useState, useEffect } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle, PlayCircle, Briefcase, Loader2, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const RECOMMENDED_COURSES = [
  { id: 'c1', title: 'Advanced Computer Architecture', type: 'Course', status: 'Next', flaws: ['Cache Coherence', 'Pipeline Hazards'] },
  { id: 'c2', title: 'Real-Time Operating Systems', type: 'Course', status: 'Locked', flaws: ['RTOS Scheduling'] },
];

export default function PathwayRecommendationsPage() {
  const [selectedFlaw, setSelectedFlaw] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flaws, setFlaws] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data for Career Paths
  const [profile, setProfile] = useState<any>(null);
  const [domainProfile, setDomainProfile] = useState<any>(null);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [isGeneratingPaths, setIsGeneratingPaths] = useState(false);

  const supabase = createClient();

  const { completion, complete, isLoading: isStreamLoading, stop, setCompletion } = useCompletion({
    api: '/api/remediate-flaw',
    onFinish: () => {
      setIsGenerating(false);
    }
  });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get Profile
      const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(userProfile);
      
      // Load cached career paths if they exist
      if (userProfile?.cached_career_paths) {
        setCareerPaths(userProfile.cached_career_paths);
      }

      // Get Domain Profile
      const { data: userDomain } = await supabase.from('domain_profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
      setDomainProfile(userDomain);

      // Get latest quiz result
      const { data: latestQuiz } = await supabase
        .from('quiz_results')
        .select('id, score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestQuiz) {
        setScore(latestQuiz.score);
        
        // Get flaws for this quiz
        const { data: identifiedFlaws } = await supabase
          .from('identified_flaws')
          .select('*')
          .eq('quiz_result_id', latestQuiz.id);
          
        if (identifiedFlaws) {
          setFlaws(identifiedFlaws);
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleRemediate = async (flaw: string) => {
    setSelectedFlaw(flaw);
    setIsGenerating(true);
    setCompletion(""); // Reset previous stream
    
    // Call the streaming API
    await complete('', { body: { flawConcept: flaw } });
  };

  const generateCareerPaths = async () => {
    setIsGeneratingPaths(true);
    try {
      const response = await fetch('/api/recommend-career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          profile,
          domainProfile,
          masteryScore: score,
          flaws
        })
      });
      const data = await response.json();
      if (data.paths) {
        setCareerPaths(data.paths);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPaths(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-4"><Loader2 className="animate-spin h-8 w-8 text-indigo-500" /> Loading your customized pathway...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="text-emerald-600 h-8 w-8" />
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Diagnostic Complete</h1>
        </div>
        <p className="text-zinc-500 mt-1 text-lg">We've identified your knowledge gaps and generated a personalized learning pathway.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Pathway */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Career Path Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">AI Career Path Recommendations</h2>
              <Button onClick={generateCareerPaths} disabled={isGeneratingPaths} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                {isGeneratingPaths ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Profile...</> : <><Briefcase className="mr-2 h-4 w-4" /> Generate Paths</>}
              </Button>
            </div>
            
            {careerPaths.length > 0 ? (
              <div className="grid gap-4">
                {careerPaths.map((path, idx) => (
                  <Card key={idx} className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none">Match {idx + 1}</Badge>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><TrendingUp className="h-3 w-3 mr-1" /> {path.growth_potential}</span>
                          </div>
                          <h3 className="text-xl font-bold text-indigo-950">{path.title}</h3>
                          <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{path.match_reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50/50">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">Discover Your Ideal Career</h3>
                  <p className="text-zinc-500 max-w-md mx-auto text-sm">
                    Click "Generate Paths" to allow our AI to analyze your academic history, 
                    diagnostic performance, and personal hobbies to recommend your optimal career trajectories.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-4">Your Optimal Course Pathway</h2>
            
            <div className="space-y-4">
              {RECOMMENDED_COURSES.map((course, idx) => {
                // Inject real flaws into the first course for demonstration if they exist
                const courseFlaws = idx === 0 && flaws.length > 0 ? flaws.map(f => f.concept_name) : course.flaws;
                return (
                <Card key={course.id} className={`border-zinc-200 shadow-sm ${course.status === 'Locked' ? 'opacity-75 bg-zinc-50/50' : 'border-indigo-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-white">Step {idx + 1}</Badge>
                          {course.status === 'Next' && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">Up Next</Badge>}
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">{course.title}</h3>
                      </div>
                      <Button variant={course.status === 'Next' ? 'default' : 'outline'} className={course.status === 'Next' ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm' : ''} disabled={course.status === 'Locked'}>
                        {course.status === 'Locked' ? 'Locked' : 'Start Course'}
                      </Button>
                    </div>

                    {courseFlaws.length > 0 && (
                      <div className="mt-4 p-4 bg-rose-50/50 border border-rose-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-4 w-4 text-rose-600" />
                          <span className="text-sm font-semibold text-rose-900">Identified Knowledge Gaps (Prerequisites)</span>
                        </div>
                        <div className="space-y-2">
                          {courseFlaws.map((flaw) => (
                            <div key={flaw} className="flex items-center justify-between bg-white p-3 rounded-md border border-rose-100 shadow-sm">
                              <span className="text-sm font-medium text-zinc-800">{flaw}</span>
                              
                              {/* The Flaw Button */}
                              <Dialog>
                                <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-rose-200 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors" onClick={() => handleRemediate(flaw)}>
                                  <PlayCircle className="h-3 w-3 mr-1.5" /> AI Remediation
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden border-zinc-200 shadow-2xl">
                                  <div className="p-6 bg-zinc-950 text-white">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                      AI Micro-Module: {flaw}
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400 mt-2">
                                      Streaming personalized remediation content...
                                    </DialogDescription>
                                  </div>
                                  <div className="p-6 bg-zinc-50 min-h-[300px]">
                                    {isGenerating && !completion ? (
                                      <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-zinc-200 rounded w-full"></div>
                                        <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
                                        <div className="h-32 bg-zinc-200 rounded w-full mt-6"></div>
                                      </div>
                                    ) : (
                                      <div className="prose prose-sm prose-zinc max-w-none">
                                        <h3 className="text-lg font-bold text-zinc-900">Understanding {flaw}</h3>
                                        <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                          {completion}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4 border-t border-zinc-200 bg-white flex justify-end gap-2">
                                    <Button variant="outline" className="border-zinc-200 text-zinc-700">Mark as Understood</Button>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Continue to Course</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-zinc-950 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Diagnostic Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Overall Readiness</div>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">{Math.round(score)}%</div>
                </div>
                <Progress value={score} className="h-1.5 mt-3 bg-zinc-800 [&>div]:bg-indigo-500" />
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <div className="text-sm text-zinc-400 mb-1">Isolated Flaws</div>
                <div className="text-xl font-bold text-rose-400">{flaws.length} Topics to Review</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
