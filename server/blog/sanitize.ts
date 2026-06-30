const ALLOWED_TAGS = new Set([
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
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeBlogContentHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\sstyle=(["']).*?\1/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?([a-z0-9-]+)(\s[^>]*)?>/gi, (match, tagName, rawAttrs = "") => {
      const tag = String(tagName).toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (match.startsWith("</")) return `</${tag}>`;
      if (tag === "br") return "<br>";
      if (tag !== "a") return `<${tag}>`;

      const hrefMatch = String(rawAttrs).match(/\shref=(["'])(.*?)\1/i);
      const href = hrefMatch?.[2] || "";
      const isSafeHref = href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
      return isSafeHref
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">`
        : "<a>";
    });
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
