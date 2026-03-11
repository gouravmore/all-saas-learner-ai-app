import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Crown, 
  Medal, 
  Gift,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { cn } from "../lib/utils";

interface SuccessScreenProps {
  gameTitle: string;
  score: number;
  totalQuestions: number;
  totalAttempts?: number;
  starsEarned: number;
  newAchievements?: string[];
  onPlayAgain: () => void;
  onBackToHub: () => void;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
  continueButtonText?: string; // Optional: custom text for the continue/next level button
}

export function SuccessScreen({
  gameTitle,
  score,
  totalQuestions,
  totalAttempts,
  starsEarned,
  newAchievements = [],
  onPlayAgain,
  onBackToHub,
  onNextLevel,
  hasNextLevel = false,
  continueButtonText
}: SuccessScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const attemptsUsed = Math.max(totalAttempts ?? totalQuestions, 1);
  const perfectScore = score === attemptsUsed;
  const percentage = Math.round((score / attemptsUsed) * 100);

  // Animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 500),
      setTimeout(() => setCurrentStep(2), 1200),
      setTimeout(() => setCurrentStep(3), 2000),
      setTimeout(() => setShowConfetti(false), 8000)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const confettiElements = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '👏'][Math.floor(Math.random() * 7)],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    left: Math.random() * 100,
  }));

  return (
    <div className="h-full w-full bg-gradient-sky relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6" style={{ height: "100%", maxHeight: "100vh", overflow: "auto" }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiElements.map((confetti) => (
            <div
              key={confetti.id}
              className="absolute text-lg sm:text-xl md:text-2xl animate-bounce-in opacity-90"
              style={{
                left: `${confetti.left}%`,
                animationDelay: `${confetti.delay}s`,
                animationDuration: `${confetti.duration}s`,
                top: '-10%',
                transform: `translateY(120vh) rotate(${Math.random() * 360}deg)`
              }}
            >
              {confetti.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 text-3xl sm:text-5xl md:text-6xl animate-float opacity-60">☁️</div>
        <div className="absolute top-16 sm:top-32 right-4 sm:right-20 text-2xl sm:text-4xl md:text-5xl animate-bounce-soft opacity-70">🌈</div>
        <div className="absolute bottom-10 sm:bottom-20 left-4 sm:left-20 text-2xl sm:text-3xl md:text-4xl animate-sparkle opacity-80">⭐</div>
        <div className="absolute bottom-20 sm:bottom-40 right-4 sm:right-10 text-2xl sm:text-4xl md:text-5xl animate-float opacity-60">✨</div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full px-2 sm:px-4 flex items-center justify-center">
        {/* Main Success Card */}
        <Card className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-magical border-2 border-success/30 text-center w-full max-h-[85vh] overflow-y-auto">
          {/* Trophy and Title */}
          <div className={cn(
            "transition-all duration-1000 transform",
            currentStep >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="relative mb-2 sm:mb-3">
              <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 animate-pulse-glow shadow-success">
                {perfectScore ? (
                  <Crown className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white animate-wiggle" />
                ) : (
                  <Trophy className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white animate-celebration" />
                )}
              </div>
              
              {/* Floating stars around trophy */}
              <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 text-warning text-sm sm:text-base animate-sparkle">⭐</div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-warning text-sm sm:text-base animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 text-warning text-sm sm:text-base animate-sparkle" style={{ animationDelay: '1s' }}>🌟</div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-warning text-sm sm:text-base animate-sparkle" style={{ animationDelay: '1.5s' }}>⭐</div>
            </div>

            <div className="mt-1 mb-2 text-xs sm:text-sm md:text-base font-medium text-foreground px-2">
                {percentage === 100 && "Amazing! You got everything right!"}
                {percentage >= 90 && percentage < 100 && "🎯 Excellent work! You're almost perfect!"}
                {percentage >= 80 && percentage < 90 && "👏 Great job! You're learning so well!"}
                {percentage >= 70 && percentage < 80 && "💪 Good effort! Keep practicing!"}
                {percentage < 70 && "🌱 Nice try! Every attempt makes you stronger!"}
              </div>
            {/* Removed game title completion line as requested */}
          </div>

          {/* Stars Display */}
          <div className={cn(
            "transition-all duration-1000 transform delay-1000",
            currentStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="mb-2 sm:mb-3">
              {/* <h3 className="text-xl font-bold text-foreground mb-4">Stars Earned!</h3> */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7",
                      i < starsEarned
                        ? "text-warning fill-warning"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className={cn(
            "transition-all duration-1000 transform delay-2000",
            currentStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2">
              {hasNextLevel && (
                <Button
                  onClick={onNextLevel}
                  variant="success"
                  size="lg"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  {continueButtonText || "Next Level"}
                </Button>
              )}
              
              {!hasNextLevel && (
                <Button
                onClick={onPlayAgain}
                variant="game"
                size="lg"
                className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                Play Again
              </Button>
              )}
            </div>
          </div>

          {/* Fun mascot message */}
          <div className={cn(
            "transition-all duration-1000 transform delay-2500",
            currentStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="mt-2 sm:mt-3 bg-gradient-to-br from-blue-game/20 to-purple-game/20 rounded-full p-1.5 sm:p-2 inline-block">
              <div className="text-xl sm:text-2xl md:text-3xl animate-wiggle">🦉</div>
            </div>
            <div className="mt-1 px-2 text-xs sm:text-sm text-muted-foreground italic">
              "I'm so proud of you! Keep up the amazing work!" 
            </div>
          </div>
        </Card>

        {/* Removed perfect score bonus banner */}
      </div>
    </div>
  );
}