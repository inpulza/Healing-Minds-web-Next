import crypto from "node:crypto";

const SCRYPT_KEY_LENGTH = 32;
const SCRYPT_SALT_BYTES = 16;
const command = process.argv[2] || "generate";

function fail(message, exitCode = 2) {
  process.stderr.write(`${message}\n`);
  process.exit(exitCode);
}

async function readStdin() {
  if (process.stdin.isTTY) return null;
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const value = Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
  return value || null;
}

function parseScryptVerifier(value) {
  const parts = value.trim().split(":");
  if (
    parts.length !== 3
    || parts[0].toLowerCase() !== "scrypt"
    || !/^[A-Za-z0-9_-]{16,128}$/.test(parts[1])
    || !/^[A-Za-z0-9_-]+$/.test(parts[2])
  ) {
    fail("BLOG_ADMIN_PASSWORD_HASH must use scrypt:<salt>:<key> format.");
  }

  const key = Buffer.from(parts[2], "base64url");
  if (key.length !== SCRYPT_KEY_LENGTH) {
    fail(`BLOG_ADMIN_PASSWORD_HASH must contain a ${SCRYPT_KEY_LENGTH}-byte scrypt key.`);
  }

  return { salt: parts[1], key };
}

const stdinPassword = await readStdin();
const password = stdinPassword ?? process.env.BLOG_ADMIN_PASSWORD;
if (!password) {
  fail("Provide the admin password through stdin or BLOG_ADMIN_PASSWORD.");
}

if (command === "generate") {
  const salt = crypto.randomBytes(SCRYPT_SALT_BYTES).toString("base64url");
  const key = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("base64url");
  process.stdout.write(`scrypt:${salt}:${key}\n`);
} else if (command === "verify") {
  const verifierValue = process.env.BLOG_ADMIN_PASSWORD_HASH;
  if (!verifierValue) {
    fail("Set BLOG_ADMIN_PASSWORD_HASH before running verify.");
  }
  const verifier = parseScryptVerifier(verifierValue);
  const candidate = crypto.scryptSync(password, verifier.salt, SCRYPT_KEY_LENGTH);
  const matches = candidate.length === verifier.key.length
    && crypto.timingSafeEqual(candidate, verifier.key);
  process.stdout.write(matches ? "MATCH\n" : "NO_MATCH\n");
  process.exit(matches ? 0 : 1);
} else {
  fail("Usage: npm run admin:password-hash -- <generate|verify>");
}
