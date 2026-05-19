export function formatHelp(): string {
  return [
    "Fuckia",
    "",
    "Usage:",
    "  fuckia --help",
    "  fuckia doctor [--self] [--strict]",
    "  fuckia init --dry-run",
    "  fuckia migrate --dry-run",
    "  fuckia generate-skills --check",
    "  fuckia generate-skills --write --examples",
    "",
    "Safety rule:",
    "  Install and migration commands are read-only unless a future explicit --apply command exists.",
    "  Skill generation writes only generated examples when --write --examples is used.",
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
