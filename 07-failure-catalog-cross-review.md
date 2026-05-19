---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: failure-catalog-cross-review
owner: human
source_of_truth: true
---

# Failure Catalog And Cross-Review

This kit is universal. A single incident exposed the problem, but the system must cover all common Claude/Codex collaboration failures, not only one project.

## Failure classes to cover

The implementation must explicitly decide how each class is prevented, detected, or escalated.

1. Plan/spec failures
   - ambiguous verbs such as `orchestrate`, `simplify`, `refactor`, `wire`, `reuse`, `support`;
   - huge plans nobody reads fully;
   - implicit KEEP without explicit FORBID;
   - missing engine/pipeline constraints;
   - competing plans with no authority;
   - plan published without independent review.

2. Implementation failures
   - silent file overlap;
   - stale worktrees or stale branches;
   - dependency breaks between agent commits;
   - parallel engines, hooks, stores, routes, or pipelines;
   - dead underscore props/vars left "for later";
   - tests that mock the real engine.

3. Review failures
   - self-review;
   - reviewer hangs or timeouts;
   - reviewer has no live environment;
   - optional checklists;
   - parallel reviews never synthesized.

4. Cross-agent coordination failures
   - invisible status;
   - direct CLI bypassing skills;
   - confusing auto-checkpoint commits;
   - account swap mid-task;
   - missed notifications.

5. Tooling asymmetry failures
   - Claude has a skill Codex does not have, or the inverse;
   - generated skill versions diverge;
   - same command name means different behavior;
   - shell/PATH/hook differences;
   - file watcher races.

6. Deploy/verify failures
   - tests green but product broken;
   - migration created but not applied;
   - real URL never opened;
   - mobile/desktop drift;
   - environment variable drift;
   - no visual baseline.

7. Memory/state failures
   - one agent has memory the other lacks;
   - memory contradicts the repo;
   - `CLAUDE.md` and `AGENTS.md` diverge;
   - subagent inherits inconsistent context.

8. Cost/velocity failures
   - duplicate work by two agents;
   - redundant verification;
   - one agent blocks the other;
   - reviewer hang causes waiting or uncontrolled duplication;
   - review loops consume excessive tokens/cost.

## Mandatory cross-review model

Use distinct roles:

```text
Planner
Plan reviewer
Implementer
Code reviewer
Verifier
```

Hard rules:

- planner must not be the plan reviewer for risky work;
- implementer must not be the sole code reviewer for risky work;
- plan-review blocks implementation;
- verification blocks Done;
- human can override, but only with a visible Linear bypass reason.

## Issue types

The kit must support these Linear issue types or labeled templates:

```text
spec
plan
plan-review
implement
code-review
verify
```

`plan-review` must reference:

- plan issue;
- implement issue it blocks;
- planner;
- reviewer;
- parent spec/project document.

## Plan-review Definition of Ready

Before plan-review starts:

- plan exists and is linked;
- parent spec/project document is linked or explicitly not applicable;
- intended files, pipelines, and constraints are listed;
- risky verbs are highlighted or absent;
- expected DoD is present.

## Plan-review Definition of Done

The plan reviewer must record:

```text
Ambiguities:
Engine/pipeline constraint:
Forbidden section:
Delete budget:
File locks:
Scope consistency:
Global rules consistency:
Real verification path:
Decision: approve | request_changes | block
```

If `request_changes`, implementation stays blocked until the planner revises and review repeats.

If `block`, human escalation is required.

## When plan-review is mandatory

Mandatory for:

- plan over the configured length threshold, recommended default `200` lines;
- core files: shell, route, store, hook, engine, pipeline, auth, storage, deploy, migrations, generated skills, agent rules;
- public API or data contract changes;
- multi-agent or subagent work;
- any `REMOVE`, `REPLACE`, `refactor`, `simplify`, `orchestrate`, `wire`, `reuse`, `support`, or equivalent ambiguous instruction;
- delete budget above low-risk threshold;
- UI-visible workflow changes;
- production/staging/deploy changes.

Optional or warning-only for:

- small bugfix under configured line threshold;
- isolated rename;
- doc-only change;
- generated archive snapshot.

## Re-review triggers

Require human escalation or another reviewer when:

- planner and reviewer disagree after two rounds;
- reviewer repeatedly approves without findings on risky work;
- reviewer is the maintainer most invested in the changed area;
- reviewer cannot access the target verification environment;
- review tool hangs beyond timeout.

## Metrics to expose

The universal repo/template should define a dashboard or report for:

- plan-review pass/fail rate;
- self-review attempts blocked;
- average plan-review time;
- plans above length threshold;
- delete budget violations;
- forbidden file attempts;
- stale branch/worktree incidents;
- generated skill divergence;
- real workflow verification missing or failed;
- cost/token warning count when available.

## Adversarial implementer pass

- Likely bad interpretation: "cross-review means another comment somewhere."
- Guardrail added: cross-review is a blocking issue/stage with a decision.
- Likely bad interpretation: "another agent can review after implementation."
- Guardrail added: plan-review happens before implementation and blocks it.
- Likely bad interpretation: "small fixes need the whole ceremony."
- Guardrail added: low-risk bypass is allowed, but thresholds must be explicit.
- Forbidden shortcut: self-approval of risky plans or risky code.
- Regression proof required: sample risky issue cannot move to implementation until a different actor approves plan-review.
