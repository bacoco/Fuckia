# Distribution

Distribution supports:

- Claude agent bootstrap prompt;
- Codex agent bootstrap prompt;
- direct GitHub clone by the agent;
- Node-free shell installer;
- GitHub-backed `npx` for advanced terminal users;
- generated Claude and Codex skills.

## Primary Install Prompt

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

## Normal Node-Free Path

Audit:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
```

Apply after review:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes
```

## Direct CLI Path

The direct CLI path is optional:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

## Future Distribution

NPM registry publishing and Claude marketplace packaging are separate release steps.
