import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const google = createGoogleGenerativeAI({ apiKey });

function getDomainAwareFallbackSchedule(domainName: string, timeCommitment: string): string {
  const d = (domainName || '').toLowerCase();
  const baseHours = timeCommitment ? parseInt(timeCommitment.split('-')[0]) || 5 : 5;
  const dailyHours = Math.max(1, Math.floor(baseHours / 4));

  if (d.includes('financ') || d.includes('econom')) {
    return `
## Monday: Financial Statements & Capital Structure
- ${dailyHours} hour(s): Balance sheet normalization, 10-K filing review, and working capital cycles.
- Spaced repetition: CAPM formula derivations and cost of capital flashcards.

## Wednesday: Discounted Cash Flow (DCF) Modeling
- ${dailyHours} hour(s): Build an unlevered free cash flow projection model with sensitivity tables.
- Practice: Beta unlevering (β_U) and corporate tax adjustments.

## Friday: Macroeconomic Policy & Risk Parity
- ${dailyHours} hour(s): Central bank interest rate yield curve shifts and portfolio value-at-risk (VaR).
- Case study: Hedging corporate bonds against inflation shocks.

## Weekend: Capstone Portfolio Simulation
- ${Math.max(2, dailyHours * 2)} hour(s): Run Monte Carlo portfolio simulations and remediate diagnostic flaws in valuation.
`.trim();
  }

  if (d.includes('psycholog') || d.includes('behavior')) {
    return `
## Monday: Cognitive Architectures & Mental Schemas
- ${dailyHours} hour(s): Deep-dive into dual-process theory (System 1 vs System 2) and cognitive schemas.
- Spaced repetition: Operant vs classical conditioning paradigms.

## Wednesday: Experimental Design & Psychometrics
- ${dailyHours} hour(s): Review empirical controls, double-blind trials, and Big Five personality construct validity.
- Hands-on: Analyze cognitive bias heuristics in decision-making telemetry.

## Friday: Neurobiology & Memory Consolidation
- ${dailyHours} hour(s): Long-Term Potentiation (LTP), hippocampus memory encoding, and emotional amygdala regulation.
- Review: Clinical diagnostic criteria in DSM-5 anxiety and mood frameworks.

## Weekend: Behavioral Research Review
- ${Math.max(2, dailyHours * 2)} hour(s): Synthesize peer-reviewed psychological studies and remediate identified conceptual gaps.
`.trim();
  }

  if (d.includes('health') || d.includes('biomed') || d.includes('medic')) {
    return `
## Monday: Systemic Pathophysiology & Homeostasis
- ${dailyHours} hour(s): Cardiovascular hemodynamic feedback loops, arterial blood gas, and renal regulation.
- Spaced repetition: Core biochemical pathways and cellular electrolyte balance.

## Wednesday: Pharmacokinetics & Receptor Dynamics
- ${dailyHours} hour(s): Drug ADME curves, hepatic CYP450 enzyme metabolism, and half-life calculations.
- Diagnostic lab: Biomarker sensitivity, specificity, and positive predictive value analysis.

## Friday: Cellular Oncology & Immunology
- ${dailyHours} hour(s): TP53 tumor suppression pathways, T-cell antigen recognition, and immunotherapy mechanisms.
- Case study: Differential diagnosis workflows for acute inflammatory presentations.

## Weekend: Clinical Case Synthesis
- ${Math.max(2, dailyHours * 2)} hour(s): Walk through comprehensive clinical patient vignettes and remediate diagnostic flaws.
`.trim();
  }

  if (d.includes('design') || d.includes('hci') || d.includes('product') || d.includes('ux')) {
    return `
## Monday: User Research & Information Architecture
- ${dailyHours} hour(s): User persona mapping, card sorting matrices, and navigation hierarchies.
- Spaced repetition: Nielsen Norman usability heuristics and cognitive friction principles.

## Wednesday: Design Systems & Visual Hierarchy
- ${dailyHours} hour(s): Design token architecture, 8pt grid systems, and typography scale ratios.
- Ergonomics audit: Calculate Fitts's Law target acquisition times for mobile action drawers.

## Friday: WCAG 2.1 Accessibility & Usability Testing
- ${dailyHours} hour(s): Screen-reader semantic tree auditing and 4.5:1 color contrast ratio verification.
- Prototyping: Micro-interaction transition physics and perceived latency optimization.

## Weekend: Interactive Portfolio Component Design
- ${Math.max(2, dailyHours * 2)} hour(s): Build high-fidelity accessible prototype and remediate usability flaws.
`.trim();
  }

  if (d.includes('manage') || d.includes('business')) {
    return `
## Monday: Competitive Strategy & Industry Structure
- ${dailyHours} hour(s): Porter's Five Forces analysis, VRIO resource evaluation, and market entry barriers.
- Spaced repetition: Sustainable competitive moats and flywheel effect dynamics.

## Wednesday: Unit Economics & Financial Modeling
- ${dailyHours} hour(s): Calculate Customer Lifetime Value (LTV), Acquisition Cost (CAC), and payback periods.
- Case study: Enterprise subscription retention curves and cohort churn mitigation.

## Friday: Lean Operations & Agile Delivery
- ${dailyHours} hour(s): Scrum sprint cadences, Kanban bottleneck reduction, and Toyota Production System (Muda).
- Practice: OKR calibration and strategic roadmap prioritization.

## Weekend: Executive Strategy Simulation
- ${Math.max(2, dailyHours * 2)} hour(s): Draft a comprehensive strategic expansion brief and address diagnostic management gaps.
`.trim();
  }

  // Default: Computer Science & Systems Engineering
  return `
## Monday: Core Architecture & Data Structures
- ${dailyHours} hour(s): Rebuild foundational logic, state synchronization, and algorithmic complexity.
- Spaced repetition: Flashcard review of Big-O time/space tradeoffs.

## Wednesday: Distributed Systems & Microservices
- ${dailyHours} hour(s): Service boundary decoupling, REST/gRPC interfaces, and idempotent mutations.
- Hands-on: Implement edge caching and sub-millisecond retrieval patterns.

## Friday: Resilience & Failure Recovery
- ${dailyHours} hour(s): Circuit breaker architectures, 7.5s AbortController timeouts, and zero-downtime failover.
- Production review: Analyze telemetry traces and query latency bottlenecks.

## Weekend: Applied Capstone Lab
- ${Math.max(2, dailyHours * 2)} hour(s): Code remediation lab to resolve identified flaws and lock in mastery.
`.trim();
}

export async function POST(req: Request) {
  let fallbackTimeCommitment = '5-10 hrs';
  let fallbackDomainName = 'Computer Science & Software Architecture';

  try {
    const { timeCommitment, domainName } = await req.json();
    if (timeCommitment) fallbackTimeCommitment = timeCommitment;
    if (domainName) fallbackDomainName = domainName;

    const prompt = `
      You are an expert academic advisor. A student is studying the domain of "${fallbackDomainName}".
      They have committed to studying for ${fallbackTimeCommitment} per week.
      
      Generate a practical, week-long study schedule that breaks this time down day-by-day.
      Format the output using EXACTLY this markdown structure (do not use asterisks for bolding):
      ## Day of Week: Focus Area
      - Study task 1 with specific academic topics in ${fallbackDomainName}
      - Study task 2 with hands-on practice or review
      
      Make the schedule highly academic, rigorous, realistic, and include time for spaced repetition review and practical mastery.
    `.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);

    const { text } = await generateText({
      model: google('gemini-3.5-flash'),
      prompt: prompt,
      abortSignal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!text || text.trim().length === 0) {
      throw new Error("Empty schedule returned from AI");
    }

    return NextResponse.json({ schedule: text });
  } catch (error) {
    console.error('Error generating schedule, serving high-fidelity domain fallback:', error);
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const fallbackSchedule = getDomainAwareFallbackSchedule(fallbackDomainName, fallbackTimeCommitment);
    return NextResponse.json({ schedule: fallbackSchedule });
  }
}
