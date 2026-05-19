import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export interface WalkOptions {
  extensions?: string[];
  ignoredDirectories?: string[];
}

export async function fileExists(absolutePath: string): Promise<boolean> {
  try {
    const value = await stat(absolutePath);
    return value.isFile();
  } catch {
    return false;
  }
}

export async function directoryExists(absolutePath: string): Promise<boolean> {
  try {
    const value = await stat(absolutePath);
    return value.isDirectory();
  } catch {
    return false;
  }
}

export async function readTextFile(absolutePath: string): Promise<string> {
  return readFile(absolutePath, "utf8");
}

export async function walkFiles(rootDir: string, options: WalkOptions = {}): Promise<string[]> {
  const files: string[] = [];
  const ignoredDirectories = new Set(options.ignoredDirectories ?? []);
  const extensions = new Set(options.extensions ?? []);

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!isIgnoredDirectory(entry.name, ignoredDirectories)) {
          await visit(absolutePath);
        }
        continue;
      }

      if (entry.isFile() && (extensions.size === 0 || extensions.has(path.extname(entry.name)))) {
        files.push(absolutePath);
      }
    }
  }

  await visit(rootDir);
  return files.sort();
}

export async function walkDirectories(rootDir: string, options: WalkOptions = {}): Promise<string[]> {
  const directories: string[] = [rootDir];
  const ignoredDirectories = new Set(options.ignoredDirectories ?? []);

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || isIgnoredDirectory(entry.name, ignoredDirectories)) {
        continue;
      }

      const absolutePath = path.join(directory, entry.name);
      directories.push(absolutePath);
      await visit(absolutePath);
    }
  }

  await visit(rootDir);
  return directories.sort();
}

export async function snapshotTree(rootDir: string): Promise<string[]> {
  const files = await walkFiles(rootDir, {
    ignoredDirectories: [".git", "node_modules", "dist"]
  });
  return files.map((file) => normalizePath(path.relative(rootDir, file))).sort();
}

function isIgnoredDirectory(name: string, ignoredDirectories: Set<string>): boolean {
  return ignoredDirectories.has(name) || name.startsWith(".npm-cache");
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
