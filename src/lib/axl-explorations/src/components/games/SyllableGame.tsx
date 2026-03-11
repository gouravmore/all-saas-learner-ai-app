import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AudioButton } from "../AudioButton";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const SAMPLE_SYLLABLES = [
  { 
    phonemes: ["क", "ना"], 
    target: "कना",
    sounds: ["ka", "na"],
    audio: "Drag and drop to form the syllable: ka + na"
  },
  { 
    phonemes: ["म", "ता"], 
    target: "मता",
    sounds: ["ma", "ta"],
    audio: "Drag and drop to form the syllable: ma + ta"
  },
  { 
    phonemes: ["स", "रा"], 
    target: "सरा",
    sounds: ["sa", "ra"],
    audio: "Drag and drop to form the syllable: sa + ra"
  },
];

interface SyllableGameProps {
  onBack: () => void;
}

export function SyllableGame({ onBack }: SyllableGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [arrangedPhonemes, setArrangedPhonemes] = useState<string[]>([]);
  const [availablePhonemes, setAvailablePhonemes] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const currentQuestion = SAMPLE_SYLLABLES[currentLevel];

  useEffect(() => {
    // Shuffle phonemes initially
    const shuffled = [...currentQuestion.phonemes].sort(() => Math.random() - 0.5);
    setAvailablePhonemes(shuffled);
    setArrangedPhonemes([]);
  }, [currentLevel]);

  const addPhonemeToSyllable = (phoneme: string, index: number) => {
    setArrangedPhonemes([...arrangedPhonemes, phoneme]);
    setAvailablePhonemes(availablePhonemes.filter((_, i) => i !== index));
  };

  const removePhonemeFromSyllable = (index: number) => {
    const phoneme = arrangedPhonemes[index];
    setAvailablePhonemes([...availablePhonemes, phoneme]);
    setArrangedPhonemes(arrangedPhonemes.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const formedSyllable = arrangedPhonemes.join('');
    const correct = formedSyllable === currentQuestion.target;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 25);
      setTotalCorrect(totalCorrect + 1);
    }

    setTimeout(() => {
      if (correct && currentLevel < SAMPLE_SYLLABLES.length - 1) {
        setCurrentLevel(currentLevel + 1);
        const nextQuestion = SAMPLE_SYLLABLES[currentLevel + 1];
        const shuffled = [...nextQuestion.phonemes].sort(() => Math.random() - 0.5);
        setAvailablePhonemes(shuffled);
        setArrangedPhonemes([]);
        setShowFeedback(false);
      } else if (correct || currentLevel === SAMPLE_SYLLABLES.length - 1) {
        // Game complete - show success screen
        setIsGameComplete(true);
      } else {
        setShowFeedback(false);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setTotalCorrect(0);
    const shuffled = [...SAMPLE_SYLLABLES[0].phonemes].sort(() => Math.random() - 0.5);
    setAvailablePhonemes(shuffled);
    setArrangedPhonemes([]);
    setShowFeedback(false);
    setIsGameComplete(false);
  };

  const calculateStars = () => {
    const percentage = (totalCorrect / SAMPLE_SYLLABLES.length) * 100;
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (totalCorrect === SAMPLE_SYLLABLES.length) {
      achievements.push("Syllable Wizard - Perfect Building!");
    }
    if (totalCorrect >= 2) {
      achievements.push("Magic Builder - Great Combining!");
    }
    return achievements;
  };

  // Show success screen when game is complete
  if (isGameComplete) {
    return (
      <SuccessScreen
        gameTitle="Syllable Magic"
        score={totalCorrect}
        totalQuestions={SAMPLE_SYLLABLES.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={true}
        onNextLevel={() => {
          resetGame();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature p-4">
      <div className="max-w-4xl mx-auto">
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
          
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Syllable Magic
          </h1>
          
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
            current={currentLevel + 1} 
            total={SAMPLE_SYLLABLES.length} 
            score={score}
          />
        </Card>

        {/* Game Area */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-floating">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Build the Syllable!
            </h2>
            
            {/* Visual prompt showing the phonemes */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {currentQuestion.phonemes.map((phoneme, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30">
                    {phoneme}
                  </div>
                  {index < currentQuestion.phonemes.length - 1 && (
                    <span className="text-2xl font-bold text-primary">+</span>
                  )}
                </div>
              ))}
            </div>

            {/* Audio for each phoneme */}
            <div className="flex justify-center gap-2 mb-6">
              {currentQuestion.sounds.map((sound, index) => (
                <AudioButton 
                  key={index}
                  audioText={`Sound: ${sound}`}
                  size="sm"
                  className="text-xs"
                />
              ))}
            </div>

            <AudioButton 
              audioText={currentQuestion.audio}
              size="lg"
              className="mb-4"
            />
            <p className="text-lg text-muted-foreground">
              Target: <span className="font-bold text-primary text-2xl">{currentQuestion.target}</span>
            </p>
          </div>

          {/* Syllable Building Area */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-center">Build your syllable:</h3>
            <div className="min-h-[100px] p-6 border-3 border-dashed border-success/50 rounded-xl bg-success/5 flex flex-wrap gap-3 justify-center items-center">
              {arrangedPhonemes.length === 0 ? (
                <p className="text-muted-foreground text-lg">Drag phonemes here...</p>
              ) : (
                <div className="flex items-center gap-1">
                  {arrangedPhonemes.map((phoneme, index) => (
                    <Button
                      key={index}
                      variant="success"
                      className="text-2xl font-bold h-16 w-16 rounded-lg"
                      onClick={() => removePhonemeFromSyllable(index)}
                    >
                      {phoneme}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Phonemes */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-center">Available phonemes:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {availablePhonemes.map((phoneme, index) => (
                <Button
                  key={index}
                  variant="game"
                  className="text-2xl font-bold h-16 w-16 rounded-lg"
                  onClick={() => addPhonemeToSyllable(phoneme, index)}
                >
                  {phoneme}
                </Button>
              ))}
            </div>
          </div>

          {/* Check Answer Button */}
          {arrangedPhonemes.length === currentQuestion.phonemes.length && !showFeedback && (
            <div className="text-center">
              <Button
                variant="success"
                size="lg"
                onClick={checkAnswer}
                className="animate-bounce-in"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Check My Syllable
              </Button>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="mt-8 text-center">
              {isCorrect ? (
                <div className="text-success animate-celebration">
                  <p className="text-2xl font-bold">Magical! ✨</p>
                  <p className="text-lg">You built "{arrangedPhonemes.join('')}" perfectly!</p>
                </div>
              ) : (
                <div className="text-error">
                  <p className="text-xl font-bold">Almost there! 🪄</p>
                  <p className="text-lg">Try building: "{currentQuestion.target}"</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}