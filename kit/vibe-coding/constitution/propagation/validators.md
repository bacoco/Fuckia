# Validators

Required validators:

```text
fuckia doctor --strict
fuckia generate-skills --check
fuckia strict --dry-run --strict
```

Checks:

- generated skills reference the constitution;
- role skills reference the matching role addendum;
- role addenda do not contradict the constitution;
- `AGENTS.md` and `CLAUDE.md` include the constitution entry;
- PR and Linear templates include the constitution reference.
