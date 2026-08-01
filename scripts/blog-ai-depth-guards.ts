import assert from "node:assert/strict";
import { generateBlogDraftWithAi } from "../server/blog/ai/generator";
import { countBlogDraftWords } from "../server/blog/ai/validation";
import type { BlogAiGenerateInput, BlogAiGeneratedDraft } from "../server/blog/ai/types";

const originalFetch = globalThis.fetch;
const originalEnabled = process.env.BLOG_AI_ENABLED;
const originalApiKey = process.env.OPENAI_API_KEY;

process.env.BLOG_AI_ENABLED = "true";
process.env.OPENAI_API_KEY = "fixture-key-not-a-real-secret";

const privateEditorialContext = "private notes about Jane Doe and Maria Garcia";
const trustedPlannerAngle = "Differentiate everyday coping from the point when evaluation may help.";

const input: BlogAiGenerateInput = {
  topic: "Understanding anxiety symptoms and everyday worry",
  targetKeyword: "anxiety symptoms",
  additionalContext: privateEditorialContext,
  providerEditorialContext: trustedPlannerAngle,
  language: "en",
  categoryName: "Anxiety",
  tagNames: ["Anxiety treatment"],
  internalLinks: ["/services", "/telepsychiatry-florida"],
  researchSources: [
    {
      id: "nimh-anxiety",
      title: "Anxiety Disorders",
      publisher: "National Institute of Mental Health",
      domain: "nimh.nih.gov",
      url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
      sourceCategory: "institutional",
      summary: "General educational information about anxiety disorders.",
      topics: ["anxiety"],
      confidence: "high",
      accessedAt: "2026-07-30",
    },
  ],
  editorialBrief: {
    targetWordCount: 1_100,
    minimumWordCount: 800,
    maximumWordCount: 1_375,
    searchIntent: "Educational",
    audience: "Adults considering psychiatric care in Florida",
    requiredSections: [
      "How anxiety symptoms can affect daily life",
      "What patients can expect",
      "When psychiatric care may help",
      "Questions to discuss with a clinician",
      "Sources",
    ],
    requiredInternalLinks: ["/services"],
    sourceRequirement: "Use curated institutional sources only.",
    riskNotes: ["Human clinical review remains required."],
  },
};

function buildContent(minimumWords: number): string {
  const headings = input.editorialBrief?.requiredSections || [];
  const bodyWords = Array.from(
    { length: minimumWords },
    (_, index) => `educational${index + 1}`,
  ).join(" ");
  const sections = headings
    .map((heading, index) => (
      `<h2>${heading}</h2><p>${index === 0 ? bodyWords : "Clear patient friendly context for clinician discussion."}</p>`
    ))
    .join("");

  return `<p>Calm educational introduction for adults considering <a href="/services">psychiatric services</a>.</p>${sections}<p>Review the <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders">NIMH anxiety overview</a>. This article is for informational purposes only and is not a substitute for professional medical advice. In an emergency, call 911.</p>`;
}

function buildDraft(minimumWords: number): BlogAiGeneratedDraft {
  return {
    title: "Understanding Anxiety Symptoms and Everyday Worry",
    slug: "understanding-anxiety-symptoms-everyday-worry",
    excerpt: "Learn how persistent anxiety symptoms can differ from everyday worry and what to discuss with a clinician.",
    contentHtml: buildContent(minimumWords),
    metaTitle: "Anxiety Symptoms and Everyday Worry",
    metaDescription: "Learn how anxiety symptoms can affect daily life and what adults can discuss with a psychiatric clinician.",
    featuredImageAlt: "Adult reflecting in a calm sunlit setting",
    riskNotes: ["Human clinical review remains required."],
  };
}

function providerResponse(draft: BlogAiGeneratedDraft): Response {
  return new Response(JSON.stringify({
    choices: [
      {
        finish_reason: "stop",
        message: { content: JSON.stringify(draft) },
      },
    ],
  }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

async function checkShortDraftExpansion(): Promise<void> {
  const prompts: string[] = [];
  const responses = [providerResponse(buildDraft(500)), providerResponse(buildDraft(850))];
  globalThis.fetch = (async (_url, init) => {
    const request = JSON.parse(String(init?.body)) as {
      messages: Array<{ role: string; content: string }>;
    };
    prompts.push(request.messages.find(message => message.role === "user")?.content || "");
    const response = responses.shift();
    assert.ok(response, "Unexpected provider call");
    return response;
  }) as typeof fetch;

  const draft = await generateBlogDraftWithAi(input);
  assert.equal(prompts.length, 2, "A short draft should trigger exactly one expansion call");
  assert.ok(countBlogDraftWords(draft.contentHtml) >= 800);
  assert.match(prompts[0], /must contain at least 800 words/i);
  assert.match(prompts[1], /current article body has \d+ words/i);
  assert.match(prompts[1], /do not introduce new sources, URLs, studies, statistics/i);
  assert.match(prompts[1], /https:\/\/www\.nimh\.nih\.gov\/health\/topics\/anxiety-disorders/);
  assert.equal(prompts.every(prompt => !prompt.includes(privateEditorialContext)), true);
  assert.equal(prompts[0].includes(trustedPlannerAngle), true);
  assert.doesNotMatch(draft.riskNotes.join("\n"), /below the editorial brief minimum/i);
}

async function checkSufficientDraftSkipsExpansion(): Promise<void> {
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return providerResponse(buildDraft(850));
  }) as typeof fetch;

  const draft = await generateBlogDraftWithAi(input);
  assert.equal(calls, 1, "A sufficient first draft must not make a paid second call");
  assert.ok(countBlogDraftWords(draft.contentHtml) >= 800);
}

async function checkFailedExpansionKeepsSafeDraft(): Promise<void> {
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    if (calls === 1) return providerResponse(buildDraft(500));
    return new Response("provider unavailable", { status: 500 });
  }) as typeof fetch;

  const draft = await generateBlogDraftWithAi(input);
  assert.equal(calls, 2);
  assert.ok(countBlogDraftWords(draft.contentHtml) < 800);
  assert.match(draft.riskNotes.join("\n"), /Automatic depth expansion could not be completed safely/i);
  assert.match(draft.riskNotes.join("\n"), /Expand during human review/i);
}

async function checkExpansionCannotDropValidatedLinks(): Promise<void> {
  let calls = 0;
  const expandedWithoutLinks = buildDraft(850);
  expandedWithoutLinks.contentHtml = expandedWithoutLinks.contentHtml
    .replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");
  globalThis.fetch = (async () => {
    calls += 1;
    return calls === 1
      ? providerResponse(buildDraft(500))
      : providerResponse(expandedWithoutLinks);
  }) as typeof fetch;

  const draft = await generateBlogDraftWithAi(input);
  assert.equal(calls, 2);
  assert.ok(countBlogDraftWords(draft.contentHtml) < 800);
  assert.match(draft.contentHtml, /href="\/services"/);
  assert.match(draft.contentHtml, /href="https:\/\/www\.nimh\.nih\.gov\/health\/topics\/anxiety-disorders"/);
  assert.match(draft.riskNotes.join("\n"), /Automatic depth expansion could not be completed safely/i);
}

try {
  await checkShortDraftExpansion();
  await checkSufficientDraftSkipsExpansion();
  await checkFailedExpansionKeepsSafeDraft();
  await checkExpansionCannotDropValidatedLinks();
  console.log("PASS blog AI depth expansion guards (one retry, no real provider or secrets)");
} finally {
  globalThis.fetch = originalFetch;
  if (originalEnabled === undefined) delete process.env.BLOG_AI_ENABLED;
  else process.env.BLOG_AI_ENABLED = originalEnabled;
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
}
