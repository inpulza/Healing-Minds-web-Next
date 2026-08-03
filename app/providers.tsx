"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { LanguageProvider, type Language } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { createQueryClient, queryClient as browserQueryClient } from "@/lib/queryClient";
import PublicShell from "./public-shell";

export default function Providers({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: Language;
}) {
  const nextQueryClient = typeof window === "undefined"
    ? createQueryClient()
    : browserQueryClient;

  return (
    <QueryClientProvider client={nextQueryClient}>
      <LanguageProvider initialLanguage={initialLanguage}>
        <CookieConsentProvider>
          <TooltipProvider>
            <PublicShell>{children}</PublicShell>
            <Toaster />
          </TooltipProvider>
        </CookieConsentProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
