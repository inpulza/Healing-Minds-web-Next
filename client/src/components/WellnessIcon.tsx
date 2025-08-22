import React, { ReactNode, useMemo } from 'react';

interface WellnessIconProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple' | 'orange';
  className?: string;
}

const WellnessIcon = React.memo(({ 
  children, 
  size = 'md', 
  color = 'green',
  className = '' 
}: WellnessIconProps) => {
  // Memoize class objects to prevent recreation on each render
  const sizeClasses = useMemo(() => ({
    sm: 'w-8 h-8 min-w-[2rem] min-h-[2rem]',
    md: 'w-12 h-12 min-w-[3rem] min-h-[3rem]', 
    lg: 'w-16 h-16 min-w-[4rem] min-h-[4rem]'
  }), []);

  const iconSizes = useMemo(() => ({
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }), []);

  const colorClasses = useMemo(() => ({
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600', 
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }), []);

  // Memoize the computed className to prevent recalculation
  const containerClassName = useMemo(() => 
    `${sizeClasses[size]} rounded-full flex items-center justify-center ${colorClasses[color]} ${className} flex-shrink-0 wellness-icon`,
    [sizeClasses, size, colorClasses, color, className]
  );

  const iconClassName = useMemo(() => 
    `${iconSizes[size]} flex items-center justify-center`,
    [iconSizes, size]
  );

  return (
    <div className={containerClassName}>
      <div className={iconClassName}>
        {children}
      </div>
    </div>
  );
});

// Set display name for debugging
WellnessIcon.displayName = 'WellnessIcon';

export default WellnessIcon;