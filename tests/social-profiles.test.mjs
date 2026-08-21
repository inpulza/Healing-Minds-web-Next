import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const expectedProfiles = {
  linkedin: {
    label: "LinkedIn",
    handle: "Melva Reve",
    url: "https://www.linkedin.com/in/melva-reve-2549a9120",
  },
  facebook: {
    label: "Facebook",
    handle: "Healing Minds Psychiatry",
    url: "https://www.facebook.com/profile.php?id=61578845287836",
  },
  instagram: {
    label: "Instagram",
    handle: "@melvareve_md",
    url: "https://www.instagram.com/melvareve_md/",
  },
  tiktok: {
    label: "TikTok",
    handle: "@melvareve_md",
    url: "https://www.tiktok.com/@melvareve_md",
  },
  youtube: {
    label: "YouTube",
    handle: "@healingmindsp",
    url: "https://www.youtube.com/@healingmindsp",
  },
};

const runtimeFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/_seo/structured-data.ts",
  "app/_seo/structured-data-script.tsx",
  "client/src/components/About.tsx",
  "client/src/components/CompactVideoCarousel.tsx",
  "client/src/components/Footer.tsx",
  "client/src/data/pageContent/mainPages/about.ts",
  "client/src/hooks/useTikTokVideos.ts",
  "server/utils/html-injection.ts",
  "shared/practice-profile.ts",
  "shared/social-profiles.ts",
];

test("verified social identities have one canonical source", () => {
  const profiles = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "shared", "social-profiles.json"), "utf8"),
  );
  assert.deepEqual(profiles, expectedProfiles);

  const urls = Object.values(profiles).map((profile) => profile.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) assert.equal(new URL(url).protocol, "https:");
});

test("active UI and schema sources cannot reintroduce stale social profiles", () => {
  const source = runtimeFiles
    .map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8"))
    .join("\n");

  const staleIdentities = [
    "tiktok.com/@dra.melvavidal",
    "instagram.com/hmpsychiatry",
    "instagram.com/healingmindspsychiatry",
    "facebook.com/healingmindspsychiatry",
    "linkedin.com/in/dr-melva-reve",
    "npidb.org/doctors/",
    "providers.sharecare.com/doctor/",
  ];
  for (const staleIdentity of staleIdentities) {
    assert.doesNotMatch(source, new RegExp(staleIdentity.replaceAll(".", "\\."), "i"));
  }

  assert.match(source, /page-structured-data/);
  assert.match(source, /organizationSocialProfileUrls/);
  assert.match(source, /physicianSocialProfileUrls/);
  assert.match(source, /favicon-512\.png/);
  assert.match(source, /https:\/\/schema\.org\/Psychiatric/);
  assert.match(source, /npiregistry\.cms\.hhs\.gov\/provider-view\/1417786278/);
  assert.match(source, /npiregistry\.cms\.hhs\.gov\/provider-view\/1982233631/);
  assert.match(source, /4760 Tamiami Trl N #25/);
  assert.match(source, /4284755814550718591/);
});

test("schema sameAs profiles are assigned to the entity named by the current handle", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "shared", "social-profiles.ts"),
    "utf8",
  );

  assert.match(
    source,
    /organizationSocialProfileUrls\s*=\s*\[\s*socialProfiles\.facebook\.url,\s*socialProfiles\.youtube\.url,\s*\]/s,
  );
  assert.match(
    source,
    /physicianSocialProfileUrls\s*=\s*\[\s*socialProfiles\.linkedin\.url,\s*socialProfiles\.instagram\.url,\s*socialProfiles\.tiktok\.url,\s*\]/s,
  );
});

test("every sameAs URL has a dated, renewable source record", () => {
  const profiles = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "shared", "social-profiles.json"), "utf8"),
  );
  const registry = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "shared", "public-claims-sources.json"), "utf8"),
  );

  for (const profile of Object.values(profiles)) {
    const source = registry.find((entry) => entry.sourceUrl === profile.url);
    assert.ok(source, `${profile.url}: missing source record`);
    assert.match(source.id, /^social-/);
    assert.match(source.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(source.reverifyBy, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(source.reverifyBy > source.verifiedAt, `${source.id}: reverifyBy must be later`);
    assert.match(source.claim, /self-declares/i);
  }
});

test("structured data is owned by public page segments, not the persistent layout", () => {
  const layout = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");
  const home = fs.readFileSync(path.join(process.cwd(), "app", "page.tsx"), "utf8");
  const catchAll = fs.readFileSync(path.join(process.cwd(), "app", "[...slug]", "page.tsx"), "utf8");
  const blogIndex = fs.readFileSync(path.join(process.cwd(), "app", "_routing", "blog-index-page.tsx"), "utf8");

  assert.doesNotMatch(layout, /StructuredDataScript/);
  assert.match(home, /<StructuredDataScript/);
  assert.match(catchAll, /<StructuredDataScript/);
  assert.match(blogIndex, /<StructuredDataScript/);
});
