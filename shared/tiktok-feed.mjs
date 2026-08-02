/**
 * Metricool can repeat the same post in its post-comments response. Preserve the
 * response envelope while exposing each TikTok video only once to the website.
 */
export function dedupeTikTokPayload(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.data)) {
    return payload;
  }

  const seenVideos = new Set();
  const data = payload.data.filter((item) => {
    const video = item?.root?.element;
    const identity = video?.id || video?.link;
    if (!identity) return true;
    if (seenVideos.has(identity)) return false;
    seenVideos.add(identity);
    return true;
  });

  return { ...payload, data };
}
