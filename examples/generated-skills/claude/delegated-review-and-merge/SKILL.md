---
name: delegated-review-and-merge
description: Use when a PR needs review handling, user approval, GitHub approval, or merge without forcing the human through the GitHub review UI.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/delegated-review-and-merge.skill.md
source_hash: 2d12e52a3c7d8b8e342072a2aafa7beb85d9ae747efc6756a34827a42ebfda9a
generated_by: fuckia generate-skills
target: claude
-->

# Delegated Review And Merge

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

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
- implementation agent identity when known;
- required independent reviewer agent;
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
- a different agent context with explicit review-only ownership;
- a human acting as reviewer.

GitHub account identity is only the execution mechanism. It is not the definition of review independence.

## GitHub Execution Rule

Submit the GitHub approval only through an account that GitHub branch protection accepts.

If GitHub requires approval from a user other than the latest pusher, use an eligible account with write access.

If the current agent cannot access an eligible reviewer or account, give the human a copy-paste prompt for the other AI.

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
- implementation agent identity when known;
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
