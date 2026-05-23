# Fuckia

**Progressive disclosure for AI coding agents.**

Fuckia's main product is the **Adversarial Progressive Disclosure Guard**: a skill for Codex and Claude Code that stops AI agents from turning a change into one giant plan, one giant file, one vague refactor, or one fake verification.

It forces the agent to reveal work in layers:

1. what is known and unknown;
2. what existing behavior must survive;
3. which docs, specs, plans, files, routes, stores, and tests are in scope;
4. the smallest useful implementation step;
5. code split by responsibility instead of dumped into broad files;
6. narrow tests first, then real workflow verification;
7. a clear receipt of what was checked and what still is not proven.

That guard is useful before any Claude/Codex collaboration. You can install only the guard and ignore the rest of Fuckia.

The readable name is **Adversarial Progressive Disclosure Guard**. The stable skill slug remains `adversarial-implementer-guard` so existing installs keep working.

## What It Prevents

AI coding agents often fail by adding too much, too early:

- a spec that hides decisions in a wall of text;
- a plan that says "refactor" without naming what must stay working;
- a code change that creates a parallel pipeline beside the real one;
- a new helper, store, route, or prompt that bypasses the existing product path;
- tests that prove a helper exists but not that the user workflow still works;
- a final answer that says "verified" without showing the real verification path.

Fuckia makes those shortcuts explicit and blocks them before they become regressions.

## Progressive Disclosure Everywhere

Progressive disclosure is not only a documentation rule. Fuckia applies it to the whole agent workflow.

| Surface | What the guard forces |
| --- | --- |
| Docs | Start with a clear index, then link to focused detail files. |
| Specs | Separate known facts, open decisions, non-goals, and acceptance criteria. |
| Plans | Name allowed files, forbidden files, preserved behavior, and verification gates. |
| Code | Keep entry points thin and split orchestration, domain logic, IO, state, prompts, and validation. |
| Files | Avoid broad "utils", "service", or "manager" dumps when a smaller responsibility exists. |
| APIs and prompts | Fetch or inject summaries first, then expand details only when needed. |
| Tests | Start with the smallest contract check, then prove the real workflow. |
| Verification | Report the actual command, route, or user path checked, plus what remains unverified. |

The point is simple: the agent must earn the next layer of detail. It cannot load, rewrite, or claim everything at once.

## The Core Skill

The guard makes the agent run an adversarial pass before important handoffs and after substantial code changes.

It asks:

- What could a rushed implementer misread and still claim they followed?
- Which existing behavior, callback, route, store, pipeline, workflow, or generated file must be preserved?
- Did this change create a parallel implementation instead of extending the real one?
- Are vague words like "refactor", "simplify", "wire", "reuse", or "clean up" constrained by `MUST` and `MUST NOT` language?
- Do tests and verification exercise the real product entry path?

Then it turns ambiguity into constraints:

- `MUST preserve ...`
- `MUST call/use ...`
- `MUST NOT replace ...`
- `MUST NOT create a parallel engine/pipeline/store/router ...`
- `MUST NOT remove working code unless the replacement is wired and verified end-to-end ...`

## Optional: Claude + Codex Collaboration

Full Fuckia adds a collaboration layer around the guard for teams that use Codex, Claude Code, or both.

It can install:

- `AGENTS.md` for Codex;
- `CLAUDE.md` for Claude Code;
- generated Claude and Codex skills from shared sources;
- GitHub pull request templates and CI contract checks;
- Linear templates for spec, plan, review, implementation, and verification;
- destructive-change and PR-scope guards;
- archived receipts for future agents.

This is useful when Claude and Codex work on the same repository, or when one agent writes and another reviews. But it is optional. The progressive disclosure guard is the first product.

## Install Only The Guard

Use this when you want the progressive disclosure discipline without GitHub workflows, Linear templates, or dual-agent coordination.

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

## Install Full Fuckia

Use this when you want the full governance kit for Codex-only, Claude-only, or Claude+Codex repositories.

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

## Single-Agent Validation

Fuckia never lets an AI present its own self-check as independent review.

If there is no second AI reviewer, the agent gives the human a short validation card with the real workflow, expected result, files to inspect, and risk being accepted. The human closes validation with:

```text
Approved after human validation.
```

That keeps single-agent work simple without pretending self-review is independent verification.

## Current Status

Working now:

- guard-only install for the Adversarial Progressive Disclosure Guard;
- Codex-only, Claude-only, and dual-agent installation modes;
- agent-first install through `INSTALL.md`;
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
