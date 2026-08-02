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
};

const logoTestId = (name: string) =>
  `insurance-logo-${name.toLowerCase().replace(/\s+/g, '-')}`;

export default function MobileInsuranceCarousel({
  logos,
  testId,
}: MobileInsuranceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const activeIndexRef = useRef(0);
  const loadedIndexesRef = useRef(new Set<number>());
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (logos.length < 2) return;

      const outgoingIndex = activeIndexRef.current;
      const candidateIndex = (outgoingIndex + 1) % logos.length;

      // A slow or failed request must never replace the logo that is already
      // visible. The hidden candidate is promoted only after it is ready.
      if (!loadedIndexesRef.current.has(candidateIndex)) return;

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
  }, [logos.length]);

  if (logos.length === 0) return null;

  const nextIndex = (activeIndex + 1) % logos.length;
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
                data-testid={logoTestId(logo.name)}
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
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
