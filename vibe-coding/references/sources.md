---
type: spec
status: draft
created: 2026-05-19
updated: 2026-05-19
topic: sources
owner: human
source_of_truth: true
---

# Sources To Verify

These are starting points only. The implementer must re-check current docs during implementation.

## Linear

- Project overview and documents: https://linear.app/docs/project-overview
- Project documents: https://linear.app/docs/project-documents
- Issue templates: https://linear.app/docs/issue-templates
- GitHub integration: https://linear.app/docs/github-integration
- Issue relations and blockers: https://linear.app/docs/issue-relations
- GraphQL API: https://linear.app/developers/graphql
- Agent Interaction Guidelines: https://linear.app/developers/aig
- Workflow statuses: https://linear.app/docs/configuring-workflows
- Releases/deployment distinction: https://linear.app/docs/releases

## GitHub

- GitHub Actions events: https://docs.github.com/actions/reference/events-that-trigger-workflows
- Branch protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Rulesets and PR standardization: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/managing-and-standardizing-pull-requests
- Repository API: https://docs.github.com/rest/repos/repos
- GitHub Actions permissions API: https://docs.github.com/en/rest/actions
- Repository rulesets API: https://docs.github.com/en/rest/repos/rules
- Branch protection API: https://docs.github.com/en/rest/branches/branch-protection
- Pull request templates: verify current GitHub docs before implementing.

## Claude and Codex skills

- Claude Code plugins: https://code.claude.com/docs/en/plugins
- Claude Code plugin marketplaces: https://code.claude.com/docs/en/plugin-marketplaces
- Claude Code plugin reference: https://code.claude.com/docs/en/plugins-reference
- Claude Code skills: https://code.claude.com/docs/en/skills
- Claude Code GitHub Actions: https://code.claude.com/docs/en/github-actions
- Codex skills: https://developers.openai.com/codex/skills
- Codex AGENTS.md: https://developers.openai.com/codex/guides/agents-md
- Codex subagents: https://developers.openai.com/codex/subagents
- Codex GitHub Action: https://developers.openai.com/codex/github-action
- Codex GitHub review: https://developers.openai.com/codex/integrations/github
- Codex Linear integration: https://developers.openai.com/codex/integrations/linear

## AI review tools

- Claude Code Review setup: https://support.claude.com/en/articles/14233555-set-up-code-review-for-claude-code
- Gemini Code Assist GitHub review: https://developers.google.com/gemini-code-assist/docs/review-github-code
- Gemini CLI GitHub Action: https://github.com/google-github-actions/run-gemini-cli
- CodeRabbit docs: https://docs.coderabbit.ai/index
- Codex PR review help: https://help.openai.com/en/articles/11369540/
- Codex Action security notes: https://github.com/openai/codex-action/blob/main/docs/security.md

## Internal guard specs

- Agent Constitution: `vibe-coding/constitution/agent-constitution.md`
- Evidence Language Guard: `vibe-coding/constitution/evidence-language-guard.md`
- Agent Law Propagation: `vibe-coding/constitution/agent-law-propagation.md`

## Adversarial implementer pass

- Bad implementation path: "links in this file are proof enough."
- Guardrail added: links are starting points; implementer must verify current docs and record decisions.
- Forbidden shortcut: coding against guessed field names, endpoints, or workflow behavior.
- Regression proof required: implementation note cites exact docs/product behavior used.
