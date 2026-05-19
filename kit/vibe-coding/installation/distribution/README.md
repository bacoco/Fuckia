# Distribution

Distribution supports:

- Claude agent bootstrap prompt;
- Codex agent bootstrap prompt;
- direct GitHub clone by the agent;
- GitHub-backed `npx` for advanced terminal users;
- generated Claude and Codex skills.

## Primary Install Prompt

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

## Direct CLI Path

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

NPM registry publishing and Claude marketplace packaging are separate release steps.
