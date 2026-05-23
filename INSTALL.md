# Install Fuckia

This file is an agent procedure for Claude Code, Codex, or another AI coding agent.

The human is inside the target repository and asked you to install Fuckia.

Normal installation does not require Node.js or npm.

## Install Profiles

Fuckia has two install profiles:

- `full`: install the governance kit, selected agent entrypoints, skills, docs, GitHub templates, and Linear templates.
- `guard-only`: install only the **PDG - Progressive Disclosure Guard** skill and matching agent trigger file.

The stable skill slug is `progressive-disclosure-guard`.

Use `guard-only` when the human only wants the PDG and does not want the full Claude/Codex collaboration kit.

For standalone PDG installation, prefer the dedicated repository:

```text
https://github.com/bacoco/progressive-disclosure-guard
```

Fuckia reads PDG from that repository at the commit pinned in `kit/pdg.lock.json`. It does not maintain a second PDG source.

Use explicit human wording when available:

- "only the guard", "only the skill", or "PDG - Progressive Disclosure Guard" -> `guard-only`
- "Fuckia", "full kit", "collaboration", "GitHub", or "Linear" -> `full`

Prompt for Codex:

```text
Install PDG - Progressive Disclosure Guard here for Codex. Read `https://github.com/bacoco/progressive-disclosure-guard/blob/main/INSTALL.md`, start with audit only, report the exact files you will write, and ask before writing.
```

Prompt for Claude Code:

```text
Install PDG - Progressive Disclosure Guard here for Claude Code. Read `https://github.com/bacoco/progressive-disclosure-guard/blob/main/INSTALL.md`, start with audit only, report the exact files you will write, and ask before writing.
```

In `guard-only`, install only these files:

- Codex: `.agents/skills/progressive-disclosure-guard/SKILL.md`
- Codex trigger: `AGENTS.md`
- Claude: `.claude/skills/progressive-disclosure-guard/SKILL.md`
- Claude trigger: `CLAUDE.md`

Do not install `fuckia.config.yaml`, GitHub workflows, Linear templates, or `docs/fuckia` in `guard-only`.

## Agent Modes

Fuckia can install one active agent surface or both:

- `codex-only`: install `AGENTS.md` and `.agents/skills/...`.
- `claude-only`: install `CLAUDE.md` and `.claude/skills/...`.
- `dual-agent`: install both Codex and Claude surfaces.

Use explicit human wording when available:

- "Codex only" -> `codex-only`
- "Claude only" -> `claude-only`
- "Claude and Codex", "both", or "dual" -> `dual-agent`

If the human did not specify the mode, inspect existing repo markers:

- Codex markers only: `AGENTS.md`, `.agents`, or `.agents/skills` -> use `codex-only`.
- Claude markers only: `CLAUDE.md`, `.claude`, or `.claude/skills` -> use `claude-only`.
- both marker families or no markers -> stop and ask one short question:

```text
Should I install Fuckia for Codex only, Claude only, or both?
```

Do not infer mode from missing Claude/Codex credentials alone.

Recommended prompt:

```text
Install Fuckia here. Use the agent mode that matches this repo; ask if ambiguous.
```

## Non-Negotiable Contract

- Treat the current working directory as the target repository.
- Do not copy this file into the target repository.
- Do not modify product code.
- Start with audit only.
- Ask before writing files.
- Report exact files before writes.
- Preserve existing `AGENTS.md`, `CLAUDE.md`, skills, workflows, docs, and config.
- If evidence is missing, write `Unknown`, verify, ask the human, or stop.

## Requirements

Normal install and migration require:

- Claude Code, Codex, or another agent reading this file;
- git access to `https://github.com/bacoco/Fuckia`;
- a shell that can run `bash`;
- write access to the target repository working tree.

Normal install and migration do not require:

- Node.js;
- npm;
- a published package;
- a Claude marketplace plugin;
- a Codex marketplace plugin.

Advanced CLI use and Fuckia maintenance require Node.js and npm. Do not ask the human to install Node.js or npm for the normal installation path.

GitHub remote setup requires:

- GitHub CLI `gh`;
- `gh auth status` authenticated;
- repository admin permission for branch protection writes;
- GitHub Actions enabled on the target repository;
- installed `.github/workflows` files committed and pushed to the default branch before remote protection is applied.

Linear setup requires:

- `LINEAR_API_KEY`;
- a Linear workspace where the key can create issues;
- the target Linear team key;
- human approval before remote Linear writes.

Account creation, billing plan selection, organization setup, and permission grants are human-controlled steps. Fuckia verifies access and stops when required access is missing.

## Platform Preflight

Before proposing writes, check the platform state and report it.

Run inside the target repository:

```bash
cd "$target_dir"
git rev-parse --is-inside-work-tree
git remote -v
command -v gh >/dev/null 2>&1 && gh auth status || true
command -v gh >/dev/null 2>&1 && gh repo view --json nameWithOwner,defaultBranchRef 2>/dev/null || true
test -n "${LINEAR_API_KEY:-}" && echo "LINEAR_API_KEY=present" || echo "LINEAR_API_KEY=missing"
```

Use the results like this:

- If `git` is missing or the target is not a git repository, ask the human whether to initialize git or continue with local files only.
- If no GitHub remote exists, install local Fuckia files first, then ask whether the human wants to create or connect a GitHub repository.
- If `gh` is missing, say GitHub remote setup is blocked until GitHub CLI is installed or another authenticated GitHub path is provided.
- If `gh auth status` fails, ask the human to authenticate GitHub CLI.
- If GitHub repository access is missing, ask the human to grant access or provide the correct repository.
- If `LINEAR_API_KEY` is missing, install local Fuckia files first, then ask whether Linear setup stays skipped for now or resumes after the key is provided.
- If the Linear team key is missing, ask the human for the team key before creating Linear issues.
- If a required permission is missing, do not invent success. Report `Blocked`, the exact missing permission, and the next human action.

## Save The Target Path

```bash
target_dir="$(pwd)"
```

## Get Fuckia

If the Fuckia repository already exists locally, use its absolute path.

If it does not exist locally, clone it into a temporary directory:

```bash
tmp_dir="$(mktemp -d)"
git clone https://github.com/bacoco/Fuckia.git "$tmp_dir/Fuckia"
FUCKIA_DIR="$tmp_dir/Fuckia"
```

If clone fails, stop and ask the human for access or a local path.

For an existing local clone:

```bash
FUCKIA_DIR="/absolute/path/to/Fuckia"
```

## Audit The Target Repository

Run:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run --agent-mode <codex-only|claude-only|dual-agent>
```

This command is read-only.

For skill-only install:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run --agent-mode <codex-only|claude-only|dual-agent> --profile guard-only
```

## Report Before Writes

Report these facts to the human:

- target repository path;
- new project or existing project;
- git repository state;
- GitHub remote state;
- GitHub CLI state;
- GitHub authentication state;
- GitHub repository access state;
- Linear API key state;
- Linear team key state;
- install profile;
- selected agent mode;
- existing `AGENTS.md`;
- existing `CLAUDE.md`;
- existing `.agents/skills`;
- existing `.claude/skills`;
- existing GitHub workflows;
- existing PR template;
- existing `docs/fuckia`;
- existing `fuckia.config.yaml`;
- files Fuckia wants to create;
- files Fuckia will preserve;
- merge proposals Fuckia will create;
- GitHub permissions required;
- Linear permissions required;
- exact command you want to run next.

Stop after this report.

## Apply After Human Approval

Run this only after the human approves the write list:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes --agent-mode <codex-only|claude-only|dual-agent>
```

For skill-only install:

```bash
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes --agent-mode <codex-only|claude-only|dual-agent> --profile guard-only
```

For an existing project, this command preserves conflicting governance files and writes merge proposals under:

```text
docs/fuckia/merge-proposals/
```

It must not modify product code.

In `guard-only`, if the target skill already exists with different content, stop and report the conflict. Do not overwrite it and do not create migration files.

## Verify Basic Installation

Run:

```bash
cd "$target_dir"
test -f fuckia.config.yaml
test -f .github/PULL_REQUEST_TEMPLATE.md
test -f .github/workflows/collab-contract.yml
test -f .github/workflows/generated-skills.yml
test -f .github/workflows/pr-scope.yml
test -f docs/fuckia/README.md
test -f docs/fuckia/end-of-work-checkpoint.md
case "<codex-only|claude-only|dual-agent>" in
  codex-only)
    test -f AGENTS.md
    test -f .agents/skills/source-of-truth-gate/SKILL.md
    test -f .agents/skills/progressive-disclosure-guard/SKILL.md
    grep -q "progressive-disclosure-guard" AGENTS.md
    test ! -e CLAUDE.md
    grep -R "GENERATED FILE - DO NOT EDIT DIRECTLY" .agents/skills >/dev/null
    ;;
  claude-only)
    test -f CLAUDE.md
    test -f .claude/skills/source-of-truth-gate/SKILL.md
    test -f .claude/skills/progressive-disclosure-guard/SKILL.md
    grep -q "progressive-disclosure-guard" CLAUDE.md
    test ! -e AGENTS.md
    grep -R "GENERATED FILE - DO NOT EDIT DIRECTLY" .claude/skills >/dev/null
    ;;
  dual-agent)
    test -f AGENTS.md
    test -f CLAUDE.md
    test -f .agents/skills/source-of-truth-gate/SKILL.md
    test -f .claude/skills/source-of-truth-gate/SKILL.md
    test -f .agents/skills/progressive-disclosure-guard/SKILL.md
    test -f .claude/skills/progressive-disclosure-guard/SKILL.md
    grep -q "progressive-disclosure-guard" AGENTS.md
    grep -q "progressive-disclosure-guard" CLAUDE.md
    grep -R "GENERATED FILE - DO NOT EDIT DIRECTLY" .agents/skills .claude/skills >/dev/null
    ;;
esac
```

If any command fails, report the failing command and stop.

For guard-only install, verify only the selected PDG skill and trigger:

```bash
cd "$target_dir"
case "<codex-only|claude-only|dual-agent>" in
  codex-only)
    test -f .agents/skills/progressive-disclosure-guard/SKILL.md
    test -f AGENTS.md
    grep -q "progressive-disclosure-guard" AGENTS.md
    test ! -e CLAUDE.md
    test ! -e fuckia.config.yaml
    ;;
  claude-only)
    test -f .claude/skills/progressive-disclosure-guard/SKILL.md
    test -f CLAUDE.md
    grep -q "progressive-disclosure-guard" CLAUDE.md
    test ! -e AGENTS.md
    test ! -e fuckia.config.yaml
    ;;
  dual-agent)
    test -f .agents/skills/progressive-disclosure-guard/SKILL.md
    test -f .claude/skills/progressive-disclosure-guard/SKILL.md
    test -f AGENTS.md
    test -f CLAUDE.md
    grep -q "progressive-disclosure-guard" AGENTS.md
    grep -q "progressive-disclosure-guard" CLAUDE.md
    test ! -e fuckia.config.yaml
    ;;
esac
```

## GitHub Remote Setup

Run this after the installed `.github` files are committed and pushed to the default branch.

Read:

```text
kit/vibe-coding/installation/platforms/github.md
```

Verify access:

```bash
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef
```

Apply remote GitHub protection only after explicit human approval.

If Node.js is available and the human wants the CLI automation, the optional command is:

```bash
cd "$target_dir"
npx --yes github:bacoco/Fuckia github --dry-run --strict
npx --yes github:bacoco/Fuckia github --apply --yes
```

GitHub approval rules require a real GitHub reviewer account, team, or GitHub App accepted by branch protection. AI identity alone cannot satisfy GitHub platform review gates.

## Linear Setup

Run this only when `LINEAR_API_KEY` is set and the human gives the team key.

Read:

```text
kit/vibe-coding/installation/platforms/linear.md
```

Create the issue chain:

- spec;
- plan;
- plan-review;
- implement;
- code-review;
- verify.

Write the receipt to:

```text
docs/fuckia/archive/linear-issue-chain.json
```

If Node.js is available and the human wants the CLI automation, the optional command is:

```bash
cd "$target_dir"
LINEAR_API_KEY=<token> npx --yes github:bacoco/Fuckia linear --dry-run --team <TEAM_KEY>
LINEAR_API_KEY=<token> npx --yes github:bacoco/Fuckia linear --apply --yes --team <TEAM_KEY>
```

## End Of Work

End with this checkpoint:

```text
Current state:
Done:
Verification:
Corrections:
Remaining:
Next:
```
