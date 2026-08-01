/**
 * @typedef {Object} SitemapPost
 * @property {string} slug
 * @property {string} language
 * @property {string} translationGroupId
 * @property {Date | string | null | undefined} publishedAt
 * @property {Date | string | null | undefined} updatedAt
 * @property {Date | string | null | undefined} createdAt
 */

/**
 * @param {string} origin
 * @param {SitemapPost} post
 */
function getPostUrl(origin, post) {
  const prefix = post.language === "es" ? "/es/blog/" : "/blog/";
  return `${origin}${prefix}${encodeURIComponent(post.slug)}`;
}

/**
 * Preserve the legacy Express sitemap contract while returning data that the
 * Next metadata serializer can render directly.
 *
 * @param {string} origin
 * @param {SitemapPost[]} posts
 */
export function buildBlogSitemapEntries(origin, posts) {
  /** @type {Map<string, SitemapPost[]>} */
  const postsByTranslationGroup = new Map();

  for (const post of posts) {
    const translations = postsByTranslationGroup.get(post.translationGroupId) ?? [];
    translations.push(post);
    postsByTranslationGroup.set(post.translationGroupId, translations);
  }

  return posts.map((post) => {
    const translations = postsByTranslationGroup.get(post.translationGroupId) ?? [post];
    /** @type {Record<string, string>} */
    const languages = {};
    for (const translation of translations) {
      languages[translation.language] = getPostUrl(origin, translation);
    }
    const defaultPost = translations.find((translation) => translation.language === "en") ?? post;
    languages["x-default"] = getPostUrl(origin, defaultPost);

    const lastModifiedSource = post.publishedAt || post.updatedAt || post.createdAt;
    const lastModified = lastModifiedSource
      ? new Date(lastModifiedSource).toISOString().split("T")[0]
      : undefined;

    return {
      url: getPostUrl(origin, post),
      lastModified,
      changeFrequency: /** @type {const} */ ("monthly"),
      priority: 0.6,
      alternates: { languages },
    };
  });
}
