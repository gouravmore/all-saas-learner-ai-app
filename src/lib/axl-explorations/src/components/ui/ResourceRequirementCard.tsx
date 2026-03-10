import React from 'react';

interface ResourceRequirementCardProps {
  /** Left icon component (e.g., Fuel or Star icon) */
  leftIcon: React.ReactNode;
  /** Label text to display next to the icon */
  label: string;
  /** Right icon/image component (e.g., PlanetIcon or image) */
  rightIcon: React.ReactNode;
  /** Progress value (0-100), defaults to 100 */
  progress?: number;
  /** Alignment for the card container - 'end' aligns with bottom, 'center' aligns with center */
  alignment?: 'end' | 'center';
  /** Additional className for the container */
  className?: string;
}

/**
 * Common component for displaying resource requirement cards
 * Used in Letter Launcher (Fuel Needed) and Odd One Out (Stars needed) story previews
 */
export function ResourceRequirementCard({
  leftIcon,
  label,
  rightIcon,
  progress = 100,
  alignment = 'end',
  className = ''
}: ResourceRequirementCardProps) {
  const alignmentClass = alignment === 'center' ? 'items-center' : 'items-end';

  return (
    <>
      {/* Desktop: Card in center */}
      <div className={`hidden sm:block ${className}`}>
        <div 
          className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-6 border-2 border-blue-300" 
          style={{ minWidth: '220px', maxWidth: 'calc(100% - 1rem)', width: 'fit-content' }}
        >
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 whitespace-nowrap">
              {leftIcon}
              <div className="text-sm sm:text-base md:text-lg text-gray-600 whitespace-nowrap">{label}</div>
            </div>
            {rightIcon}
          </div>
          <div className="bg-gray-200 rounded-full h-4 sm:h-5 md:h-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile: Card in same line with characters */}
      <div className={`block sm:hidden ${className}`}>
        <div 
          className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 border-2 border-blue-300" 
          style={{ minWidth: '200px', maxWidth: '280px', width: 'fit-content' }}
        >
          <div className="flex flex-row items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-2 whitespace-nowrap">
              {leftIcon}
              <div className="text-base text-gray-600 whitespace-nowrap">{label}</div>
            </div>
            {rightIcon}
          </div>
          <div className="bg-gray-200 rounded-full h-5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

