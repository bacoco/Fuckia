# Verified Capabilities

## Linear

Useful:

- project and issue documents;
- issue templates;
- blocked/blocking issue relations;
- GitHub integration;
- GraphQL API;
- webhooks;
- native agent guidelines.

Limits:

- templates do not replace GitHub enforcement;
- documents are not immutable Git history;
- blocker behavior must be verified for each workspace.

## GitHub

Useful:

- PR templates;
- branch protection and rulesets;
- status checks;
- required reviews;
- merge queues;
- versioned archive.

Limits:

- GitHub does not understand Linear intent without checks;
- fork PRs create a secret boundary;
- bypass permissions must be constrained and logged.

## Claude And Codex

Useful:

- skills;
- GitHub review/action integrations;
- Linear/GitHub entry points;
- subagents where write scopes are disjoint.

Limits:

- skills are not enough without validators;
- review comments are advisory unless mapped to checks;
- memory/chat is not a source of truth.

