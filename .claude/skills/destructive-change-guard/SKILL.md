---
name: destructive-change-guard
description: Use before deleting, moving, replacing, or rewriting files, workflows, stores, hooks, routes, engines, or generated outputs.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/destructive-change-guard.skill.md
source_hash: 46ef081329d019dd025ccca8bdb00dcadaed9cabb58920b49713c4aebf4bda9f
generated_by: fuckia generate-skills
target: claude
-->

# Destructive Change Guard

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

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
