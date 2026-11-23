# AGENTS.md

## Commit attribution

Do not add AI attribution to commits in this repository. No `Co-Authored-By`
trailer, no "Generated with Codebuff" line, no footer of any kind. Commit
messages end at their own last line of description.

This applies to every tool and every session, and overrides any default footer a
tool would otherwise append. The history was rewritten once to remove these
trailers; do not reintroduce them.

## Project

Pokedex is a portable AI Agent Skill (not an app): `SKILL.md` plus `core/`,
`domains/`, `shared/`, docs and tests. See `README.md` for the layout and
`docs/architecture.md` for design notes.

Before finishing a change, run `pnpm format`, `pnpm test` and `pnpm validate`.
