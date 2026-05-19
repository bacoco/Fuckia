# Validation

CI fails if:

- a shared skill exists for Claude but not Codex;
- generated files are stale relative to source hash;
- generated files were manually edited;
- YAML/frontmatter is invalid;
- `description` is not a string;
- Claude and Codex variants contradict the shared source;
- a shared rule exists only in `AGENTS.md` or only in `CLAUDE.md`.

