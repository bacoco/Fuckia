---
name: source-of-truth-gate
description: Use before planning or implementing when repository instructions, chat context, Linear, GitHub, and local files may disagree.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/source-of-truth-gate.skill.md
source_hash: 209e3eeaa9dad47217970f103e022d7296e9f46901ddb8733ac456f0f944b37e
generated_by: fuckia generate-skills
target: claude
-->

# Source Of Truth Gate

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

Use this skill before planning, implementation, review, or verification.

## Required Order

Read sources in this order:

1. Current user message.
2. Linear issue or explicit human source of truth.
3. GitHub PR, issue, and branch state.
4. Repository agent files.
5. Local code and tests.
6. Older chat context.

## Stop Conditions

Stop and ask the human when:

- there is no active Linear issue or accepted replacement source of truth;
- two sources give conflicting file ownership;
- the requested work affects product code during governance installation;
- the requested work needs remote writes and no explicit approval exists.

## Output

Before code changes, state:

- source of truth used;
- files allowed;
- files forbidden;
- workflow to preserve;
- verification required.
