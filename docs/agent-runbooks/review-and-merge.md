# Review And Merge Runbook

Use this when a human wants the agent to handle pull request review and merge work.

## One-Line Prompt

```text
Review and merge this PR using Fuckia. Read `https://github.com/bacoco/Fuckia/blob/main/docs/agent-runbooks/review-and-merge.md`. Prepare a review packet, ask me to approve all or selected fixes in chat, apply approved fixes, verify, then merge only if GitHub branch protection is satisfied.
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
11. Record author AI, validator AI, and GitHub reviewer account or platform result in the review body.
12. Submit review or merge only when GitHub accepts the operation.

## Hard Stop

Stop when the only available reviewer is the same AI that implemented the PR.

Stop when GitHub rejects the review because of account-level branch protection.

Do not disable branch protection.

Do not switch accounts to pretend that the same AI became an independent reviewer.

Do not ask the human to hunt for GitHub UI controls before reporting the exact missing independent reviewer or platform blocker.

## Platform Enforcement Boundary

Fuckia review validity and GitHub merge validity are separate gates.

- Fuckia review validity requires `Validator AI != Author AI`.
- GitHub merge validity requires a review submitted through an account accepted by branch protection.

If GitHub returns `Review Can not approve your own pull request`, the review is blocked by GitHub account identity even when the validator AI is independent.

Valid exits:

- ask an independent AI reviewer that can submit through a GitHub account with the required repository access;
- ask the human to grant that reviewer account write access, then rerun approval;
- ask the human for an explicit admin merge or branch-protection change.

## External AI Prompt

When stopping for external AI review, give the human this prompt:

```text
Review this PR as the independent Fuckia reviewer: <PR_URL>

Author AI: <AUTHOR_AI>
Validator AI: <YOUR_AI_IDENTITY>
GitHub reviewer account: <GITHUB_ACCOUNT>

You are allowed to approve only if Validator AI is different from Author AI.

GitHub account identity is transport for the Fuckia process, but GitHub branch protection still enforces by account identity. Do not switch accounts to pretend that the same AI became independent.

Required checks:
1. Read the latest diff.
2. Read unresolved review threads and comments.
3. Verify all required checks are passing.
4. Verify the implementation preserves the stated workflow.
5. Verify the PR records author AI and validator AI identities.
6. Verify the review records the GitHub reviewer account or exact platform blocker.
7. Verify no self-review, no branch-protection bypass, and no unresolved blocker remains.

If clean, submit an approving GitHub review:

gh pr review <PR_URL> --approve --body "Validator AI: <YOUR_AI_IDENTITY>. Author AI: <AUTHOR_AI>. GitHub reviewer account: <GITHUB_ACCOUNT>. Approved after checking latest diff, review threads, required checks, and preserved workflow."

Do not approve if you are the same AI context that implemented the PR.
If GitHub rejects the review because of account-level branch protection, report the exact GitHub error.
```
