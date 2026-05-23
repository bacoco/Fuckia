import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { runCli } from "../src/core/runCli";
import { snapshotTree } from "../src/fs/readTree";
import { applyGitHubRemote } from "../src/github/apply";
import { auditGitHubRemote } from "../src/github/audit";
import { parseGitHubRemote } from "../src/github/remote";
import type { CommandResult, CommandRunner } from "../src/github/runner";
import { applyLinear, dryRunLinear } from "../src/linear/setup";
import type { LinearClient, LinearIssue, LinearTeam } from "../src/linear/client";
import { applyStrictMode, checkStrictMode } from "../src/strict/check";

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
  await mkdir(path.join(directory, "docs", "vibe-coding"), { recursive: true });
  await writeFile(path.join(directory, "docs", "vibe-coding", "README.md"), "# Fixture Map\n", "utf8");
}

async function createInstalledGithubFiles(directory: string): Promise<void> {
  await mkdir(path.join(directory, ".github", "workflows"), { recursive: true });
  await writeFile(path.join(directory, ".github", "PULL_REQUEST_TEMPLATE.md"), "# PR\n", "utf8");
  await writeFile(path.join(directory, ".github", "workflows", "collab-contract.yml"), "name: Contract\n", "utf8");
  await writeFile(path.join(directory, ".github", "workflows", "generated-skills.yml"), "name: Skills\n", "utf8");
  await writeFile(path.join(directory, ".github", "workflows", "pr-scope.yml"), "name: Scope\n", "utf8");
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
    assert.match(result.stdout, /fuckia github --dry-run/);
    assert.match(result.stdout, /fuckia github --apply --yes/);
    assert.match(result.stdout, /fuckia linear --dry-run/);
    assert.match(result.stdout, /fuckia strict --dry-run/);
    assert.equal(result.stderr, "");
  });
});

test("init --dry-run writes nothing", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["init", "--dry-run", "--agent-mode", "dual-agent"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"mode": "dry-run"/);
    assert.match(result.stdout, /"AGENTS.md"/);
  });
});

test("install --dry-run detects new project and writes nothing", async () => {
  await withTempProject(async (directory) => {
    const before = await snapshotTree(directory);
    const result = await capture(["install", "--dry-run", "--agent-mode", "dual-agent"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"targetKind": "new"/);
    assert.match(result.stdout, /AGENTS.md/);
  });
});

test("install --dry-run auto asks for agent mode when ambiguous", async () => {
  await withTempProject(async (directory) => {
    const before = await snapshotTree(directory);
    const result = await capture(["install", "--dry-run"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 0);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"status": "ambiguous"/);
    assert.match(result.stdout, /Codex only, Claude only, or both/);
  });
});

test("install --apply auto blocks before writing when agent mode is ambiguous", async () => {
  await withTempProject(async (directory) => {
    const before = await snapshotTree(directory);
    const result = await capture(["install", "--apply", "--yes"], directory);
    const after = await snapshotTree(directory);

    assert.equal(result.exitCode, 1);
    assert.deepEqual(after, before);
    assert.match(result.stdout, /"status": "blocked"/);
    assert.match(result.stdout, /--agent-mode codex-only/);
  });
});

test("install --apply --yes installs new project governance", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["install", "--apply", "--yes", "--agent-mode", "dual-agent"], directory);
    const readme = await readFile(path.join(directory, "README.md"), "utf8");
    const agents = await readFile(path.join(directory, "AGENTS.md"), "utf8");

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"targetKind": "new"/);
    assert.match(result.stdout, /"status": "applied"/);
    assert.match(readme, /Fuckia governance is installed/);
    assert.match(agents, /Codex must follow Fuckia governance/);
  });
});

test("install --apply supports codex-only mode", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["install", "--apply", "--yes", "--agent-mode", "codex-only"], directory);
    const files = await snapshotTree(directory);
    const config = await readFile(path.join(directory, "fuckia.config.yaml"), "utf8");
    const workflow = await readFile(path.join(directory, ".github", "workflows", "generated-skills.yml"), "utf8");
    const codexSkill = await readFile(
      path.join(directory, ".agents", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(config, /agent_mode: codex-only/);
    assert.match(workflow, /agent_mode=/);
    assert.match(codexSkill, /target: codex/);
    assert.equal(files.includes("AGENTS.md"), true);
    assert.equal(files.includes("CLAUDE.md"), false);
    assert.equal(files.some((file) => file.startsWith(".claude/")), false);
  });
});

test("install --apply supports claude-only mode", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["install", "--apply", "--yes", "--agent-mode", "claude-only"], directory);
    const files = await snapshotTree(directory);
    const config = await readFile(path.join(directory, "fuckia.config.yaml"), "utf8");
    const claudeSkill = await readFile(
      path.join(directory, ".claude", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(config, /agent_mode: claude-only/);
    assert.match(claudeSkill, /target: claude/);
    assert.equal(files.includes("CLAUDE.md"), true);
    assert.equal(files.includes("AGENTS.md"), false);
    assert.equal(files.some((file) => file.startsWith(".agents/")), false);
  });
});

test("init --apply installs governance files and generated skills", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["init", "--apply", "--agent-mode", "dual-agent"], directory);
    const readme = await readFile(path.join(directory, "README.md"), "utf8");
    const agents = await readFile(path.join(directory, "AGENTS.md"), "utf8");
    const claude = await readFile(path.join(directory, "CLAUDE.md"), "utf8");
    const codexSkill = await readFile(
      path.join(directory, ".agents", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );
    const githubReadme = await readFile(path.join(directory, ".github", "README.md"), "utf8");
    const claudeSkill = await readFile(
      path.join(directory, ".claude", "skills", "adversarial-implementer-guard", "SKILL.md"),
      "utf8"
    );
    const workflow = await readFile(path.join(directory, ".github", "workflows", "collab-contract.yml"), "utf8");
    const checkpoint = await readFile(path.join(directory, "docs", "fuckia", "end-of-work-checkpoint.md"), "utf8");
    const linearTemplate = await readFile(
      path.join(directory, "docs", "fuckia", "linear", "templates", "plan-review.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "applied"/);
    assert.match(readme, /Fuckia governance is installed/);
    assert.match(agents, /Codex must follow Fuckia governance/);
    assert.match(claude, /Claude Code must follow Fuckia governance/);
    assert.match(codexSkill, /target: codex/);
    assert.match(claudeSkill, /target: claude/);
    assert.match(githubReadme, /GitHub Templates/);
    assert.match(workflow, /Fuckia Collaboration Contract/);
    assert.match(checkpoint, /Current state:/);
    assert.match(linearTemplate, /Adversarial Implementer Pass/);
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
    assert.match(plan, /agent mode: `codex-only`/);
    assert.match(plan, /AGENTS.md/);
  });
});

test("migrate --apply requires migration plan", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    const before = await snapshotTree(directory);
    const result = await capture(["migrate", "--apply", "--agent-mode", "dual-agent"], directory);
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

test("doctor ignores local npm cache directories", async () => {
  await withTempProject(async (directory) => {
    await createMinimalProject(directory);
    await mkdir(path.join(directory, ".git"), { recursive: true });
    await writeFile(path.join(directory, "docs", "README.md"), "# Docs\n", "utf8");
    await mkdir(path.join(directory, ".npm-cache", "_cacache", "tmp"), { recursive: true });
    const result = await capture(["doctor", "--strict"], directory);

    assert.equal(result.exitCode, 0);
    assert.doesNotMatch(result.stdout, /\.npm-cache/);
  });
});

test("generate-skills --write --examples creates Claude and Codex outputs", async () => {
  await withTempProject(async (directory) => {
    await createSkillSource(directory);

    const result = await capture(["generate-skills", "--write", "--examples"], directory);
    const claudeSkill = await readFile(
      path.join(directory, "kit", "generated-skills", "claude-demo-guard.md"),
      "utf8"
    );
    const codexSkill = await readFile(
      path.join(directory, "kit", "generated-skills", "codex-demo-guard.md"),
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

test("generate-skills --write --install creates installed Claude and Codex outputs", async () => {
  await withTempProject(async (directory) => {
    await createSkillSource(directory);

    const result = await capture(["generate-skills", "--write", "--install"], directory);
    const claudeSkill = await readFile(
      path.join(directory, ".claude", "skills", "demo-guard", "SKILL.md"),
      "utf8"
    );
    const codexSkill = await readFile(
      path.join(directory, ".agents", "skills", "demo-guard", "SKILL.md"),
      "utf8"
    );

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /"status": "written"/);
    assert.match(claudeSkill, /target: claude/);
    assert.match(codexSkill, /target: codex/);
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

test("parseGitHubRemote accepts supported github.com remote formats", () => {
  const remotes = [
    "https://github.com/bacoco/Fuckia.git",
    "https://github.com/bacoco/Fuckia",
    "git@github.com:bacoco/Fuckia.git",
    "ssh://git@github.com/bacoco/Fuckia.git"
  ];

  for (const remote of remotes) {
    const parsed = parseGitHubRemote(remote);
    assert.equal(parsed?.fullName, "bacoco/Fuckia");
    assert.equal(parsed?.webUrl, "https://github.com/bacoco/Fuckia");
  }

  assert.equal(parseGitHubRemote("https://gitlab.com/bacoco/Fuckia.git"), null);
});

test("github audit is read-only and reports remote readiness", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const before = await snapshotTree(directory);
    const report = await auditGitHubRemote({
      targetRoot: directory,
      runner: fakeRunner({
        "git remote get-url origin": ok("git@github.com:bacoco/Fuckia.git\n"),
        "gh --version": ok("gh version 2.0.0\n"),
        "gh auth status": ok("Logged in\n"),
        "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
          default_branch: "main",
          permissions: { admin: true, push: true, pull: true }
        })),
        "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
          enabled: true,
          allowed_actions: "all"
        })),
        "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([{ id: 1, name: "Fuckia" }])),
        "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": ok(JSON.stringify({
          strict: true,
          contexts: ["contract", "generated-skills", "scope"],
          checks: []
        })),
        "gh api repos/bacoco/Fuckia/branches/main/protection": ok(JSON.stringify({
          required_pull_request_reviews: null
        }))
      })
    });
    const after = await snapshotTree(directory);

    assert.deepEqual(after, before);
    assert.equal(report.remote?.fullName, "bacoco/Fuckia");
    assert.equal(report.defaultBranch, "main");
    assert.equal(report.remoteWrites, "none");
    assert.equal(report.checks.every((check) => check.status === "pass"), true);
  });
});

test("github audit reports missing required checks without writing", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const before = await snapshotTree(directory);
    const report = await auditGitHubRemote({
      targetRoot: directory,
      runner: fakeRunner({
        "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
        "gh --version": ok("gh version 2.0.0\n"),
        "gh auth status": ok("Logged in\n"),
        "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
          default_branch: "main",
          permissions: { admin: false, push: true, pull: true }
        })),
        "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
          enabled: true,
          allowed_actions: "all"
        })),
        "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([])),
        "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": ok(JSON.stringify({
          strict: true,
          contexts: ["contract"],
          checks: []
        })),
        "gh api repos/bacoco/Fuckia/branches/main/protection": ok(JSON.stringify({
          required_pull_request_reviews: null
        }))
      })
    });
    const after = await snapshotTree(directory);
    const requiredChecks = report.checks.find((check) => check.id === "github:required-checks");
    const permissions = report.checks.find((check) => check.id === "github:permissions");

    assert.deepEqual(after, before);
    assert.equal(requiredChecks?.status, "fail");
    assert.match(requiredChecks?.message ?? "", /generated-skills, scope/);
    assert.equal(permissions?.status, "warning");
    assert.equal(report.nextSteps.includes("Configure required GitHub checks only after installed workflows are pushed to the default branch."), true);
  });
});

test("github audit warns when existing branch protection requires GitHub approvals", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const report = await auditGitHubRemote({
      targetRoot: directory,
      runner: fakeRunner({
        "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
        "gh --version": ok("gh version 2.0.0\n"),
        "gh auth status": ok("Logged in\n"),
        "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
          default_branch: "main",
          permissions: { admin: true, push: true, pull: true }
        })),
        "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
          enabled: true,
          allowed_actions: "all"
        })),
        "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([])),
        "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": ok(JSON.stringify({
          strict: true,
          contexts: ["contract", "generated-skills", "scope"],
          checks: []
        })),
        "gh api repos/bacoco/Fuckia/branches/main/protection": ok(JSON.stringify({
          required_pull_request_reviews: {
            required_approving_review_count: 1,
            require_last_push_approval: true
          }
        }))
      })
    });
    const reviewGate = report.checks.find((check) => check.id === "github:review-platform-gate");

    assert.equal(reviewGate?.status, "warning");
    assert.match(reviewGate?.message ?? "", /accepted reviewer account/);
    assert.equal(
      report.nextSteps.includes("Do not rely on required GitHub approvals until an accepted reviewer account, team, or GitHub App is verified."),
      true
    );
  });
});

test("github apply requires explicit remote write approval", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const before = await snapshotTree(directory);
    const result = await applyGitHubRemote({
      targetRoot: directory,
      approveRemoteWrites: false,
      runner: fakeRunner({
        "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
        "gh --version": ok("gh version 2.0.0\n"),
        "gh auth status": ok("Logged in\n"),
        "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
          default_branch: "main",
          permissions: { admin: true, push: true, pull: true }
        })),
        "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
          enabled: true,
          allowed_actions: "all"
        })),
        "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([])),
        "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": fail("gh: Branch not protected (HTTP 404)")
      })
    });
    const after = await snapshotTree(directory);

    assert.deepEqual(after, before);
    assert.equal(result.status, "blocked");
    assert.equal(result.blockers.includes("Remote writes require `--yes`."), true);
    assert.deepEqual(result.remoteWrites, []);
  });
});

test("github apply creates branch protection for an unprotected repository", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const writes: Array<{ key: string; stdin?: string }> = [];
    const before = await snapshotTree(directory);
    const runner = recordingRunner({
      "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
      "gh --version": ok("gh version 2.0.0\n"),
      "gh auth status": ok("Logged in\n"),
      "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
        default_branch: "main",
        permissions: { admin: true, push: true, pull: true }
      })),
      "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
        enabled: true,
        allowed_actions: "all"
      })),
      "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([])),
      "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": [
        fail("gh: Branch not protected (HTTP 404)"),
        ok(JSON.stringify({
          strict: true,
          contexts: ["contract", "generated-skills", "scope"],
          checks: []
        }))
      ],
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/collab-contract.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/generated-skills.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/pr-scope.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/branches/main/protection": fail("gh: Branch not protected (HTTP 404)"),
      "gh api --method PUT repos/bacoco/Fuckia/branches/main/protection --input -": ok("{}")
    }, writes);

    const result = await applyGitHubRemote({
      targetRoot: directory,
      approveRemoteWrites: true,
      runner
    });
    const after = await snapshotTree(directory);
    const write = writes.find((entry) => entry.key === "gh api --method PUT repos/bacoco/Fuckia/branches/main/protection --input -");

    assert.deepEqual(after, before);
    assert.equal(result.status, "applied");
    assert.deepEqual(result.remoteWrites, ["PUT /repos/bacoco/Fuckia/branches/main/protection"]);
    assert.match(write?.stdin ?? "", /"contexts": \[/);
    assert.match(write?.stdin ?? "", /"contract"/);
    assert.match(write?.stdin ?? "", /"required_pull_request_reviews": null/);
    assert.doesNotMatch(write?.stdin ?? "", /"required_approving_review_count": 1/);
  });
});

test("github apply merges required checks into existing branch protection", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const writes: Array<{ key: string; stdin?: string }> = [];
    const before = await snapshotTree(directory);
    const runner = recordingRunner({
      "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
      "gh --version": ok("gh version 2.0.0\n"),
      "gh auth status": ok("Logged in\n"),
      "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
        default_branch: "main",
        permissions: { admin: true, push: true, pull: true }
      })),
      "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
        enabled: true,
        allowed_actions: "all"
      })),
      "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([{ id: 99, name: "Existing ruleset" }])),
      "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": [
        ok(JSON.stringify({
          strict: false,
          contexts: ["contract", "existing-ci"],
          checks: []
        })),
        ok(JSON.stringify({
          strict: true,
          contexts: ["contract", "existing-ci", "generated-skills", "scope"],
          checks: []
        }))
      ],
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/collab-contract.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/generated-skills.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/pr-scope.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/branches/main/protection": ok(JSON.stringify({
        required_status_checks: {
          strict: false,
          contexts: ["contract", "existing-ci"]
        }
      })),
      "gh api --method PATCH repos/bacoco/Fuckia/branches/main/protection/required_status_checks --input -": ok("{}")
    }, writes);

    const result = await applyGitHubRemote({
      targetRoot: directory,
      approveRemoteWrites: true,
      runner
    });
    const after = await snapshotTree(directory);
    const write = writes.find((entry) => entry.key === "gh api --method PATCH repos/bacoco/Fuckia/branches/main/protection/required_status_checks --input -");

    assert.deepEqual(after, before);
    assert.equal(result.status, "applied");
    assert.deepEqual(result.remoteWrites, ["PATCH /repos/bacoco/Fuckia/branches/main/protection/required_status_checks"]);
    assert.match(write?.stdin ?? "", /"existing-ci"/);
    assert.match(write?.stdin ?? "", /"generated-skills"/);
    assert.match(write?.stdin ?? "", /"strict": true/);
  });
});

test("github apply preserves app-bound required checks", async () => {
  await withTempProject(async (directory) => {
    await createInstalledGithubFiles(directory);
    const writes: Array<{ key: string; stdin?: string }> = [];
    const runner = recordingRunner({
      "git remote get-url origin": ok("https://github.com/bacoco/Fuckia.git\n"),
      "gh --version": ok("gh version 2.0.0\n"),
      "gh auth status": ok("Logged in\n"),
      "gh api repos/bacoco/Fuckia": ok(JSON.stringify({
        default_branch: "main",
        permissions: { admin: true, push: true, pull: true }
      })),
      "gh api repos/bacoco/Fuckia/actions/permissions": ok(JSON.stringify({
        enabled: true,
        allowed_actions: "all"
      })),
      "gh api repos/bacoco/Fuckia/rulesets": ok(JSON.stringify([{ id: 99, name: "Existing ruleset" }])),
      "gh api repos/bacoco/Fuckia/branches/main/protection/required_status_checks": [
        ok(JSON.stringify({
          strict: false,
          contexts: ["contract"],
          checks: [{ context: "app-ci", app_id: 12345 }]
        })),
        ok(JSON.stringify({
          strict: true,
          contexts: ["contract"],
          checks: [
            { context: "app-ci", app_id: 12345 },
            { context: "generated-skills" },
            { context: "scope" }
          ]
        }))
      ],
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/collab-contract.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/generated-skills.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/contents/.github/workflows/pr-scope.yml?ref=main": ok("{}"),
      "gh api repos/bacoco/Fuckia/branches/main/protection": ok(JSON.stringify({
        required_status_checks: {
          strict: false,
          contexts: ["contract"],
          checks: [{ context: "app-ci", app_id: 12345 }]
        }
      })),
      "gh api --method PATCH repos/bacoco/Fuckia/branches/main/protection/required_status_checks --input -": ok("{}")
    }, writes);

    const result = await applyGitHubRemote({
      targetRoot: directory,
      approveRemoteWrites: true,
      runner
    });
    const write = writes.find((entry) => entry.key === "gh api --method PATCH repos/bacoco/Fuckia/branches/main/protection/required_status_checks --input -");

    assert.equal(result.status, "applied");
    assert.match(write?.stdin ?? "", /"checks": \[/);
    assert.match(write?.stdin ?? "", /"context": "app-ci"/);
    assert.match(write?.stdin ?? "", /"app_id": 12345/);
    assert.match(write?.stdin ?? "", /"context": "generated-skills"/);
    assert.match(write?.stdin ?? "", /"context": "scope"/);
  });
});

test("linear apply command requires an explicit team", async () => {
  await withTempProject(async (directory) => {
    const result = await capture(["linear", "--apply", "--yes"], directory);

    assert.equal(result.exitCode, 1);
    assert.match(result.stderr, /--team <TEAM_KEY>/);
  });
});

test("linear dry-run reports missing API key without writing", async () => {
  await withTempProject(async (directory) => {
    const before = await snapshotTree(directory);
    const report = await dryRunLinear({
      targetRoot: directory,
      apiKey: ""
    });
    const after = await snapshotTree(directory);

    assert.deepEqual(after, before);
    assert.equal(report.apiKey, "missing");
    assert.equal(report.blockers.includes("LINEAR_API_KEY is missing."), true);
    assert.equal(report.templates.length, 6);
  });
});

test("linear apply creates issue chain and archive receipt", async () => {
  await withTempProject(async (directory) => {
    const client = fakeLinearClient([
      { id: "team-1", key: "ENG", name: "Engineering" }
    ]);
    const result = await applyLinear({
      targetRoot: directory,
      apiKey: "lin_api_key",
      teamKey: "ENG",
      approveRemoteWrites: true,
      client
    });
    const receipt = await readFile(path.join(directory, "docs", "fuckia", "archive", "linear-issue-chain.json"), "utf8");

    assert.equal(result.status, "applied");
    assert.equal(result.issues.length, 6);
    assert.equal(result.remoteWrites.length, 6);
    assert.match(receipt, /"identifier": "ENG-1"/);
    assert.match(receipt, /"identifier": "ENG-6"/);
  });
});

test("linear apply writes a failure receipt after partial issue creation", async () => {
  await withTempProject(async (directory) => {
    const result = await applyLinear({
      targetRoot: directory,
      apiKey: "lin_api_key",
      teamKey: "ENG",
      approveRemoteWrites: true,
      client: failingLinearClient([{ id: "team-1", key: "ENG", name: "Engineering" }], 2)
    });
    const receipt = await readFile(path.join(directory, "docs", "fuckia", "archive", "linear-issue-chain.json"), "utf8");

    assert.equal(result.status, "blocked");
    assert.equal(result.issues.length, 2);
    assert.equal(result.remoteWrites.length, 2);
    assert.match(receipt, /"identifier": "ENG-2"/);
    assert.match(receipt, /"error": "Linear fixture failure"/);
  });
});

test("strict apply enables strict mode after init install", async () => {
  await withTempProject(async (directory) => {
    await capture(["init", "--apply", "--agent-mode", "dual-agent"], directory);
    const before = await checkStrictMode(directory);
    const result = await applyStrictMode(directory);
    const after = await checkStrictMode(directory);
    const config = await readFile(path.join(directory, "fuckia.config.yaml"), "utf8");
    const receipt = await readFile(path.join(directory, "docs", "fuckia", "strict-mode.md"), "utf8");

    assert.equal(before.findings.some((finding) => finding.id === "config:mode" && finding.level === "fail"), true);
    assert.equal(result.status, "applied");
    assert.match(config, /mode: strict/);
    assert.match(config, /strict_checks_enabled: true/);
    assert.match(receipt, /Strict mode is enabled/);
    assert.equal(after.findings.filter((finding) => finding.level === "fail").length, 0);
  });
});

test("strict apply is idempotent on an already strict project", async () => {
  await withTempProject(async (directory) => {
    await capture(["init", "--apply", "--agent-mode", "dual-agent"], directory);
    await applyStrictMode(directory);
    const result = await applyStrictMode(directory);

    assert.equal(result.status, "unchanged");
    assert.deepEqual(result.written, []);
    assert.deepEqual(result.blockers, []);
  });
});

async function createSkillSource(directory: string): Promise<void> {
  const sourceDir = path.join(directory, "kit", "skills-src", "shared");
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

function ok(stdout: string): CommandResult {
  return {
    exitCode: 0,
    stdout,
    stderr: ""
  };
}

function fail(stderr: string): CommandResult {
  return {
    exitCode: 1,
    stdout: "",
    stderr
  };
}

type FakeResult = CommandResult | CommandResult[];

function fakeRunner(results: Record<string, FakeResult>): CommandRunner {
  return recordingRunner(results, []);
}

function recordingRunner(results: Record<string, FakeResult>, writes: Array<{ key: string; stdin?: string }>): CommandRunner {
  return {
    async run(command: string, args: string[], _cwd: string, stdin?: string): Promise<CommandResult> {
      const key = [command, ...args].join(" ");
      if (stdin !== undefined) {
        writes.push({ key, stdin });
      }

      const result = results[key];
      if (Array.isArray(result)) {
        const next = result.shift();
        return next ?? fail(`No remaining fake result for command: ${key}`);
      }

      return result ?? fail(`Unexpected command: ${key}`);
    }
  };
}

function fakeLinearClient(teams: LinearTeam[]): LinearClient {
  const created: LinearIssue[] = [];
  return {
    async listTeams(): Promise<LinearTeam[]> {
      return teams;
    },
    async createIssue(input: { title: string }): Promise<LinearIssue> {
      const team = teams[0];
      const issue: LinearIssue = {
        id: `issue-${created.length + 1}`,
        identifier: `${team.key}-${created.length + 1}`,
        title: input.title,
        url: `https://linear.app/fuckia/issue/${team.key}-${created.length + 1}`
      };
      created.push(issue);
      return issue;
    }
  };
}

function failingLinearClient(teams: LinearTeam[], failAfter: number): LinearClient {
  const created: LinearIssue[] = [];
  return {
    async listTeams(): Promise<LinearTeam[]> {
      return teams;
    },
    async createIssue(input: { title: string }): Promise<LinearIssue> {
      if (created.length >= failAfter) {
        throw new Error("Linear fixture failure");
      }

      const team = teams[0];
      const issue: LinearIssue = {
        id: `issue-${created.length + 1}`,
        identifier: `${team.key}-${created.length + 1}`,
        title: input.title,
        url: `https://linear.app/fuckia/issue/${team.key}-${created.length + 1}`
      };
      created.push(issue);
      return issue;
    }
  };
}
