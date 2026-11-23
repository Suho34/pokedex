# Domains

A domain is one area of capability inside the Pokedex skill. Each domain holds
several **intents**, and every intent is one workflow file the agent loads only
when `core/intent-router.md` routes a request to it.

## Current domains

| Domain                           | Workflows                                   |
| -------------------------------- | ------------------------------------------- |
| `product` — Product Intelligence | `product.discovery`, `product.evaluation`   |
| `career` — Career Intelligence   | `career.planning`, `career.job-preparation` |
| `resume` — Resume Intelligence   | `resume.analysis`, `resume.improvement`     |

The same three domains and six workflows are declared in
`shared/domain-catalog.ts`, which is what the routing fixture is checked against.

## Layout

```
domains/<domain>/
  README.md                    required — scope, intents, required inputs, rules
  workflows/<intent>.md        required — one file per intent: steps, deliverable, quality bar
  references/<method>.md       required — the detailed method the workflow points at
  scripts/                     optional — helpers run on demand
```

## Rules

- **One workflow, one intent.** A workflow file answers exactly one kind of
  request. If a file starts serving two, split it and add both to the catalog.
- **The domain `README.md` is loaded first**, then the workflow, then only the
  reference that workflow names. That is the load budget; nothing else from the
  domain is read.
- **Workflows never reference another domain's files.** Composing domains is the
  router's job (`core/intent-router.md`), and each workflow still produces its
  own deliverable.
- **References hold method, not routing.** Rubrics, scripts and templates only.
  No rule that contradicts `SKILL.md`.
- **Name folders in `kebab-case`**, workflow files after the intent
  (`job-preparation.md`), and ids as `<domain>.<intent>`.

## Adding a workflow

1. Create `domains/<domain>/workflows/<intent>.md` with use-when, inputs, steps,
   deliverable, quality bar and out-of-scope.
2. Add the intent row to `domains/<domain>/README.md`.
3. Add the workflow to `shared/domain-catalog.ts`.
4. Add a routing case to `tests/routing/cases.ts`, including a negative neighbour
   that must _not_ route there.
5. Run `pnpm format`, `pnpm test` and `pnpm validate`.

## Adding a domain

Same as above, plus: state which domain it hands off to, and add it to the router
table in `core/intent-router.md`.
