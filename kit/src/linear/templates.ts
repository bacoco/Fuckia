export interface LinearIssueTemplate {
  kind: string;
  title: string;
  fileName: string;
  description: string;
}

export const linearIssueTemplates: LinearIssueTemplate[] = [
  {
    kind: "spec",
    title: "Fuckia Spec",
    fileName: "spec.md",
    description: [
      "## Goal",
      "",
      "State the product outcome.",
      "",
      "## Source Of Truth",
      "",
      "- Linear issue:",
      "- GitHub repository:",
      "- Existing workflow to preserve:",
      "",
      "## Non-Goals",
      "",
      "- Product code changes outside the approved scope.",
      "- Parallel engines, stores, routers, hooks, workflows, or pipelines.",
      "",
      "## Acceptance Criteria",
      "",
      "- Real workflow verification is defined.",
      "- Allowed files and forbidden files are listed.",
      ""
    ].join("\n")
  },
  {
    kind: "plan",
    title: "Fuckia Plan",
    fileName: "plan.md",
    description: [
      "## Implementation Plan",
      "",
      "List ordered tasks.",
      "",
      "## Allowed Files",
      "",
      "-",
      "",
      "## Forbidden Files",
      "",
      "-",
      "",
      "## Verification",
      "",
      "-",
      ""
    ].join("\n")
  },
  {
    kind: "plan-review",
    title: "Fuckia Plan Review",
    fileName: "plan-review.md",
    description: [
      "## Verdict",
      "",
      "- Approved:",
      "",
      "## Blocking Issues",
      "",
      "-",
      "",
      "## PDG Pass",
      "",
      "- Bad implementation path:",
      "- Guardrail added:",
      "- Existing behavior that must be preserved:",
      "- Forbidden implementation shortcuts:",
      "- Regression proof required:",
      ""
    ].join("\n")
  },
  {
    kind: "implement",
    title: "Fuckia Implement",
    fileName: "implement.md",
    description: [
      "## Work Package",
      "",
      "Implement only the approved plan.",
      "",
      "## Constraints",
      "",
      "- Preserve existing workflows.",
      "- Do not self-review risky work.",
      "- Stop on missing source of truth.",
      "",
      "## Evidence",
      "",
      "- Commands:",
      "- Files changed:",
      ""
    ].join("\n")
  },
  {
    kind: "code-review",
    title: "Fuckia Code Review",
    fileName: "code-review.md",
    description: [
      "## Findings",
      "",
      "-",
      "",
      "## Required Fixes",
      "",
      "-",
      "",
      "## Regression Check",
      "",
      "- Real workflow path exercised:",
      "- Old path preserved:",
      ""
    ].join("\n")
  },
  {
    kind: "verify",
    title: "Fuckia Verify",
    fileName: "verify.md",
    description: [
      "## Verification Receipt",
      "",
      "- GitHub checks:",
      "- Unit or type checks:",
      "- Real workflow verification:",
      "",
      "## End Of Work Checkpoint",
      "",
      "- Current state:",
      "- Done:",
      "- Verification:",
      "- Corrections:",
      "- Remaining:",
      "- Next:",
      ""
    ].join("\n")
  }
];

