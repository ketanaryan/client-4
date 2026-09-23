const fs = require('fs');
const { generateObject } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { z } = require('zod');
require('dotenv').config({ path: '.env.local' });

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const domains = ['Computer Engineering', 'Artificial Intelligence', 'Software Engineering'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const schema = z.object({
  questions: z.array(
    z.object({
      text: z.string(),
      options: z.array(z.string()).length(4),
      correctOption: z.string(),
      conceptTarget: z.string()
    })
  ).length(10)
});

async function main() {
  const allData = {};
  
  for (const domain of domains) {
    allData[domain] = {};
    for (const level of levels) {
      console.log(`Generating 10 questions for ${domain} - ${level}...`);
      try {
        const { object } = await generateObject({
          model: google('gemini-3.5-flash'),
          schema: schema,
          prompt: `You are an expert professor. Generate exactly 10 high-quality multiple choice questions for a diagnostic quiz.
Domain: ${domain}
Difficulty Level: ${level}

Ensure the questions perfectly match the difficulty level. A beginner question should test basic definitions. An advanced question should test complex architectural trade-offs, math, or advanced system design.
Output exactly 10 questions.`
        });
        allData[domain][level] = object.questions;
        console.log(`Success for ${domain} - ${level}`);
      } catch (e) {
        console.error(`Failed for ${domain} - ${level}`, e);
      }
      
      // wait a bit to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  fs.writeFileSync('src/lib/fallback-quiz-data.json', JSON.stringify(allData, null, 2));
  console.log("Saved to src/lib/fallback-quiz-data.json!");
}

main();
