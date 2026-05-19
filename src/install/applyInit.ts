import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileExists } from "../fs/readTree";
import { buildGeneratedSkillFiles } from "../skills/generateSharedSkills";

export interface InitApplyOptions {
  packageRoot: string;
  targetRoot: string;
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

interface InstallFile {
  relativePath: string;
  source: string;
  content: string;
}

const templateFiles: Array<{ templatePath: string; outputPath: string }> = [
  { templatePath: "project/AGENTS.md", outputPath: "AGENTS.md" },
  { templatePath: "project/CLAUDE.md", outputPath: "CLAUDE.md" },
  { templatePath: "project/fuckia.config.yaml", outputPath: "fuckia.config.yaml" },
  { templatePath: "github/pull_request_template.md", outputPath: ".github/pull_request_template.md" },
  { templatePath: "github/workflows/collab-contract.yml", outputPath: ".github/workflows/collab-contract.yml" },
  { templatePath: "github/workflows/generated-skills.yml", outputPath: ".github/workflows/generated-skills.yml" },
  { templatePath: "github/workflows/pr-scope.yml", outputPath: ".github/workflows/pr-scope.yml" },
  { templatePath: "docs/fuckia/README.md", outputPath: "docs/fuckia/README.md" }
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

async function buildInstallFiles(options: InitApplyOptions): Promise<InstallFile[]> {
  const files: InstallFile[] = [];

  for (const template of templateFiles) {
    files.push({
      relativePath: normalizePath(template.outputPath),
      source: normalizePath(path.join("templates", template.templatePath)),
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
  return readFile(path.join(packageRoot, "templates", templatePath), "utf8");
}

async function findConflicts(targetRoot: string, files: InstallFile[]): Promise<string[]> {
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
