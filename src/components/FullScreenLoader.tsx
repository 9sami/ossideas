import React from 'react';

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div
      className="fixed inset-0 bg-gray-50 z-40"
      style={{
        top: '64px', // Height of navigation bar
        left: '64px', // Width of sidebar
      }}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
