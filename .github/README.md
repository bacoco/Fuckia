# Fuckia

**Make Claude and Codex work on the same repo without destroying the product path.**

Fuckia installs collaboration guardrails for projects that use Claude Code, Codex, GitHub, and Linear.

It gives every AI agent the same rules, the same generated skills, the same PR checks, and the same definition of Done.

## What It Prevents

- A second implementation beside the real one.
- Working code deleted during vague cleanup.
- Isolated tests passing while the product workflow is broken.
- An AI validating its own risky work.
- GitHub approval rules that trap a one-account repository.
- Handoffs that leave the next agent without facts.

## Install With One Prompt

Open Claude Code or Codex inside the repository you want to protect.

Paste:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent must audit first, list the exact files it wants to create or merge, and stop before writing.

No product code is modified by the install flow.

## Command Line

```bash
npx --yes github:bacoco/Fuckia install --dry-run
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

- `AGENTS.md` for Codex.
- `CLAUDE.md` for Claude Code.
- Shared Claude and Codex skills generated from one neutral source.
- PR templates with AI identity, plan review, real verification, and adversarial checks.
- GitHub Actions for collaboration-contract checks.
- Linear templates for spec, plan, plan-review, implementation, code-review, and verification.
- Receipts under `docs/fuckia/` so the next agent knows what happened.

## Core Rule

```text
Author AI != Validator AI
```

GitHub account identity is transport. AI identity is the review contract. GitHub mergeability is a separate platform gate.

## More

Start with [`INSTALL.md`](../INSTALL.md).
