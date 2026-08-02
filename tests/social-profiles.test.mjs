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
  "app/_seo/social-identity-structured-data.tsx",
  "client/src/components/About.tsx",
  "client/src/components/CompactVideoCarousel.tsx",
  "client/src/components/Footer.tsx",
  "client/src/data/pageContent/mainPages/about.ts",
  "client/src/hooks/useTikTokVideos.ts",
  "server/utils/html-injection.ts",
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

  assert.match(source, /social-identity-structured-data/);
  assert.match(source, /organizationSocialProfileUrls/);
  assert.match(source, /physicianSocialProfileUrls/);
  assert.match(source, /favicon-512\.png/);
  assert.match(source, /https:\/\/schema\.org\/Psychiatric/);
  assert.match(source, /npiregistry\.cms\.hhs\.gov\/provider-view\/1982233631/);
  assert.equal(
    (source.match(/address: practiceAddress/g) || []).length,
    2,
    "organization and physician must each expose the verified practice address",
  );
});

test("organization identity is owned by the home route segment", () => {
  const layout = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");
  const home = fs.readFileSync(path.join(process.cwd(), "app", "page.tsx"), "utf8");

  assert.doesNotMatch(layout, /SocialIdentityStructuredData/);
  assert.match(home, /<SocialIdentityStructuredData\s*\/>/);
});
