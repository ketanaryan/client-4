-- 1. Add expanded onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS prior_knowledge text[],
ADD COLUMN IF NOT EXISTS time_commitment text;
