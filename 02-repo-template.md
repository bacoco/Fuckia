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

The developer must create a reusable repository/template that can initialize new projects and retrofit existing projects.

## Required template areas

```text
agent-collab/
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
    migration-guide.md
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

The kit should provide one documented bootstrap path for new projects:

```text
init project -> install rules -> install generated skills -> install GitHub gates -> configure Linear templates -> run doctor
```

The exact command is for the implementer to design.

## Existing project migration

Migration must be staged:

1. inventory current agent rules, skills, docs, PR templates, workflows;
2. identify duplicates and conflicts;
3. install rules without deleting old docs;
4. pilot on one critical project/feature;
5. enable strict gates only after the pilot passes.

## Adversarial implementer pass

- Likely bad interpretation: "template repo" means a pile of Markdown only.
- Guardrail added: template must include installable rules, generated skill outputs, scripts, and CI gates.
- Likely bad interpretation: "migrate existing project" means overwrite local conventions.
- Guardrail added: migration must inventory and patch, not blindly replace.
- Forbidden shortcut: deleting old docs or skills without a report and human approval.
- Regression proof required: install kit on a fresh test repo and one existing repo without breaking existing workflows.
