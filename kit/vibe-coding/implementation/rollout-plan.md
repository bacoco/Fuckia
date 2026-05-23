---
type: plan
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: rollout-plan
owner: human
source_of_truth: true
---

# Rollout Plan

## Phase 0 - Research and decisions

Developer must verify:

- current Linear Project Documents, issue templates, custom fields, API, and GitHub integration behavior;
- current Claude skill format and validation constraints;
- current Codex skill format and validation constraints;
- available GitHub Actions and AI reviewer integrations;
- how to enforce checks without blocking emergency manual work.

Output: short implementation decision note with links to official docs.

The note must also classify the eight failure classes in `kit/vibe-coding/operating-model/failure-catalog-cross-review.md` as:

- prevented by CI;
- prevented by Linear workflow;
- detected by review;
- detected by verification;
- accepted risk with fallback.

## Phase 1 - Template repository

Build the reusable repo/template with:

- neutral shared skill source;
- Claude/Codex generators;
- validators;
- Linear templates;
- GitHub PR template and workflows;
- archive snapshot convention;
- doctor command.
- plan-review gate and role separation checks.

Output: demo on a blank repository.

## Phase 2 - Pilot on one existing project

Pick one risky existing flow, ideally similar to Harmonia mobile:

- active Linear Project;
- one active spec document in Linear;
- one issue with file locks and destructive-change guard;
- one plan-review by the other agent or a human;
- one PR with gates;
- one verification receipt;
- one GitHub archive snapshot.

Output: pilot report with what failed, what was too heavy, and what must become strict.

## Phase 3 - Strict gates for critical paths

Enable strict checks only for:

- architecture-sensitive files;
- mobile shells;
- capture/transcription/synthesis engines;
- routing/auth/storage;
- generated shared skills;
- UI-visible work.

Do not turn on strict checks for the entire organization until the pilot stabilizes.

## Phase 4 - Existing project migration

For each project:

1. inventory current rules, skills, docs, PR templates, workflows;
2. identify active vs archive docs;
3. install Linear-first rules;
4. generate shared skills;
5. add PR gates in warning mode;
6. pilot one issue;
7. switch selected gates to strict.

## Acceptance criteria

- New project can be created from the template.
- Existing project can be migrated without deleting old docs.
- Claude and Codex generated shared skills are in sync.
- PR fails if a generated shared skill is edited manually.
- PR fails if forbidden files are touched.
- PR fails if destructive-change guard is exceeded.
- risky implementation is blocked until plan-review is approved.
- self-review is blocked or escalated for risky work.
- PR cannot be marked ready for risky UI work without verification receipt.
- Linear issue contains enough context for a low-context agent to start safely.

## PDG pass

- Bad implementation path: "roll out everything everywhere immediately."
- Guardrail added: phased rollout with pilot and warning mode.
- Bad implementation path: "migration means clean old docs now."
- Guardrail added: inventory first, archive later, no deletion without approval.
- Forbidden shortcut: strict gates across all repos before one successful pilot.
- Regression proof required: blank repo demo and one existing project pilot.
