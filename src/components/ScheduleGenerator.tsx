"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Loader2, Sparkles, RefreshCw, CheckCircle2, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ScheduleGenerator({ timeCommitment, domainName }: { timeCommitment: string, domainName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSchedule = async (forceRefresh: boolean = false) => {
    if (schedule && !forceRefresh) return;
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !schedule) {
      generateSchedule(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button 
            onClick={() => handleOpenChange(true)} 
            variant="outline" 
            className="w-full mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Generate AI Study Schedule</span>
          </Button>
        } 
      />
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white border-zinc-200 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 px-6 py-5 text-white border-b border-indigo-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  Personalized Study Schedule
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[11px] bg-indigo-500/20 text-indigo-200 border-indigo-400/30 py-0">
                    <Clock className="h-3 w-3 mr-1" /> {timeCommitment || '5-10 hrs/week'}
                  </Badge>
                  <span className="text-zinc-400 text-xs truncate max-w-[200px]">
                    {domainName || 'Academic Domain'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[55vh] space-y-4 bg-zinc-50/50">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-14 text-zinc-500 space-y-3">
              <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-zinc-700">Structuring your domain-specific learning calendar...</p>
              <p className="text-xs text-zinc-400">Calibrating spaced repetition intervals & capstone practice</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('##')) {
                  return (
                    <div key={i} className="pt-2 pb-1 border-b border-indigo-100 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950">
                        {trimmed.replace(/##/g, '').trim()}
                      </h3>
                    </div>
                  );
                }
                if (trimmed.startsWith('#')) {
                  return (
                    <h2 key={i} className="text-base font-bold text-zinc-900 mt-3 mb-1">
                      {trimmed.replace(/#/g, '').trim()}
                    </h2>
                  );
                }
                if (trimmed.startsWith('-')) {
                  return (
                    <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-zinc-200/80 shadow-xs">
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-zinc-700 leading-relaxed font-medium">
                        {trimmed.replace(/^-/g, '').trim()}
                      </span>
                    </div>
                  );
                }
                if (trimmed === '') return null;
                return (
                  <p key={i} className="text-xs text-zinc-600 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => generateSchedule(true)}
            disabled={isGenerating}
            className="text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-100 gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 px-4 font-semibold cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Done & Close</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
