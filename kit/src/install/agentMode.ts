import path from "node:path";
import { directoryExists, fileExists } from "../fs/readTree";
import type { SkillTarget } from "../skills/generateSharedSkills";

export type AgentModeInput = "auto" | ResolvedAgentMode;
export type ResolvedAgentMode = "codex-only" | "claude-only" | "dual-agent";

export interface AgentSignals {
  codex: boolean;
  claude: boolean;
  codexMarkers: string[];
  claudeMarkers: string[];
}

export type AgentModeResolution = ResolvedAgentModeResolution | AmbiguousAgentModeResolution;

export interface ResolvedAgentModeResolution {
  requested: AgentModeInput;
  status: "resolved";
  mode: ResolvedAgentMode;
  signals: AgentSignals;
  question: null;
  reason: string;
}

export interface AmbiguousAgentModeResolution {
  requested: AgentModeInput;
  status: "ambiguous";
  mode: null;
  signals: AgentSignals;
  question: string;
  reason: string;
}

export function parseAgentMode(value: string | undefined): AgentModeInput | null {
  if (value === undefined || value === "") {
    return "auto";
  }

  if (value === "auto" || value === "codex-only" || value === "claude-only" || value === "dual-agent") {
    return value;
  }

  return null;
}

export async function resolveAgentMode(targetRoot: string, requested: AgentModeInput): Promise<AgentModeResolution> {
  const signals = await detectAgentSignals(targetRoot);

  if (requested !== "auto") {
    return {
      requested,
      status: "resolved",
      mode: requested,
      signals,
      question: null,
      reason: "Explicit agent mode selected."
    };
  }

  if (signals.codex && !signals.claude) {
    return resolved(requested, "codex-only", signals, "Detected Codex markers only.");
  }

  if (signals.claude && !signals.codex) {
    return resolved(requested, "claude-only", signals, "Detected Claude markers only.");
  }

  return {
    requested,
    status: "ambiguous",
    mode: null,
    signals,
    question: "Install Fuckia for Codex only, Claude only, or both?",
    reason: signals.codex && signals.claude
      ? "Detected both Codex and Claude markers."
      : "No Codex or Claude markers detected."
  };
}

export function targetsForAgentMode(mode: ResolvedAgentMode): SkillTarget[] {
  if (mode === "codex-only") {
    return ["codex"];
  }

  if (mode === "claude-only") {
    return ["claude"];
  }

  return ["claude", "codex"];
}

function resolved(
  requested: AgentModeInput,
  mode: ResolvedAgentMode,
  signals: AgentSignals,
  reason: string
): ResolvedAgentModeResolution {
  return {
    requested,
    status: "resolved",
    mode,
    signals,
    question: null,
    reason
  };
}

async function detectAgentSignals(targetRoot: string): Promise<AgentSignals> {
  const root = path.resolve(targetRoot);
  const codexMarkers = await existingMarkers(root, [
    { path: "AGENTS.md", kind: "file" },
    { path: ".agents", kind: "directory" },
    { path: ".agents/skills", kind: "directory" }
  ]);
  const claudeMarkers = await existingMarkers(root, [
    { path: "CLAUDE.md", kind: "file" },
    { path: ".claude", kind: "directory" },
    { path: ".claude/skills", kind: "directory" }
  ]);

  return {
    codex: codexMarkers.length > 0,
    claude: claudeMarkers.length > 0,
    codexMarkers,
    claudeMarkers
  };
}

async function existingMarkers(
  root: string,
  markers: Array<{ path: string; kind: "file" | "directory" }>
): Promise<string[]> {
  const existing: string[] = [];
  for (const marker of markers) {
    const absolutePath = path.join(root, marker.path);
    const exists = marker.kind === "file"
      ? await fileExists(absolutePath)
      : await directoryExists(absolutePath);
    if (exists) {
      existing.push(marker.path);
    }
  }
  return existing;
}
