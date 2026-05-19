# Fuckia

Fuckia is the standalone workspace for the Vibe Coding collaboration kit.

Start here:

- `vibe-coding/README.md` - top-level map.
- `agent-runbooks/README.md` - remote instructions that Claude and Codex follow from this repo.
- `vibe-coding/constitution/README.md` - foundational laws.
- `vibe-coding/installation/README.md` - install paths for Claude, Codex, new projects, and existing projects.
- `vibe-coding/implementation/README.md` - implementation path.
- `vibe-coding/prompts/developer-prompt.md` - implementation prompt.

## Fast Agent Start

Claude Code:

```text
Read and follow `https://github.com/bacoco/Fuckia/blob/main/agent-runbooks/claude/install-or-migrate.md` for this repository. Start with dry-run inventory. Stop before any write that lacks explicit approval.
```

Codex:

```text
Read and follow `https://github.com/bacoco/Fuckia/blob/main/agent-runbooks/codex/install-or-migrate.md` for this repository. Start with dry-run inventory. Stop before any write that lacks explicit approval.
```

These runbooks are follow-only. They are not copied into the target repository by default.

## GitHub And Linear Setup Contract

Fuckia must cover the complete collaboration setup, not only local files.

GitHub scope:

- account or organization ownership checklist;
- repository creation checklist;
- token or GitHub App permission checklist;
- GitHub Actions enablement and workflow installation;
- pull request template installation;
- rulesets or branch protection setup;
- required status checks for collaboration gates;
- versioned archive artifacts for plans, reviews, verification receipts, and generated skill snapshots.

Linear scope:

- account and workspace checklist;
- team and project checklist;
- issue workflow status contract;
- project and issue templates for spec, plan, plan-review, implement, code-review, and verify;
- GitHub integration checklist;
- issue-to-PR linking contract;
- exportable Linear snapshot for GitHub archive.

Automation rule:

- the CLI and plugins install safe local files directly;
- account creation, billing choices, and permission grants stay explicit human steps;
- repository and workspace configuration is automated only after permissions are verified;
- every automation step must link to the official GitHub or Linear source used for the implementation;
- missing permission produces a checklist item, not an invented success state.

Official source anchors for implementation:

- GitHub Actions quickstart: https://docs.github.com/en/actions/quickstart
- GitHub Actions repository settings: https://docs.github.com/en/github/administering-a-repository/disabling-or-limiting-github-actions-for-a-repository
- GitHub rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
- GitHub branch protection API: https://docs.github.com/v3/repos/branches
- Linear workspace docs: https://linear.app/docs/workspaces
- Linear issue status docs: https://linear.app/docs/configuring-workflows
- Linear project template docs: https://linear.app/docs/project-templates

## Structure Rule

This repository must use progressive disclosure:

- root files stay minimal;
- every major topic lives in a directory;
- every directory has a `README.md`;
- large or multi-topic files must be split into subfiles;
- code, specs, prompts, tests, and templates follow the same rule.

The rule is defined as Law 1 in `vibe-coding/constitution/laws/01-progressive-disclosure.md`.
