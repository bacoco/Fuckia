# Install Fuckia

This file is an agent procedure for Claude Code, Codex, or another AI coding agent.

The human is inside the target repository and asked you to install Fuckia.

Normal installation does not require Node.js or npm.

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
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --dry-run
```

This command is read-only.

## Report Before Writes

Report these facts to the human:

- target repository path;
- new project or existing project;
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
bash "$FUCKIA_DIR/kit/scripts/install/agent-install.sh" --target "$target_dir" --apply --yes
```

For an existing project, this command preserves conflicting governance files and writes merge proposals under:

```text
docs/fuckia/merge-proposals/
```

It must not modify product code.

## Verify Basic Installation

Run:

```bash
cd "$target_dir"
test -f AGENTS.md
test -f CLAUDE.md
test -f fuckia.config.yaml
test -f .github/PULL_REQUEST_TEMPLATE.md
test -f .github/workflows/collab-contract.yml
test -f .github/workflows/generated-skills.yml
test -f .github/workflows/pr-scope.yml
test -f docs/fuckia/README.md
test -f docs/fuckia/end-of-work-checkpoint.md
test -f .agents/skills/source-of-truth-gate/SKILL.md
test -f .claude/skills/source-of-truth-gate/SKILL.md
test -f .agents/skills/evidence-language-guard/SKILL.md
test -f .claude/skills/evidence-language-guard/SKILL.md
grep -R "GENERATED FILE - DO NOT EDIT DIRECTLY" .agents/skills .claude/skills >/dev/null
```

If any command fails, report the failing command and stop.

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
