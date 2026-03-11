import { ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "../lib/utils";
import { TrendingUp, Clock, Target } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "purple" | "pink" | "teal";
  onClick: () => void;
  className?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  // Session tracking props - only show for combined games
  progressPercentage?: number;
  currentLevel?: number;
  totalTimeSpent?: string;
  completedLevels?: number;
  totalLevels?: number;
  successRate?: number;
  totalSessions?: number;
  isCombinedGame?: boolean; // New prop to control progress display
}

const iconBackgroundColors = {
  primary: "bg-blue-500",
  secondary: "bg-blue-500", 
  success: "bg-blue-500",
  warning: "bg-blue-500",
  purple: "bg-blue-500",
  pink: "bg-blue-500",
  teal: "bg-blue-500"
};

const difficultyColors = {
  Easy: "bg-green-500 text-white",
  Medium: "bg-orange-500 text-white", 
  Hard: "bg-red-500 text-white"
};

const categoryColors = {
  primary: "bg-orange-100 text-orange-600",
  secondary: "bg-green-100 text-green-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  pink: "bg-purple-100 text-purple-600",
  teal: "bg-orange-100 text-orange-600"
};

const categoryLabels = {
  primary: "letter",
  secondary: "word",
  success: "word",
  warning: "word",
  purple: "sentence",
  pink: "sentence",
  teal: "letter"
};

export function GameCard({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  className,
  difficulty = "Easy",
  progressPercentage = 0,
  currentLevel = 1,
  totalTimeSpent = "0m",
  completedLevels = 0,
  totalLevels = 10,
  successRate = 0,
  totalSessions = 0,
  isCombinedGame = false
}: GameCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group h-full flex flex-col",
        className
      )}
    >
      {/* Category tag in top right */}
      <div className="absolute top-4 right-4">
        <span className={cn(
          "px-2 py-1 rounded-md text-xs font-medium",
          categoryColors[color]
        )}>
          {categoryLabels[color]}
        </span>
      </div>

      <div className="p-4 sm:p-5 md:p-6 pt-9 sm:pt-10 md:pt-12 flex flex-col h-full">
        {/* Icon and title section */}
        <div className="flex items-start gap-3 sm:gap-3 md:gap-4 mb-3 sm:mb-3 md:mb-4">
          <div className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white",
            iconBackgroundColors[color]
          )}>
            {icon}
          </div>
          
          <div className="flex-1 pr-1 sm:pr-2">
            <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              {title}
            </h3>
            <div className={cn(
              "inline-flex px-2 py-1 rounded text-xs font-medium",
              difficultyColors[difficulty]
            )}>
              {difficulty}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm sm:text-sm mb-3 sm:mb-3 md:mb-4">
          {description}
        </p>

        {/* Progress Information - Only show for combined games */}
        {isCombinedGame && (
          <div className="space-y-3 mb-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Progress
                </span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
              <div className="text-xs text-gray-500 text-center">
                {completedLevels} of {totalLevels} levels completed
              </div>
            </div>

            {/* Current Level and Time Spent */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <Target className="h-3 w-3" />
                <span>Level {currentLevel}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{totalTimeSpent}</span>
              </div>
            </div>

            {/* Success Rate (only show if user has played) */}
            {totalSessions > 0 && (
              <div className="text-xs text-center text-gray-500">
                Success Rate: {successRate}% ({totalSessions} sessions)
              </div>
            )}
          </div>
        )}
        
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-sm md:text-base py-2.5 sm:py-2.5 md:py-3 min-h-[44px] mt-auto"
          onClick={onClick}
        >
          {isCombinedGame 
            ? (currentLevel > completedLevels ? `Continue Level ${currentLevel}` : 'Continue Learning') 
            : 'Play'
          } {isCombinedGame ? '🦉' : '🎮'}
        </Button>
      </div>
    </Card>
  );
}
