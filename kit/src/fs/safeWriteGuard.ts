export interface WriteGuard {
  assertReadOnly(commandName: string): void;
  assertCanWrite(path: string): never;
}

export function createNoWriteGuard(): WriteGuard {
  return {
    assertReadOnly() {
      return;
    },
    assertCanWrite(path: string): never {
      throw new Error(`Write blocked by first-slice read-only guard: ${path}`);
    }
  };
}
