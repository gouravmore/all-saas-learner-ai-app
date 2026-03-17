import { Button } from "../ui/button";
import { Check, X, Fuel, ArrowLeft, ArrowRight } from "lucide-react";
import { Language } from "../../constants/languages";
import { FuelCalculationResult, getFuelTierText } from "../../utils/fuelCalculation";
import { useState, useEffect } from "react";
import React from "react";

export interface LetterLauncherQuestion {
  audioLetter: string; // The letter sound that plays
  displayedLetter: string; // The letter shown on screen
  isMatch: boolean; // Whether displayed letter matches audio letter
  complexity: string;
  language: Language;
}

export interface LetterLauncherGameCoreProps {
  currentQuestion: LetterLauncherQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  showFeedback?: boolean;
  isCorrect?: boolean;
  selectedAnswer?: boolean | null;
  fuelEarned?: FuelCalculationResult | null;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onAnswerSelect: (isMatch: boolean) => void;
  onContinue?: () => void;
  className?: string;
  fuelIconImage?: string; // Optional custom fuel icon image path
}

export function LetterLauncherGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  showFeedback = false,
  isCorrect = false,
  selectedAnswer = null,
  fuelEarned = null,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onAnswerSelect,
  onContinue,
  className = '',
  fuelIconImage
}: LetterLauncherGameCoreProps) {
  // State for fuel fill animation
  const [fillWidth, setFillWidth] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);

  // Trigger fill animation when fuelEarned changes
  useEffect(() => {
    if (fuelEarned && isCorrect) {
      // Calculate fill percentage (max 5 fuel = 100%, but cap at 100%)
      const fillPercent = Math.min((fuelEarned.fuelEarned / 5) * 100, 100);
      // Reset to 0 first, then animate to target
      setFillWidth(0);
      setSliderPosition(0);
      // Small delay to ensure reset is visible, then animate
      setTimeout(() => {
        setFillWidth(fillPercent);
        // Calculate slider position accounting for icon width
        // Icon is 40px (w-10) on larger screens, so we need to account for half of that
        // For 100%, position at ~92% to ensure icon stays fully within bar
        // For other values, position at the fill percentage but ensure it doesn't exceed safe limit
        const iconWidthPercent = 8; // Approximate percentage the icon takes (40px out of ~250px max width)
        const sliderPos = fillPercent >= 100 
          ? Math.max(0, 100 - iconWidthPercent) 
          : Math.min(fillPercent, 100 - iconWidthPercent);
        setSliderPosition(sliderPos);
      }, 50);
    } else {
      setFillWidth(0);
      setSliderPosition(0);
    }
  }, [fuelEarned, isCorrect]);

  // Keyboard navigation: Arrow keys to select options
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when buttons are enabled
      if (disabled || showFeedback) {
        return;
      }

      // Prevent default behavior for arrow keys
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
      }

      // Left arrow = Yes (Check) = true
      if (event.key === 'ArrowLeft') {
        onAnswerSelect(true);
      }
      // Right arrow = No (X) = false
      else if (event.key === 'ArrowRight') {
        onAnswerSelect(false);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, showFeedback, onAnswerSelect]);

  // Get localized text
  const getLocalizedText = (key: string) => {
    const texts = {
      isThisMatch: {
        en: 'Does this letter match the sound?',
        te: 'ఈ అక్షరం ధ్వనికి సరిపోతుందా?',
        kn: 'ಈ ಅಕ್ಷರವು ಧ್ವನಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆಯೇ?',
        mr: 'हा अक्षर आवाजाशी जुळतो का?'
      },
      correctMessage: {
        en: '🎉 Correct!',
        te: '🎉 సరైనది!',
        kn: '🎉 ಸರಿಯಿದೆ!',
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
        {/* Letter Display - Only show after audio ends */}
        <div className="text-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center">
          {currentQuestion.displayedLetter ? (
            <h2 className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold animate-fade-in ${
              isPreview 
                ? 'text-primary' 
                : 'text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] [text-shadow:_0_0_10px_rgba(255,255,255,0.3),_0_0_20px_rgba(59,130,246,0.2)]'
            }`}>
              {currentQuestion.displayedLetter}
            </h2>
          ) : (
            <div className={`inline-block p-2 sm:p-3 rounded-lg ${
              isPreview 
                ? 'bg-blue-100/80 backdrop-blur-sm border border-blue-200/50' 
                : 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg'
            }`}>
              <span className="text-xl sm:text-2xl">🔊</span>
            </div>
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
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg w-full px-4 sm:px-0 mx-auto"
            tabIndex={0}
          >
            <div className="flex flex-col items-center gap-2">
            <Button
              variant={
                showFeedback 
                  ? (selectedAnswer === true && isCorrect ? "success" : 
                     selectedAnswer === true && !isCorrect ? "destructive" : "outline")
                  : "outline"
              }
              size="lg"
              className={`h-14 sm:h-16 w-full text-lg sm:text-xl font-bold transition-all duration-200 flex items-center justify-center group ${
                isPreview 
                  ? 'hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm hover:shadow-md' 
                  : 'bg-white/95 hover:bg-green-500 hover:text-white border-2 border-white/50 hover:border-green-500 shadow-lg hover:shadow-xl'
              } ${
                showFeedback && selectedAnswer === true
                  ? '!border-green-500 !border-[4px] ring-4 ring-green-500/30'
                  : ''
              }`}
              onClick={() => !disabled && !showFeedback && onAnswerSelect(true)}
              disabled={disabled || showFeedback}
            >
              <div className="scale-[1.5] sm:scale-[2.5]">
                <Check className="text-green-600 group-hover:text-white transition-colors duration-200" />
              </div>
            </Button>
              {/* Keyboard key indicator - Left Arrow */}
              {isPreview && (
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-1.5 shadow-md min-w-[40px] sm:min-w-[50px] flex items-center justify-center">
                    <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
            <Button
              variant={
                showFeedback 
                  ? (selectedAnswer === false && isCorrect ? "success" : 
                     selectedAnswer === false && !isCorrect ? "destructive" : "outline")
                  : "outline"
              }
              size="lg"
              className={`h-14 sm:h-16 w-full text-lg sm:text-xl font-bold transition-all duration-200 flex items-center justify-center group ${
                isPreview 
                  ? 'hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm hover:shadow-md' 
                  : 'bg-white/95 hover:bg-red-500 hover:text-white border-2 border-white/50 hover:border-red-500 shadow-lg hover:shadow-xl'
              } ${
                showFeedback && selectedAnswer === false
                  ? '!border-red-500 !border-[4px] ring-4 ring-red-500/30'
                  : ''
              }`}
              onClick={() => !disabled && !showFeedback && onAnswerSelect(false)}
              disabled={disabled || showFeedback}
            >
              <div className="scale-[1.5] sm:scale-[2.5]">
                <X className="text-red-600 group-hover:text-white transition-colors duration-200" />
              </div>
            </Button>
              {/* Keyboard key indicator - Right Arrow */}
              {isPreview && (
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-1.5 shadow-md min-w-[40px] sm:min-w-[50px] flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Area - Fixed height container to prevent layout shift */}
        <div className="min-h-[200px] sm:min-h-[250px] flex items-start justify-center">
          {showFeedback && (
            <div className="animate-fade-in text-center mt-1 w-full">
              <p className={`text-lg sm:text-xl font-bold ${
                isCorrect 
                  ?  'text-green-600'
                  : 'text-red-600'
              }`}>
                {isCorrect ? getLocalizedText('correctMessage') : getLocalizedText('wrongMessage')}
              </p>
              
              {/* Fuel earned display with filling animation */}
              {fuelEarned && isCorrect && (
                <div className="mt-4 sm:mt-5 animate-fade-in">
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {/* Fuel Icon and Amount */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {fuelIconImage ? (
                        <img 
                          src={fuelIconImage} 
                          alt="Fuel" 
                          className={`object-contain ${
                            fuelEarned.speedTier === 'fast' ? 'h-12 w-12 sm:h-16 sm:w-16' :
                            fuelEarned.speedTier === 'medium' ? 'h-10 w-10 sm:h-14 sm:w-14' :
                            'h-8 w-8 sm:h-12 sm:w-12'
                          }`}
                        />
                      ) : (
                        <Fuel className={`fill-blue-600 text-blue-600 ${
                          fuelEarned.speedTier === 'fast' ? 'h-8 w-8 sm:h-10 sm:w-10' :
                          fuelEarned.speedTier === 'medium' ? 'h-7 w-7 sm:h-9 sm:w-9' :
                          'h-6 w-6 sm:h-8 sm:w-8'
                        }`} />
                      )}
                      <span className={`font-bold ${
                        isPreview 
                          ? 'text-blue-600' 
                          : 'text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.8)] [text-shadow:_0_0_8px_rgba(255,255,255,0.5)]'
                      } ${
                        fuelEarned.speedTier === 'fast' ? 'text-2xl sm:text-3xl' :
                        fuelEarned.speedTier === 'medium' ? 'text-xl sm:text-2xl' :
                        'text-lg sm:text-xl'
                      }`}>
                        +{fuelEarned.fuelEarned} Fuel
                      </span>
                    </div>
                    
                    {/* Fuel Filling Progress Bar */}
                    <div className="w-full max-w-[220px] sm:max-w-[280px]">
                      <div className={`relative h-10 sm:h-12 rounded-full overflow-hidden border-2 shadow-inner ${
                        isPreview 
                          ? 'bg-gray-200 border-gray-300' 
                          : 'bg-gray-500 border-gray-400'
                      }`}>
                        {/* Filling Animation */}
                        <div 
                          className={`absolute left-0 top-0 h-full rounded-full ${
                            fuelEarned.speedTier === 'fast' 
                              ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 animate-pulse' 
                              : fuelEarned.speedTier === 'medium'
                              ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                              : 'bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500'
                          }`}
                          style={{
                            width: `${fillWidth}%`,
                            transition: 'width 0.8s ease-out'
                          }}
                        >
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                        </div>
                        {/* Fuel icon slider handle at the end of fill */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                          style={{
                            left: `${sliderPosition}%`,
                            transition: 'left 0.8s ease-out'
                          }}
                        >
                          <div className="bg-white rounded-full p-1 sm:p-1.5 border-2 border-blue-600 shadow-lg flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                            {/* Use fuel icon image if provided, otherwise fallback to Fuel component */}
                            {fuelIconImage ? (
                              <img 
                                src={fuelIconImage} 
                                alt="Fuel" 
                                className="object-contain w-full h-full p-0.5"
                              />
                            ) : (
                              <Fuel className="fill-blue-600 text-blue-600 h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure the export is available
export default LetterLauncherGameCore;
