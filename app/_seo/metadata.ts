import type { Metadata } from "next";
import manifest from "@shared/seo-manifest.json";

type FrozenSeo = {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonical?: string;
  alternates?: Record<string, string>;
  robots?: string;
  lang?: "en" | "es";
  "og:title"?: string;
  "og:description"?: string;
  "og:url"?: string;
  "og:type"?: string;
  "og:site_name"?: string;
  "og:locale"?: string;
  "og:locale:alternate"?: string;
  "og:image"?: string;
  "og:image:alt"?: string;
  "og:image:width"?: string;
  "og:image:height"?: string;
  "twitter:card"?: string;
  "twitter:title"?: string;
  "twitter:description"?: string;
  "twitter:image"?: string;
  "twitter:image:alt"?: string;
};

export function getFrozenSeo(pathname: string): FrozenSeo | undefined {
  return (manifest as Record<string, FrozenSeo>)[pathname];
}

export function metadataForPath(pathname: string): Metadata {
  const seo = getFrozenSeo(pathname);
  if (!seo) return {};

  const image = seo["og:image"]
    ? {
        url: seo["og:image"],
        width: Number(seo["og:image:width"] || 1200),
        height: Number(seo["og:image:height"] || 630),
        alt: seo["og:image:alt"],
      }
    : undefined;

  const usesLiteralRootLinks = pathname === "/" || pathname === "/es";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    robots: seo.robots,
    alternates: {
      canonical: pathname === "/" ? undefined : seo.canonical,
      languages: usesLiteralRootLinks ? undefined : seo.alternates,
    },
    openGraph: {
      title: seo["og:title"] || seo.title,
      description: seo["og:description"] || seo.description,
      url: pathname === "/" ? undefined : seo["og:url"] || seo.canonical,
      siteName: seo["og:site_name"],
      locale: seo["og:locale"],
      alternateLocale: seo["og:locale:alternate"]
        ? [seo["og:locale:alternate"]]
        : undefined,
      type: seo["og:type"] === "article" ? "article" : "website",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo["twitter:title"] || seo.title,
      description: seo["twitter:description"] || seo.description,
      images: seo["twitter:image"]
        ? [{ url: seo["twitter:image"], alt: seo["twitter:image:alt"] }]
        : undefined,
    },
  };
}
