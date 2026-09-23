import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const pathSchema = z.object({
  paths: z.array(
    z.object({
      title: z.string().describe("The job title or career path name"),
      match_reason: z.string().describe("A personalized explanation linking their hobbies, academic scores, and quiz performance to this path"),
      growth_potential: z.string().describe("Short 2-3 word description of the industry growth (e.g. 'High Demand', 'Emerging Field')")
    })
  ).length(3).describe("Generate exactly 3 career path recommendations")
});

const requestSchema = z.object({
  userId: z.string(),
  profile: z.any(),
  domainProfile: z.any(),
  masteryScore: z.number(),
  flaws: z.array(z.any()).optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      console.error("Payload validation failed:", parsedBody.error.issues);
      throw new Error("Invalid request payload");
    }

    const { profile, domainProfile, masteryScore, flaws } = parsedBody.data;

    const prompt = `
      You are an expert academic and career counselor AI.
      Based on the following student profile, suggest 3 optimal career paths.
      
      Student Profile:
      - Domain Interest: ${domainProfile?.domain_name}
      - 10th Grade: ${profile?.grade_10_percent}%
      - 12th Grade: ${profile?.grade_12_percent}%
      - Current Degree: ${profile?.current_degree} (CGPA: ${profile?.current_cgpa})
      - Hobbies & Interests: ${profile?.interests_hobbies?.join(', ')}
      - Diagnostic Quiz Score: ${masteryScore}%
      - Current Conceptual Flaws: ${flaws?.map((f: any) => f.concept_name).join(', ')}

      Analyze their holistic profile (especially how their hobbies might intersect with their academic domain) to recommend 3 personalized career paths. 
      For example, if they like 'Graphic Design' and study 'Computer Engineering', suggest 'Frontend Engineer' or 'UX Developer'.
    `;

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      schema: pathSchema,
      prompt: prompt,
    });

    // Cache the result in the database
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const authHeader = req.headers.get('Authorization');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        { global: { headers: { Authorization: authHeader || '' } } }
      );
      
      await supabase
        .from('profiles')
        .update({ cached_career_paths: object.paths })
        .eq('id', parsedBody.data.userId);
    } catch (dbError) {
      console.error('Failed to cache career paths:', dbError);
      // We still return the object even if caching fails
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error generating career paths, falling back to dummy data:', error);
    const fallbackPaths = [
      {
        title: "Systems Architect",
        match_reason: "Your strong foundation in computer engineering combined with your analytical approach makes you ideal for designing large-scale distributed systems.",
        growth_potential: "High Demand"
      },
      {
        title: "Embedded Systems Engineer",
        match_reason: "Leverages your interest in hardware-software integration and low-level optimization.",
        growth_potential: "Steady Growth"
      },
      {
        title: "Cloud Infrastructure Developer",
        match_reason: "A rapidly growing field that perfectly aligns with your technical background and desire for scalable solutions.",
        growth_potential: "Explosive Growth"
      }
    ];

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const authHeader = req.headers.get('Authorization');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        { global: { headers: { Authorization: authHeader || '' } } }
      );
      
      await supabase
        .from('profiles')
        .update({ cached_career_paths: fallbackPaths })
        .eq('id', 'presentation-mode');
    } catch (dbError) {}

    return NextResponse.json({ paths: fallbackPaths });
  }
}
