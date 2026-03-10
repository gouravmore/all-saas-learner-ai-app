import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Crown, Zap, BookOpen, Brain, Award, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isEarned: boolean;
}

const achievements: Achievement[] = [
  {
    id: "learning-champion",
    title: "Learning Champion",
    description: "Complete your first game!",
    icon: Crown,
    color: "text-warning",
    isEarned: true
  },
  {
    id: "quick-learner", 
    title: "Quick Learner",
    description: "Answer 5 questions in under 10 seconds",
    icon: Zap,
    color: "text-blue-game",
    isEarned: true
  },

  {
    id: "letter-master",
    title: "Letter Master",
    description: "Complete 10 letter games",
    icon: Brain,
    color: "text-purple-game",
    isEarned: true
  },
  {
    id: "perfect-week",
    title: "Perfect Week",
    description: "Play every day for a week",
    icon: Award,
    color: "text-error",
    isEarned: false
  },
  {
    id: "star-collector",
    title: "Star Collector",
    description: "Earn 100 stars",
    icon: Sparkles,
    color: "text-pink-game",
    isEarned: false
  }
];

interface AchievementsProps {
  className?: string;
  maxDisplay?: number;
}

export function Achievements({ className, maxDisplay = 3 }: AchievementsProps) {
  const recentAchievements = achievements
    .filter(achievement => achievement.isEarned)
    .slice(0, maxDisplay);

  return (
    <Card className={cn("p-6 bg-card border border-border mb-8", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Crown className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Recent Achievements</h3>
      </div>
      
      <div className="space-y-3">
        {recentAchievements.map((achievement, index) => (
          <div 
            key={achievement.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <achievement.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">
                  {achievement.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="text-xs bg-success/20 text-success">
              Earned!
            </Badge>
          </div>
        ))}
      </div>
      
      {recentAchievements.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Start playing to earn achievements!</p>
        </div>
      )}
    </Card>
  );
}