# Skills

Skill source parsing and generation.

Current generator:

- reads neutral shared sources from `skills-src/shared/*.skill.md`;
- writes generated examples under `docs/examples/generated-skills/<target>/<skill>/SKILL.md`;
- checks generated examples for drift.

Rule: install-target skill writes are not implemented yet.
