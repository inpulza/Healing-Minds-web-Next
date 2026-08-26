export const HEALING_MINDS_TEMPLATE = {
  name: "healing_minds_new_web_lead_v1",
  category: "UTILITY",
  language: "en_US",
  body: [
    "New Healing Minds Psychiatry web form received.",
    "",
    "Name: {{1}}",
    "Phone: {{2}}",
    "Reason: {{3}}",
    "Note: {{4}}",
    "",
    "Call the client.",
  ].join("\n"),
  parameterContract: ["BODY:1", "BODY:2", "BODY:3", "BODY:4"],
} as const;

export interface ZernioConfig {
  enabled: boolean;
  apiKey: string;
  accountId: string;
  recipientE164: string;
  apiBaseUrl: string;
  timeoutMs: number;
}

export type ZernioOutcomeStatus = "sent" | "pending" | "failed" | "unknown";

export interface ZernioOutcome {
  status: ZernioOutcomeStatus;
  errorCode?: string;
  messageId?: string;
}

type FetchLike = typeof fetch;
type JsonRecord = Record<string, unknown>;

const normalizeBaseUrl = (value: string | undefined) =>
  (value?.trim() || "https://zernio.com/api").replace(/\/+$/, "");

function positiveTimeout(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1_000 && parsed <= 30_000
    ? Math.floor(parsed)
    : 8_000;
}

export function readZernioConfig(
  env: NodeJS.ProcessEnv = process.env,
): ZernioConfig {
  return {
    enabled: env.ZERNIO_WHATSAPP_ENABLED === "true",
    apiKey: env.ZERNIO_API_KEY?.trim() || "",
    accountId: env.ZERNIO_ACCOUNT_ID?.trim() || "",
    recipientE164: env.ZERNIO_RECIPIENT_E164?.trim() || "",
    apiBaseUrl: normalizeBaseUrl(env.ZERNIO_API_BASE_URL),
    timeoutMs: positiveTimeout(env.ZERNIO_REQUEST_TIMEOUT_MS),
  };
}

export function validateZernioConfig(config: ZernioConfig): string[] {
  const errors: string[] = [];
  if (!config.apiKey) errors.push("missing_api_key");
  if (!config.accountId) errors.push("missing_account_id");
  if (!/^\+[1-9]\d{7,14}$/.test(config.recipientE164)) {
    errors.push("invalid_recipient_e164");
  }
  try {
    const url = new URL(config.apiBaseUrl);
    if (url.protocol !== "https:" && url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
      errors.push("invalid_api_base_url");
    }
  } catch {
    errors.push("invalid_api_base_url");
  }
  return errors;
}

async function safeJson(response: Response): Promise<JsonRecord> {
  try {
    const value = await response.json();
    return value && typeof value === "object" ? (value as JsonRecord) : {};
  } catch {
    return {};
  }
}

function errorCode(body: JsonRecord, status: number): string {
  const candidate = typeof body.code === "string" ? body.code : `http_${status}`;
  return candidate.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 100);
}

async function requestWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetcher: FetchLike,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function placeholders(text: unknown): string[] {
  if (typeof text !== "string") return [];
  return [...text.matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((match) => match[1]);
}

function templateParameterContract(components: unknown): string[] {
  if (!Array.isArray(components)) return [];
  const contract: string[] = [];
  for (const component of components) {
    if (!component || typeof component !== "object") continue;
    const record = component as JsonRecord;
    const type = String(record.type || "").toUpperCase();
    if (type === "HEADER" || type === "BODY") {
      contract.push(...placeholders(record.text).map((name) => `${type}:${name}`));
    }
    if (type === "BUTTONS" && Array.isArray(record.buttons)) {
      for (const button of record.buttons) {
        if (!button || typeof button !== "object") continue;
        const buttonRecord = button as JsonRecord;
        if (String(buttonRecord.type || "").toUpperCase() !== "URL") continue;
        contract.push(...placeholders(buttonRecord.url).map((name) => `BUTTON:${name}`));
      }
    }
  }
  return contract;
}

function normalizeTemplateText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

export async function preflightZernioTemplate(
  config: ZernioConfig,
  fetcher: FetchLike = fetch,
): Promise<ZernioOutcome> {
  try {
    const response = await requestWithTimeout(
      `${config.apiBaseUrl}/v1/whatsapp/templates?accountId=${encodeURIComponent(config.accountId)}`,
      { headers: { Authorization: `Bearer ${config.apiKey}` } },
      config.timeoutMs,
      fetcher,
    );
    const body = await safeJson(response);
    if (!response.ok) {
      return {
        status: response.status === 429 || response.status >= 500 ? "pending" : "failed",
        errorCode: `preflight_${errorCode(body, response.status)}`,
      };
    }
    const templates = Array.isArray(body.templates) ? body.templates : [];
    const template = templates.find((candidate) =>
      candidate && typeof candidate === "object"
      && (candidate as JsonRecord).name === HEALING_MINDS_TEMPLATE.name
      && (candidate as JsonRecord).language === HEALING_MINDS_TEMPLATE.language
    ) as JsonRecord | undefined;
    if (!template) return { status: "failed", errorCode: "preflight_template_missing" };
    if (template.status !== "APPROVED") {
      return { status: "failed", errorCode: "preflight_template_not_approved" };
    }
    if (template.category !== HEALING_MINDS_TEMPLATE.category) {
      return { status: "failed", errorCode: "preflight_category_mismatch" };
    }
    const components = Array.isArray(template.components) ? template.components : [];
    if (components.length !== 1 || String((components[0] as JsonRecord | undefined)?.type || "").toUpperCase() !== "BODY") {
      return { status: "failed", errorCode: "preflight_component_mismatch" };
    }
    const bodyComponent = components.find((component) =>
      component && typeof component === "object"
      && String((component as JsonRecord).type || "").toUpperCase() === "BODY"
    ) as JsonRecord | undefined;
    if (normalizeTemplateText(bodyComponent?.text) !== HEALING_MINDS_TEMPLATE.body) {
      return { status: "failed", errorCode: "preflight_body_mismatch" };
    }
    const actualContract = templateParameterContract(components);
    if (JSON.stringify(actualContract) !== JSON.stringify(HEALING_MINDS_TEMPLATE.parameterContract)) {
      return { status: "failed", errorCode: "preflight_parameter_mismatch" };
    }
    return { status: "sent" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { status: "pending", errorCode: aborted ? "preflight_timeout" : "preflight_network" };
  }
}

export async function sendZernioTemplate(
  config: ZernioConfig,
  templateParams: readonly [string, string, string, string],
  fetcher: FetchLike = fetch,
): Promise<ZernioOutcome> {
  try {
    const response = await requestWithTimeout(
      `${config.apiBaseUrl}/v1/inbox/conversations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: config.accountId,
          platform: "whatsapp",
          participantId: config.recipientE164.slice(1),
          templateName: HEALING_MINDS_TEMPLATE.name,
          templateLanguage: HEALING_MINDS_TEMPLATE.language,
          templateParams,
        }),
      },
      config.timeoutMs,
      fetcher,
    );
    const body = await safeJson(response);
    if (!response.ok) {
      return {
        status: response.status === 429 || response.status >= 500 ? "pending" : "failed",
        errorCode: errorCode(body, response.status),
      };
    }
    const data = body.data && typeof body.data === "object" ? body.data as JsonRecord : {};
    const messageId = typeof data.messageId === "string" ? data.messageId : undefined;
    return messageId
      ? { status: "sent", messageId }
      : { status: "unknown", errorCode: "accepted_without_message_id" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { status: "unknown", errorCode: aborted ? "send_timeout" : "send_network" };
  }
}
