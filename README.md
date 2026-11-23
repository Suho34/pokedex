# Pokedex

A portable, modular Agent Skill for people who build software. It turns a real
background into a deliverable: a product idea worth testing, a career plan with
dates, a stronger resume, or a prepared application.

This is not an app, a service or a database. It is a folder of instructions and
methodology in the [Agent Skills](https://agentskills.io/specification) format,
which agents such as Codex, Claude Code and Antigravity load on demand.

## Capabilities

| Request                              | Capability         | Deliverable                                                            |
| ------------------------------------ | ------------------ | ---------------------------------------------------------------------- |
| "What should I build?"               | Idea discovery     | Scored candidate ideas, one recommendation, a two-week validation test |
| "Where should my career go?"         | Career planning    | Target role, gap table, dated plan with proof artifacts                |
| "Fix my resume"                      | Resume improvement | Rewritten resume, changelog, gap list, ATS notes                       |
| "Help me prepare for this interview" | Job preparation    | Competency matrix, answer skeletons, dated drill plan                  |

One skill, four internal capabilities. `SKILL.md` routes each request to the
single module that owns it; nothing is split into separate skills and no
sub-agents are involved.

## How it works

`SKILL.md` carries the frontmatter an agent needs to decide whether the skill
applies (`name`, `description`), the routing table, the profile rules and the
evidence rules. Each capability lives in `domains/<capability>/` with a `README.md`
(trigger, inputs, workflow, deliverable, quality bar) and a
`references/methodology.md` the agent reads only when it needs the detail.

```
pokedex/
  SKILL.md                  routing, profile rules, evidence rules, output standards
  domains/                  one folder per capability
    idea-discovery/
    career-planning/
    resume/
    job-prep/
  core/                     frontmatter parser and document validator
  shared/                   Zod schema and spec constants
  scripts/                  pnpm validate
  tests/                    Vitest suites
  docs/architecture.md
```

## The profile

Pokedex works from facts. It looks for `.pokedex/profile.md` in the working
directory, then in the home directory, then for a profile pasted in the
conversation. Anything it does not know is either asked for or marked as an
assumption — it never invents experience, skills or achievements.

```markdown
# Profile

- Target: <role> by <date>
- Location / authorisation: <city or remote, status>
- Current role: <title> at <employer>, <dates>
- Skills: <skill> — proven by <project>
- Projects: <name> — <outcome>
- Constraints: <hours per week, budget, notice period>
- Links: <github, site>
```

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
pnpm test           # Vitest
pnpm validate       # validates the real SKILL.md against the spec
pnpm format:check   # Prettier
```

`pnpm validate` runs `scripts/validate-skill.mjs` directly on TypeScript sources
through Node's type stripping, so no build step is involved.

## Editing the skill

- Change routing, profile rules or output standards in `SKILL.md`.
- Change a method inside its own `domains/<capability>/` folder.
- Add a capability following [domains/README.md](domains/README.md).
- After any edit, run `pnpm format`, `pnpm test` and `pnpm validate`.

## License

MIT — see [LICENSE](LICENSE).
