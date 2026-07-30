import type { BlogPostImageRole } from "@shared/schema";
import type { BlogPostWithRelations } from "../storage";
import { getPlainTextFromHtml } from "../sanitize";

export const BLOG_IMAGE_PROMPT_VERSION = "healing-minds-v2";

type VisualTheme = {
  key: string;
  label: string;
  pattern: RegExp;
  scenes: readonly string[];
};

const VISUAL_THEMES: readonly VisualTheme[] = [
  {
    key: "telehealth",
    label: "private telehealth access",
    pattern: /\btelehealth\b|\btelepsychiatry\b|\bvirtual care\b|\btelesalud\b|\btelepsiquiatr/i,
    scenes: [
      "A fictional adult woman seated comfortably in a modern white lounge chair during a private video appointment, laptop on her lap, shown in calm three-quarter profile; the screen is abstract and unreadable.",
      "A fictional adult preparing for a private video appointment at a small side table, naturally adjusting headphones beside an open laptop in a bright, quiet room.",
      "An over-the-shoulder view of a fictional adult using a tablet for a private video appointment in an airy neutral setting; the interface is abstract and unreadable.",
      "A fictional adult seated on a simple sofa using a laptop for a private video conversation, relaxed natural posture, with a clean pale background and ample breathing room.",
    ],
  },
  {
    key: "medication",
    label: "medication follow-up education",
    pattern: /\bmedicat(?:ion|ions)\b|\bprescrib|\bmedicine\b|\bmedicaci[oó]n|\bf[aá]rmaco/i,
    scenes: [
      "Two fictional adults having a collaborative care conversation in a bright, non-clinical office, reviewing a blank care-plan page with no readable writing and no medication products.",
      "A close editorial view of a fictional adult setting a private reminder on a phone beside a blank notebook; the screen and page contain no readable text, and no pills are visible.",
      "A fictional adult calmly reviewing a blank personal care notebook at a light kitchen counter, with a glass of water and soft daylight; no pills, packaging, or labels.",
    ],
  },
  {
    key: "attention",
    label: "attention and focus education",
    pattern: /\badhd\b|\btdah\b|\battention\b|\batenci[oó]n\b|\bfocus\b|\bconcentr/i,
    scenes: [
      "A fictional adult standing at a light kitchen island, organizing a few blank planning cards and a notebook into a simple sequence, captured as a natural everyday action.",
      "A fictional adult reviewing a tablet while standing in a bright, uncluttered room, engaged and focused without posing for the camera.",
      "A close editorial view of natural hands organizing everyday objects into a shallow tray beside a blank notebook, with realistic texture and no readable text.",
      "A fictional adult taking a purposeful walk through a bright covered walkway, carrying a closed notebook, with gentle movement and a clear sense of direction.",
    ],
  },
  {
    key: "anxiety",
    label: "anxiety education",
    pattern: /\banxi(?:ety|ous)\b|\bansiedad\b/i,
    scenes: [
      "A fictional adult taking a quiet walk along a sunlit garden path, naturally looking ahead rather than at the camera.",
      "A fictional adult seated near a pale wall during a brief grounding pause, hands relaxed and posture comfortable, with generous negative space.",
      "Two fictional adults in a calm, supportive conversation in a bright non-clinical room, natural posture and respectful personal space.",
      "A fictional adult tending a small indoor plant in soft morning light, an ordinary attentive moment with no staged wellness props.",
    ],
  },
  {
    key: "depression",
    label: "depression education",
    pattern: /\bdepress(?:ion|ive)\b|\bdepresi[oó]n\b/i,
    scenes: [
      "A fictional adult opening light curtains at the start of an ordinary morning, shown from the side in a bright, calm room without dramatized emotion.",
      "Two fictional adults walking together on a quiet green path in soft daylight, captured candidly from a respectful distance.",
      "A fictional adult preparing a simple breakfast in a light kitchen, focused on the everyday action with a natural, neutral expression.",
    ],
  },
  {
    key: "mood",
    label: "mood stability education",
    pattern: /\bbipolar\b|\bmood\b|\bestado de [aá]nimo\b/i,
    scenes: [
      "Two fictional adults having a measured collaborative conversation in a bright, comfortable office, both seated naturally with no clinical props.",
      "A fictional adult following a calm everyday routine in a light-filled living space, placing a closed journal on a shelf with natural movement.",
      "A fictional adult walking beside calm water in soft morning light, photographed candidly with an even, grounded mood.",
    ],
  },
  {
    key: "trauma",
    label: "trauma-informed wellbeing education",
    pattern: /\bptsd\b|\btrauma\b|\btea?pt\b/i,
    scenes: [
      "A fictional adult walking through a quiet botanical setting in soft daylight, grounded posture and no visible distress.",
      "A fictional adult sitting comfortably in a bright room with both feet grounded, hands resting naturally, photographed from a respectful side angle.",
      "A close environmental portrait of a fictional adult holding a warm ceramic cup near a bright neutral wall, calm and unposed without implying a treatment result.",
    ],
  },
  {
    key: "sleep",
    label: "healthy sleep education",
    pattern: /\bsleep\b|\binsomnia\b|\bsue[nñ]o\b|\binsomnio\b/i,
    scenes: [
      "A fictional adult dimming a warm bedside lamp during a simple evening routine, shown from the side with no staged sleeping pose.",
      "A serene bedroom in pale neutrals at early evening, linen textures and soft indirect light, with no person and no medical devices.",
      "A fictional adult reading a plain, unbranded book in a softly lit chair during an evening wind-down routine; the cover has no text.",
    ],
  },
  {
    key: "stress",
    label: "stress management education",
    pattern: /\bstress\b|\bestr[eé]s\b|\bburnout\b|\bagotamiento\b/i,
    scenes: [
      "A fictional adult taking a relaxed walk beside subtropical greenery in soft daylight, candid and naturally paced.",
      "A fictional adult doing a gentle shoulder stretch on a bright covered patio, comfortable everyday clothing and natural posture.",
      "A close editorial view of a fictional adult caring for a small plant at a light counter, realistic hands and quiet concentration.",
    ],
  },
  {
    key: "florida-access",
    label: "Florida mental health access education",
    pattern: /\bflorida\b|\bnaples\b|\bsouthwest florida\b|\bsuroeste de florida\b/i,
    scenes: [
      "A bright subtropical Florida walkway with one fictional adult moving through the frame, soft greenery and clean contemporary architecture.",
      "A wide coastal Florida park path in gentle morning light with two fictional adults walking in the middle distance, natural and unposed.",
      "A clean, welcoming non-clinical office entrance with subtropical plants and soft daylight, photographed as an environmental editorial scene.",
    ],
  },
  {
    key: "wellbeing",
    label: "mental wellbeing education",
    pattern: /\bwellness\b|\bwellbeing\b|\bmental health\b|\bbienestar\b|\bsalud mental\b/i,
    scenes: [
      "Two fictional adults in a calm, attentive conversation in a bright modern room, photographed candidly with respectful personal space.",
      "A fictional adult walking through a sunlit green space, relaxed natural posture and an open composition.",
      "A fictional adult pausing with a blank notebook in a bright lounge area, captured mid-action rather than posing for the camera.",
      "A close editorial view of hands arranging a simple ceramic cup, blank notebook, and small plant on a light surface, with no desk or window as the dominant subject.",
    ],
  },
] as const;

const FALLBACK_THEME: VisualTheme = {
  key: "general",
  label: "general mental health education",
  pattern: /$^/,
  scenes: [
    "Two fictional adults in a calm, attentive conversation in a bright modern room, photographed candidly with respectful personal space.",
    "A fictional adult walking through a sunlit green space, relaxed natural posture and an open composition.",
    "A fictional adult using a tablet in a quiet pale interior, shown in profile with natural posture and no readable screen.",
    "A clean, welcoming non-clinical room with one fictional adult entering the frame, soft daylight and restrained materials.",
  ],
};

const HERO_COMPOSITIONS = [
  "Medium-wide eye-level frame with the main subject on the right third and generous clean negative space on the left.",
  "Natural three-quarter side view with the subject on the left third and an airy pale background extending to the right.",
  "Wide environmental portrait with a clear foreground action, subtle depth, and balanced negative space.",
  "Over-the-shoulder editorial viewpoint with the human action clear and the surrounding room kept simple.",
] as const;

const INLINE_COMPOSITIONS = [
  "Closer action-focused frame that complements, rather than repeats, a wide hero image.",
  "Medium side-angle frame centered on the subject's hands, posture, or interaction while keeping anatomy natural.",
  "Wide contextual frame with the person smaller in the environment and a distinct viewpoint from a typical desk scene.",
  "Over-the-shoulder detail with shallow depth of field and an uncluttered background.",
] as const;

function compact(value: string | null | undefined, maxLength: number): string {
  return (value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function stableIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function findThemes(value: string | null | undefined): VisualTheme[] {
  if (!value) return [];
  return VISUAL_THEMES.filter(theme => theme.pattern.test(value));
}

function getApprovedVisualThemes(
  post: BlogPostWithRelations,
  anchorHeading?: string | null,
): VisualTheme[] {
  const orderedSources = [
    anchorHeading,
    post.title,
    post.category?.name,
    post.excerpt,
    getPlainTextFromHtml(post.content || ""),
  ];
  const selected: VisualTheme[] = [];
  for (const source of orderedSources) {
    for (const theme of findThemes(source)) {
      if (!selected.some(item => item.key === theme.key)) selected.push(theme);
      if (selected.length === 2) return selected;
    }
  }
  return selected.length > 0 ? selected : [FALLBACK_THEME];
}

export function buildSafeVisualBrief(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
  slot: string = role,
): string {
  const language = post.language === "es" ? "Spanish-language" : "English-language";
  const themes = getApprovedVisualThemes(post, anchorHeading);
  const primaryTheme = themes[0];
  const seed = [
    post.id,
    post.translationGroupId,
    role,
    slot,
    anchorHeading || "",
    primaryTheme.key,
  ].join("|");
  const scene = primaryTheme.scenes[stableIndex(seed, primaryTheme.scenes.length)];
  const compositions = role === "hero" ? HERO_COMPOSITIONS : INLINE_COMPOSITIONS;
  const composition = compositions[stableIndex(`${seed}|composition`, compositions.length)];
  const approvedTopics = themes.map(theme => theme.label).join(" and ");

  return [
    `PURPOSE: ${role === "hero" ? "Editorial hero" : "Editorial inline"} image for a ${language} educational mental health article.`,
    `APPROVED THEME: ${approvedTopics}.`,
    `SCENE: ${scene}`,
    "PEOPLE: When people appear, use fictional adult models only. Vary age, skin tone, body type, and cultural background across the image library to reflect South Florida. Keep expressions natural, calm, and engaged. Do not imitate Dr. Melva Reve, any real clinician, celebrity, or identifiable patient.",
    `COMPOSITION: ${composition}`,
    "ART DIRECTION: Photorealistic candid editorial healthcare photography. Bright cream, soft sage, pale blue, and warm-neutral palette. Clean light background, soft diffused daylight, subtle realistic shadows, authentic skin and fabric texture, gentle contrast, and no heavy retouching. Premium and modern without looking staged or like generic stock photography.",
    "SAFETY: Educational atmosphere only. No crisis, self-harm, violence, visible distress, restraint, hospitalization, before-and-after transformation, diagnosis, treatment outcome, cure, testimonial, or guaranteed result.",
    "EXCLUSIONS: No pills, medication packaging, prescriptions, branded medical devices, stethoscopes, readable screens, readable records, labels, charts, logos, watermarks, brand marks, or decorative text.",
  ].join("\n");
}

export function buildBlogImagePrompt(safeVisualBrief: string): string {
  return [
    safeVisualBrief,
    "OUTPUT: One horizontal 3:2 photograph for a responsive psychiatry practice blog. Keep all important people, hands, and devices safely inside the crop. Natural anatomy, anatomically coherent hands with five fingers when fully visible, coherent objects, no duplicated limbs or equipment.",
  ].join("\n");
}

export function buildBlogImageAlt(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
): string {
  const subject = compact(anchorHeading || post.title, 170);
  return post.language === "es"
    ? `Fotografía editorial serena para ${subject}${role === "hero" ? "" : " en el artículo"}`
    : `Calm editorial photograph for ${subject}${role === "hero" ? "" : " in the article"}`;
}

export function buildBlogImageCaption(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
): string | null {
  if (role === "hero") return null;
  const subject = compact(anchorHeading || post.title, 220);
  return post.language === "es"
    ? `Fotografía editorial educativa: ${subject}.`
    : `Educational editorial photograph: ${subject}.`;
}
