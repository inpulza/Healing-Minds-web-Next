import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

if (existsSync(".env.local")) {
  loadEnvFile(".env.local");
}

await import("./verify-deployed-e2e-env.mjs");

const playwrightCli = fileURLToPath(
  new URL("../node_modules/@playwright/test/cli.js", import.meta.url),
);
const result = spawnSync(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
