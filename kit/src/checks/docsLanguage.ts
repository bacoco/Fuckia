import path from "node:path";
import { readTextFile, walkFiles } from "../fs/readTree";

export interface LanguageFinding {
  file: string;
  line: number;
  phrase: string;
  message: string;
}

const forbiddenPatterns: Array<{ phrase: string; pattern: RegExp }> = [
  { phrase: "it seems", pattern: /\bit seems\b/i },
  { phrase: "seems", pattern: /\bseems\b/i },
  { phrase: "probably", pattern: /\bprobably\b/i },
  { phrase: "likely", pattern: /\blikely\b/i },
  { phrase: "maybe", pattern: /\bmaybe\b/i },
  { phrase: "might", pattern: /\bmight\b/i },
  { phrase: "appears to", pattern: /\bappears to\b/i },
  { phrase: "I think", pattern: /\bI think\b/i }
];

const allowedFiles = new Set([
  "kit/vibe-coding/constitution/evidence-language/forbidden-patterns.md"
]);

export async function checkEvidenceLanguage(rootDir: string): Promise<LanguageFinding[]> {
  const files = await walkFiles(rootDir, {
    extensions: [".md"],
    ignoredDirectories: [".git", "node_modules", "dist"]
  });
  const findings: LanguageFinding[] = [];

  for (const absolutePath of files) {
    const relativePath = normalizePath(path.relative(rootDir, absolutePath));
    if (allowedFiles.has(relativePath)) {
      continue;
    }

    const content = await readTextFile(absolutePath);
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const forbidden of forbiddenPatterns) {
        if (forbidden.pattern.test(line)) {
          findings.push({
            file: relativePath,
            line: index + 1,
            phrase: forbidden.phrase,
            message: "Replace unsupported uncertainty with Unknown, a question, or verified evidence."
          });
        }
      }
    });
  }

  return findings;
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
