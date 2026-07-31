const englishMonthPattern = String.raw`(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*`;
const spanishMonthPattern = String.raw`(?:ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sept?(?:iembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?)`;
const datePattern = String.raw`(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|${englishMonthPattern}\.?\s+\d{1,2},?\s+\d{2,4}|\d{1,2}\s+(?:de\s+)?${spanishMonthPattern}\.?(?:\s+de)?\s+\d{2,4})`;
const titleCaseNameToken = String.raw`(?:\p{Lu}[\p{Ll}\p{M}]+(?:[-'’]\p{Lu}?[\p{Ll}\p{M}]+)*|\p{Lu}['’]\p{Lu}[\p{Ll}\p{M}]+)`;
const uppercaseNameToken = String.raw`(?:\p{Lu}{2,}|\p{Lu}+(?:[-'’]\p{Lu}+)+)`;
const nameToken = String.raw`(?:${titleCaseNameToken}|${uppercaseNameToken})`;
const nameInitial = String.raw`\p{Lu}\.`;
const nameConnector = String.raw`(?:de(?:\s+la)?|del|da|dos|van|von)`;
const namePattern = String.raw`${nameToken}(?:\s+(?:${nameInitial}|(?:${nameConnector}\s+)?${nameToken})){1,3}`;
const labeledNameToken = String.raw`\p{L}[\p{L}\p{M}'’\-]*`;
const labeledNamePattern = String.raw`${labeledNameToken}(?:\s+${labeledNameToken}){0,3}`;
const headingConnectorTokens = new Set([
  "a", "across", "after", "against", "along", "amid", "among", "and", "antes",
  "around", "as", "at", "bajo", "before", "behind", "below", "beneath", "beside",
  "between", "beyond", "but", "by", "con", "contra", "de", "del", "desde",
  "despues", "during", "durante", "en", "entre", "for", "from", "hasta", "hacia",
  "in", "inside", "into", "la", "las", "like", "los", "near", "nor", "o", "of",
  "off", "on", "onto", "or", "out", "outside", "over", "para", "pero", "por",
  "segun", "sin", "sobre", "the", "through", "throughout", "till", "to", "toward",
  "under", "underneath", "until", "versus", "via", "vs", "with", "within",
  "without", "y",
]);

function normalizeLowercaseToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}]/gu, "")
    .toLocaleLowerCase();
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
  const hasSsn = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(normalized);
  const hasBirthDate = new RegExp(String.raw`\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\b.{0,50}\b${datePattern}\b`, "i").test(normalized);
  const hasMedicalId = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|historia cl[ií]nica|n[uú]mero de paciente|id de paciente)\b\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(normalized);
  const hasStreetAddress = /\b\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\b/i.test(normalized);
  const hasExplicitPatientName = new RegExp(
    String.raw`\b(?:(?:patient|paciente)\s+name|(?:patient|paciente)|case|caso)\s*[:#-]\s*${labeledNamePattern}\b`,
    "iu",
  ).test(normalized);
  const patientNarrativePattern = /\b(?:patient|paciente)\s+([^,.;:]{1,100})/giu;
  const namedPatientNarrativePattern = new RegExp(
    String.raw`^${nameToken}(?:\s+(?:${nameInitial}|(?:${nameConnector}\s+)?${nameToken})){0,3}\s+(\p{Ll}[\p{Ll}\p{M}'’\-]*)`,
    "u",
  );
  const hasNamedPatientNarrative = [...normalized.matchAll(patientNarrativePattern)]
    .some(match => {
      const continuation = namedPatientNarrativePattern.exec((match[1] || "").trim())?.[1];
      return Boolean(continuation)
        && !headingConnectorTokens.has(normalizeLowercaseToken(continuation || ""));
    });
  const hasGenericNameLabel = new RegExp(
    String.raw`\b(?:name|nombre)\s*[:#-]\s*${labeledNamePattern}\b`,
    "iu",
  ).test(normalized);

  return hasEmail
    || hasPhone
    || hasSsn
    || hasBirthDate
    || hasMedicalId
    || hasStreetAddress
    || hasExplicitPatientName
    || hasNamedPatientNarrative
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
    || containsHighConfidencePersonName(input.additionalContext || "");
}
