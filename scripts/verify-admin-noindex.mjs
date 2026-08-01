import assert from "node:assert/strict";
import net from "node:net";
import { spawn } from "node:child_process";

const getAvailablePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const port = typeof address === "object" && address ? address.port : null;
    probe.close((error) => {
      if (error) reject(error);
      else if (port) resolve(port);
      else reject(new Error("Unable to allocate a local verification port."));
    });
  });
});

const port = await getAvailablePort();
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let stderr = "";
server.stderr.on("data", (chunk) => { stderr += chunk; });

const fetchWhenReady = async (pathname, init) => {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next exited before verification: ${stderr}`);
    }
    try {
      return await fetch(`${origin}${pathname}`, init);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`Next did not become ready: ${lastError?.message || stderr}`);
};

const assertAdminNoindex = async (pathname) => {
  const response = await fetchWhenReady(pathname, {
    headers: { "User-Agent": "Googlebot" },
  });
  assert.equal(response.status, 200, `${pathname} must remain reachable to authenticated users and crawlers`);
  const html = await response.text();
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, `${pathname} must render a document head`);
  const robots = head.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0];
  assert.ok(robots, `${pathname} must render robots metadata inside head`);
  assert.match(robots, /content=["'][^"']*noindex/i);
  assert.match(robots, /content=["'][^"']*nofollow/i);
};

try {
  await assertAdminNoindex("/admin/login");
  await assertAdminNoindex("/admin/blog");

  const robots = await (await fetchWhenReady("/robots.txt")).text();
  assert.doesNotMatch(robots, /^Disallow:\s*\/admin(?:\/\*?|[*])?\s*$/mi);
  assert.match(robots, /^Disallow:\s*\/api\/admin\/$/mi);

  const sitemap = await (await fetchWhenReady("/sitemap.xml")).text();
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/admin(?:\/|<)/i);

  console.log("Admin noindex production smoke passed for login, editor, robots and sitemap.");
} finally {
  server.kill();
}
