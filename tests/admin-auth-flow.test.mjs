import assert from "node:assert/strict";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import test from "node:test";

const fixturePassword = "fixture-password-not-a-real-secret";
const fixtureSalt = "fixture-salt-value";
const fixtureKey = crypto.scryptSync(fixturePassword, fixtureSalt, 32).toString("base64url");

test("custom Next admin completes login, protected API, session and logout without real secrets", () => {
  const program = `
    import assert from "node:assert/strict";
    process.env.NODE_ENV = "production";
    process.env.BLOG_ADMIN_AUTH_MODE = "custom";
    process.env.BLOG_ADMIN_USERNAME = "fixture-editor";
    process.env.BLOG_ADMIN_PASSWORD_HASH = ${JSON.stringify(`scrypt:${fixtureSalt}:${fixtureKey}`)};
    process.env.BLOG_ADMIN_SESSION_SECRET = "fixture-session-secret-not-for-production";

    const { NextRequest } = await import("next/server");
    const login = await import("./app/api/admin/login/route.ts");
    const logout = await import("./app/api/admin/logout/route.ts");
    const session = await import("./app/api/admin/session/route.ts");
    const runtime = await import("./app/api/admin/runtime/route.ts");
    const blog = await import("./app/api/admin/blog/[[...path]]/route.ts");
    const auth = await import("./server/next-admin-auth.ts");

    const noStore = response => assert.match(response.headers.get("cache-control") || "", /no-store/);
    const request = new NextRequest("https://example.invalid/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.10" },
      body: JSON.stringify({ username: "fixture-editor", password: ${JSON.stringify(fixturePassword)} }),
    });
    const loginResponse = await login.POST(request);
    assert.equal(loginResponse.status, 200);
    noStore(loginResponse);
    const setCookie = loginResponse.headers.get("set-cookie") || "";
    assert.match(setCookie, /hm_admin_session=/);
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /Secure/i);
    assert.match(setCookie, /SameSite=lax/i);
    const cookie = setCookie.split(";")[0];

    const sessionResponse = await session.GET(new NextRequest("https://example.invalid/api/admin/session", {
      headers: { cookie },
    }));
    assert.equal(sessionResponse.status, 200);
    noStore(sessionResponse);
    const sessionBody = await sessionResponse.json();
    assert.equal(sessionBody.configured, true);
    assert.equal(sessionBody.mode, "custom");
    assert.equal(sessionBody.authenticated, true);

    const dashboardApi = await blog.GET(
      new NextRequest("https://example.invalid/api/admin/blog/images/config", { headers: { cookie } }),
      { params: Promise.resolve({ path: ["images", "config"] }) },
    );
    assert.equal(dashboardApi.status, 200);
    noStore(dashboardApi);

    const deniedApi = await runtime.GET(new NextRequest("https://example.invalid/api/admin/runtime"));
    assert.equal(deniedApi.status, 401);
    noStore(deniedApi);
    const protectedApi = await runtime.GET(new NextRequest("https://example.invalid/api/admin/runtime", {
      headers: { cookie },
    }));
    assert.equal(protectedApi.status, 200);
    noStore(protectedApi);

    const logoutResponse = await logout.POST();
    assert.equal(logoutResponse.status, 200);
    noStore(logoutResponse);
    assert.match(logoutResponse.headers.get("set-cookie") || "", /Max-Age=0/i);

    process.env.BLOG_ADMIN_AUTH_MODE = "off";
    delete process.env.BLOG_ADMIN_USERNAME;
    delete process.env.BLOG_ADMIN_PASSWORD_HASH;
    delete process.env.BLOG_ADMIN_SESSION_SECRET;
    assert.equal(auth.adminAuthMode(), "custom");
    assert.equal(auth.adminAuthConfigured(), false);
    const failClosed = await login.POST(new NextRequest("https://example.invalid/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.11" },
      body: JSON.stringify({ username: "x", password: "x" }),
    }));
    assert.equal(failClosed.status, 503);
    noStore(failClosed);

    console.log(JSON.stringify({
      login: "pass",
      session: "pass",
      protectedApi: "pass",
      logout: "pass",
      noStore: "pass",
      productionFailClosed: "pass",
    }));
  `;

  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(JSON.parse(result.stdout.trim()), {
    login: "pass",
    session: "pass",
    protectedApi: "pass",
    logout: "pass",
    noStore: "pass",
    productionFailClosed: "pass",
  });
});

test("scrypt utility generates and verifies without echoing the password", () => {
  const generated = spawnSync(
    process.execPath,
    ["scripts/admin-password-hash.mjs", "generate"],
    { cwd: process.cwd(), input: `${fixturePassword}\n`, encoding: "utf8" },
  );
  assert.equal(generated.status, 0, generated.stderr);
  assert.match(generated.stdout.trim(), /^scrypt:[A-Za-z0-9_-]+:[A-Za-z0-9_-]+$/);
  assert.doesNotMatch(generated.stdout, new RegExp(fixturePassword));

  const verified = spawnSync(
    process.execPath,
    ["scripts/admin-password-hash.mjs", "verify"],
    {
      cwd: process.cwd(),
      input: `${fixturePassword}\n`,
      encoding: "utf8",
      env: { ...process.env, BLOG_ADMIN_PASSWORD_HASH: generated.stdout.trim() },
    },
  );
  assert.equal(verified.status, 0, verified.stderr);
  assert.equal(verified.stdout.trim(), "MATCH");

  const rejected = spawnSync(
    process.execPath,
    ["scripts/admin-password-hash.mjs", "verify"],
    {
      cwd: process.cwd(),
      input: "wrong-fixture-password\n",
      encoding: "utf8",
      env: { ...process.env, BLOG_ADMIN_PASSWORD_HASH: generated.stdout.trim() },
    },
  );
  assert.equal(rejected.status, 1);
  assert.equal(rejected.stdout.trim(), "NO_MATCH");
});
