---
name: cross-agent-handoff
description: Use when handing work between Claude, Codex, a human, or a third reviewer.
targets:
  - claude
  - codex
---

# Cross Agent Handoff

Use this skill before handing work to another agent or human.

## Required Handoff

Include:

- source of truth;
- current branch and commit;
- files changed;
- files intentionally not changed;
- commands run;
- remote state changed;
- blockers;
- exact next action.

## Cross-Review Rule

When the next actor reviews risky work, provide:

- plan;
- implementation diff;
- verification receipt;
- existing behavior to preserve;
- forbidden implementation shortcuts.

## Archive Rule

If the handoff affects project direction, write a durable receipt under `docs/fuckia/archive` or the project’s approved docs location.
