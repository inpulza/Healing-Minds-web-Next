import { getBilingualUrlMap } from "@shared/routeManifest";
import type { BlogLanguage, BlogPostWithRelations } from "../storage";
import { extractHtmlHrefs } from "./provider";
import { getPublishedBlogTranslationPath } from "./storage";

export async function buildBlogTranslationLinkMap(
  source: BlogPostWithRelations,
  _targetLanguage: BlogLanguage,
): Promise<Record<string, string>> {
  const staticMap = getBilingualUrlMap();
  const result: Record<string, string> = {};
  for (const href of Array.from(new Set(extractHtmlHrefs(source.content || "")))) {
    if (staticMap[href]) {
      result[href] = staticMap[href];
      continue;
    }
    if (/^\/(?:es\/)?blog\//.test(href)) {
      result[href] = await getPublishedBlogTranslationPath(href) || href;
      continue;
    }
    result[href] = href;
  }
  return result;
}

export function preferCuratedTargetLanguageSources(
  linkMap: Record<string, string>,
  curatedTargetUrls: string[],
): Record<string, string> {
  const result = { ...linkMap };
  for (const sourceUrl of Object.keys(result)) {
    if (!/^https?:\/\//i.test(sourceUrl)) continue;
    let sourceHost = "";
    try { sourceHost = new URL(sourceUrl).hostname.replace(/^www\./, ""); } catch { continue; }
    const curated = curatedTargetUrls.find(candidate => {
      try { return new URL(candidate).hostname.replace(/^www\./, "") === sourceHost; } catch { return false; }
    });
    if (curated) result[sourceUrl] = curated;
  }
  return result;
}
