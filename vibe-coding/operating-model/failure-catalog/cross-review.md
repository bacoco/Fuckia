# Cross-Review

Use distinct roles:

```text
Planner
Plan reviewer
Implementer
Code reviewer
Verifier
```

Hard rules:

- planner must not be the plan reviewer for risky work;
- implementer must not be the sole code reviewer for risky work;
- plan-review blocks implementation;
- verification blocks Done;
- human override requires a visible Linear bypass reason.

Plan-review is mandatory for risky work, multi-agent work, ambiguous instructions, core files, public API/data contract changes, high delete budgets, UI-visible workflow changes, and deploy changes.

