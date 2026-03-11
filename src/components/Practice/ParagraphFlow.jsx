import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import Confetti from "react-confetti";
import speakButton from "../../assets/speakButton.svg";
import pauseImg from "../../assets/pauseImg.svg";
import graphImg from "../../assets/graphImg.svg";
import beardanceImg from "../../assets/beardances.gif";
import hintimg from "../../assets/hintsicon.svg";
import nextImg from "../../assets/nextImg.svg";
import listenImg from "../../assets/listenImg.svg";
import listenbear from "../../assets/listenbear.gif";
import bookpageImg from "../../assets/bookimageone.svg";
import multilingualImg from "../../assets/multilingual.svg";
import backgroundImg from "../../assets/starsandclouds.png";
import meterImg from "../../assets/meterimg.svg";
import tortoiseImg from "../../assets/tortoiseImg.svg";
import audioone from "../../assets/audio1.wav";
import correctSound from "../../assets/correct.wav";
import { callTelemetryApi } from "../../utils/apiUtil";
import {
  practiceSteps,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Modal } from "@mui/material";
import ZoomableImage from "./ZoomableImage";

const paragraphPages = [
  {
    page: 1,
    bookImage: bookpageImg,
    highlightedText:
      "He happily started eating it. After some time, he got bored. Then he thought of colourful fruits. Immediately, fruit in baskets appeared. He started eating them. There were grapes, mangoes, apples, bananas, jackfruit, melons, guavas, oranges, and many more.",
    audio: audioone,
    keywords: [
      {
        word: "happily",
        audio: "/audio/happily.mp3",
      },
      {
        word: "eating",
        audio: "/audio/eating.mp3",
      },
      {
        word: "colourful",
        audio: "/audio/colourful.mp3",
      },
    ],
  },
];

// CSS styles for smooth transitions
const styles = `
  @keyframes slowFadeIn {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .slow-transition {
    animation: slowFadeIn 0.8s ease-out forwards;
  }
  
  .scale-transition {
    animation: scaleIn 0.7s ease-out forwards;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes growLine {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  /* Highlight styles - NO SHADOW, only background color */
  .highlighted-word-audio {
    background: #ffa500 !important;
    padding: 2px 4px !important;
    border-radius: 4px !important;
    transition: background-color 0.3s ease !important;
    display: inline-block !important;
    color: #000 !important;
    /* NO box-shadow */
  }

  @media (prefers-color-scheme: dark) {
    .highlighted-word-audio {
      color: #000 !important;
    }
  }

  /* Smooth scrolling container */
  .smooth-text-container {
    overflow-y: auto;
    max-height: 300px;
    scroll-behavior: smooth;
    padding: 10px;
  }

  .smooth-text-container::-webkit-scrollbar {
    width: 6px;
  }

  .smooth-text-container::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }

  .smooth-text-container::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 3px;
  }
`;

const ParagraphFlow = ({
  handleNext,
  background,
  showTimer,
  points,
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
  contentSourceData,
  parentWords,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBearDance, setShowBearDance] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [multilingualPosition, setMultilingualPosition] = useState({
    x: 0,
    y: 0,
  });
  const [audio, setAudio] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentHighlightedWord, setCurrentHighlightedWord] = useState(-1);
  const [showReadingSpeed, setShowReadingSpeed] = useState(false);
  const [speed, setSpeed] = useState("Slow");
  const [readingStartTime, setReadingStartTime] = useState(null);
  const textContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const timeoutRef = useRef([]);
  const speechSynthesisRef = useRef(null);
  const utteranceRef = useRef(null);
  const wordMapRef = useRef([]);
  const [startTime, setStartTime] = useState(null);
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
  console.log("audios", parentWords);

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

  const paragraphPages = [
    {
      page: 1,
      bookImage: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${contentSourceData?.imagePath}`,
      highlightedText: contentSourceData?.contentSourceData?.[0]?.text || "",
      keywords: Object.entries(parentWords || {}).map(([word, data]) => ({
        word,
        audio: `${
          process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL
        }/multilingual_audios/${data?.[multilingualLangCode]?.audio_url || ""}`,
      })),
    },
  ];

  const getSimilarity = (str1, str2) => {
    const a = str1.toLowerCase().trim().split(" ");
    const b = str2.toLowerCase().trim().split(" ");
    const matches = a.filter((word) => b.includes(word)).length;
    const total = Math.max(a.length, b.length);
    return matches / total;
  };

  useEffect(() => {
    transcriptRef.current = transcript;
    const similarity = getSimilarity(transcript, paragraphData.highlightedText);
    if (transcript.trim() !== "" && similarity === 0) {
      setIsMatch(1);
    } else {
      setIsMatch(similarity * 10);
    }
    console.log(
      "Live Transcript:",
      transcript,
      paragraphData.highlightedText,
      similarity
    );
  }, [transcript]);

  const handleStart = () => {
    setStartTime(Date.now());
    setSpeed(null);
  };

  useEffect(() => {
    handleStart();
  }, []);

  const handleStop = () => {
    if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;
    if (duration <= 60) {
      setSpeed("Fast");
    } else {
      setSpeed("Slow");
    }
  };

  // ✅ Add CSS to head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // ✅ Get current page data
  const paragraphData = paragraphPages[0];

  // ✅ Track reading start time when highlighted text is shown
  useEffect(() => {
    if (showHighlighted && !readingStartTime) {
      setReadingStartTime(Date.now());
    }
  }, [showHighlighted, readingStartTime]);

  // ✅ Calculate reading speed
  const calculateReadingSpeed = () => {
    if (readingStartTime) {
      const readingTime = (Date.now() - readingStartTime) / 1000;
      const wordCount = paragraphData.highlightedText.split(/\s+/).length;
      const wordsPerMinute = Math.round((wordCount / readingTime) * 60);

      // Determine speed category based on WPM
      let calculatedSpeed = "Slow";
      if (wordsPerMinute > 200) {
        calculatedSpeed = "Fast";
      } else if (wordsPerMinute > 100) {
        calculatedSpeed = "Medium";
      }

      setSpeed(calculatedSpeed);
    }
  };

  // ✅ Prepare text with word mapping (similar to first example)
  const prepareTextMapping = () => {
    const text = paragraphData.highlightedText.replace(/\s+/g, " ").trim();
    const wordMap = [];

    if (!text) return wordMap;

    const re = /(\S+)/g;
    let match;
    let lastEnd = 0;

    while ((match = re.exec(text)) !== null) {
      const word = match[1];
      const start = match.index;
      const end = start + word.length;

      wordMap.push({ start, end, word });
      lastEnd = end;
    }

    wordMapRef.current = wordMap;
    return wordMap;
  };

  // ✅ Clear highlighting
  const clearHighlight = () => {
    setCurrentHighlightedWord(-1);
  };

  // ✅ Smooth highlight word at specific character index
  const highlightAtCharIndex = (charIndex) => {
    const wordMap = wordMapRef.current;
    if (!wordMap.length) return;

    let targetIndex = -1;
    for (let i = 0; i < wordMap.length; i++) {
      const word = wordMap[i];
      if (charIndex >= word.start && charIndex < word.end) {
        targetIndex = i;
        break;
      }
      if (charIndex >= word.end) targetIndex = i;
    }

    if (targetIndex === -1 && wordMap.length > 0) {
      targetIndex = 0;
    }

    setCurrentHighlightedWord(targetIndex);

    // Smooth scroll into view with better positioning
    if (scrollContainerRef.current && targetIndex >= 0) {
      const wordElements =
        scrollContainerRef.current.querySelectorAll(".word-element");
      if (wordElements[targetIndex]) {
        const element = wordElements[targetIndex];
        const container = scrollContainerRef.current;
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the position to center the element vertically
        const scrollTop = container.scrollTop;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const containerHeight = container.offsetHeight;

        const targetScroll =
          elementTop - containerHeight / 2 + elementHeight / 2;

        // Smooth scroll to center the highlighted word
        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  };

  // ✅ Create speech synthesis utterance (like first example)
  const createUtterance = (text) => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      return null;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set properties
    utterance.rate = 1.0;

    // Choose voice
    const voices = speechSynthesis.getVoices();
    const defaultVoice =
      voices.find((v) => v.default) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0];
    if (defaultVoice) {
      utterance.voice = defaultVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setCurrentHighlightedWord(-1);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      clearHighlight();
      setCurrentHighlightedWord(-1);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setIsPlayingAudio(false);
      clearHighlight();
      setCurrentHighlightedWord(-1);
    };

    utterance.onboundary = (e) => {
      if (e.name === "word" && typeof e.charIndex === "number") {
        highlightAtCharIndex(e.charIndex);
      }
    };

    return utterance;
  };

  // ✅ Improved handleListenClick function using Speech Synthesis API
  const handleListenClick = () => {
    if (isPlayingAudio) {
      // Stop speech synthesis
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      setIsPlayingAudio(false);
      clearHighlight();
      return;
    }

    // Prepare text mapping
    prepareTextMapping();

    // Create and speak utterance
    const utterance = createUtterance(paragraphData.highlightedText);
    if (utterance) {
      utteranceRef.current = utterance;
      speechSynthesisRef.current = window.speechSynthesis;
      speechSynthesisRef.current.speak(utterance);
    } else {
      // Fallback to audio file if speech synthesis fails
      playAudioFallback();
    }
  };

  // ✅ Fallback to audio file with word highlighting
  const playAudioFallback = () => {
    if (!paragraphData.audio) {
      console.error("No audio available");
      return;
    }

    setIsPlayingAudio(true);
    clearHighlight();

    const audioElement = new Audio(paragraphData.audio);
    setAudio(audioElement);

    // Prepare word timing (approximate)
    const wordMap = prepareTextMapping();
    const totalDuration = 20000;
    const wordDuration = totalDuration / wordMap.length;

    // Start highlighting when audio begins
    audioElement.addEventListener("play", () => {
      let currentWordIndex = -1;

      const highlightNextWord = () => {
        currentWordIndex++;
        if (currentWordIndex < wordMap.length) {
          setCurrentHighlightedWord(currentWordIndex);
          timeoutRef.current.push(setTimeout(highlightNextWord, wordDuration));
        } else {
          setIsPlayingAudio(false);
          clearHighlight();
        }
      };

      // Clear any existing timeouts
      clearAllTimeouts();
      highlightNextWord();
    });

    audioElement.addEventListener("ended", () => {
      setIsPlayingAudio(false);
      clearHighlight();
      clearAllTimeouts();
    });

    audioElement.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setIsPlayingAudio(false);
      clearHighlight();
      clearAllTimeouts();
    });

    audioElement.play().catch((error) => {
      console.error("Audio play failed:", error);
      setIsPlayingAudio(false);
    });
  };

  // ✅ Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutRef.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeoutRef.current = [];
  };

  // ✅ Improved Handle word hover with audio - ONLY FOR KEYWORDS
  const handleWordHover = (word, event, isKeyword) => {
    if (isPlayingAudio || !isKeyword) return;

    const rect = event.target.getBoundingClientRect();
    const containerRect = textContainerRef.current.getBoundingClientRect();

    setHoveredWord(word);
    setMultilingualPosition({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.bottom - containerRect.top + 5,
    });

    const keywordData = paragraphData.keywords.find(
      (k) => k.word.toLowerCase() === word.toLowerCase().replace(/[.,!?;]/g, "")
    );

    if (keywordData && keywordData.audio) {
      console.log(
        "Playing keyword audio:",
        keywordData.audio,
        "for word:",
        word
      );
      playAudio(keywordData.audio);
    }
  };

  // ✅ Handle word leave
  const handleWordLeave = () => {
    setHoveredWord(null);
    if (audio && !isPlayingAudio) {
      audio.pause();
      audio.currentTime = 0;
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
    const sentenceText = paragraphData?.highlightedText || "";

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
  // ✅ Play audio function
  const playAudio = (audioUrl) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    try {
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      newAudio.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
      return newAudio;
    } catch (error) {
      console.error("Error creating audio:", error);
      return null;
    }
  };

  // ✅ Get highlighted text - USING PROPER WORD MAPPING
  const getHighlightedText = () => {
    const wordMap =
      wordMapRef.current.length > 0 ? wordMapRef.current : prepareTextMapping();

    if (wordMap.length === 0) {
      return paragraphData.highlightedText;
    }

    let result = [];
    let lastEnd = 0;

    wordMap.forEach((wordData, index) => {
      const { start, end, word } = wordData;

      // Add text before current word (spaces and punctuation)
      if (start > lastEnd) {
        result.push(paragraphData.highlightedText.slice(lastEnd, start));
      }

      // Create word element
      const isHighlighted = isPlayingAudio && currentHighlightedWord === index;
      const isKeyword = paragraphData.keywords.some(
        (k) =>
          k.word.toLowerCase() === word.toLowerCase().replace(/[.,!?;]/g, "")
      );

      if (isHighlighted) {
        // NO SHADOW, only background color
        result.push(
          `<span class="word-element highlighted-word-audio" data-index="${index}">${word}</span>`
        );
      } else if (isKeyword && !isPlayingAudio) {
        result.push(`<span 
          class="word-element highlighted-word keyword-word" 
          data-word="${word}"
          data-index="${index}"
          data-is-keyword="true"
          style="
            text-decoration: underline; 
            text-decoration-color: rgba(255, 127, 54, 1); 
            text-underline-offset: 3px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            display: inline-block;
            padding: 1px 2px;
            border-radius: 3px;
          "
        >${word}</span>`);
      } else {
        result.push(
          `<span class="word-element" data-index="${index}" style="display: inline-block;">${word}</span>`
        );
      }

      lastEnd = end;
    });

    // Add any remaining text
    if (lastEnd < paragraphData.highlightedText.length) {
      result.push(paragraphData.highlightedText.slice(lastEnd));
    }

    return result.join("");
  };

  // ✅ Add event listeners to words after render - ONLY FOR KEYWORDS
  useEffect(() => {
    if (showHighlighted && textContainerRef.current) {
      const keywordElements =
        textContainerRef.current.querySelectorAll(".keyword-word");
      const normalWordElements = textContainerRef.current.querySelectorAll(
        ".word-element:not(.keyword-word)"
      );

      const handleKeywordEnter = (e) => {
        if (isPlayingAudio) return;
        const word = e.target.textContent || e.target.getAttribute("data-word");
        handleWordHover(word, e, true);
      };

      const handleNormalWordEnter = (e) => {
        // Don't show multilingual for normal words, just clear any existing hover
        setHoveredWord(null);
      };

      // Add event listeners to keyword words
      keywordElements.forEach((wordElement) => {
        wordElement.addEventListener("mouseenter", handleKeywordEnter);
        wordElement.addEventListener("mouseleave", handleWordLeave);
        wordElement.addEventListener("click", handleKeywordEnter);
      });

      // Add event listeners to normal words (only to clear hover state)
      normalWordElements.forEach((wordElement) => {
        wordElement.addEventListener("mouseenter", handleNormalWordEnter);
        wordElement.addEventListener("mouseleave", handleWordLeave);
      });

      return () => {
        keywordElements.forEach((wordElement) => {
          wordElement.removeEventListener("mouseenter", handleKeywordEnter);
          wordElement.removeEventListener("mouseleave", handleWordLeave);
          wordElement.removeEventListener("click", handleKeywordEnter);
        });

        normalWordElements.forEach((wordElement) => {
          wordElement.removeEventListener("mouseenter", handleNormalWordEnter);
          wordElement.removeEventListener("mouseleave", handleWordLeave);
        });
      };
    }
  }, [showHighlighted, isPlayingAudio, currentHighlightedWord]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      clearAllTimeouts();
    };
  }, [audio]);

  const handleSpeakClick = () => {
    if (isSpeaking) {
      const audio = new Audio(correctSound);
      audio.play();
      SpeechRecognition.stopListening();
      handleStop();
      setShowBearDance(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowHighlighted(true);
        setShowBearDance(false);
        prepareTextMapping();
      }, 3000);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
      });
    }
    setIsSpeaking(!isSpeaking);
  };

  const handleNextClick = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setIsPlayingAudio(false);
    clearHighlight();
    setTimeout(() => {
      //calculateReadingSpeed();
      setShowReadingSpeed(true);
    }, 200);
  };

  const handleNextWord = () => {
    // Reset all states and refs to initial values
    setStartTime(null);
    setIsSpeaking(false);
    setShowBearDance(false);
    setShowConfetti(false);
    setShowHighlighted(false);
    setHoveredWord(null);
    setMultilingualPosition({ x: 0, y: 0 });
    setAudio(null);
    setIsPlayingAudio(false);
    setCurrentHighlightedWord(-1);
    setShowReadingSpeed(false);
    setSpeed("Slow");
    setReadingStartTime(null);

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

    // Reset refs
    timeoutRef.current.forEach((t) => clearTimeout(t)); // clear any existing timeouts
    timeoutRef.current = [];
    speechSynthesisRef.current = null;
    utteranceRef.current = null;
    wordMapRef.current = [];

    // Call handleNext after a small delay
    setTimeout(() => {
      handleNext();
      callTelemetry();
    }, 200);
  };

  if (showReadingSpeed) {
    return (
      <MainLayout
        background={background}
        handleNext={handleNext}
        showTimer={showTimer}
        points={points}
        pageName={"m14"}
        {...{
          steps,
          currentStep,
          level,
          progressData,
          showProgress,
          playTeacherAudio,
          handleBack,
          disableScroll: disableScreen,
          loading,
          vocabCount,
          wordCount,
        }}
      >
        <div
          className="slow-transition"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="scale-transition"
            style={{
              width: "90%",
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
              <img src={tortoiseImg} alt="tortoise" style={{ width: "70px" }} />
            </div>

            {isMatch === 0 ? (
              <>
                <h2
                  style={{
                    color: "#333f61",
                    fontWeight: "700",
                    fontSize: "28px",
                    marginBottom: "10px",
                    fontFamily: "Quicksand",
                  }}
                >
                  No voice detected, please speak
                </h2>
              </>
            ) : isMatch > 0 && isMatch < 5 ? (
              <>
                <h2
                  style={{
                    color: "#333f61",
                    fontWeight: "700",
                    fontSize: "28px",
                    marginBottom: "10px",
                    fontFamily: "Quicksand",
                  }}
                >
                  Please try again, your speech didn’t match enough
                </h2>
              </>
            ) : (
              <>
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

                {/* show this paragraph only if isMatch > 6 */}
                {isMatch >= 5 && (
                  <p
                    style={{
                      color: "#333f61",
                      fontSize: "24px",
                      margin: "10px",
                      fontFamily: "Quicksand",
                      fontStyle: "bold",
                      fontWeight: 600,
                    }}
                  >
                    {speed === "Fast"
                      ? "Great speed, keep it up!"
                      : "Try reading faster"}
                  </p>
                )}
              </>
            )}

            <img
              src={nextImg}
              onClick={handleNextWord}
              alt="next"
              style={{
                marginTop: "20px",
                width: "45px",
                height: "45px",
                margin: "10px 20px",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        disableScroll: disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      <div
        className="slow-transition"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          height: "100%",
          padding: "20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Hint Icon */}
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
                src={`https://www.youtube.com/embed/kwJEIqYMKEM?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        {/* Confetti */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        {/* Title */}
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "#6b3f23",
            textAlign: "center",
            margin: "-20px 0 15px 0",
            transition: "all 0.4s ease",
          }}
        >
          Read the Paragraph
        </h2>

        {/* ==== BOOK SECTION WITH LISTEN BEAR AT BOTTOM LEFT ==== */}
        {!showHighlighted && (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Book Container - CENTERED */}
            <div
              className="scale-transition"
              style={{
                position: "relative",
                // borderRadius: "12px",
                width: "70%",
                maxWidth: "480px",
                padding: "16px",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "17px",
                  left: "16px",
                  height: "8px",
                  width: "calc(100% - 32px)",
                  background: "rgba(255, 140, 0, 0.3)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "0%",
                    backgroundColor: "#FF4500",
                    animation: "growLine 60s ease-out forwards", // Changed from 3s to 5s for slower animation
                  }}
                ></div>
              </div>
              {/* Book Image */}
              {/* <img
                src={paragraphData.bookImage}
                alt="Book Page"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  marginTop: "8px",
                }}
              /> */}
              <ZoomableImage
                src={paragraphData.bookImage}
                alt="contentImage"
                imageStyle={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  marginTop: "8px",
                }}
              />
            </div>

            {/* Listen Bear - BOTTOM LEFT OF BOOK with larger size */}
            {isSpeaking && (
              <img
                src={listenbear}
                alt="Listen Bear"
                style={{
                  position: "absolute",
                  bottom: "-50px", // Book के नीचे
                  left: "-106px", // Book के left side में
                  width: "190px",
                  height: "auto",
                  zIndex: 10,
                }}
              />
            )}
          </div>
        )}

        {/* Bear Dance */}
        {showBearDance && (
          <img
            src={beardanceImg}
            alt="Bear Dance"
            style={{
              marginTop: "15px",
              width: "200px",
              height: "auto",
              animation: "bounce 2s infinite",
            }}
          />
        )}

        {/* ==== SPEAK BUTTON ==== */}
        {!showHighlighted && !showBearDance && (
          <div
            onClick={handleSpeakClick}
            style={{
              marginTop: "25px",
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {isSpeaking && (
              <img
                src={graphImg}
                alt="Graph"
                style={{
                  position: "absolute",
                  top: "-20px",
                  width: "200px",
                  height: "39px",
                  marginBottom: "10px",
                  transition: "all 0.5s ease",
                }}
              />
            )}

            <img
              src={isSpeaking ? pauseImg : speakButton}
              alt="Mic/Pause"
              style={{
                width: "55px",
                height: "55px",
                marginTop: isSpeaking ? "40px" : "0",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
        )}

        {/* ==== HIGHLIGHTED TEXT ==== */}
        {showHighlighted && (
          <div
            className="slow-transition"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginTop: "30px",
              width: "100%",
            }}
          >
            <div
              ref={textContainerRef}
              style={{
                padding: "20px",
                borderRadius: "12px",
                width: "70%",
                maxWidth: "600px",
                textAlign: "center",
                position: "relative",
                marginLeft: "30px",
              }}
            >
              <div
                ref={scrollContainerRef}
                className="smooth-text-container"
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <p
                  style={{
                    fontSize:
                      (getLocalData("lang") || "en") === "te" ? "20px" : "18px",
                    fontWeight: "500",
                    margin: "0",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "#020202ff",
                    transition: "all 0.3s ease",
                    minHeight: "200px",
                    fontFamily: getFontFamily(getLocalData("lang") || "en"),
                  }}
                  dangerouslySetInnerHTML={{
                    __html: getHighlightedText(),
                  }}
                ></p>
              </div>

              {/* Multilingual Image - appears below hovered word */}
              {hoveredWord && !isPlayingAudio && (
                <img
                  src={multilingualImg}
                  alt="Multilingual"
                  style={{
                    position: "absolute",
                    left: `${multilingualPosition.x}px`,
                    top: `${multilingualPosition.y}px`,
                    transform: "translateX(-50%)",
                    width: "190px",
                    height: "80px",
                    zIndex: 1000,
                    pointerEvents: "none",
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </div>

            {/* Listen Icon - Now works as play/pause for speech synthesis */}
            <img
              src={listenImg}
              alt="Listen"
              onClick={handleListenClick}
              style={{
                position: "absolute",
                left: "22%",
                top: "30%",
                transform: "translate(-100%, -50%)",
                width: "50px",
                cursor: "pointer",
                opacity: isPlayingAudio ? 0.8 : 1,
                transition: "all 0.3s ease",
                backgroundColor: isPlayingAudio ? "#ffa500" : "transparent",
                borderRadius: "50%",
                padding: "10px",
                zIndex: 10,
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translate(-100%, -50%) scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "translate(-100%, -50%) scale(1)")
              }
            />

            {/* Next button */}
            <img
              src={nextImg}
              alt="Next"
              onClick={handleNextClick}
              style={{
                marginTop: "5px",
                width: "50px",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ParagraphFlow;
