# Repository Layout

The standalone implementation repository is named:

```text
claude-codex-collab-kit
```

It must be standalone. It must not live under an existing product repository.

Top-level areas:

- `src/` - TypeScript CLI implementation.
- `skills-src/` - neutral skill sources.
- `generated/` - generated Claude and Codex skills.
- `templates/` - Linear, GitHub, and repo installation templates.
- `docs/` - install, migration, security, archive, and pilot docs.
- `examples/` - blank repo and existing-project demos.
- `tests/` - unit and integration fixtures.

Every directory must include a `README.md`.

