import React, { useEffect, useState } from "react";
import headerImg from "../../assets/headerImg.svg";
import nextImg from "../../assets/nextImg.svg";
import beardanceImg from "../../assets/beardance.svg";
import Confetti from "react-confetti";
import rabbitImg from "../../assets/rabbit.svg";
import cheetahImg from "../../assets/cheetah.svg";
import tortoiseImg from "../../assets/tortoise.svg";
import meterImg from "../../assets/meterimg.svg";
import MainLayout from "../Layouts.jsx/MainLayout";
import SpeedSelector from "../../utils/SpeedSelector";
import { tickImg } from "../../utils/imageAudioLinks";
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
import wrongSound from "../../assets/audio/wrong.wav";
import { Log } from "../../services/telementryService";
import hintimg from "../../assets/hintsicon.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

function CircularTimer({ duration = 3, onComplete, paused }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (paused) return;

    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, paused]);

  return (
    <div
      style={{
        fontWeight: "700",
        fontSize: "36px",
        color: "#FF6600",
        textAlign: "center",
      }}
    >
      {timeLeft > 0 ? timeLeft : null}
    </div>
  );
}
const theme = createTheme();

const FluencyP3 = ({
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
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const [noClicked, setNoClicked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomFinalWord, setRandomFinalWord] = useState({});
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [showWordAfterYes, setShowWordAfterYes] = useState(false);
  const [questionStage, setQuestionStage] = useState(0); // 0 = first question, 1 = second question
  const [currentQuestionWord, setCurrentQuestionWord] = useState("");
  const [open, setOpen] = useState(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const wordList = [
    "write",
    "them",
    "they",
    "let",
    "these",
    "words",
    "from",
    "one",
    "which",
    "class",
    "there",
    "water",
    "friend",
    "food",
    "how",
    "like",
    "tree",
    "give",
    "help",
    "very",
    "unit",
    "picture",
    "animal",
    "teacher",
    "house",
    "day",
    "make",
    "said",
    "read",
    "use",
    "activity",
    "after",
    "follow",
    "school",
    "bird",
    "many",
    "question",
    "below",
    "play",
    "why",
    "here",
    "should",
    "sentence",
    "answer",
    "into",
    "observe",
    "plant",
    "small",
    "boy",
    "teeth",
    "new",
    "more",
    "story",
    "lesson",
    "name",
    "game",
    "get",
    "poem",
    "sea",
    "eat",
    "people",
    "down",
    "put",
    "thing",
    "then",
    "place",
  ];

  const [selected, setSelected] = useState(() => {
    const savedSpeed = getLocalData("speed");
    return savedSpeed || "Slow";
  });
  const [showContent, setShowContent] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState("Slow");
  const [startTime, setStartTime] = useState(null);

  const allSentences = contentSourceData?.map((item) => {
    const sentence = item?.contentSourceData[0]?.text || "";
    const words = sentence?.replace(/[.,!?]/g, "").split(" ");

    return words.map((word, index) => ({
      id: index + 1,
      word,
    }));
  });

  const currentSentence = allSentences[currentSentenceIndex];

  const getSpeedBackground = () => {
    switch (selected) {
      case "Fast":
        return "linear-gradient(to bottom, #e8f4fd, #c2e6ff)";
      case "Medium":
        return "linear-gradient(to bottom, #fff0e6, #ffd9b3)";
      case "Slow":
      default:
        return "linear-gradient(to bottom, #fff7ef, #ffeede)";
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
    const sentenceText =
      currentSentence?.map((wordObj) => wordObj.word).join(" ") || "";

    await callTelemetryApi(
      sentenceText,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      sentenceText,
      apiLevel
    );
  };
  console.log("cur", currentSentence.sentence);

  const startReadingFlow = () => {
    setShowContent(false);
    setCurrentWordIndex(0);
    setShowFinalScreen(false);
    setShowWordAfterYes(false);
    setYesClicked(false);
    setNoClicked(false);
    setQuestionStage(0); // Reset to first question
    setResetTimer(true);
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
        setParentModalOpen(true); // Modal OPEN → Timer Must NOT Run
      } else {
        setParentModalOpen(false); // Modal CLOSED → Timer can run
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showContent) {
      if (currentWordIndex < currentSentence.length - 1) {
        const timer = setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1);
        }, getWordSpeed());
        return () => clearTimeout(timer);
      } else if (currentWordIndex === currentSentence.length - 1) {
        const lastWordTimer = setTimeout(() => {
          setShowFinalScreen(true);
          // Set the word for first question
          setCurrentQuestionWord(randomFinalWord[currentSentenceIndex]);
        }, getWordSpeed());
        return () => clearTimeout(lastWordTimer);
      }
    }
  }, [showContent, currentWordIndex, currentSentence]);

  const getWordSpeed = () => {
    switch (selected) {
      case "Fast":
        return 500;
      case "Medium":
        return 1000;
      case "Slow":
      default:
        return 1500;
    }
  };

  const handleStop = () => {
    //if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;
    console.log("time taken........", duration);

    if (duration <= 10) {
      setReadingSpeed("Fast");
    } else if (duration <= 20) {
      setReadingSpeed("Medium");
    } else {
      setReadingSpeed("Slow");
    }
  };

  useEffect(() => {
    if (currentSentence && currentSentence.length > 0) {
      setRandomFinalWord((prev) => {
        if (prev[currentSentenceIndex]) {
          return prev;
        }
        const randomIndex = Math.floor(Math.random() * currentSentence.length);
        const randomWord = currentSentence[randomIndex]?.word;
        return {
          ...prev,
          [currentSentenceIndex]: randomWord,
        };
      });
    }
  }, [currentSentence, currentSentenceIndex]);

  useEffect(() => {
    if (getLocalData("speed")) {
      startReadingFlow();
    }
  }, []);

  const handleSpeedSelect = (speedValue) => {
    setSelected(speedValue);
    setLocalData("speed", speedValue);
    startReadingFlow();
  };

  // YES click - FIXED: Always show word with tick for both questions
  const handleYesClick = () => {
    setYesClicked(true);
    setNoClicked(false);

    if (questionStage === 0) {
      // ✅ First question YES = Correct
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowWordAfterYes(true); // show tick + next
        setYesClicked(false);
      }, 1500);
    } else {
      // ❌ Second question YES = Wrong
      const audio = new Audio(wrongSound);
      audio.play();

      // FIX: Still show the word with tick even for wrong answer
      setTimeout(() => {
        setShowWordAfterYes(true); // show tick + next
        setYesClicked(false);
      }, 1000);
    }
  };

  // NO click - FIXED: Always show word with tick for both questions
  const handleNoClick = () => {
    setNoClicked(true);
    setYesClicked(false);

    if (questionStage === 0) {
      // ❌ First question NO = Wrong
      const audio = new Audio(wrongSound);
      audio.play();

      // FIX: Still show the word with tick even for wrong answer
      setTimeout(() => {
        setShowWordAfterYes(true); // show tick + next
        setNoClicked(false);
      }, 1000);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowWordAfterYes(true);
        setNoClicked(false);
      }, 1500);
    }
  };

  const handleNextWord = () => {
    setShowWordAfterYes(false);
    setYesClicked(false);
    setNoClicked(false);

    if (questionStage === 0) {
      // Move directly to 2nd question
      setQuestionStage(1);
      setShowContent(false);
      const wordIndex = currentSentenceIndex % wordList.length;
      setCurrentQuestionWord(wordList[wordIndex]);
    } else {
      // Move to next sentence or show results
      setShowFinalScreen(false);
      setShowWordAfterYes(false);
      setIsTransitioning(true);
      setShowResultScreen(true);

      if (currentSentenceIndex + 1 < allSentences.length) {
        handleStop();
        setCurrentSentenceIndex((prev) => prev + 1);
        setQuestionStage(0);

        setTimeout(() => {
          startReadingFlow();
          setIsTransitioning(false);
        }, 800);
      } else {
        setShowResultScreen(true);
        setIsTransitioning(false);
      }
    }
  };

  const handleRetry = () => {
    startReadingFlow();
  };

  // Helper function to render bear animation with correct positioning
  const renderBearAnimation = () => {
    // First question: Bear appears for YES (centered)
    if (yesClicked && questionStage === 0) {
      return (
        <img
          src={beardanceImg}
          alt="Beardance"
          style={{
            position: "absolute",
            bottom: -42,
            left: "50%",
            transform: "translateX(-50%)",
            height: "200px",
            animation: "jump 1.3s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          draggable={false}
        />
      );
    }

    // Second question: Bear appears for NO (centered)
    if (noClicked && questionStage === 1) {
      return (
        <img
          src={beardanceImg}
          alt="Beardance"
          style={{
            position: "absolute",
            bottom: -42,
            left: "50%",
            transform: "translateX(-50%)",
            height: "200px",
            animation: "jump 1.3s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          draggable={false}
        />
      );
    }

    return null;
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
          background: getSpeedBackground(),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
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
                src={`https://www.youtube.com/embed/j7eGsTYG9uM?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            height: "400px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0px 20px 10px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "103.2%" }}>
            <img
              src={headerImg}
              alt="header"
              style={{ width: "100%", borderRadius: "12px 12px 0 0" }}
            />
          </div>

          {showResultScreen ? (
            <div
              style={{
                marginTop: isMobile ? "5px" : "8px",
                marginBottom: isMobile ? "5px" : "8px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {/* Top Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isMobile ? "6px" : "8px",
                  marginBottom: isMobile ? "5px" : "8px",
                }}
              >
                <img
                  src={meterImg}
                  alt="speed meter"
                  style={{
                    width: isMobile ? "30px" : isTablet ? "35px" : "40px",
                  }}
                />

                <h2
                  style={{
                    fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
                    fontWeight: "600",
                    color: "#333F61",
                    margin: 0,
                  }}
                >
                  Your overall reading speed
                </h2>
              </div>

              {/* Meter Items */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: isMobile ? "8px" : "15px",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  marginBottom: isMobile ? "5px" : "8px",
                }}
              >
                {/* Slow */}
                <div
                  style={{
                    padding: isMobile ? "6px" : "10px",
                    borderRadius: "10px",
                    background: readingSpeed === "Slow" ? "#fff7e6" : "#f9f9f9",
                    border:
                      readingSpeed === "Slow"
                        ? "1px solid #ff9900"
                        : "1px solid #ddd",
                    opacity: readingSpeed === "Slow" ? 1 : 0.5,
                    width: isMobile ? "80px" : "auto",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={tortoiseImg}
                    alt="tortoise"
                    height={isMobile ? 28 : 35}
                  />
                  <div
                    style={{
                      marginTop: "3px",
                      fontWeight: "600",
                      fontSize: isMobile ? "13px" : "14px",
                    }}
                  >
                    Slow
                  </div>
                </div>

                {/* Medium */}
                <div
                  style={{
                    padding: isMobile ? "6px" : "10px",
                    borderRadius: "10px",
                    background:
                      readingSpeed === "Medium" ? "#fff7e6" : "#f9f9f9",
                    border:
                      readingSpeed === "Medium"
                        ? "1px solid #ff9900"
                        : "1px solid #ddd",
                    opacity: readingSpeed === "Medium" ? 1 : 0.5,
                    width: isMobile ? "80px" : "auto",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={rabbitImg}
                    alt="rabbit"
                    height={isMobile ? 28 : 35}
                  />
                  <div
                    style={{
                      marginTop: "3px",
                      fontWeight: "600",
                      fontSize: isMobile ? "13px" : "14px",
                    }}
                  >
                    Medium
                  </div>
                </div>

                {/* Fast */}
                <div
                  style={{
                    padding: isMobile ? "6px" : "10px",
                    borderRadius: "10px",
                    background: readingSpeed === "Fast" ? "#fff7e6" : "#f9f9f9",
                    border:
                      readingSpeed === "Fast"
                        ? "1px solid #ff9900"
                        : "1px solid #ddd",
                    opacity: readingSpeed === "Fast" ? 1 : 0.5,
                    width: isMobile ? "80px" : "auto",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={cheetahImg}
                    alt="cheetah"
                    height={isMobile ? 28 : 35}
                  />
                  <div
                    style={{
                      marginTop: "3px",
                      fontWeight: "600",
                      fontSize: isMobile ? "13px" : "14px",
                    }}
                  >
                    Fast
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <img
                src={nextImg}
                alt="next"
                onClick={() => {
                  handleNext();
                  callTelemetry();
                  setReadingSpeed("Slow");
                  setStartTime(null);
                  setShowResultScreen(false);
                }}
                style={{
                  marginTop: isMobile ? "5px" : "8px",
                  marginBottom: isMobile ? "5px" : "8px",
                  width: isMobile ? "38px" : "42px",
                  cursor: "pointer",
                  alignSelf: "center",
                }}
              />
            </div>
          ) : showWordAfterYes ? (
            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  marginBottom: "60px",
                }}
              >
                <img
                  src={tickImg}
                  alt="Correct"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                />

                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "42px",
                    color: "rgba(51, 63, 97, 1)",
                    textAlign: "center",
                  }}
                >
                  {currentQuestionWord}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: "20px",
                }}
              >
                <div
                  onClick={handleRetry}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <RetryIcon
                    height={50}
                    width={50}
                    style={{ cursor: "pointer" }}
                    onClick={handleRetry}
                  />
                </div>

                <div
                  onClick={handleNextWord}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={nextImg}
                    alt="Next"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : !showFinalScreen && !showContent ? (
            <div
              style={{
                marginTop: "40px",
                width: "80%",
                maxWidth: "500px",
                height: "100px",
                border: "1px dashed rgba(241, 153, 32, 1)",
                borderRadius: "18px",
                background: "rgba(255, 102, 0, 0.05)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                overflow: "hidden",
              }}
            >
              <CircularTimer
                key={resetTimer ? `timer-${Date.now()}` : "timer"}
                duration={3}
                paused={parentModalOpen}
                onComplete={() => {
                  if (parentModalOpen) return;
                  setReadingSpeed("Slow");
                  setStartTime(Date.now());
                  setShowContent(true);
                  setResetTimer(false);
                }}
              />
            </div>
          ) : !showFinalScreen ? (
            <>
              <div
                style={{
                  marginTop: "40px",
                  width: "80%",
                  maxWidth: "500px",
                  height: "100px",
                  border: "1px dashed rgba(241, 153, 32, 1)",
                  borderRadius: "18px",
                  background: "rgba(255, 102, 0, 0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "28px",
                    color: "rgba(51, 63, 97, 1)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentSentence[currentWordIndex]?.word}
                </div>
              </div>
              <div style={{ marginTop: "40px" }}>
                <SpeedSelector
                  onSelect={handleSpeedSelect}
                  selected={selected}
                />
              </div>
            </>
          ) : (
            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#333F61",
                  marginBottom: "20px",
                }}
              >
                Did you see the word?
              </div>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "700",
                  color: "#FF6600",
                  marginBottom: "64px",
                }}
              >
                {currentQuestionWord}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: isMobile ? "15px" : isTablet ? "30px" : "50px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={handleNoClick}
                  style={{
                    padding: isMobile
                      ? "10px 30px"
                      : isTablet
                      ? "12px 40px"
                      : "14px 54px",
                    fontSize: isMobile ? "18px" : isTablet ? "22px" : "26px",

                    borderRadius: "12px",
                    border:
                      noClicked && questionStage === 1
                        ? "1px solid rgba(88, 204, 2, 1)"
                        : noClicked && questionStage === 0
                        ? "1px solid rgba(255, 127, 54, 1)"
                        : "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    color:
                      noClicked && questionStage === 1
                        ? "rgba(88, 204, 2, 1)"
                        : noClicked && questionStage === 0
                        ? "rgba(255, 127, 54, 1)"
                        : "inherit",
                    fontWeight: noClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color:
                        noClicked && questionStage === 1
                          ? "rgba(88, 204, 2, 1)"
                          : noClicked && questionStage === 0
                          ? "rgba(255, 127, 54, 1)"
                          : "#888",
                    }}
                  >
                    ✖
                  </span>
                  No
                </button>

                <button
                  onClick={handleYesClick}
                  style={{
                    padding: isMobile
                      ? "10px 30px"
                      : isTablet
                      ? "12px 40px"
                      : "14px 54px",
                    fontSize: isMobile ? "18px" : isTablet ? "22px" : "26px",

                    borderRadius: "12px",
                    border:
                      yesClicked && questionStage === 0
                        ? "1px solid rgba(88, 204, 2, 1)"
                        : yesClicked && questionStage === 1
                        ? "1px solid rgba(255, 127, 54, 1)"
                        : "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    color:
                      yesClicked && questionStage === 0
                        ? "rgba(88, 204, 2, 1)"
                        : yesClicked && questionStage === 1
                        ? "rgba(255, 127, 54, 1)"
                        : "inherit",
                    fontWeight: yesClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color:
                        yesClicked && questionStage === 0
                          ? "rgba(88, 204, 2, 1)"
                          : yesClicked && questionStage === 1
                          ? "rgba(255, 127, 54, 1)"
                          : "#888",
                    }}
                  >
                    ✔
                  </span>
                  Yes
                </button>
              </div>

              {/* Render bear animation */}
              {renderBearAnimation()}
            </div>
          )}
        </div>

        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        <style>{`
        @keyframes jump {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
      </div>
    </MainLayout>
  );
};

export default FluencyP3;
