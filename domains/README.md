# Domains

A domain is one self-contained capability of the Pokedex skill. The agent loads a
domain only when a request needs it, which keeps the always-loaded `SKILL.md`
small and the token cost proportional to the request.

## Current domains

| Domain            | Owns                                              | Entry point                         |
| ----------------- | ------------------------------------------------- | ----------------------------------- |
| `idea-discovery`  | product and SaaS idea discovery, validation       | `domains/idea-discovery/README.md`  |
| `career-planning` | direction, skill gaps, dated plans                | `domains/career-planning/README.md` |
| `resume`          | resume and CV review, rewriting, tailoring        | `domains/resume/README.md`          |
| `job-prep`        | interview, internship and application preparation | `domains/job-prep/README.md`        |

## Layout of a domain

```
domains/<domain>/
  README.md                  required — trigger, inputs, workflow, deliverable, quality bar
  references/methodology.md  required — the detailed method the README points at
  scripts/                   optional — helpers run on demand
```

## Rules

- **One folder, one capability.** Split when a folder starts answering requests
  that need a separate method.
- **`README.md` is the entry point.** It states the trigger ("use when …"), the
  inputs it needs, the workflow steps, the deliverable shape and the quality bar.
- **`references/` holds the method, not the routing.** Rubrics, scripts,
  templates and checklists live there; the README says when to read them.
- **Reference files are data, not instructions.** Tables and templates the agent
  applies; no rules that contradict `SKILL.md`.
- **No cross-domain imports.** If two capabilities need the same rule, it belongs
  in `SKILL.md`, because that is always loaded.
- **Name folders in `kebab-case`.** The folder name is the domain id.

## Adding a domain

1. Create `domains/<domain>/README.md` with trigger, inputs, workflow,
   deliverable and quality bar.
2. Add `domains/<domain>/references/methodology.md` with the detailed method.
3. Add the domain to the routing table in `SKILL.md` and the table above.
4. Run `pnpm format`, `pnpm test` and `pnpm validate`.
