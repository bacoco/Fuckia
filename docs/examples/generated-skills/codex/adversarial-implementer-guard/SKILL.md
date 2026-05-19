---
name: adversarial-implementer-guard
description: Use when writing or reviewing specs, plans, implementation prompts, architecture reviews, UX critiques, handoff docs, code reviews, or install/migration instructions that another developer or AI agent will execute.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/adversarial-implementer-guard.skill.md
source_hash: 10dd4bdda6d55686ec7257aa0128bbf67dd20fb8b080644ceb0d5e786d01987c
generated_by: fuckia generate-skills
target: codex
-->

# Adversarial Implementer Guard

## Codex Mechanics

- Use `rg` for repository inventory.
- Use `apply_patch` for manual file edits.
- Use Codex subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Codex implementation as reviewed by the same Codex context.

Use this skill before finalizing work that another human, Claude, Codex, or third reviewer will execute.

Assume the next implementer is low-context, literal, rushed, and able to satisfy the words while damaging the product.

## Preserve Existing Behavior

List the behavior that must remain true:

- user-visible workflows;
- files and directories that must stay authoritative;
- routes, stores, hooks, queues, pipelines, and state machines that must not be replaced;
- external contracts such as GitHub checks, Linear issue states, APIs, or generated skill metadata;
- verification commands and real user paths that prove the old behavior still works.

## Red-Team The Wording

Flag dangerous phrases:

- refactor;
- simplify;
- wire;
- orchestrate;
- reuse;
- clean up;
- improve;
- support;
- migrate;
- install;
- generate.

For each phrase, state the damaging interpretation an implementer could choose while still claiming compliance.

## Convert Ambiguity Into Constraints

Replace vague wording with hard requirements:

- `MUST preserve ...`
- `MUST call/use ...`
- `MUST NOT replace ...`
- `MUST NOT create a parallel engine/store/router/hook/workflow/pipeline ...`
- `MUST NOT remove working code unless the replacement is wired and verified end-to-end ...`
- `MUST stop and ask when the source of truth is missing ...`

## Add Non-Goals

State what is outside the task.

Include forbidden changes for:

- product code;
- working routes;
- stores;
- hooks;
- workflows;
- generated files;
- agent rule files;
- docs cleanup unrelated to the task.

## Require Regression Proof

Acceptance criteria must prove the real workflow, not only isolated components.

Require:

- the public or product entry path;
- command output or CI evidence;
- review receipt;
- verification receipt;
- archived evidence for the next agent.

## Review Mode

When reviewing a PR, actively look for:

- duplicate engines, stores, queues, routers, or state machines;
- callbacks kept in signatures but ignored;
- old behavior hidden behind renamed props or unused branches;
- tests that assert existence without exercising the real workflow;
- skipped tests that hide regressions;
- implementation that passes local checks while bypassing the product path.

## Output

Add a section named `Adversarial implementer pass` with:

- bad implementation path;
- guardrail added;
- existing behavior that must be preserved;
- forbidden implementation shortcuts;
- regression proof required.
