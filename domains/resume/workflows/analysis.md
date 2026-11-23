# Resume analysis

Diagnose a resume against a target role without editing a single line. The output
is findings the user can act on, and an offer to run the improvement pass.

## Use when

"Review my resume", "what is weak", "why am I not getting interviews", "does this
read well for backend roles". When the user explicitly wants the document
rewritten or tailored, use `improvement.md`.

## Inputs

- the resume text, verbatim
- the target role, and a posting when the user has one
- the profile, to notice facts missing from the resume

## Steps

1. **Extract facts.** Roles, dates, technologies, outcomes, exactly as written.
   Flag every bullet with no outcome and every claim with no evidence.
2. **Read the target.** Requirements in the order the posting (or role
   conventions) emphasises.
3. **Map evidence to requirements.** Each requirement: which existing line proves
   it, strongly or weakly, or nothing does.
4. **Audit structure and mechanics.** Section order for the user's market, length,
   dense paragraphs, unreadable formatting, ATS risks (columns, tables,
   graphics).
5. **Rank findings.** Severity high/medium/low, by how much each one costs
   interviews — not by how easy it is to fix.
6. **Name the top five fixes**, each with a direction, not a rewrite.

## Deliverable

1. **Findings table**: location, issue, severity, fix direction.
2. **Requirement gaps**: requirements nothing proves, each with the cheapest
   artifact that would prove it.
3. **ATS and mechanics risks**, with the specific element that causes each.
4. **Top five fixes in order**, and what each is worth in interview terms.
5. **Offer**: run `resume.improvement` now, and what it would need (target role,
   posting).

## Quality bar

- No rewritten bullets, sections or drafts — analysis only. One example sentence
  to illustrate a direction is allowed and marked as illustrative.
- Every finding points at a specific location: "Experience, second role,
  bullet 3", not "the experience section feels weak".
- Nothing implies the user has experience they did not report.
- Gaps are framed as closable work, with a suggested artifact.

## Failure modes

- Generic praise, or a grade with no findings.
- Rewriting by stealth: "consider something like 'Led a team of…'" that supplies
  facts.
- Findings ranked by ease of fixing instead of by cost to the applicant.
- Ignoring the target role and reviewing the resume in the abstract.
