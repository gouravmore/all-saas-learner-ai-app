import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { Language } from "../../constants/languages";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { ContinueButton } from "./ContinueButton";

export interface MemoryQuestion {
  sequence: string[];
  display: string;
  complexity: string;
  language: Language;
}

interface MemoryGameCoreProps {
  // Question data
  currentSequence: MemoryQuestion;
  
  // Game state
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  currentLevel: number;
  
  // UI state
  showSequence: boolean;
  showFeedback: boolean;
  isCorrect: boolean;
  userInput: string[];
  currentLetterOptions: string[];
  
  // Preview-specific state
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  sequenceTimer?: number;
  
  // Handlers
  onLetterClick: (letter: string) => void;
  onRemoveLast: () => void;
  onCheckSequence?: () => void;
  onContinue?: () => void;
  showContinueButton?: boolean; // Control whether to show the continue button
  
  // Styling
  className?: string;
}

export function MemoryGameCore({
  currentSequence,
  mode,
  selectedLanguage,
  currentLevel,
  showSequence,
  showFeedback,
  isCorrect,
  userInput,
  currentLetterOptions,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  sequenceTimer = 0,
  onLetterClick,
  onRemoveLast,
  onCheckSequence,
  onContinue,
  showContinueButton,
  className = ''
}: MemoryGameCoreProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  // Get localized text
  const getLocalizedText = (key: string) => {
    const texts = {
      whatWasSequence: {
        en: 'What was the sequence?',
        te: 'క్రమం ఏమిటి?',
        kn: 'ಅನುಕ್ರಮ ಏನು?',
        mr: 'क्रम काय होता?'
      },
      clickLetters: {
        en: 'Click letters below...',
        te: 'క్రింద అక్షరాలను క్లిక్ చేయండి...',
        kn: 'ಕೆಳಗೆ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ...',
        mr: 'खाली अक्षरांवर क्लिक करा...'
      },
      removeLast: {
        en: 'Remove Last',
        te: 'చివరిది తొలగించు',
        kn: 'ಕೊನೆಯದನ್ನು ತೆಗೆದುಹಾಕಿ',
        mr: 'शेवटचे काढा'
      },
      checkSequence: {
        en: 'Check Sequence',
        te: 'క్రమం తనిఖీ చేయండి',
        kn: 'ಅನುಕ್ರಮವನ್ನು ಪರಿಶೀಲಿಸಿ',
        mr: 'क्रम तपासा'
      },
      check: {
        en: 'Check',
        te: 'తనిఖీ',
        kn: 'ಪರಿಶೀಲಿಸಿ',
        mr: 'तपासा'
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
      }
    };
    
    return texts[key as keyof typeof texts]?.[selectedLanguage] || texts[key as keyof typeof texts]?.en || '';
  };

  return (
    <div className={`flex-1 flex flex-col justify-start px-1 sm:px-2 ${className}`}>
      {showSequence ? (
        /* Sequence Display Phase */
        <div className="text-center">
          {/* Timer - Only show during sequence display phase in preview mode */}
          {isPreview && sequenceTimer > 0 && (
            <div className="mb-1 flex-shrink-0 flex justify-center sm:justify-end">
              <div className="flex flex-col items-center gap-1">
                <div className="scale-[0.7] sm:scale-[0.72] md:scale-[0.75] origin-center">
                  <ClockwiseTimer 
                    timeRemaining={sequenceTimer}
                    totalTime={sequenceTimer + 1} // Approximate total time
                    className="justify-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sequence Display */}
          <div className="bg-gradient-to-r from-primary/20 to-purple-game/20 rounded-xl p-4 sm:p-6 md:p-8 mb-3 sm:mb-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-wider">
              {currentSequence.display}
            </div>
          </div>
        </div>
      ) : (
        /* Input Phase */
        <div className="text-center">

          {/* User Input Display */}
          <div className="mb-2 sm:mb-3">
            <div className="min-h-[45px] sm:min-h-[50px] p-2 border-2 border-dashed border-warning/50 rounded-xl bg-warning/5 flex justify-center items-center gap-1 flex-wrap">
              {userInput.length === 0 ? (
                <p className="text-muted-foreground text-xs sm:text-sm">{getLocalizedText('clickLetters')}</p>
              ) : (
                userInput.map((letter, index) => (
                  <div
                    key={index}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-warning text-warning-foreground rounded-lg flex items-center justify-center text-sm sm:text-base font-bold animate-bounce-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </div>
                ))
              )}
            </div>
            
            {/* Progress indicator */}
            <div className="mt-1 text-xs text-muted-foreground">
              {userInput.length} of {currentSequence.sequence.length} letters
            </div>
          </div>

{/* Letter Selection Grid */}
<div className="mb-2 sm:mb-3">
  <div className="flex justify-center">
    <div className="relative">
      {/* Hand Pointer for preview mode */}
      {mode === 'preview' && showHandPointer && !showFeedback && userInput.length < currentSequence.sequence.length && (
        <div className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2 rotate-90">
          <div className="animate-bounce">
            <span className="text-2xl inline-block">👆</span>
          </div>
        </div>
      )}

      {/* Dynamic Responsive Grid */}
      <div
  ref={optionsRef}
      className={`
    grid
    ${mode === 'preview' ? 'gap-3 sm:gap-4 md:gap-5 lg:gap-6' : 'gap-3 sm:gap-4 md:gap-5 lg:gap-6'}
    justify-items-center
    transition-all duration-300
  `}
  style={{
    // dynamically calculate number of columns based on letters
    gridTemplateColumns: `repeat(${Math.min(
      Math.ceil(currentLetterOptions.length / 2), // 2 letters per row by default
      5 // max 5 columns
    )}, minmax(3rem, 1fr))`,
    maxWidth: mode === 'preview'
      ? (currentLetterOptions.length <= 4
          ? '22rem' // small
          : currentLetterOptions.length <= 6
          ? '32rem' // medium
          : currentLetterOptions.length <= 8
          ? '42rem' // large
          : '52rem') // extra large
      : (currentLetterOptions.length <= 4
          ? '24rem' // small
          : currentLetterOptions.length <= 6
          ? '36rem' // medium
          : currentLetterOptions.length <= 8
          ? '48rem' // large
          : '60rem'), // extra large
    margin: '0 auto', // center the grid
  }}
  tabIndex={0}
>
  {currentLetterOptions.map((letter) => (
    <Button
  key={letter}
  variant="outline"
  className={`
    font-bold flex items-center justify-center text-center
    hover:bg-primary hover:text-primary-foreground hover:border-primary
    transition-all duration-200 shadow-md hover:shadow-lg

    ${mode === 'preview' 
      ? 'h-10 w-10 text-xl sm:h-12 sm:w-12 sm:text-2xl md:h-14 md:w-14 md:text-3xl lg:h-16 lg:w-16 lg:text-4xl'
      : 'h-16 w-16 text-3xl sm:h-20 sm:w-20 sm:text-4xl md:h-24 md:w-24 md:text-5xl lg:h-26 lg:w-26 lg:text-6xl'
    }
  `}
  style={{
    lineHeight: mode === 'preview' ? '1.2' : '1.1', // visually centers text in smaller buttons
  }}
  onClick={() => !disabled && onLetterClick(letter)}
  disabled={userInput.length >= currentSequence.sequence.length || disabled}
>
  {letter}
</Button>

  ))}
</div>

    </div>
  </div>
</div>


          {/* Action Buttons */}
          <div className="flex justify-center gap-2 px-2 sm:px-0">
            {!showFeedback && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemoveLast}
                disabled={userInput.length === 0 || disabled}
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                {getLocalizedText('removeLast')}
              </Button>
            )}
            
            {userInput.length === currentSequence.sequence.length && !showFeedback && onCheckSequence && (
              <Button
                variant="success"
                size="sm"
                onClick={onCheckSequence}
                disabled={disabled}
                className="animate-bounce-in text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{getLocalizedText('checkSequence')}</span>
                <span className="sm:hidden">{getLocalizedText('check')}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Feedback - Fixed Height Area */}
      <div className="mt-0 sm:mt-1 text-center min-h-[100px] sm:min-h-[110px] flex flex-col items-center justify-center">
        {showFeedback && (
          <>
            {isCorrect ? (
              <div className="text-success">
                <p className="text-lg sm:text-xl font-bold">
                  {getLocalizedText('correct')}
                </p>
              </div>
            ) : (
              <div className="text-error">
                <p className="text-lg sm:text-xl font-bold">{getLocalizedText('wrong')}</p>
              </div>
            )}
            
            {/* Continue Button - only show in game mode, unless showContinueButton is explicitly false */}
            <ContinueButton
              onContinue={onContinue}
              mode={mode}
              showContinueButton={showContinueButton}
            />
          </>
        )}
      </div>
    </div>
  );
}
