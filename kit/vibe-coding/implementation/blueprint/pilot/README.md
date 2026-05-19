# Pilot

The first rollout uses two repositories:

1. Blank demo repo.
2. One existing project in warning mode.

Success criteria:

- agents start from Linear without hidden chat context;
- PR checks catch seeded failures;
- skill generation works for Claude and Codex;
- `doctor` reports effective instructions and duplicate skills;
- risky implementation cannot become merge-ready without plan-review and verification.

