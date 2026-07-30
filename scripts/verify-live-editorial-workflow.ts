import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { blogPosts } from "../shared/schema";
import { deactivateBlogRedirect } from "../server/blog/storage";

const origin = process.env.VERIFY_ORIGIN || "http://127.0.0.1:3100";
const username = process.env.BLOG_ADMIN_USERNAME;
const password = process.env.BLOG_ADMIN_PASSWORD;
if (!username || !password) throw new Error("BLOG_ADMIN_USERNAME and BLOG_ADMIN_PASSWORD are required");

const slug = `verification-editorial-${Date.now()}`;
const publicPath = `/blog/${slug}`;
let postId: number | undefined;
let cookie = "";

async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(`${origin}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
      ...init.headers,
    },
    redirect: "manual",
  });
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(`${init.method || "GET"} ${path} returned ${response.status}: ${typeof body === "string" ? body.slice(0, 300) : JSON.stringify(body)}`);
  return { response, body };
}

const paragraphs = Array.from({ length: 12 }, (_, index) => (
  `<p>Verification section ${index + 1} confirms that editorial content is stored in PostgreSQL, reviewed before publication, rendered through the public Next.js route, and removed safely without exposing private patient information. This controlled article discusses general mental health education, consistent follow-up, and coordination with qualified clinicians. It does not describe any real patient or provide individualized treatment instructions.</p>`
)).join("\n");
const content = `<h2>Editorial workflow verification</h2>${paragraphs}<p>Read more about <a href="/services/anxiety-treatment">anxiety treatment services</a> and consult <a href="https://www.nimh.nih.gov/health">NIMH educational resources</a>.</p><p>This article is educational and is not a substitute for emergency care or individualized medical advice. If you are in immediate danger or thinking about harming yourself, call 911 or go to the nearest emergency room.</p>`;

try {
  const login = await fetch(`${origin}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!login.ok) throw new Error(`Admin login returned ${login.status}`);
  cookie = (login.headers.get("set-cookie") || "").split(";", 1)[0];
  if (!cookie) throw new Error("Admin login did not issue a session cookie");

  const [{ body: authors }, { body: categories }, { body: tags }] = await Promise.all([
    api("/api/admin/blog/authors"),
    api("/api/admin/blog/categories?language=en"),
    api("/api/admin/blog/tags?language=en"),
  ]);
  const author = authors.data?.[0];
  const category = categories.data?.[0];
  const tag = tags.data?.[0];
  if (!author || !category || !tag) throw new Error("Seeded author/category/tag were not available");

  const created = await api("/api/admin/blog/posts", {
    method: "POST",
    body: JSON.stringify({
      title: "Editorial PostgreSQL Workflow Verification",
      slug,
      language: "en",
      excerpt: "A temporary controlled article that verifies the complete PostgreSQL-backed editorial publication workflow.",
      content,
      featuredImage: "/images/blog/approved/anxiety-treatment.webp",
      featuredImageAlt: "Calm clinical office used for editorial workflow verification",
      authorId: author.id,
      categoryId: category.id,
      status: "pending_review",
      isFeatured: false,
      metaTitle: "Editorial Workflow Verification | Healing Minds",
      metaDescription: "Controlled verification of the PostgreSQL-backed editorial workflow, publication route, metadata, and redirect behavior.",
      tagIds: [tag.id],
    }),
  });
  postId = created.body.data.id;

  await api(`/api/admin/blog/posts/${postId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "published" }),
  });

  const published = await fetch(`${origin}${publicPath}`, { redirect: "manual" });
  const publishedHtml = await published.text();
  if (published.status !== 200 || !publishedHtml.includes("Editorial PostgreSQL Workflow Verification")) {
    throw new Error(`Published post verification failed (${published.status})`);
  }

  await api(`/api/admin/blog/posts/${postId}`, {
    method: "DELETE",
    body: JSON.stringify({
      confirmPublishedDelete: true,
      confirmSlug: slug,
      redirectTargetPath: "/blog",
    }),
  });
  postId = undefined;

  const redirected = await fetch(`${origin}${publicPath}`, { redirect: "manual" });
  if (![301, 308].includes(redirected.status) || redirected.headers.get("location") !== "/blog") {
    throw new Error(`Editorial redirect verification failed (${redirected.status}, ${redirected.headers.get("location")})`);
  }

  await deactivateBlogRedirect(publicPath);
  const absent = await fetch(`${origin}${publicPath}`, { redirect: "manual" });
  if (absent.status !== 404) throw new Error(`Deleted post did not return 404 after cleanup (${absent.status})`);

  console.log(JSON.stringify({
    success: true,
    database: "Neon PostgreSQL",
    workflow: ["login", "taxonomy-read", "create", "publish", "public-200", "delete", "redirect", "cleanup-404"],
    publishedBytes: Buffer.byteLength(publishedHtml),
    redirectStatus: redirected.status,
    finalStatus: absent.status,
  }, null, 2));
} finally {
  if (postId) await db.delete(blogPosts).where(eq(blogPosts.id, postId)).catch(() => undefined);
  await deactivateBlogRedirect(publicPath).catch(() => undefined);
  await pool.end();
}
