import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AudioButton } from "../AudioButton";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { ArrowLeft, RotateCcw, TrendingUp } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { generatePhonemeQuestions, type PhonemeQuestion } from "../../utils/gameDataGenerators";

interface PhonemeGameProps {
  onBack: () => void;
}

export function PhonemeGame({ onBack }: PhonemeGameProps) {
  const { 
    startSession, 
    recordAnswer, 
    endSession, 
    getGameProgress, 
    getDifficultySettings,
    currentSession 
  } = useLearningProgress();

  const [questions, setQuestions] = useState<PhonemeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  const gameProgress = getGameProgress('phoneme');
  const difficultySettings = getDifficultySettings('phoneme', gameProgress.currentLevel);

  // Initialize game session and questions
  useEffect(() => {
    const session = startSession('phoneme');
    setPreviousLevel(gameProgress.currentLevel);
    
    const newQuestions = generatePhonemeQuestions(
      gameProgress.currentLevel,
      difficultySettings.complexity,
      10
    );
    setQuestions(newQuestions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handlePhonemeSelect = (phoneme: string) => {
    if (showFeedback) return;
    
    setSelectedPhoneme(phoneme);
    const correct = phoneme === currentQuestion.target;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Record the answer for adaptive learning
    recordAnswer(correct);
    
    if (correct) {
      setScore(score + 10);
      setTotalCorrect(totalCorrect + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedPhoneme(null);
        setShowFeedback(false);
      } else {
        // Game complete - end session and check for level up
        endSession();
        const newProgress = getGameProgress('phoneme');
        if (newProgress.currentLevel > previousLevel) {
          setShowLevelUp(true);
        }
        setIsGameComplete(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedPhoneme(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    
    // Start new session and regenerate questions
    const session = startSession('phoneme');
    const newQuestions = generatePhonemeQuestions(
      gameProgress.currentLevel,
      difficultySettings.complexity,
      10
    );
    setQuestions(newQuestions);
  };

  const calculateStars = () => {
    const percentage = (totalCorrect / questions.length) * 100;
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (totalCorrect === questions.length) {
      achievements.push("Phoneme Master - Perfect Score!");
    }
    if (totalCorrect >= Math.floor(questions.length * 0.8)) {
      achievements.push("Sound Explorer - Great Progress!");
    }
    if (showLevelUp) {
      achievements.push(`Level Up! Now at Level ${gameProgress.currentLevel}`);
    }
    return achievements;
  };

  // Show success screen when game is complete
  if (isGameComplete) {
    return (
      <SuccessScreen
        gameTitle="Phoneme Recognition"
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={gameProgress.currentLevel < 10}
        onNextLevel={() => {
          resetGame();
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cool relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-80">🔤</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce-soft opacity-70">📢</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-sparkle opacity-60">🎵</div>
        <div className="absolute bottom-40 right-16 text-3xl animate-float opacity-75">🗣️</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Phoneme Recognition
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>Level {gameProgress.currentLevel} • {difficultySettings.complexity}</span>
            </div>
          </div>
          
          {/* <Button 
            variant="outline" 
            onClick={resetGame}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button> */}
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6 bg-white/90 backdrop-blur-sm">
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={questions.length} 
            score={score}
          />
        </Card>

        {/* Game Area */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-floating">
          <div className="text-center mb-8">
            <AudioButton 
              audioText={currentQuestion.audio}
              size="lg"
              className="mb-4"
            />
            <p className="text-2xl font-bold text-foreground mb-2">
              {currentQuestion.audio}
            </p>
            <p className="text-lg text-muted-foreground">
              Sound: {currentQuestion.sound}
            </p>
          </div>

          {/* Phoneme Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {currentQuestion.options.map((phoneme) => (
              <Button
                key={phoneme}
                variant={selectedPhoneme === phoneme ? "default" : "outline"}
                size="lg"
                onClick={() => handlePhonemeSelect(phoneme)}
                disabled={showFeedback}
                className={`h-20 text-3xl font-bold transition-all duration-300 ${
                  showFeedback
                    ? phoneme === currentQuestion.target
                      ? "bg-success text-success-foreground border-success animate-pulse"
                      : selectedPhoneme === phoneme
                      ? "bg-error text-error-foreground border-error"
                      : ""
                    : "hover:scale-105 hover:shadow-floating"
                }`}
              >
                {phoneme}
              </Button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center animate-fade-in">
              {isCorrect ? (
                <div className="text-success text-xl font-bold">
                  🎉 Excellent! That's the sound {currentQuestion.sound}
                </div>
              ) : (
                <div className="text-error text-xl font-bold">
                  The correct sound is {currentQuestion.sound} ({currentQuestion.target})
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}