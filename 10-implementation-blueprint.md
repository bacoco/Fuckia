---
type: plan
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: implementation-blueprint
owner: human
source_of_truth: true
---

# Implementation Blueprint

This is the implementation blueprint for the future standalone repository. It is still study/planning, not code.

Implementation starts from `00-agent-constitution.md`. The laws are the root contract. The CLI, skills, templates, validators, GitHub workflows, and Linear workflow must enforce or reflect those laws.

## Repository name and boundary

Default repo name:

```text
claude-codex-collab-kit
```

The repo must be standalone. It must not live under ExcenIA, Harmonia, or any product repository.

## Technology choice

Use TypeScript/Node for v1:

- Linear's SDK and GraphQL ecosystem are TypeScript-friendly.
- GitHub Actions can run Node scripts directly.
- YAML/Markdown parsing is mature.
- The same CLI can run locally and in CI.

No database in v1. Store generated reports as Markdown/JSON artifacts.

## Target repository tree

```text
claude-codex-collab-kit/
  README.md
  00-agent-constitution.md
  package.json
  tsconfig.json
  src/
    cli.ts
    config/
      load-config.ts
      schema.ts
    contracts/
      parse-linear-contract.ts
      parse-pr-contract.ts
      risk-classifier.ts
      actor-identity.ts
    linear/
      client.ts
      fetch-issue.ts
      fetch-document.ts
      post-comment.ts
      export-snapshot.ts
      verify-plan-review.ts
    github/
      diff-files.ts
      parse-pr-body.ts
      check-branch-linear-id.ts
      status-output.ts
    skills/
      neutral-schema.ts
      generate-claude.ts
      generate-codex.ts
      validate-generated.ts
      discover-skills.ts
    validators/
      validate-constitution.ts
      validate-skills.ts
      validate-pr-contract.ts
      validate-pr-scope.ts
      validate-linear-gates.ts
      validate-verification-receipt.ts
      validate-archive-snapshot.ts
      validate-evidence-language.ts
    doctor/
      run-doctor.ts
      detect-instructions.ts
      detect-shadowed-skills.ts
      detect-stale-worktree.ts
    reports/
      render-markdown.ts
      render-json.ts
  skills-src/
    shared/
      linear-contract-intake.yaml
      plan-author-contract.yaml
      adversarial-plan-review.yaml
      implementation-preflight.yaml
      scoped-implementer.yaml
      github-pr-contract.yaml
      risk-code-review.yaml
      real-workflow-verifier.yaml
      archive-snapshot-janitor.yaml
      skill-sync-doctor.yaml
      cross-agent-status.yaml
      incident-escalation-bypass.yaml
      evidence-language-guard.yaml
    claude-only/
      claude-linear-native-runner.yaml
      claude-plan-reviewer.yaml
      claude-code-reviewer.yaml
      claude-subagent-guard.yaml
      claude-memory-export.yaml
    codex-only/
      codex-linear-native-runner.yaml
      codex-pr-reviewer.yaml
      codex-subagent-guard.yaml
      codex-action-security.yaml
      codex-skill-plugin-packager.yaml
  generated/
    claude/
      skills/
    codex/
      skills/
  templates/
    linear/
      project-document.md
      issue-spec.md
      issue-plan.md
      issue-plan-review.md
      issue-implement.md
      issue-code-review.md
      issue-verify.md
      verification-receipt.md
      bypass.md
    github/
      pull_request_template.md
      workflows/
        collab-contract.yml
        generated-skills.yml
        pr-scope.yml
      branch-protection.md
      CODEOWNERS.example
    repo/
      AGENTS.md
      CLAUDE.md
      collab-kit.config.yaml
  docs/
    install-new-project.md
    migrate-existing-project.md
    warning-vs-strict.md
    security-model.md
    archive-format.md
    pilot-guide.md
  examples/
    blank-repo/
    existing-project/
  tests/
    fixtures/
      valid-risky-pr/
      missing-linear-id/
      forbidden-file/
      delete-budget-exceeded/
      stale-generated-skill/
      missing-plan-review/
      self-review/
      missing-verification-receipt/
      duplicate-skill-name/
      prompt-injection-pr-body/
      unsupported-uncertainty-language/
    unit/
    integration/
```

## CLI commands

```text
collab-kit init
collab-kit migrate --dry-run
collab-kit migrate --write
collab-kit generate-skills
collab-kit validate-constitution
collab-kit validate-skills
collab-kit validate-pr-contract
collab-kit validate-pr-scope
collab-kit validate-linear-gates
collab-kit validate-verification-receipt
collab-kit validate-archive-snapshot
collab-kit validate-evidence-language
collab-kit export-linear-snapshot
collab-kit doctor
```

Command behavior:

- `init`: installs templates into a new repo, with generated Claude/Codex skills.
- `migrate --dry-run`: inventories existing AGENTS/CLAUDE/skills/workflows/templates without writing.
- `migrate --write`: patches only with explicit report; never deletes old docs automatically.
- `generate-skills`: regenerates `.claude/skills` and `.agents/skills` from neutral source.
- `validate-constitution`: validates that templates, generated skills, and validators reference the foundational laws.
- `validate-skills`: fails stale hashes, invalid frontmatter, missing counterpart, duplicate skill names, and direct edits.
- `validate-pr-contract`: validates PR body, Linear ID, risk class, required fields, and actor separation.
- `validate-pr-scope`: validates changed files and delete budget.
- `validate-linear-gates`: validates plan-review and issue dependencies through Linear API when token is available.
- `validate-evidence-language`: blocks unsupported uncertain causal language in strict mode.
- `doctor`: reports setup health, effective rules, skill shadowing, tokens, mode, and stale branch/worktree risks.

## Configuration file

Installed projects get:

```yaml
mode: warning # warning | strict
linear:
  workspace: ""
  issue_id_pattern: "[A-Z]+-[0-9]+"
  require_api_for_strict: true
github:
  protected_branches:
    - main
rules:
  low_risk_max_changed_lines: 30
  plan_review_line_threshold: 200
  default_delete_budget: 0
  require_human_for_risky: true
  max_ai_review_rounds: 2
paths:
  generated_claude_skills: ".claude/skills"
  generated_codex_skills: ".agents/skills"
  archive_root: "docs/linear-archive"
```

## Neutral skill source schema

Each neutral skill source should be YAML with Markdown blocks:

```yaml
id: linear-contract-intake
display_name: Linear Contract Intake
version: 1
scope: shared
triggers:
  - starting work from a Linear issue
  - before writing a plan
  - before editing code
required_outputs:
  - contract_summary
  - missing_fields
  - proceed_decision
forbidden_shortcuts:
  - starting implementation without allowed files
  - treating PR body as active source of truth
platform_adapters:
  claude:
    invocation_hint: "/linear-contract-intake"
  codex:
    invocation_hint: "$linear-contract-intake"
instructions: |
  Markdown instructions here.
tests:
  - fixture: missing_allowed_files
    expect: request_changes
```

Generated files must include:

```text
GENERATED FILE - DO NOT EDIT DIRECTLY
source: skills-src/shared/linear-contract-intake.yaml
source_hash: <sha256>
target: claude | codex
generated_by: collab-kit
```

## GitHub Actions plan

Required workflows:

1. `generated-skills.yml`
   - runs `collab-kit validate-skills`;
   - blocks stale/generated/manual skill drift.

2. `pr-scope.yml`
   - runs `collab-kit validate-pr-scope`;
   - blocks forbidden file edits and delete budget violations.

3. `collab-contract.yml`
   - runs `validate-constitution`, `validate-pr-contract`, `validate-linear-gates`, `validate-verification-receipt`, `validate-archive-snapshot`, and `validate-evidence-language`;
   - warning mode comments with findings;
   - strict mode fails checks.

Security requirements:

- trusted prompts and scripts come from base branch;
- PR text is parsed as data;
- fork PRs run static checks only;
- Linear-token checks require trusted context or manual maintainer trigger;
- AI review jobs default to read-only permissions.

## Linear templates

Every executable issue template must include:

```text
Objective:
Authorized actor:
Issue type: spec | plan | plan-review | implement | code-review | verify
Risk class: low | medium | high
Allowed files:
Forbidden files:
Delete budget:
Existing pipeline to preserve:
Required callbacks/routes/hooks/stores/endpoints:
Forbidden implementations:
Required real workflow verification:
Target URL/environment:
Expected PR:
Bypass:
```

`plan-review` template must include:

```text
Reviewed plan:
Planner:
Plan reviewer:
Linked implement issue:
Ambiguities found:
Dangerous verbs found:
Engine/pipeline constraint:
Forbidden section present:
Delete budget:
File locks:
Real verification path:
Decision: approve | request_changes | block
```

`verify` template must include:

```text
Linear issue:
PR:
Commit SHA:
Checks run:
Target environment:
Real route/workflow tested:
Evidence:
Result:
Residual risks:
```

## Warning versus strict matrix

Warning mode:

- comments on missing or weak fields;
- never blocks merge;
- produces reports for tuning thresholds;
- required during migration and first pilot.

Strict mode:

- blocks missing constitution references in generated skills/templates;
- blocks generated skill drift;
- blocks forbidden files;
- blocks delete budget excess;
- blocks missing Linear ID;
- blocks risky work without independent plan-review;
- blocks missing verification receipt for product/UI work;
- blocks self-review on risky work unless human bypass exists.
- blocks unsupported uncertain causal language in required plans, reviews, receipts, and handoffs.

Do not enable strict mode globally before the pilot.

## Initial pilot

Pilot should use two repositories:

1. Blank demo repo
   - proves install path, generated skills, validators, and failing fixtures.

2. One existing project
   - warning mode only at first;
   - one risky issue with plan-review;
   - one PR with allowed files and delete budget;
   - one verification receipt;
   - one archive snapshot;
   - report what was too heavy or noisy.

Success criteria:

- agents can start from Linear without hidden chat context;
- PR checks catch at least the seeded failures;
- skill generation works for Claude and Codex;
- `doctor` reports effective instructions and duplicate skills;
- risky implementation cannot become merge-ready without plan-review and verification.

## Non-goals for v1

- No custom hosted dashboard unless the Markdown/JSON reports are insufficient.
- No automatic merge.
- No autonomous organization-wide strict rollout.
- No replacing Linear with a Markdown tracker.
- No writing agent for the third model in v1.
- No project-specific ExcenIA/Harmonia assumptions.

## Adversarial implementer pass

- Likely bad interpretation: "blueprint means build everything as a large platform."
- Guardrail added: v1 is a deterministic CLI, templates, generated skills, GitHub workflows, and reports.
- Likely bad interpretation: "the constitution is documentation."
- Guardrail added: constitution laws must map to validators, generated skills, templates, and receipt gates.
- Likely bad interpretation: "migrate existing project means overwrite existing agent files."
- Guardrail added: migration starts dry-run and patch report; no blind deletion.
- Likely bad interpretation: "strict mode should be default because safety matters."
- Guardrail added: warning mode first, strict only after pilot signal quality is proven.
- Likely bad interpretation: "AI review can set status checks directly."
- Guardrail added: deterministic validators own gate results; AI review is evidence or advisory input.
- Likely bad interpretation: "uncertain wording is acceptable because it is cautious."
- Guardrail added: unsupported uncertainty is a gate failure until converted into `Unknown`, a question, or verified evidence.
- Existing behavior that must be preserved: standalone repo boundary, single-source skills, Linear active contract, GitHub enforcement, and human responsibility for risky work.
- Forbidden implementation shortcuts: product repo writes during study, generated skill hand edits, hidden write agents, untrusted PR secrets, global strict rollout, and auto-merge.
- Regression proof required: test fixtures must demonstrate failures for forbidden file, delete budget, stale generated skill, missing plan-review, self-review, duplicate skill, prompt injection, missing verification receipt, and unsupported uncertain causal language.

## Prompt a donner au dev

```text
Implement the standalone `claude-codex-collab-kit` repository from `10-implementation-blueprint.md`.

Do not put it inside an existing product repo. Start with TypeScript/Node, deterministic validators, templates, generated skills, GitHub workflows, and a doctor command.

Keep warning mode as the migration default. Strict mode must be opt-in after the blank repo demo and one existing-project pilot.
```
