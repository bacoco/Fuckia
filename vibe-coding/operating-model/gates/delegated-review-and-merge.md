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
- implementation agent identity when known;
- required independent reviewer agent;
- GitHub permission blockers.

## Human Decision

The human may answer:

- `approve all`;
- `approve selected: <numbers>`;
- `request changes: <text>`;
- `stop`.

## Review Boundary

The implementing AI must not approve its own work.

Approval must come from another AI, a review-only agent context, or a human reviewer.

GitHub identity only executes the approval. It does not prove AI independence by itself.

## GitHub Boundary

The agent may submit reviews or merge only through a GitHub identity that satisfies branch protection.

If GitHub requires approval from someone other than the latest pusher and no eligible account is available, the agent must report that exact blocker.

If the agent cannot access the other AI directly, it must output a copy-paste prompt for that AI.

## No Bypass

The agent must not disable protection, lower review requirements, force-push over history, or mark self-review as an external approval.
