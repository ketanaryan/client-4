import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const requestSchema = z.object({
  userId: z.string(),
  conceptName: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const { userId, conceptName } = parsedBody.data;

    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    // Update the flaw in the database
    const { error } = await supabase
      .from('identified_flaws')
      .update({ is_remediated: true })
      .eq('user_id', userId)
      .eq('concept_name', conceptName);

    if (error) {
      console.error('Failed to update flaw:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
    
    // RLHF Implementation: Log a positive reward since the user understood the Gen-AI explanation
    try {
      await supabase.from('remediation_feedback').insert({
        user_id: userId,
        concept_name: conceptName,
        reward_score: 1 // +1 scalar reward as mentioned in Section 5 of the paper
      });
    } catch (rlhfError) {
      console.error('Failed to log RLHF feedback:', rlhfError);
      // Non-blocking error
    }
    
    // Check if there are any remaining flaws for this user
    const { data: remainingFlaws } = await supabase
      .from('identified_flaws')
      .select('id')
      .eq('user_id', userId)
      .eq('is_remediated', false);
      
    // If no flaws remain, we should update the cached course pathway to unlock the first course
    if (!remainingFlaws || remainingFlaws.length === 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('cached_course_pathway')
        .eq('id', userId)
        .single();
        
      if (profile && profile.cached_course_pathway) {
        const updatedPathway = profile.cached_course_pathway.map((course: any, idx: number) => {
          if (idx === 0) {
            return { ...course, status: 'Next', flaws: [] };
          }
          return course;
        });
        
        await supabase
          .from('profiles')
          .update({ cached_course_pathway: updatedPathway })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ success: true, remaining: remainingFlaws?.length || 0 });
  } catch (error) {
    console.error('Error completing remediation:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
