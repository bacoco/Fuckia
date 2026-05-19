---
name: real-verification-gate
description: Use before declaring Done to require real workflow evidence beyond typecheck or isolated unit tests.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/real-verification-gate.skill.md
source_hash: ea229d6f5cf7cc0599f48a3d891b711516ee49779d345b8e72903f30a1172d13
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

## Done Requires

Done requires evidence for:

- the exact user or product entry path;
- GitHub or local checks relevant to the change;
- generated skill drift when skills changed;
- Linear or GitHub receipt when remote setup changed;
- end-of-work checkpoint.

## Not Enough

These are not enough by themselves:

- typecheck;
- unit tests;
- component existence tests;
- generated file presence;
- a local command that bypasses the product path.

## Verification Receipt

Record:

- commands run;
- command outcomes;
- remote checks verified;
- files changed;
- residual blockers;
- next step.
