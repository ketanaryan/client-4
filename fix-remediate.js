const fs = require('fs');
const path = './src/app/api/remediate-flaw/route.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      prompt: prompt,
      abortSignal: controller.signal
    });

    return result.toDataStreamResponse();`;

content = content.replace(/const result = await streamText\(\{\s*model: google\('gemini-3\.5-flash'\),\s*prompt: prompt,\s*\}\);\s*return result\.toTextStreamResponse\(\);/m, replacement);

fs.writeFileSync(path, content);
