import type { CommandContext } from "../core/context";
import { formatHeading, formatJson } from "../core/output";
import type { ParsedArgs } from "../core/parseArgs";
import { applyLinear, dryRunLinear } from "../linear/setup";

export async function runLinear(args: ParsedArgs, context: CommandContext): Promise<number> {
  const teamKey = args.values.get("team");

  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("linear --dry-run");
    const report = await dryRunLinear({ targetRoot: context.cwd, teamKey });
    context.stdout(formatHeading("Fuckia Linear Dry Run"));
    context.stdout(formatJson(report));

    if (args.flags.has("strict") && report.blockers.length > 0) {
      return 1;
    }

    return 0;
  }

  if (args.flags.has("apply")) {
    const result = await applyLinear({
      targetRoot: context.cwd,
      teamKey,
      approveRemoteWrites: args.flags.has("yes")
    });
    context.stdout(formatHeading("Fuckia Linear Apply"));
    context.stdout(formatJson(result));
    return result.status === "applied" ? 0 : 1;
  }

  context.stderr("Error: use `fuckia linear --dry-run [--team <TEAM_KEY>]` or `fuckia linear --apply --yes --team <TEAM_KEY>`.\n");
  return 1;
}

