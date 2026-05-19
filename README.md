# Fuckia

**Stop Claude and Codex from breaking the same codebase in different ways.**

Fuckia is a control layer for teams that use Claude Code, Codex, GitHub, and Linear on the same project.

It gives AI coding agents one shared operating system: same rules, same review gates, same GitHub checks, same Linear workflow, same verification standard.

Use it when you want multiple agents to work fast without losing the real product contract.

Fuckia also improves from public failure reports: when users hit a new Claude/Codex collaboration failure, the report can become a reviewed pull request that strengthens the rules, skills, templates, or checks.

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
- a short end-of-work checkpoint.

Every accepted public failure report can become:

- a new guardrail;
- a stronger validator;
- a clearer install rule;
- a better Claude/Codex skill;
- a regression fixture.

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
Install Fuckia in this repository. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

The agent reads `INSTALL.md`, audits the repository, and reports exactly what it wants to create or merge.

Nothing is written until you approve the exact file list.

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

- `doctor`;
- `init --dry-run`;
- `init --apply` for conflict-free governance install;
- `migrate --dry-run`;
- `migrate --plan`;
- `migrate --apply` for governance-only existing-project migration;
- `github --dry-run` for read-only GitHub remote readiness audit;
- `github --dry-run --strict` for blocking GitHub remote readiness verification;
- `github --apply --yes` for conservative remote branch protection on unprotected repositories;
- no-write tests;
- agent install entrypoint: `INSTALL.md`;
- public issue templates;
- PR template for governed improvements;
- first shared skill source: `adversarial-implementer-guard`;
- deterministic Claude/Codex skill generator for examples;
- skill drift check: `fuckia generate-skills --check`;
- conflict-free `init --apply` writes Claude and Codex skills into target repositories.

Next:

- remaining shared skill catalog;
- merge-preserving GitHub remote apply for repositories with existing rulesets or branch protection;
- Linear template automation;
- strict CI gates;
- automated issue clustering and improvement proposals.

## For Maintainers

```bash
npm install
npm test
npm run check:skills
npm run generate-skills
npm run build
node dist/cli.js doctor --self
```

Technical detail starts in `vibe-coding/README.md`.
