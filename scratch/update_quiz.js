const fs = require('fs');

const path = 'src/app/api/generate-quiz/route.ts';
let content = fs.readFileSync(path, 'utf8');

const largeQuestionPool = `    const questionPool = [
      { text: 'In the context of the requested domain, which approach provides the most robust optimization?', options: ['Brute Force', 'Dynamic Programming', 'Randomized Selection', 'Linear Search'], correctOption: 'Dynamic Programming', conceptTarget: 'Optimization Strategies' },
      { text: 'What is the primary advantage of utilizing a closed-loop remediation engine?', options: ['Higher latency', 'Static pathway generation', 'Dynamic real-time adaptation', 'Reduced analytics capability'], correctOption: 'Dynamic real-time adaptation', conceptTarget: 'System Architecture' },
      { text: 'How does Reinforcement Learning from Human Feedback (RLHF) improve outcomes?', options: ['By ignoring user input', 'By updating weights based on scalar rewards', 'By generating random noise', 'By locking out users'], correctOption: 'By updating weights based on scalar rewards', conceptTarget: 'Machine Learning' },
      { text: 'Which cryptographic method ensures Differential Privacy compliance during metric aggregation?', options: ['AES-256', 'Laplacian Noise Injection', 'SHA-256 Hashing', 'RSA Signatures'], correctOption: 'Laplacian Noise Injection', conceptTarget: 'Data Privacy' },
      { text: 'In Explainable AI (XAI), what is the primary purpose of outputting a natural-language rationale?', options: ['To increase token costs', 'To build user trust and transparency', 'To slow down rendering', 'To obfuscate the model logic'], correctOption: 'To build user trust and transparency', conceptTarget: 'Explainable AI' },
      { text: 'Which design pattern is best suited for managing complex state transitions in a frontend application?', options: ['Singleton', 'Observer', 'State Machine', 'Factory'], correctOption: 'State Machine', conceptTarget: 'State Management' },
      { text: 'When designing a highly available distributed database, which theorem dictates the inherent trade-offs?', options: ['Pythagorean Theorem', 'CAP Theorem', 'Moore\\'s Law', 'Amdahl\\'s Law'], correctOption: 'CAP Theorem', conceptTarget: 'Distributed Systems' },
      { text: 'What is the main benefit of using Server-Side Rendering (SSR) over Client-Side Rendering (CSR) for e-commerce?', options: ['Slower initial load', 'Better SEO and faster First Contentful Paint', 'Requires no backend infrastructure', 'Reduces server costs'], correctOption: 'Better SEO and faster First Contentful Paint', conceptTarget: 'Web Architecture' },
      { text: 'In React, what is the primary risk of mutating state directly instead of using a setter function?', options: ['It will cause infinite loops', 'The component will not re-render to reflect the change', 'It increases memory usage', 'It deletes the component'], correctOption: 'The component will not re-render to reflect the change', conceptTarget: 'Frontend Frameworks' },
      { text: 'Which protocol is strictly connectionless and provides no guarantee of delivery?', options: ['TCP', 'HTTP', 'UDP', 'FTP'], correctOption: 'UDP', conceptTarget: 'Networking' },
      { text: 'In neural networks, what problem does the ReLU activation function primarily solve compared to Sigmoid?', options: ['Overfitting', 'Vanishing Gradient Problem', 'High memory usage', 'Exploding gradients'], correctOption: 'Vanishing Gradient Problem', conceptTarget: 'Deep Learning' },
      { text: 'What does Big O notation describe in algorithm analysis?', options: ['The exact execution time in seconds', 'The upper bound of algorithmic complexity', 'The lower bound of memory usage', 'The number of lines of code'], correctOption: 'The upper bound of algorithmic complexity', conceptTarget: 'Algorithmic Complexity' },
      { text: 'Which SQL command is used to combine rows from two or more tables based on a related column?', options: ['MERGE', 'APPEND', 'JOIN', 'CONCAT'], correctOption: 'JOIN', conceptTarget: 'Databases' },
      { text: 'In Git, what is the safest way to undo a published commit without rewriting history?', options: ['git reset --hard', 'git revert', 'git rebase', 'git delete'], correctOption: 'git revert', conceptTarget: 'Version Control' },
      { text: 'What is the primary vulnerability prevented by using parameterized queries?', options: ['Cross-Site Scripting (XSS)', 'SQL Injection', 'Cross-Site Request Forgery (CSRF)', 'Buffer Overflow'], correctOption: 'SQL Injection', conceptTarget: 'Cybersecurity' }
    ];

    // Shuffle the array using Fisher-Yates and pick the first 5
    for (let i = questionPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionPool[i], questionPool[j]] = [questionPool[j], questionPool[i]];
    }

    const selectedQuestions = questionPool.slice(0, 5).map((q, index) => ({
      id: 'fallback-' + (index + 1),
      ...q
    }));

    return NextResponse.json({ 
      success: true, 
      questions: selectedQuestions
    });`;

// Find where the fallback block starts
const searchStr = "return NextResponse.json({";
const startIndex = content.lastIndexOf(searchStr);
if (startIndex !== -1) {
    const endStr = "    });\n  }\n}";
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        // Replace the whole block
        content = content.substring(0, startIndex) + largeQuestionPool + "\n  }\n}";
        fs.writeFileSync(path, content);
        console.log("Successfully injected dynamic fallback questions.");
    } else {
        console.log("Could not find end index");
    }
} else {
    console.log("Could not find start index");
}
