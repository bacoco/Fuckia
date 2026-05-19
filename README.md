---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: claude-codex-linear-github-collaboration-kit
owner: human
source_of_truth: true
linear:
github_issue:
pull_request:
supersedes:
superseded_by:
---

# Claude/Codex Collaboration Kit

Architect handoff for building a reusable repository/template that coordinates Claude Code, Codex, Linear, and GitHub across new and existing projects.

This package is intentionally not implementation detail. The developer must build the repo, generators, skills, checks, and templates from these constraints after validating current Linear, GitHub, Claude, Codex, Gemini, and CodeRabbit documentation.

## Target outcome

Create a reusable project starter and migration kit where:

- Linear is the active operational source of truth.
- GitHub is the code, PR, CI, and immutable archive source.
- Claude and Codex use the same collaboration contract.
- Shared skills are authored once, then generated into Claude and Codex formats.
- The initial shared and platform-only skills are delivered, validated, and tested.
- Planning, plan review, implementation, code review, and verification are distinct roles.
- No agent can declare work done from isolated unit tests alone.
- Large rewrites, parallel engines, blind subagents, and silent file conflicts are blocked by process and CI.

## Directory contents

- `01-operating-model.md` - source-of-truth model and workflow.
- `02-repo-template.md` - required repository/template structure.
- `03-shared-skills-system.md` - how shared, Claude-only, and Codex-only skills must be managed.
- `04-linear-github-gates.md` - Linear/GitHub checks, PR gates, and AI review roles.
- `05-rollout-plan.md` - rollout for new and existing projects.
- `06-no-hallucination-rules.md` - explicit areas where the implementer must verify instead of inventing.
- `07-failure-catalog-cross-review.md` - universal failure catalog and mandatory cross-review gates.
- `08-initial-skills-and-risk-map.md` - initial Claude/Codex skill set and additional risk mitigations.
- `09-capabilities-decisions-and-open-risks.md` - verified capabilities, technical decisions, and remaining risks.
- `10-implementation-blueprint.md` - standalone repo structure, commands, schemas, gates, and pilot plan.
- `PROMPT-A-DONNER-AU-DEV.md` - copy-paste prompt for the implementer.
- `SOURCES.md` - official docs starting points to verify.

## Core decision

Use this hierarchy:

```text
Linear = active contract and day-to-day coordination
GitHub = code, PR proof, CI gates, and versioned archive
Repo local files = rules, generated skills, templates, and snapshots
Claude/Codex local state = never the source of truth
```

Do not keep active competing specs in Linear, `docs/specs`, `.claude`, and `.agents` at the same time.

## Non-goals

- Do not build a second issue tracker.
- Do not replace Linear with Markdown.
- Do not make GitHub PR descriptions the only place where specs live.
- Do not create separate Claude and Codex process rules that drift.
- Do not auto-merge agent work based on typecheck or unit tests only.
- Do not let the same agent both plan and approve its own plan.
- Do not let the same agent both implement and approve its own code on risky work.

## Adversarial implementer pass

- Likely bad interpretation: "Linear is used, so all other proof can disappear."
- Guardrail added: Linear is active coordination; GitHub remains the immutable code and archive layer.
- Likely bad interpretation: "Shared skills means copy the same text twice."
- Guardrail added: shared skills have one neutral source and generated Claude/Codex outputs with hash checks.
- Likely bad interpretation: "Definition of Done means tests pass."
- Guardrail added: Done requires real workflow verification on the target URL/environment and a receipt.
- Likely bad interpretation: "Coordinate subagents by assigning them related tasks."
- Guardrail added: subagents may only run in parallel when file locks and write scopes are disjoint.
- Likely bad interpretation: "A planner can self-approve because the plan looks clear to them."
- Guardrail added: risky work requires a separate plan-review issue assigned to a different agent or a human.
- Existing behavior that must be preserved: working product flows, existing engines, shells, routes, callbacks, stores, and pipelines unless the Linear contract explicitly authorizes replacement.
- Forbidden implementation shortcuts: new parallel engines, large deletes without budget, local-only specs, generated skill edits, auto-merge from green typecheck.
- Regression proof required: PR-level checks plus at least one real workflow verification receipt for UI/product changes.

## Prompt a donner au dev

Use `PROMPT-A-DONNER-AU-DEV.md`.
