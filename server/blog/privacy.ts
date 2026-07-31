export function containsLikelyPatientIdentifier(value: string): boolean {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  const datePattern = String.raw`(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4})`;
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized);
  const hasPhone = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/.test(normalized);
  const hasSsn = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(normalized);
  const hasBirthDate = new RegExp(String.raw`\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\b.{0,50}\b${datePattern}\b`, "i").test(normalized);
  const hasMedicalId = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|historia clinica|numero de paciente|id de paciente)\b\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(normalized);
  const namePattern = String.raw`[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}`;
  const hasStreetAddress = /\b\d{1,6}\s+[A-Z0-9][A-Z0-9.'-]*(?:\s+[A-Z0-9][A-Z0-9.'-]*){0,5}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy|calle|avenida|carretera)\b/i.test(normalized);
  const hasExplicitPatientName = new RegExp(String.raw`\b(?:patient|paciente)\s+(?:name\s*)[:#-]?\s*${namePattern}\b`, "i").test(normalized)
    || new RegExp(String.raw`\b(?:patient|paciente)\s*[:#-]\s*${namePattern}\b`, "i").test(normalized)
    || new RegExp(String.raw`\b(?:(?:our|the|a|this|un|una|el|la|nuestro|nuestra)\s+)?(?:patient|paciente)\s+${namePattern}\b`, "i").test(normalized)
    || new RegExp(String.raw`\b(?:case|caso)\s*[:#-]\s*${namePattern}\b`, "i").test(normalized);
  const hasNamedPatientContext = new RegExp(String.raw`\b(?:patient|paciente)\s+${namePattern}\b.{0,80}\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|diagnosed|diagnosis|medication|prescribed|symptoms|mrn|medical record|member id|patient id)\b`, "i").test(normalized);
  const hasGenericNameLabel = new RegExp(String.raw`\b(?:name|nombre)\s*[:#-]\s*${namePattern}\b`, "i").test(normalized);
  const editorialTitleWords = new Set([
    "adhd", "anxiety", "bipolar", "care", "depression", "disorder", "florida",
    "healing", "health", "medication", "mental", "minds", "naples", "options",
    "psychiatrist", "psychiatry", "symptoms", "telehealth", "telepsychiatry",
    "therapy", "treatment", "understanding",
  ]);
  const hasStandaloneNameLine = value
    .split(/\r?\n/)
    .map(line => line.trim())
    .some(line => {
      if (!new RegExp(String.raw`^${namePattern}$`).test(line)) return false;
      return line.split(/\s+/).every(token => !editorialTitleWords.has(token.toLowerCase()));
    });

  return hasEmail
    || hasPhone
    || hasSsn
    || hasBirthDate
    || hasMedicalId
    || hasStreetAddress
    || hasExplicitPatientName
    || hasNamedPatientContext
    || hasGenericNameLabel
    || hasStandaloneNameLine;
}
