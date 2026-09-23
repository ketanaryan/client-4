# EduPredict: Architectural Framework

This document outlines the technical architecture of the EduPredict platform, specifically detailing how the codebase implements the concepts proposed in the research paper: *"Comprehensive Review of Intelligent Generative AI-Based Predictive Systems for Personalized Academic Pathway Recommendation."*

## 1. System Overview
EduPredict is an adaptive learning system that transitions away from static, collaborative-filtering recommendation engines towards a dynamic, Generative-AI powered closed-loop framework. The system is built using Next.js 16 (App Router), React 19, Tailwind CSS v4, and Supabase (PostgreSQL + pgvector).

---

## 2. Core Architectural Components (Mapping to the Paper)

### Stage 1: Domain Selection and Competency Initialization
**Where it lives:** `src/app/(dashboard)/domain-selection/page.tsx`
**Why it's there:** Traditional systems fail because they rely heavily on past academic transcripts (which may be irrelevant if a student switches fields). We require the user to explicitly define their target domain and self-assess their baseline competency to initialize the predictive engine.

### Stage 2: Adaptive Diagnostic Mini-Quiz Engine
**Where it lives:** `src/app/api/generate-quiz/route.ts` & `src/app/quiz/[domain]/page.tsx`
**Why it's there:** To establish a real-time baseline. Rather than pulling static questions from a database, the system uses Google Gemini 3.1 Pro (via the Vercel AI SDK) to dynamically generate diagnostic questions tailored to the user's selected domain and initialized competency level.

### Stage 3: Predictive Course Recommendation Engine
**Where it lives:** `src/app/api/generate-course-pathway/route.ts`
**Why it's there:** Instead of a rigid curriculum, this Gen-AI engine dynamically synthesizes a sequential 4-course pathway based on the user's diagnostic mastery score.
* **Explainable AI (XAI):** The engine also outputs a natural-language rationale (`reasoning` field) for *why* a specific course was selected, directly addressing the paper's requirement for building student trust.
* **Performance Optimization:** The generated pathway is cached in Supabase (`cached_course_pathway`) to reduce latency and LLM token costs on subsequent loads.

### Stage 4: Flaw and Backlog Extraction Engine
**Where it lives:** `src/app/api/extract-flaws/route.ts`
**Why it's there:** Moving beyond basic "pass/fail" metrics, this engine uses Chain-of-Thought (CoT) reasoning to perform deep diagnostic analytics on incorrect quiz answers. It isolates exact conceptual sub-topics (flaws) that the user lacks. These flaws are saved to the `identified_flaws` table.

### Stage 5: Flaw Button and Gen-AI Remediation (Closed Loop)
**Where it lives:** `src/app/(dashboard)/pathway-recommendations/page.tsx` & `src/app/api/remediate-flaw/route.ts`
**Why it's there:** The core differentiator of the platform. Active flaws are injected into the Predictive Course Engine as "prerequisite blockers," locking the user's next course. 
1. The user clicks **AI Remediation**, which streams a custom micro-learning bridge module.
2. Upon completion, the user clicks **Mark as Understood**, triggering `/api/remediate-flaw-complete/route.ts`.
3. The system instantly modifies the pathway, unlocking the course and proving the system's dynamic adaptability.

---

## 3. Governance and Mathematical Robustness

### Reinforcement Learning from Human Feedback (RLHF)
**Where it lives:** `supabase/migrations/0008_rlhf_feedback.sql`
**Why it's there:** To continually optimize the Gen-AI remediation policy. When a user successfully completes a remediation module (clicks "Mark as Understood"), the system logs a positive scalar reward (`+1`) alongside the concept name in the `remediation_feedback` table. This data is the foundation for future Proximal Policy Optimization (PPO).

### Differential Privacy (DP) Protection
**Where it lives:** `src/lib/differential-privacy.ts`
**Why it's there:** To protect sensitive student analytics from reverse-engineering. The utility contains cryptographic functions to inject calibrated Laplacian noise (governed by an epsilon budget) into aggregated metrics.

---

## 4. UI/UX and Frontend Engineering (Anti-Slop Design)
To ensure maximum engagement and perceived value, the frontend strictly avoids "AI Slop" (generic, templated, overly flashy designs):
* **Typography:** Uses **Geist Sans**, a highly legible, premium geometric sans-serif font, discarding default system serifs.
* **Layout:** Employs CSS Grid with rigid structural padding. The `MobileNav` component ensures the dashboard is 100% responsive without relying on horizontal scrolling.
* **Component Restraint:** Avoids unnecessary gradients, glowing borders, or arbitrary animations. Motion is restricted to functional state changes (e.g., Dialog modals) to maintain a fast, professional, and accessible (WCAG compliant) interface.
