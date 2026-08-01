import DOMPurify from "dompurify";
import { isManagedBlogImagePublicUrl } from "@shared/blog-images";

export type BlogArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const DOMPURIFY_NAMED_PROP_PREFIX = "user-content-";

export function sanitizeClientBlogHtml(html: string): string {
  if (typeof window === "undefined") return html;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "b", "i", "br", "a", "blockquote", "figure", "img", "figcaption"],
    ALLOWED_ATTR: ["href", "target", "rel", "id", "class", "src", "alt", "loading", "decoding", "width", "height"],
    ALLOW_DATA_ATTR: false,
    SANITIZE_NAMED_PROPS: true,
  });
}

function slugifyHeading(text: string, fallback: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);

  return slug || fallback;
}

export function prepareBlogArticleHtml(html: string): {
  content: string;
  headings: BlogArticleHeading[];
} {
  if (typeof DOMParser === "undefined") {
    return { content: sanitizeClientBlogHtml(html), headings: [] };
  }

  const parser = new DOMParser();
  const safeHtml = sanitizeClientBlogHtml(html);
  const doc = parser.parseFromString(safeHtml, "text/html");
  doc.querySelectorAll("img").forEach(image => {
    const src = image.getAttribute("src") || "";
    if (!isManagedBlogImagePublicUrl(src)) {
      (image.closest("figure") || image).remove();
      return;
    }
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
  });
  doc.querySelectorAll("figure").forEach(figure => {
    figure.className = "blog-inline-image";
    if (!figure.querySelector("img")) figure.remove();
  });

  const usedIds = new Map<string, number>();
  const headings: BlogArticleHeading[] = [];
  doc.querySelectorAll("h2, h3").forEach((heading, index) => {
    const text = heading.textContent?.trim() || "";
    if (!text) return;

    const baseId = heading.id || slugifyHeading(text, `section-${index + 1}`);
    const count = usedIds.get(baseId) || 0;
    const rawId = count > 0 ? `${baseId}-${count}` : baseId;
    const id = rawId.startsWith(DOMPURIFY_NAMED_PROP_PREFIX)
      ? rawId
      : `${DOMPURIFY_NAMED_PROP_PREFIX}${rawId}`;
    usedIds.set(baseId, count + 1);
    heading.id = id;
    headings.push({
      id,
      text,
      level: heading.tagName.toLowerCase() === "h3" ? 3 : 2,
    });
  });

  return {
    content: sanitizeClientBlogHtml(doc.body.innerHTML),
    headings,
  };
}
