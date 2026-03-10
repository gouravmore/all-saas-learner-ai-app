import { Progress } from "./ui/progress";
import { Trophy, Star, Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  score?: number;
  className?: string;
  showCompleteMessage?: boolean;
  lives?: number;
  maxLives?: number;
  onLifeLost?: () => void;
}

export function ProgressBar({ 
  current, 
  total, 
  score, 
  className, 
  showCompleteMessage = true,
  lives,
  maxLives = 3,
  onLifeLost
}: ProgressBarProps) {
  const percentage = (current / total) * 100;
  const isComplete = current === total;
  const [previousLives, setPreviousLives] = useState(lives ?? maxLives);
  const [justLostLife, setJustLostLife] = useState<number | null>(null);

  // Size classes matching Lives component "lg" size
  const iconSizeClasses = "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10";

  // Detect when a life is lost
  useEffect(() => {
    if (lives !== undefined && lives < previousLives) {
      const lostLifeNumber = maxLives - lives;
      setJustLostLife(lostLifeNumber);

      if (onLifeLost) {
        onLifeLost();
      }

      const timer = setTimeout(() => {
        setJustLostLife(null);
      }, 800);

      return () => clearTimeout(timer);
    }
    if (lives !== undefined) {
      setPreviousLives(lives);
    }
  }, [lives, previousLives, maxLives, onLifeLost]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Progress: {current}/{total}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-3 bg-muted"
      />
      
      {/* Stars and Lives on the same line - Stars on left, Lives on right */}
      {(score !== undefined || lives !== undefined) && (
        <div className="flex items-center justify-between">
          {/* Star score - Left side */}
          {score !== undefined && (
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Star className={cn(iconSizeClasses, "fill-current text-yellow-500")} />
              {/* <span className="font-bold text-sm sm:text-base md:text-lg">{score}</span> */}
              <span className="font-bold text-base sm:text-lg md:text-2xl lg:text-3xl">{score}</span>
            </div>
          )}
          
          {/* Lives Display - Right side, aligned with star */}
          {lives !== undefined && (
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
              {Array.from({ length: maxLives }, (_, index) => {
                const lifeNumber = index + 1;
                const isAlive = index >= (maxLives - lives);
                const isJustLost = justLostLife === lifeNumber;

                return (
                  <div key={index} className="relative">
                    <Heart
                      className={cn(
                        iconSizeClasses,
                        "transition-all duration-500 ease-in-out",
                        isAlive
                          ? "fill-red-500 text-red-500"
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
          )}
        </div>
      )}
      
      {/* {isComplete && showCompleteMessage && (
        <div className="flex items-center justify-center gap-2 text-success animate-bounce-in">
          <Trophy className="h-5 w-5 fill-current" />
          <span className="font-bold">Level Complete!</span>
        </div>
      )} */}
    </div>
  );
}