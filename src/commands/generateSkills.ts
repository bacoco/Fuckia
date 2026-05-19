import type { CommandContext } from "../core/context";
import { formatHeading, formatJson } from "../core/output";
import type { ParsedArgs } from "../core/parseArgs";
import { generateSharedSkills } from "../skills/generateSharedSkills";

export async function runGenerateSkills(args: ParsedArgs, context: CommandContext): Promise<number> {
  const write = args.flags.has("write");
  const check = args.flags.has("check") || !write;
  const examples = args.flags.has("examples");

  if (write && !examples) {
    context.stderr("Error: generated skill writes are limited to `--write --examples`.\n");
    return 1;
  }

  if (!write) {
    context.writeGuard.assertReadOnly("generate-skills --check");
  }

  const result = await generateSharedSkills({
    rootDir: context.cwd,
    mode: write ? "write" : "check"
  });

  context.stdout(formatHeading(write ? "Fuckia Generate Skills" : "Fuckia Skill Check"));
  context.stdout(formatJson(result));

  if (check && result.drift.length > 0) {
    return 1;
  }

  return 0;
}
