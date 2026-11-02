// Comprehensive Multi-Agent Automated Audit Suite
const BASE_URL = 'http://localhost:3005';

async function runAudit() {
  console.log("==================================================");
  console.log("🤖 STARTING AUTOMATED MULTI-AGENT PLATFORM AUDIT");
  console.log("Target Server:", BASE_URL);
  console.log("==================================================\n");

  const results = [];

  const testEndpoint = async (name, url, options, validator) => {
    process.stdout.write(`Testing: ${name}... `);
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${url}`, options);
      const latency = Date.now() - start;
      const status = res.status;
      let bodyText = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(bodyText); } catch (_) {}

      const check = await validator(status, parsed, bodyText, res);
      if (check.ok) {
        console.log(`✅ PASSED (${latency}ms) [HTTP ${status}]`);
        results.push({ name, status: 'PASSED', latency, details: check.message });
      } else {
        console.log(`❌ FAILED (${latency}ms) [HTTP ${status}]: ${check.message}`);
        results.push({ name, status: 'FAILED', latency, details: check.message });
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      results.push({ name, status: 'ERROR', latency: Date.now() - start, details: err.message });
    }
  };

  // 1. Landing Page
  await testEndpoint(
    "1. Landing Page (SSR HTML)",
    "/",
    { method: "GET" },
    (status, _, body) => {
      if (status === 200 && body.includes("EduPredict")) {
        return { ok: true, message: "Rendered landing page with branding." };
      }
      return { ok: false, message: "Page content missing or status not 200." };
    }
  );

  // 2. Auth Pages
  await testEndpoint(
    "2. Auth: Login Page",
    "/login",
    { method: "GET" },
    (status, _, body) => {
      if (status === 200 && body.includes("password")) {
        return { ok: true, message: "Login form rendered correctly." };
      }
      return { ok: false, message: "Login page failed to render." };
    }
  );

  await testEndpoint(
    "3. Auth: Register Page",
    "/register",
    { method: "GET" },
    (status, _, body) => {
      if (status === 200 && body.includes("password")) {
        return { ok: true, message: "Registration form rendered correctly." };
      }
      return { ok: false, message: "Register page failed to render." };
    }
  );

  // 4. API: Generate Quiz
  await testEndpoint(
    "4. API: /api/generate-quiz",
    "/api/generate-quiz",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetDomain: "Computer Engineering",
        academicLevel: "Intermediate",
        priorKnowledge: ["Python", "SQL"]
      })
    },
    (status, data) => {
      if (status === 200 && Array.isArray(data?.quiz) && data.quiz.length === 5) {
        return { ok: true, message: `Successfully generated 5 adaptive questions. Sample: "${data.quiz[0].text.substring(0, 40)}..."` };
      }
      return { ok: false, message: "Did not return 5 questions in expected schema." };
    }
  );

  // 5. API: Extract Flaws
  await testEndpoint(
    "5. API: /api/extract-flaws (Chain-of-Thought Diagnosis)",
    "/api/extract-flaws",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test-agent-id",
        domainProfileId: "test-domain-profile-id",
        questions: [
          {
            id: "q1",
            text: "What is time complexity of accessing an array element by index?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
            correctOption: "O(1)",
            conceptTarget: "Array Access"
          },
          {
            id: "q2",
            text: "Which layer handles component isolation in micro-frontends?",
            options: ["Web Workers", "Module Federation", "Cookies", "Local Storage"],
            correctOption: "Module Federation",
            conceptTarget: "Architecture Modularity"
          }
        ],
        answers: {
          q1: "O(n)", // Incorrect on purpose to test flaw extraction
          q2: "Cookies" // Incorrect on purpose
        }
      })
    },
    (status, data) => {
      if (status === 200 && data?.success && typeof data?.score === 'number' && Array.isArray(data?.flaws)) {
        return { ok: true, message: `Diagnosed score: ${data.score}%, isolated ${data.flaws.length} conceptual flaws.` };
      }
      return { ok: false, message: "Failed to extract flaws or compute score." };
    }
  );

  // 6. API: Generate Course Pathway
  await testEndpoint(
    "6. API: /api/generate-course-pathway (XAI Curriculum Synthesis)",
    "/api/generate-course-pathway",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test-agent-id",
        domainName: "Computer Engineering",
        masteryScore: 40,
        flaws: ["Array Access Complexity", "Micro-frontend Isolation"]
      })
    },
    (status, data) => {
      if (status === 200 && Array.isArray(data?.courses) && data.courses.length === 4) {
        const c1 = data.courses[0];
        const hasReasoning = Boolean(c1.reasoning);
        return { ok: true, message: `Generated 4-stage sequential pathway with XAI reasoning: "${c1.title}" (Status: ${c1.status}, HasReasoning: ${hasReasoning})` };
      }
      return { ok: false, message: "Did not return 4 sequential courses." };
    }
  );

  // 7. API: Remediate Flaw
  await testEndpoint(
    "7. API: /api/remediate-flaw (Socratic Micro-Remediation Stream)",
    "/api/remediate-flaw",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flawConcept: "Array Access Complexity"
      })
    },
    (status, _, body) => {
      if (status === 200 && body.length > 50) {
        return { ok: true, message: `Streamed ${body.length} bytes of pedagogical remediation.` };
      }
      return { ok: false, message: "Remediation stream too short or failed." };
    }
  );

  // 8. API: Recommend Career Path
  await testEndpoint(
    "8. API: /api/recommend-career-path (Holistic Profile Matcher)",
    "/api/recommend-career-path",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test-agent-id",
        profile: {
          grade_10_percent: 88,
          grade_12_percent: 85,
          current_degree: "B.E. Computer Engineering",
          current_cgpa: 8.9,
          interests_hobbies: ["Game Development", "Robotics"]
        },
        domainProfile: {
          domain_name: "Computer Engineering"
        },
        masteryScore: 75,
        flaws: []
      })
    },
    (status, data) => {
      if (status === 200 && Array.isArray(data?.paths) && data.paths.length === 3) {
        return { ok: true, message: `Synthesized 3 matched career paths: 1) ${data.paths[0].title}, 2) ${data.paths[1].title}, 3) ${data.paths[2].title}` };
      }
      return { ok: false, message: "Did not return 3 career paths." };
    }
  );

  // 9. API: Generate Study Schedule
  await testEndpoint(
    "9. API: /api/generate-schedule (Weekly Study Calibration)",
    "/api/generate-schedule",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeCommitment: "5-10",
        domainName: "Computer Engineering"
      })
    },
    (status, data) => {
      if (status === 200 && typeof data?.schedule === 'string' && data.schedule.length > 30) {
        return { ok: true, message: `Created day-by-day timetable (${data.schedule.length} chars).` };
      }
      return { ok: false, message: "Schedule string missing or empty." };
    }
  );

  // 10. API: Real-Time AI Academic Tutor Chat
  await testEndpoint(
    "10. API: /api/chat (AI Academic Tutor Streaming Route)",
    "/api/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Can you explain how state synchronization prevents race conditions in 2 sentences?" }
        ],
        courseTitle: "Foundations of Modern Architectures",
        lessonTitle: "Core Architecture"
      })
    },
    (status, _, body) => {
      if (status === 200 && body.length > 30) {
        return { ok: true, message: `AI Tutor streamed response (${body.length} chars): "${body.substring(0, 50)}..."` };
      }
      return { ok: false, message: "AI Tutor chat stream failed or empty." };
    }
  );

  console.log("\n==================================================");
  console.log("📊 AGENT AUDIT SUMMARY REPORT");
  console.log("==================================================");
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASSED').length;
  console.log(`Total Inspected Endpoints: ${total}`);
  console.log(`Passed: ${passed} / ${total} (${Math.round((passed/total)*100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    console.log("🎉 ALL SYSTEMS FUNCTIONING WITH 100% SUCCESS!");
  } else {
    console.log("⚠️ Some endpoints need attention.");
  }
}

runAudit();
