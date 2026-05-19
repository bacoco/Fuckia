# New Project Install

New project setup starts from the agent prompt in the root README.

The agent runs the Node-free installer in audit mode first:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
```

After human approval:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes
```

The command creates:

- `AGENTS.md`;
- `CLAUDE.md`;
- `README.md` when the target repository has no README;
- `.agents/skills/...`;
- `.claude/skills/...`;
- `.github/README.md`;
- `.github/PULL_REQUEST_TEMPLATE.md`;
- `.github/workflows/...`;
- `fuckia.config.yaml`;
- `docs/fuckia/`.

Verification uses file checks from root `INSTALL.md`.
