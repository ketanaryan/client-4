import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { flawConcept } = await req.json();

    if (!flawConcept) {
      return NextResponse.json({ error: "Missing flaw concept" }, { status: 400 });
    }

    const prompt = `
      You are an expert AI tutor in Computer Science and Engineering.
      A student has just failed a diagnostic question related to the concept: "${flawConcept}".
      
      Generate a concise, highly engaging micro-lesson to explain this concept clearly to them. 
      Format the response in Markdown. Use analogies if helpful. Keep it under 200 words.
    `;

    const result = await streamText({
      model: google('gemini-3.1-pro-preview'),
      prompt: prompt,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Remediate Flaw Error:", error);
    return NextResponse.json({ error: "Failed to generate remediation." }, { status: 500 });
  }
}
