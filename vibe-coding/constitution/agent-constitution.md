---
type: constitution
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: agent-constitution
owner: human
source_of_truth: true
---

# Agent Constitution

These are the foundational laws for Claude, Codex, third reviewers, generated skills, GitHub checks, Linear workflows, and every agent-facing process in this kit.

They are not developer suggestions. They are the operating constitution.

Every implementation detail in this repository must preserve these laws.

## Laws

1. `laws/01-progressive-disclosure.md`
2. `laws/02-evidence-before-claim.md`
3. `laws/03-source-of-truth-before-memory.md`
4. `laws/04-preserve-working-systems.md`
5. `laws/05-separated-authority.md`
6. `laws/06-real-verification-before-done.md`
7. `laws/07-end-of-work-checkpoint.md`
8. `laws/08-delegated-review-without-ui.md`

## Enforcement

1. `enforcement/coverage.md`
2. `enforcement/priority.md`
3. `enforcement/test-fixtures.md`

## Propagation

Use `agent-law-propagation.md` to apply the laws:

```text
Universal constitution
  -> role-specific addenda
  -> Claude/Codex adapters
  -> deterministic validators
```

Each agent receives the same universal laws. Role-specific rules may add constraints for planners, reviewers, implementers, verifiers, and emergency operators. They must not weaken this constitution.

## Developer Prompt

```text
Start from `vibe-coding/constitution/agent-constitution.md`.

These are foundational laws, not implementation suggestions.
Every skill, template, validator, workflow, and receipt must enforce or explicitly reflect them.

Do not implement a collaboration kit that only documents these laws.
Map each law to concrete generated skills, GitHub checks, Linear templates, PR templates, review gates, and test fixtures.
```
