# Fuckia

This repository uses Fuckia governance.

Agent mode is recorded in `fuckia.config.yaml`.

## Agent Entrypoints

- Codex reads `AGENTS.md` when `codex-only` or `dual-agent` is enabled.
- Claude Code reads `CLAUDE.md` when `claude-only` or `dual-agent` is enabled.
- Codex skills live in `.agents/skills/` when Codex is enabled.
- Claude skills live in `.claude/skills/` when Claude is enabled.

## Core Guard

The central rule is adversarial progressive disclosure:

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
6. Verify the real workflow before Done.
7. Archive receipts in GitHub or `docs/fuckia/`.
8. End with the checkpoint format in `docs/fuckia/end-of-work-checkpoint.md`.

## Installed Mode

Default mode is warning.

Strict mode requires explicit activation after GitHub and Linear gates are configured.
