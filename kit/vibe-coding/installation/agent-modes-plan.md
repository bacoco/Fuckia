# Agent Mode Install Plan

Date: 2026-05-23

## Objective

Make Fuckia install cleanly in three modes:

- `codex-only`
- `claude-only`
- `dual-agent`

The install experience must stay conversational: the human can say "Install Fuckia here", and the agent infers the repo mode or asks one short question when inference is ambiguous.

## Current Problem

Fuckia currently assumes a dual-agent shape in many places:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude;
- `.agents/skills/...`;
- `.claude/skills/...`;
- generated skill checks for both target directories.

That is useful for Claude+Codex collaboration, but it creates noise when a repository only uses one agent.

## Product Decision

Fuckia keeps one shared governance model, but installs only the active agent surfaces by default.

Common files can still be installed for every mode:

- `docs/fuckia/...`
- `fuckia.config.yaml`
- GitHub PR template and workflows, if GitHub is enabled
- Linear templates, if Linear is enabled

Agent-specific files must follow the selected mode:

- `codex-only`: install `AGENTS.md` and `.agents/skills/...`
- `claude-only`: install `CLAUDE.md` and `.claude/skills/...`
- `dual-agent`: install both

## Install UX

Preferred human prompt:

```text
Install Fuckia here. Auto-detect whether this repo is Codex-only, Claude-only, or dual-agent. If the mode is ambiguous, ask me one question before writing files.
```

Shorter prompt:

```text
Install Fuckia here. Use the agent mode that matches this repo; ask if ambiguous.
```

Explicit prompts:

```text
Install Fuckia here for Codex only.
Install Fuckia here for Claude only.
Install Fuckia here for Claude and Codex.
```

## Detection Rules

Add an `auto` mode to the installer.

The installer inspects:

- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing `.agents/skills`;
- existing `.claude/skills`;
- explicit user wording: "Codex only", "Claude only", "both", "dual";
- optional CLI flag.

Inference:

- Codex markers only -> `codex-only`
- Claude markers only -> `claude-only`
- both markers -> ask whether to keep dual-agent or install for one target only
- no markers -> ask one question
- explicit user wording always wins over inference

Do not infer from missing API keys alone. A missing Claude or Codex subscription/key means that target may be unusable today, but it does not prove repository ownership.

## CLI/API Shape

Add one install option:

```bash
fuckia install --dry-run --agent-mode auto
fuckia install --apply --yes --agent-mode codex-only
fuckia install --apply --yes --agent-mode claude-only
fuckia install --apply --yes --agent-mode dual-agent
```

For the shell installer:

```bash
agent-install.sh --target "$target_dir" --dry-run --agent-mode auto
agent-install.sh --target "$target_dir" --apply --yes --agent-mode codex-only
```

Default is `auto`.

## Implementation Tasks

1. Add `agentMode` to installer planning.
   - Values: `auto`, `codex-only`, `claude-only`, `dual-agent`.
   - Preserve current dual output only when mode resolves to `dual-agent`.

2. Make generated skill installation mode-aware.
   - Codex-only writes `.agents/skills/...`.
   - Claude-only writes `.claude/skills/...`.
   - Dual-agent writes both.
   - Example previews under `kit/generated-skills/` can remain both-target, because they document package capability.

3. Make templates mode-aware.
   - Codex-only creates or proposes `AGENTS.md`, not `CLAUDE.md`.
   - Claude-only creates or proposes `CLAUDE.md`, not `AGENTS.md`.
   - Dual-agent creates or proposes both.

4. Make GitHub generated-skill checks mode-aware.
   - Store enabled agent targets in `fuckia.config.yaml`.
   - Generated-skill workflow checks only configured targets.
   - Do not fail a Codex-only repo because `.claude/skills` is absent.

5. Update `INSTALL.md`.
   - Explain the three modes.
   - Add the auto-detect prompt.
   - State that ambiguous installs must stop and ask one question before writes.

6. Add tests.
   - `install --dry-run --agent-mode codex-only` writes/proposes only Codex agent files.
   - `install --dry-run --agent-mode claude-only` writes/proposes only Claude agent files.
   - `install --dry-run --agent-mode dual-agent` preserves current behavior.
   - generated-skills workflow/config is mode-aware.

## Acceptance Criteria

- A Codex-only repository can install Fuckia without creating Claude files.
- A Claude-only repository can install Fuckia without creating Codex files.
- A dual-agent repository can install both surfaces.
- Auto mode asks exactly one short question when markers conflict or are absent.
- `npm run generate-skills`, `npm run check:skills`, and `npm test` pass.
- Existing dual-agent behavior remains available and unchanged when `dual-agent` is selected.

## Non-Goals

- Do not split `progressive-disclosure-guard` into a separate repository now.
- Do not create separate hand-maintained Claude and Codex skill sources.
- Do not remove generated skill previews from `kit/generated-skills/`.
- Do not require Node.js for normal agent-led installation.
- Do not treat missing Claude/Codex credentials as repository-mode proof.

## PDG pass

- Known knowns: Fuckia currently has one shared skill source and generated Claude/Codex outputs; existing dual-agent install behavior must keep working.
- Known unknowns: exact `fuckia.config.yaml` schema for `agentMode` must be chosen during implementation.
- Unknown knowns: "auto-detect" can be misread as silently choosing both; it must ask when markers are ambiguous or absent.
- Unknown unknowns: generated GitHub workflows may assume both `.agents` and `.claude`; tests must cover mode-specific workflow output.
- Bad implementation path: delete Claude/Codex generated previews to "simplify" the repo.
- Guardrail added: previews remain package examples; installed target files become mode-aware.
- Existing behavior that must be preserved: `dual-agent` install produces current AGENTS/CLAUDE and both skill directories.
- Forbidden implementation shortcuts: no parallel skill sources, no hardcoded Codex-only default, no writes before dry-run report and human approval.
- Regression proof required: dry-run/apply tests for all three modes plus generated-skill drift check.

## Prompt To Give The Developer

```text
Implement Fuckia agent install modes from `kit/vibe-coding/installation/agent-modes-plan.md`.

Goal: support `codex-only`, `claude-only`, and `dual-agent` install modes with `auto` as the default. Preserve current dual-agent behavior when `dual-agent` is selected. Do not split skill sources and do not remove generated previews.

Required constraints:
- MUST keep `kit/skills-src/shared/*.skill.md` as the canonical skill source.
- MUST generate target-specific installed skills based on selected agent mode.
- MUST NOT create hand-maintained duplicate Claude/Codex skill sources.
- MUST NOT install dormant agent files in codex-only or claude-only mode.
- MUST ask one short question when auto-detection is ambiguous.
- MUST keep normal installation Node-free.

Verification:
- npm run generate-skills
- npm run check:skills
- npm test
- targeted tests for codex-only, claude-only, and dual-agent install outputs
```
