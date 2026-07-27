export const BLOG_IMAGE_PUBLIC_PREFIX = "/public-objects/";

const BLOG_IMAGE_KEY_PATTERN = /^blog-images\/posts\/post-\d+-(?:hero|inline-\d+)-\d+-[a-f0-9]{12}\.webp$/;

export function isManagedBlogImageKey(value: string): boolean {
  return BLOG_IMAGE_KEY_PATTERN.test(value);
}

export function getManagedBlogImagePublicUrl(objectKey: string): string {
  if (!isManagedBlogImageKey(objectKey)) {
    throw new Error("Invalid blog image object key");
  }
  return `${BLOG_IMAGE_PUBLIC_PREFIX}${objectKey}`;
}

export function isManagedBlogImagePublicUrl(value: string): boolean {
  if (!value.startsWith(BLOG_IMAGE_PUBLIC_PREFIX)) return false;
  return isManagedBlogImageKey(value.slice(BLOG_IMAGE_PUBLIC_PREFIX.length));
}
