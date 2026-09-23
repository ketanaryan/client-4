const fs = require('fs');

const domains = {
  'Computer Engineering': {
    Beginner: [
      { text: "What is the primary function of a [COMPONENT] in a computer system?", options: ["Store data", "Process instructions", "Cool the system", "Provide power"], correctOption: "Process instructions", conceptTarget: "Hardware Basics" },
      { text: "Which component is volatile and loses data when power is off?", options: ["ROM", "[RAM]", "Hard Drive", "SSD"], correctOption: "[RAM]", conceptTarget: "Memory Architecture" },
      { text: "In binary, what does [BITS] represent?", options: ["10", "12", "14", "15"], correctOption: "10", conceptTarget: "Number Systems" }
    ],
    Intermediate: [
      { text: "In a pipeline architecture, what causes a [HAZARD] hazard?", options: ["Data dependencies", "Control flow changes", "Structural conflicts", "All of the above"], correctOption: "All of the above", conceptTarget: "Pipelining" },
      { text: "Which cache mapping technique uses [MAPPING]?", options: ["Direct", "Fully Associative", "Set Associative", "None"], correctOption: "Set Associative", conceptTarget: "Cache Memory" },
      { text: "What is the role of the [REGISTER] in the CPU?", options: ["Store the next instruction address", "Perform ALU operations", "Manage interrupts", "Hold page tables"], correctOption: "Store the next instruction address", conceptTarget: "CPU Architecture" }
    ],
    Advanced: [
      { text: "How does a [COHERENCE] protocol resolve cache inconsistencies in multi-core systems?", options: ["Snooping", "Directory-based", "Both", "Neither"], correctOption: "Both", conceptTarget: "Multiprocessing" },
      { text: "What is the primary advantage of [VIRTUAL] memory?", options: ["Faster access", "Larger address space than physical RAM", "Less power consumption", "No page faults"], correctOption: "Larger address space than physical RAM", conceptTarget: "Memory Management" },
      { text: "In out-of-order execution, what structure handles [REORDERING]?", options: ["Reorder Buffer", "Reservation Station", "Instruction Queue", "TLB"], correctOption: "Reorder Buffer", conceptTarget: "Instruction Level Parallelism" }
    ]
  },
  'Artificial Intelligence': {
    Beginner: [
      { text: "What is the goal of [LEARNING] in Machine Learning?", options: ["Memorize data", "Find patterns and generalize", "Delete outliers", "Sort data"], correctOption: "Find patterns and generalize", conceptTarget: "ML Fundamentals" },
      { text: "Which algorithm is used for [TASK] tasks?", options: ["Linear Regression", "K-Means", "Decision Trees", "PCA"], correctOption: "Linear Regression", conceptTarget: "Supervised Learning" },
      { text: "What does [TERM] stand for in neural networks?", options: ["Artificial Neural Network", "Automated Natural Node", "Algorithmic Number Network", "None"], correctOption: "Artificial Neural Network", conceptTarget: "Neural Networks" }
    ],
    Intermediate: [
      { text: "How does [REGULARIZATION] prevent overfitting?", options: ["By adding a penalty to the loss function", "By increasing model complexity", "By removing data", "By changing the learning rate"], correctOption: "By adding a penalty to the loss function", conceptTarget: "Model Optimization" },
      { text: "What is the purpose of [ACTIVATION] functions?", options: ["Introduce non-linearity", "Speed up training", "Reduce memory", "Initialize weights"], correctOption: "Introduce non-linearity", conceptTarget: "Deep Learning" },
      { text: "In NLP, what does [EMBEDDING] capture?", options: ["Word frequencies", "Semantic relationships", "Syntax trees", "Character counts"], correctOption: "Semantic relationships", conceptTarget: "Natural Language Processing" }
    ],
    Advanced: [
      { text: "How does the [ATTENTION] mechanism improve sequence-to-sequence models?", options: ["By focusing on relevant parts of the input", "By ignoring the input", "By processing sequentially", "By using convolutions"], correctOption: "By focusing on relevant parts of the input", conceptTarget: "Transformer Architecture" },
      { text: "What is the main challenge in training [GAN]s?", options: ["Mode collapse", "Too much data", "Fast convergence", "Easy evaluation"], correctOption: "Mode collapse", conceptTarget: "Generative Models" },
      { text: "In Reinforcement Learning, what equation defines the optimal policy?", options: ["Schrodinger", "Bellman", "Euler", "Navier-Stokes"], correctOption: "Bellman", conceptTarget: "Reinforcement Learning" }
    ]
  },
  'Software Engineering': {
    Beginner: [
      { text: "What is the primary purpose of [VERSION] control?", options: ["Write code", "Track changes", "Compile code", "Deploy code"], correctOption: "Track changes", conceptTarget: "Version Control" },
      { text: "In OOP, what does [PRINCIPLE] allow?", options: ["Hiding data", "Code reuse", "Multiple inheritance", "Polymorphism"], correctOption: "Hiding data", conceptTarget: "Object-Oriented Programming" },
      { text: "What does [HTML] stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Hyperlink Text Module Language", "None"], correctOption: "Hyper Text Markup Language", conceptTarget: "Web Fundamentals" }
    ],
    Intermediate: [
      { text: "Which design pattern ensures a class has only one [INSTANCE]?", options: ["Factory", "Singleton", "Observer", "Decorator"], correctOption: "Singleton", conceptTarget: "Design Patterns" },
      { text: "What is the main benefit of [MICROSERVICES] architecture?", options: ["Easier deployment", "Independent scaling", "Less code", "No network latency"], correctOption: "Independent scaling", conceptTarget: "System Architecture" },
      { text: "In SQL, what type of join returns all rows from the [JOIN] table?", options: ["INNER", "LEFT", "RIGHT", "FULL"], correctOption: "LEFT", conceptTarget: "Databases" }
    ],
    Advanced: [
      { text: "How does [CAP] theorem restrict distributed systems?", options: ["Can't have Consistency, Availability, Partition tolerance simultaneously", "Must use NoSQL", "Limits data size", "Requires synchronous replication"], correctOption: "Can't have Consistency, Availability, Partition tolerance simultaneously", conceptTarget: "Distributed Systems" },
      { text: "What is a major advantage of [EVENT] sourcing?", options: ["Smaller database", "Complete history of state changes", "Faster queries", "Simpler schema"], correctOption: "Complete history of state changes", conceptTarget: "System Architecture" },
      { text: "In concurrency, how do you prevent a [DEADLOCK]?", options: ["Resource ordering", "More threads", "Less memory", "Global locks"], correctOption: "Resource ordering", conceptTarget: "Concurrency" }
    ]
  }
};

const variations = {
  '[COMPONENT]': ['CPU', 'ALU', 'Control Unit'],
  '[RAM]': ['RAM', 'SRAM', 'DRAM'],
  '[BITS]': ['1010', '1100', '1110'],
  '[HAZARD]': ['data', 'structural', 'control'],
  '[MAPPING]': ['tags and indices', 'blocks and lines', 'sets and ways'],
  '[REGISTER]': ['Program Counter', 'Instruction Register', 'Stack Pointer'],
  '[COHERENCE]': ['MESI', 'MOESI', 'MSI'],
  '[VIRTUAL]': ['paging', 'segmentation', 'virtual'],
  '[REORDERING]': ['out-of-order execution', 'speculative execution', 'dynamic scheduling'],
  
  '[LEARNING]': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
  '[TASK]': ['classification', 'regression', 'clustering'],
  '[TERM]': ['ANN', 'CNN', 'RNN'],
  '[REGULARIZATION]': ['L1/L2', 'Dropout', 'Early Stopping'],
  '[ACTIVATION]': ['ReLU', 'Sigmoid', 'Tanh'],
  '[EMBEDDING]': ['Word2Vec', 'GloVe', 'BERT'],
  '[ATTENTION]': ['Self-Attention', 'Multi-Head Attention', 'Scaled Dot-Product'],
  '[GAN]': ['Generative Adversarial Network', 'DCGAN', 'WGAN'],
  
  '[VERSION]': ['Git', 'SVN', 'Mercurial'],
  '[PRINCIPLE]': ['Encapsulation', 'Abstraction', 'Inheritance'],
  '[HTML]': ['HTML', 'XML', 'JSON'],
  '[INSTANCE]': ['instance', 'object', 'creation'],
  '[MICROSERVICES]': ['Microservices', 'Service-Oriented', 'Decoupled'],
  '[JOIN]': ['left', 'right', 'outer'],
  '[CAP]': ['CAP', 'Brewer', 'Distributed'],
  '[EVENT]': ['Event Sourcing', 'CQRS', 'Event-Driven'],
  '[DEADLOCK]': ['deadlock', 'livelock', 'race condition']
};

const allData = {};

for (const domain of Object.keys(domains)) {
  allData[domain] = {};
  for (const level of Object.keys(domains[domain])) {
    const templates = domains[domain][level];
    let pool = [];
    
    // Generate exactly 10 variations per level per domain (30 per domain)
    for (let i = 0; i < 10; i++) {
      const template = templates[i % templates.length];
      let text = template.text;
      
      // Replace placeholders with random variations
      for (const key of Object.keys(variations)) {
        if (text.includes(key)) {
          const vars = variations[key];
          const choice = vars[Math.floor(Math.random() * vars.length)];
          text = text.replace(key, choice);
          
          if (template.correctOption.includes(key)) {
             template.correctOption = template.correctOption.replace(key, choice);
          }
          
          template.options = template.options.map(opt => opt.includes(key) ? opt.replace(key, choice) : opt);
        }
      }
      
      pool.push({
        id: `fb-${domain.slice(0,2)}-${level.slice(0,3)}-${i}`,
        text: text,
        options: template.options,
        correctOption: template.correctOption,
        conceptTarget: template.conceptTarget
      });
    }
    allData[domain][level] = pool;
  }
}

fs.writeFileSync('src/lib/fallback-quiz-data.json', JSON.stringify(allData, null, 2));
console.log("Successfully generated realistic 90-question JSON fallback pool!");
