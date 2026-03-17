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
import dogImg from "../../assets/dogimg.svg";
import langhint from "../../assets/laguagehint.svg";
import paraudio from "../../assets/parrotR1KanAudio.wav";
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
import tortoiseImg from "../../assets/TurtleCircle.gif";
import rabbitImg from "../../assets/RabbitCircle.gif";
import rocketImg from "../../assets/RocketCircle.gif";
import hintimg from "../../assets/hintsicon.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

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
        fontSize: lang === "te" ? "34px" : "30px",
        fontWeight: lang === "te" ? "400" : "600",
        color: "rgba(51, 63, 97, 1)",
        fontFamily: getFontFamily(lang || "en"),
        fontStyle: "bold",
        textAlign: "center",
        lineHeight: "1.5",
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
                margin: "0 2px",
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
        }}
      />
    </div>
  );
};

function CircularTimer({ duration = 10, isActive = true }) {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [elapsed, setElapsed] = React.useState(0);

  const radius = 30;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * radius;

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
          color: timeLeft === 0 ? "red" : "#ff6600", // 🔥 condition lagayi
        }}
      >
        {timeLeft}
      </div>
    </div>
  );
}
const theme = createTheme();

const FluencyP1 = ({
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
  const [speed, setSpeed] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const correctPracticeWords = getLocalData("correctPracticeWords");
  const sessionId = getLocalData("sessionId");
  const lang = getLocalData("lang");
  const [open, setOpen] = useState(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const handleStart = () => {
    setStartTime(Date.now());
    setSpeed(null);
  };
  useEffect(() => {
    let isMounted = true;

    const observer = new MutationObserver(() => {
      if (!isMounted) return;

      const modal =
        document.querySelector(".successHeader") ||
        document.querySelector('img[alt="gameWon"]') ||
        document.querySelector('img[alt="gameLost"]');

      if (modal) {
        setParentModalOpen(true); // ❌ parent modal OPEN → Stop timer
      } else {
        setParentModalOpen(false); // ▶ parent modal CLOSED → Resume timer
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
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
  let currentLevel = practiceSteps?.[currentPracticeStep]?.title || "L1";

  let apiLevel = `M${level}-${currentLevel}`;

  if (level >= 4 && level <= 9) {
    currentLevel = practiceSteps?.[currentPracticeStep]?.name;
    apiLevel = `M${level}-${currentLevel}`;
  }

  useEffect(() => {
    handleStart();
  }, [parentWords]);

  const handleStop = () => {
    if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;
    if (duration <= 10) {
      setSpeed("Fast");
    } else {
      setSpeed("Slow");
    }
  };

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

  console.log("FluencyP1Data:", parentWords);

  const handleFinalAdd = () => {
    if (!parentWords) return;

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

    console.log("Added all words at final:", allWordsData);
  };

  //console.log("P1 Data", parentWords);

  const handleNextWord = () => {
    handleNext();
    callTelemetry();
    setStartTime(null);
    setIsSpeaking(false);
    setShowResult(false);
    setShowExtras(false);
    setShowFinalResult(false);
    setShowTimers(true);
    setHoveredWord(null);
    setCurrentSentenceIndex(0);
    handleFinalAdd();
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
    handleStop();
    setShowTimers(false);
    setShowResult(true);
    setShowConfetti(true);
    const audio = new Audio(correctSound);
    audio.play();

    setTimeout(() => {
      setShowConfetti(false);
      setShowExtras(true);
    }, 3000);
  };

  const handleNextClick = () => {
    const nextIndex = (currentSentenceIndex + 1) % sentencesData.length;
    setCurrentSentenceIndex(nextIndex);

    setIsSpeaking(false);
    setShowResult(false);
    setShowExtras(false);
    setShowTimers(true);
    setHoveredWord(null);
  };

  const handleNextToFinal = () => {
    setShowFinalResult(true);
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
          margin: "10px 0",
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
            left: "20px",
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
                src={`https://www.youtube.com/embed/Xk5Fl41ACgc?autoplay=1`}
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
              height: "460px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              paddingBottom: "40px",
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
                  marginBottom: "20px",
                }}
              >
                <CircularTimer duration={9} isActive={!parentModalOpen} />
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: isSpeaking ? "0" : "30px",
                position: "relative",
              }}
            >
              {showExtras && (
                <img
                  src={listenImg}
                  onClick={() => {
                    playWordAudio(
                      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
                    );
                  }}
                  alt="listen"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                />
              )}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
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

                <LanguageHint
                  hint={hoveredWord ? currentSentence.hints[hoveredWord] : null}
                  position={hoverPosition}
                />
              </div>
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
                  }}
                >
                  <img
                    src={graphImg}
                    alt="graph"
                    style={{ width: "220px", marginBottom: "40px" }}
                  />
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{ width: "50px", cursor: "pointer" }}
                    onClick={handlePauseClick}
                  />
                </div>
              ) : showExtras ? (
                <img
                  src={nextImg}
                  alt="next"
                  onClick={
                    currentSentenceIndex === sentencesData.length - 1
                      ? handleNextToFinal
                      : handleNextClick
                  }
                  style={{
                    width: "50px",
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <img
                  src={bearImg}
                  alt="bear"
                  style={{
                    width: "200px",
                    position: "absolute",
                    bottom: "0px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </div>

            {/* Listen Bear */}
            {isSpeaking && !showResult && (
              <img
                src={listenBear}
                alt="listen-bear"
                style={{
                  position: "absolute",
                  bottom: "0px",
                  left: "10px",
                  width: isMobile ? "120px" : "250px",
                }}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              width: "90%",
              //maxWidth: "1500px",
              height: "400px",
              background: `url(${backgroundImg}) center/cover no-repeat`,
              borderRadius: "12px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              position: "relative",
              //backgroundColor: "linear-gradient(to bottom, #fff7ef, #ffeede)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <img
                src={meterImg}
                alt="meter"
                style={{ width: "70px", marginRight: "8px" }}
              />
              <h2
                style={{
                  color: "#333f61",
                  fontWeight: "700",
                  fontSize: "35px",
                  fontFamily: "Quicksand",
                }}
              >
                Your Reading Speed
              </h2>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={speed === "Fast" ? rocketImg : tortoiseImg}
                alt="tortoise"
                style={{ width: "70px" }}
              />
            </div>

            <h2
              style={{
                color: "#A66CFF",
                fontWeight: "700",
                fontSize: "28px",
                marginBottom: "10px",
                fontFamily: "Quicksand",
              }}
            >
              {speed}
            </h2>
            <p
              style={{
                color: "#333f61",
                fontSize: "24px",
                margin: "10px 20px",
                fontFamily: "Quicksand",
                fontStyle: "bold",
                fontWeight: 600,
              }}
            >
              {speed === "Fast"
                ? "Great speed, keep it up!"
                : "Try reading faster"}
            </p>

            <img
              src={nextImg}
              onClick={() => {
                handleNextWord();
              }}
              alt="next"
              style={{
                marginTop: "20px",
                width: "45px",
                height: "45px",
                margin: "10px 20px",
                cursor: "pointer",
              }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FluencyP1;
