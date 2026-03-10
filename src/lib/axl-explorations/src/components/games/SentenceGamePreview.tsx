import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { SentenceGameCore, type SentenceQuestion } from "./SentenceGameCore";

interface SentenceGamePreviewProps {
  onStartGame: () => void;
  onBack: () => void;
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedTime?: string;
  level?: number;
  hideHeader?: boolean;
}

type PreviewPhase = 'countdown' | 'demo' | 'completion';

type DemoStep = 
  | 'instruction1'      // Show instruction 1, play narration
  | 'waitForReady'      // Wait for user to click "I'm Ready"
  | 'showWords'         // Show the scrambled words after ready click
  | 'instruction2'      // After showing words, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show word options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Sentence Builder",
    description: "Arrange scrambled words to make a complete sentence!",
    steps: [
      "📝 Look at the scrambled words",
      "🖱️ Click words in correct order",
      "📋 Build your sentence step by step",
      "✅ Complete the sentence!"
    ],
    instruction1: "Click 'I'm Ready' to see the scrambled words",
    instruction2: "Good! Now look at these scrambled words",
    instruction3: "Now click the words in the correct order to build a sentence",
    instruction4: "Perfect! You built a complete sentence!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Click I'm Ready to see the scrambled words",
    narration2: "Good! Now look at these scrambled words",
    narration3: "Now click the words in the correct order to build a sentence",
    narration4: "Perfect! You built a complete sentence!",
    howToPlay: "How to Play",
    buildSentence: "Build your sentence!",
    demo: {
      scrambledWords: ["is", "good", "Reading"],
      correctOrder: ["Reading", "is", "good"],
      correctSentence: "Reading is good",
      explanation: "Perfect! You arranged the words correctly!"
    }
  },
  te: {
    title: "వాక్య నిర్మాణం",
    description: "గందరగోళ పదాలను అమర్చి పూర్తి వాక్యాన్ని తయారు చేయండి!",
    steps: [
      "📝 గందరగోళ పదాలను చూడండి",
      "🖱️ సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
      "📋 దశలవారీగా మీ వాక్యాన్ని నిర్మించండి",
      "✅ వాక్యాన్ని పూర్తి చేయండి!"
    ],
    instruction1: "గందరగోళ పదాలను చూడటానికి 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ గందరగోళ పదాలను చూడండి",
    instruction3: "ఇప్పుడు వాక్యాన్ని నిర్మించడానికి సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
    instruction4: "పర్ఫెక్ట్! మీరు పూర్తి వాక్యాన్ని నిర్మించారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "గందరగోళ పదాలను చూడటానికి నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ గందరగోళ పదాలను చూడండి",
    narration3: "ఇప్పుడు వాక్యాన్ని నిర్మించడానికి సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
    narration4: "పర్ఫెక్ట్! మీరు పూర్తి వాక్యాన్ని నిర్మించారు!",
    howToPlay: "ఎలా ఆడాలి",
    buildSentence: "మీ వాక్యాన్ని నిర్మించండి!",
    demo: {
      scrambledWords: ["మంచిది", "చదవడం", "చాలా"],
      correctOrder: ["చదవడం", "చాలా", "మంచిది"],
      correctSentence: "చదవడం చాలా మంచిది",
      explanation: "పరిపూర్ణం! మీరు పదాలను సరిగ్గా అమర్చారు!"
    }
  },
  kn: {
    title: "ವಾಕ್ಯ ನಿರ್ಮಾಣ",
    description: "ಗೊಂದಲದ ಪದಗಳನ್ನು ಜೋಡಿಸಿ ಸಂಪೂರ್ಣ ವಾಕ್ಯವನ್ನು ಮಾಡಿ!",
    steps: [
      "📝 ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
      "🖱️ ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      "📋 ಹಂತ ಹಂತವಾಗಿ ನಿಮ್ಮ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿ",
      "✅ ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ!"
    ],
    instruction1: "ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಲು 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
    instruction3: "ಈಗ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಲು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಸಂಪೂರ್ಣ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    narration1: "ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಲು ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
    narration3: "ಈಗ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಲು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಸಂಪೂರ್ಣ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    buildSentence: "ನಿಮ್ಮ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿ!",
    demo: {
      scrambledWords: ["ಒಳ್ಳೆಯದು", "ಓದುವುದು", "ತುಂಬಾ"],
      correctOrder: ["ಓದುವುದು", "ತುಂಬಾ", "ಒಳ್ಳೆಯದು"],
      correctSentence: "ಓದುವುದು ತುಂಬಾ ಒಳ್ಳೆಯದು",
      explanation: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿದ್ದೀರಿ!"
    }
  },
  mr: {
    title: "वाक्य बांधकाम",
    description: "गोंधळलेले शब्द मांडून पूर्ण वाक्य तयार करा!",
    steps: [
      "📝 गोंधळलेले शब्द पहा",
      "🖱️ योग्य क्रमाने शब्दांवर क्लिक करा",
      "📋 टप्प्याटप्प्याने तुमचे वाक्य तयार करा",
      "✅ वाक्य पूर्ण करा!"
    ],
    instruction1: "गोंधळलेले शब्द पाहण्यासाठी 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता ही गोंधळलेली शब्दे पहा",
    instruction3: "आता वाक्य तयार करण्यासाठी योग्य क्रमाने शब्दांवर क्लिक करा",
    instruction4: "उत्कृष्ट! तुम्ही पूर्ण वाक्य तयार केले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "गोंधळलेले शब्द पाहण्यासाठी मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता ही गोंधळलेली शब्दे पहा",
    narration3: "आता वाक्य तयार करण्यासाठी योग्य क्रमाने शब्दांवर क्लिक करा",
    narration4: "उत्कृष्ट! तुम्ही पूर्ण वाक्य तयार केले!",
    howToPlay: "कसे खेळायचे",
    buildSentence: "तुमचे वाक्य तयार करा!",
    demo: {
      scrambledWords: ["चांगले", "वाचन", "खूप"],
      correctOrder: ["वाचन", "खूप", "चांगले"],
      correctSentence: "वाचन खूप चांगले",
      explanation: "परिपूर्ण! तुम्ही शब्दांची योग्य मांडणी केली!"
    }
  }
};

export function SentenceGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: SentenceGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for SentenceGameCore
  const demoQuestion: SentenceQuestion = {
    words: instructions.demo.scrambledWords,
    correct: instructions.demo.correctOrder,
    language: contentLanguage,
    complexity: 'basic',
    level: 1
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };

  // Play narration using combined sentence games audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn('Narration already playing, skipping...');
      return;
    }
    
    setIsPlayingNarration(true);
    
    // Use combined sentence games audio files for Sentence Builder
    const gameName = 'Combined Sentence Games';
    const subGame = 'Sentence Builder';
    
    try {
      await playAudio({
        gameName,
        subGame,
        language: audioLanguage,
        type: 'narration',
        step
      }, text);
    } catch (error) {
      console.warn('Audio playback failed, using TTS fallback:', error);
      // Stop any existing speech synthesis before starting new one
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      await playTTS(text, audioLanguage);
    }
    
    setIsPlayingNarration(false);
  };

  // Play word sound
  const playWordSound = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = audioLanguage === 'te' ? 'te-IN' : 
                    audioLanguage === 'kn' ? 'kn-IN' : 
                    audioLanguage === 'mr' ? 'mr-IN' : 
                    audioLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    if (!isAudioStopped()) {
      speechSynthesis.speak(utterance);
    }
  };


  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case 'instruction1':
      case 'waitForReady':
        setCurrentStep(0);
        break;
      case 'showWords':
      case 'instruction2':
        setCurrentStep(1);
        break;
      case 'instruction3':
      case 'waitForAnswer':
        setCurrentStep(2);
        break;
      case 'instruction4':
      case 'complete':
        setCurrentStep(3);
        break;
    }
  }, [demoStep]);

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (demoStep === 'instruction1' && previewPhase === 'demo') {
      playNarration(instructions.narration1, 1);
      setHasClickedReady(false);
      setSelectedWords([]);
      setShowFeedback(false);
      setShowWords(false);
    }
  }, [demoStep, previewPhase, instructions.narration1]);

  // When instruction 1 narration finishes, move to waitForReady
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
    const timer = setTimeout(() => {
        setDemoStep('waitForReady');
        setTimeout(() => {
          readyButtonRef.current?.focus();
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration]);

  // Handle ready button click
  const handleReadyClick = async () => {
    if (demoStep !== 'waitForReady' || hasClickedReady) return;
    
    setHasClickedReady(true);
    
    // Show words
    setShowWords(true);
    setDemoStep('showWords');
    
    // Wait a moment then show instruction 2
    setTimeout(async () => {
      setDemoStep('instruction2');
      await playNarration(instructions.narration2, 2);
      
      setDemoStep('instruction3');
      await playNarration(instructions.narration3, 3);
      
      setDemoStep('waitForAnswer');
      
      setTimeout(() => {
        optionsRef.current?.focus();
      }, 100);
    }, 1500);
  };

  // Handle word click
  const handleWordClick = async (word: string) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);
    
    // Check if sentence is complete
    if (newSelectedWords.length === instructions.demo.correctOrder.length) {
      setShowFeedback(true);
      
      const isCorrect = JSON.stringify(newSelectedWords) === JSON.stringify(instructions.demo.correctOrder);
      setIsCorrectAnswer(isCorrect);
      
      if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
        
        setDemoStep('instruction4');
        await playNarration(instructions.narration4, 4);
        
        const newSuccessfulRuns = successfulRuns + 1;
        setSuccessfulRuns(newSuccessfulRuns);
        const newCompletionCount = completionCount + 1;
        setCompletionCount(newCompletionCount);
        
        // Wait a moment, then show completion screen after first successful run
        setTimeout(() => {
          setHasCompletedFirstCycle(true);
          setPreviewPhase('completion');
        }, 2000);
      } else {
        await playFailureSound(audioLanguage, { exactLanguage: true });
        
        setTimeout(() => {
          setShowFeedback(false);
          setSelectedWords([]);
        }, 2000);
      }
    }
  };

  // Restart demo
  const restartDemo = () => {
    setDemoStep('instruction1');
    setSelectedWords([]);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setShowWords(false);
    setCurrentStep(0);
  };

  // Help button click
  const handleHelpClick = () => {
    restartDemo();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Cleanup on page unload only (no tab visibility handling - matches combined games behavior)
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllAudio();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const showReadyButton = (demoStep === 'waitForReady' || demoStep === 'instruction1') && !hasClickedReady;
  const showWordsDisplay = showWords && (demoStep === 'showWords' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete');
  const showWordOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  
  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    onStartGame();
  };

  // Back handler with audio cleanup
  const handleBack = () => {
    stopAllAudio();
    onBack();
  };

  // Start game handler with audio cleanup
  const handleStartGame = () => {
    stopAllAudio();
    onStartGame();
  };

  // Replay demo handler
  const handleReplayDemo = () => {
    stopAllAudio();
    setHasCompletedFirstCycle(false);
    setCompletionCount(0);
    setPreviewPhase('countdown');
  };

  // Render completion phase
  if (previewPhase === 'completion') {
    return (
      <DemoCompletionScreen
        language={contentLanguage}
        onStartGame={handleStartGame}
        onReplayDemo={handleReplayDemo}
        onBack={handleBack}
        hideHeader={hideHeader}
        totalDemos={1}
      />
    );
  }

  // Render countdown phase
  if (previewPhase === 'countdown') {
    return (
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {!hideHeader && (
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <Button
                onClick={handleBack}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'మాగे'}
              </Button>
            </div>
          )}
          <CountdownTimer
            initialCount={3}
            onComplete={handleCountdownComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes pointToButton {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(10px);
            }
          }
        `}
      </style>
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <Button
              onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'మాగे'}
          </Button>
          
            <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {instructions.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
              <Clock className="h-3 w-3" />
              <span>
                  {contentLanguage === 'en' ? 'Level' : contentLanguage === 'te' ? 'స్థాయి' : contentLanguage === 'kn' ? 'ಮಟ್ಟ' : 'पातळी'} {level} • {difficulty.toLowerCase()} • {estimatedTime}
              </span>
            </div>
          </div>
          
          <div className="w-16"></div>
        </div>
        )}

        {/* Main Content Card */}
        <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col rounded-2xl min-h-0">
          {/* How to Play Section - Centered */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-800">
                {instructions.howToPlay}
              </h2>
            </div>
            <Progress value={((currentStep + 1) / instructions.steps.length) * 100} className="h-1.5 w-64" />
          </div>

          {/* Demo Panel - Full width */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center relative h-[420px]">
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                {/* Ready Button - Show initially */}
                {(demoStep === 'instruction1' || demoStep === 'waitForReady') && !showWordsDisplay && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div 
                      ref={readyButtonRef}
                      className={`inline-block px-6 py-3 rounded-lg transition-all transform font-semibold text-base ${
                        demoStep === 'waitForReady' 
                          ? 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:scale-105 ring-4 ring-blue-400 ring-opacity-50 animate-pulse' 
                          : demoStep === 'instruction1'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:scale-105'
                      }`}
                      onClick={demoStep === 'waitForReady' || (demoStep !== 'instruction1' && demoStep !== 'complete') ? handleReadyClick : undefined}
                      tabIndex={demoStep === 'waitForReady' || (demoStep !== 'instruction1' && demoStep !== 'complete') ? 0 : -1}
                    >
                      {contentLanguage === 'en' ? "I'm Ready" : contentLanguage === 'te' ? 'నేను సిద్ధంగా ఉన్నాను' : contentLanguage === 'kn' ? 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' : 'मी तयार आहे'}
                    </div>
                    {demoStep === 'waitForReady' && (
                      <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                        <span className="text-xl">👆</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Words Display - Show after ready click */}
                {(demoStep === 'showWords' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showWordOptions && (
                  <div className="flex flex-col items-center justify-center animate-fade-in space-y-4">
                    <div className="inline-block p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex flex-wrap gap-2">
                        {instructions.demo.scrambledWords.map((word, index) => (
                          <span key={index} className="text-xl sm:text-2xl font-bold text-gray-800 px-2 py-1 bg-white rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sentence Building Area - Show after instruction 3 */}
                {showWordOptions && (
                  <SentenceGameCore
                    currentQuestion={demoQuestion}
                    mode="preview"
                    selectedLanguage={selectedLanguage || 'en'}
                    arrangedWords={selectedWords}
                    availableWords={instructions.demo.scrambledWords.filter(word => !selectedWords.includes(word))}
                    showFeedback={showFeedback}
                    isCorrect={isCorrectAnswer}
                    isPreview={true}
                    demoStep={demoStep}
                    showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                    disabled={demoStep !== 'waitForAnswer'}
                    onWordClick={(word, index) => {
                      const actualIndex = instructions.demo.scrambledWords.findIndex(w => w === word);
                      if (actualIndex !== -1) {
                        handleWordClick(word);
                      }
                    }}
                    onRemoveWord={(index) => {
                      const newSelectedWords = selectedWords.filter((_, i) => i !== index);
                      setSelectedWords(newSelectedWords);
                    }}
                    feedbackLanguageOverride={audioLanguage}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Fixed Buttons */}
          <div className="flex justify-between items-center gap-4 mt-auto flex-shrink-0">
            {/* Skip Demo Button - Bottom Left */}
            <Button
              onClick={handleSkipDemo}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
            >
              {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమో స్కిప్ చేయండి' : contentLanguage === 'kn' ? 'ಡೆಮೊನ್ನು ಸ್ಕಿಪ್ ಮಾಡಿ' : 'डेमो वगळा'}
            </Button>
            
            {/* Start Game Button - Bottom Right */}
            <Button
              onClick={handleStartGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
            >
              <Gamepad2 className="h-7 w-4 mr-2" />
              {contentLanguage === 'en' ? 'Start Game' : contentLanguage === 'te' ? 'గేమ్ ప్రారంభించండి' : contentLanguage === 'kn' ? 'ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸಿ' : 'गेम सुरू करा'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
