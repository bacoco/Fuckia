---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: repo-template
owner: human
source_of_truth: true
---

# Repository Template

The product must become an installable kit, not a documentation bundle.

## Required template areas

```text
fuckia/
  README.md
  linear/
    issue-templates/
    project-templates/
    workflow-statuses.md
  github/
    pull_request_template.md
    workflows/
    branch-protection.md
  skills/
    shared/
    claude-only/
    codex-only/
  generated/
    claude/
    codex/
  scripts/
    sync-skills
    validate-skills
    validate-linear-contract
    validate-pr-scope
    export-linear-snapshot
    doctor
  docs/
    archive-template/
    install-new-project.md
    migrate-existing-project.md
```

Names may change, but the responsibilities must remain separated.

## Installed project layout

For a target project, the kit should install or update:

```text
AGENTS.md
CLAUDE.md
.claude/skills/
.agents/skills/
.github/pull_request_template.md
.github/workflows/
docs/linear-archive/
scripts/agent-collab/
```

If a project already has these files, the installer must patch carefully and produce a migration report instead of overwriting blindly.

## Local docs policy

Active specs live in Linear.

The repo stores:

- rules;
- generated skills;
- templates;
- CI scripts;
- archived snapshots.

Recommended archive layout:

```text
docs/linear-archive/<LINEAR-ID>/
  spec-snapshot.md
  contract.md
  verification-receipt.md
  links.md
```

The archive is immutable evidence for the code history. It is not the active spec after merge.

## Project bootstrap command

The kit must provide one command for new projects:

```bash
npx fuckia init
```

The command installs rules, generated skills, GitHub gates, project config, and docs, then runs `doctor`.

## Existing project migration

Migration must be audit-first:

```bash
npx fuckia migrate --dry-run
npx fuckia migrate --plan
npx fuckia migrate --apply
```

`--dry-run` audits only. It must not modify code.

`--plan` writes the migration plan.

`--apply` is limited to governance files unless the user explicitly authorizes a broader change.

## Adversarial implementer pass

- Bad implementation path: "template repo" means a pile of Markdown only.
- Guardrail added: template must include installable rules, generated skill outputs, scripts, and CI gates.
- Bad implementation path: "migrate existing project" means overwrite local conventions.
- Guardrail added: migration must inventory and patch, not blindly replace.
- Forbidden shortcut: deleting old docs or skills without a report and human approval.
- Regression proof required: install kit on a fresh test repo and one existing repo without breaking existing workflows.
