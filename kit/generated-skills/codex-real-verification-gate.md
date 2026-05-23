---
name: real-verification-gate
description: Use before declaring Done to require real workflow evidence beyond typecheck or isolated unit tests.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: kit/skills-src/shared/real-verification-gate.skill.md
source_hash: 2f1e985d3f3d7be03978127a62cefc6df569aaed80e714b9d88716f074109dcd
generated_by: fuckia generate-skills
target: codex
-->

# Real Verification Gate

## Codex Mechanics

- Use `rg` for repository inventory.
- Use `apply_patch` for manual file edits.
- Use Codex subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Codex implementation as reviewed by the same Codex context.

Use this skill before saying work is done.

Simple rule:

```text
Done = real workflow verified + required checks passed + required independent review or human approval completed + evidence written down.
```

## Status Words

Use these words exactly:

- `Implemented`: code or docs were changed.
- `Verified`: required checks and the real workflow were tested.
- `Ready for human validation`: verification passed, but no independent reviewer is available.
- `Ready for independent review`: verification passed, but another AI still needs to review.
- `Blocked`: a required check, workflow, permission, or independent review is missing.
- `Done`: verification passed and every required review or merge gate is complete.

## Done Requires

Done requires evidence for:

- the exact user or product entry path;
- GitHub or local checks relevant to the change;
- generated skill drift when skills changed;
- Linear or GitHub receipt when remote setup changed;
- end-of-work checkpoint.

For risky work, Done also requires a completed independent AI review or human approval.

## Not Enough

These are not enough by themselves:

- typecheck;
- unit tests;
- component existence tests;
- generated file presence;
- a local command that bypasses the product path.

Independent review or human approval required but missing is not Done.

An author AI self-check is useful evidence, but it is not independent review.

## Verification Receipt

Record:

- commands run;
- command outcomes;
- remote checks verified;
- files changed;
- residual blockers;
- next step.

If no second AI is available, give the human this validation card:

- changed files:
- real workflow or command checked:
- expected result:
- risk the human is accepting:
- exact approval sentence:

The exact approval sentence must be:

```text
Approved after human validation.
```

If external review is required but missing, report `Ready for independent review`, `Ready for human validation`, or `Blocked: independent review required`.
