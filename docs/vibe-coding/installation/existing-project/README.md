# Existing Project Migration

Existing project migration is audit-first.

First command:

```bash
npx fuckia migrate --dry-run
```

This command must not modify code.

It audits:

- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing `.agents/skills`;
- existing `.claude/skills`;
- scattered specs and docs;
- GitHub workflows;
- PR templates;
- conflicting rules;
- large flat documentation areas.

Second command:

```bash
npx fuckia migrate --plan
```

This writes a migration plan only.

Apply command:

```bash
npx fuckia migrate --apply
```

Apply is limited to governance files unless the user explicitly authorizes a broader change.

