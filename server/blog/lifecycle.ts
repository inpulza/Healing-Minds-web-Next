import type { BlogPostStatus } from "@shared/schema";

export type BlogPostSnapshot = {
  status: BlogPostStatus;
  updatedAt: Date;
};

export type BlogPostExpectedSnapshot = {
  expectedStatus?: BlogPostStatus;
  expectedUpdatedAt?: Date;
};

export function blogPostSnapshotMatches(
  current: BlogPostSnapshot,
  expected: BlogPostExpectedSnapshot,
): boolean {
  return (
    (expected.expectedStatus === undefined || current.status === expected.expectedStatus)
    && (
      expected.expectedUpdatedAt === undefined
      || current.updatedAt.getTime() === expected.expectedUpdatedAt.getTime()
    )
  );
}

export function assertBlogPostSnapshotMatches(
  current: BlogPostSnapshot,
  expected: BlogPostExpectedSnapshot,
  error: {
    message: string;
    code: string;
  },
): void {
  if (blogPostSnapshotMatches(current, expected)) return;
  throw Object.assign(new Error(error.message), {
    statusCode: 409,
    code: error.code,
  });
}

export type BlogPostStatusTransitionPlan = {
  activateManagedTarget: boolean;
  deactivateRedirectPath: string | null;
  createRedirect: boolean;
};

export function buildBlogPostStatusTransitionPlan(input: {
  currentStatus: BlogPostStatus;
  nextStatus: BlogPostStatus;
  currentPath: string;
  redirectTargetPath: string | null;
}): BlogPostStatusTransitionPlan {
  const publishing = input.nextStatus === "published";
  const unpublishing = input.currentStatus === "published" && !publishing;
  return {
    activateManagedTarget: publishing,
    deactivateRedirectPath: publishing ? input.currentPath : null,
    createRedirect: unpublishing && input.redirectTargetPath !== null,
  };
}

export type BlogRedirectSnapshot = {
  id: number;
  sourcePath: string;
  targetPath: string;
  isActive: boolean;
  updatedAt: Date;
};

export function blogRedirectSnapshotMatches(
  current: BlogRedirectSnapshot,
  expected: BlogRedirectSnapshot,
): boolean {
  return (
    current.id === expected.id
    && current.sourcePath === expected.sourcePath
    && current.targetPath === expected.targetPath
    && current.isActive === expected.isActive
    && current.updatedAt.getTime() === expected.updatedAt.getTime()
  );
}

export function assertBlogRedirectCleanupSnapshotMatches(
  current: BlogRedirectSnapshot | null | undefined,
  expected: BlogRedirectSnapshot,
): void {
  if (
    current
    && expected.isActive
    && current.isActive
    && blogRedirectSnapshotMatches(current, expected)
  ) {
    return;
  }
  throw Object.assign(
    new Error("The redirect changed while link cleanup was being prepared. No article links were rewritten; refresh and retry."),
    {
      statusCode: 409,
      code: "blog_redirect_cleanup_redirect_changed",
    },
  );
}

export function blogRedirectPresenceSnapshotMatches(
  current: BlogRedirectSnapshot | null | undefined,
  expected: BlogRedirectSnapshot | null,
): boolean {
  if (!current || !expected) return !current && !expected;
  return blogRedirectSnapshotMatches(current, expected);
}

export function assertBlogRedirectPublishSnapshotMatches(
  current: BlogRedirectSnapshot | null | undefined,
  expected: BlogRedirectSnapshot | null,
): void {
  if (blogRedirectPresenceSnapshotMatches(current, expected)) return;
  throw Object.assign(
    new Error("The article redirect changed while publication was being prepared. Run Verify again and retry."),
    {
      statusCode: 409,
      code: "blog_redirect_publish_snapshot_changed",
    },
  );
}

export function planBlogPostImageObjectDeletion(
  images: Array<{
    source: string;
    objectKey: string | null;
    generationStatus: string;
    errorCode: string | null;
  }>,
): string[] {
  if (images.some(image => (
    image.generationStatus === "pending"
    || image.generationStatus === "generating"
    || image.errorCode === "deletion_pending"
  ))) {
    throw Object.assign(
      new Error("Wait for image generation or deletion to finish before deleting this article"),
      {
        statusCode: 409,
        code: "blog_post_delete_image_busy",
      },
    );
  }
  return Array.from(new Set(
    images
      .filter(image => image.source === "ai" && Boolean(image.objectKey))
      .map(image => image.objectKey!),
  )).sort();
}
