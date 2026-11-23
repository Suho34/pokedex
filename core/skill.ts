import type { SkillFrontmatter } from '../shared/skill-manifest.ts';
import { RECOMMENDED_MAX_BODY_LINES, skillFrontmatterSchema } from '../shared/skill-manifest.ts';

/** A single frontmatter value: a scalar or a one-level string map. */
export type FrontmatterValue = string | Record<string, string>;

/** Raw, unvalidated frontmatter. */
export type Frontmatter = Record<string, FrontmatterValue>;

/** A parsed `SKILL.md`, before schema validation. */
export interface ParsedSkillDocument {
  frontmatter: Frontmatter;
  body: string;
}

/** Thrown when a `SKILL.md` document cannot be parsed at all. */
export class SkillDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SkillDocumentError';
  }
}

/** Severity of a validation finding. Only `error` makes a document invalid. */
export type SkillIssueSeverity = 'error' | 'warning';

/** One validation finding, located by a dotted path such as `metadata.version`. */
export interface SkillIssue {
  severity: SkillIssueSeverity;
  path: string;
  message: string;
}

export interface SkillValidationOptions {
  /** Directory name the skill lives in; `name` must equal it. */
  expectedName?: string;
}

export interface SkillValidationResult {
  ok: boolean;
  issues: SkillIssue[];
  frontmatter?: SkillFrontmatter;
  body?: string;
}

/** Keys whose value is an indented block of `key: value` pairs. */
const NESTED_KEYS = new Set(['metadata']);

const DELIMITER = '---';

const KEY_PATTERN = /^([A-Za-z0-9_.-]+):(?:[ \t]+(.*))?$/;

const INDENT_PATTERN = /^[ \t]/;

function stripQuotes(raw: string): string {
  const value = raw.trim();
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function parseEntry(raw: string, lineNumber: number): { key: string; value: string } {
  const match = KEY_PATTERN.exec(raw);
  const key = match?.[1];
  if (!match || key === undefined) {
    throw new SkillDocumentError(
      `Invalid frontmatter entry on line ${lineNumber}: ${JSON.stringify(raw)}`,
    );
  }
  return { key, value: match[2] ?? '' };
}

/**
 * Locate and parse the frontmatter block. Only the flat YAML subset the
 * specification needs is supported: scalars, optional quotes, one level of
 * indentation for keys listed in {@link NESTED_KEYS}, and `#` comment lines.
 */
export function parseSkillDocument(source: string): ParsedSkillDocument {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  if (lines[0]?.trim() !== DELIMITER) {
    throw new SkillDocumentError(
      `SKILL.md must start with a "${DELIMITER}" frontmatter delimiter on line 1`,
    );
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === DELIMITER);
  if (closingIndex === -1) {
    throw new SkillDocumentError(`Frontmatter is not closed by a "${DELIMITER}" line`);
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const body = lines.slice(closingIndex + 1).join('\n');

  return { frontmatter: parseFrontmatter(frontmatterLines), body };
}

function parseFrontmatter(lines: string[]): Frontmatter {
  const frontmatter: Frontmatter = {};
  let nestedTarget: Record<string, string> | null = null;
  let nestedKey: string | null = null;

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 2;
    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    if (INDENT_PATTERN.test(line)) {
      if (nestedTarget === null || nestedKey === null) {
        throw new SkillDocumentError(
          `Unexpected indented frontmatter entry on line ${lineNumber}: ${JSON.stringify(line)}`,
        );
      }
      const entry = parseEntry(trimmed, lineNumber);
      if (Object.hasOwn(nestedTarget, entry.key)) {
        throw new SkillDocumentError(
          `Duplicate key "${nestedKey}.${entry.key}" on line ${lineNumber}`,
        );
      }
      nestedTarget[entry.key] = stripQuotes(entry.value);
      continue;
    }

    nestedTarget = null;
    nestedKey = null;

    const entry = parseEntry(trimmed, lineNumber);
    if (Object.hasOwn(frontmatter, entry.key)) {
      throw new SkillDocumentError(`Duplicate key "${entry.key}" on line ${lineNumber}`);
    }

    if (entry.value.trim() === '') {
      if (!NESTED_KEYS.has(entry.key)) {
        throw new SkillDocumentError(
          `Frontmatter key "${entry.key}" has no value on line ${lineNumber}`,
        );
      }
      const nested: Record<string, string> = {};
      frontmatter[entry.key] = nested;
      nestedTarget = nested;
      nestedKey = entry.key;
      continue;
    }

    frontmatter[entry.key] = stripQuotes(entry.value);
  }

  return frontmatter;
}

/**
 * Parse and validate a `SKILL.md` document against the frontmatter schema and
 * the body-length guidance. Returns every finding instead of throwing so
 * callers can report all problems at once.
 */
export function validateSkillDocument(
  source: string,
  options: SkillValidationOptions = {},
): SkillValidationResult {
  let parsed: ParsedSkillDocument;
  try {
    parsed = parseSkillDocument(source);
  } catch (error) {
    if (error instanceof SkillDocumentError) {
      return {
        ok: false,
        issues: [{ severity: 'error', path: 'frontmatter', message: error.message }],
      };
    }
    throw error;
  }

  const issues: SkillIssue[] = [];
  const result = skillFrontmatterSchema.safeParse(parsed.frontmatter);

  if (!result.success) {
    for (const issue of result.error.issues) {
      issues.push({
        severity: 'error',
        path: issue.path.join('.') || 'frontmatter',
        message: issue.message,
      });
    }
  }

  const trimmedBody = parsed.body.trim();
  const bodyLines = trimmedBody === '' ? 0 : trimmedBody.split('\n').length;

  if (bodyLines === 0) {
    issues.push({ severity: 'error', path: 'body', message: 'Body is empty' });
  } else if (bodyLines > RECOMMENDED_MAX_BODY_LINES) {
    issues.push({
      severity: 'warning',
      path: 'body',
      message: `Body is ${bodyLines} lines; the specification recommends at most ${RECOMMENDED_MAX_BODY_LINES}`,
    });
  }

  let frontmatter: SkillFrontmatter | undefined;
  if (result.success) {
    frontmatter = result.data;
    const expectedName = options.expectedName;
    if (expectedName !== undefined && frontmatter.name !== expectedName) {
      issues.push({
        severity: 'error',
        path: 'name',
        message: `Skill name "${frontmatter.name}" must match its directory name "${expectedName}"`,
      });
    }
  }

  const ok = issues.every((issue) => issue.severity !== 'error');

  if (frontmatter === undefined) {
    return { ok, issues };
  }
  return { ok, issues, frontmatter, body: parsed.body };
}
