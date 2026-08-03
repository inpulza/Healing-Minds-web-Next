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

const categoryDefinitions = {
  en: [
    { name: "Anxiety Care", slug: "anxiety-care" },
    { name: "Medication Education", slug: "medication-education" },
  ],
  es: [
    { name: "Atencion de Ansiedad", slug: "atencion-ansiedad" },
    { name: "Educacion sobre Medicamentos", slug: "educacion-medicamentos" },
  ],
} as const;

function fixturePosts(language: BlogLanguage): BlogPostListItem[] {
  const total = language === "es" ? 12 : 14;
  const categories = categoryDefinitions[language];
  return Array.from({ length: total }, (_, index) => {
    const category = index < 10 ? categories[0] : categories[1];
    const number = index + 1;
    return {
      id: (language === "es" ? 2000 : 1000) + number,
      slug: `${language}-archive-fixture-${number}`,
      language,
      title: language === "es"
        ? `Articulo de prueba ${number}`
        : `Archive fixture article ${number}`,
      excerpt: language === "es"
        ? "Contenido editorial de prueba para verificar el archivo bilingue."
        : "Editorial fixture content used to verify the bilingual archive.",
      category: { ...category },
      readingTime: 5 + (index % 4),
      publishedAt: new Date(Date.UTC(2026, 6, 31 - index)).toISOString(),
      featuredImage: null,
      featuredImageAlt: null,
      isFeatured: index === 0,
    };
  });
}

export function createBlogArchiveFixture(
  language: BlogLanguage,
  page: number,
  category?: string,
): BlogArchivePage {
  const allPosts = fixturePosts(language);
  const categories = categoryDefinitions[language].map(item => ({ ...item }));
  const filtered = category
    ? allPosts.filter(post => post.category?.slug === category)
    : allPosts;
  const featured = filtered.find(post => post.isFeatured) || filtered[0];
  const regular = featured ? filtered.filter(post => post.id !== featured.id) : [];
  const total = filtered.length;
  const totalPages = getBlogArchiveTotalPages(total);
  const offset = getBlogArchiveRegularOffset(page);
  const limit = getBlogArchiveRegularLimit(page);
  const data = page === 1 && featured
    ? [featured, ...regular.slice(offset, offset + limit)]
    : regular.slice(offset, offset + limit);
  return {
    data,
    categories,
    page,
    pageSize: BLOG_ARCHIVE_PAGE_SIZE,
    total,
    totalPages,
    category: category || null,
    featuredPostId: featured?.id || null,
  };
}
