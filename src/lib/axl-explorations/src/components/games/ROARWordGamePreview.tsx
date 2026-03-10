import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, BookOpen, Sparkles, Clock, CheckCircle, Trash2, Gamepad2, RotateCcw, Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { ROARWordGameCore, type ROARWordQuestion } from "./ROARWordGameCore";

interface ROARWordGamePreviewProps {
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
  | 'waitForReady'      // Wait for user to click "Show Word" button
  | 'showWord'          // Show the word
  | 'instruction2'      // After showing word, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show buttons, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Word Detective",
    description: "Identify real words and detect fake ones!",
    steps: [
      "📖 Read the word carefully",
      "🤔 Think if it's a real word",
      "✅ Click Book for real words",
      "🗑️ Click Trash for fake words"
    ],
    instruction1: "Get ready! You'll see a word. Click 'Show Word' when you're prepared",
    instruction2: "Good! Now read this word carefully",
    instruction3: "Decide: Is this a real word or a fake word?",
    instruction4: "Perfect! You identified the word correctly!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    showWordButton: "Show Word",
    realWordLabel: "Real Word",
    fakeWordLabel: "Fake Word",
    narration1: "Get ready! You'll see a word. Click Show Word when you're prepared",
    narration2: "Good! Now read this word carefully",
    narration3: "Decide: Is this a real word or a fake word?",
    narration4: "Perfect! You identified the word correctly!",
    howToPlay: "How to Play",
    isThisRealWord: "Is this a real word?",
    demo: {
      word: "CAT",
      isReal: true,
      explanation: "CAT is a real word - it's an animal!"
    }
  },
  te: {
    title: "పద దర్యాప్తుడు",
    description: "నిజమైన పదాలను గుర్తించండి మరియు నకిలీవాటిని గుర్తించండి!",
    steps: [
      "📖 పదాన్ని జాగ్రత్తగా చదవండి",
      "🤔 అది నిజమైన పదమా అని ఆలోచించండి",
      "✅ నిజమైన పదాలకు Book క్లిక్ చేయండి",
      "🗑️ నకిలీ పదాలకు Trash క్లిక్ చేయండి"
    ],
    instruction1: "సిద్ధంగా ఉండండి! మీరు ఒక పదాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు 'పదం చూపించు' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
    instruction3: "నిర్ణయించండి: ఇది నిజమైన పదమా లేదా నకిలీ పదమా?",
    instruction4: "పర్ఫెక్ట్! మీరు పదాన్ని సరిగ్గా గుర్తించారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    showWordButton: "పదం చూపించు",
    realWordLabel: "నిజమైన పదం",
    fakeWordLabel: "నకిలీ పదం",
    narration1: "సిద్ధంగా ఉండండి! మీరు ఒక పదాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు పదం చూపించు క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
    narration3: "నిర్ణయించండి: ఇది నిజమైన పదమా లేదా నకిలీ పదమా?",
    narration4: "పర్ఫెక్ట్! మీరు పదాన్ని సరిగ్గా గుర్తించారు!",
    howToPlay: "ఎలా ఆడాలి",
    isThisRealWord: "ఇది నిజమైన పదమా?",
    demo: {
      word: "పిల్లి",
      isReal: true,
      explanation: "పిల్లి ఒక నిజమైన పదం - ఇది ఒక జంతువు!"
    }
  },
  kn: {
    title: "ಪದ ತನಿಖೆಗಾರ",
    description: "ನಿಜವಾದ ಪದಗಳನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ನಕಲಿಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ!",
    steps: [
      "📖 ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
      "🤔 ಅದು ನಿಜವಾದ ಪದವೇ ಎಂದು ಯೋಚಿಸಿ",
      "✅ ನಿಜವಾದ ಪದಗಳಿಗೆ Book ಕ್ಲಿಕ್ ಮಾಡಿ",
      "🗑️ ನಕಲಿ ಪದಗಳಿಗೆ Trash ಕ್ಲಿಕ್ ಮಾಡಿ"
    ],
    instruction1: "ತಯಾರಾಗಿ! ನೀವು ಒಂದು ಪದವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ಪದ ತೋರಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    instruction3: "ನಿರ್ಧರಿಸಿ: ಇದು ನಿಜವಾದ ಪದವೇ ಅಥವಾ ನಕಲಿ ಪದವೇ?",
    instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    showWordButton: "ಪದ ತೋರಿಸಿ",
    realWordLabel: "ನಿಜವಾದ ಪದ",
    fakeWordLabel: "ನಕಲಿ ಪದ",
    narration1: "ತಯಾರಾಗಿ! ನೀವು ಒಂದು ಪದವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ಪದ ತೋರಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    narration3: "ನಿರ್ಧರಿಸಿ: ಇದು ನಿಜವಾದ ಪದವೇ ಅಥವಾ ನಕಲಿ ಪದವೇ?",
    narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    isThisRealWord: "ಇದು ನಿಜವಾದ ಪದವೇ?",
    demo: {
      word: "ಬೆಕ್ಕು",
      isReal: true,
      explanation: "ಬೆಕ್ಕು ಒಂದು ನಿಜವಾದ ಪದ - ಇದು ಒಂದು ಪ್ರಾಣಿ!"
    }
  },
  mr: {
    title: "शब्द तपासणी",
    description: "खरे शब्द ओळखा आणि खोटे शब्द शोधा!",
    steps: [
      "📖 शब्द काळजीपूर्वक वाचा",
      "🤔 तो खरा शब्द आहे का याचा विचार करा",
      "✅ खऱ्या शब्दांसाठी Book क्लिक करा",
      "🗑️ नकली शब्दांसाठी Trash क्लिक करा"
    ],
    instruction1: "तयार व्हा! तुम्हाला एक शब्द दिसेल. तयार असाल तेव्हा 'शब्द दाखवा' क्लिक करा",
    instruction2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
    instruction3: "ठरवा: हा खरा शब्द आहे की नकली शब्द?",
    instruction4: "उत्कृष्ट! तुम्ही शब्द योग्यरित्या ओळखला!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    showWordButton: "शब्द दाखवा",
    realWordLabel: "खरा शब्द",
    fakeWordLabel: "नकली शब्द",
    narration1: "तयार व्हा! तुम्हाला एक शब्द दिसेल. तयार असाल तेव्हा शब्द दाखवा क्लिक करा",
    narration2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
    narration3: "ठरवा: हा खरा शब्द आहे की नकली शब्द?",
    narration4: "उत्कृष्ट! तुम्ही शब्द योग्यरित्या ओळखला!",
    howToPlay: "कसे खेळायचे",
    isThisRealWord: "हा खरा शब्द आहे का?",
    demo: {
      word: "मांजर",
      isReal: true,
      explanation: "मांजर हा खरा शब्द आहे - हे एक प्राणी आहे!"
    }
  }
};

export function ROARWordGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: ROARWordGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLButtonElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for ROARWordGameCore
  const demoQuestion: ROARWordQuestion = {
    word: instructions.demo.word,
    isReal: instructions.demo.isReal,
    complexity: 'easy',
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
    
    // Use combined word games audio files for Word Detective
    const gameName = 'Combined Word Games';
    const subGame = 'Word Detective';
    
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


  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case 'instruction1':
      case 'waitForReady':
      case 'showWord':
        setCurrentStep(0);
        break;
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
    setDemoStep('showWord');
    setShowWord(true);
    
    // Wait a moment, then show instruction 2
    setTimeout(async () => {
      setDemoStep('instruction2');
      await playNarration(instructions.narration2, 2);
      
      // After instruction 2, show instruction 3
      setDemoStep('instruction3');
      await playNarration(instructions.narration3, 3);
      
      // Move to waiting for answer
      setDemoStep('waitForAnswer');
      
      setTimeout(() => {
        buttonsRef.current?.focus();
      }, 100);
    }, 1500);
  };

  // Handle answer button click
  const handleAnswerClick = async (isReal: boolean) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    setSelectedAnswer(isReal);
    setShowFeedback(true);
    
    const isCorrect = isReal === instructions.demo.isReal;
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
  const showButtons = demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  
  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    setTimeout(() => {
      onStartGame();
    }, 100);
  };

  // Back handler
  const handleBack = () => {
    stopAllAudio();
    setTimeout(() => {
      onBack();
    }, 100);
  };

  // Start game handler
  const handleStartGame = () => {
    stopAllAudio();
    setTimeout(() => {
      onStartGame();
    }, 100);
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
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center relative h-[420px]">
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                {/* Ready Button Section - Always visible but disabled initially */}
                {showReadyButton && !showWord && !showButtons && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="text-3xl mb-2">
                    <Eye className={`h-16 w-16 mx-auto transition-colors ${
                      demoStep === 'waitForReady' 
                        ? 'text-blue-600 animate-pulse' 
                        : demoStep === 'instruction1'
                        ? 'text-gray-400'
                        : 'text-blue-600'
                    }`} />
                  </div>
                  <Button
                    ref={readyButtonRef}
                    onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                    disabled={demoStep !== 'waitForReady'}
                    className={`px-6 py-3 font-bold text-base rounded-full shadow-lg transition-all duration-300 ${
                      demoStep === 'waitForReady' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform ring-4 ring-blue-400 ring-opacity-50' 
                        : demoStep === 'instruction1'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform'
                    }`}
                    tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                  >
                    {instructions.showWordButton}
                  </Button>
                  {demoStep === 'waitForReady' && (
                    <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                      <span className="text-xl">👆</span>
                    </div>
                  )}
                  </div>
                )}

                {showWord && !showButtons && (
                  <div className="flex flex-col items-center justify-center animate-fade-in space-y-3">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
                      {instructions.demo.word}
                    </h2>
                  </div>
                )}

                {showButtons && (
                  <>
                    <ROARWordGameCore
                      currentQuestion={demoQuestion}
                      mode="preview"
                      selectedLanguage={contentLanguage}
                      showFeedback={showFeedback}
                      isCorrect={isCorrectAnswer}
                      selectedAnswer={selectedAnswer}
                      isPreview={true}
                      demoStep={demoStep}
                      showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                      disabled={demoStep !== 'waitForAnswer'}
                      onAnswerSelect={handleAnswerClick}
                    />
                    
                    {/* Feedback for Word Detective - below the buttons */}
                    {/* {showFeedback && (
                      <div className="text-center mt-4 animate-fade-in">
                        <div className={isCorrectAnswer ? 'text-green-600' : 'text-red-600'}>
                          <p className="text-lg sm:text-xl font-bold">
                            {isCorrectAnswer ? '🎉 Correct!' : '😢 Oops! Wrong!'}
                          </p>
                        </div>
                      </div>
                    )} */}
                  </>
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
              {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమో స్కిప్ చేయండి' : contentLanguage === 'kn' ? 'ಡೆಮೊವನ್ನು ಸ್ಕిప್ ಮಾಡಿ' : 'डेमो वगळा'}
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

export default ROARWordGamePreview;
