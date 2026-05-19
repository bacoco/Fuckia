---
name: end-of-work-checkpoint
description: Use at the end of meaningful work to leave a concise state receipt for the next human, Claude, or Codex session.
targets:
  - claude
  - codex
---

# End Of Work Checkpoint

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
