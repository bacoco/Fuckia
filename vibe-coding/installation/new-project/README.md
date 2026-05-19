# New Project Install

New project setup must be one command:

```bash
npx fuckia init
```

The command creates:

- `AGENTS.md`;
- `CLAUDE.md`;
- `.agents/skills/...`;
- `.claude/skills/...`;
- `.github/pull_request_template.md`;
- `.github/workflows/...`;
- `fuckia.config.yaml`;
- `docs/fuckia/`.

After install:

```bash
npx fuckia doctor
```

`doctor` verifies generated skills, instructions, GitHub workflows, config, and law coverage.

