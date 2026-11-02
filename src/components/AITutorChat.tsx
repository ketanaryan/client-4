"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Send, Bot, User, Loader2, X, RefreshCw, MessageSquare } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your AI Academic Tutor for **${courseTitle}**. How can I assist your understanding today? You can ask me to explain concepts, walk through code examples, or clarify architectural tradeoffs.`
    }
  ]);
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

  const quickPrompts = [
    "Explain this concept with a real-world analogy",
    "What are common edge cases or pitfalls here?",
    "Show a minimal production code snippet"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full px-5 py-6 flex items-center gap-2.5 border border-indigo-300/40 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span>Ask AI Academic Tutor</span>
        </Button>
      </div>

      {/* Slide-out / Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border-zinc-200 shadow-2xl">
          {/* Header */}
          <DialogHeader className="p-4 bg-gradient-to-r from-indigo-900 to-zinc-900 text-white border-b border-indigo-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                    AI Academic Tutor
                    <span className="text-[10px] font-medium bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                      Gemini 3.5 Active
                    </span>
                  </DialogTitle>
                  <p className="text-xs text-indigo-200/80 truncate max-w-sm mt-0.5">
                    Context: {courseTitle} {lessonTitle ? `• ${lessonTitle}` : ''}
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
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
                <span>AI Tutor is reasoning...</span>
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
                className="text-xs whitespace-nowrap bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-zinc-600 px-3 py-1.5 rounded-full border border-zinc-200 transition-colors"
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
              placeholder="Ask anything about this concept or code..."
              disabled={isLoading}
              className="flex-1 bg-zinc-50 border-zinc-200 focus-visible:ring-indigo-600 text-sm"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 h-9 px-4"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
