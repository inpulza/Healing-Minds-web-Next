import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@/lib/navigation';
import { X, Phone, CalendarCheck, Video } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { trackLeadConversion } from '@/lib/analytics';

/**
 * Floating telehealth widget.
 *
 * Replaces the old FloatingVideoBubble, which embedded a YouTube presentation video, had no path
 * to booking, and — once closed — hid itself permanently via localStorage with no expiry. A single
 * dismissal removed it for that visitor forever.
 *
 * Behaviour here mirrors the validated Bedas Mental Health widget:
 *   - a small looping avatar at rest, opening into a 9:16 call still with two booking actions,
 *   - hover to open on desktop, tap on mobile, Escape to close,
 *   - closing collapses back to the avatar and never disables the widget,
 *   - the heavy 9:16 video is not requested until the card is actually opened,
 *   - reduced-motion visitors get posters and no video request at all.
 */

const CHARM_HEALTH_URL =
  'https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2';
const PHONE_HREF = 'tel:+12394230272';

const MEDIA = {
  avatar: {
    video: '/assets/video/melva-telehealth-avatar.mp4',
    poster: '/assets/video/melva-telehealth-avatar-poster.webp',
  },
  card: {
    video: '/assets/video/melva-telehealth-widget-9x16.mp4',
    poster: '/assets/video/melva-telehealth-widget-poster.webp',
  },
} as const;

const COPY = {
  en: {
    available: 'Virtual visits available',
    open: 'Meet Dr. Reve by secure video',
    close: 'Close video',
    lead: 'Meet Dr. Reve by secure video',
    book: 'Book a virtual visit',
    call: 'Call now',
  },
  es: {
    available: 'Consulta virtual disponible',
    open: 'Conozca a la Dra. Reve por video',
    close: 'Cerrar video',
    lead: 'Hable con la Dra. Reve por video',
    book: 'Agendar cita virtual',
    call: 'Llamar ahora',
  },
} as const;

// Routes that already own the conversion: the contact page has the form, so the widget stands down.
const HIDDEN_ROUTES = ['/contact', '/es/contacto'];

const TelehealthVideoWidget = () => {
  const [location] = useLocation();
  const { language } = useLanguage();
  const copy = COPY[language === 'es' ? 'es' : 'en'];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoadCard, setShouldLoadCard] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionKnown, setMotionKnown] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardVideoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const restoreFocusRef = useRef(false);

  // Appear after a beat so the widget never competes with the hero for first paint.
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    setMotionKnown(true);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const collapse = useCallback(() => {
    cardVideoRef.current?.pause();
    // Focus is restored in an effect, not here: the avatar button is unmounted while the card is
    // shown, so triggerRef.current is still null at this point and a synchronous focus() is a no-op.
    restoreFocusRef.current = true;
    setIsExpanded(false);
    setShouldLoadCard(false);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
    if (!reduceMotion) setShouldLoadCard(true);
  }, [reduceMotion]);

  // Hover only where hovering is real: a touch device reports hover on tap and would open by accident.
  const expandFromHover = useCallback(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    expand();
  }, [expand]);

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') collapse();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded, collapse]);

  useEffect(() => {
    if (isExpanded) {
      closeRef.current?.focus();
    } else if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isExpanded]);

  // Reset to the rest state on navigation so an open card doesn't persist across pages.
  // Intentionally does not set restoreFocusRef: focus should move to the new page, not the avatar.
  useEffect(() => {
    setIsExpanded(false);
    setShouldLoadCard(false);
  }, [location]);

  // Don't burn battery looping video in a background tab.
  useEffect(() => {
    const sync = () => {
      for (const video of [avatarVideoRef.current, cardVideoRef.current]) {
        if (!video) continue;
        if (document.hidden) video.pause();
        else void video.play().catch(() => undefined);
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [isExpanded, shouldLoadCard, motionKnown, reduceMotion]);

  if (HIDDEN_ROUTES.includes(location)) return null;
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[9998] lg:bottom-8 lg:right-8"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      onMouseLeave={() => { if (isExpanded) collapse(); }}
      data-testid="telehealth-video-widget"
      data-expanded={isExpanded}
    >
      {/* Zero-size anchor: both states are absolutely pinned to this corner. CSS entry animations
          keep this small conversion control independent from a full animation runtime. */}
      <div className="relative w-0 h-0">
        {isExpanded ? (
          <div
            className={`absolute bottom-0 right-0 w-[232px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-200 ${
              reduceMotion
                ? ''
                : 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300'
            }`}
            role="dialog"
            aria-label={copy.open}
            data-testid="telehealth-widget-card"
          >
            <div className="relative">
              {shouldLoadCard && !reduceMotion ? (
                <video
                  ref={cardVideoRef}
                  className="block w-full aspect-[9/16] object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster={MEDIA.card.poster}
                  src={MEDIA.card.video}
                  aria-label={copy.open}
                />
              ) : (
                <img
                  className="block w-full aspect-[9/16] object-cover"
                  src={MEDIA.card.poster}
                  alt={copy.open}
                />
              )}

              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-green-800 shadow-md font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" aria-hidden="true" />
                {copy.available}
              </span>

              <button
                ref={closeRef}
                type="button"
                onClick={collapse}
                aria-label={copy.close}
                data-testid="button-close-telehealth-widget"
                className="absolute top-2.5 right-2.5 rounded-full bg-black/55 hover:bg-black/75 p-1.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              <p className="flex items-center gap-1.5 text-[11px] leading-snug text-gray-600 font-body">
                <Video className="w-3.5 h-3.5 text-green-700 shrink-0" aria-hidden="true" />
                {copy.lead}
              </p>

              <a
                href={CHARM_HEALTH_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLeadConversion('appointment_booking', {
                    click_location: 'telehealth_video_widget',
                  })
                }
                data-testid="button-widget-book"
                className="flex items-center justify-center gap-1.5 w-full rounded-full bg-green-800 hover:bg-green-900 px-3 py-2.5 text-xs font-semibold text-white transition-colors font-body"
              >
                <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                {copy.book}
              </a>

              <a
                href={PHONE_HREF}
                onClick={() =>
                  trackLeadConversion('phone_call', {
                    click_location: 'telehealth_video_widget',
                  })
                }
                data-testid="button-widget-call"
                className="flex items-center justify-center gap-1.5 w-full rounded-full border border-green-800 px-3 py-2.5 text-xs font-semibold text-green-800 hover:bg-green-50 transition-colors font-body"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                {copy.call}
              </a>
            </div>
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={expand}
            onPointerEnter={expandFromHover}
            aria-label={copy.open}
            aria-expanded={false}
            data-testid="button-open-telehealth-widget"
            className={`absolute bottom-0 right-0 block w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
              reduceMotion
                ? ''
                : 'animate-in fade-in-0 zoom-in-90 duration-300 transition-transform hover:scale-105 active:scale-95'
            }`}
          >
            {/* The circular crop lives on this inner span, not on the button: `overflow-hidden` on the
                button would also clip the availability dot, burying it inside the circle instead of
                letting it sit on the edge. */}
            <span className="block w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-[0_2px_6px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.35)] bg-black">
              {motionKnown && !reduceMotion ? (
                <video
                  ref={avatarVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={MEDIA.avatar.poster}
                  src={MEDIA.avatar.video}
                  aria-hidden="true"
                  tabIndex={-1}
                />
              ) : (
                <img className="w-full h-full object-cover" src={MEDIA.avatar.poster} alt="" />
              )}
            </span>

            {/* Centered ON the circle's edge at 45°: offset from the corner = R(1 − 1/√2) − dot/2,
                so the avatar's circumference passes through the dot's center (not tangent to it).
                R=32 → ~1.5px (mobile); R=36 → ~2.5px (desktop). Border width matches the avatar's. */}
            <span
              className="absolute bottom-[1.5px] right-[1.5px] lg:bottom-[2.5px] lg:right-[2.5px] w-4 h-4 rounded-full bg-green-500 border-[3px] border-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TelehealthVideoWidget;
