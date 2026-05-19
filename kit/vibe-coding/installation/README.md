# Installation

The primary installation path is agent-first.

The human opens Claude Code or Codex inside the target repository and pastes:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent follows `INSTALL.md` from the Fuckia repository. It does not copy that file into the target repository.

## CLI Engine

The CLI is the deterministic engine used by the agent:

```bash
fuckia install --dry-run
fuckia install --apply --yes
fuckia migrate --plan
fuckia migrate --apply
fuckia github --dry-run --strict
fuckia github --apply --yes
fuckia linear --dry-run --team <TEAM_KEY>
fuckia linear --apply --yes --team <TEAM_KEY>
fuckia strict --dry-run --strict
fuckia strict --apply
```

Direct terminal use is supported through:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

This direct path is for maintainers and users who want to run the CLI without an agent.

## Existing Projects

Existing projects are migration-first:

1. audit;
2. migration plan;
3. approved install;
4. merge proposals for conflicting governance files.

Product code is outside the installation scope.

## GitHub

Fuckia installs GitHub workflow files locally.

Remote GitHub protection is a separate step after the workflow files are committed and pushed:

```bash
fuckia github --dry-run --strict
fuckia github --apply --yes
```

GitHub review gates require a real GitHub reviewer account, team, or GitHub App accepted by GitHub branch protection.

## Linear

Fuckia creates the Linear issue chain only when credentials and a team key are provided:

```bash
LINEAR_API_KEY=<token> fuckia linear --dry-run --team <TEAM_KEY>
LINEAR_API_KEY=<token> fuckia linear --apply --yes --team <TEAM_KEY>
```

## Product Rule

The user should not need to understand the full repository before installation.

The installer must hide complexity while producing visible receipts for every change.
