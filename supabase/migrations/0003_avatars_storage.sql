-- 1. Create a public bucket called 'avatars' if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Add avatar_url to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- 3. Allow public access to all avatars (so they can be displayed on the site)
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- 4. Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- 5. Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 6. Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar." 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid() = owner);
