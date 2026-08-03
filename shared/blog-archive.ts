export const BLOG_ARCHIVE_PAGE_SIZE = 9;

export function getBlogArchiveTotalPages(
  total: number,
  pageSize = BLOG_ARCHIVE_PAGE_SIZE,
): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
}

export function getBlogArchiveRegularLimit(
  page: number,
  pageSize = BLOG_ARCHIVE_PAGE_SIZE,
): number {
  return page === 1 ? Math.max(0, pageSize - 1) : pageSize;
}

export function getBlogArchiveRegularOffset(
  page: number,
  pageSize = BLOG_ARCHIVE_PAGE_SIZE,
): number {
  if (page <= 1) return 0;
  return Math.max(0, pageSize - 1) + ((page - 2) * pageSize);
}

export function parseBlogArchivePage(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return 1;
  const page = Number(raw);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function normalizeBlogArchiveCategory(value: unknown): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return undefined;
  const category = raw.trim().toLowerCase();
  return /^[a-z0-9-]{1,100}$/.test(category) ? category : undefined;
}

export function buildBlogArchiveHref({
  archivePath,
  page = 1,
  category,
  persistentParams,
}: {
  archivePath: string;
  page?: number;
  category?: string | null;
  persistentParams?: Record<string, string>;
}): string {
  const params = new URLSearchParams(persistentParams);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${archivePath}?${query}` : archivePath;
}
