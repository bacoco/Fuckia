---
type: plan
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: implementation-blueprint
owner: human
source_of_truth: true
---

# Implementation Blueprint

Implementation starts from `kit/vibe-coding/constitution/agent-constitution.md`.

The laws are the root contract. The CLI, skills, templates, validators, GitHub workflows, and Linear workflow must enforce or reflect those laws.

## Sections

1. `repository-layout.md`
2. `cli/README.md`
3. `schemas/README.md`
4. `workflows/README.md`
5. `kit/templates/README.md`
6. `validation/README.md`
7. `pilot/README.md`

## Technology Choice

Use TypeScript/Node for v1:

- Linear's SDK and GraphQL ecosystem are TypeScript-friendly.
- GitHub Actions can run Node scripts directly.
- YAML/Markdown parsing is mature.
- The same CLI can run locally and in CI.

No database in v1. Store generated reports as Markdown/JSON artifacts.

## Non-Goals For v1

- No custom hosted dashboard unless Markdown/JSON reports are insufficient.
- No automatic merge.
- No autonomous organization-wide strict rollout.
- No replacing Linear with a Markdown tracker.
- No writing agent for the third model in v1.
- No project-specific ExcenIA/Harmonia assumptions.

## Developer Prompt

```text
Implement the standalone `fuckia` repository from this blueprint directory.

Do not put it inside an existing product repo.
Start with TypeScript/Node, deterministic validators, templates, generated skills, GitHub workflows, and a doctor command.

Keep warning mode as the migration default.
Strict mode must be opt-in after the blank repo demo and one existing-project pilot.
```
