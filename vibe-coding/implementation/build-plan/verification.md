# Verification

## Required Local Checks

Run after the first implementation slice:

```bash
npm test
npm run build
node dist/cli.js --help
node dist/cli.js doctor
node dist/cli.js init --dry-run
node dist/cli.js migrate --dry-run
node dist/cli.js doctor --self
```

## Required Fixtures

Create fixtures for:

- empty project;
- existing project with `AGENTS.md`;
- existing project with `CLAUDE.md`;
- existing project with both Claude and Codex skills;
- existing project with scattered specs;
- existing project with missing directory README;
- unsupported uncertainty language.

## Acceptance Criteria

- dry-run commands do not write files;
- doctor reports structure issues with exact paths;
- migration audit lists proposed files without applying changes;
- no command requires model API keys;
- no command requires Linear or GitHub tokens in the first slice.
- self-check mode reports issues without rewriting the repository.
