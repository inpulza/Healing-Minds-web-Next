"use client";

import BlogIndex, {
  type BlogLanguage,
  type BlogPostListItem,
} from "@/pages/BlogIndex";

export default function DynamicBlogIndex({
  language,
  initialPosts,
}: {
  language: BlogLanguage;
  initialPosts: BlogPostListItem[];
}) {
  return <BlogIndex language={language} initialPosts={initialPosts} />;
}
