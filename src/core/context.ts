import { createNoWriteGuard, type WriteGuard } from "../fs/safeWriteGuard";

export interface CommandContext {
  cwd: string;
  stdout: (message: string) => void;
  stderr: (message: string) => void;
  writeGuard: WriteGuard;
}

export interface RunCliContext {
  cwd: string;
  stdout: (message: string) => void;
  stderr: (message: string) => void;
}

export function createCommandContext(context: RunCliContext): CommandContext {
  return {
    ...context,
    writeGuard: createNoWriteGuard()
  };
}
