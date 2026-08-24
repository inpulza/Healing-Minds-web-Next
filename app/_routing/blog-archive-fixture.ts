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

function fixtureCopy(language: BlogLanguage, number: number) {
  const lengthVariant = number % 3;
  if (language === "es") {
    if (lengthVariant === 1) {
      return {
        title: `Guia breve de bienestar ${number}`,
        excerpt: "Una vista previa breve para comparar la alineacion.",
      };
    }
    if (lengthVariant === 2) {
      return {
        title: `Como preparar una conversacion sobre salud mental con preguntas claras ${number}`,
        excerpt: "Una explicacion de longitud media que permite comprobar el ritmo visual de la tarjeta en espanol.",
      };
    }
    return {
      title: `Pasos practicos para comprender opciones de atencion y preparar el seguimiento con tranquilidad ${number}`,
      excerpt: "Una vista previa deliberadamente mas extensa que ocupa varias lineas, mantiene el contenido legible y pone a prueba la posicion estable del boton al final de cada tarjeta.",
    };
  }

  if (lengthVariant === 1) {
    return {
      title: `A short wellness guide ${number}`,
      excerpt: "A brief preview used to compare card alignment.",
    };
  }
  if (lengthVariant === 2) {
    return {
      title: `How to prepare clear questions for a mental health conversation ${number}`,
      excerpt: "A medium-length explanation that helps verify the visual rhythm of the archive card.",
    };
  }
  return {
    title: `Practical steps for understanding care options and preparing a thoughtful follow-up ${number}`,
    excerpt: "A deliberately longer preview that spans several lines, keeps the content readable, and tests whether every call to action stays anchored at the bottom of its card.",
  };
}

function fixturePosts(language: BlogLanguage): BlogPostListItem[] {
  const total = language === "es" ? 12 : 14;
  const categories = categoryDefinitions[language];
  return Array.from({ length: total }, (_, index) => {
    const category = index === 3 || index > 10 ? categories[1] : categories[0];
    const number = index + 1;
    const content = fixtureCopy(language, number);
    return {
      id: (language === "es" ? 2000 : 1000) + number,
      slug: `${language}-archive-fixture-${number}`,
      language,
      title: content.title,
      excerpt: content.excerpt,
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
