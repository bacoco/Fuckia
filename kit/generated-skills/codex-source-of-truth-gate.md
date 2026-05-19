---
name: source-of-truth-gate
description: Use before planning or implementing when repository instructions, chat context, Linear, GitHub, and local files may disagree.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: kit/skills-src/shared/source-of-truth-gate.skill.md
source_hash: 209e3eeaa9dad47217970f103e022d7296e9f46901ddb8733ac456f0f944b37e
generated_by: fuckia generate-skills
target: codex
-->

# Source Of Truth Gate

## Codex Mechanics

- Use `rg` for repository inventory.
- Use `apply_patch` for manual file edits.
- Use Codex subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Codex implementation as reviewed by the same Codex context.

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
