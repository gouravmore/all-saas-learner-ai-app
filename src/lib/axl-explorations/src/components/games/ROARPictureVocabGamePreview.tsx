import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { ROARPictureVocabGameCore, type ROARPictureVocabQuestion } from "./ROARPictureVocabGameCore";

interface ROARPictureVocabGamePreviewProps {
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
  | 'showWord'          // Show the word after ready click
  | 'instruction2'      // After showing word, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show picture options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Picture Words",
    description: "Match words with the correct pictures!",
    steps: [
      "📖 Read the word carefully",
      "👀 Look at all the picture options",
      "🎯 Find the picture that matches the word",
      "✨ Click the correct picture!"
    ],
    instruction1: "Click 'I'm Ready' to see the word",
    instruction2: "Good! Now read this word carefully",
    instruction3: "Now find which picture matches this word",
    instruction4: "Perfect! You matched the word with the correct picture!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Click I'm Ready to see the word",
    narration2: "Good! Now read this word carefully",
    narration3: "Now find which picture matches this word",
    narration4: "Perfect! You matched the word with the correct picture!",
    howToPlay: "How to Play",
    findMatchingPicture: "Find the matching picture!",
    demo: {
      word: "CAT",
      options: ["🐱", "🐶", "🐭", "🐰"],
      correctIndex: 0,
      explanation: "The word 'CAT' matches the cat picture!"
    }
  },
  te: {
    title: "చిత్ర పదాలు",
    description: "పదాలను సరైన చిత్రాలతో సరిపోల్చండి!",
    steps: [
      "📖 పదాన్ని జాగ్రత్తగా చదవండి",
      "👀 అన్ని చిత్ర ఎంపికలను చూడండి",
      "🎯 పదానికి సరిపోయే చిత్రాన్ని కనుగొనండి",
      "✨ సరైన చిత్రాన్ని క్లిక్ చేయండి!"
    ],
    instruction1: "పదాన్ని చూడటానికి 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
    instruction3: "ఇప్పుడు ఈ పదానికి సరిపోయే చిత్రాన్ని కనుగొనండి",
    instruction4: "పర్ఫెక్ట్! మీరు పదాన్ని సరైన చిత్రంతో సరిపోల్చారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "పదాన్ని చూడటానికి నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
    narration3: "ఇప్పుడు ఈ పదానికి సరిపోయే చిత్రాన్ని కనుగొనండి",
    narration4: "పర్ఫెక్ట్! మీరు పదాన్ని సరైన చిత్రంతో సరిపోల్చారు!",
    howToPlay: "ఎలా ఆడాలి",
    findMatchingPicture: "సరిపోయే చిత్రాన్ని కనుగొనండి!",
    demo: {
      word: "పిల్లి",
      options: ["🐱", "🐶", "🐭", "🐰"],
      correctIndex: 0,
      explanation: "పదం 'పిల్లి' పిల్లి చిత్రంతో సరిపోతుంది!"
    }
  },
  kn: {
    title: "ಚಿತ್ರ ಪದಗಳು",
    description: "ಪದಗಳನ್ನು ಸರಿಯಾದ ಚಿತ್ರಗಳೊಂದಿಗೆ ಹೊಂದಿಸಿ!",
    steps: [
      "📖 ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
      "👀 ಎಲ್ಲಾ ಚಿತ್ರ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಿ",
      "🎯 ಪದಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ",
      "✨ ಸರಿಯಾದ ಚಿತ್ರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!"
    ],
    instruction1: "ಪದವನ್ನು ನೋಡಲು 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    instruction3: "ಈಗ ಈ ಪದಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ",
    instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾದ ಚಿತ್ರದೊಂದಿಗೆ ಹೊಂದಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    narration1: "ಪದವನ್ನು ನೋಡಲು ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    narration3: "ಈಗ ಈ ಪದಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ",
    narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾದ ಚಿತ್ರದೊಂದಿಗೆ ಹೊಂದಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    findMatchingPicture: "ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ!",
    demo: {
      word: "ಬೆಕ್ಕು",
      options: ["🐱", "🐶", "🐭", "🐰"],
      correctIndex: 0,
      explanation: "ಪದ 'ಬೆಕ್ಕು' ಬೆಕ್ಕಿನ ಚಿತ್ರಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ!"
    }
  },
  mr: {
    title: "चित्र शब्द",
    description: "शब्दांना योग्य चित्रांशी जुळवा!",
    steps: [
      "📖 शब्द काळजीपूर्वक वाचा",
      "👀 सर्व चित्र पर्याय पहा",
      "🎯 शब्दाशी जुळणारे चित्र शोधा",
      "✨ योग्य चित्रावर क्लिक करा!"
    ],
    instruction1: "शब्द पाहण्यासाठी 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
    instruction3: "आता या शब्दाशी जुळणारे चित्र शोधा",
    instruction4: "उत्कृष्ट! तुम्ही शब्दाला योग्य चित्राशी जुळवले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "शब्द पाहण्यासाठी मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
    narration3: "आता या शब्दाशी जुळणारे चित्र शोधा",
    narration4: "उत्कृष्ट! तुम्ही शब्दाला योग्य चित्राशी जुळवले!",
    howToPlay: "कसे खेळायचे",
    findMatchingPicture: "जुळणारे चित्र शोधा!",
    demo: {
      word: "मांजर",
      options: ["🐱", "🐶", "🐭", "🐰"],
      correctIndex: 0,
      explanation: "शब्द 'मांजर' मांजराच्या चित्राशी जुळतो!"
    }
  }
};

export function ROARPictureVocabGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: ROARPictureVocabGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for ROARPictureVocabGameCore
  const demoQuestion: ROARPictureVocabQuestion = {
    target: {
      image: instructions.demo.options[instructions.demo.correctIndex],
      word: instructions.demo.word,
      category: "demo"
    },
    options: instructions.demo.options.map((option, index) => ({
      image: option,
      word: index === instructions.demo.correctIndex ? instructions.demo.word : `option${index}`,
      category: "demo"
    })),
    audio: instructions.demo.word,
    complexity: "basic",
    language: contentLanguage
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };

  // Play narration using TTS
  // Play narration using combined word games audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn('Narration already playing, skipping...');
      return;
    }
    
    setIsPlayingNarration(true);
    
    // Use combined word games audio files for Picture Words
    const gameName = 'Combined Word Games';
    const subGame = 'Picture Words';
    
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
    speechSynthesis.speak(utterance);
  };


  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case 'instruction1':
      case 'waitForReady':
        setCurrentStep(0);
        break;
      case 'showWord':
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
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowWord(false);
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
    playWordSound(instructions.demo.word);
    
    // Show word
    setShowWord(true);
    setDemoStep('showWord');
    
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

  // Handle option click
  const handleOptionClick = async (index: number) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === instructions.demo.correctIndex;
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
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Restart demo
  const restartDemo = () => {
    setDemoStep('instruction1');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setShowWord(false);
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
  const showWordDisplay = showWord && (demoStep === 'showWord' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete');
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  
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
                {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मागे'}
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
              {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मागे'}
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
            <div className="bg-blue-50 rounded-lg p-6 flex flex-col relative h-[420px]">
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                {/* Ready Button Section - Show initially */}
                {(demoStep === 'instruction1' || demoStep === 'waitForReady') && !showWordDisplay && (
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

                {/* Word Display - Show after ready click */}
                {(demoStep === 'showWord' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions && (
                  <div className="flex flex-col items-center justify-center animate-fade-in space-y-4">
                    <div className="text-5xl sm:text-6xl font-bold text-primary">
                      {instructions.demo.word}
                    </div>
                  </div>
                )}

                {/* Options Grid - Show after instruction 3 */}
                {showOptions && (
                  <ROARPictureVocabGameCore
                    currentQuestion={demoQuestion}
                    mode="preview"
                    selectedLanguage={selectedLanguage || 'en'}
                    showFeedback={showFeedback}
                    isCorrect={isCorrectAnswer}
                    selectedOption={selectedAnswer !== null ? demoQuestion.options[selectedAnswer].word : null}
                    isPreview={true}
                    demoStep={demoStep}
                    showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                    disabled={demoStep !== 'waitForAnswer'}
                    onOptionSelect={(optionWord) => {
                      const index = demoQuestion.options.findIndex(opt => opt.word === optionWord);
                      if (index !== -1) {
                        handleOptionClick(index);
                      }
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
              {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమో స్కిప్ చేయండి' : contentLanguage === 'kn' ? 'ಡೆಮೊವನ್ನು ಸ್ಕಿಪ್ ಮಾಡಿ' : 'डेमो वगळा'}
            </Button>
            
            {/* Start Game Button - Bottom Right with Pointer */}
            <div className="relative flex items-center gap-3">
              {/* Hand Pointer - appears when button is enabled */}
              {completionCount >= 3 && (
                <div 
                  className="text-3xl"
                  style={{
                    animation: 'pointToButton 1s ease-in-out infinite'
                  }}
                >
                  👉
                </div>
              )}
              
              <Button
                onClick={handleStartGame}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                <Gamepad2 className="h-7 w-4 mr-2" />
                {contentLanguage === 'en' ? 'Start Game' : contentLanguage === 'te' ? 'గేమ్ ప్రారంభించండి' : contentLanguage === 'kn' ? 'ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸಿ' : 'गेम सुरू करा'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}

export default ROARPictureVocabGamePreview;