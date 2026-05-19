# Law 5 - Separated Authority

An agent must not be the sole authority over risky work it planned or implemented.

Risky work requires separated planner, plan reviewer, implementer, code reviewer, and verifier roles.

For PR review, separation is based on AI identity. The GitHub account used to submit the review is transport only.

The PR must record author AI and validator AI.

The validator AI must be different from the author AI when independent review is required.

GitHub mergeability is a separate platform gate. GitHub can reject an AI-valid review when the submitting account is the PR author, the latest pusher, or lacks required repository access.

When GitHub rejects a review, the agent must report the exact platform blocker instead of calling the PR merge-ready.

Bypasses require visible reason, approver, scope, expiration, and follow-up issue.
