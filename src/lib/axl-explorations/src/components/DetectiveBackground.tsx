import React from 'react';

interface DetectiveBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function DetectiveBackground({ children, className = '' }: DetectiveBackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black ${className}`}>
      {children}
    </div>
  );
}
