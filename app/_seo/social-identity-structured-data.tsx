import {
  organizationSocialProfileUrls,
  physicianSocialProfileUrls,
} from "@shared/social-profiles";

const siteUrl = "https://www.healingmindsp.com";

const officialNpiProfileUrl =
  "https://npiregistry.cms.hhs.gov/provider-view/1982233631";

const practiceAddress = {
  "@type": "PostalAddress",
  streetAddress: "4760 Tamiami Trl N # 25",
  addressLocality: "Naples",
  addressRegion: "FL",
  postalCode: "34103",
  addressCountry: "US",
} as const;

export const socialIdentityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalOrganization", "LocalBusiness", "MedicalClinic"],
      "@id": `${siteUrl}/#organization`,
      name: "Healing Minds Psychiatry",
      alternateName: "Healing Minds Psychiatry - Dr. Melva Reve",
      url: siteUrl,
      image: `${siteUrl}/doctor-profile-v2.webp`,
      logo: `${siteUrl}/favicon-512.png`,
      telephone: "+1-239-423-0272",
      email: "info@healingmindsp.com",
      address: practiceAddress,
      founder: { "@id": `${siteUrl}/#physician` },
      sameAs: [...organizationSocialProfileUrls],
    },
    {
      "@type": "Physician",
      "@id": `${siteUrl}/#physician`,
      name: "Dr. Melva Reve Urgelles",
      honorificPrefix: "Dr.",
      jobTitle: "Psychiatrist",
      image: `${siteUrl}/doctor-profile-v2.webp`,
      medicalSpecialty: "https://schema.org/Psychiatric",
      knowsLanguage: ["English", "Spanish"],
      address: practiceAddress,
      usNPI: "1982233631",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "NPI",
        value: "1982233631",
      },
      worksFor: { "@id": `${siteUrl}/#organization` },
      sameAs: [officialNpiProfileUrl, ...physicianSocialProfileUrls],
    },
  ],
} as const;

const serializedSocialIdentityGraph = JSON.stringify(socialIdentityGraph).replaceAll(
  "<",
  "\\u003c",
);

export default function SocialIdentityStructuredData() {
  return (
    <script
      id="social-identity-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializedSocialIdentityGraph }}
    />
  );
}
