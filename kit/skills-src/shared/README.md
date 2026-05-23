# Shared Skill Sources

Shared skills apply to both Claude and Codex.

Initial source files:

- `progressive-disclosure-guard.skill.md` - protects plans, specs, reviews, and prompts from damaging literal interpretations.
- `cross-agent-handoff.skill.md` - keeps handoff state explicit between Claude and Codex.
- `delegated-review-and-merge.skill.md` - lets agents prepare review packets and perform approved GitHub review or merge operations.
- `destructive-change-guard.skill.md` - blocks risky deletion and replacement work without explicit evidence.
- `end-of-work-checkpoint.skill.md` - forces a concise final state receipt.
- `evidence-language-guard.skill.md` - blocks unsupported causal language and requires Unknown, a question, or verification.
- `plan-review-gate.skill.md` - blocks risky implementation without independent review.
- `platform-permission-gate.skill.md` - checks GitHub and Linear permission boundaries before remote writes.
- `real-verification-gate.skill.md` - requires proof through real workflows, not isolated tests alone.
- `source-of-truth-gate.skill.md` - requires authoritative project context before implementation.

Rule: platform-specific adapters may change invocation mechanics. They must not weaken shared instructions.
