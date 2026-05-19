import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { runCli } from "../src/core/runCli";
import { snapshotTree } from "../src/fs/readTree";

async function withTempProject(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), "fuckia-test-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function createMinimalProject(directory: string): Promise<void> {
  await writeFile(path.join(directory, "README.md"), "# Fixture\n", "utf8");
  await mkdir(path.join(directory, "vibe-coding"), { recursive: true });
  await writeFile(path.join(directory, "vibe-coding", "README.md"), "# Fixture Map\n", "utf8");
}

async function capture(command: string[], cwd: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  let stdout = "";
  let stderr = "";
  const exitCode = await runCli(command, {
    cwd,
    stdout: (message) => {
      stdout += message;
    },
    stderr: (message) => {
      stderr += message;
    }
  });

  return { exitCode, stdout, stderr };
}

test("--help prints usage", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["--help"], directory);
    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /fuckia doctor/);
    assert.equal(result.stderr, "");
  });
});

test("init --dry-run writes nothing", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["init", "--dry-run"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"mode": "dry-run"/);
    assert.match(result.stdout, /"AGENTS.md"/);
  });
});

test("migrate --dry-run writes nothing and reports existing instructions", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    await writeFile(path.join(directory, "AGENTS.md"), "# Existing Rules\n", "utf8");
    const before = await snapshotTree(directory);
    const result = await capture(["migrate", "--dry-run"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"mode": "dry-run"/);
    assert.match(result.stdout, /AGENTS.md already exists/);
  });
});

test("doctor is read-only", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["doctor"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /writes: blocked/);
  });
});
