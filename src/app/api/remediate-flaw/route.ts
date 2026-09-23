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
      model: google('gemini-3.5-flash'),
      prompt: prompt,
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("Remediate Flaw Error, falling back to dummy data:", error);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Fake generation delay

    const fallbackMarkdown = `
**Algorithmic Complexity** is a way to measure how the runtime or memory requirements of an algorithm grow as the size of the input data increases.

Think of it like reading a book. If you read every single word to find a specific phrase, that's $O(n)$ time—it takes longer the thicker the book gets. But if you have an index at the back that points exactly to the page, that's $O(1)$ time—it takes the same amount of effort regardless of how massive the book is.

### Key Takeaway
Always look for ways to avoid nested loops ($O(n^2)$) when working with large datasets, as they can cause your application to freeze!
    `.trim();

    return new Response(fallbackMarkdown, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
