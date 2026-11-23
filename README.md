# Pokedex

A portable, modular Agent Skill for people who build software. It turns a real
background into a deliverable: a product idea worth testing, a verdict on an
existing idea, a career plan with dates, a prepared application, or a stronger
resume.

This is not an app, a service or a database. It is a folder of instructions and
methodology in the [Agent Skills](https://agentskills.io/specification) format,
which agents such as Codex, Claude Code and Antigravity load on demand.

## Domains and workflows

Three domains, six workflows. The router loads only the workflow a request needs.

| Domain               | Workflow                 | Request                                 | Deliverable                                                       |
| -------------------- | ------------------------ | --------------------------------------- | ----------------------------------------------------------------- |
| Product Intelligence | `product.discovery`      | "What should I build?"                  | Scored candidates, one recommendation, a two-week validation test |
| Product Intelligence | `product.evaluation`     | "Is this idea worth building?"          | Verdict (`proceed`/`narrow`/`stop`), scores, cheapest next test   |
| Career Intelligence  | `career.planning`        | "Where should my career go?"            | Target role, gap table, dated plan with proof artifacts           |
| Career Intelligence  | `career.job-preparation` | "Prep me for this internship interview" | Competency matrix, answer skeletons, dated drill plan             |
| Resume Intelligence  | `resume.analysis`        | "What's weak in my resume?"             | Findings table, requirement gaps, top five fixes (no edits)       |
| Resume Intelligence  | `resume.improvement`     | "Rewrite my resume for this role"       | Rewritten resume, changelog, gap list, ATS notes                  |

One skill, three domains. Routing is semantic, done by the host model from
`core/intent-router.md` — there is no keyword-matching engine. A request that
names two deliverables gets two workflows, executed in dependency order; nothing
else is loaded.

## How it works

```
pokedex/
  SKILL.md                  entry point: routing summary, evidence rules, standards
  core/
    intent-router.md        request -> workflow mapping, ambiguity and multi-domain rules
    execution-protocol.md   how a routed workflow is run, reviewed and returned
    profile-manager.md      profile read, ask and update protocol
    skill.ts                frontmatter parser and document validator
  domains/
    product/                Product Intelligence
      README.md
      workflows/            discovery.md, evaluation.md
      references/           methodology.md
    career/                 Career Intelligence
      README.md
      workflows/            planning.md, job-preparation.md
      references/           planning-methodology.md, job-preparation-methodology.md
    resume/                 Resume Intelligence
      README.md
      workflows/            analysis.md, improvement.md
      references/           methodology.md
  shared/
    domain-catalog.ts       the routable domains and workflow ids
    skill-manifest.ts       Zod schema and spec constants
    schemas/user-profile.schema.json
    templates/profile-template.json
  scripts/                  pnpm validate
  tests/                    Vitest suites, including the routing fixture
  docs/architecture.md
```

`shared/domain-catalog.ts` is the machine-readable list of what can be routed;
`tests/routing/cases.ts` holds simple, ambiguous and multi-domain prompts with
the workflows each must select.

## The profile

Pokedex works from facts. The profile is a plain JSON file the user owns, looked
up at `./.pokedex/profile.json` in the working directory, then
`~/.pokedex/profile.json`, then a path the user names or a profile pasted in the
conversation. No database, no account, no synchronization.

It records professional background, experience level, technical skills with the
evidence for each, preferred stack, existing projects, career goals,
product-building interests, available development time, budget constraints and
preferences. Every field except `schemaVersion` is optional, so a partial profile
stays valid while it is filled in.

```json
{
  "schemaVersion": "1.0",
  "technicalSkills": [
    {
      "name": "TypeScript",
      "level": "advanced",
      "evidence": "checkout rewrite at Acme"
    }
  ],
  "availableDevelopmentTime": { "hoursPerWeek": 6 },
  "budgetConstraints": { "currency": "GBP", "monthlyTooling": 20 }
}
```

Shape: `shared/schemas/user-profile.schema.json`. Starter file:
`shared/templates/profile-template.json`. Behavior — essentials per workflow, the
asking rules, the update protocol and the privacy rules:
`core/profile-manager.md`.

Three rules the skill never breaks: it does not store passwords, API keys or
credentials; it does not silently overwrite an existing profile; and it does not
write inferences into the file.

See [docs/architecture.md](docs/architecture.md) for the layering and
[domains/README.md](domains/README.md) for the domain contract.

## Install

The repository root is the skill folder (`name: pokedex` matches the directory
`pokedex`), so installing is a copy into the directory your agent scans.

```bash
git clone <this-repo> pokedex

# Codex and Antigravity (project or user scope)
mkdir -p ~/.agents/skills && cp -r pokedex ~/.agents/skills/pokedex

# Claude Code (project or user scope)
mkdir -p ~/.claude/skills && cp -r pokedex ~/.claude/skills/pokedex
```

Project scope uses `.agents/skills/pokedex` or `.claude/skills/pokedex` inside
the repository you are working in. Claude Code does not read `.agents/skills`,
so it needs its own copy; keep both in sync or symlink one to the other.
Antigravity's global skills directory is `~/.gemini/config/skills/`.

## Development

Requires Node 24+ and pnpm 12.

```bash
pnpm install
pnpm typecheck      # tsc --noEmit over core/, shared/, tests/
pnpm test           # Vitest: parser, routing fixtures, catalog paths on disk
pnpm validate       # validates the real SKILL.md against the spec
pnpm format:check   # Prettier
```

`pnpm validate` runs `scripts/validate-skill.mjs` directly on TypeScript sources
through Node's type stripping, so no build step is involved.

## Editing the skill

- Change routing, profile rules or output standards in `SKILL.md` and
  `core/intent-router.md`.
- Change a method inside its own workflow file under `domains/<domain>/workflows/`.
- Change profile behavior in `core/profile-manager.md` and its shape in
  `shared/schemas/user-profile.schema.json` together.
- Add a workflow by following [domains/README.md](domains/README.md) — catalog,
  workflow file, README row and routing case together.
- After any edit, run `pnpm format`, `pnpm test` and `pnpm validate`.

## License

MIT — see [LICENSE](LICENSE).
