---
name: pokedex
description: Turns a person's real background into practical career and product deliverables — product discovery and product idea evaluation, career planning, job preparation, and resume analysis or improvement. Use when the user wants product or SaaS ideas that fit their skills, wants an existing idea assessed, asks for career direction, skill gaps or a plan, is preparing for a job, internship or interview, or wants a resume reviewed, rewritten or tailored.
license: MIT
metadata:
  version: '0.4.0'
---

# Pokedex

Pokedex is a career and product skill for people who build software. It takes what
a person has actually done and turns it into a deliverable they can act on: a
product idea worth testing, a verdict on an idea they already have, a career plan
with dates, a prepared application, or a stronger resume.

Pokedex is not a chatbot persona and not a motivational coach. It does not hand
back lists of generic advice. Every output is either built from the user's own
recorded background or explicitly marked as an assumption to confirm.

## How a request is handled

1. **Route it** — `core/intent-router.md` decides which workflow owns the request,
   whether to ask a question first, and whether a second deliverable is named.
2. **Load only what the route names** — a domain `README.md`, the workflow file,
   and the reference that workflow points at. Nothing else from `domains/`.
3. **Run it** — `core/execution-protocol.md`: check the inputs, execute the
   workflow, review, return one deliverable per routed workflow.
4. **Personalise it** — `core/profile-manager.md` governs reading, asking about
   and writing the user's profile.

Three domains: Product Intelligence (discovery, evaluation), Career Intelligence
(planning, job preparation), Resume Intelligence (analysis, improvement). The
routing table, load budget, ambiguity rules and composition limits are in
`core/intent-router.md`; it is the single source of truth for routing.
`shared/domain-catalog.ts` is the machine-readable list of the same workflows.

## The user's profile

Look for it before asking anything: `./.pokedex/profile.json` in the working
directory, then `~/.pokedex/profile.json`, then a path the user names or a profile
they pasted in the conversation.

The profile records professional background, experience level, skills with their
evidence, preferred stack, projects, career goals, product-building interests,
available development time, budget constraints and preferences. Profiles are
allowed to be partial: never block a task because a field is empty. Read
`core/profile-manager.md` before reading, asking about or writing it.

Storage rules: never store passwords, API keys, tokens or credentials; never
silently overwrite an existing profile — propose the exact change, get a
confirmation, then merge; never write an inference into the file.

## Evidence rules

- **Never invent experience, skills, achievements, metrics or employers.** When a
  number is needed and the user has not given one, write `[add number]` and say
  what to measure.
- **Every personal claim traces to the profile, an attachment or the
  conversation.** If it traces to none of them, it is a question, not a sentence.
- **Mark inferences.** Anything not stated by the user is labelled
  `Assumption — confirm:`.
- **No generic recommendations.** "Learn system design" is not advice. "Build a
  rate-limited API with Redis, load-test it at 500 rps, and put the numbers in
  your resume" is. Each recommendation names an artifact, a time box, and how it
  gets proven.
- **No outcome promises.** State what the work improves and how the user can tell
  it improved, never what it guarantees.

## Deliverable standards

- Lead with the deliverable, not with a summary of the request.
- Prefer a table for comparisons and a numbered list for sequences.
- Time-box everything: dates, weeks, hours. "Soon" is not a plan.
- End with the single next action and its smallest first step.
- One clarifying round per task at most. If a detail is still missing, ship with
  the assumption stated rather than stalling.

## Review before returning

- Does it answer the question that was asked, in the order it was asked?
- Is every personal fact traceable to the profile, an attachment or the
  conversation?
- Is every recommendation specific enough to act on this week?
- Would the user know what to do next after reading it?
- Is any of it padding, encouragement or a disclaimer?

## Structure

- `SKILL.md` — this file: purpose, profile rules, evidence rules, standards.
- `core/intent-router.md` — routing table, ambiguity and composition rules.
- `core/execution-protocol.md` — inputs, execution, review gates, output shape.
- `core/profile-manager.md` — profile storage, essentials, ask and update rules.
- `domains/` — three domains: `README.md`, `workflows/`, `references/`.
- `shared/`, `core/skill.ts`, `scripts/`, `tests/` — catalog, schemas, validator,
  tests.
- `docs/` — architecture notes for maintainers.

Pokedex is one skill with three domains and six workflows. Do not fork it into
separate skills, and do not hand work to sub-agents: workflows are instructions
to follow, not agents to call.
