const englishMonthPattern = String.raw`(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*`;
const spanishMonthPattern = String.raw`(?:ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sept?(?:iembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?)`;
const datePattern = String.raw`(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|${englishMonthPattern}\.?\s+\d{1,2},?\s+\d{2,4}|\d{1,2}\s+(?:de\s+)?${spanishMonthPattern}\.?(?:\s+de)?\s+\d{2,4})`;
const titleCaseNameToken = String.raw`(?:\p{Lu}[\p{Ll}\p{M}]+(?:[-'’]\p{Lu}?[\p{Ll}\p{M}]+)*|\p{Lu}['’]\p{Lu}[\p{Ll}\p{M}]+)`;
const uppercaseNameToken = String.raw`(?:\p{Lu}{2,}|\p{Lu}+(?:[-'’]\p{Lu}+)+)`;
const nameToken = String.raw`(?:${titleCaseNameToken}|${uppercaseNameToken})`;
const lowercaseNameToken = String.raw`\p{Ll}[\p{Ll}\p{M}'’\-]*`;
const nameInitial = String.raw`\p{Lu}\.`;
const nameConnector = String.raw`(?:de(?:\s+la)?|del|da|dos|van|von)`;
const namePattern = String.raw`${nameToken}(?:\s+(?:${nameInitial}|(?:${nameConnector}\s+)?${nameToken})){1,3}`;
const labeledNameToken = String.raw`\p{L}[\p{L}\p{M}'’\-]*`;
const labeledNamePattern = String.raw`${labeledNameToken}(?:\s+${labeledNameToken}){0,3}`;
// Administrative AI inputs are fail-closed: editors must describe public topics
// without patient/name markers. Published content still uses the narrower detector.
const explicitSensitiveAiMarkerPattern = /\b(?:patient|paciente|client|cliente|name|nombre)\b/iu;
const explicitPluralSensitiveAiLabelPattern = /\b(?:patients|pacientes|clients|clientes|names|nombres)\s*[:#=-]/iu;
const explicitSensitiveAiContactLabelPattern = /\b(?:phone(?:\s+number)?|telephone(?:\s+number)?|mobile|cell|tel[eé]fono|m[oó]vil|celular)(?:\s*[:#=-]|\s+(?:number|n[uú]mero)\b)/iu;
const headingConnectorTokens = new Set([
  "a", "across", "after", "against", "along", "amid", "among", "and", "antes",
  "around", "as", "at", "bajo", "before", "behind", "below", "beneath", "beside",
  "between", "beyond", "but", "by", "con", "contra", "de", "del", "desde",
  "despues", "during", "durante", "en", "entre", "for", "from", "hasta", "hacia",
  "el", "in", "inside", "into", "la", "las", "like", "los", "near", "nor", "o", "of",
  "off", "on", "onto", "or", "out", "outside", "over", "para", "pero", "por",
  "segun", "sin", "sobre", "the", "through", "throughout", "till", "to", "toward",
  "under", "underneath", "until", "versus", "via", "vs", "with", "within",
  "without", "y",
]);
const patientEditorialLeadTokens = new Set([
  "access", "adherence", "advocacy", "adult", "adults", "affordability", "anxiety", "are", "asked", "assessment", "autonomy", "barriers", "behavioral", "bipolar", "called", "can",
  "care", "centered", "chronic", "clinical", "communication", "community", "compliance", "confidentiality", "consent", "contacted", "data", "depression", "disclosed", "education", "emailed", "empowerment", "engagement", "evaluation",
  "experience", "family", "feedback", "feels", "financial", "follow-up", "has", "have", "hipaa", "housing", "insurance", "is", "legal", "literacy", "medication", "mental", "monitoring", "mood", "navigation", "needs",
  "options", "outcomes", "portal", "privacy", "protection", "protections", "psychiatric", "ptsd", "receives", "resources", "retention", "rights", "safety", "satisfaction", "screening", "social",
  "reported", "requested", "said", "scheduled", "services", "should", "sleep", "started", "stopped", "stress", "support", "therapy", "transportation", "trauma", "treatment", "trust",
  "telehealth", "was", "wellness", "were",
  "acceso", "adherencia", "adulto", "adultos", "ansiedad", "apoyo", "asequibilidad", "atencion", "autonomia", "barreras", "bipolar", "bienestar",
  "clinica", "clinico", "comunicacion", "comunitaria", "comunitario", "confidencialidad", "consentimiento", "contacto", "cumplimiento", "cuidado", "datos", "dejo", "depresion", "derechos", "dijo",
  "educacion", "empoderamiento", "empezo", "entienda", "entiende", "es", "esta", "estan", "evaluacion", "experiencia", "familia", "financiero", "llamo", "medicacion", "mental", "monitoreo", "navegacion", "necesita", "pidio", "portal",
  "opciones", "privacidad", "proteccion", "puede", "pueden", "psiquiatrica", "psiquiatrico", "recibe", "recursos", "resultados", "retencion",
  "quiere", "reporto", "salud", "satisfaccion", "seguridad", "seguimiento", "servicios", "solicito", "sueno", "telepsiquiatria", "terapia", "transporte", "trauma", "tratamiento",
]);
const ambiguousModalLeadTokens = new Set(["may", "will"]);
const modalContinuationTokens = new Set([
  "access", "also", "be", "benefit", "experience", "feel", "find", "have", "need",
  "not", "often", "receive", "require", "see", "sometimes", "want",
]);
const identityNarrativeLeadTokens = new Set([
  "asked", "called", "contacted", "emailed", "gave", "has", "identified", "is",
  "mentioned", "met", "named", "provided", "reported", "requested", "said", "saw",
  "scheduled", "sent", "spoke", "told", "was", "wrote",
  "conocio", "contacto", "conto", "dio", "dijo", "es", "escribio", "identifico",
  "llamo", "menciono", "proporciono", "refirio", "remitio", "reporto", "solicito", "vio",
]);
const movementNarrativeLeadTokens = new Set([
  "lives", "living", "moved", "moving", "navigating", "relocated", "relocating",
  "traveling", "travelling",
]);
const patientNarrativeSegmentPattern = /\b(?:patient|paciente)\b\s+([^,.;:]{1,160})/giu;
const patientEditorialHeadingPattern = new RegExp(
  String.raw`^(?:guides?|perspectives?|overview|introduction|approaches?|gu[ií]as?|perspectivas?|introducci[oó]n|enfoques?)\s+(?:to|for|from|on|about|of|a|para|de|desde|sobre)\b`,
  "iu",
);
const laterFullPatientNamePattern = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}])["“'‘(«]*${namePattern}["”'’»)]*(?=$|[^\p{L}\p{M}])`,
  "u",
);
const laterWrappedPatientNamePattern = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}])["“'‘(«]+(?:${namePattern}|${nameToken})["”'’»)]+(?=$|[^\p{L}\p{M}])`,
  "u",
);
const laterTitleCaseTokenPattern = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}])(${titleCaseNameToken})(?=$|[^\p{L}\p{M}])`,
  "gu",
);
const directionalGeographyPattern = new RegExp(
  String.raw`^(?:[Nn]orth|[Ss]outh|[Ee]ast|[Ww]est|[Cc]entral|[Nn]ortheast|[Nn]orthwest|[Ss]outheast|[Ss]outhwest)\s+${titleCaseNameToken}\b`,
  "u",
);
const prepositionalGeographyPattern = new RegExp(
  String.raw`(?:^|\s)(?:to|in|from|across|through|within|around|near|toward|towards|into|outside(?:\s+of)?|a|en|desde|hacia|cerca\s+de|dentro\s+de|fuera\s+de)\s+${namePattern}(?=$|\s)`,
  "u",
);
const geographyWithEditorialSuffixPattern = new RegExp(
  String.raw`(?:^|\s)${namePattern}\s+(?:resources|services|providers|care|law|locations?|region|area|communities|adults|coverage|clinics|recursos|servicios|proveedores|atenci[oó]n|ley|ubicaciones?|regi[oó]n|[aá]rea|comunidades|adultos|cobertura|cl[ií]nicas)\b`,
  "u",
);
const geographyWithEditorialPrefixPattern = new RegExp(
  String.raw`(?:^|\s)(?:resources|services|providers|care|coverage|clinics|recursos|servicios|proveedores|atenci[oó]n|cobertura|cl[ií]nicas)\s+(?:in|to|from|across|through|within|around|near|toward|towards|into|outside(?:\s+of)?|a|en|desde|hacia|cerca\s+de|dentro\s+de|fuera\s+de)\s+${namePattern}(?=$|\s)`,
  "u",
);
const incompleteGeographyFragmentPattern = /^(?:(?:lives?|living|moving|relocated|relocating|traveling|travelling|reviewed|discussed|se\s+mud[oó]|vive|viviendo|busca(?:ndo)?|revis[oó]|revisa)(?:\s+\p{L}+){0,4}\s+(?:in|to|toward|towards|into|outside(?:\s+of)?|a|en|desde|hacia|cerca\s+de|dentro\s+de|fuera\s+de))\s*$/iu;
const explicitlyDeclaredPatientNamePattern = new RegExp(
  String.raw`(?:^|\s)["“'‘(«]*${labeledNamePattern}["”'’»)]*\s+(?:as\s+(?:(?:her|his|their|my|our|your|the|the\s+patient(?:'s|’s))\s+)?(?:(?:full|legal|preferred)\s+)?name(?:\s+(?:full|legal|preferred))?|como\s+(?:(?:su|mi|nuestro|nuestra|tu|el|la)\s+)?(?:(?:completo|legal|preferido)\s+)?nombre(?:\s+(?:completo|legal|preferido))?)\b`,
  "iu",
);

function normalizeLowercaseToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}]/gu, "")
    .toLocaleLowerCase();
}

function containsExplicitSensitiveAiMarker(value: string): boolean {
  const tokenized = value
    .replace(/_/g, " ")
    .replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2");
  return explicitSensitiveAiMarkerPattern.test(tokenized)
    || explicitPluralSensitiveAiLabelPattern.test(tokenized)
    || explicitSensitiveAiContactLabelPattern.test(tokenized);
}

function containsInternationalPhoneNumber(value: string): boolean {
  return [...value.matchAll(/(?:\+|00)\s*\d[\d().\s-]{5,24}\d/gu)]
    .some(match => {
      const digitCount = (match[0].match(/\d/g) || []).length;
      return digitCount >= 7 && digitCount <= 15;
    });
}

function isPatientGeographicNarrative(narrative: string): boolean {
  const [rawLead = "", ...remainderTokens] = narrative.split(/\s+/);
  const normalizedLead = normalizeLowercaseToken(rawLead);
  const narrativeRemainder = remainderTokens.join(" ");
  const hasIncompleteGeography = incompleteGeographyFragmentPattern.test(narrative);
  const hasDirectionalGeography = directionalGeographyPattern.test(narrativeRemainder);
  const hasPrepositionalGeography = prepositionalGeographyPattern.test(narrativeRemainder);
  const hasEditorialGeographySuffix = geographyWithEditorialSuffixPattern.test(narrativeRemainder);
  const hasEditorialGeographyPrefix = geographyWithEditorialPrefixPattern.test(narrativeRemainder);
  if (
    hasIncompleteGeography
    || hasDirectionalGeography
    || hasEditorialGeographySuffix
    || hasEditorialGeographyPrefix
  ) return true;
  if (movementNarrativeLeadTokens.has(normalizedLead) && hasPrepositionalGeography) return true;
  const hasIdentityAction = identityNarrativeLeadTokens.has(normalizedLead)
    || /(?:ed|ó)$/iu.test(rawLead.replace(/[^\p{L}\p{M}]/gu, ""));
  if (hasIdentityAction) return false;
  return hasPrepositionalGeography;
}

function containsLaterNamedPatientNarrative(value: string): boolean {
  return [...value.matchAll(patientNarrativeSegmentPattern)]
    .some(match => {
      const narrative = (match[1] || "").trim();
      if (patientEditorialHeadingPattern.test(narrative)) return false;
      if (isPatientGeographicNarrative(narrative)) return false;
      if (explicitlyDeclaredPatientNamePattern.test(narrative)) return true;
      const [rawLead = "", ...remainderTokens] = narrative.split(/\s+/);
      const narrativeRemainder = remainderTokens.join(" ");
      const hasDiacriticMononym = [...narrativeRemainder.matchAll(laterTitleCaseTokenPattern)]
        .some(tokenMatch => /\p{M}/u.test((tokenMatch[1] || "").normalize("NFD")));
      const normalizedLead = normalizeLowercaseToken(rawLead);
      const permitsUnwrappedName = !patientEditorialLeadTokens.has(normalizedLead)
        || identityNarrativeLeadTokens.has(normalizedLead)
        || /(?:ed|ó)$/iu.test(rawLead.replace(/[^\p{L}\p{M}]/gu, ""));
      return laterWrappedPatientNamePattern.test(narrativeRemainder)
        || (permitsUnwrappedName && (
          laterFullPatientNamePattern.test(narrativeRemainder)
          || hasDiacriticMononym
        ));
    });
}

function containsIdentifierAcrossAiFieldBoundaries(fields: string[]): boolean {
  const boundaryEditorialLeadTokens = new Set([
    ...headingConnectorTokens,
    ...patientEditorialLeadTokens,
    "guide", "guides", "how", "identity", "journey", "managing", "overview",
    "perspectives", "terms", "understanding", "what", "when", "where", "which",
    "who", "whose", "why",
  ]);
  const strongNameLabelAtEnd = new RegExp(
    String.raw`(?:\b(?:(?:patient|paciente)\s+(?:name|nombre)|nombre\s+(?:del\s+)?paciente|(?:(?:full|legal|preferred)\s+){1,2}name|name(?:\s+(?:full|legal|preferred)){1,2}|nombre(?:\s+(?:completo|legal|preferido)){1,2})\s*[:#-]?|\b(?:patient|paciente|case|caso)\s*[:#-])\s*$`,
    "iu",
  );
  const genericNameLabelAtEnd = /\b(?:name|nombre)\s*[:#-]?\s*$/iu;
  const nameValueAtStart = new RegExp(
    String.raw`^\s*["“'‘(«]*(${labeledNamePattern})["”'’»)]*(?=$|[^\p{L}\p{M}])`,
    "iu",
  );
  const pluralPatientLabelWithSeparatorAtEnd = /\b(?:patients|pacientes)\s*[:#=-]\s*$/iu;
  const pluralPatientLabelBareAtEnd = /\b(?:patients|pacientes)\s*$/iu;
  const pluralNameLabelWithSeparatorAtEnd = /\b(?:names|nombres)\s*[:#=-]\s*$/iu;
  const pluralNameLabelBareAtEnd = /\b(?:names|nombres)\s*$/iu;
  const pluralNameSeparatedValueAtStart = new RegExp(
    String.raw`^\s*[:#=-]\s*["“'‘(«]*(${labeledNamePattern})["”'’»)]*(?=$|[^\p{L}\p{M}])`,
    "iu",
  );
  const birthDateLabelAtEnd = /\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\s*[:#-]?\s*$/iu;
  const birthDateValueAtStart = new RegExp(String.raw`^\s*${datePattern}\b`, "iu");
  const medicalIdLabelAtEnd = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|ssn|social security number|historia cl[ií]nica|n[uú]mero de paciente|id de paciente)\s*[:#-]?\s*$/iu;
  const medicalIdValueAtStart = /^\s*[A-Z0-9-]{4,}\b/iu;
  const emailLabelAtEnd = /\b(?:email|e-mail|correo electr[oó]nico)\s*[:#-]?\s*$/iu;
  const emailValueAtStart = /^\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu;
  const phoneLabelAtEnd = /\b(?:phone|telephone|mobile|cell|tel[eé]fono|m[oó]vil|celular)\s*[:#-]?\s*$/iu;
  const phoneValueAtStart = /^\s*(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/u;
  const completePhoneValue = /^\s*(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\s*$/u;
  const phoneFragment = /^(?=.*[\d+().-])[+\d().\s-]+$/u;
  const addressLabelAtEnd = /\b(?:address|street address|direcci[oó]n)\s*[:#-]?\s*$/iu;
  const addressValueAtStart = /^\s*\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\b/iu;
  const completeAddressValue = /^\s*\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\.?\s*$/iu;
  const completeAddressTail = /^\s*[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\.?\s*$/iu;
  const houseNumberOnly = /^\s*\d{1,6}\s*$/u;
  const streetSuffixOnly = /^\s*(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\.?\s*$/iu;
  const trailingPhoneFragment = /(?:^|[^\d])([+\d().-][\d().\s-]{0,23})\s*$/u;
  const leadingPhoneFragment = /^\s*([+\d().-][\d().\s-]{0,23})/u;
  const trailingAddressBody = /(?:^|[^\d])(\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5})\s*$/iu;
  const trailingHouseNumber = /(?:^|[^\d])(\d{1,6})\s*$/u;
  const patientMarkerAtEnd = /\b(patient|paciente)\s*$/iu;
  const rightLeadAtStart = /^\s*(\p{L}[\p{L}\p{M}'’\-]*)/u;

  const hasLikelyNameValueAtStart = (value: string): boolean => {
    const candidate = nameValueAtStart.exec(value)?.[1] || "";
    const firstToken = candidate.split(/\s+/)[0] || "";
    return Boolean(candidate)
      && !boundaryEditorialLeadTokens.has(normalizeLowercaseToken(firstToken));
  };
  const hasLikelySeparatedNameValueAtStart = (value: string): boolean => {
    const candidate = pluralNameSeparatedValueAtStart.exec(value)?.[1] || "";
    const firstToken = candidate.split(/\s+/)[0] || "";
    return Boolean(candidate)
      && !boundaryEditorialLeadTokens.has(normalizeLowercaseToken(firstToken));
  };

  const hasUnlabeledAdjacentIdentifier = fields.some((_, start) => (
    [2, 3].some(windowSize => {
      const window = fields.slice(start, start + windowSize);
      if (window.length !== windowSize) return false;
      const combined = window.join(" ");
      const compact = window.join("");
      const individualFieldsAreClean = window.every(value => !containsLikelyPatientIdentifier(value));
      if (!individualFieldsAreClean) return false;
      const splitPhoneFromWholeFields = window.every(value => phoneFragment.test(value))
        && (
          completePhoneValue.test(combined)
          || completePhoneValue.test(compact)
          || containsInternationalPhoneNumber(combined)
          || containsInternationalPhoneNumber(compact)
        );
      const extractedPhoneParts = [
        trailingPhoneFragment.exec(window[0])?.[1] || "",
        ...window.slice(1, -1),
        leadingPhoneFragment.exec(window[window.length - 1])?.[1] || "",
      ];
      const extractedPhone = extractedPhoneParts.join(" ");
      const extractedPhoneCompact = extractedPhoneParts.join("");
      const splitPhoneFromBoundaryFragments = extractedPhoneParts.every(value => phoneFragment.test(value))
        && (
          completePhoneValue.test(extractedPhone)
          || completePhoneValue.test(extractedPhoneCompact)
          || containsInternationalPhoneNumber(extractedPhone)
          || containsInternationalPhoneNumber(extractedPhoneCompact)
        );
      const splitAddressFromWholeFields = completeAddressValue.test(combined)
        && (houseNumberOnly.test(window[0]) || streetSuffixOnly.test(window[window.length - 1]));
      const extractedAddressBody = trailingAddressBody.exec(window[0])?.[1] || "";
      const extractedHouseNumber = trailingHouseNumber.exec(window[0])?.[1] || "";
      const addressRemainder = window.slice(1).join(" ");
      const splitAddressFromBoundaryFragments = (
        Boolean(extractedAddressBody)
        && streetSuffixOnly.test(window[window.length - 1])
        && completeAddressValue.test(`${extractedAddressBody} ${addressRemainder}`)
      ) || (
        Boolean(extractedHouseNumber)
        && completeAddressTail.test(addressRemainder)
        && completeAddressValue.test(`${extractedHouseNumber} ${addressRemainder}`)
      );
      return splitPhoneFromWholeFields
        || splitPhoneFromBoundaryFragments
        || splitAddressFromWholeFields
        || splitAddressFromBoundaryFragments;
    })
  ));
  if (hasUnlabeledAdjacentIdentifier) return true;

  for (let boundary = 1; boundary < fields.length; boundary += 1) {
    const left = fields.slice(0, boundary).join(" ").trim();
    const right = fields.slice(boundary).join(" ").trim();
    const rightCompact = right.replace(/\s+/g, "");
    const patientMarker = patientMarkerAtEnd.exec(left)?.[1];
    const normalizedRightLead = normalizeLowercaseToken(rightLeadAtStart.exec(right)?.[1] || "");
    const hasSplitPatientNarrative = Boolean(patientMarker)
      && Boolean(normalizedRightLead)
      && !headingConnectorTokens.has(normalizedRightLead)
      && !patientEditorialLeadTokens.has(normalizedRightLead)
      && !boundaryEditorialLeadTokens.has(normalizedRightLead)
      && containsLikelyPatientIdentifier(`${patientMarker} ${right}`);
    if (
      (strongNameLabelAtEnd.test(left) && nameValueAtStart.test(right))
      || (genericNameLabelAtEnd.test(left) && hasLikelyNameValueAtStart(right))
      || (pluralPatientLabelWithSeparatorAtEnd.test(left) && nameValueAtStart.test(right))
      || (pluralPatientLabelBareAtEnd.test(left) && pluralNameSeparatedValueAtStart.test(right))
      || (pluralNameLabelWithSeparatorAtEnd.test(left) && hasLikelyNameValueAtStart(right))
      || (pluralNameLabelBareAtEnd.test(left) && hasLikelySeparatedNameValueAtStart(right))
      || (birthDateLabelAtEnd.test(left) && (birthDateValueAtStart.test(right) || birthDateValueAtStart.test(rightCompact)))
      || (medicalIdLabelAtEnd.test(left) && (medicalIdValueAtStart.test(right) || medicalIdValueAtStart.test(rightCompact)))
      || (emailLabelAtEnd.test(left) && emailValueAtStart.test(rightCompact))
      || (phoneLabelAtEnd.test(left) && (
        phoneValueAtStart.test(right)
        || phoneValueAtStart.test(rightCompact)
        || containsInternationalPhoneNumber(right)
        || containsInternationalPhoneNumber(rightCompact)
      ))
      || (addressLabelAtEnd.test(left) && addressValueAtStart.test(right))
      || hasSplitPatientNarrative
    ) {
      return true;
    }
  }
  return false;
}

export function containsHighConfidencePersonName(value: string): boolean {
  if (!value.trim()) return false;
  const fullNamePattern = new RegExp(String.raw`^${namePattern}$`, "u");
  const searchPattern = new RegExp(
    String.raw`(?:^|[^\p{L}\p{M}])(${namePattern})(?=$|[^\p{L}\p{M}])`,
    "gu",
  );
  const isLikelyNameCandidate = (candidate: string): boolean => {
    return fullNamePattern.test(candidate);
  };
  const sequenceContainsLikelyName = (sequence: string): boolean => {
    const tokens = sequence.split(/\s+/);
    for (let start = 0; start < tokens.length; start += 1) {
      for (let length = 2; length <= 4 && start + length <= tokens.length; length += 1) {
        if (isLikelyNameCandidate(tokens.slice(start, start + length).join(" "))) return true;
      }
    }
    return false;
  };
  return value.split(/\r?\n/).some(rawLine => {
    const line = rawLine.trim();
    if (!line) return false;
    if (sequenceContainsLikelyName(line)) return true;
    return [...line.matchAll(searchPattern)]
      .some(match => Boolean(match[1]) && sequenceContainsLikelyName(match[1]));
  });
}

export function containsLikelyPatientIdentifier(value: string): boolean {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized);
  const hasPhone = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/.test(normalized);
  const hasInternationalPhone = containsInternationalPhoneNumber(normalized);
  const hasSsn = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(normalized);
  const hasBirthDate = new RegExp(String.raw`\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\b.{0,50}\b${datePattern}\b`, "i").test(normalized);
  const hasMedicalId = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|historia cl[ií]nica|n[uú]mero de paciente|id de paciente)\b\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(normalized);
  const hasStreetAddress = /\b\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\b/i.test(normalized);
  const hasExplicitNameLabel = new RegExp(
    String.raw`\b(?:(?:patient|paciente)\s+(?:name|nombre)|nombre\s+(?:del\s+)?paciente)(?:\s*[:#-]\s*|\s+)${labeledNamePattern}\b`,
    "iu",
  ).test(normalized);
  const hasExplicitPatientCase = new RegExp(
    String.raw`\b(?:patient|paciente|case|caso)(?:\s*[:#]\s*|\s+-\s+)${labeledNamePattern}\b`,
    "iu",
  ).test(normalized);
  const barePatientNamePattern = /\b(?:patient|paciente)\b\s+([^,.;:]{1,100})/giu;
  const leadingBareNamePattern = new RegExp(
    String.raw`^(${namePattern})(?=$|[^\p{L}\p{M}])`,
    "u",
  );
  const hasBarePatientName = [...normalized.matchAll(barePatientNamePattern)]
    .some(match => {
      const candidate = (match[1] || "").trim();
      const leadingName = leadingBareNamePattern.exec(candidate)?.[1] || "";
      const firstToken = leadingName.split(/\s+/)[0] || "";
      return !patientEditorialLeadTokens.has(normalizeLowercaseToken(firstToken))
        && Boolean(leadingName);
    });
  const patientNarrativePattern = /\b(?:patient|paciente)\b\s+([^,.;:]{1,100})/giu;
  const namedPatientNarrativePattern = new RegExp(
    String.raw`^${nameToken}(?:\s+(?:${nameInitial}|(?:${nameConnector}\s+)?${nameToken})){0,3}\s+(\p{Ll}[\p{Ll}\p{M}'’\-]*)`,
    "u",
  );
  const lowercasePatientNarrativePattern = new RegExp(
    String.raw`^(${lowercaseNameToken})\s+(?:(?:${nameConnector})\s+)?${lowercaseNameToken}(?:\s|$)`,
    "u",
  );
  const hasNamedPatientNarrative = [...normalized.matchAll(patientNarrativePattern)]
    .some(match => {
      const narrative = (match[1] || "").trim();
      if (patientEditorialHeadingPattern.test(narrative)) return false;
      if (isPatientGeographicNarrative(narrative)) return false;
      const namedContinuation = namedPatientNarrativePattern.exec(narrative)?.[1];
      if (namedContinuation) {
        return !headingConnectorTokens.has(normalizeLowercaseToken(namedContinuation));
      }
      const lowercaseMatch = lowercasePatientNarrativePattern.exec(narrative);
      const normalizedLead = normalizeLowercaseToken(lowercaseMatch?.[1] || "");
      if (
        ambiguousModalLeadTokens.has(normalizedLead)
        && modalContinuationTokens.has(normalizeLowercaseToken(narrative.split(/\s+/)[1] || ""))
      ) {
        return false;
      }
      return Boolean(normalizedLead)
        && !headingConnectorTokens.has(normalizedLead)
        && !patientEditorialLeadTokens.has(normalizedLead);
    });
  const hasGenericNameLabel = new RegExp(
    String.raw`\b(?:name|nombre)\s*[:#-]\s*${labeledNamePattern}\b`,
    "iu",
  ).test(normalized);

  return hasEmail
    || hasPhone
    || hasInternationalPhone
    || hasSsn
    || hasBirthDate
    || hasMedicalId
    || hasStreetAddress
    || hasExplicitNameLabel
    || hasExplicitPatientCase
    || hasBarePatientName
    || containsLaterNamedPatientNarrative(normalized)
    || hasNamedPatientNarrative
    || hasGenericNameLabel;
}

export function containsLikelyPatientIdentifierAcrossTextFields(
  values: readonly (string | null | undefined)[],
): boolean {
  const fields = values.filter((value): value is string => Boolean(value?.trim()));
  return fields.some(containsLikelyPatientIdentifier)
    || containsIdentifierAcrossAiFieldBoundaries(fields);
}

export function containsLikelyPatientIdentifierInAiFields(input: {
  topic?: string | null;
  targetKeyword?: string | null;
  additionalContext?: string | null;
}): boolean {
  const fields = [input.topic, input.targetKeyword, input.additionalContext]
    .filter((value): value is string => Boolean(value?.trim()));
  return fields.some(containsExplicitSensitiveAiMarker)
    || containsLikelyPatientIdentifierAcrossTextFields(fields)
    || containsLaterNamedPatientNarrative(fields.join(" "))
    || containsHighConfidencePersonName(input.additionalContext || "");
}
