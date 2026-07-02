import type { BlogLanguage, BlogPostWithRelations } from "./storage";
import { getPlainTextFromHtml } from "./sanitize";

export type CuratedFeaturedImage = {
  id: string;
  label: string;
  url: string;
  alt: Record<BlogLanguage, string>;
  keywords: string[];
};

const CURATED_FEATURED_IMAGES: CuratedFeaturedImage[] = [
  {
    id: "anxiety",
    label: "Anxiety treatment",
    url: "/images/blog/approved/anxiety-treatment.webp",
    alt: {
      en: "Calm therapeutic setting representing anxiety treatment support",
      es: "Entorno terapeutico tranquilo que representa apoyo para el tratamiento de ansiedad",
    },
    keywords: ["anxiety", "anxious", "panic", "worry", "ansiedad", "panico", "preocupacion"],
  },
  {
    id: "depression",
    label: "Depression treatment",
    url: "/images/blog/approved/depression-treatment.webp",
    alt: {
      en: "Hopeful wellness setting representing depression treatment and emotional support",
      es: "Entorno de bienestar esperanzador que representa tratamiento de depresion y apoyo emocional",
    },
    keywords: ["depression", "depressive", "mood", "sadness", "depresion", "estado de animo", "tristeza"],
  },
  {
    id: "adhd",
    label: "ADHD evaluation",
    url: "/images/blog/approved/adhd-treatment.webp",
    alt: {
      en: "Focused workspace representing ADHD evaluation and treatment planning",
      es: "Espacio de trabajo enfocado que representa evaluacion de ADHD y planificacion de tratamiento",
    },
    keywords: ["adhd", "attention", "focus", "concentration", "hiperactividad", "atencion", "concentracion"],
  },
  {
    id: "ptsd",
    label: "PTSD care",
    url: "/images/blog/approved/ptsd-treatment.webp",
    alt: {
      en: "Supportive therapy environment representing trauma-informed PTSD care",
      es: "Entorno terapeutico de apoyo que representa atencion para PTSD informada por trauma",
    },
    keywords: ["ptsd", "trauma", "traumatic", "flashback", "tept", "estres postraumatico"],
  },
  {
    id: "bipolar",
    label: "Bipolar treatment",
    url: "/images/blog/approved/bipolar-treatment.webp",
    alt: {
      en: "Balanced wellness scene representing bipolar disorder treatment support",
      es: "Escena de bienestar equilibrada que representa apoyo para el tratamiento del trastorno bipolar",
    },
    keywords: ["bipolar", "mania", "manic", "mood swing", "bipolaridad", "maniaco"],
  },
  {
    id: "medication",
    label: "Medication management",
    url: "/images/blog/approved/medication-management.webp",
    alt: {
      en: "Clinical medication management workspace with assessment tools",
      es: "Espacio clinico de manejo de medicamentos con herramientas de evaluacion",
    },
    keywords: ["medication", "medicine", "prescription", "psychiatric medication", "medicamento", "medicacion", "receta"],
  },
  {
    id: "telepsychiatry",
    label: "Telepsychiatry",
    url: "/images/blog/approved/telepsychiatry.webp",
    alt: {
      en: "Private telepsychiatry access from home for Florida patients",
      es: "Acceso privado a telepsiquiatria desde casa para pacientes en Florida",
    },
    keywords: ["telepsychiatry", "telehealth", "online", "virtual", "florida", "telepsiquiatria", "telesalud", "virtual"],
  },
  {
    id: "office",
    label: "Psychiatry office",
    url: "/images/blog/approved/psychiatry-office.webp",
    alt: {
      en: "Professional psychiatry office setting at Healing Minds Psychiatry",
      es: "Entorno profesional de oficina psiquiatrica en Healing Minds Psychiatry",
    },
    keywords: ["psychiatry", "psychiatrist", "evaluation", "naples", "care", "psiquiatria", "psiquiatra", "evaluacion"],
  },
];

function normalizeLanguage(language: string): BlogLanguage {
  return language === "es" ? "es" : "en";
}

function normalizeForImageScoring(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function scoreImage(image: CuratedFeaturedImage, text: string): number {
  const baseScore = text.includes(image.id) ? 5 : 0;
  return image.keywords.reduce((score, keyword) => {
    const needle = normalizeForImageScoring(keyword);
    if (!needle) return score;
    return text.includes(needle) ? score + (needle.includes(" ") ? 3 : 2) : score;
  }, baseScore);
}

export function selectCuratedFeaturedImage(input: {
  language: BlogLanguage | string;
  title?: string | null;
  topic?: string | null;
  targetKeyword?: string | null;
  excerpt?: string | null;
  contentHtml?: string | null;
  categoryName?: string | null;
  tagNames?: string[];
}): CuratedFeaturedImage {
  const text = [
    input.title,
    input.topic,
    input.targetKeyword,
    input.excerpt,
    input.categoryName,
    ...(input.tagNames || []),
    getPlainTextFromHtml(input.contentHtml || ""),
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const ranked = CURATED_FEATURED_IMAGES
    .map(image => ({ image, score: scoreImage(image, text) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].image : CURATED_FEATURED_IMAGES[CURATED_FEATURED_IMAGES.length - 1];
}

export function getCuratedFeaturedImageAlt(image: CuratedFeaturedImage, language: BlogLanguage | string): string {
  return image.alt[normalizeLanguage(language)];
}

export function selectCuratedFeaturedImageForPost(post: BlogPostWithRelations): CuratedFeaturedImage {
  return selectCuratedFeaturedImage({
    language: post.language,
    title: post.title,
    excerpt: post.excerpt,
    contentHtml: post.content,
    categoryName: post.category?.name,
    tagNames: post.tags.map(tag => tag.name),
  });
}
