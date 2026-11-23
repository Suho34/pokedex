# Resume improvement

Rewrite or tailor a resume using only facts the user supplied, aimed at one
target role.

## Use when

The user wants the document changed: "rewrite my resume", "tailor my CV to this
posting", "make these bullets stronger". For diagnosis without edits, use
`analysis.md`.

## Inputs

- the resume text, verbatim
- the target role, and the posting when tailoring
- the profile, for facts missing from the resume
- page limit and market conventions, if the user has them

If the resume is unavailable, ask for it. Never reconstruct it from the profile.

## Steps

1. **Extract facts** and note bullets with no outcome and claims with no
   evidence. If analysis has already run in this session, reuse its findings.
2. **Read the target.** Requirement order from the posting, or role conventions.
3. **Map evidence to requirements.** Which existing fact proves each requirement.
4. **Rewrite bullets** as verb + scope + mechanism + outcome, numbers only where
   supplied, one line each where possible.
5. **Reorder and trim.** Most relevant first, cut what proves nothing for this
   target, respect the page limit.
6. **Report gaps.** Requirements nothing proves, with the cheapest artifact for
   each — this feeds career planning.

## Deliverable

1. The revised resume, section by section, plain text ready to paste.
2. A changelog: what changed, why, and which requirement each change serves.
3. A gap list: unproven requirements with a suggested artifact each.
4. Formatting and ATS notes, when the target system is known.

## Quality bar

- Nothing appears that the user did not state or that is not a restatement of
  something they stated.
- Missing numbers stay visible as `[add number]`, never invented or quietly
  dropped.
- No technology is listed without supporting evidence.
- Length and section order follow the target market.
- "Improved performance" style bullets are rewritten to name the mechanism or
  removed.

## Out of scope

Cover letters, portfolio design and salary discussion — name the relevant
workflow instead.
