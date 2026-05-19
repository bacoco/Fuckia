# Install Fuckia

This file is for Claude Code, Codex, or another AI coding agent.

The human asked you to install Fuckia in the repository where you are currently running.

## Goal

Install governance for Claude and Codex collaboration without changing product code.

The first pass is audit only. Do not write files until the human approves the exact file list.

## Required Behavior

- Treat the current working directory as the target repository.
- Read this file from the Fuckia repository.
- Use the Fuckia CLI from a clone of the Fuckia repository.
- Run audit commands.
- Report what would change.
- Stop before writes.

## Get Fuckia

Save the target repository path:

```bash
target_dir="$(pwd)"
```

If the Fuckia repository is already available locally, use that path.

If it is not available locally, clone it into a temporary directory:

```bash
tmp_dir="$(mktemp -d)"
git clone https://github.com/bacoco/Fuckia.git "$tmp_dir/Fuckia"
FUCKIA_DIR="$tmp_dir/Fuckia"
```

If clone fails, stop and ask the human for access or a local path.

If you use an existing local clone, set:

```bash
FUCKIA_DIR="/absolute/path/to/Fuckia"
```

## Build The CLI

Run inside the Fuckia repository:

```bash
cd "$FUCKIA_DIR"
npm install
npm run build
```

If build fails, stop and report the failing command.

## Audit The Target Repository

Return to the target repository.

Run:

```bash
cd "$target_dir"
node "$FUCKIA_DIR/dist/cli.js" install --dry-run
node "$FUCKIA_DIR/dist/cli.js" github --dry-run
node "$FUCKIA_DIR/dist/cli.js" linear --dry-run
```

For a new or empty repository, also run:

```bash
node "$FUCKIA_DIR/dist/cli.js" init --dry-run
```

Replace `$FUCKIA_DIR` with the actual Fuckia repository path.

## Report To The Human

Report:

- target repository path;
- whether this is a new project or existing project;
- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing Claude skills;
- existing Codex skills;
- existing GitHub workflows;
- existing PR template;
- existing Linear references;
- files Fuckia wants to create;
- existing files that need merge review;
- GitHub permissions needed;
- Linear permissions needed;
- exact approval needed before writing.

## Stop Point

Stop after the report.

Do not write files until the human approves the exact write list.

## After Human Approval

For a new repository with no conflicting governance files, run:

```bash
node "$FUCKIA_DIR/dist/cli.js" install --apply --yes
```

After `init --apply`, commit and push the installed `.github` files before treating GitHub remote checks as enforceable.

For an existing repository with conflicts, do not force init. Report that migration planning is required.

For an existing repository after approval, run:

```bash
node "$FUCKIA_DIR/dist/cli.js" install --apply --yes
```

`migrate --apply` preserves existing governance files and writes merge proposals under `docs/fuckia/merge-proposals/`.

After approved migration writes, commit and push the installed `.github` files before treating GitHub remote checks as enforceable.

## Verify GitHub Remote Readiness

Run:

```bash
node "$FUCKIA_DIR/dist/cli.js" github --dry-run --strict
```

This command verifies:

- local Fuckia workflow files;
- GitHub `origin` remote;
- GitHub CLI availability;
- GitHub CLI authentication;
- repository readability;
- admin or push permission signal;
- GitHub Actions permissions;
- repository ruleset visibility;
- required status checks for the current Fuckia warning workflows.

This command does not write to GitHub.

If it fails, report the failing checks and stop before remote platform setup.

## Apply GitHub Remote Protection

Run this only after:

- the installed workflow files are committed and pushed to the default branch;
- `github --dry-run --strict` shows the local files, remote, authentication, repository, permissions, and Actions checks as ready;
- the human explicitly approves remote GitHub writes.

```bash
node "$FUCKIA_DIR/dist/cli.js" github --apply --yes
```

This command creates branch protection only for an unprotected repository without existing rulesets.

It blocks instead of overwriting existing rulesets or branch protection.

## Apply Linear Issue Chain

Run this only after:

- `LINEAR_API_KEY` is set;
- `linear --dry-run --team <TEAM_KEY>` resolves the correct team;
- the human explicitly approves remote Linear writes.

```bash
node "$FUCKIA_DIR/dist/cli.js" linear --apply --yes --team <TEAM_KEY>
```

This creates the active Linear issue chain:

- spec;
- plan;
- plan-review;
- implement;
- code-review;
- verify.

It writes a local receipt at `docs/fuckia/archive/linear-issue-chain.json`.

## Enable Strict Mode

After GitHub and Linear setup:

```bash
node "$FUCKIA_DIR/dist/cli.js" strict --apply
node "$FUCKIA_DIR/dist/cli.js" strict --dry-run --strict
```

## Allowed Future Writes After Approval

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/...`
- `.claude/skills/...`
- `.github/pull_request_template.md`
- `.github/workflows/...`
- `fuckia.config.yaml`
- `docs/fuckia/...`

## Forbidden Writes

- product code;
- app routes;
- hooks;
- stores;
- engines;
- pipelines;
- unrelated docs cleanup;
- deletion of existing agent rules.

## Platform Setup

Read these only when the human approves platform setup:

- `vibe-coding/installation/platforms/github.md`
- `vibe-coding/installation/platforms/linear.md`

Platform automation must verify permissions before configuration.

## If Installation Fails

If the failure is reproducible and not caused by missing private access, open a public issue using:

- `Failure report` when a guardrail failed;
- `Install problem` when the install flow failed;
- `Process improvement` when the workflow needs a better rule, template, skill, or validator.

Include commands, output, target repository context, and the real workflow affected.
