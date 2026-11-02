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
          'computer-science-ai': 'Computer Science & Artificial Intelligence',
          'computer-engineering': 'Computer Science & Artificial Intelligence',
          'artificial-intelligence': 'Computer Science & Artificial Intelligence',
          'software-engineering-cloud': 'Software Engineering & Cloud Computing',
          'software-engineering': 'Software Engineering & Cloud Computing',
          'devops': 'Software Engineering & Cloud Computing',
          'devops-cloud-engineering': 'Software Engineering & Cloud Computing',
          'cybersecurity': 'Software Engineering & Cloud Computing',
          'blockchain': 'Software Engineering & Cloud Computing',
          'mobile-development': 'Software Engineering & Cloud Computing',
          'data-science-analytics': 'Data Science & Business Analytics',
          'data-science': 'Data Science & Business Analytics',
          'financial-markets-economics': 'Financial Markets & Economics',
          'finance': 'Financial Markets & Economics',
          'financial-markets': 'Financial Markets & Economics',
          'economics': 'Financial Markets & Economics',
          'business-management': 'Business Administration & Strategic Management',
          'business-administration': 'Business Administration & Strategic Management',
          'management': 'Business Administration & Strategic Management',
          'psychology-behavioral-sciences': 'Psychology & Behavioral Sciences',
          'psychology': 'Psychology & Behavioral Sciences',
          'behavioral-sciences': 'Psychology & Behavioral Sciences',
          'healthcare-biomedical-sciences': 'Healthcare & Biomedical Sciences',
          'healthcare': 'Healthcare & Biomedical Sciences',
          'medicine': 'Healthcare & Biomedical Sciences',
          'biomedical': 'Healthcare & Biomedical Sciences',
          'product-design-hci': 'Digital Product Design & Human-Computer Interaction (HCI)',
          'design': 'Digital Product Design & Human-Computer Interaction (HCI)',
          'ui-ux': 'Digital Product Design & Human-Computer Interaction (HCI)',
          'hci': 'Digital Product Design & Human-Computer Interaction (HCI)'
        };
        const normalizedTarget = (targetDomain || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let actualDomain = domainMap[normalizedTarget];
        
        if (!actualDomain) {
          if (fallbackQuizData[targetDomain]) {
            actualDomain = targetDomain;
          } else {
            const keys = Object.keys(fallbackQuizData);
            const foundKey = keys.find(k => {
              const kNorm = k.toLowerCase();
              return normalizedTarget.split('-').some(word => word.length > 3 && kNorm.includes(word));
            });
            actualDomain = foundKey || keys[0];
          }
        }

        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        const actualLevel = validLevels.includes(academicLevel) ? academicLevel : 'Beginner';
        const rawPool = fallbackQuizData[actualDomain]?.[actualLevel] || fallbackQuizData[actualDomain]?.['Beginner'] || fallbackQuizData[Object.keys(fallbackQuizData)[0]]['Beginner'];
        
        // Deep clone question pool to safely shuffle
        questionPool = JSON.parse(JSON.stringify(rawPool));

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
