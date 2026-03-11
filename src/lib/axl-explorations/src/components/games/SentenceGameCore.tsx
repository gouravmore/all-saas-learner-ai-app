import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Volume2, CheckCircle } from "lucide-react";
import { Language } from "../../constants/languages";
import { playAudio, playTTS } from "../../utils/audioUtils";
import { ContinueButton } from "./ContinueButton";

export interface SentenceQuestion {
  words: string[];
  correct: string[];
  language: Language;
  complexity: string;
  level: number;
}

export interface SentenceGameCoreProps {
  currentQuestion: SentenceQuestion;
  mode: 'game' | 'preview';
  selectedLanguage: Language;
  arrangedWords: string[];
  availableWords: string[];
  showFeedback?: boolean;
  isCorrect?: boolean;
  isPreview?: boolean;
  demoStep?: string;
  showHandPointer?: boolean;
  disabled?: boolean;
  onWordClick: (word: string, index: number) => void;
  onRemoveWord: (index: number) => void;
  onCheckAnswer?: () => void;
  onContinue?: () => void;
  className?: string;
  feedbackLanguageOverride?: Language;
}

export function SentenceGameCore({
  currentQuestion,
  mode,
  selectedLanguage,
  arrangedWords,
  availableWords,
  showFeedback = false,
  isCorrect = false,
  isPreview = false,
  demoStep = '',
  showHandPointer = false,
  disabled = false,
  onWordClick,
  onRemoveWord,
  onCheckAnswer,
  onContinue,
  className = '',
  feedbackLanguageOverride,
}: SentenceGameCoreProps) {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<{word: string, index: number, type: 'available' | 'arranged'} | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const getLocalizedText = (key: string) => {
    const texts = {
      listenToSentence: {
        en: 'Listen to the sentence',
        te: 'వాక్యాన్ని వినండి',
        kn: 'ವಾಕ್ಯವನ್ನು ಕೇಳಿ',
        mr: 'वाक्य ऐका'
      },
      buildSentence: {
        en: 'Build your sentence!',
        te: 'మీ వాక్యాన్ని నిర్మించండి!',
        kn: 'ನಿಮ್ಮ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿ!',
        mr: 'तुमचे वाक्य तयार करा!'
      },
      dragWordsHere: {
        en: 'Drag words here...',
        te: 'పదాలను ఇక్కడ లాగండి...',
        kn: 'ಪದಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ...',
        mr: 'शब्द येथे ड्रॅग करा...'
      },
      availableWords: {
        en: 'Available words:',
        te: 'అందుబాటులో ఉన్న పదాలు:',
        kn: 'ಲಭ್ಯವಿರುವ ಪದಗಳು:',
        mr: 'उपलब्ध शब्द:'
      },
      checkMySentence: {
        en: 'Check My Sentence',
        te: 'నా వాక్యాన్ని తనిఖీ చేయండి',
        kn: 'ನನ್ನ ವಾಕ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ',
        mr: 'माझे वाक्य तपासा'
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
    const language = selectedLanguage;
    return texts[key as keyof typeof texts]?.[language] || texts[key as keyof typeof texts]?.en || '';
  };

  // Enhanced audio function with proper language-specific voice selection
  const playAudio = async (text: string, language: Language) => {
    // Cancel any existing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Pause any existing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language-specific voice
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          selectedVoice = voices.find(voice => voice.lang.includes('te-IN') || voice.lang.includes('te'));
          break;
        case 'kn':
          utterance.lang = 'kn-IN';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          selectedVoice = voices.find(voice => voice.lang.includes('kn-IN') || voice.lang.includes('kn'));
          break;
        case 'mr':
          utterance.lang = 'mr-IN';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          selectedVoice = voices.find(voice => voice.lang.includes('mr-IN') || voice.lang.includes('mr'));
          break;
        default:
          utterance.lang = 'en-US';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          selectedVoice = voices.find(voice => voice.lang.includes('en-US') || voice.lang.includes('en'));
          break;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      speechSynthesis.speak(utterance);
    }, 50);
  };

  const handlePlayAudio = async () => {
    if (currentQuestion.correct && currentQuestion.correct.length > 0) {
      await playAudio(currentQuestion.correct.join(' '), feedbackLanguageOverride || selectedLanguage);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, word: string, index: number, type: 'available' | 'arranged') => {
    if (disabled || showFeedback) return;
    
    setDraggedElement({ word, index, type });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedElement(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropType: 'sentence' | 'word', dropIndex?: number) => {
    e.preventDefault();
    
    if (!draggedElement || disabled || showFeedback) return;
    
    if (dropType === 'sentence') {
      // Drop on sentence building area
      if (draggedElement.type === 'available') {
        onWordClick(draggedElement.word, draggedElement.index);
      }
    } else if (dropType === 'word' && dropIndex !== undefined) {
      // Drop on existing word in sentence
      if (draggedElement.type === 'available') {
        // Replace the word at dropIndex
        onWordClick(draggedElement.word, draggedElement.index);
        // Remove the word that was replaced
        onRemoveWord(dropIndex);
      } else if (draggedElement.type === 'arranged') {
        // Reorder words within sentence
        const newArrangedWords = [...arrangedWords];
        const draggedWord = newArrangedWords[draggedElement.index];
        newArrangedWords.splice(draggedElement.index, 1);
        newArrangedWords.splice(dropIndex, 0, draggedWord);
        
        // Update the arranged words (this would need to be handled by parent component)
        // For now, we'll use the existing click handlers
      }
    }
    
    setDraggedElement(null);
    setDragOverIndex(null);
  };

  const handleDragEnter = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    if (index !== undefined) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  return (
    <div className={`flex-1 flex flex-col justify-start px-1 sm:px-2 py-2 ${className}`}>
      {/* Game Icon */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="inline-block p-1.5 sm:p-2 bg-blue-100 rounded-lg">
          <span className="text-lg sm:text-xl">📝</span>
        </div>
      </div>


      {/* Sentence Building Area */}
      <div className="mt-2 sm:mt-4 mb-4 sm:mb-6">
        <div 
          className={`min-h-[60px] sm:min-h-[80px] p-3 sm:p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex flex-wrap gap-2 justify-center items-center transition-colors ${
            draggedElement?.type === 'available' ? 'bg-primary/10 border-primary/50' : ''
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'sentence')}
          data-drop-zone="sentence"
        >
          {arrangedWords.length === 0 ? (
            <p className="text-muted-foreground text-xs sm:text-sm">{getLocalizedText('dragWordsHere')}</p>
          ) : (
            arrangedWords.map((word, index) => (
              <Button
                key={index}
                variant="secondary"
                className={`text-sm sm:text-base md:text-lg font-semibold cursor-move px-3 sm:px-4 py-1.5 sm:py-2 transition-all ${
                  dragOverIndex === index ? 'bg-primary/20 scale-105' : ''
                }`}
                onClick={() => !disabled && !showFeedback && onRemoveWord(index)}
                disabled={disabled || showFeedback}
                draggable={!disabled && !showFeedback}
                onDragStart={(e) => handleDragStart(e, word, index, 'arranged')}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'word', index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                data-word-index={index}
              >
                {word}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Available Words */}
      <div className={availableWords.length > 0 ? "mb-4 sm:mb-6" : "mb-3"}>
        {!showFeedback && <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center">{getLocalizedText('availableWords')}</h3>}
        <div className="relative flex items-center justify-center">
          {/* Hand Pointer - positioned absolutely so it doesn't affect centering */}
          {showHandPointer && (
            <div className="absolute left-1/2 transform -translate-x-full rotate-90 -ml-36">
              <div className="animate-bounce">
                <span className="text-2xl inline-block">👆</span>
              </div>
            </div>
          )}
          
          <div 
            ref={optionsRef}
            className="flex flex-wrap gap-2 justify-center"
            tabIndex={0}
          >
            {availableWords.map((word, index) => (
              <Button
                key={index}
                variant="game"
                className="text-sm sm:text-base md:text-lg font-semibold cursor-move px-3 sm:px-4 py-1.5 sm:py-2 transition-all hover:scale-105"
                onClick={() => !disabled && !showFeedback && onWordClick(word, index)}
                disabled={disabled || showFeedback}
                draggable={!disabled && !showFeedback}
                onDragStart={(e) => handleDragStart(e, word, index, 'available')}
                onDragEnd={handleDragEnd}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Check Answer Button and Feedback Area */}
      <div className="text-center min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-start">
        {arrangedWords.length === currentQuestion.correct.length && !showFeedback && onCheckAnswer && (
          <Button
            variant="success"
            size="sm"
            onClick={onCheckAnswer}
            className="animate-bounce-in text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            {getLocalizedText('checkMySentence')}
          </Button>
        )}

        {/* Feedback */}
        {showFeedback && (
          <>
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
            
            {/* Continue Button */}
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
