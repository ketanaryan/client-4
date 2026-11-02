# A PROJECT REPORT ON
**EduPredict: AI-Powered Diagnostic Assessment and Learning Pathway Platform**

**SUBMITTED TO THE SAVITRIBAI PHULE PUNE UNIVERSITY, PUNE**  
**IN THE PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE AWARD OF THE DEGREE OF BACHELOR OF ENGINEERING (COMPUTER ENGINEERING)**

**SUBMITTED BY**  
**Student Name:** Ketan Aryan 
**Exam No:** [Insert Exam No]

**UNDER THE GUIDANCE OF**  
**[Insert Guide Name]**

**DEPARTMENT OF COMPUTER ENGINEERING**  
**Sandip Institute of Technology and Research Centre, Nashik - 422213**  
**SAVITRIBAI PHULE PUNE UNIVERSITY 2026-2027**

---

## ACKNOWLEDGEMENT
I would like to express my profound gratitude to my guide, **[Insert Guide Name]**, for their continuous support, motivation, and guidance throughout this project. I also extend my thanks to the Head of the Department of Computer Engineering, **Dr. Ankita V Karale**, and our Principal, **Dr. Amol D. Potgantwar**, for providing the necessary infrastructure and environment to complete this project successfully.

---

## ABSTRACT
**Context:** Traditional learning management systems (LMS) provide a "one-size-fits-all" curriculum, forcing students to trudge through materials they already know or struggle with advanced topics due to unaddressed foundational gaps. 
**Problem:** There is a lack of dynamic, personalized learning environments that can accurately diagnose a student's exact knowledge gaps in real-time and restructure their learning pathway accordingly.
**Solution:** EduPredict is an AI-powered diagnostic assessment and learning pathway platform. It uses large language models (LLMs) to administer dynamic, conversational diagnostic quizzes, extract specific conceptual flaws from the student's answers, and instantly generate a completely customized syllabus. The system injects "micro-remediation" modules to fix broken mental models before the student progresses to advanced topics.
**Conclusion:** By leveraging generative AI for real-time curriculum synthesis and state-synchronized caching, EduPredict drastically reduces learning time, prevents frustration, and ensures true conceptual mastery for technical domains.

---

## TABLE OF CONTENTS
1. [Introduction](#1-introduction)
2. [Literature Survey](#2-literature-survey)
3. [Proposed System](#3-proposed-system)
4. [System Design](#4-system-design)
5. [Technology and Tools Overview](#5-technology-and-tools-overview)
6. [Expected Outcomes and Applications](#6-expected-outcomes-and-applications)
7. [Conclusion and Future Scope](#7-conclusion-and-future-scope)
8. [References](#8-references)

---

## 1. Introduction

### 1.1 Background and Context
The digital education landscape has evolved from static video lectures to interactive platforms. However, the logical structure of courses remains largely linear. When learning complex technical architectures or programming paradigms, students often harbor subtle misconceptions that compound over time, leading to catastrophic failure in later stages of learning.

### 1.2 Motivation / Need of Study
Current diagnostic tests only provide a binary "pass/fail" or a percentage score, which fails to explain *why* a student got a question wrong. There is a strong need for an intelligent system that can interpret free-text answers, understand the specific flaw in the student's reasoning, and intervene before they proceed.

### 1.3 Problem Definition
To design and develop an AI-driven educational platform that evaluates student knowledge through open-ended diagnostic questioning, identifies specific conceptual flaws, and automatically generates a personalized, dynamic curriculum pathway designed to remediate those specific gaps before teaching new material.

### 1.4 Objectives of the Project
*   To develop a dynamic diagnostic engine using Generative AI (Gemini 3.5 Flash).
*   To implement a flaw-extraction algorithm capable of isolating misunderstandings from free-text student answers.
*   To dynamically generate and cache a customized 4-step course pathway.
*   To integrate real-time "micro-remediation" AI modules that stream personalized explanations to the user.
*   To synchronize user progress and unlocked states persistently using a Supabase PostgreSQL backend.

### 1.5 Scope of Work
The current scope includes building the web application architecture, integrating the Vercel AI SDK for LLM streaming, setting up the Supabase database for user caching, creating the diagnostic quiz interface, and developing the dynamic pathway dashboard.

### 1.6 Expected Outcome and Impact
The platform will successfully replace static syllabuses with dynamic ones. The expected impact is a significant reduction in student dropout rates for complex subjects, as the system will catch and repair foundational misunderstandings before they cause frustration.

---

## 2. Literature Survey

### 2.1 Overview of Existing Systems
Existing platforms like Coursera or Udemy offer linear curriculums. Platforms like Khan Academy offer basic adaptive learning (skipping modules based on multiple-choice tests). However, none of these systems analyze the semantic reasoning behind a student's incorrect answer to generate a custom syllabus from scratch.

### 2.2 Comparative Study of Existing Approaches
| Feature | Traditional LMS (Moodle) | Adaptive Systems (Khan Academy) | EduPredict (Proposed) |
| :--- | :--- | :--- | :--- |
| **Curriculum** | Static / Linear | Branching / Pre-defined | 100% Dynamically Generated |
| **Assessment** | Multiple Choice / Manual Grading | Multiple Choice | Conversational / Free-text AI |
| **Gap Detection** | Score-based | Topic-based | Semantic Reasoning Flaw Extraction |

### 2.3 Research Gap Identification
The primary gap is the lack of *generative* remediation. Existing systems can only point a student to pre-recorded videos if they fail a test. There is no system that actively generates a custom explanation tailored specifically to *how* the student misunderstood the concept.

### 2.4 Summary of Findings
Generative AI and structured output parsing (via tools like Zod) make it possible to build an intelligent tutor that not only assesses but also actively redesigns the curriculum on the fly, filling a crucial gap in modern EdTech.

---

## 3. Proposed System

### 3.1 Introduction to Proposed System
EduPredict operates in three primary phases: Diagnostic, Analysis, and Pathway Generation. A student enters a domain (e.g., "Software Architecture"), takes a free-text diagnostic quiz, and the AI evaluates their answers. The system then builds a personalized dashboard with specific modules locked or unlocked based on their prerequisite needs.

### 3.2 System Objectives and Planned Modules
1.  **Authentication & Onboarding Module:** Secure user login and domain selection.
2.  **AI Diagnostic Quiz Module:** Interactive conversational UI streaming questions and evaluating answers.
3.  **Flaw Extraction Engine:** Backend API that parses transcripts to extract an array of specific knowledge gaps.
4.  **Dynamic Pathway Generator:** Generates the structured JSON curriculum and caches it in Supabase.
5.  **Interactive Course Player:** A stateful LMS interface to navigate through generated lessons and quizzes.

### 3.3 Conceptual Workflow / Process Overview
1. User logs in -> 2. Selects Domain -> 3. Takes AI Quiz -> 4. System extracts Flaws -> 5. System generates custom pathway -> 6. User remediates flaws -> 7. User proceeds through interactive course lessons -> 8. Module Completion -> 9. Next module unlocks.

### 3.4 System Architecture Description
The system is built on a modern Next.js App Router architecture. It utilizes React Server Components for performance, Vercel AI SDK for streaming LLM responses, and Supabase for persistent edge caching and authentication.

---

## 4. System Design

### 4.1 System Architecture and Diagrams
*(Figure 1: System Architecture - To be added. Shows Client Browser communicating with Next.js API Routes, which interface with Gemini LLM and Supabase DB).*

### 4.2 Data Flow Diagrams (DFD)
*(Figure 2, 3, 4: Data Flow Diagrams - Level 0, 1, 2 - To be added. Shows flow of user text input to AI SDK, structured JSON response back to client, and cache updates to DB).*

### 4.3 UML Diagrams
*(Figure 5, 6, 7, 8: UML Use Case, Class, Sequence, and Activity Diagrams - To be added. Sequence diagram highlights the async nature of the pathway generation and UI fallback injection).*

### 4.4 Entity Relationship Model
*(Figure 9: ER Diagram - To be added. Shows Profiles table with `id`, `cached_course_pathway` JSONB array, and user metadata).*

---

## 5. Technology and Tools Overview

### 5.1 Software Requirements
*   Web Browser (Chrome, Firefox, Safari)
*   Node.js (v18+)
*   Git for version control

### 5.2 Hardware Requirements
*   Standard PC/Laptop for development.
*   Internet connection for API integration (Vercel, Supabase, Google AI).

### 5.3 Development Platform and Environment
*   **IDE:** Visual Studio Code 
*   **Deployment:** Vercel (Frontend & Serverless APIs)

### 5.4 Programming Languages / Frameworks Selected
*   **Language:** TypeScript / JavaScript
*   **Framework:** Next.js (App Router), React 18
*   **Styling:** Tailwind CSS, Shadcn UI, Framer Motion
*   **AI Integration:** Vercel AI SDK (`@ai-sdk/react`, `@ai-sdk/google`)

### 5.5 Database or Storage Mechanism
*   **Database:** Supabase (PostgreSQL)
*   **Storage type:** JSONB columns for caching dynamic pathways.

### 5.6 Justification for Tool Selection
*   **Next.js:** Chosen for its seamless integration of backend API routes and frontend React components, crucial for handling API keys securely.
*   **Tailwind CSS:** Allows for rapid UI prototyping without context-switching to CSS files.
*   **Vercel AI SDK:** Provides native React hooks (`useCompletion`, `useObject`) that handle the complex data streams required for real-time AI typing effects and structured JSON parsing.

---

## 6. Expected Outcomes and Applications

### 6.1 Anticipated Results and Benefits
*   **For Students:** A frustration-free learning experience that adapts to their exact mental model.
*   **For Educators:** Insights into common conceptual flaws across student populations.

### 6.2 Applications / Use Cases
*   University-level technical courses (Computer Science, Engineering).
*   Corporate training and onboarding for complex software systems.
*   Self-paced online bootcamps.

### 6.3 Limitations and Challenges
*   **LLM Latency & Timeouts:** Generating complex curriculums can take 5-8 seconds, occasionally hitting Vercel's free-tier 10-second serverless timeout. (Mitigated via custom AbortSignals and injected frontend fallbacks).
*   **Hallucinations:** AI may occasionally generate inaccurate reasoning, requiring strict Zod schemas to enforce structured, predictable output.

---

## 7. Conclusion and Future Scope

### 7.1 Summary of Work Done in Semester I
Developed the core application infrastructure, including authentication, the conversational diagnostic quiz engine, flaw extraction algorithms, and the dynamic pathway dashboard. Resolved critical infinite-loop caching bugs and implemented robust Vercel timeout fallbacks. Built the interactive mock Course Player to demonstrate flow.

### 7.2 Proposed Enhancements for Semester II
Integrating real content generation for the course modules (so lessons aren't just placeholders). Implementing a global leaderboard, detailed analytics dashboards for teachers, and expanding the diagnostic engine to support code-execution environments (evaluating student code instead of just text).

### 7.3 Long-Term Vision of the Project
To evolve EduPredict into a white-label enterprise solution that universities and ed-tech companies can plug into their existing infrastructure to instantly make their static courses fully adaptive.

---

## 8. References / Bibliography
1. Next.js Documentation: https://nextjs.org/docs
2. Vercel AI SDK Documentation: https://sdk.vercel.ai/docs
3. Supabase Documentation: https://supabase.com/docs
4. "Generative AI in Education" - Academic Journals (Placeholders)
5. Tailwind CSS Guidelines: https://tailwindcss.com/

---
**Note:** Ensure to replace `[Insert Exam No]` and `[Insert Guide Name]` with your actual details before submission. Diagram placeholders should be updated with actual visual figures in your final Word Document.
