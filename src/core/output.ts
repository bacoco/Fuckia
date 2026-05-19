export function formatHelp(): string {
  return [
    "Fuckia",
    "",
    "Usage:",
    "  fuckia --help",
    "  fuckia doctor [--self] [--strict]",
    "  fuckia init --dry-run",
    "  fuckia init --apply",
    "  fuckia migrate --dry-run",
    "  fuckia migrate --plan",
    "  fuckia migrate --apply",
    "  fuckia generate-skills --check",
    "  fuckia generate-skills --write --examples",
    "  fuckia github --dry-run [--strict]",
    "  fuckia github --apply --yes",
    "",
    "Safety rule:",
    "  Install and migration commands write only when an explicit --apply flag is used.",
    "  GitHub remote apply requires an explicit --apply --yes command.",
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
