import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  buildBlogArchiveHref,
  normalizeBlogArchiveCategory,
  parseBlogArchivePage,
} from "@shared/blog-archive";
import DynamicBlogIndex from "../../_routing/dynamic-blog-index";
import { createBlogArchiveFixture } from "../../_routing/blog-archive-fixture";
import type { BlogIndexSearchParams } from "../../_routing/blog-index-page";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function BlogArchiveE2EFixture({
  searchParams,
}: {
  searchParams: Promise<BlogIndexSearchParams>;
}) {
  const requestHeaders = await headers();
  if (
    requestHeaders.get("x-e2e-blog-fixtures") !== "1"
    || process.env.VERCEL_ENV === "production"
  ) {
    notFound();
  }
  const params = await searchParams;
  const language = params.language === "es" ? "es" : "en";
  const page = parseBlogArchivePage(params.page);
  const category = normalizeBlogArchiveCategory(params.category);
  const archive = createBlogArchiveFixture(language, page, category);
  if (page > archive.totalPages) {
    redirect(buildBlogArchiveHref({
      archivePath: "/e2e-fixtures/blog-archive",
      page: archive.totalPages,
      category,
      persistentParams: { language },
    }));
  }
  return (
    <DynamicBlogIndex
      language={language}
      initialArchive={archive}
      archivePath="/e2e-fixtures/blog-archive"
      persistentParams={{ language }}
    />
  );
}
