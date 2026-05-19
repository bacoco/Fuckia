import path from "node:path";
import { fileExists } from "../fs/readTree";
import { buildGeneratedSkillFiles } from "../skills/generateSharedSkills";

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

export async function buildInitPlan(targetRoot: string, packageRoot = targetRoot): Promise<InitPlan> {
  const generatedSkills = await buildGeneratedSkillFiles({
    sourceRootDir: packageRoot,
    outputKind: "install"
  });
  const includeRootReadme = !(await fileExists(path.join(targetRoot, "README.md")));

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
      ...(includeRootReadme
        ? [{ path: "README.md", source: "template", purpose: "Minimal README for empty target repositories." }]
        : []),
      { path: ".agents/README.md", source: "template", purpose: "Codex agent directory map." },
      { path: ".agents/skills/README.md", source: "template", purpose: "Codex generated skills directory map." },
      { path: ".claude/README.md", source: "template", purpose: "Claude directory map." },
      { path: ".claude/skills/README.md", source: "template", purpose: "Claude generated skills directory map." },
      { path: "AGENTS.md", source: "template", purpose: "Codex entry rules." },
      { path: "CLAUDE.md", source: "template", purpose: "Claude entry rules." },
      { path: ".github/README.md", source: "template", purpose: "GitHub directory map." },
      { path: ".github/PULL_REQUEST_TEMPLATE.md", source: "template", purpose: "PR collaboration contract." },
      { path: ".github/workflows/collab-contract.yml", source: "template", purpose: "Collaboration gate checks." },
      { path: ".github/workflows/generated-skills.yml", source: "template", purpose: "Generated skill drift checks." },
      { path: ".github/workflows/pr-scope.yml", source: "template", purpose: "PR scope and destructive-change guard." },
      { path: ".github/workflows/README.md", source: "template", purpose: "GitHub workflow directory map." },
      { path: "fuckia.config.yaml", source: "template", purpose: "Project-local Fuckia configuration." },
      { path: "docs/README.md", source: "template", purpose: "Installed docs directory map." },
      { path: "docs/fuckia/README.md", source: "template", purpose: "Installed governance map." },
      { path: "docs/fuckia/archive/README.md", source: "template", purpose: "Generated receipt directory map." },
      { path: "docs/fuckia/end-of-work-checkpoint.md", source: "template", purpose: "Required end-of-work checkpoint." },
      { path: "docs/fuckia/linear/README.md", source: "template", purpose: "Installed Linear template map." },
      { path: "docs/fuckia/linear/templates/README.md", source: "template", purpose: "Linear issue template directory map." },
      { path: "docs/fuckia/linear/templates/spec.md", source: "template", purpose: "Linear spec template." },
      { path: "docs/fuckia/linear/templates/plan.md", source: "template", purpose: "Linear plan template." },
      { path: "docs/fuckia/linear/templates/plan-review.md", source: "template", purpose: "Linear plan review template." },
      { path: "docs/fuckia/linear/templates/implement.md", source: "template", purpose: "Linear implement template." },
      { path: "docs/fuckia/linear/templates/code-review.md", source: "template", purpose: "Linear code review template." },
      { path: "docs/fuckia/linear/templates/verify.md", source: "template", purpose: "Linear verify template." },
      { path: "docs/fuckia/merge-proposals/README.md", source: "template", purpose: "Merge proposal directory map." },
      ...generatedSkills.map((skill) => ({
        path: skill.output,
        source: skill.source,
        purpose: `${skill.target} generated skill.`
      }))
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
      "Generated skills are written only by `init --apply` or a future migration apply command."
    ]
  };
}
