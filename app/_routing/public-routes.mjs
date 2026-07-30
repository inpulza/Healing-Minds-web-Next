/**
 * Statically-known public routes from the legacy router.
 *
 * Keep this module free of React and Next imports: it is the single, testable
 * allowlist used by both App Router entrypoints and static-param generation.
 */

const page = (pathname, pageName) =>
  Object.freeze({
    pathname,
    page: pageName,
    locale: pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en",
  });

const redirect = (pathname, redirectTo) =>
  Object.freeze({ pathname, redirectTo, locale: "en" });

const routeDefinitions = [
  page("/", "Home"),
  page("/about", "About"),
  page("/services", "Services"),
  page("/for-patients", "ForPatients"),
  page("/telepsychiatry-florida", "TelepsychiatryFlorida"),
  page("/psychiatrist-california", "PsiquiatraCalifornia"),
  redirect("/locations/naples", "/locations/psychiatrist-naples"),
  page("/locations/psychiatrist-naples", "LocationNaples"),
  page("/locations/psychiatrist-bonita-springs", "LocationBonitaSprings"),
  page("/locations/psychiatrist-marco-island", "LocationMarcoIsland"),
  page("/locations/psychiatrist-estero", "LocationEstero"),
  page("/locations/psychiatrist-golden-gate", "LocationGoldenGate"),
  page("/locations/psychiatrist-immokalee", "LocationImmokalee"),
  page("/locations/psychiatrist-vanderbilt-beach", "LocationVanderbiltBeach"),
  page("/locations/psychiatrist-ave-maria", "LocationAveMaria"),
  page("/locations/psychiatrist-fort-myers", "LocationFortMyers"),
  page("/locations/psychiatrist-lely-resort", "LocationLelyResorts"),
  page("/es/ubicaciones/psiquiatra-naples", "LocationNaples"),
  page("/es/ubicaciones/psiquiatra-bonita-springs", "LocationBonitaSprings"),
  page("/es/ubicaciones/psiquiatra-marco-island", "LocationMarcoIsland"),
  page("/es/ubicaciones/psiquiatra-estero", "LocationEstero"),
  page("/es/ubicaciones/psiquiatra-golden-gate", "LocationGoldenGate"),
  page("/es/ubicaciones/psiquiatra-immokalee", "LocationImmokalee"),
  page("/es/ubicaciones/psiquiatra-vanderbilt-beach", "LocationVanderbiltBeach"),
  page("/es/ubicaciones/psiquiatra-ave-maria", "LocationAveMaria"),
  page("/es/ubicaciones/psiquiatra-fort-myers", "LocationFortMyers"),
  page("/es/ubicaciones/psiquiatra-lely-resort", "LocationLelyResorts"),
  page("/contact", "Contact"),
  page("/blog", "BlogIndex"),
  page("/es/blog", "BlogIndex"),
  page("/blog/bipolar-medication-follow-up-questions", "BlogPost"),
  page("/blog/understanding-anxiety-treatment-naples", "BlogPost"),
  page("/es/blog/tratamiento-ansiedad-naples", "BlogPost"),
  page("/es", "HomeEspanol"),
  page("/es/acerca-de", "AcercaEspanol"),
  page("/es/contacto", "ContactoEspanol"),
  page("/es/para-pacientes", "ParaPacientesEspanol"),
  page("/es/servicios", "ServiciosEspanol"),
  page("/es/telepsiquiatria-florida", "TelepsychiatryFlorida"),
  page("/es/psiquiatra-california", "PsiquiatraCalifornia"),
  page("/services/anxiety-treatment", "AnxietyTreatment"),
  page("/services/depression-treatment", "DepressionTreatment"),
  page("/services/adhd-treatment", "AdhdTreatment"),
  page("/services/ptsd-treatment", "PtsdTreatment"),
  page("/services/bipolar-treatment", "BipolarTreatment"),
  page("/services/medication-management", "MedicationManagement"),
  page("/es/servicios/tratamiento-ansiedad", "AnxietyTreatment"),
  page("/es/servicios/tratamiento-depresion", "DepressionTreatment"),
  page("/es/servicios/tratamiento-adhd", "AdhdTreatment"),
  page("/es/servicios/tratamiento-tept", "PtsdTreatment"),
  page("/es/servicios/tratamiento-bipolar", "BipolarTreatment"),
  page("/es/servicios/manejo-medicamentos", "MedicationManagement"),
  page("/privacy-policy", "PrivacyPolicy"),
  page("/terms-of-service", "TermsOfService"),
  page("/hipaa-notice", "HipaaNotice"),
  page("/cookie-policy", "CookiePolicy"),
  page("/cancellation-policy", "CancellationPolicy"),
  page("/billing-policy", "BillingPolicy"),
  page("/emergency-policy", "EmergencyPolicy"),
  page("/patient-rights", "PatientRights"),
  page("/telehealth-consent", "TelehealthConsent"),
  page("/no-surprises-act", "NoSurprisesAct"),
  page("/accessibility-statement", "AccessibilityStatement"),
  page("/nondiscrimination-notice", "NondiscriminationNotice"),
  page("/communications-policy", "CommunicationsPolicy"),
  page("/medical-disclaimer", "MedicalDisclaimer"),
  page("/es/politica-privacidad", "PrivacyPolicy"),
  page("/es/terminos-servicio", "TermsOfService"),
  page("/es/aviso-hipaa", "HipaaNotice"),
  page("/es/politica-cookies", "CookiePolicy"),
  page("/es/politica-cancelacion", "CancellationPolicy"),
  page("/es/politica-facturacion", "BillingPolicy"),
  page("/es/politica-emergencias", "EmergencyPolicy"),
  page("/es/derechos-paciente", "PatientRights"),
  page("/es/consentimiento-telesalud", "TelehealthConsent"),
  page("/es/ley-sin-sorpresas", "NoSurprisesAct"),
  page("/es/declaracion-accesibilidad", "AccessibilityStatement"),
  page("/es/aviso-no-discriminacion", "NondiscriminationNotice"),
  page("/es/politica-comunicaciones", "CommunicationsPolicy"),
  page("/es/descargo-responsabilidad-medica", "MedicalDisclaimer"),
];

const routesByPath = new Map(routeDefinitions.map((route) => [route.pathname, route]));

if (routesByPath.size !== routeDefinitions.length) {
  throw new Error("Duplicate pathname in the public route allowlist");
}

export const publicRoutePaths = Object.freeze(routeDefinitions.map(({ pathname }) => pathname));

export const publicRouteParams = Object.freeze(
  publicRoutePaths
    .filter((pathname) => pathname !== "/")
    .map((pathname) => Object.freeze({ slug: Object.freeze(pathname.slice(1).split("/")) })),
);

export function resolvePublicRoute(pathname) {
  if (typeof pathname !== "string") return null;
  return routesByPath.get(pathname) ?? null;
}
