export interface ParsedArgs {
  command: string | null;
  flags: Set<string>;
  values: Map<string, string>;
  positionals: string[];
  raw: string[];
}

export function parseArgs(raw: string[]): ParsedArgs {
  const flags = new Set<string>();
  const values = new Map<string, string>();
  const positionals: string[] = [];
  let command: string | null = null;

  for (let index = 0; index < raw.length; index += 1) {
    const token = raw[index];

    if (token.startsWith("--")) {
      const flag = token.slice(2);
      const equalsIndex = flag.indexOf("=");
      if (equalsIndex >= 0) {
        values.set(flag.slice(0, equalsIndex), flag.slice(equalsIndex + 1));
        continue;
      }

      const next = raw[index + 1];
      if (next && !next.startsWith("-")) {
        values.set(flag, next);
        index += 1;
      } else {
        flags.add(flag);
      }
      continue;
    }

    if (token.startsWith("-")) {
      flags.add(token.slice(1));
      continue;
    }

    if (command === null) {
      command = token;
    } else {
      positionals.push(token);
    }
  }

  return { command, flags, values, positionals, raw };
}
