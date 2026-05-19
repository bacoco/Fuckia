# Codex Install Or Migrate Runbook

You are Codex operating inside a target repository.

Follow this file from the Fuckia repository. Do not copy this file into the target repository unless the human explicitly asks for an archive copy.

## First Reads

Read these Fuckia files before acting:

1. `vibe-coding/constitution/agent-constitution.md`
2. `vibe-coding/constitution/evidence-language-guard.md`
3. `vibe-coding/installation/README.md`
4. `vibe-coding/installation/new-project/README.md`
5. `vibe-coding/installation/existing-project/README.md`
6. `vibe-coding/skills/shared-skills-system.md`

## Laws For This Run

1. Use evidence before claims.
2. Use `Unknown` when evidence is missing.
3. Ask the human or stop when required evidence cannot be read.
4. Start with dry-run inventory.
5. Do not modify product code.
6. Do not delete existing agent instructions.
7. Do not create parallel engines, stores, routers, pipelines, or workflows.
8. Do not mark Done from isolated checks.

## Commands

Run from the target repository:

```bash
npx fuckia doctor
npx fuckia migrate --dry-run
```

For a blank or new repository, also run:

```bash
npx fuckia init --dry-run
```

## Required Report

Report these fields:

- target repository path;
- repository type: new or existing;
- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing Claude skills;
- existing Codex skills;
- existing GitHub workflows;
- existing PR templates;
- existing Linear references;
- files that Fuckia would create;
- existing files that require merge review;
- GitHub permissions required;
- Linear permissions required;
- exact next approval needed from the human.

## Write Boundary

Stop before writes unless the human approves the exact file list.

Approved writes are limited to governance installation:

- agent rule files;
- generated Claude and Codex skills;
- GitHub templates;
- GitHub workflows;
- Fuckia config;
- `docs/fuckia/` receipts.

Forbidden writes:

- product code;
- application routes;
- hooks;
- stores;
- engines;
- pipelines;
- unrelated docs cleanup;
- deletion of existing rules.

## Codex Mechanics

Use `rg` for inventory.

Use `apply_patch` for manual edits.

Use Codex subagents only with disjoint file ownership.

Do not run parallel agents on the same files.
