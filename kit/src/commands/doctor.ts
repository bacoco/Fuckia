import { checkEvidenceLanguage } from "../checks/docsLanguage";
import { checkGeneratedFileHeaders } from "../checks/generatedFiles";
import { checkRepositoryStructure } from "../checks/repoStructure";
import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatBulletList, formatHeading } from "../core/output";
import { directoryExists } from "../fs/readTree";

export async function runDoctor(args: ParsedArgs, context: CommandContext): Promise<number> {
  context.writeGuard.assertReadOnly("doctor");

  const rootDir = context.cwd;
  const isSelf = args.flags.has("self");
  const strict = args.flags.has("strict");
  const gitDirectoryExists = await directoryExists(`${rootDir}/.git`);

  const structure = await checkRepositoryStructure(rootDir);
  const language = await checkEvidenceLanguage(rootDir);
  const generated = await checkGeneratedFileHeaders(rootDir);

  const warnings = [
    ...structure.filter((finding) => finding.level === "warning").map((finding) => `${finding.path}: ${finding.message}`),
    ...language.map((finding) => `${finding.file}:${finding.line}: ${finding.message} (${finding.phrase})`),
    ...generated.map((finding) => `${finding.file}: ${finding.message}`),
    ...(gitDirectoryExists ? [] : [".git: Git repository metadata is missing."])
  ];

  const okChecks = [
    `mode: ${isSelf ? "self" : "project"}`,
    `root: ${rootDir}`,
    `git: ${gitDirectoryExists ? "present" : "missing"}`,
    `structure checks: ${structure.length}`,
    `language findings: ${language.length}`,
    `generated file findings: ${generated.length}`,
    "writes: blocked"
  ];

  context.stdout(formatHeading("Fuckia Doctor"));
  context.stdout(formatBulletList(okChecks));

  if (warnings.length > 0) {
    context.stdout("\n");
    context.stdout(formatHeading(strict ? "Blocking Findings" : "Warnings"));
    context.stdout(formatBulletList(warnings));
  }

  if (strict && warnings.length > 0) {
    return 1;
  }

  return 0;
}
