# File Locks And Destructive-Change Guards

Each active Linear issue declares file locks.

Rules:

- one active issue owns a file lock at a time;
- parallel subagents require disjoint file sets;
- overlap requires explicit human comment in Linear;
- GitHub CI detects changes outside allowed files and changes to forbidden files.

Every issue that touches existing behavior defines a destructive-change guard:

- per critical file when relevant;
- total destructive-change limit for the PR;
- zero destructive-change allowance for files that must not be rewritten.
