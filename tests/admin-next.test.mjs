import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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
  assert.match(read("app/admin/layout.tsx"), /dynamic = ["']force-dynamic["']/);
  assert.match(read("app/admin/layout.tsx"), /fetchCache = ["']force-no-store["']/);
});
