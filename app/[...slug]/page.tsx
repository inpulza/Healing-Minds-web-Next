import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { metadataForPath } from "../_seo/metadata";
import RootSlashSeoLinks from "../_seo/root-slash-links";
import PublicPage from "../_routing/public-page";
import DynamicBlogIndex from "../_routing/dynamic-blog-index";
import DynamicBlogPost from "../_routing/dynamic-blog-post";
import { loadPublicBlogIndex } from "../_routing/load-public-blog-index";
import { loadPublicBlogPost, loadPublicBlogRedirect, matchBlogPath } from "../_routing/load-public-blog-post";
import { publicRouteParams, resolvePublicRoute } from "../_routing/public-routes.mjs";

export function generateStaticParams() {
  return publicRouteParams.map(({ slug }) => ({ slug: [...slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const frozen = metadataForPath(pathname);
  const blogPath = matchBlogPath(pathname);
  if (!blogPath) return frozen;
  const post = await loadPublicBlogPost(blogPath);
  if (!post) return frozen;
  const canonical = `https://www.healingmindsp.com${pathname}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  return {
    ...frozen,
    title,
    description,
    alternates: { ...(frozen.alternates || {}), canonical },
    openGraph: {
      ...(frozen.openGraph || {}),
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "Healing Minds Psychiatry",
      images: post.featuredImage
        ? [{ url: post.featuredImage, alt: post.featuredImageAlt || post.title }]
        : [
            {
              url: "https://www.healingmindsp.com/og-image.png",
              alt: "Healing Minds Psychiatry - Compassionate psychiatric care in Naples, Florida",
            },
          ],
    },
    twitter: {
      ...(frozen.twitter || {}),
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage
        ? [{ url: post.featuredImage, alt: post.featuredImageAlt || post.title }]
        : ["https://www.healingmindsp.com/og-image.png"],
    },
  };
}

export default async function StaticPublicRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (
    !Array.isArray(slug) ||
    slug.length === 0 ||
    slug.some((segment) => !segment || segment.includes("/") || segment.includes("\\"))
  ) {
    notFound();
  }

  const pathname = `/${slug.join("/")}`;
  const blogPath = matchBlogPath(pathname);
  if (blogPath) {
    const post = await loadPublicBlogPost(blogPath);
    if (!post) {
      const target = await loadPublicBlogRedirect(pathname);
      if (target) permanentRedirect(target);
      notFound();
    }
    return <DynamicBlogPost post={post} />;
  }

  const route = resolvePublicRoute(pathname);
  if (!route) {
    const target = await loadPublicBlogRedirect(pathname);
    if (target) permanentRedirect(target);
    notFound();
  }
  if ("redirectTo" in route) redirect(route.redirectTo);
  if (!("page" in route)) notFound();
  if (route.page === "BlogIndex") {
    const initialBlogPosts = await loadPublicBlogIndex(route.locale);
    return (
      <DynamicBlogIndex
        language={route.locale}
        initialPosts={initialBlogPosts}
      />
    );
  }

  return (
    <>
      {route.pathname === "/es" && <RootSlashSeoLinks />}
      <PublicPage page={route.page} locale={route.locale} />
    </>
  );
}
