"use client";

import BlogIndex, {
  type BlogArchivePage,
  type BlogLanguage,
} from "@/pages/BlogIndex";

export default function DynamicBlogIndex({
  language,
  initialArchive,
  archivePath,
  persistentParams,
}: {
  language: BlogLanguage;
  initialArchive: BlogArchivePage;
  archivePath?: string;
  persistentParams?: Record<string, string>;
}) {
  return (
    <BlogIndex
      language={language}
      initialArchive={initialArchive}
      archivePath={archivePath}
      persistentParams={persistentParams}
    />
  );
}
