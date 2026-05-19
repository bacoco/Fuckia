# Existing Project Migration

Existing project migration is audit-first.

The agent starts with:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
```

After approval:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes
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
- writes `docs/fuckia/migration-plan.md` for existing projects;
- does not modify product code.
