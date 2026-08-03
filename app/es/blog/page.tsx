import type { Metadata } from "next";
import {
  BlogIndexPage,
  blogIndexMetadata,
  type BlogIndexSearchParams,
} from "../../_routing/blog-index-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogIndexSearchParams>;
}): Promise<Metadata> {
  return blogIndexMetadata("es", await searchParams);
}

export default async function SpanishBlogIndex({
  searchParams,
}: {
  searchParams: Promise<BlogIndexSearchParams>;
}) {
  return <BlogIndexPage language="es" searchParams={await searchParams} />;
}
