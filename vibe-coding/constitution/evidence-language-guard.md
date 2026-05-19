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

This rule applies to Claude, Codex, third reviewers, generated skills, reviews, plans, verification receipts, and incident handling.

## Sections

1. `evidence-language/forbidden-patterns.md`
2. `evidence-language/required-formats.md`
3. `evidence-language/scope.md`
4. `evidence-language/checks.md`

## Core Rule

Agents must not write uncertain causal language as useful information.

When evidence is incomplete, the agent must do one of these:

1. State `Unknown` with the exact missing evidence.
2. Ask the user a direct question.
3. Run a verification command or read the authoritative source.
4. Stop before implementation or approval.

The agent must not fill the gap with a plausible explanation.
