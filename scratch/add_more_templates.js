const fs = require('fs');

const domains = {
  'Computer Engineering': {
    Beginner: [
      { text: "What is the primary function of a [COMPONENT] in a computer system?", options: ["Store data", "Process instructions", "Cool the system", "Provide power"], correctOption: "Process instructions", conceptTarget: "Hardware Basics" },
      { text: "Which component is volatile and loses data when power is off?", options: ["ROM", "[RAM]", "Hard Drive", "SSD"], correctOption: "[RAM]", conceptTarget: "Memory Architecture" },
      { text: "In binary, what does [BITS] represent?", options: ["10", "12", "14", "15"], correctOption: "10", conceptTarget: "Number Systems" },
      { text: "What is the main purpose of an Operating System's [OS_PART]?", options: ["Manage hardware resources", "Design websites", "Compile code", "Run antivirus"], correctOption: "Manage hardware resources", conceptTarget: "OS Fundamentals" },
      { text: "Which of the following is considered a peripheral [DEVICE]?", options: ["CPU", "RAM", "[DEVICE_NAME]", "ALU"], correctOption: "[DEVICE_NAME]", conceptTarget: "I/O Systems" }
    ],
    Intermediate: [
      { text: "In a pipeline architecture, what causes a [HAZARD] hazard?", options: ["Data dependencies", "Control flow changes", "Structural conflicts", "All of the above"], correctOption: "All of the above", conceptTarget: "Pipelining" },
      { text: "Which cache mapping technique uses [MAPPING]?", options: ["Direct", "Fully Associative", "Set Associative", "None"], correctOption: "Set Associative", conceptTarget: "Cache Memory" },
      { text: "What is the role of the [REGISTER] in the CPU?", options: ["Store the next instruction address", "Perform ALU operations", "Manage interrupts", "Hold page tables"], correctOption: "Store the next instruction address", conceptTarget: "CPU Architecture" },
      { text: "How does DMA (Direct Memory Access) improve system performance during [IO_TASK]?", options: ["Bypassing the CPU", "Increasing clock speed", "Compressing data", "Using more power"], correctOption: "Bypassing the CPU", conceptTarget: "I/O Management" },
      { text: "What is the primary benefit of [BRANCH] prediction in modern processors?", options: ["Reducing pipeline stalls", "Increasing cache size", "Lowering power usage", "Simplifying ALU design"], correctOption: "Reducing pipeline stalls", conceptTarget: "Processor Optimization" }
    ],
    Advanced: [
      { text: "How does a [COHERENCE] protocol resolve cache inconsistencies in multi-core systems?", options: ["Snooping", "Directory-based", "Both", "Neither"], correctOption: "Both", conceptTarget: "Multiprocessing" },
      { text: "What is the primary advantage of [VIRTUAL] memory?", options: ["Faster access", "Larger address space than physical RAM", "Less power consumption", "No page faults"], correctOption: "Larger address space than physical RAM", conceptTarget: "Memory Management" },
      { text: "In out-of-order execution, what structure handles [REORDERING]?", options: ["Reorder Buffer", "Reservation Station", "Instruction Queue", "TLB"], correctOption: "Reorder Buffer", conceptTarget: "Instruction Level Parallelism" },
      { text: "What is the consequence of a TLB (Translation Lookaside Buffer) [TLB_EVENT]?", options: ["A page walk is required", "The CPU halts", "Memory is corrupted", "Cache is flushed"], correctOption: "A page walk is required", conceptTarget: "Memory Hierarchy" },
      { text: "Which architecture style is most suited for [COMPUTE_MODEL]?", options: ["SIMD", "SISD", "MIMD", "MISD"], correctOption: "SIMD", conceptTarget: "Parallel Computing" }
    ]
  },
  'Artificial Intelligence': {
    Beginner: [
      { text: "What is the goal of [LEARNING] in Machine Learning?", options: ["Memorize data", "Find patterns and generalize", "Delete outliers", "Sort data"], correctOption: "Find patterns and generalize", conceptTarget: "ML Fundamentals" },
      { text: "Which algorithm is used for [TASK] tasks?", options: ["Linear Regression", "K-Means", "Decision Trees", "PCA"], correctOption: "Linear Regression", conceptTarget: "Supervised Learning" },
      { text: "What does [TERM] stand for in neural networks?", options: ["Artificial Neural Network", "Automated Natural Node", "Algorithmic Number Network", "None"], correctOption: "Artificial Neural Network", conceptTarget: "Neural Networks" },
      { text: "In evaluating an AI, what does [METRIC] measure?", options: ["True positive rate", "Memory usage", "Training time", "Code complexity"], correctOption: "True positive rate", conceptTarget: "Evaluation Metrics" },
      { text: "What is the primary role of training [DATA_TYPE]?", options: ["Teach the model", "Evaluate final accuracy", "Tune hyperparameters", "Style the UI"], correctOption: "Teach the model", conceptTarget: "Data Preparation" }
    ],
    Intermediate: [
      { text: "How does [REGULARIZATION] prevent overfitting?", options: ["By adding a penalty to the loss function", "By increasing model complexity", "By removing data", "By changing the learning rate"], correctOption: "By adding a penalty to the loss function", conceptTarget: "Model Optimization" },
      { text: "What is the purpose of [ACTIVATION] functions?", options: ["Introduce non-linearity", "Speed up training", "Reduce memory", "Initialize weights"], correctOption: "Introduce non-linearity", conceptTarget: "Deep Learning" },
      { text: "In NLP, what does [EMBEDDING] capture?", options: ["Word frequencies", "Semantic relationships", "Syntax trees", "Character counts"], correctOption: "Semantic relationships", conceptTarget: "Natural Language Processing" },
      { text: "What is a major symptom of the [GRADIENT_PROB] in deep networks?", options: ["Weights stop updating", "Training is too fast", "Overfitting on train data", "High memory usage"], correctOption: "Weights stop updating", conceptTarget: "Deep Learning" },
      { text: "In a Convolutional Neural Network, what does a [POOLING] layer do?", options: ["Reduce spatial dimensions", "Increase channels", "Add non-linearity", "Calculate loss"], correctOption: "Reduce spatial dimensions", conceptTarget: "Computer Vision" }
    ],
    Advanced: [
      { text: "How does the [ATTENTION] mechanism improve sequence-to-sequence models?", options: ["By focusing on relevant parts of the input", "By ignoring the input", "By processing sequentially", "By using convolutions"], correctOption: "By focusing on relevant parts of the input", conceptTarget: "Transformer Architecture" },
      { text: "What is the main challenge in training [GAN]s?", options: ["Mode collapse", "Too much data", "Fast convergence", "Easy evaluation"], correctOption: "Mode collapse", conceptTarget: "Generative Models" },
      { text: "In Reinforcement Learning, what equation defines the optimal policy?", options: ["Schrodinger", "Bellman", "Euler", "Navier-Stokes"], correctOption: "Bellman", conceptTarget: "Reinforcement Learning" },
      { text: "Which technique is critical for scaling [LARGE_MODELS] across multiple GPUs?", options: ["Tensor Parallelism", "Data Augmentation", "Dropout", "Early Stopping"], correctOption: "Tensor Parallelism", conceptTarget: "Distributed Training" },
      { text: "How does Proximal Policy Optimization (PPO) handle [RL_ISSUE]?", options: ["Clipping the objective function", "Using a replay buffer", "Adding Gaussian noise", "Ignoring negative rewards"], correctOption: "Clipping the objective function", conceptTarget: "Advanced RL" }
    ]
  },
  'Software Engineering': {
    Beginner: [
      { text: "What is the primary purpose of [VERSION] control?", options: ["Write code", "Track changes", "Compile code", "Deploy code"], correctOption: "Track changes", conceptTarget: "Version Control" },
      { text: "In OOP, what does [PRINCIPLE] allow?", options: ["Hiding data", "Code reuse", "Multiple inheritance", "Polymorphism"], correctOption: "Hiding data", conceptTarget: "Object-Oriented Programming" },
      { text: "What does [HTML] stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Hyperlink Text Module Language", "None"], correctOption: "Hyper Text Markup Language", conceptTarget: "Web Fundamentals" },
      { text: "Which HTTP method is generally used to [HTTP_ACTION] a resource?", options: ["GET", "POST", "PUT", "DELETE"], correctOption: "GET", conceptTarget: "Web APIs" },
      { text: "What is a primary benefit of using an IDE for [DEV_TASK]?", options: ["Syntax highlighting and debugging", "Writing hardware drivers", "Cooling the computer", "Faster internet speed"], correctOption: "Syntax highlighting and debugging", conceptTarget: "Development Tools" }
    ],
    Intermediate: [
      { text: "Which design pattern ensures a class has only one [INSTANCE]?", options: ["Factory", "Singleton", "Observer", "Decorator"], correctOption: "Singleton", conceptTarget: "Design Patterns" },
      { text: "What is the main benefit of [MICROSERVICES] architecture?", options: ["Easier deployment", "Independent scaling", "Less code", "No network latency"], correctOption: "Independent scaling", conceptTarget: "System Architecture" },
      { text: "In SQL, what type of join returns all rows from the [JOIN] table?", options: ["INNER", "LEFT", "RIGHT", "FULL"], correctOption: "LEFT", conceptTarget: "Databases" },
      { text: "What is the purpose of a [CI_CD] pipeline?", options: ["Automate testing and deployment", "Write source code", "Manage database schemas", "Design user interfaces"], correctOption: "Automate testing and deployment", conceptTarget: "DevOps" },
      { text: "In React, what hook is used to manage [REACT_CONCEPT]?", options: ["useState", "useEffect", "useContext", "useRef"], correctOption: "useState", conceptTarget: "Frontend Frameworks" }
    ],
    Advanced: [
      { text: "How does [CAP] theorem restrict distributed systems?", options: ["Can't have Consistency, Availability, Partition tolerance simultaneously", "Must use NoSQL", "Limits data size", "Requires synchronous replication"], correctOption: "Can't have Consistency, Availability, Partition tolerance simultaneously", conceptTarget: "Distributed Systems" },
      { text: "What is a major advantage of [EVENT] sourcing?", options: ["Smaller database", "Complete history of state changes", "Faster queries", "Simpler schema"], correctOption: "Complete history of state changes", conceptTarget: "System Architecture" },
      { text: "In concurrency, how do you prevent a [DEADLOCK]?", options: ["Resource ordering", "More threads", "Less memory", "Global locks"], correctOption: "Resource ordering", conceptTarget: "Concurrency" },
      { text: "Which strategy helps mitigate [DB_ISSUE] in high-traffic databases?", options: ["Sharding", "Normalization", "Indexing", "Foreign Keys"], correctOption: "Sharding", conceptTarget: "Database Scaling" },
      { text: "What is the primary role of a [K8S_COMP] in Kubernetes?", options: ["Manage container orchestration", "Compile code", "Serve static files", "Version control"], correctOption: "Manage container orchestration", conceptTarget: "Cloud Infrastructure" }
    ]
  }
};

const variations = {
  '[COMPONENT]': ['CPU', 'ALU', 'Control Unit', 'GPU', 'FPU'],
  '[RAM]': ['RAM', 'SRAM', 'DRAM', 'NVRAM'],
  '[BITS]': ['1010', '1100', '1110', '1111', '1001'],
  '[OS_PART]': ['Kernel', 'Scheduler', 'Memory Manager'],
  '[DEVICE]': ['input', 'output', 'storage'],
  '[DEVICE_NAME]': ['Mouse', 'Keyboard', 'Printer', 'Monitor'],
  '[HAZARD]': ['data', 'structural', 'control', 'pipeline'],
  '[MAPPING]': ['tags and indices', 'blocks and lines', 'sets and ways', 'direct cache'],
  '[REGISTER]': ['Program Counter', 'Instruction Register', 'Stack Pointer', 'Accumulator'],
  '[IO_TASK]': ['disk transfers', 'network routing', 'graphics rendering'],
  '[BRANCH]': ['branch', 'jump', 'loop'],
  '[COHERENCE]': ['MESI', 'MOESI', 'MSI', 'Write-Invalidate'],
  '[VIRTUAL]': ['paging', 'segmentation', 'virtual', 'demand paging'],
  '[REORDERING]': ['out-of-order execution', 'speculative execution', 'dynamic scheduling'],
  '[TLB_EVENT]': ['miss', 'fault', 'flush'],
  '[COMPUTE_MODEL]': ['vector processing', 'matrix multiplication', 'graphics rendering'],

  '[LEARNING]': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Semi-supervised Learning'],
  '[TASK]': ['classification', 'regression', 'clustering', 'anomaly detection'],
  '[TERM]': ['ANN', 'CNN', 'RNN', 'GAN'],
  '[METRIC]': ['Recall', 'Precision', 'F1-Score', 'Accuracy'],
  '[DATA_TYPE]': ['data', 'sets', 'batches', 'epochs'],
  '[REGULARIZATION]': ['L1/L2', 'Dropout', 'Early Stopping', 'Data Augmentation'],
  '[ACTIVATION]': ['ReLU', 'Sigmoid', 'Tanh', 'Leaky ReLU', 'Softmax'],
  '[EMBEDDING]': ['Word2Vec', 'GloVe', 'BERT', 'FastText'],
  '[GRADIENT_PROB]': ['vanishing gradient', 'exploding gradient', 'dead neuron'],
  '[POOLING]': ['Max Pooling', 'Average Pooling', 'Global Pooling'],
  '[ATTENTION]': ['Self-Attention', 'Multi-Head Attention', 'Scaled Dot-Product', 'Cross-Attention'],
  '[GAN]': ['Generative Adversarial Network', 'DCGAN', 'WGAN', 'CycleGAN'],
  '[LARGE_MODELS]': ['LLMs', 'Transformers', 'Vision Models'],
  '[RL_ISSUE]': ['policy updates', 'reward hacking', 'exploration'],

  '[VERSION]': ['Git', 'SVN', 'Mercurial', 'Perforce'],
  '[PRINCIPLE]': ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
  '[HTML]': ['HTML', 'XML', 'JSON', 'YAML'],
  '[HTTP_ACTION]': ['fetch', 'retrieve', 'read', 'get'],
  '[DEV_TASK]': ['coding', 'programming', 'software development'],
  '[INSTANCE]': ['instance', 'object', 'creation', 'reference'],
  '[MICROSERVICES]': ['Microservices', 'Service-Oriented', 'Decoupled', 'Distributed'],
  '[JOIN]': ['left', 'right', 'outer', 'inner'],
  '[CI_CD]': ['Continuous Integration', 'Continuous Deployment', 'CI/CD'],
  '[REACT_CONCEPT]': ['state', 'side effects', 'context', 'refs'],
  '[CAP]': ['CAP', 'Brewer', 'Distributed'],
  '[EVENT]': ['Event Sourcing', 'CQRS', 'Event-Driven', 'Message Queues'],
  '[DEADLOCK]': ['deadlock', 'livelock', 'race condition', 'starvation'],
  '[DB_ISSUE]': ['bottlenecks', 'read-heavy loads', 'write contention', 'latency'],
  '[K8S_COMP]': ['Control Plane', 'Kubelet', 'Pod', 'Service']
};

const allData = {};

for (const domain of Object.keys(domains)) {
  allData[domain] = {};
  for (const level of Object.keys(domains[domain])) {
    const templates = domains[domain][level];
    let pool = [];
    
    // Generate exactly 30 variations per level per domain (90 per domain, 270 total)
    for (let i = 0; i < 30; i++) {
      // Rotate through the 5 templates for this domain+level
      const template = templates[i % templates.length];
      let text = template.text;
      let correct = template.correctOption;
      let opts = [...template.options];
      
      // Replace placeholders with random variations
      for (const key of Object.keys(variations)) {
        if (text.includes(key)) {
          const vars = variations[key];
          const choice = vars[Math.floor(Math.random() * vars.length)];
          text = text.replace(key, choice);
          
          if (correct.includes(key)) {
             correct = correct.replace(key, choice);
          }
          
          opts = opts.map(opt => opt.includes(key) ? opt.replace(key, choice) : opt);
        }
      }
      
      // Shuffle options so it's not always the same order
      for (let x = opts.length - 1; x > 0; x--) {
        const y = Math.floor(Math.random() * (x + 1));
        [opts[x], opts[y]] = [opts[y], opts[x]];
      }
      
      pool.push({
        id: `fb-${domain.slice(0,2)}-${level.slice(0,3)}-${i}`,
        text: text,
        options: opts,
        correctOption: correct,
        conceptTarget: template.conceptTarget
      });
    }
    allData[domain][level] = pool;
  }
}

fs.writeFileSync('src/lib/fallback-quiz-data.json', JSON.stringify(allData, null, 2));

// Convert to TS
const json = fs.readFileSync('src/lib/fallback-quiz-data.json', 'utf8');
const tsContent = `export const fallbackQuizData: any = ${json};`;
fs.writeFileSync('src/lib/fallback-quiz-data.ts', tsContent);

console.log("Successfully generated exactly 270 highly varied questions!");
