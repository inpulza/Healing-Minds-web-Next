import type { ReactNode } from 'react';

// Renders a shared-content rich-text string (see client/src/data/pageContent/types.ts).
// Supported inline markers:
//   **bold text**        -> <strong>
//   [label](href)        -> <a href> (external http(s) links open in a new tab)
// Everything else is rendered as plain text.

interface RichTextProps {
  text: string;
  /** className applied to <a> elements (pages keep their existing link styles). */
  linkClassName?: string;
  /** className applied to <strong> elements when a page styles bold runs. */
  strongClassName?: string;
}

const TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function renderRichText(
  text: string,
  linkClassName?: string,
  strongClassName?: string,
): ReactNode {
  const parts = text.split(TOKEN_RE);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className={strongClassName}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          key={i}
          href={href}
          className={linkClassName}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

const RichText = ({ text, linkClassName, strongClassName }: RichTextProps) =>
  renderRichText(text, linkClassName, strongClassName);

export default RichText;
