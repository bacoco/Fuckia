# Developer Prompt

You must implement Fuckia as a reusable, installable governance kit for coordinating Claude Code, Codex, Linear, and GitHub across new projects and existing projects.

Read `vibe-coding/constitution/agent-constitution.md` first. These laws are the root contract for the system. They are not a developer checklist.
Then read `vibe-coding/constitution/agent-law-propagation.md`. Universal laws, role addenda, and validators must all exist.

Read every file in this directory:

```text
vibe-coding/
```

## Objective

- The 6 laws in `vibe-coding/constitution/agent-constitution.md` must govern every skill, template, validator, workflow, review, and receipt.
- Every agent must receive the universal laws plus its role addendum, with no Claude/Codex divergence.
- Linear must be the active cockpit: active spec, issue contracts, statuses, decisions, verification receipts.
- GitHub must remain the technical proof layer: branches, PRs, CI, reviews, merge history, versioned archive.
- Claude and Codex must follow the same rules.
- Shared skills must be written once in a neutral source, then generated into Claude and Codex formats.
- Planner, plan reviewer, implementer, code reviewer, and verifier roles must be separated for risky work.
- Agents must never declare Done only because unit tests or typecheck pass.
- The system must cover the 8 failure classes in `vibe-coding/operating-model/failure-catalog-cross-review.md`.
- The system must deliver the initial skill set and additional mitigations in `vibe-coding/skills/initial-skills-and-risk-map.md`.
- The system must enforce `vibe-coding/constitution/evidence-language-guard.md`: no uncertain causality without evidence.
- Installation must be simple: Claude plugin path, Codex install path, and universal one-command CLI.

## Expected Deliverables

1. One-command install for a new project: `npx fuckia init`.
2. Audit-first migration for an existing project: `npx fuckia migrate --dry-run`, `--plan`, then `--apply`.
3. Linear templates: Project, issue contract, statuses, verification receipt.
   - Include issue types or templates: spec, plan, plan-review, implement, code-review, verify.
   - `plan-review` must block `implement` for risky work.
4. GitHub templates: PR template, workflows/checks, branch protection guide.
5. The skill system:
   - shared;
   - claude-only;
   - codex-only;
   - v1 skills from `vibe-coding/skills/initial-skills-and-risk-map.md`;
   - generators;
   - validators;
   - hash checks for generated files.
6. Minimum checks:
   - constitution references;
   - agent law coverage;
   - role addenda;
   - mandatory Linear ID;
   - allowed/forbidden files;
   - destructive-change guard;
   - plan-review approval;
   - planner/reviewer separation;
   - implementer/code-reviewer separation;
   - generated skills sync;
   - evidence language guard;
   - verification receipt;
   - archive snapshot.
7. Warning mode followed by strict mode.
8. A demo on a blank repo.
9. A pilot on an existing project.
10. Claude plugin distribution plan.
11. Codex installation path.

## Non-Negotiable Constraints

- Do not treat `vibe-coding/constitution/agent-constitution.md` as passive documentation.
- Every law must map to skills, templates, checks, gates, or receipts.
- Do not replace validators with the constitution. The system needs both.
- Do not create separate divergent laws per agent. Role addenda may only strengthen the universal laws.
- Do not invent Linear/GitHub/Claude/Codex APIs. Verify official docs and document the choices.
- Do not write two manual versions of shared skills.
- Do not let a Claude-only or Codex-only skill weaken a shared rule.
- Do not give a third model a writing role without a Linear contract, file locks, and GitHub gates.
- Do not write an uncertain cause without evidence. Use `Unknown`, ask a question, or verify.
- Do not make Linear a passive Markdown archive. Linear is active.
- Do not make GitHub a passive duplicate. GitHub is proof and versioned archive.
- Do not allow an agent to replace an existing engine, shell, route, hook, store, or pipeline without an explicit Linear contract.
- Do not allow parallel subagents on the same files.
- Do not allow an agent to approve its own plan on risky work.
- Do not allow an agent to be the sole reviewer of its own code on risky work.
- Do not auto-merge from typecheck or unit tests.
- Do not migrate every project to strict mode before a pilot.
- Do not make users understand the full repository before installing.
- Do not modify product code during existing-project migration unless the user explicitly authorizes it.

## Required Decision Note Before Coding

```text
Verified capabilities:
Technical choices:
Risks:
Fallbacks:
Pilot plan:
```

## Definition Of Done For The Repo/Template

- Constitution referenced by README, generated skills, templates, validators, and workflows.
- Universal law packet and role addenda generated into Claude/Codex skills with hashes.
- Claude/Codex generation proven.
- Invalid skill validation proven.
- Test PR fails on forbidden file.
- Test PR fails on destructive-change guard.
- Test PR fails on manually edited generated skill.
- Doctor detects unloaded skill, duplicate, shadowing, invalid frontmatter, stale hash, AGENTS/CLAUDE divergence.
- Check blocks unsupported causal language in plans, reviews, receipts, and handoffs.
- Implement issue blocked until plan-review is approved.
- Self-review attempt blocked or escalated.
- Pilot Linear issue with verification receipt.
- GitHub archive of a Linear snapshot.
- Short docs for installing on a new project and migrating an existing project.
- `existing-project-governance-auditor` skill implemented for safe migration audits.

## Important Context

This kit was born from an incident where an agent interpreted an ambiguous plan as permission to create a parallel engine, delete a large part of a working shell, pass isolated tests, and declare success without verifying the real product workflow.

The kit must not only prevent that exact case. It must prevent general Claude/Codex failure classes: ambiguous specs, divergent implementation, self-review, invisible coordination, tooling asymmetry, insufficient verification, contradictory memory, and excessive review loops.

## Additional Problems To Handle Explicitly

- unloaded, truncated, shadowed, or duplicate skills;
- split-brain between Linear, GitHub, Markdown archive, and agent memory;
- review theater: comments without blocking decisions;
- prompt injection through issue, PR, commit, screenshot, or branch-modified instruction file;
- fork PRs without secrets;
- stale worktrees and stale branches;
- subagents or cloud tasks writing outside visible scope;
- emergency bypass becoming normal operation;
- verification on the wrong environment;
- data leakage in archives;
- infinite Claude/Codex fix/review loops;
- cautious but unsupported language turning a hypothesis into fact.
