import type { BlogLanguage } from "./storage";

export const medicalDisclaimerPatterns = [
  /not a substitute/i,
  /medical advice/i,
  /emergency/i,
  /911/,
  /no sustituye/i,
  /consejo medico/i,
  /emergencia/i,
];

export function hasMedicalDisclaimer(text: string): boolean {
  return medicalDisclaimerPatterns.some(pattern => pattern.test(text));
}

export function getMedicalDisclaimerHtml(language: BlogLanguage): string {
  if (language === "es") {
    return "<p><strong>Importante:</strong> Este articulo es educativo y no sustituye el consejo medico. Si tiene una emergencia de salud mental, llame al 911 o vaya a la sala de emergencias mas cercana.</p>";
  }

  return "<p><strong>Important:</strong> This article is for educational purposes and is not a substitute for medical advice. If you are experiencing a mental health emergency, call 911 or go to the nearest emergency room.</p>";
}

export function slugifyBlogValue(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 255);
}

export function truncateSeoText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength - 1).trimEnd();
}
