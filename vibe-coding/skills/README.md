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

- `../../skills-src/shared/adversarial-implementer-guard.skill.md`

Generated examples:

- `../../examples/generated-skills/claude/`
- `../../examples/generated-skills/codex/`

Generator commands:

```bash
npm run generate-skills
npm run check:skills
```

Implemented generator scope:

- reads `skills-src/shared/*.skill.md`;
- writes generated examples under `examples/generated-skills/<target>/<skill>/SKILL.md`;
- checks generated examples for drift.

Not implemented:

- install-target writes to `.claude/skills/...`;
- install-target writes to `.agents/skills/...`;
- complete shared skill catalog.
