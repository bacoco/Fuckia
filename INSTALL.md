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
node "$FUCKIA_DIR/dist/cli.js" doctor
node "$FUCKIA_DIR/dist/cli.js" migrate --dry-run
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
node "$FUCKIA_DIR/dist/cli.js" init --apply
```

For an existing repository with conflicts, do not force init. Report that migration planning is required.

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
