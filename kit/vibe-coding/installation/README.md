# Installation

Installation must be simple and transparent.

The target experience is:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

Current implemented install and audit commands:

```bash
fuckia install --dry-run
fuckia install --apply --yes
fuckia init --apply
fuckia migrate --plan
fuckia migrate --apply
fuckia github --dry-run
fuckia github --apply --yes
fuckia linear --dry-run
fuckia linear --apply --yes --team <TEAM_KEY>
fuckia strict --dry-run
fuckia strict --apply
```

`init --apply` is only for conflict-free governance installation. Existing projects with `AGENTS.md`, `CLAUDE.md`, GitHub workflows, or skills must use migration.
`migrate --plan` writes `docs/fuckia/migration-plan.md` only.
`migrate --apply` preserves existing governance files and writes merge proposals under `docs/fuckia/merge-proposals/`.
`github --dry-run` verifies the real GitHub repository without local or remote writes.
`github --apply --yes` creates remote branch protection only for an unprotected GitHub repository without existing rulesets.
`linear --apply --yes --team <TEAM_KEY>` creates the active Linear issue chain and archives a local receipt.
`strict --apply` enables strict local mode after governance files are installed.

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

## Platform State

GitHub local workflow installation is implemented through `init --apply` and `migrate --apply`.

GitHub remote readiness audit is implemented through:

```bash
npx fuckia github --dry-run --strict
```

GitHub remote apply is implemented for unprotected repositories and for repositories with existing branch protection that need missing Fuckia status checks.

Existing GitHub rulesets are preserved. Fuckia does not rewrite rulesets.

## Read Order

1. `distribution/README.md`
2. `new-project/README.md`
3. `existing-project/README.md`
4. `platforms/README.md`

## Product Rule

The user should not need to understand the full repository before installation.

The installer must hide complexity while producing visible receipts for every change.
