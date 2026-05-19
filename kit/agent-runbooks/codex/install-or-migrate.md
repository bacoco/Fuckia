# Codex Install Or Migration Runbook

You are Codex inside the target repository.

Read and follow the root Fuckia install procedure:

```text
https://github.com/bacoco/Fuckia/blob/main/INSTALL.md
```

Codex-specific rules:

- use `rg` for repository inventory;
- use `apply_patch` for manual edits;
- do not use subagents on overlapping files;
- do not copy `INSTALL.md` into the target repository;
- do not write target files before the human approves the exact file list.

The install procedure is authoritative. This wrapper only adds Codex-specific execution rules.
