"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Upload, CheckCircle2, Loader2, LogOut, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserProfileMenu({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload avatar. Make sure you ran the SQL script to create the storage bucket!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all cursor-pointer"
        aria-label="Open profile modal"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <User className="h-5 w-5 text-zinc-500" />
        )}
      </DialogTrigger>
      
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[450px] w-[95vw] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl bg-white focus:outline-none"
      >
        <DialogTitle className="sr-only">Student Academic Profile</DialogTitle>
        
        {/* Dedicated Top Navigation Bar - Always Visible */}
        <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-zinc-700 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-lg text-xs transition-all border border-zinc-700 shadow-xs cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Identity Header */}
        <div className="bg-zinc-900 px-6 pt-5 pb-6 flex flex-col items-center justify-center relative shrink-0">
          {/* Avatar with Upload */}
          <div className="relative group">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-100 flex items-center justify-center shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-9 w-9 text-zinc-400" />
              )}
            </div>
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4 text-white mb-0.5" />
                  <span className="text-[9px] text-white font-medium uppercase tracking-wider">Change</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
          <h2 className="text-lg font-bold text-white mt-3 text-center">{profile?.full_name || 'Student'}</h2>
          <p className="text-zinc-400 text-xs text-center">{profile?.email || 'student@example.com'}</p>
        </div>
        
        {/* Scrollable Profile Details */}
        <div className="p-6 bg-white space-y-4 overflow-y-auto flex-1 max-h-[calc(90vh-230px)]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">Academic Profile</h3>
            <div className="space-y-2.5 bg-zinc-50/70 p-3.5 rounded-xl border border-zinc-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Institution</span>
                <span className="font-semibold text-zinc-900">{profile?.institution_name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Academic Level</span>
                <span className="font-semibold text-zinc-900">{profile?.academic_level || 'Not specified'}</span>
              </div>
              {profile?.current_degree && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Degree</span>
                  <span className="font-semibold text-zinc-900">{profile.current_degree}</span>
                </div>
              )}
              {profile?.current_cgpa && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">CGPA</span>
                  <span className="font-semibold text-zinc-900">{profile.current_cgpa} / 10.0</span>
                </div>
              )}
              {profile?.grade_12_percent && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">12th Grade</span>
                  <span className="font-semibold text-zinc-900">{profile.grade_12_percent}%</span>
                </div>
              )}
              {profile?.grade_10_percent && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">10th Grade</span>
                  <span className="font-semibold text-zinc-900">{profile.grade_10_percent}%</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Weekly Commitment</span>
                <span className="font-semibold text-zinc-900">{profile?.time_commitment || 'Not specified'} hrs</span>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Prior Knowledge Base</h3>
             <div className="flex flex-wrap gap-1.5">
               {profile?.prior_knowledge && profile.prior_knowledge.length > 0 ? (
                 profile.prior_knowledge.map((pk: string) => (
                   <span key={pk} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                     <CheckCircle2 className="h-3 w-3 text-indigo-600" /> {pk}
                   </span>
                 ))
               ) : (
                 <span className="text-xs text-zinc-400 italic">No prior knowledge specified</span>
               )}
             </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Interests & Hobbies</h3>
             <div className="flex flex-wrap gap-1.5">
               {profile?.interests_hobbies && profile.interests_hobbies.length > 0 ? (
                 profile.interests_hobbies.map((hobby: string) => (
                   <span key={hobby} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200">
                     {hobby}
                   </span>
                 ))
               ) : (
                 <span className="text-xs text-zinc-400 italic">No hobbies specified</span>
               )}
             </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-zinc-50 px-5 py-3.5 border-t border-zinc-200 flex items-center justify-between gap-2 shrink-0">
          <Button 
            variant="default" 
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-9 px-4 font-semibold shadow-sm cursor-pointer" 
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Dashboard
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="text-zinc-700 hover:text-zinc-900 border-zinc-300 text-xs h-9 px-3 font-medium cursor-pointer" 
              onClick={() => {
                setIsOpen(false);
                router.push('/settings/profile');
              }}
            >
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs h-9 px-3 font-medium cursor-pointer" 
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
