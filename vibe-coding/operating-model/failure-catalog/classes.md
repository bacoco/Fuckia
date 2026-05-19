# Failure Classes

The implementation must classify each failure as prevented by CI, prevented by Linear workflow, detected by review, detected by verification, or accepted risk with fallback.

Classes:

1. Plan/spec failures.
2. Implementation failures.
3. Review failures.
4. Cross-agent coordination failures.
5. Tooling asymmetry failures.
6. Deploy/verify failures.
7. Memory/state failures.
8. Cost/velocity failures.

Each class must have at least one concrete gate, review rule, receipt, or escalation path.

