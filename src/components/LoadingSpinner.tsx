import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'orange',
  fullScreen = false,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const colorClasses = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    gray: 'border-gray-500'
  };

  const spinnerClasses = `
    animate-spin rounded-full border-solid border-t-transparent
    ${sizeClasses[size]}
    ${colorClasses[color as keyof typeof colorClasses]}
  `;

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses} />
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 