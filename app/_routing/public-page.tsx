"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type Locale = "en" | "es";
type RoutedPageProps = { language?: Locale };

const loadPage = (
  loader: () => Promise<{ default: ComponentType<RoutedPageProps> }>,
) => dynamic<RoutedPageProps>(loader);

const pageComponents: Record<string, ComponentType<RoutedPageProps>> = {
  About: loadPage(() => import("@/pages/About")),
  AccessibilityStatement: loadPage(() => import("@/pages/AccessibilityStatement")),
  AcercaEspanol: loadPage(() => import("@/pages/AcercaEspanol")),
  AdhdTreatment: loadPage(() => import("@/pages/services/AdhdTreatment")),
  AnxietyTreatment: loadPage(() => import("@/pages/services/AnxietyTreatment")),
  BillingPolicy: loadPage(() => import("@/pages/BillingPolicy")),
  BipolarTreatment: loadPage(() => import("@/pages/services/BipolarTreatment")),
  BlogIndex: loadPage(() => import("@/pages/BlogIndex")),
  BlogPost: loadPage(() => import("@/pages/BlogPost")),
  CancellationPolicy: loadPage(() => import("@/pages/CancellationPolicy")),
  CommunicationsPolicy: loadPage(() => import("@/pages/CommunicationsPolicy")),
  Contact: loadPage(() => import("@/pages/Contact")),
  ContactoEspanol: loadPage(() => import("@/pages/ContactoEspanol")),
  CookiePolicy: loadPage(() => import("@/pages/CookiePolicy")),
  DepressionTreatment: loadPage(() => import("@/pages/services/DepressionTreatment")),
  EmergencyPolicy: loadPage(() => import("@/pages/EmergencyPolicy")),
  ForPatients: loadPage(() => import("@/pages/ForPatients")),
  HipaaNotice: loadPage(() => import("@/pages/HipaaNotice")),
  Home: loadPage(() => import("@/pages/Home")),
  HomeEspanol: loadPage(() => import("@/pages/HomeEspanol")),
  LocationAveMaria: loadPage(() => import("@/pages/LocationAveMaria")),
  LocationBonitaSprings: loadPage(() => import("@/pages/LocationBonitaSprings")),
  LocationEstero: loadPage(() => import("@/pages/LocationEstero")),
  LocationFortMyers: loadPage(() => import("@/pages/LocationFortMyers")),
  LocationGoldenGate: loadPage(() => import("@/pages/LocationGoldenGate")),
  LocationImmokalee: loadPage(() => import("@/pages/LocationImmokalee")),
  LocationLelyResorts: loadPage(() => import("@/pages/LocationLelyResorts")),
  LocationMarcoIsland: loadPage(() => import("@/pages/LocationMarcoIsland")),
  LocationNaples: loadPage(() => import("@/pages/LocationNaples")),
  LocationVanderbiltBeach: loadPage(() => import("@/pages/LocationVanderbiltBeach")),
  MedicalDisclaimer: loadPage(() => import("@/pages/MedicalDisclaimer")),
  MedicationManagement: loadPage(() => import("@/pages/services/MedicationManagement")),
  NondiscriminationNotice: loadPage(() => import("@/pages/NondiscriminationNotice")),
  NoSurprisesAct: loadPage(() => import("@/pages/NoSurprisesAct")),
  ParaPacientesEspanol: loadPage(() => import("@/pages/ParaPacientesEspanol")),
  PatientRights: loadPage(() => import("@/pages/PatientRights")),
  PrivacyPolicy: loadPage(() => import("@/pages/PrivacyPolicy")),
  PsiquiatraCalifornia: loadPage(() => import("@/pages/PsiquiatraCalifornia")),
  PtsdTreatment: loadPage(() => import("@/pages/services/PtsdTreatment")),
  Services: loadPage(() => import("@/pages/Services")),
  ServiciosEspanol: loadPage(() => import("@/pages/ServiciosEspanol")),
  TelehealthConsent: loadPage(() => import("@/pages/TelehealthConsent")),
  TelepsychiatryFlorida: loadPage(() => import("@/pages/TelepsychiatryFlorida")),
  TermsOfService: loadPage(() => import("@/pages/TermsOfService")),
};

export default function PublicPage({ page, locale }: { page: string; locale: Locale }) {
  const { setLanguage } = useLanguage();
  const Component = pageComponents[page];

  useEffect(() => {
    setLanguage(locale);
  }, [locale, setLanguage]);

  if (!Component) {
    throw new Error(`Missing public page component: ${page}`);
  }

  return <Component language={locale} />;
}
