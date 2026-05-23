# Claude Install Or Migration Runbook

You are Claude Code inside the target repository.

Read and follow the root Fuckia install procedure:

```text
https://github.com/bacoco/Fuckia/blob/main/INSTALL.md
```

Claude-specific rules:

- default to `claude-only` when the repository has no Codex markers and the human did not ask for dual-agent;
- use `--profile guard-only` when the human asks for only the PDG - Progressive Disclosure Guard skill;
- use Claude planning tools for task tracking when the install has more than one step;
- do not use Claude subagents on overlapping files;
- do not copy `INSTALL.md` into the target repository;
- do not ask the human to install Node.js or npm for normal installation;
- do not write target files before the human approves the exact file list.

The install procedure is authoritative. This wrapper only adds Claude-specific execution rules.
