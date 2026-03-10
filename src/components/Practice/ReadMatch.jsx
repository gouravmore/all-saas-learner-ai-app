import React, { useState, useEffect, useRef } from "react";
import bikeImg from "../../assets/bike.svg";
import lemonImg from "../../assets/Mango.svg";
import farmerImg from "../../assets/farmer.svg";
import background from "../../assets/background.svg";
import Confetti from "react-confetti";
import ulineImg from "../../assets/Uline.svg";
import fireImg from "../../assets/fire.svg";
import fanImg from "../../assets/fan.svg";
import tieImg from "../../assets/tie.svg";
import RememberImg from "../../assets/CanyouremImg.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import { Log } from "../../services/telementryService";
import { useNavigate } from "react-router-dom";
import { getLocalData, setLocalData } from "../../utils/constants";
import {
  getCorrectPracticeWords,
  updateCorrectPracticeWords,
} from "../../services/orchestration/orchestrationService";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

const theme = createTheme();

const ReadMatch = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
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
  fluency,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  isNextButtonCalled,
  setIsNextButtonCalled,
  vocabCount,
  wordCount,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [correctMatch, setCorrectMatch] = useState(null);
  const [isFaded, setIsFaded] = useState(false);
  const [wrongMatch, setWrongMatch] = useState({
    wordIndex: null,
    imageIndex: null,
  });
  const [showInitialSelection, setShowInitialSelection] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);

  const defaultWordImagePairs = [
    { word: "Bike", img: bikeImg, match: "Bike" },
    { word: "Lime", img: lemonImg, match: "Lime" },
    { word: "Farmer", img: farmerImg, match: "Farmer" },
    { word: "Fan", img: fanImg, match: "Fan" },
    { word: "Fire", img: fireImg, match: "Fire" },
    { word: "Tie", img: tieImg, match: "Tie" },
  ];
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState({});
  const [wordImagePairs, setWordImagePairs] = useState(null);

  useEffect(() => {
    if (level === 1) {
      setLocalData("readMatch", false);
      navigate("/practice");
    }
  }, [level]);

  useEffect(() => {
    const fetchCorrectWords = async () => {
      try {
        const response = await getCorrectPracticeWords("false");
        const correctWords = response?.data || [];
        const selectedLang = getLocalData("lang") || "en";
        console.log("level api", level);

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

        const formattedCorrectWords = filteredWords?.map((item) => {
          // Filter contentSourceData to find the entry matching the selected language
          const contentData =
            item?.contentSourceData?.find(
              (data) => data?.language === selectedLang
            ) || item?.contentSourceData?.[0]; // Fallback to first entry if language not found

          return {
            word: contentData?.text,
            img: item?.imagePath || item?.mechanics_data?.[0]?.image_url,
            match: contentData?.text,
            content_id: item?.contentId,
          };
        });

        if (formattedCorrectWords <= 3) {
          setLocalData("readMatch", false);
        }

        setWordImagePairs(formattedCorrectWords);
      } catch (error) {
        console.error("Error fetching and mapping words:", error);
      }
    };

    fetchCorrectWords();
  }, []);

  console.log("imagePairs", wordImagePairs);

  const words = wordImagePairs?.map((pair) => pair.word);
  const correctMatches = wordImagePairs?.map((pair) => pair.match);

  const shuffledRef = useRef(null);

  if (!shuffledRef.current && Array.isArray(words)) {
    shuffledRef.current = [...words].sort(() => Math.random() - 0.5);
  }

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  console.log("matches", shuffledImages);

  useEffect(() => {
    console.log("res", matches.length, wordImagePairs?.length);

    if (matches.length === wordImagePairs?.length) {
      const formattedData = wordImagePairs?.map((item) => ({
        content_id: item.content_id,
        practice: true,
        learned: true,
        understood: firstAttemptCorrect[item.content_id] === true,
      }));

      updateCorrectPracticeWords(formattedData)
        .then((res) => {
          console.log("Update successful:", res);
          setLocalData("readMatch", false);
          navigate("/practice");
        })
        .catch((err) => {
          console.error("Error updating correct practice words:", err);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
        });
    }
  }, [matches]);

  const handleWordClick = (word, wordIndex) => {
    if (isMatchedWord(wordIndex)) return;
    setSelectedWord({ word, wordIndex });
    setSelectedImage(null);
    setWrongMatch({ wordIndex: null, imageIndex: null });
    setShowInitialSelection(false);
  };

  const handleImageClick = (imageIndex) => {
    if (!selectedWord) return;
    if (isMatchedImage(imageIndex)) return;

    setSelectedImage(imageIndex);
    setShowInitialSelection(true);

    const wordItem = wordImagePairs.find(
      (item) => item.word === selectedWord.word
    );
    const imageItem = wordImagePairs[imageIndex];

    const isCorrect = imageItem?.match === wordItem?.word;

    if (firstAttemptCorrect[wordItem.content_id] === undefined) {
      setFirstAttemptCorrect((prev) => ({
        ...prev,
        [wordItem.content_id]: isCorrect,
      }));
    }

    if (isCorrect) {
      const audio = new Audio(correctSound);
      audio.play();
      setCorrectMatch({ wordIndex: selectedWord.wordIndex, imageIndex });
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => {
          setMatches([
            ...matches,
            { sourceIndex: imageIndex, wordIndex: selectedWord.wordIndex },
          ]);
          setCorrectMatch(null);
          setShowConfetti(false);
          setIsFaded(true);
          setSelectedWord(null);
          setSelectedImage(null);
          setShowInitialSelection(false);
        }, 2500);
      }, 500);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setTimeout(() => {
        setWrongMatch({ wordIndex: selectedWord.wordIndex, imageIndex });
        setTimeout(() => {
          setSelectedWord(null);
          setSelectedImage(null);
          setWrongMatch({ wordIndex: null, imageIndex: null });
          setShowInitialSelection(false);
        }, 1000);
      }, 1000);
    }
  };

  const isMatchedWord = (wordIndex) =>
    matches.some((m) => m.wordIndex === wordIndex);
  const isMatchedImage = (imageIndex) =>
    matches.some((m) => m.sourceIndex === imageIndex);
  const isCorrectMatchWord = (wordIndex) =>
    correctMatch?.wordIndex === wordIndex;
  const isCorrectMatchImage = (imageIndex) =>
    correctMatch?.imageIndex === imageIndex;
  const isWrongMatchWord = (wordIndex) => wrongMatch.wordIndex === wordIndex;
  const isWrongMatchImage = (imageIndex) =>
    wrongMatch.imageIndex === imageIndex;
  const isInitialSelection = (wordIndex, imageIndex) =>
    showInitialSelection &&
    selectedWord?.wordIndex === wordIndex &&
    selectedImage === imageIndex;

  const getImageStyle = (index) => {
    const isMatched = isMatchedImage(index);
    const isCorrect = isCorrectMatchImage(index) && showConfetti;
    const isSelected = selectedImage === index;
    const isWrong = isWrongMatchImage(index);
    const isDisabled = isMatched && !isCorrect;
    const isInitial = isInitialSelection(selectedWord?.wordIndex, index);

    return {
      border: isCorrect
        ? "1px solid #c1e2a7"
        : isWrong
        ? "1px solid #FF4B4B"
        : isDisabled
        ? "1px solid rgba(0,0,0,0.3)"
        : isInitial
        ? "1px solid #A856FF"
        : "1px solid #A856FF",
      borderRadius: "10px",
      padding: isMobile ? "5px" : "10px",
      width: isMobile ? "80px" : isTablet ? "120px" : "150px",
      height: isMobile ? "50px" : isTablet ? "75px" : "90px",
      backgroundColor: isCorrect
        ? "#DEF5CC"
        : isWrong
        ? "#FEE4D5"
        : isDisabled
        ? "rgba(255, 255, 255, 0.6)"
        : isInitial
        ? "#F6EEFF"
        : isSelected
        ? "#F6EEFF"
        : "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: isMatched ? "default" : "pointer",
      transition: "all 0.3s ease",
      opacity: isDisabled ? 0.8 : 1,
      boxShadow:
        !isMatched && selectedWord && selectedImage === null
          ? `1px 6px 0px rgba(168, 86, 255, 0.9)`
          : "none",
      transform: selectedImage === index ? "translateY(-2px)" : "translateY(0)",
    };
  };

  const getWordStyle = (wordIndex) => {
    const isMatched = isMatchedWord(wordIndex);
    const isCorrect = isCorrectMatchWord(wordIndex) && showConfetti;
    const isSelected = selectedWord?.wordIndex === wordIndex;
    const isDisabled = isMatched && !isCorrect;
    const isWrong = isWrongMatchWord(wordIndex);
    const isInitial = isInitialSelection(wordIndex, selectedImage);

    return {
      border: isCorrect
        ? "1px solid #c1e2a7"
        : isWrong
        ? "1px solid #FF4B4B"
        : isDisabled
        ? "1px solid rgba(0,0,0,0.3)"
        : isInitial
        ? "1px solid #A856FF"
        : "1px solid #A856FF",
      borderRadius: "10px",
      padding: isMobile ? "5px 10px" : "10px 20px",
      font: "Quicksand",
      backgroundColor: isCorrect
        ? "#DEF5CC"
        : isWrong
        ? "#FEE4D5"
        : isDisabled
        ? "rgba(255, 255, 255, 0.4)"
        : isInitial
        ? "#F6EEFF"
        : isSelected
        ? "#F6EEFF"
        : "#fff",
      cursor: isMatched ? "default" : "pointer",
      transition: "all 0.3s ease",
      opacity: isDisabled ? 0.5 : 1,
      fontFamily: "Quicksand, sans-serif",
      fontWeight: 600,
      fontSize: isMobile ? "16px" : isTablet ? "20px" : "32px",
      lineHeight: isMobile ? "16px" : isTablet ? "20px" : "24px",
      letterSpacing: "0px",
      color: "#333F61",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: isMobile ? "20px" : isTablet ? "22px" : "90px",
      width: isMobile ? "80px" : isTablet ? "120px" : "150px",
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "relative",
          minHeight: "94vh",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          fontFamily: "Arial, sans-serif",
          padding: isMobile ? "18px 10px" : "18px 40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showConfetti && <Confetti />}

        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            padding: isMobile
              ? "40px 10px"
              : isTablet
              ? "40px 30px"
              : "40px 90px",
            width: "100%",
            maxWidth: isMobile ? "100%" : "1250px",
            height: "auto",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: isMobile ? "70px" : "100px",
              backgroundImage: `url(${ulineImg})`,
              backgroundSize: isMobile
                ? "cover"
                : isTablet
                ? "cover"
                : "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Box
              component="img"
              src={RememberImg}
              alt="Word Practice"
              sx={{
                height: isMobile ? "14px" : "27px",
                margin: isMobile ? "15px auto" : "30px auto",
                marginBottom: isMobile ? "17px" : "37px",
              }}
            /> */}
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: isMobile ? "48px" : "36px",
                //lineHeight: "100%",
                fontFamily: "Quicksand",
              }}
            >
              {"Word Practice"}
            </span>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: isMobile ? "50px" : "80px",
              gap: isMobile ? "5px" : "20px",
              flexDirection: isMobile ? "row" : "row",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 3fr)",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? "4px" : "20px",
                fontFamily: "Quicksand",
                width: isMobile ? "30%" : "auto",
              }}
            >
              {shuffledRef?.current?.map((word, i) => (
                <Box
                  key={i}
                  onClick={() => !isMatchedWord(i) && handleWordClick(word, i)}
                  sx={getWordStyle(i)}
                >
                  {word}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 3fr)",
                gap: isMobile ? "13px" : "20px",
                alignItems: "center",
                width: isMobile ? "30%" : "auto",
              }}
            >
              {wordImagePairs?.slice(0, 6)?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() =>
                    !isMatchedImage(index) && handleImageClick(index)
                  }
                  sx={getImageStyle(index)}
                >
                  <Box
                    component="img"
                    src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${item.img}`}
                    alt={`image-${index}`}
                    sx={{
                      width: isMobile ? "30px" : "85px",
                      height: isMobile ? "30px" : "85px",
                      opacity: isMatchedImage(index) && isFaded ? 0.7 : 1,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ReadMatch;
