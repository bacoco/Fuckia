---
name: real-verification-gate
description: Use before declaring Done to require real workflow evidence beyond typecheck or isolated unit tests.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: kit/skills-src/shared/real-verification-gate.skill.md
source_hash: f2f560997fe2aa60921ea02564a6ff628fdc3c67114cfd6be5741bef9a0719cf
generated_by: fuckia generate-skills
target: claude
-->

# Real Verification Gate

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

Use this skill before saying work is done.

Simple rule:

```text
Done = real workflow verified + required checks passed + required independent review completed + evidence written down.
```

## Status Words

Use these words exactly:

- `Implemented`: code or docs were changed.
- `Verified`: required checks and the real workflow were tested.
- `Ready for independent review`: verification passed, but another AI or human still needs to review.
- `Blocked`: a required check, workflow, permission, or independent review is missing.
- `Done`: verification passed and every required review or merge gate is complete.

## Done Requires

Done requires evidence for:

- the exact user or product entry path;
- GitHub or local checks relevant to the change;
- generated skill drift when skills changed;
- Linear or GitHub receipt when remote setup changed;
- end-of-work checkpoint.

For risky work, Done also requires a completed independent AI or human review.

## Not Enough

These are not enough by themselves:

- typecheck;
- unit tests;
- component existence tests;
- generated file presence;
- a local command that bypasses the product path.

Independent review required but missing is not Done.

## Verification Receipt

Record:

- commands run;
- command outcomes;
- remote checks verified;
- files changed;
- residual blockers;
- next step.

If external review is required but missing, report `Ready for independent review` or `Blocked: independent review required`.
