import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), true);

const requestedAuthMode = (
  process.env.BLOG_ADMIN_AUTH_MODE
  || process.env.ADMIN_AUTH_MODE
  || ""
).trim().toLowerCase();

if (requestedAuthMode === "off" || requestedAuthMode === "disabled") {
  console.error(
    "Refusing to expose the Replit preview while admin authentication is disabled. "
    + "Configure BLOG_ADMIN_USERNAME, BLOG_ADMIN_PASSWORD (or BLOG_ADMIN_PASSWORD_HASH), "
    + "and BLOG_ADMIN_SESSION_SECRET instead.",
  );
  process.exit(1);
}

const port = process.env.PORT?.trim() || "5000";
const portNumber = Number(port);
if (!/^\d+$/.test(port) || !Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
  console.error("PORT must be an integer between 1 and 65535 for the Replit preview.");
  process.exit(1);
}

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(
  process.execPath,
  [nextBin, "dev", "-H", "0.0.0.0", "-p", port],
  { stdio: "inherit", env: process.env },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", error => {
  console.error(`Unable to start the Replit preview: ${error.message}`);
  process.exitCode = 1;
});

child.on("exit", code => {
  process.exitCode = code ?? 1;
});
