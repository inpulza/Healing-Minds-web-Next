import { DomUtils, parseDocument } from "htmlparser2";
import type { Element } from "domhandler";
import type { BlogPostImage } from "@shared/schema";
import {
  sanitizeBlogContentHtml,
  sanitizeRenderedBlogContentHtml,
} from "../sanitize";
import { isManagedBlogImagePublicUrl } from "./object-storage";

function normalizeHeading(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createFigure(image: BlogPostImage): Element | undefined {
  if (!image.publicUrl || !isManagedBlogImagePublicUrl(image.publicUrl)) return undefined;
  const width = image.width && image.width > 0 ? image.width : 1536;
  const height = image.height && image.height > 0 ? image.height : 1024;
  const caption = image.caption
    ? `<figcaption>${escapeAttribute(image.caption)}</figcaption>`
    : "";
  const fragment = parseDocument(
    `<figure class="blog-inline-image"><img src="${escapeAttribute(image.publicUrl)}" alt="${escapeAttribute(image.alt || "")}" loading="lazy" decoding="async" width="${width}" height="${height}">${caption}</figure>`,
  );
  return DomUtils.getElementsByTagName("figure", fragment.children, true, 1)[0];
}

export function materializeSelectedInlineImages(
  contentHtml: string,
  images: BlogPostImage[],
): string {
  const safeArticleHtml = sanitizeBlogContentHtml(contentHtml);
  const selectedInline = images
    .filter(image =>
      image.role === "inline"
      && image.reviewStatus === "selected"
      && image.generationStatus === "completed"
      && image.publicUrl
      && isManagedBlogImagePublicUrl(image.publicUrl))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  if (selectedInline.length === 0) return safeArticleHtml;

  const document = parseDocument(safeArticleHtml);
  const headings = DomUtils.findAll(
    element => element.name === "h2" || element.name === "h3",
    document.children,
  );
  if (headings.length === 0) return safeArticleHtml;

  const lastInsertedByHeading = new Map<Element, Element>();
  selectedInline.forEach((image, index) => {
    const anchor = normalizeHeading(image.anchorHeading || "");
    const heading = headings.find(item => normalizeHeading(DomUtils.getText(item)) === anchor)
      || headings[Math.min(index, headings.length - 1)];
    const figure = createFigure(image);
    if (!heading || !figure) return;
    const insertionPoint = lastInsertedByHeading.get(heading) || heading;
    DomUtils.append(insertionPoint, figure);
    lastInsertedByHeading.set(heading, figure);
  });

  return sanitizeRenderedBlogContentHtml(DomUtils.getInnerHTML(document));
}

export function getInlineImageAnchors(contentHtml: string, limit: number): string[] {
  const document = parseDocument(sanitizeBlogContentHtml(contentHtml));
  const headings = DomUtils.findAll(
    element => element.name === "h2" || element.name === "h3",
    document.children,
  );
  const anchors = headings
    .map(heading => DomUtils.getText(heading).replace(/\s+/g, " ").trim())
    .filter((heading, index, all) => heading.length > 0 && all.indexOf(heading) === index);
  if (anchors.length <= limit) return anchors;
  if (limit === 1) return [anchors[Math.floor(anchors.length / 2)]];
  return [anchors[Math.floor(anchors.length / 3)], anchors[Math.floor(anchors.length * 2 / 3)]]
    .slice(0, limit);
}
