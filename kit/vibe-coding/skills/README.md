# Skills

This directory defines the skill system for Claude and Codex.

Read order:

1. `shared-skills-system.md`
2. `shared/README.md`
3. `initial-skills-and-risk-map.md`
4. `catalog/README.md`
5. `risks/README.md`
6. `existing-project/README.md`

## Purpose

Shared governance must be authored once in a neutral source and generated into Claude and Codex formats.

Claude-only and Codex-only skills are tool adapters. They must not weaken the universal laws.

## Current Implementation State

Implemented source:

- Fuckia shared skills: `../../kit/skills-src/shared/*.skill.md`
- PDG source of truth: `https://github.com/bacoco/progressive-disclosure-guard`, pinned by `../../kit/pdg.lock.json`

Generated examples:

- `../../kit/generated-skills/claude-*.md`
- `../../kit/generated-skills/codex-*.md`

Generator commands:

```bash
npm run generate-skills
npm run check:skills
```

Implemented generator scope:

- reads `kit/skills-src/shared/*.skill.md`;
- writes generated examples under `kit/generated-skills/<target>-<skill>.md`;
- excludes PDG because the installer fetches it from the pinned PDG repository;
- checks generated examples for drift.

Installed skills are written to `.claude/skills/...` and `.agents/skills/...` by the init/install flow.
