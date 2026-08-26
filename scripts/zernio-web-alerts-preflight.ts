import {
  HEALING_MINDS_TEMPLATE,
  preflightZernioTemplate,
  readZernioConfig,
  validateZernioConfig,
} from "../server/web-alerts/zernio";

const config = readZernioConfig();
const errors = validateZernioConfig(config);
if (errors.length) {
  console.error(`Zernio preflight failed: ${errors.join(", ")}`);
  process.exit(1);
}

const result = await preflightZernioTemplate(config);
if (result.status !== "sent") {
  console.error(`Zernio preflight failed: ${result.errorCode || result.status}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  template: HEALING_MINDS_TEMPLATE.name,
  category: HEALING_MINDS_TEMPLATE.category,
  language: HEALING_MINDS_TEMPLATE.language,
  parameters: HEALING_MINDS_TEMPLATE.parameterContract,
  recipientConfigured: true,
}));
