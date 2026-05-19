# Agent Runbooks

This directory is for AI agents, not for target-project installation output.

The human gives Claude Code or Codex one short prompt that points to one of these files in the Fuckia GitHub repository. The agent reads the file and follows it from the target project.

Nothing in this directory is copied into the target repository by default.

Files:

- `one-line-prompts.md` - human copy-paste prompts.
- `claude/install-or-migrate.md` - Claude Code runbook.
- `codex/install-or-migrate.md` - Codex runbook.

Contract:

- run dry-run inventory before writes;
- install or migrate governance only after explicit approval;
- do not modify product code;
- do not copy this runbook into the target repository unless the human explicitly asks for an archive copy.
