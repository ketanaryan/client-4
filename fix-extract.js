const fs = require('fs');
const path = './src/app/api/extract-flaws/route.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = \      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const { object } = await generateObject({
        model: google('gemini-3.5-flash'),
        schema: flawsSchema,
        prompt: prompt,
        abortSignal: controller.signal
      });
      
      clearTimeout(timeoutId);\;

content = content.replace(/const \{ object \} = await generateObject\(\{\s*model: google\('gemini-3\.5-flash'\),\s*schema: flawsSchema,\s*prompt: prompt,\s*\}\);/m, replacement);
fs.writeFileSync(path, content);
