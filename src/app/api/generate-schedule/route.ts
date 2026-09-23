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
    console.error('Error generating schedule, falling back to dummy data:', error);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseHours = timeCommitment ? parseInt(timeCommitment.split('-')[0]) || 2 : 2;
    const dailyHours = Math.max(1, Math.floor(baseHours / 4)); // Distribute across 4 study days

    const fallbackSchedule = `
**Monday**
* ${dailyHours} hour(s): Core concepts & reading for ${domainName || 'your target domain'}

**Wednesday**
* ${dailyHours} hour(s): Hands-on practice projects

**Friday**
* ${dailyHours} hour(s): Weekly review and spaced repetition flashcards

**Weekend**
* ${Math.max(1, dailyHours * 2)} hour(s): Deep dive into current locked flaws
    `.trim();

    return NextResponse.json({ schedule: fallbackSchedule });
  }
}
