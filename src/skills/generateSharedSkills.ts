import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type SkillTarget = "claude" | "codex";
export type SkillGenerationMode = "check" | "write";

export interface SkillGenerationOptions {
  rootDir: string;
  mode: SkillGenerationMode;
}

export interface SkillGenerationOutput {
  target: SkillTarget;
  source: string;
  output: string;
  status: "current" | "written" | "missing" | "drift";
}

export interface SkillGenerationResult {
  mode: SkillGenerationMode;
  sources: number;
  outputs: SkillGenerationOutput[];
  drift: SkillGenerationOutput[];
}

interface SharedSkillSource {
  name: string;
  description: string;
  targets: SkillTarget[];
  relativePath: string;
  hash: string;
  body: string;
}

export async function generateSharedSkills(options: SkillGenerationOptions): Promise<SkillGenerationResult> {
  const sourceDir = path.join(options.rootDir, "skills-src", "shared");
  const sources = await readSharedSkillSources(options.rootDir, sourceDir);
  const outputs: SkillGenerationOutput[] = [];

  for (const source of sources) {
    for (const target of source.targets) {
      const relativeOutput = normalizePath(path.join("examples", "generated-skills", target, source.name, "SKILL.md"));
      const absoluteOutput = path.join(options.rootDir, relativeOutput);
      const expected = renderGeneratedSkill(source, target);
      const current = await readOptionalFile(absoluteOutput);

      if (options.mode === "write") {
        await mkdir(path.dirname(absoluteOutput), { recursive: true });
        await writeFile(absoluteOutput, expected, "utf8");
        outputs.push({
          target,
          source: source.relativePath,
          output: relativeOutput,
          status: current === expected ? "current" : "written"
        });
        continue;
      }

      outputs.push({
        target,
        source: source.relativePath,
        output: relativeOutput,
        status: current === null ? "missing" : current === expected ? "current" : "drift"
      });
    }
  }

  const drift = outputs.filter((output) => output.status === "missing" || output.status === "drift");

  return {
    mode: options.mode,
    sources: sources.length,
    outputs,
    drift
  };
}

async function readSharedSkillSources(rootDir: string, sourceDir: string): Promise<SharedSkillSource[]> {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".skill.md"))
    .map((entry) => path.join(sourceDir, entry.name))
    .sort();

  const sources: SharedSkillSource[] = [];
  for (const sourceFile of sourceFiles) {
    const content = await readFile(sourceFile, "utf8");
    const parsed = parseSharedSkillSource(content, normalizePath(path.relative(rootDir, sourceFile)));
    sources.push(parsed);
  }

  return sources;
}

export function parseSharedSkillSource(content: string, relativePath: string): SharedSkillSource {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`${relativePath} must start with YAML frontmatter.`);
  }

  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();
  const name = readScalar(frontmatter, "name", relativePath);
  const description = readScalar(frontmatter, "description", relativePath);
  const targets = readArray(frontmatter, "targets", relativePath).map((target) => {
    if (target !== "claude" && target !== "codex") {
      throw new Error(`${relativePath} has unsupported target: ${target}`);
    }
    return target;
  });

  return {
    name,
    description,
    targets,
    relativePath,
    hash: sha256(content),
    body
  };
}

function readScalar(frontmatter: string, key: string, relativePath: string): string {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) {
    throw new Error(`${relativePath} is missing required frontmatter key: ${key}`);
  }
  return match[1].trim();
}

function readArray(frontmatter: string, key: string, relativePath: string): string[] {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) {
    throw new Error(`${relativePath} is missing required frontmatter list: ${key}`);
  }

  const values: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith("  - ")) {
      break;
    }
    values.push(line.slice(4).trim());
  }

  if (values.length === 0) {
    throw new Error(`${relativePath} has empty frontmatter list: ${key}`);
  }

  return values;
}

function renderGeneratedSkill(source: SharedSkillSource, target: SkillTarget): string {
  const body = injectPlatformMechanics(source.body, target);
  return [
    "---",
    `name: ${source.name}`,
    `description: ${source.description}`,
    "---",
    "",
    "<!--",
    "GENERATED FILE - DO NOT EDIT DIRECTLY",
    `source: ${source.relativePath}`,
    `source_hash: ${source.hash}`,
    "generated_by: fuckia generate-skills",
    `target: ${target}`,
    "-->",
    "",
    body,
    ""
  ].join("\n");
}

function injectPlatformMechanics(body: string, target: SkillTarget): string {
  const lines = body.split(/\r?\n/);
  const title = lines[0]?.startsWith("# ") ? lines[0] : null;
  const rest = title ? lines.slice(1).join("\n").trimStart() : body;
  const mechanics = target === "claude" ? claudeMechanics() : codexMechanics();

  if (!title) {
    return `${mechanics}\n\n${rest}`.trim();
  }

  return `${title}\n\n${mechanics}\n\n${rest}`.trim();
}

function claudeMechanics(): string {
  return [
    "## Claude Mechanics",
    "",
    "- Use Claude planning tools for task tracking.",
    "- Use Claude subagents only when file ownership is disjoint.",
    "- Do not run parallel agents on the same files.",
    "- Do not mark a risky Claude implementation as reviewed by the same Claude context."
  ].join("\n");
}

function codexMechanics(): string {
  return [
    "## Codex Mechanics",
    "",
    "- Use `rg` for repository inventory.",
    "- Use `apply_patch` for manual file edits.",
    "- Use Codex subagents only when file ownership is disjoint.",
    "- Do not run parallel agents on the same files.",
    "- Do not mark a risky Codex implementation as reviewed by the same Codex context."
  ].join("\n");
}

async function readOptionalFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function sha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
