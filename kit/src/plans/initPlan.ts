import path from "node:path";
import { fileExists } from "../fs/readTree";
import { targetsForAgentMode, type ResolvedAgentMode } from "../install/agentMode";
import { skillNamesForInstallProfile, type InstallProfile } from "../install/installProfile";
import { plannedPdgInstallFiles } from "../pdg/pdgRepository";
import { buildGeneratedSkillFiles } from "../skills/generateSharedSkills";

export interface PlannedFile {
  path: string;
  source: string;
  purpose: string;
}

export interface InitPlan {
  mode: "dry-run";
  agentMode: ResolvedAgentMode;
  installProfile: InstallProfile;
  targetRoot: string;
  directories: string[];
  files: PlannedFile[];
  humanSteps: string[];
  automationBoundaries: string[];
}

export async function buildInitPlan(
  targetRoot: string,
  packageRoot = targetRoot,
  agentMode: ResolvedAgentMode = "dual-agent",
  installProfile: InstallProfile = "full"
): Promise<InitPlan> {
  const generatedSkills = await buildGeneratedSkillFiles({
    sourceRootDir: packageRoot,
    outputKind: "install",
    targets: targetsForAgentMode(agentMode),
    skillNames: skillNamesForInstallProfile(installProfile)
  });
  const targets = targetsForAgentMode(agentMode);
  const plannedPdg = plannedPdgInstallFiles(targets, true);
  const includeRootReadme = !(await fileExists(path.join(targetRoot, "README.md")));

  return {
    mode: "dry-run",
    agentMode,
    installProfile,
    targetRoot: path.resolve(targetRoot),
    directories: [
      ...(agentMode === "claude-only" ? [] : [".agents/skills"]),
      ...(agentMode === "codex-only" ? [] : [".claude/skills"]),
      ...(installProfile === "full" ? [".github/workflows", "docs/fuckia", "docs/fuckia/archive"] : [])
    ],
    files: [
      ...(installProfile === "full" && includeRootReadme
        ? [{ path: "README.md", source: "template", purpose: "Minimal README for empty target repositories." }]
        : []),
      ...(installProfile === "full" && agentMode !== "claude-only" ? [
        { path: ".agents/README.md", source: "template", purpose: "Codex agent directory map." },
        { path: ".agents/skills/README.md", source: "template", purpose: "Codex generated skills directory map." },
        { path: "AGENTS.md", source: "template + PDG repository", purpose: "Codex entry rules with PDG trigger." }
      ] : []),
      ...(installProfile === "full" && agentMode !== "codex-only" ? [
        { path: ".claude/README.md", source: "template", purpose: "Claude directory map." },
        { path: ".claude/skills/README.md", source: "template", purpose: "Claude generated skills directory map." },
        { path: "CLAUDE.md", source: "template + PDG repository", purpose: "Claude entry rules with PDG trigger." }
      ] : []),
      ...(installProfile === "full" ? [
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
      ] : []),
      ...generatedSkills.map((skill) => ({
        path: skill.output,
        source: skill.source,
        purpose: `${skill.target} generated skill.`
      })),
      ...plannedPdg.filter((file) => (
        installProfile === "guard-only" ||
        (file.path !== "AGENTS.md" && file.path !== "CLAUDE.md")
      ))
    ],
    humanSteps: installProfile === "full"
      ? [
        "Create or choose the GitHub account or organization.",
        "Create or choose the Linear account and workspace.",
        "Grant GitHub repository permissions before repository configuration automation.",
        "Grant Linear workspace permissions before Linear template automation."
      ]
      : ["Approve the PDG skill and trigger file list before writes."],
    automationBoundaries: installProfile === "full"
      ? [
        "Account creation is a human step.",
        "Billing plan selection is a human step.",
        "Permission grants are human-approved steps.",
        "Generated skills are written only by `init --apply` or a future migration apply command."
      ]
      : ["Guard-only install writes only selected PDG skill and trigger files."]
  };
}
