import { del, head, put } from "@vercel/blob";
import { getBlogImageStorageErrorStatus } from "./storage-error.mjs";
import {
  getManagedBlogImagePublicUrl,
  isManagedBlogImageKey,
  isManagedBlogImagePublicUrl,
} from "@shared/blog-images";

export {
  getManagedBlogImagePublicUrl,
  isManagedBlogImageKey,
  isManagedBlogImagePublicUrl,
} from "@shared/blog-images";

function assertStorageConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    throw Object.assign(new Error("Vercel Blob storage is not configured"), { statusCode: 503 });
  }
}

function assertManagedKey(objectKey: string): void {
  if (!isManagedBlogImageKey(objectKey)) {
    throw Object.assign(new Error("Invalid blog image object key"), { statusCode: 400 });
  }
}

function storageError(error: unknown): Error & { statusCode?: number } {
  const statusCode = getBlogImageStorageErrorStatus(error);
  return Object.assign(
    new Error(statusCode === 404 ? "Blog image object was not found" : "Vercel Blob request failed"),
    { statusCode },
  );
}

export async function uploadBlogImage(objectKey: string, bytes: Buffer): Promise<void> {
  assertManagedKey(objectKey);
  assertStorageConfigured();
  try {
    await put(objectKey, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/webp",
      cacheControlMaxAge: 31_536_000,
    });
  } catch (error) {
    throw storageError(error);
  }
}

export async function downloadBlogImage(objectKey: string): Promise<Buffer> {
  assertManagedKey(objectKey);
  assertStorageConfigured();
  try {
    const metadata = await head(objectKey);
    const response = await fetch(metadata.downloadUrl || metadata.url, { cache: "force-cache" });
    if (!response.ok) {
      throw Object.assign(new Error("Blob download failed"), { statusCode: response.status });
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    throw storageError(error);
  }
}

export async function deleteBlogImageObject(objectKey: string): Promise<void> {
  assertManagedKey(objectKey);
  assertStorageConfigured();
  try {
    await del(objectKey);
  } catch (error) {
    const normalized = storageError(error);
    if (normalized.statusCode !== 404) throw normalized;
  }
}
