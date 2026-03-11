import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface CountdownTimerProps {
  initialCount?: number;
  onComplete: () => void;
}

export function CountdownTimer({
  initialCount = 3,
  onComplete,
}: CountdownTimerProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col rounded-2xl">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-4 md:py-6">
        {/* Countdown Number with magical animations */}
        <div 
          key={count}
          className="animate-countdown-pop flex-shrink-0"
        >
          <div className="relative">
            {/* Multiple pulsing rings for magical effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-ping opacity-25" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 animate-ping opacity-15" style={{ animationDelay: '0.4s' }}></div>
            
            {/* Main countdown circle with gradient - Responsive sizing */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              {/* Inner magical glow */}
              <div className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-full opacity-60 blur-2xl animate-pulse"></div>
              
              {/* The countdown number - Responsive text */}
              <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl animate-pulse">
                {count}
              </div>
            </div>
            
            {/* Floating sparkles with different animations - Responsive sizing */}
            <div className="absolute -top-6 sm:-top-8 -right-6 sm:-right-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-float shadow-xl">
              <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
            </div>
            <div className="absolute -top-6 sm:-top-8 -left-6 sm:-left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-400 rounded-full flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '0.5s' }}>
              <span className="text-xl sm:text-2xl md:text-3xl">💫</span>
            </div>
            <div className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-pink-400 rounded-full flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '0.3s' }}>
              <span className="text-xl sm:text-2xl md:text-3xl">⭐</span>
            </div>
            <div className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-400 rounded-full flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '0.7s' }}>
              <span className="text-2xl sm:text-3xl md:text-4xl">🌟</span>
            </div>
            
            {/* Orbiting small stars - Responsive sizing and positioning */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 sm:-translate-y-4 text-base sm:text-lg md:text-xl">⭐</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 sm:translate-y-4 text-base sm:text-lg md:text-xl">✨</div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 sm:-translate-x-4 text-base sm:text-lg md:text-xl">💫</div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 sm:translate-x-4 text-base sm:text-lg md:text-xl">🌟</div>
            </div>
          </div>
        </div>

        {/* Progress dots with rainbow colors - Responsive sizing */}
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
          {[...Array(3)].map((_, index) => {
            const colors = [
              'from-blue-500 to-purple-500',
              'from-purple-500 to-pink-500',
              'from-pink-500 to-red-500'
            ];
            return (
              <div
                key={index}
                className={`rounded-full transition-all duration-500 transform ${
                  count <= index + 1 
                    ? `w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${colors[index]} scale-125 shadow-2xl animate-bounce` 
                    : 'w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 opacity-50'
                }`}
              ></div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

