import React from 'react';

interface ClockwiseTimerProps {
  timeRemaining: number;
  totalTime: number;
  className?: string;
}

export function ClockwiseTimer({ timeRemaining, totalTime, className = "" }: ClockwiseTimerProps) {
  // Calculate the percentage of time remaining
  const percentage = (timeRemaining / totalTime) * 100;
  
  // Calculate the stroke-dasharray for the circle
  const circumference = 2 * Math.PI * 30; // radius = 30 (reduced from 45)
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on time remaining
  const getColor = () => {
    if (percentage < 30) return '#ef4444'; // red
    if (percentage < 60) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };
  
  // Format time as MM:SS or M:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const color = getColor();
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-3">
        {/* Circular progress bar without time inside */}
        <div className="relative">
          <svg width="70" height="70" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="35"
              cy="35"
              r="30"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="35"
              cy="35"
              r="30"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-out"
            />
          </svg>
        </div>
        {/* Time text outside the circle in the same row */}
        <div className="flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-gray-800">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
