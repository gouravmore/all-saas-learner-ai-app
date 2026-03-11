import { useEffect, useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../constants/languages";

interface GameIntroductionProps {
  title: string;
  description?: string;
  activityCount: number;
  onContinue: () => void;
  playNarration?: (text: string) => Promise<void>;
  customIcon?: React.ReactNode;
  languageOverride?: Language;
}

const introductionText = {
  en: {
    activities: "Activities",
    continue: "Continue",
  },
  te: {
    activities: "కార్యకలాపాలు",
    continue: "కొనసాగించండి",
  },
  kn: {
    activities: "ಚಟುವಟಿಕೆಗಳು",
    continue: "ಮುಂದುವರಿಸಿ",
  },
  mr: {
    activities: "क्रियाकलाप",
    continue: "सुरू ठेवा",
  },
};

export function GameIntroduction({
  title,
  description,
  activityCount,
  onContinue,
  playNarration,
  customIcon,
  languageOverride,
}: GameIntroductionProps) {
  const { selectedLanguage } = useLanguage();
  const [showButton, setShowButton] = useState(false);

  const effectiveLanguage = languageOverride || selectedLanguage || 'en';
  const text = introductionText[effectiveLanguage];
  const lastNarrationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const narrationKey = `${effectiveLanguage}|${title}|${description}`;
    if (lastNarrationKeyRef.current === narrationKey) {
      return;
    }
    lastNarrationKeyRef.current = narrationKey;

    const playIntro = async () => {
      const narrationText = `${title}. ${description}`;
      
      if (playNarration) {
        await playNarration(narrationText);
      }
      
      // Show button after narration with a small delay for effect
      setTimeout(() => {
        setShowButton(true);
      }, 500);
    };

    playIntro();
  }, [title, description, effectiveLanguage, playNarration]);

  return (
    
      <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-5 py-2 sm:py-3 md:py-4">
          {/* Animated Icon - Responsive sizing */}
          <div className="flex justify-center animate-bounce-in flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              {customIcon || <Sparkles className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 text-white" />}
            </div>
          </div>

          {/* Title */}
          {title && (
            <div className="animate-slide-up px-4 flex-shrink-0" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center">
                {title}
              </h2>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="animate-slide-up max-w-2xl px-4 flex-shrink-0" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center">
                {description}
              </p>
            </div>
          )}

          {/* Activity Count Display - Responsive and compact */}
          <div className="flex items-center justify-center py-1 sm:py-2 md:py-3 animate-slide-up flex-shrink-0" style={{ animationDelay: '0.4s' }}>
            <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 border-2 sm:border-3 md:border-4 border-blue-200 shadow-lg">
              {/* Left sparkle */}
              <div className="absolute -left-3 -top-3 md:-left-4 md:-top-4 w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500 animate-spin-slow" />
              <div className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {activityCount}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-700 mt-0.5 sm:mt-1">
                  {text.activities}
                </div>
              </div>
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
              
              {/* Right sparkle */}
              <div className="absolute -right-3 -top-3 md:-right-4 md:-top-4 w-10 h-10 md:w-12 md:h-12 bg-purple-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Continue Button - Responsive and always visible */}
          {showButton && (
            <div className="pt-1 sm:pt-2 md:pt-3 animate-bounce-in flex-shrink-0" style={{ animationDelay: '0.6s' }}>
              <Button
                onClick={onContinue}
                className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 transform"
              >
                {text.continue}
                <span className="ml-2 text-lg sm:text-xl md:text-2xl">→</span>
              </Button>
              
              {/* Pointer animation */}
              <div className="flex justify-center mt-1 sm:mt-2 animate-bounce">
                <span className="text-2xl sm:text-3xl md:text-4xl">👆</span>
              </div>
            </div>
          )}
        </div>
      </Card>

  );
}

