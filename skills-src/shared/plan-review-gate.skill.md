---
name: plan-review-gate
description: Use before risky implementation to require independent review of the plan and block self-review.
targets:
  - claude
  - codex
---

# Plan Review Gate

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
