---
name: adversarial-implementer-guard
description: Use when Codex writes or reviews specs, plans, implementation prompts, architecture reviews, UX critiques, handoff docs, code reviews, or install/migration instructions that another developer or AI agent will execute.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/adversarial-implementer-guard.skill.md
source_hash: 10dd4bdda6d55686ec7257aa0128bbf67dd20fb8b080644ceb0d5e786d01987c
generated_by: manual-bootstrap-v1
target: codex
-->

# Adversarial Implementer Guard

Use this skill before finalizing work that another human, Claude, Codex, or third reviewer will execute.

Assume the next implementer is low-context, literal, rushed, and able to satisfy the words while damaging the product.

## Codex Mechanics

- Use `rg` for inventory.
- Use `apply_patch` for manual file edits.
- Use subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Codex implementation as reviewed by the same Codex context.

## Required Pass

1. Preserve existing behavior:
   - user-visible workflows;
   - authoritative files and directories;
   - routes, stores, hooks, queues, pipelines, and state machines that must not be replaced;
   - external contracts such as GitHub checks, Linear issue states, APIs, and generated skill metadata;
   - verification commands and real user paths that prove the old behavior still works.

2. Red-team the wording:
   - flag dangerous verbs: refactor, simplify, wire, orchestrate, reuse, clean up, improve, support, migrate, install, generate;
   - state the damaging interpretation an implementer could choose while still claiming compliance.

3. Convert ambiguity into constraints:
   - `MUST preserve ...`
   - `MUST call/use ...`
   - `MUST NOT replace ...`
   - `MUST NOT create a parallel engine/store/router/hook/workflow/pipeline ...`
   - `MUST NOT remove working code unless the replacement is wired and verified end-to-end ...`
   - `MUST stop and ask when the source of truth is missing ...`

4. Add non-goals:
   - product code;
   - working routes;
   - stores;
   - hooks;
   - workflows;
   - generated files;
   - agent rule files;
   - docs cleanup unrelated to the task.

5. Require regression proof:
   - public or product entry path;
   - command output or CI evidence;
   - review receipt;
   - verification receipt;
   - archived evidence for the next agent.

## Review Mode

Look for duplicate engines, ignored callbacks, hidden old behavior, weak tests, skipped tests, and implementations that pass local checks while bypassing the product path.

## Output

Add a section named `Adversarial implementer pass` with:

- bad implementation path;
- guardrail added;
- existing behavior that must be preserved;
- forbidden implementation shortcuts;
- regression proof required.
