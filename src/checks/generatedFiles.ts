import path from "node:path";
import { readTextFile, walkFiles } from "../fs/readTree";

export interface GeneratedFileFinding {
  file: string;
  message: string;
}

const generatedHeader = "GENERATED FILE - DO NOT EDIT DIRECTLY";
const requiredGeneratedKeys = ["source:", "source_hash:", "generated_by:", "target:"];

export async function checkGeneratedFileHeaders(rootDir: string): Promise<GeneratedFileFinding[]> {
  const findings: GeneratedFileFinding[] = [];
  const files = await walkFiles(rootDir, {
    extensions: [".md", ".json", ".yaml", ".yml"],
    ignoredDirectories: [".git", "node_modules", "dist"]
  });

  for (const absolutePath of files) {
    const content = await readTextFile(absolutePath);
    if (!content.includes(generatedHeader)) {
      continue;
    }

    const missingKeys = requiredGeneratedKeys.filter((key) => !content.includes(key));
    if (missingKeys.length > 0) {
      findings.push({
        file: normalizePath(path.relative(rootDir, absolutePath)),
        message: `Generated file header is missing: ${missingKeys.join(", ")}`
      });
    }
  }

  return findings;
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
