---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: initial-skills-and-risk-map
owner: human
source_of_truth: true
---

# Initial Skills And Risk Map

All skills are enforcement mechanisms for `vibe-coding/constitution/agent-constitution.md`.

## Sections

1. `catalog/README.md`
2. `catalog/shared-v1.md`
3. `catalog/platform-adapters.md`
4. `catalog/third-reviewers.md`
5. `risks/README.md`
6. `risks/risk-map.md`
7. `risks/packaging.md`

## Core Decision

Use symmetric governance and asymmetric mechanics:

- shared skills define the workflow contract and must be generated for both Claude and Codex;
- Claude-only and Codex-only skills may adapt tool-specific mechanics, but must not weaken shared rules;
- third reviewers start as read-only review, synthesis, or challenge roles.

Budget is not the constraint. Coordination, authority, stale context, and verification are the constraints.

## Developer Prompt

```text
Start with the v1 skills listed in `vibe-coding/skills/catalog/shared-v1.md`.

Implement shared skills from one neutral source and generate Claude/Codex outputs.
Implement platform-only adapters only for tool mechanics.
Implement risk handling from `vibe-coding/skills/risks/risk-map.md`.
```
