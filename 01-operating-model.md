---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: operating-model
owner: human
source_of_truth: true
---

# Operating Model

## Foundational laws

The operating model is governed by `00-agent-constitution.md`.

Every workflow, issue contract, review gate, generated skill, and verification receipt must preserve:

1. Evidence Before Claim.
2. Source Of Truth Before Memory.
3. Preserve Working Systems.
4. Separated Authority.
5. Real Verification Before Done.

When any workflow instruction conflicts with the constitution, the constitution wins.

## Source of truth

Use Linear as the active cockpit:

- Linear Project: feature or initiative.
- Linear Project Document: active spec, constraints, decision log, and Definition of Done.
- Linear Issue: executable contract for one agent task.
- Linear status: current state of the work.

Use GitHub as proof and archive:

- branch and PR linked to the Linear issue;
- required CI checks;
- review comments;
- merge history;
- archived snapshots of important Linear docs and verification receipts.

Use repo-local files for:

- shared rules for agents;
- generated Claude/Codex skills;
- PR and issue templates;
- CI validation scripts;
- immutable snapshots after completion.

## Standard workflow

1. Human creates or approves a Linear Project.
2. Human or lead agent creates the active Linear Project Document.
3. Work is split into Linear issues with explicit contracts.
4. Risky work gets a `plan` issue and a blocking `plan-review` issue.
5. The plan reviewer must be a different agent or a human.
6. `implement` cannot start until the required `plan-review` is approved.
7. Implementer starts only after pre-flight.
8. Implementer opens a GitHub PR linked to the Linear issue.
9. GitHub checks validate scope, contract, tests, and verification evidence.
10. Code reviewers comment or request changes, but do not merge.
11. Human review approves risky PRs.
12. Verification receipt is posted to Linear.
13. Important Linear docs are snapshotted into GitHub archive before or with merge.

## Issue type chain

Use separate Linear issue types or labeled templates for:

```text
spec -> plan -> plan-review -> implement -> code-review -> verify
```

Rules:

- `planner != plan reviewer`;
- `implementer != code reviewer` for risky work;
- `plan-review` blocks `implement`;
- `verify` blocks `Done`;
- small bugfixes may skip `plan-review` only under explicit low-risk rules;
- any uncertainty escalates to human review.

`plan-review` is mandatory when a plan:

- exceeds the project line threshold, recommended default `200` lines;
- touches core files, shells, routes, stores, hooks, engines, pipelines, auth, migrations, deploy, generated skills, or agent rules;
- includes `REMOVE`, `REPLACE`, `refactor`, `simplify`, `orchestrate`, `wire`, `reuse`, `support`, or similar ambiguous verbs;
- changes a public API, storage contract, or user-visible workflow;
- uses multiple agents or subagents;
- has a delete budget above the low-risk threshold.

## Required Linear issue contract

Every executable issue must contain:

```text
Objective:
Authorized agent: Claude | Codex | Human
Allowed files:
Forbidden files:
Delete budget:
Existing pipeline to preserve:
Required callbacks/routes/hooks/stores:
Forbidden implementations:
Required real workflow verification:
Target URL/environment:
Expected PR:
```

Every plan-review issue must contain:

```text
Reviewed plan:
Planner:
Plan reviewer:
Linked implement issue:
Ambiguities found:
Engine/pipeline constraint:
Forbidden section present:
Definition of Done check:
Scope check:
Global rules check:
Decision: approve | request_changes | block
```

## Pre-flight required before code

Before editing, the agent must post in Linear:

```text
Pre-flight:
- issue read:
- current HEAD:
- branch:
- planned files:
- locks checked:
- delete budget:
- existing pipeline identified:
- forbidden files checked:
- verification plan:
```

No pre-flight means no code.

## Definition of Done

An issue is not Done because typecheck or unit tests pass.

Done requires a verification receipt in Linear:

```text
Verification receipt:
- Linear issue:
- PR:
- commit SHA:
- checks run:
- target environment:
- real route/workflow tested:
- browser/screenshot/report evidence:
- result:
- residual risks:
```

For UI-visible changes, require browser workflow verification on the real target environment or an explicitly approved staging equivalent.

## Definition of Ready

`implement` is Ready only when:

- Linear contract is complete;
- file locks are declared;
- delete budget is declared;
- existing pipeline is named or explicitly marked not applicable;
- required plan-review is approved or explicitly waived by a human;
- the implementer has posted pre-flight.

## File locks

Each active Linear issue declares its file locks through its contract.

Rules:

- one active issue owns a file lock at a time;
- parallel subagents are allowed only for disjoint file sets;
- overlap requires explicit human comment in Linear;
- GitHub CI must detect PR changes outside allowed files and changes to forbidden files.

## Delete budgets

Every issue that touches existing behavior must define a delete budget:

- per critical file when relevant;
- total deletion limit for the PR;
- zero budget for files that must not be rewritten.

The PR gate must compare actual diff deletions with the Linear contract.

## Existing pipeline preservation

If an issue touches an existing workflow, the contract must name:

- existing files;
- existing callbacks;
- existing routes;
- existing hooks/stores;
- existing backend endpoints;
- existing user entry path.

The agent must reuse them unless Linear explicitly authorizes replacement.

## Adversarial implementer pass

- Likely bad interpretation: "orchestrate" means create a new engine.
- Guardrail added: issue contract must name the existing pipeline to preserve and forbid parallel engines by default.
- Likely bad interpretation: "simplify" means delete working code.
- Guardrail added: delete budget and regression receipt are mandatory.
- Likely bad interpretation: "parallel agents" means independent worktrees can make assumptions.
- Guardrail added: file locks and disjoint write scopes are mandatory.
- Likely bad interpretation: "plan-review" is optional ceremony.
- Guardrail added: it blocks implementation on all risky work.
- Regression proof required: real user workflow, not isolated component tests.
