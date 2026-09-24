const fs = require('fs');
const path = './src/app/api/generate-quiz/route.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5s hard limit before Vercel 10s kill

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      schema: quizSchema,
      prompt: prompt,
      abortSignal: controller.signal
    });
    
    clearTimeout(timeoutId);

    return NextResponse.json({ quiz: object.questions });`;

content = content.replace(/const \{ object \} = await generateObject\(\{\s*model: google\('gemini-3\.5-flash'\),\s*schema: quizSchema,\s*prompt: prompt,\s*\}\);\s*return NextResponse\.json\(\{ quiz: object\.questions \}\);/m, replacement);

fs.writeFileSync(path, content);
