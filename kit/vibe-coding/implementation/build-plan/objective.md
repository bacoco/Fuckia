# Objective

Implement Fuckia as an installable governance kit for vibe coding collaboration.

The common path is the agent prompt:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

For existing projects, the underlying CLI starts audit-only:

```bash
fuckia install --dry-run
```

Claude and Codex both use the same root install procedure. The CLI is the shared execution engine behind both agents.
