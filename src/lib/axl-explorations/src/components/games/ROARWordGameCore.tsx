import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Language } from "../../constants/languages";
import { ContinueButton } from "./ContinueButton";

export interface ROARWordQuestion {
  word: string;
  isReal: boolean;
  complexity: string;
  language: Language;
}

export interface ROARWordGameCoreProps {
  currentQuestion: ROARWordQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  showFeedback?: boolean;
  isCorrect?: boolean;
  selectedAnswer?: boolean | null;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onAnswerSelect: (isReal: boolean) => void;
  onContinue?: () => void;
  className?: string;
}

export function ROARWordGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  showFeedback = false,
  isCorrect = false,
  selectedAnswer = null,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onAnswerSelect,
  onContinue,
  className = ''
}: ROARWordGameCoreProps) {
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Get localized text
  const getLocalizedText = (key: string) => {
    const texts = {
      isThisRealWord: {
        en: 'Is this a real word?',
        te: 'ఇది నిజమైన పదమా?',
        kn: 'ಇದು ನಿಜವಾದ ಪದವೇ?',
        mr: 'हा खरा शब्द आहे का?'
      },
      correctMessage: {
        en: '🎉 Correct!',
        te: '🎉 సరైనది!',
        kn: '🎉 ಸರಿ!',
        mr: '🎉 बरोबर!'
      },
      wrongMessage: {
        en: '😢 Oops! Wrong!',
        te: '😢 అయ్యో! తప్పు!',
        kn: '😢 ಅಯ್ಯೋ! ತಪ್ಪು!',
        mr: '😢 अरेच्या! चुकीचे!'
      }
    };
    
    return texts[key as keyof typeof texts]?.[selectedLanguage] || texts[key as keyof typeof texts]?.en || '';
  };

  return (
    <div className={`flex-1 flex flex-col justify-center px-1 sm:px-2 ${className}`}>
      <div className="space-y-4 sm:space-y-6">
        {/* Word Display */}
        <div className="text-center">
          {isPreview ? (
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
                {currentQuestion.word}
              </h2>
            </div>
          ) : (
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
              {currentQuestion.word}
            </h2>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative flex items-center justify-center">
          {/* Hand Pointer - positioned absolutely so it doesn't affect centering */}
          {showHandPointer && (
            <div className="absolute left-1/2 transform -translate-x-full -translate-y-1/2 rotate-90 -ml-72">
              <div className="animate-bounce">
                <span className="text-4xl inline-block">👆</span>
              </div>
            </div>
          )}
          
          <div 
            ref={buttonsRef}
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg w-full px-4 sm:px-0 mx-auto"
            tabIndex={0}
          >
            <Button
              variant={
                showFeedback 
                  ? (selectedAnswer === true && isCorrect ? "success" : 
                     selectedAnswer === true && !isCorrect ? "destructive" : "outline")
                  : "outline"
              }
              size="lg"
              className="h-14 sm:h-16 w-full text-lg sm:text-xl font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center group"
              onClick={() => !disabled && !showFeedback && onAnswerSelect(true)}
              disabled={disabled || showFeedback}
            >
              <div className="scale-[1.5] sm:scale-[2.5]">
                <Check className="text-green-600 group-hover:text-white transition-colors duration-200" />
              </div>
            </Button>

            <Button
              variant={
                showFeedback 
                  ? (selectedAnswer === false && isCorrect ? "success" : 
                     selectedAnswer === false && !isCorrect ? "destructive" : "outline")
                  : "outline"
              }
              size="lg"
              className="h-14 sm:h-16 w-full text-lg sm:text-xl font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center group"
              onClick={() => !disabled && !showFeedback && onAnswerSelect(false)}
              disabled={disabled || showFeedback}
            >
              <div className="scale-[1.5] sm:scale-[2.5]">
                <X className="text-red-600 group-hover:text-white transition-colors duration-200" />
              </div>
            </Button>
          </div>
        </div>

        {/* Feedback Area - Show in both game and preview modes */}
        {showFeedback && (
          <div className="animate-fade-in text-center mt-1">
            <div className={`${
              isCorrect ? 'text-success' : 'text-error'
            }`}>
              <p className="text-lg sm:text-xl font-bold">
                {isCorrect ? getLocalizedText('correctMessage') : getLocalizedText('wrongMessage')}
              </p>
            </div>
            
            {/* Continue Button - Only show in game mode */}
            <ContinueButton
              onContinue={onContinue}
              mode={mode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
