import type { CommandResult, CommandRunner } from "./runner";

export async function runGhJson<T>(
  runner: CommandRunner,
  cwd: string,
  args: string[]
): Promise<{ ok: true; value: T } | { ok: false; message: string }> {
  const result = await runner.run("gh", args, cwd);
  if (result.exitCode !== 0) {
    return { ok: false, message: formatCommandFailure(result) };
  }

  try {
    return { ok: true, value: JSON.parse(result.stdout) as T };
  } catch {
    return { ok: false, message: "GitHub CLI returned non-JSON output" };
  }
}

export function formatCommandFailure(result: CommandResult): string {
  const stderr = result.stderr.trim();
  const stdout = result.stdout.trim();
  if (stderr.length > 0) {
    return stderr;
  }
  if (stdout.length > 0) {
    return stdout;
  }
  return `exit code ${result.exitCode}`;
}
