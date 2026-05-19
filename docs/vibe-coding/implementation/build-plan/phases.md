# Phases

## Phase 1 - CLI Skeleton

Create:

- `package.json`;
- `tsconfig.json`;
- `src/cli.ts`;
- command router;
- `--help`;
- no-write command harness.
- generated/source file boundary helpers.

Commands:

- `fuckia doctor`;
- `fuckia init --dry-run`;
- `fuckia migrate --dry-run`.

## Phase 2 - Doctor

Implement checks for:

- current working directory;
- Git repository presence;
- root `README.md`;
- `docs/vibe-coding/` structure;
- every directory has `README.md`;
- English-only documentation scan;
- old flat-path references.
- generated file headers and source hashes when generated examples exist.

## Phase 3 - Init Dry Run

Generate an install plan for a new project without writing:

- files to create;
- directories to create;
- generated Claude skills;
- generated Codex skills;
- GitHub templates;
- config file.

## Phase 4 - Existing Project Audit

Implement `migrate --dry-run`:

- inventory agent rules;
- inventory skills;
- inventory GitHub workflows;
- inventory docs/specs;
- detect conflicts;
- produce a migration report;
- write nothing.

## Phase 5 - Skill Source Schema

Add neutral skill source schema and fixtures.

Generate sample Claude/Codex skill outputs only after schema tests pass.

Generated sample outputs must be committed only under examples or fixtures until the distribution contract is explicit.

## Phase 6 - Safe Writes

Only after review, implement:

- `init`;
- `migrate --plan`;
- `migrate --apply`.

`migrate --apply` remains governance-file-only by default.
