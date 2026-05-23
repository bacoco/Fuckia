# Build Plan

This directory turns the Fuckia specs into an executable implementation plan.

Read order:

1. `objective.md`
2. `contracts-to-preserve.md`
3. `phases.md`
4. `non-goals.md`
5. `verification.md`
6. `self-hosting-and-generated-files.md`
7. `pdg-pass.md`

## Decision

Do not start implementation from memory or chat.

Build from this plan, the constitution, the installation docs, and the CLI blueprint.

Fuckia must apply its own laws to its own implementation. Source files, generated files, examples, and local outputs must be clearly separated.

## Implemented CLI Slice

The CLI slice exposes:

- `fuckia --help`;
- `fuckia doctor`;
- `fuckia install --dry-run`;
- `fuckia install --apply --yes`;
- `fuckia migrate --dry-run`;
- `fuckia migrate --plan`;
- `fuckia migrate --apply`;
- `fuckia github --dry-run --strict`;
- `fuckia linear --dry-run --team <TEAM_KEY>`;
- `fuckia strict --dry-run --strict`.

The primary product install path is the agent prompt in the root README. The CLI remains the deterministic engine behind that prompt.
