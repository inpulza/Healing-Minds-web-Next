import { clearFirstPartyCookies } from './cookie-cleanup';

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    hmp_analytics_initialized?: boolean;
    hmp_consent_mode_initialized?: boolean;
    hmp_ga_script_loaded?: boolean;
  }
}

function readConsent(category: 'analytics' | 'marketing'): boolean {
  try {
    const stored = localStorage.getItem('hmp_cookie_consent');
    if (!stored) {
      return false;
    }

    const consent = JSON.parse(stored);
    return Boolean(consent?.hasConsented && consent?.consent?.[category]);
  } catch (error) {
    console.error(`Error checking ${category} consent:`, error);
    return false;
  }
}

function hasAnalyticsConsent(): boolean {
  return readConsent('analytics');
}

function hasMarketingConsent(): boolean {
  return readConsent('marketing');
}

function initConsentMode(): void {
  if (window.hmp_consent_mode_initialized) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(..._args: any[]) {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 2000,
  });
  window.hmp_consent_mode_initialized = true;
}

export function updateGoogleConsent(
  analyticsConsent: boolean,
  marketingConsent: boolean,
): void {
  initConsentMode();
  window.gtag('consent', 'update', {
    analytics_storage: analyticsConsent ? 'granted' : 'denied',
    ad_storage: marketingConsent ? 'granted' : 'denied',
    ad_user_data: marketingConsent ? 'granted' : 'denied',
    ad_personalization: marketingConsent ? 'granted' : 'denied',
  });
}

let gaConfigured = false;
let lastTrackedPath: string | null = null;

/**
 * Queues Consent Mode, the Google destination and its configuration in that
 * order. The remote gtag script loads asynchronously, but outbound clicks can
 * safely queue a beacon event immediately without relying on in-memory replay.
 */
export function initGA(): void {
  if (isDevelopment()) {
    return;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not provided');
    return;
  }

  if (window.hmp_analytics_initialized) {
    gaConfigured = true;
    return;
  }

  initConsentMode();

  const existingScript = document.querySelector(
    `script[src*="gtag/js?id=${measurementId}"]`,
  );
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.setAttribute('data-hmp-analytics', 'true');
    script.onerror = () => {
      console.error('Failed to load Google Analytics script');
      window.hmp_ga_script_loaded = false;
    };
    document.head.appendChild(script);
  }

  window.hmp_ga_script_loaded = true;
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: false,
    allow_enhanced_conversions: true,
    custom_map: {
      custom_1: 'service_type',
      custom_2: 'language_preference',
    },
  });
  updateGoogleConsent(hasAnalyticsConsent(), hasMarketingConsent());

  window.hmp_analytics_initialized = true;
  markGaConfigured();
}

export function markGaConfigured(): void {
  gaConfigured = true;
}

function ensureConfigured(): boolean {
  if (!gaConfigured) {
    initGA();
  }
  return gaConfigured && typeof window.gtag === 'function';
}

export function trackPageView(path: string, title?: string): void {
  if (!hasAnalyticsConsent() || !ensureConfigured() || path === lastTrackedPath) {
    return;
  }

  lastTrackedPath = path;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
): void {
  if (!hasAnalyticsConsent() || !ensureConfigured()) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackServicePageView(
  serviceName: string,
  language: 'en' | 'es' = 'en',
): void {
  trackEvent('service_page_view', 'medical_services', serviceName);
  trackEvent('language_selection', 'user_preference', language);
}

export function trackContactFormEvent(
  action: 'start' | 'submit' | 'error',
  formType = 'general',
): void {
  trackEvent(`contact_form_${action}`, 'lead_generation', formType);
}

export type LeadSource =
  | 'appointment_booking'
  | 'contact_form'
  | 'phone_call'
  | 'whatsapp'
  | 'email';

let lastLeadKey: string | null = null;
let lastLeadTimestamp = 0;

/**
 * Records a lead action. Appointment clicks are intentionally treated as lead
 * clicks, not as confirmed appointments; confirmation happens in CharmHealth.
 */
export function trackLeadConversion(
  source: LeadSource,
  detail: Record<string, unknown> = {},
): void {
  if (!hasAnalyticsConsent() || !ensureConfigured()) {
    return;
  }

  const leadKey = `${source}:${String(detail.click_location ?? '')}`;
  const now = Date.now();
  if (leadKey === lastLeadKey && now - lastLeadTimestamp < 500) {
    return;
  }
  lastLeadKey = leadKey;
  lastLeadTimestamp = now;

  window.gtag('event', 'generate_lead', {
    lead_source: source,
    event_category: 'lead_generation',
    transport_type: 'beacon',
    ...detail,
  });
}

/** Covers outbound contact links that render as anchors. */
export function installOutboundLeadTracking(): () => void {
  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) {
      return;
    }

    const href = link.getAttribute('href') ?? '';
    const clickLocation =
      link.dataset.leadLocation ||
      link.dataset.testid ||
      link.id ||
      link.getAttribute('aria-label') ||
      'outbound_link';

    if (href.startsWith('tel:')) {
      trackLeadConversion('phone_call', { click_location: clickLocation });
    } else if (href.startsWith('mailto:')) {
      trackLeadConversion('email', { click_location: clickLocation });
    } else if (href.includes('wa.me/')) {
      trackLeadConversion('whatsapp', { click_location: clickLocation });
    } else if (href.includes('ehr.charmtracker.com/publicCal.sas')) {
      trackLeadConversion('appointment_booking', { click_location: clickLocation });
    }
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}

export function trackInsuranceClick(insuranceName: string): void {
  trackEvent('insurance_logo_click', 'user_engagement', insuranceName);
}

function clearAnalyticsCookies(): void {
  clearFirstPartyCookies({
    exactNames: ['_ga', '_gid', '_gat'],
    prefixes: ['_ga_'],
  });
}

function clearAdvertisingCookies(): void {
  clearFirstPartyCookies({
    exactNames: ['_gcl_au', '_gcl_aw', 'FPAU'],
    prefixes: ['_gcl_', '_gac_'],
  });
}

export function handleConsentChange(
  analyticsConsent: boolean,
  marketingConsent: boolean,
): void {
  updateGoogleConsent(analyticsConsent, marketingConsent);

  if (analyticsConsent) {
    initGA();
    trackPageView(window.location.pathname, document.title);
  } else {
    lastTrackedPath = null;
    clearAnalyticsCookies();
  }

  if (!marketingConsent) {
    clearAdvertisingCookies();
  }
}
