# File Locks And Delete Budgets

Each active Linear issue declares file locks.

Rules:

- one active issue owns a file lock at a time;
- parallel subagents require disjoint file sets;
- overlap requires explicit human comment in Linear;
- GitHub CI detects changes outside allowed files and changes to forbidden files.

Every issue that touches existing behavior defines a delete budget:

- per critical file when relevant;
- total deletion limit for the PR;
- zero budget for files that must not be rewritten.

