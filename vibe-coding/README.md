# Vibe Coding Collaboration Kit

This directory contains the collaboration system for Claude Code, Codex, Linear, GitHub, and optional third reviewers.

The system is organized through progressive disclosure. Read the narrowest file that answers the current question, then drill down only when needed.

## Read Order

1. `constitution/README.md`
2. `operating-model/README.md`
3. `skills/README.md`
4. `installation/README.md`
5. `implementation/README.md`
6. `prompts/developer-prompt.md`
7. `references/sources.md`

## Directories

- `constitution/` - universal laws, law propagation, and evidence language guard.
- `operating-model/` - Linear/GitHub workflow, gates, contracts, and failure classes.
- `skills/` - shared, Claude-only, and Codex-only skill strategy.
- `installation/` - plugin, CLI, new-project, and existing-project installation paths.
- `implementation/` - standalone repo blueprint, rollout, capabilities, and migration plan.
- `prompts/` - copy-paste implementation prompts.
- `references/` - official docs and internal source references.

## Foundational Rule

The first law is Progressive Disclosure Before Detail:

- no large flat piles of files;
- no catch-all specs;
- every directory explains its purpose;
- split files when a topic branches;
- the same structure applies to code, specs, prompts, validators, tests, and templates.
