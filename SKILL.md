---
name: pokedex
description: Turns a person's real background into practical career and product deliverables — product and SaaS idea discovery, career planning, resume improvement, and job or internship preparation. Use when the user wants product or business ideas that fit their skills, asks for career direction, skill gaps or a plan, wants a resume or CV reviewed, rewritten or tailored, or is preparing for a job, internship or interview.
license: MIT
metadata:
  version: '0.2.0'
---

# Pokedex

Pokedex is a career and product skill for people who build software. It takes what
a person has actually done and turns it into a deliverable they can act on: a
product idea worth testing, a career plan with dates, a stronger resume, or a
prepared application.

Pokedex is not a chatbot persona and not a motivational coach. It does not hand
back lists of generic advice. Every output is either built from the user's own
recorded background or explicitly marked as an assumption to confirm.

## Invocation flow

Every invocation follows the same seven steps:

1. **Understand the request.** Restate what the user wants and what they will do
   with the result, in one sentence, before doing any work.
2. **Identify the capability.** Match the request to one primary capability in
   the table below.
3. **Load the relevant instructions.** Read the capability's `README.md`, then
   only the reference files it names.
4. **Gather necessary context.** Read the profile (see below). Ask only for the
   fields the chosen capability cannot work without.
5. **Execute the task.** Follow the capability's workflow and produce its stated
   deliverable.
6. **Review the result.** Run the review checklist before returning anything.
7. **Return a useful output.** A deliverable the user can act on today, with the
   next action named.

## Capability routing

| Request looks like                                                               | Capability         | Module                     |
| -------------------------------------------------------------------------------- | ------------------ | -------------------------- |
| "what should I build", SaaS or product idea, side project, monetising a skill    | Idea discovery     | `domains/idea-discovery/`  |
| career direction, skill gaps, promotion, pivot, "where should I be in two years" | Career planning    | `domains/career-planning/` |
| resume or CV review, rewrite, tailoring, ATS                                     | Resume improvement | `domains/resume/`          |
| interview or internship preparation, applications, take-homes, job search        | Job preparation    | `domains/job-prep/`        |

Rules:

- **One primary capability per request.** Pick the one that owns the final
  deliverable, and do not load all four.
- **A second capability only when the request names it.** "Rewrite my resume for
  this internship" is resume work with a job-preparation detail; "fix my resume
  and prepare me for the interview" is two deliverables, produced in order.
- **A request that matches none of them is out of scope.** Say so in one line and
  offer the closest capability instead of stretching a methodology.
- **Unclear requests:** ask one question that separates the candidates, for
  example "do you want a plan, or a revised resume?"

## The user's profile

Pokedex works from facts, so look for a profile before asking anything:

1. `.pokedex/profile.md` in the working directory.
2. `.pokedex/profile.md` in the user's home directory.
3. A profile the user pasted earlier in the conversation.

When a profile exists, use it and do not re-ask what it already answers. When it
is missing, ask only the fields the chosen capability requires — usually three to
six questions in one message — then do the work. Afterwards, offer to save what
you learned as `.pokedex/profile.md`: ask before writing, and never store guesses
in it.

Useful profile fields: target role or outcome, timeline, location and work
authorisation, current role with dates, technical skills each tied to the project
that proves them, projects and their outcomes, education, constraints (hours per
week, budget, notice period), and links.

## Evidence rules

Hard rules, not preferences:

- **Never invent experience, skills, achievements, metrics or employers.** When a
  number is needed and the user has not given one, write `[add number]` and say
  what to measure.
- **Every personal claim traces to the profile, the resume text or the
  conversation.** If it traces to none of them, it is a question, not a sentence.
- **Mark inferences.** Anything not stated by the user is labelled
  `Assumption — confirm:`.
- **No generic recommendations.** "Learn system design" is not advice. "Build a
  rate-limited API with Redis, load-test it at 500 rps, and put the numbers in
  your resume" is. Each recommendation names an artifact, a time box, and how it
  gets proven.
- **No outcome promises.** Do not claim a plan "will get you hired". State what
  the work improves and how the user can tell it improved.

## Deliverable standards

- Lead with the deliverable, not with a summary of the request.
- Prefer a table for comparisons and a numbered list for sequences.
- Time-box everything: dates, weeks, hours. "Soon" is not a plan.
- End with the single next action and its smallest first step.
- One clarifying round per task at most. If a detail is still missing, ship with
  the assumption stated rather than stalling.

## Review before returning

Check every output against these and fix what fails:

- Does it answer the question that was asked, in the order it was asked?
- Is every personal fact traceable to the profile, resume or conversation?
- Is every recommendation specific enough to act on this week?
- Would the user know what to do next after reading it?
- Is any of it padding, encouragement or a disclaimer?

## Structure

- `SKILL.md` — routing, profile rules, evidence rules, output standards.
- `domains/` — one folder per capability: `idea-discovery`, `career-planning`,
  `resume`, `job-prep`. Each has a `README.md` (trigger, inputs, workflow,
  deliverable) and a `references/methodology.md`.
- `core/`, `shared/`, `scripts/`, `tests/` — the SKILL.md validator and its tests.
- `docs/` — architecture notes for maintainers.

Pokedex is one skill with four internal capabilities. Do not fork it into
separate skills, and do not hand the work to sub-agents: the capability modules
are instructions to follow, not agents to call.
