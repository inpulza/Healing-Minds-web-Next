/**
 * @param {unknown} error
 * @returns {404 | 503}
 */
export function getBlogImageStorageErrorStatus(error) {
  const value = /** @type {{ name?: string; code?: string; message?: string; status?: number; statusCode?: number }} */ (error);
  const notFound = value?.name === "BlobNotFoundError"
    || value?.code === "blob_not_found"
    || value?.status === 404
    || value?.statusCode === 404
    || value?.message === "Vercel Blob: The requested blob does not exist";
  return notFound ? 404 : 503;
}
