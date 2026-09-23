import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const pathwaySchema = z.object({
  courses: z.array(
    z.object({
      id: z.string().describe("Unique identifier like 'c1', 'c2'"),
      title: z.string().describe("Course title"),
      type: z.string().describe("Always 'Course'"),
      status: z.enum(['Next', 'Locked', 'Completed']).describe("Whether the course is up next or locked due to prerequisites"),
      flaws: z.array(z.string()).describe("Any unresolved conceptual flaws blocking this course. If there are flaws, status must be 'Locked'"),
      reasoning: z.string().describe("Explainable AI (XAI): 1-2 sentences explaining exactly why this course was recommended based on the student's mastery score and domain.")
    })
  ).length(4).describe("Generate exactly 4 courses in a sequential pathway")
});

const requestSchema = z.object({
  userId: z.string(),
  domainName: z.string(),
  masteryScore: z.number(),
  flaws: z.array(z.string()).optional()
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

    const { userId, domainName, masteryScore, flaws } = parsedBody.data;

    const prompt = `
      You are an expert academic curriculum designer.
      Generate a sequence of 4 courses for a student in the domain of ${domainName}.
      Their current mastery score is ${masteryScore}%.
      They currently have the following unresolved conceptual flaws: ${flaws?.length ? flaws.join(', ') : 'None'}.
      
      Instructions:
      1. Create a logical sequence of 4 courses from beginner to advanced within their domain.
      2. If they have unresolved flaws, assign those flaws to the very FIRST course as prerequisite gaps, and set its status to 'Locked'.
      3. If they have NO flaws, set the FIRST course to 'Next' and the rest to 'Locked'.
    `;

    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: pathwaySchema,
      prompt: prompt,
    });

    // Cache the result in the database
    try {
      const authHeader = req.headers.get('Authorization');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        { global: { headers: { Authorization: authHeader || '' } } }
      );
      
      await supabase
        .from('profiles')
        .update({ cached_course_pathway: object.courses })
        .eq('id', userId);
    } catch (dbError) {
      console.error('Failed to cache course pathway:', dbError);
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error generating course pathway:', error);
    return NextResponse.json({ error: 'Failed to generate course pathway' }, { status: 500 });
  }
}
