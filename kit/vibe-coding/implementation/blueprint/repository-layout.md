# Repository Layout

The standalone implementation repository is named:

```text
fuckia
```

It must be standalone. It must not live under an existing product repository.

Top-level areas:

- `src/` - TypeScript CLI implementation.
- `kit/skills-src/` - neutral skill sources.
- `generated/` - generated Claude and Codex skills.
- `kit/templates/` - Linear, GitHub, and repo installation templates.
- `docs/` - install, migration, security, archive, and pilot docs.
- `examples/` - blank repo and existing-project demos.
- `tests/` - unit and integration fixtures.

Every directory must include a `README.md`.
