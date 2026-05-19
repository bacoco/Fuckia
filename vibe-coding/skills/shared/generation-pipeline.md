# Generation Pipeline

Use one neutral source and generate two outputs:

```text
neutral source
  -> Claude adapter
  -> .claude/skills/<name>/SKILL.md

neutral source
  -> Codex adapter
  -> .agents/skills/<name>/SKILL.md
```

Generated files include source path, source hash, target platform, and generation metadata.

