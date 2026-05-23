#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const lock = JSON.parse(await readFile(path.join(repoRoot, "kit", "pdg.lock.json"), "utf8"));
const requiredFiles = Object.values(lock.files);
const localRoot = process.env.FUCKIA_PDG_DIR;

for (const file of requiredFiles) {
  const content = localRoot
    ? await readFile(path.join(localRoot, file), "utf8")
    : await downloadText(rawGitHubUrl(lock, file));

  if (!content.trim()) {
    throw new Error(`PDG file is empty: ${file}`);
  }

  console.log(`current ${file}`);
}

console.log(`PDG repository reachable at ${lock.repository}#${lock.commit}.`);

function rawGitHubUrl(lockFile, relativePath) {
  const match = lockFile.repository.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new Error(`Unsupported PDG repository URL: ${lockFile.repository}`);
  }

  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${lockFile.commit}/${relativePath}`;
}

function downloadText(url) {
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
