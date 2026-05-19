# Fuckia

Fuckia helps Claude Code and Codex work on the same project without hidden parallel work, self-review, destructive edits, or fake Done states.

It gives both agents the same laws, the same install path, and the same verification gates.

## Use It Today

Open Claude Code or Codex inside the project you want to protect.

Paste one prompt.

Claude Code:

```text
Read and follow `https://github.com/bacoco/Fuckia/blob/main/agent-runbooks/claude/install-or-migrate.md` for this repository. Start with dry-run inventory. Stop before any write that lacks explicit approval.
```

Codex:

```text
Read and follow `https://github.com/bacoco/Fuckia/blob/main/agent-runbooks/codex/install-or-migrate.md` for this repository. Start with dry-run inventory. Stop before any write that lacks explicit approval.
```

The agent reads the runbook from this repository. The runbook is not copied into your project by default.

The npm package is not published yet. The runbook makes the agent use a local clone of this repository before running the CLI.

## What The Agent Does

1. Reads the Fuckia laws and install rules.
2. Inspects your current repository.
3. Runs read-only checks.
4. Reports the exact files it would create or merge.
5. Stops before writing until you approve the exact file list.

Current CLI commands from a local Fuckia clone:

```bash
cd /path/to/Fuckia
npm install
npm run build
cd /path/to/target-project
node /path/to/Fuckia/dist/cli.js doctor
node /path/to/Fuckia/dist/cli.js init --dry-run
node /path/to/Fuckia/dist/cli.js migrate --dry-run
```

Target command after package publication:

```bash
npx fuckia doctor
```

## What Gets Installed After Approval

- `AGENTS.md` for Codex.
- `CLAUDE.md` for Claude Code.
- Claude and Codex skills generated from one shared source.
- GitHub PR template and Actions workflows.
- GitHub ruleset or branch protection checklist.
- Linear project and issue template checklist.
- `fuckia.config.yaml`.
- `docs/fuckia/` receipts and archive snapshots.

## What Fuckia Must Not Do

- Do not modify product code during install or migration.
- Do not delete existing agent rules.
- Do not create a parallel engine, store, router, hook, workflow, or pipeline.
- Do not mark work Done from isolated tests.
- Do not let one agent review its own risky implementation.
- Do not copy `agent-runbooks/` into the target repository unless the human explicitly asks for an archive copy.

## Current State

Implemented:

- read-only CLI skeleton;
- `doctor`;
- `init --dry-run`;
- `migrate --dry-run`;
- no-write tests;
- Claude and Codex follow-only runbooks.

Not implemented:

- write-mode installer;
- generated skill outputs;
- GitHub repository automation;
- Linear workspace automation;
- strict CI gates.

## Repo Map

- `agent-runbooks/README.md` - one prompt per agent.
- `vibe-coding/constitution/README.md` - foundational laws.
- `vibe-coding/installation/README.md` - install and migration rules.
- `vibe-coding/installation/platforms/README.md` - GitHub and Linear setup contract.
- `vibe-coding/skills/README.md` - shared skill system.
- `vibe-coding/implementation/README.md` - implementation plan.
- `src/README.md` - CLI source.
- `tests/README.md` - tests.

## Developer Commands

```bash
npm install
npm test
npm run build
node dist/cli.js doctor --self
```

## Core Rule

Fuckia uses progressive disclosure: the README gives the first action, and deeper directories hold the detail.
