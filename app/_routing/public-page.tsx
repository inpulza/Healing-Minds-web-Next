"use client";

import type { ComponentType } from "react";
import { useEffect } from "react";
import About from "@/pages/About";
import AccessibilityStatement from "@/pages/AccessibilityStatement";
import AcercaEspanol from "@/pages/AcercaEspanol";
import BillingPolicy from "@/pages/BillingPolicy";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import CancellationPolicy from "@/pages/CancellationPolicy";
import CommunicationsPolicy from "@/pages/CommunicationsPolicy";
import Contact from "@/pages/Contact";
import ContactoEspanol from "@/pages/ContactoEspanol";
import CookiePolicy from "@/pages/CookiePolicy";
import EmergencyPolicy from "@/pages/EmergencyPolicy";
import ForPatients from "@/pages/ForPatients";
import HipaaNotice from "@/pages/HipaaNotice";
import Home from "@/pages/Home";
import HomeEspanol from "@/pages/HomeEspanol";
import LocationAveMaria from "@/pages/LocationAveMaria";
import LocationBonitaSprings from "@/pages/LocationBonitaSprings";
import LocationEstero from "@/pages/LocationEstero";
import LocationFortMyers from "@/pages/LocationFortMyers";
import LocationGoldenGate from "@/pages/LocationGoldenGate";
import LocationImmokalee from "@/pages/LocationImmokalee";
import LocationLelyResorts from "@/pages/LocationLelyResorts";
import LocationMarcoIsland from "@/pages/LocationMarcoIsland";
import LocationNaples from "@/pages/LocationNaples";
import LocationVanderbiltBeach from "@/pages/LocationVanderbiltBeach";
import MedicalDisclaimer from "@/pages/MedicalDisclaimer";
import NondiscriminationNotice from "@/pages/NondiscriminationNotice";
import NoSurprisesAct from "@/pages/NoSurprisesAct";
import ParaPacientesEspanol from "@/pages/ParaPacientesEspanol";
import PatientRights from "@/pages/PatientRights";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PsiquiatraCalifornia from "@/pages/PsiquiatraCalifornia";
import Services from "@/pages/Services";
import ServiciosEspanol from "@/pages/ServiciosEspanol";
import TelehealthConsent from "@/pages/TelehealthConsent";
import TelepsychiatryFlorida from "@/pages/TelepsychiatryFlorida";
import TermsOfService from "@/pages/TermsOfService";
import AdhdTreatment from "@/pages/services/AdhdTreatment";
import AnxietyTreatment from "@/pages/services/AnxietyTreatment";
import BipolarTreatment from "@/pages/services/BipolarTreatment";
import DepressionTreatment from "@/pages/services/DepressionTreatment";
import MedicationManagement from "@/pages/services/MedicationManagement";
import PtsdTreatment from "@/pages/services/PtsdTreatment";
import { useLanguage } from "@/hooks/useLanguage";

type Locale = "en" | "es";
type RoutedPageProps = { language?: Locale };

const pageComponents: Record<string, ComponentType<RoutedPageProps>> = {
  About,
  AccessibilityStatement,
  AcercaEspanol,
  AdhdTreatment,
  AnxietyTreatment,
  BillingPolicy,
  BipolarTreatment,
  BlogIndex,
  BlogPost,
  CancellationPolicy,
  CommunicationsPolicy,
  Contact,
  ContactoEspanol,
  CookiePolicy,
  DepressionTreatment,
  EmergencyPolicy,
  ForPatients,
  HipaaNotice,
  Home,
  HomeEspanol,
  LocationAveMaria,
  LocationBonitaSprings,
  LocationEstero,
  LocationFortMyers,
  LocationGoldenGate,
  LocationImmokalee,
  LocationLelyResorts,
  LocationMarcoIsland,
  LocationNaples,
  LocationVanderbiltBeach,
  MedicalDisclaimer,
  MedicationManagement,
  NondiscriminationNotice,
  NoSurprisesAct,
  ParaPacientesEspanol,
  PatientRights,
  PrivacyPolicy,
  PsiquiatraCalifornia,
  PtsdTreatment,
  Services,
  ServiciosEspanol,
  TelehealthConsent,
  TelepsychiatryFlorida,
  TermsOfService,
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
