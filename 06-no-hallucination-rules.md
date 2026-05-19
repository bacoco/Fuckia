---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: no-hallucination-rules
owner: human
source_of_truth: true
---

# No-Hallucination Rules

The implementer must not invent capabilities, APIs, field names, or agent formats.

## Must verify before coding

Verify from official docs or live product:

- whether Linear Documents are available and how they are linked to Projects/issues;
- whether Linear issue templates/custom fields can enforce required fields;
- whether file locks should be represented as custom fields, issue sections, labels, or comments;
- exact Linear API/MCP/auth method to read issue contract from CI;
- exact GitHub integration behavior for PR status automation;
- exact Claude skill file format;
- exact Codex skill file format;
- exact validation rules for each skill platform;
- exact AI reviewer trigger mechanisms and permissions;
- exact branch protection/check behavior.

## Must document choices

The developer must produce an implementation note:

```text
Decision:
Verified source:
Chosen implementation:
Rejected alternatives:
Risk:
Fallback:
```

## Do not assume these are true

- Do not assume Linear required fields can block all bad issues natively.
- Do not assume Linear Docs are versioned like Git.
- Do not assume GitHub can read Linear without an integration token.
- Do not assume Claude and Codex skill frontmatter rules match.
- Do not assume AI review tools can be required checks without configuration.
- Do not assume browser verification can be automated for every private environment.

## Human escape hatch

Provide an explicit emergency bypass, but make it visible:

```text
Bypass reason:
Approver:
Scope:
Expiration:
Follow-up issue:
```

Bypasses must be logged in Linear and visible in the PR.

## Adversarial implementer pass

- Likely bad interpretation: "architecture spec says Linear supports X, so code against X."
- Guardrail added: all product/API claims must be verified before coding.
- Likely bad interpretation: "if strict enforcement is hard, skip it."
- Guardrail added: use warning mode first, then strict checks where technically possible.
- Forbidden shortcut: silent fallback to comments only when custom fields/API are unavailable.
- Regression proof required: implementation note records exact verified capabilities and limits.
