import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "verify-live-contact.ts");
const source = fs.readFileSync(scriptPath, "utf8");

test("live contact verification uses a unique labeled address on every run", () => {
  assert.match(source, /VERIFY_CONTACT_EMAIL must contain the \{run\} placeholder/);
  assert.match(source, /workflow-\$\{Date\.now\(\)\}-\$\{randomUUID\(\)\.slice\(0, 8\)\}/);
  assert.match(source, /template\.replaceAll\("\{run\}", runId\)/);
  assert.match(source, /const verificationEmail = createVerificationEmail\(verificationEmailTemplate\)/);
});

test("live contact verification removes only stale marked or exact response-loss rows", () => {
  assert.match(source, /eq\(contactMessages\.firstName, "Workflow"\)/);
  assert.match(source, /eq\(contactMessages\.lastName, "Verification"\)/);
  assert.match(source, /eq\(contactMessages\.message, verificationMessage\)/);
  assert.match(source, /lt\(contactMessages\.createdAt, staleVerificationCutoff\)/);
  assert.match(source, /eq\(contactMessages\.email, verificationEmail\)/);
  assert.doesNotMatch(source, /eq\(contactMessages\.email, configuredEmail\)/);
  assert.doesNotMatch(source, /\+workflow-%/);
  assert.ok(
    source.indexOf("eq(contactMessages.email, verificationEmail)") > source.indexOf("} finally {"),
    "response-loss cleanup must run in the finally block",
  );
});
