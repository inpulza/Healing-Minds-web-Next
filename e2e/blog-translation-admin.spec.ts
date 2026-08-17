import { expect, test, type Page } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

const source = {
  id: 11, title: "Understanding anxiety", slug: "understanding-anxiety", language: "en", translationGroupId: "4a6829e5-68cc-4b2a-9c51-19616ec41f8b",
  excerpt: "Educational guide", content: "<h2>What patients can expect</h2><p>Educational content.</p>", featuredImage: "/public-objects/blog-images/posts/post-11-hero-1700000000000-aaaaaaaaaaaa.webp", featuredImageAlt: "Calm setting",
  authorId: 1, categoryId: 1, status: "draft", isFeatured: false, metaTitle: "Understanding anxiety", metaDescription: "Educational anxiety information",
  readingTime: 5, publishedAt: null, updatedAt: new Date().toISOString(), author: { id: 1, name: "Clinical Team", title: "Reviewer" },
  category: { id: 1, name: "Conditions", slug: "conditions", language: "en" }, tags: [],
};
const sibling = {
  ...source,
  id: 22,
  title: "Entender la ansiedad",
  slug: "entender-la-ansiedad",
  language: "es",
  status: "draft",
  content: "<h2>Lo que pueden esperar los pacientes</h2><p>Contenido educativo.</p>",
  featuredImage: "/images/blog/anxiety-treatment.webp",
  featuredImageAlt: "Persona en un entorno tranquilo",
  metaTitle: "Entender la ansiedad: opciones de atención psiquiátrica en Naples y Florida",
  category: { id: 2, name: "Condiciones", slug: "condiciones", language: "es" },
};

const sourceImages = [
  {
    id: 101, postId: 11, role: "hero", slot: "hero", anchorHeading: null, source: "ai", generationStatus: "completed", reviewStatus: "selected",
    objectKey: "blog-images/posts/post-11-hero-1700000000000-aaaaaaaaaaaa.webp", publicUrl: source.featuredImage, mimeType: "image/webp",
    width: 1536, height: 1024, bytes: 1234, checksum: "a".repeat(64), alt: source.featuredImageAlt, caption: null, model: "gpt-image-2", imageJobId: 1, errorMessage: null, sortOrder: 0, createdAt: new Date().toISOString(),
  },
  {
    id: 102, postId: 11, role: "inline", slot: "inline:1", anchorHeading: "What patients can expect", source: "ai", generationStatus: "completed", reviewStatus: "selected",
    objectKey: "blog-images/posts/post-11-inline-1-1700000000000-bbbbbbbbbbbb.webp", publicUrl: "/public-objects/blog-images/posts/post-11-inline-1-1700000000000-bbbbbbbbbbbb.webp", mimeType: "image/webp",
    width: 1536, height: 1024, bytes: 1234, checksum: "b".repeat(64), alt: "Calm consultation", caption: "Educational photograph", model: "gpt-image-2", imageJobId: 1, errorMessage: null, sortOrder: 1, createdAt: new Date().toISOString(),
  },
];
const initialSiblingImages = [{
  ...sourceImages[0], id: 201, postId: 22, source: "curated", objectKey: null, publicUrl: sibling.featuredImage, checksum: null, alt: sibling.featuredImageAlt, model: null, imageJobId: null,
}];
const reusedSiblingImages = sourceImages.map((image, index) => ({
  ...image,
  id: 301 + index,
  postId: 22,
  objectKey: image.role === "hero"
    ? "blog-images/posts/post-22-hero-1700000000001-cccccccccccc.webp"
    : "blog-images/posts/post-22-inline-1-1700000000001-dddddddddddd.webp",
  publicUrl: image.role === "hero"
    ? "/public-objects/blog-images/posts/post-22-hero-1700000000001-cccccccccccc.webp"
    : "/public-objects/blog-images/posts/post-22-inline-1-1700000000001-dddddddddddd.webp",
  alt: image.role === "hero" ? "Fotografía editorial serena para Entender la ansiedad" : "Fotografía editorial serena para Lo que pueden esperar los pacientes en el artículo",
  anchorHeading: image.role === "inline" ? "Lo que pueden esperar los pacientes" : null,
}));

async function mockAdmin(page: Page) {
  let ready = false;
  let imagesReused = false;
  const translationRequests: unknown[] = [];
  const saveRequests: unknown[] = [];
  await page.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  await page.route("**/public-objects/blog-images/**", route => route.fulfill({
    status: 200,
    contentType: "image/png",
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
  }));
  await page.route("**/images/blog/**", route => route.fulfill({
    status: 200,
    contentType: "image/png",
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
  }));
  await page.route("**/api/admin/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const reply = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path === "/api/admin/session") return reply({ authenticated: true });
    if (path === "/api/admin/runtime") return reply({ success: true, data: { runtime: "test" } });
    if (path.endsWith("/links/config")) return reply({ success: true, data: { enabled: false } });
    if (path === "/api/admin/blog/posts" && request.method() === "GET") {
      return reply({ success: true, data: [{ ...source, translationPair: ready
        ? { targetLanguage: "es", state: "draft", sibling: { id: 22, title: sibling.title, slug: sibling.slug, language: "es", status: "draft" }, run: null }
        : { targetLanguage: "es", state: "missing", sibling: null, run: null } }] });
    }
    if (path === "/api/admin/blog/posts/11/translation" && request.method() === "POST") {
      const requestBody = request.postDataJSON();
      translationRequests.push(requestBody);
      if (!requestBody?.refreshDraft) ready = true;
      return reply({ success: true, data: { runId: 7, status: "queued" } }, 202);
    }
    if (path === "/api/admin/blog/generate-draft" && request.method() === "POST") {
      return reply({
        success: true,
        data: source,
        translation: { targetLanguage: "es", state: "queued", runId: 8, recoverable: true },
      }, 201);
    }
    if (path === "/api/admin/blog/posts/22/translation" && request.method() === "GET") {
      return reply({ success: true, data: { source: sibling, sibling: source } });
    }
    if (path === "/api/admin/blog/posts/22/images" && request.method() === "GET") {
      return reply({ success: true, data: imagesReused ? reusedSiblingImages : initialSiblingImages });
    }
    if (path === "/api/admin/blog/posts/22/images/job" && request.method() === "GET") {
      return reply({ success: true, data: null });
    }
    if (path === "/api/admin/blog/posts/22/images/reuse-sibling" && request.method() === "POST") {
      imagesReused = true;
      const updated = { ...sibling, featuredImage: reusedSiblingImages[0].publicUrl, featuredImageAlt: reusedSiblingImages[0].alt };
      return reply({ success: true, data: { sourcePostId: 11, sourceLanguage: "en", selected: reusedSiblingImages, uploadedCopies: 2, reusedExisting: 0, post: updated, images: reusedSiblingImages } });
    }
    if (path === "/api/admin/blog/posts/22" && request.method() === "PUT") {
      const requestBody = request.postDataJSON();
      saveRequests.push(requestBody);
      if (String(requestBody?.metaTitle || "").length > 60) {
        return reply({ success: false, message: "Invalid blog payload", errors: [{ path: "metaTitle", message: "String must contain at most 60 character(s)" }] }, 400);
      }
      return reply({ success: true, data: { ...sibling, ...requestBody, featuredImage: reusedSiblingImages[0].publicUrl, featuredImageAlt: reusedSiblingImages[0].alt } });
    }
    if (path === "/api/admin/blog/posts/22") return reply({ success: true, data: sibling });
    if (path.endsWith("/stats")) return reply({ success: true, data: { draft: 2, pending_review: 0, published: 0, rejected: 0 } });
    if (path.endsWith("/authors")) return reply({ success: true, data: [source.author] });
    if (path.endsWith("/categories")) return reply({ success: true, data: [source.category, sibling.category] });
    if (path.endsWith("/tags")) return reply({ success: true, data: [] });
    if (path.endsWith("/images/config")) return reply({ success: true, data: { enabled: false, storage: "not-configured", model: "test" } });
    return reply({ success: true, data: [] });
  });
  return { translationRequests, saveRequests };
}

for (const name of ["desktop", "mobile"] as const) {
  test(`admin exposes a recoverable bilingual pair workflow on ${name}`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith(name), `Covered by ${name} project`);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => {
      const path = new URL(response.url()).pathname;
      if (path.startsWith("/api/admin/") && response.status() >= 400) {
        errors.push(`${response.status()} ${path}`);
      }
    });
    await authenticateProtectedPreview(page);
    const mocked = await mockAdmin(page);
    await page.goto("/admin/blog");
    await page.getByRole("button", { name: "Auto Generate" }).click();
    await expect(page.getByText("Choose the source language. The strategy engine creates that private draft, then queues its private sibling in the other language.")).toBeVisible();
    await expect(page.getByLabel("Source language")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "AI Generate" }).click();
    await expect(page.getByLabel("Topic")).toBeVisible();
    await expect(page.getByLabel("Target keyword")).toBeVisible();
    await expect(page.getByLabel("Additional context")).toBeVisible();
    await expect(page.getByLabel("Source language")).toBeVisible();
    await page.getByLabel("Topic").fill("Anxiety treatment options in Naples");
    await page.getByRole("button", { name: "Generate Draft" }).click();
    await expect(page.getByText("The Spanish sibling is queued and remains private until separate review and publication.")).toBeVisible();
    await page.getByRole("dialog", { name: "Edit blog post" }).press("Escape");
    await expect(page.getByText("ES: missing")).toBeVisible();
    await page.getByRole("button", { name: "Generate translation draft" }).click();
    await expect(page.getByRole("button", { name: "Open and review sibling" })).toBeVisible();
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Refresh sibling from this post" }).click();
    await expect.poll(() => mocked.translationRequests.length).toBe(2);
    expect(mocked.translationRequests[1]).toEqual({ refreshDraft: true });
    await page.getByRole("button", { name: "Open and review sibling" }).click();
    await expect(page.locator("#post-title")).toHaveValue("Entender la ansiedad");
    await expect(page.locator("#meta-title")).toHaveValue(/.{1,60}/);
    expect((await page.locator("#meta-title").inputValue()).length).toBeLessThanOrEqual(60);
    await page.getByRole("button", { name: "Reuse approved images from English" }).click();
    await expect(page.getByText("Approved English images are now copied into this draft for independent review. No new AI image request was sent.")).toBeVisible();
    await expect(page.locator("#featured-image")).toHaveValue(reusedSiblingImages[0].publicUrl);
    await expect(page.getByText("After: Lo que pueden esperar los pacientes")).toBeVisible();
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect.poll(() => mocked.saveRequests.length).toBe(1);
    expect(String((mocked.saveRequests[0] as { metaTitle?: string }).metaTitle || "").length).toBeLessThanOrEqual(60);
    expect(errors).toEqual([]);
  });
}
