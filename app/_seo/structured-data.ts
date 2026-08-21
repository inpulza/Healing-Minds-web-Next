import { adhdTreatmentContent } from "@/data/pageContent/services/adhdTreatment";
import { forPatientsContent } from "@/data/pageContent/mainPages/forPatients";
import { servicesIndexContent } from "@/data/pageContent/services/servicesIndex";
import { homeFaqs } from "@/data/homeFaqs";
import { locationFAQs, type LocationFAQItem } from "@/data/locationFAQs";
import type { BlogArchivePage, BlogLanguage } from "@/pages/BlogIndex";
import type { BlogPostDetail } from "@/pages/BlogPost";
import { practiceProfile } from "@shared/practice-profile";

type JsonLdNode = Record<string, unknown>;

export type StructuredDataGraph = {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
};

type StaticStructuredDataInput = {
  pathname: string;
  pageName: string;
  title: string;
  description?: string;
};

type SchemaBlogPost = BlogPostDetail & {
  updatedAt?: string | null;
};

const serviceDetails: Record<string, { en: string; es: string; category: string }> = {
  "anxiety-treatment": {
    en: "Anxiety Treatment",
    es: "Tratamiento de Ansiedad",
    category: "Psychiatric treatment for anxiety disorders",
  },
  "depression-treatment": {
    en: "Depression Treatment",
    es: "Tratamiento de Depresión",
    category: "Psychiatric treatment for depression",
  },
  "adhd-treatment": {
    en: "Adult ADHD Treatment",
    es: "Tratamiento de TDAH en Adultos",
    category: "Psychiatric evaluation and treatment for adult ADHD",
  },
  "ptsd-treatment": {
    en: "PTSD Treatment",
    es: "Tratamiento de TEPT",
    category: "Psychiatric treatment for post-traumatic stress disorder",
  },
  "bipolar-treatment": {
    en: "Bipolar Disorder Treatment",
    es: "Tratamiento del Trastorno Bipolar",
    category: "Psychiatric treatment for bipolar disorder",
  },
  "medication-management": {
    en: "Psychiatric Medication Management",
    es: "Manejo de Medicamentos Psiquiátricos",
    category: "Psychiatric medication management",
  },
};

const spanishServiceSlugs: Record<string, keyof typeof serviceDetails> = {
  "tratamiento-ansiedad": "anxiety-treatment",
  "tratamiento-depresion": "depression-treatment",
  "tratamiento-adhd": "adhd-treatment",
  "tratamiento-tept": "ptsd-treatment",
  "tratamiento-bipolar": "bipolar-treatment",
  "manejo-medicamentos": "medication-management",
};

const locationDetails: Record<
  string,
  { key?: string; en: string; es: string }
> = {
  naples: { en: "Naples", es: "Naples" },
  "bonita-springs": { key: "bonitaSprings", en: "Bonita Springs", es: "Bonita Springs" },
  "marco-island": { key: "marcoIsland", en: "Marco Island", es: "Marco Island" },
  estero: { key: "estero", en: "Estero", es: "Estero" },
  "golden-gate": { key: "goldenGate", en: "Golden Gate", es: "Golden Gate" },
  immokalee: { key: "immokalee", en: "Immokalee", es: "Immokalee" },
  "vanderbilt-beach": { key: "vanderbiltBeach", en: "Vanderbilt Beach", es: "Vanderbilt Beach" },
  "ave-maria": { key: "aveMaria", en: "Ave Maria", es: "Ave Maria" },
  "fort-myers": { key: "fortMyers", en: "Fort Myers", es: "Fort Myers" },
  "lely-resort": { key: "lelyResorts", en: "Lely Resort", es: "Lely Resort" },
};

const spanishLocationSlugs: Record<string, keyof typeof locationDetails> = {
  "psiquiatra-naples": "naples",
  "psiquiatra-bonita-springs": "bonita-springs",
  "psiquiatra-marco-island": "marco-island",
  "psiquiatra-estero": "estero",
  "psiquiatra-golden-gate": "golden-gate",
  "psiquiatra-immokalee": "immokalee",
  "psiquiatra-vanderbilt-beach": "vanderbilt-beach",
  "psiquiatra-ave-maria": "ave-maria",
  "psiquiatra-fort-myers": "fort-myers",
  "psiquiatra-lely-resort": "lely-resort",
};

const breadcrumbLabels: Record<string, { en: string; es: string }> = {
  about: { en: "About Dr. Reve", es: "Acerca de la Dra. Reve" },
  contact: { en: "Contact", es: "Contacto" },
  "for-patients": { en: "For Patients", es: "Para Pacientes" },
  services: { en: "Services", es: "Servicios" },
  telepsychiatry: { en: "Telepsychiatry", es: "Telepsiquiatría" },
  blog: { en: "Blog", es: "Blog" },
};

function canonicalUrl(pathname: string): string {
  return pathname === "/"
    ? practiceProfile.canonicalHomeUrl
    : `${practiceProfile.siteUrl}${pathname}`;
}

function absoluteUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return new URL(value, practiceProfile.siteUrl).toString();
}

function localeFor(pathname: string): "en" | "es" {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

function cleanHeading(value: string): string {
  return value.replaceAll("**", "").trim();
}

function postalAddressNode(): JsonLdNode {
  return {
    "@type": "PostalAddress",
    ...practiceProfile.address,
  };
}

function organizationIdentifier(): JsonLdNode {
  return {
    "@type": "PropertyValue",
    propertyID: "NPI",
    value: practiceProfile.organizationNpi,
    url: practiceProfile.organizationNpiUrl,
  };
}

function physicianIdentifier(): JsonLdNode[] {
  return [
    {
      "@type": "PropertyValue",
      propertyID: "NPI",
      value: practiceProfile.physician.npi,
      url: practiceProfile.physician.npiUrl,
    },
    {
      "@type": "PropertyValue",
      propertyID: "Florida medical license",
      value: practiceProfile.physician.floridaLicense,
    },
  ];
}

export function buildPracticeNode(): JsonLdNode {
  return {
    "@type": ["MedicalOrganization", "MedicalClinic", "Physician", "LocalBusiness"],
    "@id": practiceProfile.organizationId,
    name: practiceProfile.name,
    legalName: practiceProfile.legalName,
    description: practiceProfile.description,
    url: practiceProfile.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: practiceProfile.logoUrl,
    },
    image: practiceProfile.imageUrl,
    telephone: practiceProfile.phoneE164,
    email: practiceProfile.email,
    address: postalAddressNode(),
    geo: {
      "@type": "GeoCoordinates",
      ...practiceProfile.geo,
    },
    hasMap: practiceProfile.googleMapsUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: practiceProfile.openingHours.days.map(
        (day) => `https://schema.org/${day}`,
      ),
      opens: practiceProfile.openingHours.opens,
      closes: practiceProfile.openingHours.closes,
    },
    medicalSpecialty: "https://schema.org/Psychiatric",
    identifier: organizationIdentifier(),
    employee: { "@id": practiceProfile.physicianId },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "appointments and patient support",
      telephone: practiceProfile.phoneE164,
      email: practiceProfile.email,
      availableLanguage: [...practiceProfile.physician.languages],
      areaServed: "US-FL",
    },
    sameAs: [...practiceProfile.sameAs],
  };
}

export function buildPhysicianPersonNode(locale: "en" | "es" = "en"): JsonLdNode {
  return {
    "@type": "Person",
    "@id": practiceProfile.physicianId,
    name: practiceProfile.physician.name,
    alternateName: practiceProfile.physician.legalName,
    honorificPrefix: practiceProfile.physician.honorificPrefix,
    honorificSuffix: practiceProfile.physician.honorificSuffix,
    jobTitle: practiceProfile.physician.jobTitle[locale],
    url: practiceProfile.physician.profileUrl,
    image: practiceProfile.imageUrl,
    knowsLanguage: [...practiceProfile.physician.languages],
    knowsAbout: "Psychiatry",
    identifier: physicianIdentifier(),
    worksFor: { "@id": practiceProfile.organizationId },
    sameAs: [...practiceProfile.physician.sameAs],
  };
}

function publisherNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": practiceProfile.organizationId,
    name: practiceProfile.name,
    legalName: practiceProfile.legalName,
    url: practiceProfile.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: practiceProfile.logoUrl,
    },
  };
}

function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": practiceProfile.websiteId,
    url: practiceProfile.canonicalHomeUrl,
    name: practiceProfile.name,
    inLanguage: ["en-US", "es-US"],
    publisher: { "@id": practiceProfile.organizationId },
  };
}

function serviceSlug(pathname: string): string | null {
  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return null;
  if (serviceDetails[slug]) return slug;
  return spanishServiceSlugs[slug] || null;
}

function locationSlug(pathname: string): string | null {
  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return null;
  const english = slug.replace(/^psychiatrist-/, "");
  if (locationDetails[english]) return english;
  return spanishLocationSlugs[slug] || null;
}

function extractFaqs(
  pathname: string,
  locale: "en" | "es",
  location: string | null,
): readonly LocationFAQItem[] {
  if (pathname === "/" || pathname === "/es") return homeFaqs[locale];

  if (pathname === "/services" || pathname === "/es/servicios") {
    return servicesIndexContent[locale].sections
      .filter((section) => /^faq-\d+$/.test(section.key || ""))
      .map((section) => ({
        question: cleanHeading(section.heading || ""),
        answer: section.paragraphs?.[0] || "",
      }));
  }

  if (pathname === "/for-patients" || pathname === "/es/para-pacientes") {
    const section = forPatientsContent[locale].sections.find((item) => item.key === "faqs");
    return (section?.bullets || []).map((question, index) => ({
      question,
      answer: section?.paragraphs?.[index] || "",
    }));
  }

  if (
    pathname === "/telepsychiatry-florida"
    || pathname === "/es/telepsiquiatria-florida"
  ) {
    return locationFAQs.telehealth[locale];
  }

  if (
    pathname === "/services/adhd-treatment"
    || pathname === "/es/servicios/tratamiento-adhd"
  ) {
    const questions = adhdTreatmentContent[locale].sections.find(
      (section) => section.key === "faq-questions",
    )?.bullets || [];
    const answers = adhdTreatmentContent[locale].sections.find(
      (section) => section.key === "faq-answers",
    )?.bullets || [];
    return questions.map((question, index) => ({
      question,
      answer: answers[index] || "",
    }));
  }

  const locationKey = location ? locationDetails[location]?.key : undefined;
  return locationKey ? locationFAQs[locationKey]?.[locale] || [] : [];
}

function faqQuestionNodes(faqs: readonly LocationFAQItem[]): JsonLdNode[] {
  return faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  }));
}

function pageLabel(pathname: string, title: string): string {
  const locale = localeFor(pathname);
  if (pathname === "/about" || pathname === "/es/acerca-de") {
    return breadcrumbLabels.about[locale];
  }
  if (pathname === "/contact" || pathname === "/es/contacto") {
    return breadcrumbLabels.contact[locale];
  }
  if (pathname === "/for-patients" || pathname === "/es/para-pacientes") {
    return breadcrumbLabels["for-patients"][locale];
  }
  if (pathname === "/services" || pathname === "/es/servicios") {
    return breadcrumbLabels.services[locale];
  }
  if (
    pathname === "/telepsychiatry-florida"
    || pathname === "/es/telepsiquiatria-florida"
  ) {
    return breadcrumbLabels.telepsychiatry[locale];
  }
  const service = serviceSlug(pathname);
  if (service) return serviceDetails[service][locale];
  const location = locationSlug(pathname);
  if (location) return locationDetails[location][locale];
  return title.split("|")[0].trim();
}

function breadcrumbNode(pathname: string, title: string): JsonLdNode | null {
  if (pathname === "/" || pathname === "/es") return null;
  const locale = localeFor(pathname);
  const canonical = canonicalUrl(pathname);
  const homePath = locale === "es" ? "/es" : "/";
  const items: JsonLdNode[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "es" ? "Inicio" : "Home",
      item: canonicalUrl(homePath),
    },
  ];

  if (serviceSlug(pathname)) {
    const servicesPath = locale === "es" ? "/es/servicios" : "/services";
    items.push({
      "@type": "ListItem",
      position: 2,
      name: breadcrumbLabels.services[locale],
      item: canonicalUrl(servicesPath),
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: pageLabel(pathname, title),
    item: canonical,
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items,
  };
}

function serviceNode(
  pathname: string,
  title: string,
  description: string | undefined,
  location: string | null,
): JsonLdNode | null {
  const locale = localeFor(pathname);
  const canonical = canonicalUrl(pathname);
  const detail = serviceSlug(pathname);
  const isTelepsychiatry =
    pathname === "/telepsychiatry-florida"
    || pathname === "/es/telepsiquiatria-florida";
  const isSatelliteLocation = Boolean(location && location !== "naples");
  if (!detail && !isTelepsychiatry && !isSatelliteLocation) return null;

  const name = detail
    ? serviceDetails[detail][locale]
    : isTelepsychiatry
      ? locale === "es" ? "Telepsiquiatría en Florida" : "Telepsychiatry in Florida"
      : locale === "es"
        ? `Atención psiquiátrica para ${locationDetails[location!].es}`
        : `Psychiatric care for ${locationDetails[location!].en}`;
  const areaServed = isSatelliteLocation
    ? {
        "@type": "City",
        name: locationDetails[location!][locale],
        containedInPlace: {
          "@type": "State",
          name: "Florida",
        },
      }
    : {
        "@type": "State",
        name: "Florida",
      };

  const node: JsonLdNode = {
    "@type": "Service",
    "@id": `${canonical}#service`,
    url: canonical,
    name,
    description,
    serviceType: detail ? serviceDetails[detail].category : name,
    provider: { "@id": practiceProfile.organizationId },
    areaServed,
  };

  if (isTelepsychiatry) {
    node.availableChannel = {
      "@type": "ServiceChannel",
      serviceUrl: canonical,
      servicePhone: {
        "@type": "ContactPoint",
        telephone: practiceProfile.phoneE164,
        availableLanguage: [...practiceProfile.physician.languages],
      },
    };
  }

  return node;
}

function servicesItemList(pathname: string): JsonLdNode {
  const locale = localeFor(pathname);
  const prefix = locale === "es" ? "/es/servicios/" : "/services/";
  const slugs = locale === "es"
    ? Object.entries(spanishServiceSlugs).map(([slug, key]) => ({ slug, key }))
    : Object.keys(serviceDetails).map((slug) => ({ slug, key: slug }));
  return {
    "@type": "ItemList",
    "@id": `${canonicalUrl(pathname)}#services`,
    name: locale === "es" ? "Servicios psiquiátricos" : "Psychiatric services",
    itemListElement: slugs.map(({ slug, key }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: serviceDetails[key][locale],
      url: canonicalUrl(`${prefix}${slug}`),
    })),
  };
}

function staticPageTypes(
  pathname: string,
  faqs: readonly LocationFAQItem[],
): string | string[] {
  const base = pathname === "/services" || pathname === "/es/servicios"
    ? "CollectionPage"
    : pathname === "/about" || pathname === "/es/acerca-de"
      ? ["AboutPage", "ProfilePage"]
      : pathname === "/contact" || pathname === "/es/contacto"
        ? "ContactPage"
        : "WebPage";
  return faqs.length
    ? [...(Array.isArray(base) ? base : [base]), "FAQPage"]
    : base;
}

export function buildStaticStructuredData({
  pathname,
  title,
  description,
}: StaticStructuredDataInput): StructuredDataGraph {
  const locale = localeFor(pathname);
  const canonical = canonicalUrl(pathname);
  const location = locationSlug(pathname);
  const faqs = extractFaqs(pathname, locale, location);
  const breadcrumb = breadcrumbNode(pathname, title);
  const service = serviceNode(pathname, title, description, location);
  const isHome = pathname === "/" || pathname === "/es";
  const isDomainHome = pathname === "/";
  const isAbout = pathname === "/about" || pathname === "/es/acerca-de";
  const isContact = pathname === "/contact" || pathname === "/es/contacto";
  const isNaples = location === "naples";
  const isServicesIndex = pathname === "/services" || pathname === "/es/servicios";
  const questions = faqQuestionNodes(faqs);
  const pageNode: JsonLdNode = {
    "@type": staticPageTypes(pathname, faqs),
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: locale === "es" ? "es-US" : "en-US",
    isPartOf: { "@id": practiceProfile.websiteId },
    publisher: { "@id": practiceProfile.organizationId },
  };

  if (breadcrumb) pageNode.breadcrumb = { "@id": breadcrumb["@id"] };
  if (questions.length) {
    pageNode.mainEntity = questions;
    if (service) pageNode.about = { "@id": service["@id"] };
  } else if (service) {
    pageNode.mainEntity = { "@id": service["@id"] };
  } else if (isHome || isContact || isNaples) {
    pageNode.mainEntity = { "@id": practiceProfile.organizationId };
  } else if (isAbout) {
    pageNode.mainEntity = { "@id": practiceProfile.physicianId };
  }

  const graph: JsonLdNode[] = [pageNode];
  if (breadcrumb) graph.push(breadcrumb);
  if (isDomainHome) graph.push(websiteNode());
  if (isHome || isContact || isNaples) graph.push(buildPracticeNode());
  if (isHome || isAbout || isContact || isNaples) graph.push(buildPhysicianPersonNode(locale));
  if (isServicesIndex) graph.push(servicesItemList(pathname));
  if (service) graph.push(service);

  return { "@context": "https://schema.org", "@graph": graph };
}

function blogBreadcrumb(pathname: string, title: string): JsonLdNode {
  const locale = localeFor(pathname);
  const canonical = canonicalUrl(pathname);
  const blogPath = locale === "es" ? "/es/blog" : "/blog";
  const isIndex = pathname === blogPath;
  const items: JsonLdNode[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "es" ? "Inicio" : "Home",
      item: canonicalUrl(locale === "es" ? "/es" : "/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: canonicalUrl(blogPath),
    },
  ];
  if (!isIndex) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: title,
      item: canonical,
    });
  }
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items,
  };
}

export function buildBlogIndexStructuredData({
  language,
  canonicalPath,
  title,
  description,
  archive,
}: {
  language: BlogLanguage;
  canonicalPath: string;
  title: string;
  description: string;
  archive: BlogArchivePage;
}): StructuredDataGraph {
  const canonical = canonicalUrl(canonicalPath);
  const breadcrumb = blogBreadcrumb(canonicalPath, title);
  const blogId = `${canonical}#blog`;
  const listId = `${canonical}#articles`;
  const articleUrls = archive.data.map((post) => {
    const path = post.language === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
    return canonicalUrl(path);
  });
  const pageNode: JsonLdNode = {
    "@type": "CollectionPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: language === "es" ? "es-US" : "en-US",
    isPartOf: { "@id": practiceProfile.websiteId },
    publisher: { "@id": practiceProfile.organizationId },
    breadcrumb: { "@id": breadcrumb["@id"] },
    mainEntity: { "@id": blogId },
  };
  const blogNode: JsonLdNode = {
    "@type": "Blog",
    "@id": blogId,
    url: canonical,
    name: title,
    description,
    inLanguage: language === "es" ? "es-US" : "en-US",
    publisher: { "@id": practiceProfile.organizationId },
    mainEntity: { "@id": listId },
  };
  const listNode: JsonLdNode = {
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: archive.data.length,
    itemListElement: articleUrls.map((url, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: url,
    })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [pageNode, breadcrumb, blogNode, listNode],
  };
}

export function buildBlogPostStructuredData({
  pathname,
  post,
}: {
  pathname: string;
  post: SchemaBlogPost;
}): StructuredDataGraph {
  const canonical = canonicalUrl(pathname);
  const description = post.metaDescription || post.excerpt || undefined;
  const breadcrumb = blogBreadcrumb(pathname, post.title);
  const pageId = `${canonical}#webpage`;
  const articleId = `${canonical}#article`;
  const authorIsPhysician = Boolean(post.author?.name && /melva\s+(reve|rosa)/i.test(post.author.name));
  const author = authorIsPhysician
    ? { "@id": practiceProfile.physicianId }
    : post.author?.name
      ? {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.title || undefined,
        }
      : { "@id": practiceProfile.organizationId };
  const pageNode: JsonLdNode = {
    "@type": "WebPage",
    "@id": pageId,
    url: canonical,
    name: post.metaTitle || post.title,
    description,
    inLanguage: post.language === "es" ? "es-US" : "en-US",
    isPartOf: { "@id": practiceProfile.websiteId },
    breadcrumb: { "@id": breadcrumb["@id"] },
    mainEntity: { "@id": articleId },
  };
  const articleNode: JsonLdNode = {
    "@type": "BlogPosting",
    "@id": articleId,
    url: canonical,
    headline: post.title,
    description,
    image: absoluteUrl(post.featuredImage) || practiceProfile.imageUrl,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author,
    publisher: { "@id": practiceProfile.organizationId },
    mainEntityOfPage: { "@id": pageId },
    inLanguage: post.language === "es" ? "es-US" : "en-US",
    articleSection: post.category?.name || undefined,
    keywords: post.tags?.map((tag) => tag.name).filter(Boolean),
    isAccessibleForFree: true,
  };
  const graph: JsonLdNode[] = [pageNode, breadcrumb, articleNode, publisherNode()];
  if (authorIsPhysician) graph.push(buildPhysicianPersonNode(post.language));
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeStructuredData(data: StructuredDataGraph): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
