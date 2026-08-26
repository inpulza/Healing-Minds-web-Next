import assert from "node:assert/strict";
import test from "node:test";
import { contactFormRequestSchema } from "../shared/schema";
import { dispatchContactWebAlert } from "../server/web-alerts/contact-alert";
import type {
  WebAlertCompletion,
  WebAlertStore,
} from "../server/web-alerts/store";
import {
  HEALING_MINDS_TEMPLATE,
  preflightZernioTemplate,
  readZernioConfig,
  type ZernioConfig,
} from "../server/web-alerts/zernio";

const enabledConfig: ZernioConfig = {
  enabled: true,
  apiKey: "fixture-not-a-secret",
  accountId: "account_fixture",
  recipientE164: "+13055550199",
  apiBaseUrl: "https://zernio.example/api",
  timeoutMs: 1_000,
};

const lead = {
  firstName: "Maria",
  lastName: "Perez",
  phone: "+1 305 555 0123",
  message: "Please call after 3 PM.",
};

class FakeStore implements WebAlertStore {
  readonly completions: Array<{ id: string; input: WebAlertCompletion }> = [];
  readonly attempts = new Map<string, number>();

  async acquire(id: string): Promise<number | null> {
    const attempts = this.attempts.get(id) || 0;
    if (attempts > 0) return null;
    this.attempts.set(id, attempts + 1);
    return attempts + 1;
  }

  async complete(id: string, input: WebAlertCompletion): Promise<void> {
    this.completions.push({ id, input });
  }

  async pending() { return []; }
}

function approvedTemplate(override: Record<string, unknown> = {}) {
  return {
    name: HEALING_MINDS_TEMPLATE.name,
    status: "APPROVED",
    category: HEALING_MINDS_TEMPLATE.category,
    language: HEALING_MINDS_TEMPLATE.language,
    components: [{ type: "BODY", text: HEALING_MINDS_TEMPLATE.body }],
    ...override,
  };
}

function successfulFetcher(calls: Array<{ url: string; init?: RequestInit }>): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("/whatsapp/templates")) {
      return new Response(JSON.stringify({ success: true, templates: [approvedTemplate()] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: { messageId: "msg_fixture" } }), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

test("the kill switch defaults to off and requires the exact true literal", () => {
  assert.equal(readZernioConfig({}).enabled, false);
  assert.equal(readZernioConfig({ ZERNIO_WHATSAPP_ENABLED: "TRUE" }).enabled, false);
  assert.equal(readZernioConfig({ ZERNIO_WHATSAPP_ENABLED: "true" }).enabled, true);
});

test("the browser contract accepts only the two closed form keys", () => {
  const base = {
    ...lead,
    email: "maria@healing.test.invalid",
    preferredLanguage: "english",
    formStartedAt: Date.now() - 3_000,
  };
  assert.equal(contactFormRequestSchema.parse({ ...base, formKey: "contact_page" }).formKey, "contact_page");
  assert.equal(contactFormRequestSchema.parse({ ...base, formKey: "consultation_modal" }).formKey, "consultation_modal");
  assert.equal(
    contactFormRequestSchema.parse({
      ...base,
      formKey: "contact_page",
      submissionId: "10c4c6dd-f57b-4a16-a279-df3b1fb15b87",
    }).submissionId,
    "10c4c6dd-f57b-4a16-a279-df3b1fb15b87",
  );
  assert.throws(() => contactFormRequestSchema.parse({
    ...base,
    formKey: "contact_page",
    submissionId: "not-a-uuid",
  }));
  assert.throws(() => contactFormRequestSchema.parse({ ...base, formKey: "attacker_template" }));
});

test("disabled alerts never call Zernio", async () => {
  const store = new FakeStore();
  let calls = 0;
  const result = await dispatchContactWebAlert(
    { outboxId: "outbox-disabled", leadId: "lead-disabled", formKey: "contact_page", lead },
    {
      store,
      config: { ...enabledConfig, enabled: false, apiKey: "", accountId: "", recipientE164: "" },
      fetcher: (async () => { calls += 1; throw new Error("must not run"); }) as typeof fetch,
    },
  );
  assert.equal(result.status, "disabled");
  assert.equal(calls, 0);
  assert.deepEqual(store.completions[0], {
    id: "outbox-disabled",
    input: { status: "disabled" },
  });
  assert.doesNotMatch(JSON.stringify(store.completions), /Maria|Perez|305|call after/i);
});

test("an incomplete enabled configuration fails closed without a provider request", async () => {
  const store = new FakeStore();
  let calls = 0;
  const result = await dispatchContactWebAlert(
    { outboxId: "outbox-config", leadId: "lead-config", formKey: "contact_page", lead },
    {
      store,
      config: { ...enabledConfig, apiKey: "", recipientE164: "not-e164" },
      fetcher: (async () => { calls += 1; throw new Error("must not run"); }) as typeof fetch,
    },
  );
  assert.equal(result.status, "failed");
  assert.equal(calls, 0);
  assert.match(result.errorCode || "", /^config_/);
});

test("preflight validates exact approval, language, category, body and all parameter locations", async () => {
  const exact = await preflightZernioTemplate(enabledConfig, successfulFetcher([]));
  assert.equal(exact.status, "sent");

  for (const [override, code] of [
    [{ status: "PENDING" }, "preflight_template_not_approved"],
    [{ category: "MARKETING" }, "preflight_category_mismatch"],
    [{ components: [{ type: "BODY", text: "Changed {{1}} {{2}} {{3}} {{4}}" }] }, "preflight_body_mismatch"],
    [{
      components: [
        { type: "HEADER", format: "TEXT", text: "Alert {{1}}" },
        { type: "BODY", text: HEALING_MINDS_TEMPLATE.body },
      ],
    }, "preflight_component_mismatch"],
    [{
      components: [
        { type: "BODY", text: HEALING_MINDS_TEMPLATE.body },
        { type: "FOOTER", text: "Unreviewed footer" },
      ],
    }, "preflight_component_mismatch"],
  ] as const) {
    const fetcher = (async () => new Response(JSON.stringify({ templates: [approvedTemplate(override)] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;
    const result = await preflightZernioTemplate(enabledConfig, fetcher);
    assert.equal(result.errorCode, code);
  }
});

test("the two forms map to fixed reasons and a fixed provider route", async () => {
  for (const [formKey, expectedReason] of [
    ["contact_page", "Contact"],
    ["consultation_modal", "Consultation"],
  ] as const) {
    const store = new FakeStore();
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const result = await dispatchContactWebAlert(
      { outboxId: `outbox-${formKey}`, leadId: `lead-${formKey}`, formKey, lead },
      { store, config: enabledConfig, fetcher: successfulFetcher(calls) },
    );
    assert.equal(result.status, "sent");
    assert.equal(calls.length, 2);
    const body = JSON.parse(String(calls[1].init?.body));
    assert.deepEqual(body, {
      accountId: "account_fixture",
      platform: "whatsapp",
      participantId: "13055550199",
      templateName: HEALING_MINDS_TEMPLATE.name,
      templateLanguage: HEALING_MINDS_TEMPLATE.language,
      templateParams: ["Maria Perez", "+1 305 555 0123", expectedReason, "Please call after 3 PM."],
    });
    assert.equal(store.completions[0].input.status, "sent");
  }
});

test("the real lead id is a durable idempotency key", async () => {
  const store = new FakeStore();
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const dependencies = { store, config: enabledConfig, fetcher: successfulFetcher(calls) };
  const first = await dispatchContactWebAlert(
    { outboxId: "same-outbox", leadId: "same-lead", formKey: "contact_page", lead }, dependencies,
  );
  const replay = await dispatchContactWebAlert(
    { outboxId: "same-outbox", leadId: "same-lead", formKey: "contact_page", lead }, dependencies,
  );
  assert.equal(first.status, "sent");
  assert.equal(replay.status, "duplicate");
  assert.equal(calls.filter((call) => call.url.includes("/inbox/conversations")).length, 1);
});

test("concurrent workers can send the same outbox row only once", async () => {
  const store = new FakeStore();
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const dependencies = { store, config: enabledConfig, fetcher: successfulFetcher(calls) };
  const input = {
    outboxId: "concurrent-outbox",
    leadId: "concurrent-lead",
    formKey: "contact_page" as const,
    lead,
  };
  const outcomes = await Promise.all([
    dispatchContactWebAlert(input, dependencies),
    dispatchContactWebAlert(input, dependencies),
  ]);
  assert.deepEqual(outcomes.map((result) => result.status).sort(), ["duplicate", "sent"]);
  assert.equal(calls.filter((call) => call.url.includes("/inbox/conversations")).length, 1);
});

test("provider failures are classified without throwing away the lead flow", async () => {
  for (const [providerStatus, expected] of [[422, "failed"], [429, "pending"], [503, "unknown"]] as const) {
    const store = new FakeStore();
    let call = 0;
    const fetcher = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify({ templates: [approvedTemplate()] }), { status: 200 });
      }
      return new Response(JSON.stringify({ code: `fixture_${providerStatus}` }), { status: providerStatus });
    }) as typeof fetch;
    const result = await dispatchContactWebAlert(
      { outboxId: `outbox-${providerStatus}`, leadId: `lead-${providerStatus}`, formKey: "contact_page", lead },
      { store, config: enabledConfig, fetcher },
    );
    assert.equal(result.status, expected);
    assert.equal(store.completions[0].input.status, expected);
  }

  const store = new FakeStore();
  let call = 0;
  const ambiguousNetwork = (async () => {
    call += 1;
    if (call === 1) return new Response(JSON.stringify({ templates: [approvedTemplate()] }), { status: 200 });
    throw new TypeError("simulated connection reset");
  }) as typeof fetch;
  const result = await dispatchContactWebAlert(
    { outboxId: "outbox-network", leadId: "lead-network", formKey: "contact_page", lead },
    { store, config: enabledConfig, fetcher: ambiguousNetwork },
  );
  assert.equal(result.status, "unknown");
  assert.equal(store.completions[0].input.status, "unknown");
});

test("the fifth transient failure becomes an operational failure instead of a stuck pending row", async () => {
  const store = new FakeStore();
  store.attempts.set("outbox-exhausted", 4);
  store.acquire = async (id: string) => {
    const next = (store.attempts.get(id) || 0) + 1;
    store.attempts.set(id, next);
    return next;
  };
  const fetcher = (async () => new Response(JSON.stringify({ code: "rate_limited" }), {
    status: 429,
  })) as typeof fetch;
  const result = await dispatchContactWebAlert(
    { outboxId: "outbox-exhausted", leadId: "lead-exhausted", formKey: "contact_page", lead },
    { store, config: enabledConfig, fetcher },
  );
  assert.equal(result.status, "failed");
  assert.equal(result.errorCode, "retry_exhausted_preflight_rate_limited");
  assert.equal(store.completions[0].input.status, "failed");
});
