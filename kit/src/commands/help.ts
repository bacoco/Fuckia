import type { CommandContext } from "../core/context";
import { formatHelp } from "../core/output";

export function runHelp(context: CommandContext): number {
  context.stdout(formatHelp());
  return 0;
}
