import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface GoogleMapsEmbedProps {
  /** The Google Maps embed URL from the verified business profile */
  src: string;
  /** Title for the iframe (accessibility) */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Minimum height for the map container */
  minHeight?: string;
  /** Whether to show a loading state */
  showLoading?: boolean;
  /** Context for analytics and styling */
  context?: 'contact' | 'location';
}

const MAP_LOAD_FALLBACK_MS = 8000;

const GoogleMapsEmbed = ({ 
  src, 
  title,
  className = '',
  minHeight = '400px',
  showLoading = true,
  context = 'contact'
}: GoogleMapsEmbedProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(showLoading);
  const loadedSrcRef = useRef<string | null>(null);

  useEffect(() => {
    if (!showLoading || loadedSrcRef.current === src) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const fallback = window.setTimeout(() => setIsLoading(false), MAP_LOAD_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [showLoading, src]);

  const defaultTitle = language === 'en' 
    ? 'Healing Minds Psychiatry Location - 4760 Tamiami Trl N #25, Naples, FL 34103'
    : 'Ubicación Healing Minds Psychiatry - 4760 Tamiami Trl N #25, Naples, FL 34103';

  const handleLoad = () => {
    loadedSrcRef.current = src;
    setIsLoading(false);
  };

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ minHeight }}
      data-testid={`google-maps-${context}`}
    >
      {/* Loading State */}
      {isLoading && showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" data-testid={`google-maps-loading-${context}`}>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-500 text-sm font-body">
              {language === 'en' ? 'Loading map...' : 'Cargando mapa...'}
            </p>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          minHeight,
          opacity: isLoading && showLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title || defaultTitle}
        onLoad={handleLoad}
        className="absolute inset-0 w-full h-full"
        aria-label={language === 'en' 
          ? 'Interactive map showing the location of Healing Minds Psychiatry in Naples, Florida'
          : 'Mapa interactivo que muestra la ubicación de Healing Minds Psychiatry en Naples, Florida'
        }
        data-testid={`iframe-google-maps-${context}`}
      />

      {/* Overlay for accessibility */}
      <div className="sr-only">
        <h3>{title || defaultTitle}</h3>
        <p>
          {language === 'en' 
            ? 'Interactive Google Maps showing our office location at 4760 Tamiami Trail North, Suite 25, Naples, Florida 34103. You can zoom, pan, and get directions from this map.'
            : 'Mapa interactivo de Google Maps que muestra la ubicación de nuestra oficina en 4760 Tamiami Trail North, Suite 25, Naples, Florida 34103. Puede hacer zoom, desplazarse y obtener direcciones desde este mapa.'
          }
        </p>
      </div>
    </div>
  );
};

export default GoogleMapsEmbed;
