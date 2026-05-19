import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { buildMigrationAudit } from "../plans/migrationAudit";

export async function runMigrate(args: ParsedArgs, context: CommandContext): Promise<number> {
  context.writeGuard.assertReadOnly("migrate");

  if (!args.flags.has("dry-run")) {
    context.stderr("Error: first slice supports only `fuckia migrate --dry-run`.\n");
    return 1;
  }

  const audit = await buildMigrationAudit(context.cwd);
  context.stdout(formatHeading("Fuckia Migration Dry Run"));
  context.stdout(formatJson(audit));
  return 0;
}
