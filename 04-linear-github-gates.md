---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: linear-github-gates
owner: human
source_of_truth: true
---

# Linear And GitHub Gates

Linear coordinates. GitHub enforces.

## Linear configuration to design

The developer must define:

- project template for agent-managed features;
- issue templates with required contract sections for `spec`, `plan`, `plan-review`, `implement`, `code-review`, and `verify`;
- workflow statuses;
- labels for risk and verification;
- convention for file locks;
- convention for delete budgets;
- convention for authorized agent;
- convention for verification receipts.

Recommended statuses:

```text
Triage
Spec Ready
In Progress
PR Open
Verification Required
Human Review
Done
Blocked
Canceled
```

GitHub automation may move issues to `PR Open` or `Verification Required`. It must not move risky product work directly to `Done` only because a PR merged.

## Linear dependency gates

The intended dependency chain is:

```text
spec approved
  -> plan written
  -> plan-review approved by different agent/human
  -> implement ready
  -> PR open
  -> code-review approved
  -> verify completed
  -> done
```

The implementer must determine whether to enforce this with native Linear dependencies, labels, custom fields, API automation, GitHub checks, or a combination. Do not invent Linear capabilities; verify them.

## GitHub checks to build

The template should include checks for:

- PR title or branch contains Linear issue ID;
- PR links to the Linear issue;
- PR links to active Linear document or states it is not needed;
- changed files stay within Linear allowed files;
- forbidden files are not touched;
- deletion count stays within budget;
- generated skills are synced;
- required plan-review is approved before implementation for risky work;
- planner and plan reviewer are not the same actor when the work is risky;
- implementer and code reviewer are not the same actor when the work is risky;
- no durable active spec is created outside Linear unless it is an archive snapshot;
- required verification receipt exists before merge-ready;
- UI-visible work includes browser evidence or explicit human waiver.

## PR template requirements

Every PR must include:

```text
Linear issue:
Linear active spec/doc:
Scope:
Allowed files:
Forbidden files:
Delete budget:
Existing pipeline preserved:
Verification:
Archive snapshot:
Residual risks:
```

For risky PRs, also include:

```text
Plan issue:
Plan-review issue:
Plan reviewer:
Code reviewer:
Verification issue:
```

## AI review roles

AI reviewers are useful but must be scoped:

- CodeRabbit: default lightweight review on most PRs.
- Claude: architecture, regression, and intent review on risky labels.
- Codex: second review or controlled fix path.
- Gemini: optional second opinion on complex PRs.

Rules:

- AI reviewers do not merge.
- AI reviewers do not override the Linear contract.
- AI review comments are advisory unless mapped to a required GitHub check.
- Expensive reviewers should trigger by label or comment, not necessarily every PR.
- A planner must not be the only plan reviewer on risky work.
- An implementer must not be the only code reviewer on risky work.

## Cross-review metrics

The template should expose, at minimum:

- plans written per agent;
- plan reviews per agent;
- self-review attempts blocked;
- plan-review rejection rate;
- implementation PR rejection rate;
- average plan-review time;
- stale worktree/branch incidents;
- cost or token warning count when available;
- Claude/Codex rules divergence count.

## Branch protection

Required before strict rollout:

- contract validation check;
- generated skills sync check;
- relevant typecheck/tests;
- verification receipt check for UI/product work;
- at least one human approval for risky files or architecture labels.

## Archive snapshot

Before or with merge, create/update:

```text
docs/linear-archive/<LINEAR-ID>/
  spec-snapshot.md
  contract.md
  verification-receipt.md
  links.md
```

The snapshot should include the Linear URLs, PR URL, commit SHA, and final verification result.

## Adversarial implementer pass

- Likely bad interpretation: "GitHub is used by Linear, so GitHub checks are optional."
- Guardrail added: Linear coordinates; GitHub branch protection enforces.
- Likely bad interpretation: "AI review passed, so merge."
- Guardrail added: AI review is not a merge authority.
- Likely bad interpretation: "PR merged means Linear Done."
- Guardrail added: Done requires verification receipt, not just merge.
- Likely bad interpretation: "review happened because the PR has comments."
- Guardrail added: risky work requires explicit plan-review and code-review roles.
- Regression proof required: a test PR must fail when it exceeds delete budget or touches forbidden files.
