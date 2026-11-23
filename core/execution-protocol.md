# Execution protocol

What happens after routing: how a routed workflow is executed, reviewed and
returned. Routing decides _what_ to load (`core/intent-router.md`); this file
decides _how_ to run it.

## The seven steps

1. **Confirm the route.** One line: `Route: primary=career.planning`. Include the
   supporting workflows if any. No further ceremony.
2. **Load the named files.** The domain `README.md`, the workflow file, and the
   reference the workflow names. Do not preload other domains, other workflows or
   other references.
3. **Gather essentials.** Check the profile first (`core/profile-manager.md`).
   Ask one message for the few fields the workflow cannot run without. Ask
   nothing the profile, the request or an attachment already answers.
4. **Execute the workflow.** Follow its steps in order and produce the deliverable
   shape it specifies. The workflow owns the method; this file owns the rigor.
5. **Review.** Apply, in this order: the workflow's quality bar, the evidence
   rules in `SKILL.md`, the review checklist in `SKILL.md`.
6. **Deliver.** Output in the routed order, one clearly-titled section per
   workflow, ending with the single next action.
7. **Offer the profile update.** If new durable facts appeared (skills, hours,
   target role), propose the JSON change per `core/profile-manager.md`. Never
   write it unasked.

## Input sufficiency

Before executing, check the primary workflow's required inputs:

| Situation                                                                                                                                 | Action                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| All essentials present                                                                                                                    | Execute.                                                                |
| One essential missing but the workflow can run with an assumption                                                                         | Execute, label `Assumption — confirm: …`, list the question at the end. |
| An essential that makes the deliverable impossible is missing (no resume text to rewrite, no target role for a plan, no idea to evaluate) | Ask one question and stop. Do not produce a placeholder deliverable.    |
| Input exists but is unreadable (corrupt JSON, image-only PDF, truncated paste)                                                            | Say what could not be read, ask for a usable form, stop.                |
| Request contradicts itself ("senior-level plan for my first internship")                                                                  | Name the contradiction, ask which side is current, stop.                |

## Multi-workflow execution

- Execute sequentially in dependency order, not in parallel. Each section is
  finished and reviewed before the next starts.
- Read shared context once: profile, resume, posting, project list.
- Carry facts forward explicitly: if career planning chose a target role, the
  resume section names the same role instead of inventing a second one.
- Keep sections separate and labelled with the workflow's subject, not its id.
- If the first workflow reveals that the second cannot run (for example, the
  resume is missing), deliver the first, then say what the second needs.

## Review

Apply the review checklist in `SKILL.md` and the workflow's own quality bar.
Two gates are specific to execution and are not in that checklist:

| Gate       | Question                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Scope      | Does each section belong to a routed workflow, and is every routed workflow answered?                    |
| Continuity | In a multi-workflow run, do later sections reuse the facts chosen earlier instead of inventing new ones? |

A failed gate means fixing the section, not adding a caveat about it.

## Failure handling

- **Out-of-scope request discovered mid-task** — finish what was routed, then say
  the new part is outside Pokedex and name the closest workflow. Do not silently
  absorb it.
- **User changes intent mid-task** — re-route explicitly: state the new route,
  load the new workflow, keep the facts already gathered, drop the abandoned
  deliverable instead of half-finishing it.
- **Workflow produces a weak result because the input is thin** — say which input
  was thin and what would improve it, rather than padding the output.
- **Conflicting stored profile values** — ask which is current; never pick one
  silently and never rewrite the file on your own judgement.

## Output skeleton

```
Route: primary=<workflow id> [supporting=<ids>]

<Deliverable for workflow 1>
<title, tables/lists in the workflow's shape, gaps marked>

<Deliverable for workflow 2, if routed>
...

Next action: <one step, with its time box>
Open questions: <only if something was assumed or could not be read>
```

Omit empty sections. Do not restate the request, do not summarize what was just
written, do not add encouragement.

## Prohibited

- Loading a domain, workflow or reference that the route did not name.
- Producing a second deliverable nobody asked for.
- Spawning sub-agents: workflows are instructions to follow, not agents to call.
- Writing to the profile without an explicit confirmation.
- Reporting a check as passed when it was not run.
