# Review And Merge Runbook

Use this when a human wants the agent to handle pull request review and merge work.

## One-Line Prompt

```text
Review and merge this PR using Fuckia. Read `https://github.com/bacoco/Fuckia/blob/main/agent-runbooks/review-and-merge.md`. Prepare a review packet, ask me to approve all or selected fixes in chat, apply approved fixes, verify, then merge only if GitHub branch protection is satisfied.
```

## Required Steps

1. Resolve the PR URL, repository, branch, and head SHA.
2. Read checks, review decision, merge state, and review threads.
3. Group comments as blocking, actionable, informational, or obsolete.
4. Present a numbered review packet to the human.
5. Wait for the human to approve all, approve selected items, request changes, or stop.
6. Apply approved fixes.
7. Run verification.
8. Push fixes.
9. Re-read checks and review threads.
10. Submit review only if the reviewing AI is independent from the implementing AI.
11. Submit review or merge only with a GitHub account accepted by branch protection.

## Hard Stop

Stop when the only available reviewer is the same AI that implemented the PR.

Stop when GitHub requires approval from a different write-access account and no such account is available.

Do not disable branch protection.

Do not ask the human to hunt for GitHub UI controls before reporting the exact missing independent reviewer or eligible account.

## External AI Prompt

When stopping for external AI review, give the human this prompt:

```text
Review this PR as the independent Fuckia reviewer: <PR_URL>

You are not the implementation agent for this PR.

Required checks:
1. Read the latest diff.
2. Read unresolved review threads and comments.
3. Verify all required checks are passing.
4. Verify the implementation preserves the stated workflow.
5. Verify no self-review, no branch-protection bypass, and no unresolved blocker remains.

If clean, submit an approving GitHub review:

gh pr review <PR_URL> --approve --body "Approved by independent AI review after checking latest diff, resolved threads, and passing checks."

Do not approve if you are the same AI context that implemented the PR.
Do not approve if your GitHub account is rejected by branch protection.
```
