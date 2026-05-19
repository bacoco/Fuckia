import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
    packageRoot: process.cwd(),
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

test("init --apply installs governance files and generated skills", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["init", "--apply"], directory);
    const agents = await readFile(path.join(directory, "AGENTS.md"), "utf8");
    const claude = await readFile(path.join(directory, "CLAUDE.md"), "utf8");
    const codexSkill = await readFile(
      path.join(directory, ".agents", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );
    const claudeSkill = await readFile(
      path.join(directory, ".claude", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );
    const workflow = await readFile(path.join(directory, ".github", "workflows", "collab-contract.yml"), "utf8");
    const checkpoint = await readFile(path.join(directory, "docs", "fuckia", "end-of-work-checkpoint.md"), "utf8");

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "applied"/);
    assert.match(agents, /Codex must follow Fuckia governance/);
    assert.match(claude, /Claude Code must follow Fuckia governance/);
    assert.match(codexSkill, /target: codex/);
    assert.match(claudeSkill, /target: claude/);
    assert.match(workflow, /Fuckia Collaboration Contract/);
    assert.match(checkpoint, /Current state:/);
  });
});

test("init --apply blocks on conflicts and writes nothing else", async () => {
  await withTempProject(async (directory) => {
    await writeFile(path.join(directory, "AGENTS.md"), "# Existing Rules\n", "utf8");
    const before = await snapshotTree(directory);
    const result = await capture(["init", "--apply"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 1);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"status": "blocked"/);
    assert.match(result.stdout, /AGENTS.md/);
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

test("migrate --plan writes only a migration plan", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    await writeFile(path.join(directory, "AGENTS.md"), "# Existing Rules\n", "utf8");
    const before = await snapshotTree(directory);
    const result = await capture(["migrate", "--plan"], directory);
    const after = await snapshotTree(directory);
    const plan = await readFile(path.join(directory, "docs", "fuckia", "migration-plan.md"), "utf8");

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "planned"/);
    assert.deepEqual(
      after.filter((file) => !before.includes(file)),
      ["docs/fuckia/migration-plan.md"]
    );
    assert.match(plan, /Existing Governance Inventory/);
    assert.match(plan, /AGENTS.md/);
  });
});

test("migrate --apply requires migration plan", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["migrate", "--apply"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 1);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /migration-plan.md is missing/);
  });
});

test("migrate --apply preserves conflicts and writes merge proposals", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    await writeFile(path.join(directory, "AGENTS.md"), "# Existing Rules\n", "utf8");
    await capture(["migrate", "--plan"], directory);
    const result = await capture(["migrate", "--apply"], directory);
    const agents = await readFile(path.join(directory, "AGENTS.md"), "utf8");
    const proposal = await readFile(
      path.join(directory, "docs", "fuckia", "merge-proposals", "AGENTS.md.md"),
      "utf8"
    );
    const codexSkill = await readFile(
      path.join(directory, ".agents", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "applied"/);
    assert.match(result.stdout, /"preserved": \[/);
    assert.equal(agents, "# Existing Rules\n");
    assert.match(proposal, /Merge Proposal: AGENTS.md/);
    assert.match(codexSkill, /target: codex/);
  });
});

test("migrate --apply blocks when merge proposal already exists", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    await writeFile(path.join(directory, "AGENTS.md"), "# Existing Rules\n", "utf8");
    await capture(["migrate", "--plan"], directory);
    await mkdir(path.join(directory, "docs", "fuckia", "merge-proposals"), { recursive: true });
    await writeFile(
      path.join(directory, "docs", "fuckia", "merge-proposals", "AGENTS.md.md"),
      "# Existing Proposal\n",
      "utf8"
    );
    const before = await snapshotTree(directory);
    const result = await capture(["migrate", "--apply"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 1);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /Merge proposal already exists/);
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

test("generate-skills --write --examples creates Claude and Codex outputs", async () => {
  await withTempProject(async (directory) => {
    await createSkillSource(directory);

    const result = await capture(["generate-skills", "--write", "--examples"], directory);
    const claudeSkill = await readFile(
      path.join(directory, "examples", "generated-skills", "claude", "demo-guard", "SKILL.md"),
      "utf8"
    );
    const codexSkill = await readFile(
      path.join(directory, "examples", "generated-skills", "codex", "demo-guard", "SKILL.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "written"/);
    assert.match(claudeSkill, /GENERATED FILE - DO NOT EDIT DIRECTLY/);
    assert.match(claudeSkill, /target: claude/);
    assert.match(claudeSkill, /## Claude Mechanics/);
    assert.match(codexSkill, /target: codex/);
    assert.match(codexSkill, /## Codex Mechanics/);
  });
});

test("generate-skills --check is read-only and fails on drift", async () => {
  await withTempProject(async (directory) => {
    await createSkillSource(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["generate-skills", "--check"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 1);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"status": "missing"/);
  });
});

test("generate-skills --check passes after examples are generated", async () => {
  await withTempProject(async (directory) => {
    await createSkillSource(directory);
    await capture(["generate-skills", "--write", "--examples"], directory);
    const result = await capture(["generate-skills", "--check"], directory);

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"drift": \[\]/);
  });
});

async function createSkillSource(directory: string): Promise<void> {
  const sourceDir = path.join(directory, "skills-src", "shared");
  await mkdir(sourceDir, { recursive: true });
  await writeFile(
    path.join(sourceDir, "demo-guard.skill.md"),
    [
      "---",
      "name: demo-guard",
      "description: Use when testing generated skill output.",
      "targets:",
      "  - claude",
      "  - codex",
      "---",
      "",
      "# Demo Guard",
      "",
      "Protect the real workflow before declaring Done.",
      ""
    ].join("\n"),
    "utf8"
  );
}
