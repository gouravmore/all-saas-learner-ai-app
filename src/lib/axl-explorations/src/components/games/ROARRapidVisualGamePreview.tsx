import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Zap, Sparkles, CheckCircle, Gamepad2, RotateCcw, Eye, Timer } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { ROARRapidVisualGameCore, type ROARRapidVisualQuestion } from "./ROARRapidVisualGameCore";

interface ROARRapidVisualGamePreviewProps {
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
  | 'showTarget'        // Show target letter with timer
  | 'instruction2'      // After timer, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show grid, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Quick Sight",
    description: "Remember the target letter and find its position in the grid!",
    steps: [
      "👁️ Look at the target letter carefully",
      "⏱️ Remember it before time runs out",
      "🔍 Find the letter position in the grid",
      "✨ Click the correct position!"
    ],
    instruction1: "Get ready! You'll see a target letter. Click 'I'm Ready' when you're prepared",
    instruction2: "Good! Now remember where that letter was",
    instruction3: "Now find the target letter in the grid below",
    instruction4: "Excellent! You found the correct position!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    readyButton: "I'm Ready",
    narration1: "Get ready! You'll see a target letter. Click I'm Ready when you're prepared",
    narration2: "Good! Now remember where that letter was",
    narration3: "Now find the target letter in the grid below",
    narration4: "Excellent! You found the correct position!",
    howToPlay: "How to Play",
    rememberText: "Remember this letter!",
    findPositionText: "Find the Letter Position",
    demo: {
      target: "A",
      options: ["A", "B", "C", "D", "E", "F"],
      correctPosition: 0,
      explanation: "The letter 'A' was at position 1!"
    }
  },
  te: {
    title: "క్విక్‌సైట్",
    description: "లక్ష్య అక్షరాన్ని గుర్తుంచుకోండి మరియు గ్రిడ్‌లో దాని స్థానాన్ని కనుగొనండి!",
    steps: [
      "👁️ లక్ష్య అక్షరాన్ని జాగ్రత్తగా చూడండి",
      "⏱️ సమయం ముగిసే ముందు దానిని గుర్తుంచుకోండి",
      "🔍 గ్రిడ్‌లో అక్షర స్థానాన్ని కనుగొనండి",
      "✨ సరైన స్థానాన్ని క్లిక్ చేయండి!"
    ],
    instruction1: "సిద్ధంగా ఉండండి! మీరు లక్ష్య అక్షరాన్ని చూస్తారు. మీరు సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఆ అక్షరం ఎక్కడ ఉందో గుర్తుంచుకోండి",
    instruction3: "ఇప్పుడు క్రింది గ్రిడ్‌లో లక్ష్య అక్షరాన్ని కనుగొనండి",
    instruction4: "అద్భుతం! మీరు సరైన స్థానాన్ని కనుగొన్నారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    readyButton: "నేను సిద్ధంగా ఉన్నాను",
    narration1: "సిద్ధంగా ఉండండి! మీరు లక్ష్య అక్షరాన్ని చూస్తారు. మీరు సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఆ అక్షరం ఎక్కడ ఉందో గుర్తుంచుకోండి",
    narration3: "ఇప్పుడు క్రింది గ్రిడ్‌లో లక్ష్య అక్షరాన్ని కనుగొనండి",
    narration4: "అద్భుతం! మీరు సరైన స్థానాన్ని కనుగొన్నారు!",
    howToPlay: "ఎలా ఆడాలి",
    rememberText: "ఈ అక్షరాన్ని గుర్తుంచుకోండి!",
    findPositionText: "అక్షర స్థానాన్ని కనుగొనండి",
    demo: {
      target: "అ",
      options: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ"],
      correctPosition: 0,
      explanation: "అక్షరం 'అ' స్థానం 1లో ఉంది!"
    }
  },
  kn: {
    title: "ಕ್ವಿಕ್‌ಸೈಟ್",
    description: "ಗುರಿ ಅಕ್ಷರವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ಗ್ರಿಡ್‌ನಲ್ಲಿ ಅದರ ಸ್ಥಾನವನ್ನು ಹುಡುಕಿ!",
    steps: [
      "👁️ ಗುರಿ ಅಕ್ಷರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
      "⏱️ ಸಮಯ ಮುಗಿಯುವ ಮೊದಲು ಅದನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
      "🔍 ಗ್ರಿಡ್‌ನಲ್ಲಿ ಅಕ್ಷರ ಸ್ಥಾನವನ್ನು ಹುಡುಕಿ",
      "✨ ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!"
    ],
    instruction1: "ತಯಾರಾಗಿ! ನೀವು ಗುರಿ ಅಕ್ಷರವನ್ನು ನೋಡುತ್ತೀರಿ. ನೀವು ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅಕ್ಷರ ಎಲ್ಲಿತ್ತು ಎಂದು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    instruction3: "ಈಗ ಕೆಳಗಿನ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಗುರಿ ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ",
    instruction4: "ಅದ್ಭುತ! ನೀವು ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    readyButton: "ನಾನು ಸಿದ್ಧ",
    narration1: "ತಯಾರಾಗಿ! ನೀವು ಗುರಿ ಅಕ್ಷರವನ್ನು ನೋಡುತ್ತೀರಿ. ನೀವು ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅಕ್ಷರ ಎಲ್ಲಿತ್ತು ಎಂದು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    narration3: "ಈಗ ಕೆಳಗಿನ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಗುರಿ ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ",
    narration4: "ಅದ್ಭುತ! ನೀವು ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    rememberText: "ಈ ಅಕ್ಷರವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ!",
    findPositionText: "ಅಕ್ಷರ ಸ್ಥಾನವನ್ನು ಹುಡುಕಿ",
    demo: {
      target: "ಅ",
      options: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ"],
      correctPosition: 0,
      explanation: "ಅಕ್ಷರ 'ಅ' ಸ್ಥಾನ 1ರಲ್ಲಿ ಇತ್ತು!"
    }
  },
  mr: {
    title: "क्विकसाइट",
    description: "लक्ष्य अक्षर लक्षात ठेवा आणि ग्रिडमध्ये त्याचे स्थान शोधा!",
    steps: [
      "👁️ लक्ष्य अक्षर काळजीपूर्वक पहा",
      "⏱️ वेळ संपण्यापूर्वी ते लक्षात ठेवा",
      "🔍 ग्रिडमध्ये अक्षर स्थान शोधा",
      "✨ योग्य स्थानावर क्लिक करा!"
    ],
    instruction1: "तयार व्हा! तुम्हाला लक्ष्य अक्षर दिसेल. तुम्ही तयार असाल तेव्हा 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता ते अक्षर कुठे होते ते लक्षात ठेवा",
    instruction3: "आता खालील ग्रिडमध्ये लक्ष्य अक्षर शोधा",
    instruction4: "उत्कृष्ट! तुम्हाला योग्य स्थान सापडले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    readyButton: "मी तयार आहे",
    narration1: "तयार व्हा! तुम्हाला लक्ष्य अक्षर दिसेल. तुम्ही तयार असाल तेव्हा मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता ते अक्षर कुठे होते ते लक्षात ठेवा",
    narration3: "आता खालील ग्रिडमध्ये लक्ष्य अक्षर शोधा",
    narration4: "उत्कृष्ट! तुम्हाला योग्य स्थान सापडले!",
    howToPlay: "कसे खेळायचे",
    rememberText: "हे अक्षर लक्षात ठेवा!",
    findPositionText: "अक्षर स्थान शोधा",
    demo: {
      target: "अ",
      options: ["अ", "आ", "इ", "ई", "उ", "ऊ"],
      correctPosition: 0,
      explanation: "अक्षर 'अ' स्थान 1 वर होते!"
    }
  }
};

function ROARRapidVisualGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: ROARRapidVisualGamePreviewProps) {
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
  const [showTargetLetter, setShowTargetLetter] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question for preview
  const demoQuestion: ROARRapidVisualQuestion = {
    target: instructions.demo.target,
    letters: instructions.demo.options,
    targetPosition: instructions.demo.correctPosition,
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
    
    // Use combined letter games audio files for Quick Sight
    const gameName = 'Combined Letter Games';
    const subGame = 'Quick Sight';
    
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
      case 'showTarget':
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
      setShowTargetLetter(false);
      setTimeRemaining(3);
      setIsTimerRunning(false);
    }
  }, [demoStep, previewPhase, instructions.narration1]);

  // When instruction 1 narration finishes, move to waitForReady
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
      const timer = setTimeout(() => {
        setDemoStep('waitForReady');
        // Focus on ready button after a brief delay
        setTimeout(() => {
          readyButtonRef.current?.focus();
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration]);

  // Timer for showing target letter
  useEffect(() => {
    if (showTargetLetter && isTimerRunning) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showTargetLetter, isTimerRunning]);

  // When timer reaches 0, hide target and show grid (disabled)
  useEffect(() => {
    if (showTargetLetter && !isTimerRunning && timeRemaining === 0) {
      const handleTimerEnd = async () => {
        // Hide target letter and show grid immediately (but disabled)
    setShowTargetLetter(false);
        setDemoStep('instruction2');
        await playNarration(instructions.narration2, 2);
        
        // After instruction 2, show instruction 3
        setDemoStep('instruction3');
        await playNarration(instructions.narration3, 3);
        
        // Move to waiting for answer - now enable grid
        setDemoStep('waitForAnswer');
        
        // Focus on grid container
        setTimeout(() => {
          gridRef.current?.focus();
        }, 100);
      };
      
      handleTimerEnd();
    }
  }, [showTargetLetter, isTimerRunning, timeRemaining]);

  // Handle ready button click
  const handleReadyClick = () => {
    if (demoStep !== 'waitForReady' || hasClickedReady) return;
    
    setHasClickedReady(true);
    setDemoStep('showTarget');
    setShowTargetLetter(true);
    setTimeRemaining(3);
    setIsTimerRunning(true);
  };

  // Handle option click
  const handleOptionClick = async (position: number) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    setSelectedAnswer(position);
    setShowFeedback(true);
    
    const isCorrect = position === instructions.demo.correctPosition;
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      
      // Show instruction 4 and play its narration
      setDemoStep('instruction4');
      await playNarration(instructions.narration4, 4);
      
      // Mark demo run as complete and increment completion count
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
      
      // Reset feedback after a delay to allow retry
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Restart demo (for second run or Help replay)
  const restartDemo = () => {
    setDemoStep('instruction1');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setShowTargetLetter(false);
    setTimeRemaining(3);
    setIsTimerRunning(false);
    setCurrentStep(0);
  };

  // Help button click - replay demo without affecting success count
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

  // Show ready button
  const showReadyButton = (demoStep === 'waitForReady' || demoStep === 'instruction1') && !hasClickedReady;
  
  // Show grid options - show after target letter disappears (timer ends), but enable only after instructions
  const showGrid = demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  
  // Grid is enabled only when waiting for answer
  const gridEnabled = demoStep === 'waitForAnswer';
  
  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    onStartGame();
  };

  // Back handler
  const handleBack = () => {
    stopAllAudio();
    onBack();
  };

  // Start game handler
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
                <Zap className="h-3 w-3" />
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
            <div className="bg-blue-50 rounded-lg p-6 flex flex-col justify-center relative h-[420px]">
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                
                {/* Ready Button Section - Always visible but disabled initially */}
                {showReadyButton && !showTargetLetter && !showGrid && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-4xl mb-2">
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
                      className={`px-6 py-3 font-semibold text-base rounded-full shadow-lg transition-all duration-300 ${
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

                {/* Demo Game UI */}
                {(showTargetLetter || showGrid) && (
                  <div className="animate-fade-in">
                    <ROARRapidVisualGameCore
                      currentQuestion={demoQuestion}
                      mode="preview"
                      selectedLanguage={contentLanguage}
                      timeRemaining={timeRemaining}
                      isTimerRunning={isTimerRunning}
                      showTargetLetter={showTargetLetter}
                      showSelectionGrid={showGrid}
                      showFeedback={showFeedback}
                      isCorrect={isCorrectAnswer}
                      selectedPosition={selectedAnswer}
                      isPreview={true}
                      demoStep={demoStep}
                      showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                      disabled={!gridEnabled}
                      onPositionSelect={handleOptionClick}
                    />
                  </div>
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

export default ROARRapidVisualGamePreview;
