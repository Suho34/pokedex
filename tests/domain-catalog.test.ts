import { existsSync, readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { DOMAINS, WORKFLOWS } from '../shared/domain-catalog.ts';

/**
 * Keeps `shared/domain-catalog.ts` honest: the routing fixture and the router
 * document are only trustworthy if every path they name exists in the repository.
 */

const ROUTER_DOCUMENT = 'core/intent-router.md';

const baseName = (path: string) => path.split('/').pop() ?? path;

describe('catalog paths on disk', () => {
  it('has a README for every domain', () => {
    for (const domain of DOMAINS) {
      expect(existsSync(`${domain.path}/README.md`), `${domain.id} README`).toBe(true);
    }
  });

  it('has a workflow file for every workflow entry', () => {
    for (const workflow of WORKFLOWS) {
      expect(existsSync(workflow.path), `${workflow.id} workflow`).toBe(true);
    }
  });

  it('has a reference file for every workflow entry', () => {
    for (const workflow of WORKFLOWS) {
      expect(existsSync(workflow.reference), `${workflow.id} reference`).toBe(true);
    }
  });

  it('names each workflow file after its intent', () => {
    for (const workflow of WORKFLOWS) {
      const intent = workflow.id.slice(workflow.id.indexOf('.') + 1);
      expect(baseName(workflow.path)).toBe(`${intent}.md`);
    }
  });

  it('catalogues every workflow file present on disk, and nothing else', () => {
    for (const domain of DOMAINS) {
      const onDisk = readdirSync(`${domain.path}/workflows`)
        .filter((file) => file.endsWith('.md'))
        .sort();
      const catalogued = WORKFLOWS.filter((workflow) => workflow.domain === domain.id)
        .map((workflow) => baseName(workflow.path))
        .sort();

      expect(onDisk, `${domain.id} workflows`).toEqual(catalogued);
    }
  });
});

describe('router document matches the catalog', () => {
  it('mentions every workflow id and domain path', () => {
    const router = readFileSync(ROUTER_DOCUMENT, 'utf8');

    for (const workflow of WORKFLOWS) {
      expect(router, `${workflow.id} in router`).toContain(`\`${workflow.id}\``);
    }
    for (const domain of DOMAINS) {
      expect(router, `${domain.id} in router`).toContain(`${domain.path}/README.md`);
    }
  });
});
