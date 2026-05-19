# GitHub Setup Contract

Fuckia covers GitHub setup as part of the collaboration system.

## Scope

- account or organization ownership checklist;
- repository creation checklist;
- token or GitHub App permission checklist;
- GitHub Actions enablement and workflow installation;
- pull request template installation;
- rulesets or branch protection setup;
- required status checks for collaboration gates;
- versioned archive artifacts for plans, reviews, verification receipts, and generated skill snapshots.

## Automation Rule

- safe local files can be installed by the CLI;
- repository configuration requires verified GitHub permissions;
- missing permission produces a checklist item;
- automation must link to the official GitHub source used for implementation;
- automation must not invent a successful state.

## Implemented Command

```bash
fuckia github --dry-run
fuckia github --dry-run --strict
fuckia github --apply --yes
```

The dry-run command is read-only. It verifies:

- local `.github` files installed by Fuckia;
- GitHub `origin` remote;
- GitHub CLI availability and authentication;
- repository metadata and default branch;
- authenticated user permission signal;
- GitHub Actions repository permissions;
- repository ruleset visibility;
- required status checks for `contract`, `generated-skills`, and `scope`.

It does not create remote rulesets, branch protection, or required checks.

The apply command creates branch protection only when:

- the workflow files exist on the remote default branch;
- GitHub admin permission is verified;
- no repository rulesets exist;
- branch protection does not already exist;
- `--yes` is present.

## Remote Apply Requirement

Any future merge-preserving remote apply command must:

- read existing branch protection and rulesets first;
- preserve existing required checks;
- add only missing Fuckia checks;
- avoid overwriting repository-specific protections;
- verify the final remote state after writes.

## Official Source Anchors

- GitHub Actions quickstart: https://docs.github.com/en/actions/quickstart
- GitHub Actions repository settings: https://docs.github.com/en/github/administering-a-repository/disabling-or-limiting-github-actions-for-a-repository
- GitHub rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
- GitHub branch protection API: https://docs.github.com/v3/repos/branches
- GitHub repository API: https://docs.github.com/rest/repos/repos
- GitHub Actions permissions API: https://docs.github.com/en/rest/actions
- GitHub repository rules API: https://docs.github.com/en/rest/repos/rules
