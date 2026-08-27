// Runnable smoke test for the contact-form anti-spam filter.
// Run with:  npx tsx server/services/spam-filter.smoke.ts
// Tests call the filter module directly (no HTTP) so no emails are sent and the
// rate limiter is not touched. The DNS check runs for real against the network.

import { evaluateContactSubmission } from "./spam-filter";
import { contactFormRequestSchema } from "@shared/schema";

const now = Date.now();
const HUMAN_START = now - 5000; // 5s ago: passes the timing check

interface Case {
  name: string;
  payload: Record<string, unknown>;
  expectSpam: boolean;
}

function basePayload(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: "Maria",
    lastName: "Gonzalez",
    email: "maria.gonzalez@gmail.com",
    phone: "(305) 423-0272",
    preferredLanguage: "english",
    message: "I would like to schedule an appointment for my anxiety.",
    formKey: "contact_page",
    formStartedAt: HUMAN_START,
    website: "",
    url: "",
    homepage: "",
    companyWebsite: "",
    ...overrides,
  };
}

const cases: Case[] = [
  // ---- Must BLOCK (silently filter) ----
  {
    name: "filled honeypot",
    payload: basePayload({ website: "http://spam.example" }),
    expectSpam: true,
  },
  {
    name: "missing formStartedAt",
    payload: basePayload({ formStartedAt: undefined }),
    expectSpam: true,
  },
  {
    name: "too-fast submission",
    payload: basePayload({ formStartedAt: now - 500 }),
    expectSpam: true,
  },
  {
    name: "gibberish message",
    payload: basePayload({ message: "dafsfg fhfg fdgdgdghf" }),
    expectSpam: true,
  },
  {
    name: "segmented spam email",
    payload: basePayload({ email: "k.es.t.re.lh.erb.far.m@gmail.com" }),
    expectSpam: true,
  },
  // ---- Must ALLOW ----
  {
    name: "allow: growth/brands message",
    payload: basePayload({
      message: "We want more growth and stronger brands this year.",
    }),
    expectSpam: false,
  },
  {
    name: "allow: local SEO message",
    payload: basePayload({
      message:
        "We need help improving local SEO and lead quality for our clinic.",
    }),
    expectSpam: false,
  },
  {
    name: "allow: valid gmail + valid phone + normal message",
    payload: basePayload({
      email: "real.patient@gmail.com",
      phone: "(239) 555-3214",
      message: "Hello, I would like to book a consultation next week.",
    }),
    expectSpam: false,
  },
  {
    name: "allow: authorized synthetic Zernio browser test",
    payload: basePayload({
      firstName: "Inpulza",
      lastName: "Zernio Test",
      email: "inpulza-zernio-test@example.com",
      phone: "+1 305 555 0134",
      message: "need appointment",
    }),
    expectSpam: false,
  },
];

// Schema-level validation cases (these are rejected by contactFormRequestSchema
// in the route with a 400 before any spam heuristics run).
interface SchemaCase {
  name: string;
  payload: Record<string, unknown>;
  expectValid: boolean;
}

const schemaCases: SchemaCase[] = [
  {
    name: "reject: malformed email (no @)",
    payload: basePayload({ email: "not-an-email" }),
    expectValid: false,
  },
  {
    name: "reject: empty firstName",
    payload: basePayload({ firstName: "   " }),
    expectValid: false,
  },
  {
    name: "reject: empty lastName",
    payload: basePayload({ lastName: "" }),
    expectValid: false,
  },
  {
    name: "reject: empty message",
    payload: basePayload({ message: "  " }),
    expectValid: false,
  },
  {
    name: "reject: empty phone",
    payload: basePayload({ phone: "" }),
    expectValid: false,
  },
  {
    name: "reject: phone with fewer than 7 digits",
    payload: basePayload({ phone: "12345" }),
    expectValid: false,
  },
  {
    name: "reject: phone containing letters",
    payload: basePayload({ phone: "305-CALL-NOW" }),
    expectValid: false,
  },
  {
    name: "accept: synthetic QA email and reserved 555 phone",
    payload: basePayload({
      email: "inpulza-zernio-test@example.com",
      phone: "+1 305 555 0134",
      message: "need appointment",
    }),
    expectValid: true,
  },
  {
    name: "accept: well-formed required fields",
    payload: basePayload({}),
    expectValid: true,
  },
];

async function run() {
  let passed = 0;
  let failed = 0;

  for (const c of schemaCases) {
    const parsed = contactFormRequestSchema.safeParse(c.payload);
    const ok = parsed.success === c.expectValid;
    if (ok) {
      passed++;
      console.log(
        `✅ ${c.name} → ${parsed.success ? "valid" : "rejected"}`,
      );
    } else {
      failed++;
      console.log(
        `❌ ${c.name} → expected ${
          c.expectValid ? "valid" : "rejected"
        } but got ${parsed.success ? "valid" : "rejected"}`,
      );
    }
  }

  for (const c of cases) {
    const verdict = await evaluateContactSubmission(c.payload);
    const ok = verdict.spam === c.expectSpam;
    if (ok) {
      passed++;
      console.log(
        `✅ ${c.name} → ${verdict.spam ? "filtered" : "allowed"}${
          verdict.reason ? ` (${verdict.reason})` : ""
        }`,
      );
    } else {
      failed++;
      console.log(
        `❌ ${c.name} → expected ${
          c.expectSpam ? "filtered" : "allowed"
        } but got ${verdict.spam ? "filtered" : "allowed"}${
          verdict.reason ? ` (${verdict.reason})` : ""
        }`,
      );
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error("Smoke test crashed:", e);
  process.exit(1);
});
