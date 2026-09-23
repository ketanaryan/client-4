-- 1. Add cached_course_pathway JSONB array to profiles table to cache AI course generation
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cached_course_pathway jsonb;
