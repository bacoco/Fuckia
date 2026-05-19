# Install

Installer modules for writing Fuckia governance files into a target repository.

Current scope:

- `init --apply` for repositories with no conflicting governance files.
- `migrate --plan` for existing-project migration planning.
- `migrate --apply` for governance-only existing-project migration.

Rule: install writes are limited to governance files and generated skills. Product code is out of scope.
