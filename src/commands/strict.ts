import type { CommandContext } from "../core/context";
import { formatHeading, formatJson } from "../core/output";
import type { ParsedArgs } from "../core/parseArgs";
import { applyStrictMode, checkStrictMode } from "../strict/check";

export async function runStrict(args: ParsedArgs, context: CommandContext): Promise<number> {
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("strict --dry-run");
    const report = await checkStrictMode(context.cwd);
    context.stdout(formatHeading("Fuckia Strict Dry Run"));
    context.stdout(formatJson(report));
    return args.flags.has("strict") && report.findings.some((finding) => finding.level === "fail") ? 1 : 0;
  }

  if (args.flags.has("apply")) {
    const result = await applyStrictMode(context.cwd);
    context.stdout(formatHeading("Fuckia Strict Apply"));
    context.stdout(formatJson(result));
    return result.status === "applied" ? 0 : 1;
  }

  context.stderr("Error: use `fuckia strict --dry-run [--strict]` or `fuckia strict --apply`.\n");
  return 1;
}

