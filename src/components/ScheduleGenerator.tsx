"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Loader2, Sparkles } from 'lucide-react';

export default function ScheduleGenerator({ timeCommitment, domainName }: { timeCommitment: string, domainName: string }) {
  const [schedule, setSchedule] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSchedule = async () => {
    if (schedule) return; // already generated
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeCommitment, domainName })
      });
      const data = await res.json();
      if (data.schedule) {
        setSchedule(data.schedule);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={
        <Button onClick={generateSchedule} variant="outline" className="w-full mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium">
          <Calendar className="mr-2 h-4 w-4" /> AI Study Schedule
        </Button>
      } />
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Your Personalized {timeCommitment}hr Schedule
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
              <p>Structuring your optimal learning week...</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-zinc max-w-none">
              {schedule.split('\n').map((line, i) => {
                if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold text-zinc-900 mt-6 mb-2">{line.replace(/##/g, '')}</h3>;
                if (line.startsWith('#')) return <h2 key={i} className="text-xl font-bold text-indigo-950 mt-4 mb-2">{line.replace(/#/g, '')}</h2>;
                if (line.startsWith('-')) return <li key={i} className="text-zinc-600 ml-4">{line.replace(/-/g, '')}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-zinc-700 leading-relaxed mb-2">{line}</p>;
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
