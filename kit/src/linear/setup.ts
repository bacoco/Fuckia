import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { linearIssueTemplates } from "./templates";
import { LinearGraphQLClient, type LinearClient, type LinearIssue, type LinearTeam } from "./client";

export interface LinearDryRunOptions {
  targetRoot: string;
  teamKey?: string;
  apiKey?: string;
  client?: LinearClient;
}

export interface LinearApplyOptions extends LinearDryRunOptions {
  approveRemoteWrites: boolean;
}

export interface LinearDryRunReport {
  mode: "dry-run";
  targetRoot: string;
  writes: "none";
  remoteWrites: "none";
  apiKey: "present" | "missing";
  teamKey: string | null;
  selectedTeam: LinearTeam | null;
  teams: LinearTeam[];
  templates: Array<{ kind: string; title: string; fileName: string }>;
  blockers: string[];
  nextSteps: string[];
  officialSources: string[];
}

export interface LinearApplyResult {
  status: "applied" | "blocked";
  targetRoot: string;
  remoteWrites: string[];
  localWrites: string[];
  blockers: string[];
  issues: LinearIssue[];
  dryRun: LinearDryRunReport;
}

export async function dryRunLinear(options: LinearDryRunOptions): Promise<LinearDryRunReport> {
  const targetRoot = path.resolve(options.targetRoot);
  const apiKey = options.apiKey ?? process.env.LINEAR_API_KEY ?? "";
  const blockers: string[] = [];
  let teams: LinearTeam[] = [];

  if (!apiKey && !options.client) {
    blockers.push("LINEAR_API_KEY is missing.");
  } else {
    try {
      teams = await getClient(apiKey, options.client).listTeams();
    } catch (error) {
      blockers.push(`Linear team lookup failed: ${errorMessage(error)}`);
    }
  }

  const selectedTeam = selectTeam(teams, options.teamKey);
  if (teams.length > 0 && !selectedTeam) {
    blockers.push(options.teamKey ? `Linear team not found: ${options.teamKey}` : "Linear team key is required when the workspace has multiple teams.");
  }

  return {
    mode: "dry-run",
    targetRoot,
    writes: "none",
    remoteWrites: "none",
    apiKey: apiKey || options.client ? "present" : "missing",
    teamKey: options.teamKey ?? null,
    selectedTeam,
    teams,
    templates: linearIssueTemplates.map((template) => ({
      kind: template.kind,
      title: template.title,
      fileName: template.fileName
    })),
    blockers,
    nextSteps: buildNextSteps(blockers),
    officialSources: [
      "https://linear.app/developers/graphql",
      "https://linear.app/developers/create-issues-using-linear-new",
      "https://linear.app/docs/issue-templates"
    ]
  };
}

export async function applyLinear(options: LinearApplyOptions): Promise<LinearApplyResult> {
  const targetRoot = path.resolve(options.targetRoot);
  const dryRun = await dryRunLinear(options);
  const blockers = [...dryRun.blockers];

  if (!options.approveRemoteWrites) {
    blockers.push("Remote Linear writes require `--yes`.");
  }

  if (!dryRun.selectedTeam) {
    blockers.push("Selected Linear team is missing.");
  }

  const apiKey = options.apiKey ?? process.env.LINEAR_API_KEY ?? "";
  if (blockers.length > 0 || !dryRun.selectedTeam) {
    return blocked(targetRoot, dryRun, blockers, [], [], []);
  }

  const client = getClient(apiKey, options.client);
  const issues: LinearIssue[] = [];
  const archivePath = path.join("docs", "fuckia", "archive", "linear-issue-chain.json");
  try {
    for (const template of linearIssueTemplates) {
      const previous = issues.at(-1);
      const description = previous
        ? `${template.description}\n\n## Previous Fuckia Issue\n\n${previous.identifier}: ${previous.url}\n`
        : template.description;
      issues.push(await client.createIssue({
        teamId: dryRun.selectedTeam.id,
        title: template.title,
        description
      }));
    }

    await writeLinearIssueChainReceipt(targetRoot, archivePath, dryRun.selectedTeam, issues);
  } catch (error) {
    const failureReceiptWritten = await writeFailureReceipt(targetRoot, archivePath, dryRun.selectedTeam, issues, error);
    return blocked(
      targetRoot,
      dryRun,
      [`Linear setup failed after ${issues.length} created issues: ${errorMessage(error)}`],
      issues.map(() => "Linear GraphQL issueCreate"),
      failureReceiptWritten ? [archivePath] : [],
      issues
    );
  }

  return {
    status: "applied",
    targetRoot,
    remoteWrites: linearIssueTemplates.map(() => "Linear GraphQL issueCreate"),
    localWrites: [archivePath],
    blockers: [],
    issues,
    dryRun
  };
}

function blocked(
  targetRoot: string,
  dryRun: LinearDryRunReport,
  blockers: string[],
  remoteWrites: string[],
  localWrites: string[],
  issues: LinearIssue[]
): LinearApplyResult {
  return {
    status: "blocked",
    targetRoot,
    remoteWrites,
    localWrites,
    blockers,
    issues,
    dryRun
  };
}

function getClient(apiKey: string, client?: LinearClient): LinearClient {
  return client ?? new LinearGraphQLClient(apiKey);
}

function selectTeam(teams: LinearTeam[], teamKey?: string): LinearTeam | null {
  if (teamKey) {
    return teams.find((team) => team.key.toLowerCase() === teamKey.toLowerCase()) ?? null;
  }
  return teams.length === 1 ? teams[0] : null;
}

function buildNextSteps(blockers: string[]): string[] {
  if (blockers.length === 0) {
    return ["Run `fuckia linear --apply --yes --team <TEAM_KEY>` after human approval."];
  }
  return [
    "Set `LINEAR_API_KEY` before remote Linear setup.",
    "Pass `--team <TEAM_KEY>` when the workspace has multiple teams."
  ];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function writeLinearIssueChainReceipt(
  targetRoot: string,
  archivePath: string,
  team: LinearTeam,
  issues: LinearIssue[]
): Promise<void> {
  await mkdir(path.dirname(path.join(targetRoot, archivePath)), { recursive: true });
  await writeFile(path.join(targetRoot, archivePath), `${JSON.stringify({
    generatedBy: "fuckia linear --apply --yes",
    team,
    issues
  }, null, 2)}\n`, { encoding: "utf8", flag: "w" });
}

async function writeFailureReceipt(
  targetRoot: string,
  archivePath: string,
  team: LinearTeam,
  issues: LinearIssue[],
  error: unknown
): Promise<boolean> {
  try {
    await mkdir(path.dirname(path.join(targetRoot, archivePath)), { recursive: true });
    await writeFile(path.join(targetRoot, archivePath), `${JSON.stringify({
      generatedBy: "fuckia linear --apply --yes",
      team,
      issues,
      error: errorMessage(error)
    }, null, 2)}\n`, { encoding: "utf8", flag: "w" });
    return true;
  } catch {
    return false;
  }
}
