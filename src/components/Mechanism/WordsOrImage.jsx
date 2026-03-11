import {
  Box,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { createRef, useState, useEffect, useRef, useCallback } from "react";
import v11 from "../../assets/audio/V10.mp3";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import hintsImg from "../../assets/hints.svg";
import {
  PlayAudioButton,
  StopAudioButton,
  ListenButton,
  RetryIcon,
  StopButton,
  SpeakButton,
  NextButtonRound,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import MainLayout from "../Layouts.jsx/MainLayout";
import PropTypes from "prop-types";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import teacherImg from "../../assets/teacher.png";
import studentImg from "../../assets/student.png";
import listenImg2 from "../../assets/listen.png";
import spinnerStop from "../../assets/pause.png";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import { filterBadWords } from "@tekdi/multilingual-profanity-filter";
import { green } from "@mui/material/colors";
import AudioTooltipModal from "../Practice/AudioTooltipModal";
import ZoomableImage from "../Practice/ZoomableImage";

// const isChrome =
//   /Chrome/.test(navigator.userAgent) &&
//   /Google Inc/.test(navigator.vendor) &&
//   !/Edg/.test(navigator.userAgent);

const theme = createTheme();

const isChrome = true;

const WordsOrImage = ({
  handleNext,
  mechanism_id = "",
  background,
  header,
  type,
  words,
  hints = "",
  image,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  percentage,
  fluency,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  isDemo = false,
  handleBack,
  setEnableNext,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  loading,
  setOpenMessageDialog,
  isNextButtonCalled,
  setIsNextButtonCalled,
  audioLink,
  vocabCount,
  wordCount,
  multilingual,
  // Demo mode props
  showSpeakButton: showSpeakButtonProp,
  showStopButton: showStopButtonProp,
  showListenRetryButtons: showListenRetryButtonsProp,
  isRecording: isRecordingProp,
  onMicClick,
  onStopClick,
  onPlayClick,
  onRetryClick,
  onNextClick,
  isInstructionPlaying,
}) => {
  const audioRefs = createRef(null);
  const [audioInstance, setAudioInstance] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storedData, setStoredData] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [isRecordingState, setIsRecording] = useState(false);
  const [showSpeakButtonState, setShowSpeakButton] = useState(true);
  const [showStopButtonState, setShowStopButton] = useState(false);
  const [showListenRetryButtonsState, setShowListenRetryButtons] =
    useState(false);
  const [answer, setAnswer] = useState(null);

  // Use prop values if in demo mode, otherwise use internal state
  const isRecording =
    isDemo && isRecordingProp !== undefined
      ? isRecordingProp
      : isRecordingState;
  const showSpeakButton =
    isDemo && showSpeakButtonProp !== undefined
      ? showSpeakButtonProp
      : showSpeakButtonState;
  const showStopButton =
    isDemo && showStopButtonProp !== undefined
      ? showStopButtonProp
      : showStopButtonState;
  const showListenRetryButtons =
    isDemo && showListenRetryButtonsProp !== undefined
      ? showListenRetryButtonsProp
      : showListenRetryButtonsState;
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get native language symbol based on nativeLang
  const getNativeLangSymbol = () => {
    const nativeLang = getLocalData("nativeLang");
    const langSymbolMap = {
      ka: "ಕ", // Kannada (from LanguageModal)
      kn: "ಕ", // Kannada (from AllLanguages)
      tn: "இ", // Tamil (from AllLanguages, using "ta" symbol)
      ta: "இ", // Tamil (from AllLanguages)
      te: "ఈ", // Telugu (from AllLanguages)
      hi: "क", // Hindi (from AllLanguages)
      gu: "ક", // Gujarati (from AllLanguages)
      or: "କ", // Odia (from AllLanguages)
    };
    return langSymbolMap[nativeLang] || "ಕ"; // Default to Kannada if not found
  };
  const nativeLangSymbol = getNativeLangSymbol();

  // Get multilingual language code for audio (maps nativeLang to multilingual object keys)
  const getMultilingualLangCode = () => {
    const nativeLang = getLocalData("nativeLang");
    const langCodeMap = {
      ka: "kn", // Kannada (from LanguageModal -> multilingual key)
      kn: "kn", // Kannada (from AllLanguages)
      tn: "ta", // Tamil (from LanguageModal -> multilingual key)
      ta: "ta", // Tamil (from AllLanguages)
      te: "te", // Telugu
      hi: "hi", // Hindi
      gu: "gu", // Gujarati
      or: "or", // Odia
    };
    return langCodeMap[nativeLang] || "kn"; // Default to Kannada if not found
  };
  const multilingualLangCode = getMultilingualLangCode();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const [recAudio, setRecAudio] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const audioRef = useRef(null);
  const audioRefNew = useRef(null);
  const currentWordRef = useRef(null);
  const currentIsSelected = useRef(false);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [showWrongTick, setShowWrongTick] = useState(true);
  const [isTranscriptCorrect, setIsTranscriptCorrect] = useState(null);

  const handleNextWrapped = () => {
    setIsTranscriptCorrect(null);
    handleNext();
  };

  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
    //console.log("Live Transcript:", transcript);

    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      //console.log("filteredText", filteredText);

      if (filteredText.includes("*")) {
        const count = parseInt(getLocalData("profanityCheck") || "0");

        if (count > 2) {
          setOpenMessageDialog({
            open: true,
            message: `Please speak properly.`,
            severity: "warning",
            isError: true,
          });
        }

        handleStopRecording();

        setLocalData("profanityCheck", (count + 1).toString());
      }
    }
  }, [transcript]);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  //console.log('audios', audioLink);

  // const language = getLocalData("lang");

  const mimeType = "audio/webm;codecs=opus";

  const handleStartRecording = () => {
    // if (!browserSupportsSpeechRecognition) {
    //   //alert("Speech recognition is not supported in your browser.");
    //   return;
    // }
    setRecAudio(null);
    resetTranscript();
    setIsRecording(true);
    setLanguage(language);
    setAbusiveFound(false);
    setDetectedWord("");
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: language || "en-US",
    });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcriptRef.current);
    setAbusiveFound(false);

    setIsRecording(false);
    //console.log("Final Transcript:", transcriptRef.current);
  };

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  const startAudioRecording = useCallback(async () => {
    setRecordedBlob(null);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.error("MIME type not supported:", mimeType);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordedChunksRef.current.length === 0) {
          setRecordedBlob(null);
          return;
        }

        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        setRecordedBlob(blob);
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Emit data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData(); // Flush remaining data
      recorder.stop();
      setIsRecording(false);
    }
  }, []);

  const playRecordings = useCallback(() => {
    //console.log("play", isPlaying);

    if (!recordedBlob || !(recordedBlob instanceof Blob)) {
      console.error("No valid audio blob to play:", recordedBlob);
      return;
    }

    if (audioRefNew.current) {
      // If audio is already playing, resume from where it left off
      audioRefNew.current.play();
      setIsPlaying(true);
      return;
    }

    //console.log("bls", recordedBlob);

    const audioUrl = URL.createObjectURL(recordedBlob);
    const audio = new Audio(audioUrl);
    audioRefNew.current = audio;

    // audio.onplay = () => {
    //   setIsPlaying(true);
    // };
    audio.play();
    setIsPlaying(true);

    //console.log("play", isPlaying);

    audio.onended = () => {
      setIsPlaying(false);
      audioRefNew.current = null;
    };

    audio.onerror = () => {
      console.error("Playback failed:", audio.error);
      setIsPlaying(false);
    };

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setIsPlaying(false);
    });
  }, [recordedBlob]);

  const stopPlayback = useCallback(() => {
    if (audioRefNew.current) {
      audioRefNew.current.pause();
      audioRefNew.current.currentTime = 0;
      audioRefNew.current = null;
      setIsPlaying(false);
    }
  }, []);

  const initializeRecognition = () => {
    let recognitionInstance;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
    } else {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    if (recognitionInstance) {
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        startAudioRecording();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        setShowStopButton(false);
        setShowListenRetryButtons(true);

        // Check if transcript is empty - if user didn't speak, mark as incorrect
        if (!transcript || transcript.trim().length === 0) {
          setAnswer(false);
          const audio = new Audio(wrongSound);
          audio.play();
          stopAudioRecording();
          return;
        }

        const matchPercentage = phoneticMatch(
          currentWordRef.current,
          transcript
        );

        if (matchPercentage < 80) {
          setAnswer(false);
          const audio = new Audio(wrongSound);
          audio.play();
        } else {
          setAnswer(true);
          const audio = new Audio(correctSound);
          audio.play();
        }
        stopAudioRecording();
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          // No speech detected
        } else if (event.error === "aborted") {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onend = () => {
        stopAudioRecording();
      };

      setRecognition(recognitionInstance);
    }
  };

  const startRecording = (word, isSelected) => {
    if (isChrome) {
      // if (!browserSupportsSpeechRecognition) {
      //   //alert("Speech recognition is not supported in your browser.");
      //   return;
      // }
      resetTranscript();
      startAudioRecording();
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
      });
    }
    setIsRecording(true);
    setShowSpeakButton(false);
    setShowStopButton(true);
    currentWordRef.current = word;
    currentIsSelected.current = isSelected;
  };

  const stopRecording = (word) => {
    if (isChrome) {
      SpeechRecognition.stopListening();
      stopAudioRecording();
      const finalTranscript = transcriptRef.current;

      // Check if transcript is empty - if user didn't speak, mark as incorrect
      if (!finalTranscript || finalTranscript.trim().length === 0) {
        setAnswer(false);
        const audio = new Audio(wrongSound);
        audio.play();
        setIsRecording(false);
        setShowStopButton(false);
        setShowListenRetryButtons(true);
        return;
      }

      const matchPercentage = phoneticMatch(
        currentWordRef.current,
        finalTranscript
      );

      const isFirefox =
        typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().includes("firefox");

      if (isFirefox) {
        setAnswer(true);
        const audio = new Audio(correctSound);
        audio.play();
      } else {
        if (matchPercentage < 80) {
          setAnswer(false);
          const audio = new Audio(wrongSound);
          audio.play();
        } else {
          setAnswer(true);
          const audio = new Audio(correctSound);
          audio.play();
        }
      }
      setIsRecording(false);
      setShowStopButton(false);
      setShowListenRetryButtons(true);
    } else {
      setIsRecording(false);
      setShowStopButton(false);
      setShowListenRetryButtons(true);
      if (recognition) {
        recognition.stop();
      }
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);
    //console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      words,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      responseText?.responseText || ""
    );
  };

  const retryRecording = (word, isSelected) => {
    setShowListenRetryButtons(false);
    setShowSpeakButton(false);
    setShowStopButton(true);
    startRecording(word, isSelected);
  };

  const nextRecording = () => {
    if (audioRefNew.current) {
      audioRefNew.current.pause();
      audioRefNew.current.currentTime = 0;
      audioRefNew.current = null;
      setIsPlaying(false);
    }
    callTelemetry();
    setShowListenRetryButtons(false);
    setShowSpeakButton(true);
    setShowStopButton(false);
    setAnswer("");
    handleNext();
  };

  useEffect(() => {
    if (isRecording && recognition && recognition.state !== "recording") {
      recognition.start();
    }
  }, [isRecording, recognition]);

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, [recognition]);

  useEffect(() => {
    if (!isChrome) {
      initializeRecognition();
    }
  }, []);

  const updateStoredData = (audio, isCorrect) => {
    if (audio && words) {
      const newEntry = {
        selectedAnswer: words,
        audioUrl: audio,
        correctAnswer: isCorrect,
      };
      setStoredData((prevData) => [...prevData, newEntry]);
    }
  };

  const resetStoredData = () => {
    setStoredData([]);
  };

  useEffect(() => {
    updateStoredData();
    setShowHint(false);
  }, [handleNext]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRefs.current?.pause();
      setIsPlaying(false);
    } else {
      audioRefs.current?.play();
      setIsPlaying(true);
    }
  };

  const playAudio = () => {
    if (recordedAudioBlob && audioRef.current) {
      const audioBlobUrl = URL.createObjectURL(recordedAudioBlob);
      audioRef.current.src = audioBlobUrl;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const stopCompleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const getAnswerColor = (answer) => {
    // const isFirefox =
    //   typeof navigator !== "undefined" &&
    //   navigator.userAgent.toLowerCase().includes("firefox");

    // if (isFirefox && (answer === true || answer === false)) {
    //   return "green";
    // }

    if (answer === true) return "green";
    if (answer === false) return "red";
    return "#333F61";
  };

  //console.log("wds", words, matchedChar, answer);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      storedData={storedData}
      resetStoredData={resetStoredData}
      pageName={"wordsorimage"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        contentType,
        percentage,
        fluency,
        playTeacherAudio,
        handleBack,
        isShowCase,
        startShowCase,
        setStartShowCase,
        disableScreen,
        livesData,
        gameOverData,
        loading,
        setIsNextButtonCalled,
        vocabCount,
        wordCount,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h5"
          component="h4"
          sx={{
            color: "#333F61",
            fontSize:
              language === "te"
                ? isMobile
                  ? "26px"
                  : isTablet
                  ? "31px"
                  : "36px"
                : isMobile
                ? "20px"
                : isTablet
                ? "25px"
                : "30px",
            letterSpacing: "1.5px",
            lineHeight: "normal",
            fontWeight: 600,
            fontFamily: getFontFamily(language),
            marginLeft: isMobile ? "0px" : "20px",
            textAlign: "center",
          }}
        >
          {mechanism_id === "mechanic_15" ? header : ""}
        </Typography>
      </Box>
      <CardContent
        sx={{
          overflow: "hidden",
          pt: isMobile ? "40px" : isTablet ? "70px" : "100px",
          opacity: disableScreen ? 0.25 : 1,
          pointerEvents: disableScreen ? "none" : "initial",
        }}
      >
        <Box>
          {type === "image" ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={image}
                style={{
                  maxWidth: isMobile ? "150px" : isTablet ? "350px" : "450px",
                  maxHeight: isMobile ? "10px" : isTablet ? "110px" : "130px",
                  marginBottom: isMobile ? "10px" : "40px",
                }}
              />
            </Box>
          ) : type === "phonics" ? (
            <Box
              position="relative"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: isMobile ? "20px" : "40px",
              }}
            >
              <Box
                position="relative"
                sx={{
                  minWidth: isMobile ? "280px" : isTablet ? "350px" : "403px",
                  borderRadius: "15px",
                  background: "rgba(255, 161, 50, 0.1)",
                  height: isMobile ? "70px" : "88px",
                  display: "flex",
                }}
              >
                <audio
                  ref={audioRefs}
                  preload="metadata"
                  onCanPlay={(e) => {
                    setIsReady(true);
                  }}
                  onPlaying={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source type="audio/mp3" src={v11} />
                </audio>

                <Box
                  sx={{
                    height: isMobile ? "70px" : "88px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      marginLeft: isMobile ? "10px" : "20px",
                      marginTop: "5px",
                    }}
                    onClick={() => {
                      togglePlayPause();
                    }}
                  >
                    {isReady &&
                      (isPlaying ? (
                        <StopAudioButton
                          color={"#FFA132"}
                          size={isMobile ? "small" : "medium"}
                        />
                      ) : (
                        <PlayAudioButton
                          color={"#FFA132"}
                          size={isMobile ? "small" : "medium"}
                        />
                      ))}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h4"
                    sx={{
                      color: "#333F61",
                      fontSize: isMobile ? "28px" : isTablet ? "36px" : "44px",
                      letterSpacing: "2.2px",
                      lineHeight: "normal",
                      fontWeight: 600,
                      fontFamily: getFontFamily(language),
                      marginLeft: isMobile ? "10px" : "20px",
                    }}
                  >
                    {"REF LECTION"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                display: {
                  xs: "",
                  // md: imageLoaded ? "flex" : "",
                },
                justifyContent: "center",
                width: "100%",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {image && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    mb: isMobile ? 2 : 0,
                    position: "relative",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <ZoomableImage
                      src={image}
                      alt="Responsive content"
                      imageStyle={{
                        width: "100%",
                        maxWidth: isMobile
                          ? "150px"
                          : isTablet
                          ? "350px"
                          : "400px",
                        marginBottom: isMobile ? "10px" : "40px",
                        height: "auto",
                        maxHeight: isMobile
                          ? "200px"
                          : isTablet
                          ? "280px"
                          : "340px",
                        objectFit: "contain",
                        marginRight: isMobile ? "30px" : "0px",
                      }}
                      containerStyle={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    />
                    {hints && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: isMobile ? "-37px" : "-100px",
                          top: isMobile ? "90px" : isTablet ? "35px" : "0px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: isMobile ? "60px" : "100px",
                          zIndex: 9999,
                        }}
                        onClick={() => setShowHint(!showHint)}
                      >
                        {isMobile && showHint && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: "100%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "#ffff12",
                              padding: "8px 12px",
                              borderRadius: isMobile
                                ? "7px"
                                : isTablet
                                ? "10px"
                                : "20px",
                              fontSize: isMobile
                                ? "10px"
                                : isTablet
                                ? "8px"
                                : "16px",
                              color: "#333F61",
                              fontWeight: isMobile ? 500 : isTablet ? 200 : 600,
                              fontFamily:
                                '"Comic Sans MS", cursive, sans-serif',
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              maxWidth: "120px",
                              textAlign: "center",
                              lineHeight: "1.4",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                              mb: 1,
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderTop: "8px solid #ffff12",
                              },
                            }}
                          >
                            {hints}
                          </Box>
                        )}
                        <img
                          style={{
                            height: isMobile ? "40px" : "55px",
                            marginLeft: isMobile
                              ? "auto"
                              : isTablet
                              ? "18px"
                              : "0",
                            marginRight: isMobile ? "auto" : "0",
                            display: "block",
                            zIndex: 9999,
                          }}
                          src={hintsImg}
                          alt="Hint"
                        />
                        {!isMobile && <p style={{ fontSize: "14px" }}></p>}
                        {!isMobile && showHint && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: "0px",
                              left: "90px",
                              width: isMobile
                                ? "60px"
                                : isTablet
                                ? "70px"
                                : "150px",
                              backgroundColor: "#ffff12",
                              padding: "10px 15px",
                              borderRadius: "20px",
                              fontSize: isTablet ? "9px" : "20px",
                              color: "#333F61",
                              fontWeight: isTablet ? 100 : 600,
                              fontFamily:
                                '"Comic Sans MS", cursive, sans-serif',
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              maxWidth: "150px",
                              textAlign: "center",
                              lineHeight: "1.4",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                              zIndex: 1001,
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                bottom: "20px",
                                left: "-15px",
                                width: "15px",
                                height: "15px",
                                backgroundColor: "#ffff12",
                                borderRadius: "50%",
                                boxShadow: "10px 10px 0 0 #ffff12",
                              },
                            }}
                          >
                            {hints}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  // flexDirection: "column",
                  justifyContent: "space-around", // Centers content vertically
                  alignItems: "center", // Centers content horizontally
                  width: "100%",
                  gap: isMobile ? 2 : 4,
                  marginBottom: isMobile ? "20px" : "40px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                {!words && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress
                      size={isMobile ? "2rem" : "3rem"}
                      sx={{ color: "#E15404" }}
                    />
                  </Box>
                )}
                {words && !matchedChar && (
                  <Box
                    sx={{
                      ...(mechanism_id === "mechanic_15"
                        ? {
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 1 : 2,
                            mb: isMobile ? 4 : 8,
                          }
                        : ""),
                    }}
                  >
                    {mechanism_id === "mechanic_15" && (
                      <Avatar
                        src={teacherImg}
                        sx={{
                          bgcolor: "green",
                          height: isMobile
                            ? "40px"
                            : isTablet
                            ? "50px"
                            : "60px",
                          width: isMobile ? "40px" : isTablet ? "50px" : "60px",
                        }}
                      >
                        Teacher
                      </Avatar>
                    )}

                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        fontSize:
                          language === "te"
                            ? isMobile
                              ? "1.7rem"
                              : isTablet
                              ? "2.3rem"
                              : "clamp(1.9rem, 2.8vw, 4.1rem)"
                            : isMobile
                            ? "1.4rem"
                            : isTablet
                            ? "2rem"
                            : "clamp(1.6rem, 2.5vw, 3.8rem)",
                        fontWeight: language === "te" ? 400 : 700,
                        fontFamily: getFontFamily(language),
                        lineHeight: isMobile ? "30px" : "50px",
                        ...(mechanism_id === "mechanic_15"
                          ? {
                              position: "relative",
                              backgroundColor: "#FAD7A0",
                              padding: isMobile ? "8px 16px" : "10px 20px",
                              borderRadius: "20px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: "50%",
                                left: "-10px",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "10px solid transparent",
                                borderBottom: "10px solid transparent",
                                borderRight: "10px solid #d8d8d8",
                              },
                            }
                          : {
                              mb: isMobile ? 2 : 4,
                              color: getAnswerColor(answer),
                              textAlign: "center",
                            }),
                      }}
                      fontSize={{ md: "40px", xs: "25px" }}
                    >
                      {words ? words[0].toUpperCase() + words.slice(1) : ""}
                    </Typography>
                  </Box>
                )}
                {mechanism_id === "mechanic_15" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 1 : 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        position: "relative",
                        backgroundColor: "#D7BDE2",
                        padding: isMobile ? "8px 16px" : "10px 20px",
                        borderRadius: "20px",
                        fontSize:
                          language === "te"
                            ? isMobile
                              ? "1.7rem"
                              : isTablet
                              ? "2.3rem"
                              : "clamp(1.9rem, 2.8vw, 4.1rem)"
                            : isMobile
                            ? "1.4rem"
                            : isTablet
                            ? "2rem"
                            : "clamp(1.6rem, 2.5vw, 3.8rem)",
                        fontWeight: language === "te" ? 400 : 700,
                        fontFamily: getFontFamily(language),
                        lineHeight: isMobile ? "30px" : "50px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: "50%",
                          right: "-10px",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "10px solid transparent",
                          borderBottom: "10px solid transparent",
                          borderLeft: "10px solid #d8d8d8",
                        },
                      }}
                      fontSize={{ md: "40px", xs: "25px" }}
                    >
                      <motion.div style={{ display: "flex", gap: "5px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 1 : 2,
                          }}
                        >
                          Speak
                          {[...Array(3)].map((_, i) => (
                            <motion.span
                              key={i}
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "black",
                              }}
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </Box>
                      </motion.div>
                    </Typography>
                    <Avatar
                      src={studentImg}
                      sx={{
                        bgcolor: "green",
                        height: isMobile ? "40px" : isTablet ? "50px" : "60px",
                        width: isMobile ? "40px" : isTablet ? "50px" : "60px",
                      }}
                    >
                      N
                    </Avatar>
                  </Box>
                )}
                {matchedChar &&
                  ([1, 2, 3].includes(level) ? (
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        fontSize: isMobile
                          ? "1.4rem"
                          : isTablet
                          ? "2rem"
                          : "clamp(3rem, 4vw, 5rem)",
                        fontWeight: language === "te" ? 400 : 700,
                        fontFamily: getFontFamily(language),
                        lineHeight: isMobile ? "30px" : "50px",
                        //background: "#FFF0BD",
                        color:
                          isTranscriptCorrect === true
                            ? "green"
                            : isTranscriptCorrect === false
                            ? "red" // todo: need to change to red
                            : "#333F61",
                      }}
                    >
                      {words}
                      {/* Show multilingual box only for English */}
                      {isTranscriptCorrect !== null && language === "en" && (
                        <AudioTooltipModal
                          audioSrc={
                            multilingual?.[multilingualLangCode]?.audio_url
                          }
                          description={words}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              marginTop: "5px",
                              alignItems: "center",
                              justifyContent: "space-between",
                              border: "2px solid #FF7F36",
                              borderRadius: "16px",
                              gap: "10px",
                              padding: "15px",
                              //width: "300px",
                              backgroundColor: "#fff",
                              cursor: "pointer",
                              marginLeft: "15px",
                            }}
                          >
                            {/* Kannada Letter Box */}
                            <Box
                              sx={{
                                backgroundColor: "#FEBC2F66",
                                borderRadius: "4px",
                                //width: "100px",
                                //height: "100px",
                                padding: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "40px",
                                  fontWeight: "400",
                                  color: "#333F61",
                                  fontStyle: "Quicksand",
                                }}
                              >
                                {nativeLangSymbol}
                              </span>
                            </Box>

                            <ListenButton height={50} width={50} />
                          </Box>
                        </AudioTooltipModal>
                      )}
                    </Typography>
                  ) : (
                    <Box
                      display={"flex"}
                      mb={isMobile ? 2 : 4}
                      sx={{
                        color: "red",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {highlightWords(
                        words,
                        matchedChar,
                        getAnswerColor(isTranscriptCorrect)
                      )}
                    </Box>
                  ))}
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: isMobile ? 2 : 0,
          }}
        >
          {(level === 15 && !isShowCase) || isDemo ? (
            <div>
              {showSpeakButton && (
                <Box
                  sx={{
                    cursor:
                      isDemo && isInstructionPlaying
                        ? "not-allowed"
                        : "pointer",
                    opacity: isDemo && isInstructionPlaying ? 0.5 : 1,
                    pointerEvents:
                      isDemo && isInstructionPlaying ? "none" : "auto",
                  }}
                  onClick={() =>
                    isDemo && onMicClick
                      ? onMicClick()
                      : startRecording(words, true)
                  }
                >
                  <SpeakButton size={isMobile ? "small" : "medium"} />
                </Box>
              )}
              {showStopButton && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                >
                  <Box
                    sx={{
                      cursor:
                        isDemo && isInstructionPlaying
                          ? "not-allowed"
                          : "pointer",
                      opacity: isDemo && isInstructionPlaying ? 0.5 : 1,
                      pointerEvents:
                        isDemo && isInstructionPlaying ? "none" : "auto",
                    }}
                    onClick={() =>
                      isDemo && onStopClick
                        ? onStopClick()
                        : stopRecording(words)
                    }
                  >
                    <StopButton size={isMobile ? "small" : "medium"} />
                  </Box>
                  <Box
                    style={{
                      marginTop: isMobile ? "30px" : "50px",
                      marginBottom: isMobile ? "30px" : "50px",
                    }}
                  >
                    {isRecording && <RecordVoiceVisualizer />}
                  </Box>
                </div>
              )}
              {showListenRetryButtons && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                >
                  {/* <Box sx={{ cursor: "pointer" }} onClick={playAudio}>
                    <ListenButton />
                  </Box> */}
                  {isPlaying ? (
                    <div>
                      <Box
                        sx={{
                          //marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          //minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                          //marginLeft: getMarginLeft(0),
                        }}
                        onClick={() => {
                          stopPlayback();
                          //setIsPlaying(false);
                        }}
                      >
                        <img
                          src={spinnerStop}
                          alt="Audio"
                          style={{
                            height: "70px",
                            width: "70px",
                            cursor: "pointer",
                          }}
                        />
                        {/* <StopButton height={50} width={50} /> */}
                      </Box>
                    </div>
                  ) : (
                    <div>
                      <Box
                        className="walkthrough-step-4"
                        sx={{
                          //marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          //minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          //cursor: `url(${clapImage}) 32 24, auto`,
                          //marginLeft: getMarginLeft(0),
                          opacity: isDemo && isInstructionPlaying ? 0.5 : 1,
                          cursor:
                            isDemo && isInstructionPlaying
                              ? "not-allowed"
                              : "pointer",
                          pointerEvents:
                            isDemo && isInstructionPlaying ? "none" : "auto",
                        }}
                        onClick={() => {
                          if (isDemo && onPlayClick) {
                            onPlayClick();
                          } else {
                            playRecordings();
                          }
                          //setIsPlaying(true);
                        }}
                        //disabled={!recordedAudioBlob}
                      >
                        <img
                          src={listenImg2}
                          alt="Audio"
                          style={{
                            height: "70px",
                            width: "70px",
                            cursor:
                              isDemo && isInstructionPlaying
                                ? "not-allowed"
                                : "pointer",
                          }}
                        />
                        {/* <ListenButton height={50} width={50} /> */}
                      </Box>
                    </div>
                  )}
                  <Box
                    sx={{
                      cursor:
                        isDemo && isInstructionPlaying
                          ? "not-allowed"
                          : "pointer",
                      marginLeft: "16px",
                      opacity: isDemo && isInstructionPlaying ? 0.5 : 1,
                      pointerEvents:
                        isDemo && isInstructionPlaying ? "none" : "auto",
                    }}
                    onClick={() =>
                      isDemo && onRetryClick
                        ? onRetryClick()
                        : retryRecording(words, true)
                    }
                  >
                    <RetryIcon />
                  </Box>
                  <Box
                    sx={{
                      cursor:
                        isDemo && isInstructionPlaying
                          ? "not-allowed"
                          : "pointer",
                      marginLeft: "16px",
                      opacity: isDemo && isInstructionPlaying ? 0.5 : 1,
                      pointerEvents:
                        isDemo && isInstructionPlaying ? "none" : "auto",
                    }}
                    onClick={() =>
                      isDemo && onNextClick ? onNextClick() : nextRecording()
                    }
                  >
                    <NextButtonRound />
                  </Box>
                </div>
              )}
              <audio ref={audioRef} src={recordedAudioBlob} hidden />
            </div>
          ) : (
            <VoiceAnalyser
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              originalText={words}
              handleNext={handleNextWrapped}
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              handleRecordingComplete={handleRecordingComplete}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              audioLink={audioLink ? audioLink : null}
              setIsCorrect={setIsTranscriptCorrect}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                setEnableNext,
                livesData,
                setLivesData,
                setOpenMessageDialog,
                isNextButtonCalled,
                setIsNextButtonCalled,
              }}
            />
          )}
        </Box>
      </CardContent>
    </MainLayout>
  );
};

WordsOrImage.propTypes = {
  handleNext: PropTypes.func.isRequired,
  header: PropTypes.string,
  image: PropTypes.string,
  setVoiceText: PropTypes.func.isRequired,
  setRecordedAudio: PropTypes.func.isRequired,
  setVoiceAnimate: PropTypes.func.isRequired,
  enableNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  points: PropTypes.number,
  currentStep: PropTypes.number.isRequired,
  percentage: PropTypes.string,
  fluency: PropTypes.bool,
  isDiscover: PropTypes.bool,
  showProgress: PropTypes.bool,
  callUpdateLearner: PropTypes.bool,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  setEnableNext: PropTypes.func.isRequired,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  setLivesData: PropTypes.func,
  loading: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setIsNextButtonCalled: PropTypes.func,
  background: PropTypes.string,
  type: PropTypes.any,
  words: PropTypes.any,
  storyLine: PropTypes.number,
  steps: PropTypes.number,
  contentId: PropTypes.any,
  contentType: PropTypes.string,
  level: PropTypes.any,
  progressData: PropTypes.object,
  playTeacherAudio: PropTypes.func,
  livesData: PropTypes.any,
  gameOverData: PropTypes.any,
  highlightWords: PropTypes.func,
  matchedChar: PropTypes.any,
};

export default WordsOrImage;
