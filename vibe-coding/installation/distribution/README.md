# Distribution

Distribution supports:

- direct GitHub clone;
- GitHub-backed `npx`;
- Claude agent bootstrap prompt;
- Codex agent bootstrap prompt;
- generated Claude and Codex skills;
- one-line audit for new and existing projects.

## Current One-Line Commands

Audit:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

Apply after review:

```bash
npx --yes github:bacoco/Fuckia install --apply --yes
```

GitHub remote setup:

```bash
npx --yes github:bacoco/Fuckia github --dry-run --strict
npx --yes github:bacoco/Fuckia github --apply --yes
```

Linear setup:

```bash
LINEAR_API_KEY=<token> npx --yes github:bacoco/Fuckia linear --dry-run --team <TEAM_KEY>
LINEAR_API_KEY=<token> npx --yes github:bacoco/Fuckia linear --apply --yes --team <TEAM_KEY>
```

Strict mode:

```bash
npx --yes github:bacoco/Fuckia strict --apply
npx --yes github:bacoco/Fuckia strict --dry-run --strict
```

## Future Distribution

NPM package publishing and Claude marketplace packaging remain separate release steps.
