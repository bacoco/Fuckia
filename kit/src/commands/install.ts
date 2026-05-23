import type { CommandContext } from "../core/context";
import { formatHeading, formatJson } from "../core/output";
import type { ParsedArgs } from "../core/parseArgs";
import { directoryExists, fileExists } from "../fs/readTree";
import { parseAgentMode, resolveAgentMode, type AgentModeResolution, type ResolvedAgentModeResolution } from "../install/agentMode";
import { applyInit } from "../install/applyInit";
import { applyMigration } from "../install/migrateApply";
import { writeMigrationPlan } from "../install/migratePlan";
import { buildInitPlan } from "../plans/initPlan";
import { buildMigrationAudit } from "../plans/migrationAudit";

export interface InstallDryRun {
  mode: "dry-run";
  agentMode: AgentModeResolution;
  targetKind: "new" | "existing";
  targetRoot: string;
  writes: "none";
  plan: unknown;
  nextSteps: string[];
}

export interface InstallApplyResult {
  status: "applied" | "blocked";
  agentMode: AgentModeResolution;
  targetKind: "new" | "existing";
  targetRoot: string;
  steps: unknown[];
  blockers: string[];
  nextSteps: string[];
}

export async function runInstall(args: ParsedArgs, context: CommandContext): Promise<number> {
  const agentMode = parseAgentMode(args.values.get("agent-mode"));
  if (agentMode === null) {
    context.stderr("Error: --agent-mode must be auto, codex-only, claude-only, or dual-agent.\n");
    return 1;
  }

  const agentModeResolution = await resolveAgentMode(context.cwd, agentMode);
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("install --dry-run");
    const targetKind = await detectTargetKind(context.cwd);
    if (agentModeResolution.status === "ambiguous") {
      const report: InstallDryRun = {
        mode: "dry-run",
        agentMode: agentModeResolution,
        targetKind,
        targetRoot: context.cwd,
        writes: "none",
        plan: null,
        nextSteps: agentModeNextSteps()
      };
      context.stdout(formatHeading("Fuckia Install Dry Run"));
      context.stdout(formatJson(report));
      return 0;
    }

    const plan = targetKind === "new"
      ? await buildInitPlan(context.cwd, context.packageRoot, agentModeResolution.mode)
      : await buildMigrationAudit(context.cwd, agentModeResolution.mode);
    const report: InstallDryRun = {
      mode: "dry-run",
      agentMode: agentModeResolution,
      targetKind,
      targetRoot: context.cwd,
      writes: "none",
      plan,
      nextSteps: targetKind === "new"
        ? ["Run `fuckia install --apply --yes` after reviewing the file list."]
        : ["Run `fuckia migrate --plan`, review it, then run `fuckia migrate --apply` or `fuckia install --apply --yes`."]
    };
    context.stdout(formatHeading("Fuckia Install Dry Run"));
    context.stdout(formatJson(report));
    return 0;
  }

  if (args.flags.has("apply")) {
    if (!args.flags.has("yes")) {
      context.stderr("Error: install apply requires `--yes`.\n");
      return 1;
    }

    if (agentModeResolution.status === "ambiguous") {
      const targetKind = await detectTargetKind(context.cwd);
      const result: InstallApplyResult = {
        status: "blocked",
        agentMode: agentModeResolution,
        targetKind,
        targetRoot: context.cwd,
        steps: [],
        blockers: [agentModeResolution.question ?? "Agent mode is ambiguous."],
        nextSteps: agentModeNextSteps()
      };
      context.stdout(formatHeading("Fuckia Install Apply"));
      context.stdout(formatJson(result));
      return 1;
    }

    const result = await applyInstall(context.cwd, context.packageRoot, agentModeResolution);
    context.stdout(formatHeading("Fuckia Install Apply"));
    context.stdout(formatJson(result));
    return result.status === "applied" ? 0 : 1;
  }

  context.stderr("Error: use `fuckia install --dry-run` or `fuckia install --apply --yes`.\n");
  return 1;
}

async function applyInstall(
  targetRoot: string,
  packageRoot: string,
  agentMode: ResolvedAgentModeResolution
): Promise<InstallApplyResult> {
  const targetKind = await detectTargetKind(targetRoot);
  if (targetKind === "new") {
    const init = await applyInit({ targetRoot, packageRoot, agentMode: agentMode.mode });
    return {
      status: init.status,
      agentMode,
      targetKind,
      targetRoot,
      steps: [init],
      blockers: init.status === "blocked" ? init.conflicts : [],
      nextSteps: init.nextSteps
    };
  }

  const steps: unknown[] = [];
  if (!(await fileExists(`${targetRoot}/docs/fuckia/migration-plan.md`))) {
    const plan = await writeMigrationPlan({ targetRoot, packageRoot, agentMode: agentMode.mode });
    steps.push(plan);
    if (plan.status === "blocked") {
      return {
        status: "blocked",
        agentMode,
        targetKind,
        targetRoot,
        steps,
        blockers: [plan.blocker ?? "Migration plan failed."],
        nextSteps: ["Review existing migration plan or move it before running apply."]
      };
    }
  }

  const migration = await applyMigration({ targetRoot, packageRoot, agentMode: agentMode.mode });
  steps.push(migration);
  return {
    status: migration.status,
    agentMode,
    targetKind,
    targetRoot,
    steps,
    blockers: migration.status === "blocked" ? [migration.blocker ?? "Migration apply failed."] : [],
    nextSteps: migration.nextSteps
  };
}

function agentModeNextSteps(): string[] {
  return [
    "Choose one mode: `--agent-mode codex-only`, `--agent-mode claude-only`, or `--agent-mode dual-agent`.",
    "Use `codex-only` when only Codex will read repository instructions.",
    "Use `claude-only` when only Claude Code will read repository instructions.",
    "Use `dual-agent` when Claude and Codex both work in this repository."
  ];
}

async function detectTargetKind(targetRoot: string): Promise<"new" | "existing"> {
  const existingSignals: Array<{ path: string; kind: "file" | "directory" }> = [
    { path: "AGENTS.md", kind: "file" },
    { path: "CLAUDE.md", kind: "file" },
    { path: ".agents", kind: "directory" },
    { path: ".claude", kind: "directory" },
    { path: ".github/workflows", kind: "directory" },
    { path: "docs/fuckia", kind: "directory" },
    { path: "fuckia.config.yaml", kind: "file" }
  ];

  for (const signal of existingSignals) {
    const exists = signal.kind === "file"
      ? await fileExists(`${targetRoot}/${signal.path}`)
      : await directoryExists(`${targetRoot}/${signal.path}`);
    if (exists) {
      return "existing";
    }
  }

  return "new";
}
