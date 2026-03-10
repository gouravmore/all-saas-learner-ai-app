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
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio, attachSlowLoadToast } from "../../utils/audioUtils";
import { ROARPhonemeGameCore, type ROARPhonemeQuestion } from "./ROARPhonemeGameCore";

interface ROARPhonemeGamePreviewProps {
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
  | 'waitForSpeaker'    // Wait for user to click speaker
  | 'showTarget'        // Show target image after speaker click
  | 'instruction2'      // After showing target, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

const gameInstructions = {
  en: {
    title: "Sound Match",
    description: "Match sounds with pictures that start with the same letter!",
    steps: [
      "🔊 Click the speaker to hear the sound",
      "👀 Look at the target picture shown",
      "🎯 Find the word that starts with the same letter",
      "✨ Click the correct option!"
    ],
    instruction1: "Click the speaker icon to hear a word sound",
    instruction2: "Good! Now look at this target picture carefully",
    instruction3: "Now find which picture starts with the same letter sound",
    instruction4: "Perfect! You matched the sounds correctly!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Click the speaker icon to hear a word sound",
    narration2: "Good! Now look at this target picture carefully",
    narration3: "Now find which picture starts with the same letter sound",
    narration4: "Perfect! You matched the sounds correctly!",
    howToPlay: "How to Play",
    findMatchingSound: "Find the matching sound!",
    demo: {
      target: "🍞",
      targetSound: "BREAD",
      options: ["🍊", "🚲", "4️⃣", "🦵"],
      correctIndex: 1,
      explanation: "BREAD starts with 'B' and BICYCLE also starts with 'B'!"
    }
  },
  te: {
    title: "ధ్వని మ్యాచ్",
    description: "అదే అక్షరంతో ప్రారంభమయ్యే ధ్వనులు మరియు చిత్రాలను సరిపోల్చండి!",
    steps: [
      "🔊 స్పీకర్‌ను క్లిక్ చేసి ధ్వనిని వినండి",
      "👀 చూపించిన లక్ష్య చిత్రాన్ని చూడండి",
      "🎯 అదే అక్షరంతో మొదలయ్యే పదాన్ని కనుగొనండి",
      "✨ సరైన ఎంపికను క్లిక్ చేయండి!"
    ],
    instruction1: "పద ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
    instruction2: "మంచిది! ఇప్పుడు ఈ లక్ష్య చిత్రాన్ని జాగ్రత్తగా చూడండి",
    instruction3: "ఇప్పుడు ఏ చిత్రం అదే అక్షర ధ్వనితో ప్రారంభమవుతుందో కనుగొనండి",
    instruction4: "పర్ఫెక్ట్! మీరు ధ్వనులను సరిగ్గా సరిపోల్చారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "పద ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
    narration2: "మంచిది! ఇప్పుడు ఈ లక్ష్య చిత్రాన్ని జాగ్రత్తగా చూడండి",
    narration3: "ఇప్పుడు ఏ చిత్రం అదే అక్షర ధ్వనితో ప్రారంభమవుతుందో కనుగొనండి",
    narration4: "పర్ఫెక్ట్! మీరు ధ్వనులను సరిగ్గా సరిపోల్చారు!",
    howToPlay: "ఎలా ఆడాలి",
    findMatchingSound: "సరిపోయే ధ్వనిని కనుగొనండి!",
    demo: {
      target: "🐦",
      targetSound: "పక్షి",
      options: ["📚", "🚀", "👕", "🎈"],
      correctIndex: 0,
      explanation: "పక్షి 'ప' అక్షరంతో మొదలవుతుంది మరియు పుస్తకం కూడా 'ప' అక్షరంతో మొదలవుతుంది!"
    }
  },
  kn: {
    title: "ಶಬ್ದ ಹೊಂದಾಣಿಕೆ",
    description: "ಅದೇ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುವ ಶಬ್ದಗಳು ಮತ್ತು ಚಿತ್ರಗಳನ್ನು ಹೊಂದಿಸಿ!",
    steps: [
      "🔊 ಸ್ಪೀಕರ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಶಬ್ದವನ್ನು ಕೇಳಿ",
      "👀 ತೋರಿಸಲಾದ ಗುರಿ ಚಿತ್ರವನ್ನು ನೋಡಿ",
      "🎯 ಅದೇ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುವ ಪದವನ್ನು ಹುಡುಕಿ",
      "✨ ಸರಿಯಾದ ಆಯ್ಕೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!"
    ],
    instruction1: "ಪದ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗುರಿ ಚಿತ್ರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
    instruction3: "ಈಗ ಯಾವ ಚಿತ್ರ ಅದೇ ಅಕ್ಷರ ಶಬ್ದದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಎಂದು ಹುಡುಕಿ",
    instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಶಬ್ದಗಳನ್ನು ಸರಿಯಾಗಿ ಹೊಂದಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    narration1: "ಪದ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗುರಿ ಚಿತ್ರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
    narration3: "ಈಗ ಯಾವ ಚಿತ್ರ ಅದೇ ಅಕ್ಷರ ಶಬ್ದದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಎಂದು ಹುಡುಕಿ",
    narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಶಬ್ದಗಳನ್ನು ಸರಿಯಾಗಿ ಹೊಂದಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    findMatchingSound: "ಹೊಂದಾಣಿಕೆಯ ಶಬ್ದವನ್ನು ಹುಡುಕಿ!",
    demo: {
      target: "🐦",
      targetSound: "ಪಕ್ಷಿ",
      options: ["📚", "🚀", "👕", "🎈"],
      correctIndex: 0,
      explanation: "ಪಕ್ಷಿ 'ಪ' ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಮತ್ತು ಪುಸ್ತಕ ಕೂಡ 'ಪ' ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ!"
    }
  },
    mr: {
    title: "आवाज जुळवा",
    description: "तोच अक्षराने सुरू होणारे आवाज आणि चित्रे जुळवा!",
    steps: [
      "🔊 स्पीकरवर क्लिक करून आवाज ऐका",
      "👀 दाखवलेले लक्ष्य चित्र पहा",
      "🎯 तोच अक्षराने सुरू होणारे शब्द शोधा",
      "✨ योग्य पर्यायावर क्लिक करा!"
    ],
    instruction1: "शब्द आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
    instruction2: "चांगले! आता हे लक्ष्य चित्र काळजीपूर्वक पहा",
    instruction3: "आता कोणते चित्र तोच अक्षर आवाजाने सुरू होते ते शोधा",
    instruction4: "उत्कृष्ट! तुम्ही आवाज योग्यरित्या जुळवले!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "शब्द आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
    narration2: "चांगले! आता हे लक्ष्य चित्र काळजीपूर्वक पहा",
    narration3: "आता कोणते चित्र तोच अक्षर आवाजाने सुरू होते ते शोधा",
    narration4: "उत्कृष्ट! तुम्ही आवाज योग्यरित्या जुळवले!",
    howToPlay: "कसे खेळायचे",
    findMatchingSound: "जुळणारा आवाज शोधा!",
    demo: {
      target: "🍎",
      targetSound: "सफरचंद",
      options: ["☀️", "🚀", "👕", "📚"],
      correctIndex: 0,
      explanation: "सफरचंद 'स' अक्षराने सुरू होतो आणि सूर्य देखील 'स' अक्षराने सुरू होतो!"
    }
  }
};

export function ROARPhonemeGamePreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: ROARPhonemeGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('countdown');
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedSpeaker, setHasClickedSpeaker] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  
  const speakerButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];

  // Create demo question object for ROARPhonemeGameCore
  const getDemoOptions = () => {
    const lang = contentLanguage;
    if (lang === 'te') {
      // Telugu: పక్షి (bird) matches with 📚 (పుస్తకం - book)
      return [
        { image: "📚", word: "పుస్తకం", phoneme: "ప" }, // Book - correct match
        { image: "🚀", word: "రాకెట్", phoneme: "ర" }, // Rocket
        { image: "👕", word: "చొక్కా", phoneme: "చ" }, // Shirt
        { image: "🎈", word: "బలూన్", phoneme: "బ" } // Balloon
      ];
    } else if (lang === 'kn') {
      // Kannada: ಪಕ్షಿ (bird) matches with 📚 (ಪುಸ್ತಕ - book)
      return [
        { image: "📚", word: "ಪುಸ್ತಕ", phoneme: "ಪ" }, // Book - correct match
        { image: "🚀", word: "ರಾಕೆಟ್", phoneme: "ರ" }, // Rocket
        { image: "👕", word: "ಅಂಗಿ", phoneme: "ಅ" }, // Shirt
        { image: "🎈", word: "ಬಲೂನ್", phoneme: "ಬ" } // Balloon
      ];
    } else if (lang === 'mr') {
      // Marathi: सफरचंद (apple) matches with ☀️ (सूर्य - sun)
      return [
        { image: "☀️", word: "सूर्य", phoneme: "स" }, // Sun - correct match (both start with स)
        { image: "🚀", word: "रॉकेट", phoneme: "र" }, // Rocket
        { image: "👕", word: "शर्ट", phoneme: "श" }, // Shirt
        { image: "📚", word: "पुस्तक", phoneme: "प" } // Book
      ];
    } else {
      // English: BREAD matches with BICYCLE
      return [
        { image: "🍊", word: "ORANGE", phoneme: "O" }, // Orange
        { image: "🚲", word: "BICYCLE", phoneme: "B" }, // Bicycle - correct match
        { image: "4️⃣", word: "FOUR", phoneme: "F" }, // Four
        { image: "🦵", word: "LEG", phoneme: "L" } // Leg
      ];
    }
  };

  const demoQuestion: ROARPhonemeQuestion = {
    target: {
      image: instructions.demo.target,
      word: instructions.demo.targetSound,
      phoneme: instructions.demo.targetSound.charAt(0).toUpperCase() // First letter as phoneme
    },
    options: getDemoOptions(),
    audio: instructions.demo.targetSound,
    complexity: 'easy'
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
    
    // Use combined word games audio files for Sound Match
    const gameName = 'Combined Word Games';
    const subGame = 'Sound Match';
    
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

  // Play word sound - tries audio files first, then TTS
  const playWordSound = async (text: string) => {
    const language = contentLanguage;
    
    // Try to play audio file from sound-match folder first
    const word = text.toLowerCase().trim();
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
    
    // Fallback to TTS
    const utterance = new SpeechSynthesisUtterance(text);
    const langForTTS = language as Language;
    utterance.lang = langForTTS === 'te' ? 'te-IN' : 
                    langForTTS === 'kn' ? 'kn-IN' : 
                    langForTTS === 'mr' ? 'mr-IN' : 
                    langForTTS === 'hi' ? 'hi-IN' : 'en-US';
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
      case 'waitForSpeaker':
        setCurrentStep(0);
        break;
      case 'showTarget':
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
      setHasClickedSpeaker(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowTarget(false);
    }
  }, [demoStep, previewPhase, instructions.narration1]);

  // When instruction 1 narration finishes, move to waitForSpeaker
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
      const timer = setTimeout(() => {
        setDemoStep('waitForSpeaker');
        setTimeout(() => {
          speakerButtonRef.current?.focus();
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration]);

  // Handle speaker button click
  const handleSpeakerClick = async () => {
    if (demoStep !== 'waitForSpeaker' || hasClickedSpeaker) return;
    
    setHasClickedSpeaker(true);
    playWordSound(instructions.demo.targetSound);
    
    // Show target image
    setShowTarget(true);
    setDemoStep('showTarget');
    
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
    setHasClickedSpeaker(false);
    setShowTarget(false);
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

  const showSpeaker = demoStep === 'waitForSpeaker' || demoStep === 'showTarget' || demoStep === 'instruction1' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  
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
            <div className="bg-blue-50 rounded-lg p-6 flex flex-col relative h-[420px]">
              {/* Fixed Layout Structure */}
              <div className="flex flex-col h-full justify-center">
                {/* Speaker Button Section - Always visible but disabled initially */}
                {(demoStep === 'instruction1' || demoStep === 'waitForSpeaker') && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="mb-3 sm:mb-4">
                      <div 
                        className={`inline-block p-2 sm:p-3 rounded-lg cursor-pointer transition-all transform ${
                        demoStep === 'waitForSpeaker' 
                            ? 'bg-blue-100 hover:bg-blue-200 hover:scale-110 ring-4 ring-blue-400 ring-opacity-50 animate-pulse' 
                          : demoStep === 'instruction1'
                          ? 'bg-gray-100 cursor-not-allowed opacity-50'
                            : 'bg-blue-100 hover:bg-blue-200 hover:scale-110'
                      }`}
                      onClick={demoStep === 'waitForSpeaker' ? handleSpeakerClick : undefined}
                      tabIndex={demoStep === 'waitForSpeaker' ? 0 : -1}
                    >
                        <span className="text-xl sm:text-2xl">🔊</span>
                      </div>
                    </div>
                    {demoStep === 'waitForSpeaker' && (
                      <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                        <span className="text-xl">👆</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Target Display - Show after speaker click */}
                {(demoStep === 'showTarget' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions && (
                  <div className="flex flex-col items-center justify-center animate-fade-in">
                    <div className="inline-block p-6 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="text-5xl sm:text-6xl">{instructions.demo.target}</div>
                    </div>
                  </div>
                )}

                {/* Options Grid - Show after instruction 3 */}
                {showOptions && (
                  <ROARPhonemeGameCore
                    currentQuestion={demoQuestion}
                    mode="preview"
                    selectedLanguage={contentLanguage || 'en'}
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

export default ROARPhonemeGamePreview;
