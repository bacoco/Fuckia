# 08 - Delegated Review Without UI Burden

The human must not be forced to perform repetitive GitHub review UI work when an agent can collect evidence, summarize decisions, apply fixes, and execute approved operations.

## Required Behavior

For review and merge work, the agent must:

- inspect the PR state;
- inspect checks;
- inspect review threads;
- classify comments as blocking, actionable, informational, or obsolete;
- propose exact fixes;
- ask for human approval in chat before write operations;
- apply approved fixes;
- re-run verification;
- report remaining merge blockers.

## Review Independence Boundary

The agent must not fake independence.

The implementation AI must not approve its own PR.

A review is valid only when it comes from:

- a human reviewer with write access;
- another AI agent;
- a separate review-only context with no implementation ownership;
- an approved GitHub App reviewer that actually reviewed the change.

GitHub account identity is an enforcement mechanism, not the source of truth for independence.

If GitHub requires approval from someone other than the latest pusher, the approval must also be submitted through a GitHub account that branch protection accepts.

If the current agent cannot access the other AI or eligible GitHub account, it must give the human a copy-paste prompt for the other AI.

## Forbidden Shortcut

Do not disable branch protection, lower required approvals, dismiss valid reviews, or force-merge to avoid review friction.

## Expected Human Interface

The agent should present a short decision packet:

- approve all;
- approve selected items;
- request changes;
- stop.

The human can answer in chat. The agent performs the GitHub operations that are allowed by GitHub permissions.
