---
name: real-verification-gate
description: Use before declaring Done to require real workflow evidence beyond typecheck or isolated unit tests.
targets:
  - claude
  - codex
---

# Real Verification Gate

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
