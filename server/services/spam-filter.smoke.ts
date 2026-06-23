// Runnable smoke test for the contact-form anti-spam filter.
// Run with:  npx tsx server/services/spam-filter.smoke.ts
// Tests call the filter module directly (no HTTP) so no emails are sent and the
// rate limiter is not touched. The DNS check runs for real against the network.

import { evaluateContactSubmission } from "./spam-filter";

const now = Date.now();
const HUMAN_START = now - 5000; // 5s ago: passes the timing check

interface Case {
  name: string;
  payload: Record<string, unknown>;
  expectSpam: boolean;
  skipDns?: boolean;
}

function basePayload(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: "Maria",
    lastName: "Gonzalez",
    email: "maria.gonzalez@gmail.com",
    phone: "(305) 423-0272",
    preferredLanguage: "english",
    message: "I would like to schedule an appointment for my anxiety.",
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
    name: "reserved domain example.com",
    payload: basePayload({ email: "john@example.com" }),
    expectSpam: true,
  },
  {
    name: "non-existent domain (real DNS lookup)",
    payload: basePayload({
      email: "john@thisdomaindoesnotexist-zzq12345.com",
    }),
    expectSpam: true,
  },
  {
    name: "fake phone (305) 555-0142",
    payload: basePayload({ phone: "(305) 555-0142" }),
    expectSpam: true,
  },
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
  // 555 number outside the reserved 0100-0199 block must be allowed.
  {
    name: "allow: 555 number outside reserved range",
    payload: basePayload({ phone: "(305) 555-7890" }),
    expectSpam: false,
  },
];

async function run() {
  let passed = 0;
  let failed = 0;

  for (const c of cases) {
    const verdict = await evaluateContactSubmission(c.payload, {
      skipDns: c.skipDns,
    });
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
