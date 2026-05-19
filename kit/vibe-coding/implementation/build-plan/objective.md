# Objective

Implement Fuckia as an installable governance kit for vibe coding collaboration.

The common path is the agent prompt:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

For existing projects, the Node-free installer starts audit-only:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
```

Claude and Codex both use the same root install procedure. The Node CLI remains available for advanced automation and maintainer verification.
