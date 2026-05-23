import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileExists } from "../fs/readTree";
import { buildGeneratedSkillFiles } from "../skills/generateSharedSkills";
import { targetsForAgentMode, type ResolvedAgentMode } from "./agentMode";

export interface InitApplyOptions {
  packageRoot: string;
  targetRoot: string;
  agentMode: ResolvedAgentMode;
}

export interface InstallFile {
  relativePath: string;
  source: string;
  content: string;
}

export interface InitApplyFile {
  path: string;
  source: string;
}

export interface InitApplyResult {
  status: "applied" | "blocked";
  targetRoot: string;
  written: InitApplyFile[];
  conflicts: string[];
  nextSteps: string[];
}

type TemplateScope = "common" | "codex" | "claude";

const templateFiles: Array<{ templatePath: string; outputPath: string; scope: TemplateScope }> = [
  { templatePath: "agents/README.md", outputPath: ".agents/README.md", scope: "codex" },
  { templatePath: "agents/skills/README.md", outputPath: ".agents/skills/README.md", scope: "codex" },
  { templatePath: "claude/README.md", outputPath: ".claude/README.md", scope: "claude" },
  { templatePath: "claude/skills/README.md", outputPath: ".claude/skills/README.md", scope: "claude" },
  { templatePath: "project/AGENTS.md", outputPath: "AGENTS.md", scope: "codex" },
  { templatePath: "project/CLAUDE.md", outputPath: "CLAUDE.md", scope: "claude" },
  { templatePath: "project/fuckia.config.yaml", outputPath: "fuckia.config.yaml", scope: "common" },
  { templatePath: "github/README.md", outputPath: ".github/README.md", scope: "common" },
  { templatePath: "github/pull_request_template.md", outputPath: ".github/PULL_REQUEST_TEMPLATE.md", scope: "common" },
  { templatePath: "github/workflows/collab-contract.yml", outputPath: ".github/workflows/collab-contract.yml", scope: "common" },
  { templatePath: "github/workflows/generated-skills.yml", outputPath: ".github/workflows/generated-skills.yml", scope: "common" },
  { templatePath: "github/workflows/pr-scope.yml", outputPath: ".github/workflows/pr-scope.yml", scope: "common" },
  { templatePath: "github/workflows/README.md", outputPath: ".github/workflows/README.md", scope: "common" },
  { templatePath: "docs/README.md", outputPath: "docs/README.md", scope: "common" },
  { templatePath: "docs/fuckia/README.md", outputPath: "docs/fuckia/README.md", scope: "common" },
  { templatePath: "docs/fuckia/archive/README.md", outputPath: "docs/fuckia/archive/README.md", scope: "common" },
  { templatePath: "docs/fuckia/end-of-work-checkpoint.md", outputPath: "docs/fuckia/end-of-work-checkpoint.md", scope: "common" },
  { templatePath: "docs/fuckia/linear/README.md", outputPath: "docs/fuckia/linear/README.md", scope: "common" },
  { templatePath: "docs/fuckia/linear/templates/README.md", outputPath: "docs/fuckia/linear/templates/README.md", scope: "common" },
  { templatePath: "linear/templates/spec.md", outputPath: "docs/fuckia/linear/templates/spec.md", scope: "common" },
  { templatePath: "linear/templates/plan.md", outputPath: "docs/fuckia/linear/templates/plan.md", scope: "common" },
  { templatePath: "linear/templates/plan-review.md", outputPath: "docs/fuckia/linear/templates/plan-review.md", scope: "common" },
  { templatePath: "linear/templates/implement.md", outputPath: "docs/fuckia/linear/templates/implement.md", scope: "common" },
  { templatePath: "linear/templates/code-review.md", outputPath: "docs/fuckia/linear/templates/code-review.md", scope: "common" },
  { templatePath: "linear/templates/verify.md", outputPath: "docs/fuckia/linear/templates/verify.md", scope: "common" },
  { templatePath: "docs/fuckia/merge-proposals/README.md", outputPath: "docs/fuckia/merge-proposals/README.md", scope: "common" }
];

const optionalTemplateFiles: Array<{ templatePath: string; outputPath: string }> = [
  { templatePath: "project/root-readme.md", outputPath: "README.md" }
];

export async function applyInit(options: InitApplyOptions): Promise<InitApplyResult> {
  const installFiles = await buildInstallFiles(options);
  const conflicts = await findConflicts(options.targetRoot, installFiles);

  if (conflicts.length > 0) {
    return {
      status: "blocked",
      targetRoot: options.targetRoot,
      written: [],
      conflicts,
      nextSteps: [
        "Review conflicting files.",
        "Use `fuckia migrate --dry-run` for existing projects.",
        "Do not delete existing agent rules to force init."
      ]
    };
  }

  const written: InitApplyFile[] = [];
  for (const file of installFiles) {
    const absolutePath = path.join(options.targetRoot, file.relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.content, { encoding: "utf8", flag: "wx" });
    written.push({ path: file.relativePath, source: file.source });
  }

  return {
    status: "applied",
    targetRoot: options.targetRoot,
    written,
    conflicts: [],
    nextSteps: [
      "Review generated governance files.",
      "Run `fuckia doctor` from the target repository.",
      "Keep warning mode until GitHub and Linear gates are configured."
    ]
  };
}

export async function buildInstallFiles(options: InitApplyOptions): Promise<InstallFile[]> {
  const files: InstallFile[] = [];

  for (const template of templateFiles.filter((template) => includeScope(template.scope, options.agentMode))) {
    files.push({
      relativePath: normalizePath(template.outputPath),
      source: normalizePath(path.join("kit", "templates", template.templatePath)),
      content: await readTemplate(options.packageRoot, template.templatePath, options.agentMode)
    });
  }

  for (const template of optionalTemplateFiles) {
    const outputPath = normalizePath(template.outputPath);
    if (await fileExists(path.join(options.targetRoot, outputPath))) {
      continue;
    }

    files.push({
      relativePath: outputPath,
      source: normalizePath(path.join("kit", "templates", template.templatePath)),
      content: await readTemplate(options.packageRoot, template.templatePath, options.agentMode)
    });
  }

  const generatedSkills = await buildGeneratedSkillFiles({
    sourceRootDir: options.packageRoot,
    outputKind: "install",
    targets: targetsForAgentMode(options.agentMode)
  });

  for (const skill of generatedSkills) {
    files.push({
      relativePath: skill.output,
      source: skill.source,
      content: skill.content
    });
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function readTemplate(
  packageRoot: string,
  templatePath: string,
  agentMode: ResolvedAgentMode
): Promise<string> {
  const content = await readFile(path.join(packageRoot, "kit", "templates", templatePath), "utf8");
  return content.replace(/__AGENT_MODE__/g, agentMode);
}

function includeScope(scope: TemplateScope, agentMode: ResolvedAgentMode): boolean {
  if (scope === "common") {
    return true;
  }

  if (scope === "codex") {
    return agentMode === "codex-only" || agentMode === "dual-agent";
  }

  return agentMode === "claude-only" || agentMode === "dual-agent";
}

export async function findConflicts(targetRoot: string, files: InstallFile[]): Promise<string[]> {
  const conflicts: string[] = [];
  for (const file of files) {
    if (await fileExists(path.join(targetRoot, file.relativePath))) {
      conflicts.push(file.relativePath);
    }
  }
  return conflicts;
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
