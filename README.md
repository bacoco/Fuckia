# Fuckia

**Stop Claude and Codex from breaking the same codebase in different ways.**

Fuckia is a control layer for teams that use Claude Code, Codex, GitHub, and Linear on the same project.

It gives AI coding agents one shared operating system: same rules, same review gates, same GitHub checks, same Linear workflow, same verification standard.

Use it when you want multiple agents to work fast without losing the real product contract.

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

The goal is simple: Claude and Codex can both work, but neither can silently drift away from the product contract.

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

## Install With Claude Or Codex

Open Claude Code or Codex inside the repository you want to protect.

Paste this:

```text
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent reads the Fuckia install procedure from GitHub, audits the target repository, and reports exactly what it wants to create or merge.

Nothing is written until you approve the exact file list.

## What The Agent Installs

After approval, Fuckia installs:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude Code;
- a minimal `README.md` when the target repository has no README;
- generated Codex skills in `.agents/skills`;
- generated Claude skills in `.claude/skills`;
- GitHub PR template and workflow checks in `.github`;
- Linear issue templates under `docs/fuckia/linear/templates`;
- migration receipts and merge proposals under `docs/fuckia`;
- `fuckia.config.yaml`.

For an existing project, Fuckia preserves existing governance files and writes merge proposals instead of overwriting them.

## Safety Contract

Fuckia installation starts with audit only.

It must not:

- modify product code;
- delete existing agent rules;
- create a parallel engine, store, router, hook, workflow, or pipeline;
- mark Done from typecheck or unit tests alone;
- let an agent self-review risky implementation.

## Advanced CLI

The CLI is the deterministic engine used by the agent. Humans do not need it for the normal install path.

Maintainer commands:

```bash
npm install
npm test
npm run test:e2e
node dist/cli.js doctor --self --strict
```

Direct CLI install is also supported:

```bash
npx --yes github:bacoco/Fuckia install --dry-run
```

Use this direct CLI path only when you want terminal-driven installation without asking Claude or Codex to run the procedure.

## Platform Boundaries

Fuckia installs GitHub workflow files into the target repository. Remote GitHub branch protection requires repository permissions and explicit approval.

Fuckia can create the Linear issue chain when `LINEAR_API_KEY` and a team key are provided. Linear account creation, workspace selection, and permission grants are human-controlled steps.

Technical detail starts in `kit/vibe-coding/README.md`.
