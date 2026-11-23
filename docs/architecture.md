# Architecture

Pokedex is an Agent Skill, not an application. It ships no server, no UI and no
database: a coding agent reads `SKILL.md` when a request falls inside one of the
skill's capabilities, then follows its instructions and loads a capability module
from this folder only when the request needs it.

```
pokedex/
  SKILL.md                  entry point: frontmatter, routing, rules
  domains/                  capability modules, loaded on demand
    idea-discovery/
    career-planning/
    resume/
    job-prep/
  core/                     parsing and validation logic (TypeScript)
  shared/                   schema and constants used by core/ and scripts/
  scripts/                  maintenance commands
  tests/                    Vitest suites
  docs/                     maintainer documentation
```

## Layers

**Routing (Markdown).** `SKILL.md` is always loaded when the skill applies. It
holds the capability table, the profile discovery rules, the evidence rules and
the output standards — every rule that must hold for all four capabilities.

**Capability modules (Markdown).** `domains/<capability>/` holds one `README.md`
with trigger, inputs, workflow, deliverable and quality bar, plus a
`references/methodology.md` with the rubrics, scripts and templates. Loaded one
at a time, and only the reference files the README names.

**Logic (TypeScript).** `core/` and `shared/`. Pure functions with no I/O, no
Node built-ins and no framework. `shared/skill-manifest.ts` holds the Zod schema
and the spec constants; `core/skill.ts` parses the frontmatter and validates a
document against that schema.

**Tooling (Node scripts).** `scripts/` converts the logic into a command-line
check. `scripts/validate-skill.mjs` imports `core/skill.ts` directly and relies
on Node's built-in type stripping, so there is no build step and no bundler.

## One skill, four capabilities

The skill is deliberately not split into four skills and has no orchestration
layer. Routing is a lookup in a Markdown table; the agent reads one capability
module instead of spawning agents. This keeps installation to a single folder and
keeps the loaded context small.

A second capability is loaded only when the request names a second deliverable —
"fix my resume and prepare me for the interview" produces a resume revision and
then an interview plan, in that order, with the same evidence rules applied to
both.

## Progressive disclosure

The specification asks for three levels:

1. **Always loaded** — `name` and `description`, the only fields an agent reads
   to decide whether the skill applies.
2. **Loaded on use** — the body of `SKILL.md`: routing, profile rules, evidence
   rules, output standards, kept under 500 lines.
3. **Loaded on demand** — a capability's `README.md`, then its
   `references/methodology.md` when the workflow calls for the detail.

A change that inflates the body should move detail into a capability module
instead. A change that only applies to one capability belongs in that module,
never in `SKILL.md`.

## Profile boundary

The profile is the only persistent user state, and it lives outside the
repository as `.pokedex/profile.md` in the user's workspace or home directory.
Pokedex reads it, asks for what is missing, and never writes to it without
explicit permission. No user data is committed to this repository.

## Frontmatter contract

Parsed YAML is deliberately a small subset, because the skill must load with no
dependencies at runtime:

- required: `name`, `description`
- optional: `license`, `compatibility`, `metadata` (flat string map),
  `allowed-tools`
- unsupported: nested maps deeper than one level, anchors, multi-line block
  scalars, flow collections

Unknown keys are rejected. A typo fails `pnpm validate` instead of being ignored
by an agent that never reads the key. If the skill ever needs a feature outside
that subset, extend `core/skill.ts` and add a test rather than loosening the
schema.

## Checks

| Command             | Scope                                            |
| ------------------- | ------------------------------------------------ |
| `pnpm typecheck`    | `tsc --noEmit` over `core/`, `shared/`, `tests/` |
| `pnpm test`         | Vitest unit tests for the parser and schema      |
| `pnpm validate`     | the real `SKILL.md` against the spec rules       |
| `pnpm format:check` | Prettier formatting across the repository        |

`pnpm typecheck` and `pnpm test` never look at `SKILL.md`; only `pnpm validate`
does. All four together are the definition of a clean tree.

## Installation model

The repository root _is_ the skill folder, so `name: pokedex` matches the
directory name `pokedex`. Installing means copying this folder into the skills
directory an agent scans:

| Agent       | Project scope            | User scope                        |
| ----------- | ------------------------ | --------------------------------- |
| Codex       | `.agents/skills/pokedex` | `~/.agents/skills/pokedex`        |
| Antigravity | `.agents/skills/pokedex` | `~/.gemini/config/skills/pokedex` |
| Claude Code | `.claude/skills/pokedex` | `~/.claude/skills/pokedex`        |

Nothing in the repository is generated for a specific agent, so one copy serves
all of them; only the destination differs.

## Non-goals

- No runtime service, API or database.
- No multi-agent orchestration, and no per-capability skills.
- No generated data pipeline until a capability needs one; when it does, it lands
  in `scripts/` and its output in that capability's `references/`.
- No agent-specific packaging beyond the paths above.
