import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
import tortoiseImg from "../../assets/tortoiseImg.svg";
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
  sendTestRigScore,
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
  callTelemetryDiscovery,
} from "../../utils/apiUtil";
import AudioTooltipModal from "./AudioTooltipModal";
import { doubleMetaphone } from "double-metaphone";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../../services/orchestration/orchestrationService";
import { fetchGetSetResult } from "../../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../../services/content/contentService";
import { useNavigate } from "react-router-dom";
import { uniqueId } from "../../services/utilService";
import { updateLearnerProfile } from "../../services/learnerAi/learnerAiService";
import bubbleImg from "../../assets/bubble.png";
import magnifier from "../../assets/magnifier.png";
import { Box } from "@mui/material";
import listenBearGif from "../../assets/beardances.gif";
import hintimg from "../../assets/hintsicon.svg";
import { MessageDialog } from "../Assesment/Assesment";

const AserFlow = ({
  // setVoiceText,
  // setRecordedAudio,
  // setVoiceAnimate,
  // storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  // enableNext,
  showTimer,
  // points,
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
  // disableScreen,
  isDemo,
  handleBack,
  // setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  multilingual,
  contentSourceData,
  // Demo mode props
  onSpeakerClick,
  onBubbleClick,
  disableSpeaker = false,
  disableBubbles = false,
  hideContentDuringDemo = false,
  blockProgression = false,
  hideProgress = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const audioRef = useRef(null);
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);
  const sessionId = getLocalData("sessionId");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [points, setPoints] = useState(0);
  const [enableNext, setEnableNext] = useState(false);
  const [sentencePassedCounter, setSentencePassedCounter] = useState(0);
  const [assesmentCount, setAssesmentcount] = useState(0);
  const [initialAssesment, setInitialAssesment] = useState(true);
  const [disableScreen, setDisableScreen] = useState(false);
  // const [play] = useSound(LevelCompleteAudio);
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [questions, setQuestions] = useState([]);
  // Track character selections for ansSelectionStatus - now an array of objects
  const [ansSelectionStatus, setAnsSelectionStatus] = useState([]);
  const lang = getLocalData("lang");
  const virtualId = getLocalData("virtualId");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentItemNumber, setCurrentItemNumber] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // In demo mode, only show 1 question; otherwise show 10
  const TOTAL_ITEMS = isDemo ? 1 : 10;

  const completionPercentage = Math.min(
    (Math.min(currentItemNumber + 1, TOTAL_ITEMS) / TOTAL_ITEMS) * 100,
    100
  );

  background = "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)";
  showTimer = false;

  useEffect(() => {
    (async () => {
      let quesArr = [];
      try {
        const lang = getLocalData("lang");
        // Fetch assessment data
        const resAssessment = await fetchAssessmentData(lang);
        const sentences = resAssessment?.data?.find(
          (elem) => elem.category === "Char"
        );

        if (!sentences?.collectionId) {
          console.error("No collection ID found for sentences.");
          return;
        }

        // In demo mode, only fetch 1 question; otherwise fetch 10
        const questionCount = isDemo ? 1 : 10;
        const resPagination = await fetchPaginatedContent(
          sentences.collectionId,
          questionCount
        );

        // Only call addLesson if not in preview/demo mode
        if (!isDemo) {
          await addLesson({
            sessionId,
            milestone: `practice`,
            lesson: "0",
            progress: 0,
            language: lang,
            milestoneLevel: "B",
          });
        }

        // Update state
        setCurrentContentType("Char");
        setTotalSyllableCount(resPagination?.totalSyllableCount);
        setCurrentCollectionId(sentences?.collectionId);
        setAssessmentResponse(resAssessment);
        setLocalData("storyTitle", sentences?.name);
        quesArr = [...(resPagination?.data || [])];

        const existingLetters = quesArr.map(
          (q) => q?.contentSourceData?.[0]?.text
        );

        const languageChars = {
          en: "abcdefghijklmnopqrstuvwxyz".split(""),
          hi: "अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह".split(""), // Hindi
          ta: "அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவஶஷஸஹ".split(""), // Tamil
          te: "అఆఇఈఉఊఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహ".split(""), // Telugu
          kn: "ಅಆಇಈಉಊಋಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹ".split(""), // Kannada
        };

        // Default to English if language not found
        const allChars = languageChars[lang] || languageChars["en"];

        const availableChars = allChars.filter(
          (ch) => !existingLetters.includes(ch)
        );

        // In demo mode, add more distractors (7-8) to have enough bubbles for selection
        // In normal mode, add 2 distractors
        const distractorCount = isDemo ? 7 : 2;
        const extraChars = availableChars
          .sort(() => 0.5 - Math.random())
          .slice(0, distractorCount);

        const extraQuestions = extraChars.map((ch) => ({
          contentId: `fake_${ch}`,
          contentSourceData: [{ text: ch }],
          isFake: true,
        }));

        quesArr = [...quesArr, ...extraQuestions];

        setQuestions(quesArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [isDemo, sessionId]);

  useEffect(() => {
    if (questions?.length) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [questions]);

  const currentItem = questions?.[currentIndex];
  const correctLetter = currentItem?.contentSourceData[0].text;

  const questionLetters = questions.map((q) => q.contentSourceData[0].text);

  const handlePlayAudio = () => {
    // If in demo mode and custom handler provided, call it (in addition to normal flow)
    if (isDemo && onSpeakerClick) {
      onSpeakerClick();
    }

    // Only play audio if contentId exists and is not a fake item
    if (currentItem?.contentId && !currentItem?.isFake) {
      try {
        const audio = new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${currentItem.contentId}.wav`
        );
        setIsAudioPlaying(true);

        // Handle audio events
        audio.onended = () => {
          setIsAudioPlaying(false);
        };

        audio.onerror = (error) => {
          console.error("Error loading audio:", error);
          setIsAudioPlaying(false);
        };

        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsAudioPlaying(false);
        });
      } catch (error) {
        console.error("Error creating audio:", error);
        setIsAudioPlaying(false);
      }
    } else {
      // If no valid audio, just set playing to false
      setIsAudioPlaying(false);
    }
  };

  const handleCompletion = async () => {
    // Skip API calls in preview/demo mode
    if (isDemo) {
      return;
    }

    const sub_session_id = getLocalData("sub_session_id");

    try {
      const milestoneLevel = "B";

      let requestBody = {
        original_text: "Char",
        audio: "",
        //user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId: contentId,
        contentType: "Char",
        mechanics_id: getLocalData("mechanism_id") || "",
        milestone: milestoneLevel,
        ansSelectionStatus: ansSelectionStatus,
      };

      const result = await updateLearnerProfile(lang, requestBody);
    } catch (error) {
      console.error("Error creating learner progress:", error);
    }

    try {
      const getSetResultRes = await fetchGetSetResult(
        sub_session_id,
        currentContentType,
        currentCollectionId,
        totalSyllableCount
      );
      const { data } = getSetResultRes;
      await addLesson({
        sessionId,
        milestone: `practice`,
        lesson: data?.currentLevel !== "B" ? "0" : "1",
        progress: data?.currentLevel !== "B" ? 0 : 5,
        language: lang,
        milestoneLevel: data?.currentLevel || "B",
        ...(data?.currentLevel === "B" && { subMilestoneLevel: "F1" }),
      });
    } catch (error) {
      console.error("Error fetching set result:", error);
    }

    if (!(localStorage.getItem("contentSessionId") !== null)) {
      let point = 1;
      let milestone = "B";

      if (point !== 1) {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }

      try {
        const result = await addPointer(point, milestone);
        const awardedPoints = result?.result?.points;
        if (awardedPoints !== 1) {
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          return;
        }
        setPoints(result?.result?.totalLanguagePoints || 0);
      } catch (error) {
        setPoints(0);
        console.error("Error adding points:", error);
      }
    } else {
      sendTestRigScore(5);
      // setPoints(localStorage.getItem("currentLessonScoreCount"));
    }
    navigate("/discover-start");
  };

  const handleBubbleClick = (letter, index) => {
    setClickedIndex(index);
    setIsAudioPlaying(false);
    setTimeout(() => setClickedIndex(null), 1000);

    setSelectedLetter(letter);
    const correct = letter === correctLetter;
    setIsCorrect(correct);
    setShowNext(true);

    setAnsSelectionStatus((prev) => {
      const newEntry = {
        text: letter,
        status: correct,
        gameType: "letter-hunt",
      };
      return [...prev, newEntry];
    });

    if (correct) correctAudio.play();
    else wrongAudio.play();

    // If in demo mode and custom handler provided, call it (in addition to normal flow)
    // Pass whether the answer was correct
    if (isDemo && onBubbleClick) {
      onBubbleClick(letter, index, correct);

      // In demo mode, if answer is correct, don't proceed to next question
      // Let the preview component handle the completion screen
      if (correct) {
        return; // Stop here, don't call handleNextClick
      }
    }

    // Always proceed to next question (unless in blocked demo mode with wrong answer)
    if (!blockProgression || correct) {
      setTimeout(() => {
        handleNextClick(correct);
      }, 1000);
    } else {
      // Even if blocked, we should still allow progression after showing feedback
      setTimeout(() => {
        handleNextClick(false);
      }, 1000);
    }
  };

  const handleNextClick = async (wasCorrect = false) => {
    // In demo mode, don't proceed to next question - preview component handles completion
    if (isDemo) {
      return;
    }

    // If all items are completed, handle navigation
    if (currentItemNumber >= TOTAL_ITEMS) {
      await handleCompletion();
      setLocalData("rFlow", false);
      // Skip telemetry in preview/demo mode
      if (!isDemo) {
        callTelemetryDiscovery("Discovery-AserFlow");
      }
      handleNext?.();
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
      return;
    }

    setSelectedLetter("");
    setIsCorrect(null);
    setShowNext(false);
    setIsAudioPlaying(false);

    // Increment progress for both correct and wrong answers
    const newItemNumber = Math.min(currentItemNumber + 1, TOTAL_ITEMS);
    setCurrentItemNumber(newItemNumber);

    console.log("AserFlow - Progress update:", {
      currentItemNumber,
      newItemNumber,
      TOTAL_ITEMS,
      isComplete: newItemNumber >= TOTAL_ITEMS,
    });

    // After completing 10 items (regardless of correct/wrong)
    if (newItemNumber >= TOTAL_ITEMS) {
      console.log(
        "AserFlow - All 10 items completed! Next button should appear."
      );
      await handleCompletion();
      setLocalData("rFlow", false);
      // Skip telemetry in preview/demo mode
      if (!isDemo) {
        callTelemetryDiscovery("Discovery-AserFlow");
      }

      // Delay showing success message to allow next button to appear first
      // Show success message after a short delay (optional - user can use next button instead)
      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 1000);

      return;
    }

    // Always move to next question (whether correct or wrong)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
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
      isRecordingComplete={false}
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
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* === Top Right Progress Bar === */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 20,
            display: hideProgress ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "120px",
            zIndex: 2000, // keeps above everything
            opacity: hideContentDuringDemo ? 0 : 1,
            visibility: hideContentDuringDemo ? "hidden" : "visible",
            transition: "opacity 0.3s ease",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "2px solid #1CB0F6",
              borderRadius: "50%",
              padding: "6px 12px",
              fontFamily: "Quicksand",
              fontWeight: 700,
              fontSize: "14px",
              color: "#000",
              position: "relative",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              marginBottom: "-8px",
              display: hideProgress ? "none" : "block",
            }}
          >
            {Math.min(currentItemNumber + 1, TOTAL_ITEMS)}/{TOTAL_ITEMS}
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "18px",
              backgroundColor: "#E3F2FD",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              zIndex: 1,
              border: "2px solid #BBDEFB",
            }}
          >
            <Box
              sx={{
                width: `${completionPercentage}%`,
                height: "100%",
                backgroundColor: "#1CB0F6",
                borderRadius: "20px",
                transition: "width 0.4s ease",
              }}
            />
          </Box>
        </Box>

        <img
          src={hintimg}
          alt="hint"
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "20px",
            left: "10px",
            cursor: "pointer",
            zIndex: 1000,
            opacity: hideContentDuringDemo ? 0 : 1,
            visibility: hideContentDuringDemo ? "hidden" : "visible",
            transition: "opacity 0.3s ease",
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
              zIndex: 999999,
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
                src={`https://www.youtube.com/embed/Itq9s44p2-o?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px", zIndex: 99999 }}
              ></iframe>
            </div>
          </div>
        )}
        {/* --- Title --- */}

        {/* --- Bubble Area --- */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "350px",
            //background: "#fff",
            borderRadius: "20px",
            //boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            overflow: "hidden",
            opacity: hideContentDuringDemo ? 0 : 1,
            visibility: hideContentDuringDemo ? "hidden" : "visible",
            transition: "opacity 0.3s ease",
          }}
        >
          {questionLetters?.map((char, index) => {
            const positions = [
              { top: "20%", left: "20%" },
              { top: "70%", left: "15%" },
              { top: "48%", left: "30%" },
              { top: "48%", left: "53%" },
              { top: "18%", left: "62%" },
              { top: "52%", left: "73%" },
              { top: "20%", left: "80%" },
              { top: "73%", left: "85%" },
              { top: "20%", left: "40%" },
              { top: "75%", left: "43%" },
              { top: "79%", left: "61%" },
              { top: "83%", left: "30%" },
            ];

            const pos = positions[index % positions.length];

            return (
              <div
                key={index}
                onClick={() => {
                  if (!disableBubbles) {
                    handleBubbleClick(char, index);
                  }
                }}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)",
                  cursor: disableBubbles ? "not-allowed" : "pointer",
                  textAlign: "center",
                  zIndex: 99999,
                  opacity: disableBubbles ? 0.5 : 1,
                  pointerEvents: disableBubbles ? "none" : "auto",
                }}
              >
                {/* Bubble image */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    zIndex: 99999,
                  }}
                >
                  <img
                    src={bubbleImg}
                    alt="bubble"
                    style={{
                      width: "100px",
                      height: "100px",
                      filter: ansSelectionStatus.some(
                        (item) => item.text === char && item.status === true
                      )
                        ? "drop-shadow(0 0 10px #08a169ff)"
                        : ansSelectionStatus.some(
                            (item) =>
                              item.text === char && item.status === false
                          )
                        ? "drop-shadow(0 0 10px #d31818ff)"
                        : "drop-shadow(0 3px 8px rgba(0,0,0,0.3))",
                      transition: "filter 0.3s ease",
                    }}
                  />

                  {clickedIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(31, 155, 222, 0.48)",
                        borderRadius: "50%",
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  )}

                  {/* Letter inside bubble */}
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "68px",
                      fontWeight: "800",
                      fontFamily: "Quicksand",
                      color: "#333F61",
                      pointerEvents: "none",
                      userSelect: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    {char}
                  </span>

                  {/* Pointer under bubble for demo - show only for correct bubble in demo mode */}
                  {isDemo && char === correctLetter && !disableBubbles && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 20px)",
                        left: "0%",
                        rotate: "180deg",
                        transform: "translateX(-50%)",
                        zIndex: 10001,
                        fontSize: "48px",
                        animation: "pointDown 1.5s ease-in-out infinite",
                        pointerEvents: "none",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                      }}
                    >
                      👇
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Audio Button --- */}
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            opacity: hideContentDuringDemo ? 0 : 1,
            visibility: hideContentDuringDemo ? "hidden" : "visible",
            transition: "opacity 0.3s ease",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "90px",
              height: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "7px",
              cursor: disableSpeaker ? "not-allowed" : "pointer",
              opacity: disableSpeaker ? 0.5 : 1,
              pointerEvents: disableSpeaker ? "none" : "auto",
            }}
            onClick={() => {
              if (!disableSpeaker) {
                handlePlayAudio();
              }
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: isAudioPlaying ? "0px" : "90px",
                height: isAudioPlaying ? "0px" : "90px",
                backgroundColor: "#A856FF",
                borderRadius: "50%",
                animation: isAudioPlaying
                  ? "none"
                  : "pulse 1.2s linear infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(0.6)",
                    opacity: 0,
                  },
                  "50%": {
                    opacity: 1,
                  },
                  "100%": {
                    transform: "scale(1.4)",
                    opacity: 0,
                  },
                },
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <ListenButton height={50} width={50} />
            </Box>
          </Box>
          {/* Show next button only after completing all items (hide in demo mode) */}
          {(() => {
            // Don't show next button in demo mode - preview component handles completion
            if (isDemo) return false;
            const shouldShowNext = currentItemNumber >= TOTAL_ITEMS;
            console.log("AserFlow - Next button render check:", {
              currentItemNumber,
              TOTAL_ITEMS,
              shouldShowNext,
              showSuccessMessage,
            });
            return shouldShowNext;
          })() && (
            <img
              src={nextImg}
              alt="next"
              style={{
                width: "50px",
                cursor: "pointer",
                marginLeft: "10px",
                opacity: hideContentDuringDemo ? 0 : 1,
                visibility: hideContentDuringDemo ? "hidden" : "visible",
                transition: "opacity 0.3s ease",
                zIndex: 10001,
                position: "relative",
              }}
              onClick={() => {
                console.log("AserFlow - Next button clicked after completion");
                // Handle navigation when next button is clicked after completion
                handleNext?.();
                if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                  navigate("/");
                } else {
                  navigate("/discover-start");
                }
              }}
            />
          )}
          <img
            src={listenBearGif}
            alt="bear"
            style={{
              position: "absolute",
              zIndex: "9999",
              bottom: "40px",
              left: "-20px",
              width: "230px",
              opacity: hideContentDuringDemo ? 0 : 1,
              visibility: hideContentDuringDemo ? "hidden" : "visible",
              transition: "opacity 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Animation styles for demo pointer */}
      {isDemo && (
        <style>
          {`
            @keyframes pointDown {
              0%, 100% {
                transform: translateX(-50%) translateY(0);
              }
              50% {
                transform: translateX(-50%) translateY(15px);
              }
            }
          `}
        </style>
      )}

      {/* Success Message Dialog with Panda - Rendered via Portal to ensure proper centering */}
      {/* Don't show success message in demo mode - preview component handles completion */}
      {showSuccessMessage &&
        !isDemo &&
        createPortal(
          <MessageDialog
            message="You have successfully completed the character game"
            closeDialog={() => {
              setShowSuccessMessage(false);
              // Don't auto-navigate - let user click next button instead
              // handleNext?.();
              // if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              //   navigate("/");
              // } else {
              //   navigate("/discover-start");
              // }
            }}
          />,
          document.body
        )}
    </MainLayout>
  );
};

export default AserFlow;
