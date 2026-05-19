---
name: evidence-language-guard
description: Use before writing plans, reviews, receipts, incident notes, or final status when a claim lacks direct evidence.
targets:
  - claude
  - codex
---

# Evidence Language Guard

Use this skill before writing plans, reviews, verification receipts, incident reports, PR summaries, or final status.

## Rule

Do not write uncertain causality as useful information.

When evidence is missing, use one of these actions:

1. write `Unknown` and name the missing evidence;
2. ask the human a direct question;
3. run a verification command;
4. read the authoritative source;
5. stop before implementation, approval, merge, or Done.

## Required Formats

Use one of these blocks:

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

`Hypothesis` is allowed only when verification happens before implementation, approval, merge, or Done.

## Forbidden Shortcut

Do not fill an evidence gap with a plausible explanation.
