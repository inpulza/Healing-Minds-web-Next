import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

type StaticImageLike = string | { src: string };

interface OptimizedImageProps extends Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height' | 'priority' | 'loading' | 'onLoad' | 'onError'
> {
  src: StaticImageLike;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  onReady?: () => void;
  onFailure?: () => void;
}

const OptimizedImage: FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onReady,
  onFailure,
  sizes,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: priority ? '0px' : '200px 0px',
    triggerOnce: true,
  });

  const shouldLoad = priority || isIntersecting;
  const resolvedSrc = typeof src === 'string' ? src : src.src;

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    const image = imageRef.current;
    if (!shouldLoad || !image?.complete) return;

    // Static assets can finish before React hydration attaches onLoad. Reconcile
    // the browser's real image state so a successful 200 never stays at opacity 0.
    if (image.naturalWidth > 0) {
      setIsLoaded(true);
      onReady?.();
    } else {
      setHasError(true);
      onFailure?.();
    }
  }, [onFailure, onReady, resolvedSrc, shouldLoad]);
  
  const handleLoad = () => {
    setIsLoaded(true);
    onReady?.();
  };

  const handleError = () => {
    setHasError(true);
    onFailure?.();
  };

  const imageStyle: CSSProperties = {
    ...style,
    transition: priority ? 'none' : 'opacity 0.3s ease-in-out',
    opacity: priority || isLoaded ? 1 : 0,
    willChange: priority ? 'auto' : 'opacity',
  };

  if (hasError) {
    return (
      <div
        ref={ref}
        className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-sm`}
        style={{ ...style }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <div ref={ref} style={style}>
      {shouldLoad ? (
        <Image
          ref={imageRef}
          src={resolvedSrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          sizes={sizes}
          {...props}
        />
      ) : (
        <div
          className={`${className} bg-gray-100 animate-pulse`}
          style={{ ...style }}
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading image...</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
