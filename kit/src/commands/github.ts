import type { CommandContext } from "../core/context";
import { formatHeading, formatJson } from "../core/output";
import type { ParsedArgs } from "../core/parseArgs";
import { applyGitHubRemote } from "../github/apply";
import { auditGitHubRemote } from "../github/audit";

export async function runGithub(args: ParsedArgs, context: CommandContext): Promise<number> {
  if (args.flags.has("dry-run")) {
    context.writeGuard.assertReadOnly("github --dry-run");
    const report = await auditGitHubRemote({ targetRoot: context.cwd });
    context.stdout(formatHeading("Fuckia GitHub Dry Run"));
    context.stdout(formatJson(report));

    if (args.flags.has("strict") && report.checks.some((check) => check.status === "fail")) {
      return 1;
    }

    return 0;
  }

  if (args.flags.has("apply")) {
    const report = await applyGitHubRemote({
      targetRoot: context.cwd,
      approveRemoteWrites: args.flags.has("yes")
    });
    context.stdout(formatHeading("Fuckia GitHub Apply"));
    context.stdout(formatJson(report));
    return report.status === "applied" || report.status === "already-configured" ? 0 : 1;
  }

  context.stderr("Error: use `fuckia github --dry-run`, `fuckia github --dry-run --strict`, or `fuckia github --apply --yes`.\n");
  return 1;
}
