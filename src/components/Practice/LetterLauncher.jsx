import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../Layouts.jsx/MainLayout";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { getLocalData, setLocalData } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

/**
 * Letter Launcher Component
 * Speed-based letter/syllable recognition game for F3 flow
 *
 * Props:
 * - level: Starting level (1, 2, 3, etc.)
 * - endLevel: Optional end level for level range (for Apply steps)
 * - contentType: "letter" or "syllable"
 * - contentCount: Number of items to show per level
 * - isShowcase: Whether this is an Apply step (has levels and pass/fail criteria)
 * - handleNext: Callback when step completes
 * - handleBack: Callback for back navigation
 * - applyStep: Apply step number (1 or 2)
 * - failRedirect: Redirect target on failure
 * - passRedirect: Redirect target on pass
 * - isF3FlowActive: Whether F3 flow is active
 * - f3FlowStep: Current F3 flow step info
 */
const LetterLauncher = ({
  level = 1,
  endLevel,
  contentType = "letter", // "letter" or "syllable"
  contentCount = 10,
  isShowcase = false,
  handleNext,
  handleBack,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  header = "Letter Speed",
  points = 0,
  steps = 10,
  currentStep = 1,
  progressData,
  showProgress = true,
  background = "#FFB31F",
  enableNext,
  setEnableNext,
  loading,
  setOpenMessageDialog,
  vocabCount,
  wordCount,
  showTimer = false,
  milestoneLevel,
  setProgressData,
  setCurrentQuestion,
}) => {
  const navigate = useNavigate();
  const lang = getLocalData("lang") || "en";
  const [currentLevel, setCurrentLevel] = useState(level || 1);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds for Apply steps
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [items, setItems] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Generate items based on contentType
  useEffect(() => {
    const generateItems = () => {
      const generatedItems = [];

      // For letters: A-Z
      // For syllables: common syllables like "at", "an", "in", "on", etc.
      if (contentType === "letter") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        for (let i = 0; i < contentCount; i++) {
          const letter = letters[Math.floor(Math.random() * letters.length)];
          generatedItems.push({
            id: i,
            text: letter,
            type: "letter",
          });
        }
      } else if (contentType === "syllable") {
        const syllables = [
          "at",
          "an",
          "in",
          "on",
          "am",
          "it",
          "up",
          "en",
          "ed",
          "ot",
        ];
        for (let i = 0; i < contentCount; i++) {
          const syllable =
            syllables[Math.floor(Math.random() * syllables.length)];
          generatedItems.push({
            id: i,
            text: syllable,
            type: "syllable",
          });
        }
      }

      setItems(generatedItems);
      if (generatedItems.length > 0) {
        setCurrentItem(generatedItems[0]);
      }
    };

    generateItems();
  }, [contentType, contentCount, currentLevel]);

  // Timer for Apply steps
  useEffect(() => {
    if (isShowcase && isPlaying && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isShowcase, isPlaying, timeRemaining]);

  const handleTimeUp = () => {
    setIsPlaying(false);
    // Check pass criteria: correct letters > 10 within 30 seconds
    if (correctCount > 10) {
      handleLevelPass();
    } else {
      handleLevelFail();
    }
  };

  const handleStart = () => {
    setIsPlaying(true);
    setTimeRemaining(100);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentItemIndex(0);
    if (items.length > 0) {
      setCurrentItem(items[0]);
    }
  };

  const handleCorrect = () => {
    playSound(correctSound);
    setCorrectCount((prev) => prev + 1);
    setScore((prev) => prev + 1);
    moveToNextItem();
  };

  const handleWrong = () => {
    playSound(wrongSound);
    setWrongCount((prev) => prev + 1);
    moveToNextItem();
  };

  const moveToNextItem = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex((prev) => {
        const nextIndex = prev + 1;
        setCurrentItem(items[nextIndex]);
        return nextIndex;
      });
    } else {
      // Completed all items in this level
      if (isShowcase) {
        // For Apply steps, check if we need to move to next level
        if (currentLevel < (endLevel || 1)) {
          // Move to next level
          setCurrentLevel((prev) => prev + 1);
          setCurrentItemIndex(0);
          setCorrectCount(0);
          setWrongCount(0);
          // Regenerate items for new level
        } else {
          // All levels completed
          handleLevelPass();
        }
      } else {
        // Practice step completed
        handleStepComplete();
      }
    }
  };

  const handleLevelPass = () => {
    setIsPlaying(false);
    setIsComplete(true);

    // For Apply steps, check if all levels are passed
    if (isShowcase && currentLevel >= (endLevel || 1)) {
      // All levels passed - will redirect via onLevelComplete callback
      setTimeout(() => {
        if (handleNext) {
          handleNext();
        }
      }, 2000);
    } else if (isShowcase) {
      // Move to next level
      setCurrentLevel((prev) => prev + 1);
      setCurrentItemIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setIsComplete(false);
      setIsPlaying(false);
    }
  };

  const handleLevelFail = () => {
    setIsPlaying(false);
    // Redirect to failRedirect
    if (failRedirect && handleNext) {
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleStepComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      if (handleNext) {
        handleNext();
      }
    }, 2000);
  };

  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(soundFile);
    audioRef.current.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  };

  const handleRetry = () => {
    setCurrentItemIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setScore(0);
    setIsComplete(false);
    setIsPlaying(false);
    setTimeRemaining(100);
    if (items.length > 0) {
      setCurrentItem(items[0]);
    }
  };

  if (!currentItem && items.length === 0) {
    return (
      <MainLayout
        page={header}
        setPage={() => {}}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        vocabCount={vocabCount}
        wordCount={wordCount}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      page={header}
      setPage={() => {}}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
      progressData={progressData}
      showProgress={showProgress}
      points={points}
      vocabCount={vocabCount}
      wordCount={wordCount}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "20px",
          background: background,
        }}
      >
        {isShowcase && (
          <Box
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6">
              Level {currentLevel} / {endLevel || 1}
            </Typography>
            {isPlaying && (
              <Typography variant="body1">Time: {timeRemaining}s</Typography>
            )}
            <Typography variant="body2">
              Correct: {correctCount} | Wrong: {wrongCount}
            </Typography>
          </Box>
        )}

        {!isPlaying && !isComplete && (
          <Box
            sx={{
              textAlign: "center",
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
              {isShowcase ? `Level ${currentLevel}` : "Letter Speed"}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "30px" }}>
              {isShowcase
                ? "Identify as many letters as possible in 30 seconds!"
                : "Click Start to begin identifying letters"}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleStart}
              sx={{
                background: "#4CAF50",
                "&:hover": { background: "#45a049" },
                padding: "15px 40px",
                fontSize: "18px",
              }}
            >
              Start
            </Button>
          </Box>
        )}

        {isPlaying && currentItem && (
          <Box
            sx={{
              textAlign: "center",
              background: "white",
              padding: "60px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              minWidth: "300px",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "120px",
                fontWeight: "bold",
                marginBottom: "40px",
                color: "#333",
              }}
            >
              {currentItem.text}
            </Typography>
            <Box
              sx={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleCorrect}
                sx={{ padding: "15px 40px", fontSize: "18px" }}
              >
                Correct
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleWrong}
                sx={{ padding: "15px 40px", fontSize: "18px" }}
              >
                Wrong
              </Button>
            </Box>
            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              Item {currentItemIndex + 1} / {items.length}
            </Typography>
          </Box>
        )}

        {isComplete && (
          <Box
            sx={{
              textAlign: "center",
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ marginBottom: "20px", color: "#4CAF50" }}
            >
              {isShowcase && correctCount > 10
                ? "Level Passed!"
                : "Step Completed!"}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "30px" }}>
              Score: {correctCount} correct, {wrongCount} wrong
            </Typography>
            {isShowcase && correctCount <= 10 && (
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleRetry}
                startIcon={<RotateCcw />}
                sx={{ marginRight: "10px" }}
              >
                Try Again
              </Button>
            )}
            {isShowcase &&
              correctCount > 10 &&
              currentLevel < (endLevel || 1) && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    setCurrentLevel((prev) => prev + 1);
                    setCurrentItemIndex(0);
                    setCorrectCount(0);
                    setWrongCount(0);
                    setIsComplete(false);
                    setIsPlaying(false);
                  }}
                  endIcon={<ArrowRight />}
                >
                  Next Level
                </Button>
              )}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default LetterLauncher;
