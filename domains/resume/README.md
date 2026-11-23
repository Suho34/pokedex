# Resume improvement

Rewrite or tailor a resume using only facts the user supplied, aimed at one
target role.

## Use when

The user asks to review, fix, rewrite or tailor a resume or CV, or asks why
applications are not converting. Interview rehearsal belongs to job preparation.

## Inputs

- the current resume text (ask for it verbatim; do not work from memory of it)
- the target role, and the job description when tailoring
- the profile, for facts missing from the resume
- page limit and market conventions, if the user has them

If the resume is unavailable, ask for it before rewriting. Do not reconstruct it
from the profile.

## Workflow

1. **Extract facts.** Build a list of roles, dates, technologies and outcomes
   exactly as written. Note every bullet with no outcome and every claim with no
   evidence.
2. **Read the target.** For a job description, list its requirements in the order
   the posting emphasises them. Without one, use the role conventions from
   `references/methodology.md`.
3. **Map evidence to requirements.** For each requirement: which existing fact
   proves it, weakly or strongly, or nothing does.
4. **Rewrite bullets.** Use verb + scope + mechanism + outcome, with numbers only
   where the user supplied them. Keep one line per bullet where possible.
5. **Reorder and trim.** Most relevant section first; cut content that proves
   nothing for this target. Respect the page limit.
6. **Report gaps.** List requirements nothing proves, and the cheapest way to
   earn each — this list feeds career planning.

## Deliverable

1. The revised resume, section by section, in plain text ready to paste.
2. A changelog: what changed, why, and which requirement each change serves.
3. A gap list: unproven requirements with a suggested artifact for each.
4. Notes on formatting risk (columns, tables, graphics, file type) for the
   applicant tracking system in use, when known.

## Quality bar

- Nothing appears in the output that the user did not state or that is not a
  restatement of something they stated.
- Missing numbers stay visible as `[add number]` rather than being invented or
  quietly dropped.
- No technology is listed that has no supporting project, role or course.
- Length and section order follow the target market, not personal preference.
- "Improved performance" style bullets are rewritten to name the mechanism or
  removed.

## Out of scope

Cover letters, portfolio site design, and salary discussion. Offer the relevant
module instead.
