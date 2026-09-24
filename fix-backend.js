const fs = require('fs');
const path = './src/app/api/generate-quiz/route.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `    } catch (error: any) {
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
  }`;

content = content.replace(/\} catch \(error: any\) \{[\s\S]*\}\s*\}/m, replacement);
fs.writeFileSync(path, content);
