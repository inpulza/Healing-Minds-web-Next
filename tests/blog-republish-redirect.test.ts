import assert from "node:assert/strict";
import test from "node:test";
import { assertBlogRedirectCanBeReclaimed, assertBlogRedirectPublishSnapshotMatches } from "../server/blog/lifecycle";

test("republish only reclaims this article's unpublish redirect", () => {
  for (const redirect of [null, undefined, { isActive: false, sourcePostId: 2, reason: "manual" }, { isActive: true, sourcePostId: 1, reason: "unpublish" }]) {
    assert.doesNotThrow(() => assertBlogRedirectCanBeReclaimed(redirect, 1));
  }
  for (const redirect of [
    { isActive: true, sourcePostId: 2, reason: "unpublish" },
    { isActive: true, sourcePostId: null, reason: "unpublish" },
    { isActive: true, sourcePostId: 1, reason: "manual" },
    { isActive: true, sourcePostId: 1, reason: "delete" },
  ]) {
    assert.throws(() => assertBlogRedirectCanBeReclaimed(redirect, 1), { code: "blog_redirect_reclaim_conflict", statusCode: 409 });
  }
});

test("concurrent redirect creation, edits, activation or removal abort publication", () => {
  const snapshot = { id: 1, sourcePath: "/es/blog/test", targetPath: "/es/blog", isActive: true, updatedAt: new Date(0) };
  assert.doesNotThrow(() => assertBlogRedirectPublishSnapshotMatches(snapshot, snapshot));
  assert.doesNotThrow(() => assertBlogRedirectPublishSnapshotMatches(null, null));
  for (const current of [null, { ...snapshot, targetPath: "/blog" }, { ...snapshot, isActive: false }, { ...snapshot, updatedAt: new Date(1) }]) {
    assert.throws(() => assertBlogRedirectPublishSnapshotMatches(current, snapshot), { code: "blog_redirect_publish_snapshot_changed" });
  }
  assert.throws(() => assertBlogRedirectPublishSnapshotMatches(snapshot, null), { code: "blog_redirect_publish_snapshot_changed" });
});
