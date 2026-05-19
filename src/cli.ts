#!/usr/bin/env node
import { runCli } from "./core/runCli";

void runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: (message) => process.stdout.write(message),
  stderr: (message) => process.stderr.write(message)
}).then((exitCode) => {
  process.exitCode = exitCode;
});
