import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Language } from "../../constants/languages";
import { ContinueButton } from "./ContinueButton";

export interface ROARPictureVocabQuestion {
  target: {
    image: string;
    word: string;
    category: string;
  };
  options: Array<{
    image: string;
    word: string;
    category: string;
  }>;
  audio: string;
  complexity: string;
  language: Language;
}

export interface ROARPictureVocabGameCoreProps {
  currentQuestion: ROARPictureVocabQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  showFeedback?: boolean;
  isCorrect?: boolean;
  selectedOption?: string | null;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onOptionSelect: (optionWord: string) => void;
  onContinue?: () => void; // Continue button callback
  feedbackLanguageOverride?: Language;
  className?: string;
}

export function ROARPictureVocabGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  showFeedback = false,
  isCorrect = false,
  selectedOption = null,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onOptionSelect,
  onContinue,
  feedbackLanguageOverride,
  className = ''
}: ROARPictureVocabGameCoreProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  const getLocalizedText = (key: string) => {
     const texts = {
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
    const language = selectedLanguage || 'en';
    return texts[key as keyof typeof texts]?.[language] || texts[key as keyof typeof texts]?.en || '';
  };

  return (
    <div className={`flex-1 flex flex-col justify-center px-1 sm:px-2 ${className}`}>
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          {/* Target Word Display */}
          <div className="mb-3 sm:mb-4">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {currentQuestion.target.word}
            </div>
          </div>
        </div>

        {/* Visual Options */}
        <div className="relative flex items-center justify-center">
          {/* Hand Pointer - positioned absolutely so it doesn't affect centering */}
          {showHandPointer && (
            <div className="absolute left-1/2 transform -translate-x-full -translate-y-1/2 rotate-90 -ml-96">
              <div className="animate-bounce">
                <span className="text-4xl inline-block">👆</span>
              </div>
            </div>
          )}
          
          <div 
            ref={optionsRef}
            className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 w-full max-w-2xl"
            tabIndex={0}
          >
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showFeedback 
                    ? (isCorrect && option.word === selectedOption ? "success" : 
                       !isCorrect && option.word === selectedOption ? "destructive" : "outline")
                    : "outline"
                }
                size="lg"
                className="h-14 sm:h-16 flex flex-col gap-1 p-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                onClick={() => !disabled && !showFeedback && onOptionSelect(option.word)}
                disabled={disabled || showFeedback}
              >
                <div className="text-3xl sm:text-4xl">{option.image}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Feedback Area - Show in both game and preview modes */}
        {showFeedback && (
          <div className="animate-fade-in text-center">
            <div className={`${
              isCorrect ? 'text-success' : 'text-error'
            }`}>
              <p className="text-lg sm:text-xl font-bold">
                {isCorrect ? getLocalizedText('successMessage') : getLocalizedText('failureMessage')}
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
