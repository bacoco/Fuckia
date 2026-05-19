# Technical Decisions

## Repo Boundary

Build a standalone repo/package. Do not implement inside an existing product repo.

## Stack

Use TypeScript/Node for v1.

## Enforcement

Use deterministic GitHub/CLI validators as gates.

AI review is evidence or advisory input unless mapped to a deterministic check.

## Linear Encoding

Use issue Markdown sections, labels, blocker relations, comments, and documents for v1.

Use custom fields only after verifying the target workspace supports the required behavior.

## Third Model

Start with read-only challenge, synthesis, and review roles.

Writing requires a normal implementer issue, file locks, and gates.

