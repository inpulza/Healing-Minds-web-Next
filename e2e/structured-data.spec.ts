import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const userAgents = {
  normal: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
  "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  "ChatGPT-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  ClaudeBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +https://www.anthropic.com",
  PerplexityBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot",
} as const;

function jsonLdBlocks(html: string): unknown[] {
  return Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ).map((match) => JSON.parse(match[1]));
}

function graphTypes(block: unknown): string[] {
  const graph = (block as { "@graph"?: Array<{ "@type"?: string | string[] }> })["@graph"] || [];
  return graph.flatMap((node) => Array.isArray(node["@type"]) ? node["@type"] : node["@type"] || []);
}

async function fetchHtml(request: APIRequestContext, url: string, userAgent?: string) {
  const response = await request.get(url, {
    headers: userAgent ? { "user-agent": userAgent } : undefined,
  });
  expect(response.status(), url).toBe(200);
  return response.text();
}

async function navigateFromHeader(page: Page, targetPath: string, isMobile: boolean) {
  if (isMobile) {
    await page.getByTestId("mobile-menu-toggle").click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await menu.locator(`a[data-testid^="mobile-nav-"][href="${targetPath}"]`).click();
    return;
  }
  const nav = page.getByTestId("desktop-nav");
  await expect(nav).toBeVisible();
  await nav.locator(`a[href="${targetPath}"]`).click();
}

test("initial HTML exposes the verified home facts and one JSON-LD graph", async ({ request }) => {
  const html = await fetchHtml(request, "/");
  const htmlWithoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  const blocks = jsonLdBlocks(html);
  expect(blocks).toHaveLength(1);
  const types = graphTypes(blocks[0]);
  expect(types).toEqual(expect.arrayContaining([
    "WebSite",
    "WebPage",
    "FAQPage",
    "MedicalOrganization",
    "MedicalClinic",
    "Physician",
    "LocalBusiness",
    "Person",
  ]));
  expect(html).toContain("What can I expect in my first session?");
  expect(html).toContain("4760 Tamiami Trl N #25");
  expect(html).toContain("Monday - Friday: 8:00 AM - 5:00 PM");
  expect(htmlWithoutScripts.match(/data-testid="faq-answer-\d+"/g)).toHaveLength(6);
  expect(htmlWithoutScripts).toContain("The office will confirm the appointment length when you schedule.");
});

test("location FAQ answers are present in SSR before JavaScript", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "SSR source is viewport independent");
  const html = await fetchHtml(request, "/locations/psychiatrist-fort-myers");
  const htmlWithoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  expect(htmlWithoutScripts.match(/data-testid="location-faq-answer-\d+"/g)).toHaveLength(10);
  expect(htmlWithoutScripts).toContain("Our only physical office is in Naples, south of Fort Myers.");
});

test("all required crawlers receive the same SSR graph", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "one user-agent matrix is sufficient");
  for (const [name, userAgent] of Object.entries(userAgents)) {
    const html = await fetchHtml(request, "/services", userAgent);
    const blocks = jsonLdBlocks(html);
    expect(blocks, name).toHaveLength(1);
    expect(graphTypes(blocks[0]), name).toEqual(expect.arrayContaining([
      "CollectionPage",
      "FAQPage",
      "BreadcrumbList",
      "ItemList",
    ]));
  }
});

test("every sitemap URL returns one parseable SSR graph and self canonical", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "full sitemap is covered once");
  const sitemap = await fetchHtml(request, "/sitemap.xml");
  const urls = Array.from(sitemap.matchAll(/<loc>(https:\/\/www\.healingmindsp\.com[^<]*)<\/loc>/g))
    .map((match) => match[1]);
  const expectedUrlCount = Number(process.env.E2E_EXPECTED_PUBLIC_URLS || 77);
  expect(urls).toHaveLength(expectedUrlCount);

  for (const url of urls) {
    const html = await fetchHtml(request, new URL(url).pathname);
    expect(jsonLdBlocks(html), url).toHaveLength(1);
    expect(() => jsonLdBlocks(html), url).not.toThrow();
    expect(html, url).toContain(`rel="canonical" href="${url}"`);
  }
});

test("hydrated navigation replaces the route graph without duplicates or console errors", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await expect.poll(() => page.locator("#page-structured-data").textContent()).toContain("MedicalClinic");

  await navigateFromHeader(page, "/about", isMobile);
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await expect.poll(() => page.locator("#page-structured-data").textContent()).toContain("AboutPage");
  await expect.poll(() => page.locator("#page-structured-data").textContent()).not.toContain("MedicalClinic");

  await page.getByTestId("logo-link").click();
  await expect(page).toHaveURL(/\/$/);
  await navigateFromHeader(page, "/contact", isMobile);
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await expect.poll(() => page.locator("#page-structured-data").textContent()).toContain("ContactPage");
  await expect.poll(() => page.locator("#page-structured-data").textContent()).toContain("/contact#webpage");
  expect(errors).toEqual([]);
});

test("robots and llms enumerate crawler policy and all public URLs", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "endpoint contract is viewport independent");
  const robots = await fetchHtml(request, "/robots.txt");
  for (const bot of Object.keys(userAgents).filter((name) => name !== "normal")) {
    expect(robots).toContain(`User-Agent: ${bot}`);
  }
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /api/admin/");

  const llms = await fetchHtml(request, "/llms.txt");
  const urls = Array.from(llms.matchAll(/^- https:\/\/www\.healingmindsp\.com\S*$/gm));
  expect(urls.length).toBeGreaterThanOrEqual(77);
  expect(llms).toContain("Physical offices: one, in Naples");
  expect(llms).toContain("/blog/bipolar-medication-follow-up-questions");
});
