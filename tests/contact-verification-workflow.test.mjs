import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "verify-live-contact.ts");
const source = fs.readFileSync(scriptPath, "utf8");

test("live contact verification uses a unique labeled address on every run", () => {
  assert.match(source, /workflow-\$\{Date\.now\(\)\}-\$\{randomUUID\(\)\.slice\(0, 8\)\}/);
  assert.match(source, /return `\$\{local\}\+\$\{uniqueLabel\}@\$\{domain\}`/);
  assert.match(source, /const verificationEmail = createVerificationEmail\(configuredVerificationEmail\)/);
});

test("live contact verification removes legacy, labeled, and response-loss rows", () => {
  assert.match(source, /eq\(contactMessages\.email, configuredEmail\)/);
  assert.match(source, /`\$\{local\}\+workflow-%@\$\{domain\}`/);
  assert.match(source, /eq\(contactMessages\.email, verificationEmail\)/);
  assert.ok(
    source.indexOf("eq(contactMessages.email, verificationEmail)") > source.indexOf("} finally {"),
    "response-loss cleanup must run in the finally block",
  );
});
