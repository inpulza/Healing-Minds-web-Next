import { Suspense, useRef, useEffect, useState } from 'react';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ 
  children, 
  priority = 'medium',
  preload = false,
  fallback = (
    <div className="min-h-[200px] flex items-center justify-center">
      <div 
        className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      ></div>
    </div>
  ) 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(preload);

  useEffect(() => {
    if (preload || isInView) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: priority === 'high' ? '200px' : 
                   priority === 'medium' ? '100px' : '50px'
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [isInView, preload, priority]);

  return (
    <div ref={wrapperRef}>
      {isInView && (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      )}
      {!isInView && fallback}
    </div>
  );
};

export default SuspenseWrapper;