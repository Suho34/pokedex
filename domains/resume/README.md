# Resume Intelligence

Turns a resume into either a diagnosis or a rewritten document, using only facts
the user supplied.

## Intents

| Intent                                          | Workflow             | Load                                                     |
| ----------------------------------------------- | -------------------- | -------------------------------------------------------- |
| "What is weak?", "why no calls?", feedback only | `resume.analysis`    | `workflows/analysis.md` + `references/methodology.md`    |
| Rewrite, tighten, tailor to a posting           | `resume.improvement` | `workflows/improvement.md` + `references/methodology.md` |

## The separation that matters

`resume.analysis` never rewrites a line and `resume.improvement` never invents
one. Analysis produces findings and fix directions; improvement applies them with
the user's real facts and a changelog.

"Make my resume better" routes to analysis first: the facts are read before
anything is edited, and the analysis ends by offering the improvement pass.

## Required inputs

| Workflow             | Cannot run without                                                         |
| -------------------- | -------------------------------------------------------------------------- |
| `resume.analysis`    | the resume text, verbatim                                                  |
| `resume.improvement` | the resume text, verbatim, plus the target role (a posting when tailoring) |

If the resume is unavailable, ask for it. Never reconstruct it from the profile.

## Rules

- Nothing appears in the output that the user did not state. Missing numbers stay
  visible as `[add number]` with what to measure.
- No technology is listed without supporting evidence in a role, project or
  course.
- Every finding names the line or section it refers to, and a severity.
- Gaps found here are the input to `career.planning`; say so rather than
  inventing experience to fill them.

## Not this domain

Interview rehearsal (`career.job-preparation`), career direction
(`career.planning`), cover letters, portfolio design and salary negotiation.
