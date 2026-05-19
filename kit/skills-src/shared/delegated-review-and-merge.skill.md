---
name: delegated-review-and-merge
description: Use when a PR needs review handling, user approval, GitHub approval, or merge without forcing the human through the GitHub review UI.
targets:
  - claude
  - codex
---

# Delegated Review And Merge

Use this skill when a human asks an agent to handle pull request review and merge work.

## Goal

The agent must do the review labor and present a decision packet to the human.

The human may approve all decisions in one message, approve selected items, or request changes.

## Required Review Packet

Before merge or approval, produce:

- PR URL and head SHA;
- merge status;
- required checks and their result;
- unresolved review threads;
- review comments grouped by blocking, actionable, informational, and obsolete;
- exact fixes proposed;
- files that will be changed;
- verification commands to run;
- author AI identity;
- validator AI identity;
- explicit statement that validator AI is different from author AI;
- GitHub reviewer account or exact platform blocker;
- merge blockers that require GitHub permission.

## Human Decision Modes

Offer these choices:

- approve all proposed fixes and continue;
- approve selected fixes only;
- request changes;
- stop without writes.

Do not ask the human to manually find GitHub buttons when an agent can perform the GitHub operation.

## GitHub Approval Rule

## AI Review Independence Rule

The AI that implemented the PR must not approve the PR.

The approving review must come from:

- a different AI agent;
- a different AI identity with explicit review-only ownership;
- a human acting as reviewer.

GitHub account identity is transport only. It is not the definition of review independence.

Every PR or review receipt must trace:

- author AI;
- validator AI;
- whether validator AI is different from author AI;
- GitHub reviewer account or exact platform blocker.

Never switch accounts to pretend that the same AI became an independent reviewer.

## GitHub Execution Rule

Submit the GitHub approval only when GitHub accepts the operation.

Fuckia review validity and GitHub merge validity are separate gates:

- Fuckia review validity requires `Validator AI != Author AI`.
- GitHub merge validity requires a review submitted through an account accepted by branch protection.

If a different AI reviewer uses the same GitHub account and GitHub accepts the review, the Fuckia AI-independence rule is satisfied and the GitHub platform gate is satisfied.

If GitHub rejects the review because of account-level branch protection, report the exact platform blocker. Do not call the PR merge-ready.

If the current agent cannot access a different AI reviewer, give the human a copy-paste prompt for the other AI.

## Merge Rule

Merge only when:

- all required checks pass;
- all blocking review threads are resolved;
- GitHub reports the PR is mergeable;
- the required independent AI or human approval exists;
- the human has approved the merge instruction in chat or the active Linear issue.

## Handoff Prompt Requirement

When stopping for external review, provide a complete prompt for the other AI.

The prompt must include:

- PR URL;
- author AI identity;
- validator AI identity field for the other AI to fill;
- GitHub reviewer account field or platform blocker field;
- required review stance;
- checks to verify;
- comments to inspect;
- command to approve if clean;
- instruction not to approve if it is the same AI context that implemented.

## Receipt

End with:

- Current state;
- Done;
- Verification;
- Corrections;
- Remaining;
- Next.
