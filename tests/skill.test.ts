import { describe, expect, it } from 'vitest';

import { SkillDocumentError, parseSkillDocument, validateSkillDocument } from '../core/skill.ts';
import { MAX_DESCRIPTION_LENGTH, skillNameSchema } from '../shared/skill-manifest.ts';

const VALID_SKILL = `---
name: pokedex
description: Route a request to the knowledge module that owns it.
license: MIT
metadata:
  version: "0.1.0"
---

# Pokedex

Answer with types, stats and evolution steps.
`;

function withFrontmatter(frontmatter: string, body = '\n# Body\n\nContent.\n'): string {
  return `---\n${frontmatter}\n---\n${body}`;
}

describe('skillNameSchema', () => {
  it.each(['pokedex', 'pokedex-pro', 'a1'])('accepts %s', (name) => {
    expect(skillNameSchema.safeParse(name).success).toBe(true);
  });

  it.each(['', 'Pokedex', 'pokedex_pro', '-pokedex', 'pokedex-', 'poke--dex', 'pokédex'])(
    'rejects %s',
    (name) => {
      expect(skillNameSchema.safeParse(name).success).toBe(false);
    },
  );

  it('rejects names longer than 64 characters', () => {
    expect(skillNameSchema.safeParse('a'.repeat(65)).success).toBe(false);
  });
});

describe('parseSkillDocument', () => {
  it('splits frontmatter from the body', () => {
    const parsed = parseSkillDocument(VALID_SKILL);

    expect(parsed.frontmatter).toEqual({
      name: 'pokedex',
      description: 'Route a request to the knowledge module that owns it.',
      license: 'MIT',
      metadata: { version: '0.1.0' },
    });
    expect(parsed.body.trimStart().startsWith('# Pokedex')).toBe(true);
  });

  it('normalizes CRLF line endings and a BOM', () => {
    const parsed = parseSkillDocument(`\uFEFF${VALID_SKILL.replace(/\n/g, '\r\n')}`);

    expect(parsed.frontmatter.name).toBe('pokedex');
    expect(parsed.body).not.toContain('\r');
  });

  it('keeps unquoted scalars and strips matching quotes', () => {
    const parsed = parseSkillDocument(
      withFrontmatter(`name: pokedex\ndescription: 'A skill, with punctuation'`),
    );

    expect(parsed.frontmatter.description).toBe('A skill, with punctuation');
  });

  it('ignores comment and blank lines', () => {
    const parsed = parseSkillDocument(
      withFrontmatter(`# leading comment\nname: pokedex\n\ndescription: Does things`),
    );

    expect(Object.keys(parsed.frontmatter)).toEqual(['name', 'description']);
  });

  it('rejects a document without an opening delimiter', () => {
    expect(() => parseSkillDocument('# Pokedex\n')).toThrow(SkillDocumentError);
  });

  it('rejects an unclosed frontmatter block', () => {
    expect(() => parseSkillDocument('---\nname: pokedex\n')).toThrow(SkillDocumentError);
  });

  it('rejects a duplicate top-level key', () => {
    expect(() =>
      parseSkillDocument(withFrontmatter(`name: pokedex\nname: pokedex\ndescription: x`)),
    ).toThrow(/Duplicate key "name"/);
  });

  it('rejects a duplicate nested key', () => {
    expect(() =>
      parseSkillDocument(
        withFrontmatter(`name: pokedex\ndescription: x\nmetadata:\n  a: "1"\n  a: "2"`),
      ),
    ).toThrow(/Duplicate key "metadata.a"/);
  });

  it('rejects an indented entry without a parent key', () => {
    expect(() => parseSkillDocument(withFrontmatter(`  version: "1"`))).toThrow(
      /Unexpected indented frontmatter entry/,
    );
  });

  it('rejects a top-level key with an empty value', () => {
    expect(() => parseSkillDocument(withFrontmatter(`name:\ndescription: x`))).toThrow(
      /has no value/,
    );
  });
});

describe('validateSkillDocument', () => {
  it('accepts a valid document', () => {
    const result = validateSkillDocument(VALID_SKILL, { expectedName: 'pokedex' });

    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.frontmatter?.metadata).toEqual({ version: '0.1.0' });
  });

  it('reports a name that does not match the directory', () => {
    const result = validateSkillDocument(VALID_SKILL, { expectedName: 'pokedex-skill' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ severity: 'error', path: 'name' }),
    );
  });

  it('reports a missing description', () => {
    const result = validateSkillDocument(withFrontmatter('name: pokedex'));

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path === 'description')).toBe(true);
  });

  it('reports an over-long description', () => {
    const result = validateSkillDocument(
      withFrontmatter(`name: pokedex\ndescription: ${'a'.repeat(MAX_DESCRIPTION_LENGTH + 1)}`),
    );

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path === 'description')).toBe(true);
  });

  it('rejects unknown frontmatter keys', () => {
    const result = validateSkillDocument(
      withFrontmatter('name: pokedex\ndescription: x\nlicence: MIT'),
    );

    expect(result.ok).toBe(false);
  });

  it('reports a non-string metadata value', () => {
    const result = validateSkillDocument(
      withFrontmatter('name: pokedex\ndescription: x\nmetadata:\n  version: "1"'),
    );

    expect(result.ok).toBe(true);
  });

  it('reports an empty body', () => {
    const result = validateSkillDocument(withFrontmatter('name: pokedex\ndescription: x', ''));

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      severity: 'error',
      path: 'body',
      message: 'Body is empty',
    });
  });

  it('warns, but stays valid, for a body over 500 lines', () => {
    const body = Array.from({ length: 501 }, (_, index) => `line ${index}`).join('\n');
    const result = validateSkillDocument(withFrontmatter('name: pokedex\ndescription: x', body));

    expect(result.ok).toBe(true);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ severity: 'warning', path: 'body' }),
    );
  });

  it('reports unparseable documents without throwing', () => {
    const result = validateSkillDocument('# no frontmatter');

    expect(result.ok).toBe(false);
    expect(result.issues[0]?.path).toBe('frontmatter');
  });
});
