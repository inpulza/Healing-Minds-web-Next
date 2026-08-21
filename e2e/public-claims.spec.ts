import { expect, test } from "@playwright/test";
import {
  authenticateProtectedPreview,
  finishProtectedPreview,
  protectedPreviewHeaders,
} from "./preview-auth";

const forbiddenPublicClaim = /Real stories from patients|Historias reales de pacientes|15\+|(?:over|more than)\s+15\s+years|(?:m[aá]s de|durante m[aá]s de)\s+15\s+a[nñ]os|Professional Certification|Certificaci[oó]n Profesional|Specialized Training in Cultural Competency|Entrenamiento Especializado en Competencia Cultural|native Spanish|natively in both|espa[nñ]ol nativo|hablante nativa de espa[nñ]ol|hija de inmigrantes|daughter of immigrants/i;
const forbiddenCaliforniaFinancialClaim = /\b(?:direct|cash)[ -]?pay\b|\bno insurance\b|\bno (?:paperwork|claims|prior authorizations?)\b|\bclear pricing?\b|\bprice is clear\b|\bno surprises\b|\bpago directo\b|\bsin seguros?\b|\bsin (?:tr[aá]mites|reclamos|autorizaciones previas?)\b|\bprecio (?:es )?claro\b|\bsin sorpresas\b/i;
const forbiddenConfirmedTelehealthCta = /\bBook Telehealth\b|\bReservar Telesalud\b|Schedule secure online consultations with Dr\. Melva Reve|Programe consultas seguras en l[ií]nea con la Dra\. Melva Reve|Book Now:\s*telehealth appointment|Reservar Ahora:\s*cita de telesalud/i;
const forbiddenTelehealthAltClaim = /secure virtual consultation platform|Dr\. Melva Reve conducting online|treatment through telehealth|secure online psychiatric treatment|Ongoing psychiatric care through telehealth/i;

test.beforeEach(async ({ page }) => {
  await authenticateProtectedPreview(page);
});

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

async function scrollUntilReviewsMount(page: import("@playwright/test").Page) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await page.getByTestId("reviews-section").count()) return;
    await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.8, 500)));
    await page.waitForTimeout(100);
  }
}

async function scrollUntilTestIdMount(page: import("@playwright/test").Page, testId: string) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await page.getByTestId(testId).count()) return;
    await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.8, 500)));
    await page.waitForTimeout(100);
  }
}

for (const route of ["/", "/es"] as const) {
  test(`${route} lazy service-area section keeps one office and case-by-case telehealth`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.stack || error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await scrollUntilTestIdMount(page, "service-areas");
    const section = page.getByTestId("service-areas");
    await expect(section).toBeVisible();
    await expect(section).toContainText(
      route === "/" ? "one physical office in Naples" : "una sola oficina física en Naples",
    );
    await expect(section).toContainText(
      route === "/" ? "confirmed case by case" : "se confirman caso por caso",
    );
    const text = await section.innerText();
    expect(text).not.toMatch(/150,000\+|Residents Served|Residentes atendidos|Max Drive Time|Tiempo M[aá]x/i);
    expect(text).not.toMatch(/\b(?:20|25|30)\s*(?:min|minutes|minutos)\b/i);
    expect(text).not.toMatch(/Telehealth services available for all service areas|Servicios de telesalud disponibles para todas las [aá]reas/i);
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });
}

for (const [route, requestLabel] of [
  ["/", "Request Online"],
  ["/es", "Solicitar en Línea"],
] as const) {
  test(`${route} uses request language globally and does not advertise crisis intervention`, async ({ page }) => {
    const initialResponse = await page.request.get(route);
    expect(initialResponse.status()).toBe(200);
    const initialHtml = await initialResponse.text();
    expect(initialHtml).not.toMatch(forbiddenConfirmedTelehealthCta);
    expect(initialHtml).not.toMatch(/Crisis Intervention|Intervenci[oó]n de Crisis/i);

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(await page.content()).not.toMatch(forbiddenConfirmedTelehealthCta);
    await scrollUntilTestIdMount(page, "footer-telehealth-button");
    await expect(page.getByTestId("footer-telehealth-button")).toContainText(requestLabel);
  });
}

for (const route of [
  "/locations/psychiatrist-fort-myers",
  "/es/ubicaciones/psiquiatra-fort-myers",
] as const) {
  test(`${route} presents telehealth as a request in initial and hydrated HTML`, async ({ page }) => {
    const initialResponse = await page.request.get(route);
    expect(initialResponse.status()).toBe(200);
    expect(await initialResponse.text()).not.toMatch(forbiddenConfirmedTelehealthCta);
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(await page.content()).not.toMatch(forbiddenConfirmedTelehealthCta);
    await expect(page.locator("main")).toContainText(route.startsWith("/es/") ? "Solicitar Telesalud" : "Request Telehealth");
  });
}

for (const route of [
  "/telepsychiatry-florida",
  "/es/telepsiquiatria-florida",
] as const) {
  test(`${route} uses neutral visual alt text in initial and hydrated HTML`, async ({ page }) => {
    const initialResponse = await page.request.get(route);
    expect(initialResponse.status()).toBe(200);
    const initialHtml = await initialResponse.text();
    expect(initialHtml).not.toMatch(forbiddenTelehealthAltClaim);

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(await page.content()).not.toMatch(forbiddenTelehealthAltClaim);
    await expect(page.locator('img[alt="Dr. Melva Reve in a medical office"], img[alt="Dra. Melva Reve en una oficina médica"]')).toHaveCount(2);
  });
}

for (const route of ["/", "/es"] as const) {
  test(`${route} renders one API-backed reviews section and no hardcoded testimonials`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.stack || error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    const reviewsResponse = await page.request.get("/api/reviews", {
      headers: protectedPreviewHeaders(),
    });
    const reviewsPayload = await reviewsResponse.json();
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(reviewsResponse.status()).toBe(200);
    expect(reviewsPayload.data.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(reviewsPayload.data.reviews.length).toBeGreaterThan(0);

    await scrollUntilReviewsMount(page);
    await expect(page.getByTestId("reviews-section")).toHaveCount(1);
    await expect(page.getByTestId("reviews-title")).toContainText(route === "/" ? "Public Reviews" : "Reseñas Públicas");
    await expect(page.getByTestId("reviews-updated-at")).toContainText(
      route === "/" ? "Review data updated" : "Datos de reseñas actualizados el",
    );
    await expect(page.getByTestId("reviews-section")).toContainText(
      route === "/" ? "Public reviewer" : "Autor de reseña pública",
    );
    await expect(page.getByTestId("button-google-review")).toContainText(
      route === "/"
        ? "Leave a review on Google"
        : "Dejar una reseña en Google",
    );
    await expect(page.getByTestId("reviews-section").getByText(/^(Verified|Verificado|Patient|Paciente)$/)).toHaveCount(0);
    const visibleReviewCard = page.locator(
      (page.viewportSize()?.width || 1280) >= 1024
        ? '[data-testid^="review-card-desktop-"]:visible'
        : '[data-testid^="review-card-mobile-"]:visible',
    ).first();
    const reviewDate = await visibleReviewCard.locator("span.text-sm.text-gray-500").first().textContent();
    expect(reviewDate).toMatch(/\b20\d{2}\b/);
    expect(reviewDate).not.toMatch(/hace|ago/i);
    await expect(page.locator('[data-testid="testimonials-title"], [data-testid="testimonials-description"]')).toHaveCount(0);
    expect(await page.content()).not.toMatch(forbiddenPublicClaim);
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });
}

for (const [route, licenseBadge] of [
  ["/psychiatrist-california", "California Physician and Surgeon License · A198275"],
  ["/es/psiquiatra-california", "Licencia médica de California · A198275"],
] as const) {
  test(`${route} keeps the verified California license wording and campaign noindex`, async ({ page }) => {
    const initialResponse = await page.request.get(route);
    expect(initialResponse.status()).toBe(200);
    const initialHtml = await initialResponse.text();
    const initialMain = initialHtml.match(/<main\b[\s\S]*?<\/main>/i)?.[0];
    expect(initialMain, "initial SSR should contain the California campaign main content").toBeTruthy();
    expect(initialMain).not.toMatch(forbiddenCaliforniaFinancialClaim);

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.getByText(licenseBadge, { exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content="noindex, follow"]')).toHaveCount(1);
    expect(await page.content()).not.toMatch(/California Licensed Psychiatrist|Psiquiatra con Licencia en California/);
    expect(await page.locator("main").innerText()).not.toMatch(forbiddenCaliforniaFinancialClaim);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).not.toMatch(forbiddenCaliforniaFinancialClaim);
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd).toHaveLength(1);
    expect(jsonLd[0]).not.toMatch(forbiddenCaliforniaFinancialClaim);
  });
}

for (const route of [
  "/locations/psychiatrist-ave-maria",
  "/es/ubicaciones/psiquiatra-ave-maria",
] as const) {
  test(`${route} exposes the primary phone without an unconfirmed fax`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toContainText("(239) 423-0272");
    await expect(page.locator("body")).not.toContainText("Fax: (239) 330-2073");
  });
}

for (const route of ["/contact", "/es/contacto"] as const) {
  test(`${route} publishes the official crisis resources without mislabeling general information`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    const emergency = page.getByTestId("emergency-info");
    await expect(emergency).toContainText("911");
    await expect(emergency).toContainText("988");
    await expect(emergency).toContainText("(239) 352-4357");
    await expect(emergency).not.toContainText("(239) 455-8500");
  });
}

for (const [route, residency] of [
  ["/about", "Psychiatric Residency Training"],
  ["/es/acerca-de", "Residencia en Psiquiatría"],
] as const) {
  test(`${route} exposes only supported credentials`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toContainText("ME165518");
    await expect(page.locator("main")).toContainText(residency);
    expect(await page.content()).not.toMatch(forbiddenPublicClaim);
  });
}

for (const [route, expected] of [
  ["/telehealth-consent", "A website request does not by itself establish a provider-patient relationship"],
  ["/es/consentimiento-telesalud", "Una solicitud en el sitio web no establece por sí sola una relación entre profesional y paciente"],
  ["/terms-of-service", "Submitting a website request does not establish a provider-patient relationship or constitute clinical consent"],
  ["/es/terminos-servicio", "Enviar una solicitud en el sitio web no establece una relación entre profesional y paciente ni constituye consentimiento clínico"],
] as const) {
  test(`${route} keeps licensure, consent and video-platform claims correctly scoped`, async ({ page }) => {
    const forbidden = /our practice is licensed to provide telepsychiatry|nuestra pr[aá]ctica cuenta con licencia para brindar telepsiquiatr[ií]a|By requesting and using[^.!?<]{0,80}you consent|Al solicitar y utilizar[^.!?<]{0,80}usted consiente|Telehealth services are provided through[^.!?<]{0,80}Charm Health|servicios de Telesalud se proporcionan a trav[eé]s de[^.!?<]{0,80}Charm Health/i;
    const initialResponse = await page.request.get(route);
    expect(initialResponse.status()).toBe(200);
    const initialHtml = await initialResponse.text();
    expect(initialHtml).not.toMatch(forbidden);

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toContainText(expected);
    expect(await page.locator("main").innerText()).not.toMatch(forbidden);
  });
}
