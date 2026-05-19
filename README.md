# Fuckia

**Make Claude and Codex work on the same repo without destroying the product path.**

Fuckia installs a collaboration layer for projects that use Claude Code, Codex, GitHub, and Linear.

It gives every AI agent the same rules, the same skills, the same PR checks, and the same definition of Done.

## The Problem

Claude and Codex do not share memory, authority, or context by default.

Without a control layer, agents can:

- build a second implementation beside the real one;
- delete working code during a vague cleanup;
- pass isolated tests while the real workflow is broken;
- approve their own risky work;
- leave the next agent without a reliable handoff;
- block a mono-account GitHub repo with impossible approval rules.

Fuckia exists to stop that class of failure.

## Install With One Prompt

Open Claude Code or Codex inside the repository you want to protect.

Paste:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent must:

1. audit the target repository;
2. list the exact files it wants to create or merge;
3. stop before writes;
4. continue only after human approval.

No product code is modified by the install flow.

## Command Line Install

Audit first:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

Apply after reviewing the file list:

```bash
npx --yes github:bacoco/Fuckia install --apply --yes
```

GitHub setup:

```bash
npx --yes github:bacoco/Fuckia github --dry-run --strict
npx --yes github:bacoco/Fuckia github --apply --yes
```

Linear setup:

```bash
npx --yes github:bacoco/Fuckia linear --dry-run --team <TEAM_KEY>
npx --yes github:bacoco/Fuckia linear --apply --yes --team <TEAM_KEY>
```

## What Gets Installed

Fuckia adds governance files, not product features:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude Code;
- shared Claude and Codex skills generated from one source;
- PR templates with AI identity, plan review, real verification, and adversarial checks;
- GitHub Actions for collaboration-contract checks;
- Linear templates for spec, plan, plan-review, implementation, code-review, and verification;
- receipts under `docs/fuckia/` so the next agent knows what happened.

## How It Works

Every risky change must answer these questions before it is treated as Done:

- What is the source of truth?
- What files are allowed?
- What files are forbidden?
- Which existing workflow must keep working?
- Who reviewed the plan?
- Which real user path was verified?
- Which AI implemented the change?
- Which AI or human validated it?

Fuckia keeps these answers in PRs, Linear issues, skills, checks, and archive receipts.

## GitHub Protection

Fuckia protects new repositories with required status checks and conversation resolution.

It does not enable required GitHub approving reviews by default. That rule can trap a one-account repository in an impossible self-approval state.

If a repository already requires GitHub approvals, `fuckia github --dry-run` reports that platform gate and asks for an accepted reviewer account, team, or GitHub App.

The process rule still exists:

```text
Author AI != Validator AI
```

GitHub account identity is transport. AI identity is the review contract. GitHub mergeability is a separate platform gate.

## Linear Workflow

Fuckia can create a Linear issue chain:

1. spec;
2. plan;
3. plan-review;
4. implement;
5. code-review;
6. verify.

Linear becomes the active cockpit. GitHub remains the code, PR, CI, and archive system.

## Core Laws

The detailed constitution lives in `vibe-coding/constitution/`.

The short version:

1. One source of truth before work.
2. Small files and clear directories before giant specs.
3. Evidence before claim.
4. Preserve working systems.
5. No parallel engine, route, store, hook, workflow, or pipeline without an explicit contract.
6. The implementing AI does not validate its own risky work.
7. Done means real workflow verified, checks passed, required independent review completed, and evidence recorded.

## Current Capabilities

Implemented now:

- new-project install;
- existing-project migration plan;
- Claude and Codex skill generation;
- GitHub status-check setup;
- GitHub audit for impossible approval gates;
- Linear issue-chain creation;
- strict-mode verification;
- self-checking Fuckia repository.

Next:

- package or plugin publishing;
- richer Linear native template support when the official API supports it;
- public failure-report clustering into improvement PRs.

## Maintainers

```bash
npm install
npm test
npm run check:skills
npm run generate-skills
npm run build
node dist/cli.js doctor --self
```

Technical detail starts in `vibe-coding/README.md`.
