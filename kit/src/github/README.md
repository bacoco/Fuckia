# GitHub Remote Setup

This directory contains the GitHub remote inspection code.

It is separate from template installation:

- template installation writes local `.github/...` files into the target repository;
- remote inspection verifies the real GitHub repository, Actions settings, and required checks;
- remote write automation must preserve existing repository protections and requires an explicit apply command.
