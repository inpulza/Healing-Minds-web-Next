import { NextResponse, type NextRequest } from "next/server";
import blogSnapshot from "@shared/blog-snapshot.json";
import {
  normalizeBlogArchiveCategory,
  parseBlogArchivePage,
} from "@shared/blog-archive";
import { loadPublicBlogArchive } from "../../../../_routing/load-public-blog-index";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug?: string[] }> };

const snapshotPosts = Object.values(blogSnapshot) as Array<{
  slug: string;
  language: "en" | "es";
  [key: string]: unknown;
}>;

async function frozenResponse(request: NextRequest, context: RouteContext) {
  const { slug = [] } = await context.params;
  const language = request.nextUrl.searchParams.get("language") === "es" ? "es" : "en";
  const headers = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" };

  if (slug.length === 1) {
    const post = snapshotPosts.find(
      (item) => item.slug === decodeURIComponent(slug[0]) && item.language === language,
    );
    return post
      ? NextResponse.json({ success: true, data: post }, { headers })
      : NextResponse.json({ success: false, message: "Blog post not found" }, { status: 404 });
  }

  if (slug.length > 1) {
    return NextResponse.json({ success: false, message: "Blog post not found" }, { status: 404 });
  }

  const data = snapshotPosts.filter((post) => post.language === language);
  return NextResponse.json({ success: true, data }, { headers });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug: requestedSlug = [] } = await context.params;
  if (requestedSlug.length === 0 && request.nextUrl.searchParams.has("page")) {
    const language = request.nextUrl.searchParams.get("language") === "es" ? "es" : "en";
    const archive = await loadPublicBlogArchive(language, {
      page: parseBlogArchivePage(request.nextUrl.searchParams.get("page")),
      category: normalizeBlogArchiveCategory(request.nextUrl.searchParams.get("category")),
    });
    return NextResponse.json(
      { success: true, ...archive },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  }

  if (!process.env.DATABASE_URL) return frozenResponse(request, context);

  try {
    const [{ getBlogPostBySlug, getBlogPosts }, { sanitizeBlogContentHtml }] =
      await Promise.all([
        import("../../../../../server/blog/storage"),
        import("../../../../../server/blog/sanitize"),
      ]);
    const { slug = [] } = await context.params;
    const language = request.nextUrl.searchParams.get("language") === "es" ? "es" : "en";

    if (slug.length > 0) {
      if (slug.length !== 1) {
        return NextResponse.json(
          { success: false, message: "Blog post not found" },
          { status: 404 },
        );
      }

      const post = await getBlogPostBySlug(decodeURIComponent(slug[0]), language);
      if (!post) {
        return NextResponse.json(
          { success: false, message: "Blog post not found" },
          { status: 404 },
        );
      }

      const [{ getSelectedBlogPostImages }, { materializeSelectedInlineImages }] =
        await Promise.all([
          import("../../../../../server/blog/images/storage"),
          import("../../../../../server/blog/images/render"),
        ]);
      const images = await getSelectedBlogPostImages(post.id);
      const data = {
        ...post,
        content: materializeSelectedInlineImages(
          sanitizeBlogContentHtml(post.content || ""),
          images,
        ),
      };
      return NextResponse.json(
        { success: true, data },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
      );
    }

    const limitValue = Number(request.nextUrl.searchParams.get("limit") || 50);
    const offsetValue = Number(request.nextUrl.searchParams.get("offset") || 0);
    const posts = await getBlogPosts({
      status: "published",
      language:
        request.nextUrl.searchParams.get("language") === "es"
          ? "es"
          : request.nextUrl.searchParams.get("language") === "en"
            ? "en"
            : undefined,
      categorySlug: request.nextUrl.searchParams.get("category") || undefined,
      tagSlug: request.nextUrl.searchParams.get("tag") || undefined,
      limit: Number.isFinite(limitValue) ? Math.min(100, Math.max(1, limitValue)) : 50,
      offset: Number.isFinite(offsetValue) ? Math.max(0, offsetValue) : 0,
    });
    const data = posts.map((post) => ({
      ...post,
      content: sanitizeBlogContentHtml(post.content || ""),
    }));

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (error) {
    console.error("Public blog database request failed; serving frozen published snapshot", error);
    return frozenResponse(request, context);
  }
}
