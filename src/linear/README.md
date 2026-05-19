# Linear Setup

This directory contains Linear inspection and issue-chain creation code.

Linear issue templates are handled in two layers:

- local Markdown templates are installed into `docs/fuckia/linear/templates`;
- remote Linear setup can create a governed issue chain from those templates through the official GraphQL API.

Direct Linear template creation remains a human UI step unless the official API exposes template mutation support.
