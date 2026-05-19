# Public Feedback Loop

Fuckia treats real user failures as source material for stronger guardrails.

## Inputs

Public inputs:

- failure reports;
- install problems;
- process improvement proposals;
- pull requests;
- verification gaps;
- reports of confusing documentation.

## Flow

1. User files a structured GitHub issue.
2. Triage labels the issue by failure class.
3. Maintainer or agent maps the issue to a missing guardrail.
4. Improvement proposal names the exact docs, skill, validator, template, or workflow to change.
5. Pull request implements the change.
6. Review checks that the change strengthens Fuckia without weakening existing laws.
7. CI verifies docs, tests, generated files, and evidence language.
8. Merge archives the issue and PR as learning material.

## Improvement Targets

Allowed targets:

- README clarity;
- install flow;
- agent runbooks;
- shared skill sources;
- Claude and Codex generated skills;
- GitHub templates and workflows;
- Linear templates and gates;
- validators;
- fixtures;
- failure catalog;
- verification receipts.

Forbidden targets:

- auto-merge into `main`;
- unreviewed self-modification;
- weakening the constitution;
- hiding failed verification;
- accepting reports without evidence;
- changing product repositories from public issue analysis.

## Public Learning Archive

Each accepted improvement should preserve:

- source issue link;
- failure class;
- changed guardrail;
- tests or checks added;
- residual risk.

This archive lets future agents learn from old failures without relying on chat memory.
