import type { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptimizedImage from './OptimizedImage';

export type MobileInsuranceLogo = {
  src: string | StaticImageData;
  alt: string;
  name: string;
};

type MobileInsuranceCarouselProps = {
  logos: MobileInsuranceLogo[];
  testId?: string;
  logoTestIdPrefix?: string;
  pauseLabel?: string;
  resumeLabel?: string;
};

const logoTestId = (prefix: string, name: string) =>
  `${prefix}-${name.toLowerCase().replace(/\s+/g, '-')}`;

const findNextCandidate = (
  activeIndex: number,
  logoCount: number,
  failedIndexes: ReadonlySet<number>,
) => {
  for (let offset = 1; offset < logoCount; offset += 1) {
    const index = (activeIndex + offset) % logoCount;
    if (!failedIndexes.has(index)) return index;
  }

  return null;
};

export default function MobileInsuranceCarousel({
  logos,
  testId,
  logoTestIdPrefix = 'insurance-logo',
  pauseLabel = 'Pause logos',
  resumeLabel = 'Resume logos',
}: MobileInsuranceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [failedIndexes, setFailedIndexes] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const activeIndexRef = useRef(0);
  const loadedIndexesRef = useRef(new Set<number>());
  const failedIndexesRef = useRef(new Set<number>());
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      if (logos.length < 2) return;

      const outgoingIndex = activeIndexRef.current;
      const candidateIndex = findNextCandidate(
        outgoingIndex,
        logos.length,
        failedIndexesRef.current,
      );

      // A slow or failed request must never replace the logo that is already
      // visible. Failed candidates are skipped, and a hidden candidate is
      // promoted only after it is ready.
      if (
        candidateIndex === null ||
        !loadedIndexesRef.current.has(candidateIndex)
      ) return;

      activeIndexRef.current = candidateIndex;
      setPreviousIndex(outgoingIndex);
      setActiveIndex(candidateIndex);

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setPreviousIndex(null);
        transitionTimerRef.current = null;
      }, 500);
    }, 2000);

    return () => {
      clearInterval(interval);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [isPaused, logos.length, prefersReducedMotion]);

  if (logos.length === 0) return null;

  if (prefersReducedMotion) {
    return (
      <div
        className="grid grid-cols-2 gap-6 px-2 md:hidden"
        data-testid={testId}
        data-reduced-motion="static"
      >
        {logos.map((logo, index) => (
          <div
            key={logo.name}
            className="flex min-h-28 items-center justify-center"
            data-testid={logoTestId(logoTestIdPrefix, logo.name)}
          >
            <OptimizedImage
              src={logo.src}
              alt={logo.alt}
              className="h-24 w-auto object-contain filter grayscale"
              width={192}
              height={96}
              priority={false}
              sizes="(max-width: 767px) 45vw, 192px"
              onReady={() => loadedIndexesRef.current.add(index)}
              onFailure={() => {
                loadedIndexesRef.current.delete(index);
                if (failedIndexesRef.current.has(index)) return;
                failedIndexesRef.current.add(index);
                setFailedIndexes(new Set(failedIndexesRef.current));
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  const nextIndex = findNextCandidate(
    activeIndex,
    logos.length,
    failedIndexes,
  );
  const renderedIndexes = [previousIndex, activeIndex, nextIndex].filter(
    (index, position, indexes): index is number =>
      index !== null && indexes.indexOf(index) === position,
  );

  return (
    <div className="block md:hidden" data-testid={testId}>
      <div className="h-48 flex items-center justify-center">
        <div className="relative w-full flex items-center justify-center">
          {renderedIndexes.map((index) => {
            const logo = logos[index];
            const isActive = index === activeIndex;

            return (
              <div
                key={logo.name}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 motion-reduce:transition-none ${
                  isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                }`}
                data-testid={logoTestId(logoTestIdPrefix, logo.name)}
                data-active={isActive ? 'true' : 'false'}
                aria-hidden={!isActive}
              >
                <OptimizedImage
                  src={logo.src}
                  alt={logo.alt}
                  className="h-36 w-auto object-contain filter grayscale"
                  width={256}
                  height={144}
                  priority={false}
                  sizes="256px"
                  onReady={() => loadedIndexesRef.current.add(index)}
                  onFailure={() => {
                    loadedIndexesRef.current.delete(index);
                    if (failedIndexesRef.current.has(index)) return;
                    failedIndexesRef.current.add(index);
                    setFailedIndexes(new Set(failedIndexesRef.current));
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-2" aria-hidden="true">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        {!prefersReducedMotion && logos.length > 1 ? (
          <button
            type="button"
            className="text-sm font-medium text-green-800 underline underline-offset-4"
            aria-pressed={isPaused}
            onClick={() => setIsPaused((paused) => !paused)}
          >
            {isPaused ? resumeLabel : pauseLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
