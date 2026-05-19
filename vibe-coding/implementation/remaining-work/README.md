# Remaining Work

This directory tracks what is required before Fuckia is a complete installable product.

## Primary Goal

Make Claude Code and Codex collaborate safely on one repository through installed rules, generated skills, GitHub gates, Linear workflow, and verification receipts.

Self-improvement from public issues is secondary.

## Remaining Product Work

1. GitHub merge-preserving remote apply.
   - Extend `github --apply --yes` for repositories that already have branch protection or rulesets.
   - Preserve existing branch protection and rulesets.
   - Verify the final remote state after writes.

2. Linear automation.
   - Verify official Linear capabilities.
   - Generate or install issue templates for spec, plan, plan-review, implementation, code-review, and verification.
   - Record the Linear issue chain in `docs/fuckia/archive`.

3. Strict mode.
   - Turn warning checks into blocking checks.
   - Block missing plan review, self-review on risky work, missing verification receipt, and generated skill drift.

4. Shared skill catalog.
   - Add initial shared skills beyond `adversarial-implementer-guard`.
   - Generate Claude and Codex outputs from one neutral source.
   - Verify generated output drift in CI.

5. One-command distribution.
   - Publish the package or plugin path.
   - Keep the human install entrypoint to one prompt.
   - Keep the agent execution path audit-first for existing repositories.

6. Public improvement loop.
   - Convert real failure reports into issues.
   - Require pull requests for rule, skill, template, and validator changes.
   - Keep this secondary to the Claude/Codex collaboration goal.

## Adversarial Implementer Pass

- Bad interpretation to block: GitHub workflow files in the target repository mean GitHub is fully configured.
- Guardrail added: remote readiness has a separate `github --dry-run` command and remote apply is still listed as remaining work.
- Existing behavior that must be preserved: `init --apply` and `migrate --apply` install local files only and must not write product code.
- Forbidden implementation shortcuts: do not overwrite existing branch protection, rulesets, or required checks.
- Regression proof required: tests must prove read-only audit behavior and remote state checks before any future remote write command is accepted.
