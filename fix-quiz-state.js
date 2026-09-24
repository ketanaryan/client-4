const fs = require('fs');
const path = './src/app/(dashboard)/course/[courseId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state for selectedAnswer
if (!content.includes('const [selectedAnswer, setSelectedAnswer]')) {
  content = content.replace(
    'const [currentLesson, setCurrentLesson] = useState(1);',
    'const [currentLesson, setCurrentLesson] = useState(1);\n  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);'
  );
}

// 2. Replace the hardcoded quiz options
const oldOptions = `<div className="space-y-3">
                  <div className="p-4 border border-zinc-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors">
                    It reduces the overall line count of the codebase.
                  </div>
                  <div className="p-4 border border-indigo-600 bg-indigo-50 rounded-lg cursor-pointer transition-colors relative overflow-hidden">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    It centralizes side-effects, making state changes predictable.
                  </div>
                  <div className="p-4 border border-zinc-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors">
                    It allows the database to be bypassed entirely.
                  </div>
                </div>`;

const newOptions = `<div className="space-y-3">
                  <div 
                    onClick={() => setSelectedAnswer(1)}
                    className={\`p-4 border rounded-lg cursor-pointer transition-colors \${selectedAnswer === 1 ? 'border-indigo-600 bg-indigo-50' : 'border-zinc-200 hover:border-indigo-600 hover:bg-indigo-50'}\`}
                  >
                    It reduces the overall line count of the codebase.
                  </div>
                  <div 
                    onClick={() => setSelectedAnswer(2)}
                    className={\`p-4 border rounded-lg cursor-pointer transition-colors relative overflow-hidden \${selectedAnswer === 2 ? 'border-indigo-600 bg-indigo-50' : 'border-zinc-200 hover:border-indigo-600 hover:bg-indigo-50'}\`}
                  >
                    {selectedAnswer === 2 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                    )}
                    It centralizes side-effects, making state changes predictable.
                  </div>
                  <div 
                    onClick={() => setSelectedAnswer(3)}
                    className={\`p-4 border rounded-lg cursor-pointer transition-colors \${selectedAnswer === 3 ? 'border-indigo-600 bg-indigo-50' : 'border-zinc-200 hover:border-indigo-600 hover:bg-indigo-50'}\`}
                  >
                    It allows the database to be bypassed entirely.
                  </div>
                </div>`;

content = content.replace(oldOptions, newOptions);

fs.writeFileSync(path, content);
