import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Language } from "../../constants/languages";
import { ContinueButton } from "./ContinueButton";

export interface TrueFalseQuestion {
  statement: string;
  isTrue: boolean;
}

interface TrueFalseGameCoreProps {
  currentQuestion: TrueFalseQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isCorrect: boolean;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onAnswerSelect: (answer: boolean) => void;
  onCheckAnswer?: (answer: boolean) => void;
  onContinue?: () => void;
  feedbackLanguageOverride?: Language;
}

export function TrueFalseGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  selectedAnswer,
  showFeedback,
  isCorrect,
  isPreview = false,
  demoStep,
  showHandPointer = false,
  disabled = false,
  onAnswerSelect,
  onCheckAnswer,
  onContinue,
  feedbackLanguageOverride,
}: TrueFalseGameCoreProps) {
  
  // Localized text
  const getLocalizedText = (key: 'successMessage' | 'failureMessage' | 'checkAnswer') => {
    const messages = {
      en: {
        successMessage: '🎉 Correct!',
        failureMessage: '😢 Oops! Wrong!',
        checkAnswer: 'Check Answer'
      },
      te: {
        successMessage: '🎉 సరైనది!',
        failureMessage: '😢 అయ్యో! తప్పు!',
        checkAnswer: 'సమాధానం తనిఖీ చేయండి'
      },
      kn: {
        successMessage: '🎉 ಸರಿ!',
        failureMessage: '😢 ಅಯ್ಯೋ! ತಪ್ಪು!',
        checkAnswer: 'ಉತ್ತರವನ್ನು ಪರಿಶೀಲಿಸಿ'
      },
      mr: {
        successMessage: '🎉 बरोबर!',
        failureMessage: '😢 अरेच्या! चुकीचे!',
        checkAnswer: 'उत्तर तपासा'
      }
    };

    const language = selectedLanguage || 'en';
    const localized = messages[language] || messages.en;
    return localized[key] || messages.en[key];
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-1 sm:px-2">
      <div className="space-y-4 sm:space-y-6">
        {/* Statement Display */}
        <div className="text-center">
          {isPreview && (demoStep === 'showStatement' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4') ? (
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                {currentQuestion.statement}
              </h2>
            </div>
          ) : !isPreview ? (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              {currentQuestion.statement}
            </h2>
          ) : null}
        </div>

        {/* True/False Options */}
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
          <Button
            variant={
              showFeedback 
                ? (selectedAnswer === false && isCorrect ? "success" : 
                   selectedAnswer === false && !isCorrect ? "destructive" : "outline")
                : "outline"
            }
            size="lg"
            className="h-14 sm:h-16 w-full text-lg sm:text-xl font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center group"
            onClick={() => {
              if (!disabled && !showFeedback) {
                onAnswerSelect(false);
                if (onCheckAnswer) {
                  onCheckAnswer(false);
                }
              }
            }}
            disabled={disabled || showFeedback}
          >
            <div className="scale-[1.5] sm:scale-[2.5]">
              <X className="text-red-600 group-hover:text-white transition-colors duration-200" />
            </div>
          </Button>

          <Button
            variant={
              showFeedback 
                ? (selectedAnswer === true && isCorrect ? "success" : 
                   selectedAnswer === true && !isCorrect ? "destructive" : "outline")
                : "outline"
            }
            size="lg"
            className="h-14 sm:h-16 w-full text-lg sm:text-xl font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center group"
            onClick={() => {
              if (!disabled && !showFeedback) {
                onAnswerSelect(true);
                if (onCheckAnswer) {
                  onCheckAnswer(true);
                }
              }
            }}
            disabled={disabled || showFeedback}
          >
            <div className="scale-[1.5] sm:scale-[2.5]">
              <Check className="text-green-600 group-hover:text-white transition-colors duration-200" />
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
              {getLocalizedText(isCorrect ? 'successMessage' : 'failureMessage')}
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
