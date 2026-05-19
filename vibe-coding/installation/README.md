# Installation

Installation must be simple and transparent.

The target experience is:

```bash
npx fuckia init
```

For existing projects:

```bash
npx fuckia migrate --dry-run
npx fuckia migrate --plan
npx fuckia migrate --apply
```

Claude users should get a plugin path. Codex users should get generated skills and project instructions through the same one-command installer.

## Read Order

1. `distribution/README.md`
2. `new-project/README.md`
3. `existing-project/README.md`

## Product Rule

The user should not need to understand the full repository before installation.

The installer must hide complexity while producing visible receipts for every change.

