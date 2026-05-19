# Contracts To Preserve

## Repository Structure

MUST preserve the progressive disclosure structure:

- root stays minimal;
- `vibe-coding/` remains the design source;
- every directory has a `README.md`;
- large topics are split into focused files.

## Documentation Language

MUST preserve English-only repository content.

## Current GitHub Repository

MUST preserve the existing private GitHub repository and `main` branch.

## Product Boundary

MUST NOT implement inside an unrelated product repository.

## Existing Project Migration

MUST NOT modify product code during audit.

MUST NOT overwrite existing `AGENTS.md`, `CLAUDE.md`, skills, workflows, or docs without an explicit migration plan and user-approved apply step.

## Destructive-Change Guard

MUST preserve the destructive-change guard concept.

MUST NOT reintroduce cost or token limits as a product constraint.
