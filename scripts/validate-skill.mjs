#!/usr/bin/env node
// Validates the repository's SKILL.md against the Agent Skills specification.
// Run with `pnpm validate`. Node strips the TypeScript types in core/skill.ts,
// so this check needs no build step.
import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateSkillDocument } from '../core/skill.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillFile = resolve(repoRoot, 'SKILL.md');
const expectedName = basename(repoRoot);

const source = await readFile(skillFile, 'utf8');
const { ok, issues, frontmatter } = validateSkillDocument(source, { expectedName });

for (const issue of issues) {
  const line = `${issue.severity}: ${issue.path}: ${issue.message}`;
  if (issue.severity === 'error') {
    console.error(line);
  } else {
    console.warn(line);
  }
}

if (!ok) {
  const errors = issues.filter((issue) => issue.severity === 'error').length;
  console.error(`\nSKILL.md is invalid (${errors} error${errors === 1 ? '' : 's'}).`);
  process.exitCode = 1;
} else {
  const version = frontmatter?.metadata?.version ?? 'unversioned';
  console.log(`SKILL.md is valid: ${frontmatter.name} (${version})`);
}
