const englishMonthPattern = String.raw`(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*`;
const spanishMonthPattern = String.raw`(?:ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sept?(?:iembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?)`;
const datePattern = String.raw`(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|${englishMonthPattern}\.?\s+\d{1,2},?\s+\d{2,4}|\d{1,2}\s+(?:de\s+)?${spanishMonthPattern}\.?(?:\s+de)?\s+\d{2,4})`;
const titleCaseNameToken = String.raw`(?:\p{Lu}[\p{Ll}\p{M}]+(?:[-'’]\p{Lu}?[\p{Ll}\p{M}]+)*|\p{Lu}['’]\p{Lu}[\p{Ll}\p{M}]+)`;
const uppercaseNameToken = String.raw`(?:\p{Lu}{2,}|\p{Lu}+(?:[-'’]\p{Lu}+)+)`;
const nameToken = String.raw`(?:${titleCaseNameToken}|${uppercaseNameToken})`;
const nameInitial = String.raw`\p{Lu}\.`;
const nameConnector = String.raw`(?:de(?:\s+la)?|del|da|dos|van|von)`;
const namePattern = String.raw`${nameToken}(?:\s+(?:${nameInitial}|(?:${nameConnector}\s+)?${nameToken})){1,3}`;

function hasHighConfidenceNameSignal(value: string): boolean {
  const letters = value.replace(/[^\p{L}]/gu, "");
  const hasDiacritic = /\p{M}/u.test(value.normalize("NFD"));
  const hasNamePunctuation = /[-'’]|\p{Lu}\./u.test(value);
  const hasConnector = new RegExp(String.raw`\b${nameConnector}\b`, "iu").test(value);
  const isAllCaps = letters.length >= 4 && letters === letters.toLocaleUpperCase();
  return hasDiacritic || hasNamePunctuation || hasConnector || isAllCaps;
}

export function containsHighConfidencePersonName(value: string): boolean {
  if (!value.trim()) return false;
  const searchPattern = new RegExp(
    String.raw`(?:^|[^\p{L}\p{M}])(${namePattern})(?=$|[^\p{L}\p{M}])`,
    "gu",
  );
  return [...value.matchAll(searchPattern)]
    .some(match => Boolean(match[1]) && hasHighConfidenceNameSignal(match[1]));
}

export function containsLikelyPatientIdentifier(value: string): boolean {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized);
  const hasPhone = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/.test(normalized);
  const hasSsn = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(normalized);
  const hasBirthDate = new RegExp(String.raw`\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\b.{0,50}\b${datePattern}\b`, "i").test(normalized);
  const hasMedicalId = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|historia cl[ií]nica|n[uú]mero de paciente|id de paciente)\b\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(normalized);
  const hasStreetAddress = /\b\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\b/i.test(normalized);
  const hasExplicitPatientName = new RegExp(String.raw`\b(?:patient|paciente)\s+(?:name\s*)[:#-]?\s*${namePattern}\b`, "iu").test(normalized)
    || new RegExp(String.raw`\b(?:patient|paciente)\s*[:#-]\s*${namePattern}\b`, "iu").test(normalized)
    || new RegExp(String.raw`\b(?:(?:our|the|a|this|un|una|el|la|nuestro|nuestra)\s+)?(?:patient|paciente)\s+${namePattern}\b`, "iu").test(normalized)
    || new RegExp(String.raw`\b(?:case|caso)\s*[:#-]\s*${namePattern}\b`, "iu").test(normalized);
  const hasNamedPatientContext = new RegExp(String.raw`\b(?:patient|paciente)\s+${namePattern}\b.{0,80}\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|diagnosed|diagnosis|medication|prescribed|symptoms|mrn|medical record|member id|patient id)\b`, "iu").test(normalized);
  const hasGenericNameLabel = new RegExp(String.raw`\b(?:name|nombre)\s*[:#-]\s*${namePattern}\b`, "iu").test(normalized);

  return hasEmail
    || hasPhone
    || hasSsn
    || hasBirthDate
    || hasMedicalId
    || hasStreetAddress
    || hasExplicitPatientName
    || hasNamedPatientContext
    || hasGenericNameLabel;
}

export function containsLikelyPatientIdentifierInAiFields(input: {
  topic?: string | null;
  targetKeyword?: string | null;
  additionalContext?: string | null;
}): boolean {
  const fields = [input.topic, input.targetKeyword, input.additionalContext]
    .filter((value): value is string => Boolean(value));
  return fields.some(containsLikelyPatientIdentifier)
    || fields.some(containsHighConfidencePersonName);
}
