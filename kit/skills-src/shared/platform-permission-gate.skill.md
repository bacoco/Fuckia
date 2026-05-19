---
name: platform-permission-gate
description: Use before GitHub, Linear, package registry, marketplace, or plugin remote writes.
targets:
  - claude
  - codex
---

# Platform Permission Gate

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
