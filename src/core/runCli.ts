import { runDoctor } from "../commands/doctor";
import { runGenerateSkills } from "../commands/generateSkills";
import { runHelp } from "../commands/help";
import { runInit } from "../commands/init";
import { runMigrate } from "../commands/migrate";
import { createCommandContext, type RunCliContext } from "./context";
import { parseArgs } from "./parseArgs";

export async function runCli(rawArgs: string[], rawContext: RunCliContext): Promise<number> {
  const args = parseArgs(rawArgs);
  const context = createCommandContext(rawContext);

  if (args.flags.has("help") || args.flags.has("h") || args.command === null) {
    return runHelp(context);
  }

  try {
    switch (args.command) {
      case "doctor":
        return await runDoctor(args, context);
      case "init":
        return await runInit(args, context);
      case "migrate":
        return await runMigrate(args, context);
      case "generate-skills":
        return await runGenerateSkills(args, context);
      default:
        context.stderr(`Error: unknown command \`${args.command}\`.\n\n`);
        runHelp(context);
        return 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.stderr(`Error: ${message}\n`);
    return 1;
  }
}
