# Source

TypeScript source for the `fuckia` CLI.

Directories:

- `checks/` - read-only validation checks.
- `commands/` - command implementations.
- `core/` - shared CLI primitives.
- `fs/` - filesystem inventory helpers.
- `plans/` - dry-run install and migration plans.

Rule: commands do not write files in the first implementation slice.
