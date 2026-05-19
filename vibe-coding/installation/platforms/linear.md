# Linear Setup Contract

Fuckia covers Linear setup as part of the collaboration system.

## Scope

- account and workspace checklist;
- team and project checklist;
- issue workflow status contract;
- project and issue templates for spec, plan, plan-review, implement, code-review, and verify;
- GitHub integration checklist;
- issue-to-PR linking contract;
- exportable Linear snapshot for GitHub archive.

## Automation Rule

- account creation is a human step;
- billing choice is a human step;
- workspace configuration requires verified Linear permissions;
- missing permission produces a checklist item;
- automation must link to the official Linear source used for implementation;
- automation must not invent a successful state.

## Official Source Anchors

- Linear workspace docs: https://linear.app/docs/workspaces
- Linear issue status docs: https://linear.app/docs/configuring-workflows
- Linear project template docs: https://linear.app/docs/project-templates
- Linear issue templates: https://linear.app/docs/issue-templates
- Linear GraphQL API: https://linear.app/developers/graphql
- Linear issue creation URL: https://linear.app/developers/create-issues-using-linear-new

## Implemented Command

```bash
fuckia linear --dry-run --team <TEAM_KEY>
fuckia linear --apply --yes --team <TEAM_KEY>
```

The dry-run command verifies:

- `LINEAR_API_KEY`;
- reachable Linear GraphQL API;
- available teams;
- selected team key;
- local template catalog.

The apply command creates six issues through `issueCreate`:

1. spec
2. plan
3. plan-review
4. implement
5. code-review
6. verify

It writes `docs/fuckia/archive/linear-issue-chain.json`.

## Native Template Boundary

Linear's public docs describe creating issue templates in the Linear UI and using template URLs.

Fuckia does not claim native issue-template mutation support through GraphQL. It creates an active issue chain through the official GraphQL issue creation mutation and keeps local Markdown templates in the repository.
