import React from 'react';

interface SuperheroBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function SuperheroBackground({ children, className = '' }: SuperheroBackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 ${className}`}>
      {children}
    </div>
  );
}
