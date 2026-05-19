import path from "node:path";

export interface PlannedFile {
  path: string;
  source: string;
  purpose: string;
}

export interface InitPlan {
  mode: "dry-run";
  targetRoot: string;
  directories: string[];
  files: PlannedFile[];
  humanSteps: string[];
  automationBoundaries: string[];
}

export async function buildInitPlan(targetRoot: string): Promise<InitPlan> {
  return {
    mode: "dry-run",
    targetRoot: path.resolve(targetRoot),
    directories: [
      ".agents/skills",
      ".claude/skills",
      ".github/workflows",
      "docs/fuckia",
      "docs/fuckia/archive"
    ],
    files: [
      { path: "AGENTS.md", source: "template", purpose: "Codex entry rules." },
      { path: "CLAUDE.md", source: "template", purpose: "Claude entry rules." },
      { path: ".github/pull_request_template.md", source: "template", purpose: "PR collaboration contract." },
      { path: ".github/workflows/collab-contract.yml", source: "template", purpose: "Collaboration gate checks." },
      { path: ".github/workflows/generated-skills.yml", source: "template", purpose: "Generated skill drift checks." },
      { path: ".github/workflows/pr-scope.yml", source: "template", purpose: "PR scope and destructive-change guard." },
      { path: "fuckia.config.yaml", source: "template", purpose: "Project-local Fuckia configuration." },
      { path: "docs/fuckia/README.md", source: "template", purpose: "Installed governance map." }
    ],
    humanSteps: [
      "Create or choose the GitHub account or organization.",
      "Create or choose the Linear account and workspace.",
      "Grant GitHub repository permissions before repository configuration automation.",
      "Grant Linear workspace permissions before Linear template automation."
    ],
    automationBoundaries: [
      "Account creation is a human step.",
      "Billing plan selection is a human step.",
      "Permission grants are human-approved steps.",
      "Generated skills are written only by an explicit future apply command."
    ]
  };
}
