import { DomUtils, parseDocument } from "htmlparser2";
import type { Element } from "domhandler";
import { sanitizeBlogContentHtml } from "../sanitize";
import { getBlogLinkConfig } from "./config";
import { tryNormalizeBlogLinkHref } from "./normalization";

function isAnchor(node: unknown): node is Element {
  return Boolean(
    node
    && typeof node === "object"
    && "type" in node
    && (node as Element).type === "tag"
    && (node as Element).name.toLowerCase() === "a",
  );
}

function suffixFromHref(rawHref: string, publicSiteUrl: string): string {
  try {
    const url = new URL(rawHref, publicSiteUrl);
    return `${url.search}${url.hash}`;
  } catch {
    return "";
  }
}

export function rewriteExactBlogLinkHref(
  contentHtml: string,
  sourceHref: string,
  targetHref: string,
): { contentHtml: string; replacements: number } {
  const config = getBlogLinkConfig();
  const normalizedSource = tryNormalizeBlogLinkHref(sourceHref, {
    publicSiteUrl: config.publicSiteUrl,
  });
  const normalizedTarget = tryNormalizeBlogLinkHref(targetHref, {
    publicSiteUrl: config.publicSiteUrl,
  });
  if (
    !normalizedSource
    || !normalizedTarget
    || normalizedSource.kind !== "internal"
    || normalizedTarget.kind !== "internal"
  ) {
    throw Object.assign(new Error("Redirect cleanup requires two valid internal targets"), {
      statusCode: 400,
    });
  }

  const document = parseDocument(contentHtml, {
    decodeEntities: false,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
  });
  let replacements = 0;
  const anchors = DomUtils.findAll(isAnchor, document.children);
  for (const anchor of anchors) {
    const rawHref = anchor.attribs?.href;
    if (!rawHref) continue;
    const normalized = tryNormalizeBlogLinkHref(rawHref, {
      publicSiteUrl: config.publicSiteUrl,
    });
    if (
      !normalized
      || normalized.kind !== "internal"
      || normalized.normalizedHref !== normalizedSource.normalizedHref
    ) {
      continue;
    }
    anchor.attribs.href = `${normalizedTarget.normalizedHref}${suffixFromHref(rawHref, config.publicSiteUrl)}`;
    replacements += 1;
  }

  const rendered = document.children
    .map(node => DomUtils.getOuterHTML(node, { decodeEntities: false }))
    .join("");
  return {
    contentHtml: sanitizeBlogContentHtml(rendered),
    replacements,
  };
}
