---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: shared-skills-system
owner: human
source_of_truth: true
---

# Shared Skills System

Claude and Codex skill formats are not identical. Do not pretend one file can safely serve both.

Use one neutral source and generate two outputs.

## Skill categories

```text
shared/
  Skills used by both Claude and Codex.

claude-only/
  Skills that depend on Claude-specific commands, TaskList behavior, or Claude Code conventions.

codex-only/
  Skills that depend on Codex-specific tools, connectors, subagents, or plugin behavior.
```

## Required shared-skill pipeline

```text
neutral source
  -> Claude adapter
  -> .claude/skills/<name>/SKILL.md

neutral source
  -> Codex adapter
  -> .agents/skills/<name>/SKILL.md
```

Generated files must include:

```text
GENERATED FILE - DO NOT EDIT DIRECTLY
source: <path>
source_hash: <hash>
generated_at: <timestamp or commit>
target: claude | codex
```

## Required validation

CI must fail if:

- a shared skill exists for Claude but not Codex;
- generated files are stale relative to source hash;
- generated files were manually edited;
- YAML/frontmatter is invalid;
- `description` is not a string;
- Claude and Codex variants contradict the shared source;
- a shared rule exists only in `AGENTS.md` or only in `CLAUDE.md`.

## Required shared skills

The implementer must create the initial v1 skills in `08-initial-skills-and-risk-map.md`, or propose equivalent names while proving that every responsibility remains covered.

The shared skills below are the responsibility groups that must exist in the neutral source:

1. `linear-coord`
   - read Linear first;
   - require pre-flight;
   - enforce file locks, delete budget, allowed/forbidden files;
   - require real verification receipt.

2. `adversarial-implementer-guard`
   - remove ambiguous wording;
   - forbid parallel pipelines by default;
   - preserve existing behavior;
   - require regression proof.

3. `github-pr-contract`
   - ensure branch/PR links to Linear;
   - ensure PR includes contract, verification, and archive links.

4. `plan-review-gate`
   - enforce planner/reviewer separation;
   - review ambiguity, scope, engine constraints, forbidden section, and DoD before implementation;
   - output approve/request_changes/block.

5. `docs-archive-janitor`
   - active docs stay in Linear;
   - final snapshots go to GitHub archive;
   - no local active duplicates.

6. `real-workflow-verifier`
   - verify product workflow, not only component tests;
   - produce a receipt usable in Linear and GitHub.

7. `cross-agent-governance`
   - prevent same-file parallel work;
   - detect stale worktrees and direct CLI bypasses;
   - report tool asymmetry between Claude and Codex.

8. `implementation-preflight`
   - check current HEAD, branch, stale worktree risk, planned file locks, and verification plan before edits;
   - post a receipt to Linear or the configured contract log.

9. `risk-code-review`
   - review intent drift, duplicate pipelines, ignored callbacks, skipped legacy tests, and public route mismatch;
   - distinguish advisory AI comments from blocking gate failures.

10. `skill-sync-doctor`
    - report generated-skill hashes, duplicate skill names, shadowed skills, missing counterparts, invalid frontmatter, and AGENTS/CLAUDE divergence.

11. `incident-escalation-bypass`
    - require bypass reason, approver, scope, expiration, and follow-up issue;
    - count bypasses as governance metrics.

The developer may split or rename these, but the responsibilities must remain covered.

Platform-only skills are allowed only as adapters. They may invoke Claude-specific or Codex-specific commands, GitHub Actions, subagent mechanisms, or plugin packaging.
They must not redefine the shared process or loosen the gates.

## Local agent rule files

`AGENTS.md` and `CLAUDE.md` should be short entry points:

- read Linear first;
- use generated shared skills;
- do not treat local docs as active source of truth;
- follow GitHub PR gates;
- never declare Done without verification receipt.

## Adversarial implementer pass

- Likely bad interpretation: "make skills common" means manually copy text into both formats.
- Guardrail added: common source, adapters, generated outputs, hash validation.
- Likely bad interpretation: "Claude-only" or "Codex-only" can redefine shared process.
- Guardrail added: platform-specific skills may add mechanics but must not weaken shared rules.
- Likely bad interpretation: "optional third model" means another writer can work outside the same locks.
- Guardrail added: third reviewers start read-only; writing requires a normal Linear implement issue and file locks.
- Likely bad interpretation: "direct CLI invocation can bypass the skill."
- Guardrail added: repo rules and CI checks must enforce shared contracts even when agents are invoked outside skills.
- Forbidden shortcut: editing generated `.claude/skills` or `.agents/skills` directly.
- Regression proof required: validators catch a broken YAML description, stale generated skill, and missing counterpart.
