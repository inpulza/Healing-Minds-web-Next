import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const sourceRoots = ["app", "client", "public", "server", "shared"];
const textExtensions = new Set([".html", ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"]);
const unsupportedCaliforniaFinancialClaim = /\b(?:direct|cash)[ -]?pay\b|\bno insurance\b|\bno (?:paperwork|claims|prior authorizations?)\b|\bclear pricing?\b|\bprice is clear\b|\bno surprises\b|\bpago directo\b|\bsin seguros?\b|\bsin (?:tr[aá]mites|reclamos|autorizaciones previas?)\b|\bprecio (?:es )?claro\b|\bsin sorpresas\b/i;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function publicTextFiles() {
  return sourceRoots.flatMap((sourceRoot) => {
    const directory = join(root, sourceRoot);
    if (!existsSync(directory)) return [];
    return walk(directory).filter((file) => textExtensions.has(extname(file)));
  });
}

const forbiddenClaims = [
  ["clinic availability promise", /\b24\/7\b/i],
  ["same-week or flexible scheduling promise", /\bsame[- ]week\b|\bflexible scheduling\b|\bhorarios? flexibles?\b/i],
  ["24-hour response or access-link promise", /\b(?:respond|response)[^.!?\n]{0,35}\b24\s*(?:hours?|hrs?)\b|\b(?:video|telehealth|telesalud)[^.!?\n]{0,45}\b(?:link|enlace)[^.!?\n]{0,35}\b24\s*(?:hours?|hrs?|horas?)\b/i],
  ["exact visit-duration promise", /\b(?:initial evaluation|first (?:visit|appointment)|follow[- ]up|evaluaci[oó]n inicial|primera (?:visita|cita)|seguimiento)[^.!?\n]{0,80}\b\d{1,3}\s*[-–—]\s*\d{1,3}\s*(?:minutes|minutos)\b/i],
  ["HIPAA product guarantee", /\bHIPAA[- ]compliant\b|\bcompatible with HIPAA\b|\bcompatible con HIPAA\b|\bconforme con HIPAA\b/i],
  ["absolute privacy guarantee", /\b100%\s+(?:private|secure|privad[oa]|segur[oa])\b|\b(?:completely|fully|strictly) confidential\b|\bcomplete confidentiality\b|\bconfidencialidad completa\b|\bestrictamente confidencial\b|\b(?:never|nunca) (?:shared|compartid[oa])\b/i],
  ["absolute federal privacy claim", /\bmeets all federal privacy standards\b|\bcumple (?:con )?todos los est[aá]ndares federales de privacidad\b/i],
  ["in-person effectiveness equivalence", /\b(?:same quality|just as|equally) effective as in[- ]person\b|\b(?:misma calidad|igual de|tan) efectiv[oa] que (?:la atenci[oó]n )?presencial\b/i],
  ["unsupported expertise or training", /\bspecialized (?:trauma )?training\b|\bentrenamiento especializado\b|\bmood disorder expertise\b|\bmedication expertise\b|\bwe provide specialized\b|\bspecialized care for\b/i],
  ["unsupported coordination relationship", /\bspecializes? in coordinating\b|\bnos especializamos en coordinar\b|\bensure seamless continuity\b|\bcontinuidad perfecta\b|\bwork closely with (?:local )?(?:therapists|providers|physicians)\b|\btrabajamos estrechamente\b/i],
  ["automatic telehealth flow", /\bmost follow[- ]ups\b|\bla mayor[ií]a de nuestros pacientes\b|\btelehealth keeps the drive optional\b|\bhace opcional el viaje\b|\bonly required when truly needed\b|\bsolo sea necesario\b/i],
  ["automatic hybrid-care flow", /\bfirst (?:visit|appointment) in person[^.!?\n]{0,60}\bthen (?:telehealth|video)\b|\bprimera (?:visita|cita) presencial[^.!?\n]{0,60}\bluego (?:telesalud|video)\b/i],
  ["unsupported quantified outcome", /\b\d+(?:\.\d+)?%\s+(?:of (?:our )?patients?|success rate|improvement|response rate)\b|\b\d+(?:\.\d+)?%\s+(?:de (?:nuestros )?pacientes|de [eé]xito|de mejor[ií]a|de respuesta)\b/i],
  ["promised lasting result", /\blasting relief\b|\balivio duradero\b/i],
  ["unsupported local-population tailoring", /\bunique stressors faced by agricultural workers\b|\bimmigration experiences\b|\bfactores estresantes [uú]nicos que enfrentan los trabajadores agr[ií]colas\b|\bexperiencias de inmigraci[oó]n\b/i],
  ["unsupported treatment or image claim", /\badvanced treatments\b|\btratamientos avanzados\b|\bengaged in consultation with a patient\b|\bdemonstrating compassionate psychiatric care\b/i],
  ["blanket Florida telehealth availability", /\bfrom anywhere in Florida\b|\bdesde cualquier lugar de Florida\b|\bavailable throughout Florida\b|\bdisponible en toda Florida\b/i],
  ["unqualified confidentiality promise", /\b(?:secure and confidential|confidential and secure)\b|\b(?:segur[oa] y confidencial|confidencial y segur[oa])\b|\bkept confidential and secure\b|\bse mantiene confidencial y segura\b/i],
  ["unverified prevalence claim", /\b1 in 5 adults\b|\b1 de cada 5 adultos\b/i],
  ["clinic crisis-service implication", /\bcrisis safety planning\b|\bcrisis intervention support\b|\bplanificaci[oó]n de seguridad en crisis\b|\bapoyo en intervenci[oó]n de crisis\b/i],
  ["wrong state-law reference", /\bNew York\b|\bNueva York\b/i],
  ["medication or dose guarantee", /\b(?:guarantee|ensure)[^.!?\n]{0,120}\b(?:correct|right|optimal)\b[^.!?\n]{0,80}\b(?:medication|dose)\b|\bgarantiza[^.!?\n]{0,120}\b(?:medicaci[oó]n|dosis)\b|\b(?:maximi[sz]e benefits?|minimi[sz]e side effects?)\b|\b(?:maximizar los beneficios|minimizar los efectos secundarios)\b/i],
  ["automatic telehealth availability", /\btelehealth between visits\b|\btelesalud entre visitas\b|\btelehealth the rest of the time\b|\btelesalud segura el resto del tiempo\b|\bno bridge required for follow-ups\b|\bskip the Jolley Bridge\b|\btelehealth is available across Florida\b/i],
  ["unverified telehealth implementation claim", /\bsame HIPAA privacy protections as in-person\b|\bmismas protecciones de privacidad de HIPAA que\b|\bsessions are not recorded\b|\blas sesiones no se graban\b/i],
  ["unconfirmed cancellation or payment policy", /\b24 business hours\b|\b24 horas h[aá]biles\b|\$50\b|\b3%\b[^.!?\n]{0,80}\b(?:card|tarjeta)\b/i],
  ["unconfirmed free language assistance", /\b(?:free|no-cost) language assistance\b|\basistencia ling[uü][ií]stica gratuita\b/i],
  ["unsupported service-area metric", /150,000\+|\bresidents served\b|\bresidentes atendidos\b|\bmax drive time\b|\btiempo m[aá]x(?:imo)?\b/i],
  ["universal service-area telehealth claim", /\btelehealth services available for all service areas\b|\bservicios de telesalud disponibles para todas las [aá]reas\b/i],
  ["practice-level telehealth license claim", /\b(?:our practice is|the practice is) licensed to provide telepsychiatry\b|\bnuestra pr[aá]ctica cuenta con licencia para brindar telepsiquiatr[ií]a\b/i],
  ["website request treated as clinical consent", /\bby requesting and using[^.!?\n]{0,80}\byou consent\b|\bal solicitar y utilizar[^.!?\n]{0,80}\busted consiente\b/i],
  ["unverified Charm clinical-platform claim", /\btelehealth services are provided through[^.!?\n]{0,80}\bCharm Health\b|\bservicios de telesalud se proporcionan a trav[eé]s de[^.!?\n]{0,80}\bCharm Health\b/i],
  ["confirmed telehealth-booking CTA", /\bBook Telehealth\b|\bReservar Telesalud\b|Schedule secure online consultations with Dr\. Melva Reve|Programe consultas seguras en l[ií]nea con la Dra\. Melva Reve|Book Now:\s*telehealth appointment|Reservar Ahora:\s*cita de telesalud/i],
  ["nonvisual telehealth image claim", /\bsecure virtual consultation platform\b|\bDr\. Melva Reve conducting online\b|\btreatment through telehealth\b|\bsecure online psychiatric treatment\b/i],
];

const allowedLinesByPath = new Map([
  ["client/src/data/pageContent/legal/emergencyPolicy.ts", [/\b988\b.*\b24\/7\b/i]],
  ["client/src/data/pageContent/legal/patientRights.ts", [/1-888-419-3456.*24\/7/i]],
  ["client/src/data/locationFAQs.ts", [/do not provide 24\/7 crisis services/i, /no proporcionamos servicios de crisis 24\/7/i]],
  ["client/src/data/pageContent/legal/privacyPolicy.ts", [/no method of Internet transmission is 100% secure/i, /ning[uú]n m[eé]todo de transmisi[oó]n por Internet es 100% seguro/i]],
  ["client/src/data/pageContent/services/adhdTreatment.ts", [/no (?:specific )?medication[^.!?\n]{0,80}(?:dose|benefit|response)[^.!?\n]{0,40}(?:is|are) guaranteed/i, /no se garantiza[^.!?\n]{0,100}(?:medicamento|dosis|beneficio|respuesta)/i]],
]);

function normalizePath(file) {
  return relative(root, file).replaceAll("\\", "/");
}

function isAllowedLine(path, line) {
  return (allowedLinesByPath.get(path) || []).some((pattern) => pattern.test(line));
}

test("public sources reject unsupported medical, privacy and operating claims", () => {
  const violations = [];
  for (const file of publicTextFiles()) {
    const path = normalizePath(file);
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const [label, pattern] of forbiddenClaims) {
        if (pattern.test(line) && !isAllowedLine(path, line)) {
          violations.push(`${path}:${index + 1}: ${label}`);
        }
      }
    });
  }
  assert.deepEqual(violations, []);
});

test("claim guards recognize representative regressions and keep exceptions path-scoped", () => {
  const regressions = [
    "Our clinic is available 24/7.",
    "Same-week appointments with flexible scheduling.",
    "We respond within 24 hours.",
    "Initial evaluation: 40–60 minutes.",
    "Our HIPAA-compliant platform is 100% secure.",
    "Care is equally effective as in-person care.",
    "We provide specialized care for veterans.",
    "We work closely with local therapists.",
    "Telehealth keeps the drive optional.",
    "First appointment in person, then telehealth.",
    "85% of our patients improve.",
    "Expert diagnosis for lasting relief.",
    "New York State law controls copy fees.",
    "Our experience guarantees the correct medication and optimal dose.",
    "Telehealth between visits is available across Florida.",
    "Sessions are not recorded and have the same HIPAA privacy protections as in-person care.",
    "A $50 fee applies without 24 business hours notice.",
    "Free language assistance is available.",
    "150,000+ Residents Served with a 30min Max Drive Time.",
    "Telehealth services available for all service areas.",
    "Our practice is licensed to provide telepsychiatry in Florida and California.",
    "By requesting and using telehealth, you consent to medical care.",
    "Our Telehealth services are provided through a third-party platform, Charm Health.",
    "Book Now: telehealth appointment.",
    "Dr. Melva Reve conducting online treatment through telehealth on a secure virtual consultation platform.",
  ];
  for (const regression of regressions) {
    assert.equal(forbiddenClaims.some(([, pattern]) => pattern.test(regression)), true, regression);
  }
  assert.match(
    "Direct pay with clear pricing and no insurance paperwork.",
    unsupportedCaliforniaFinancialClaim,
  );
  assert.equal(isAllowedLine("elsewhere.ts", "Call 988 for support 24/7."), false);
  assert.equal(
    isAllowedLine("client/src/data/pageContent/legal/emergencyPolicy.ts", "Call 988 for support 24/7."),
    true,
  );
});

test("location copy has no volatile demographic figures or travel times outside the duration source", () => {
  const sources = ["locationHyperlocal.ts", "locationFAQs.ts"].map((name) => ({
    name,
    lines: readFileSync(join(root, "client/src/data", name), "utf8").split(/\r?\n/),
  }));
  const violations = [];
  const demographicPatterns = [
    /\b(?:roughly|about|approximately)\s+[\d,.]+\s+(?:residents?|people)\b/i,
    /\b(?:aproximadamente|cerca de|alrededor de)\s+[\d,.]+\s+(?:residentes?|habitantes?)\b/i,
    /\bmedian age\b|\bedad mediana\b/i,
    /\b\d+(?:\.\d+)?%\b[^\n]*(?:Hispanic|foreign-born|homeownership|households?|seasonal housing)/i,
    /\b\d+(?:\.\d+)?%\b[^\n]*(?:hispan[oa]s?|nacid[oa]s en el extranjero|propietarios?|hogares?|vivienda estacional)/i,
  ];
  const travelTime = /\b\d{1,2}\s*(?:[-–—]\s*\d{1,2}\s*)?(?:minutes|minutos)\b/i;

  for (const source of sources) {
    source.lines.forEach((line, index) => {
      if (source.name === "locationHyperlocal.ts") {
        for (const pattern of demographicPatterns) {
          if (pattern.test(line)) violations.push(`${source.name}:${index + 1}: demographic figure`);
        }
      }
      const isDurationSource = source.name === "locationHyperlocal.ts" && /^\s*duration:\s*/.test(line);
      if (travelTime.test(line) && !isDurationSource) {
        violations.push(`${source.name}:${index + 1}: travel time outside duration`);
      }
    });
  }
  assert.deepEqual(violations, []);
});

test("location copy avoids unsupported promotion, biography and parking promises", () => {
  const source = ["locationFAQs.ts", "locationHyperlocal.ts"]
    .map((name) => readFileSync(join(root, "client/src/data", name), "utf8"))
    .join("\n");
  const promotionalPatterns = [
    /perfect solution|expert care|extensive experience|primary specialt(?:y|ies)|one of our specialties/i,
    /we frequently|strongly recommend|many .* patients|popular with our patients/i,
    /eliminates? (?:the )?(?:need|drive)|ensures? optimal|seamless|safe spaces|all types of/i,
    /specifically tailored|culturally competent|support local mental health initiatives/i,
    /soluci[oó]n perfecta|atenci[oó]n experta|amplia experiencia|especialidades principales/i,
    /una de nuestras especialidades|frecuentemente|recomendamos encarecidamente|muchos pacientes/i,
    /popular entre nuestros pacientes|elimina (?:la )?(?:necesidad|viaje)|garantiza (?:un )?tratamiento [oó]ptimo/i,
    /sin complicaciones|espacios seguros|todo tipo de|adaptad[oa] espec[ií]ficamente|competencia cultural|apoyamos iniciativas/i,
    /free(?:,| and)? (?:easy|convenient|ample)?\s*parking|parking is (?:free|easy|ample)/i,
    /estacionamiento (?:gratuito|gratis|f[aá]cil|amplio|conveniente)/i,
    /one of our (?:main )?specialties|practice specializes|expert (?:care|diagnosis)/i,
    /asegura[^.!?\n]{0,50}[oó]ptimo|our .* patients (?:ask|use)|patients ask about most/i,
    /frequent request|solicitud frecuente|prescriptions sent|recetas enviadas/i,
    /active 65\+ majority|mayor[ií]a activa de 65\+|largely retired|en su mayor[ií]a jubilados/i,
    /tailor[^.!?\n]{0,50}unique needs|adaptamos[^.!?\n]{0,50}necesidades [uú]nicas/i,
    /nuestra pr[aá]ctica[^.!?\n]{0,30}se especializa|perfect[oa]s? para|atenci[oó]n psiqui[aá]trica experta/i,
    /recomendamos (?:en[eé]rgicamente|encarecidamente)|without the drive|sin (?:el )?viaje/i,
    /fully bilingual[^.!?\n]{0,100}culturally sensitive|popular(?:es)?[^.!?\n]{0,60}(?:patients?|pacientes)/i,
    /our[^.!?\n]{0,80}patients[^.!?\n]{0,40}(?:ask|use)|pacientes[^.!?\n]{0,40}(?:solicitan|consultan|usan)/i,
    /active 55\+|comunidad activa 55\+|55\+ community focus|enfoque en comunidad 55\+/i,
    /young[^.!?\n]{0,30}agricultural community|comunidad agr[ií]cola[^.!?\n]{0,30}joven/i,
    /support for university students|college-age anxiety care|apoyo para estudiantes universitarios/i,
  ];
  for (const pattern of promotionalPatterns) assert.doesNotMatch(source, pattern);
});

test("California campaign copy does not pre-assign clinician, price or modality", () => {
  const manifest = JSON.parse(readFileSync(join(root, "shared/seo-manifest.json"), "utf8"));
  const locationFaqs = readFileSync(join(root, "client/src/data/locationFAQs.ts"), "utf8");
  const legacy = readFileSync(join(root, "server/utils/html-injection.ts"), "utf8");
  const slice = (value, start, end) => {
    const startIndex = value.indexOf(start);
    const endIndex = value.indexOf(end, startIndex + start.length);
    assert.ok(startIndex >= 0 && endIndex > startIndex, `missing California source markers: ${start} -> ${end}`);
    return value.slice(startIndex, endIndex);
  };
  const legacyFallbackStart = legacy.lastIndexOf("case '/psychiatrist-california':");
  const legacyFallbackEnd = legacy.indexOf("    default:", legacyFallbackStart);
  assert.ok(legacyFallbackStart >= 0 && legacyFallbackEnd > legacyFallbackStart, "missing legacy California fallback");
  const californiaSources = new Map([
    ["campaign page", readFileSync(join(root, "client/src/pages/PsiquiatraCalifornia.tsx"), "utf8")],
    ["California FAQ", locationFaqs.slice(locationFaqs.indexOf("californiaTelehealth:"))],
    ["California manifest", JSON.stringify({
      en: manifest["/psychiatrist-california"],
      es: manifest["/es/psiquiatra-california"],
    })],
    ["legacy California metadata", slice(legacy, "// California landing pages (EN + ES)", "// Legal policy pages (EN)")],
    ["legacy California schema", slice(legacy, "function getCaliforniaServiceSchema", "async function getBlogSchema")],
    ["legacy California fallback", legacy.slice(legacyFallbackStart, legacyFallbackEnd)],
  ]);
  const source = [...californiaSources.values()].join("\n");
  for (const pattern of [
    /A Doctor, Not an App|Una Doctora, No una Aplicaci[oó]n/i,
    /You Know What You Will Pay|Sabes lo que Vas a Pagar/i,
    /From Your Home, No Commute|Desde Tu Casa, Sin Desplazarte/i,
    /Talk to Dr\. Reve|Habla con la Dra\. Reve/i,
    /direct psychiatric care|atenci[oó]n psiqui[aá]trica directa/i,
  ]) assert.doesNotMatch(source, pattern);
  for (const [label, californiaSource] of californiaSources) {
    assert.doesNotMatch(californiaSource, unsupportedCaliforniaFinancialClaim, label);
  }
  assert.match(source, /office confirms the treating professional, price, modality, availability/i);
  assert.match(source, /oficina confirma el profesional tratante, precio, modalidad, disponibilidad/i);
});

test("every literal practice address preserves the canonical suite", () => {
  const violations = [];
  for (const file of publicTextFiles()) {
    const path = normalizePath(file);
    if (["shared/reviews-snapshot.json", "shared/tiktok-snapshot.json", "shared/public-claims-sources.json"].includes(path)) continue;
    readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
      if (/4760 Tamiami (?:Trl|Trail) N/i.test(line) && !/#\s*25\b/i.test(line)) {
        violations.push(`${path}:${index + 1}`);
      }
    });
  }
  assert.deepEqual(violations, []);
});

test("CharmHealth booking is a request, not a statewide availability promise", () => {
  const source = readFileSync(join(root, "client/src/components/CharmHealthBooking.tsx"), "utf8");
  assert.doesNotMatch(source, /Book Telehealth Appointment|Schedule Now|from anywhere in Florida|desde cualquier lugar de Florida/i);
  assert.match(source, /Request a Telehealth Appointment/);
  assert.match(source, /office confirms the treating professional, patient location, licensing, clinical suitability and availability/i);
});

test("lazy service-area copy exposes one Naples office without invented reach metrics", () => {
  const source = readFileSync(join(root, "client/src/components/ServiceAreas.tsx"), "utf8");
  assert.doesNotMatch(source, /population\s*:|\b\d{1,3}\s*(?:min|minutes|minutos)\b|coverage locations/i);
  assert.doesNotMatch(source, /150,000\+|Residents Served|Max Drive Time|Telehealth services available for all service areas/i);
  assert.match(source, /has one physical office in Naples/);
  assert.match(source, /tiene una sola oficina física en Naples/);
  assert.match(source, /telehealth eligibility are confirmed case by case/);
  assert.match(source, /elegibilidad para telesalud se confirman caso por caso/);
});

test("telehealth legal copy assigns licensure and consent to the treating professional", () => {
  const consent = readFileSync(join(root, "client/src/data/pageContent/legal/telehealthConsent.ts"), "utf8");
  const terms = readFileSync(join(root, "client/src/data/pageContent/legal/termsOfService.ts"), "utf8");
  const source = `${consent}\n${terms}`;
  assert.doesNotMatch(source, /our practice is licensed to provide telepsychiatry|nuestra pr[aá]ctica cuenta con licencia para brindar telepsiquiatr[ií]a/i);
  assert.doesNotMatch(source, /By requesting and using[^.!?\n]{0,80}you consent|Al solicitar y utilizar[^.!?\n]{0,80}usted consiente/i);
  assert.doesNotMatch(source, /Telehealth services are provided through[^.!?\n]{0,80}Charm Health|servicios de Telesalud se proporcionan a trav[eé]s de[^.!?\n]{0,80}Charm Health/i);
  assert.match(consent, /treating professional must be authorized to practice where the patient is physically located/);
  assert.match(consent, /website request does not by itself establish a provider-patient relationship/);
  assert.match(terms, /Submitting a website request does not establish a provider-patient relationship or constitute clinical consent/);
  assert.match(terms, /Charm Health is linked from this Website as an appointment-request portal/);
});

test("home service ticker does not present the clinic as a crisis-intervention provider", () => {
  const home = readFileSync(join(root, "client/src/data/pageContent/mainPages/home.ts"), "utf8");
  assert.doesNotMatch(home, /Crisis Intervention|Intervenci[oó]n de Crisis/i);
  assert.match(home, /Psychiatric Evaluation/);
  assert.match(home, /Evaluaci[oó]n Psiqui[aá]trica/);
});

test("global and location telehealth actions submit requests rather than confirmed bookings", () => {
  const source = [
    "client/src/components/Footer.tsx",
    "client/src/components/Header.tsx",
    "client/src/components/MobileToolbar.tsx",
    "client/src/components/CharmHealthBooking.tsx",
    "client/src/data/translations.ts",
    ...readdirSync(join(root, "client/src/pages"))
      .filter((name) => /^Location.*\.tsx$/.test(name))
      .map((name) => `client/src/pages/${name}`),
  ].map((path) => readFileSync(join(root, path), "utf8")).join("\n");
  assert.doesNotMatch(source, /Book Telehealth|Reservar Telesalud|Schedule secure online consultations|Programe consultas seguras en l[ií]nea|\bBook Now\b|\bReservar Ahora\b/i);
  assert.match(source, /Request a Telehealth Appointment/);
  assert.match(source, /Solicitar una Cita de Telesalud/);
  assert.match(source, /Request Telehealth/);
  assert.match(source, /Solicitar Telesalud/);
});

test("telepsychiatry image alternatives stay visual and do not imply confirmed care", () => {
  const source = [
    "client/src/components/CharmHealthBooking.tsx",
    "client/src/pages/TelepsychiatryFlorida.tsx",
  ].map((path) => readFileSync(join(root, path), "utf8")).join("\n");
  assert.doesNotMatch(source, /secure virtual consultation platform|Dr\. Melva Reve conducting online|treatment through telehealth|secure online psychiatric treatment|Ongoing psychiatric care through telehealth/i);
  assert.match(source, /Dr\. Melva Reve in a medical office/);
  assert.match(source, /Adult using a laptop at home/);
  assert.match(source, /Profesional clínico revisando un formulario de evaluación/);
});

test("billing policy renders the current number of written paragraphs without stale indexes", () => {
  const page = readFileSync(join(root, "client/src/pages/BillingPolicy.tsx"), "utf8");
  assert.match(page, /s\('credit-card'\)\.paragraphs!\.map/);
  assert.doesNotMatch(page, /s\('credit-card'\)\.paragraphs!\[[12]\]/);
});

test("cancellation policy renders its current written introduction without stale indexes", () => {
  const page = readFileSync(join(root, "client/src/pages/CancellationPolicy.tsx"), "utf8");
  assert.match(page, /s\('intro'\)\.paragraphs!\.map/);
  assert.doesNotMatch(page, /s\('intro'\)\.paragraphs!\[1\]/);
});
