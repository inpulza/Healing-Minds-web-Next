import { useEffect, lazy, Suspense } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useAnalytics } from '@/hooks/use-analytics';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useClarity } from '@/hooks/use-clarity';
import { useTikTokPixel } from '@/hooks/use-tiktok-pixel';
import { useIsMobile } from '@/hooks/use-mobile';
import { initGA, handleConsentChange } from '@/lib/analytics';
import CookieBanner from '@/components/CookieBanner';
import Home from '@/pages/Home';

// Mobile Toolbar - Lazy loaded only for mobile viewports to optimize desktop performance
const MobileToolbar = lazy(() => import('@/components/MobileToolbar'));

// Floating Video Bubble - Lazy loaded for performance optimization
const TelehealthVideoWidget = lazy(() => import('@/components/TelehealthVideoWidget'));

// WhatsApp Floating Button - Desktop only, lazy loaded
const WhatsAppFloatingButton = lazy(() => import('@/components/WhatsAppFloatingButton'));

// All non-critical pages lazy loaded for performance optimization
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const ForPatients = lazy(() => import('@/pages/ForPatients'));
const Contact = lazy(() => import('@/pages/Contact'));
const BlogIndex = lazy(() => import('@/pages/BlogIndex'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const BlogAdminPage = lazy(() => import('@/pages/admin/BlogAdminPage'));
const ServiciosEspanol = lazy(() => import('@/pages/ServiciosEspanol'));
const LocationNaples = lazy(() => import('@/pages/LocationNaples'));
const LocationBonitaSprings = lazy(() => import('@/pages/LocationBonitaSprings'));
const LocationMarcoIsland = lazy(() => import('@/pages/LocationMarcoIsland'));
const LocationEstero = lazy(() => import('@/pages/LocationEstero'));
const LocationGoldenGate = lazy(() => import('@/pages/LocationGoldenGate'));
const LocationImmokalee = lazy(() => import('@/pages/LocationImmokalee'));
const LocationVanderbiltBeach = lazy(() => import('@/pages/LocationVanderbiltBeach'));
const LocationAveMaria = lazy(() => import('@/pages/LocationAveMaria'));
const LocationFortMyers = lazy(() => import('@/pages/LocationFortMyers'));
const LocationLelyResorts = lazy(() => import('@/pages/LocationLelyResorts'));

// Language wrapper component for Spanish routes
const SpanishRouteWrapper = ({ Component }: { Component: React.ComponentType }) => {
  const { setLanguage } = useLanguage();
  
  useEffect(() => {
    setLanguage('es');
  }, [setLanguage]);
  
  return <Component />;
};

// Spanish Main Pages - Lazy loaded for performance
const HomeEspanol = lazy(() => import('@/pages/HomeEspanol'));
const AcercaEspanol = lazy(() => import('@/pages/AcercaEspanol'));
const ContactoEspanol = lazy(() => import('@/pages/ContactoEspanol'));
const ParaPacientesEspanol = lazy(() => import('@/pages/ParaPacientesEspanol'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Individual Service Pages - Lazy loaded for performance
const AnxietyTreatment = lazy(() => import('@/pages/services/AnxietyTreatment'));
const DepressionTreatment = lazy(() => import('@/pages/services/DepressionTreatment'));
const AdhdTreatment = lazy(() => import('@/pages/services/AdhdTreatment'));
const PtsdTreatment = lazy(() => import('@/pages/services/PtsdTreatment'));
const BipolarTreatment = lazy(() => import('@/pages/services/BipolarTreatment'));
const MedicationManagement = lazy(() => import('@/pages/services/MedicationManagement'));

// Telepsychiatry Page - Lazy loaded for performance
const TelepsychiatryFlorida = lazy(() => import('@/pages/TelepsychiatryFlorida'));

// California Landing Page - Lazy loaded for performance
const PsiquiatraCalifornia = lazy(() => import('@/pages/PsiquiatraCalifornia'));

// Legal Pages - Lazy loaded for performance
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const HipaaNotice = lazy(() => import('@/pages/HipaaNotice'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const CancellationPolicy = lazy(() => import('@/pages/CancellationPolicy'));
const BillingPolicy = lazy(() => import('@/pages/BillingPolicy'));
const EmergencyPolicy = lazy(() => import('@/pages/EmergencyPolicy'));
const PatientRights = lazy(() => import('@/pages/PatientRights'));
const TelehealthConsent = lazy(() => import('@/pages/TelehealthConsent'));
const NoSurprisesAct = lazy(() => import('@/pages/NoSurprisesAct'));
const AccessibilityStatement = lazy(() => import('@/pages/AccessibilityStatement'));
const NondiscriminationNotice = lazy(() => import('@/pages/NondiscriminationNotice'));
const CommunicationsPolicy = lazy(() => import('@/pages/CommunicationsPolicy'));
const MedicalDisclaimer = lazy(() => import('@/pages/MedicalDisclaimer'));


// Loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="animate-pulse text-green-600 font-body text-lg">
      Cargando...
    </div>
  </div>
);

// Redirect component for legacy URLs
const RedirectToNaplesLocation = () => {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Use replaceState to avoid back button issues
    navigate('/locations/psychiatrist-naples', { replace: true });
  }, [navigate]);
  
  return <PageLoader />;
};

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Initialize Microsoft Clarity (guards prevent multiple initializations)
  useClarity();
  
  // Initialize TikTok Pixel (guards prevent multiple initializations)
  useTikTokPixel();
  
  // Scroll to top on route changes
  useScrollToTop();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/for-patients" component={ForPatients} />
      <Route path="/telepsychiatry-florida" component={TelepsychiatryFlorida} />
      <Route path="/psychiatrist-california" component={PsiquiatraCalifornia} />
      <Route path="/locations/naples" component={RedirectToNaplesLocation} />
      <Route path="/locations/psychiatrist-naples" component={LocationNaples} />
      <Route path="/locations/psychiatrist-bonita-springs" component={LocationBonitaSprings} />
      <Route path="/locations/psychiatrist-marco-island" component={LocationMarcoIsland} />
      <Route path="/locations/psychiatrist-estero" component={LocationEstero} />
      <Route path="/locations/psychiatrist-golden-gate" component={LocationGoldenGate} />
      <Route path="/locations/psychiatrist-immokalee" component={LocationImmokalee} />
      <Route path="/locations/psychiatrist-vanderbilt-beach" component={LocationVanderbiltBeach} />
      <Route path="/locations/psychiatrist-ave-maria" component={LocationAveMaria} />
      <Route path="/locations/psychiatrist-fort-myers" component={LocationFortMyers} />
      <Route path="/locations/psychiatrist-lely-resort" component={LocationLelyResorts} />
      
      {/* Spanish Location Pages - Now use English components with Spanish language wrapper */}
      <Route path="/es/ubicaciones/psiquiatra-naples" component={() => <SpanishRouteWrapper Component={LocationNaples} />} />
      <Route path="/es/ubicaciones/psiquiatra-bonita-springs" component={() => <SpanishRouteWrapper Component={LocationBonitaSprings} />} />
      <Route path="/es/ubicaciones/psiquiatra-marco-island" component={() => <SpanishRouteWrapper Component={LocationMarcoIsland} />} />
      <Route path="/es/ubicaciones/psiquiatra-estero" component={() => <SpanishRouteWrapper Component={LocationEstero} />} />
      <Route path="/es/ubicaciones/psiquiatra-golden-gate" component={() => <SpanishRouteWrapper Component={LocationGoldenGate} />} />
      <Route path="/es/ubicaciones/psiquiatra-immokalee" component={() => <SpanishRouteWrapper Component={LocationImmokalee} />} />
      <Route path="/es/ubicaciones/psiquiatra-vanderbilt-beach" component={() => <SpanishRouteWrapper Component={LocationVanderbiltBeach} />} />
      <Route path="/es/ubicaciones/psiquiatra-ave-maria" component={() => <SpanishRouteWrapper Component={LocationAveMaria} />} />
      <Route path="/es/ubicaciones/psiquiatra-fort-myers" component={() => <SpanishRouteWrapper Component={LocationFortMyers} />} />
      <Route path="/es/ubicaciones/psiquiatra-lely-resort" component={() => <SpanishRouteWrapper Component={LocationLelyResorts} />} />
      
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={() => <BlogIndex />} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/es/blog" component={() => <BlogIndex language="es" />} />
      <Route path="/es/blog/:slug" component={BlogPost} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/blog" component={BlogAdminPage} />
      
      {/* Spanish Main Pages */}
      <Route path="/es" component={HomeEspanol} />
      <Route path="/es/acerca-de" component={AcercaEspanol} />
      <Route path="/es/contacto" component={ContactoEspanol} />
      <Route path="/es/para-pacientes" component={ParaPacientesEspanol} />
      <Route path="/es/servicios" component={ServiciosEspanol} />
      <Route path="/es/telepsiquiatria-florida" component={() => <SpanishRouteWrapper Component={TelepsychiatryFlorida} />} />
      <Route path="/es/psiquiatra-california" component={() => <SpanishRouteWrapper Component={PsiquiatraCalifornia} />} />
      
      {/* Individual Service Pages */}
      <Route path="/services/anxiety-treatment" component={AnxietyTreatment} />
      <Route path="/services/depression-treatment" component={DepressionTreatment} />
      <Route path="/services/adhd-treatment" component={AdhdTreatment} />
      <Route path="/services/ptsd-treatment" component={PtsdTreatment} />
      <Route path="/services/bipolar-treatment" component={BipolarTreatment} />
      <Route path="/services/medication-management" component={MedicationManagement} />
      
      {/* Spanish Service Pages */}
      <Route path="/es/servicios/tratamiento-ansiedad" component={AnxietyTreatment} />
      <Route path="/es/servicios/tratamiento-depresion" component={DepressionTreatment} />
      <Route path="/es/servicios/tratamiento-adhd" component={AdhdTreatment} />
      <Route path="/es/servicios/tratamiento-tept" component={PtsdTreatment} />
      <Route path="/es/servicios/tratamiento-bipolar" component={BipolarTreatment} />
      <Route path="/es/servicios/manejo-medicamentos" component={MedicationManagement} />
      
      {/* Legal Pages - English */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/hipaa-notice" component={HipaaNotice} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/cancellation-policy" component={CancellationPolicy} />
      <Route path="/billing-policy" component={BillingPolicy} />
      <Route path="/emergency-policy" component={EmergencyPolicy} />
      <Route path="/patient-rights" component={PatientRights} />
      <Route path="/telehealth-consent" component={TelehealthConsent} />
      <Route path="/no-surprises-act" component={NoSurprisesAct} />
      <Route path="/accessibility-statement" component={AccessibilityStatement} />
      <Route path="/nondiscrimination-notice" component={NondiscriminationNotice} />
      <Route path="/communications-policy" component={CommunicationsPolicy} />
      <Route path="/medical-disclaimer" component={MedicalDisclaimer} />
      
      {/* Legal Pages - Spanish */}
      <Route path="/es/politica-privacidad" component={PrivacyPolicy} />
      <Route path="/es/terminos-servicio" component={TermsOfService} />
      <Route path="/es/aviso-hipaa" component={HipaaNotice} />
      <Route path="/es/politica-cookies" component={CookiePolicy} />
      <Route path="/es/politica-cancelacion" component={CancellationPolicy} />
      <Route path="/es/politica-facturacion" component={BillingPolicy} />
      <Route path="/es/politica-emergencias" component={EmergencyPolicy} />
      <Route path="/es/derechos-paciente" component={PatientRights} />
      <Route path="/es/consentimiento-telesalud" component={TelehealthConsent} />
      <Route path="/es/ley-sin-sorpresas" component={NoSurprisesAct} />
      <Route path="/es/declaracion-accesibilidad" component={AccessibilityStatement} />
      <Route path="/es/aviso-no-discriminacion" component={NondiscriminationNotice} />
      <Route path="/es/politica-comunicaciones" component={CommunicationsPolicy} />
      <Route path="/es/descargo-responsabilidad-medica" component={MedicalDisclaimer} />
      
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Detect mobile viewport for conditional MobileToolbar rendering
  const isMobile = useIsMobile();
  
  // Initialize analytics and handle consent changes
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      // Initialize GA with consent check (it will check internally)
      initGA();
    }
    
    // Listen for granular consent changes
    const handleConsentChangeEvent = (event: CustomEvent) => {
      const { analytics, marketing, hasAnalyticsConsent, hasMarketingConsent } = event.detail;
      // Use the boolean values directly from the consent data
      handleConsentChange(analytics ?? hasAnalyticsConsent, marketing ?? hasMarketingConsent);
    };
    
    window.addEventListener('consentChanged', handleConsentChangeEvent as EventListener);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('consentChanged', handleConsentChangeEvent as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CookieConsentProvider>
          <LanguageProvider>
            <Router />
            {/* Conditionally render MobileToolbar only on mobile viewports for performance */}
            {isMobile && (
              <Suspense fallback={null}>
                <MobileToolbar />
              </Suspense>
            )}
            <Toaster />
            <Suspense fallback={null}>
              <CookieBanner />
            </Suspense>
            <Suspense fallback={null}>
              <TelehealthVideoWidget />
            </Suspense>
            <Suspense fallback={null}>
              <WhatsAppFloatingButton />
            </Suspense>
          </LanguageProvider>
        </CookieConsentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
