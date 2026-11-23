# Product Intelligence

Turns what the user can actually build into product decisions: new ideas worth
testing, or a verdict on an idea they already have.

## Intents

| Intent                               | Workflow             | Load                      |
| ------------------------------------ | -------------------- | ------------------------- |
| No idea yet, wants options           | `product.discovery`  | `workflows/discovery.md`  |
| Idea already exists, wants a verdict | `product.evaluation` | `workflows/evaluation.md` |

Both share `references/methodology.md` — the scoring rubric, the validation
ladder and the customer-interview script. Load it once per request, not once per
workflow.

## Shared inputs

From the profile where possible, otherwise ask in one message:

- skills the user can ship with today, and the projects that prove them
- domain knowledge from a job, hobby or community (the unfair advantage)
- hours per week and money available before revenue
- who they can reach without paying for ads
- the outcome sought: income, learning, portfolio, or a company

## Required inputs

| Workflow             | Cannot run without                                              |
| -------------------- | --------------------------------------------------------------- |
| `product.discovery`  | skills with evidence, hours per week, budget band               |
| `product.evaluation` | the idea in one paragraph, who pays, the user's relevant skills |

## Technical feasibility

Feasibility is not a separate module. It is judged inside the product workflow
from the user's own skills and hours: if the core of the idea needs a skill the
profile does not show, the idea is priced at the cost of learning it, or cut.
State which skill made the call.

## Rules

- No idea and no verdict before an advantage inventory exists.
- Every idea names a payer and a reachable channel. "SEO" and "viral" are not
  channels for a first customer.
- Verdicts are `proceed`, `narrow` or `stop`, each with numeric kill criteria
  written before the test runs.
- Money and time estimates use the user's stated budget and hours, never a
  default.

## Not this domain

Interview and application preparation (`career.job-preparation`), resume
rewriting (`resume.improvement`), and legal, financial or market-sizing work —
declare those out of scope.
