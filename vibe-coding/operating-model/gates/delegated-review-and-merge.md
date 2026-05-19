# Delegated Review And Merge Gate

This gate keeps review work out of manual GitHub UI when the agent can do it.

## Agent Duties

The agent must prepare a review packet before merge:

- PR URL;
- head SHA;
- required checks;
- merge state;
- unresolved threads;
- review comments grouped by severity;
- proposed fixes;
- verification commands;
- required human decisions;
- author AI identity;
- validator AI identity;
- explicit statement that validator AI is different from author AI;
- GitHub permission blockers.

## Human Decision

The human may answer:

- `approve all`;
- `approve selected: <numbers>`;
- `request changes: <text>`;
- `stop`.

## Review Boundary

The implementing AI must not approve its own work.

Approval must come from another AI identity, a review-only AI identity, or a human reviewer.

GitHub identity only transports the approval. It does not prove AI independence by itself.

Every approval must record author AI and validator AI.

Never switch GitHub accounts to simulate independent AI review.

## GitHub Boundary

The agent may submit reviews or merge only when GitHub accepts the operation.

If a different AI reviewer uses the same GitHub account and GitHub accepts the review, this gate is satisfied.

If GitHub rejects the review because of account-level branch protection, the agent must report that exact blocker.

If the agent cannot access the other AI directly, it must output a copy-paste prompt for that AI.

## No Bypass

The agent must not disable protection, lower review requirements, force-push over history, or mark self-review as an external approval.
