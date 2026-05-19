# Installation

The primary installation path is agent-first and Node-free.

The human opens Claude Code or Codex inside the target repository and pastes:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent follows `INSTALL.md` from the Fuckia repository. It does not copy that file into the target repository.

## Normal Installer

The normal installer is:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes
```

This path does not require Node.js or npm.

## Existing Projects

Existing projects are migration-first:

1. audit;
2. human approval;
3. approved install;
4. merge proposals for conflicting governance files.

Product code is outside the installation scope.

## GitHub

Fuckia installs GitHub workflow files locally.

Remote GitHub protection is a separate step after the workflow files are committed and pushed. Use `gh` or the optional CLI automation.

GitHub review gates require a real GitHub reviewer account, team, or GitHub App accepted by GitHub branch protection.

## Linear

Fuckia creates the Linear issue chain only when credentials and a team key are provided.

Use the Linear contract in `platforms/linear.md` or the optional CLI automation.

## Advanced CLI

The Node CLI is for maintainers and terminal-driven automation:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

The user does not need the CLI for normal Claude/Codex installation.

## Product Rule

The user should not need to understand the full repository before installation.

The installer must hide complexity while producing visible receipts for every change.
