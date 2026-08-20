import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  buildBlogArchiveHref,
  normalizeBlogArchiveCategory,
  parseBlogArchivePage,
} from "@shared/blog-archive";
import type { BlogLanguage } from "@/pages/BlogIndex";
import { buildBlogIndexStructuredData } from "../_seo/structured-data";
import StructuredDataScript from "../_seo/structured-data-script";
import DynamicBlogIndex from "./dynamic-blog-index";
import { loadPublicBlogArchive } from "./load-public-blog-index";

export type BlogIndexSearchParams = Record<string, string | string[] | undefined>;

function archivePath(language: BlogLanguage): string {
  return language === "es" ? "/es/blog" : "/blog";
}

function archiveRequest(language: BlogLanguage, searchParams: BlogIndexSearchParams) {
  return {
    path: archivePath(language),
    page: parseBlogArchivePage(searchParams.page),
    category: normalizeBlogArchiveCategory(searchParams.category),
  };
}

function blogIndexSeoDetails(
  language: BlogLanguage,
  searchParams: BlogIndexSearchParams,
) {
  const request = archiveRequest(language, searchParams);
  const canonicalPath = buildBlogArchiveHref({
    archivePath: request.path,
    page: request.page,
    category: request.category,
  });
  const canonical = `https://www.healingmindsp.com${canonicalPath}`;
  const pageSuffix = request.page > 1
    ? language === "es" ? ` - Pagina ${request.page}` : ` - Page ${request.page}`
    : "";
  const categorySuffix = request.category
    ? ` - ${request.category.split("-").map(part => part[0]?.toUpperCase() + part.slice(1)).join(" ")}`
    : "";
  const title = language === "es"
    ? `Blog de Salud Mental${categorySuffix}${pageSuffix} | Healing Minds Psychiatry`
    : `Mental Health Blog${categorySuffix}${pageSuffix} | Healing Minds Psychiatry`;
  const description = language === "es"
    ? "Articulos educativos de Healing Minds Psychiatry sobre salud mental y atencion psiquiatrica en Naples y Florida."
    : "Educational articles from Healing Minds Psychiatry about mental health and psychiatric care in Naples and Florida.";
  return { request, canonicalPath, canonical, title, description };
}

export function blogIndexMetadata(
  language: BlogLanguage,
  searchParams: BlogIndexSearchParams,
): Metadata {
  const { request, canonical, title, description } = blogIndexSeoDetails(language, searchParams);
  const unfilteredAlternates = request.category
    ? undefined
    : {
        en: `https://www.healingmindsp.com${buildBlogArchiveHref({ archivePath: "/blog", page: request.page })}`,
        es: `https://www.healingmindsp.com${buildBlogArchiveHref({ archivePath: "/es/blog", page: request.page })}`,
        "x-default": `https://www.healingmindsp.com${buildBlogArchiveHref({ archivePath: "/blog", page: request.page })}`,
      };

  return {
    title,
    description,
    alternates: { canonical, languages: unfilteredAlternates },
    openGraph: { title, description, url: canonical, siteName: "Healing Minds Psychiatry" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function BlogIndexPage({
  language,
  searchParams,
}: {
  language: BlogLanguage;
  searchParams: BlogIndexSearchParams;
}) {
  const request = archiveRequest(language, searchParams);
  const archive = await loadPublicBlogArchive(language, {
    page: request.page,
    category: request.category,
  });
  const rawPage = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const canonicalPage = Math.min(request.page, archive.totalPages);
  if (
    (rawPage !== undefined && rawPage !== String(request.page))
    || request.page !== canonicalPage
  ) {
    redirect(buildBlogArchiveHref({
      archivePath: request.path,
      page: canonicalPage,
      category: request.category,
    }));
  }

  const seo = blogIndexSeoDetails(language, searchParams);
  return (
    <>
      <StructuredDataScript
        data={buildBlogIndexStructuredData({
          language,
          canonicalPath: seo.canonicalPath,
          title: seo.title,
          description: seo.description,
          archive,
        })}
      />
      <DynamicBlogIndex language={language} initialArchive={archive} />
    </>
  );
}
