import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { Language } from "../../constants/languages";
import { cn } from "../../lib/utils";
import { ContinueButton } from "./ContinueButton";

export interface FillInBlanksQuestion {
  sentence: string;
  missingWord: string;
  correctAnswer: string;
  options: string[];
  language: Language;
  complexity: string;
  level: number;
}

export interface FillInBlanksGameCoreProps {
  currentQuestion: FillInBlanksQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  selectedAnswer?: string | null;
  showFeedback?: boolean;
  isCorrect?: boolean;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onAnswerSelect: (answer: string) => void;
  onCheckAnswer?: () => void;
  onContinue?: () => void;
  className?: string;
}

export function FillInBlanksGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  selectedAnswer = null,
  showFeedback = false,
  isCorrect = false,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onAnswerSelect,
  onCheckAnswer,
  onContinue,
  className = ''
}: FillInBlanksGameCoreProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  const getLocalizedText = (key: string) => {
    const texts = {
      chooseCorrectWord: {
        en: 'Choose the correct word:',
        te: 'సరైన పదాన్ని ఎంచుకోండి:',
        kn: 'ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ:',
        mr: 'योग्य शब्द निवडा:'
      },
      checkAnswer: {
        en: 'Check Answer',
        te: 'సమాధానాన్ని తనిఖీ చేయండి',
        kn: 'ಉತ್ತರವನ್ನು ಪರಿಶೀಲಿಸಿ',
        mr: 'उत्तर तपासा'
      },
      successMessage: {
        en: '🎉 Correct!',
        te: '🎉 సరైనది!',
        kn: '🎉 ಸರಿ!',
        mr: '🎉 बरोबर!'
      },
      failureMessage: {
        en: '😢 Oops! Wrong!',
        te: '😢 అయ్యో! తప్పు!',
        kn: '😢 ಅಯ್ಯೋ! ತಪ್ಪು!',
        mr: '😢 अरेच्या! चुकीचे!'
      }
    };
    return texts[key as keyof typeof texts]?.[selectedLanguage] || texts[key as keyof typeof texts]?.en || '';
  };

  return (
    <div className={`flex-1 flex flex-col px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${className}`}>
      {/* Top Content - Balanced Height */}
      <div className="flex flex-col justify-center min-h-0 flex-shrink-0">
        {/* Top Section - Icon */}
        <div className="text-center mb-2 sm:mb-3">
          <div className="inline-block p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <span className="text-lg sm:text-xl">📝</span>
          </div>
        </div>

        {/* Middle Section - Sentence with blank */}
        <div className="mb-3 sm:mb-4">
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 px-4 sm:px-6 break-words">
              {currentQuestion.sentence.replace(currentQuestion.missingWord, '_____')}
            </p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="mb-3 sm:mb-4">
          {!isPreview && (
            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center px-2">{getLocalizedText('chooseCorrectWord')}</h3>
          )}
          <div className="relative flex items-center justify-center max-w-2xl mx-auto w-full px-2">
            {/* Hand Pointer - positioned absolutely so it doesn't affect centering */}
            {showHandPointer && (
              <div className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2 rotate-90">
                <div className="animate-bounce">
                  <span className="text-3xl inline-block">👆</span>
                </div>
              </div>
            )}
            
            <div 
              ref={optionsRef}
              className="grid grid-cols-2 gap-2 sm:gap-3 flex-1"
              tabIndex={0}
            >
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  size="default"
                  className={cn(
                    "h-14 sm:h-16 text-2xl sm:text-3xl font-bold transition-all duration-200",
                    selectedAnswer === option 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                  )}
                  onClick={() => !disabled && !showFeedback && onAnswerSelect(option)}
                  disabled={disabled || showFeedback}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Check Answer Button and Feedback */}
      <div className="text-center py-3 sm:py-4 min-h-[80px] sm:min-h-[90px] flex flex-col items-center justify-center flex-shrink-0 px-2">
        {/* Check Answer Button */}
        {selectedAnswer && !showFeedback && onCheckAnswer && (
          <div className="flex flex-col items-center justify-center h-full">
            <Button
              variant="success"
              size="default"
              onClick={onCheckAnswer}
              className="animate-bounce-in text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {getLocalizedText('checkAnswer')}
            </Button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="flex flex-col items-center justify-center h-full gap-2 sm:gap-3">
            {isCorrect ? (
              <div className="text-success">
                <p className="text-lg sm:text-xl font-bold">
                  {getLocalizedText('successMessage')}
                </p>
              </div>
            ) : (
              <div className="text-error">
                <p className="text-lg sm:text-xl font-bold">{getLocalizedText('failureMessage')}</p>
              </div>
            )}
            
            {/* Continue Button - Only show in main game, not preview */}
            <ContinueButton
              onContinue={onContinue}
              isPreview={isPreview}
            />
          </div>
        )}
      </div>
    </div>
  );
}
