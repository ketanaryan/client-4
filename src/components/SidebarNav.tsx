"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sliders, Route, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/domain-selection', label: 'Domain Setup', icon: Sliders },
    { href: '/pathway-recommendations', label: 'My Pathway', icon: Route },
    { href: '/settings/profile', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all",
              isActive
                ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium border border-transparent"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-zinc-400")} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
