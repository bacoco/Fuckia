import path from "node:path";
import { directoryExists, fileExists, walkDirectories } from "../fs/readTree";

export type FindingLevel = "ok" | "warning";

export interface StructureFinding {
  level: FindingLevel;
  check: string;
  path: string;
  message: string;
}

const ignoredDirectories = new Set([".git", "node_modules", "dist"]);

export async function checkRepositoryStructure(rootDir: string): Promise<StructureFinding[]> {
  const findings: StructureFinding[] = [];

  await pushPresenceFinding(findings, rootDir, "README.md", "root-readme", "Root README exists.");
  await pushPresenceFinding(findings, rootDir, "vibe-coding", "vibe-coding-directory", "Vibe Coding directory exists.", true);

  const directories = await walkDirectories(rootDir, {
    ignoredDirectories: Array.from(ignoredDirectories)
  });

  for (const directory of directories) {
    const relativePath = normalizePath(path.relative(rootDir, directory)) || ".";
    if (relativePath === ".") {
      continue;
    }

    const readmePath = path.join(directory, "README.md");
    const hasReadme = await fileExists(readmePath);
    findings.push({
      level: hasReadme ? "ok" : "warning",
      check: "directory-readme",
      path: relativePath,
      message: hasReadme ? "Directory README exists." : "Directory lacks README.md."
    });
  }

  return findings;
}

async function pushPresenceFinding(
  findings: StructureFinding[],
  rootDir: string,
  relativePath: string,
  check: string,
  okMessage: string,
  isDirectory = false
): Promise<void> {
  const absolutePath = path.join(rootDir, relativePath);
  const exists = isDirectory ? await directoryExists(absolutePath) : await fileExists(absolutePath);
  findings.push({
    level: exists ? "ok" : "warning",
    check,
    path: relativePath,
    message: exists ? okMessage : `${relativePath} is missing.`
  });
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
