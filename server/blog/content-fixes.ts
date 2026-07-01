import type { BlogPostWithRelations } from "./storage";
import { getBlogTags, updateBlogPost, type BlogPostInput } from "./storage";
import { estimateReadingTime, getPlainTextFromHtml, sanitizeBlogContentHtml } from "./sanitize";
import { ensureBlogInternalLinks } from "./internal-links";
import { selectBlogTagIdsForPost } from "./taxonomy";
import {
  getMedicalDisclaimerHtml,
  hasMedicalDisclaimer,
  slugifyBlogValue,
  truncateSeoText,
} from "./editorial-rules";
import {
  buildBlogVerificationReport,
  type BlogVerificationFixType,
  type BlogVerificationReport,
} from "./verification";

export type BlogFixResult = {
  success: boolean;
  fixType: BlogVerificationFixType;
  message: string;
  changedFields: string[];
  post?: BlogPostWithRelations;
  verification?: BlogVerificationReport;
};

function normalizeLanguage(language: string): "en" | "es" {
  return language === "es" ? "es" : "en";
}

function buildMetaDescription(post: BlogPostWithRelations): string {
  const candidates = [
    post.metaDescription || "",
    post.excerpt || "",
    getPlainTextFromHtml(post.content || ""),
  ].map(value => value.replace(/\s+/g, " ").trim()).filter(Boolean);

  const bestCandidate = candidates.find(value => value.length >= 50) || candidates.sort((a, b) => b.length - a.length)[0] || "";
  return truncateSeoText(bestCandidate, 160);
}

function buildFeaturedImageAlt(post: BlogPostWithRelations): string {
  const suffix = "Healing Minds Psychiatry";
  const base = post.title.trim() || post.category?.name || "Mental health article";
  return truncateSeoText(`${base} | ${suffix}`, 255);
}

async function updateAndReport(
  post: BlogPostWithRelations,
  fixType: BlogVerificationFixType,
  values: Partial<BlogPostInput>,
  changedFields: string[],
  message: string,
): Promise<BlogFixResult> {
  const updatedPost = await updateBlogPost(post.id, values);
  if (!updatedPost) {
    return {
      success: false,
      fixType,
      message: "Blog post could not be loaded after applying the fix.",
      changedFields: [],
    };
  }

  const verification = buildBlogVerificationReport(updatedPost);
  return {
    success: true,
    fixType,
    message,
    changedFields,
    post: updatedPost,
    verification,
  };
}

export async function applyDeterministicBlogFix(
  post: BlogPostWithRelations,
  fixType: BlogVerificationFixType,
): Promise<BlogFixResult> {
  if (post.status === "published") {
    return {
      success: false,
      fixType,
      message: "Move the post back to draft before applying automatic fixes.",
      changedFields: [],
    };
  }

  switch (fixType) {
    case "slug": {
      const slug = slugifyBlogValue(post.title);
      if (!slug) {
        return {
          success: false,
          fixType,
          message: "A title is required before the slug can be fixed.",
          changedFields: [],
        };
      }
      return updateAndReport(post, fixType, { slug }, ["slug"], "Slug regenerated from the title.");
    }

    case "metaTitle": {
      const metaTitle = truncateSeoText(post.metaTitle || post.title, 70);
      if (metaTitle.length < 10) {
        return {
          success: false,
          fixType,
          message: "The title is too short to create a safe meta title automatically.",
          changedFields: [],
        };
      }
      return updateAndReport(post, fixType, { metaTitle }, ["metaTitle"], "Meta title rebuilt from the post title.");
    }

    case "metaDescription": {
      const metaDescription = buildMetaDescription(post);
      if (metaDescription.length < 50) {
        return {
          success: false,
          fixType,
          message: "There is not enough excerpt or body copy to create a safe meta description.",
          changedFields: [],
        };
      }
      return updateAndReport(
        post,
        fixType,
        { metaDescription },
        ["metaDescription"],
        "Meta description rebuilt from the excerpt/body copy.",
      );
    }

    case "readingTime": {
      const readingTime = estimateReadingTime(post.content || "");
      return updateAndReport(post, fixType, { readingTime }, ["readingTime"], "Reading time recalculated from the content.");
    }

    case "featuredImageAlt": {
      const featuredImageAlt = buildFeaturedImageAlt(post);
      return updateAndReport(
        post,
        fixType,
        { featuredImageAlt },
        ["featuredImageAlt"],
        "Featured image alt text generated from the article title.",
      );
    }

    case "medicalDisclaimer": {
      const text = getPlainTextFromHtml(post.content || "");
      if (hasMedicalDisclaimer(text)) {
        return {
          success: true,
          fixType,
          message: "The article already includes medical disclaimer language.",
          changedFields: [],
          post,
          verification: buildBlogVerificationReport(post),
        };
      }

      const content = sanitizeBlogContentHtml(`${post.content || ""}\n${getMedicalDisclaimerHtml(normalizeLanguage(post.language))}`);
      return updateAndReport(
        post,
        fixType,
        { content, readingTime: estimateReadingTime(content) },
        ["content", "readingTime"],
        "Medical disclaimer added to the article body.",
      );
    }

    case "tags": {
      const availableTags = await getBlogTags(normalizeLanguage(post.language));
      const tagIds = selectBlogTagIdsForPost(post, availableTags);
      const existingTagIds = post.tags.map(tag => tag.id);
      const changed = tagIds.some(tagId => !existingTagIds.includes(tagId)) || tagIds.length !== existingTagIds.length;

      if (tagIds.length === 0 || !changed) {
        return {
          success: false,
          fixType,
          message: "No matching topic tags were found automatically. Choose tags manually before publishing.",
          changedFields: [],
        };
      }

      return updateAndReport(
        post,
        fixType,
        { tagIds },
        ["tagIds"],
        "Topic tags selected from the article title, category, excerpt, and body copy.",
      );
    }

    case "internalLinks": {
      const result = ensureBlogInternalLinks(post.content || "", {
        language: normalizeLanguage(post.language),
        title: post.title,
        excerpt: post.excerpt,
        categoryName: post.category?.name,
      });

      if (result.addedLinks.length === 0) {
        return {
          success: false,
          fixType,
          message: "The article already includes internal links or no safe internal link could be added.",
          changedFields: [],
        };
      }

      return updateAndReport(
        post,
        fixType,
        { content: result.contentHtml, readingTime: estimateReadingTime(result.contentHtml) },
        ["content", "readingTime"],
        `Internal links added: ${result.addedLinks.join(", ")}.`,
      );
    }

    default:
      return {
        success: false,
        fixType,
        message: "Unsupported blog fix type.",
        changedFields: [],
      };
  }
}
