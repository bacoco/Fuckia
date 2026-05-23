# Fuckia

**Stop AI coding agents from breaking the real product contract.**

Fuckia is a lightweight governance kit for Codex-only, Claude-only, or Claude+Codex repositories.

Its most important piece is the **Adversarial Implementer Guard with Progressive Disclosure**: every spec, plan, handoff, review, and substantial code change must preserve existing behavior, remove ambiguous wording, avoid parallel implementations, and expose complexity progressively in docs, code, APIs, prompts, tests, reviews, and verification.

The Claude/Codex collaboration layer is optional. The guardrails are useful even with one agent.

## The Problem

Claude and Codex do not automatically share a cockpit.

Without a control layer, agents can:

- work from stale chat context;
- create a second implementation beside the real one;
- delete working code during a vague refactor;
- pass isolated tests while the real product path is broken;
- review their own risky work;
- mark Done without end-to-end verification;
- leave the next agent without a reliable source of truth.

That is how multi-agent coding turns into days of cleanup.

## Use Fuckia When

- you want adversarial review and progressive disclosure as a default engineering discipline;
- you use Codex only;
- you use Claude Code only;
- you switch between Claude and Codex on the same repository;
- you run parallel AI coding sessions;
- agents keep creating duplicate implementations;
- reviews approve words instead of behavior;
- Done gets declared from typecheck or unit tests alone;
- existing working flows must not be broken while agents move fast.

## What Fuckia Changes

Fuckia turns AI coding from chat-driven improvisation into a governed workflow.

Before an agent touches code, Fuckia makes it answer:

- What is the source of truth?
- What files are allowed?
- What files are forbidden?
- Who reviewed the plan?
- Which existing workflow must keep working?
- Which real user path proves Done?
- What evidence is archived for the next agent?

The goal is simple: an agent can move fast, but it cannot silently drift away from the product contract.

## Adversarial Progressive Disclosure

Fuckia treats progressive disclosure as a correctness rule, not a style preference.

The `adversarial-implementer-guard` requires agents to:

- state known knowns, known unknowns, hidden assumptions, and plausible failure modes;
- preserve existing routes, stores, callbacks, pipelines, workflows, generated files, and verification paths;
- convert vague verbs like "refactor", "simplify", "wire", "reuse", and "clean up" into `MUST` / `MUST NOT` constraints;
- keep code entry points thin and split orchestration, domain logic, IO, state, persistence, rendering, prompt construction, and validation by responsibility;
- use summary/list flows before detail flows in APIs, prompts, retrieval, and runtime context;
- verify the real workflow before calling work done.

This guard is often more valuable than the Claude+Codex pairing itself. Multi-agent collaboration is one use case; adversarial progressive disclosure is the core discipline.

## Agent Modes

Fuckia supports three installation modes:

- `codex-only`: installs `AGENTS.md` and `.agents/skills/...`
- `claude-only`: installs `CLAUDE.md` and `.claude/skills/...`
- `dual-agent`: installs both surfaces for Claude+Codex collaboration

Generated skill previews stay available for both Claude and Codex inside this repository, but target repositories only receive the selected agent surface.

## The Outcome

Every risky change gets:

- one source of truth;
- explicit allowed and forbidden files;
- independent plan review;
- PR scope checks;
- no self-review for risky work;
- real workflow verification;
- an archived receipt for the next agent.

## What You Get

Fuckia installs a project governance layer:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude Code;
- shared Claude and Codex skills generated from one source;
- GitHub PR templates and CI checks;
- Linear templates for spec, plan, plan-review, implementation, review, and verification;
- destructive-change guards;
- self-review blocks for risky work;
- verification receipts;
- archived snapshots for future agents.

It does not replace GitHub, Linear, Claude, or Codex. It connects them into one workflow.

## Install Flow

Open Claude Code or Codex inside the repository you want to protect.

Paste this:

```text
Install Fuckia here. Use the agent mode that matches this repo; ask if ambiguous. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent reads `INSTALL.md`, audits the repository, and reports exactly what it wants to create or merge.

Nothing is written until you approve the exact file list.

Normal installation does not require Node.js or npm.

Explicit mode prompts also work:

```text
Install Fuckia here for Codex only.
Install Fuckia here for Claude only.
Install Fuckia here for Claude and Codex.
```

## Safety Contract

Fuckia installation starts with audit only.

It must not:

- modify product code;
- delete existing agent rules;
- create a parallel engine, store, router, hook, workflow, or pipeline;
- mark Done from typecheck or unit tests alone;
- let an agent self-review risky implementation.

## Current Status

Working now:

- agent-first install through `INSTALL.md`;
- Codex-only, Claude-only, and dual-agent installation modes;
- install and migration audit;
- write-mode installer;
- generated Claude and Codex skills;
- GitHub workflow templates and remote setup checks;
- Linear issue-chain automation;
- strict local gates.

## For Maintainers

```bash
npm install
npm test
npm run test:e2e
node dist/cli.js doctor --self --strict
```

Technical detail starts in `kit/vibe-coding/README.md`.
