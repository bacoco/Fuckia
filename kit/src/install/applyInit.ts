import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileExists } from "../fs/readTree";
import { buildGeneratedSkillFiles } from "../skills/generateSharedSkills";

export interface InitApplyOptions {
  packageRoot: string;
  targetRoot: string;
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

const templateFiles: Array<{ templatePath: string; outputPath: string }> = [
  { templatePath: "agents/README.md", outputPath: ".agents/README.md" },
  { templatePath: "agents/skills/README.md", outputPath: ".agents/skills/README.md" },
  { templatePath: "claude/README.md", outputPath: ".claude/README.md" },
  { templatePath: "claude/skills/README.md", outputPath: ".claude/skills/README.md" },
  { templatePath: "project/AGENTS.md", outputPath: "AGENTS.md" },
  { templatePath: "project/CLAUDE.md", outputPath: "CLAUDE.md" },
  { templatePath: "project/fuckia.config.yaml", outputPath: "fuckia.config.yaml" },
  { templatePath: "github/pull_request_template.md", outputPath: ".github/PULL_REQUEST_TEMPLATE.md" },
  { templatePath: "github/workflows/collab-contract.yml", outputPath: ".github/workflows/collab-contract.yml" },
  { templatePath: "github/workflows/generated-skills.yml", outputPath: ".github/workflows/generated-skills.yml" },
  { templatePath: "github/workflows/pr-scope.yml", outputPath: ".github/workflows/pr-scope.yml" },
  { templatePath: "github/workflows/README.md", outputPath: ".github/workflows/README.md" },
  { templatePath: "docs/README.md", outputPath: "docs/README.md" },
  { templatePath: "docs/fuckia/README.md", outputPath: "docs/fuckia/README.md" },
  { templatePath: "docs/fuckia/archive/README.md", outputPath: "docs/fuckia/archive/README.md" },
  { templatePath: "docs/fuckia/end-of-work-checkpoint.md", outputPath: "docs/fuckia/end-of-work-checkpoint.md" },
  { templatePath: "docs/fuckia/linear/README.md", outputPath: "docs/fuckia/linear/README.md" },
  { templatePath: "docs/fuckia/linear/templates/README.md", outputPath: "docs/fuckia/linear/templates/README.md" },
  { templatePath: "linear/templates/spec.md", outputPath: "docs/fuckia/linear/templates/spec.md" },
  { templatePath: "linear/templates/plan.md", outputPath: "docs/fuckia/linear/templates/plan.md" },
  { templatePath: "linear/templates/plan-review.md", outputPath: "docs/fuckia/linear/templates/plan-review.md" },
  { templatePath: "linear/templates/implement.md", outputPath: "docs/fuckia/linear/templates/implement.md" },
  { templatePath: "linear/templates/code-review.md", outputPath: "docs/fuckia/linear/templates/code-review.md" },
  { templatePath: "linear/templates/verify.md", outputPath: "docs/fuckia/linear/templates/verify.md" },
  { templatePath: "docs/fuckia/merge-proposals/README.md", outputPath: "docs/fuckia/merge-proposals/README.md" }
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

  for (const template of templateFiles) {
    files.push({
      relativePath: normalizePath(template.outputPath),
      source: normalizePath(path.join("kit", "templates", template.templatePath)),
      content: await readTemplate(options.packageRoot, template.templatePath)
    });
  }

  const generatedSkills = await buildGeneratedSkillFiles({
    sourceRootDir: options.packageRoot,
    outputKind: "install"
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

async function readTemplate(packageRoot: string, templatePath: string): Promise<string> {
  return readFile(path.join(packageRoot, "kit", "templates", templatePath), "utf8");
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
