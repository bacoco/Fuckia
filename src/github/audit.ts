import path from "node:path";
import { fileExists } from "../fs/readTree";
import { runGhJson } from "./api";
import { parseGitHubRemote, type GitHubRemote } from "./remote";
import { nodeCommandRunner, type CommandRunner } from "./runner";

export type GitHubAuditStatus = "pass" | "fail" | "warning" | "unknown";

export interface GitHubAuditCheck {
  id: string;
  status: GitHubAuditStatus;
  message: string;
}

export interface GitHubAuditReport {
  mode: "dry-run";
  targetRoot: string;
  writes: "none";
  remoteWrites: "none";
  remote: GitHubRemote | null;
  defaultBranch: string | null;
  rulesetCount: number | null;
  requiredCheckContexts: string[] | null;
  expectedRequiredChecks: string[];
  checks: GitHubAuditCheck[];
  officialEndpoints: string[];
  nextSteps: string[];
}

export interface GitHubAuditOptions {
  targetRoot: string;
  runner?: CommandRunner;
}

interface RepositoryPayload {
  default_branch?: unknown;
  permissions?: {
    admin?: unknown;
    push?: unknown;
    pull?: unknown;
  };
}

interface ActionsPermissionsPayload {
  enabled?: unknown;
  allowed_actions?: unknown;
}

interface StatusCheckProtectionPayload {
  contexts?: unknown;
  checks?: unknown;
}

const requiredLocalFiles = [
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/collab-contract.yml",
  ".github/workflows/generated-skills.yml",
  ".github/workflows/pr-scope.yml"
];

const expectedRequiredChecks = ["contract", "generated-skills", "scope"];

export async function auditGitHubRemote(options: GitHubAuditOptions): Promise<GitHubAuditReport> {
  const runner = options.runner ?? nodeCommandRunner;
  const targetRoot = path.resolve(options.targetRoot);
  const checks: GitHubAuditCheck[] = [];
  let rulesetCount: number | null = null;
  let requiredCheckContexts: string[] | null = null;

  for (const file of requiredLocalFiles) {
    checks.push({
      id: `local:${file}`,
      status: await fileExists(path.join(targetRoot, file)) ? "pass" : "fail",
      message: `${file}: ${await fileExists(path.join(targetRoot, file)) ? "present" : "missing"}`
    });
  }

  const remoteResult = await runner.run("git", ["remote", "get-url", "origin"], targetRoot);
  const remote = remoteResult.exitCode === 0 ? parseGitHubRemote(remoteResult.stdout) : null;

  checks.push({
    id: "git:origin",
    status: remote ? "pass" : "fail",
    message: remote ? `origin: ${remote.fullName}` : "origin: missing or not a github.com repository"
  });

  const ghVersion = await runner.run("gh", ["--version"], targetRoot);
  if (ghVersion.exitCode !== 0) {
    checks.push({
      id: "gh:installed",
      status: "fail",
      message: "GitHub CLI `gh` is not available"
    });

    return buildReport(targetRoot, remote, null, checks);
  }

  checks.push({
    id: "gh:installed",
    status: "pass",
    message: "GitHub CLI `gh` is available"
  });

  const ghAuth = await runner.run("gh", ["auth", "status"], targetRoot);
  if (ghAuth.exitCode !== 0) {
    checks.push({
      id: "gh:auth",
      status: "fail",
      message: "GitHub CLI authentication is missing"
    });

    return buildReport(targetRoot, remote, null, checks);
  }

  checks.push({
    id: "gh:auth",
    status: "pass",
    message: "GitHub CLI authentication is available"
  });

  if (!remote) {
    return buildReport(targetRoot, remote, null, checks);
  }

  const repository = await runGhJson<RepositoryPayload>(runner, targetRoot, ["api", `repos/${remote.fullName}`]);
  if (!repository.ok) {
    checks.push({
      id: "github:repository",
      status: "fail",
      message: `GitHub repository read failed: ${repository.message}`
    });

    return buildReport(targetRoot, remote, null, checks);
  }

  const defaultBranch = typeof repository.value.default_branch === "string" ? repository.value.default_branch : null;
  const admin = repository.value.permissions?.admin === true;
  const push = repository.value.permissions?.push === true;

  checks.push({
    id: "github:repository",
    status: "pass",
    message: `GitHub repository is readable${defaultBranch ? `; default branch: ${defaultBranch}` : ""}`
  });
  checks.push({
    id: "github:permissions",
    status: admin ? "pass" : "warning",
    message: admin ? "Authenticated user has admin permission" : `Authenticated user admin permission: false; push permission: ${String(push)}`
  });

  const actions = await runGhJson<ActionsPermissionsPayload>(
    runner,
    targetRoot,
    ["api", `repos/${remote.fullName}/actions/permissions`]
  );
  if (actions.ok) {
    checks.push({
      id: "github:actions",
      status: actions.value.enabled === true ? "pass" : "fail",
      message: `GitHub Actions enabled: ${String(actions.value.enabled)}; allowed actions: ${String(actions.value.allowed_actions ?? "unknown")}`
    });
  } else {
    checks.push({
      id: "github:actions",
      status: "unknown",
      message: `GitHub Actions permissions read failed: ${actions.message}`
    });
  }

  const rulesets = await runGhJson<unknown[]>(runner, targetRoot, ["api", `repos/${remote.fullName}/rulesets`]);
  if (rulesets.ok) {
    rulesetCount = rulesets.value.length;
    checks.push({
      id: "github:rulesets",
      status: rulesets.value.length > 0 ? "pass" : "warning",
      message: `Repository rulesets: ${rulesets.value.length}`
    });
  } else {
    checks.push({
      id: "github:rulesets",
      status: "unknown",
      message: `Repository rulesets read failed: ${rulesets.message}`
    });
  }

  if (defaultBranch) {
    const requiredChecks = await runGhJson<StatusCheckProtectionPayload>(
      runner,
      targetRoot,
      ["api", `repos/${remote.fullName}/branches/${encodeURIComponent(defaultBranch)}/protection/required_status_checks`]
    );

    if (requiredChecks.ok) {
      requiredCheckContexts = readStatusCheckContexts(requiredChecks.value);
      const missing = expectedRequiredChecks.filter((check) => !requiredCheckContexts?.includes(check));
      checks.push({
        id: "github:required-checks",
        status: missing.length === 0 ? "pass" : "fail",
        message: missing.length === 0
          ? `Required checks include: ${expectedRequiredChecks.join(", ")}`
          : `Missing required checks: ${missing.join(", ")}`
      });
    } else {
      checks.push({
        id: "github:required-checks",
        status: "fail",
        message: `Required checks are not verified: ${requiredChecks.message}`
      });
    }
  }

  return buildReport(targetRoot, remote, defaultBranch, checks, rulesetCount, requiredCheckContexts);
}

function buildReport(
  targetRoot: string,
  remote: GitHubRemote | null,
  defaultBranch: string | null,
  checks: GitHubAuditCheck[],
  rulesetCount: number | null = null,
  requiredCheckContexts: string[] | null = null
): GitHubAuditReport {
  return {
    mode: "dry-run",
    targetRoot,
    writes: "none",
    remoteWrites: "none",
    remote,
    defaultBranch,
    rulesetCount,
    requiredCheckContexts,
    expectedRequiredChecks,
    checks,
    officialEndpoints: [
      "GET /repos/{owner}/{repo}",
      "GET /repos/{owner}/{repo}/actions/permissions",
      "GET /repos/{owner}/{repo}/rulesets",
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    nextSteps: buildNextSteps(checks)
  };
}

export function readStatusCheckContexts(payload: StatusCheckProtectionPayload): string[] {
  const contexts = Array.isArray(payload.contexts)
    ? payload.contexts.filter((context): context is string => typeof context === "string")
    : [];
  const checkContexts = Array.isArray(payload.checks)
    ? payload.checks
      .map((check) => check && typeof check === "object" && "context" in check ? (check as { context?: unknown }).context : null)
      .filter((context): context is string => typeof context === "string")
    : [];

  return Array.from(new Set([...contexts, ...checkContexts])).sort((a, b) => a.localeCompare(b));
}

function buildNextSteps(checks: GitHubAuditCheck[]): string[] {
  const failingIds = new Set(checks.filter((check) => check.status === "fail").map((check) => check.id));
  const nextSteps = ["Keep this audit output with the installation receipt."];

  if ([...failingIds].some((id) => id.startsWith("local:"))) {
    nextSteps.push("Run `fuckia init --apply` or approved `fuckia migrate --apply`, then commit and push the installed `.github` files.");
  }

  if (failingIds.has("git:origin")) {
    nextSteps.push("Add a GitHub `origin` remote before remote platform setup.");
  }

  if (failingIds.has("gh:installed")) {
    nextSteps.push("Install GitHub CLI before remote platform setup.");
  }

  if (failingIds.has("gh:auth")) {
    nextSteps.push("Run `gh auth login` and grant repository access before remote platform setup.");
  }

  if (failingIds.has("github:required-checks")) {
    nextSteps.push("Configure required GitHub checks only after installed workflows are pushed to the default branch.");
  }

  return nextSteps;
}
