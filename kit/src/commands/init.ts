import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { applyInit } from "../install/applyInit";
import { buildInitPlan } from "../plans/initPlan";

export async function runInit(args: ParsedArgs, context: CommandContext): Promise<number> {
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("init --dry-run");
    const plan = await buildInitPlan(context.cwd, context.packageRoot);
    context.stdout(formatHeading("Fuckia Init Dry Run"));
    context.stdout(formatJson(plan));
    return 0;
  }

  if (args.flags.has("apply")) {
    const result = await applyInit({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd
    });
    context.stdout(formatHeading("Fuckia Init Apply"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  context.stderr("Error: use `fuckia init --dry-run` or `fuckia init --apply`.\n");
  return 1;
}
