# Installation

Installation must be simple and transparent.

The target experience is:

```bash
npx fuckia init
```

Current implemented write command:

```bash
fuckia init --apply
fuckia migrate --plan
fuckia migrate --apply
```

`init --apply` is only for conflict-free governance installation. Existing projects with `AGENTS.md`, `CLAUDE.md`, GitHub workflows, or skills must use migration.
`migrate --plan` writes `docs/fuckia/migration-plan.md` only.
`migrate --apply` preserves existing governance files and writes merge proposals under `docs/fuckia/merge-proposals/`.

Agent bootstrap experience:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The install file is followed from the Fuckia repository. It is not copied into the target repository by default.

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
4. `platforms/README.md`

## Product Rule

The user should not need to understand the full repository before installation.

The installer must hide complexity while producing visible receipts for every change.
