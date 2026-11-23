import { z } from 'zod';

/** Maximum length of the `name` field, per the Agent Skills specification. */
export const MAX_NAME_LENGTH = 64;

/** Maximum length of the `description` field, per the Agent Skills specification. */
export const MAX_DESCRIPTION_LENGTH = 1024;

/** Maximum length of the optional `compatibility` field. */
export const MAX_COMPATIBILITY_LENGTH = 500;

/** Body length the specification recommends staying under. */
export const RECOMMENDED_MAX_BODY_LINES = 500;

/**
 * Skill names are lowercase alphanumeric words joined by single hyphens:
 * 1-64 characters, no leading or trailing hyphen, no doubled hyphen. The value
 * must also match the skill's directory name, which callers check separately
 * because the schema cannot see the filesystem.
 */
export const skillNameSchema = z
  .string()
  .min(1, 'must not be empty')
  .max(MAX_NAME_LENGTH, `must be at most ${MAX_NAME_LENGTH} characters`)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'must be lowercase letters, digits and single hyphens (no leading, trailing or doubled hyphen)',
  );

/**
 * The YAML frontmatter of a `SKILL.md` file. Unknown keys are rejected so a
 * typo (`licence:`) fails loudly instead of being silently dropped by an agent.
 */
export const skillFrontmatterSchema = z
  .object({
    name: skillNameSchema,
    description: z
      .string()
      .min(1, 'must not be empty')
      .max(MAX_DESCRIPTION_LENGTH, `must be at most ${MAX_DESCRIPTION_LENGTH} characters`),
    license: z.string().min(1, 'must not be empty').optional(),
    compatibility: z
      .string()
      .min(1, 'must not be empty')
      .max(MAX_COMPATIBILITY_LENGTH, `must be at most ${MAX_COMPATIBILITY_LENGTH} characters`)
      .optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    'allowed-tools': z.string().min(1, 'must not be empty').optional(),
  })
  .strict();

/** Validated frontmatter of a `SKILL.md` file. */
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;
