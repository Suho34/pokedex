# Career Intelligence

Turns an ambition into either a dated plan or a prepared application, built from
what the user has actually done.

## Intents

| Intent                                                         | Workflow                 | Load                                                                         |
| -------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Direction, skill gaps, promotion, pivot, timeline              | `career.planning`        | `workflows/planning.md` + `references/planning-methodology.md`               |
| A specific role, interview, internship, take-home, application | `career.job-preparation` | `workflows/job-preparation.md` + `references/job-preparation-methodology.md` |

Load only the reference the chosen workflow names.

## Required inputs

| Workflow                 | Cannot run without                                               |
| ------------------------ | ---------------------------------------------------------------- |
| `career.planning`        | current role, a target role, hours per week available            |
| `career.job-preparation` | the role or posting, and at least one real project to speak from |

Shared, when available: experience level, market, timeline, constraints (notice
period, work authorisation, budget for courses).

## Rules

- **One concrete target**: a role title, a level, a market, a date. Plans and
  preparation both fail when the target is a category ("something in tech").
- **Artifacts over intentions**: every plan item and every drill produces
  something inspectable — a deployed project, a written design, a timed answer.
- **Calibrate to the level**: advice for a senior engineer applied to an
  internship application is a failure, not a stretch.
- **Time maths must fit.** Use the profile's hours per week; if the plan needs
  more, cut scope and say what was cut.
- **No outcome promises.** Say what the work improves, not what it guarantees.

## Handoffs

- Direction is settled but the resume is the blocker → `resume.improvement`.
- The posting names requirements the user cannot prove → list them, then offer
  `career.planning` to close the gaps.

## Not this domain

Writing or rewriting the resume (`resume.*`), deciding what product to build
(`product.*`), and visa or immigration advice — declare those out of scope.
