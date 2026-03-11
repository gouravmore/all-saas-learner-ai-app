import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

interface LivesProps {
  lives: number;
  maxLives?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  onLifeLost?: () => void; // Callback when a life is lost
}

export function Lives({ 
  lives, 
  maxLives = 3, 
  className = "",
  size = "lg",
  onLifeLost
}: LivesProps) {
  const [previousLives, setPreviousLives] = useState(lives);
  const [justLostLife, setJustLostLife] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6",
    md: "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8",
    lg: "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10"
  };

  // Detect when a life is lost
  useEffect(() => {
    if (lives < previousLives) {
      // Calculate which life was lost
      const lostLifeNumber = maxLives - lives; // The lost life corresponds to this number
      setJustLostLife(lostLifeNumber);

      // Call callback if provided
      if (onLifeLost) {
        onLifeLost();
      }

      // Clear the animation after it completes
      const timer = setTimeout(() => {
        setJustLostLife(null);
      }, 800);

      return () => clearTimeout(timer);
    }
    setPreviousLives(lives);
  }, [lives, previousLives, onLifeLost]);

  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2 md:gap-2.5", className)}>
      {Array.from({ length: maxLives }, (_, index) => {
        const lifeNumber = index + 1;
        // Lives are removed from left to right
        const isAlive = index >= (maxLives - lives);
        const isJustLost = justLostLife === lifeNumber;

        return (
          <div key={index} className="relative">
            <Heart
              className={cn(
                sizeClasses[size],
                "transition-all duration-500 ease-in-out",
                isAlive
                  ? "fill-red-500 text-red-500 "
                  : isJustLost
                  ? "fill-red-500 text-red-500 animate-heart-break"
                  : "fill-gray-400 text-gray-400 opacity-50"
              )}
              style={{
                animationDelay: isAlive ? `${index * 0.1}s` : "0s",
              }}
            />
            {/* Sparkle effect when life is lost */}
            {isJustLost && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-yellow-400 text-xs sm:text-sm animate-sparkle-pop">
                  ✨
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
