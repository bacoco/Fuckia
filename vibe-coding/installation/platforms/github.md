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

## Official Source Anchors

- GitHub Actions quickstart: https://docs.github.com/en/actions/quickstart
- GitHub Actions repository settings: https://docs.github.com/en/github/administering-a-repository/disabling-or-limiting-github-actions-for-a-repository
- GitHub rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
- GitHub branch protection API: https://docs.github.com/v3/repos/branches
