"use client";

import BlogPost, { type BlogPostDetail } from "@/pages/BlogPost";

export default function DynamicBlogPost({ post }: { post: BlogPostDetail }) {
  return <BlogPost initialPost={post} />;
}
