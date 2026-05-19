import { execFile } from "node:child_process";

export interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface CommandRunner {
  run(command: string, args: string[], cwd: string, stdin?: string): Promise<CommandResult>;
}

export const nodeCommandRunner: CommandRunner = {
  run(command: string, args: string[], cwd: string, stdin?: string): Promise<CommandResult> {
    return new Promise((resolve) => {
      const child = execFile(command, args, { cwd, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        const rawCode = error && "code" in error ? (error as { code?: unknown }).code : undefined;
        const exitCode = typeof rawCode === "number" ? rawCode : error ? 1 : 0;

        resolve({
          exitCode,
          stdout: stdout.toString(),
          stderr: stderr.toString()
        });
      });

      if (stdin !== undefined && child.stdin) {
        child.stdin.end(stdin);
      }
    });
  }
};
