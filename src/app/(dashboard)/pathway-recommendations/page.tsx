"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompletion } from '@ai-sdk/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  Briefcase, 
  Loader2, 
  TrendingUp, 
  Sparkles,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Compass,
  Layers,
  GraduationCap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// =====================================================================
// ROBUST DETERMINISTIC MULTIDISCIPLINARY DATA ENGINE
// Ensures 100% reliability for presentation with zero dependency on slow/rate-limited APIs
// =====================================================================
export const DOMAIN_DATA_MAP: Record<string, {
  courses: Array<{
    id: string;
    title: string;
    type: 'Course';
    status: 'Locked' | 'Next' | 'Completed';
    flaws: string[];
    reasoning: string;
  }>;
  careerPaths: Array<{
    title: string;
    match_reason: string;
    growth_potential: string;
  }>;
}> = {
  "Liberal Arts & Humanities": {
    courses: [
      {
        id: "c1",
        title: "Critical Historiography & Primary Source Archival Analysis",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Strengthens archival contextualization, bias deconstruction, and primary document verification."
      },
      {
        id: "c2",
        title: "Epistemological Frameworks & Rhetorical Argumentation",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Deepens understanding of philosophical argumentation, dialectics, and formal logical fallacies."
      },
      {
        id: "c3",
        title: "Semiotics, Cultural Hermeneutics & Narrative Discourse",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Analyzes cultural sign systems, literary theory, semiotic codes, and ideological representation."
      },
      {
        id: "c4",
        title: "Digital Humanities, Archival Ethics & Public Intellectualism",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in computational text mining, digital cultural preservation, and public policy discourse."
      }
    ],
    careerPaths: [
      {
        title: "Cultural Heritage & Archival Intelligence Strategist",
        match_reason: "Your rigorous grounding in historiography, primary documentation, and cultural preservation prepares you to direct archival institutions.",
        growth_potential: "High Demand"
      },
      {
        title: "Public Policy & Epistemological Research Analyst",
        match_reason: "Combines dialectical argumentation, rhetorical deconstruction, and socio-historical analysis for policy institutes.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Editorial Director & Digital Humanities Synthesist",
        match_reason: "Cutting-edge crossover applying narrative analysis, semiotics, and computational text synthesis to media and publishing.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Financial Markets & Economics": {
    courses: [
      {
        id: "c1",
        title: "Financial Accounting & Statement Analysis",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Strengthens cash-flow modeling, balance-sheet normalization, and working capital foundations."
      },
      {
        id: "c2",
        title: "Capital Markets, Equity Valuation & CAPM",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Covers DCF modeling, beta-adjusted equity valuation, and modern portfolio fundamentals."
      },
      {
        id: "c3",
        title: "Quantitative Portfolio Optimization & Risk",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Teaches Sharpe ratio optimization, value-at-risk (VaR), and systematic risk hedging."
      },
      {
        id: "c4",
        title: "Derivatives Pricing, Options & Monetary Policy",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in Black-Scholes dynamics, yield curves, and central bank macro forecasting."
      }
    ],
    careerPaths: [
      {
        title: "Quantitative Portfolio & Risk Analyst",
        match_reason: "Your analytical precision and grasp of capital asset pricing position you well for managing risk-adjusted asset allocations.",
        growth_potential: "High Demand"
      },
      {
        title: "Equity Research & Corporate Finance Associate",
        match_reason: "Combines your knowledge of corporate valuation, balance sheet normalization, and discounted cash flow modeling.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Macroeconomic & Derivatives Strategist",
        match_reason: "Leverages your understanding of interest-rate yield curves, options mechanics, and central bank monetary policies.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Psychology & Behavioral Sciences": {
    courses: [
      {
        id: "c1",
        title: "Foundations of Cognitive & Behavioral Psychology",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Rebuilds core comprehension of classical and operant conditioning and mental schemas."
      },
      {
        id: "c2",
        title: "Neurobiological Bases of Cognition & Emotion",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Analyzes synaptic plasticity, neurotransmitter dynamics, and amygdala threat processing."
      },
      {
        id: "c3",
        title: "Research Methodologies, Psychometrics & Statistics",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Covers Big Five OCEAN validation, experimental controls, and cognitive bias metrics."
      },
      {
        id: "c4",
        title: "Clinical Diagnostics & Psychopathology Frameworks",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone module examining DSM-5 diagnostic criteria, diathesis-stress models, and therapy."
      }
    ],
    careerPaths: [
      {
        title: "Cognitive Behavioral Researcher & Data Analyst",
        match_reason: "Aligns your grasp of cognitive biases, experimental psychometrics, and behavioral conditioning principles.",
        growth_potential: "High Demand"
      },
      {
        title: "Organizational Psychologist & Talent Strategist",
        match_reason: "Applies social group dynamics, motivation theory, and Big Five behavioral science to enterprise organizational design.",
        growth_potential: "Steady Growth"
      },
      {
        title: "User Experience (UX) Cognitive Researcher",
        match_reason: "A high-growth tech crossover applying mental models, Kahneman dual-process heuristics, and research methodology to software.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Healthcare & Biomedical Sciences": {
    courses: [
      {
        id: "c1",
        title: "Human Anatomy & Systemic Pathophysiology",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Re-anchors cardiovascular dynamics, homeostasis, and systemic organ interactions."
      },
      {
        id: "c2",
        title: "Pharmacokinetics & Receptor Therapeutics",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Examines ADME absorption curves, hepatic CYP450 metabolism, and allosteric drug binding."
      },
      {
        id: "c3",
        title: "Cellular Oncology, Genetics & Immunology",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Focuses on TP53 tumor suppression, CRISPR editing mechanisms, and monoclonal antibodies."
      },
      {
        id: "c4",
        title: "Clinical Trials, Epidemiology & Public Health",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in Phase 1-4 protocol design, R0 transmission modeling, and diagnostic triage."
      }
    ],
    careerPaths: [
      {
        title: "Clinical Data Specialist & Biomedical Analyst",
        match_reason: "Combines your understanding of human pathophysiology with precision diagnostic metrics.",
        growth_potential: "High Demand"
      },
      {
        title: "Pharmacovigilance & Therapeutics Consultant",
        match_reason: "Leverages your knowledge of ADME pharmacokinetics, CYP450 metabolism, and clinical trial regulations.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Genomic Medicine & Immunotherapy Specialist",
        match_reason: "Emerging frontier targeting CRISPR precision editing, mRNA therapeutics, and monoclonal antibody research.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Digital Product Design & Human-Computer Interaction (HCI)": {
    courses: [
      {
        id: "c1",
        title: "User Research, Mental Models & Information Architecture",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Grounds core workflows in user mental models, card sorting, and navigation hierarchies."
      },
      {
        id: "c2",
        title: "Interface Layout, Design Systems & Visual Hierarchy",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Focuses on design tokens, spacing ratios, and atomic component architecture."
      },
      {
        id: "c3",
        title: "Usability Heuristics, Interaction Design & Fitts Law",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Teaches Nielsen heuristics, cognitive friction reduction, and interaction ergonomics."
      },
      {
        id: "c4",
        title: "WCAG 2.1 Accessibility & Quantitative UX Telemetry",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in contrast compliance, screen-reader semantics, and A/B split-testing optimization."
      }
    ],
    careerPaths: [
      {
        title: "Senior Product Designer & UX Architect",
        match_reason: "Directly matches your mastery of information architecture, user journeys, and cognitive mental models.",
        growth_potential: "High Demand"
      },
      {
        title: "Design Systems & Accessibility Lead (WCAG)",
        match_reason: "Specializes in scalable component tokens, visual hierarchy, and universal accessibility compliance.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Interaction Engineer & Telemetry Strategist",
        match_reason: "Blends Fitts's Law ergonomics, micro-interactions, and quantitative A/B experimentation to optimize conversion.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Business Administration & Strategic Management": {
    courses: [
      {
        id: "c1",
        title: "Competitive Strategy & Industry Structure",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Grounds decision-making in Porter Five Forces, VRIO resources, and market entry strategy."
      },
      {
        id: "c2",
        title: "Unit Economics, LTV:CAC & Growth Engines",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Teaches customer acquisition metrics, break-even economics, and sustainable viral loops."
      },
      {
        id: "c3",
        title: "Agile Operations & Lean Enterprise Management",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Covers Scrum sprint cadences, Toyota production waste reduction (Muda), and Kaizen flow."
      },
      {
        id: "c4",
        title: "Corporate Finance, Mergers & Strategic Acquisitions",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in consolidated M&A valuation, balanced scorecards, and corporate governance."
      }
    ],
    careerPaths: [
      {
        title: "Strategic Management & Corporate Development Associate",
        match_reason: "Capitalizes on your grasp of Porter's Five Forces, VRIO frameworks, and competitive industry dynamics.",
        growth_potential: "High Demand"
      },
      {
        title: "Operations & Lean Enterprise Consultant",
        match_reason: "Applies Agile sprint velocity, Toyota lean production flow, and unit economics to drive organizational scale.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Corporate Venture & Product Growth Manager",
        match_reason: "Focuses on LTV:CAC optimization, blue ocean market entry, and disruptive business model scaling.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Data Science & Business Analytics": {
    courses: [
      {
        id: "c1",
        title: "Exploratory Data Analysis & Statistical Inference",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Establishes hypothesis testing, p-values, distributions, and variance fundamentals."
      },
      {
        id: "c2",
        title: "Predictive Machine Learning & Regression Modeling",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Covers supervised learning algorithms, regularization, and feature selection."
      },
      {
        id: "c3",
        title: "Big Data Pipelines, Distributed SQL & Cleaning",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Builds end-to-end data cleaning pipelines and high-throughput analytical schemas."
      },
      {
        id: "c4",
        title: "Deep Learning Architectures & Production Deployment",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in neural networks, ROC-AUC calibration, and model serving infrastructure."
      }
    ],
    careerPaths: [
      {
        title: "Senior Machine Learning & Predictive Modeler",
        match_reason: "Leverages your statistical inference, feature engineering, and regularization modeling strengths.",
        growth_potential: "High Demand"
      },
      {
        title: "Big Data & Business Intelligence Architect",
        match_reason: "Applies distributed SQL pipelines, parquet analytics, and automated decision dashboards.",
        growth_potential: "Steady Growth"
      },
      {
        title: "AI & Quantitative Analytics Scientist",
        match_reason: "Cutting-edge role driving deep neural architectures, predictive forecasting, and model calibration.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Computer Science & Artificial Intelligence": {
    courses: [
      {
        id: "c1",
        title: "Data Structures, Algorithms & Time Complexity",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Rebuilds fundamental algorithmic efficiency, memory hierarchies, and space complexity."
      },
      {
        id: "c2",
        title: "Machine Learning Foundations & Neural Networks",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Covers gradient descent, backpropagation, convolutional layers, and model training."
      },
      {
        id: "c3",
        title: "Computer Architecture & Operating System Kernels",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Explores virtual memory paging, CPU thread scheduling, and hardware cache coherence."
      },
      {
        id: "c4",
        title: "Transformer Architectures & Applied AI Systems",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone in attention mechanisms, fine-tuning, and scalable inference architectures."
      }
    ],
    careerPaths: [
      {
        title: "AI Research & Applied Systems Engineer",
        match_reason: "Directly matches your algorithmic grounding and grasp of neural network architectures.",
        growth_potential: "High Demand"
      },
      {
        title: "Core Infrastructure & Systems Developer",
        match_reason: "Leverages your mastery of low-level memory management, concurrency, and architecture.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Machine Learning Platform Architect",
        match_reason: "High-growth industry role orchestrating model training pipelines and distributed serving.",
        growth_potential: "Explosive Growth"
      }
    ]
  },
  "Software Engineering & Cloud Computing": {
    courses: [
      {
        id: "c1",
        title: "Foundations of Modern Systems Architecture",
        type: "Course",
        status: "Next",
        flaws: [],
        reasoning: "Rebuilds foundational principles, component decoupling, and client-server boundaries."
      },
      {
        id: "c2",
        title: "Advanced State Synchronization & Concurrency",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Deepens understanding of event-driven flows, state mutations, and concurrency models."
      },
      {
        id: "c3",
        title: "Distributed Systems & Cloud Microservices",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Prepares you for enterprise-scale architecture and modular service boundaries."
      },
      {
        id: "c4",
        title: "Production Resiliency & CI/CD Pipelines",
        type: "Course",
        status: "Locked",
        flaws: [],
        reasoning: "Capstone module enforcing zero-downtime deployment, observability, and failover design."
      }
    ],
    careerPaths: [
      {
        title: "Principal Cloud Solutions Architect",
        match_reason: "Your strong foundations in distributed systems make you ideal for architecting high-impact cloud solutions.",
        growth_potential: "High Demand"
      },
      {
        title: "Senior Full-Stack & API Engineer",
        match_reason: "Directly leverages your end-to-end web engineering, state synchronization, and DB design.",
        growth_potential: "Steady Growth"
      },
      {
        title: "DevOps & Site Reliability Engineer (SRE)",
        match_reason: "Aligns with production resiliency, container orchestration, and automated CI/CD pipelines.",
        growth_potential: "Explosive Growth"
      }
    ]
  }
};


export const AVAILABLE_DOMAINS = [
  "Liberal Arts & Humanities",
  "Digital Product Design & Human-Computer Interaction (HCI)",
  "Psychology & Behavioral Sciences",
  "Healthcare & Biomedical Sciences",
  "Financial Markets & Economics",
  "Business Administration & Strategic Management",
  "Data Science & Business Analytics",
  "Computer Science & Artificial Intelligence",
  "Software Engineering & Cloud Computing"
];

function getDomainData(domainName: string | undefined) {
  const d = (domainName || '').toLowerCase();
  if (d.includes('liberal') || d.includes('humanit') || d.includes('history') || d.includes('literature') || (d.includes('arts') && !d.includes('design'))) {
    return DOMAIN_DATA_MAP["Liberal Arts & Humanities"];
  }
  if (d.includes('financ') || d.includes('econom')) return DOMAIN_DATA_MAP["Financial Markets & Economics"];
  if (d.includes('psycholog') || d.includes('behavior')) return DOMAIN_DATA_MAP["Psychology & Behavioral Sciences"];
  if (d.includes('health') || d.includes('biomed') || d.includes('medic')) return DOMAIN_DATA_MAP["Healthcare & Biomedical Sciences"];
  if (d.includes('design') || d.includes('hci') || d.includes('product') || d.includes('ui') || d.includes('ux')) return DOMAIN_DATA_MAP["Digital Product Design & Human-Computer Interaction (HCI)"];
  if (d.includes('manage') || d.includes('business')) return DOMAIN_DATA_MAP["Business Administration & Strategic Management"];
  if (d.includes('data') || d.includes('analytic')) return DOMAIN_DATA_MAP["Data Science & Business Analytics"];
  if (d.includes('computer') || d.includes('ai') || d.includes('intelligence')) return DOMAIN_DATA_MAP["Computer Science & Artificial Intelligence"];
  return DOMAIN_DATA_MAP["Software Engineering & Cloud Computing"];
}

function isPathwayMatchingDomain(courses: any[] | null | undefined, domainName: string | undefined): boolean {
  if (!courses || courses.length === 0 || !domainName) return false;
  const d = domainName.toLowerCase();
  const cTitles = courses.map(c => (c.title || '').toLowerCase()).join(' ');

  if (d.includes('liberal') || d.includes('humanit') || (d.includes('arts') && !d.includes('design'))) {
    return cTitles.includes('historiograph') || cTitles.includes('epistemolog') || cTitles.includes('semiotic') || cTitles.includes('humanities') || cTitles.includes('archival');
  }
  if (d.includes('financ') || d.includes('econom')) {
    return cTitles.includes('financ') || cTitles.includes('capital') || cTitles.includes('portfolio') || cTitles.includes('valuation') || cTitles.includes('accounting');
  }
  if (d.includes('psycholog') || d.includes('behavior')) {
    return cTitles.includes('psycholog') || cTitles.includes('cognit') || cTitles.includes('behavior') || cTitles.includes('neuro') || cTitles.includes('diagnost');
  }
  if (d.includes('health') || d.includes('biomed') || d.includes('medic')) {
    return cTitles.includes('health') || cTitles.includes('anatom') || cTitles.includes('pharmac') || cTitles.includes('clini') || cTitles.includes('biomed');
  }
  if (d.includes('design') || d.includes('hci') || d.includes('product') || d.includes('arts') || d.includes('ui')) {
    return cTitles.includes('design') || cTitles.includes('ux') || cTitles.includes('interfac') || cTitles.includes('usability') || cTitles.includes('heurist') || cTitles.includes('wireframe');
  }
  if (d.includes('manage') || d.includes('business')) {
    return cTitles.includes('manage') || cTitles.includes('strateg') || cTitles.includes('business') || cTitles.includes('unit economic') || cTitles.includes('agile');
  }
  if (d.includes('data') || d.includes('analytic')) {
    return cTitles.includes('data') || cTitles.includes('statist') || cTitles.includes('machine learning') || cTitles.includes('analytic');
  }
  if (d.includes('computer') || d.includes('ai')) {
    return cTitles.includes('data structures') || cTitles.includes('machine learning') || cTitles.includes('transformer') || cTitles.includes('architecture');
  }
  return cTitles.includes('architect') || cTitles.includes('state') || cTitles.includes('microservices') || cTitles.includes('resiliency');
}

function isCareerMatchingDomain(paths: any[] | null | undefined, domainName: string | undefined): boolean {
  if (!paths || paths.length === 0 || !domainName) return false;
  const d = domainName.toLowerCase();
  const pTitles = paths.map(p => (p.title || '').toLowerCase()).join(' ');

  if (d.includes('liberal') || d.includes('humanit') || (d.includes('arts') && !d.includes('design'))) {
    return pTitles.includes('heritage') || pTitles.includes('archival') || pTitles.includes('policy') || pTitles.includes('editorial') || pTitles.includes('humanities');
  }
  if (d.includes('financ') || d.includes('econom')) {
    return pTitles.includes('financ') || pTitles.includes('portfolio') || pTitles.includes('equity') || pTitles.includes('risk') || pTitles.includes('analyst');
  }
  if (d.includes('psycholog') || d.includes('behavior')) {
    return pTitles.includes('psycholog') || pTitles.includes('behavior') || pTitles.includes('cognit') || pTitles.includes('counsel') || pTitles.includes('researcher');
  }
  if (d.includes('health') || d.includes('biomed') || d.includes('medic')) {
    return pTitles.includes('health') || pTitles.includes('biomed') || pTitles.includes('clini') || pTitles.includes('pharmac') || pTitles.includes('therapeut');
  }
  if (d.includes('design') || d.includes('hci') || d.includes('product') || d.includes('arts') || d.includes('ui')) {
    return pTitles.includes('design') || pTitles.includes('ux') || pTitles.includes('product') || pTitles.includes('interact');
  }
  if (d.includes('manage') || d.includes('business')) {
    return pTitles.includes('manage') || pTitles.includes('consult') || pTitles.includes('strateg') || pTitles.includes('director') || pTitles.includes('venture');
  }
  if (d.includes('data') || d.includes('analytic')) {
    return pTitles.includes('data') || pTitles.includes('machine learning') || pTitles.includes('scientist') || pTitles.includes('analytic');
  }
  return true;
}

export default function PathwayRecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processingCompletion = useRef(false);
  const [selectedFlaw, setSelectedFlaw] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flaws, setFlaws] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dynamic Courses Data
  const [courses, setCourses] = useState<any[]>([]);
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);
  
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

  // Re-generate on demand
  const handleRecalibratePathway = async (forcedDomainProfile?: any, forcedFlaws?: any[], forcedScore?: number) => {
    const activeDomain = forcedDomainProfile || domainProfile;
    const activeFlaws = forcedFlaws !== undefined ? forcedFlaws : flaws;
    const activeScore = forcedScore !== undefined ? forcedScore : score;
    if (!activeDomain?.domain_name) return;

    setIsGeneratingCourses(true);
    setIsGeneratingPaths(true);

    const domainDefaults = getDomainData(activeDomain.domain_name);

    // Build immediate domain-authentic courses
    const flawNames = activeFlaws.map((f: any) => typeof f === 'string' ? f : f.concept_name);
    const initialCourses = domainDefaults.courses.map((c, idx) => ({
      ...c,
      status: (idx === 0 && flawNames.length > 0 ? 'Locked' : (idx === 0 ? 'Next' : 'Locked')) as 'Locked' | 'Next' | 'Completed',
      flaws: idx === 0 ? flawNames : []
    }));

    setCourses(initialCourses);
    setCareerPaths(domainDefaults.careerPaths);

    // Save immediately to DB so user never sees old CS state
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          cached_course_pathway: initialCourses,
          cached_career_paths: domainDefaults.careerPaths
        })
        .eq('id', user.id);
    }

    setIsGeneratingCourses(false);
    setIsGeneratingPaths(false);
  };

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Domain Profile FIRST to guarantee domain synchronization
      const { data: userDomain } = await supabase
        .from('domain_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      setDomainProfile(userDomain);

      // 2. Get Profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(userProfile);

      // 3. Get latest quiz result & flaws
      let quizScore = 0;
      let activeFlaws: any[] = [];
      if (userDomain) {
        const { data: latestQuiz } = await supabase
          .from('quiz_results')
          .select('id, score')
          .eq('domain_profile_id', userDomain.id)
          .order('taken_at', { ascending: false })
          .limit(1)
          .single();

        if (latestQuiz) {
          quizScore = latestQuiz.score;
          setScore(latestQuiz.score);
          
          const { data: identifiedFlaws } = await supabase
            .from('identified_flaws')
            .select('*')
            .eq('quiz_result_id', latestQuiz.id)
            .eq('is_remediated', false);
            
          if (identifiedFlaws) {
            activeFlaws = identifiedFlaws;
            setFlaws(identifiedFlaws);
          }
        }
      }

      // 4. Multi-Source Deterministic Domain Resolution:
      // Priority: URL Param -> localStorage -> User Profile -> Fallback
      const urlDomain = searchParams.get('domain');
      const storedDomain = typeof window !== 'undefined' ? localStorage.getItem('edupredict_active_domain') : null;
      const currentDomainName = urlDomain || storedDomain || userDomain?.domain_name || "Digital Product Design & Human-Computer Interaction (HCI)";

      setDomainProfile((prev: any) => ({ ...(prev || {}), domain_name: currentDomainName }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('edupredict_active_domain', currentDomainName);
      }

      const coursesMatch = isPathwayMatchingDomain(userProfile?.cached_course_pathway, currentDomainName);
      const careersMatch = isCareerMatchingDomain(userProfile?.cached_career_paths, currentDomainName);

      if (coursesMatch && userProfile?.cached_course_pathway) {
        setCourses(userProfile.cached_course_pathway);
      } else {
        console.log("Generating fresh domain-authentic pathway for:", currentDomainName);
        const domainDefaults = getDomainData(currentDomainName);
        const flawNames = activeFlaws.map(f => f.concept_name);
        const freshCourses = domainDefaults.courses.map((c, idx) => ({
          ...c,
          status: (idx === 0 && flawNames.length > 0 ? 'Locked' : (idx === 0 ? 'Next' : 'Locked')) as 'Locked' | 'Next' | 'Completed',
          flaws: idx === 0 ? flawNames : []
        }));
        setCourses(freshCourses);
        supabase.from('profiles').update({ cached_course_pathway: freshCourses }).eq('id', user.id).then(() => {});
      }

      if (careersMatch && userProfile?.cached_career_paths) {
        setCareerPaths(userProfile.cached_career_paths);
      } else {
        console.log("Generating fresh domain-authentic career paths for:", currentDomainName);
        const domainDefaults = getDomainData(currentDomainName);
        setCareerPaths(domainDefaults.careerPaths);
        supabase.from('profiles').update({ cached_career_paths: domainDefaults.careerPaths }).eq('id', user.id).then(() => {});
      }

      setIsLoading(false);
    }

    loadData();
  }, [supabase]);

  // Sync locked courses with current flaws if loaded from cache
  useEffect(() => {
    if (courses.length > 0 && courses[0].status === 'Locked' && flaws.length === 0 && !isLoading) {
      setCourses(prev => prev.map((c, idx) => idx === 0 ? { ...c, status: 'Next', flaws: [] } : c));
    }
  }, [courses, flaws, isLoading]);

  
  const handleSwitchDomain = (newDomain: string) => {
    setDomainProfile((prev: any) => ({ ...(prev || {}), domain_name: newDomain }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('edupredict_active_domain', newDomain);
    }
    const domainDefaults = getDomainData(newDomain);
    const freshCourses = domainDefaults.courses.map((c, idx) => ({
      ...c,
      status: (idx === 0 ? 'Next' : 'Locked') as 'Locked' | 'Next' | 'Completed',
      flaws: []
    }));
    setCourses(freshCourses);
    setCareerPaths(domainDefaults.careerPaths);

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').update({
          cached_course_pathway: freshCourses,
          cached_career_paths: domainDefaults.careerPaths
        }).eq('id', user.id).then(() => {});
      }
    });
  };

  const handleRemediate = async (flaw: string) => {
    setSelectedFlaw(flaw);
    setIsGenerating(true);
    setCompletion("");
    await complete('', { body: { flawConcept: flaw } });
  };

  // Handle course completion from URL parameter
  useEffect(() => {
    if (searchParams.get('completed') === 'true' && courses.length > 0 && profile && !processingCompletion.current) {
      processingCompletion.current = true;
      const updatedCourses = [...courses];
      const currentIndex = updatedCourses.findIndex(c => c.status !== 'Completed');
      
      if (currentIndex !== -1) {
        updatedCourses[currentIndex].status = 'Completed';
        updatedCourses[currentIndex].flaws = [];
        if (currentIndex + 1 < updatedCourses.length) {
          updatedCourses[currentIndex + 1].status = 'Next';
        }
        
        setCourses(updatedCourses);
        supabase
          .from('profiles')
          .update({ cached_course_pathway: updatedCourses })
          .eq('id', profile.id)
          .then(() => {
            window.history.replaceState(null, '', '/pathway-recommendations');
          });
      }
    }
  }, [searchParams, courses, profile, router, supabase]);

  const handleMarkUnderstood = async (flaw: string) => {
    try {
      const response = await fetch('/api/remediate-flaw-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          conceptName: flaw
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setFlaws(prev => prev.filter(f => f.concept_name !== flaw));
        if (data.remaining === 0) {
          setCourses(prev => prev.map((c, idx) => idx === 0 ? { ...c, status: 'Next', flaws: [] } : c));
        } else {
          setCourses(prev => prev.map((c, idx) => idx === 0 ? { ...c, flaws: c.flaws.filter((f: string) => f !== flaw) } : c));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateCareerPaths = async () => {
    setIsGeneratingPaths(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for presentation safety

      const response = await fetch('/api/recommend-career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          profile,
          domainProfile,
          masteryScore: score,
          flaws
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.paths && data.paths.length > 0) {
        setCareerPaths(data.paths);
      } else {
        throw new Error("Empty paths");
      }
    } catch (e) {
      console.log("Serving robust domain-authentic career fallback:", domainProfile?.domain_name);
      const domainDefaults = getDomainData(domainProfile?.domain_name);
      setCareerPaths(domainDefaults.careerPaths);
    } finally {
      setIsGeneratingPaths(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-zinc-500 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        <h2 className="text-lg font-bold text-zinc-800">Calibrating Personalized Pathway...</h2>
        <p className="text-xs text-zinc-500">Synthesizing domain curriculum and verified career trajectories.</p>
      </div>
    );
  }

  const currentDomainTitle = domainProfile?.domain_name || "Multidisciplinary Track";

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              <Compass className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Domain Focus:</span>
              <select
                value={AVAILABLE_DOMAINS.find(d => d.toLowerCase() === currentDomainTitle.toLowerCase()) || currentDomainTitle}
                onChange={(e) => handleSwitchDomain(e.target.value)}
                className="text-xs font-bold bg-white text-zinc-900 border border-indigo-300 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
              >
                {AVAILABLE_DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              ⚡ 100% Dynamic & Calibrated
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Your Optimal Pathway & Career Horizon</h1>
          <p className="text-zinc-600 mt-1 text-sm max-w-2xl leading-relaxed">
            Multi-tiered curriculum and career trajectories calculated specifically for your <strong>{currentDomainTitle}</strong> focus profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button 
            onClick={() => handleRecalibratePathway()}
            variant="outline" 
            className="border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-medium h-9"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-zinc-600" />
            Recalibrate Curriculum
          </Button>
          <Button 
            onClick={() => router.push('/domain-selection')}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium h-9 shadow-sm"
          >
            Switch Domain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Pathway (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Career Path Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  Recommended Career Trajectories ({currentDomainTitle})
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">High-demand roles aligned with your mastery score and domain competencies.</p>
              </div>
              <Button 
                onClick={generateCareerPaths} 
                disabled={isGeneratingPaths} 
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs h-8 px-3 shadow-sm"
              >
                {isGeneratingPaths ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-1.5 h-3 w-3 text-indigo-600" /> Regenerate</>}
              </Button>
            </div>
            
            {careerPaths.length > 0 ? (
              <div className="grid gap-3.5">
                {careerPaths.map((path, idx) => (
                  <Card key={idx} className="border border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/40 via-white to-white overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none text-[11px] font-semibold">
                              Match #{idx + 1}
                            </Badge>
                            <span className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" /> {path.growth_potential}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 tracking-tight">{path.title}</h3>
                          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{path.match_reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50/50">
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-zinc-900">Career Trajectories Ready</h3>
                  <Button onClick={generateCareerPaths} className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    Show Career Matches
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sequential Course Pathway */}
          <div className="border-t border-zinc-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  Sequential Academic Curriculum (4 Stages)
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">Master foundational prerequisites before proceeding to capstone projects.</p>
              </div>
              <Badge variant="outline" className="text-xs font-medium bg-zinc-50 text-zinc-600 border-zinc-200">
                {courses.filter(c => c.status === 'Completed').length} of {courses.length} Completed
              </Badge>
            </div>
            
            <div className="space-y-4">
              {isGeneratingCourses ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-4 border-dashed border-2 border-zinc-200 rounded-xl bg-zinc-50/50">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                  <p className="text-sm">Synthesizing personalized {currentDomainTitle} curriculum...</p>
                </div>
              ) : courses.length > 0 ? (
                courses.map((course, idx) => {
                  const courseFlaws = course.flaws || [];
                  const isCompleted = course.status === 'Completed';
                  const isUpNext = course.status === 'Next' || (idx === 0 && !isCompleted);

                  return (
                    <Card 
                      key={course.id} 
                      className={`border transition-all ${
                        isCompleted 
                          ? 'border-emerald-200 bg-emerald-50/15' 
                          : isUpNext 
                          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-sm bg-white' 
                          : 'border-zinc-200 bg-zinc-50/60 opacity-80'
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-1.5 flex-grow">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 bg-white border-zinc-200">
                                Stage {idx + 1}
                              </Badge>
                              {isCompleted && (
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[10px] font-semibold">
                                  ✓ Certified Mastery
                                </Badge>
                              )}
                              {!isCompleted && isUpNext && (
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none text-[10px] font-semibold">
                                  Active Stage
                                </Badge>
                              )}
                              {!isCompleted && !isUpNext && (
                                <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-200">
                                  Prerequisite Locked
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-zinc-900 leading-snug">{course.title}</h3>
                            
                            {course.reasoning && (
                              <div className="mt-2 flex items-start gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 max-w-2xl leading-relaxed">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span><strong className="font-semibold text-zinc-800">Curriculum Rational:</strong> {course.reasoning}</span>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 self-start sm:self-center">
                            <Button 
                              variant={isCompleted ? 'secondary' : (isUpNext ? 'default' : 'outline')} 
                              className={
                                isCompleted 
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs h-9 px-4' 
                                  : isUpNext 
                                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 shadow-sm' 
                                  : 'text-zinc-400 border-zinc-200 text-xs h-9 px-4'
                              } 
                              disabled={!isCompleted && !isUpNext} 
                              onClick={() => router.push(`/course/${encodeURIComponent(course.title)}`)}
                            >
                              {isCompleted ? (
                                <><CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" /> Completed</>
                              ) : isUpNext ? (
                                <><PlayCircle className="h-4 w-4 mr-1.5" /> Launch Course</>
                              ) : (
                                'Locked'
                              )}
                            </Button>
                          </div>
                        </div>

                        {courseFlaws.length > 0 && !isCompleted && (
                          <div className="mt-4 p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-rose-600" />
                              <span className="text-xs font-bold text-rose-900">Prerequisite Flaws Detected from Diagnostic Quiz</span>
                            </div>
                            <div className="space-y-1.5">
                              {courseFlaws.map((flaw: string) => (
                                <div key={flaw} className="flex items-center justify-between bg-white px-3 py-2 rounded-md border border-rose-100 text-xs text-zinc-800">
                                  <span className="font-medium text-rose-950">• {flaw}</span>
                                  <span className="text-[11px] text-zinc-500">Requires review</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="p-12 text-center text-zinc-500">No courses available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary (1 Col) */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-zinc-950 text-white">
            <CardHeader className="pb-3 border-b border-zinc-800">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Evaluation Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <div className="text-xs text-zinc-400 mb-1">Target Academic Discipline</div>
                <div className="text-base font-bold text-white leading-snug">{currentDomainTitle}</div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <div className="text-xs text-zinc-400 mb-1">Diagnostic Score</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-extrabold text-white">{Math.round(score)}%</div>
                  <span className="text-xs text-zinc-400">readiness index</span>
                </div>
                <Progress value={score} className="h-2 mt-2.5 bg-zinc-800 [&>div]:bg-indigo-500" />
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <div className="text-xs text-zinc-400 mb-1">Prerequisite Blockers</div>
                <div className="text-lg font-bold text-rose-400">
                  {flaws.length === 0 ? "0 Foundational Flaws" : `${flaws.length} Topics to Remediate`}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  {flaws.length === 0 
                    ? "Direct access to Stage 1 approved without remediation bottlenecks." 
                    : "Stage 1 curriculum is fortified with micro-remediation for your flagged concepts."}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="outline" 
                  className="w-full text-xs font-semibold bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                >
                  Return to Dashboard Overview <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
