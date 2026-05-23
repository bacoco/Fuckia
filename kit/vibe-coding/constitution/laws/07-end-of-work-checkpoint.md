---
type: law
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: end-of-work-checkpoint
owner: human
source_of_truth: true
---

# Law 7 - End-Of-Work Checkpoint

Every meaningful agent work session must end with a concise checkpoint.

The checkpoint exists so the next human, Claude session, Codex session, or reviewer knows the real state without reconstructing it from chat history.

## Required Checkpoint

At the end of work, report:

1. current state;
2. what changed;
3. verification run;
4. mistakes or corrections made;
5. what remains;
6. next recommended action.

## Rules

- Do not hide incomplete work.
- Do not say Done without listing verification.
- Do not omit mistakes that affected the implementation path.
- Do not leave the next agent to infer whether work was pushed.
- Keep the checkpoint short and concrete.

## Required Format

```text
Current state:
Done:
Verification:
Corrections:
Remaining:
Next:
```

## PDG Pass

- Bad implementation path: an agent finishes with only a success sentence and leaves missing context.
- Guardrail added: every meaningful work session requires a six-field checkpoint.
- Existing behavior that must be preserved: verification remains required before Done.
- Forbidden implementation shortcuts: hiding failed commands, skipped checks, partial writes, or unpushed commits.
- Regression proof required: final responses and receipts include current state, done, verification, corrections, remaining work, and next action.
