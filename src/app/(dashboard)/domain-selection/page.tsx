"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DOMAINS = [
  { id: 'computer-engineering', title: 'Computer Engineering', description: 'Systems programming, architecture, and embedded systems.' },
  { id: 'artificial-intelligence', title: 'Artificial Intelligence', description: 'Machine learning, neural networks, and data science.' },
  { id: 'software-engineering', title: 'Software Engineering', description: 'Full-stack development, system design, and architecture.' },
];

export default function DomainSelectionPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [competency, setCompetency] = useState<string>('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    
    // In a real app, save to Supabase public.domain_profiles here
    // await supabase.from('domain_profiles').insert({...})
    
    // Simulate API call
    setTimeout(() => {
      router.push(`/quiz/${selectedDomain}`);
    }, 800);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Domain Configuration</h1>
        <p className="text-zinc-500 mt-1">Select your academic focus to calibrate the recommendation engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900">1. Select Domain</h2>
          <RadioGroup value={selectedDomain} onValueChange={setSelectedDomain} className="space-y-4">
            {DOMAINS.map((domain) => (
              <Label
                key={domain.id}
                htmlFor={domain.id}
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDomain === domain.id ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={domain.id} id={domain.id} />
                  <div className="space-y-1">
                    <p className="font-medium leading-none text-zinc-900">{domain.title}</p>
                    <p className="text-sm text-zinc-500">{domain.description}</p>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900">2. Self-Assessed Level</h2>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="pt-6">
              <RadioGroup value={competency} onValueChange={setCompetency} className="space-y-4">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <div className="flex items-center space-x-3" key={level}>
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="font-normal text-zinc-700">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-12 text-base mt-4"
            disabled={!selectedDomain || isLoading}
            onClick={handleSave}
          >
            {isLoading ? "Saving Profile..." : "Proceed to Diagnostic Quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
}
