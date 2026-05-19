# Build Plan

This directory turns the Fuckia specs into an executable implementation plan.

Read order:

1. `objective.md`
2. `contracts-to-preserve.md`
3. `phases.md`
4. `non-goals.md`
5. `verification.md`
6. `self-hosting-and-generated-files.md`
7. `adversarial-pass.md`

## Decision

Do not start implementation from memory or chat.

Build from this plan, the constitution, the installation docs, and the CLI blueprint.

Fuckia must apply its own laws to its own implementation. Source files, generated files, examples, and local outputs must be clearly separated.

## First Implementation Slice

The first code slice must create a working CLI skeleton with:

- `npx fuckia --help`;
- `npx fuckia doctor`;
- `npx fuckia init --dry-run`;
- `npx fuckia migrate --dry-run`;
- test fixtures for safe no-write behavior.
