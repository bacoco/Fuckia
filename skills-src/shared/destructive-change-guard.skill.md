---
name: destructive-change-guard
description: Use before deleting, moving, replacing, or rewriting files, workflows, stores, hooks, routes, engines, or generated outputs.
targets:
  - claude
  - codex
---

# Destructive Change Guard

Use this skill before any destructive change.

## Destructive Changes

Treat these as destructive:

- deleting files;
- replacing a working implementation;
- moving source of truth;
- renaming public routes, hooks, stores, engines, workflows, or pipelines;
- editing generated files directly;
- overwriting existing agent rules.

## Required Proof

Before the change:

- name the existing behavior;
- list dependents;
- show the replacement path;
- state rollback path;
- get explicit approval when the change is outside the approved plan.

## Forbidden Shortcut

Do not remove working code under labels such as cleanup, refactor, migration, simplification, or consolidation unless the replacement is wired and verified end-to-end.
