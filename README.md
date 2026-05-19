# Fuckia

Claude and Codex can break a project when they work from chat memory, skip review, create duplicate systems, or declare Done without testing the real workflow.

Fuckia is a guardrail kit for that problem.

It installs shared rules, skills, GitHub checks, and Linear templates so Claude and Codex follow the same workflow before they touch code.

## Start

Open Claude Code or Codex inside the project you want to protect.

Paste this:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

That is the intended install flow.

The human gives one sentence. The agent reads `INSTALL.md` and handles the technical steps.

## What Fuckia Adds

- One shared rule system for Claude and Codex.
- Agent instructions: `AGENTS.md` and `CLAUDE.md`.
- Generated Claude and Codex skills from the same source.
- GitHub PR templates and CI checks.
- Linear templates for spec, plan, review, implementation, and verification.
- A rule that risky work needs independent review.
- A rule that Done requires real workflow verification.

## Safety Rule

Installation starts with audit only.

The agent must show the exact files it wants to create or merge before writing anything.

Fuckia installation must not modify product code.

## Current State

Working now:

- `doctor`
- `init --dry-run`
- `migrate --dry-run`
- no-write tests
- agent install file: `INSTALL.md`

Next build steps:

- real write-mode installer;
- generated skill outputs;
- GitHub automation;
- Linear automation;
- strict CI gates.

## For Maintainers

```bash
npm install
npm test
npm run build
node dist/cli.js doctor --self
```

More detail starts in `vibe-coding/README.md`.
