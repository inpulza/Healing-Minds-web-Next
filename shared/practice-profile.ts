import {
  organizationSocialProfileUrls,
  physicianSocialProfileUrls,
} from "./social-profiles";

const siteUrl = "https://www.healingmindsp.com";

export const practiceProfile = {
  siteUrl,
  canonicalHomeUrl: `${siteUrl}/`,
  name: "Healing Minds Psychiatry",
  legalName: "VIDAL HEALING MINDS CORP",
  description:
    "Bilingual psychiatric care for adults in Naples, Florida, with in-person and telepsychiatry services.",
  organizationId: `${siteUrl}/#organization`,
  websiteId: `${siteUrl}/#website`,
  physicianId: `${siteUrl}/#dr-melva-reve`,
  organizationNpi: "1417786278",
  organizationNpiUrl:
    "https://npiregistry.cms.hhs.gov/provider-view/1417786278",
  phoneDisplay: "(239) 423-0272",
  phoneE164: "+1-239-423-0272",
  email: "info@healingmindsp.com",
  address: {
    streetAddress: "4760 Tamiami Trl N #25",
    addressLocality: "Naples",
    addressRegion: "FL",
    postalCode: "34103",
    addressCountry: "US",
  },
  addressLineOne: "4760 Tamiami Trl N #25",
  addressDisplay: "4760 Tamiami Trl N #25, Naples, FL 34103",
  hoursDisplay: "Monday - Friday: 8:00 AM - 5:00 PM",
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  geo: {
    latitude: 26.2044881,
    longitude: -81.7995047,
  },
  googleMapsUrl: "https://www.google.com/maps?cid=4284755814550718591",
  bookingDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Healing+Minds+Psychiatry,4760+Tamiami+Trl+N+%2325,Naples,FL+34103",
  logoUrl: `${siteUrl}/favicon-512.png`,
  imageUrl: `${siteUrl}/doctor-profile-v2.webp`,
  sameAs: [...organizationSocialProfileUrls],
  physician: {
    name: "Melva Reve",
    legalName: "Melva Rosa Reve Urgelles",
    honorificPrefix: "Dr.",
    honorificSuffix: "MD",
    jobTitle: {
      en: "Psychiatrist",
      es: "Psiquiatra",
    },
    npi: "1982233631",
    npiUrl: "https://npiregistry.cms.hhs.gov/provider-view/1982233631",
    floridaLicense: "ME165518",
    profileUrl: `${siteUrl}/about`,
    languages: ["en", "es"],
    sameAs: [
      "https://npiregistry.cms.hhs.gov/provider-view/1982233631",
      ...physicianSocialProfileUrls,
    ],
  },
} as const;

export type PracticeProfile = typeof practiceProfile;
