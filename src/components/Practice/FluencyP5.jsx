import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import tortoiseImg from "../../assets/tortoiseImg.svg";
import headerImg from "../../assets/headerImg.svg";
import pauseImg from "../../assets/pauseImg.svg";
import graphImg from "../../assets/graphImg.svg";
import beardanceImg from "../../assets/beardance.svg";
import nextImg from "../../assets/nextImg.svg";
import listenImg from "../../assets/listenImg.svg";
import LanguageHint from "../../assets/laguagehint.svg";
import backgroundImg from "../../assets/starsandclouds.png";
import meterImg from "../../assets/meterimg.svg";
import rabbitImg from "../../assets/rabbit.svg";
import tortoiseimage from "../../assets/tortoise.svg";
import SpeedSelector from "../../utils/SpeedSelector";
import hintimg from "../../assets/hintsicon.svg";
import dogImg from "../../assets/dogimg.svg";
import speakButton from "../../assets/speakButton.svg";
import bookImg from "../../assets/bookimg.svg";
import wellImg from "../../assets/wellimage.svg";

import MainLayout from "../Layouts.jsx/MainLayout";
import {
  practiceSteps,
  WordRedCircle,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  RetryIcon,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import Joyride from "react-joyride";
import LanguageModalNew from "../../utils/LanguageModal";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import AudioTooltipModal from "./AudioTooltipModal";
import { doubleMetaphone } from "double-metaphone";
import correctSound from "../../assets/correct.wav";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

function CircularTimer({ duration = 30, isActive = true }) {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [elapsed, setElapsed] = React.useState(0);

  const radius = 30;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * radius;

  // Decrease timeLeft every 1s
  React.useEffect(() => {
    if (timeLeft <= 0 || !isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isActive]);

  React.useEffect(() => {
    if (!isActive) return;
    let start = performance.now();

    const tick = (now) => {
      const diff = now - start;
      setElapsed(diff / 1000);
      if (timeLeft > 0) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [timeLeft, isActive]);

  const totalElapsed = duration - timeLeft + elapsed;
  const progress = Math.max(0, (1 - totalElapsed / duration) * 100);

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width="80" height="80">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(255, 187, 150, 0.3)"
          strokeWidth="8"
          fill="transparent"
        />

        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#F39F27"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress / 100)}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.1s linear",
          }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          transform: `rotate(${-360 * (1 - progress / 100)}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* <img
          src={dogImg}
          alt="dog"
          style={{
            position: "absolute",
            width: "35px",
            height: "35px",
            top: "-13px",
            left: "calc(50% - 13.5px)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        /> */}
      </div>

      <div
        style={{
          position: "absolute",
          fontWeight: "700",
          fontSize: "20px",
          color: timeLeft === 0 ? "red" : "#ff6600",
        }}
      >
        {timeLeft}
      </div>
    </div>
  );
}
const theme = createTheme();

const FluencyP5 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  handleBack,
  setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  multilingual,
  contentSourceData,
}) => {
  const whiteContainerRef = useRef(null);
  const audioRef = useRef(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showBearDance, setShowBearDance] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalState, setShowFinalState] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [hintPosition, setHintPosition] = useState({ x: 0, y: 0 });
  const [showReadingSpeed, setShowReadingSpeed] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const audioRefs = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState("Fast");
  const [speed, setSpeed] = useState(getLocalData("speed"));
  const [resetTimer, setResetTimer] = useState(false);
  const [hasSpeedBeenSelected, setHasSpeedBeenSelected] = useState(
    !!getLocalData("speed")
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [scrollPosition, setScrollPosition] = useState(130);
  const scrollAnimationRef = useRef(null);
  const lastFrameTimeRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textBlockRef = useRef(null);

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const transcriptRef = useRef("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [open, setOpen] = useState(false);
  const correctPracticeWords = getLocalData("correctPracticeWords");
  const sessionId = getLocalData("sessionId");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const getSimilarity = (str1, str2) => {
    const a = str1.toLowerCase().trim().split(" ");
    const b = str2.toLowerCase().trim().split(" ");
    const matches = a.filter((word) => b.includes(word)).length;
    const total = Math.max(a.length, b.length);
    return matches / total;
  };

  const getBrowserLanguage = (langCode) => {
    const browserLangMap = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN",
      ka: "kn-IN",
      kn: "kn-IN",
      ta: "ta-IN",
    };
    return browserLangMap[langCode] || "en-US";
  };

  useEffect(() => {
    transcriptRef.current = transcript;
    const similarity = getSimilarity(transcript, currentSentence.sentence);
    setIsMatch(similarity >= 0.6);
  }, [transcript]);

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

  const sentencesData = [
    {
      id: 1,
      sentence: contentSourceData?.text || "",
      audio: contentSourceData?.audioUrl || "",
      underlinedWords: parentWords ? Object.keys(parentWords) : [],
      hints: parentWords
        ? Object.fromEntries(
            Object.entries(parentWords).map(([word, data]) => [
              word,
              data?.[multilingualLangCode]?.audio_url || "",
            ])
          )
        : {},
    },
  ];

  const currentSentence = sentencesData[currentSentenceIndex];

  useEffect(() => {
    if (!getLocalData("speed")) {
      setLocalData("speed", "Fast");
      setSelected("Fast");
    }

    setShowContent(true);
    setShowSentence(true);
    startReadingFlow();
  }, []);

  const getDurationInMs = () => {
    switch (selected) {
      case "Fast":
        return 5000; // 5s
      case "Medium":
        return 9000; // 9s
      case "Slow":
      default:
        return 13000; // 13s
    }
  };

  useEffect(() => {
    setScrollPosition(120);
    lastFrameTimeRef.current = null;
  }, [animationKey]);

  useEffect(() => {
    if (
      showBearDance ||
      showFinalState ||
      !scrollContainerRef.current ||
      !textBlockRef.current
    ) {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      lastFrameTimeRef.current = null;
      return;
    }

    const containerHeight = scrollContainerRef.current.clientHeight;
    const textHeight = textBlockRef.current.clientHeight;

    if (containerHeight === 0 || textHeight === 0) {
      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      return;
    }

    const textHeightPercent = (textHeight / containerHeight) * 100;
    const endPositionPercent = -textHeightPercent;

    const startPositionPercent = 90;

    const totalDistancePercent = startPositionPercent - endPositionPercent;

    const durationMs = getDurationInMs();
    const speedPercentPerMs = totalDistancePercent / durationMs;

    const animateScroll = (timestamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
        return;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      const positionChangePercent = speedPercentPerMs * deltaTime;

      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition - positionChangePercent;

        if (newPosition <= endPositionPercent) {
          const overshootPercent = endPositionPercent - newPosition;
          return startPositionPercent - overshootPercent;
        } else {
          return newPosition;
        }
      });

      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      lastFrameTimeRef.current = null;
    };
  }, [
    showBearDance,
    showFinalState,
    animationKey,
    selected,
    scrollContainerRef.current,
    textBlockRef.current,
  ]);

  const startReadingFlow = () => {
    setShowContent(false);
    setShowSentence(false);
    setAnimationCompleted(false);
    setPaused(false);
    setShowBearDance(false);
    setShowConfetti(false);
    setShowFinalState(false);
    setShowResult(false);
    setHoveredWord(null);
    setIsSpeaking(false);
    setResetTimer(true);

    setScrollPosition(120);
    lastFrameTimeRef.current = null;
  };

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [selected]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        setShowSentence(true);
      }, 200);
    }
  }, [showContent]);

  const handlePauseClick = () => {
    // Capture transcript BEFORE stopping
    const currentTranscript = (
      transcript ||
      transcriptRef.current ||
      ""
    ).trim();

    // Stop listening
    SpeechRecognition.stopListening();
    const finalSimilarity = getSimilarity(
      currentTranscript,
      currentSentence.sentence
    );
    const finalIsMatch = finalSimilarity >= 0.6;

    // Update isMatch state with final calculation
    setIsMatch(finalIsMatch);

    setFinalTranscript(currentTranscript);
    setPaused(true);
    setShowBearDance(true);
    setShowConfetti(true);

    const audio = new Audio(correctSound);
    audio.play();

    setTimeout(() => {
      setShowConfetti(false);
      setShowBearDance(false);
      setShowFinalState(true);
      setShowResult(true);
    }, 3000);
  };
  const handleNextClick = (e) => {
    e.stopPropagation();
    handleReadingSpeedNext();
  };

  const handleRetryClick = (e) => {
    e.stopPropagation();
    startReadingFlow();
  };

  const handleSpeakClick = () => {
    const lang = getLocalData("lang") || "en";

    setIsSpeaking(true);
    setShowContent(true);
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: getBrowserLanguage(lang),
    });
  };

  const getDuration = () => {
    switch (selected) {
      case "Fast":
        return "5s";
      case "Medium":
        return "9s";
      case "Slow":
      default:
        return "13s";
    }
  };

  let progressDatas = getLocalData("practiceProgress");
  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  let currentLevel = practiceSteps?.[currentPracticeStep]?.titleNew || "L1";
  let apiLevel = `M${level}-${currentLevel}`;

  if (level >= 4 && level <= 9) {
    currentLevel = practiceSteps?.[currentPracticeStep]?.name;
    apiLevel = `M${level}-${currentLevel}`;
  }

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    const base64Data = "";

    await callTelemetryApi(
      currentSentence?.sentence,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      currentSentence?.sentence,
      apiLevel
    );
  };

  const playWordAudio = (audio) => {
    if (!audio || !audioRefs.current) return;

    if (!audioRefs.current.paused) {
      return;
    }

    audioRefs.current.src = audio;
    audioRefs.current.currentTime = 0;
    audioRefs.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  const handleAudioEnd = () => {
    if (audioRefs.current) {
      audioRefs.current.pause();
      audioRefs.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleReadingSpeedNext = () => {
    setLocalData("speed", selected);
    callTelemetry();
    handleNext();
    setShowReadingSpeed(false);
    setShowContent(false);
    setShowSentence(false);
    setAnimationCompleted(false);
    setPaused(false);
    setShowBearDance(false);
    setShowConfetti(false);
    setShowFinalState(false);
    setShowResult(false);
    setHoveredWord(null);
    setIsSpeaking(false);

    const allWordsData = Object.keys(parentWords).map((word) => {
      const contentId = parentWords[word].content_id;

      return {
        original_text: word,
        content_id: contentId,
        milestone_level: `m${level}`,
        practice_level: currentLevel,
        session_id: sessionId,
        practiced: true,
        learned: true,
        subsession_id: "session_123",
      };
    });
    setLocalData("correctPracticeWords", [
      ...(correctPracticeWords || []),
      ...allWordsData,
    ]);

    setScrollPosition(120);
    lastFrameTimeRef.current = null;

    setCurrentSentenceIndex(
      (prevIndex) => (prevIndex + 1) % sentencesData.length
    );
  };

  const handleSpeedSelect = (speedValue) => {
    setSelected(speedValue);
    setHasSpeedBeenSelected(true);
    setLocalData("speed", speedValue);

    startReadingFlow();
  };

  const handleWordHover = (word, event) => {
    if (
      event.target.classList.contains("underlined-word") &&
      currentSentence.underlinedWords.includes(word)
    ) {
      setHoveredWord(word);

      const rect = event.target.getBoundingClientRect();
      const containerRect = whiteContainerRef.current.getBoundingClientRect();

      setHintPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.bottom - containerRect.top + 5,
      });

      if (showFinalState && currentSentence.hints[word]) {
        playWordAudio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentSentence.hints[word]}`
        );
      }
    }
  };

  const handleWordClick = (word, event) => {
    if (
      event.target.classList.contains("underlined-word") &&
      currentSentence.underlinedWords.includes(word) &&
      currentSentence.hints[word]
    ) {
      playWordAudio(
        `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentSentence.hints[word]}`
      );
    }
  };

  const handleWordLeave = () => {
    setHoveredWord(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const renderUnderlinedText = (text, underlinedWords) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:"]/g, "");
      const isUnderlined = underlinedWords.includes(cleanWord);

      if (isUnderlined) {
        return (
          <span
            key={index}
            className="underlined-word"
            style={{
              textDecoration: "underline",
              textDecorationColor: "rgba(255, 127, 54, 0.5)",
              textUnderlineOffset: "3px",
              marginRight: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => handleWordHover(cleanWord, e)}
            onMouseLeave={handleWordLeave}
            onClick={(e) => handleWordClick(cleanWord, e)}
          >
            {word}
          </span>
        );
      } else {
        return (
          <span key={index} style={{ marginRight: "6px" }}>
            {word}
          </span>
        );
      }
    });
  };

  const renderReadingScreen = () => {
    if (showFinalState) {
      return (
        <div
          style={{
            width: "90%",
            height: "68vh",
            background: `url(${backgroundImg}) center/cover no-repeat`,
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            position: "relative",
          }}
        >
          <img
            src={hintimg}
            alt="hint"
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "20px",
              left: "20px",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={() => {}}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={wellImg}
              alt="well"
              style={{ width: "80px", marginBottom: "10px" }}
            />
            <h2
              style={{
                color: "#333f61",
                fontWeight: "700",
                fontSize: "35px",
                fontFamily: "Quicksand",
              }}
            >
              Well Done!
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFF4E6",
              border: "1px solid rgba(241, 153, 32, 1)",
              borderRadius: "12px",
              padding: "15px 30px",
              fontFamily: "Quicksand",
              fontWeight: 600,
              fontSize: "22px",
              color: "rgba(51, 63, 97, 1)",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "30px",
              gap: "15px",
            }}
          >
            <img
              src={bookImg}
              alt="book"
              style={{ width: "35px", height: "40px" }}
            />
            {isMatch ? (
              <span style={{ fontWeight: "bold" }}>
                You spoke the paragraph correctly
              </span>
            ) : (
              <span style={{ fontWeight: "bold" }}>
                Please try again, your speech didn't match enough
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <RetryIcon
              height={50}
              width={50}
              style={{ cursor: "pointer" }}
              onClick={handleRetryClick}
            />
            <img
              src={nextImg}
              alt="next"
              style={{ width: "50px", cursor: "pointer" }}
              onClick={(e) => handleNextClick(e)}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={whiteContainerRef}
        className="whiteContainer"
        style={{
          width: "90%",
          height: "68vh",
          maxWidth: "1200px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <audio ref={audioRefs} onEnded={handleAudioEnd} hidden />
        <img
          src={hintimg}
          alt="hint"
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "20px",
            left: "20px",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        />

        {/* ✅ Common Modal */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                position: "relative",
                background: "#000",
                padding: "10px",
                borderRadius: "12px",
                maxWidth: "90%",
                width: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              <iframe
                width="100%"
                height="340"
                src="https://www.youtube.com/embed/a0CqaBnLiro?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        {!showBearDance && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "140px" : "180px",
              right: isMobile ? "-12px" : "20px",
              zIndex: 1000,
              background: "#fff",
              padding: isMobile ? "6px" : "8px",
              borderRadius: "12px",
              transform: isMobile ? "scale(0.9)" : "scale(1)",
            }}
          >
            <SpeedSelector onSelect={handleSpeedSelect} selected={selected} />
          </div>
        )}

        {!showBearDance && (
          <div style={{ marginBottom: "15px" }}>
            <CircularTimer duration={30} isActive={true} />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          style={{
            width: "60%",
            height: showBearDance ? "auto" : "90%",
            border: "2px dashed #FF6600",
            borderRadius: "18px",
            background: "rgba(255, 102, 0, 0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            position: "relative",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            ref={textBlockRef}
            key={animationKey}
            style={{
              position: showBearDance ? "relative" : "absolute",
              width: "80%",
              textAlign: "center",
              fontWeight: "700",
              fontSize: "20px",
              lineHeight: "1.4",
              color: "rgba(51, 63, 97, 1)",
              top: showBearDance ? "0" : `${scrollPosition}%`,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {currentSentence.sentence}
          </div>

          <style>
            {`
              /* @keyframes floatUp is no longer needed */
            `}
          </style>
        </div>

        {!isSpeaking && !showFinalState && !showBearDance && (
          <img
            src={speakButton}
            alt="speak"
            style={{
              width: "60px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
            onClick={handleSpeakClick}
          />
        )}

        <div
          style={{
            marginTop: "-20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {isSpeaking && !paused && !showBearDance && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                marginTop: "8px",
              }}
            >
              <img
                src={graphImg}
                alt="graph"
                style={{
                  width: "190px",
                }}
              />
              <img
                src={pauseImg}
                alt="pause"
                style={{
                  width: "50px",
                  cursor: "pointer",
                }}
                onClick={handlePauseClick}
              />
            </div>
          )}

          {showBearDance && !showFinalState && (
            <img
              src={beardanceImg}
              alt="bear dance"
              style={{
                width: "170px",
                height: "170px",
              }}
            />
          )}
        </div>

        {showConfetti && showBearDance && <Confetti recycle={false} />}
      </div>
    );
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      answer={"answer"}
      isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      recAudio={"recAudio"}
      isCorrect={true}
      lang={"language"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      <div
        style={{
          width: "100%",
          background: "linear-gradient(to bottom, #fff7ef, #ffeede)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderReadingScreen()}
      </div>
    </MainLayout>
  );
};

export default FluencyP5;
