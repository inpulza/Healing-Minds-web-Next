import type { ContactFormRequest, WebAlertStatus } from "@shared/schema";
import type { WebAlertStore } from "./store";
import {
  preflightZernioTemplate,
  readZernioConfig,
  sendZernioTemplate,
  validateZernioConfig,
  type ZernioConfig,
} from "./zernio";

const TENANT_ID = "healing-minds";
const REASON_BY_FORM = {
  contact_page: "Contact",
  consultation_modal: "Consultation",
} as const;

type ContactFormKey = keyof typeof REASON_BY_FORM;
type FetchLike = typeof fetch;

export interface ContactAlertInput {
  leadId: string;
  formKey: ContactFormKey;
  lead: Pick<ContactFormRequest, "firstName" | "lastName" | "phone" | "message">;
}

export interface ContactAlertDependencies {
  store: WebAlertStore;
  config?: ZernioConfig;
  fetcher?: FetchLike;
}

export interface ContactAlertResult {
  status: WebAlertStatus | "duplicate";
  errorCode?: string;
}

function safeErrorCode(errors: string[]): string {
  return `config_${errors.sort().join("_")}`.slice(0, 100);
}

export async function dispatchContactWebAlert(
  input: ContactAlertInput,
  dependencies: ContactAlertDependencies,
): Promise<ContactAlertResult> {
  const config = dependencies.config || readZernioConfig();
  const fetcher = dependencies.fetcher || fetch;
  const dedupeKey = `${TENANT_ID}:${input.formKey}:${input.leadId}`;

  if (!config.enabled) {
    const claimed = await dependencies.store.claim({
      dedupeKey,
      tenantId: TENANT_ID,
      formKey: input.formKey,
      leadId: input.leadId,
      status: "disabled",
    });
    return { status: claimed ? "disabled" : "duplicate" };
  }

  const configErrors = validateZernioConfig(config);
  if (configErrors.length) {
    const code = safeErrorCode(configErrors);
    const claimed = await dependencies.store.claim({
      dedupeKey,
      tenantId: TENANT_ID,
      formKey: input.formKey,
      leadId: input.leadId,
      status: "failed",
      lastErrorCode: code,
    });
    return { status: claimed ? "failed" : "duplicate", errorCode: claimed ? code : undefined };
  }

  const outboxId = await dependencies.store.claim({
    dedupeKey,
    tenantId: TENANT_ID,
    formKey: input.formKey,
    leadId: input.leadId,
    status: "pending",
  });
  if (!outboxId) return { status: "duplicate" };

  const preflight = await preflightZernioTemplate(config, fetcher);
  if (preflight.status !== "sent") {
    await dependencies.store.complete(outboxId, {
      status: preflight.status,
      attempts: 0,
      lastErrorCode: preflight.errorCode,
    });
    return { status: preflight.status, errorCode: preflight.errorCode };
  }

  const outcome = await sendZernioTemplate(config, [
    `${input.lead.firstName.trim()} ${input.lead.lastName.trim()}`.trim(),
    input.lead.phone.trim(),
    REASON_BY_FORM[input.formKey],
    input.lead.message.trim(),
  ], fetcher);
  await dependencies.store.complete(outboxId, {
    status: outcome.status,
    attempts: 1,
    zernioMessageId: outcome.messageId,
    lastErrorCode: outcome.errorCode,
  });
  return { status: outcome.status, errorCode: outcome.errorCode };
}
