# CLI

The CLI is the deterministic enforcement surface used by the agent install procedure.

Implemented commands:

```text
fuckia --help
fuckia doctor [--self] [--strict]
fuckia install --dry-run
fuckia install --apply --yes
fuckia init --dry-run
fuckia init --apply
fuckia migrate --dry-run
fuckia migrate --plan
fuckia migrate --apply
fuckia generate-skills --check
fuckia generate-skills --write --examples
fuckia generate-skills --write --install
fuckia github --dry-run [--strict]
fuckia github --apply --yes
fuckia linear --dry-run [--strict] [--team <TEAM_KEY>]
fuckia linear --apply --yes --team <TEAM_KEY>
fuckia strict --dry-run [--strict]
fuckia strict --apply
```

Validators own gate results. AI reviews are evidence or advisory input.
