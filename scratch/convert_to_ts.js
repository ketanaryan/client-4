const fs = require('fs');
const json = fs.readFileSync('src/lib/fallback-quiz-data.json', 'utf8');
const tsContent = `export const fallbackQuizData: any = ${json};`;
fs.writeFileSync('src/lib/fallback-quiz-data.ts', tsContent);
console.log("Converted JSON to TS!");
