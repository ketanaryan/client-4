-- 1. Add comprehensive academic and interest fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS grade_10_percent numeric,
ADD COLUMN IF NOT EXISTS grade_12_percent numeric,
ADD COLUMN IF NOT EXISTS current_degree text,
ADD COLUMN IF NOT EXISTS current_cgpa numeric,
ADD COLUMN IF NOT EXISTS interests_hobbies text[];
