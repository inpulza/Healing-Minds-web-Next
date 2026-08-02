import assert from "node:assert/strict";
import test from "node:test";
import { buildBlogSitemapEntries } from "../server/blog/sitemap-entries.mjs";

const origin = "https://www.healingmindsp.com";

test("blog sitemap entries preserve translations, legacy dates and priority", () => {
  const posts = [
    {
      slug: "english-pair",
      language: "en",
      translationGroupId: "paired",
      publishedAt: new Date("2026-07-29T11:22:33.000Z"),
      updatedAt: new Date("2026-08-01T18:19:20.000Z"),
      createdAt: new Date("2026-07-28T01:02:03.000Z"),
    },
    {
      slug: "pareja-espanola",
      language: "es",
      translationGroupId: "paired",
      publishedAt: new Date("2026-07-30T04:05:06.000Z"),
      updatedAt: new Date("2026-08-01T18:19:20.000Z"),
      createdAt: new Date("2026-07-28T01:02:03.000Z"),
    },
    {
      slug: "english-only",
      language: "en",
      translationGroupId: "solo",
      publishedAt: null,
      updatedAt: new Date("2026-07-31T23:59:59.000Z"),
      createdAt: new Date("2026-07-27T01:02:03.000Z"),
    },
  ];

  const entries = buildBlogSitemapEntries(origin, posts);
  assert.equal(entries.length, 3);
  assert.deepEqual(entries[0], {
    url: `${origin}/blog/english-pair`,
    lastModified: "2026-07-29",
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: {
      languages: {
        en: `${origin}/blog/english-pair`,
        es: `${origin}/es/blog/pareja-espanola`,
        "x-default": `${origin}/blog/english-pair`,
      },
    },
  });
  assert.deepEqual(entries[1].alternates, entries[0].alternates);
  assert.equal(entries[1].lastModified, "2026-07-30");
  assert.deepEqual(entries[2].alternates.languages, {
    en: `${origin}/blog/english-only`,
    "x-default": `${origin}/blog/english-only`,
  });
  assert.equal(entries[2].lastModified, "2026-07-31");
  assert.doesNotMatch(entries.map((entry) => entry.lastModified).join(" "), /T\d{2}:/);
});
