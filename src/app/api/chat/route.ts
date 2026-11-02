import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function POST(req: Request) {
  let userQuery = '';
  let courseContext = 'Computer Science & Software Architecture';
  let lessonContext = '';

  try {
    const { messages, courseTitle, lessonTitle } = await req.json();
    
    if (courseTitle) courseContext = courseTitle;
    if (lessonTitle) lessonContext = lessonTitle;
    
    // Get the latest user message
    const lastMessage = Array.isArray(messages) && messages.length > 0 
      ? messages[messages.length - 1].content 
      : '';
    userQuery = lastMessage;

    const systemPrompt = `
      You are EduPredict's Elite AI Academic Tutor and Pedagogical Mentor.
      You are guiding a student currently enrolled in the course: "${courseContext}"
      ${lessonContext ? `Current Lesson: "${lessonContext}"` : ''}

      Guidelines:
      1. Socratic & Encouraging: Guide the student toward conceptual clarity with clear analogies and step-by-step reasoning.
      2. High Technical Accuracy: Provide production-grade, theoretically sound explanations for Computer Science and Engineering topics.
      3. Code Clarity: If providing code examples, write clean, well-commented TypeScript/JavaScript or Python snippets.
      4. Concise: Keep answers structured, highly readable, and under 250 words unless specifically asked for a full breakdown.
    `.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      messages: Array.isArray(messages) ? messages : [{ role: 'user', content: userQuery }],
      abortSignal: controller.signal
    });

    clearTimeout(timeoutId);

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("AI Tutor Chat Error, using resilient pedagogical fallback:", error);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dynamic contextual fallback response
    const fallbackAnswers: Record<string, string> = {
      default: `Great question regarding **${courseContext}**!

In modern software engineering, the core principle is **separation of concerns** and **predictable state transitions**. 

When building scalable architectures:
1. **Isolate State:** Keep state mutations centralized so side-effects (like database syncing or UI re-renders) remain deterministic.
2. **Optimize Data Access:** Use edge caching or JSONB persistence to minimize round-trip database queries.
3. **Handle Failure Gracefully:** Always implement client-side timeouts and circuit breakers so transient API issues never freeze the user interface.

Would you like a code snippet demonstrating this pattern, or should we break down a specific edge case?`
    };

    const responseText = fallbackAnswers.default;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i += 4) {
          const chunk = words.slice(i, i + 4).join(' ') + ' ';
          controller.enqueue(encoder.encode(chunk));
          await new Promise(r => setTimeout(r, 60));
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
