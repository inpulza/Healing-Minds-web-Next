import { expect, test, type Page } from "@playwright/test";

const source = {
  id: 11, title: "Understanding anxiety", slug: "understanding-anxiety", language: "en", translationGroupId: "4a6829e5-68cc-4b2a-9c51-19616ec41f8b",
  excerpt: "Educational guide", content: "<p>Educational content.</p>", featuredImage: null, featuredImageAlt: "Calm setting",
  authorId: 1, categoryId: 1, status: "draft", isFeatured: false, metaTitle: "Understanding anxiety", metaDescription: "Educational anxiety information",
  readingTime: 5, publishedAt: null, updatedAt: new Date().toISOString(), author: { id: 1, name: "Clinical Team", title: "Reviewer" },
  category: { id: 1, name: "Conditions", slug: "conditions", language: "en" }, tags: [],
};
const sibling = { ...source, id: 22, title: "Entender la ansiedad", slug: "entender-la-ansiedad", language: "es", status: "draft", category: { id: 2, name: "Condiciones", slug: "condiciones", language: "es" } };

async function mockAdmin(page: Page) {
  let poll = 0;
  await page.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  await page.route("**/api/admin/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const reply = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path === "/api/admin/session") return reply({ authenticated: true });
    if (path === "/api/admin/runtime") return reply({ success: true, data: { runtime: "test" } });
    if (path.endsWith("/links/config")) return reply({ success: true, data: { enabled: false } });
    if (path === "/api/admin/blog/posts" && request.method() === "GET") {
      poll += 1;
      const ready = poll >= 2;
      return reply({ success: true, data: [{ ...source, translationPair: ready
        ? { targetLanguage: "es", state: "draft", sibling: { id: 22, title: sibling.title, slug: sibling.slug, language: "es", status: "draft" }, run: null }
        : { targetLanguage: "es", state: "missing", sibling: null, run: null } }] });
    }
    if (path === "/api/admin/blog/posts/11/translation" && request.method() === "POST") return reply({ success: true, data: { runId: 7, status: "queued" } }, 202);
    if (path === "/api/admin/blog/posts/22") return reply({ success: true, data: sibling });
    if (path.endsWith("/stats")) return reply({ success: true, data: { draft: 2, pending_review: 0, published: 0, rejected: 0 } });
    if (path.endsWith("/authors")) return reply({ success: true, data: [source.author] });
    if (path.endsWith("/categories")) return reply({ success: true, data: [source.category, sibling.category] });
    if (path.endsWith("/tags")) return reply({ success: true, data: [] });
    if (path.endsWith("/images/config")) return reply({ success: true, data: { enabled: false, storage: "not-configured", model: "test" } });
    return reply({ success: true, data: [] });
  });
}

for (const name of ["desktop", "mobile"] as const) {
  test(`admin exposes a recoverable bilingual pair workflow on ${name}`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith(name), `Covered by ${name} project`);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await mockAdmin(page);
    await page.goto("/admin/blog");
    await expect(page.getByText("ES: missing")).toBeVisible();
    await page.getByRole("button", { name: "Generate translation draft" }).click();
    await expect(page.getByRole("button", { name: "Open and review sibling" })).toBeVisible();
    await page.getByRole("button", { name: "Open and review sibling" }).click();
    await expect(page.locator("#post-title")).toHaveValue("Entender la ansiedad");
    expect(errors).toEqual([]);
  });
}
