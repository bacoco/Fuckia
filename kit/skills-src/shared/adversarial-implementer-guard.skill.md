---
name: adversarial-implementer-guard
description: Use before finalizing specs, plans, implementation prompts, architecture reviews, UX critiques, handoff docs, code reviews, install/migration instructions, or after substantial code changes. Forces ambiguity removal, progressive disclosure across docs, specs, plans, code, APIs, prompts, tests, reviews, and verification, plus regression proof from a low-context implementer perspective.
targets:
  - claude
  - codex
constitution:
  - progressive-disclosure-before-detail
  - evidence-before-claim
  - source-of-truth-before-memory
  - preserve-working-systems
  - separated-authority
  - real-verification-before-done
---

# Adversarial Implementer Guard

Use this skill before finalizing work that another human, Claude, Codex, or third reviewer will execute, and after substantial code changes before polish or "done".

Assume the next implementer is low-context, literal, rushed, and able to satisfy the words while damaging the product.

A substantial code change is one that touches more than 3 files, changes a public route or API contract, introduces a store/pipeline/state machine, or modifies behavior other modules depend on.

## Known/Unknown Pass

Classify the handoff or diff before adding instructions:

- **Known knowns:** explicit requirements, existing behavior, named files, routes, callbacks, contracts, tests, constraints, and sources already covered.
- **Known unknowns:** decisions still required before implementation; convert them into phase gates, required decisions, or explicit deferrals.
- **Unknown knowns:** assumptions hidden by "already done", "simple", "wire", "support", "MVP", "later", or "for now"; convert them into hard constraints or acceptance criteria.
- **Unknown unknowns:** failure modes the implementer is unlikely to check; convert them into regression proof, non-goals, monitoring/logging, or follow-up.

Bias toward uncertainty. If an item could fit multiple quadrants, classify it as unknown rather than known.

## Preserve Existing Behavior

List the behavior that must remain true:

- user-visible workflows;
- files and directories that must stay authoritative;
- routes, stores, hooks, queues, pipelines, and state machines that must not be replaced;
- external contracts such as GitHub checks, Linear issue states, APIs, or generated skill metadata;
- verification commands and real user paths that prove the old behavior still works.

## Enforce Progressive Disclosure Everywhere

Progressive disclosure applies to implementation, not only documentation.

- Docs/specs/plans: use an index or top-level plan that points to phase, decision, domain, or implementation files when the topic is broad.
- Code: expose a narrow entry point first, then split orchestration, domain logic, IO, state, persistence, rendering, prompt construction, and validation by responsibility.
- New code files should normally stay under roughly 200 lines; split or justify larger files, and do not hide unrelated responsibilities in a large `utils`, `service`, `manager`, or `handler`.
- Runtime flows: fetch or compute summaries/lists first, then expand details only when the real path needs them. Do not bulk-load full catalogs, doctrines, corpora, graph payloads, fixture sets, or prompt context by default.
- APIs/search/discovery: expose summary/list endpoints first and detail endpoints only on explicit demand.
- UI work: implement the smallest real workflow surface first, then reveal advanced controls or secondary panels only after the main path works.
- Prompts/agents: select targeted domains or capabilities before injecting detailed doctrine.
- Tests/verification: start with narrow contract checks and the shortest real workflow, then broaden only according to risk. State what was checked and what remains unverified.
- Reviews: read root context first, then expand only into files that evidence a risk.

A solution that works by dumping all knowledge, all domains, all tests, all UI, or all doctrine into one large artifact is a failed implementation unless explicitly requested.

## Red-Team The Wording

Flag dangerous phrases:

- refactor;
- simplify;
- wire;
- orchestrate;
- reuse;
- clean up;
- improve;
- support;
- migrate;
- install;
- generate.

For each phrase, state the damaging interpretation an implementer could choose while still claiming compliance.

## Convert Ambiguity Into Constraints

Replace vague wording with hard requirements:

- `MUST preserve ...`
- `MUST call/use ...`
- `MUST NOT replace ...`
- `MUST NOT create a parallel engine/store/router/hook/workflow/pipeline ...`
- `MUST NOT remove working code unless the replacement is wired and verified end-to-end ...`
- `MUST stop and ask when the source of truth is missing ...`

## Add Non-Goals

State what is outside the task.

Include forbidden changes for:

- product code;
- working routes;
- stores;
- hooks;
- workflows;
- generated files;
- agent rule files;
- docs cleanup unrelated to the task.

## Require Regression Proof

Acceptance criteria must prove the real workflow, not only isolated components.

Require:

- the public or product entry path;
- command output or CI evidence;
- review receipt;
- verification receipt;
- archived evidence for the next agent.

## Post-Code Check

When code has changed, inspect the actual diff and answer:

- Did the change expose a Known/Unknown mismatch?
- Did it create a parallel engine, pipeline, store, router, hook, prompt path, state machine, persistence contract, or UI workflow instead of extending the existing one?
- Did any existing public route, callback, endpoint, storage key, or runtime flow stop being used?
- Did the code preserve progressive disclosure by keeping entry points thin, responsibilities split, and summary/detail expansion explicit?
- Do tests or verification exercise the real product path instead of isolated helper existence?
- Are skipped or blocked verification steps explicitly reported?

## Review Mode

When reviewing a PR, actively look for:

- duplicate engines, stores, queues, routers, or state machines;
- callbacks kept in signatures but ignored;
- old behavior hidden behind renamed props or unused branches;
- tests that assert existence without exercising the real workflow;
- skipped tests that hide regressions;
- implementation that passes local checks while bypassing the product path.
- over-broad files or prompts that load whole catalogs, doctrines, folders, test corpora, or UI surfaces instead of targeted summaries and details;
- new files exceeding roughly 200 lines without a split or explicit justification.

## Output

Add a section named `Adversarial implementer pass` with:

- known knowns;
- known unknowns;
- unknown knowns;
- unknown unknowns;
- bad implementation path;
- guardrail added;
- existing behavior that must be preserved;
- forbidden implementation shortcuts;
- regression proof required.
