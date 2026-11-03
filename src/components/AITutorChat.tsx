"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Send, Bot, User, Loader2, X, RefreshCw, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITutorChatProps {
  courseTitle: string;
  lessonTitle?: string;
}

export default function AITutorChat({ courseTitle, lessonTitle }: AITutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const courseLower = (courseTitle || '').toLowerCase();

  const domainCategory = useMemo(() => {
    if (courseLower.includes('financ') || courseLower.includes('econom') || courseLower.includes('capital') || courseLower.includes('account')) {
      return 'Finance & Economics';
    }
    if (courseLower.includes('psycholog') || courseLower.includes('behavior') || courseLower.includes('cognit')) {
      return 'Psychology & Behavioral Sciences';
    }
    if (courseLower.includes('health') || courseLower.includes('biomed') || courseLower.includes('medic') || courseLower.includes('patho')) {
      return 'Healthcare & Biomedical Sciences';
    }
    if (courseLower.includes('design') || courseLower.includes('hci') || courseLower.includes('product') || courseLower.includes('ux')) {
      return 'Digital Product Design & HCI';
    }
    if (courseLower.includes('manage') || courseLower.includes('business') || courseLower.includes('strateg')) {
      return 'Business & Strategic Management';
    }
    if (courseLower.includes('data') || courseLower.includes('statist') || courseLower.includes('analytic')) {
      return 'Data Science & Analytics';
    }
    return 'Systems Engineering & Computing';
  }, [courseLower]);

  const quickPrompts = useMemo(() => {
    if (domainCategory === 'Finance & Economics') {
      return [
        "Explain with a DCF valuation or portfolio example",
        "What are common market risk or liquidity pitfalls?",
        "How is this metric calculated in financial modeling?"
      ];
    }
    if (domainCategory === 'Psychology & Behavioral Sciences') {
      return [
        "Explain with an empirical behavioral experiment",
        "What cognitive bias or schema influences this?",
        "How is this evaluated in clinical psychometrics?"
      ];
    }
    if (domainCategory === 'Healthcare & Biomedical Sciences') {
      return [
        "Explain with a clinical patient case study",
        "What physiological feedback loop is involved?",
        "How do clinicians evaluate sensitivity & specificity?"
      ];
    }
    if (domainCategory === 'Digital Product Design & HCI') {
      return [
        "Explain with an interface UX case study",
        "How does Fitts's Law or cognitive load apply here?",
        "What are the WCAG 2.1 accessibility requirements?"
      ];
    }
    if (domainCategory === 'Business & Strategic Management') {
      return [
        "Explain with an enterprise case study",
        "How does this impact unit economics (LTV:CAC)?",
        "What competitive moat or advantage does this build?"
      ];
    }
    if (domainCategory === 'Data Science & Analytics') {
      return [
        "Explain the bias-variance tradeoff here",
        "How do we prevent data leakage in training?",
        "Show a Python/Pandas feature transformation"
      ];
    }
    // Default Tech
    return [
      "Explain this concept with a real-world analogy",
      "What are common edge cases or concurrency pitfalls?",
      "Show a minimal production code snippet"
    ];
  }, [domainCategory]);

  const initialGreeting = useMemo(() => {
    return `Hello! I am your AI Academic Tutor for **${courseTitle}** (${domainCategory}). How can I assist your understanding today? You can ask me to explain theoretical principles, walk through step-by-step calculations or case studies, or clarify foundational trade-offs.`;
  }, [courseTitle, domainCategory]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialGreeting
    }
  ]);

  // Keep greeting synchronized if courseTitle changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: initialGreeting
      }
    ]);
  }, [initialGreeting]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          courseTitle,
          lessonTitle
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to stream response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantReply
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat stream error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered a network glitch while generating the explanation. Please try asking again!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full px-5 py-6 flex items-center gap-2.5 border border-indigo-300/40 text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span>Ask AI Academic Tutor</span>
        </Button>
      </div>

      {/* Slide-out / Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border-zinc-200 shadow-2xl rounded-2xl">
          {/* Header */}
          <DialogHeader className="p-4 bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white border-b border-indigo-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                    AI Academic Tutor
                    <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Domain Calibrated
                    </span>
                  </DialogTitle>
                  <p className="text-xs text-indigo-200/80 truncate max-w-sm mt-0.5">
                    {courseTitle} {lessonTitle ? `• ${lessonTitle}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px] bg-zinc-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-indigo-700" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none prose prose-sm max-w-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 pl-10 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>AI Tutor is formulating calibrated response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-4 py-2 bg-white border-t border-zinc-100 flex gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-xs whitespace-nowrap bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-zinc-700 px-3 py-1.5 rounded-full border border-zinc-200 transition-colors font-medium cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask anything about this academic concept..."
              disabled={isLoading}
              className="flex-1 bg-zinc-50 border-zinc-200 focus-visible:ring-indigo-600 text-sm"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 h-9 px-4 cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
