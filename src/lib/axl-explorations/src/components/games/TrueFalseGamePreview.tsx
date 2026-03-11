import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Check, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { TrueFalseGameCore } from "./TrueFalseGameCore";

interface TrueFalseGamePreviewProps {
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
  | 'showStatement'     // Show the statement after ready click
  | 'instruction2'      // After showing statement, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "True or False",
    description: "Listen to the statement and decide if it's true or false!",
    steps: [
      "📝 Read the statement carefully",
      "🎯 Choose True or False",
      "✨ Get points for correct answers!"
    ],
    instruction1: "Get ready! You'll see a statement to evaluate. Click 'I'm Ready' when prepared",
    instruction2: "Good! Now read this statement carefully",
    instruction3: "Now, decide if this statement is true or false",
    instruction4: "Great job! You've completed the demo successfully!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Get ready! You'll see a statement to evaluate. Click I'm Ready when prepared",
    narration2: "Good! Now read this statement carefully",
    narration3: "Now, decide if this statement is true or false",
    narration4: "Great job! You've completed the demo successfully!",
    howToPlay: "How to Play",
    demo: {
      audio: "The sky is blue",
      statement: "The sky is blue",
      correctAnswer: true,
      explanation: "Correct! The sky is indeed blue."
    }
  },
  te: {
    title: "సత్యం లేదా అసత్యం",
    description: "వాక్యాన్ని విని అది సత్యమా లేదా అసత్యమా నిర్ణయించండి!",
    steps: [
      "📝 వాక్యాన్ని జాగ్రత్తగా చదవండి",
      "🎯 సత్యం లేదా అసత్యం ఎంచుకోండి",
      "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
    ],
    instruction1: "సిద్ధంగా ఉండండి! మీరు వాక్యాన్ని అంచనా వేయబోతున్నారు. సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
    instruction3: "ఇప్పుడు, ఈ వాక్యం సత్యమా లేదా అసత్యమా నిర్ణయించండి",
    instruction4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "సిద్ధంగా ఉండండి! మీరు వాక్యాన్ని అంచనా వేయబోతున్నారు. సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
    narration3: "ఇప్పుడు, ఈ వాక్యం సత్యమా లేదా అసత్యమా నిర్ణయించండి",
    narration4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    howToPlay: "ఎలా ఆడాలి",
    demo: {
      audio: "ఆకాశం నీలం రంగులో ఉంటుంది",
      statement: "ఆకాశం నీలం రంగులో ఉంటుంది",
      correctAnswer: true,
      explanation: "సరైనది! ఆకాశం నిజంగా నీలం రంగులో ఉంటుంది."
    }
  },
  kn: {
    title: "ಸತ್ಯ ಅಥವಾ ಸುಳ್ಳು",
    description: "ಹೇಳಿಕೆಯನ್ನು ಕೇಳಿ ಅದು ಸತ್ಯವೇ ಅಥವಾ ಸುಳ್ಳೇ ನಿರ್ಧರಿಸಿ!",
    steps: [
      "📝 ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
      "🎯 ಸತ್ಯ ಅಥವಾ ಸುಳ್ಳು ಆರಿಸಿ",
      "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
    ],
    instruction1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಹೇಳಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಿದ್ದೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    instruction3: "ಈಗ, ಈ ಹೇಳಿಕೆ ಸತ್ಯವೇ ಅಥವಾ ಸುಳ್ಳೇ ನಿರ್ಧರಿಸಿ",
    instruction4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    narration1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಹೇಳಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಿದ್ದೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    narration3: "ಈಗ, ಈ ಹೇಳಿಕೆ ಸತ್ಯವೇ ಅಥವಾ ಸುಳ್ಳೇ ನಿರ್ಧರಿಸಿ",
    narration4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    demo: {
      audio: "ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ",
      statement: "ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ",
      correctAnswer: true,
      explanation: "ಸರಿ! ಆಕಾಶ ನಿಜವಾಗಿಯೂ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ."
    }
  },
  mr: {
    title: "खरे किंवा खोटे",
    description: "विधान ऐका आणि ते खरे आहे की खोटे ठरवा!",
    steps: [
      "📝 विधान काळजीपूर्वक वाचा",
      "🎯 खरे किंवा खोटे निवडा",
      "✨ योग्य उत्तरांसाठी गुण मिळवा!"
    ],
    instruction1: "तयार रहा! तुम्ही विधानाचे मूल्यमापन करणार आहात. तयार असताना 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता हे विधान काळजीपूर्वक वाचा",
    instruction3: "आता, हे विधान खरे आहे की खोटे ठरवा",
    instruction4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "तयार रहा! तुम्ही विधानाचे मूल्यमापन करणार आहात. तयार असताना मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता हे विधान काळजीपूर्वक वाचा",
    narration3: "आता, हे विधान खरे आहे की खोटे ठरवा",
    narration4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
    howToPlay: "कसे खेळायचे",
    demo: {
      audio: "आकाश निळ्या रंगाचे आहे",
      statement: "आकाश निळ्या रंगाचे आहे",
      correctAnswer: true,
      explanation: "बरोबर! आकाश खरोखर निळ्या रंगाचे आहे."
    }
  }
};

export function TrueFalseGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: TrueFalseGamePreviewProps) {
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
  const [showStatement, setShowStatement] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];
  
  // Create demo question
  const demoQuestion = {
    statement: instructions.demo.statement,
    isTrue: instructions.demo.correctAnswer
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };

  // Play narration using TTS
  // Play narration using combined sentence games audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn('Narration already playing, skipping...');
      return;
    }
    
    setIsPlayingNarration(true);
    
    // Use combined sentence games audio files for True or False
    const gameName = 'Combined Sentence Games';
    const subGame = 'True or False';
    
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
        setCurrentStep(0);
        break;
      case 'showStatement':
      case 'instruction2':
      case 'instruction3':
      case 'waitForAnswer':
        setCurrentStep(1);
        break;
      case 'instruction4':
      case 'complete':
        setCurrentStep(2);
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
      setShowStatement(false);
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
    
    // Show statement
    setShowStatement(true);
    setDemoStep('showStatement');
    
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
  const handleOptionClick = async (option: boolean) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    const isCorrect = option === instructions.demo.correctAnswer;
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
    setShowStatement(false);
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
  const showStatementDisplay = showStatement && (demoStep === 'showStatement' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4');
  const showOptions = showStatement && (demoStep === 'showStatement' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4');
  
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
            <div className={`bg-blue-50 rounded-lg p-4 flex flex-col justify-center relative ${
              demoStep === 'complete' && completionCount >= 1 ? 'h-[420px]' : 'h-[500px]'
            }`}>
                {/* Ready Button */}
                {showReadyButton && (
                  <div className="text-center mb-2">
                    <div 
                      ref={readyButtonRef}
                      className={`inline-block p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 font-semibold ${
                        demoStep === 'waitForReady' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-400 ring-opacity-50 animate-pulse' 
                          : demoStep === 'instruction1'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                      tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                    >
                      {contentLanguage === 'en' ? "I'm Ready" : contentLanguage === 'te' ? 'నేను సిద్ధంగా ఉన్నాను' : contentLanguage === 'kn' ? 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' : 'मी तयार आहे'}
                    </div>
                    {demoStep === 'waitForReady' && (
                      <div className="text-center mt-1 text-blue-600 font-medium animate-bounce">
                        <span className="text-2xl">👆</span>
                      </div>
                    )}
                  </div>
                )}

                {/* True/False Options */}
                {showOptions && (
                  <div className="animate-fade-in">
                    <TrueFalseGameCore
                      currentQuestion={demoQuestion}
                      mode="preview"
                      selectedLanguage={selectedLanguage || 'en'}
                      selectedAnswer={selectedAnswer}
                      showFeedback={showFeedback}
                      isCorrect={isCorrectAnswer}
                      isPreview={true}
                      demoStep={demoStep}
                      showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                      disabled={demoStep !== 'waitForAnswer' || showFeedback}
                      onAnswerSelect={(answer) => handleOptionClick(answer)}
                      onContinue={() => {}}
                      feedbackLanguageOverride={audioLanguage}
                    />
                  </div>
                )}
              </div>
            </div>

          {/* Bottom Section - Fixed Buttons */}
          <div className="flex justify-between items-center gap-4 mt-auto flex-shrink-0">
            {/* Skip Demo Button - Bottom Left */}
            <Button
              onClick={handleSkipDemo}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
            >
              {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమో స్కిప్ చేయండి' : contentLanguage === 'kn' ? 'ಡೆಮೊವನ್ನು ಸ್ಕಿಪ్ ಮಾಡಿ' : 'डेमो वगळा'}
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

export default TrueFalseGamePreview;