"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const DOMAINS = [
  { id: 'Computer Engineering', title: 'Computer Engineering' },
  { id: 'Artificial Intelligence', title: 'Artificial Intelligence' },
  { id: 'Data Science', title: 'Data Science' },
  { id: 'Business Administration', title: 'Business Administration' },
  { id: 'Economics', title: 'Economics' },
  { id: 'Psychology', title: 'Psychology' },
  { id: 'Mechanical Engineering', title: 'Mechanical Engineering' },
  { id: 'Fine Arts', title: 'Fine Arts' },
  { id: 'Physics', title: 'Physics' },
  { id: 'Literature', title: 'Literature' }
];

const PRIOR_KNOWLEDGE_OPTIONS = [
  "Python", "JavaScript/TypeScript", "C/C++", "React/Next.js", 
  "SQL Databases", "Machine Learning Basics", "Git/Version Control", "System Design"
];

const CAREER_GOALS = [
  "Software Engineer", "Data Scientist", "Systems Architect", 
  "Machine Learning Engineer", "Product Manager", "Academic/Researcher"
];

export default function OnboardingPage() {
  const [academicLevel, setAcademicLevel] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [targetDomain, setTargetDomain] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [priorKnowledge, setPriorKnowledge] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>('');
  
  // New Comprehensive Fields
  const [grade10, setGrade10] = useState<string>('');
  const [grade12, setGrade12] = useState<string>('');
  const [currentDegree, setCurrentDegree] = useState<string>('');
  const [currentCgpa, setCurrentCgpa] = useState<string>('');
  const [hobbiesInput, setHobbiesInput] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const toggleArrayItem = (item: string, currentArray: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, limit: number) => {
    if (currentArray.includes(item)) {
      setArray(currentArray.filter(i => i !== item));
    } else {
      if (currentArray.length >= limit) {
        toast({ title: "Limit reached", description: `You can select up to ${limit} options.`, variant: "destructive" });
        return;
      }
      setArray([...currentArray, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicLevel || !targetDomain || !timeCommitment) {
      toast({ title: "Required Fields Missing", description: "Please ensure you have selected your Academic Level, Target Domain, and Time Commitment.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Error", description: "User session not found.", variant: "destructive" });
      router.push('/login');
      return;
    }

    // Insert the domain profile (Foundational Competency Initialization)
    const { error: domainError } = await supabase
      .from('domain_profiles')
      .insert({
        user_id: user.id,
        domain_name: targetDomain,
        current_competency_level: 'Beginner' // We'll infer a better baseline via diagnostic later
      });

    if (domainError) {
      toast({ title: "Submission Failed", description: domainError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    // Parse Hobbies
    const hobbiesArray = hobbiesInput.split(',').map(h => h.trim()).filter(Boolean);

    // Update the extended user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        academic_level: academicLevel,
        institution_name: institution,
        career_goals: selectedGoals,
        prior_knowledge: priorKnowledge,
        time_commitment: timeCommitment,
        grade_10_percent: grade10 ? parseFloat(grade10) : null,
        grade_12_percent: grade12 ? parseFloat(grade12) : null,
        current_degree: currentDegree || null,
        current_cgpa: currentCgpa ? parseFloat(currentCgpa) : null,
        interests_hobbies: hobbiesArray,
        onboarding_completed: true
      })
      .eq('id', user.id);

    if (profileError) {
      toast({ title: "Submission Failed", description: profileError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    toast({ title: "Profile Complete!", description: "Generating your personalized diagnostic assessment..." });
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Target Domain (Mandatory) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">1. Target Academic Domain <span className="text-red-500">*</span></h3>
          <p className="text-sm text-zinc-500">What specific subject area are you trying to master right now?</p>
        </div>
        <RadioGroup value={targetDomain} onValueChange={setTargetDomain} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOMAINS.map((domain) => (
            <Label
              key={domain.id}
              htmlFor={domain.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                targetDomain === domain.id ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <RadioGroupItem value={domain.id} id={domain.id} className="mr-3" />
              <span className="font-medium text-sm">{domain.title}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Academic Level (Mandatory) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">2. Current Academic Level <span className="text-red-500">*</span></h3>
          <p className="text-sm text-zinc-500">Helps us adjust the difficulty baseline of assessments.</p>
        </div>
        <RadioGroup value={academicLevel} onValueChange={setAcademicLevel} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["High School", "Undergraduate", "Graduate / Masters", "Professional / Bootcamps"].map((level) => (
            <Label
              key={level}
              htmlFor={level}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                academicLevel === level ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <RadioGroupItem value={level} id={level} className="mr-3" />
              <span className="font-medium text-sm">{level}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Time Commitment (Mandatory) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">3. Weekly Time Commitment <span className="text-red-500">*</span></h3>
          <p className="text-sm text-zinc-500">How many hours a week can you dedicate to learning?</p>
        </div>
        <RadioGroup value={timeCommitment} onValueChange={setTimeCommitment} className="flex flex-wrap gap-4">
          {["0-5 hours", "5-10 hours", "10-20 hours", "20+ hours"].map((time) => (
            <Label
              key={time}
              htmlFor={time}
              className={`flex-1 min-w-[140px] text-center p-3 border rounded-lg cursor-pointer transition-colors ${
                timeCommitment === time ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <RadioGroupItem value={time} id={time} className="sr-only" />
              <span className="font-medium text-sm">{time}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Comprehensive Academic Profile */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">4. Comprehensive Academic Profile (Optional)</h3>
          <p className="text-sm text-zinc-500 mb-4">Provide your past and current academic metrics to help our AI recommend the best career paths.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="grade10">10th Grade Percentage</Label>
            <Input id="grade10" type="number" step="0.1" placeholder="e.g. 92.5" value={grade10} onChange={(e) => setGrade10(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade12">12th Grade Percentage</Label>
            <Input id="grade12" type="number" step="0.1" placeholder="e.g. 88.0" value={grade12} onChange={(e) => setGrade12(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentDegree">Current Degree</Label>
            <Input id="currentDegree" type="text" placeholder="e.g. B.Tech Computer Science" value={currentDegree} onChange={(e) => setCurrentDegree(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentCgpa">Current CGPA (out of 10.0)</Label>
            <Input id="currentCgpa" type="number" step="0.01" placeholder="e.g. 8.4" value={currentCgpa} onChange={(e) => setCurrentCgpa(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institution Name</Label>
            <Input id="institution" type="text" placeholder="e.g. Stanford University" value={institution} onChange={(e) => setInstitution(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Interests & Hobbies */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">5. Interests & Hobbies (Optional)</h3>
          <p className="text-sm text-zinc-500 mb-4">What do you enjoy doing outside of academics? (Comma separated)</p>
          <Input 
            type="text" 
            placeholder="e.g. Photography, Robotics, Open Source, Blogging, Guitar" 
            value={hobbiesInput} 
            onChange={(e) => setHobbiesInput(e.target.value)} 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100">
        <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-base font-semibold shadow-sm" disabled={isSubmitting}>
          {isSubmitting ? "Finalizing Profile..." : "Initialize Diagnostic Profile"}
        </Button>
      </div>
    </form>
  );
}
