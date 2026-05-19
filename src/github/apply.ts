import path from "node:path";
import { auditGitHubRemote, type GitHubAuditReport } from "./audit";
import { formatCommandFailure, runGhJson } from "./api";
import { nodeCommandRunner, type CommandRunner } from "./runner";

export interface GitHubApplyOptions {
  targetRoot: string;
  approveRemoteWrites: boolean;
  runner?: CommandRunner;
}

export interface GitHubApplyResult {
  status: "applied" | "blocked" | "already-configured";
  targetRoot: string;
  remoteWrites: string[];
  blockers: string[];
  auditBefore: GitHubAuditReport;
  verification: string[];
}

const remoteWorkflowFiles = [
  ".github/workflows/collab-contract.yml",
  ".github/workflows/generated-skills.yml",
  ".github/workflows/pr-scope.yml"
];

export async function applyGitHubRemote(options: GitHubApplyOptions): Promise<GitHubApplyResult> {
  const runner = options.runner ?? nodeCommandRunner;
  const targetRoot = path.resolve(options.targetRoot);
  const auditBefore = await auditGitHubRemote({ targetRoot, runner });
  const blockers: string[] = [];

  if (!options.approveRemoteWrites) {
    blockers.push("Remote writes require `--yes`.");
  }

  for (const check of auditBefore.checks) {
    if (check.id.startsWith("local:") && check.status === "fail") {
      blockers.push(check.message);
    }
  }

  const permission = auditBefore.checks.find((check) => check.id === "github:permissions");
  if (permission?.status !== "pass") {
    blockers.push("GitHub admin permission is required for remote apply.");
  }

  if (!auditBefore.remote) {
    blockers.push("GitHub `origin` remote is required for remote apply.");
  }

  if (!auditBefore.defaultBranch) {
    blockers.push("Default branch is required for remote apply.");
  }

  const requiredChecks = auditBefore.checks.find((check) => check.id === "github:required-checks");
  if (requiredChecks?.status === "pass") {
    return {
      status: "already-configured",
      targetRoot,
      remoteWrites: [],
      blockers: [],
      auditBefore,
      verification: ["Required Fuckia checks are already configured."]
    };
  }

  if (blockers.length > 0 || !auditBefore.remote || !auditBefore.defaultBranch) {
    return blocked(targetRoot, auditBefore, blockers);
  }

  const missingRemoteWorkflowFiles = await findMissingRemoteWorkflowFiles(
    runner,
    targetRoot,
    auditBefore.remote.fullName,
    auditBefore.defaultBranch
  );

  if (missingRemoteWorkflowFiles.length > 0) {
    return blocked(targetRoot, auditBefore, [
      ...blockers,
      `Remote default branch is missing workflow files: ${missingRemoteWorkflowFiles.join(", ")}`
    ]);
  }

  const protection = await runner.run(
    "gh",
    ["api", `repos/${auditBefore.remote.fullName}/branches/${encodeURIComponent(auditBefore.defaultBranch)}/protection`],
    targetRoot
  );

  if (protection.exitCode === 0) {
    const existingContexts = readExistingStatusCheckContexts(protection.stdout, auditBefore.requiredCheckContexts);
    const contexts = mergeContexts(existingContexts, auditBefore.expectedRequiredChecks);
    const endpoint = `repos/${auditBefore.remote.fullName}/branches/${encodeURIComponent(auditBefore.defaultBranch)}/protection/required_status_checks`;
    const payload = JSON.stringify(buildStatusCheckPayload(contexts), null, 2);
    const apply = await runner.run("gh", ["api", "--method", "PATCH", endpoint, "--input", "-"], targetRoot, payload);

    if (apply.exitCode !== 0) {
      return blocked(targetRoot, auditBefore, [
        ...blockers,
        `Status check merge failed: ${formatCommandFailure(apply)}`
      ]);
    }

    return verifyStatusChecks(runner, targetRoot, auditBefore, endpoint.replace("/required_status_checks", ""), `PATCH /${endpoint}`);
  }

  const protectionMessage = formatCommandFailure(protection);
  if (!protectionMessage.includes("404")) {
    return blocked(targetRoot, auditBefore, [
      ...blockers,
      `Branch protection state is not writable by this command: ${protectionMessage}`
    ]);
  }

  const endpoint = `repos/${auditBefore.remote.fullName}/branches/${encodeURIComponent(auditBefore.defaultBranch)}/protection`;
  const payload = JSON.stringify(buildBranchProtectionPayload(), null, 2);
  const apply = await runner.run("gh", ["api", "--method", "PUT", endpoint, "--input", "-"], targetRoot, payload);

  if (apply.exitCode !== 0) {
    return blocked(targetRoot, auditBefore, [
      ...blockers,
      `Branch protection write failed: ${formatCommandFailure(apply)}`
    ]);
  }

  return verifyStatusChecks(runner, targetRoot, auditBefore, endpoint, `PUT /${endpoint}`);
}

async function verifyStatusChecks(
  runner: CommandRunner,
  targetRoot: string,
  auditBefore: GitHubAuditReport,
  protectionEndpoint: string,
  remoteWrite: string
): Promise<GitHubApplyResult> {
  const verification = await runGhJson<string[]>(
    runner,
    targetRoot,
    ["api", `${protectionEndpoint}/required_status_checks/contexts`]
  );

  if (!verification.ok) {
    return blocked(targetRoot, auditBefore, [
      `Post-write verification failed: ${verification.message}`
    ]);
  }

  const missing = auditBefore.expectedRequiredChecks.filter((check) => !verification.value.includes(check));
  if (missing.length > 0) {
    return blocked(targetRoot, auditBefore, [
      `Post-write verification is missing checks: ${missing.join(", ")}`
    ]);
  }

  return {
    status: "applied",
    targetRoot,
    remoteWrites: [remoteWrite],
    blockers: [],
    auditBefore,
    verification: [`Required checks verified: ${verification.value.join(", ")}`]
  };
}

function blocked(targetRoot: string, auditBefore: GitHubAuditReport, blockers: string[]): GitHubApplyResult {
  return {
    status: "blocked",
    targetRoot,
    remoteWrites: [],
    blockers,
    auditBefore,
    verification: []
  };
}

async function findMissingRemoteWorkflowFiles(
  runner: CommandRunner,
  targetRoot: string,
  fullName: string,
  defaultBranch: string
): Promise<string[]> {
  const missing: string[] = [];
  for (const file of remoteWorkflowFiles) {
    const result = await runGhJson<unknown>(
      runner,
      targetRoot,
      ["api", `repos/${fullName}/contents/${file}?ref=${encodeURIComponent(defaultBranch)}`]
    );
    if (!result.ok) {
      missing.push(file);
    }
  }
  return missing;
}

function buildBranchProtectionPayload(): unknown {
  return {
    required_status_checks: {
      strict: true,
      contexts: ["contract", "generated-skills", "scope"]
    },
    enforce_admins: true,
    required_pull_request_reviews: {
      dismiss_stale_reviews: true,
      require_code_owner_reviews: false,
      required_approving_review_count: 1,
      require_last_push_approval: true
    },
    restrictions: null,
    required_conversation_resolution: true,
    allow_force_pushes: false,
    allow_deletions: false
  };
}

function buildStatusCheckPayload(contexts: string[]): unknown {
  return {
    strict: true,
    contexts
  };
}

function mergeContexts(existing: string[], required: string[]): string[] {
  return Array.from(new Set([...existing, ...required])).sort((a, b) => a.localeCompare(b));
}

function readExistingStatusCheckContexts(stdout: string, requiredCheckContexts: string[] | null): string[] {
  if (requiredCheckContexts) {
    return requiredCheckContexts;
  }

  try {
    const parsed = JSON.parse(stdout) as {
      required_status_checks?: {
        contexts?: unknown;
      };
    };
    if (Array.isArray(parsed.required_status_checks?.contexts)) {
      return parsed.required_status_checks.contexts.filter((context): context is string => typeof context === "string");
    }
  } catch {
    return [];
  }

  return [];
}
