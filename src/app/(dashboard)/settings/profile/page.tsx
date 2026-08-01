"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings } from 'lucide-react';

const PRIOR_KNOWLEDGE_OPTIONS = [
  "Python", "JavaScript/TypeScript", "C/C++", "React/Next.js", 
  "SQL Databases", "Machine Learning Basics", "Git/Version Control", "System Design"
];

const CAREER_GOALS = [
  "Software Engineer", "Data Scientist", "Systems Architect", 
  "Machine Learning Engineer", "Product Manager", "Academic/Researcher"
];

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [academicLevel, setAcademicLevel] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [priorKnowledge, setPriorKnowledge] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>('');
  
  const [grade10, setGrade10] = useState<string>('');
  const [grade12, setGrade12] = useState<string>('');
  const [currentDegree, setCurrentDegree] = useState<string>('');
  const [currentCgpa, setCurrentCgpa] = useState<string>('');
  const [hobbiesInput, setHobbiesInput] = useState<string>('');
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setAcademicLevel(profile.academic_level || '');
        setInstitution(profile.institution_name || '');
        setSelectedGoals(profile.career_goals || []);
        setPriorKnowledge(profile.prior_knowledge || []);
        setTimeCommitment(profile.time_commitment || '');
        setGrade10(profile.grade_10_percent ? String(profile.grade_10_percent) : '');
        setGrade12(profile.grade_12_percent ? String(profile.grade_12_percent) : '');
        setCurrentDegree(profile.current_degree || '');
        setCurrentCgpa(profile.current_cgpa ? String(profile.current_cgpa) : '');
        setHobbiesInput((profile.interests_hobbies || []).join(', '));
      }
      setIsLoading(false);
    }
    
    fetchProfile();
  }, [supabase, router]);

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
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Error", description: "User session not found.", variant: "destructive" });
      router.push('/login');
      return;
    }

    const hobbiesArray = hobbiesInput.split(',').map(h => h.trim()).filter(Boolean);

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
        // Invalidate cached career paths so AI generates new ones if profile changes significantly
        cached_career_paths: null 
      })
      .eq('id', user.id);

    if (profileError) {
      toast({ title: "Update Failed", description: profileError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    toast({ title: "Profile Updated", description: "Your details have been saved successfully." });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-4"><Loader2 className="animate-spin h-8 w-8 text-indigo-500" /> Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="text-indigo-600 h-8 w-8" />
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Profile Settings</h1>
        </div>
        <p className="text-zinc-500 mt-1 text-lg">Update your academic details and interests.</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8">
          
          {/* Academic Level */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Current Academic Level</h3>
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

          {/* Time Commitment */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Weekly Time Commitment</h3>
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
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Comprehensive Academic Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Interests & Hobbies</h3>
              <p className="text-sm text-zinc-500 mb-4">Comma separated list of hobbies to help the AI recommend paths.</p>
              <Input 
                type="text" 
                placeholder="e.g. Photography, Robotics, Open Source, Blogging, Guitar" 
                value={hobbiesInput} 
                onChange={(e) => setHobbiesInput(e.target.value)} 
              />
            </div>
          </div>

          {/* Prior Knowledge */}
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Prior Knowledge Base</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRIOR_KNOWLEDGE_OPTIONS.map((item) => {
                const isSelected = priorKnowledge.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem(item, priorKnowledge, setPriorKnowledge, 10)}
                    className={`px-4 py-2 text-sm font-medium border rounded-full transition-colors ${
                      isSelected 
                        ? 'border-indigo-900 bg-indigo-900 text-white shadow-sm' 
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100">
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 h-10 font-medium shadow-sm" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
