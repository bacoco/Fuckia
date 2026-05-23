import type { CommandContext } from "../core/context";
import type { ParsedArgs } from "../core/parseArgs";
import { formatHeading, formatJson } from "../core/output";
import { parseAgentMode, resolveAgentMode } from "../install/agentMode";
import { applyInit } from "../install/applyInit";
import { buildInitPlan } from "../plans/initPlan";

export async function runInit(args: ParsedArgs, context: CommandContext): Promise<number> {
  const agentMode = parseAgentMode(args.values.get("agent-mode"));
  if (agentMode === null) {
    context.stderr("Error: --agent-mode must be auto, codex-only, claude-only, or dual-agent.\n");
    return 1;
  }

  const agentModeResolution = await resolveAgentMode(context.cwd, agentMode);
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("init --dry-run");
    const plan = agentModeResolution.status === "resolved"
      ? await buildInitPlan(context.cwd, context.packageRoot, agentModeResolution.mode)
      : {
        mode: "dry-run",
        agentMode: agentModeResolution,
        targetRoot: context.cwd,
        writes: "none",
        nextSteps: [
          "Choose one mode: `--agent-mode codex-only`, `--agent-mode claude-only`, or `--agent-mode dual-agent`."
        ]
      };
    context.stdout(formatHeading("Fuckia Init Dry Run"));
    context.stdout(formatJson(plan));
    return 0;
  }

  if (args.flags.has("apply")) {
    if (agentModeResolution.status === "ambiguous") {
      context.stdout(formatHeading("Fuckia Init Apply"));
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

    const result = await applyInit({
      packageRoot: context.packageRoot,
      targetRoot: context.cwd,
      agentMode: agentModeResolution.mode
    });
    context.stdout(formatHeading("Fuckia Init Apply"));
    context.stdout(formatJson(result));
    return result.status === "blocked" ? 1 : 0;
  }

  context.stderr("Error: use `fuckia init --dry-run` or `fuckia init --apply`.\n");
  return 1;
}
