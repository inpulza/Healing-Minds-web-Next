import { randomUUID } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { db, pool } from "../server/db";
import { contactMessages } from "../shared/schema";

const origin = process.env.VERIFY_ORIGIN || "http://127.0.0.1:3100";
const verificationEmailTemplate = process.env.VERIFY_CONTACT_EMAIL?.trim()
  || "delivered+{run}@resend.dev";
const verificationMessage = "Controlled infrastructure verification. This is not a patient inquiry and contains no health information.";
const staleVerificationCutoff = new Date(Date.now() - 15 * 60 * 1_000);

function splitEmail(email: string): { local: string; domain: string } {
  const separator = email.lastIndexOf("@");
  if (separator <= 0 || separator === email.length - 1) {
    throw new Error("VERIFY_CONTACT_EMAIL must be a valid email address");
  }
  return {
    local: email.slice(0, separator),
    domain: email.slice(separator + 1),
  };
}

function createVerificationEmail(template: string): string {
  if (!template.includes("{run}")) {
    throw new Error("VERIFY_CONTACT_EMAIL must contain the {run} placeholder so every verification has a routable unique address");
  }
  const runId = `workflow-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const verificationEmail = template.replaceAll("{run}", runId);
  splitEmail(verificationEmail);
  return verificationEmail;
}

async function removeOrphanedVerificationRows(): Promise<void> {
  await db.delete(contactMessages).where(and(
    eq(contactMessages.firstName, "Workflow"),
    eq(contactMessages.lastName, "Verification"),
    eq(contactMessages.message, verificationMessage),
    lt(contactMessages.createdAt, staleVerificationCutoff),
  ));
}

let id: string | undefined;
const verificationEmail = createVerificationEmail(verificationEmailTemplate);
let verified = false;
try {
  await removeOrphanedVerificationRows();
  const response = await fetch(`${origin}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 150) + 1}`,
      ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
        ? { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
        : {}),
    },
    body: JSON.stringify({
      firstName: "Workflow",
      lastName: "Verification",
      email: verificationEmail,
      phone: "+1 239 000 0000",
      preferredLanguage: "English",
      message: verificationMessage,
      formStartedAt: Date.now() - 15_000,
      website: "",
      url: "",
      homepage: "",
      companyWebsite: "",
    }),
  });
  const body = await response.json();
  if (response.status !== 200 || !body.success || typeof body.id !== "string") {
    throw new Error(`Contact route returned ${response.status}: ${JSON.stringify(body)}`);
  }
  const storedId = body.id as string;
  id = storedId;
  const [stored] = await db.select({ id: contactMessages.id }).from(contactMessages).where(eq(contactMessages.id, storedId)).limit(1);
  if (!stored) throw new Error("Contact submission was not durably stored in Neon PostgreSQL");
  verified = true;
} finally {
  try {
    // Email cleanup covers the case where the route persisted the row but its
    // response was lost before this verifier could capture the returned id.
    await db.delete(contactMessages).where(eq(contactMessages.email, verificationEmail));
    if (id) await db.delete(contactMessages).where(eq(contactMessages.id, id));
  } finally {
    await pool.end();
  }
}

if (verified) {
  console.log(JSON.stringify({ success: true, status: 200, persisted: true, cleanedUp: true }, null, 2));
}
