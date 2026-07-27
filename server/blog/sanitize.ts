import sanitizeHtml from "sanitize-html";
import { isManagedBlogImagePublicUrl } from "./images/object-storage";

const BLOG_ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "br",
  "a",
  "blockquote",
];

function isSafeBlogHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isExternalBlogHref(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeBlogContentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: BLOG_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      a: ["http", "https"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs): { tagName: string; attribs: Record<string, string> } => {
        const href = attribs.href || "";
        if (!isSafeBlogHref(href)) {
          return { tagName: "a", attribs: {} };
        }

        if (isExternalBlogHref(href)) {
          return {
            tagName: "a",
            attribs: {
              href,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          };
        }

        return {
          tagName: "a",
          attribs: { href },
        };
      },
    },
    disallowedTagsMode: "discard",
  }).trim();
}

function safeDimension(value: string | undefined, fallback: string): string {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 3840
    ? String(parsed)
    : fallback;
}

export function sanitizeRenderedBlogContentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...BLOG_ALLOWED_TAGS, "figure", "img", "figcaption"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      figure: ["class"],
      img: ["src", "alt", "loading", "decoding", "width", "height"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      a: ["http", "https"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs): { tagName: string; attribs: Record<string, string> } => {
        const href = attribs.href || "";
        if (!isSafeBlogHref(href)) return { tagName: "a", attribs: {} };
        if (isExternalBlogHref(href)) {
          return {
            tagName: "a",
            attribs: { href, target: "_blank", rel: "noopener noreferrer" },
          };
        }
        return { tagName: "a", attribs: { href } };
      },
      figure: () => ({
        tagName: "figure",
        attribs: { class: "blog-inline-image" },
      }),
      img: (_tagName, attribs): { tagName: string; attribs: Record<string, string> } => {
        const src = attribs.src || "";
        if (!isManagedBlogImagePublicUrl(src)) {
          return { tagName: "span", attribs: {} };
        }
        return {
          tagName: "img",
          attribs: {
            src,
            alt: (attribs.alt || "").slice(0, 255),
            loading: "lazy",
            decoding: "async",
            width: safeDimension(attribs.width, "1536"),
            height: safeDimension(attribs.height, "1024"),
          },
        };
      },
    },
    disallowedTagsMode: "discard",
  }).trim();
}

export function getPlainTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingTime(contentHtml: string): number {
  const words = getPlainTextFromHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
