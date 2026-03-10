import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface MascotProps {
  className?: string;
  message?: string;
  mood?: "happy" | "excited" | "encouraging" | "proud";
}

const moodMessages = {
  happy: "Ready for some fun learning? 🎉",
  excited: "Wow! You're doing amazing! ⭐",
  encouraging: "Keep going! You've got this! 💪",
  proud: "I'm so proud of your progress! 🏆"
};

export function Mascot({ className, message, mood = "happy" }: MascotProps) {
  const displayMessage = message || moodMessages[mood];
  
  return (
    <div className={cn("relative", className)}>
      {/* Speech bubble */}
      <div className="relative bg-white rounded-xl p-4 shadow-floating max-w-xs mx-auto mb-4 animate-bounce-in">
        <p className="text-foreground font-medium text-center text-sm">
          {displayMessage}
        </p>
        {/* Arrow pointing down */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      </div>

      {/* Mascot Character */}
      <div className="relative bg-gradient-to-br from-blue-game/20 to-purple-game/20 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center animate-float shadow-colorful">
        {/* Simple owl face */}
        <div className="text-4xl">
          🦉
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute -top-2 -right-2 text-warning animate-sparkle">
          ✨
        </div>
        <div className="absolute -bottom-1 -left-2 text-success animate-sparkle" style={{ animationDelay: '0.5s' }}>
          ⭐
        </div>
      </div>
    </div>
  );
}