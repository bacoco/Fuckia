# Remaining Work

This directory tracks what remains after the implemented installable product slice.

## Primary Goal

Make Claude Code and Codex collaborate safely on one repository through installed rules, generated skills, GitHub gates, Linear workflow, and verification receipts.

Self-improvement from public issues is secondary.

## Implemented Product Work

- GitHub dry-run audit.
- GitHub remote apply for unprotected repositories.
- GitHub merge-preserving status check apply for existing branch protection.
- Linear GraphQL issue-chain creation.
- Local Linear template installation.
- Strict local mode.
- Shared Claude and Codex skill catalog.
- GitHub-backed one-line install commands.

## Remaining Release Work

1. Package and plugin publishing.
   - Publish NPM package or another package-manager entrypoint.
   - Package Claude plugin or marketplace path.
   - Keep GitHub-backed `npx` as the current direct install path.

2. Linear native template mutation.
   - Add native Linear issue-template creation only when official template mutation support is verified.
   - Keep current GraphQL issue-chain creation as the implemented remote Linear setup.

3. Public improvement loop.
   - Convert real failure reports into issues.
   - Require pull requests for rule, skill, template, and validator changes.
   - Keep this secondary to the Claude/Codex collaboration goal.

## Adversarial Implementer Pass

- Bad implementation path: treat release publishing as required for local GitHub-backed usage.
- Guardrail added: current one-line GitHub-backed `npx` path is documented separately from package publishing.
- Existing behavior that must be preserved: `install --dry-run` is read-only and `install --apply --yes` does not modify product code.
- Forbidden implementation shortcuts: do not claim native Linear issue-template mutation until official API support is verified.
- Regression proof required: tests must cover install, GitHub, Linear, strict mode, and generated skills.
