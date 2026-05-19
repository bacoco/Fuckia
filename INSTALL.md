# Install Fuckia

This file is an agent procedure for Claude Code, Codex, or another AI coding agent.

The human is inside the target repository and asked you to install Fuckia.

## Non-Negotiable Contract

- Treat the current working directory as the target repository.
- Do not copy this file into the target repository.
- Do not modify product code.
- Start with audit only.
- Ask before writing files.
- Report exact files before writes.
- Preserve existing `AGENTS.md`, `CLAUDE.md`, skills, workflows, docs, and config.
- If evidence is missing, write `Unknown`, verify, ask the human, or stop.

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

## Build The CLI Engine

Run inside the Fuckia repository:

```bash
cd "$FUCKIA_DIR"
npm install
npm run build
```

If build fails, report the failing command and stop.

## Audit The Target Repository

Return to the target repository:

```bash
cd "$target_dir"
node "$FUCKIA_DIR/dist/cli.js" install --dry-run
node "$FUCKIA_DIR/dist/cli.js" github --dry-run --strict
node "$FUCKIA_DIR/dist/cli.js" linear --dry-run
```

If the repository has no existing governance files, also run:

```bash
node "$FUCKIA_DIR/dist/cli.js" init --dry-run
```

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
node "$FUCKIA_DIR/dist/cli.js" install --apply --yes
```

For an existing project, this command preserves conflicting governance files and writes merge proposals under:

```text
docs/fuckia/merge-proposals/
```

It must not modify product code.

## Verify Local Installation

Run:

```bash
node "$FUCKIA_DIR/dist/cli.js" doctor
node "$FUCKIA_DIR/dist/cli.js" strict --dry-run
```

Do not enable strict mode until the human approves it.

After approval:

```bash
node "$FUCKIA_DIR/dist/cli.js" strict --apply
node "$FUCKIA_DIR/dist/cli.js" strict --dry-run --strict
```

## GitHub Remote Setup

Run this read-only check after the installed `.github` files are committed and pushed to the default branch:

```bash
node "$FUCKIA_DIR/dist/cli.js" github --dry-run --strict
```

Apply remote GitHub protection only after explicit human approval:

```bash
node "$FUCKIA_DIR/dist/cli.js" github --apply --yes
```

GitHub approval rules require a real GitHub reviewer account, team, or GitHub App accepted by branch protection. AI identity alone cannot satisfy GitHub platform review gates.

## Linear Setup

Run this only when `LINEAR_API_KEY` is set and the human gives the team key:

```bash
node "$FUCKIA_DIR/dist/cli.js" linear --dry-run --team <TEAM_KEY>
```

Apply only after explicit human approval:

```bash
node "$FUCKIA_DIR/dist/cli.js" linear --apply --yes --team <TEAM_KEY>
```

This creates the issue chain:

- spec;
- plan;
- plan-review;
- implement;
- code-review;
- verify.

The receipt is written to:

```text
docs/fuckia/archive/linear-issue-chain.json
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
