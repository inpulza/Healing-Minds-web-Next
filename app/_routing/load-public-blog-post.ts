import { cache } from "react";
import blogSnapshot from "@shared/blog-snapshot.json";
import type { BlogPostDetail } from "@/pages/BlogPost";

export type BlogPathMatch = { slug: string; language: "en" | "es"; pathname: string };

export function matchBlogPath(pathname: string): BlogPathMatch | null {
  const match = pathname.match(/^\/(es\/)?blog\/([^/]+)$/);
  if (!match) return null;
  try {
    const slug = decodeURIComponent(match[2]);
    if (!slug || slug.includes("/") || slug.includes("\\")) return null;
    return { slug, language: match[1] ? "es" : "en", pathname };
  } catch {
    return null;
  }
}

function frozenPost(pathname: string): BlogPostDetail | null {
  return (blogSnapshot as Record<string, BlogPostDetail>)[pathname] || null;
}

function serializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const loadPublicBlogPostByKey = cache(async (
  slug: string,
  language: BlogPathMatch["language"],
  pathname: string,
): Promise<BlogPostDetail | null> => {
  if (!process.env.DATABASE_URL) return frozenPost(pathname);

  try {
    const [{ getBlogPostBySlug }, { sanitizeBlogContentHtml }, imageStorage, imageRender] = await Promise.all([
      import("../../server/blog/storage"),
      import("../../server/blog/sanitize"),
      import("../../server/blog/images/storage"),
      import("../../server/blog/images/render"),
    ]);
    const post = await getBlogPostBySlug(slug, language);
    if (!post) return frozenPost(pathname);
    const images = await imageStorage.getSelectedBlogPostImages(post.id);
    return serializable({
      ...post,
      content: imageRender.materializeSelectedInlineImages(
        sanitizeBlogContentHtml(post.content || ""),
        images,
      ),
    }) as BlogPostDetail;
  } catch (error) {
    console.error("Dynamic blog page database lookup failed; using the frozen public snapshot", error);
    return frozenPost(pathname);
  }
});

export function loadPublicBlogPost(match: BlogPathMatch): Promise<BlogPostDetail | null> {
  // React cache compares arguments by identity. Primitive keys let metadata and
  // the page share one request-local DB/image read even though each call builds
  // its own BlogPathMatch object.
  return loadPublicBlogPostByKey(match.slug, match.language, match.pathname);
}

export const loadPublicBlogRedirect = cache(async (pathname: string): Promise<string | null> => {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { getActiveBlogRedirect } = await import("../../server/blog/storage");
    const redirect = await getActiveBlogRedirect(pathname);
    return redirect?.targetPath || null;
  } catch (error) {
    console.error("Dynamic blog redirect lookup failed", error);
    return null;
  }
});
