---
type: study
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: capabilities-decisions-and-open-risks
owner: human
source_of_truth: true
---

# Capabilities, Decisions, And Open Risks

This note continues the study before implementation. It converts the current docs/spec package into technical decisions for the future standalone repository.

## Current verdict

The concept is pertinent, but the enforcement must be pragmatic:

- `00-agent-constitution.md` is the root contract. It governs the rest of the system.
- Linear should be the active cockpit because it has issues, documents, templates, blockers, GitHub integration, GraphQL API, webhooks, and native agent delegation.
- GitHub must be the hard enforcement layer because branch protection, rulesets, status checks, reviews, CI, and immutable history are better suited to blocking merges.
- Claude and Codex should share governance, not necessarily identical runtime mechanics.
- Skills are necessary, but they are not enough. CI and GitHub checks must enforce the contract when a skill is not loaded, ignored, shadowed, or truncated.
- Unlimited model budget helps review depth, but it does not solve authority, stale context, same-file conflicts, false Done, or verification gaps.

## Verified capabilities

### Linear

Useful capabilities:

- Project and issue documents can hold active specs and resources.
- Issue templates can guide creation; form template fields can be required at creation time.
- Issue relations support blocked/blocking links.
- GitHub integration can link PRs and automate issue statuses from PR activity.
- GraphQL API supports reading and updating issues, workflow states, comments, and related metadata.
- Webhooks can emit events for issues, comments, labels, projects, documents, and other resources.
- Linear's own agent guidelines emphasize native platform actions, transparent state, and human responsibility.

Important limits:

- Do not assume Linear templates enforce a complete contract after issue creation.
- Do not assume native Linear blockers prevent an issue status transition in every workflow.
- Do not assume Linear documents are a versioned, immutable archive.
- Treat Linear as the active contract and GitHub as the enforceable proof layer.

### GitHub

Useful capabilities:

- PR templates standardize required content.
- Branch protection and rulesets can require PR reviews, required status checks, conversation resolution, deployments, and merge queues.
- Required status checks can be GitHub Actions checks or commit statuses.
- GitHub can require approval by someone other than the last pusher.
- Push rulesets can restrict file paths and related properties in some repository configurations.

Important limits:

- GitHub branch protection cannot understand Linear intent by itself.
- Required checks must be implemented as deterministic scripts or trusted integrations.
- Fork PRs and untrusted contributors create a secret boundary for Linear/API-backed checks.
- Admin and bypass permissions must be intentionally constrained and logged.

### Claude Code

Useful capabilities:

- Claude skills use `SKILL.md` files with YAML frontmatter and project/user/plugin locations.
- Skills can be invoked directly or loaded when relevant.
- Claude Code GitHub Actions can react to GitHub comments/issues and run Claude with controlled arguments.
- Claude Code Review can review PRs and post findings.

Important limits:

- Claude Code Review is advisory by default; it does not approve or block PRs by itself.
- Review output must be mapped to a GitHub check or Linear decision if it is meant to gate work.
- Claude memory/chat is not a source of truth.

### Codex

Useful capabilities:

- Codex skills use `.agents/skills/<name>/SKILL.md` with required `name` and `description`.
- Codex supports repo-level skills, AGENTS.md instructions, subagents, GitHub review, GitHub Action, and Linear integration.
- Codex GitHub Action can run from GitHub workflows with sandbox and safety settings.
- Codex code review can be requested with `@codex review` or configured automatically.

Important limits:

- Skill lists can be shortened when there are many skills; the selected skill body still loads when invoked.
- Codex reviewers/actions must treat PR-controlled content as untrusted.
- Codex subagents inherit runtime choices; they still need explicit file ownership and gate enforcement.

## Recommended standalone repo shape

Use a standalone repository, not a folder inside an application repo.

Recommended name:

```text
claude-codex-collab-kit
```

Alternative if the goal is broader than two agents:

```text
agent-collab-kit
```

Recommended implementation stack:

- TypeScript/Node CLI, because Linear's official SDK is TypeScript and GitHub Actions examples integrate naturally with Node.
- Plain Markdown/YAML templates for Linear and GitHub artifacts.
- Deterministic validators with no AI dependency for merge gates.
- Optional AI review prompts as repo templates, not hardcoded into shell scripts.

Recommended package commands:

```text
collab-kit init
collab-kit migrate --dry-run
collab-kit generate-skills
collab-kit validate-skills
collab-kit validate-pr-contract
collab-kit validate-pr-scope
collab-kit validate-linear-gates
collab-kit export-linear-snapshot
collab-kit doctor
```

## Skill architecture decision

Use three layers:

1. Neutral shared source
   - single authoring source for governance;
   - contains responsibilities, triggers, required outputs, forbidden shortcuts, and test fixtures;
   - never installed directly into Claude or Codex.

2. Generated platform outputs
   - `.claude/skills/<name>/SKILL.md`;
   - `.agents/skills/<name>/SKILL.md`;
   - includes source hash, generation metadata, target platform, and adapter notes.

3. Platform-only adapters
   - Claude-only and Codex-only skills for invocation mechanics, subagent behavior, GitHub Action behavior, plugins, and local memory export;
   - cannot weaken shared governance.

Minimum v1 skills are defined in `08-initial-skills-and-risk-map.md`.

## Gate architecture decision

Do not rely on AI review as the gate. Use AI review as input to deterministic gates.

Required deterministic checks:

- Generated skills, templates, validators, and workflows reference the constitution.
- PR title/body/branch includes Linear ID.
- PR body includes active Linear document or explicit not-applicable reason.
- Linear issue contract is present and parseable.
- Changed files are within allowed files.
- Forbidden files are untouched.
- Delete budget is not exceeded.
- Generated skills are synced and unmodified.
- Risky work has approved plan-review from a different actor.
- Risky work has code review from a different actor or required human approval.
- UI/product work has verification receipt.
- Archive snapshot exists before merge-ready.
- Required plans, reviews, receipts, and handoffs pass the Evidence Language Guard.

Warning mode should run these checks without blocking. Strict mode should block only after the pilot proves signal quality.

## Linear representation decision

Use Linear descriptions/templates as the canonical contract in v1, not custom fields, until the implementer verifies whether custom fields or workspace features are available in the target account.

Recommended v1 encoding:

- contract sections in issue Markdown;
- labels for risk class and gate mode;
- blocker relations for plan-review -> implement -> verify;
- comments for pre-flight and verification receipts;
- project/issue documents for active specs;
- webhooks or polling for dashboards.

Strict enforcement happens in GitHub CI by reading Linear through API when tokens are available. If tokens are not available, the PR remains warning-only or requires human-maintainer check.

## Third model decision

A third model is useful, but only as a read-only reviewer at first.

Good uses:

- challenge ambiguous plans;
- compare Claude and Codex reviews;
- synthesize contradictions into one decision;
- audit the final PR for regression risk.

Bad initial uses:

- writing code without Linear file locks;
- acting as a silent tie-breaker;
- approving a plan without structured output;
- running in the same branch with unclear ownership.

## Additional risks that still need design

1. Identity and actor mapping
   - Need a stable actor map: human, Claude local, Claude Action, Claude Review, Codex local, Codex cloud, Codex Action, third reviewer.
   - Receipts must record actor and run link when possible.

2. Secret management
   - Linear tokens and model API keys should not be available to untrusted PR contexts.
   - Split checks into static fork-safe checks and trusted maintainer-triggered checks.

3. Prompt injection
   - Treat issue/PR/comment/commit/screenshot text as data.
   - Trusted prompts live in repository-owned workflow files from the base branch.

4. Monorepo scope
   - Nested `AGENTS.md`, `CLAUDE.md`, and skill directories can conflict.
   - `doctor` must show effective instructions and duplicate skill names by path.

5. Generated file policy
   - Generated skills should be committed so agents can use them without generation.
   - CI must fail when they are stale or manually edited.

6. Human override
   - Bypass must be visible, scoped, expiring, and counted.
   - There should be no invisible "just merge it" path for risky work.

7. Cost and velocity
   - Unlimited plan does not mean unlimited loops.
   - After two automated review/fix rounds, require synthesis and human decision.

8. False confidence from tests
   - Typecheck and unit tests are necessary but not sufficient.
   - Real workflow verification must use the product entry route or an approved staging equivalent.

9. Unsupported uncertainty language
   - Cautious wording can transform an unverified idea into an accepted fact.
   - Enforce `11-evidence-language-guard.md` through skills, templates, validators, and PR checks.
   - Missing evidence must produce `Unknown`, a direct question, or a verification step before action.

## What is not settled yet

- Exact Linear API queries and mutations for documents, issue relations, labels, comments, and workflow transitions.
- Whether the target Linear workspace has required form templates, custom fields, agent delegation, and webhooks enabled.
- Whether GitHub rulesets or classic branch protection should be the default for target repos.
- Whether the first package should publish as a GitHub template repo, npm package, Codex plugin, or all three.
- How much of the dashboard should be a generated Markdown report versus a small web UI.

## Recommended next study step

Before writing the repo, create `10-implementation-blueprint.md` with:

- exact CLI command structure;
- file tree for the standalone repo;
- neutral skill source schema;
- generated Claude/Codex output examples;
- GitHub workflow names and check responsibilities;
- Linear template bodies;
- warning/strict mode matrix;
- pilot scenario definition.

## Adversarial implementer pass

- Likely bad interpretation: "Linear supports templates, so Linear alone enforces the contract."
- Guardrail added: Linear is active cockpit; GitHub CI remains the merge gate.
- Likely bad interpretation: "AI review exists, so no deterministic validators are needed."
- Guardrail added: AI review is advisory input unless mapped to deterministic GitHub checks.
- Likely bad interpretation: "unlimited budget means unlimited agent loops."
- Guardrail added: automated loops must be bounded and synthesized after two rounds.
- Likely bad interpretation: "same governance means identical files for Claude and Codex."
- Guardrail added: governance is shared through neutral source; mechanics are generated per platform.
- Likely bad interpretation: "uncertain phrasing is acceptable because it avoids overclaiming."
- Guardrail added: unsupported uncertainty is not accepted; agents must verify, ask, or mark `Unknown`.
- Existing behavior that must be preserved: standalone repo boundary, active Linear contract, GitHub proof/archive, single-source generated skills, and real workflow verification.
- Forbidden implementation shortcuts: project-local installation during study, manual duplicated skills, PR-only Done, hidden write agents, fork PR secret exposure, and unlogged bypasses.
- Regression proof required: a demo must show warnings in warning mode, blocking in strict mode, skill parity validation, and one risky implementation blocked until plan-review approval.

## Developer Prompt

```text
Continue from `09-capabilities-decisions-and-open-risks.md`.

Do not implement inside an existing product repo. Create a standalone repo/package.

Use Linear as the active cockpit and GitHub as the enforceable proof layer. Do not rely on AI review as the gate; convert required rules into deterministic GitHub checks.

Before coding, write `10-implementation-blueprint.md` with the CLI shape, file tree, neutral skill schema, generated Claude/Codex examples, GitHub workflow plan, Linear template bodies, warning/strict matrix, and pilot scenario.
```
