import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { parseAgentMode, resolveAgentMode } from "../install/agentMode";
import { applyMigration } from "../install/migrateApply";
import { writeMigrationPlan } from "../install/migratePlan";
import { buildMigrationAudit } from "../plans/migrationAudit";

export async function runMigrate(args: ParsedArgs, context: CommandContext): Promise<number> {
  const agentMode = parseAgentMode(args.values.get("agent-mode"));
  if (agentMode === null) {
    context.stderr("Error: --agent-mode must be auto, codex-only, claude-only, or dual-agent.\n");
    return 1;
  }

  const agentModeResolution = await resolveAgentMode(context.cwd, agentMode);
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("migrate --dry-run");
    const audit = agentModeResolution.status === "resolved"
      ? await buildMigrationAudit(context.cwd, agentModeResolution.mode)
      : {
        mode: "dry-run",
        agentMode: agentModeResolution,
        targetRoot: context.cwd,
        inventory: [],
        conflicts: [agentModeResolution.question],
        nextSteps: [
          "Rerun with `--agent-mode codex-only`, `--agent-mode claude-only`, or `--agent-mode dual-agent`."
        ],
        writePolicy: "No files were written. Agent mode is ambiguous."
      };
    context.stdout(formatHeading("Fuckia Migration Dry Run"));
    context.stdout(formatJson(audit));
    return 0;
  }

  if (agentModeResolution.status === "ambiguous") {
    context.stdout(formatHeading(args.flags.has("plan") ? "Fuckia Migration Plan" : "Fuckia Migration Apply"));
    context.stdout(formatJson({
      status: "blocked",
      agentMode: agentModeResolution,
      blockers: [agentModeResolution.question],
      nextSteps: [
        "Rerun with `--agent-mode codex-only`, `--agent-mode claude-only`, or `--agent-mode dual-agent`."
      ]
    }));
    return 1;
  }

  if (args.flags.has("plan")) {
    const result = await writeMigrationPlan({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd,
      agentMode: agentModeResolution.mode
    });
    context.stdout(formatHeading("Fuckia Migration Plan"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  if (args.flags.has("apply")) {
    const result = await applyMigration({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd,
      agentMode: agentModeResolution.mode
    });
    context.stdout(formatHeading("Fuckia Migration Apply"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  context.stderr("Error: use `fuckia migrate --dry-run`, `fuckia migrate --plan`, or `fuckia migrate --apply`.\n");
  return 1;
}
