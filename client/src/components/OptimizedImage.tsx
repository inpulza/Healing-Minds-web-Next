import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: priority ? '0px' : '100px 0px',
    triggerOnce: true,
  });

  const shouldLoad = priority || isIntersecting;
  
  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const imageStyle: React.CSSProperties = {
    ...style,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
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
        <img
          src={src}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          sizes={sizes}
          {...(priority && { fetchpriority: 'high' })}
          {...(width && height && { intrinsicsize: `${width}x${height}` })}
          {...props}
        />
      ) : (
        <div
          className={`${className} bg-gray-100 animate-pulse`}
          style={{ ...style }}
          aria-label="Loading image..."
        />
      )}
    </div>
  );
};

export default OptimizedImage;