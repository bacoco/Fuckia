# Objective

Implement Fuckia as an installable governance kit for vibe coding collaboration.

The implementation must make the common path simple:

```bash
npx fuckia init
```

For existing projects, implementation must start audit-only:

```bash
npx fuckia migrate --dry-run
```

The project must eventually support Claude plugin distribution and Codex installation, but the first coding slice starts with the universal CLI because it is the common engine behind both.

