import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { buildInitPlan } from "../plans/initPlan";

export async function runInit(args: ParsedArgs, context: CommandContext): Promise<number> {
  context.writeGuard.assertReadOnly("init");

  if (!args.flags.has("dry-run")) {
    context.stderr("Error: first slice supports only `fuckia init --dry-run`.\n");
    return 1;
  }

  const plan = await buildInitPlan(context.cwd);
  context.stdout(formatHeading("Fuckia Init Dry Run"));
  context.stdout(formatJson(plan));
  return 0;
}
