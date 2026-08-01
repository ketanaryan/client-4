import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Activity, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch Profile Data (for Weekly Goal)
  const { data: profile } = await supabase
    .from('profiles')
    .select('time_commitment')
    .eq('id', user.id)
    .single();

  // 2. Fetch Domain Profile
  const { data: domainProfile } = await supabase
    .from('domain_profiles')
    .select('id, domain_name, current_competency_level')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // 3. Fetch Quiz Results & Flaws
  let latestQuiz = null;
  let activeFlaws = [];
  let masteryScore = 0;

  if (domainProfile) {
    const { data: quizData } = await supabase
      .from('quiz_results')
      .select('id, score, taken_at')
      .eq('domain_profile_id', domainProfile.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single();

    latestQuiz = quizData;

    if (latestQuiz) {
      masteryScore = Math.round(latestQuiz.score);
      const { data: flawsData } = await supabase
        .from('identified_flaws')
        .select('*')
        .eq('quiz_result_id', latestQuiz.id)
        .eq('is_remediated', false)
        .order('created_at', { ascending: false });

      activeFlaws = flawsData || [];
    }
  }

  // Parse time commitment to get a target number (e.g., "5-10" -> 5)
  const targetHours = profile?.time_commitment 
    ? parseInt(profile.time_commitment.split('-')[0]) 
    : 5;

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-1">Welcome back. Track your academic progression below.</p>
        </div>
        <Link href="/domain-selection" className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium shadow-sm transition-colors">
          Configure Domain
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-zinc-900 truncate">
                  {domainProfile?.domain_name || 'Not Set'}
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {domainProfile?.current_competency_level || 'Pending Setup'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-zinc-900 mb-2">{masteryScore}%</div>
                <Progress value={masteryScore} className="h-2 bg-zinc-100" />
              </CardContent>
            </Card>

            <Card className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Flaws</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-indigo-600">{activeFlaws.length}</div>
                <p className="text-sm text-zinc-500 mt-1">Requires Remediation</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Recommended Action */}
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Recommended Action</h2>
          {!domainProfile ? (
             <Card className="border-indigo-100 shadow-sm bg-indigo-50/50">
               <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                 <div>
                   <h3 className="font-semibold text-indigo-900">Domain Setup Required</h3>
                   <p className="text-sm text-indigo-700/80 mt-1">Select your academic domain to begin your personalized learning journey.</p>
                 </div>
                 <Link href="/domain-selection" className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium whitespace-nowrap">
                   Setup Domain <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </CardContent>
             </Card>
          ) : !latestQuiz ? (
            <Card className="border-indigo-100 shadow-sm bg-indigo-50/50">
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div>
                  <h3 className="font-semibold text-indigo-900">Diagnostic Assessment Pending</h3>
                  <p className="text-sm text-indigo-700/80 mt-1">Complete your adaptive quiz to generate your personalized learning pathway.</p>
                </div>
                <Link href={`/quiz/${domainProfile.domain_name.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium whitespace-nowrap">
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ) : activeFlaws.length > 0 ? (
            <Card className="border-amber-100 shadow-sm bg-amber-50/50">
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div>
                  <h3 className="font-semibold text-amber-900">Remediation Required</h3>
                  <p className="text-sm text-amber-700/80 mt-1">You have {activeFlaws.length} conceptual flaws that need your attention.</p>
                </div>
                <Link href="/pathway-recommendations" className="inline-flex h-9 items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 text-sm font-medium whitespace-nowrap">
                  View Pathway <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-emerald-100 shadow-sm bg-emerald-50/50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">All Caught Up!</h3>
                  <p className="text-sm text-emerald-700/80 mt-1">You have no pending assessments or active flaws. Keep up the great work.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Identified Conceptual Flaws */}
          {activeFlaws.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Active Conceptual Flaws</h2>
                <Link href="/pathway-recommendations" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
              </div>
              <div className="grid gap-3">
                {activeFlaws.slice(0, 3).map((flaw: any) => (
                  <Card key={flaw.id} className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="mt-1 bg-red-50 p-2 rounded-md shrink-0">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 text-sm">{flaw.concept_name}</h4>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{flaw.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          
          {/* Weekly Goal Tracker */}
          <Card className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-semibold">Weekly Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-bold text-zinc-900">0</span>
                  <span className="text-zinc-500 font-medium ml-1">/ {targetHours} hrs</span>
                </div>
                <span className="text-sm font-medium text-indigo-600">0%</span>
              </div>
              <Progress value={0} className="h-2.5 bg-zinc-100 [&>div]:bg-indigo-600" />
              <p className="text-xs text-zinc-500 mt-4 text-center">
                Your committed target is {profile?.time_commitment || 'not set'} hours per week.
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-zinc-200/60 shadow-sm bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                
                {latestQuiz ? (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded border border-zinc-200 shadow-sm bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-zinc-900">Quiz Completed</span>
                        <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Score: {masteryScore}%</span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(latestQuiz.taken_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-zinc-500">
                    No recent activity yet.
                  </div>
                )}
                
                {domainProfile && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded border border-zinc-200 shadow-sm bg-white">
                      <div className="font-semibold text-sm text-zinc-900 mb-1">Domain Selected</div>
                      <div className="text-xs text-zinc-500">
                        Set to {domainProfile.domain_name}
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
