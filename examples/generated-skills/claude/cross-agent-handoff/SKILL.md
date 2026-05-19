---
name: cross-agent-handoff
description: Use when handing work between Claude, Codex, a human, or a third reviewer.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/cross-agent-handoff.skill.md
source_hash: e6ef8878fcde97c9448a164af8c5a466e130c905e7a956be85546840edf90198
generated_by: fuckia generate-skills
target: claude
-->

# Cross Agent Handoff

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

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
