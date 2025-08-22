import { Suspense } from 'react';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  ) 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;