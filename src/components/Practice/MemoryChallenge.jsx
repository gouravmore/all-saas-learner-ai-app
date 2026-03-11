import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../Layouts.jsx/MainLayout";
import { Box, Typography, Button, CircularProgress, Grid } from "@mui/material";
import { getLocalData, setLocalData } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

/**
 * Memory Challenge Component
 * Sequence recall game for F3 flow Apply steps
 *
 * Props:
 * - level: Starting level (1, 2, 3)
 * - endLevel: End level (usually 3)
 * - contentCount: Number of sequences per level (usually 5)
 * - handleNext: Callback when step completes
 * - handleBack: Callback for back navigation
 * - applyStep: Apply step number (1 or 2)
 * - failRedirect: Redirect target on failure
 * - passRedirect: Redirect target on pass
 * - isF3FlowActive: Whether F3 flow is active
 * - f3FlowStep: Current F3 flow step info
 */
const MemoryChallenge = ({
  level = 1,
  endLevel = 3,
  contentCount = 5, // 5 sequences per level
  handleNext,
  handleBack,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  header = "Memory Challenge",
  points = 0,
  steps = 5,
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
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [sequences, setSequences] = useState([]);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [isShowingSequence, setIsShowingSequence] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef(null);
  const sequenceTimerRef = useRef(null);

  // Generate sequences: 2 meaningful words + 3 non-word sequences per level
  useEffect(() => {
    const generateSequences = () => {
      const generatedSequences = [];

      // Meaningful words
      const meaningfulWords = [
        ["cat", "dog"],
        ["bag", "tap"],
        ["sun", "moon"],
        ["hat", "cap"],
        ["run", "jump"],
      ];

      // Non-word sequences
      const nonWords = [
        ["b", "a", "t"],
        ["p", "i", "g"],
        ["c", "u", "p"],
        ["d", "o", "g"],
        ["f", "a", "n"],
      ];

      for (let i = 0; i < contentCount; i++) {
        if (i < 2) {
          // First 2 are meaningful words
          const wordPair =
            meaningfulWords[Math.floor(Math.random() * meaningfulWords.length)];
          generatedSequences.push({
            id: i,
            sequence: wordPair,
            type: "meaningful",
            correctAnswer: wordPair,
          });
        } else {
          // Last 3 are non-word sequences
          const nonWord = nonWords[Math.floor(Math.random() * nonWords.length)];
          generatedSequences.push({
            id: i,
            sequence: nonWord,
            type: "nonword",
            correctAnswer: nonWord,
          });
        }
      }

      setSequences(generatedSequences);
      if (generatedSequences.length > 0) {
        setCurrentSequence(generatedSequences[0]);
        setIsShowingSequence(true);
        // Show sequence for 3 seconds
        sequenceTimerRef.current = setTimeout(() => {
          setIsShowingSequence(false);
          setUserInput([]);
        }, 3000);
      }
    };

    generateSequences();
  }, [contentCount, currentLevel]);

  const handleSequenceClick = (item) => {
    if (isShowingSequence) return; // Don't allow input while showing sequence

    setUserInput((prev) => [...prev, item]);
  };

  const handleSubmit = () => {
    if (!currentSequence) return;

    const isCorrect =
      JSON.stringify(userInput) ===
      JSON.stringify(currentSequence.correctAnswer);

    if (isCorrect) {
      playSound(correctSound);
      setCorrectCount((prev) => prev + 1);
    } else {
      playSound(wrongSound);
      setWrongCount((prev) => prev + 1);
    }

    // Move to next sequence
    if (currentSequenceIndex < sequences.length - 1) {
      setCurrentSequenceIndex((prev) => {
        const nextIndex = prev + 1;
        setCurrentSequence(sequences[nextIndex]);
        setIsShowingSequence(true);
        setUserInput([]);
        // Show next sequence for 3 seconds
        if (sequenceTimerRef.current) {
          clearTimeout(sequenceTimerRef.current);
        }
        sequenceTimerRef.current = setTimeout(() => {
          setIsShowingSequence(false);
        }, 3000);
        return nextIndex;
      });
    } else {
      // Completed all sequences in this level
      handleLevelComplete();
    }
  };

  const handleLevelComplete = () => {
    // Check pass criteria: > 80% accuracy
    const accuracy = (correctCount / sequences.length) * 100;

    if (accuracy > 80) {
      // Level passed
      if (currentLevel < endLevel) {
        // Move to next level
        setCurrentLevel((prev) => prev + 1);
        setCurrentSequenceIndex(0);
        setCorrectCount(0);
        setWrongCount(0);
        setUserInput([]);
        setIsComplete(false);
        // Sequences will be regenerated by useEffect
      } else {
        // All levels passed
        setIsComplete(true);
        setTimeout(() => {
          if (handleNext) {
            handleNext();
          }
        }, 2000);
      }
    } else {
      // Level failed - redirect to failRedirect
      if (failRedirect && handleNext) {
        setTimeout(() => {
          handleNext();
        }, 2000);
      }
    }
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
    setCurrentSequenceIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setUserInput([]);
    setIsComplete(false);
    // Sequences will be regenerated by useEffect
  };

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);

  if (!currentSequence && sequences.length === 0) {
    return (
      <MainLayout
        page={header}
        setPage={() => {}}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
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

  const accuracy =
    sequences.length > 0 ? (correctCount / sequences.length) * 100 : 0;

  return (
    <MainLayout
      page={header}
      setPage={() => {}}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
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
            Level {currentLevel} / {endLevel}
          </Typography>
          <Typography variant="body2">
            Sequence {currentSequenceIndex + 1} / {sequences.length}
          </Typography>
          <Typography variant="body2">
            Correct: {correctCount} | Wrong: {wrongCount}
          </Typography>
          <Typography variant="body2">
            Accuracy: {accuracy.toFixed(0)}%
          </Typography>
        </Box>

        {isShowingSequence && currentSequence && (
          <Box
            sx={{
              textAlign: "center",
              background: "white",
              padding: "60px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              minWidth: "400px",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: "30px" }}>
              Watch and Remember
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {currentSequence.sequence.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    background: "#4CAF50",
                    color: "white",
                    padding: "20px 30px",
                    borderRadius: "10px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ marginTop: "30px" }}>
              Sequence will disappear in a moment...
            </Typography>
          </Box>
        )}

        {!isShowingSequence && currentSequence && (
          <Box
            sx={{
              textAlign: "center",
              background: "white",
              padding: "60px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              minWidth: "400px",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: "30px" }}>
              Recreate the Sequence
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "30px",
                minHeight: "60px",
                flexWrap: "wrap",
              }}
            >
              {userInput.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    background: "#2196F3",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>

            <Grid container spacing={2} sx={{ marginBottom: "30px" }}>
              {currentSequence.sequence.map((item, idx) => (
                <Grid item xs={4} key={idx}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleSequenceClick(item)}
                    disabled={isShowingSequence}
                    sx={{
                      padding: "20px",
                      fontSize: "18px",
                      width: "100%",
                    }}
                  >
                    {item}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={userInput.length === 0}
              sx={{ padding: "15px 40px", fontSize: "18px" }}
            >
              Submit
            </Button>
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
              All Levels Passed!
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "30px" }}>
              Final Accuracy: {accuracy.toFixed(0)}%
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                if (handleNext) {
                  handleNext();
                }
              }}
              endIcon={<ArrowRight />}
            >
              Continue
            </Button>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default MemoryChallenge;
