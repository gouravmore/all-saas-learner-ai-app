import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft } from "lucide-react";

interface TryAgainScreenProps {
  onTryAgain: () => void;
  onBack: () => void;
}

export function TryAgainScreen({ onTryAgain, onBack }: TryAgainScreenProps) {
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
              Try Again!
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Try Again Card */}
        <Card className="p-6 sm:p-8 text-center bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">😔</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Oops! Time's Up
            </h2>
            <p className="text-gray-600 text-lg">
              Don't worry, you can try again and improve your score!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onTryAgain}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Try Again
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
