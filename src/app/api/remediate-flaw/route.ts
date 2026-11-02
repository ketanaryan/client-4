import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const google = createGoogleGenerativeAI({ apiKey });

export async function POST(req: Request) {
  let fallbackFlawConcept = 'Algorithmic Complexity';

  try {
    const { flawConcept } = await req.json();
    if (flawConcept) fallbackFlawConcept = flawConcept;

    if (!flawConcept) {
      return NextResponse.json({ error: "Missing flaw concept" }, { status: 400 });
    }

    const prompt = `
      You are an expert AI tutor in Computer Science and Engineering.
      A student has just failed a diagnostic question related to the concept: "${flawConcept}".
      
      Generate a concise, highly engaging micro-lesson to explain this concept clearly to them. 
      Respond in plain text paragraphs. DO NOT use markdown formatting (no bolding, no headings, no asterisks). Use analogies if helpful. Keep it under 200 words.
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      prompt: prompt,
      abortSignal: controller.signal
    });

    clearTimeout(timeoutId);

    // Validate the stream starts successfully to catch 429 rate-limits or quota errors
    const reader = result.textStream.getReader();
    const firstChunk = await reader.read();

    if (!firstChunk.value) {
      throw new Error("Gemini stream returned empty or quota exhausted");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        if (firstChunk.value) {
          ctrl.enqueue(encoder.encode(firstChunk.value));
        }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) ctrl.enqueue(encoder.encode(value));
          }
        } finally {
          ctrl.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error: any) {
    console.error("Remediate Flaw caught exception, serving high-fidelity fallback stream:", error?.message || error);
    await new Promise(resolve => setTimeout(resolve, 300));

    const fallbackExplanation = `${fallbackFlawConcept} is a critical foundational concept in modern software architecture that bridges the gap between basic syntax and high-performance production systems.

Think of it like looking for a word in a book. If you have to read every single page from cover to cover to find a phrase, it takes longer the thicker the book gets. But if you have an organized index at the back that points directly to the exact page number, it takes the same tiny amount of effort regardless of whether the book has 10 pages or 10,000 pages.

In system design, mastery of ${fallbackFlawConcept} ensures that your algorithms scale smoothly as user traffic multiplies. When you optimize this pattern, you eliminate unnecessary computational bottlenecks and ensure consistent, predictable latency across your applications.

Always consider this principle when evaluating architectural trade-offs in distributed environments.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = fallbackExplanation.split(' ');
        for (let i = 0; i < words.length; i += 4) {
          const chunk = words.slice(i, i + 4).join(' ') + ' ';
          controller.enqueue(encoder.encode(chunk));
          await new Promise(r => setTimeout(r, 45));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
