import { sanitizeBlogContentHtml } from "./sanitize";
import type { BlogLanguage } from "./storage";

type BlogInternalLink = {
  href: string;
  label: string;
  keywords: string[];
};

type SelectBlogInternalLinksInput = {
  language: BlogLanguage;
  requestedLinks?: string[];
  topic?: string;
  targetKeyword?: string;
  title?: string;
  excerpt?: string | null;
  contentHtml?: string | null;
  categoryName?: string | null;
  maxLinks?: number;
};

type EnsureBlogInternalLinksInput = SelectBlogInternalLinksInput;

const INTERNAL_LINKS: Record<BlogLanguage, BlogInternalLink[]> = {
  en: [
    {
      href: "/services",
      label: "psychiatric services",
      keywords: ["service", "services", "treatment", "care", "medication", "anxiety", "depression", "psychiatric"],
    },
    {
      href: "/telepsychiatry-florida",
      label: "telepsychiatry options in Florida",
      keywords: ["telepsychiatry", "online", "virtual", "remote", "florida"],
    },
    {
      href: "/for-patients",
      label: "patient information",
      keywords: ["patient", "patients", "expect", "appointment", "new patient"],
    },
    {
      href: "/contact",
      label: "contact Healing Minds Psychiatry",
      keywords: ["contact", "schedule", "appointment", "consultation", "naples"],
    },
  ],
  es: [
    {
      href: "/es/servicios",
      label: "servicios psiquiatricos",
      keywords: ["servicio", "servicios", "tratamiento", "cuidado", "medicacion", "ansiedad", "depresion", "psiquiatrico"],
    },
    {
      href: "/es/telepsiquiatria-florida",
      label: "opciones de telepsiquiatria en Florida",
      keywords: ["telepsiquiatria", "online", "virtual", "remoto", "florida"],
    },
    {
      href: "/es/para-pacientes",
      label: "informacion para pacientes",
      keywords: ["paciente", "pacientes", "esperar", "cita", "nuevo paciente"],
    },
    {
      href: "/es/contacto",
      label: "contactar a Healing Minds Psychiatry",
      keywords: ["contacto", "programar", "cita", "consulta", "naples"],
    },
  ],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ");
}

function extractInternalHrefs(contentHtml: string | null | undefined): string[] {
  return Array.from((contentHtml || "").matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi))
    .map(match => match[2])
    .filter(href => href.startsWith("/") && !href.startsWith("//"));
}

function uniqueInternalLinks(values: string[]): string[] {
  return Array.from(new Set(values.filter(value => value.startsWith("/") && !value.startsWith("//"))));
}

export function getDefaultBlogInternalLinkHrefs(language: BlogLanguage): string[] {
  return INTERNAL_LINKS[language].map(link => link.href);
}

export function selectBlogInternalLinks(input: SelectBlogInternalLinksInput): string[] {
  const maxLinks = input.maxLinks || 3;
  const requested = uniqueInternalLinks(input.requestedLinks || []).slice(0, maxLinks);
  if (requested.length >= maxLinks) return requested;

  const existing = extractInternalHrefs(input.contentHtml);
  if (existing.length > 0) return uniqueInternalLinks([...requested, ...existing]).slice(0, maxLinks);

  const haystack = normalizeText([
    input.topic,
    input.targetKeyword,
    input.title,
    input.excerpt,
    input.categoryName,
    input.contentHtml,
  ].filter(Boolean).join(" "));

  const defaults = INTERNAL_LINKS[input.language];
  const scored = defaults
    .filter(link => !requested.includes(link.href))
    .map(link => ({
      link,
      score: link.keywords.reduce((total, keyword) => total + (haystack.includes(normalizeText(keyword).trim()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || defaults.indexOf(a.link) - defaults.indexOf(b.link));

  return uniqueInternalLinks([...requested, ...scored.map(item => item.link.href)]).slice(0, maxLinks);
}

function getLinkByHref(language: BlogLanguage, href: string): BlogInternalLink {
  return INTERNAL_LINKS[language].find(link => link.href === href) || {
    href,
    label: href.replace(/^\/(?:es\/)?/, "").replace(/-/g, " ") || "related page",
    keywords: [],
  };
}

function buildInternalLinkParagraph(language: BlogLanguage, hrefs: string[]): string {
  const links = hrefs.slice(0, 3).map(href => getLinkByHref(language, href));
  if (links.length === 0) return "";

  if (language === "es") {
    const rendered = links.map(link => `<a href="${link.href}">${link.label}</a>`).join(", ");
    return `<p>Para seguir explorando opciones de cuidado, revisa ${rendered}.</p>`;
  }

  const rendered = links.map(link => `<a href="${link.href}">${link.label}</a>`).join(", ");
  return `<p>For related care options, review ${rendered}.</p>`;
}

export function ensureBlogInternalLinks(
  contentHtml: string,
  input: EnsureBlogInternalLinksInput,
): { contentHtml: string; addedLinks: string[] } {
  if (extractInternalHrefs(contentHtml).length > 0) {
    return { contentHtml: sanitizeBlogContentHtml(contentHtml), addedLinks: [] };
  }

  const selectedLinks = selectBlogInternalLinks({ ...input, contentHtml });
  const paragraph = buildInternalLinkParagraph(input.language, selectedLinks);
  if (!paragraph) return { contentHtml: sanitizeBlogContentHtml(contentHtml), addedLinks: [] };

  return {
    contentHtml: sanitizeBlogContentHtml(`${contentHtml}\n${paragraph}`),
    addedLinks: selectedLinks,
  };
}
