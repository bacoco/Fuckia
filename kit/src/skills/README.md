# Skills

Skill source parsing and generation.

Current generator:

- reads neutral shared sources from `kit/skills-src/shared/*.skill.md`;
- writes generated examples under `kit/generated-skills/<target>-<skill>.md`;
- checks generated examples for drift.

Rule: install-target skill writes are not implemented yet.
