import { eq, ilike } from "drizzle-orm";
import { db, pool } from "../server/db";
import { contactMessages } from "../shared/schema";

const origin = process.env.VERIFY_ORIGIN || "http://127.0.0.1:3100";
let id: string | undefined;
try {
  await db.delete(contactMessages).where(ilike(contactMessages.email, "workflow-%@healingmindsp.com"));
  const response = await fetch(`${origin}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 150) + 1}`,
    },
    body: JSON.stringify({
      firstName: "Workflow",
      lastName: "Verification",
      email: `workflow-${Date.now()}@healingmindsp.com`,
      phone: "+1 239 000 0000",
      preferredLanguage: "English",
      message: "Controlled infrastructure verification. This is not a patient inquiry and contains no health information.",
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
  console.log(JSON.stringify({ success: true, status: response.status, persisted: true, cleanedUp: true }, null, 2));
} finally {
  if (id) await db.delete(contactMessages).where(eq(contactMessages.id, id)).catch(() => undefined);
  await pool.end();
}
