import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Volume2 } from "lucide-react";
import { Language } from "../../constants/languages";
import { ContinueButton } from "./ContinueButton";
import { attachSlowLoadToast } from "../../utils/audioUtils";

export interface ROARPhonemeQuestion {
  target: {
    image: string;
    word: string;
    phoneme: string;
  };
  options: {
    image: string;
    word: string;
    phoneme: string;
  }[];
  audio: string;
  complexity: string;
}

export interface ROARPhonemeGameCoreProps {
  currentQuestion: ROARPhonemeQuestion;
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
  onContinue?: () => void;
  className?: string;
}

export function ROARPhonemeGameCore({
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
  className = ''
}: ROARPhonemeGameCoreProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  const getLocalizedText = (key: 'correctMessage' | 'wrongMessage') => {
    const messages = {
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

    return messages[key][selectedLanguage] || messages[key].en;
  };

  // Enhanced audio function for different languages - tries audio files first, then TTS
  const playAudio = async (text: string, language: Language) => {
    // Cancel any ongoing speech to prevent overlapping
    speechSynthesis.cancel();
    
    // Try to play audio file from sound-match folder first
    const word = text.toLowerCase().trim();
    console.log(word)
    const audioPath = `/audio/audio-preview/combined-word-games/sound-match/${language}/${word}.wav`;
    
    try {
      const audio = new Audio(audioPath);
      attachSlowLoadToast(audio);
      
      // Try to play the audio file
      await new Promise<void>((resolve, reject) => {
        audio.onloadeddata = () => {
          audio.play().then(() => {
            audio.onended = () => resolve();
          }).catch(() => {
            // If playback fails, fall through to TTS
            reject();
          });
        };
        
        audio.onerror = () => {
          // If file doesn't exist or fails to load, fall through to TTS
          reject();
        };
        
        // Set a timeout to prevent hanging
        setTimeout(() => {
          if (!audio.ended && audio.readyState < 2) {
            reject();
          }
        }, 2000);
      });
      
      // Successfully played audio file
      return;
    } catch (error) {
      // Fall back to TTS if audio file doesn't exist or fails
      console.warn(`Audio file not found: ${audioPath}, falling back to TTS`);
    }
    
    // Fallback to TTS with improved voice selection
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Natural speech settings for clear pronunciation
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          break;
        case 'kn':
          utterance.lang = 'kn-IN';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          break;
        case 'mr':
          utterance.lang = 'mr-IN';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          break;
        default:
          utterance.lang = 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
      }
    
      // Simplified voice selection to prevent duplicate audio
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (language === 'te') {
        selectedVoice = 
          voices.find(voice => voice.lang === 'te-IN' || voice.lang === 'te') ||
          voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
          voices[0];
      } else if (language === 'mr') {
        selectedVoice = 
          voices.find(voice => voice.lang === 'mr-IN' || voice.lang === 'mr') ||
          voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
          voices[0];
      } else {
        selectedVoice = 
          voices.find(voice => voice.lang === 'en-US') ||
          voices.find(voice => voice.lang.startsWith('en')) ||
          voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      speechSynthesis.speak(utterance);
    }, 50);
  };

  // Helper function to get target word for pronunciation
  const getTargetWordText = (targetWord: string): string => {
    return targetWord; // Just the word for clear pronunciation
  };

  return (
    <div className={`flex-1 flex flex-col justify-center px-1 sm:px-2 ${className}`}>
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <div className="mb-3 sm:mb-4">
            <div 
              className="inline-block p-2 sm:p-3 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
              onClick={() => !disabled && playAudio(
                getTargetWordText(currentQuestion.target.word), 
                selectedLanguage
              )}
            >
              <span className="text-xl sm:text-2xl">🔊</span>
            </div>
          </div>
          
          {/* Target Word Display */}
          <div className="mb-3 sm:mb-4">
            <div className="inline-block p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
              <div className="text-3xl sm:text-4xl md:text-5xl">{currentQuestion.target.image}</div>
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
          <div className="animate-fade-in text-center pb-4 sm:pb-6">
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
