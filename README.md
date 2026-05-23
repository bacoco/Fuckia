# Fuckia

**AI coding agents move fast. Fuckia keeps them inside the product contract.**

Fuckia is a governance kit for teams using Codex, Claude Code, or both. Its core product is the **Adversarial Progressive Disclosure Guard**: a skill that forces an AI agent to preserve working behavior, remove ambiguity, avoid parallel implementations, and verify the real workflow before calling work done.

The Claude/Codex collaboration layer is optional. The guard is useful even when you have only one agent.

The readable name is **Adversarial Progressive Disclosure Guard**. The stable skill slug remains `adversarial-implementer-guard` so existing installs keep working.

## Install The Part You Need

### 1. Guard Only

Use this when you want the core discipline without GitHub workflows, Linear templates, or dual-agent coordination.

Codex prompt:

```text
Install only Fuckia's Adversarial Progressive Disclosure Guard here for Codex. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md`, start with audit only, and ask before writing files.
```

Claude Code prompt:

```text
Install only Fuckia's Adversarial Progressive Disclosure Guard here for Claude. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md`, start with audit only, and ask before writing files.
```

Guard-only writes only the selected skill file:

- Codex: `.agents/skills/adversarial-implementer-guard/SKILL.md`
- Claude Code: `.claude/skills/adversarial-implementer-guard/SKILL.md`
- Dual agent: both skill files

It does not install `AGENTS.md`, `CLAUDE.md`, GitHub workflows, Linear templates, `docs/fuckia`, or `fuckia.config.yaml`.

### 2. Full Fuckia

Use this when you want the complete governance layer for Codex-only, Claude-only, or Claude+Codex repositories.

Default prompt:

```text
Install Fuckia here. Use the agent mode that matches this repo; ask if ambiguous. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

Explicit prompts:

```text
Install Fuckia here for Codex only.
Install Fuckia here for Claude only.
Install Fuckia here for Claude and Codex.
```

Normal installation does not require Node.js or npm. The agent reads `INSTALL.md`, audits first, reports the exact files it wants to create or preserve, and waits for approval before writing.

## Why This Exists

Claude and Codex do not automatically share a source of truth. Without a control layer, AI agents can:

- work from stale chat context;
- create a second implementation beside the real one;
- delete working code during a vague refactor;
- pass isolated tests while the real product path is broken;
- rename callbacks or props until old flows silently stop firing;
- review their own risky work as if it were independent validation;
- mark Done without proving the user workflow still works.

Fuckia prevents the common failure mode: the agent followed the words, but broke the product.

## The Guard

The Adversarial Progressive Disclosure Guard treats progressive disclosure as a correctness rule, not a writing style.

It applies to:

- docs, specs, plans, prompts, reviews, and handoffs;
- code structure, APIs, stores, routes, callbacks, pipelines, and persistence;
- tests, verification, regression checks, and final reporting.

It makes the agent state:

- what behavior already works and must be preserved;
- what files, routes, callbacks, stores, and contracts are in scope;
- what must not be replaced by a parallel implementation;
- what vague words such as "refactor", "simplify", "wire", "reuse", or "clean up" could let a bad implementer break;
- what real workflow proves the change is done.

Then it turns the answers into hard constraints:

- `MUST preserve ...`
- `MUST call/use ...`
- `MUST NOT replace ...`
- `MUST NOT create a parallel engine/pipeline/store/router ...`
- `MUST NOT remove working code unless the replacement is wired and verified end-to-end ...`

This is often more important than the Claude+Codex pairing itself. Multi-agent collaboration is one use case. Adversarial progressive disclosure is the core discipline.

## Full Fuckia

Full Fuckia adds the collaboration and repository layer around the guard:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude Code;
- generated Claude and Codex skills from shared sources;
- GitHub pull request templates and CI contract checks;
- Linear templates for spec, plan, plan review, implementation, code review, and verification;
- destructive-change and PR-scope guards;
- archived receipts for future agents;
- install modes for `codex-only`, `claude-only`, and `dual-agent`.

It does not replace GitHub, Linear, Claude, or Codex. It gives them one operating contract.

## Agent Modes

Fuckia installs only the agent surface you need:

- `codex-only`: `AGENTS.md` and `.agents/skills/...`
- `claude-only`: `CLAUDE.md` and `.claude/skills/...`
- `dual-agent`: both surfaces for Claude+Codex collaboration

If existing repo markers make the mode obvious, the installer uses that mode. If both marker families exist or neither exists, the agent asks:

```text
Should I install Fuckia for Codex only, Claude only, or both?
```

Missing Claude or Codex credentials do not decide the mode by themselves. The human chooses the intended operating model.

## Single-Agent Validation

Fuckia never lets an AI present its own self-check as independent review.

If there is no second AI reviewer, the agent must give the human a short validation card with the real workflow, the expected result, and the files to inspect. The human closes the validation with:

```text
Approved after human validation.
```

That keeps the workflow simple without pretending that self-review is independent verification.

## Current Status

Working now:

- agent-first install through `INSTALL.md`;
- guard-only install for the Adversarial Progressive Disclosure Guard;
- Codex-only, Claude-only, and dual-agent installation modes;
- install and migration audit;
- write-mode installer;
- generated Claude and Codex skills;
- GitHub workflow templates and remote setup checks;
- Linear issue-chain automation;
- strict local gates.

Technical detail starts in `kit/vibe-coding/README.md`.

## Maintainers

```bash
npm install
npm test
npm run test:e2e
node dist/cli.js doctor --self --strict
```
