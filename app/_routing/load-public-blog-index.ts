import { unstable_cache } from "next/cache";
import blogSnapshot from "@shared/blog-snapshot.json";
import type { BlogLanguage, BlogPostListItem } from "@/pages/BlogIndex";

type BlogListSource = {
  id: number;
  slug: string;
  language: string;
  title: string;
  excerpt: string | null;
  category: { name: string; slug: string } | null;
  readingTime: number | null;
  publishedAt: Date | string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  isFeatured: boolean;
};

function toListItem(post: BlogListSource): BlogPostListItem {
  if (post.language !== "en" && post.language !== "es") {
    throw new Error(`Unsupported public blog language: ${post.language}`);
  }
  return {
    id: post.id,
    slug: post.slug,
    language: post.language,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category
      ? { name: post.category.name, slug: post.category.slug }
      : null,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : null,
    featuredImage: post.featuredImage,
    featuredImageAlt: post.featuredImageAlt,
    isFeatured: post.isFeatured,
  };
}

function frozenPosts(language: BlogLanguage): BlogPostListItem[] {
  return Object.values(blogSnapshot)
    .filter((post) => post.language === language)
    .map((post) => toListItem(post as BlogListSource));
}

const loadDatabasePosts = unstable_cache(
  async (language: BlogLanguage): Promise<BlogPostListItem[]> => {
    const { getBlogPosts } = await import("../../server/blog/storage");
    const posts = await getBlogPosts({
      status: "published",
      language,
      limit: 1000,
      offset: 0,
    });
    return posts.map((post) => toListItem(post));
  },
  ["public-blog-index"],
  { revalidate: 300, tags: ["public-blog-index"] },
);

export async function loadPublicBlogIndex(
  language: BlogLanguage,
): Promise<BlogPostListItem[]> {
  if (!process.env.DATABASE_URL) return frozenPosts(language);

  try {
    return await loadDatabasePosts(language);
  } catch (error) {
    // Keep the degraded snapshot outside unstable_cache so a transient database
    // failure never replaces a previously valid cached list.
    console.error(
      "Public blog index database lookup failed; using the frozen public snapshot",
      error,
    );
    return frozenPosts(language);
  }
}
