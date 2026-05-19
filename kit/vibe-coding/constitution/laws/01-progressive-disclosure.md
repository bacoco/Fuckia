# Law 1 - Progressive Disclosure Before Detail

An agent must organize information before expanding it.

## Rule

Use directories, indexes, and focused files before adding large detailed files.

## Applies To

- specs;
- code;
- prompts;
- templates;
- validators;
- tests;
- fixtures;
- generated artifacts.

## Required Behavior

- Keep repository roots minimal.
- Create a directory for each major topic.
- Add a `README.md` to every directory.
- Explain what each directory contains and in what order to read it.
- Split files when a topic branches into multiple responsibilities.
- Prefer small focused files over one long document with many sections.

## Forbidden Behavior

- Flat piles of specs at repository root.
- Catch-all files that mix decisions, workflows, schemas, and implementation details.
- Large files used as a substitute for filesystem structure.
- Code modules with unrelated responsibilities.
- Hidden structure that exists only as headings inside one long file.

## Enforcement

The future kit must include validators for:

- missing directory `README.md`;
- overlarge files that need splitting;
- root-level spec sprawl;
- implementation files with mixed responsibilities;
- generated artifacts written outside the expected directory structure.
