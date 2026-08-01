import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

test("Next owns the admin login, session and logout boundary without Replit Auth", () => {
  for (const file of [
    "app/api/admin/session/route.ts",
    "app/api/admin/login/route.ts",
    "app/api/admin/logout/route.ts",
    "app/api/admin/runtime/route.ts",
    "app/api/admin/blog/[[...path]]/route.ts",
    "server/next-admin-auth.ts",
  ]) assert.equal(exists(file), true, `missing ${file}`);

  const boundary = [
    read("server/next-admin-auth.ts"),
    read("app/api/admin/session/route.ts"),
    read("app/api/admin/login/route.ts"),
    read("app/api/admin/logout/route.ts"),
    read("app/api/admin/runtime/route.ts"),
    read("app/api/admin/blog/[[...path]]/route.ts"),
  ].join("\n");
  assert.doesNotMatch(boundary, /replit/i);
  assert.match(boundary, /httpOnly:\s*true/);
  assert.match(boundary, /sameSite:\s*["']lax["']/);
  assert.match(boundary, /timingSafeEqual/);
  assert.match(boundary, /scrypt/);
  assert.match(boundary, /["']Cache-Control["']:\s*["']no-store/);
});

test("App Router exposes the existing admin UI outside the public shell", () => {
  assert.equal(exists("app/admin/login/page.tsx"), true);
  assert.equal(exists("app/admin/blog/page.tsx"), true);
  assert.equal(exists("app/admin/layout.tsx"), true);
  assert.match(read("app/admin/login/page.tsx"), /AdminLogin/);
  assert.match(read("app/admin/blog/page.tsx"), /BlogAdminPage/);
  assert.match(read("client/src/pages/admin/AdminLogin.tsx"), /BLOG_ADMIN_PASSWORD \(or BLOG_ADMIN_PASSWORD_HASH\)/);
  assert.match(read("app/admin/layout.tsx"), /dynamic = ["']force-dynamic["']/);
  assert.match(read("app/admin/layout.tsx"), /fetchCache = ["']force-no-store["']/);
});

test("Replit keeps an authenticated public preview without weakening local development", () => {
  const packageJson = JSON.parse(read("package.json"));
  const replit = read(".replit");
  assert.equal(packageJson.scripts.dev, "next dev -H 127.0.0.1 -p 3100");
  assert.equal(packageJson.scripts["dev:replit"], "node scripts/run-replit-dev.mjs");
  assert.match(replit, /^run = "npm run dev:replit"/m);
  assert.match(replit, /args = "npm run dev:replit"\s+waitForPort = 5000/m);

  const refused = spawnSync(process.execPath, ["scripts/run-replit-dev.mjs"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      BLOG_ADMIN_AUTH_MODE: "off",
      ADMIN_AUTH_MODE: "",
    },
  });
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /Refusing to expose the Replit preview while admin authentication is disabled/);

  for (const [variable, mode, envFile] of [
    ["BLOG_ADMIN_AUTH_MODE", "off", ".env.local"],
    ["ADMIN_AUTH_MODE", "disabled", ".env.development.local"],
  ]) {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "healing-minds-replit-preview-"));
    try {
      fs.writeFileSync(path.join(fixtureDir, envFile), `${variable}=${mode}\n`, "utf8");
      const fixtureEnv = { ...process.env };
      delete fixtureEnv.BLOG_ADMIN_AUTH_MODE;
      delete fixtureEnv.ADMIN_AUTH_MODE;
      const refusedFromFile = spawnSync(
        process.execPath,
        [path.join(root, "scripts/run-replit-dev.mjs")],
        {
          cwd: fixtureDir,
          encoding: "utf8",
          env: fixtureEnv,
        },
      );
      assert.notEqual(refusedFromFile.status, 0, `${variable}=${mode} in ${envFile} must fail closed`);
      assert.match(refusedFromFile.stderr, /Refusing to expose the Replit preview while admin authentication is disabled/);
    } finally {
      fs.rmSync(fixtureDir, { recursive: true, force: true });
    }
  }
});
