import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft } from "lucide-react";

interface StepResult {
  step: number;
  pairsFound: number;
  movesUsed: number;
  timeTaken: number;
}

interface GameCompleteScreenProps {
  stepResults: StepResult[];
  timeRemaining: number;
  score: number;
  onBack: () => void;
}

export function GameCompleteScreen({ stepResults, timeRemaining, score, onBack }: GameCompleteScreenProps) {
  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time in minutes helper
  const formatTimeInMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    } else if (secs === 0) {
      return `${mins}m`;
    } else {
      return `${mins}m ${secs}s`;
    }
  };

  const totalScore = score;
  const totalTimeSpent = stepResults.reduce((sum, result) => sum + result.timeTaken, 0);

  return (
    <div className="min-h-screen bg-gradient-cool p-2 sm:p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center order-first sm:order-none">
            <h1 className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Game Complete!
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Results Card */}
        <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm shadow-xl">
          {/* Congratulations Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You did an amazing job! 🎉
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stepResults.reduce((sum, result) => sum + result.pairsFound, 0)}</div>
              <div className="text-sm text-gray-600">Total Pairs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stepResults.reduce((sum, result) => sum + result.movesUsed, 0)}</div>
              <div className="text-sm text-gray-600">Total Moves</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{formatTime(totalTimeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              onClick={onBack}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
