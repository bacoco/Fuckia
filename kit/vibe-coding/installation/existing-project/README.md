# Existing Project Migration

Existing project migration is audit-first.

The agent starts with:

```bash
fuckia install --dry-run
```

For an existing project, the install flow creates or uses a migration plan before writing governance files.

Manual CLI sequence:

```bash
fuckia migrate --dry-run
fuckia migrate --plan
fuckia migrate --apply
```

Migration audits:

- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing `.agents/skills`;
- existing `.claude/skills`;
- existing GitHub workflows;
- existing PR template;
- existing `docs/fuckia`;
- existing `fuckia.config.yaml`.

Apply behavior:

- writes missing governance files;
- preserves existing governance files;
- writes merge proposals under `docs/fuckia/merge-proposals/`;
- does not modify product code.
