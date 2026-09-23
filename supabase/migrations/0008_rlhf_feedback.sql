-- Add table to capture RLHF (Reinforcement Learning from Human Feedback) data as specified in the paper
CREATE TABLE IF NOT EXISTS public.remediation_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_name TEXT NOT NULL,
    reward_score INTEGER NOT NULL, -- +1 for understood, -1 for not helpful
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.remediation_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own feedback
CREATE POLICY "Users can insert their own remediation feedback" 
ON public.remediation_feedback FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own feedback
CREATE POLICY "Users can view their own remediation feedback" 
ON public.remediation_feedback FOR SELECT 
USING (auth.uid() = user_id);
