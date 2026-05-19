---
name: platform-permission-gate
description: Use before GitHub, Linear, package registry, marketplace, or plugin remote writes.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/platform-permission-gate.skill.md
source_hash: 4704e3200204efd8f2279eb1bcec94c8c7e55c0745dca12a5b5b384434e05925
generated_by: fuckia generate-skills
target: claude
-->

# Platform Permission Gate

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

Use this skill before remote writes.

## Required Checks

Verify:

- authenticated account;
- target organization or repository;
- required permission;
- exact remote endpoint or command;
- whether the operation overwrites existing settings;
- post-write verification command.

## Approval Rule

Remote writes require explicit human approval.

The approval must name:

- target platform;
- target repository or workspace;
- command or operation;
- expected result.

## Failure Rule

If permission is missing, stop and report the exact missing permission.
