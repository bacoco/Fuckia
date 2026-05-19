---
name: plan-review-gate
description: Use before risky implementation to require independent review of the plan and block self-review.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/plan-review-gate.skill.md
source_hash: 7d2ba44a031ff7277b2b6da7c217e3f8df031c942348bf402eb014cd5b2f3073
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

## Block Rule

If no independent review exists, do not implement. Ask for review.
