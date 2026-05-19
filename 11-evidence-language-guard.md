---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: evidence-language-guard
owner: human
source_of_truth: true
---

# Evidence Language Guard

This rule is mandatory for every Claude, Codex, third-reviewer, and human-facing agent output that guides planning, implementation, review, verification, or incident handling.

## Core rule

Agents must not write uncertain causal language as if it were useful information.

When evidence is incomplete, the agent must do one of these:

1. State `Unknown:` with the exact missing evidence.
2. Ask the user a direct question.
3. Run a verification command or read the authoritative source.
4. Stop before implementation or approval.

The agent must not continue by filling the gap with a plausible explanation.

## Forbidden language patterns

These phrases are forbidden in implementation plans, reviews, incident notes, and verification receipts unless immediately followed by a concrete verification action:

```text
it seems
it looks like
probably
likely
maybe
might
could be
appears to
I think
I suspect
I assume
should be
```

Equivalent vague causal language in any language is also forbidden.

## Required replacement formats

Use one of these instead:

```text
Observed:
Evidence:
Conclusion:
```

```text
Unknown:
Missing evidence:
Question:
```

```text
Blocked:
Reason:
Next verification:
```

```text
Hypothesis:
Verification command:
Decision after verification:
```

`Hypothesis` is allowed only when paired with the verification step that will prove or reject it before implementation, approval, or Done.

## Examples

Bad:

```text
It seems the issue comes from the route layer.
```

Good:

```text
Unknown:
Missing evidence: no failing request trace has been inspected.
Question: Which route produced the error?
```

Good:

```text
Hypothesis: the route layer is involved.
Verification command: inspect the failing request logs and route handler.
Decision after verification: update the plan only after the trace confirms the failing layer.
```

Bad:

```text
This should preserve the existing workflow.
```

Good:

```text
Evidence:
- Existing workflow entry route tested:
- Callback invoked:
- Verification receipt:
Conclusion: existing workflow preserved.
```

## Required checks

The standalone repo must include:

- `evidence-language-guard` as a shared generated skill for Claude and Codex;
- `validate-evidence-language` as a deterministic validator;
- a PR check that scans plans, reviews, verification receipts, prompt handoffs, and AI-generated comments when available;
- allowlist support for quoted examples, test fixtures, and documentation sections that explicitly list forbidden phrases;
- failure output that points to the exact line and required replacement format.

## Scope

Strict mode must enforce this rule for:

- Linear issue contracts;
- plans;
- plan reviews;
- PR bodies;
- code reviews;
- verification receipts;
- archive snapshots;
- prompts given to implementers;
- incident reports;
- bypass requests.

Warning mode must report violations without blocking.

## Why this exists

Unverified causal language creates false certainty. False certainty causes agents to:

- implement against the wrong cause;
- approve weak plans;
- replace working systems;
- skip verification;
- declare Done from incomplete evidence.

The correct behavior under missing evidence is not eloquence. The correct behavior is verification or a question.

## Adversarial implementer pass

- Likely bad interpretation: "avoid uncertain words" means rewrite guesses with stronger language.
- Guardrail added: stronger wording is forbidden unless evidence is cited.
- Likely bad interpretation: "Hypothesis" can justify implementation.
- Guardrail added: hypothesis is allowed only with a verification step before implementation, approval, or Done.
- Likely bad interpretation: "the linter is enough."
- Guardrail added: skill instructions, templates, validators, and review gates must all enforce the rule.
- Existing behavior that must be preserved: agents can still ask questions, record unknowns, and run verification before acting.
- Forbidden implementation shortcuts: replacing weak uncertainty with confident unsupported claims, ignoring quoted examples, and allowing Done with unresolved Unknown fields.
- Regression proof required: test fixtures must fail on unsupported uncertain causal language and pass when the same uncertainty is converted into `Unknown`, `Question`, or `Hypothesis` plus verification.

## Developer Prompt

```text
Add the Evidence Language Guard from `11-evidence-language-guard.md`.

Do not let agents write uncertain causal phrases in plans, reviews, verification receipts, or implementation handoffs. If evidence is missing, the output must use `Unknown`, ask a question, or run verification before continuing.

Implement a shared generated skill `evidence-language-guard` for Claude and Codex, plus a deterministic `validate-evidence-language` check with warning and strict modes.
```
