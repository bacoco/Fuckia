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

Review independence is the identity of the AI reviewer, not the GitHub account used to submit the review.

A review is valid only when it comes from:

- a human reviewer with write access;
- another AI agent;
- a different AI identity with review-only ownership;
- an approved GitHub App reviewer that actually reviewed the change.

Every PR must trace:

- author AI;
- validator AI;
- whether validator AI is different from author AI;
- GitHub reviewer account or exact platform blocker.

GitHub account identity is transport only.

If a different AI reviewer uses the same GitHub account and GitHub accepts the review, the AI-independence rule is satisfied.

Do not switch accounts to pretend that the same AI became an independent reviewer.

If GitHub rejects the review because of account-level branch protection, the agent must report that platform blocker.

If the current agent cannot access the other AI, it must give the human a copy-paste prompt for the other AI.

For new repositories, Fuckia must not create required GitHub approving reviews unless an accepted reviewer account, team, or GitHub App is known. Status-check protection is the default.

## Forbidden Shortcut

Do not disable branch protection, lower required approvals, dismiss valid reviews, or force-merge to avoid review friction.

## Expected Human Interface

The agent should present a short decision packet:

- approve all;
- approve selected items;
- request changes;
- stop.

The human can answer in chat. The agent performs the GitHub operations that are allowed by GitHub permissions.
