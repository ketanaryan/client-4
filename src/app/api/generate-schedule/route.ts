import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { timeCommitment, domainName } = await req.json();

    const prompt = `
      You are an expert academic advisor. A student is studying the domain of "${domainName || 'General Academics'}".
      They have committed to studying for ${timeCommitment || '5'} hours per week.
      
      Generate a practical, week-long study schedule that breaks this time down day-by-day.
      Format the output in clean, readable Markdown. Do not include introductory fluff, just start with the schedule.
      
      Make the schedule interesting, realistic, and include time for reviewing concepts (spaced repetition) and hands-on practice.
    `;

    const { text } = await generateText({
      model: google('gemini-3.5-flash'),
      prompt: prompt,
    });

    return NextResponse.json({ schedule: text });
  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json({ error: 'Failed to generate schedule' }, { status: 500 });
  }
}
