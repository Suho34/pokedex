# Architecture

Pokedex is an Agent Skill, not an application. It ships no server, no UI and no
database: a coding agent reads `SKILL.md` when a request falls inside one of the
skill's domains, routes the request to one workflow, and loads only that
workflow's files.

```
pokedex/
  SKILL.md                  entry point: frontmatter, routing summary, rules
  core/
    intent-router.md        semantic routing: intent -> workflow
    execution-protocol.md   run, review and return a routed workflow
    profile-manager.md      profile read, ask and update protocol
    skill.ts                frontmatter parsing and validation
  domains/
    product/                Product Intelligence
      README.md
      workflows/discovery.md
      workflows/evaluation.md
      references/methodology.md
    career/                 Career Intelligence
      README.md
      workflows/planning.md
      workflows/job-preparation.md
      references/planning-methodology.md
      references/job-preparation-methodology.md
    resume/                 Resume Intelligence
      README.md
      workflows/analysis.md
      workflows/improvement.md
      references/methodology.md
  shared/
    domain-catalog.ts       routable domains, workflow ids and paths
    skill-manifest.ts       Zod schema and spec constants
    schemas/user-profile.schema.json
    templates/profile-template.json
  scripts/                  maintenance commands
  tests/                    Vitest suites and the routing fixture
  docs/                     maintainer documentation
```

## Layers

**Routing (Markdown).** `SKILL.md` is always loaded when the skill applies:
what Pokedex is, the workflow index, the profile rules, the evidence rules and
the output standards. `core/intent-router.md` holds the semantic routing rules —
how an intent maps to a workflow, how ambiguity is handled, and how a
multi-workflow request is composed. `core/execution-protocol.md` holds what
happens after routing: input sufficiency, review gates, output shape.

**Workflows (Markdown).** `domains/<domain>/workflows/<intent>.md` answers one
kind of request: use-when, inputs, steps, deliverable, quality bar, out-of-scope.
`domains/<domain>/references/` holds the detailed method — rubrics, scripts,
templates — loaded only when the workflow names it. A domain `README.md` states
scope, intents and the inputs its workflows cannot run without.

**Profile (JSON + Markdown).** The user's data is a JSON document shaped by
`shared/schemas/user-profile.schema.json`, written from
`shared/templates/profile-template.json`, and manipulated according to
`core/profile-manager.md`. The JSON is data; the Markdown is the protocol.

**Logic (TypeScript).** `core/skill.ts` and `shared/`. Pure functions with no I/O,
no Node built-ins and no framework. `shared/skill-manifest.ts` holds the Zod
schema and spec constants for `SKILL.md`; `shared/domain-catalog.ts` holds the
domain and workflow catalog that the routing fixture is checked against.

**Tooling (Node scripts).** `scripts/` converts the logic into a command-line
check. `scripts/validate-skill.mjs` imports `core/skill.ts` directly and relies on
Node's built-in type stripping, so there is no build step and no bundler.

## Three domains, six workflows

Product, Career and Resume each own two intents:

| Domain  | Workflows                 |
| ------- | ------------------------- |
| Product | discovery, evaluation     |
| Career  | planning, job-preparation |
| Resume  | analysis, improvement     |

The skill is deliberately not split into six skills and has no orchestration
layer. Routing is a decision the host model makes from
`core/intent-router.md`, then a file load; there is no dispatcher process and no
keyword table. Because the router is prose, the expectations live in
`tests/routing/cases.ts` and are checked structurally by `tests/routing.test.ts`:
every expected workflow must exist in the catalog, must belong to an expected
domain, and no case may load a domain its workflows do not belong to.

Composition is limited: one primary workflow, supporting workflows only for a
second named deliverable, three at most, executed in dependency order
(direction before documents, diagnosis before edits). Each workflow keeps its own
deliverable, so a combined request reads as labelled sections rather than a blend.

## Progressive disclosure

The specification asks for three levels:

1. **Always loaded** — `name` and `description`, the only fields an agent reads to
   decide whether the skill applies.
2. **Loaded on use** — the body of `SKILL.md`: workflow index, profile rules,
   evidence rules, output standards, kept under 500 lines.
3. **Loaded on demand** — the domain `README.md`, then one workflow file, then the
   reference that workflow names. Nothing else from `domains/`.

A change that inflates `SKILL.md` should move detail into a workflow file
instead. A change that only applies to one intent belongs in its workflow, never
in the router.

## Profile boundary

The profile is the only persistent user state, and it lives outside the
repository at `~/.pokedex/profile.json`, with an optional project override at
`./.pokedex/profile.json`. Pokedex reads it, asks for what is missing, and writes
only after the user confirms a specific proposed change. No user data is committed
to this repository.

Three invariants, enforced by the protocol rather than by code:

- **No secrets.** Passwords, API keys, tokens and card details are never stored;
  the schema's `additionalProperties: false` rejects unknown keys, and the manager
  refuses secret-looking values explicitly.
- **No silent overwrite.** A write is proposed as JSON, confirmed, then merged;
  arrays of objects merge by name, scalars replace, removals are proposed like
  additions.
- **No guesses.** Only user-stated values reach the file. Inferences stay in the
  conversation with an `Assumption — confirm:` label.

A profile is allowed to be incomplete: only `schemaVersion` is required, and
`core/profile-manager.md` defines the handful of fields each workflow cannot work
without. Missing anything else is handled by asking once, then shipping with the
assumption stated.

## Frontmatter contract

Parsed YAML is deliberately a small subset, because the skill must load with no
dependencies at runtime:

- required: `name`, `description`
- optional: `license`, `compatibility`, `metadata` (flat string map),
  `allowed-tools`
- unsupported: nested maps deeper than one level, anchors, multi-line block
  scalars, flow collections

Unknown keys are rejected. A typo fails `pnpm validate` instead of being ignored by
an agent that never reads the key. If the skill ever needs a feature outside that
subset, extend `core/skill.ts` and add a test rather than loosening the schema.

## Checks

| Command             | Scope                                                   |
| ------------------- | ------------------------------------------------------- |
| `pnpm typecheck`    | `tsc --noEmit` over `core/`, `shared/`, `tests/`        |
| `pnpm test`         | Vitest: parser, schema, routing fixtures, catalog paths |
| `pnpm validate`     | the real `SKILL.md` against the spec rules              |
| `pnpm format:check` | Prettier formatting across the repository               |

`pnpm typecheck` and `pnpm test` never read `SKILL.md`; only `pnpm validate`
does. `tests/domain-catalog.test.ts` reads the repository and fails if a catalogued domain, workflow or reference is missing, or if a workflow file exists that the catalog does not list. The routing fixtures do not call a model — they assert that every expected
route is a real workflow in a real domain and that no fixture loads a module its
workflow does not own. Semantic selection itself is the host model's job at
runtime.

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
- No cloud synchronization and no account requirement for the profile.
- No keyword-matching router, no scoring engine, no dispatcher code.
- No multi-agent orchestration, and no per-workflow skills.
- No generated data pipeline until a workflow needs one; when it does, it lands in
  `scripts/` and its output in that domain's `references/`.
- No agent-specific packaging beyond the paths above.
