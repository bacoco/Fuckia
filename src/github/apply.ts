import path from "node:path";
import { auditGitHubRemote, readStatusCheckContexts, type GitHubAuditReport } from "./audit";
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

interface StatusCheckRequirement {
  context: string;
  app_id?: number;
}

interface ParsedStatusChecks {
  contexts: string[];
  checks: StatusCheckRequirement[];
  usesChecks: boolean;
}

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
    const existingChecks = readExistingStatusChecks(protection.stdout, auditBefore.requiredCheckContexts);
    const endpoint = `repos/${auditBefore.remote.fullName}/branches/${encodeURIComponent(auditBefore.defaultBranch)}/protection/required_status_checks`;
    const payload = JSON.stringify(buildStatusCheckPayload(existingChecks, auditBefore.expectedRequiredChecks), null, 2);
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
  const verification = await runGhJson<{ contexts?: unknown; checks?: unknown }>(
    runner,
    targetRoot,
    ["api", `${protectionEndpoint}/required_status_checks`]
  );

  if (!verification.ok) {
    return blocked(targetRoot, auditBefore, [
      `Post-write verification failed: ${verification.message}`
    ]);
  }

  const verifiedContexts = readStatusCheckContexts(verification.value);
  const missing = auditBefore.expectedRequiredChecks.filter((check) => !verifiedContexts.includes(check));
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
    verification: [`Required checks verified: ${verifiedContexts.join(", ")}`]
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

function buildStatusCheckPayload(existing: ParsedStatusChecks, required: string[]): unknown {
  if (existing.usesChecks) {
    return {
      strict: true,
      checks: mergeCheckRequirements(existing, required)
    };
  }

  return {
    strict: true,
    contexts: mergeContexts(existing.contexts, required)
  };
}

function mergeContexts(existing: string[], required: string[]): string[] {
  return Array.from(new Set([...existing, ...required])).sort((a, b) => a.localeCompare(b));
}

function readExistingStatusChecks(stdout: string, requiredCheckContexts: string[] | null): ParsedStatusChecks {
  try {
    const parsed = JSON.parse(stdout) as { required_status_checks?: { contexts?: unknown; checks?: unknown } };
    return parseStatusChecks(parsed.required_status_checks ?? {}, requiredCheckContexts);
  } catch {
    return {
      contexts: requiredCheckContexts ?? [],
      checks: [],
      usesChecks: false
    };
  }
}

function parseStatusChecks(payload: { contexts?: unknown; checks?: unknown }, fallbackContexts: string[] | null): ParsedStatusChecks {
  const contexts = Array.isArray(payload.contexts)
    ? payload.contexts.filter((context): context is string => typeof context === "string")
    : fallbackContexts ?? [];
  const checks = Array.isArray(payload.checks)
    ? payload.checks
      .map(readStatusCheckRequirement)
      .filter((check): check is StatusCheckRequirement => check !== null)
    : [];

  return {
    contexts: mergeContexts(contexts, checks.map((check) => check.context)),
    checks,
    usesChecks: checks.length > 0
  };
}

function readStatusCheckRequirement(value: unknown): StatusCheckRequirement | null {
  if (!value || typeof value !== "object" || !("context" in value)) {
    return null;
  }

  const context = (value as { context?: unknown }).context;
  if (typeof context !== "string") {
    return null;
  }

  const appId = (value as { app_id?: unknown }).app_id;
  return typeof appId === "number" ? { context, app_id: appId } : { context };
}

function mergeCheckRequirements(existing: ParsedStatusChecks, required: string[]): StatusCheckRequirement[] {
  const byContext = new Map<string, StatusCheckRequirement>();
  for (const check of existing.checks) {
    byContext.set(check.context, check);
  }
  for (const context of existing.contexts) {
    if (!byContext.has(context)) {
      byContext.set(context, { context });
    }
  }
  for (const context of required) {
    if (!byContext.has(context)) {
      byContext.set(context, { context });
    }
  }
  return [...byContext.values()].sort((a, b) => a.context.localeCompare(b.context));
}
