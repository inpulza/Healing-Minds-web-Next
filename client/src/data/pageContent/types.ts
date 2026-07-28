// Shared page-content types used by BOTH the React pages and the
// server-side bot-body generator (server/utils/html-injection.ts).
// Modules under client/src/data/pageContent/ must stay pure TypeScript:
// no JSX, no React imports, no @assets imports — the server bundles them.
//
// Rich-text strings support two inline markers only:
//   **bold text**        -> <strong>
//   [label](https://...) -> <a href>  (also tel: / mailto: / internal paths)

export type Lang = 'en' | 'es';

export interface ContentSection {
  /** Optional stable key so components can pick out a section by name. */
  key?: string;
  /** Section heading text (no markup). */
  heading?: string;
  /** Heading level: 2 (default) or 3. */
  level?: 2 | 3;
  /** Rich-text paragraphs, in order. */
  paragraphs?: string[];
  /** Unordered list items (rich text). */
  bullets?: string[];
  /** Ordered list items (rich text). */
  ordered?: string[];
}

export interface PageContent {
  /** The page H1 (must match the visible H1 exactly). */
  title: string;
  /** All body sections in visible order. Together with `title` this must
   *  cover essentially all user-visible text of the page (excluding the
   *  shared Header/Footer chrome). */
  sections: ContentSection[];
}

export type Bilingual<T> = { en: T; es: T };
export type BilingualPageContent = Bilingual<PageContent>;
