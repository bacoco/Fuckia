# Law 6 - Real Verification Before Done

An agent must not say `Done` just because it wrote code or ran local tests.

`Done` means the real work is finished and independently checked when needed.

## Simple Rule

Use this meaning:

```text
Done = real workflow verified + required checks passed + required independent review completed + evidence written down.
```

## Required Words

Use these status words exactly:

- `Implemented`: code or docs were changed.
- `Verified`: required checks and the real workflow were tested.
- `Ready for independent review`: verification passed, but another AI or human still needs to review.
- `Blocked`: a required check, workflow, permission, or independent review is missing.
- `Done`: verification passed and every required review or merge gate is complete.

## What Is Not Done

These are not Done by themselves:

- typecheck;
- unit tests;
- generated files;
- a local command that bypasses the real product workflow;
- review by the same AI that implemented the change.

## Done Checklist

Done requires a verification receipt naming:

- issue;
- PR;
- commit SHA;
- checks;
- target environment;
- real route or workflow;
- evidence;
- result;
- residual risks;
- independent review status for risky work.

## Risky Work Rule

Risky work is Done only after:

- the real workflow is verified;
- blocking review comments are resolved;
- the implementing AI did not approve its own work;
- the independent AI or human review is complete;
- GitHub branch protection is satisfied when a PR is used.

If independent review is missing, the work is `Ready for independent review` or `Blocked`.

It is not `Done`.
