import { Client } from "@replit/object-storage";
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

let storageClient: Client | undefined;

function getStorageClient(): Client {
  storageClient ||= new Client();
  return storageClient;
}

function storageErrorMessage(error: { message?: string } | string | undefined): string {
  if (typeof error === "string") return error;
  return error?.message || "App Storage request failed";
}

export async function uploadBlogImage(objectKey: string, bytes: Buffer): Promise<void> {
  if (!isManagedBlogImageKey(objectKey)) throw new Error("Invalid blog image object key");
  const result = await getStorageClient().uploadFromBytes(objectKey, bytes, { compress: false });
  if (!result.ok) throw new Error(storageErrorMessage(result.error));
}

export async function downloadBlogImage(objectKey: string): Promise<Buffer> {
  if (!isManagedBlogImageKey(objectKey)) throw new Error("Invalid blog image object key");
  const result = await getStorageClient().downloadAsBytes(objectKey, { decompress: false });
  if (!result.ok) throw Object.assign(new Error(storageErrorMessage(result.error)), {
    statusCode: result.error.statusCode,
  });
  const value = result.value as unknown as Buffer | [Buffer];
  return Array.isArray(value) ? value[0] : value;
}

export async function deleteBlogImageObject(objectKey: string): Promise<void> {
  if (!isManagedBlogImageKey(objectKey)) throw new Error("Invalid blog image object key");
  const result = await getStorageClient().delete(objectKey, { ignoreNotFound: true });
  if (!result.ok) throw new Error(storageErrorMessage(result.error));
}
