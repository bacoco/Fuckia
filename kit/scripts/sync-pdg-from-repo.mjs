#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const lockPath = path.join(repoRoot, "kit", "pdg.lock.json");
const args = process.argv.slice(2);
const mode = args.includes("--write") ? "write" : "check";
const sourceArg = readOption("--source");
const lock = JSON.parse(await readFile(lockPath, "utf8"));
let tempDir = null;

try {
  const sourceRoot = sourceArg ? path.resolve(sourceArg) : await cloneLockedRepo(lock);
  const changes = [];

  for (const file of lock.files) {
    const sourceFile = path.join(sourceRoot, file.source);
    const targetFile = path.join(repoRoot, file.target);
    const sourceContent = await readFile(sourceFile, "utf8");
    const targetContent = await readOptional(targetFile);

    if (mode === "write") {
      await mkdir(path.dirname(targetFile), { recursive: true });
      await writeFile(targetFile, sourceContent, "utf8");
      changes.push(targetContent === sourceContent ? `current ${file.target}` : `wrote ${file.target}`);
      continue;
    }

    if (targetContent !== sourceContent) {
      changes.push(`drift ${file.target}`);
      continue;
    }

    changes.push(`current ${file.target}`);
  }

  for (const change of changes) {
    console.log(change);
  }

  if (mode === "check" && changes.some((change) => change.startsWith("drift "))) {
    console.error("PDG vendored files are not current. Run `npm run sync:pdg`.");
    process.exitCode = 1;
  }
} finally {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function readOption(name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }

  return value;
}

async function cloneLockedRepo(lockFile) {
  tempDir = await mkdtemp(path.join(tmpdir(), "fuckia-pdg-"));
  const checkoutDir = path.join(tempDir, "pdg");
  execFileSync("git", ["clone", "--no-checkout", lockFile.repository, checkoutDir], { stdio: "inherit" });
  execFileSync("git", ["-C", checkoutDir, "checkout", "--detach", lockFile.commit], { stdio: "inherit" });
  return checkoutDir;
}

async function readOptional(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}
