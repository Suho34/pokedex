# Intent router

Pokedex routes by meaning, not by words. The host model reads the request and
classifies it against the six workflows below. There is no keyword table, no
scoring engine and no regex: the model does the semantic work, and this file
defines what counts as which intent, what to load, and when to ask instead of
guessing.

## Routing procedure

1. **Read the whole request**, including anything attached: resume text, a job
   description, a project list, profile facts, earlier turns.
2. **State the outcome in one line** — "wants X so that Y" — before classifying.
   If the outcome cannot be stated, the request is ambiguous (see below).
3. **Match the outcome to one primary workflow** in the table. The primary
   workflow owns the final deliverable.
4. **Look for a second intent that names its own deliverable.** Supporting
   workflows are added only when the request asks for a second output.
5. **Decide whether the request can run now.** If the primary workflow lacks an
   input it cannot work without, ask one question and stop.
6. **Emit the routing decision and load exactly the files it names.** Nothing
   else from `domains/`.

## Workflows

| Intent                                                | Workflow id              | Files to load                                                                                                                         |
| ----------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Product discovery — "what should I build"             | `product.discovery`      | `domains/product/README.md`, `domains/product/workflows/discovery.md`, `domains/product/references/methodology.md`                    |
| Product idea evaluation — "is this idea worth it"     | `product.evaluation`     | `domains/product/README.md`, `domains/product/workflows/evaluation.md`, `domains/product/references/methodology.md`                   |
| Career planning — direction, gaps, dated plan         | `career.planning`        | `domains/career/README.md`, `domains/career/workflows/planning.md`, `domains/career/references/planning-methodology.md`               |
| Job preparation — a specific application or interview | `career.job-preparation` | `domains/career/README.md`, `domains/career/workflows/job-preparation.md`, `domains/career/references/job-preparation-methodology.md` |
| Resume analysis — "what is weak, no edits"            | `resume.analysis`        | `domains/resume/README.md`, `domains/resume/workflows/analysis.md`, `domains/resume/references/methodology.md`                        |
| Resume improvement — rewrite or tailor                | `resume.improvement`     | `domains/resume/README.md`, `domains/resume/workflows/improvement.md`, `domains/resume/references/methodology.md`                     |

Load budget: one domain `README.md`, one workflow, one reference file per routed
workflow. Two workflows from the same domain load that domain's README and its
reference once, not twice.

## Routing decision

State the route in one line before working, so the user can correct it cheaply:

```
Route: primary=resume.improvement supporting=career.job-preparation
```

Then the deliverables follow in that order. Do not narrate the classification
beyond that line.

## Telling similar intents apart

| Signal                                                          | Route                    |
| --------------------------------------------------------------- | ------------------------ |
| No idea yet, wants options                                      | `product.discovery`      |
| Idea already exists, wants a verdict                            | `product.evaluation`     |
| Wants direction, skills, timeline, promotion, pivot             | `career.planning`        |
| Wants to win a specific role, interview, take-home, application | `career.job-preparation` |
| Wants feedback, diagnosis, "why am I not getting calls"         | `resume.analysis`        |
| Wants the document rewritten or tailored to a posting           | `resume.improvement`     |

Rules of thumb:

- **A named artefact outranks a topic.** "Rewrite my resume for backend roles"
  is resume work even though it mentions roles.
- **A date and a named employer mean job preparation**, not career planning.
- **"Make my resume better" is analysis first.** The facts are read before any
  rewriting happens; the analysis then offers the improvement pass.
- **"Should I build X or take job Y" is career planning**, because the
  deliverable is a decision about the person's path. Product work is loaded only
  if they also ask for the product's evaluation.
- **A technology question with no personal decision** ("what is a monorepo") is
  out of scope: Pokedex is not a general coding assistant.

## Multi-workflow requests

Add a supporting workflow only when all three hold:

1. The request names a second deliverable ("and prepare me for the interview").
2. That deliverable has its own workflow.
3. The user has, or can supply, the input it needs.

Then:

- **Two workflows is the norm; three is the maximum.** Each extra workflow must
  produce a section the user asked for.
- **Order by dependency.** Direction before documents: `career.planning` before
  `resume.improvement`. Diagnosis before edits: `resume.analysis` before
  `resume.improvement`. Idea before its evaluation only when both were asked for.
- **Each workflow keeps its own deliverable.** Never blend two workflows into one
  undifferentiated answer.
- **Shared context is read once.** The profile, resume or posting is loaded a
  single time and reused across sections.

Worked examples:

- _"Find me a SaaS idea that would also help my internship applications."_ →
  `product.discovery` primary, `career.job-preparation` supporting. The idea has
  to be buildable in the user's hours and presentable in an interview; technical
  feasibility is judged inside the product workflow from the user's own skills,
  so no separate module is loaded.
- _"Improve my resume."_ → `resume.improvement` only. No career module: no
  direction was asked for.
- _"Review my resume and get me ready for Thursday's interview."_ →
  `resume.analysis` then `career.job-preparation`, in that order.

## Ambiguous requests

An ambiguous request is one where two or more workflows would each produce a
plausible deliverable and the request gives no basis to choose.

- **Default inside a domain, ask across domains.** Within one domain, choose the
  safer workflow: analysis before improvement, planning before a plan's
  execution. Across domains, ask.
- **Ask exactly one question**, offering the concrete deliverables:
  "Do you want a diagnosis of the resume, or a rewritten version for a specific
  role?"
- **Never average two workflows.** A blended answer that half-rewrites and
  half-plans satisfies neither.
- **No context at all** ("can you make this better?") → no domain loaded, one
  question, nothing executed.

## Out of scope

Decline in one line and name the closest workflow. Do not stretch a methodology
to cover unrelated engineering, legal, immigration or financial-advice requests.

## Verification

`tests/routing/cases.ts` holds the routing fixture: simple, ambiguous and
multi-workflow prompts with the expected workflow ids. `tests/routing.test.ts`
checks that every expected workflow exists in `shared/domain-catalog.ts`, that no
case expects a domain its workflows do not belong to, and that the fixture covers
all six workflows. `tests/domain-catalog.test.ts` additionally reads the
repository and fails when a catalogued path is missing or the router document
does not mention a workflow. When routing rules change, change both with them.
