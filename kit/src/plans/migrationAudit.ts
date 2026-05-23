import path from "node:path";
import { directoryExists, fileExists } from "../fs/readTree";
import type { ResolvedAgentMode } from "../install/agentMode";
import { guardSkillName, type InstallProfile } from "../install/installProfile";

export interface InventoryItem {
  path: string;
  exists: boolean;
  kind: "file" | "directory";
}

export interface MigrationAudit {
  mode: "dry-run";
  agentMode: ResolvedAgentMode;
  installProfile: InstallProfile;
  targetRoot: string;
  inventory: InventoryItem[];
  conflicts: string[];
  nextSteps: string[];
  writePolicy: string;
}

const inventoryTargets: InventoryItem[] = [
  { path: "AGENTS.md", exists: false, kind: "file" },
  { path: "CLAUDE.md", exists: false, kind: "file" },
  { path: ".agents/README.md", exists: false, kind: "file" },
  { path: ".agents/skills", exists: false, kind: "directory" },
  { path: ".agents/skills/README.md", exists: false, kind: "file" },
  { path: ".claude/README.md", exists: false, kind: "file" },
  { path: ".claude/skills", exists: false, kind: "directory" },
  { path: ".claude/skills/README.md", exists: false, kind: "file" },
  { path: ".github/workflows", exists: false, kind: "directory" },
  { path: ".github/workflows/README.md", exists: false, kind: "file" },
  { path: ".github/PULL_REQUEST_TEMPLATE.md", exists: false, kind: "file" },
  { path: ".github/workflows/collab-contract.yml", exists: false, kind: "file" },
  { path: ".github/workflows/generated-skills.yml", exists: false, kind: "file" },
  { path: ".github/workflows/pr-scope.yml", exists: false, kind: "file" },
  { path: "fuckia.config.yaml", exists: false, kind: "file" },
  { path: "docs/specs", exists: false, kind: "directory" },
  { path: "docs/README.md", exists: false, kind: "file" },
  { path: "docs/fuckia", exists: false, kind: "directory" },
  { path: "docs/fuckia/README.md", exists: false, kind: "file" },
  { path: "docs/fuckia/archive/README.md", exists: false, kind: "file" },
  { path: "docs/fuckia/linear/README.md", exists: false, kind: "file" },
  { path: "docs/fuckia/linear/templates/README.md", exists: false, kind: "file" },
  { path: "docs/fuckia/merge-proposals/README.md", exists: false, kind: "file" }
];

export async function buildMigrationAudit(
  targetRoot: string,
  agentMode: ResolvedAgentMode = "dual-agent",
  installProfile: InstallProfile = "full"
): Promise<MigrationAudit> {
  const root = path.resolve(targetRoot);
  const inventory: InventoryItem[] = [];

  for (const item of inventoryFor(agentMode, installProfile)) {
    const absolutePath = path.join(root, item.path);
    const exists = item.kind === "directory" ? await directoryExists(absolutePath) : await fileExists(absolutePath);
    inventory.push({ ...item, exists });
  }

  const conflicts = inventory
    .filter((item) => item.exists && ["AGENTS.md", "CLAUDE.md", ".agents/skills", ".claude/skills"].includes(item.path))
    .map((item) => `${item.path} already exists and requires merge review.`);

  return {
    mode: "dry-run",
    agentMode,
    installProfile,
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

function inventoryFor(agentMode: ResolvedAgentMode, installProfile: InstallProfile): InventoryItem[] {
  if (installProfile === "guard-only") {
    return guardOnlyInventory(agentMode);
  }

  return inventoryTargets.filter((item) => includeInventoryItem(item.path, agentMode));
}

function guardOnlyInventory(agentMode: ResolvedAgentMode): InventoryItem[] {
  return [
    ...(agentMode === "claude-only" ? [] : [{
      path: `.agents/skills/${guardSkillName}/SKILL.md`,
      exists: false,
      kind: "file" as const
    }]),
    ...(agentMode === "codex-only" ? [] : [{
      path: `.claude/skills/${guardSkillName}/SKILL.md`,
      exists: false,
      kind: "file" as const
    }])
  ];
}

function includeInventoryItem(itemPath: string, agentMode: ResolvedAgentMode): boolean {
  if (agentMode !== "claude-only" && (itemPath === "AGENTS.md" || itemPath.startsWith(".agents"))) {
    return true;
  }

  if (agentMode !== "codex-only" && (itemPath === "CLAUDE.md" || itemPath.startsWith(".claude"))) {
    return true;
  }

  return !(
    itemPath === "AGENTS.md" ||
    itemPath.startsWith(".agents") ||
    itemPath === "CLAUDE.md" ||
    itemPath.startsWith(".claude")
  );
}
