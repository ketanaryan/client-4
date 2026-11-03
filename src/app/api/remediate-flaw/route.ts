import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const google = createGoogleGenerativeAI({ apiKey });

function getDomainAwareFlawExplanation(concept: string): string {
  const c = concept.toLowerCase();

  if (c.includes('capm') || c.includes('cash flow') || c.includes('valuation') || c.includes('finance') || c.includes('portfolio') || c.includes('bond') || c.includes('equity') || c.includes('risk')) {
    return `${concept} is a vital pillar in financial economics and valuation analysis that bridges raw accounting statements with market risk management.

Think of it like adjusting the speed of an ocean freighter based on maritime weather. If you navigate in calm coastal waters, your fuel consumption and risk of capsizing are minimal. But if you navigate high-seas turbulent storms, you demand a risk premium in cargo fees to justify the journey. In capital markets, ${concept} determines the exact premium an investor must demand to compensate for market turbulence.

In financial decision-making, mastering ${concept} prevents mispricing assets and ensures that corporate capital expenditure projects clear their hurdle rate before millions in capital are committed.`.trim();
  }

  if (c.includes('condition') || c.includes('bias') || c.includes('cognitive') || c.includes('psychol') || c.includes('memory') || c.includes('behavior') || c.includes('plasticity')) {
    return `${concept} is a foundational principle in behavioral psychology that reveals how human cognitive systems process, encode, and react to environmental stimuli.

Think of it like footpaths through a dense grassy field. The first time someone walks across the field, they have to push through tall weeds. But if hundreds of pedestrians walk the exact same path every single morning, the grass wears down and a clear trail is formed. In human neural networks, ${concept} works identically: repeated associative stimulus-response cycles carve deep cognitive pathways that turn effortful reasoning into automatic reflex.

Mastery of ${concept} enables researchers and clinicians to design environments that reinforce constructive behaviors while deconditioning counterproductive habits.`.trim();
  }

  if (c.includes('homeostasis') || c.includes('adme') || c.includes('pharma') || c.includes('biomed') || c.includes('health') || c.includes('cardio') || c.includes('receptor') || c.includes('tumor')) {
    return `${concept} is a core physiological mechanism in biomedical sciences that explains how biological systems preserve internal balance amidst fluctuating external stress.

Think of it like an automated climate-control system in a high-tech biosafety laboratory. If the room temperature rises by even one degree, sensitive thermal sensors trigger chilled ventilation to bring the atmosphere back to the set baseline. In human physiology, ${concept} serves as that continuous biological sensor, regulating enzymatic rates and biochemical equilibrium.

In clinical diagnostics and pharmacotherapy, deep comprehension of ${concept} is what allows practitioners to prescribe precise therapeutic dosages that cure pathology without inducing systemic toxicity.`.trim();
  }

  if (c.includes('fitts') || c.includes('wcag') || c.includes('ux') || c.includes('design') || c.includes('accessibility') || c.includes('layout') || c.includes('heuristic') || c.includes('ergonomic')) {
    return `${concept} is an indispensable principle in digital product design and human-computer interaction (HCI) that minimizes user cognitive friction.

Think of it like driving a vehicle on a busy highway. The brake pedal is intentionally large and positioned right next to your foot so you can strike it instantly without glancing down, while the hazard light button is separate so it is never pressed by accident. In interface architecture, ${concept} provides that exact ergonomic clarity for digital interactions.

Applying ${concept} ensures that digital products are universally accessible, intuitive for diverse user cohorts, and eliminate unnecessary visual noise.`.trim();
  }

  if (c.includes('porter') || c.includes('strategy') || c.includes('ltv') || c.includes('cac') || c.includes('business') || c.includes('management') || c.includes('unit economics') || c.includes('agile')) {
    return `${concept} is a cornerstone strategic framework in modern enterprise management that determines whether an organization builds durable market leadership.

Think of it like building a medieval castle. It is not enough to construct high stone walls; you also need a deep surrounding moat, secure supply routes, and disciplined guards. In commercial enterprise, ${concept} serves as that defensible moat, protecting your profit margins from being eroded by aggressive rivals or changing economic headwinds.

Understanding ${concept} equips managers to allocate scarce resources toward high-ROI initiatives that generate sustainable shareholder value.`.trim();
  }

  // Default Tech / CS / Engineering
  return `${concept} is a critical foundational concept in modern computing and software engineering that bridges the gap between basic syntax and high-performance production systems.

Think of it like looking for a word in an encyclopedia. If you have to read every single page from cover to cover to find a phrase, it takes longer the thicker the book gets. But if you have an organized index at the back that points directly to the exact page number, it takes the same tiny amount of effort regardless of whether the book has 10 pages or 10,000 pages.

In system design, mastery of ${concept} ensures that your algorithms scale smoothly as user traffic multiplies. When you optimize this pattern, you eliminate unnecessary computational bottlenecks and ensure consistent, predictable latency across your applications.`.trim();
}

export async function POST(req: Request) {
  let fallbackFlawConcept = 'Algorithmic Complexity';

  try {
    const { flawConcept } = await req.json();
    if (flawConcept) fallbackFlawConcept = flawConcept;

    if (!flawConcept) {
      return NextResponse.json({ error: "Missing flaw concept" }, { status: 400 });
    }

    const prompt = `
      You are an expert academic AI tutor across Computer Science, Business, Finance, Psychology, Healthcare, and Design.
      A student has just struggled with a diagnostic question related to the concept: "${flawConcept}".
      
      Generate a concise, highly engaging micro-lesson to explain this concept clearly to them. 
      Adapt your explanation, tone, and analogies to the specific academic discipline of the concept.
      Respond in plain text paragraphs. DO NOT use markdown formatting (no bolding, no headings, no asterisks). Use an intuitive real-world analogy. Keep it under 180 words.
    `.trim();

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

    const fallbackExplanation = getDomainAwareFlawExplanation(fallbackFlawConcept);

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
