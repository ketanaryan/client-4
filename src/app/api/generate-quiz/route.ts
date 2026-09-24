import { fallbackQuizData } from '@/lib/fallback-quiz-data';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define the schema for the expected JSON output
const quizSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().describe("A unique string identifier for the question"),
      text: z.string().describe("The actual question text"),
      options: z.array(z.string()).length(4).describe("Exactly 4 multiple choice options"),
      correctOption: z.string().describe("The exact text of the correct option"),
      conceptTarget: z.string().describe("The sub-concept this question tests (e.g. 'Pointer Arithmetic', 'State Management')")
    })
  ).length(5).describe("Generate exactly 5 questions for the diagnostic quiz")
});

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const requestSchema = z.object({
  targetDomain: z.string().min(1, "Target domain is required"),
  academicLevel: z.string().min(1, "Academic level is required"),
  priorKnowledge: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  let targetDomain = "";
  let academicLevel = "";
  try {
    const body = await req.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      console.error("Payload validation failed:", parsedBody.error.issues);
      throw new Error("Invalid request payload");
    }

    targetDomain = parsedBody.data.targetDomain;
    academicLevel = parsedBody.data.academicLevel;
    const priorKnowledge = parsedBody.data.priorKnowledge;

    const prompt = `
      You are an expert academic evaluator and diagnostic system architect.
      Generate a diagnostic assessment quiz for a student with the following profile:
      - Target Domain: ${targetDomain}
      - Academic Level: ${academicLevel}
      - Prior Knowledge / Known Tech Stack: ${priorKnowledge && priorKnowledge.length > 0 ? priorKnowledge.join(", ") : "None specified"}

      Instructions:
      1. Create exactly 5 multiple-choice questions.
      2. The difficulty should strictly align with their Academic Level.
      3. CRITICAL: Do NOT ask basic questions about concepts they already listed in their Prior Knowledge. Assume they know those concepts and test them on more advanced integrations or adjacent topics within the Target Domain.
      4. Each question must target a specific sub-concept so we can isolate knowledge gaps if they answer incorrectly.
    `;

        const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5s hard limit before Vercel 10s kill

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      schema: quizSchema,
      prompt: prompt,
      abortSignal: controller.signal
    });
    
    clearTimeout(timeoutId);

    return NextResponse.json({ quiz: object.questions });

      } catch (error: any) {
      console.error("Quiz Generation Error, falling back to dummy data:", error);
      try {
        let questionPool: any[] = [];
        const domainMap: Record<string, string> = {
          'computer-engineering': 'Computer Engineering',
          'artificial-intelligence': 'Artificial Intelligence',
          'software-engineering': 'Software Engineering'
        };
        const actualDomain = domainMap[targetDomain] || 'Computer Engineering';
        const actualLevel = academicLevel || 'Beginner';
        questionPool = fallbackQuizData[actualDomain]?.[actualLevel] || fallbackQuizData['Computer Engineering']['Beginner'];

        for (let i = questionPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questionPool[i], questionPool[j]] = [questionPool[j], questionPool[i]];
        }

        const selectedQuestions = questionPool.slice(0, 5).map((q: any, index: number) => ({
          id: 'fallback-' + (index + 1),
          ...q
        }));

        return NextResponse.json({ quiz: selectedQuestions });
      } catch (fallbackError) {
        console.error("Critical Fallback Error:", fallbackError);
        return NextResponse.json({
          quiz: [
            { id: "hard-1", text: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"], correctOption: "Central Processing Unit", conceptTarget: "Hardware Basics" },
            { id: "hard-2", text: "What is RAM?", options: ["Read Access Memory", "Random Access Memory", "Run Access Memory", "Random Active Memory"], correctOption: "Random Access Memory", conceptTarget: "Memory Architecture" },
            { id: "hard-3", text: "What is an OS?", options: ["Operating System", "Open Source", "Optical Sensor", "Output System"], correctOption: "Operating System", conceptTarget: "OS Basics" },
            { id: "hard-4", text: "What is a bit?", options: ["Binary Integer", "Basic Information", "Binary Digit", "Byte Integer"], correctOption: "Binary Digit", conceptTarget: "Data Representation" },
            { id: "hard-5", text: "What is a compiler?", options: ["A text editor", "A program that translates code", "A hardware device", "A type of memory"], correctOption: "A program that translates code", conceptTarget: "Software Engineering" }
          ]
        });
      }
    }
  }
