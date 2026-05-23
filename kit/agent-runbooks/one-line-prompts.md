# One-Line Prompts

These prompts are pasted inside Claude Code or Codex while the agent is located in the target repository.

## Primary Prompt

```text
Install Fuckia here. Use the agent mode that matches this repo; ask if ambiguous. Read `https://github.com/bacoco/Fuckia/blob/main/INSTALL.md` and follow it. Start with audit only. Ask before writing files.
```

Explicit mode prompts:

```text
Install Fuckia here for Codex only.
Install Fuckia here for Claude only.
Install Fuckia here for Claude and Codex.
```

The agent follows the remote procedure. It does not copy the procedure file into the target repository.

## Platform-Specific Wrappers

- Claude wrapper: `kit/agent-runbooks/claude/install-or-migrate.md`
- Codex wrapper: `kit/agent-runbooks/codex/install-or-migrate.md`

## Review And Merge

```text
Review and merge this PR using Fuckia. Read `https://github.com/bacoco/Fuckia/blob/main/kit/agent-runbooks/review-and-merge.md`. Prepare a review packet, ask me to approve all or selected fixes in chat, apply approved fixes, verify, then merge only if GitHub branch protection is satisfied.
```
