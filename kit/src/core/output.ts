export function formatHelp(): string {
  return [
    "Fuckia",
    "",
    "Usage:",
    "  fuckia --help",
    "  fuckia doctor [--self] [--strict]",
  "  fuckia install --dry-run",
  "  fuckia install --dry-run --agent-mode <auto|codex-only|claude-only|dual-agent>",
  "  fuckia install --apply --yes --agent-mode <codex-only|claude-only|dual-agent>",
  "  fuckia init --dry-run [--agent-mode <auto|codex-only|claude-only|dual-agent>]",
  "  fuckia init --apply --agent-mode <codex-only|claude-only|dual-agent>",
  "  fuckia migrate --dry-run [--agent-mode <auto|codex-only|claude-only|dual-agent>]",
  "  fuckia migrate --plan --agent-mode <codex-only|claude-only|dual-agent>",
  "  fuckia migrate --apply --agent-mode <codex-only|claude-only|dual-agent>",
    "  fuckia generate-skills --check",
    "  fuckia generate-skills --write --examples",
    "  fuckia generate-skills --write --install",
    "  fuckia github --dry-run [--strict]",
    "  fuckia github --apply --yes",
    "  fuckia linear --dry-run [--strict] [--team <TEAM_KEY>]",
    "  fuckia linear --apply --yes --team <TEAM_KEY>",
    "  fuckia strict --dry-run [--strict]",
    "  fuckia strict --apply",
    "",
    "Safety rule:",
  "  Install and migration commands write only when an explicit --apply flag is used.",
  "  Auto agent mode asks for Codex-only, Claude-only, or dual-agent when repo markers are ambiguous.",
    "  GitHub remote apply requires an explicit --apply --yes command.",
    "  Linear remote apply requires an explicit --apply --yes command.",
    "  Skill generation writes only generated skills when --write --examples or --write --install is used.",
    ""
  ].join("\n");
}

export function formatHeading(title: string): string {
  return `${title}\n${"=".repeat(title.length)}\n`;
}

export function formatBulletList(items: string[]): string {
  return `${items.map((item) => `- ${item}`).join("\n")}\n`;
}

export function formatJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
