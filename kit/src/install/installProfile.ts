export type InstallProfile = "full" | "guard-only";

export const guardSkillName = "adversarial-implementer-guard";
export const guardDisplayName = "Adversarial Progressive Disclosure Guard";

export function parseInstallProfile(value: string | undefined): InstallProfile | null {
  if (value === undefined || value === "") {
    return "full";
  }

  if (value === "full" || value === "guard-only") {
    return value;
  }

  return null;
}

export function skillNamesForInstallProfile(profile: InstallProfile): string[] | undefined {
  if (profile === "guard-only") {
    return [guardSkillName];
  }

  return undefined;
}
