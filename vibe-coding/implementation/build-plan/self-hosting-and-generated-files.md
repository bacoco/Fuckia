# Self-Hosting And Generated Files

Fuckia must apply its own laws to the way Fuckia is built.

## Rule

The repository must distinguish source-of-truth files from generated outputs.

## Source Files To Commit

Commit these:

- constitution and law source files;
- role addenda source files;
- neutral skill source files;
- generator source code;
- CLI source code;
- templates;
- validators;
- fixtures;
- tests;
- examples that are explicitly marked as examples.

## Generated Files

Generated files may be committed only when they are part of the product distribution contract.

Examples:

- generated Claude skill examples;
- generated Codex skill examples;
- fixture outputs used by tests;
- plugin packaging examples.

Generated outputs must include:

```text
GENERATED FILE - DO NOT EDIT DIRECTLY
source:
source_hash:
generated_by:
target:
```

## Files Not To Commit By Default

Do not commit:

- local install output from testing on a random project;
- generated files from an unapproved migration;
- temporary doctor reports;
- local caches;
- machine-specific paths;
- generated target-project files unless they are in `examples/` or `tests/fixtures/`.

## Self-Application

When the CLI exists, Fuckia must run against itself in check mode:

```bash
npx fuckia doctor --self
npx fuckia validate-constitution
npx fuckia validate-agent-law-coverage
npx fuckia validate-evidence-language
```

Self-check mode must report issues. It must not rewrite the repository unless an explicit `--apply` command is used.

## Bootstrap Constraint

Before the generator exists, hand-written source files are allowed.

After the generator exists:

- generated outputs must come from the generator;
- manual edits to generated outputs must fail validation;
- source files remain the editable contract.

## Adversarial Implementer Pass

- Likely bad interpretation: "self-hosted" means the tool rewrites its own repo automatically.
- Guardrail added: self-check is read-only unless an explicit apply command is used.
- Likely bad interpretation: "generated files are useful, so commit all of them."
- Guardrail added: commit generated files only when they are examples, fixtures, or product distribution artifacts.
- Likely bad interpretation: "do not commit generated files" means skip generated skill examples.
- Guardrail added: examples and fixtures are allowed when clearly marked and hash-tracked.
- Existing behavior that must be preserved: source-of-truth files stay editable and generated files stay reproducible.
- Forbidden implementation shortcuts: committing random local install output, machine-specific generated paths, or generated target-project files outside examples/fixtures.
- Regression proof required: validators must fail manual edits to committed generated artifacts and must ignore untracked local cache output.

