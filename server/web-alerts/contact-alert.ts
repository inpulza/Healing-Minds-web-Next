import type { ContactFormRequest, WebAlertStatus } from "@shared/schema";
import type { WebAlertStore } from "./store";
import {
  preflightZernioTemplate,
  readZernioConfig,
  sendZernioTemplate,
  validateZernioConfig,
  type ZernioConfig,
} from "./zernio";

const REASON_BY_FORM = {
  contact_page: "Contact",
  consultation_modal: "Consultation",
} as const;

type ContactFormKey = keyof typeof REASON_BY_FORM;
type FetchLike = typeof fetch;

export interface ContactAlertInput {
  outboxId: string;
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
  if (!config.enabled) {
    await dependencies.store.complete(input.outboxId, {
      status: "disabled",
    });
    return { status: "disabled" };
  }

  if (!await dependencies.store.acquire(input.outboxId)) return { status: "duplicate" };

  const configErrors = validateZernioConfig(config);
  if (configErrors.length) {
    const code = safeErrorCode(configErrors);
    await dependencies.store.complete(input.outboxId, {
      status: "failed",
      lastErrorCode: code,
    });
    return { status: "failed", errorCode: code };
  }

  const preflight = await preflightZernioTemplate(config, fetcher);
  if (preflight.status !== "sent") {
    await dependencies.store.complete(input.outboxId, {
      status: preflight.status,
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
  await dependencies.store.complete(input.outboxId, {
    status: outcome.status,
    zernioMessageId: outcome.messageId,
    lastErrorCode: outcome.errorCode,
  });
  return { status: outcome.status, errorCode: outcome.errorCode };
}

export async function processPendingContactWebAlerts(
  dependencies: ContactAlertDependencies,
  limit = 20,
): Promise<ContactAlertResult[]> {
  const pending = await dependencies.store.pending(limit);
  return Promise.all(pending.map((input) => dispatchContactWebAlert(input, dependencies)));
}
