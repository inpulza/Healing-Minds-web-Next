"use client";

import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analytics";
import { useClarity } from "@/hooks/use-clarity";
import { useTikTokPixel } from "@/hooks/use-tiktok-pixel";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { handleConsentChange, initGA } from "@/lib/analytics";

const MobileToolbar = lazy(() => import("@/components/MobileToolbar"));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));
const TelehealthVideoWidget = lazy(() => import("@/components/TelehealthVideoWidget"));
const WhatsAppFloatingButton = lazy(() => import("@/components/WhatsAppFloatingButton"));

function PublicRuntime({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  useAnalytics();
  useClarity(true);
  useTikTokPixel(true);
  useScrollToTop();

  useEffect(() => {
    initGA();

    const onConsentChange = (event: Event) => {
      const detail = (event as CustomEvent).detail ?? {};
      handleConsentChange(
        detail.analytics ?? detail.hasAnalyticsConsent ?? false,
        detail.marketing ?? detail.hasMarketingConsent ?? false,
      );
    };

    window.addEventListener("consentChanged", onConsentChange);
    return () => window.removeEventListener("consentChanged", onConsentChange);
  }, []);

  return (
    <>
      {children}
      {isMobile ? (
        <Suspense fallback={null}>
          <MobileToolbar />
        </Suspense>
      ) : null}
      <Suspense fallback={null}>
        <CookieBanner />
        <TelehealthVideoWidget />
        <WhatsAppFloatingButton />
      </Suspense>
    </>
  );
}

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  // Admin will receive its own isolated shell during route migration. Keep public
  // analytics, consent overlays and conversion widgets out of that layout now.
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return <PublicRuntime>{children}</PublicRuntime>;
}
