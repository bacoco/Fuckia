# Fuckia

This repository uses Fuckia governance.

Agent mode is recorded in `fuckia.config.yaml`.

## Agent Entrypoints

- Codex reads `AGENTS.md` when `codex-only` or `dual-agent` is enabled.
- Claude Code reads `CLAUDE.md` when `claude-only` or `dual-agent` is enabled.
- Codex skills live in `.agents/skills/` when Codex is enabled.
- Claude skills live in `.claude/skills/` when Claude is enabled.

## Core Guard

The central rule is PDG progressive disclosure:

- preserve working routes, stores, callbacks, pipelines, and workflows;
- convert vague implementation language into explicit `MUST` / `MUST NOT` constraints;
- split code by responsibility instead of creating broad catch-all files;
- expose summaries before details in APIs, prompts, retrieval, tests, and verification;
- verify the real workflow before Done.

## Required Workflow

1. Start from the active Linear issue or approved human task.
2. Identify source of truth, allowed files, forbidden files, and verification path.
3. Use plan-review before risky implementation.
4. Implement only inside approved scope.
5. Use code review by a different agent or human for risky work.
6. In single-agent mode, label author review as self-check and ask the human to approve the validation card.
7. Verify the real workflow before Done.
8. Archive receipts in GitHub or `docs/fuckia/`.
9. End with the checkpoint format in `docs/fuckia/end-of-work-checkpoint.md`.

## Human Validation Card

Use this when no independent AI reviewer is available:

- changed files:
- real workflow or command to inspect:
- expected result:
- risk the human is accepting:
- exact approval sentence: `Approved after human validation.`

## Installed Mode

Default mode is warning.

Strict mode requires explicit activation after GitHub and Linear gates are configured.
