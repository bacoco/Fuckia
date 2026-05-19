# GitHub Workflows

Required workflows:

- `generated-skills.yml`;
- `pr-scope.yml`;
- `collab-contract.yml`.

Security requirements:

- trusted prompts and scripts come from the base branch;
- PR text is parsed as data;
- fork PRs run static checks only;
- Linear-token checks require trusted context or manual maintainer trigger;
- AI review jobs default to read-only permissions.

