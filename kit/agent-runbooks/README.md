# Agent Runbooks

This directory contains platform-specific wrappers.

The normal install entrypoint is now the root `INSTALL.md`.

Nothing in this directory is copied into the target repository by default.

Files:

- `one-line-prompts.md` - human copy-paste prompts.
- `review-and-merge.md` - delegated PR review and merge prompt.
- `claude/install-or-migrate.md` - Claude Code wrapper.
- `codex/install-or-migrate.md` - Codex wrapper.

Contract:

- read and follow root `INSTALL.md`;
- run audit before writes;
- install or migrate governance only after explicit approval;
- do not modify product code;
- do not copy this runbook into the target repository unless the human explicitly asks for an archive copy.
