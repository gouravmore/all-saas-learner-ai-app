import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import headerImg from "../../assets/headerImg.svg";
import speakButton from "../../assets/speakButton.svg";
import listenBear from "../../assets/bearlisten.svg";
import graphImg from "../../assets/graphImg.svg";
import pauseImg from "../../assets/pauseImg.svg";
import bearImg from "../../assets/bearImg.svg";
import listenImg from "../../assets/listenImg.svg";
import nextImg from "../../assets/nextImg.svg";
import backgroundImg from "../../assets/starsandclouds.png";
import meterImg from "../../assets/meterimg.svg";
import tortoiseImg from "../../assets/TurtleCircle.gif";
import rabbitImg from "../../assets/RabbitCircle.gif";
import rocketImg from "../../assets/RocketCircle.gif";
import dogImg from "../../assets/dogimg.svg";
import langhint from "../../assets/laguagehint.svg";
import paraudio from "../../assets/parrotR1KanAudio.wav";
import MainLayout from "../Layouts.jsx/MainLayout";
import backimg from "../../assets/bacck.svg";
import bookImg from "../../assets/bookimg.svg";

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
import { getFontFamily } from "../../utils/fontUtils";
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
import hintimg from "../../assets/hintsicon.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

const sentencesData = [
  {
    id: 1,
    sentence: "The monkey is jumping",
    underlinedWords: ["monkey", "jumping"],
    hints: {
      monkey: paraudio,
      jumping: paraudio,
    },
  },
  {
    id: 2,
    sentence: "A child sleeps",
    underlinedWords: ["child", "sleeps"],
    hints: {
      child: paraudio,
      sleeps: paraudio,
    },
  },
  {
    id: 3,
    sentence: "Two birds are flying",
    underlinedWords: ["birds", "flying"],
    hints: {
      birds: paraudio,
      flying: paraudio,
    },
  },
  {
    id: 4,
    sentence: "Boys play soccer",
    underlinedWords: ["play", "boys"],
    hints: {
      play: paraudio,
      boys: paraudio,
    },
  },
  {
    id: 5,
    sentence: "The well has water",
    underlinedWords: ["well", "water"],
    hints: {
      well: paraudio,
      water: paraudio,
    },
  },
];

const UnderlinedSentence = ({
  sentence,
  underlinedWords,
  hints,
  showUnderlines,
  onWordHover,
  lang,
}) => {
  const words = sentence.split(" ");

  return (
    <p
      style={{
        fontSize: lang === "te" ? "24px" : "20px",
        fontWeight: lang === "te" ? "400" : "600",
        color: "rgba(51, 63, 97, 1)",
        fontFamily: getFontFamily(lang || "en"),
        fontStyle: "bold",
        textAlign: "center",
        lineHeight: "1.2",
        position: "relative",
      }}
    >
      {words.map((word, index) => {
        const isUnderlined = underlinedWords.includes(word);
        const cleanWord = word.replace(/[.,!?;]/g, "");

        return (
          <span
            key={index}
            style={{ position: "relative", display: "inline-block" }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-block",
                margin: "0 7px",
                cursor: isUnderlined && showUnderlines ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                if (isUnderlined && showUnderlines) {
                  const rect = e.target.getBoundingClientRect();
                  onWordHover(cleanWord, {
                    top: rect.bottom + 5,
                    left: rect.left + rect.width / 2,
                  });
                }
              }}
              onMouseLeave={() => {
                if (isUnderlined && showUnderlines) {
                  onWordHover(null, { top: 0, left: 0 });
                }
              }}
            >
              {word}
              {isUnderlined && showUnderlines && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    backgroundColor: "rgba(255, 127, 54, 0.5)",
                    borderRadius: "2px",
                  }}
                />
              )}
            </span>
            {index < words.length - 1 && " "}
          </span>
        );
      })}
    </p>
  );
};

const LanguageHint = ({ hint }) => {
  if (!hint) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "-60px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <img
        src={langhint}
        alt="hint icon"
        style={{
          width: "200px",
          height: "auto",
          userSelect: "none",
        }}
      />
    </div>
  );
};

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
        <img
          src={dogImg}
          alt="dog"
          style={{
            position: "absolute",
            width: "27px",
            height: "27px",
            top: "-13px",
            left: "calc(50% - 13.5px)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
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

const FluencyP4 = ({
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
  steps = 1;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [showTimers, setShowTimers] = useState(true);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const lang = getLocalData("lang");
  const [open, setOpen] = useState(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const buildSentencesData = (apiData) => {
    return apiData?.map((item, index) => {
      const sentence = item?.contentSourceData[0].text;
      const audio = item?.contentSourceData[0].audioUrl;
      const multilingualData = item?.multilingual_data || {};
      const contentId = item?.contentId;

      const underlinedWords = Object?.keys(multilingualData);

      const hints = underlinedWords?.reduce((acc, word) => {
        acc[word] =
          multilingualData[word]?.[multilingualLangCode]?.audio_url || null;
        return acc;
      }, {});

      return {
        id: index + 1,
        sentence,
        underlinedWords,
        hints,
        audio,
        contentId,
      };
    });
  };

  let sentencesData = [];

  if (contentSourceData && contentSourceData.length > 0) {
    sentencesData = buildSentencesData(contentSourceData);
  }

  const handleStart = () => {
    setStartTime(Date.now());
    setSpeed(null);
  };

  useEffect(() => {
    handleStart();
  }, []);
  useEffect(() => {
    let isMounted = true;

    const observer = new MutationObserver(() => {
      if (!isMounted) return;

      const modal =
        document.querySelector(".successHeader") ||
        document.querySelector('img[alt="gameWon"]') ||
        document.querySelector('img[alt="gameLost"]');

      if (modal) {
        setParentModalOpen(true);
      } else {
        setParentModalOpen(false);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  const handleStop = () => {
    if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;
    if (duration <= 30) {
      setSpeed("Fast");
    } else {
      setSpeed("Slow");
    }
  };

  console.log("speed", speed);
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

  const currentSentence = sentencesData[currentSentenceIndex];
  console.log("sentence", currentSentence);

  const playAudio = (word) => {
    const wordAudio = currentSentence.hints[word];
    if (wordAudio) {
      const audio = new Audio(wordAudio);
      audio.play().catch((err) => console.log("Audio play error:", err));
    }
  };

  const playWordAudio = (audio) => {
    if (!audio || !audioRef.current) return;

    if (!audioRef.current.paused) {
      console.log("Already playing, skipping...");
      return;
    }

    audioRef.current.src = audio;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        console.log("Playing word audio once:", audio);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleWordHover = (word, position) => {
    setHoveredWord(word);
    setHoverPosition(position);

    if (word) {
      playWordAudio(
        `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentSentence.hints[word]}`
      );
    }
  };

  const handleSpeakClick = () => {
    setIsSpeaking(true);
  };

  const handlePauseClick = () => {
    setShowConfetti(true);
    const audio = new Audio(correctSound);
    audio.play();

    setTimeout(() => {
      setShowConfetti(false);
      setShowExtras(true);
      if (currentSentenceIndex === sentencesData?.length - 1) {
        setShowTimers(false);
        setShowResult(true);
        setCurrentSentenceIndex(0);
        setShowExtras(true);
        setIsSpeaking(true);
        handleStop();
      } else {
        const nextIndex = (currentSentenceIndex + 1) % sentencesData.length;
        setCurrentSentenceIndex(nextIndex);
        setShowResult(false);
        setShowExtras(false);
        setIsSpeaking(false);
      }

      setHoveredWord(null);
    }, 100);
  };

  const handleNextClick = () => {
    const nextIndex = (currentSentenceIndex + 1) % sentencesData.length;
    setCurrentSentenceIndex(nextIndex);
  };

  const handleNextToFinal = () => {
    setShowFinalResult(true);
  };
  const handleBackClick = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  const isFirstSentence = currentSentenceIndex === 0;

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
          margin: "10px 0px",
          background: "linear-gradient(to bottom, #fff7ef, #ffeede)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            left: "0px",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        />

        {/* Modal */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "90vh",
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
              {/* Close Button */}
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

              {/* YouTube Video */}
              <iframe
                width="100%"
                height="340"
                src={`https://www.youtube.com/embed/gWuvShUt94g?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        <audio ref={audioRef} onEnded={handleAudioEnd} hidden />

        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        {!showFinalResult ? (
          <div
            style={{
              width: "90%",
              maxWidth: "1500px",
              height: "70vh",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "103.5%",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-19px",
              }}
            >
              <img
                src={headerImg}
                alt="header"
                style={{ width: "100%", borderRadius: "18px" }}
              />
            </div>

            {showTimers && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <CircularTimer duration={30} isActive={!parentModalOpen} />
              </div>
            )}

            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                borderRadius: "10px",
              }}
            >
              <UnderlinedSentence
                sentence={currentSentence.sentence}
                underlinedWords={currentSentence.underlinedWords}
                hints={currentSentence.hints}
                showUnderlines={showExtras}
                onWordHover={handleWordHover}
                lang={lang}
              />

              {hoveredWord && currentSentence?.hints[hoveredWord] && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                >
                  <img
                    src={langhint}
                    alt="language hint"
                    style={{
                      width: "190px",
                      height: "140px",
                      userSelect: "none",
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              {!isSpeaking ? (
                <img
                  src={speakButton}
                  alt="speak"
                  style={{ width: "60px", cursor: "pointer" }}
                  onClick={handleSpeakClick}
                />
              ) : !showResult ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={graphImg}
                    alt="graph"
                    style={{ width: "180px", marginBottom: "20px" }}
                  />
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{
                      width: "50px",
                      cursor: "pointer",
                      marginBottom: "15px",
                    }}
                    onClick={handlePauseClick}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "40px",
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={backimg}
                    alt="back"
                    onClick={handleBackClick}
                    style={{
                      width: "40px",
                      cursor: isFirstSentence ? "not-allowed" : "pointer",
                      opacity: isFirstSentence ? 0.5 : 1,
                    }}
                  />

                  {/* Next Button */}
                  <img
                    src={nextImg}
                    alt="next"
                    onClick={() => {
                      callTelemetry();
                      if (currentSentenceIndex > 0) {
                        handleNext();
                      }
                      if (currentSentenceIndex === sentencesData?.length - 1) {
                        handleNextToFinal();
                      } else {
                        handleNextClick();
                      }
                    }}
                    style={{
                      width: "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}
              {showResult && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    bottom: "80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {sentencesData.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        margin: "0 5px",
                        backgroundColor:
                          index === currentSentenceIndex
                            ? "rgba(0, 160, 255, 1)"
                            : "rgba(0, 160, 255, 0.3)",
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {isSpeaking && !showResult && (
              <img
                src={listenBear}
                alt="listen-bear"
                style={{
                  position: "absolute",
                  bottom: isMobile ? "-10px" : "0px",
                  left: isMobile ? "-20px" : "-50px",
                  width: isMobile ? "110px" : "190px",
                  height: "auto",
                  zIndex: 5,
                }}
              />
            )}
          </div>
        ) : (
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <img
                src={meterImg}
                alt="meter"
                style={{ width: "65px", marginRight: "8px" }}
              />
              <h2
                style={{
                  color: "#333f61",
                  fontWeight: "700",
                  fontSize: "30px",
                  fontFamily: "Quicksand",
                }}
              >
                Your Reading Speed
              </h2>
            </div>

            <div
              style={{
                marginTop: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={speed === "Fast" ? rocketImg : tortoiseImg}
                alt="tortoise"
                style={{ width: "60px" }}
              />
            </div>

            <h2
              style={{
                color: "#A66CFF",
                fontWeight: "700",
                fontSize: "27px",
                marginBottom: "10px",
                fontFamily: "Quicksand",
              }}
            >
              {speed}
            </h2>
            <p
              style={{
                color: "#333f61",
                fontSize: "22px",
                marginTop: "5px",
                marginBottom: "10px",
                fontFamily: "Quicksand",
                fontStyle: "bold",
                fontWeight: 600,
              }}
            >
              {speed === "Fast"
                ? "Great speed, keep it up!"
                : "Try reading faster"}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFF4E6",
                  border: "1px solid rgba(241, 153, 32, 1)",
                  borderRadius: "12px",
                  padding: "8px 25px",
                  fontFamily: "Quicksand",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "rgba(51, 63, 97, 1)",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                  marginBottom: "30px",
                  gap: "10px",
                }}
              >
                <img
                  src={bookImg}
                  alt="book"
                  style={{ width: "30px", height: "25px" }}
                />
                <span>You read 5 sentences in 30 seconds</span>
              </div>

              <img
                src={nextImg}
                onClick={() => {
                  handleNext();
                }}
                alt="next"
                style={{
                  width: "45px",
                  height: "45px",
                  cursor: "pointer",
                  marginBottom: "30px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FluencyP4;
