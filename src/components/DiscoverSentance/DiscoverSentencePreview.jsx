import { useState, useRef, useCallback } from "react";
import {
  getLocalData,
  RetryIcon,
  NextButtonRound,
} from "../../utils/constants";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import WordsOrImage from "../Mechanism/WordsOrImage";
import { Sparkles } from "lucide-react";
import { Progress } from "../../lib/axl-explorations/src/components/ui/progress";
import { set } from "lodash";

const demoInstructions = {
  en: {
    demoSentence: "The cat is sleeping.",
    narration1:
      "See the sentence. The cat is sleeping. Now click the microphone button to record yourself saying it",
    narration2:
      "Now record the audio. Click the stop icon when you finish speaking",
    narration3: "Click the play button to hear the recorded audio",
    narration4: "Click on retry button to record the audio again",
    narration5: "Click continue to proceed",
    skipDemo: "Skip Demo",
    startGame: "Start Game",
    howToPlay: "How to Play",
  },
  te: {
    demoSentence: "పిల్లి నిద్రపోతోంది.",
    narration1:
      "వాక్యం చూడండి. పిల్లి నిద్రపోతోంది. ఇప్పుడు మైక్రోఫోన్ బటన్‌ను క్లిక్ చేసి మీరే చెప్పడానికి రికార్డ్ చేయండి",
    narration2:
      "ఇప్పుడు ఆడియోను రికార్డ్ చేయండి. మీరు మాట్లాడటం పూర్తయినప్పుడు స్టాప్ చిహ్నంపై క్లిక్ చేయండి",
    narration3: "రికార్డ్ చేసిన ఆడియోను వినడానికి ప్లే బటన్‌ను క్లిక్ చేయండి",
    narration4: "మళ్లీ ఆడియో రికార్డ్ చేయడానికి రీట్రై బటన్‌పై క్లిక్ చేయండి",
    narration5: "కొనసాగించడానికి కంటిన్యూ క్లిక్ చేయండి",
    skipDemo: "డెమోను దాటవేయండి",
    startGame: "ఆట ప్రారంభించండి",
    howToPlay: "ఎలా ఆడాలి",
  },
  kn: {
    demoSentence: "ಬೆಕ್ಕು ಮಲಗುತ್ತಿದೆ.",
    narration1:
      "ವಾಕ್ಯವನ್ನು ನೋಡಿ. ಬೆಕ್ಕು ಮಲಗುತ್ತಿದೆ. ಈಗ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ನೀವೇ ಹೇಳಲು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    narration2:
      "ಈಗ ಆಡಿಯೊವನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ. ನೀವು ಮಾತನಾಡುವುದನ್ನು ಮುಗಿಸಿದಾಗ ಸ್ಟಾಪ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration3: "ರೆಕಾರ್ಡ್ ಮಾಡಿದ ಆಡಿಯೊವನ್ನು ಕೇಳಲು ಪ್ಲೇ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration4: "ಮತ್ತೆ ಆಡಿಯೊ ರೆಕಾರ್ಡ್ ಮಾಡಲು ರಿಟ್ರೈ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    narration5: "ಮುಂದುವರಿಸಲು ಕಂಟಿನ್ಯೂ ಕ್ಲಿಕ್ ಮಾಡಿ",
    skipDemo: "ಡೆಮೊವನ್ನು ಬಿಟ್ಟುಬಿಡಿ",
    startGame: "ಆಟ ಪ್ರಾರಂಭಿಸಿ",
    howToPlay: "ಹೇಗೆ ಆಡಬೇಕು",
  },
  mr: {
    demoSentence: "मांजर झोपत आहे.",
    narration1:
      "वाक्य पहा. मांजर झोपत आहे. आता मायक्रोफोन बटणावर क्लिक करा आणि स्वतः म्हणण्यासाठी रेकॉर्ड करा",
    narration2:
      "आता ऑडिओ रेकॉर्ड करा. तुम्ही बोलणे संपवल्यावर स्टॉप आयकॉनवर क्लिक करा",
    narration3: "रेकॉर्ड केलेला ऑडिओ ऐकण्यासाठी प्ले बटणावर क्लिक करा",
    narration4: "पुन्हा ऑडिओ रेकॉर्ड करण्यासाठी रीट्राय बटणावर क्लिक करा",
    narration5: "पुढे जाण्यासाठी कंटिन्यू क्लिक करा",
    skipDemo: "डेमो वगळा",
    startGame: "खेळ सुरू करा",
    howToPlay: "कसे खेळायचे",
  },
  hi: {
    demoSentence: "बिल्ली सो रही है।",
    narration1:
      "वाक्य देखें। बिल्ली सो रही है। अब माइक्रोफोन बटन पर क्लिक करें और खुद कहने के लिए रिकॉर्ड करें",
    narration2:
      "अब ऑडियो रिकॉर्ड करें। जब आप बोलना समाप्त करें तो स्टॉप आइकन पर क्लिक करें",
    narration3: "रिकॉर्ड किए गए ऑडियो को सुनने के लिए प्ले बटन पर क्लिक करें",
    narration4: "फिर से ऑडियो रिकॉर्ड करने के लिए रीट्राई बटन पर क्लिक करें",
    narration5: "आगे बढ़ने के लिए कंटिन्यू पर क्लिक करें",
    skipDemo: "डेमो छोड़ें",
    startGame: "खेल शुरू करें",
    howToPlay: "कैसे खेलें",
  },
  gu: {
    demoSentence: "બિલાડી ઊંઘી રહી છે.",
    narration1:
      "વાક્ય જુઓ. બિલાડી ઊંઘી રહી છે. હવે માઇક્રોફોન બટન પર ક્લિક કરો અને તમે પોતે કહેવા માટે રેકોર્ડ કરો",
    narration2:
      "હવે ઓડિયો રેકોર્ડ કરો. જ્યારે તમે બોલવાનું સમાપ્ત કરો ત્યારે સ્ટોપ આઇકોન પર ક્લિક કરો",
    narration3: "રેકોર્ડ કરેલ ઓડિયો સાંભળવા માટે પ્લે બટન પર ક્લિક કરો",
    narration4: "ફરીથી ઓડિયો રેકોર્ડ કરવા માટે રિટ્રાય બટન પર ક્લિક કરો",
    narration5: "આગળ વધવા માટે કન્ટિન્યુ પર ક્લિક કરો",
    skipDemo: "ડેમો છોડો",
    startGame: "રમત શરૂ કરો",
    howToPlay: "કેવી રીતે રમવું",
  },
  ta: {
    demoSentence: "பூனை தூங்குகிறது.",
    narration1:
      "வாக்கியத்தைப் பார்க்கவும். பூனை தூங்குகிறது. இப்போது மைக்ரோஃபோன் பொத்தானைக் கிளிக் செய்து நீங்களே சொல்ல பதிவு செய்யவும்",
    narration2:
      "இப்போது ஆடியோவைப் பதிவு செய்யவும். நீங்கள் பேசி முடித்ததும் ஸ்டாப் ஐகானைக் கிளிக் செய்யவும்",
    narration3:
      "பதிவு செய்யப்பட்ட ஆடியோவைக் கேட்க பிளே பொத்தானைக் கிளிக் செய்யவும்",
    narration4:
      "மீண்டும் ஆடியோவைப் பதிவு செய்ய ரீட்ரை பொத்தானைக் கிளிக் செய்யவும்",
    narration5: "தொடர கன்டினியூவைக் கிளிக் செய்யவும்",
    skipDemo: "டெமோவைத் தவிர்க்கவும்",
    startGame: "விளையாட்டைத் தொடங்கவும்",
    howToPlay: "எப்படி விளையாடுவது",
  },
  or: {
    demoSentence: "ବିଲେଇ ଶୋଇଛି।",
    narration1:
      "ବାକ୍ୟ ଦେଖନ୍ତୁ। ବିଲେଇ ଶୋଇଛି। ବର୍ତ୍ତମାନ ମାଇକ୍ରୋଫୋନ୍ ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ ଏବଂ ନିଜେ କହିବା ପାଇଁ ରେକର୍ଡ କରନ୍ତୁ",
    narration2:
      "ବର୍ତ୍ତମାନ ଅଡିଓ ରେକର୍ଡ କରନ୍ତୁ। ଯେତେବେଳେ ଆପଣ କଥା ସମାପ୍ତ କରିବେ ଷ୍ଟପ୍ ଆଇକନ୍ କ୍ଲିକ୍ କରନ୍ତୁ",
    narration3: "ରେକର୍ଡ କରାଯାଇଥିବା ଅଡିଓ ଶୁଣିବା ପାଇଁ ପ୍ଲେ ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ",
    narration4: "ପୁନର୍ବାର ଅଡିଓ ରେକର୍ଡ କରିବାକୁ ରିଟ୍ରାଇ ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ",
    narration5: "ଆଗକୁ ବଢିବାକୁ କଣ୍ଟିନ୍ୟୁ କ୍ଲିକ୍ କରନ୍ତୁ",
    skipDemo: "ଡେମୋ ଛାଡନ୍ତୁ",
    startGame: "ଖେଳ ଆରମ୍ଭ କରନ୍ତୁ",
    howToPlay: "କିପରି ଖେଳିବେ",
  },
};

const DiscoverSentencePreview = ({ onStartGame, onBack }) => {
  // Demo states: countdown, showSentence, recording, playAudio, retryOrContinue, completion
  const [demoPhase, setDemoPhase] = useState("countdown");
  const [currentDemoStep, setCurrentDemoStep] = useState(1); // Track demo step progress (1-5)
  const [showPointer, setShowPointer] = useState(false);
  const [pointerTarget, setPointerTarget] = useState(""); // mic, stop, play, retry, continue
  const [isFirstRecording, setIsFirstRecording] = useState(true);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [isInstructionPlaying, setIsInstructionPlaying] = useState(false);

  // Button visibility states for demo
  const [showSpeakButton, setShowSpeakButton] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [showListenRetryButtons, setShowListenRetryButtons] = useState(false);
  const [isRecordingDemo, setIsRecordingDemo] = useState(false);

  // Audio recording states
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const instructionAudioRef = useRef(null); // Ref to store current instruction audio

  const language = getLocalData("lang") || "en";
  const instructions = demoInstructions[language] || demoInstructions.en;

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setDemoPhase("showSentence");
    setCurrentDemoStep(1);
    setShowSpeakButton(true);
    setShowStopButton(false);
    setShowListenRetryButtons(false);
    setIsRecordingDemo(false);

    // Play first instruction after a small delay
    setTimeout(async () => {
      await playInstruction(instructions.narration1, 1);
      setShowPointer(true);
      setPointerTarget("mic");
    }, 1000);
  };

  // Play instruction audio from S3 - returns a promise that resolves when done
  const playInstruction = (text, step) => {
    // Stop any currently playing instruction audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }

    setIsInstructionPlaying(true);

    return new Promise((resolve) => {
      // Build S3 audio path: /audio/audio-preview/combined-sentence-games/sentence-recording/{language}/narration{step}.wav
      // const audioPath = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL || ''}/audio/audio-preview/combined-sentence-games/sentence-recording/${language}/narration${step}.wav`;
      const audioPath = `/audio/audio-preview/sentence-recording/${language}/narration${step}.wav`;
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

  // Helper function to play multiple instructions sequentially
  const playInstructionsSequentially = async (texts, steps) => {
    for (let i = 0; i < texts.length; i++) {
      await playInstruction(texts[i], steps[i]);
    }
  };

  // Start audio recording
  const startAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(audioUrl);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record audio.");
    }
  }, []);

  // Stop audio recording
  const stopAudioRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Handle microphone button click (user starts recording)
  const handleMicClick = async () => {
    if (demoPhase !== "showSentence") return;
    if (isInstructionPlaying) return; // Don't allow clicks while instruction is playing

    setShowPointer(false);
    setShowSpeakButton(false);
    setShowStopButton(true);
    setDemoPhase("recording");
    setCurrentDemoStep(2);

    // Play instruction only on first recording, then start recording
    if (isFirstRecording) {
      // Play instruction first
      await new Promise((resolve) => {
        setTimeout(async () => {
          await playInstruction(instructions.narration2, 2);
          resolve();
        }, 500);
      });

      // After instruction completes, start recording
      setIsRecordingDemo(true);
      startAudioRecording();

      setTimeout(() => {
        setShowPointer(true);
        setPointerTarget("stop");
      }, 300);
    } else {
      // No instruction on retry, start recording immediately
      setIsRecordingDemo(true);
      startAudioRecording();

      setTimeout(() => {
        setShowPointer(true);
        setPointerTarget("stop");
      }, 500);
    }
  };

  // Handle stop button click (user stops recording)
  const handleStopClick = async () => {
    if (demoPhase !== "recording") return;
    if (isInstructionPlaying) return; // Don't allow clicks while instruction is playing

    setShowPointer(false);
    setShowStopButton(false);
    setShowListenRetryButtons(true);
    setIsRecordingDemo(false);
    setDemoPhase("playAudio");
    setIsFirstRecording(false);
    setCurrentDemoStep(3);

    // Stop actual audio recording
    stopAudioRecording();

    // Play instruction to click play button - wait for it to complete
    setTimeout(async () => {
      await playInstruction(instructions.narration3, 3);

      // Only show pointer and enable button after instruction completes
      setShowPointer(true);
      setPointerTarget("play");
    }, 500);
  };

  // Handle play/listen button click (user listens to recording)
  const handlePlayClick = async () => {
    if (demoPhase !== "playAudio") return;

    // Don't allow clicking if instruction is still playing
    if (isInstructionPlaying) {
      console.log("Please wait for instruction to finish");
      return;
    }

    setShowPointer(false);

    // Play the actual recorded audio
    if (recordedAudioUrl && audioRef.current) {
      audioRef.current.src = recordedAudioUrl;
      audioRef.current.play();

      audioRef.current.onended = async () => {
        // After playback completes, move to retry/continue phase
        setDemoPhase("retryOrContinue");
        setCurrentDemoStep(4);
        // Show instruction for retry or continue with pointer to retry button
        // Play narration4 and narration5 sequentially
        setTimeout(async () => {
          await playInstructionsSequentially(
            [instructions.narration4, instructions.narration5],
            [4, 5]
          );
          setShowPointer(true);
          setPointerTarget("retry");
        }, 500);
      };
    } else {
      // If no recording exists (shouldn't happen), move to next phase
      setDemoPhase("retryOrContinue");
      setCurrentDemoStep(4);
      setTimeout(async () => {
        // Play narration4 and narration5 sequentially
        await playInstructionsSequentially(
          [instructions.narration4, instructions.narration5],
          [4, 5]
        );
        setShowPointer(true);
        setPointerTarget("retry");
      }, 500);
    }
  };

  // Handle retry button click (user wants to record again)
  const handleRetryClick = () => {
    if (demoPhase !== "retryOrContinue") return;

    // Don't allow clicking if instruction is still playing
    if (isInstructionPlaying) {
      console.log("Please wait for instruction to finish");
      return;
    }

    setShowPointer(false);
    setShowListenRetryButtons(false);
    setShowSpeakButton(true);
    setDemoPhase("showSentence");
    setCurrentDemoStep(1);
    // Clear previous recording
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);

    // Go back to microphone step, but no instruction this time
    setTimeout(() => {
      setShowPointer(true);
      setPointerTarget("mic");
    }, 500);
  };

  // Handle continue button click (user proceeds to completion screen)
  const handleContinueClick = () => {
    if (demoPhase !== "retryOrContinue") return;

    // Don't allow clicking if instruction is still playing
    if (isInstructionPlaying) {
      console.log("Please wait for instruction to finish");
      return;
    }

    setShowPointer(false);
    setDemoPhase("completion");
  };

  // Handle start game from completion screen
  const handleStartGameClick = () => {
    // Stop instruction audio if it's playing
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);

    // Stop recorded audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Clean up audio recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }

    onStartGame();
  };

  // Handle replay demo from completion screen
  const handleReplayDemo = () => {
    // Stop recorded audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Clean up audio recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);

    // Reset to countdown
    setDemoPhase("countdown");
    setShowPointer(false);
    setIsFirstRecording(true);
  };

  // Dummy handleNext for demo
  const handleNext = () => {
    // This is called by WordsOrImage but we handle it with our custom handlers
  };

  const handleBackClick = () => {
    // Stop instruction audio if it's playing
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);

    // Stop recorded audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    onBack();
  };

  const handleSkipDemo = () => {
    // Stop instruction audio if it's playing
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      instructionAudioRef.current = null;
    }
    setIsInstructionPlaying(false);

    // Stop recorded audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Clean up audio recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }

    onStartGame();
  };

  // Completion messages
  const completionMessages = {
    en: {
      title: "Demo Complete!",
      message: "Great job! You're ready to start.",
      replayText: "Replay",
      continueText: "Continue",
    },
    te: {
      title: "డెమో పూర్తయింది!",
      message: "బాగా చేసారు! మీరు ప్రారంభించడానికి సిద్ధంగా ఉన్నారు.",
      replayText: "మళ్లీ ప్లే చేయండి",
      continueText: "కొనసాగించు",
    },
    kn: {
      title: "ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ!",
      message: "ಅದ್ಭುತ! ನೀವು ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ.",
      replayText: "ಮರುಪ್ಲೇ",
      continueText: "ಮುಂದುವರಿಸಿ",
    },
    mr: {
      title: "डेमो पूर्ण झाला!",
      message: "छान केलं! तुम्ही सुरू करण्यास तयार आहात.",
      replayText: "पुन्हा प्ले करा",
      continueText: "पुढे चला",
    },
    hi: {
      title: "डेमो पूर्ण हुआ!",
      message: "बहुत बढ़िया! आप शुरू करने के लिए तैयार हैं।",
      replayText: "फिर से प्ले करें",
      continueText: "जारी रखें",
    },
    gu: {
      title: "ડેમો પૂર્ણ થયું!",
      message: "ખૂબ સરસ! તમે શરૂ કરવા તૈયાર છો.",
      replayText: "ફરીથી પ્લે કરો",
      continueText: "ચાલુ રાખો",
    },
    ta: {
      title: "டெமோ முடிந்தது!",
      message: "நன்றாக செய்தீர்கள்! நீங்கள் தொடங்க தயாராக உள்ளீர்கள்.",
      replayText: "மீண்டும் இயக்கு",
      continueText: "தொடர்க",
    },
    or: {
      title: "ଡେମୋ ସମ୍ପୂର୍ଣ୍ଣ!",
      message: "ବହୁତ ଭଲ! ଆପଣ ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ।",
      replayText: "ପୁନର୍ବାର ପ୍ଲେ କରନ୍ତୁ",
      continueText: "ଜାରି ରଖନ୍ତୁ",
    },
  };

  const messages = completionMessages[language] || completionMessages.en;

  // Render discovery UI with interactive demo
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Always render WordsOrImage (discovery UI) */}
      <WordsOrImage
        background="linear-gradient(45deg, #FF730E 30%, #FFB951 90%)"
        header="Speak the below sentence"
        words={demoPhase === "countdown" ? "" : instructions.demoSentence}
        contentType="Sentence"
        contentId="demo-sentence"
        setVoiceText={() => {}}
        setRecordedAudio={() => {}}
        setVoiceAnimate={() => {}}
        storyLine={0}
        handleNext={handleNext}
        type="text"
        enableNext={false}
        showTimer={false}
        points={0}
        steps={1}
        currentStep={1}
        isDiscover={true}
        callUpdateLearner={false}
        disableScreen={demoPhase === "countdown"}
        handleBack={handleBackClick}
        setEnableNext={() => {}}
        isNextButtonCalled={isNextButtonCalled}
        setIsNextButtonCalled={setIsNextButtonCalled}
        setOpenMessageDialog={() => {}}
        startShowCase={true}
        isDemo={true}
        showSpeakButton={showSpeakButton}
        showStopButton={showStopButton}
        showListenRetryButtons={showListenRetryButtons}
        isRecording={isRecordingDemo}
        onMicClick={handleMicClick}
        onStopClick={handleStopClick}
        onPlayClick={handlePlayClick}
        onRetryClick={handleRetryClick}
        onNextClick={handleContinueClick}
        isInstructionPlaying={isInstructionPlaying}
      />

      {/* Countdown Timer Overlay - Only during countdown */}
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

      {/* Hand Pointer - Shows for interactive steps */}
      {showPointer && demoPhase !== "countdown" && !isInstructionPlaying && (
        <div
          style={{
            position: "absolute",
            bottom: "220px",
            // Buttons are centered as a group: Play (70px) + margin (16px) + Retry (70px) + margin (16px) + Continue (70px) = 242px total
            // Group center is at 50%, so individual button centers are calculated from group start
            left:
              pointerTarget === "play"
                ? "calc(50% - 120px)" // First button: center of play button
                : pointerTarget === "retry"
                ? "50%" // Middle button: exactly at center
                : pointerTarget === "continue"
                ? "calc(50% + 86px)" // Third button: center of continue button
                : "calc(50% - 35px)", // mic or stop button (single centered button, 70px / 2)
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

      {/* Demo Completion Floating Card */}
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
                onClick={handleReplayDemo}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
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
                  {/* {messages.replayText} */}
                </span>
              </div>
              <div
                onClick={handleStartGameClick}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
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
                  {/* {messages.continueText} */}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "How to Play" Progress Indicator */}
      {(demoPhase === "showSentence" ||
        demoPhase === "recording" ||
        demoPhase === "playAudio" ||
        demoPhase === "retryOrContinue") && (
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
              value={(currentDemoStep / 4) * 100}
              className="h-1.5 w-64"
            />
          </div>
        </div>
      )}

      {/* Demo Control Buttons - Inside White Container */}
      {(demoPhase === "showSentence" ||
        demoPhase === "recording" ||
        demoPhase === "playAudio" ||
        demoPhase === "retryOrContinue") && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "space-between",
            width: "calc(100% - 280px)",
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
          >
            {instructions.startGame}
          </button>
        </div>
      )}

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: "none" }} />

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

export default DiscoverSentencePreview;
