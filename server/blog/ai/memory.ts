import { getPlainTextFromHtml } from "../sanitize";
import { getAdminBlogPosts, type BlogLanguage } from "../storage";
import type { BlogSemanticMemory, BlogSemanticMemoryMatch } from "./types";

const STOPWORDS = new Set([
  "about",
  "after",
  "and",
  "are",
  "blog",
  "care",
  "can",
  "for",
  "from",
  "guide",
  "how",
  "into",
  "naples",
  "options",
  "patients",
  "psychiatric",
  "psychiatry",
  "the",
  "this",
  "treatment",
  "what",
  "when",
  "with",
  "your",
]);

type MemoryInput = {
  topic: string;
  targetKeyword?: string;
  language: BlogLanguage;
  categoryName?: string;
  tagNames?: string[];
};

function tokenize(value: string): string[] {
  return Array.from(new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .map(token => token.trim())
      .filter(token => token.length >= 3 && !STOPWORDS.has(token)),
  ));
}
function scoreOverlap(inputTokens: string[], corpusTokens: string[]): { score: number; overlapTerms: string[] } {
  const corpus = new Set(corpusTokens);
  const overlapTerms = inputTokens.filter(token => corpus.has(token));
  const score = inputTokens.length === 0 ? 0 : overlapTerms.length / inputTokens.length;

  return {
    score: Number(score.toFixed(2)),
    overlapTerms: overlapTerms.slice(0, 12),
  };
}
function recommendationFromScore(score: number): BlogSemanticMemoryMatch["recommendation"] {
  if (score >= 0.68) return "update_existing";
  if (score >= 0.38) return "change_angle";
  return "create_new";
}

function overallRecommendation(matches: BlogSemanticMemoryMatch[]): BlogSemanticMemory["recommendation"] {
  const top = matches[0];
  if (!top) return "create_new";
  return top.recommendation;
}

export function redactBlogSemanticMemoryForProvider(
  memory: BlogSemanticMemory,
): BlogSemanticMemory {
  return {
    ...memory,
    matches: memory.matches.map(match => ({
      ...match,
      title: `Private post ${match.postId}`,
      slug: `private-post-${match.postId}`,
    })),
  };
}

export async function buildBlogSemanticMemory(input: MemoryInput): Promise<BlogSemanticMemory> {
  const inputTokens = tokenize([
    input.topic,
    input.targetKeyword,
    input.categoryName,
    ...(input.tagNames || []),
  ].filter(Boolean).join(" "));

  const posts = await getAdminBlogPosts({
    status: "all",
    language: input.language,
    limit: 100,
    offset: 0,
  });

  const matches = posts
    .map(post => {
      const corpus = [
        post.title,
        post.slug,
        post.excerpt || "",
        post.category?.name || "",
        post.tags.map(tag => tag.name).join(" "),
        getPlainTextFromHtml(post.content || "").slice(0, 2500),
      ].join(" ");
      const { score, overlapTerms } = scoreOverlap(inputTokens, tokenize(corpus));

      return {
        postId: post.id,
        title: post.title,
        slug: post.slug,
        language: post.language as BlogLanguage,
        status: post.status,
        score,
        overlapTerms,
        recommendation: recommendationFromScore(score),
      } satisfies BlogSemanticMemoryMatch;
    })
    .filter(match => match.score >= 0.22 && match.overlapTerms.length >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const recommendation = overallRecommendation(matches);
  const riskNotes: string[] = [];

  if (recommendation === "update_existing") {
    riskNotes.push("High topic overlap detected; consider updating the existing post instead of creating a new article.");
  } else if (recommendation === "change_angle") {
    riskNotes.push("Similar content exists; generate with a clearly different angle to avoid SEO cannibalization.");
  }

  return {
    topic: input.topic,
    targetKeyword: input.targetKeyword,
    language: input.language,
    matches,
    recommendation,
    riskNotes,
  };
}
