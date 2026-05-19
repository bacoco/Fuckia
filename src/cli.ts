#!/usr/bin/env node
import path from "node:path";
import { runCli } from "./core/runCli";

void runCli(process.argv.slice(2), {
  packageRoot: path.resolve(__dirname, "..", ".."),
  cwd: process.cwd(),
  stdout: (message) => process.stdout.write(message),
  stderr: (message) => process.stderr.write(message)
}).then((exitCode) => {
  process.exitCode = exitCode;
});
