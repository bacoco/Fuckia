---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: initial-skills-and-risk-map
owner: human
source_of_truth: true
---

# Initial Skills And Risk Map

This file defines the first skills the collaboration kit must ship with, and the additional failure modes it must handle when Claude Code, Codex, Linear, GitHub, and optional third reviewers work together.

## Core decision

Use symmetric governance and asymmetric mechanics:

- shared skills define the workflow contract and must be generated for both Claude and Codex;
- Claude-only and Codex-only skills may adapt tool-specific mechanics, but must not weaken the shared rules;
- a third model may be used for read-only review, synthesis, or challenge, but must not write code unless it has the same Linear contract, file locks, and GitHub gates.

Budget is not the constraint. Coordination, authority, stale context, and verification are the constraints.

## Initial shared skills to create

These skills are the minimum useful v1. The developer may rename or split them, but the responsibilities must remain covered and generated for both Claude and Codex.

1. `linear-contract-intake`
   - reads the Linear issue and active project document before any plan or code;
   - extracts objective, authorized actor, allowed files, forbidden files, delete budget, target environment, existing pipeline, required verification, and expected PR;
   - refuses to proceed if risky work lacks a complete contract or approved bypass.

2. `plan-author-contract`
   - writes implementation plans from a Linear contract;
   - must name existing files, callbacks, routes, stores, hooks, queues, engines, and pipelines to preserve;
   - must include non-goals, forbidden implementations, delete budget, file locks, verification path, and rollback plan.

3. `adversarial-plan-review`
   - reviews plans before implementation;
   - flags dangerous verbs such as `refactor`, `simplify`, `wire`, `orchestrate`, `reuse`, `support`, `clean up`, `replace`, and `remove`;
   - outputs exactly `approve`, `request_changes`, or `block`;
   - must be run by a different agent or a human for risky work.

4. `implementation-preflight`
   - posts the pre-flight receipt before edits;
   - checks current HEAD, branch, stale worktree risk, locks, allowed/forbidden files, delete budget, and verification plan;
   - refuses same-file parallel work unless Linear has a visible human override.

5. `scoped-implementer`
   - implements only the authorized issue scope;
   - must not create a parallel engine, route, shell, hook, store, state machine, queue, or pipeline unless Linear explicitly authorizes replacement;
   - must preserve named callbacks and entry paths unless the contract says otherwise.

6. `github-pr-contract`
   - prepares or reviews the PR body against the Linear contract;
   - validates Linear ID, active document link, plan-review link, allowed/forbidden files, delete budget, preserved pipeline, verification receipt, and archive snapshot;
   - prevents PRs from becoming merge-ready with missing required evidence.

7. `risk-code-review`
   - reviews code for intent drift, not only local bugs;
   - looks for dead underscore props, ignored callbacks, duplicate engines/stores/routes, skipped legacy tests, mocked critical engines, and public route mismatch;
   - must not be the implementer's only review on risky work.

8. `real-workflow-verifier`
   - verifies the product workflow through the real entry route or explicitly approved staging equivalent;
   - requires browser/screenshot/report evidence for UI-visible changes;
   - writes a verification receipt usable in Linear and GitHub.

9. `archive-snapshot-janitor`
   - snapshots final Linear contract, plan-review decision, PR link, commit SHA, verification receipt, and residual risks into GitHub;
   - ensures local Markdown is archive evidence, not a competing active spec;
   - prevents useful handoff artifacts from living only in chat, local sessions, or agent memory.

10. `skill-sync-doctor`
    - validates neutral source, generated Claude output, generated Codex output, hashes, frontmatter, descriptions, and platform-specific adapters;
    - fails if a shared rule exists only in `CLAUDE.md`, only in `AGENTS.md`, or only in one generated skill.

11. `cross-agent-status`
    - summarizes who owns which issue, branch, PR, files, worktree, and verification responsibility;
    - detects duplicate work, stale branches, pending reviews, bypasses, and unresolved plan-review decisions;
    - provides the compact handoff each agent should read before resuming.

12. `incident-escalation-bypass`
    - handles urgent production fixes and blocked automation;
    - requires visible bypass reason, approver, scope, expiration, and follow-up issue;
    - logs bypasses as metrics so emergency mode does not become normal mode.

## Claude-only skills

Claude-only skills should be thin adapters around shared skills.

1. `claude-linear-native-runner`
   - maps Claude Code invocation patterns to `linear-contract-intake`, `implementation-preflight`, and `cross-agent-status`;
   - keeps `CLAUDE.md` as a short entry point, not a second process manual.

2. `claude-plan-reviewer`
   - packages `adversarial-plan-review` for Claude Code review sessions;
   - must produce a Linear-ready decision and not a loose chat opinion.

3. `claude-code-reviewer`
   - packages `risk-code-review` for Claude Code or Claude Code Review;
   - must distinguish advisory comments from required gate failures.

4. `claude-subagent-guard`
   - prevents Claude subagents from writing overlapping files;
   - requires disjoint file ownership and a parent receipt before subagents start.

5. `claude-memory-export`
   - extracts durable decisions from Claude memory/chat into Linear or GitHub archive;
   - must not treat private Claude memory as source of truth.

## Codex-only skills

Codex-only skills should also be thin adapters around shared skills.

1. `codex-linear-native-runner`
   - maps Codex Linear/GitHub tasks to `linear-contract-intake`, `implementation-preflight`, and `cross-agent-status`;
   - keeps `AGENTS.md` as a short entry point.

2. `codex-pr-reviewer`
   - packages `risk-code-review` for Codex review on GitHub;
   - must follow repository `AGENTS.md` review guidance and produce actionable findings.

3. `codex-subagent-guard`
   - prevents Codex subagents from overlapping write scopes;
   - requires each delegated task to have an explicit allowed file set.

4. `codex-action-security`
   - hardens Codex GitHub Action usage;
   - treats PR titles, bodies, comments, commits, screenshots, and repo instruction files from the PR branch as untrusted input;
   - uses least privilege, sandboxing, safe shell quoting, and trusted prompt files.

5. `codex-skill-plugin-packager`
   - packages generated Codex skills into the installable Codex plugin structure when needed;
   - must not fork the shared source.

## Optional third-reviewer templates

Do not start with a third writing agent. Start with third-reviewer templates:

- `third-model-plan-challenge`: read-only plan critique focused on ambiguity, missing constraints, and forbidden shortcuts;
- `third-model-code-challenge`: read-only PR critique focused on regressions and public workflow mismatch;
- `third-model-synthesis`: consolidates Claude/Codex/GitHub review findings into one Linear decision.

The third reviewer must receive a bounded packet: Linear contract, plan, diff, target workflow, known forbidden files, and exact output schema.
It must not receive authority to change files unless converted into a normal implementer issue with locks and gates.

## Additional failure modes and required mitigations

1. Skill non-loading or context truncation
   - Risk: the agent never loads the intended skill or the skill list is shortened.
   - Mitigation: keep `AGENTS.md` and `CLAUDE.md` short but mandatory; make GitHub checks enforce the contract even when a skill is skipped.
     Include explicit skill names in Linear issue templates.

2. Skill shadowing and name collision
   - Risk: local, personal, enterprise, plugin, or nested skills with the same name behave differently.
   - Mitigation: generated skills must include source hash and target; `doctor` must list every discovered skill path and flag duplicate names.

3. Active spec split-brain
   - Risk: Linear, PR body, Markdown archive, and agent memory disagree.
   - Mitigation: Linear is active; GitHub archive is immutable proof; generated reports must state which Linear document and issue were authoritative.

4. Review theater
   - Risk: another agent comments but does not make a blocking decision.
   - Mitigation: plan review and code review need structured outcomes, actor identity, linked issue, and gate mapping.

5. Reviewer capture
   - Risk: the reviewer shares the same flawed assumption as the planner or implementer.
   - Mitigation: use adversarial wording checks, third-model challenge for high-risk rewrites, and human escalation after repeated approve-with-no-findings on risky plans.

6. Infinite fix/review loops
   - Risk: Claude fixes Codex comments, Codex fixes Claude comments, and no one decides.
   - Mitigation: limit automated loops, require synthesis after two review rounds, and move unresolved contradictions to human review.

7. Stale worktree or stale branch
   - Risk: an agent implements against old code while another PR changed the same pipeline.
   - Mitigation: pre-flight records HEAD; CI checks base freshness; merge queue or strict required checks protect critical branches.

8. Hidden parallel implementation
   - Risk: a subagent, cloud task, or GitHub Action writes files outside the visible owner scope.
   - Mitigation: all write tasks need file locks; every PR must pass allowed/forbidden file validation; subagent prompts must include disjoint write scopes.

9. Prompt injection through PR or Linear text
   - Risk: untrusted issue/PR content tells an AI reviewer to ignore rules or leak secrets.
   - Mitigation: trusted system prompts live in repo-owned workflow files; PR/issue content is quoted as data; GitHub Action scripts use safe env quoting and least privilege.

10. Fork PR secret boundary
    - Risk: strict checks need Linear/OpenAI tokens but forked PRs cannot safely receive secrets.
    - Mitigation: run local static checks on forks; require maintainer-triggered privileged checks before merge-ready; keep external fork mode warning-only until trusted.

11. AI identity ambiguity
    - Risk: Claude, Codex, GitHub Actions, and humans appear as indistinguishable actors.
    - Mitigation: every receipt records actor, tool, run URL when available, commit SHA, and whether it was human-approved.

12. Emergency bypass abuse
    - Risk: bypasses become routine and erase the control system.
    - Mitigation: bypasses require reason, approver, expiration, follow-up issue, and dashboard count.

13. Verification environment mismatch
    - Risk: local tests pass but production route, staging auth, mobile viewport, or environment variables differ.
    - Mitigation: verification receipt names target environment, URL, credentials assumption, route, viewport/device when relevant, and evidence path.

14. Archive leakage
    - Risk: Linear snapshots copy private customer data, secrets, or paid model outputs into public GitHub.
    - Mitigation: snapshot exporter must redact configured patterns and support private archive destinations.

15. Bot permission overreach
    - Risk: AI review or action tokens can write when they should only read.
    - Mitigation: separate read-only reviewer jobs from writer jobs; default reviewers to read-only; require explicit implementer issue for writes.

16. Status automation false Done
    - Risk: Linear/GitHub automation moves issues forward on PR events alone.
    - Mitigation: PR automation may move to `PR Open` or `Verification Required`; only verification receipt plus required approvals may move risky work to `Done`.

17. Metrics without action
    - Risk: dashboards show drift but no one reacts.
    - Mitigation: define thresholds that create Linear follow-up issues, such as repeated self-review attempts, missing receipts, stale branches, or generated skill divergence.

18. Excess ceremony for trivial work
    - Risk: agents bypass the system because every typo fix requires full process.
    - Mitigation: define low-risk bypass thresholds, warning mode, and a small-change path that still records Linear ID and PR proof.

## Required v1 packaging

The initial repository/template must include:

- neutral source files for every shared skill;
- generated Claude and Codex skill outputs;
- platform-only adapter skills;
- a `doctor` command that reports active instructions, skill discovery, duplicate skill names, generated hash status,
  Linear connectivity, GitHub connectivity, and strict/warning mode;
- sample Linear issues for low-risk, risky, emergency bypass, and third-reviewer flows;
- test fixtures that intentionally fail for missing counterpart, stale generated skill, bad frontmatter, forbidden file, delete budget, missing plan-review, and missing verification receipt.

## Adversarial implementer pass

- Likely bad interpretation: "same skills" means one identical file copied into Claude and Codex directories.
- Guardrail added: shared governance must come from one neutral source, but platform outputs are generated through adapters.
- Likely bad interpretation: "third model is free, so let it implement too."
- Guardrail added: third model starts as read-only review/synthesis; writing requires a normal Linear implement issue and file locks.
- Likely bad interpretation: "Claude-only/Codex-only skills can customize the rules."
- Guardrail added: platform-only skills may only adapt mechanics and must not weaken shared gates.
- Likely bad interpretation: "review by another AI is enough."
- Guardrail added: risky work requires structured decisions mapped to gates, and human review remains final authority where configured.
- Existing behavior that must be preserved: Linear remains active source of truth, GitHub remains proof/archive, generated shared skills remain single-source, and product entry workflows remain verified end-to-end.
- Forbidden implementation shortcuts: manual duplicate skills, unbounded AI review loops, hidden write agents, reviewer jobs with write tokens, PR-only Done, and bypasses without expiration.
- Regression proof required: demo must show generated Claude/Codex skill parity, duplicate skill detection, strict gate failures, and one risky issue blocked until independent plan-review approval.

## Prompt a donner au dev

Add this to the implementation prompt:

```text
Lis aussi `08-initial-skills-and-risk-map.md`.

Tu dois livrer un set initial de skills, pas seulement une architecture abstraite.
Les skills partages doivent venir d'une source neutre et etre generes pour Claude
et Codex. Les skills Claude-only et Codex-only ne peuvent adapter que la mecanique
de l'outil; ils ne doivent pas affaiblir les regles partagees.

Commence avec les skills v1 listes dans `08-initial-skills-and-risk-map.md`, ou
propose des renommages equivalents en prouvant que toutes les responsabilites
restent couvertes. Ajoute un `doctor` qui detecte les skills non charges,
doublons, divergences de hash, frontmatter invalide, regles presentes seulement
dans AGENTS.md ou CLAUDE.md, et absence de contrepartie Claude/Codex.

Traite aussi les risques supplementaires: skill shadowing, split-brain
Linear/GitHub/Markdown, review theater, prompt injection, fork PR secret boundary,
stale worktrees, hidden subagents, emergency bypass abuse, verification environment
mismatch, archive leakage, and infinite AI review loops.
```
