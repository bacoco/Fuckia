---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: agent-law-propagation
owner: human
source_of_truth: true
---

# Agent Law Propagation

The system uses layered laws.

The constitution is universal. Role-specific rules are addenda. Validators enforce both.

## Layer model

```text
Layer 0 - Agent Constitution
  Universal laws for every agent, skill, workflow, review, and receipt.

Layer 1 - Role Addenda
  Specific rules for planner, plan reviewer, implementer, code reviewer, verifier, and emergency operator.

Layer 2 - Tool Adapters
  Claude-specific and Codex-specific invocation mechanics.

Layer 3 - Deterministic Validators
  GitHub/CLI checks that enforce the laws without relying on agent obedience.
```

Layer 1, 2, and 3 must never weaken Layer 0.

## Universal law packet

Every generated skill and agent profile must include or reference the universal law packet:

```text
Constitution:
- Evidence Before Claim
- Source Of Truth Before Memory
- Preserve Working Systems
- Separated Authority
- Real Verification Before Done
constitution_source: 00-agent-constitution.md
constitution_hash: <sha256>
```

The generated file may summarize the laws only when it also includes the source path and hash.

## Role-specific addenda

### Planner

Additional rules:

- must name existing systems to preserve;
- must mark unknowns instead of resolving them through assumptions;
- must create a plan-review target for risky work;
- must define file locks, delete budget, verification path, and non-goals.

### Plan reviewer

Additional rules:

- must review against the constitution first;
- must output `approve`, `request_changes`, or `block`;
- must reject unresolved hypotheses that authorize implementation;
- must not approve a plan written by the same actor for risky work.

### Implementer

Additional rules:

- must run pre-flight before edits;
- must stay inside allowed files and delete budget;
- must preserve named systems and callbacks;
- must not create parallel pipelines without explicit Linear authorization.

### Code reviewer

Additional rules:

- must review intent drift, not only local code defects;
- must check public entry paths and existing workflow preservation;
- must flag tests that mock away the real pipeline;
- must not be the implementer's only reviewer on risky work.

### Verifier

Additional rules:

- must verify the real workflow and named environment;
- must produce a receipt with evidence and residual risks;
- must not mark Done from typecheck or unit tests alone;
- must mark verification gaps as blocked.

### Emergency operator

Additional rules:

- must record bypass reason, approver, scope, expiration, and follow-up issue;
- must not normalize bypasses;
- must preserve auditability even during urgent work.

## Claude and Codex default rule files

`CLAUDE.md` and `AGENTS.md` must both include a short constitution entry:

```text
Before any plan, edit, review, or verification, follow `00-agent-constitution.md`.
If evidence is missing, use `Unknown`, ask a question, verify, or stop.
Do not weaken these laws with role-specific or tool-specific instructions.
```

The entry files must stay short. Detailed mechanics live in generated skills and templates.

## Generated skill requirements

Every generated shared skill must include:

- constitution source path;
- constitution hash;
- role addendum source path when relevant;
- generated source hash;
- target platform;
- forbidden weakening statement:

```text
This skill may add role/tool mechanics. It must not weaken the constitution.
```

Platform-only skills must include the same statement.

## Validator requirements

The future repo must implement:

```text
validate-constitution
validate-agent-law-coverage
validate-role-addenda
validate-evidence-language
```

Checks:

- every generated skill references the constitution;
- every role skill references the matching role addendum;
- no role addendum contradicts the constitution;
- `AGENTS.md` and `CLAUDE.md` include the constitution entry;
- PR templates and Linear templates include the constitution reference;
- validators fail when a generated skill removes or weakens a law;
- validators fail when a required role output omits the law-derived fields.

## Fixtures to create

Required failing fixtures:

- generated skill missing constitution hash;
- Codex skill includes constitution but Claude skill does not;
- role addendum permits self-review on risky work;
- implementer skill permits parallel pipeline without Linear authorization;
- verifier skill permits Done from unit tests only;
- AGENTS.md contains the laws but CLAUDE.md does not;
- uncertain causal language appears without `Unknown`, question, or verification step.

Required passing fixtures:

- shared skill with constitution hash and role addendum;
- Claude/Codex pair generated from same neutral source;
- role addendum that strengthens but does not weaken the constitution;
- plan-review block caused by unresolved evidence gap.

## Adversarial implementer pass

- Likely bad interpretation: "constitution exists, so validators are redundant."
- Guardrail added: validators are mandatory enforcement for the constitution.
- Likely bad interpretation: "each agent gets its own laws."
- Guardrail added: agents get the same universal laws plus role addenda that can only strengthen them.
- Likely bad interpretation: "tool adapters can simplify the laws for Claude or Codex."
- Guardrail added: adapters can change mechanics only; they cannot weaken law text or enforcement.
- Existing behavior that must be preserved: universal laws apply to every actor, and role-specific rules remain subordinate to them.
- Forbidden implementation shortcuts: constitution only in README, laws copied manually without hashes, per-agent laws that diverge, and validators that only check file existence.
- Regression proof required: fixtures must prove missing, divergent, or weakened laws fail in strict mode.

## Developer Prompt

```text
Add the law propagation model from `12-agent-law-propagation.md`.

Do not choose between universal laws and validator and developer rules. Implement both:
universal constitution for every agent, role-specific addenda for each workflow role,
and deterministic validators that fail missing, divergent, or weakened laws.
```
