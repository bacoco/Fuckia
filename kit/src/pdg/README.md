# PDG Repository Adapter

This module is the only Fuckia code that reads the standalone PDG repository.

It uses `kit/pdg.lock.json` to resolve the pinned PDG commit and file names, then returns install-ready files for Codex and Claude:

- PDG skill files;
- PDG trigger blocks for `AGENTS.md` and `CLAUDE.md`.

Set `FUCKIA_PDG_DIR` during tests to read a local PDG fixture instead of downloading from GitHub.
