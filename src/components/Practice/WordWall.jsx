import React, { useEffect, useState, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import backgroundImg from "../../assets/backgrounds.svg";
import clickbubbleImg from "../../assets/clickbubble.svg";
import wrongBoxImg from "../../assets/wrongBox.svg";
import correctBoxImg from "../../assets/correctBox.svg";
import wrongSignImg from "../../assets/wrongsign.svg";
import correctSignImg from "../../assets/correctsign.svg";
import bubbleDropsImg from "../../assets/bubbleDropImg.svg";
import giftboxImg from "../../assets/giftbox.svg";
import giftopenImg from "../../assets/giftopen.svg";
import modalgiftboxImg from "../../assets/modalgiftImg.png";
import giftIcon from "../../assets/giftbox.svg";
import Confetti from "react-confetti";
import nexttImg from "../../assets/nextt.svg";
import listenblueImg from "../../assets/listenblue.svg";
import listenvioletImg from "../../assets/listenviolet.svg";
import Lottie from "lottie-react";
import Giftbox from "../../assets/Giftbox.json";
import { getCorrectPracticeWords } from "../../services/orchestration/orchestrationService";
import { shuffle } from "lodash";
import { getLocalData, setLocalData } from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import giftscoreImg from "../../assets/giftscore.svg";
import redboxImg from "../../assets/redbox.svg";
import greenboxImg from "../../assets/greenbox.svg";
import nextimg from "../../assets/nxxt.svg";
import redsmileImg from "../../assets/redsmile.svg";
import greenstarImg from "../../assets/greenstar.svg";
import { useNavigate } from "react-router-dom";

const gameData = [
  {
    images: [
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/f9089145-068a-41bd-be3b-dfb60e9c970e.png",
        text: "Apple",
        audio_en:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_audios/b2a39def-9a1e-4ec3-9793-03d79e3d3d52.mp3",
        audio_hi: "https://example.com/audio1a_hi.mp3",
        isCorrect: true,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/6e72fd11-0923-4b65-b468-a7b40d7b9f0b.png",
        text: "Boy",
        audio_en: "https://example.com/audio1b_en.mp3",
        audio_hi: "https://example.com/audio1b_hi.mp3",
        isCorrect: false,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/a505128b-ba14-4fb5-bd73-d4e236a9152c.png",
        text: "Family",
        audio_en: "https://example.com/audio1c_en.mp3",
        audio_hi: "https://example.com/audio1c_hi.mp3",
        isCorrect: false,
      },
    ],
  },
  {
    images: [
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/93463bfd-83e2-4ff1-a572-4a6618ae5fcf.png",
        text: "Singer",
        audio_en: "https://example.com/audio2a_en.mp3",
        audio_hi: "https://example.com/audio2a_hi.mp3",
        isCorrect: false,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/6c7e4122-3704-436c-82bb-6195b61cf8da.png",
        text: "Ship",
        audio_en: "https://example.com/audio2b_en.mp3",
        audio_hi: "https://example.com/audio2b_hi.mp3",
        isCorrect: true,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/5733edee-1aff-43d4-bb6a-a1a0217f5094.png",
        text: "Lotus",
        audio_en: "https://example.com/audio2c_en.mp3",
        audio_hi: "https://example.com/audio2c_hi.mp3",
        isCorrect: false,
      },
    ],
  },
  {
    images: [
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/ab05f9ae-f242-4852-9266-1ecd1395af85.png",
        text: "Tabala",
        audio_en: "https://example.com/audio3a_en.mp3",
        audio_hi: "https://example.com/audio3a_hi.mp3",
        isCorrect: false,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/a696c167-772d-4e63-90c5-fa0481fe2057.png",
        text: "Spoon",
        audio_en: "https://example.com/audio3b_en.mp3",
        audio_hi: "https://example.com/audio3b_hi.mp3",
        isCorrect: false,
      },
      {
        image_url:
          "https://all-dev-content-service.s3.ap-south-1.amazonaws.com/mechanics_images/814ff70a-4661-4e77-aa3e-ea721e2bedfd.png",
        text: "Jar",
        audio_en: "https://example.com/audio3c_en.mp3",
        audio_hi: "https://example.com/audio3c_hi.mp3",
        isCorrect: true,
      },
    ],
  },
];

const GiftBox = () => {
  return (
    <Lottie
      animationData={Giftbox}
      loop={true}
      style={{ width: 600, height: 600 }}
    />
  );
};

const WordWall = ({
  handleNext,
  enableNext,
  background,
  steps,
  currentStep,
  level,
  progressData,
  showProgress,
  handleBack,
  disableScreen,
  loading,
  vocabCount,
  wordCount,
  multilingual,
}) => {
  const [dropText, setDropText] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showGiftBoxes, setShowGiftBoxes] = useState(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [wrongAnswersAllQuestions, setWrongAnswersAllQuestions] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [openedGifts, setOpenedGifts] = useState([]);
  const [showGiftImage, setShowGiftImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [giftsOpened, setGiftsOpened] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scoreAnimation, setScoreAnimation] = useState({
    show: false,
    value: "",
    color: "",
    startPos: { x: 0, y: 0 },
    endPos: { x: 0, y: 0 },
  });
  const [lastAnswerResult, setLastAnswerResult] = useState(null);
  const [pendingScoreUpdate, setPendingScoreUpdate] = useState({
    value: 0,
    isCorrect: false,
  });
  const [boxAnimation, setBoxAnimation] = useState({
    correct: false,
    wrong: false,
  });

  const [gameData, setGameData] = useState([]);
  const correctBoxRef = useRef(null);
  const wrongBoxRef = useRef(null);
  const animationRef = useRef(null);
  const username = getLocalData("profileName") || "User";

  console.log("counts", wrongAnswersAllQuestions);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await getCorrectPracticeWords("false");
        const correctWords = response?.data || [];
        const selectedLang = getLocalData("lang") || "en";

        // First, filter items by top-level language field to only include items matching selected language
        const filteredWords = correctWords.filter((item) => {
          // Check if item's top-level language matches
          if (item?.language === selectedLang) {
            return true;
          }
          // Also check if contentSourceData has an entry for the selected language
          return item?.contentSourceData?.some(
            (data) => data?.language === selectedLang
          );
        });

        const formattedItems = filteredWords?.map((item) => {
          // Filter contentSourceData to find the entry matching the selected language
          const contentData =
            item?.contentSourceData?.find(
              (data) => data?.language === selectedLang
            ) || item?.contentSourceData?.[0]; // Fallback to first entry if language not found

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

          return {
            image_url: item?.imagePath || item.mechanics_data?.[0].image_url,
            text: contentData?.text,
            audio_en: `${item?.contentId}.wav`,
            audio_hi: item?.multilingual?.[multilingualLangCode]?.audio_url,
          };
        });

        if (formattedItems?.length < 3) {
          setLocalData("wordWall", false);
          navigate("/practice");
        }

        const shuffledItems = shuffle([...formattedItems]);

        const correctItems = shuffledItems.slice(0, 3);

        const finalGameData = correctItems.map((correctItem) => {
          let pool = shuffledItems.filter(
            (item) => item.text !== correctItem.text
          );

          if (pool.length < 2) {
            pool = [...pool, ...shuffledItems].filter(
              (item) => item.text !== correctItem.text
            );
          }

          const incorrectOptions = shuffle(pool).slice(0, 2);

          const options = shuffle([
            {
              ...correctItem,
              isCorrect: true,
            },
            ...incorrectOptions.map((item) => ({
              ...item,
              isCorrect: false,
            })),
          ]);

          return { images: options };
        });

        console.log(
          "dataGame",
          finalGameData,
          getLocalData("wordWall"),
          getLocalData("readMatch")
        );

        setGameData(finalGameData);
      } catch (err) {
        console.error("Failed to generate game data:", err);
      }
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
      styleSheet.insertRule(
        `@keyframes dropFromTop {
          0% { top: 80px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 300px; opacity: 1; }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes scoreFlyToBox {
          0% { 
          transform: translate(90%, -70%) scale(1);

            opacity: 1.2; 
          }
          70% { 
            opacity: 1.5;
          }
          100% { 
            transform: translate(
              calc(var(--target-x) - 55vw + 70%),
              calc(var(--target-y) - 52vh + 80%)
            ) scale(1); 
            opacity: 0; 
          }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes boxBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
     }`,
        styleSheet.cssRules.length
      );
    }

    console.log("dataGameData", dropText);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (gameData?.length > 0) {
      loadQuestion(currentQuestionIndex);
    }
  }, [gameData, currentQuestionIndex]);

  useEffect(() => {
    if (lastAnswerResult && currentQuestionIndex > 0) {
      const startPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      const endPos = lastAnswerResult.correct
        ? {
            x: window.innerWidth - 90,
            y: 100,
          }
        : {
            x: 110,
            y: 100,
          };

      setScoreAnimation({
        show: true,
        value: lastAnswerResult.correct ? "+1" : "-1",
        color: lastAnswerResult.correct ? "#1F9D55" : "#F37052",
        startPos,
        endPos,
      });

      setPendingScoreUpdate({
        value: lastAnswerResult.correct ? 1 : -1,
        isCorrect: lastAnswerResult.correct,
      });

      setTimeout(() => {
        setScoreAnimation({ show: false });
      }, 1500);

      setTimeout(() => {
        if (lastAnswerResult.correct) {
          setBoxAnimation((prev) => ({ ...prev, correct: true }));
          setTimeout(() => {
            setCorrectCount((prev) => prev + 1);
            setBoxAnimation((prev) => ({ ...prev, correct: false }));
          }, 300);
        } else {
          setBoxAnimation((prev) => ({ ...prev, wrong: true }));
          setTimeout(() => {
            setWrongCount((prev) => prev + 1);
            setBoxAnimation((prev) => ({ ...prev, wrong: false }));
          }, 300);
        }
        setLastAnswerResult(null);
      }, 1600);
    }
  }, [currentQuestionIndex]);

  const loadQuestion = (questionIndex) => {
    const correct = gameData?.[questionIndex]?.images?.find(
      (img) => img.isCorrect
    );
    if (correct) {
      setDropText(correct?.text);
    }
    setShowQuiz(false);
    setSelectedId(null);
  };

  const playAudio = (src) => {
    console.log("src", src);

    if (!src) return;
    const audio = new Audio(src);
    audio.play();
  };

  const handleImageClick = (item, id) => {
    if (selectedId !== null) return;

    setSelectedId(id);
    const isLastQuestion = currentQuestionIndex === gameData?.length - 1;

    if (item.isCorrect) {
      setShowConfetti(true);
      setLastAnswerResult({ correct: true });

      setTimeout(() => {
        setShowConfetti(false);

        if (isLastQuestion) {
          setShowResults(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 2000);
    } else {
      setLastAnswerResult({ correct: false });
      const correctAnswer = gameData?.[currentQuestionIndex]?.images.find(
        (img) => img.isCorrect
      );
      setWrongAnswersAllQuestions((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          item: correctAnswer,
        },
      ]);

      setTimeout(() => {
        if (isLastQuestion) {
          setShowResults(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 1000);
    }
  };
  const handleGiftClick = (index) => {
    if (openedGifts.includes(index)) return;

    setOpenedGifts((prev) => [...prev, index]);

    setCurrentReviewIndex(index);
    setShowGiftAnimation(true);
    setShowConfetti(true);
    setShowGiftBoxes(false);
    setShowGiftImage(false);

    setTimeout(() => {
      setShowGiftImage(true);
    }, 1000);

    animationRef.current = setTimeout(() => {
      setShowGiftAnimation(false);
      setShowGiftImage(false);
      setShowConfetti(false);
      setShowReview(true);

      setGiftsOpened((prev) => {
        const newCount = prev + 1;
        const newProgress = Math.min(
          100,
          Math.round((newCount / wrongAnswersAllQuestions.length) * 100)
        );
        setProgress(newProgress);
        return newCount;
      });
    }, 3000);
  };
  const handleReviewComplete = () => {
    setShowReview(false);

    if (currentReviewIndex === wrongAnswersAllQuestions.length - 1) {
      //setShowResults(true);
      setLocalData("wordWall", false);
      navigate("/practice");
    } else {
      setShowGiftBoxes(true);
    }
  };

  const ResultsView = ({ onNext }) => (
    <div
      style={{
        backgroundColor: "#FDFEFF",
        height: "100vh",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#2DAEF5",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "16px 0",
          width: "100%",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          position: "relative",
        }}
      >
        You Did It!
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "60px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            width: "230px",
            height: "230px",
            backgroundImage: `url(${greenboxImg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={greenstarImg}
            alt="Star"
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "32px",
            }}
          />
          <div
            style={{
              backgroundColor: "#fff",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2F2F2F",
              marginBottom: "6px",
            }}
          >
            {3 - wrongAnswersAllQuestions?.length}
          </div>
          <div
            style={{
              fontSize: "18px",
              textAlign: "center",
              lineHeight: "22px",
              color: "#2F2F2F",
            }}
          >
            Words you
            <br />
            know
          </div>
        </div>

        <div
          style={{
            width: "230px",
            height: "230px",
            backgroundImage: `url(${redboxImg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <img
            src={redsmileImg}
            alt="Smile"
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
            }}
          />
          <div
            style={{
              backgroundColor: "#fff",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2F2F2F",
              marginBottom: "6px",
            }}
          >
            {wrongAnswersAllQuestions?.length}
          </div>
          <div
            style={{
              fontSize: "18px",
              textAlign: "center",
              lineHeight: "22px",
              color: "#2F2F2F",
            }}
          >
            Words to
            <br />
            Try Again!
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "140px",
          marginTop: "40px",
        }}
      >
        <img
          src={nextimg}
          alt="Next"
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowResults(false);
            setShowGiftBoxes(true);
            if (wrongAnswersAllQuestions?.length === 0) {
              setLocalData("wordWall", false);
              navigate("/practice");
            }
          }}
        />
      </div>
    </div>
  );
  const getImageBackground = (item, id) => {
    if (selectedId !== id) return "#fff";
    return item.isCorrect ? "#DEF5CC" : "#FEE4D5";
  };

  const renderGameView = () => (
    <>
      {!showQuiz ? (
        <>
          <div
            style={{
              position: "absolute",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              height: "170px",
              animation: "dropFromTop 1.3s ease-out forwards",
              zIndex: 2,
              cursor: "pointer",
            }}
            onClick={() => setShowQuiz(true)}
          >
            <img
              src={bubbleDropsImg}
              alt="Bubble Drop"
              style={{ height: "100%", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "40px",
                fontWeight: "bold",
                color: "#333F61",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {dropText}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
              padding: "0 40px",
            }}
          >
            <div
              ref={wrongBoxRef}
              style={{
                position: "relative",
                transform: `translateX(${
                  pendingScoreUpdate.isCorrect === false && scoreAnimation.show
                    ? "-10px"
                    : "-10px"
                })`,
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={wrongBoxImg}
                alt="Wrong Count"
                style={{ height: "60px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#F37052",
                }}
              >
                {-wrongCount}
              </div>
              <img
                src={wrongSignImg}
                alt="Wrong Icon"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  height: "22px",
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: "#ffe9f9",
                borderRadius: "20px",
                padding: "16px 150px",
                fontSize: "30px",
                fontWeight: "700",
                color: "#333F61",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                fontFamily: "Quicksand",
                fontStyle: "bold",
              }}
              onClick={() => setShowQuiz(true)}
            >
              <img
                src={clickbubbleImg}
                alt="Click Bubble"
                style={{ height: "28px" }}
              />
              <span style={{ lineHeight: "1" }}>Click Bubble</span>
            </div>

            <div
              ref={correctBoxRef}
              style={{
                position: "relative",
                transform: `translateX(${
                  pendingScoreUpdate.isCorrect === true && scoreAnimation.show
                    ? "10px"
                    : "10px"
                })`,
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={correctBoxImg}
                alt="Correct Count"
                style={{ height: "60px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1F9D55",
                }}
              >
                {correctCount}
              </div>
              <img
                src={correctSignImg}
                alt="Correct Icon"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  height: "22px",
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            marginTop: "5px",
            textAlign: "center",
            padding: "0px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FF4BC21A",
              padding: "20px 90px",
              borderRadius: "16px",
              display: "inline-block",
              fontSize: "30px",
              color: "#333F61",
              fontWeight: "800",
              marginBottom: "10px",
              fontStyle: "bold",
            }}
          >
            Can you find the?
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "#333F61",
              marginBottom: "20px",
            }}
          >
            {dropText}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "60px",
              flexWrap: "wrap",
            }}
          >
            {gameData?.[currentQuestionIndex]?.images?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: `1px solid ${
                    selectedId === idx
                      ? item.isCorrect
                        ? "#1F9D55"
                        : "#F37052"
                      : "#ddd"
                  }`,
                  borderRadius: "16px",
                  padding: "10px",
                  width: "140px",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getImageBackground(item, idx),
                  cursor: "pointer",
                  transform: selectedId === idx ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleImageClick(item, idx)}
              >
                <img
                  src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${item?.image_url}`}
                  alt={item?.text}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderGiftBoxesView = () => (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <div
        style={{
          backgroundColor: "#FF4BC21A",
          borderRadius: "20px",
          padding: "19px 150px",
          fontSize: "30px",
          fontWeight: "700",
          color: "#333F61",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "40px",
          fontFamily: "Quicksand",
          fontStyle: "Bold",
        }}
      >
        <span style={{ lineHeight: "1" }}>Let's open gifts</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
          padding: "0 20px",
        }}
      >
        {wrongAnswersAllQuestions?.map((wrongAnswer, idx) => {
          const isOpened = openedGifts.includes(idx);
          const isAnimating = showGiftAnimation && currentReviewIndex === idx;

          return (
            <div
              key={idx}
              style={{
                width: "120px",
                height: "120px",
                position: "relative",
                animationDelay: `${idx * 0.1}s`,
                cursor: isOpened || isAnimating ? "default" : "pointer",
                opacity: isOpened ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => !isOpened && !isAnimating && handleGiftClick(idx)}
            >
              {isAnimating ? (
                <GiftBox />
              ) : (
                <>
                  <img
                    src={isOpened ? giftopenImg : giftboxImg}
                    alt={isOpened ? "Opened Gift" : "Gift Box"}
                    style={{
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.2s",
                    }}
                  />
                  {isOpened && (
                    <div
                      style={{
                        position: "absolute",
                        top: "70%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#000",
                        padding: "4px 6px",
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: "6px",
                        maxWidth: "90%",
                        wordWrap: "break-word",
                      }}
                    >
                      {wrongAnswer?.item?.text}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGiftAnimation = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "400px",
          animation: "popIn 0.5s ease-out",
        }}
      >
        {!showGiftImage && (
          <img
            src={giftboxImg}
            alt="Gift Box"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        )}

        {showGiftImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <GiftBox />
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewView = () => {
    const currentAnswer = wrongAnswersAllQuestions?.[currentReviewIndex]?.item;
    const lang = getLocalData("lang");

    if (!currentAnswer) return null;

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#FF4BC21A",
            padding: "14px 160px",
            borderRadius: "16px",
            fontSize: "40px",
            color: "#333F61",
            marginBottom: "20px",
            display: "inline-block",
            fontFamily: "Quicksand",
            fontStyle: "semiBold",
            fontWeight: 900,
          }}
        >
          This is called a...
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20%",
            alignItems: "center",
            flexWrap: "wrap",
            marginLeft: "-150px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${currentAnswer?.image_url}`}
              alt={currentAnswer?.text}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "10px",
                border: "2px solid #eee",
                backgroundColor: "#fff",
                padding: "20px",
              }}
            />
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#31356E",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontFamily: "Quicksand",
                  fontStyle: "Bold",
                  fontWeight: 800,
                }}
                onClick={() =>
                  playAudio(
                    `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${currentAnswer?.audio_en}`
                  )
                }
              >
                <img
                  src={listenblueImg}
                  alt="Listen"
                  style={{ height: "40px" }}
                />
                <span>English</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#333F61",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontFamily: "Quicksand",
                  fontStyle: "Bold",
                  fontWeight: 800,
                }}
                onClick={() =>
                  playAudio(
                    `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentAnswer?.audio_hi}`
                  )
                }
              >
                <img
                  src={listenvioletImg}
                  alt="Listen"
                  style={{ height: "40px" }}
                />
                <span>ಕನ್ನಡ</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#1CB0F60F", // default background
                border: "2px solid #1CB0F633", // default border
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 40px",
                marginBottom: "16px",
                //marginLeft: "390px"
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#333F61",
                    fontWeight: 600,
                    fontSize: lang === "te" ? "56px" : "50px",
                    lineHeight: "60px",
                    letterSpacing: "1%",
                    fontFamily: getFontFamily(lang),
                  }}
                >
                  {currentAnswer?.text}
                </span>
              </Box>
            </Box>

            <button
              onClick={handleReviewComplete}
              style={{
                marginTop: "50px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                //marginLeft: "390px"
              }}
            >
              <img
                src={nexttImg}
                alt="Back to Gifts"
                style={{
                  height: "50px",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      pageName={"m7"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        handleBack,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      {showResults ? (
        <ResultsView
          onNext={() => {
            setShowGiftBoxes(true);
          }}
        />
      ) : (
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            borderRadius: "16px",
          }}
        >
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
            />
          )}

          {scoreAnimation.show && (
            <div
              style={{
                position: "fixed",
                left: `${scoreAnimation.startPos.x}px`,
                top: `${scoreAnimation.startPos.y}px`,
                color: scoreAnimation.color,
                fontSize: "47px",
                fontWeight: "bold",
                animation: "scoreFlyToBox 2s ease-in-out forwards",
                zIndex: 100,
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                "--target-x": `${scoreAnimation.endPos.x}px`,
                "--target-y": `${scoreAnimation.endPos.y}px`,
              }}
            >
              {scoreAnimation.value}
            </div>
          )}

          <div
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
              width: "100%",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              fontWeight: "700px",
              color: "#ffffff",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              marginBottom: "40px",
              fontFamily: "Quicksand",
              position: "relative",
              height: "80px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                flex: 1,
              }}
            >
              {`${username}'s Word Wall`}
            </div>

            {(showGiftBoxes || showGiftAnimation || showReview) && (
              <div
                style={{
                  width: 240,
                  height: 35,
                  backgroundColor: "#fff",
                  borderRadius: 40,
                  position: "absolute",
                  right: "50px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  overflow: "visible",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: 40,
                  }}
                />

                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(0deg, #F19920 0%, #F39F27 23%, #F7B03B 58%, #FECC5C 100%)",
                    transition: "width 0.5s ease-out",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: 40,
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <img
                      src={giftscoreImg}
                      alt="Gift"
                      style={{
                        width: "60px",
                        height: "60px",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#2C2C4A",
                      marginLeft: "179px",
                    }}
                  >
                    {giftsOpened}/{wrongAnswersAllQuestions.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showGiftBoxes &&
            !showGiftAnimation &&
            !showReview &&
            renderGameView()}
          {showGiftBoxes && renderGiftBoxesView()}
          {showGiftAnimation && renderGiftAnimation()}
          {showReview && renderReviewView()}
        </div>
      )}
    </MainLayout>
  );
};

export default WordWall;
