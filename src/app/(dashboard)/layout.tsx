import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import UserProfileMenu from '@/components/UserProfileMenu';
import SidebarNav from '@/components/SidebarNav';
import MobileNav from '@/components/MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Check onboarding status and fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top Navbar */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <MobileNav />
          <div className="h-6 w-6 rounded-md bg-indigo-600 hidden md:block" />
          <span className="font-semibold text-lg text-zinc-900 tracking-tight">EduPredict</span>
        </div>
        <div className="flex items-center gap-4">
          <UserProfileMenu profile={profile} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 bg-zinc-50/50 hidden md:block py-6 px-4">
          <SidebarNav />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
