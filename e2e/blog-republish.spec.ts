import { expect, test } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

test.afterEach(async ({ page }) => finishProtectedPreview(page));

for (const language of ["en", "es"]) {
  test(`republish ${language}: published -> draft with redirect -> review -> published`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${new URL(response.url()).pathname}`); });
    const article = {
      id: 11, title: "Republish regression", slug: "republish-regression", language,
      excerpt: "Educational information", content: "<h2>Questions for your clinician</h2><p>Educational information.</p>",
      status: "published", featuredImage: null, featuredImageAlt: null, authorId: null, categoryId: null,
      author: null, category: null, tags: [], readingTime: 3, isFeatured: false,
      metaTitle: "Republish regression", metaDescription: "Educational information", updatedAt: new Date().toISOString(), publishedAt: new Date().toISOString(),
    };
    const publicPath = `${language === "es" ? "/es" : ""}/blog/${article.slug}`;
    const requests: Array<Record<string, unknown>> = [];
    let redirected = false;
    await authenticateProtectedPreview(page);
    await page.route("**/api/admin/**", async route => {
      const path = new URL(route.request().url()).pathname;
      const reply = (body: unknown) => route.fulfill({ contentType: "application/json", body: JSON.stringify(body) });
      if (path === "/api/admin/session") return reply({ authenticated: true });
      if (path.endsWith("/status")) {
        const payload = route.request().postDataJSON();
        requests.push(payload);
        if (payload.status === "draft") {
          expect(payload).toMatchObject({ confirmUnpublish: true, confirmSlug: article.slug, redirectTargetPath: language === "es" ? "/es/blog" : "/blog" });
          redirected = true;
        }
        if (payload.status === "published") { expect(redirected).toBe(true); redirected = false; }
        article.status = payload.status;
        return reply({ success: true, data: article });
      }
      if (path.endsWith("/unpublish-impact")) return reply({ success: true, data: { publicPath, linkingPosts: [] } });
      if (path.endsWith("/links/config")) return reply({ success: true, data: { enabled: false } });
      if (path.endsWith("/images/config")) return reply({ success: true, data: { enabled: false, storage: "not-configured" } });
      if (path.endsWith("/stats")) return reply({ success: true, data: { draft: 0, pending_review: 0, published: 1, rejected: 0 } });
      if (path === "/api/admin/blog/posts") return reply({ success: true, data: [article] });
      if (path === "/api/admin/blog/posts/11") return reply({ success: true, data: article });
      return reply({ success: true, data: [] });
    });
    await page.goto("/admin/blog");
    if (process.env.E2E_EXPECTED_SHA) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute("content", process.env.E2E_EXPECTED_SHA);
    }
    await page.getByTitle("Edit", { exact: true }).click();
    await page.getByRole("button", { name: "Move to draft", exact: true }).click();
    const confirmation = page.getByRole("dialog", { name: "Move published post to draft" });
    await confirmation.getByLabel("Type the exact slug to confirm").fill(article.slug);
    await confirmation.getByRole("button", { name: "Move to draft", exact: true }).click();
    await expect(confirmation).toBeHidden();
    await expect(page.getByText("Republishing automatically restores", { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Submit review", exact: true }).click();
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toHaveCount(0);
    expect(requests.map(request => request.status)).toEqual(["draft", "pending_review", "published"]);
    expect(redirected).toBe(false);
    await page.getByRole("button", { name: "Close", exact: true }).first().click();
    await expect(page.getByTitle("Open published post")).toHaveAttribute("href", publicPath);
    expect(errors).toEqual([]);
  });
}
