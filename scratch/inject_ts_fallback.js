const fs = require('fs');
const path = 'src/app/api/generate-quiz/route.ts';
let content = fs.readFileSync(path, 'utf8');

// Add import at top
if (!content.includes('fallbackQuizData')) {
    content = "import { fallbackQuizData } from '@/lib/fallback-quiz-data';\n" + content;
}

const oldFallbackCode = `    // Read from the dynamically generated massive JSON file
    let questionPool = [];
    try {
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(process.cwd(), 'src/lib/fallback-quiz-data.json');
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const allData = JSON.parse(rawData);
      
      const domainMap = {
        'computer-engineering': 'Computer Engineering',
        'artificial-intelligence': 'Artificial Intelligence',
        'software-engineering': 'Software Engineering'
      };
      
      const actualDomain = domainMap[targetDomain] || 'Computer Engineering';
      const actualLevel = academicLevel || 'Beginner';
      
      questionPool = allData[actualDomain]?.[actualLevel] || allData['Computer Engineering']['Beginner'];
    } catch (err) {
      console.error("Failed to read fallback data:", err);
      // Fallback to a tiny absolute emergency pool if file fails
      questionPool = [
        { text: 'In the context of the requested domain, which approach provides the most robust optimization?', options: ['Brute Force', 'Dynamic Programming', 'Randomized Selection', 'Linear Search'], correctOption: 'Dynamic Programming', conceptTarget: 'Optimization Strategies' },
        { text: 'What is the primary advantage of utilizing a closed-loop remediation engine?', options: ['Higher latency', 'Static pathway generation', 'Dynamic real-time adaptation', 'Reduced analytics capability'], correctOption: 'Dynamic real-time adaptation', conceptTarget: 'System Architecture' },
        { text: 'How does Reinforcement Learning from Human Feedback (RLHF) improve outcomes?', options: ['By ignoring user input', 'By updating weights based on scalar rewards', 'By generating random noise', 'By locking out users'], correctOption: 'By updating weights based on scalar rewards', conceptTarget: 'Machine Learning' },
        { text: 'Which cryptographic method ensures Differential Privacy compliance during metric aggregation?', options: ['AES-256', 'Laplacian Noise Injection', 'SHA-256 Hashing', 'RSA Signatures'], correctOption: 'Laplacian Noise Injection', conceptTarget: 'Data Privacy' },
        { text: 'In Explainable AI (XAI), what is the primary purpose of outputting a natural-language rationale?', options: ['To increase token costs', 'To build user trust and transparency', 'To slow down rendering', 'To obfuscate the model logic'], correctOption: 'To build user trust and transparency', conceptTarget: 'Explainable AI' }
      ];
    }`;

const newFallbackCode = `    // Read from the pre-bundled TS file
    let questionPool: any[] = [];
    const domainMap: Record<string, string> = {
      'computer-engineering': 'Computer Engineering',
      'artificial-intelligence': 'Artificial Intelligence',
      'software-engineering': 'Software Engineering'
    };
    const actualDomain = domainMap[targetDomain] || 'Computer Engineering';
    const actualLevel = academicLevel || 'Beginner';
    questionPool = fallbackQuizData[actualDomain]?.[actualLevel] || fallbackQuizData['Computer Engineering']['Beginner'];`;

content = content.replace(oldFallbackCode, newFallbackCode);
fs.writeFileSync(path, content);
console.log("Updated to use TS import!");
