import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { Timer } from "lucide-react";
import { Language } from "../../constants/languages";
import { ContinueButton } from "./ContinueButton";

export interface ROARRapidVisualQuestion {
  target: string;
  letters: string[];
  targetPosition: number;
  complexity: string;
  language: Language;
}

interface ROARRapidVisualGameCoreProps {
  // Question data
  currentQuestion: ROARRapidVisualQuestion;
  
  // Game state
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  
  // Timer state
  timeRemaining: number;
  isTimerRunning: boolean;
  
  // UI state
  showTargetLetter: boolean;
  showSelectionGrid: boolean;
  showFeedback: boolean;
  isCorrect: boolean;
  selectedPosition: number | null;
  
  // Preview-specific state
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  
  // Handlers
  onPositionSelect: (position: number) => void;
  onContinue?: () => void;
  
  // Styling
  className?: string;
}

export function ROARRapidVisualGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  timeRemaining,
  isTimerRunning,
  showTargetLetter,
  showSelectionGrid,
  showFeedback,
  isCorrect,
  selectedPosition,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onPositionSelect,
  onContinue,
  className = ''
}: ROARRapidVisualGameCoreProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Get localized text
  const getLocalizedText = (key: string) => {
    const texts = {
      findLetter: {
        en: 'Find the Letter',
        te: 'అక్షరాన్ని కనుగొనండి',
        kn: 'ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ',
        mr: 'अक्षर शोधा'
      },
      correct: {
        en: '🎉 Correct!',
        te: '🎉 సరైనది!',
        kn: '🎉 ಸರಿ!',
        mr: '🎉 बरोबर!'
      },
      wrong: {
        en: '😢 Oops! Wrong!',
        te: '😢 అయ్యో! తప్పు!',
        kn: '😢 ಅಯ್ಯೋ! ತಪ್ಪು!',
        mr: '😢 अरेच्या! चुकीचे!'
      },
      time: {
        en: 'Time',
        te: 'సమయం',
        kn: 'ಸಮಯ',
        mr: 'वेळ'
      },
      finishLevel: {
        en: 'Finish Level',
        te: 'లెవల్ పూర్తి చేయండి',
        kn: 'ಮಟ್ಟವನ್ನು ಮುಗಿಸಿ',
        mr: 'पातळी पूर्ण करा'
      }
    };
    
    return texts[key as keyof typeof texts]?.[selectedLanguage] || texts[key as keyof typeof texts]?.en || '';
  };

  return (
    <div
      className={`flex-1 flex flex-col justify-start px-1 sm:px-2 ${className}`}
    >
      {/* Top Section - Question/Target */}
      {showTargetLetter ? (
        /* Target Letter Display Phase */
        <div className="text-center mb-1">
          <div className="mb-1">
            {/* Timer for preview mode - positioned like main game */}
            {isPreview && isTimerRunning && (
              <div className="mb-1 flex-shrink-0 flex justify-center sm:justify-end">
                <div className="flex flex-col items-center gap-1">
                  <div className="scale-[0.7] sm:scale-[0.72] md:scale-[0.75] origin-center">
                    <ClockwiseTimer
                      timeRemaining={timeRemaining}
                      totalTime={3}
                      className="justify-center"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="inline-block p-2.5 sm:p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
              <div className="text-xl sm:text-2xl mb-1">🔍</div>
              <div className="text-center">
                <div className="relative">
                  <span className="font-bold text-4xl sm:text-5xl md:text-6xl text-primary bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-primary shadow-md animate-pulse inline-block">
                    {currentQuestion.target}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Selection Phase */
        <div className="mb-1">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-foreground">
              {getLocalizedText("findLetter")}
            </h2>
          </div>

          {/* Visual Processing Grid */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="relative">
              {/* Hand Pointer for preview mode */}
              {mode === "preview" && showHandPointer && !showFeedback && (
                <div className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2 rotate-90">
                  <div className="animate-bounce">
                    <span className="text-2xl inline-block">👆</span>
                  </div>
                </div>
              )}
              
              <div 
                ref={gridRef}
                className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 md:gap-6"
                tabIndex={0}
              >
                {currentQuestion.letters.map((letter, index) => (
                  <Button
                    key={index}
                    variant={
                      showFeedback
                        ? isCorrect && index === selectedPosition
                          ? "success"
                          : !isCorrect && index === selectedPosition
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    size="lg"
                    className="
            h-16 w-16 text-3xl
            sm:h-20 sm:w-20 sm:text-4xl
            md:h-24 md:w-24 md:text-5xl
            font-bold
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all duration-200 shadow-md hover:shadow-lg
          "
                    onClick={() =>
                      !showFeedback && !disabled && onPositionSelect(index)
                    }
                    disabled={showFeedback || disabled}
                  >
                    {letter || " "}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback - Fixed Height Area */}
      <div className="mt-1 text-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px] flex flex-col items-center justify-start">
        {showFeedback && (
          <>
            {isCorrect ? (
              <div className="text-success">
                <p className="text-lg sm:text-xl font-bold">
                  {getLocalizedText("correct")}
                </p>
              </div>
            ) : (
              <div className="text-error">
                <p className="text-lg sm:text-xl font-bold">
                  {getLocalizedText("wrong")}
                </p>
              </div>
            )}

            {/* Continue Button - only show in game mode */}
            <ContinueButton
              onContinue={onContinue}
              mode={mode}
            />
          </>
        )}
      </div>
    </div>
  );
}
