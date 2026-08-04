import { unstable_cache } from "next/cache";
import blogSnapshot from "@shared/blog-snapshot.json";
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  getBlogArchiveRegularLimit,
  getBlogArchiveRegularOffset,
  getBlogArchiveTotalPages,
} from "@shared/blog-archive";
import type {
  BlogArchivePage,
  BlogLanguage,
  BlogPostListItem,
} from "@/pages/BlogIndex";

type BlogListSource = {
  id: number;
  slug: string;
  language: string;
  title: string;
  excerpt: string | null;
  category: { name: string; slug: string } | null;
  readingTime: number | null;
  publishedAt: Date | string | null;
  createdAt?: Date | string | null;
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

function comparePosts(a: BlogListSource, b: BlogListSource): number {
  const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
  const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
  return dateB - dateA || b.id - a.id;
}

function frozenArchive(
  language: BlogLanguage,
  page: number,
  category?: string,
): BlogArchivePage {
  const allLanguagePosts = Object.values(blogSnapshot)
    .filter((post) => post.language === language)
    .map((post) => post as BlogListSource)
    .sort(comparePosts);
  const categories = Array.from(
    new Map(
      allLanguagePosts
        .filter(post => post.category?.slug)
        .map(post => [post.category!.slug, post.category!]),
    ).values(),
  );
  const filtered = category
    ? allLanguagePosts.filter(post => post.category?.slug === category)
    : allLanguagePosts;
  const featured = filtered
    .filter(post => post.isFeatured)
    .sort(comparePosts)[0] || filtered[0];
  const regular = featured
    ? filtered.filter(post => post.id !== featured.id).sort(comparePosts)
    : [];
  const total = filtered.length;
  const totalPages = getBlogArchiveTotalPages(total);
  const visibleRegular = regular.slice(
    getBlogArchiveRegularOffset(page),
    getBlogArchiveRegularOffset(page) + getBlogArchiveRegularLimit(page),
  );
  const visible = page === 1 && featured
    ? [featured, ...visibleRegular]
    : visibleRegular;

  return {
    data: visible.map(toListItem),
    categories,
    page,
    pageSize: BLOG_ARCHIVE_PAGE_SIZE,
    total,
    totalPages,
    category: category || null,
    featuredPostId: featured?.id || null,
  };
}

const loadDatabaseArchive = unstable_cache(
  async (
    language: BlogLanguage,
    page: number,
    category: string | undefined,
  ): Promise<BlogArchivePage> => {
    const { getBlogArchive } = await import("../../server/blog/storage");
    const archive = await getBlogArchive({ language, page, categorySlug: category });
    return {
      ...archive,
      data: archive.posts.map(post => toListItem(post)),
    };
  },
  ["public-blog-archive"],
  { revalidate: 300, tags: ["public-blog-index"] },
);

export async function loadPublicBlogArchive(
  language: BlogLanguage,
  { page = 1, category }: { page?: number; category?: string } = {},
): Promise<BlogArchivePage> {
  if (!process.env.DATABASE_URL) return frozenArchive(language, page, category);

  try {
    return await loadDatabaseArchive(language, page, category);
  } catch (error) {
    // Keep the degraded snapshot outside unstable_cache so a transient database
    // failure never replaces a previously valid cached archive.
    console.error(
      "Public blog archive database lookup failed; using the frozen public snapshot",
      error,
    );
    return frozenArchive(language, page, category);
  }
}
