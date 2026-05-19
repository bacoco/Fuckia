import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { applyMigration } from "../install/migrateApply";
import { writeMigrationPlan } from "../install/migratePlan";
import { buildMigrationAudit } from "../plans/migrationAudit";

export async function runMigrate(args: ParsedArgs, context: CommandContext): Promise<number> {
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("migrate --dry-run");
    const audit = await buildMigrationAudit(context.cwd);
    context.stdout(formatHeading("Fuckia Migration Dry Run"));
    context.stdout(formatJson(audit));
    return 0;
  }

  if (args.flags.has("plan")) {
    const result = await writeMigrationPlan({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd
    });
    context.stdout(formatHeading("Fuckia Migration Plan"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  if (args.flags.has("apply")) {
    const result = await applyMigration({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd
    });
    context.stdout(formatHeading("Fuckia Migration Apply"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  context.stderr("Error: use `fuckia migrate --dry-run`, `fuckia migrate --plan`, or `fuckia migrate --apply`.\n");
  return 1;
}
