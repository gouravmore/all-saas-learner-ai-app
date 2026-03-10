import { Fuel } from "lucide-react";
import { cn } from "../lib/utils";

interface FuelProgressBarProps {
  currentFuel: number;
  requiredFuel: number;
  className?: string;
  showRocket?: boolean;
  hidePercentage?: boolean;
  fuelIconImage?: string;
  showCheckpoint?: boolean;
  maxFuel: number;
  hideHeader?: boolean;
  progressIcon?: string; // Custom icon to show on progress bar (default: 🚀)
}


export function FuelProgressBar({ 
  currentFuel, 
  requiredFuel, 
  className,
  showRocket = true,
  hidePercentage = false,
  fuelIconImage,
  showCheckpoint = true,
  maxFuel,
  hideHeader = false,
  progressIcon = "🚀"
}: FuelProgressBarProps) {
  const percentage = Math.min((currentFuel / maxFuel) * 100, 100);
  const isComplete = currentFuel >= requiredFuel;

  const progressColor = currentFuel <= requiredFuel/2 ? "bg-orange-500" : currentFuel <= requiredFuel ? "bg-blue-500" : "bg-green-500";

  return (
    <div className={cn(hideHeader ? "" : "space-y-2", className)}>
      {!hideHeader && (
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {fuelIconImage ? (
            <img 
              src={fuelIconImage} 
              alt="Fuel" 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
            />
          ) : (
            <Fuel className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 fill-blue-600" />
          )}
          <span className="font-medium text-white">
            Fuel: {currentFuel} / {maxFuel}
          </span>
        </div>
        {showRocket && isComplete && (
          <div className={cn(
            "flex items-center gap-1.5 transition-all duration-300 text-green-500"
          )}>
            <span className="text-xs font-semibold">Ready to Launch!</span>
          </div>
        )}
      </div>
      )}
      
      <div className="relative">
        {/* Neutral background */}
        <div className="h-4 sm:h-5 w-full rounded-full overflow-hidden shadow-inner border border-gray-400 bg-gray-500" />
        
        {/* Progress fill - color changes based on zone */}
        <div className="absolute inset-0 h-4 sm:h-5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500 ease-out rounded-full relative", progressColor)}
            style={{ width: `${percentage}%` }}
          >
            {/* Sparkles with random positions across the progress bar fill */}
            {percentage > 0 && (
              <>
                {[...Array(40)].map((_, i) => {
                  // Use seeded random-like values based on index for consistent but random-looking positions
                  const seed1 = Math.sin(i * 12.9898) * 43758.5453;
                  const seed2 = Math.sin(i * 78.233) * 43758.5453;
                  const seed3 = Math.sin(i * 45.164) * 43758.5453;
                  const seed4 = Math.sin(i * 93.989) * 43758.5453;
                  const seed5 = Math.sin(i * 27.456) * 43758.5453;
                  
                  // Random horizontal position (0-100% of fill)
                  const sparklePosition = (seed1 - Math.floor(seed1)) * 100;
                  // Random vertical position (15-85% of height)
                  const topOffset = 15 + (seed2 - Math.floor(seed2)) * 70;
                  // Random size (0.5px to 2.5px)
                  const size = 0.5 + (seed3 - Math.floor(seed3)) * 2;
                  // Random animation duration (0.8s to 2.5s)
                  const animDuration = 0.8 + (seed4 - Math.floor(seed4)) * 1.7;
                  // Random animation delay (0s to 3s)
                  const animDelay = (seed5 - Math.floor(seed5)) * 3;
                  
                  return (
                    <div
                      key={i}
                      className="absolute bg-white rounded-full z-20"
                      style={{
                        left: `${sparklePosition}%`,
                        top: `${topOffset}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.9), 0 0 4px 2px rgba(255, 255, 255, 0.6), 0 0 6px 3px rgba(255, 255, 255, 0.3)',
                        animation: `sparkle-twinkle ${animDuration}s ease-in-out infinite`,
                        animationDelay: `${animDelay}s`
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
        
        {/* 80% checkpoint marker */}
        {showCheckpoint && (
          <div className="absolute top-0 h-full w-1 bg-green-600/70 rounded" style={{ left: `${requiredFuel/maxFuel*100}%` }}>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-green-600 font-bold whitespace-nowrap">
              🎯
            </div>
          </div>
        )}
        
        {/* Progress Icon (Rocket or custom) */}
        {showRocket && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-10"
            style={{ left: `${Math.max(Math.min(percentage, 98), 2)}%` }}
          >
            <span className={cn(
              "text-xl sm:text-2xl transition-transform duration-300 inline-block",
              isComplete && "animate-bounce"
            )}>
              {progressIcon}
            </span>
          </div>
        )}
      </div>
      
      {/* Fuel meter visual indicator - only show if not hidden */}
      {!hidePercentage && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className={cn(
            "font-semibold transition-colors duration-300",
            isComplete ? "text-green-600" : "text-blue-600"
          )}>
            {Math.round(percentage)}%
          </span>
          <span>{requiredFuel}</span>
        </div>
      )}
    </div>
  );
}

