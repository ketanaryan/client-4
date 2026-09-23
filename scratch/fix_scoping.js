const fs = require('fs');
const path = 'src/app/api/generate-quiz/route.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('export async function POST(req: Request) {', 'export async function POST(req: Request) {\n  let targetDomain = "";\n  let academicLevel = "";');
content = content.replace('const { targetDomain, academicLevel, priorKnowledge } = parsedBody.data;', 'targetDomain = parsedBody.data.targetDomain;\n    academicLevel = parsedBody.data.academicLevel;\n    const priorKnowledge = parsedBody.data.priorKnowledge;');

fs.writeFileSync(path, content);
console.log("Fixed scoping!");
