---
name: plan-review-gate
description: Use before risky implementation to require independent review of the plan and block self-review.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: kit/skills-src/shared/plan-review-gate.skill.md
source_hash: e2773e1ce274a8fb107f830e7e69c685c6dfccf4977954e5bfc53fa4ab47d122
generated_by: fuckia generate-skills
target: claude
-->

# Plan Review Gate

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

Use this skill before risky implementation.

Risky work includes:

- product code changes;
- workflow, route, hook, store, engine, pipeline, or CI changes;
- deletion of working code;
- migration of existing projects;
- remote GitHub or Linear writes.

## Required Evidence

The plan must include:

- exact allowed files;
- exact forbidden files;
- existing behavior to preserve;
- non-goals;
- verification commands;
- real workflow acceptance criteria.

## Review Rule

The implementer must not approve the same risky plan.

Review must come from:

- a human;
- the other AI agent;
- a separate review context with no implementation ownership.

If only one AI agent is available, the author AI may create a self-check, but it must label it `self-check, not independent review`.

The human fallback is a short validation card:

- plan summary:
- files that will change:
- real workflow or command to inspect:
- risk the human is accepting:
- exact approval sentence:

The exact approval sentence must be:

```text
Approved after human validation.
```

## Block Rule

If no independent review or human approval exists, do not implement. Ask for review or human validation.
