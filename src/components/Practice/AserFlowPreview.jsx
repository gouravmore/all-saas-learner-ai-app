import { useState, useRef } from "react";
import {
  getLocalData,
  RetryIcon,
  NextButtonRound,
} from "../../utils/constants";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import { Sparkles } from "lucide-react";
import { Progress } from "../../lib/axl-explorations/src/components/ui/progress";
import AserFlow from "./AserFlow";

const demoInstructions = {
  en: {
    narration1:
      "Welcome to Letter Hunt! Click the speaker button to hear the letter sound.",
    narration2: "Listen carefully to the letter sound",
    narration3: "Now click on the bubble with the correct letter",
    narration4: "Great job! You found the letter!",
    skipDemo: "Skip Demo",
    startGame: "Start Game",
    howToPlay: "How to Play",
  },
  te: {
    narration1:
      "లెటర్ హంట్‌కు స్వాగతం! అక్షర ధ్వనిని వినడానికి స్పీకర్ బటన్‌పై క్లిక్ చేయండి.",
    narration2: "అక్షర ధ్వనిని జాగ్రత్తగా వినండి",
    narration3: "ఇప్పుడు సరైన అక్షరం ఉన్న బబుల్‌పై క్లిక్ చేయండి",
    narration4: "బాగా చేసారు! మీరు అక్షరాన్ని కనుగొన్నారు!",
    skipDemo: "డెమోను దాటవేయండి",
    startGame: "ఆట ప్రారంభించండి",
    howToPlay: "ఎలా ఆడాలి",
  },
  kn: {
    narration1:
      "ಲೆಟರ್ ಹಂಟ್‌ಗೆ ಸ್ವಾಗತ! ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    narration2: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ",
    narration3: "ಈಗ ಸರಿಯಾದ ಅಕ್ಷರವಿರುವ ಬಬಲ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration4: "ಅದ್ಭುತ! ನೀವು ಅಕ್ಷರವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
    skipDemo: "ಡೆಮೊವನ್ನು ಬಿಟ್ಟುಬಿಡಿ",
    startGame: "ಆಟ ಪ್ರಾರಂಭಿಸಿ",
    howToPlay: "ಹೇಗೆ ಆಡಬೇಕು",
  },
  mr: {
    narration1:
      "लेटर हंटमध्ये स्वागत आहे! अक्षर आवाज ऐकण्यासाठी स्पीकर बटणावर क्लिक करा.",
    narration2: "अक्षर आवाज काळजीपूर्वक ऐका",
    narration3: "आता योग्य अक्षर असलेल्या बुडबुड्यावर क्लिक करा",
    narration4: "छान केलं! तुम्हाला अक्षर सापडले!",
    skipDemo: "डेमो वगळा",
    startGame: "खेळ सुरू करा",
    howToPlay: "कसे खेळायचे",
  },
  hi: {
    narration1:
      "लेटर हंट में आपका स्वागत है! अक्षर की ध्वनि सुनने के लिए स्पीकर बटन पर क्लिक करें।",
    narration2: "अक्षर की ध्वनि ध्यान से सुनें",
    narration3: "अब सही अक्षर वाले बुलबुले पर क्लिक करें",
    narration4: "बहुत बढ़िया! आपने अक्षर ढूंढ लिया!",
    skipDemo: "डेमो छोड़ें",
    startGame: "खेल शुरू करें",
    howToPlay: "कैसे खेलें",
  },
  gu: {
    narration1:
      "લેટર હંટમાં આપનું સ્વાગત છે! અક્ષર ધ્વનિ સાંભળવા માટે સ્પીકર બટન પર ક્લિક કરો.",
    narration2: "અક્ષર ધ્વનિ ધ્યાનથી સાંભળો",
    narration3: "હવે સાચા અક્ષર સાથેના બબલ પર ક્લિક કરો",
    narration4: "ખૂબ સરસ! તમે અક્ષર શોધી કાઢ્યું!",
    skipDemo: "ડેમો છોડો",
    startGame: "રમત શરૂ કરો",
    howToPlay: "કેવી રીતે રમવું",
  },
  ta: {
    narration1:
      "லெட்டர் ஹன்ட் வரவேற்கிறது! எழுத்து ஒலியைக் கேட்க ஸ்பீக்கர் பொத்தானைக் கிளிக் செய்யவும்.",
    narration2: "எழுத்து ஒலியை கவனமாகக் கேளுங்கள்",
    narration3: "இப்போது சரியான எழுத்து உள்ள குமிழியைக் கிளிக் செய்யவும்",
    narration4: "அருமை! நீங்கள் எழுத்தைக் கண்டுபிடித்தீர்கள்!",
    skipDemo: "டெமோவைத் தவிர்க்கவும்",
    startGame: "விளையாட்டைத் தொடங்கவும்",
    howToPlay: "எப்படி விளையாடுவது",
  },
  or: {
    narration1:
      "ଲେଟର ହଣ୍ଟକୁ ସ୍ୱାଗତ! ଅକ୍ଷର ଧ୍ବନି ଶୁଣିବା ପାଇଁ ସ୍ପିକର ବଟନ୍ କ୍ଲିକ କରନ୍ତୁ।",
    narration2: "ଅକ୍ଷର ଧ୍ବନି ଧ୍ୟାନରେ ଶୁଣନ୍ତୁ",
    narration3: "ବର୍ତ୍ତମାନ ସଠିକ୍ ଅକ୍ଷର ଥିବା ବବୁଲ୍ କ୍ଲିକ୍ କରନ୍ତୁ",
    narration4: "ବହୁତ ଭଲ! ଆପଣ ଅକ୍ଷର ଖୋଜିଲେ!",
    skipDemo: "ଡେମୋ ଛାଡନ୍ତୁ",
    startGame: "ଖେଳ ଆରମ୍ଭ କରନ୍ତୁ",
    howToPlay: "କିପରି ଖେଳିବେ",
  },
};

const AserFlowPreview = ({ onStartGame, onBack }) => {
  const [demoPhase, setDemoPhase] = useState("countdown");
  const [demoStep, setDemoStep] = useState("waitForSpeaker"); // "waitForSpeaker", "speakerClicked", "waitForLetter", "bubbleClicked"
  const [currentDemoStep, setCurrentDemoStep] = useState(1); // Track demo step progress (1, 2, or 3)
  const [showPointer, setShowPointer] = useState(false);
  const [pointerTarget, setPointerTarget] = useState(""); // "speaker" or "letter"
  const [isInstructionPlaying, setIsInstructionPlaying] = useState(false);
  const [hasClickedSpeaker, setHasClickedSpeaker] = useState(false);
  const [hasClickedBubble, setHasClickedBubble] = useState(false);
  const [blockGameProgression, setBlockGameProgression] = useState(true); // Block until correct answer
  const [gameKey, setGameKey] = useState(0); // Key to force remount of AserFlow
  const [disableSpeaker, setDisableSpeaker] = useState(true); // Disable speaker initially
  const [disableBubbles, setDisableBubbles] = useState(true); // Disable bubbles initially
  const instructionAudioRef = useRef(null); // Ref to store current instruction audio

  const language = getLocalData("lang") || "en";
  const instructions = demoInstructions[language] || demoInstructions.en;
  const TOTAL_DEMO_STEPS = 3;

  const handleCountdownComplete = () => {
    setDemoPhase("demo");
    setDemoStep("waitForSpeaker");
    setCurrentDemoStep(1); // Step 1: Listen to instruction
    setTimeout(async () => {
      await playInstruction(instructions.narration1, 1);
      // After instruction, enable ONLY speaker (bubbles still disabled)
      setDisableSpeaker(false);
      setShowPointer(true);
      setPointerTarget("speaker");
    }, 1000);
  };

  const handleSpeakerClick = async () => {
    // Only show instructions/pointer on first speaker click
    if (hasClickedSpeaker || disableSpeaker) return;

    setHasClickedSpeaker(true);
    setShowPointer(false);
    setDisableSpeaker(true); // Disable speaker again
    setDemoStep("speakerClicked");
    setCurrentDemoStep(2); // Step 2: Listen to letter sound

    // Show instruction to click bubble (after natural game audio plays)
    setTimeout(async () => {
      await playInstruction(instructions.narration3, 3);
      // After instruction, enable BOTH bubbles and speaker (so user can replay audio)
      setDisableBubbles(false);
      setDisableSpeaker(false); // Re-enable speaker so user can replay letter audio
      setDemoStep("waitForLetter");
      // Don't show pointer for bubble selection
    }, 2000); // Wait for letter sound to play
  };

  const handleBubbleClick = async (letter, index, isCorrect) => {
    // If user already completed the demo or bubbles are disabled, don't do anything
    if (hasClickedBubble || disableBubbles) return;

    // If the answer is WRONG, let them try again (no pointer)
    if (!isCorrect) {
      return;
    }

    // Answer is CORRECT - unblock progression and proceed to completion
    setBlockGameProgression(false); // Allow game to progress now
    setHasClickedBubble(true);
    setShowPointer(false);
    setDisableBubbles(true); // Disable bubbles after correct click
    setDemoStep("bubbleClicked");
    setCurrentDemoStep(3); // Step 3: Select correct letter

    // Show completion screen after normal game feedback
    setTimeout(async () => {
      await playInstruction(instructions.narration4, 4);
      setTimeout(() => {
        setDemoPhase("completion");
      }, 1000);
    }, 1500); // Wait for correct sound
  };

  const playInstruction = (text, step) => {
    // Stop any currently playing instruction audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }

    setIsInstructionPlaying(true);

    return new Promise((resolve) => {
      // Build S3 audio path: /audio/audio-preview/combined-letter-games/letter-hunt/{language}/narration{step}.wav
      // const audioPath = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL || ''}/audio/audio-preview/combined-letter-games/letter-hunt/${language}/narration${step}.wav`;
      const audioPath = `/audio/audio-preview/letter-hunt/${language}/narration${step}.wav`;
      const audio = new Audio(audioPath);
      instructionAudioRef.current = audio; // Store audio reference

      audio.onended = () => {
        setIsInstructionPlaying(false);
        instructionAudioRef.current = null;
        resolve();
      };

      audio.onerror = () => {
        console.error(`Audio file not found at ${audioPath}`);
        setIsInstructionPlaying(false);
        instructionAudioRef.current = null;
        resolve();
      };

      audio.play().catch((error) => {
        console.error(`Audio playback failed: ${error}`);
        setIsInstructionPlaying(false);
        instructionAudioRef.current = null;
        resolve();
      });
    });
  };

  const handleStartGameClick = () => {
    // Stop any playing instruction audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);
    onStartGame();
  };

  const handleReplayDemo = () => {
    setDemoPhase("countdown");
    setDemoStep("waitForSpeaker");
    setCurrentDemoStep(1); // Reset to step 1
    setShowPointer(false);
    setPointerTarget("");
    setHasClickedSpeaker(false);
    setHasClickedBubble(false);
    setBlockGameProgression(true); // Block progression again for replay
    setDisableSpeaker(true); // Reset to disabled
    setDisableBubbles(true); // Reset to disabled
    setGameKey((prev) => prev + 1); // Force remount of AserFlow to reset all game state
  };

  const handleSkipDemo = () => {
    // Stop any playing instruction audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);
    onStartGame();
  };

  const handleBack = () => {
    // Stop any playing instruction audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);
    onBack();
  };

  const completionMessages = {
    en: {
      title: "Demo Complete!",
      message: "Great job! You're ready to start hunting letters.",
      replayText: "Replay",
      continueText: "Continue",
    },
    te: {
      title: "డెమో పూర్తయింది!",
      message: "బాగా చేసారు! మీరు లెటర్ల వేటకు సిద్ధంగా ఉన్నారు.",
      replayText: "మళ్లీ ప్లే చేయండి",
      continueText: "కొనసాగించు",
    },
    kn: {
      title: "ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ!",
      message: "ಅದ್ಭುತ! ನೀವು ಅಕ್ಷರಗಳನ್ನು ಹುಡುಕಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ.",
      replayText: "ಮರುಪ್ಲೇ",
      continueText: "ಮುಂದುವರಿಸಿ",
    },
    mr: {
      title: "डेमो पूर्ण झाला!",
      message: "छान केलं! तुम्ही अक्षरांची शिकार सुरू करण्यास तयार आहात.",
      replayText: "पुन्हा प्ले करा",
      continueText: "पुढे चला",
    },
    hi: {
      title: "डेमो पूर्ण हुआ!",
      message: "बहुत बढ़िया! आप अक्षरों की खोज शुरू करने के लिए तैयार हैं।",
      replayText: "फिर से प्ले करें",
      continueText: "जारी रखें",
    },
    gu: {
      title: "ડેમો પૂર્ણ થયું!",
      message: "ખૂબ સરસ! તમે અક્ષરોની શોધ શરૂ કરવા તૈયાર છો.",
      replayText: "ફરીથી પ્લે કરો",
      continueText: "ચાલુ રાખો",
    },
    ta: {
      title: "டெமோ முடிந்தது!",
      message:
        "நன்றாக செய்தீர்கள்! நீங்கள் எழுத்துக்களை வேட்டையாட தயாராக உள்ளீர்கள்.",
      replayText: "மீண்டும் இயக்கு",
      continueText: "தொடர்க",
    },
    or: {
      title: "ଡେମୋ ସମ୍ପୂର୍ଣ୍ଣ!",
      message: "ବହୁତ ଭଲ! ଆପଣ ଅକ୍ଷର ଶିକାର ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ।",
      replayText: "ପୁନର୍ବାର ପ୍ଲେ କରନ୍ତୁ",
      continueText: "ଜାରି ରଖନ୍ତୁ",
    },
  };

  const messages = completionMessages[language] || completionMessages.en;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Actual AserFlow Component */}
      <AserFlow
        key={gameKey}
        isDemo={true}
        handleBack={handleBack}
        onSpeakerClick={handleSpeakerClick}
        onBubbleClick={handleBubbleClick}
        disableSpeaker={disableSpeaker}
        disableBubbles={disableBubbles}
        hideContentDuringDemo={demoPhase === "countdown"}
        blockProgression={blockGameProgression}
        hideProgress={true}
      />

      {/* "How to Play" Progress Indicator */}
      {demoPhase === "demo" && (
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px 24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-800">
                {instructions.howToPlay}
              </h2>
            </div>
            <Progress
              value={(currentDemoStep / 3) * 100}
              className="h-1.5 w-64"
            />
          </div>
        </div>
      )}

      {/* Countdown Timer Overlay - Inside the UI */}
      {demoPhase === "countdown" && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            backgroundColor: "transparent",
          }}
        >
          <CountdownTimer onComplete={handleCountdownComplete} />
        </div>
      )}

      {/* Demo Control Buttons - Inside White Container */}
      {demoPhase === "demo" && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "space-between",
            width: "calc(100% - 280px)", // Account for sidebar
            maxWidth: "1200px",
            padding: "0 40px",
          }}
        >
          {/* Skip Demo Button */}
          <button
            onClick={handleSkipDemo}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
          >
            {instructions.skipDemo}
          </button>

          {/* Start Game Button */}
          <button
            onClick={handleStartGameClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
          >
            {instructions.startGame}
          </button>
        </div>
      )}

      {/* Pointer - Only for speaker button */}
      {showPointer &&
        demoPhase === "demo" &&
        !isInstructionPlaying &&
        pointerTarget === "speaker" && (
          <div
            style={{
              position: "absolute",
              bottom: "130px",
              left: "calc(50% - 35px)",
              zIndex: 10000,
              fontSize: "64px",
              animation:
                "pointToButton 1.5s ease-in-out infinite, bounce 1s ease-in-out infinite",
              pointerEvents: "none",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
            }}
          >
            👇
          </div>
        )}

      {/* Completion Screen */}
      {demoPhase === "completion" && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 15000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              textAlign: "center",
              animation: "slideUp 0.4s ease-out",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎉</div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1E40AF",
                marginBottom: "12px",
                fontFamily: "Quicksand",
              }}
            >
              {messages.title}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#6B7280",
                marginBottom: "30px",
                lineHeight: "1.6",
              }}
            >
              {messages.message}
            </p>
            <div
              style={{
                display: "flex",
                gap: "40px",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <div
                onClick={isInstructionPlaying ? null : handleReplayDemo}
                style={{
                  cursor: isInstructionPlaying ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isInstructionPlaying ? 0.5 : 1,
                  pointerEvents: isInstructionPlaying ? "none" : "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isInstructionPlaying) {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isInstructionPlaying) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <RetryIcon />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    fontWeight: "500",
                  }}
                >
                  {messages.replayText}
                </span>
              </div>
              <div
                onClick={isInstructionPlaying ? null : handleStartGameClick}
                style={{
                  cursor: isInstructionPlaying ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isInstructionPlaying ? 0.5 : 1,
                  pointerEvents: isInstructionPlaying ? "none" : "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isInstructionPlaying) {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isInstructionPlaying) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <NextButtonRound />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    fontWeight: "500",
                  }}
                >
                  {messages.continueText}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pointToButton {
            0%, 100% {
              transform: rotate(180deg) translateY(0);
            }
            50% {
              transform: rotate(180deg) translateY(-15px);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: rotate(180deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.15);
            }
          }

          @keyframes fadeInSlideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AserFlowPreview;
