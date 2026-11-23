import type { DomainId, WorkflowId } from '../../shared/domain-catalog.ts';

/**
 * Routing fixtures for `core/intent-router.md`.
 *
 * These are expectations, not an implementation: the host model performs the
 * semantic routing at runtime. `tests/routing.test.ts` checks that every
 * expectation points at a real workflow, that no case expects a domain its
 * workflows do not belong to, and that all six workflows are covered.
 */

export type RoutingCaseType = 'simple' | 'ambiguous' | 'multi-domain';

export interface RoutingExpectation {
  /** Domains the route may load, in load order. */
  domains: DomainId[];
  /** Workflows to execute, in execution order. */
  workflows: WorkflowId[];
  /** True when routing must end with one question instead of executing. */
  clarify: boolean;
}

export interface RoutingCase {
  id: string;
  type: RoutingCaseType;
  prompt: string;
  expected: RoutingExpectation;
  rationale: string;
}

export const routingCases: RoutingCase[] = [
  // ---------------------------------------------------------------- simple
  {
    id: 'simple-discovery',
    type: 'simple',
    prompt: 'Find me a SaaS idea.',
    expected: { domains: ['product'], workflows: ['product.discovery'], clarify: false },
    rationale: 'No idea exists yet, so discovery generates and scores candidates.',
  },
  {
    id: 'simple-discovery-skills',
    type: 'simple',
    prompt: 'What product should I build with my backend skills?',
    expected: { domains: ['product'], workflows: ['product.discovery'], clarify: false },
    rationale:
      'Picks the idea, does not judge one; the skills are the constraint, not a second domain.',
  },
  {
    id: 'simple-evaluation',
    type: 'simple',
    prompt:
      'Is this idea worth building? A tool that watches CI flakiness and tells you which test to fix first.',
    expected: { domains: ['product'], workflows: ['product.evaluation'], clarify: false },
    rationale: 'An idea already exists and a verdict is wanted, so discovery is not loaded.',
  },
  {
    id: 'simple-evaluation-payment',
    type: 'simple',
    prompt: 'Would anyone pay for invoicing software aimed at freelance designers?',
    expected: { domains: ['product'], workflows: ['product.evaluation'], clarify: false },
    rationale: 'Willingness to pay for a named idea is an evaluation question.',
  },
  {
    id: 'simple-career-target',
    type: 'simple',
    prompt: 'Where should my career be in two years?',
    expected: { domains: ['career'], workflows: ['career.planning'], clarify: false },
    rationale: 'Direction over time is planning; there is no application or date to prepare for.',
  },
  {
    id: 'simple-career-gaps',
    type: 'simple',
    prompt: 'Which skills do I need to become a senior backend engineer?',
    expected: { domains: ['career'], workflows: ['career.planning'], clarify: false },
    rationale: 'Gap analysis belongs to planning; no specific employer is named.',
  },
  {
    id: 'simple-job-internship',
    type: 'simple',
    prompt: 'Help me prepare for a full-stack developer internship interview.',
    expected: { domains: ['career'], workflows: ['career.job-preparation'], clarify: false },
    rationale: 'A named role and interview means preparation, not a multi-year plan.',
  },
  {
    id: 'simple-job-takehome',
    type: 'simple',
    prompt: 'I have a take-home due Friday. Help me plan it.',
    expected: { domains: ['career'], workflows: ['career.job-preparation'], clarify: false },
    rationale: 'A deadline on a hiring artefact is job preparation.',
  },
  {
    id: 'simple-resume-review',
    type: 'simple',
    prompt: 'Review my resume and tell me what is weak.',
    expected: { domains: ['resume'], workflows: ['resume.analysis'], clarify: false },
    rationale: 'Feedback without edits is analysis.',
  },
  {
    id: 'simple-resume-no-calls',
    type: 'simple',
    prompt: 'Why am I not getting interviews with this resume?',
    expected: { domains: ['resume'], workflows: ['resume.analysis'], clarify: false },
    rationale: 'Diagnosis of the document, not a rewrite and not a career plan.',
  },
  {
    id: 'simple-resume-rewrite',
    type: 'simple',
    prompt: 'Rewrite my resume for this backend job posting.',
    expected: { domains: ['resume'], workflows: ['resume.improvement'], clarify: false },
    rationale:
      'The word "posting" plus "rewrite" asks for a tailored document; the target role is context, not a career-plan request.',
  },
  {
    id: 'simple-cv-tailor',
    type: 'simple',
    prompt: 'Tailor my CV to this job description.',
    expected: { domains: ['resume'], workflows: ['resume.improvement'], clarify: false },
    rationale: 'CV is a resume; tailoring is an edit, so no analysis pass and no career module.',
  },

  // ------------------------------------------------------------- ambiguous
  {
    id: 'ambiguous-better-resume',
    type: 'ambiguous',
    prompt: 'Make my resume better.',
    expected: { domains: ['resume'], workflows: ['resume.analysis'], clarify: false },
    rationale:
      'Default inside a domain: read the facts first, then offer the rewrite in the same reply.',
  },
  {
    id: 'ambiguous-better-job',
    type: 'ambiguous',
    prompt: 'I want to get a better job.',
    expected: { domains: ['career'], workflows: ['career.planning'], clarify: true },
    rationale:
      'Could be planning or preparation; default to planning but ask whether a specific role is already in play.',
  },
  {
    id: 'ambiguous-no-context',
    type: 'ambiguous',
    prompt: 'Can you make this better?',
    expected: { domains: [], workflows: [], clarify: true },
    rationale:
      'No artefact, no target, no domain; nothing is loaded until one question is answered.',
  },
  {
    id: 'ambiguous-learn-or-build',
    type: 'ambiguous',
    prompt: 'Should I learn Rust or build a product?',
    expected: { domains: ['career'], workflows: ['career.planning'], clarify: false },
    rationale:
      'The deliverable is a personal decision, so planning owns it; product work is added only if the idea is also to be evaluated.',
  },
  {
    id: 'ambiguous-next-step',
    type: 'ambiguous',
    prompt: 'Help me figure out my next step.',
    expected: { domains: ['career'], workflows: ['career.planning'], clarify: true },
    rationale:
      'Direction with no target stated: ask for the target role or outcome before planning.',
  },

  // ---------------------------------------------------------- multi-domain
  {
    id: 'multi-idea-for-internships',
    type: 'multi-domain',
    prompt: 'Find me a SaaS idea that would also help my internship applications.',
    expected: {
      domains: ['product', 'career'],
      workflows: ['product.discovery', 'career.job-preparation'],
      clarify: false,
    },
    rationale:
      'Two deliverables: an idea, and a way to present it in internship applications; feasibility is judged inside discovery, so no third module.',
  },
  {
    id: 'multi-resume-and-interview',
    type: 'multi-domain',
    prompt: "Review my resume and prepare me for Thursday's interview.",
    expected: {
      domains: ['resume', 'career'],
      workflows: ['resume.analysis', 'career.job-preparation'],
      clarify: false,
    },
    rationale: 'Diagnosis before rehearsal; both domains are named explicitly.',
  },
  {
    id: 'multi-plan-and-rewrite',
    type: 'multi-domain',
    prompt: 'Plan my switch to backend engineering and rewrite my resume for that role.',
    expected: {
      domains: ['career', 'resume'],
      workflows: ['career.planning', 'resume.improvement'],
      clarify: false,
    },
    rationale: 'Direction first, then the document is aimed at the target it produced.',
  },
  {
    id: 'multi-idea-and-resume',
    type: 'multi-domain',
    prompt: 'Is this product idea realistic given my skills, and does my resume support it?',
    expected: {
      domains: ['product', 'resume'],
      workflows: ['product.evaluation', 'resume.analysis'],
      clarify: false,
    },
    rationale: 'Two verdicts are requested: on the idea and on the document.',
  },
  {
    id: 'multi-project-and-plan',
    type: 'multi-domain',
    prompt: 'I need a side project for my portfolio and a plan to reach a senior role.',
    expected: {
      domains: ['product', 'career'],
      workflows: ['product.discovery', 'career.planning'],
      clarify: false,
    },
    rationale: 'A buildable project plus a dated plan; the project serves the plan, so both run.',
  },
];
