import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  Clock,
  CheckCircle,
  Gamepad2,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import {
  playAudio,
  playTTS,
  playSuccessSound,
  playFailureSound,
  stopAllAudio,
  isAudioStopped,
  trackAudio,
  attachSlowLoadToast,
} from "../../utils/audioUtils";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import {
  LetterHuntGameCore,
  type LetterHuntQuestion,
} from "./LetterHuntGameCore";
import { setLocalData } from "../../../../../utils/constants";

interface LetterGamePreviewProps {
  onStartGame: () => void;
  onBack: () => void;
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedTime?: string;
  level?: number;
  hideHeader?: boolean;
}

type PreviewPhase = "countdown" | "demo" | "completion";

type DemoStep =
  | "instruction1" // Show instruction 1, play narration
  | "waitForSpeaker" // Show speaker icon, wait for user click
  | "instruction2" // After speaker clicked, show instruction 2, play narration
  | "instruction3" // After instruction 2, show instruction 3, play narration
  | "waitForAnswer" // Show options, wait for user to select
  | "wrongAnswer" // User selected wrong answer
  | "instruction4" // After correct answer, show final instruction
  | "complete"; // Demo run complete

const gameInstructions = {
  en: {
    title: "Letter Recognition",
    description: "Listen to the letter sound and find the matching letter!",
    steps: [
      "🔊 Click the speaker to hear the letter sound",
      "🎯 Click on the correct letter",
      "✨ Get points for correct answers!",
    ],
    instruction1: "Click the speaker icon to hear the letter sound",
    instruction2: "Listen carefully to the letter sound",
    instruction3: "Now, click on the matching letter from the options below",
    instruction4: "Great job! You've completed the demo successfully!",
    successMessage: "🎉 Correct!",
    failureMessage: "😢 Oops! Wrong!",
    narration1: "Click the speaker icon to hear the letter sound",
    narration2: "Listen carefully to the letter sound",
    narration3: "Now, click on the matching letter from the options below",
    narration4: "Great job! You've completed the demo successfully!",
    howToPlay: "How to Play",
    demo: {
      audio: "A",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "The sound 'A' matches the letter A!",
    },
  },
  te: {
    title: "అక్షర గుర్తింపు",
    description: "అక్షర ధ్వనిని విని సరిపోయే అక్షరాన్ని కనుగొనండి!",
    steps: [
      "🔊 స్పీకర్‌ను క్లిక్ చేసి అక్షర ధ్వనిని వినండి",
      "🎯 సరైన అక్షరాన్ని క్లిక్ చేయండి",
      "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!",
    ],
    instruction1: "అక్షర ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
    instruction2: "అక్షర ధ్వనిని జాగ్రత్తగా వినండి",
    instruction3:
      "ఇప్పుడు, క్రింది ఎంపికల నుండి సరిపోయే అక్షరంపై క్లిక్ చేయండి",
    instruction4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    successMessage: "🎉 సరైనది!",
    failureMessage: "😢 అయ్యో! తప్పు!",
    narration1: "అక్షర ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
    narration2: "అక్షర ధ్వనిని జాగ్రత్తగా వినండి",
    narration3: "ఇప్పుడు, క్రింది ఎంపికల నుండి సరిపోయే అక్షరంపై క్లిక్ చేయండి",
    narration4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
    howToPlay: "ఎలా ఆడాలి",
    demo: {
      audio: "అ",
      options: ["అ", "ఆ", "ఇ", "ఈ"],
      correctAnswer: "అ",
      explanation: "ధ్వని 'అ' అక్షరం 'అ'కు సరిపోతుంది!",
    },
  },
  kn: {
    title: "ಅಕ್ಷರ ಗುರುತಿಸುವಿಕೆ",
    description: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಿ ಸರಿಪೋಯುವ ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ!",
    steps: [
      "🔊 ಸ್ಪೀಕರ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಿ",
      "🎯 ಸರಿಯಾದ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!",
    ],
    instruction1: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction2: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ",
    instruction3: "ಈಗ, ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಿಂದ ಹೊಂದಿಕೆಯಾಗುವ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    instruction4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    successMessage: "🎉 ಸರಿಯಿದೆ!",
    failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
    narration1: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration2: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ",
    narration3: "ಈಗ, ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಿಂದ ಹೊಂದಿಕೆಯಾಗುವ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    howToPlay: "ಹೇಗೆ ಆಡುವುದು",
    demo: {
      audio: "ಅಂ",
      options: ["ಅಂ", "ಆ", "ಇ", "ಈ"],
      correctAnswer: "ಅಂ",
      explanation: "ಶಬ್ದ 'ಅಂ' ಅಕ್ಷರ 'ಅಂ'ಗೆ ಸರಿಪೋತುತ್ತದೆ!",
    },
  },
  mr: {
    title: "अक्षर ओळख",
    description: "अक्षर आवाज ऐकून जुळणारे अक्षर शोधा!",
    steps: [
      "🔊 स्पीकरवर क्लिक करून अक्षर आवाज ऐका",
      "🎯 योग्य अक्षरावर क्लिक करा",
      "✨ योग्य उत्तरांसाठी गुण मिळवा!",
    ],
    instruction1: "अक्षर आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
    instruction2: "अक्षर आवाज काळजीपूर्वक ऐका",
    instruction3: "आता, खालील पर्यायांमधून जुळणारे अक्षर क्लिक करा",
    instruction4: "छान केलं! तुम्ही डेमो यशस्वीपणे पूर्ण केला आहे!",
    successMessage: "🎉 बरोबर!",
    failureMessage: "😢 अरेच्या! चुकीचे!",
    narration1: "अक्षर आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
    narration2: "अक्षर आवाज काळजीपूर्वक ऐका",
    narration3: "आता, खालील पर्यायांमधून जुळणारे अक्षर क्लिक करा",
    narration4: "छान केलं! तुम्ही डेमो यशस्वीपणे पूर्ण केला आहे!",
    howToPlay: "कसे खेळायचे",
    demo: {
      audio: "अ",
      options: ["अ", "आ", "इ", "ई"],
      correctAnswer: "अ",
      explanation: "आवाज 'अ' अक्षर 'अ'शी जुळतो!",
    },
  },
  hi: {
    title: "अक्षर ओळख",
    description: "अक्षर आवाज ऐकून जुळणारे अक्षर शोधा!",
    steps: [
      "🔊 स्पीकरवर क्लिक करून अक्षर आवाज ऐका",
      "🎯 योग्य अक्षरावर क्लिक करा",
      "✨ योग्य उत्तरांसाठी गुण मिळवा!",
    ],
    demo: {
      audio: "अ",
      options: ["अ", "आ", "इ", "ई"],
      correctAnswer: "अ",
      explanation: "आवाज 'अ' अक्षर 'अ'शी जुळतो!",
    },
  },
};

export function LetterGamePreview({
  onStartGame,
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false,
}: LetterGamePreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>("countdown");
  const [demoStep, setDemoStep] = useState<DemoStep>("instruction1");
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedSpeaker, setHasClickedSpeaker] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);

  const speakerButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || "en";
  const contentLanguage = selectedLanguage || "en";
  const instructions = gameInstructions[contentLanguage];

  // Create demo question for preview
  const demoQuestion: LetterHuntQuestion = {
    target: instructions.demo.correctAnswer,
    options: instructions.demo.options,
    audio: instructions.demo.audio,
    audioText: instructions.demo.audio,
    language: contentLanguage,
    complexity: "easy",
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase("demo");
    setDemoStep("instruction1");
  };

  // Play narration using combined letter games audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn("Narration already playing, skipping...");
      return;
    }

    setIsPlayingNarration(true);

    // Use combined letter games audio files for Letter Hunt
    const gameName = "Combined Letter Games";
    const subGame = "Letter Hunt";

    try {
      await playAudio(
        {
          gameName,
          subGame,
          language: audioLanguage,
          type: "narration",
          step,
        },
        text
      );
    } catch (error) {
      console.warn("Audio playback failed, using TTS fallback:", error);
      // Stop any existing speech synthesis before starting new one
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      await playTTS(text, audioLanguage);
    }

    setIsPlayingNarration(false);
  };

  // Play audio sound from .wav files with TTS fallback (same as combined games)
  const playAudioSound = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Determine the correct audio path based on language
      let audioPath = "";
      if (contentLanguage === "te") {
        audioPath = `/audio/telugu/letter/${text}.wav`;
      } else if (contentLanguage === "kn") {
        audioPath = `/audio/kannada/letter/${text}.wav`;
      } else if (contentLanguage === "mr") {
        audioPath = `/audio/marathi/letter/${text}.wav`;
      } else {
        // Default to English for other languages
        audioPath = `/audio/english/letter/${text}.wav`;
      }

      const audio = new Audio(audioPath);

      // Track this audio instance
      trackAudio(audio);
      attachSlowLoadToast(audio);

      audio
        .play()
        .then(() => {
          // Wait for audio to finish playing
          audio.onended = () => {
            resolve();
          };
          audio.onerror = () => {
            console.warn(
              `Audio file not found: ${audioPath}, falling back to TTS`
            );
            // Fallback to TTS if .wav file doesn't exist
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang =
              contentLanguage === "te"
                ? "te-IN"
                : contentLanguage === "kn"
                ? "kn-IN"
                : contentLanguage === "mr"
                ? "mr-IN"
                : contentLanguage === "hi"
                ? "hi-IN"
                : "en-US";
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onend = () => {
              resolve();
            };

            if (!isAudioStopped()) {
              speechSynthesis.speak(utterance);
            } else {
              resolve();
            }
          };
        })
        .catch((error) => {
          console.warn(
            `Audio file not found: ${audioPath}, falling back to TTS`
          );
          // Fallback to TTS if .wav file doesn't exist
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang =
            contentLanguage === "te"
              ? "te-IN"
              : contentLanguage === "kn"
              ? "kn-IN"
              : contentLanguage === "mr"
              ? "mr-IN"
              : contentLanguage === "hi"
              ? "hi-IN"
              : "en-US";
          utterance.rate = 1.0;
          utterance.pitch = 1.0;

          utterance.onend = () => {
            resolve();
          };

          if (!isAudioStopped()) {
            speechSynthesis.speak(utterance);
          } else {
            resolve();
          }
        });
    });
  };

  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case "instruction1":
      case "waitForSpeaker":
        setCurrentStep(0);
        break;
      case "instruction3":
      case "waitForAnswer":
        setCurrentStep(1);
        break;
      case "instruction4":
      case "complete":
        setCurrentStep(2);
        break;
    }
  }, [demoStep]);

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (demoStep === "instruction1" && previewPhase === "demo") {
      playNarration(instructions.narration1, 1);
      setHasClickedSpeaker(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [demoStep, previewPhase, instructions.narration1]);

  // When instruction 1 narration finishes, move to waitForSpeaker
  useEffect(() => {
    if (demoStep === "instruction1" && !isPlayingNarration) {
      const timer = setTimeout(() => {
        setDemoStep("waitForSpeaker");
        // Focus on speaker button after a brief delay
        setTimeout(() => {
          speakerButtonRef.current?.focus();
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration]);

  // Handle speaker button click
  const handleSpeakerClick = async () => {
    if (demoStep !== "waitForSpeaker" || hasClickedSpeaker) return;

    setHasClickedSpeaker(true);

    // Play the demo audio using the same logic as the core component
    await playAudioSound(instructions.demo.audio);

    // Wait a moment for the audio to play, then show instruction3
    setTimeout(async () => {
      setDemoStep("instruction3");
      await playNarration(instructions.narration3, 3);

      setDemoStep("waitForAnswer");

      setTimeout(() => {
        optionsRef.current?.focus();
      }, 100);
    }, 1500);
  };

  // Handle option click
  const handleOptionClick = async (option: string) => {
    if (demoStep !== "waitForAnswer" || showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);

    const isCorrect = option === instructions.demo.correctAnswer;
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      // Play success sound
      await playSuccessSound(audioLanguage, { exactLanguage: true });

      // Show instruction 4 and play its narration
      setDemoStep("instruction4");
      await playNarration(instructions.narration4, 4);

      // Mark demo run as complete and increment completion count
      const newSuccessfulRuns = successfulRuns + 1;
      setSuccessfulRuns(newSuccessfulRuns);
      const newCompletionCount = completionCount + 1;
      setCompletionCount(newCompletionCount);

      // Wait a moment, then show completion screen after first successful run
      setTimeout(() => {
        setHasCompletedFirstCycle(true);
        setPreviewPhase("completion");
      }, 2000);
    } else {
      // Play failure sound first, then feedback message audio will play after
      // The feedback audio is handled by LetterHuntGameCore component
      // We reset feedback UI only after feedback audio completes (via onFeedbackAudioComplete callback)
      await playFailureSound(audioLanguage, { exactLanguage: true });
      // Note: Feedback UI reset happens in onFeedbackAudioComplete callback (see LetterHuntGameCore usage below)
    }
  };

  // Restart demo (for second run or Help replay)
  const restartDemo = () => {
    setDemoStep("instruction1");
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedSpeaker(false);
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

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Show speaker icon - always visible but disabled initially
  const showSpeaker =
    demoStep === "waitForSpeaker" ||
    demoStep === "instruction1" ||
    demoStep === "instruction3" ||
    demoStep === "waitForAnswer" ||
    demoStep === "instruction4" ||
    demoStep === "complete";

  // Show options only after instruction 3
  const showOptions =
    demoStep === "waitForAnswer" ||
    demoStep === "instruction4" ||
    demoStep === "complete";

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
    setPreviewPhase("countdown");
  };

  // Render completion phase
  if (previewPhase === "completion") {
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
  if (previewPhase === "countdown") {
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
                {contentLanguage === "en"
                  ? "Back"
                  : contentLanguage === "te"
                  ? "వెనుకకు"
                  : contentLanguage === "kn"
                  ? "ಹಿಂದಕ್ಕೆ"
                  : "मागे"}
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
            <div className="flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0">
              {/* Back button removed */}
              <div className="text-center flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                  {instructions.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>
                    {contentLanguage === "en"
                      ? "Level"
                      : contentLanguage === "te"
                      ? "స్థాయి"
                      : contentLanguage === "kn"
                      ? "ಮಟ್ಟ"
                      : "पातळी"}{" "}
                    {level} • {difficulty.toLowerCase()} • {estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col rounded-2xl min-h-0">
            {/* How to Play Section - Centered */}
            <div className="flex flex-col items-center mb-1.5 sm:mb-2 px-2">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 text-white" />
                </div>
                <h2 className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-800 whitespace-nowrap">
                  {instructions.howToPlay}
                </h2>
              </div>
              <Progress
                value={((currentStep + 1) / instructions.steps.length) * 100}
                className="h-0.5 sm:h-1 w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] mt-0.5"
              />
            </div>

            {/* Demo Panel - Full width */}
            <div className="flex-1 overflow-hidden">
              <LetterHuntGameCore
                questions={[demoQuestion]}
                currentQuestionIndex={0}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                isCorrect={isCorrectAnswer}
                mode="preview"
                onAnswerSelect={handleOptionClick}
                onContinue={() => {}} // No continue in preview
                onSpeakerClick={handleSpeakerClick}
                onFeedbackAudioComplete={() => {
                  /**
                   * Callback: Called when feedback audio sequence completes
                   * This ensures UI resets only after full feedback message audio finishes playing
                   * Sequence: failure sound → feedback1 ("chosen letter is") → selected letter → feedback2 ("try again")
                   */
                  setShowFeedback(false);
                  setSelectedAnswer(null);
                }}
                showSpeaker={showSpeaker}
                showContinueButton={false}
                showProgress={false}
                isPreview={true}
                demoStep={demoStep}
                hasClickedSpeaker={hasClickedSpeaker}
                speakerButtonRef={speakerButtonRef}
                optionsRef={optionsRef}
                showHandPointer={
                  showOptions && demoStep === "waitForAnswer" && !showFeedback
                }
                disabled={demoStep !== "waitForAnswer" || showFeedback}
                className="bg-transparent shadow-none border-0 p-0 h-full"
                audioLanguageOverride={audioLanguage}
              />
            </div>

            {/* Bottom Section - Fixed Buttons */}
            <div className="flex justify-between items-center gap-4 mt-auto flex-shrink-0">
              {/* Skip Demo Button - Bottom Left */}
              <Button
                onClick={handleSkipDemo}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                {contentLanguage === "en"
                  ? "Skip Demo"
                  : contentLanguage === "te"
                  ? "డెమో స్కిప్ చేయండి"
                  : contentLanguage === "kn"
                  ? "ಡೆಮೊವನ್ನು ಸ್ಕಿಪ್ ಮಾಡಿ"
                  : "डेमो वगळा"}
              </Button>

              {/* Start Game Button - Bottom Right */}
              <Button
                onClick={handleStartGame}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                <Gamepad2 className="h-7 w-4 mr-2" />
                {contentLanguage === "en"
                  ? "Start Game"
                  : contentLanguage === "te"
                  ? "గేమ్ ప్రారంభించండి"
                  : contentLanguage === "kn"
                  ? "ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸಿ"
                  : "गेम सुरू करा"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
