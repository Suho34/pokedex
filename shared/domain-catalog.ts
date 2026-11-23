/**
 * The Pokedex domain catalog: the single source of truth for what can be routed.
 *
 * `core/intent-router.md` describes the routing rules in prose; this module gives
 * the ids, paths and domain membership that the routing fixture is checked
 * against. When a workflow is added or renamed, update this file, the domain
 * folder and `tests/routing/cases.ts` together.
 */

export const DOMAINS = [
  {
    id: 'product',
    name: 'Product Intelligence',
    path: 'domains/product',
    summary: 'Discovery and evaluation of products the user could build.',
  },
  {
    id: 'career',
    name: 'Career Intelligence',
    path: 'domains/career',
    summary: 'Career direction with dates, and preparation for specific roles.',
  },
  {
    id: 'resume',
    name: 'Resume Intelligence',
    path: 'domains/resume',
    summary: 'Diagnosis and rewriting of the resume for a target role.',
  },
] as const;

export const WORKFLOWS = [
  {
    id: 'product.discovery',
    domain: 'product',
    name: 'Product discovery',
    path: 'domains/product/workflows/discovery.md',
    reference: 'domains/product/references/methodology.md',
  },
  {
    id: 'product.evaluation',
    domain: 'product',
    name: 'Product idea evaluation',
    path: 'domains/product/workflows/evaluation.md',
    reference: 'domains/product/references/methodology.md',
  },
  {
    id: 'career.planning',
    domain: 'career',
    name: 'Career planning',
    path: 'domains/career/workflows/planning.md',
    reference: 'domains/career/references/planning-methodology.md',
  },
  {
    id: 'career.job-preparation',
    domain: 'career',
    name: 'Job preparation',
    path: 'domains/career/workflows/job-preparation.md',
    reference: 'domains/career/references/job-preparation-methodology.md',
  },
  {
    id: 'resume.analysis',
    domain: 'resume',
    name: 'Resume analysis',
    path: 'domains/resume/workflows/analysis.md',
    reference: 'domains/resume/references/methodology.md',
  },
  {
    id: 'resume.improvement',
    domain: 'resume',
    name: 'Resume improvement',
    path: 'domains/resume/workflows/improvement.md',
    reference: 'domains/resume/references/methodology.md',
  },
] as const;

export type DomainId = (typeof DOMAINS)[number]['id'];
export type WorkflowId = (typeof WORKFLOWS)[number]['id'];

export function domainOf(workflowId: WorkflowId): DomainId {
  const workflow = WORKFLOWS.find((candidate) => candidate.id === workflowId);
  if (!workflow) {
    throw new Error(`Unknown workflow: ${workflowId}`);
  }
  return workflow.domain;
}
