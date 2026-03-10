import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Brain, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { MemoryGameCore, MemoryQuestion } from "./MemoryGameCore";

interface MemoryGamePreviewProps {
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
  | 'waitForReady'      // Wait for user to click "I'm Ready" button
  | 'showSequence'      // Show sequence for a few seconds
  | 'instruction2'      // After sequence, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForInput'      // Show letter options, wait for user to build sequence
  | 'wrongAnswer'       // User built wrong sequence
  | 'instruction4'      // After correct sequence, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Memory Challenge",
    description: "Watch, remember, and recall the sequence!",
    steps: [
      "👀 Watch the letter sequence carefully",
      "🧠 Remember the order of letters",
      "🎯 Click letters in the correct sequence",
      "✨ Get points for correct answers!"
    ],
    instruction1: "Get ready! You'll see a sequence of letters. Click 'I'm Ready' when prepared",
    instruction2: "Good! Now remember that sequence",
    instruction3: "Now recreate the sequence by clicking the letters in order",
    instruction4: "Perfect! You remembered the sequence correctly!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    readyButton: "I'm Ready",
    checkButton: "Check Sequence",
    narration1: "Get ready! You'll see a sequence of letters. Click I'm Ready when prepared",
    narration2: "Good! Now remember that sequence",
    narration3: "Now recreate the sequence by clicking the letters in order",
    narration4: "Perfect! You remembered the sequence correctly!",
    howToPlay: "How to Play",
    rememberText: "Watch & Remember",
    clickLettersText: "Click letters below...",
    whatWasSequence: "What was the sequence?",
    demo: {
      sequence: ["A", "B", "C"],
      options: ["A", "B", "C", "D", "E", "F"],
    }
  },
  te: {
    title: "జ్ఞాపకశక్తి సవాలు",
    description: "చూడండి, గుర్తుంచుకోండి మరియు జ్ఞాపకం చేసుకోండి!",
    steps: [
      "👀 అక్షర క్రమాన్ని జాగ్రత్తగా చూడండి",
      "🧠 అక్షరాల క్రమాన్ని గుర్తుంచుకోండి",
      "🎯 సరైన క్రమంలో అక్షరాలను క్లిక్ చేయండి",
      "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
    ],
    instruction1: "సిద్ధంగా ఉండండి! మీరు అక్షరాల క్రమాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఆ క్రమాన్ని గుర్తుంచుకోండి",
    instruction3: "ఇప్పుడు క్రమంలో అక్షరాలను క్లిక్ చేయడం ద్వారా క్రమాన్ని పునఃసృష్టించండి",
    instruction4: "పర్ఫెక్ట్! మీరు క్రమాన్ని సరిగ్గా గుర్తుంచుకున్నారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    readyButton: "నేను సిద్ధంగా ఉన్నాను",
    checkButton: "క్రమం తనిఖీ చేయండి",
    narration1: "సిద్ధంగా ఉండండి! మీరు అక్షరాల క్రమాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఆ క్రమాన్ని గుర్తుంచుకోండి",
    narration3: "ఇప్పుడు క్రమంలో అక్షరాలను క్లిక్ చేయడం ద్వారా క్రమాన్ని పునఃసృష్టించండి",
    narration4: "పర్ఫెక్ట్! మీరు క్రమాన్ని సరిగ్గా గుర్తుంచుకున్నారు!",
    howToPlay: "ఎలా ఆడాలి",
    rememberText: "చూడండి & గుర్తుంచుకోండి",
    clickLettersText: "క్రింద అక్షరాలను క్లిక్ చేయండి...",
    whatWasSequence: "క్రమం ఏమిటి?",
    demo: {
      sequence: ["అ", "ఆ", "ఇ"],
      options: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ"],
    }
  },
  kn: {
    title: "ಸ್ಮೃತಿ ಸವಾಲು",
    description: "ನೋಡಿ, ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ನೆನಪಿಸಿಕೊಳ್ಳಿ!",
    steps: [
      "👀 ಅಕ್ಷರ ಅನುಕ್ರಮವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
      "🧠 ಅಕ್ಷರಗಳ ಕ್ರಮವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
      "🎯 ಸರಿಯಾದ ಅನುಕ್ರಮದಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
    ],
    instruction1: "ತಯಾರಾಗಿ! ನೀವು ಅಕ್ಷರಗಳ ಅನುಕ್ರಮವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅನುಕ್ರಮವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    instruction3: "ಈಗ ಕ್ರಮದಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ಅನುಕ್ರಮವನ್ನು ಮರುಸೃಷ್ಟಿಸಿ",
    instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಅನುಕ್ರಮವನ್ನು ಸರಿಯಾಗಿ ನೆನಪಿಟ್ಟುಕೊಂಡಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    readyButton: "ನಾನು ಸಿದ್ಧ",
    checkButton: "ಅನುಕ್ರಮವನ್ನು ಪರಿಶೀಲಿಸಿ",
    narration1: "ತಯಾರಾಗಿ! ನೀವು ಅಕ್ಷರಗಳ ಅನುಕ್ರಮವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅನುಕ್ರಮವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    narration3: "ಈಗ ಕ್ರಮದಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ಅನುಕ್ರಮವನ್ನು ಮರುಸೃಷ್ಟಿಸಿ",
    narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಅನುಕ್ರಮವನ್ನು ಸರಿಯಾಗಿ ನೆನಪಿಟ್ಟುಕೊಂಡಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    rememberText: "ನೋಡಿ & ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    clickLettersText: "ಕೆಳಗೆ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ...",
    whatWasSequence: "ಅನುಕ್ರಮ ಏನು?",
    demo: {
      sequence: ["ಅ", "ಆ", "ಇ"],
      options: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ"],
    }
  },
  mr: {
    title: "स्मृती आव्हान",
    description: "पहा, लक्षात ठेवा आणि आठवा!",
    steps: [
      "👀 अक्षर अनुक्रम काळजीपूर्वक पहा",
      "🧠 अक्षरांचा क्रम लक्षात ठेवा",
      "🎯 योग्य क्रमाने अक्षरांवर क्लिक करा",
      "✨ योग्य उत्तरांसाठी गुण मिळवा!"
    ],
    instruction1: "तयार व्हा! तुम्हाला अक्षरांचा क्रम दिसेल. तयार असाल तेव्हा 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता तो क्रम लक्षात ठेवा",
    instruction3: "आता क्रमाने अक्षरांवर क्लिक करून क्रम पुन्हा तयार करा",
    instruction4: "उत्कृष्ट! तुम्ही क्रम योग्यरित्या लक्षात ठेवला!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    readyButton: "मी तयार आहे",
    checkButton: "क्रम तपासा",
    narration1: "तयार व्हा! तुम्हाला अक्षरांचा क्रम दिसेल. तयार असाल तेव्हा मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता तो क्रम लक्षात ठेवा",
    narration3: "आता क्रमाने अक्षरांवर क्लिक करून क्रम पुन्हा तयार करा",
    narration4: "उत्कृष्ट! तुम्ही क्रम योग्यरित्या लक्षात ठेवला!",
    howToPlay: "कसे खेळायचे",
    rememberText: "पहा & लक्षात ठेवा",
    clickLettersText: "खाली अक्षरांवर क्लिक करा...",
    whatWasSequence: "क्रम काय होता?",
    demo: {
      sequence: ["अ", "आ", "इ"],
      options: ["अ", "आ", "इ", "ई", "उ", "ऊ"],
    }
  }
};

export function MemoryGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: MemoryGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSequence, setShowSequence] = useState(false);
  const [sequenceTimer, setSequenceTimer] = useState(3);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for MemoryGameCore
  const demoQuestion: MemoryQuestion = {
    sequence: instructions.demo.sequence,
    display: instructions.demo.sequence.join(' - '),
    complexity: 'easy',
    language: contentLanguage
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };
  
  // Play narration using TTS
  // Play narration using combined letter games audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn('Narration already playing, skipping...');
      return;
    }
    
    setIsPlayingNarration(true);
    
    // Use combined letter games audio files for Memory Challenge
    const gameName = 'Combined Letter Games';
    const subGame = 'Memory Challenge';
    
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
      case 'showSequence':
        setCurrentStep(0);
        break;
      case 'instruction2':
        setCurrentStep(1);
        break;
      case 'instruction3':
      case 'waitForInput':
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
      setUserSequence([]);
      setShowFeedback(false);
      setShowSequence(false);
      setSequenceTimer(3);
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

  // Sequence countdown timer
  useEffect(() => {
    if (showSequence && sequenceTimer > 0) {
      const timer = setInterval(() => {
        setSequenceTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showSequence, sequenceTimer]);

  // When sequence timer ends, move to instruction 2 and show input area (disabled)
  useEffect(() => {
    if (showSequence && sequenceTimer === 0) {
      const handleSequenceEnd = async () => {
        setShowSequence(false);
        setDemoStep('instruction2');
        await playNarration(instructions.narration2, 2);
        
        setDemoStep('instruction3');
        await playNarration(instructions.narration3, 3);
        
        setDemoStep('waitForInput');
        
        setTimeout(() => {
          optionsRef.current?.focus();
        }, 100);
      };
      
      handleSequenceEnd();
    }
  }, [showSequence, sequenceTimer]);

  // Handle ready button click
  const handleReadyClick = () => {
    if (demoStep !== 'waitForReady' || hasClickedReady) return;
    
    setHasClickedReady(true);
    setDemoStep('showSequence');
    setShowSequence(true);
    setSequenceTimer(3);
  };

  // Handle letter click to build sequence
  const handleLetterClick = (letter: string) => {
    if (demoStep !== 'waitForInput' || showFeedback) return;
    
    if (userSequence.length < instructions.demo.sequence.length) {
      setUserSequence(prev => [...prev, letter]);
    }
  };

  // Handle check sequence button click
  const handleCheckSequence = async () => {
    if (userSequence.length !== instructions.demo.sequence.length || showFeedback) return;
    
    setShowFeedback(true);
    
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(instructions.demo.sequence);
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
        setUserSequence([]);
                }, 2000);
    }
  };

  // Remove last letter from sequence
  const handleRemoveLetter = () => {
    if (userSequence.length > 0 && !showFeedback) {
      setUserSequence(prev => prev.slice(0, -1));
    }
  };

  // Restart demo
  const restartDemo = () => {
    setDemoStep('instruction1');
    setUserSequence([]);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setShowSequence(false);
    setSequenceTimer(3);
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
  const showInputArea = demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForInput' || demoStep === 'instruction4' || demoStep === 'complete';
  
  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    onStartGame();
  };

  // Handle back button with audio cleanup
  const handleBack = () => {
    stopAllAudio();
    onBack();
  };

  // Handle start game with audio cleanup
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
                  {contentLanguage === 'en' ? 'Level' : contentLanguage === 'te' ? 'స్థాయి' : contentLanguage === 'kn' ? 'ಮಟ್ಟ' : 'पातळी'} {level} • {estimatedTime}
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
            <div className="bg-blue-50 rounded-lg p-4 text-center flex-1 flex flex-col justify-start relative min-h-[500px] max-h-[700px] overflow-y-auto">
              {/* Demo Content - Show sequentially */}
              <div className="flex flex-col justify-start space-y-3 py-2">
                {/* Step 1: Ready Button Section */}
                {showReadyButton && !showSequence && !showInputArea && (
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
                    {instructions.readyButton}
                  </Button>
                  {demoStep === 'waitForReady' && (
                    <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                      <span className="text-xl">👆</span>
                    </div>
                  )}
                  </div>
                )}

                {/* Step 2: Sequence Display - Use MemoryGameCore for consistency */}
                {showSequence && !showInputArea && (
                  <div className="flex flex-col items-center justify-center animate-fade-in space-y-3">
                    <MemoryGameCore
                      currentSequence={demoQuestion}
                      mode="preview"
                      selectedLanguage={contentLanguage}
                      currentLevel={1}
                      showSequence={true} // Show sequence display
                      showFeedback={false}
                      isCorrect={false}
                      userInput={[]}
                      currentLetterOptions={[]}
                      isPreview={true}
                      demoStep={demoStep}
                      sequenceTimer={sequenceTimer}
                      onLetterClick={() => {}}
                      onRemoveLast={() => {}}
                      onCheckSequence={() => {}}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Step 3: Input Area */}
                {showInputArea && (
                  <MemoryGameCore
                    currentSequence={demoQuestion}
                    mode="preview"
                    selectedLanguage={contentLanguage}
                    currentLevel={1}
                    showSequence={false} // Don't show sequence in input phase
                    showFeedback={showFeedback}
                    isCorrect={isCorrectAnswer}
                    userInput={userSequence}
                    currentLetterOptions={instructions.demo.options}
                    isPreview={true}
                    demoStep={demoStep}
                    showHandPointer={demoStep === 'waitForInput' && !showFeedback}
                    disabled={demoStep !== 'waitForInput'}
                    onLetterClick={handleLetterClick}
                    onRemoveLast={handleRemoveLetter}
                    onCheckSequence={handleCheckSequence}
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

export default MemoryGamePreview;
