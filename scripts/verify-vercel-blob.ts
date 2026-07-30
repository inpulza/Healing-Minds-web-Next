import { createHash, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  deleteBlogImageObject,
  downloadBlogImage,
  uploadBlogImage,
} from "../server/blog/images/object-storage";

const source = await readFile(new URL("../public/images/blog/approved/anxiety-treatment.webp", import.meta.url));
const objectKey = `blog-images/posts/post-999999-hero-${Date.now()}-${randomBytes(6).toString("hex")}.webp`;
const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

try {
  await uploadBlogImage(objectKey, source);
  const downloaded = await downloadBlogImage(objectKey);
  if (digest(source) !== digest(downloaded)) throw new Error("Downloaded Blob bytes do not match upload");
  console.log(JSON.stringify({
    success: true,
    objectKey,
    bytes: downloaded.length,
    sha256: digest(downloaded),
  }, null, 2));
} finally {
  await deleteBlogImageObject(objectKey);
}
