import { ReactNode } from 'react';

interface WellnessIconProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple' | 'orange';
  className?: string;
}

const WellnessIcon = ({ 
  children, 
  size = 'md', 
  color = 'green',
  className = '' 
}: WellnessIconProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600', 
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${colorClasses[color]} ${className}`}>
      <div className={iconSizes[size]}>
        {children}
      </div>
    </div>
  );
};

export default WellnessIcon;