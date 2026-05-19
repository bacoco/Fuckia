# Fuckia

This repository uses Fuckia governance for Claude Code and Codex collaboration.

## Agent Entrypoints

- Codex reads `AGENTS.md`.
- Claude Code reads `CLAUDE.md`.
- Codex skills live in `.agents/skills/`.
- Claude skills live in `.claude/skills/`.

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
