import path from "node:path";
import { directoryExists, fileExists } from "../fs/readTree";

export interface InventoryItem {
  path: string;
  exists: boolean;
  kind: "file" | "directory";
}

export interface MigrationAudit {
  mode: "dry-run";
  targetRoot: string;
  inventory: InventoryItem[];
  conflicts: string[];
  nextSteps: string[];
  writePolicy: string;
}

const inventoryTargets: InventoryItem[] = [
  { path: "AGENTS.md", exists: false, kind: "file" },
  { path: "CLAUDE.md", exists: false, kind: "file" },
  { path: ".agents/skills", exists: false, kind: "directory" },
  { path: ".claude/skills", exists: false, kind: "directory" },
  { path: ".github/workflows", exists: false, kind: "directory" },
  { path: ".github/pull_request_template.md", exists: false, kind: "file" },
  { path: ".github/workflows/collab-contract.yml", exists: false, kind: "file" },
  { path: ".github/workflows/generated-skills.yml", exists: false, kind: "file" },
  { path: ".github/workflows/pr-scope.yml", exists: false, kind: "file" },
  { path: "fuckia.config.yaml", exists: false, kind: "file" },
  { path: "docs/specs", exists: false, kind: "directory" },
  { path: "docs/fuckia", exists: false, kind: "directory" },
  { path: "docs/fuckia/README.md", exists: false, kind: "file" }
];

export async function buildMigrationAudit(targetRoot: string): Promise<MigrationAudit> {
  const root = path.resolve(targetRoot);
  const inventory: InventoryItem[] = [];

  for (const item of inventoryTargets) {
    const absolutePath = path.join(root, item.path);
    const exists = item.kind === "directory" ? await directoryExists(absolutePath) : await fileExists(absolutePath);
    inventory.push({ ...item, exists });
  }

  const conflicts = inventory
    .filter((item) => item.exists && ["AGENTS.md", "CLAUDE.md", ".agents/skills", ".claude/skills"].includes(item.path))
    .map((item) => `${item.path} already exists and requires merge review.`);

  return {
    mode: "dry-run",
    targetRoot: root,
    inventory,
    conflicts,
    nextSteps: [
      "Run `fuckia migrate --plan` after reviewing this inventory.",
      "Keep warning mode during the first existing-project pilot.",
      "Do not modify product code during governance migration.",
      "Preserve existing agent instructions until a merge plan is approved."
    ],
    writePolicy: "No files were written. First slice migration is inventory-only."
  };
}
