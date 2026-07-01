import type { BlogAiGenerateInput, BlogResearchBrief, BlogResearchConfidence, BlogResearchSource } from "./types";

type CuratedSource = Omit<BlogResearchSource, "accessedAt"> & {
  keywords: string[];
};

const TRUSTED_SOURCES: CuratedSource[] = [
  {
    id: "nimh-anxiety-disorders",
    title: "Anxiety Disorders",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    sourceCategory: "institutional",
    summary: "NIMH overview of anxiety disorders, signs, symptoms, research, treatment and therapy resources.",
    topics: ["anxiety", "panic", "worry", "phobia", "social anxiety", "generalized anxiety"],
    keywords: ["anxiety", "panic", "worry", "phobia", "fear", "gad", "social anxiety"],
    confidence: "high",
  },
  {
    id: "nimh-depression",
    title: "Depression",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/depression",
    sourceCategory: "institutional",
    summary: "NIMH overview of depression, symptoms, types, treatment and therapy resources.",
    topics: ["depression", "mood", "sadness", "major depression"],
    keywords: ["depression", "depressed", "mood", "sadness", "major depressive"],
    confidence: "high",
  },
  {
    id: "nimh-adhd",
    title: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd",
    sourceCategory: "institutional",
    summary: "NIMH overview of ADHD, including signs, symptoms, treatment resources and research.",
    topics: ["adhd", "attention", "focus", "hyperactivity", "impulsivity"],
    keywords: ["adhd", "inattention", "hyperactivity", "impulsive", "impulsivity"],
    confidence: "high",
  },
  {
    id: "nimh-medications",
    title: "Mental Health Medications",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/mental-health-medications",
    sourceCategory: "clinical",
    summary: "NIMH patient-facing overview of medication classes and questions patients should discuss with clinicians.",
    topics: ["medication", "psychiatry", "antidepressants", "anti-anxiety medication", "stimulants", "mood stabilizers"],
    keywords: ["medication", "medications", "psychiatric", "psychiatry", "antidepressant", "stimulant", "mood stabilizer", "anti-anxiety"],
    confidence: "high",
  },
  {
    id: "nimh-bipolar-disorder",
    title: "Bipolar Disorder",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/bipolar-disorder",
    sourceCategory: "institutional",
    summary: "NIMH overview of bipolar disorder, symptoms, treatment resources, research and crisis guidance.",
    topics: ["bipolar disorder", "mania", "mood episodes", "mood stabilizers"],
    keywords: ["bipolar", "mania", "manic", "mood episode", "mood episodes"],
    confidence: "high",
  },
  {
    id: "nimh-ptsd",
    title: "Traumatic Events and Post-Traumatic Stress Disorder (PTSD)",
    publisher: "National Institute of Mental Health",
    domain: "nimh.nih.gov",
    url: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
    sourceCategory: "institutional",
    summary: "NIMH overview of PTSD, trauma responses, symptoms, treatment resources and research.",
    topics: ["ptsd", "trauma", "post-traumatic stress"],
    keywords: ["ptsd", "trauma", "traumatic", "post-traumatic", "post traumatic"],
    confidence: "high",
  },
  {
    id: "988-lifeline",
    title: "988 Suicide & Crisis Lifeline",
    publisher: "988 Lifeline",
    domain: "988lifeline.org",
    url: "https://988lifeline.org/",
    sourceCategory: "crisis",
    summary: "Official 988 resource for people in suicidal crisis, emotional distress, or urgent mental health need.",
    topics: ["crisis", "suicide", "emergency", "988", "safety"],
    keywords: ["crisis", "suicide", "suicidal", "emergency", "988", "self-harm", "self harm"],
    confidence: "high",
  },
];

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreSource(source: CuratedSource, haystack: string): number {
  return source.keywords.reduce((score, keyword) => (
    haystack.includes(normalize(keyword)) ? score + 1 : score
  ), 0);
}

function confidenceFromMatches(matchCount: number, bestScore: number): BlogResearchConfidence {
  if (matchCount >= 2 && bestScore >= 2) return "high";
  if (matchCount >= 1) return "medium";
  return "low";
}

function buildQueries(input: BlogAiGenerateInput): string[] {
  const topic = input.targetKeyword || input.topic;
  return [
    `site:nimh.nih.gov ${topic}`,
    `site:988lifeline.org ${topic}`,
  ];
}

export function selectBlogResearchSources(input: BlogAiGenerateInput): BlogResearchBrief {
  const accessedAt = todayIsoDate();
  const haystack = normalize([
    input.topic,
    input.targetKeyword,
    input.additionalContext,
    input.categoryName,
    ...(input.tagNames || []),
  ].filter(Boolean).join(" "));

  const ranked = TRUSTED_SOURCES
    .map(source => ({ source, score: scoreSource(source, haystack) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const sourceIds = new Set<string>();
  const selected: CuratedSource[] = [];

  for (const item of ranked) {
    if (selected.length >= 3) break;
    selected.push(item.source);
    sourceIds.add(item.source.id);
  }

  const shouldIncludeMedication = /\b(?:medication|medications|psychiatric|psychiatry|management|treatment)\b/i.test(haystack);
  if (shouldIncludeMedication && !sourceIds.has("nimh-medications")) {
    selected.push(TRUSTED_SOURCES.find(source => source.id === "nimh-medications")!);
    sourceIds.add("nimh-medications");
  }

  if (!sourceIds.has("988-lifeline")) {
    selected.push(TRUSTED_SOURCES.find(source => source.id === "988-lifeline")!);
  }

  const limited = selected.slice(0, 4).map(source => ({
    ...source,
    accessedAt,
  }));
  const confidence = confidenceFromMatches(ranked.length, ranked[0]?.score || 0);
  const riskNotes = [
    "Use these sources as educational references, not as a substitute for clinical review.",
    "Do not add studies, statistics, or URLs beyond the verified source list.",
  ];

  if (confidence === "low") {
    riskNotes.unshift("No topic-specific source match was found; keep the article broad and conservative.");
  }

  return {
    topic: input.topic,
    language: input.language,
    accessedAt,
    queries: buildQueries(input),
    sources: limited,
    confidence,
    riskNotes,
  };
}

export function formatResearchSourcesForPrompt(sources: BlogResearchSource[]): string {
  if (sources.length === 0) return "- No verified sources selected.";

  return sources.map(source => (
    `- ${source.title} (${source.publisher}, ${source.domain}, accessed ${source.accessedAt}): ${source.url}\n  Summary: ${source.summary}`
  )).join("\n");
}

export function extractAllowedSourceUrls(sources: BlogResearchSource[]): string[] {
  return sources.map(source => source.url);
}
