import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileExists } from "../fs/readTree";
import { buildInstallFiles, type InitApplyFile } from "./applyInit";

export interface MigrateApplyOptions {
  packageRoot: string;
  targetRoot: string;
}

export interface MigrateApplyResult {
  status: "applied" | "blocked";
  targetRoot: string;
  written: InitApplyFile[];
  preserved: string[];
  mergeProposals: InitApplyFile[];
  blocker: string | null;
  nextSteps: string[];
}

const planPath = "docs/fuckia/migration-plan.md";

export async function applyMigration(options: MigrateApplyOptions): Promise<MigrateApplyResult> {
  if (!(await fileExists(path.join(options.targetRoot, planPath)))) {
    return {
      status: "blocked",
      targetRoot: options.targetRoot,
      written: [],
      preserved: [],
      mergeProposals: [],
      blocker: `${planPath} is missing.`,
      nextSteps: ["Run `fuckia migrate --plan` before `fuckia migrate --apply`."]
    };
  }

  const installFiles = await buildInstallFiles(options);
  const proposalConflicts = await findMergeProposalConflicts(options.targetRoot, installFiles);
  if (proposalConflicts.length > 0) {
    return {
      status: "blocked",
      targetRoot: options.targetRoot,
      written: [],
      preserved: [],
      mergeProposals: [],
      blocker: `Merge proposal already exists: ${proposalConflicts.join(", ")}`,
      nextSteps: ["Review or move existing merge proposals before re-running `fuckia migrate --apply`."]
    };
  }

  const written: InitApplyFile[] = [];
  const preserved: string[] = [];
  const mergeProposals: InitApplyFile[] = [];

  for (const file of installFiles) {
    const targetPath = path.join(options.targetRoot, file.relativePath);
    if (await fileExists(targetPath)) {
      preserved.push(file.relativePath);
      const proposal = buildMergeProposal(file.relativePath, file.source, file.content);
      const proposalPath = mergeProposalPath(file.relativePath);
      await writeNewFile(options.targetRoot, proposalPath, proposal);
      mergeProposals.push({ path: normalizePath(proposalPath), source: file.source });
      continue;
    }

    await writeNewFile(options.targetRoot, file.relativePath, file.content);
    written.push({ path: file.relativePath, source: file.source });
  }

  return {
    status: "applied",
    targetRoot: options.targetRoot,
    written,
    preserved,
    mergeProposals,
    blocker: null,
    nextSteps: [
      "Review merge proposals before editing existing governance files.",
      "Run `fuckia doctor` from the target repository.",
      "Keep warning mode until GitHub and Linear gates are configured."
    ]
  };
}

async function findMergeProposalConflicts(targetRoot: string, files: Array<{ relativePath: string }>): Promise<string[]> {
  const conflicts: string[] = [];
  for (const file of files) {
    if (await fileExists(path.join(targetRoot, file.relativePath))) {
      const proposalPath = mergeProposalPath(file.relativePath);
      if (await fileExists(path.join(targetRoot, proposalPath))) {
        conflicts.push(normalizePath(proposalPath));
      }
    }
  }
  return conflicts;
}

function buildMergeProposal(relativePath: string, source: string, content: string): string {
  return [
    `# Merge Proposal: ${relativePath}`,
    "",
    "Fuckia did not overwrite the existing file.",
    "",
    `Target file: \`${relativePath}\``,
    `Source: \`${source}\``,
    "",
    "Review the existing file and merge the relevant governance rules manually.",
    "",
    "## Proposed Content",
    "",
    "````text",
    content.trimEnd(),
    "````",
    ""
  ].join("\n");
}

async function writeNewFile(targetRoot: string, relativePath: string, content: string): Promise<void> {
  const absolutePath = path.join(targetRoot, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, { encoding: "utf8", flag: "wx" });
}

function safeFileName(relativePath: string): string {
  return normalizePath(relativePath).replace(/[^a-zA-Z0-9._-]+/g, "__");
}

function mergeProposalPath(relativePath: string): string {
  return normalizePath(path.join("docs", "fuckia", "merge-proposals", `${safeFileName(relativePath)}.md`));
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
