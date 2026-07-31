const EXPECTED_GA_ID = 'G-WMRK41PX2E';
const KNOWN_WRONG_GA_IDS = new Set(['G-42LWDS101X']);

const configuredId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

if (configuredId && KNOWN_WRONG_GA_IDS.has(configuredId)) {
  throw new Error(`Blocked known incorrect Google Analytics ID: ${configuredId}`);
}

if (process.env.VERCEL && configuredId !== EXPECTED_GA_ID) {
  throw new Error(
    `Vercel requires NEXT_PUBLIC_GA_MEASUREMENT_ID=${EXPECTED_GA_ID}; received ${configuredId || 'no value'}.`,
  );
}

if (configuredId && configuredId !== EXPECTED_GA_ID) {
  throw new Error(
    `Unexpected NEXT_PUBLIC_GA_MEASUREMENT_ID=${configuredId}; expected ${EXPECTED_GA_ID}.`,
  );
}

console.log(
  configuredId
    ? `Public analytics configuration verified: ${configuredId}`
    : 'Public analytics configuration not set locally; Vercel builds enforce the production ID.',
);
