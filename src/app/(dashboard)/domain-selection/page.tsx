"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Cpu, 
  Bot, 
  Globe, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Terminal, 
  Sparkles, 
  Target, 
  Briefcase, 
  BookOpen, 
  Rocket, 
  ArrowRight,
  Clock
} from 'lucide-react';

const DOMAINS = [
  {
    id: 'computer-engineering',
    title: 'Computer Engineering',
    category: 'Hardware & Systems',
    description: 'Computer architecture, operating systems, embedded hardware, and low-level memory management.',
    icon: Cpu,
    color: 'from-blue-500/10 to-indigo-500/10'
  },
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence & ML',
    category: 'AI & Data Intelligence',
    description: 'Neural networks, transformer models, machine learning algorithms, and cognitive reasoning.',
    icon: Bot,
    color: 'from-violet-500/10 to-purple-500/10'
  },
  {
    id: 'software-engineering',
    title: 'Full-Stack & Cloud Architecture',
    category: 'Systems & Web',
    description: 'Distributed web platforms, serverless microservices, REST/GraphQL APIs, and system design patterns.',
    icon: Globe,
    color: 'from-sky-500/10 to-blue-500/10'
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    category: 'Data & Statistics',
    description: 'Statistical modeling, predictive algorithms, Pandas/NumPy pipelines, and big data visualization.',
    icon: Database,
    color: 'from-emerald-500/10 to-teal-500/10'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Defense',
    category: 'Security & Infra',
    description: 'Zero-Trust network architecture, cryptography, threat modeling, and web application vulnerability defense.',
    icon: ShieldCheck,
    color: 'from-rose-500/10 to-red-500/10'
  },
  {
    id: 'mobile-development',
    title: 'Mobile App Engineering',
    category: 'Mobile & Client',
    description: 'Native iOS (Swift), Android (Kotlin & Jetpack Compose), and cross-platform reactive UI frameworks.',
    icon: Smartphone,
    color: 'from-amber-500/10 to-orange-500/10'
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Distributed Ledgers',
    category: 'Web3 & Distributed',
    description: 'Smart contracts, consensus mechanisms (PoW/PoS), decentralized state machines, and cryptographic proofs.',
    icon: Layers,
    color: 'from-cyan-500/10 to-blue-500/10'
  },
  {
    id: 'devops',
    title: 'DevOps & Site Reliability',
    category: 'Cloud & Infrastructure',
    description: 'Kubernetes orchestration, Docker containerization, CI/CD automated deployment, and Infrastructure-as-Code.',
    icon: Terminal,
    color: 'from-zinc-500/10 to-slate-500/10'
  }
];

const FOCUS_TRACKS = [
  { id: 'comprehensive', title: 'Degree Mastery & Foundations', desc: 'Thorough coverage of theoretical principles and university exams.', icon: BookOpen },
  { id: 'placement', title: 'Placement & Technical Interviews', desc: 'Optimized for FAANG/MNC coding rounds and system design interviews.', icon: Briefcase },
  { id: 'capstone', title: 'Real-World Project Development', desc: 'Fast-track practical application for building production software.', icon: Rocket }
];

const TIME_COMMITMENTS = [
  { id: '3-5', label: '3-5 hrs / week', desc: 'Balanced' },
  { id: '5-10', label: '5-10 hrs / week', desc: 'Recommended' },
  { id: '15+', label: '15+ hrs / week', desc: 'Intensive' }
];

export default function DomainSelectionPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('computer-engineering');
  const [competency, setCompetency] = useState<string>('Beginner');
  const [focusTrack, setFocusTrack] = useState<string>('placement');
  const [timeCommitment, setTimeCommitment] = useState<string>('5-10');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleSave = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const domainNameStr = DOMAINS.find(d => d.id === selectedDomain)?.title || selectedDomain;
      
      const { data: existing } = await supabase
        .from('domain_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('domain_name', domainNameStr)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('domain_profiles')
          .insert({
            user_id: user.id,
            domain_name: domainNameStr,
            current_competency_level: competency
          });

        if (error) throw error;
      }

      // Also persist the time commitment & target track in the profile
      await supabase
        .from('profiles')
        .update({
          time_commitment: timeCommitment,
          academic_level: competency
        })
        .eq('id', user.id);
      
      toast({
        title: "Domain Configured!",
        description: `Initializing ${domainNameStr} adaptive assessment...`
      });

      router.push(`/quiz/${selectedDomain}`);
    } catch (error: any) {
      console.error(error);
      toast({ title: "Setup Failed", description: error.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="border-b border-zinc-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Academic Calibration Engine
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Domain Configuration</h1>
        <p className="text-zinc-600 mt-1 max-w-2xl text-sm leading-relaxed">
          Select your target academic domain and calibrate your learning objectives. Our AI diagnostic engine will dynamically synthesize an assessment tailored to your parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Domain Selection (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
              Select Academic Focus Domain
            </h2>
            <span className="text-xs text-zinc-500">{DOMAINS.length} Specialized Tracks Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.id;

              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected 
                      ? 'border-indigo-600 bg-gradient-to-br from-indigo-50/70 to-white shadow-md ring-2 ring-indigo-500' 
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-zinc-100 ${isSelected ? 'text-indigo-600 bg-indigo-100/80' : 'text-zinc-600'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-zinc-50 text-zinc-500 border-zinc-200">
                        {domain.category}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-sm text-zinc-900 leading-snug">{domain.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                      {domain.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`}>
                      {isSelected ? '✓ Selected' : 'Click to select'}
                    </span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300'
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Parameters & Calibration (1 Col) */}
        <div className="space-y-6">
          {/* 2. Self-Assessed Competency */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">2</span>
                Baseline Competency Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {[
                { id: 'Beginner', label: 'Beginner', desc: 'Core syntax, fundamentals, & basic abstractions' },
                { id: 'Intermediate', label: 'Intermediate', desc: 'Applied engineering, concurrency, & design patterns' },
                { id: 'Advanced', label: 'Advanced', desc: 'System scalability, distributed edge, & optimization' }
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setCompetency(lvl.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    competency === lvl.id 
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500' 
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <div className={`mt-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    competency === lvl.id ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300'
                  }`}>
                    {competency === lvl.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{lvl.label}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{lvl.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 3. Primary Learning Track */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">3</span>
                Primary Objective Track
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {FOCUS_TRACKS.map((track) => {
                const Icon = track.icon;
                const isSelected = focusTrack === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => setFocusTrack(track.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500' 
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{track.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{track.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 4. Weekly Commitment */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Target Weekly Study Pace
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2">
                {TIME_COMMITMENTS.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setTimeCommitment(time.id)}
                    className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                      timeCommitment === time.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-500'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="block font-semibold">{time.id} hrs</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">{time.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action CTA */}
          <Button 
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold h-12 text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            disabled={!selectedDomain || isLoading}
            onClick={handleSave}
          >
            {isLoading ? "Calibrating Neural Engine..." : "Proceed to Diagnostic Quiz"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
