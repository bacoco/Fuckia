# New Project Install

New project setup starts from the agent prompt in the root README.

The agent runs the CLI engine in audit mode first:

```bash
fuckia install --dry-run
```

After human approval:

```bash
fuckia install --apply --yes
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

Verification:

```bash
fuckia doctor
fuckia strict --dry-run
```

Strict mode is explicit:

```bash
fuckia strict --apply
fuckia strict --dry-run --strict
```
