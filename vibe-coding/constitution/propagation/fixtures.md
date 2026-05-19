# Fixtures

Failing fixtures:

- generated skill missing constitution hash;
- Codex skill includes constitution but Claude skill does not;
- role addendum permits self-review on risky work;
- implementer skill permits parallel pipeline without Linear authorization;
- verifier skill permits Done from unit tests only;
- `AGENTS.md` contains the laws but `CLAUDE.md` does not;
- uncertain causal language is present without `Unknown`, question, or verification.

Passing fixtures:

- shared skill with constitution hash and role addendum;
- Claude/Codex pair generated from the same neutral source;
- role addendum that strengthens the constitution;
- plan-review block caused by unresolved evidence gap.

