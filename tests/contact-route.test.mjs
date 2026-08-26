import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const routePath = path.join(process.cwd(), "app", "api", "contact", "route.ts");

test("contact submissions are owned by a Next Route Handler and persisted durably", () => {
  assert.equal(fs.existsSync(routePath), true, "missing app/api/contact/route.ts");
  const source = fs.readFileSync(routePath, "utf8");
  assert.match(source, /export\s+async\s+function\s+POST/);
  assert.match(source, /contactFormRequestSchema\.parse/);
  assert.match(source, /insertContactMessageSchema\.parse/);
  assert.match(source, /contactMessages/);
  assert.match(source, /db\.transaction/);
  assert.match(source, /tx\.insert\(contactMessages\)/);
  assert.match(source, /tx\.insert\(webAlertOutbox\)/);
  assert.match(source, /after\(async \(\) =>/);
  assert.ok(
    source.indexOf("tx.insert(webAlertOutbox)") < source.indexOf("after(async () =>"),
    "the durable outbox row must commit before background delivery starts",
  );
  assert.match(source, /evaluateContactSubmission/);
  assert.doesNotMatch(source, /MemStorage|console\.log\([^\n]*(submission|contactMessage|validatedData)/i);
  const emailSource = fs.readFileSync(path.join(process.cwd(), "server", "services", "email.ts"), "utf8");
  assert.doesNotMatch(emailSource, /^const\s+resend\s*=\s*new\s+Resend/m, "Resend must not be created during Next build");
});
