import { describe, expect, it } from 'vitest';

import { DOMAINS, WORKFLOWS, domainOf, type WorkflowId } from '../shared/domain-catalog.ts';
import { routingCases } from './routing/cases.ts';

const domainIds = DOMAINS.map((domain) => domain.id);
const workflowIds = WORKFLOWS.map((workflow) => workflow.id);

const casesOfType = (type: string) => routingCases.filter((testCase) => testCase.type === type);

describe('routing fixture', () => {
  it('contains at least 15 cases', () => {
    expect(routingCases.length).toBeGreaterThanOrEqual(15);
  });

  it('has unique ids and prompts', () => {
    const ids = routingCases.map((testCase) => testCase.id);
    const prompts = routingCases.map((testCase) => testCase.prompt);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it('covers simple, ambiguous and multi-domain requests', () => {
    expect(casesOfType('simple').length).toBeGreaterThanOrEqual(10);
    expect(casesOfType('ambiguous').length).toBeGreaterThanOrEqual(3);
    expect(casesOfType('multi-domain').length).toBeGreaterThanOrEqual(5);
    expect(
      casesOfType('simple').length +
        casesOfType('ambiguous').length +
        casesOfType('multi-domain').length,
    ).toBe(routingCases.length);
  });

  it('only expects workflows and domains that exist', () => {
    for (const testCase of routingCases) {
      for (const workflow of testCase.expected.workflows) {
        expect(workflowIds).toContain(workflow);
      }
      for (const domain of testCase.expected.domains) {
        expect(domainIds).toContain(domain);
      }
    }
  });

  it('loads no domain outside the routed workflows', () => {
    for (const testCase of routingCases) {
      const routedDomains = [
        ...new Set(testCase.expected.workflows.map((workflow) => domainOf(workflow))),
      ].sort();

      expect(routedDomains).toEqual([...testCase.expected.domains].sort());
    }
  });

  it('routes simple requests to exactly one workflow in one domain', () => {
    for (const testCase of casesOfType('simple')) {
      expect(testCase.expected.domains).toHaveLength(1);
      expect(testCase.expected.workflows).toHaveLength(1);
      expect(testCase.expected.clarify).toBe(false);
    }
  });

  it('keeps ambiguous requests inside one domain and asks when nothing is known', () => {
    for (const testCase of casesOfType('ambiguous')) {
      expect(testCase.expected.domains.length).toBeLessThanOrEqual(1);
      expect(testCase.expected.workflows.length).toBeLessThanOrEqual(1);

      if (testCase.expected.workflows.length === 0) {
        expect(testCase.expected.clarify).toBe(true);
      }
    }
  });

  it('routes multi-domain requests to at least two domains with a workflow each', () => {
    for (const testCase of casesOfType('multi-domain')) {
      expect(testCase.expected.domains.length).toBeGreaterThanOrEqual(2);
      expect(testCase.expected.workflows.length).toBeGreaterThanOrEqual(2);
      expect(testCase.expected.clarify).toBe(false);
    }
  });

  it('exercises every workflow and every domain', () => {
    const usedWorkflows = new Set(routingCases.flatMap((testCase) => testCase.expected.workflows));
    const usedDomains = new Set(routingCases.flatMap((testCase) => testCase.expected.domains));

    for (const workflow of workflowIds) {
      expect(usedWorkflows).toContain(workflow);
    }
    for (const domain of domainIds) {
      expect(usedDomains).toContain(domain);
    }
  });

  it('documents the reason for every expectation', () => {
    for (const testCase of routingCases) {
      expect(testCase.rationale.trim().length).toBeGreaterThan(20);
    }
  });
});

describe('domain catalog', () => {
  it('has unique ids and unique paths', () => {
    const domainPaths = DOMAINS.map((domain) => domain.path);
    const workflowPaths = WORKFLOWS.map((workflow) => workflow.path);

    expect(new Set(domainIds).size).toBe(domainIds.length);
    expect(new Set(domainPaths).size).toBe(domainPaths.length);
    expect(new Set(workflowIds).size).toBe(workflowIds.length);
    expect(new Set(workflowPaths).size).toBe(workflowPaths.length);
  });

  it('names workflow ids after their domain', () => {
    for (const workflow of WORKFLOWS) {
      expect(workflow.id.startsWith(`${workflow.domain}.`)).toBe(true);
      expect(workflow.path.startsWith(`domains/${workflow.domain}/workflows/`)).toBe(true);
    }
  });

  it('gives every domain at least one workflow', () => {
    for (const domain of domainIds) {
      const owned = WORKFLOWS.filter((workflow) => workflow.domain === domain);
      expect(owned.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('resolves a workflow to its domain and rejects unknown ids', () => {
    expect(domainOf('career.job-preparation')).toBe('career');
    expect(() => domainOf('product.nonexistent' as WorkflowId)).toThrow(/Unknown workflow/);
  });
});
