---
name: end-of-work-checkpoint
description: Use at the end of meaningful work to leave a concise state receipt for the next human, Claude, or Codex session.
---

<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
source: kit/skills-src/shared/end-of-work-checkpoint.skill.md
source_hash: 277806be85a6cc428b876d43d8cf889a1019e394332ab4697ecda5d364ada21a
generated_by: fuckia generate-skills
target: claude
-->

# End Of Work Checkpoint

## Claude Mechanics

- Use Claude planning tools for task tracking.
- Use Claude subagents only when file ownership is disjoint.
- Do not run parallel agents on the same files.
- Do not mark a risky Claude implementation as reviewed by the same Claude context.

Use this skill at the end of meaningful work.

## Required Format

End with:

- Current state:
- Done:
- Verification:
- Corrections:
- Remaining:
- Next:

## Rules

- Keep each field short.
- State unfinished work directly.
- Include failed commands and blockers.
- Do not hide remote writes, local writes, or skipped verification.
- Do not end with an incomplete sentence.

## Purpose

The next agent must know where the work stands without reading the full chat.
