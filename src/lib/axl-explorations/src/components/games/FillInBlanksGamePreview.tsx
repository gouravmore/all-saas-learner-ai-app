import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";
import { FillInBlanksGameCore, type FillInBlanksQuestion } from "./FillInBlanksGameCore";

interface FillInBlanksGamePreviewProps {
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
  | 'showSentence'       // Show the sentence after ready click
  | 'instruction2'      // After showing sentence, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Fill in the Blanks",
    description: "Listen to the sentence and fill in the missing word!",
    steps: [
      "📝 Read the sentence carefully",
      "🎯 Choose the correct word to complete it",
      "✨ Get points for correct answers!"
    ],
    instruction1: "Get ready! You'll see a sentence with a missing word. Click 'I'm Ready' when prepared",
    instruction2: "Good! Now read this sentence carefully",
    instruction3: "Now, choose the correct word to complete the sentence",
    instruction4: "Great job! You've completed the demo successfully!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Get ready! You'll see a sentence with a missing word. Click I'm Ready when prepared",
    narration2: "Good! Now read this sentence carefully",
    narration3: "Now, choose the correct word to complete the sentence",
    narration4: "Great job! You've completed the demo successfully!",
    howToPlay: "How to Play",
    demo: {
      sentence: "The _____ is shining bright",
      options: ["some", "sun", "son", "sum"],
      correctAnswer: "sun",
      explanation: "Correct! The sun is shining bright."
    }
  },
  te: {
    title: "ఖాళీలను నింపండి",
    description: "వాక్యాన్ని వినండి మరియు తప్పిపోయిన పదాన్ని నింపండి!",
    steps: [
      "📝 వాక్యాన్ని జాగ్రత్తగా చదవండి",
      "🎯 దాన్ని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
      "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
    ],
    instruction1: "సిద్ధంగా ఉండండి! మీరు తప్పిపోయిన పదంతో వాక్యాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
    instruction3: "ఇప్పుడు, వాక్యాన్ని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
    instruction4: "అద్భుతం! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "సిద్ధంగా ఉండండి! మీరు తప్పిపోయిన పదంతో వాక్యాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
    narration3: "ఇప్పుడు, వాక్యాన్ని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
    narration4: "అద్భుతం! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    howToPlay: "ఎలా ఆడాలి",
    demo: {
      sentence: "_____ తేజస్సుగా వెలుగుతోంది.",
      options: ["కొన్ని", "సూర్యుడు", "కుమారుడు", "మొత్తం"],
      correctAnswer: "సూర్యుడు",
      explanation: "సరైనది! సూర్యుడు తేజస్సుగా వెలుగుతోంది."
    }
  },
  kn: {
    title: "ಖಾಲಿ ಜಾಗಗಳನ್ನು ತುಂಬಿಸಿ",
    description: "ವಾಕ್ಯವನ್ನು ಕೇಳಿ ಮತ್ತು ಕಾಣೆಯಾದ ಪದವನ್ನು ತುಂಬಿಸಿ!",
    steps: [
      "📝 ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
      "🎯 ಅದನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
      "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
    ],
    instruction1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಕಾಣೆಯಾದ ಪದದೊಂದಿಗೆ ವಾಕ್ಯವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    instruction3: "ಈಗ, ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
    instruction4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಓಹ್! ತಪ್ಪು!",
    narration1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಕಾಣೆಯಾದ ಪದದೊಂದಿಗೆ ವಾಕ್ಯವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
    narration3: "ಈಗ, ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
    narration4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    demo: {
      sentence: "_____ ಪ್ರಕಾಶಮಾನವಾಗಿ ಹೊಳೆಯುತ್ತಿದೆ.",
      options: ["ಕೆಲವು", "ಸೂರ್ಯ", "ಮಗ", "ಮೊತ್ತ"],
      correctAnswer: "ಸೂರ್ಯ",
      explanation: "ಸರಿ! ಸೂರ್ಯ ಪ್ರಕಾಶಮಾನವಾಗಿ ಹೊಳೆಯುತ್ತಿದೆ."
    }
  },
  mr: {
    title: "रिक्त जागा भरा",
    description: "वाक्य ऐका आणि गहाळ शब्द भरा!",
    steps: [
      "📝 वाक्य काळजीपूर्वक वाचा",
      "🎯 ते पूर्ण करण्यासाठी योग्य शब्द निवडा",
      "✨ योग्य उत्तरांसाठी गुण मिळवा!"
    ],
    instruction1: "तयार रहा! तुम्ही गहाळ शब्दासह वाक्य पाहाल. तयार असताना 'मी तयार आहे' क्लिक करा",
    instruction2: "चांगले! आता हे वाक्य काळजीपूर्वक वाचा",
    instruction3: "आता, वाक्य पूर्ण करण्यासाठी योग्य शब्द निवडा",
    instruction4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "तयार रहा! तुम्ही गहाळ शब्दासह वाक्य पाहाल. तयार असताना मी तयार आहे क्लिक करा",
    narration2: "चांगले! आता हे वाक्य काळजीपूर्वक वाचा",
    narration3: "आता, वाक्य पूर्ण करण्यासाठी योग्य शब्द निवडा",
    narration4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
    howToPlay: "कसे खेळायचे",
    demo: {
      sentence: "_____ तेजस्वीपणे चमकत आहे.",
      options: ["काही", "सूर्य", "मुलगा", "बेरीज"],
      correctAnswer: "सूर्य",
      explanation: "बरोबर! सूर्य तेजस्वीपणे चमकत आहे."
    }
  }
};

export function FillInBlanksGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: FillInBlanksGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSentence, setShowSentence] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const readyButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for FillInBlanksGameCore
  const demoQuestion: FillInBlanksQuestion = {
    sentence: instructions.demo.sentence,
    missingWord: '_____',
    correctAnswer: instructions.demo.correctAnswer,
    options: instructions.demo.options,
    language: contentLanguage,
    complexity: 'basic',
    level: 1
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
    
    // Use combined sentence games audio files for Fill in Blanks
    const gameName = 'Combined Sentence Games';
    const subGame = 'Fill in Blanks';
    
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
        setCurrentStep(0);
        break;
      case 'waitForReady':
        setCurrentStep(0);
        break;
      case 'showSentence':
        setCurrentStep(1);
        break;
      case 'instruction2':
        setCurrentStep(1);
        break;
      case 'instruction3':
        setCurrentStep(2);
        break;
      case 'waitForAnswer':
        setCurrentStep(2);
        break;
      case 'instruction4':
        setCurrentStep(2);
        break;
      case 'complete':
        setCurrentStep(2);
        break;
      default:
        setCurrentStep(0);
    }
  }, [demoStep]);

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (demoStep === 'instruction1' && previewPhase === 'demo') {
      playNarration(instructions.narration1, 1);
      setHasClickedReady(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowSentence(false);
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
    
    // Show sentence
    setShowSentence(true);
    setDemoStep('showSentence');
    
    // Wait a moment, then play instruction 2
    setTimeout(async () => {
      setDemoStep('instruction2');
      await playNarration(instructions.narration2, 2);
      
      // Wait a moment, then play instruction 3
      setTimeout(async () => {
        setDemoStep('instruction3');
        await playNarration(instructions.narration3, 3);
        
        // Wait a moment, then show options
        setTimeout(() => {
          setDemoStep('waitForAnswer');
          setTimeout(() => {
            optionsRef.current?.focus();
          }, 100);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Handle option click
  const handleOptionClick = async (option: string) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    const isCorrect = option === instructions.demo.correctAnswer;
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      
      // Show success message for 3 seconds before moving to next step
      setTimeout(async () => {
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
      }, 3000); // Show success message for 3 seconds
    } else {
      await playFailureSound(audioLanguage, { exactLanguage: true });
      
      // Show failure message for 3 seconds, then allow retry
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 3000);
    }
  };

  // Restart demo
  const restartDemo = () => {
    setDemoStep('instruction1');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setShowSentence(false);
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
  const showSentenceDisplay = showSentence && (demoStep === 'showSentence' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4');
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4';
  
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
            <div className={`bg-blue-50 rounded-lg p-4 flex flex-col relative ${
              demoStep === 'complete' && completionCount >= 1 ? 'h-[420px]' : 'h-[500px]'
            }`}>
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                {/* Ready Button - Show initially */}
                {(demoStep === 'instruction1' || demoStep === 'waitForReady') && !showSentenceDisplay && (
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
                  <div
                    ref={readyButtonRef as React.RefObject<HTMLDivElement>}
                    className={`px-6 py-3 font-bold text-base rounded-full shadow-lg transition-all duration-300 ${
                      demoStep === 'waitForReady' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform ring-4 ring-blue-400 ring-opacity-50' 
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

                {/* Sentence Display - Show after ready click */}
                {(demoStep === 'showSentence' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions && (
                  <div className="flex flex-col items-center justify-center animate-fade-in space-y-4">
                    <div className="inline-block p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
                        {instructions.demo.sentence}
                      </div>
                    </div>
                  </div>
                )}

                {/* Options Grid - Show after instruction 3 */}
                {showOptions && (
                  <>
                    <FillInBlanksGameCore
                      currentQuestion={demoQuestion}
                      mode="preview"
                      selectedLanguage={contentLanguage}
                      selectedAnswer={selectedAnswer}
                      showFeedback={showFeedback}
                      isCorrect={isCorrectAnswer}
                      isPreview={true}
                      demoStep={demoStep}
                      showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                      disabled={demoStep !== 'waitForAnswer'}
                      onAnswerSelect={handleOptionClick}
                      onCheckAnswer={() => {}} // Empty function for preview
                      onContinue={() => {}} // Empty function for preview
                    />
                    
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

export default FillInBlanksGamePreview;
