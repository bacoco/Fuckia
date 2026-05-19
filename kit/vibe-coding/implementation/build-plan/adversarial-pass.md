# Adversarial Implementer Pass

## Bad Implementation Path

"Build the installer" means write directly into target projects.

## Guardrail Added

First implementation slice is dry-run first. `migrate --dry-run` and `init --dry-run` must not write files.

## Bad Implementation Path

"Simplify installation" means hide all receipts.

## Guardrail Added

Installation can be one command, but it must produce visible receipts for created, changed, skipped, and risky files.

## Bad Implementation Path

"Existing project migration" means reorganize the project.

## Guardrail Added

Migration audit may inventory and propose. It must not reorganize, delete, or modify product code.

## Bad Implementation Path

"Plugin path" means implement marketplace publishing first.

## Guardrail Added

The Node-free installer is the normal implementation slice. Claude plugin, Codex packaging, and the Node CLI remain additional distribution and automation paths.

## Existing Behavior That Must Be Preserved

- progressive disclosure repo structure;
- English-only docs;
- constitution-first governance;
- destructive-change guard terminology;
- private GitHub repo and current `main` branch.

## Forbidden Implementation Shortcuts

- writing into existing projects during audit;
- adding strict mode by default;
- reintroducing token/cost budget constraints;
- creating one large CLI file with mixed responsibilities;
- skipping tests for no-write behavior.
- committing generated local target-project output as if it were source.
- allowing Fuckia to rewrite itself without explicit apply.

## Regression Proof Required

Fixtures must prove:

- `init --dry-run` writes nothing;
- `migrate --dry-run` writes nothing;
- missing `README.md` directories are reported;
- old flat-path references are reported;
- existing agent files are inventoried, not overwritten.
- generated artifacts are either reproducible product artifacts or isolated fixtures/examples.
