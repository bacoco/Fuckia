#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const cliPath = path.join(repoRoot, "dist", "cli.js");
const shellInstallerPath = path.join(repoRoot, "kit", "scripts", "install", "agent-install.sh");
const pdgFixtureDir = mkdtempSync(path.join(tmpdir(), "fuckia-pdg-"));

writeFileSync(path.join(pdgFixtureDir, "pdg.codex.skill.md"), [
  "---",
  "name: progressive-disclosure-guard",
  "description: PDG fixture for Codex installer tests.",
  "---",
  "<!--",
  "GENERATED FILE - DO NOT EDIT DIRECTLY",
  "source: pdg.skill.md",
  "source_hash: test",
  "generated_by: progressive-disclosure-guard generate-skills",
  "target: codex",
  "-->",
  "# PDG Fixture"
].join("\n"), "utf8");
writeFileSync(path.join(pdgFixtureDir, "pdg.claude.skill.md"), [
  "---",
  "name: progressive-disclosure-guard",
  "description: PDG fixture for Claude installer tests.",
  "---",
  "<!--",
  "GENERATED FILE - DO NOT EDIT DIRECTLY",
  "source: pdg.skill.md",
  "source_hash: test",
  "generated_by: progressive-disclosure-guard generate-skills",
  "target: claude",
  "-->",
  "# PDG Fixture"
].join("\n"), "utf8");
writeFileSync(path.join(pdgFixtureDir, "AGENTS.pdg.md"), [
  "## PDG - Progressive Disclosure Guard",
  "",
  "Invoke the `progressive-disclosure-guard` skill before substantial Codex handoffs or code changes."
].join("\n"), "utf8");
writeFileSync(path.join(pdgFixtureDir, "CLAUDE.pdg.md"), [
  "## PDG - Progressive Disclosure Guard",
  "",
  "Invoke the `progressive-disclosure-guard` skill before substantial Claude handoffs or code changes."
].join("\n"), "utf8");

process.on("exit", () => {
  rmSync(pdgFixtureDir, { recursive: true, force: true });
});

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, FUCKIA_PDG_DIR: pdgFixtureDir, ...options.env }
  });

  if (result.status !== 0) {
    throw new Error([
      `Command failed: ${command} ${args.join(" ")}`,
      `cwd: ${cwd}`,
      `exit: ${result.status}`,
      "stdout:",
      result.stdout.trim(),
      "stderr:",
      result.stderr.trim()
    ].join("\n"));
  }

  return result;
}

function assertFile(directory, relativePath, expectedText = null) {
  const absolutePath = path.join(directory, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing expected file: ${relativePath}`);
  }

  if (expectedText !== null) {
    const content = readFileSync(absolutePath, "utf8");
    if (!content.includes(expectedText)) {
      throw new Error(`Expected ${relativePath} to contain: ${expectedText}`);
    }
  }
}

function withTempDirectory(prefix, callback) {
  const directory = mkdtempSync(path.join(tmpdir(), prefix));
  try {
    callback(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (!existsSync(cliPath)) {
  throw new Error("dist/cli.js is missing. Run `npm run build` before this script.");
}

if (!existsSync(shellInstallerPath)) {
  throw new Error("kit/scripts/install/agent-install.sh is missing.");
}

withTempDirectory("fuckia-shell-empty-", (directory) => {
  run("git", ["init"], directory);
  run("bash", [shellInstallerPath, "--target", directory, "--dry-run", "--agent-mode", "dual-agent"], repoRoot);
  run("bash", [shellInstallerPath, "--target", directory, "--apply", "--yes", "--agent-mode", "dual-agent"], repoRoot);

  assertFile(directory, "AGENTS.md", "Codex must follow Fuckia governance");
  assertFile(directory, "CLAUDE.md", "Claude Code must follow Fuckia governance");
  assertFile(directory, "AGENTS.md", "progressive-disclosure-guard");
  assertFile(directory, "CLAUDE.md", "progressive-disclosure-guard");
  assertFile(directory, "README.md", "Fuckia governance is installed");
  assertFile(directory, ".github/workflows/collab-contract.yml", "Fuckia Collaboration Contract");
  assertFile(directory, ".agents/skills/evidence-language-guard/SKILL.md", "target: codex");
  assertFile(directory, ".claude/skills/evidence-language-guard/SKILL.md", "target: claude");
});

withTempDirectory("fuckia-shell-codex-only-", (directory) => {
  run("git", ["init"], directory);
  run("bash", [shellInstallerPath, "--target", directory, "--apply", "--yes", "--agent-mode", "codex-only"], repoRoot);

  assertFile(directory, "AGENTS.md", "Codex must follow Fuckia governance");
  assertFile(directory, "AGENTS.md", "progressive-disclosure-guard");
  assertFile(directory, ".agents/skills/evidence-language-guard/SKILL.md", "target: codex");
  assertFile(directory, "fuckia.config.yaml", "agent_mode: codex-only");

  if (existsSync(path.join(directory, "CLAUDE.md")) || existsSync(path.join(directory, ".claude"))) {
    throw new Error("Codex-only shell install wrote Claude files.");
  }
});

withTempDirectory("fuckia-shell-guard-only-", (directory) => {
  run("git", ["init"], directory);
  run(
    "bash",
    [shellInstallerPath, "--target", directory, "--apply", "--yes", "--agent-mode", "codex-only", "--profile", "guard-only"],
    repoRoot
  );

  assertFile(directory, ".agents/skills/progressive-disclosure-guard/SKILL.md", "target: codex");
  assertFile(directory, "AGENTS.md", "progressive-disclosure-guard");

  for (const forbidden of ["README.md", "fuckia.config.yaml", ".github", ".claude"]) {
    if (existsSync(path.join(directory, forbidden))) {
      throw new Error(`Guard-only shell install wrote unexpected path: ${forbidden}`);
    }
  }
});

withTempDirectory("fuckia-shell-existing-", (directory) => {
  run("git", ["init"], directory);
  writeFileSync(path.join(directory, "AGENTS.md"), "# Existing Codex Rules\n", "utf8");
  writeFileSync(path.join(directory, "README.md"), "# Existing Project\n", "utf8");

  run("bash", [shellInstallerPath, "--target", directory, "--dry-run", "--agent-mode", "dual-agent"], repoRoot);
  run("bash", [shellInstallerPath, "--target", directory, "--apply", "--yes", "--agent-mode", "dual-agent"], repoRoot);

  const agents = readFileSync(path.join(directory, "AGENTS.md"), "utf8");
  if (agents !== "# Existing Codex Rules\n") {
    throw new Error("Shell installer modified existing AGENTS.md.");
  }

  assertFile(directory, "docs/fuckia/migration-plan.md", "Fuckia Migration Plan");
  assertFile(directory, "docs/fuckia/merge-proposals/AGENTS.md.md", "Merge Proposal: AGENTS.md");
  assertFile(directory, ".agents/skills/evidence-language-guard/SKILL.md", "target: codex");
  assertFile(directory, ".claude/skills/evidence-language-guard/SKILL.md", "target: claude");
});

run("node", [cliPath, "--help"], repoRoot);

withTempDirectory("fuckia-empty-", (directory) => {
  run("git", ["init"], directory);
  run("node", [cliPath, "install", "--dry-run", "--agent-mode", "dual-agent"], directory);
  run("node", [cliPath, "install", "--apply", "--yes", "--agent-mode", "dual-agent"], directory);
  run("node", [cliPath, "strict", "--apply"], directory);
  run("node", [cliPath, "strict", "--dry-run", "--strict"], directory);
  run("node", [cliPath, "doctor", "--strict"], directory);

  assertFile(directory, "AGENTS.md", "Codex must follow Fuckia governance");
  assertFile(directory, "CLAUDE.md", "Claude Code must follow Fuckia governance");
  assertFile(directory, ".github/workflows/collab-contract.yml", "Fuckia Collaboration Contract");
  assertFile(directory, ".agents/skills/progressive-disclosure-guard/SKILL.md", "target: codex");
  assertFile(directory, ".claude/skills/progressive-disclosure-guard/SKILL.md", "target: claude");
});

withTempDirectory("fuckia-existing-", (directory) => {
  run("git", ["init"], directory);
  writeFileSync(path.join(directory, "AGENTS.md"), "# Existing Codex Rules\n", "utf8");
  writeFileSync(path.join(directory, "README.md"), "# Existing Project\n", "utf8");

  run("node", [cliPath, "install", "--dry-run", "--agent-mode", "dual-agent"], directory);
  run("node", [cliPath, "install", "--apply", "--yes", "--agent-mode", "dual-agent"], directory);

  const agents = readFileSync(path.join(directory, "AGENTS.md"), "utf8");
  if (agents !== "# Existing Codex Rules\n") {
    throw new Error("Existing AGENTS.md was modified during migration.");
  }

  assertFile(directory, "docs/fuckia/migration-plan.md", "Existing Governance Inventory");
  assertFile(directory, "docs/fuckia/merge-proposals/AGENTS.md.md", "Merge Proposal: AGENTS.md");
  assertFile(directory, ".agents/skills/progressive-disclosure-guard/SKILL.md", "target: codex");
  assertFile(directory, ".claude/skills/progressive-disclosure-guard/SKILL.md", "target: claude");
});

withTempDirectory("fuckia-pack-", (directory) => {
  const pack = run("npm", ["pack", "--pack-destination", directory], repoRoot);
  const tarballName = pack.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  if (!tarballName) {
    throw new Error("npm pack did not return a tarball name.");
  }

  const tarballPath = path.join(directory, tarballName);
  run("npx", ["--yes", "--package", tarballPath, "fuckia", "--help"], directory, {
    env: { npm_config_cache: path.join(directory, ".npm-cache") }
  });
});

console.log("Fuckia installer E2E passed.");
