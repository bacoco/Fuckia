import { readFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import type { SkillTarget } from "../skills/generateSharedSkills";

export interface PdgLock {
  name: string;
  repository: string;
  commit: string;
  files: {
    codexSkill: string;
    claudeSkill: string;
    codexTrigger: string;
    claudeTrigger: string;
  };
}

export interface PdgInstallFile {
  relativePath: string;
  source: string;
  content: string;
}

export interface PdgPlannedFile {
  path: string;
  source: string;
  purpose: string;
}

const skillOutputByTarget: Record<SkillTarget, string> = {
  codex: ".agents/skills/progressive-disclosure-guard/SKILL.md",
  claude: ".claude/skills/progressive-disclosure-guard/SKILL.md"
};

const triggerOutputByTarget: Record<SkillTarget, string> = {
  codex: "AGENTS.md",
  claude: "CLAUDE.md"
};

const lockCache = new Map<string, Promise<PdgLock>>();
const fileCache = new Map<string, Promise<string>>();

export async function readPdgLock(packageRoot: string): Promise<PdgLock> {
  const lockPath = path.join(packageRoot, "kit", "pdg.lock.json");
  let cached = lockCache.get(lockPath);
  if (!cached) {
    cached = readFile(lockPath, "utf8").then((content) => JSON.parse(content) as PdgLock);
    lockCache.set(lockPath, cached);
  }

  return cached;
}

export async function buildPdgInstallFiles(
  packageRoot: string,
  targets: SkillTarget[],
  includeTriggerBlocks: boolean
): Promise<PdgInstallFile[]> {
  const files: PdgInstallFile[] = [];

  for (const target of targets) {
    files.push({
      relativePath: skillOutputByTarget[target],
      source: await pdgSourceLabel(packageRoot, pdgSkillPathKey(target)),
      content: await readPdgFile(packageRoot, pdgSkillPathKey(target))
    });

    if (includeTriggerBlocks) {
      files.push({
        relativePath: triggerOutputByTarget[target],
        source: await pdgSourceLabel(packageRoot, pdgTriggerPathKey(target)),
        content: await readPdgFile(packageRoot, pdgTriggerPathKey(target))
      });
    }
  }

  return files;
}

export function plannedPdgInstallFiles(targets: SkillTarget[], includeTriggerBlocks: boolean): PdgPlannedFile[] {
  const planned: PdgPlannedFile[] = [];
  for (const target of targets) {
    planned.push({
      path: skillOutputByTarget[target],
      source: "PDG repository",
      purpose: `${target} PDG skill from the pinned PDG repository.`
    });

    if (includeTriggerBlocks) {
      planned.push({
        path: triggerOutputByTarget[target],
        source: "PDG repository",
        purpose: `${target} PDG trigger block from the pinned PDG repository.`
      });
    }
  }

  return planned;
}

export async function readPdgTriggerBlock(packageRoot: string, target: SkillTarget): Promise<string> {
  return readPdgFile(packageRoot, pdgTriggerPathKey(target));
}

async function readPdgFile(packageRoot: string, key: keyof PdgLock["files"]): Promise<string> {
  const lock = await readPdgLock(packageRoot);
  const relativePath = lock.files[key];
  const localRoot = process.env.FUCKIA_PDG_DIR;
  const cacheKey = localRoot ? `local:${localRoot}:${relativePath}` : `remote:${lock.commit}:${relativePath}`;
  let cached = fileCache.get(cacheKey);
  if (!cached) {
    cached = localRoot
      ? readFile(path.join(localRoot, relativePath), "utf8")
      : downloadText(rawGitHubUrl(lock, relativePath));
    fileCache.set(cacheKey, cached);
  }

  return cached;
}

async function pdgSourceLabel(packageRoot: string, key: keyof PdgLock["files"]): Promise<string> {
  const lock = await readPdgLock(packageRoot);
  return `${lock.repository}#${lock.commit}:${lock.files[key]}`;
}

function pdgSkillPathKey(target: SkillTarget): keyof PdgLock["files"] {
  return target === "codex" ? "codexSkill" : "claudeSkill";
}

function pdgTriggerPathKey(target: SkillTarget): keyof PdgLock["files"] {
  return target === "codex" ? "codexTrigger" : "claudeTrigger";
}

function rawGitHubUrl(lock: PdgLock, relativePath: string): string {
  const match = lock.repository.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new Error(`Unsupported PDG repository URL: ${lock.repository}`);
  }

  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${lock.commit}/${relativePath}`;
}

function downloadText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode ?? "unknown"}`));
        return;
      }

      response.setEncoding("utf8");
      let body = "";
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => { resolve(body); });
    }).on("error", reject);
  });
}
