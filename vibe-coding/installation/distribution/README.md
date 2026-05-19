# Distribution

Fuckia must support three distribution paths.

## Claude Code

Target path:

```text
/plugin install fuckia@<marketplace>
```

The Claude plugin installs or exposes the same governance kit, skills, and commands.

## Codex

Target path:

```bash
npx fuckia install-codex
```

The Codex path installs or updates:

- `AGENTS.md`;
- `.agents/skills/...`;
- project config;
- GitHub workflows and templates when requested.

## Universal CLI

Target path:

```bash
npx fuckia init
```

The CLI is the fallback and the common engine behind Claude and Codex packaging.

