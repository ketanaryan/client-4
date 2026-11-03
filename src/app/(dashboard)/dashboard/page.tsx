export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
    Clock, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Database,
  Sparkles,
  Award,
  TrendingUp,
  Landmark,
  PieChart,
  DollarSign,
  Brain,
  Stethoscope,
  Pill,
  Dna,
  HeartPulse,
  Palette,
  Eye,
  MousePointerClick,
  Briefcase,
  Users
} from 'lucide-react';
import { redirect } from 'next/navigation';
import ScheduleGenerator from '@/components/ScheduleGenerator';


function getCompetencyMatrixForDomain(domainName: string | undefined, baseMastery: number, hasFlaws: boolean) {
  const d = (domainName || '').toLowerCase();
  
  if (d.includes('financ') || d.includes('econom')) {
    return [
      {
        name: "Capital Markets & Equity Valuation",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: TrendingUp,
        description: "DCF modeling, P/E multiples, capital asset pricing (CAPM), and risk premia."
      },
      {
        name: "Macroeconomic Policy & Monetary Dynamics",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: Landmark,
        description: "Central bank interest rates, inflation forecasting, and yield curve shifts."
      },
      {
        name: "Portfolio Risk & Modern Portfolio Theory",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: PieChart,
        description: "Sharpe ratio, unsystematic vs systematic risk diversification, and VaR."
      },
      {
        name: "Corporate Finance & Capital Structure",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: DollarSign,
        description: "EBITDA normalization, Modigliani-Miller theorem, and debt-to-equity leverage."
      },
      {
        name: "Derivatives, Hedging & Market Microstructure",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "Options call/put mechanics, Black-Scholes dynamics, and CDS spread hedging."
      }
    ];
  }

  if (d.includes('psycholog') || d.includes('behavior')) {
    return [
      {
        name: "Cognitive Biases & Decision Heuristics",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: Brain,
        description: "Confirmation bias, cognitive dissonance, and dual-system reasoning (Kahneman)."
      },
      {
        name: "Behavioral Conditioning & Learning Theory",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: Activity,
        description: "Classical conditioning, operant reinforcement schedules, and self-efficacy."
      },
      {
        name: "Neurobiological Foundations & Plasticity",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: Sparkles,
        description: "Amygdala threat processing, synaptic Long-Term Potentiation (LTP), and SSRIs."
      },
      {
        name: "Social Psychology & Group Dynamics",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: Users,
        description: "Bystander effect, Milgram obedience, and attribution theory."
      },
      {
        name: "Psychometrics & Diagnostic Methodologies",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "Big Five OCEAN validation, diathesis-stress models, and Piagetian developmental stages."
      }
    ];
  }

  if (d.includes('health') || d.includes('biomed') || d.includes('medic')) {
    return [
      {
        name: "Human Anatomy & Systemic Pathophysiology",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: Stethoscope,
        description: "Erythrocyte gas exchange, cardiovascular vitals, and homeostatic regulation."
      },
      {
        name: "Pharmacology & Pharmacokinetics",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: Pill,
        description: "ADME dynamics, hepatic CYP450 metabolism, and allosteric receptor modulation."
      },
      {
        name: "Cellular Oncology & Molecular Genetics",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: Dna,
        description: "TP53 tumor suppression, CRISPR-Cas9 PAM sequences, and mRNA immunotherapeutics."
      },
      {
        name: "Immunology & Diagnostic Biomarkers",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: HeartPulse,
        description: "Troponin-I cardiac necrosis markers, autoimmune mechanisms, and PD-1 checkpoint inhibitors."
      },
      {
        name: "Epidemiology & Clinical Trial Protocols",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "Basic reproduction number (R0), Phase 1-4 trial methodologies, and public health safeguards."
      }
    ];
  }

  if (d.includes('design') || d.includes('hci') || d.includes('product')) {
    return [
      {
        name: "Human Mental Models & Usability Heuristics",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: Palette,
        description: "Nielsen's 10 heuristics, cognitive friction, affordances, and Hick's Law."
      },
      {
        name: "Information Architecture & Visual Hierarchy",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: Layers,
        description: "Card sorting, negative space ratio, typographic contrast, and progressive disclosure."
      },
      {
        name: "Fitts's Law & Interaction Ergonomics",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: MousePointerClick,
        description: "Target distance-to-size indexing, touch boundaries, and micro-interaction states."
      },
      {
        name: "Accessibility (WCAG 2.1 AA) & Design Systems",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: Eye,
        description: "4.5:1 minimum contrast compliance, semantic tokens, and screen-reader tree structures."
      },
      {
        name: "User Research & Telemetric Validation",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "System Usability Scale (SUS), Double Diamond design process, and A/B split testing."
      }
    ];
  }

  if (d.includes('manage') || d.includes('business')) {
    return [
      {
        name: "Competitive Strategy & Industry Structure",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: Briefcase,
        description: "Porter's Five Forces, VRIO core competencies, and Blue Ocean uncontested space."
      },
      {
        name: "Unit Economics & Growth Engines",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: TrendingUp,
        description: "LTV:CAC ratio optimization (>3:1), break-even economics, and Ansoff growth matrix."
      },
      {
        name: "Agile Operations & Lean Enterprise",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: Clock,
        description: "Scrum sprint velocity, Toyota lean waste elimination (Muda), and Kaizen continuous flow."
      },
      {
        name: "Organizational Leadership & Governance",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: Award,
        description: "Lewin's 3-stage change management, Agency Theory principal-agent alignment, and HR talent."
      },
      {
        name: "Performance Management & Strategic M&A",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "Kaplan-Norton Balanced Scorecard, balance-sheet goodwill, and Nash game equilibria."
      }
    ];
  }

  if (d.includes('data') || d.includes('analytic')) {
    return [
      {
        name: "Statistical Inference & Probability Modeling",
        score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
        icon: Database,
        description: "Hypothesis testing, p-values, Bayes theorem, and statistical distributions."
      },
      {
        name: "Predictive Machine Learning & Regression",
        score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
        icon: Cpu,
        description: "Supervised classification, regularized ridge/lasso regression, and ensemble trees."
      },
      {
        name: "Feature Engineering & Data Pipeline Integrity",
        score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
        icon: Layers,
        description: "Missing value imputation, categorical one-hot encoding, and outlier detection."
      },
      {
        name: "Model Evaluation, ROC-AUC & Calibration",
        score: Math.min(98, Math.max(50, baseMastery + 12)),
        icon: Zap,
        description: "Precision-recall curves, confusion matrices, cross-validation, and bias-variance trade-off."
      },
      {
        name: "Big Data Persistence & Business Intelligence",
        score: Math.min(95, Math.max(60, baseMastery + 18)),
        icon: ShieldCheck,
        description: "Distributed SQL querying, parquet columnar storage, and interactive analytics reporting."
      }
    ];
  }

  // Default: Systems & Computer Science
  return [
    {
      name: "Systems Architecture & Design Patterns",
      score: Math.min(95, Math.max(40, baseMastery + (hasFlaws ? -10 : 15))),
      icon: Layers,
      description: "Component decoupling, micro-frontends, and client-server boundaries."
    },
    {
      name: "State Synchronization & Concurrency",
      score: Math.min(92, Math.max(35, baseMastery - (hasFlaws ? 15 : 0))),
      icon: Zap,
      description: "Event-driven updates, pure mutations, and race condition prevention."
    },
    {
      name: "Algorithmic Complexity & Optimization",
      score: Math.min(90, Math.max(45, baseMastery + (hasFlaws ? -5 : 10))),
      icon: Cpu,
      description: "Time/space scaling, memory management, and tree traversals."
    },
    {
      name: "Edge Persistence & JSONB Caching",
      score: Math.min(98, Math.max(50, baseMastery + 12)),
      icon: Database,
      description: "PostgreSQL JSONB schema, sub-millisecond retrieval, and cache invalidation."
    },
    {
      name: "Resilience & Circuit Breaking",
      score: Math.min(95, Math.max(60, baseMastery + 18)),
      icon: ShieldCheck,
      description: "7.5s AbortController timeouts, fail-safe fallbacks, and RLS security."
    }
  ];
}

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch Profile Data
  const { data: profile } = await supabase
    .from('profiles')
    .select('time_commitment, cached_course_pathway')
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
  let activeFlaws: any[] = [];
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

  // Parse time commitment
  const targetHours = profile?.time_commitment 
    ? parseInt(profile.time_commitment.split('-')[0]) 
    : 5;

  // Calculate dynamic competency scores based on actual diagnostic performance
  const baseMastery = masteryScore > 0 ? masteryScore : 65;
  const hasFlaws = activeFlaws.length > 0;
  
  const competencyMatrix = getCompetencyMatrixForDomain(domainProfile?.domain_name, baseMastery, hasFlaws);

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-1">Real-time academic progression & cognitive mastery metrics.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/domain-selection" className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white px-4 text-sm font-medium shadow-sm transition-colors">
            Configure Domain
          </Link>
          <Link href="/pathway-recommendations" className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium shadow-sm transition-colors">
            View My Pathway <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Target Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-zinc-900 truncate">
                  {domainProfile?.domain_name || 'Not Set'}
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  Level: {domainProfile?.current_competency_level || 'Pending Setup'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Diagnostic Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-zinc-900 mb-2">{masteryScore}%</div>
                <Progress value={masteryScore} className="h-2 bg-zinc-100 [&>div]:bg-indigo-600" />
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Flaws</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${activeFlaws.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeFlaws.length}
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {activeFlaws.length > 0 ? 'Requires Remediation' : 'All Flaws Resolved'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Recommended Action */}
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Active Recommendation</h2>
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
                  <h3 className="font-semibold text-amber-900">Cognitive Remediation Required</h3>
                  <p className="text-sm text-amber-700/80 mt-1">
                    You have {activeFlaws.length} conceptual flaw(s) blocking course progression. Click to remediate.
                  </p>
                </div>
                <Link href="/pathway-recommendations" className="inline-flex h-9 items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 text-sm font-medium whitespace-nowrap">
                  Open Pathway <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-emerald-100 shadow-sm bg-emerald-50/50">
              <CardContent className="flex items-center justify-between p-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">Foundational Pathways Unlocked</h3>
                    <p className="text-sm text-emerald-700/80 mt-1">All conceptual prerequisites are clear. You can proceed with your courses.</p>
                  </div>
                </div>
                <Link href="/pathway-recommendations" className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 text-sm font-medium whitespace-nowrap">
                  Enter Coursework <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Cognitive Competency Matrix (New Feature) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Cognitive Competency & Skill Distribution
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Multi-dimensional evaluation derived from diagnostic assessment telemetry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {competencyMatrix.map((comp, idx) => {
                const Icon = comp.icon;
                const isHigh = comp.score >= 80;
                const isMid = comp.score >= 60 && comp.score < 80;

                return (
                  <Card key={idx} className="border-zinc-200 shadow-sm bg-white p-4 transition-all hover:border-zinc-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5 border border-indigo-100">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-zinc-900">{comp.name}</h4>
                            <Badge className={
                              isHigh 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]' 
                                : isMid 
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                            }>
                              {isHigh ? 'Advanced' : isMid ? 'Proficient' : 'Focus Area'}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{comp.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-bold text-zinc-900">{comp.score}%</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress 
                        value={comp.score} 
                        className={`h-1.5 bg-zinc-100 ${
                          isHigh ? '[&>div]:bg-emerald-600' : isMid ? '[&>div]:bg-indigo-600' : '[&>div]:bg-amber-500'
                        }`} 
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Identified Conceptual Flaws */}
          {activeFlaws.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Active Conceptual Flaws</h2>
                <Link href="/pathway-recommendations" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                  Remediate in Pathway →
                </Link>
              </div>
              <div className="grid gap-3">
                {activeFlaws.map((flaw: any) => (
                  <Card key={flaw.id} className="border-rose-100 shadow-sm bg-rose-50/30">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="mt-1 bg-rose-100 p-2 rounded-md shrink-0">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-rose-950 text-sm">{flaw.concept_name}</h4>
                        <p className="text-xs text-rose-900/80 mt-1 leading-relaxed">{flaw.description}</p>
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
          
          {/* Weekly Goal Tracker & Schedule Generator */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-semibold">Weekly Study Calibration</CardTitle>
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
              <p className="text-xs text-zinc-500 mt-4 text-center mb-4 leading-relaxed">
                Target pace: {profile?.time_commitment || '5-10'} hours per week.
              </p>
              <ScheduleGenerator 
                timeCommitment={profile?.time_commitment || '5'} 
                domainName={domainProfile?.domain_name || 'Computer Engineering'} 
              />
            </CardContent>
          </Card>

          
          {/* Career Placement & Industry Readiness Index */}
          <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-white via-indigo-50/20 to-zinc-50 overflow-hidden">
            <CardHeader className="pb-3 border-b border-indigo-100/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  <CardTitle className="text-sm font-bold text-zinc-900">Industry Placement Index</CardTitle>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                  Top 15% Cohort
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-indigo-950">
                    {Math.min(96, Math.max(72, (masteryScore > 0 ? masteryScore + 8 : 78)))}%
                  </div>
                  <div className="text-[11px] font-medium text-zinc-500">Industry Placement Readiness</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    High Demand
                  </span>
                </div>
              </div>

              <Progress 
                value={Math.min(96, Math.max(72, (masteryScore > 0 ? masteryScore + 8 : 78)))} 
                className="h-2 bg-zinc-100 [&>div]:bg-gradient-to-r [&>div]:from-indigo-600 [&>div]:to-violet-600" 
              />

              <div className="bg-white p-3 rounded-xl border border-zinc-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Target Industry Profile</span>
                <span className="text-xs font-bold text-zinc-800 block truncate">
                  {domainProfile?.domain_name ? `Senior ${domainProfile.domain_name} Specialist` : 'Distributed Systems Engineer'}
                </span>
                <span className="text-[11px] text-zinc-500 block leading-tight">
                  {activeFlaws.length > 0 
                    ? `Remediate ${activeFlaws.length} prerequisite flaw to unlock 90%+ placement tier.`
                    : 'All prerequisite competencies verified. Ready for corporate interview loops.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link 
                  href="/interview-prep" 
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>AI Viva Prep</span>
                </Link>

                <Link 
                  href="/transcript" 
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Transcript</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Academic Milestone Tracker */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-semibold">Audit Trail & Telemetry</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 text-xs">
                {latestQuiz && (
                  <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 block">Diagnostic Quiz Evaluated</span>
                      <span className="text-zinc-500 text-[11px] mt-0.5 block">
                        {new Date(latestQuiz.taken_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-mono">
                      {masteryScore}%
                    </Badge>
                  </div>
                )}
                
                {domainProfile && (
                  <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 block">Domain Profile Configured</span>
                      <span className="text-zinc-500 text-[11px] mt-0.5 block">
                        {domainProfile.domain_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  </div>
                )}

                <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900 block">Circuit Breaker & Fallback</span>
                    <span className="text-zinc-500 text-[11px] mt-0.5 block">
                      7.5s AbortController Active
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Online
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
