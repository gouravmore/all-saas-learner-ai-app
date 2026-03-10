import { Card } from "./ui/card";
import { Star, Target, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

interface UserStatsProps {
  totalStars: number;
  dayStreak: number;
  currentLevel: number;
  className?: string;
}

export function UserStats({ 
  totalStars, 
  dayStreak, 
  currentLevel,
  className 
}: UserStatsProps) {
  const stats = [
    {
      icon: Star,
      label: "Total Stars",
      value: totalStars,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Target,
      label: "Day Streak",
      value: dayStreak,
      color: "text-error",
      bgColor: "bg-error/10"
    },
    {
      icon: TrendingUp,
      label: "Current Level",
      value: `Level ${currentLevel}`,
      color: "text-blue-game",
      bgColor: "bg-blue-game/10"
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card 
          key={stat.label}
          className="p-4 bg-card/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              stat.bgColor
            )}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              
              <div className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}