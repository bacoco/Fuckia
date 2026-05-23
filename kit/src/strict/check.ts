import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkEvidenceLanguage } from "../checks/docsLanguage";
import { checkGeneratedFileHeaders } from "../checks/generatedFiles";
import { fileExists } from "../fs/readTree";
import type { ResolvedAgentMode } from "../install/agentMode";

export type StrictFindingLevel = "pass" | "fail";

export interface StrictFinding {
  id: string;
  level: StrictFindingLevel;
  message: string;
}

export interface StrictReport {
  mode: "dry-run";
  targetRoot: string;
  writes: "none";
  findings: StrictFinding[];
  nextSteps: string[];
}

export interface StrictApplyResult {
  status: "applied" | "blocked" | "unchanged";
  targetRoot: string;
  written: string[];
  blockers: string[];
  reportBefore: StrictReport;
}

const requiredFiles = [
  "fuckia.config.yaml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/collab-contract.yml",
  ".github/workflows/generated-skills.yml",
  ".github/workflows/pr-scope.yml",
  "docs/fuckia/README.md",
  "docs/fuckia/end-of-work-checkpoint.md",
  "docs/fuckia/linear/templates/spec.md",
  "docs/fuckia/linear/templates/plan.md",
  "docs/fuckia/linear/templates/plan-review.md",
  "docs/fuckia/linear/templates/implement.md",
  "docs/fuckia/linear/templates/code-review.md",
  "docs/fuckia/linear/templates/verify.md"
];

const requiredPrHeadings = [
  "## AI Identity",
  "## Plan Review",
  "## Real Workflow Verification",
  "## PDG Pass"
];

const requiredPrChecklistLines = [
  "- [ ] Validator is different from Author AI, or human approval is recorded when independent review is required.",
  "- [ ] GitHub platform gate is recorded separately from AI review validity.",
  "- [ ] Author AI self-check is labelled as self-check, not independent review.",
  "- [ ] Single-agent fallback includes the human validation card when no other reviewer is available."
];

const requiredSkillNames = [
  "progressive-disclosure-guard",
  "cross-agent-handoff",
  "delegated-review-and-merge",
  "destructive-change-guard",
  "end-of-work-checkpoint",
  "evidence-language-guard",
  "plan-review-gate",
  "platform-permission-gate",
  "real-verification-gate",
  "source-of-truth-gate"
];

export async function checkStrictMode(targetRoot: string): Promise<StrictReport> {
  const root = path.resolve(targetRoot);
  const findings: StrictFinding[] = [];
  const agentMode = await readConfiguredAgentMode(root);

  for (const file of [...requiredFiles, ...requiredAgentFiles(agentMode)]) {
    findings.push(await presenceFinding(root, file));
  }

  const configPath = path.join(root, "fuckia.config.yaml");
  if (await fileExists(configPath)) {
    const config = await readFile(configPath, "utf8");
    findings.push({
      id: "config:mode",
      level: /(^|\n)mode: strict(\n|$)/.test(config) ? "pass" : "fail",
      message: /(^|\n)mode: strict(\n|$)/.test(config) ? "fuckia.config.yaml mode is strict." : "fuckia.config.yaml mode is not strict."
    });
    findings.push({
      id: "config:github-strict",
      level: /strict_checks_enabled: true/.test(config) ? "pass" : "fail",
      message: /strict_checks_enabled: true/.test(config) ? "GitHub strict checks are enabled." : "GitHub strict checks are disabled."
    });
  }

  const prTemplatePath = path.join(root, ".github", "PULL_REQUEST_TEMPLATE.md");
  if (await fileExists(prTemplatePath)) {
    const body = await readFile(prTemplatePath, "utf8");
    for (const heading of requiredPrHeadings) {
      findings.push({
        id: `pr-template:${heading}`,
        level: body.includes(heading) ? "pass" : "fail",
        message: body.includes(heading) ? `${heading} is present.` : `${heading} is missing.`
      });
    }
    for (const line of requiredPrChecklistLines) {
      findings.push({
        id: `pr-template:rule:${line}`,
        level: body.includes(line) ? "pass" : "fail",
        message: body.includes(line) ? "Required PR rule is present." : `Required PR rule is missing: ${line}`
      });
    }
  }

  const generated = await checkGeneratedFileHeaders(root);
  for (const skillName of requiredSkillNames) {
    for (const file of requiredSkillFiles(agentMode, skillName)) {
      findings.push(await presenceFinding(root, file));
    }
  }

  for (const finding of generated) {
    findings.push({
      id: `generated:${finding.file}`,
      level: "fail",
      message: finding.message
    });
  }

  const language = await checkEvidenceLanguage(root);
  for (const finding of language) {
    findings.push({
      id: `language:${finding.file}:${finding.line}`,
      level: "fail",
      message: `${finding.file}:${finding.line}: ${finding.message} (${finding.phrase})`
    });
  }

  return {
    mode: "dry-run",
    targetRoot: root,
    writes: "none",
    findings,
    nextSteps: findings.some((finding) => finding.level === "fail")
      ? ["Run `fuckia strict --apply` after installing governance files and reviewing the report."]
      : ["Strict mode local checks pass."]
  };
}

async function readConfiguredAgentMode(root: string): Promise<ResolvedAgentMode> {
  const configPath = path.join(root, "fuckia.config.yaml");
  if (!(await fileExists(configPath))) {
    return "dual-agent";
  }

  const config = await readFile(configPath, "utf8");
  const match = config.match(/(^|\n)\s*agent_mode:\s*(codex-only|claude-only|dual-agent)(\s|$)/);
  return (match?.[2] as ResolvedAgentMode | undefined) ?? "dual-agent";
}

function requiredAgentFiles(agentMode: ResolvedAgentMode): string[] {
  if (agentMode === "codex-only") {
    return ["AGENTS.md"];
  }

  if (agentMode === "claude-only") {
    return ["CLAUDE.md"];
  }

  return ["AGENTS.md", "CLAUDE.md"];
}

function requiredSkillFiles(agentMode: ResolvedAgentMode, skillName: string): string[] {
  if (agentMode === "codex-only") {
    return [`.agents/skills/${skillName}/SKILL.md`];
  }

  if (agentMode === "claude-only") {
    return [`.claude/skills/${skillName}/SKILL.md`];
  }

  return [
    `.claude/skills/${skillName}/SKILL.md`,
    `.agents/skills/${skillName}/SKILL.md`
  ];
}

export async function applyStrictMode(targetRoot: string): Promise<StrictApplyResult> {
  const root = path.resolve(targetRoot);
  const reportBefore = await checkStrictMode(root);
  const blockers = reportBefore.findings
    .filter((finding) => finding.level === "fail" && !["config:mode", "config:github-strict"].includes(finding.id))
    .map((finding) => finding.message);

  const configPath = path.join(root, "fuckia.config.yaml");
  if (!(await fileExists(configPath))) {
    blockers.push("fuckia.config.yaml is missing.");
  }

  if (blockers.length > 0) {
    return {
      status: "blocked",
      targetRoot: root,
      written: [],
      blockers,
      reportBefore
    };
  }

  const config = await readFile(configPath, "utf8");
  const strictConfig = config
    .replace(/(^|\n)(\s*)mode:\s*["']?warning["']?(\s*(?:#.*)?)(\n|$)/, "$1$2mode: strict$3$4")
    .replace(/(^|\n)(\s*)strict_checks_enabled:\s*false(\s*(?:#.*)?)(\n|$)/g, "$1$2strict_checks_enabled: true$3$4")
    .replace(
      /(^|\n)(\s*)pr_template:\s*["']?\.github\/pull_request_template\.md["']?(\s*(?:#.*)?)(\n|$)/g,
      "$1$2pr_template: .github/PULL_REQUEST_TEMPLATE.md$3$4"
    );

  if (strictConfig === config) {
    const alreadyStrict =
      /(^|\n)\s*mode:\s*["']?strict["']?(\s*(?:#.*)?)(\n|$)/.test(config) &&
      /(^|\n)\s*strict_checks_enabled:\s*true(\s*(?:#.*)?)(\n|$)/.test(config) &&
      /(^|\n)\s*pr_template:\s*["']?\.github\/PULL_REQUEST_TEMPLATE\.md["']?(\s*(?:#.*)?)(\n|$)/.test(config);

    if (alreadyStrict) {
      return {
        status: "unchanged",
        targetRoot: root,
        written: [],
        blockers: [],
        reportBefore
      };
    }

    return {
      status: "blocked",
      targetRoot: root,
      written: [],
      blockers: ["fuckia.config.yaml does not match the supported warning-mode config shape."],
      reportBefore
    };
  }

  const receiptPath = path.join("docs", "fuckia", "strict-mode.md");
  await writeFile(configPath, strictConfig, "utf8");
  await mkdir(path.dirname(path.join(root, receiptPath)), { recursive: true });
  await writeFile(path.join(root, receiptPath), renderStrictReceipt(await readConfiguredAgentMode(root)), "utf8");

  return {
    status: "applied",
    targetRoot: root,
    written: ["fuckia.config.yaml", receiptPath],
    blockers: [],
    reportBefore
  };
}

async function presenceFinding(root: string, file: string): Promise<StrictFinding> {
  const exists = await fileExists(path.join(root, file));
  return {
    id: `file:${file}`,
    level: exists ? "pass" : "fail",
    message: exists ? `${file}: present` : `${file}: missing`
  };
}

function renderStrictReceipt(agentMode: ResolvedAgentMode): string {
  return [
    "# Strict Mode Receipt",
    "",
    "Strict mode is enabled for this repository.",
    "",
    `Agent mode: \`${agentMode}\`.`,
    "",
    "Required local evidence:",
    "",
    "- installed agent rules;",
    "- generated skills for the configured agent mode;",
    "- GitHub collaboration workflows;",
    "- Linear issue templates;",
    "- end-of-work checkpoint;",
    "- PR template plan-review and verification sections.",
    ""
  ].join("\n");
}
