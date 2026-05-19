import { chmod, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const wrapperPath = path.join(distDir, "cli.js");
const wrapper = [
  "#!/usr/bin/env node",
  "require('./src/cli.js');",
  ""
].join("\n");

await mkdir(distDir, { recursive: true });
await writeFile(wrapperPath, wrapper, "utf8");
await chmod(wrapperPath, 0o755);
