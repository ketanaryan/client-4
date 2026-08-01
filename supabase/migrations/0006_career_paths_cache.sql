-- 1. Add career_paths JSONB array to profiles table to cache AI generation
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cached_career_paths jsonb;
