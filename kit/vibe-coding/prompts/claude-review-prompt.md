# Claude Review Prompt

Use this prompt when manually passing the repository to Claude for review.

```text
You are reviewing the Fuckia repository before implementation.

Repository goal:
Fuckia must become an installable governance kit for Claude Code, Codex, Linear, and GitHub.

Review focus:
1. Installation simplicity:
   - Claude plugin path;
   - Codex install path;
   - one prompt that points the agent to root `INSTALL.md`;
   - Node-free installer behind the agent procedure;
   - audit-first migration for existing projects.

2. Existing project safety:
   - `agent-install.sh --dry-run` must not write;
   - `agent-install.sh --apply --yes` touches governance files only unless explicitly authorized;
   - existing governance files are preserved with merge proposals;
   - product code must not be modified during audit.

3. Constitution enforcement:
   - Progressive Disclosure Before Detail;
   - Evidence Before Claim;
   - Source Of Truth Before Memory;
   - Preserve Working Systems;
   - Separated Authority;
   - Real Verification Before Done.

4. Skill strategy:
   - shared neutral source;
   - generated Claude and Codex outputs;
   - `existing-project-governance-auditor`;
   - no divergent Claude/Codex laws.

Output:
- Blocking issues first.
- Ambiguities.
- Missing install steps.
- Migration safety risks.
- Concrete changes to make before implementation.
```
