// Serializes shared page-content modules (client/src/data/pageContent/*) into
// plain semantic HTML for the crawler bodies injected by html-injection.ts.
// Mirrors the inline-markup rules of client/src/components/RichText.tsx:
//   **bold text**        -> <strong>
//   [label](href)        -> <a href>

import type { ContentSection, PageContent } from '@/data/pageContent/types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Converts a rich-text string to escaped inline HTML. */
export function inlineToHtml(text: string): string {
  return text
    .split(TOKEN_RE)
    .map(part => {
      if (!part) return '';
      if (part.startsWith('**') && part.endsWith('**')) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
      }
      return escapeHtml(part);
    })
    .join('');
}

/** Serializes one content section to HTML. */
export function sectionToHtml(section: ContentSection): string {
  const parts: string[] = [];
  if (section.heading) {
    const tag = section.level === 3 ? 'h3' : 'h2';
    parts.push(`<${tag}>${inlineToHtml(section.heading)}</${tag}>`);
  }
  for (const p of section.paragraphs ?? []) {
    parts.push(`<p>${inlineToHtml(p)}</p>`);
  }
  if (section.bullets?.length) {
    parts.push(`<ul>\n      ${section.bullets.map(b => `<li>${inlineToHtml(b)}</li>`).join('\n      ')}\n    </ul>`);
  }
  if (section.ordered?.length) {
    parts.push(`<ol>\n      ${section.ordered.map(o => `<li>${inlineToHtml(o)}</li>`).join('\n      ')}\n    </ol>`);
  }
  return parts.join('\n    ');
}

/** Serializes a full page-content object (H1 + all sections) to HTML. */
export function pageContentToHtml(content: PageContent): string {
  const sections = content.sections
    .map(s => `  <section>\n    ${sectionToHtml(s)}\n  </section>`)
    .join('\n');
  return `<h1>${inlineToHtml(content.title)}</h1>\n${sections}`;
}
