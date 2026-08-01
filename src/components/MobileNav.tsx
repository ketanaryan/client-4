"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Sliders, Route, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/domain-selection', label: 'Domain Setup', icon: Sliders },
    { href: '/pathway-recommendations', label: 'My Pathway', icon: Route },
    { href: '/settings/profile', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden flex items-center mr-2">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-zinc-700 hover:bg-zinc-100 rounded-md">
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Drawer */}
          <div className="relative z-50 w-[280px] max-w-[80vw] h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  EP
                </div>
                <span className="font-semibold text-lg text-zinc-900 tracking-tight">EduPredict</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-5 w-5 text-zinc-500" />
              </Button>
            </div>

            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-[15px] rounded-xl transition-all",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-zinc-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
