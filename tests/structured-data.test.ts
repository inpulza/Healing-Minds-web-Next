import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBlogIndexStructuredData,
  buildBlogPostStructuredData,
  buildStaticStructuredData,
  serializeStructuredData,
  type StructuredDataGraph,
} from "../app/_seo/structured-data";
import { publicRoutePaths, resolvePublicRoute } from "../app/_routing/public-routes.mjs";
import blogSnapshot from "../shared/blog-snapshot.json";
import seoManifest from "../shared/seo-manifest.json";
import { practiceProfile } from "../shared/practice-profile";
import { faqData } from "../client/src/data/content";
import { homeFaqs } from "../client/src/data/homeFaqs";
import { locationFAQs } from "../client/src/data/locationFAQs";
import { forPatientsContent } from "../client/src/data/pageContent/mainPages/forPatients";
import { servicesIndexContent } from "../client/src/data/pageContent/services/servicesIndex";

type Node = Record<string, unknown>;

const schemaTypes = (node: Node): string[] => {
  const value = node["@type"];
  return Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];
};

const nodesOfType = (graph: StructuredDataGraph, type: string): Node[] =>
  graph["@graph"].filter((node) => schemaTypes(node).includes(type));

const staticPaths = publicRoutePaths.filter((pathname: string) => {
  const route = resolvePublicRoute(pathname);
  return route && "page" in route && route.page !== "BlogIndex" && route.page !== "BlogPost";
});

function staticGraph(pathname: string): StructuredDataGraph {
  const route = resolvePublicRoute(pathname);
  assert.ok(route && "page" in route);
  const seo = (seoManifest as Record<string, { title?: string; description?: string }>)[pathname];
  return buildStaticStructuredData({
    pathname,
    pageName: route.page,
    title: seo?.title || pathname,
    description: seo?.description,
  });
}

function jsonText(graph: StructuredDataGraph): string {
  return JSON.stringify(graph);
}

test("all 74 static public pages receive a valid, unique WebPage graph", () => {
  assert.equal(staticPaths.length, 74);
  for (const pathname of staticPaths) {
    const graph = staticGraph(pathname);
    assert.equal(graph["@context"], "https://schema.org", pathname);
    assert.equal(nodesOfType(graph, "WebPage").length + nodesOfType(graph, "AboutPage").length
      + nodesOfType(graph, "ContactPage").length + nodesOfType(graph, "CollectionPage").length >= 1, true, pathname);
    const ids = graph["@graph"].map((node) => node["@id"]).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, `duplicate @id in ${pathname}`);
    assert.doesNotThrow(() => JSON.parse(serializeStructuredData(graph)), pathname);
  }
});

test("home exposes one verified practice, one Person and one WebSite", () => {
  for (const pathname of ["/", "/es"]) {
    const graph = staticGraph(pathname);
    const [practice] = nodesOfType(graph, "MedicalClinic");
    assert.ok(practice, pathname);
    assert.deepEqual(schemaTypes(practice), [
      "MedicalOrganization",
      "MedicalClinic",
      "Physician",
      "LocalBusiness",
    ]);
    assert.equal(practice.name, "Healing Minds Psychiatry");
    assert.equal(practice.legalName, "VIDAL HEALING MINDS CORP");
    assert.equal(practice.telephone, "+1-239-423-0272");
    assert.equal((practice.address as Node).streetAddress, "4760 Tamiami Trl N #25");
    assert.equal((practice.geo as Node).latitude, 26.2044881);
    assert.equal((practice.geo as Node).longitude, -81.7995047);
    assert.equal(practice.hasMap, "https://www.google.com/maps?cid=4284755814550718591");
    assert.equal(nodesOfType(graph, "Person").length, 1);
    assert.equal(nodesOfType(graph, "WebSite").length, 1);
  }
});

test("physical and service-area location pages cannot be conflated", () => {
  for (const pathname of [
    "/locations/psychiatrist-naples",
    "/es/ubicaciones/psiquiatra-naples",
  ]) {
    const graph = staticGraph(pathname);
    assert.equal(nodesOfType(graph, "LocalBusiness").length, 1, pathname);
    assert.equal(nodesOfType(graph, "Service").length, 0, pathname);
  }

  for (const pathname of staticPaths.filter((path: string) =>
    (/^\/locations\/psychiatrist-|^\/es\/ubicaciones\/psiquiatra-/).test(path)
    && !path.endsWith("naples"))) {
    const graph = staticGraph(pathname);
    assert.equal(nodesOfType(graph, "LocalBusiness").length, 0, pathname);
    assert.equal(nodesOfType(graph, "MedicalClinic").length, 0, pathname);
    assert.equal(nodesOfType(graph, "Service").length, 1, pathname);
  }
});

test("unsupported legacy claims never enter the active graph", () => {
  const payload = staticPaths.map((pathname: string) => jsonText(staticGraph(pathname))).join("\n");
  for (const forbidden of [
    "isAcceptingNewPatients",
    "priceRange",
    "paymentAccepted",
    "aggregateRating",
    "26.2044803",
    "-81.8021344",
    "239-330-2073",
    "STE 25A",
  ]) {
    assert.doesNotMatch(payload, new RegExp(forbidden.replaceAll(".", "\\.")));
  }
});

test("public FAQ sources cannot reintroduce unverified scheduling or location claims", () => {
  const payload = JSON.stringify([
    faqData,
    homeFaqs,
    locationFAQs,
    forPatientsContent,
    servicesIndexContent,
    ...staticPaths.map((pathname: string) => staticGraph(pathname)),
  ]);
  for (const forbidden of [
    /same[- ]day/i,
    /el mismo día/i,
    /1[–-]2 weeks/i,
    /1[–-]2 semanas/i,
    /early morning|late afternoon/i,
    /temprano en la mañana|tarde en la tarde/i,
    /accepting new patients/i,
    /aceptando nuevos pacientes/i,
    /20[–-]25 minutes north/i,
    /20[–-]25 minutos al norte/i,
  ]) {
    assert.doesNotMatch(payload, forbidden);
  }
});

test("FAQPage data comes from the same exact home content rendered by the UI", () => {
  const en = staticGraph("/");
  const es = staticGraph("/es");
  const enPage = nodesOfType(en, "FAQPage")[0];
  const esPage = nodesOfType(es, "FAQPage")[0];
  assert.equal((enPage.mainEntity as Node[]).length, 6);
  assert.equal((esPage.mainEntity as Node[]).length, 6);
  assert.equal((enPage.mainEntity as Node[])[0].name, "What can I expect in my first session?");
  assert.equal((esPage.mainEntity as Node[])[0].name, "¿Qué puedo esperar en mi primera sesión?");
});

test("service, telepsychiatry and FAQ coverage follows the visible route content", () => {
  for (const pathname of [
    "/services/anxiety-treatment",
    "/es/servicios/tratamiento-depresion",
    "/telepsychiatry-florida",
    "/es/telepsiquiatria-florida",
  ]) {
    assert.equal(nodesOfType(staticGraph(pathname), "Service").length, 1, pathname);
  }
  for (const pathname of [
    "/services",
    "/es/servicios",
    "/for-patients",
    "/es/para-pacientes",
    "/services/adhd-treatment",
    "/es/servicios/tratamiento-adhd",
    "/locations/psychiatrist-bonita-springs",
    "/es/ubicaciones/psiquiatra-bonita-springs",
  ]) {
    assert.equal(nodesOfType(staticGraph(pathname), "FAQPage").length, 1, pathname);
  }
});

test("blog indexes and articles expose CollectionPage, Blog and BlogPosting", () => {
  const posts = Object.values(blogSnapshot);
  const enPosts = posts.filter((post) => post.language === "en").map((post) => ({
    ...post,
    isFeatured: Boolean(post.isFeatured),
  }));
  const index = buildBlogIndexStructuredData({
    language: "en",
    canonicalPath: "/blog",
    title: "Mental Health Blog | Healing Minds Psychiatry",
    description: "Educational mental health articles.",
    archive: {
      data: enPosts,
      categories: [],
      page: 1,
      pageSize: 12,
      total: enPosts.length,
      totalPages: 1,
      category: null,
      featuredPostId: enPosts[0]?.id || null,
    },
  });
  assert.equal(nodesOfType(index, "CollectionPage").length, 1);
  assert.equal(nodesOfType(index, "Blog").length, 1);
  assert.equal(nodesOfType(index, "BlogPosting").length, enPosts.length);

  for (const [pathname, post] of Object.entries(blogSnapshot)) {
    const graph = buildBlogPostStructuredData({ pathname, post });
    const [article] = nodesOfType(graph, "BlogPosting");
    assert.ok(article, pathname);
    assert.equal(article.url, `${practiceProfile.siteUrl}${pathname}`);
    assert.equal((article.publisher as Node)["@id"], practiceProfile.organizationId);
    assert.equal((article.author as Node)["@id"], practiceProfile.physicianId);
    assert.equal(nodesOfType(graph, "Person").length, 1);
  }
});

test("JSON-LD serialization neutralizes a closing script payload", () => {
  const serialized = serializeStructuredData({
    "@context": "https://schema.org",
    "@graph": [{ "@type": "Thing", name: "</script><script>alert(1)</script>" }],
  });
  assert.doesNotMatch(serialized, /</);
  assert.match(serialized, /\\u003c\/script>/);
  assert.doesNotThrow(() => JSON.parse(serialized));
});
