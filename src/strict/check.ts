import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkEvidenceLanguage } from "../checks/docsLanguage";
import { checkGeneratedFileHeaders } from "../checks/generatedFiles";
import { fileExists } from "../fs/readTree";

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
  status: "applied" | "blocked";
  targetRoot: string;
  written: string[];
  blockers: string[];
  reportBefore: StrictReport;
}

const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
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
  "## Plan Review",
  "## Real Workflow Verification",
  "## Adversarial Implementer Pass"
];

const requiredSkillNames = [
  "adversarial-implementer-guard",
  "cross-agent-handoff",
  "destructive-change-guard",
  "end-of-work-checkpoint",
  "plan-review-gate",
  "platform-permission-gate",
  "real-verification-gate",
  "source-of-truth-gate"
];

export async function checkStrictMode(targetRoot: string): Promise<StrictReport> {
  const root = path.resolve(targetRoot);
  const findings: StrictFinding[] = [];

  for (const file of requiredFiles) {
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
  }

  const generated = await checkGeneratedFileHeaders(root);
  for (const skillName of requiredSkillNames) {
    for (const file of [
      `.claude/skills/${skillName}/SKILL.md`,
      `.agents/skills/${skillName}/SKILL.md`
    ]) {
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
    .replace(/(^|\n)mode: warning(\n|$)/, "$1mode: strict$2")
    .replace(/strict_checks_enabled: false/g, "strict_checks_enabled: true")
    .replace(/pr_template: \.github\/pull_request_template\.md/g, "pr_template: .github/PULL_REQUEST_TEMPLATE.md");

  if (strictConfig === config) {
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
  await writeFile(path.join(root, receiptPath), renderStrictReceipt(), "utf8");

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

function renderStrictReceipt(): string {
  return [
    "# Strict Mode Receipt",
    "",
    "Strict mode is enabled for this repository.",
    "",
    "Required local evidence:",
    "",
    "- installed agent rules;",
    "- generated Claude and Codex skills;",
    "- GitHub collaboration workflows;",
    "- Linear issue templates;",
    "- end-of-work checkpoint;",
    "- PR template plan-review and verification sections.",
    ""
  ].join("\n");
}
