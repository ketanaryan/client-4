"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Upload, CheckCircle2, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserProfileMenu({ profile }: { profile: any }) {
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
    <Dialog>
      <DialogTrigger 
        className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all cursor-pointer"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <User className="h-5 w-5 text-zinc-500" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl border-zinc-200">
        <DialogTitle className="sr-only">Student Profile</DialogTitle>
        <div className="bg-zinc-900 px-6 py-8 flex flex-col items-center justify-center relative">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-100 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-zinc-400" />
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5 text-white mb-1" />
                  <span className="text-[10px] text-white font-medium uppercase tracking-wider">Upload</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
          <h2 className="text-xl font-bold text-white mt-4">{profile?.full_name || 'Student'}</h2>
          <p className="text-zinc-400 text-sm">{profile?.email || 'student@example.com'}</p>
        </div>
        
        <div className="p-6 bg-white space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Academic Profile</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Institution</span>
                <span className="font-medium text-zinc-900">{profile?.institution_name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Academic Level</span>
                <span className="font-medium text-zinc-900">{profile?.academic_level || 'Not specified'}</span>
              </div>
              {profile?.current_degree && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-600">Degree</span>
                  <span className="font-medium text-zinc-900">{profile.current_degree}</span>
                </div>
              )}
              {profile?.current_cgpa && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-600">CGPA</span>
                  <span className="font-medium text-zinc-900">{profile.current_cgpa} / 10.0</span>
                </div>
              )}
              {profile?.grade_12_percent && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-600">12th Grade</span>
                  <span className="font-medium text-zinc-900">{profile.grade_12_percent}%</span>
                </div>
              )}
              {profile?.grade_10_percent && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-600">10th Grade</span>
                  <span className="font-medium text-zinc-900">{profile.grade_10_percent}%</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Weekly Commitment</span>
                <span className="font-medium text-zinc-900">{profile?.time_commitment || 'Not specified'} hrs</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Prior Knowledge Base</h3>
             <div className="flex flex-wrap gap-2">
               {profile?.prior_knowledge && profile.prior_knowledge.length > 0 ? (
                 profile.prior_knowledge.map((pk: string) => (
                   <span key={pk} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                     <CheckCircle2 className="h-3 w-3" /> {pk}
                   </span>
                 ))
               ) : (
                 <span className="text-sm text-zinc-500 italic">No prior knowledge specified</span>
               )}
             </div>
          </div>

          <div className="pt-2">
             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Interests & Hobbies</h3>
             <div className="flex flex-wrap gap-2">
               {profile?.interests_hobbies && profile.interests_hobbies.length > 0 ? (
                 profile.interests_hobbies.map((hobby: string) => (
                   <span key={hobby} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200">
                     {hobby}
                   </span>
                 ))
               ) : (
                 <span className="text-sm text-zinc-500 italic">No hobbies specified</span>
               )}
             </div>
          </div>
        </div>

        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex justify-between">
          <Button variant="outline" className="text-zinc-600 hover:text-zinc-900 border-zinc-200" onClick={() => router.push('/settings/profile')}>
            Edit Profile
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
