import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  getLocalData,
  setLocalData,
  practiceSteps,
  levelGetContent,
} from "../../utils/constants";
import { addLesson } from "../../services/orchestration/orchestrationService";
import { getF3FlowStep, advanceF3Flow, F3_FLOW } from "../../RFlow/F3";

// Import from library
import {
  MemoryGameCore,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
  memoryGameDataLoader,
  SuccessScreen,
  TryAgain,
} from "../../lib/axl-explorations/src/lib/index";
import { ClockwiseTimer } from "../../lib/axl-explorations/src/components/ClockwiseTimer";
import { trackingAssessmentService } from "../../lib/axl-explorations/src/utils/trackingAssessmentService";

/**
 * Wrapper component that integrates axl-explorations MemoryGameCore
 * into the Practice.jsx mechanics system for F3 flow Memory Challenge
 */
const MemoryChallengeMechanicsContent = ({
  page,
  setPage,
  level, // Starting level (1, 2, 3)
  header,
  points,
  steps,
  currentStep,
  progressData,
  showProgress,
  background,
  handleNext,
  handleBack,
  enableNext,
  setEnableNext,
  isShowCase,
  loading,
  setOpenMessageDialog,
  vocabCount,
  wordCount,
  showTimer,
  milestoneLevel,
  endLevel = 3, // End level (usually 3)
  startShowCase,
  setStartShowCase,
  setProgressData,
  setCurrentQuestion,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  contentCount = 5, // Number of sequences per level
  sessionId, // Optional: Session ID from parent
}) => {
  const [currentGameLevel, setCurrentGameLevel] = useState(level || 1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [levelPassed, setLevelPassed] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const navigate = useNavigate();
  const lang = getLocalData("lang") || "en";

  // Map language to library Language type
  const initialLanguage =
    lang === "en"
      ? "en"
      : lang === "te"
      ? "te"
      : lang === "kn"
      ? "kn"
      : lang === "mr"
      ? "mr"
      : lang === "hi"
      ? "hi"
      : "en";
  const initialAudioLanguage = initialLanguage;

  useEffect(() => {
    localStorage.setItem("selectedLanguage", initialLanguage);
    localStorage.setItem("selectedAudioLanguage", initialAudioLanguage);
  }, [initialLanguage, initialAudioLanguage]); // Initialize telemetry session before game starts
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const currentUser = sessionManager.getCurrentUser();
        let userId = "anonymous";

        if (currentUser && currentUser.username) {
          userId = currentUser.username;
        } else {
          const storedUser =
            localStorage.getItem("user") || localStorage.getItem("username");
          if (storedUser) {
            userId = storedUser;
          }
        }

        const currentSession = sessionTelemetryManager.getCurrentSession();
        if (!currentSession || !currentSession.isActive) {
          await sessionTelemetryManager.startUserSession(userId);
          console.log(
            "✅ Telemetry session initialized for Memory Challenge game"
          );
        }

        setSessionInitialized(true);
      } catch (error) {
        console.warn("Failed to initialize telemetry session:", error);
        setSessionInitialized(true);
      }
    };

    const timeoutId = setTimeout(() => {
      console.warn("Session initialization timeout - proceeding anyway");
      setSessionInitialized(true);
    }, 3000);

    document.body.classList.add("memory-challenge-active");

    initializeSession();

    return () => {
      document.body.classList.remove("memory-challenge-active");
      clearTimeout(timeoutId);
    };
  }, []);

  const handleGameBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  // Generate sequences: 2 meaningful words + 3 non-word sequences per level
  const generateSequences = () => {
    const supportedLanguage =
      initialLanguage === "en" ||
      initialLanguage === "te" ||
      initialLanguage === "kn" ||
      initialLanguage === "mr" ||
      initialLanguage === "hi"
        ? initialLanguage
        : "en";

    // Use memoryGameDataLoader to generate sequences
    const sequences = memoryGameDataLoader.generateMemoryQuestions(
      supportedLanguage,
      currentGameLevel,
      "simple",
      contentCount
    );

    return sequences.map((seq, idx) => ({
      sequence: seq.sequence,
      display: seq.display || seq.sequence.join(""),
      complexity: seq.complexity || "simple",
      language: seq.language || initialLanguage,
    }));
  };

  const [sequences, setSequences] = useState([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [completedSequences, setCompletedSequences] = useState(0); // Track completed sequences for progress
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [currentLetterOptions, setCurrentLetterOptions] = useState([]);
  const [questionSummaries, setQuestionSummaries] = useState([]); // Track question summaries for assessment
  const [levelStartTime, setLevelStartTime] = useState(null); // Track level start time
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // Track total time spent

  // Get F3 flow assessment parameters from config
  const getF3AssessmentParams = () => {
    if (!isF3FlowActive || !f3FlowStep?.step) {
      return {
        sub_session_id: undefined,
        sub_milestone_level: undefined,
        apply_level: undefined,
        sub_apply_level: undefined,
      };
    }

    // Get sub_session_id from telemetry
    const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
    const sub_session_id = currentSubSession?.subSessionId;

    // For F3 flow, sub_milestone_level is always "F3"
    const sub_milestone_level = "F3";

    // Get step title from F3 config
    const f3Config = levelGetContent[lang]?.["F3"];
    const f3StepConfig =
      f3Config && Array.isArray(f3Config) && f3Config[f3FlowStep.index]
        ? f3Config[f3FlowStep.index]
        : null;
    const stepTitle =
      f3StepConfig?.title ||
      (f3FlowStep.step?.type === "A"
        ? `A${f3FlowStep.step?.step}`
        : f3FlowStep.step?.type === "P"
        ? `P${f3FlowStep.step?.step}`
        : null);

    // Determine apply_level - use step title for all F3 flow steps
    const apply_level = stepTitle || undefined;

    return {
      sub_session_id,
      sub_milestone_level,
      apply_level,
      // sub_apply_level will be set dynamically based on currentGameLevel
    };
  };

  const assessmentParams = getF3AssessmentParams();

  useEffect(() => {
    if (sessionInitialized) {
      const generatedSequences = generateSequences();
      setSequences(generatedSequences);

      // Get letter options from the first sequence
      if (generatedSequences.length > 0) {
        const allLetters = new Set();
        generatedSequences.forEach((seq) => {
          seq.sequence.forEach((letter) => allLetters.add(letter));
        });
        setCurrentLetterOptions(Array.from(allLetters));
      }

      // Initialize level start time and reset question summaries
      setLevelStartTime(Date.now());
      setQuestionSummaries([]);
      setTotalTimeSpent(0);
    }
  }, [sessionInitialized, currentGameLevel, contentCount]);

  // Get time limit for memory sequences based on complexity and level
  const getTimeLimit = (complexity = "simple") => {
    // Base time limits by complexity for memory sequences
    const baseTime = {
      basic: 8,
      intermediate: 6,
      advanced: 5,
      expert: 4,
      master: 3,
      simple: 6, // Default for our use case
    };

    // Additional level-based time reduction for higher levels
    const levelBonus = Math.max(0, Math.floor((currentGameLevel - 1) * 0.2));

    return Math.max(3, (baseTime[complexity] || 6) - levelBonus);
  };

  // Timer effect for memory sequence display phase
  useEffect(() => {
    const currentSeq = sequences[currentSequenceIndex];
    if (currentSeq && showSequence && !showFeedback && sequences.length > 0) {
      // Start timer when showing sequence
      const timeLimit = getTimeLimit("simple");
      setTimeRemaining(timeLimit);
      setIsTimerRunning(true);
      setShowTimeoutMessage(false); // Reset timeout message for new sequence

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - automatically move to input phase
            setIsTimerRunning(false);
            setShowSequence(false);
            setShowTimeoutMessage(true); // Show timeout message
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (!showSequence) {
      // Reset timer when sequence is hidden
      setIsTimerRunning(false);
      setTimeRemaining(0);
    }
  }, [
    showSequence,
    currentSequenceIndex,
    sequences,
    showFeedback,
    currentGameLevel,
  ]);

  const handleLetterClick = (letter) => {
    if (showSequence) return; // Don't allow input while showing sequence

    setUserInput((prev) => [...prev, letter]);
  };

  const handleRemoveLast = () => {
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleCheckSequence = () => {
    if (!sequences[currentSequenceIndex]) {
      console.warn(
        "Memory Challenge - No sequence at index:",
        currentSequenceIndex
      );
      return;
    }

    const currentSequence = sequences[currentSequenceIndex];
    const isCorrectAnswer =
      JSON.stringify(userInput) === JSON.stringify(currentSequence.sequence);

    // Track question summary for assessment
    const questionStartTime = levelStartTime || Date.now();
    const responseTime = Date.now() - (questionStartTime || Date.now());

    const newSummary = {
      questionId: `sequence_${currentSequenceIndex + 1}`,
      questionType: "memoryChallenge",
      isCorrect: isCorrectAnswer,
      userAnswer: userInput.join(""),
      correctAnswer: currentSequence.sequence.join(""),
      responseTime,
    };

    // ✅ compute updated summaries synchronously
    const updatedSummaries = [...questionSummaries, newSummary];

    setQuestionSummaries(updatedSummaries);
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    if (isCorrectAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setCompletedSequences((prev) => prev + 1);

    setTimeout(() => {
      const isLastSequence = currentSequenceIndex >= sequences.length - 1;

      if (isLastSequence) {
        // ✅ pass summaries forward
        handleLevelComplete(updatedSummaries);
      } else {
        setCurrentSequenceIndex((prev) => prev + 1);
        setShowSequence(true);
        setUserInput([]);
        setShowFeedback(false);
        setShowTimeoutMessage(false);
      }
    }, 1500);
  };

  const handleLevelComplete = async (questionSummariesParam) => {
    const questionSummaries = questionSummariesParam || [];
    // Check pass criteria: >= 80% accuracy
    // Use Math.round to avoid floating point precision issues
    const totalQuestions = questionSummaries.length;
    const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;

    const accuracy =
      totalQuestions > 0
        ? Math.round((actualCorrect / totalQuestions) * 100)
        : 0;

    console.log(
      `Memory Challenge - Level ${currentGameLevel} completed. Accuracy: ${accuracy}% (${correctCount}/${sequences.length} correct)`
    );

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;
    setTotalTimeSpent((prev) => prev + timeSpent);

    // Call assessment API for both pass and fail
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries.length > 0) {
      const currentSession = sessionTelemetryManager.getCurrentSession();
      const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
      // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
      const effectiveSessionId = sessionId || currentSession?.sessionId;
      const subsessionId = currentSubSession?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;

      try {
        await trackingAssessmentService.createAssessmentTracking({
          userId: currentUser.username,
          gameKey: `memoryChallenge_${initialLanguage}`,
          gameTitle: "Memory Challenge",
          level: currentGameLevel,
          language: initialLanguage,
          totalQuestions: questionSummaries.length,
          correctAnswers: actualCorrect,
          totalScore: actualCorrect,
          timeSpent: timeSpent,
          assessmentSummary: questionSummaries,
          sessionId: effectiveSessionId,
          subsessionId: subsessionId,
          sub_session_id: assessmentParams.sub_session_id,
          sub_milestone_level: assessmentParams.sub_milestone_level,
          apply_level: assessmentParams.apply_level,
          sub_apply_level: isShowCase ? currentGameLevel : undefined,
          metadata: {
            difficulty: "simple",
            levelFailed: accuracy < 80,
            scorePercentage: accuracy,
          },
        });
        console.log(
          "Memory Challenge assessment tracking created for level:",
          currentGameLevel
        );
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    if (accuracy >= 80) {
      // Level passed - show success screen
      console.log(
        `Memory Challenge - Level ${currentGameLevel} passed (accuracy: ${accuracy}%)`
      );
      setIsGameComplete(true);
      setLevelPassed(true);
      setLevelFailed(false);
    } else {
      // Level failed - redirect based on failRedirect
      // A1: Memory Challenge failure → P1 (failRedirect)
      // A2: Memory Challenge failure → P6 (failRedirect)
      console.log(
        `Memory Challenge - Level ${currentGameLevel} failed (accuracy: ${accuracy}%, need >= 80%), redirecting to ${
          failRedirect || "P1"
        }`
      );
      setIsGameComplete(true);
      setLevelPassed(false);
      setLevelFailed(true);

      // For Apply steps with failRedirect, automatically redirect
      // A1: redirects to P1, A2: redirects to P6
      if (isShowCase && failRedirect && isF3FlowActive) {
        // Store redirect info for Practice.jsx to handle
        setLocalData("f3FlowRedirect", failRedirect);
        // Clear f3ApplySubStep to ensure Apply step starts from Letter Launcher when reached again
        setLocalData("f3ApplySubStep", null);
        // Redirect after a short delay to show failure state
        setTimeout(() => {
          if (handleNext) {
            handleNext();
          }
        }, 2000);
      }
    }
  };

  const resetGame = () => {
    // IMPORTANT: Only redirect to failRedirect if level actually failed
    // Do NOT redirect if all levels are complete (should use passRedirect instead)
    const isAllLevelsComplete = currentGameLevel >= endLevel;

    // For Apply steps with failRedirect, redirect to Practice step when level fails
    // Check if redirect flag exists in localStorage (set when level failed)
    const redirectFlag = getLocalData("f3FlowRedirect");
    const shouldRedirect =
      isShowCase &&
      failRedirect &&
      isF3FlowActive &&
      !isAllLevelsComplete && // IMPORTANT: Don't redirect if all levels are complete
      (levelFailed || redirectFlag === failRedirect);

    if (shouldRedirect) {
      console.log(
        `Memory Challenge - Level ${currentGameLevel} failed in Apply step, redirecting to ${failRedirect}`
      );
      // Clear failure flags
      setLevelFailed(false);
      // Ensure redirect flag is set
      setLocalData("f3FlowRedirect", failRedirect);
      // Clear f3ApplySubStep to ensure A1 starts from Letter Launcher when reached again
      setLocalData("f3ApplySubStep", null);
      // Reset state first
      setIsGameComplete(false);
      setLevelPassed(false);
      // Then redirect by calling handleNext
      if (handleNext) {
        handleNext();
        return;
      }
    }

    // Reset game state for retry (same level)
    setIsGameComplete(false);
    setLevelPassed(false);
    setLevelFailed(false);
    setCurrentSequenceIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCompletedSequences(0); // Reset completed sequences count
    setUserInput([]);
    setShowSequence(true);
    setShowFeedback(false);
    setShowTimeoutMessage(false);
    setIsTimerRunning(false);
    setTimeRemaining(0);
    const newSequences = generateSequences();
    setSequences(newSequences);
  };

  if (!sessionInitialized || sequences.length === 0) {
    return (
      <MainLayout
        page={header}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        vocabCount={vocabCount}
        wordCount={wordCount}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  // Show completion screen when game is complete
  if (isGameComplete) {
    const totalSequences = sequences.length;
    const totalCorrect = correctCount;
    // Use Math.round to avoid floating point precision issues
    const accuracy =
      totalSequences > 0
        ? Math.round((totalCorrect / totalSequences) * 100)
        : 0;

    // Calculate stars based on accuracy
    const starsEarned =
      accuracy >= 100 ? 3 : accuracy >= 90 ? 2 : accuracy >= 80 ? 1 : 0;

    // Debug logging
    console.log("Memory Challenge - Completion Screen:", {
      totalCorrect,
      totalSequences,
      accuracy,
      levelFailed,
      levelPassed,
      starsEarned,
    });

    // Override levelFailed if accuracy is actually >= 80% (should pass)
    // This handles edge cases where state might be incorrect
    const shouldPass = accuracy >= 80;
    const actuallyFailed = levelFailed && !shouldPass;

    // Show failure screen only if actually failed (accuracy < 80%)
    if (actuallyFailed) {
      // For Apply steps, ensure redirect flag is set
      if (isShowCase && failRedirect && isF3FlowActive) {
        setLocalData("f3FlowRedirect", failRedirect);
        console.log(
          `Memory Challenge - Failure screen shown, redirect flag set to ${failRedirect}`
        );
      }

      return (
        <MainLayout
          page={header}
          setPage={setPage}
          level={milestoneLevel || "B"}
          flowNames={[]}
          activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
          progressData={progressData}
          showProgress={showProgress}
          points={points}
          vocabCount={vocabCount}
          wordCount={wordCount}
          handleBack={handleBack}
        >
          <div
            style={{
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overflow: "hidden",
              width: "100%",
              background: "linear-gradient(to bottom, #87CEEB, #20B2AA)",
            }}
          >
            <TryAgain
              totalCorrect={totalCorrect}
              totalQuestions={totalSequences}
              selectedLanguage={initialLanguage}
              currentLevel={currentGameLevel}
              gameKey={`memoryChallenge_${initialLanguage}`}
              onTryAgain={resetGame}
              onBackToHome={handleGameBack}
            />
          </div>
        </MainLayout>
      );
    }

    // Show success screen if level passed OR accuracy >= 80%
    if (levelPassed || shouldPass) {
      const hasMoreLevels = currentGameLevel < endLevel;
      // IMPORTANT: Check if all levels are complete
      // When currentGameLevel equals endLevel, we've completed all levels
      // For example: if endLevel is 3, and currentGameLevel is 3, all levels are complete
      const isAllLevelsComplete = currentGameLevel >= endLevel;

      console.log("Memory Challenge - Success screen check:", {
        currentGameLevel,
        endLevel,
        hasMoreLevels,
        isAllLevelsComplete,
        passRedirect,
        failRedirect,
      });

      return (
        <MainLayout
          page={header}
          setPage={setPage}
          level={milestoneLevel || "B"}
          flowNames={[]}
          activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
          progressData={progressData}
          showProgress={showProgress}
          points={points}
          vocabCount={vocabCount}
          wordCount={wordCount}
          handleBack={handleBack}
        >
          <div
            style={{
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overflow: "hidden",
              width: "100%",
              background: "linear-gradient(to bottom, #87CEEB, #20B2AA)",
            }}
          >
            <SuccessScreen
              gameTitle="Memory Challenge"
              score={totalCorrect}
              totalQuestions={totalSequences}
              starsEarned={starsEarned}
              onPlayAgain={resetGame}
              onBackToHub={handleGameBack}
              hasNextLevel={hasMoreLevels || isAllLevelsComplete}
              onNextLevel={async () => {
                // Clear completion state
                setIsGameComplete(false);
                setLevelPassed(false);
                setLevelFailed(false);

                if (hasMoreLevels) {
                  // Move to next level
                  console.log(
                    `Memory Challenge - Level ${currentGameLevel} passed, moving to Level ${
                      currentGameLevel + 1
                    }`
                  );
                  setCurrentGameLevel((prev) => prev + 1);
                  setCurrentSequenceIndex(0);
                  setCorrectCount(0);
                  setWrongCount(0);
                  setCompletedSequences(0); // Reset completed sequences count for new level
                  setUserInput([]);
                  setShowSequence(true);
                  setShowFeedback(false);
                  setShowTimeoutMessage(false);
                  setIsTimerRunning(false);
                  setTimeRemaining(0);
                  const newSequences = generateSequences();
                  setSequences(newSequences);
                } else if (isAllLevelsComplete) {
                  // All levels passed - redirect based on passRedirect
                  console.log(
                    `Memory Challenge - All ${endLevel} levels passed, redirecting to ${passRedirect}`
                  );

                  // For A2, if passRedirect is "complete", redirect directly to discovery start
                  if (
                    isF3FlowActive &&
                    passRedirect === "complete" &&
                    applyStep === 2
                  ) {
                    console.log(
                      "Memory Challenge - A2 completed successfully - F3 flow complete, redirecting to discover-start"
                    );

                    const lang = getLocalData("lang") || "en";
                    const sessionId = getLocalData("sessionId");

                    try {
                      await addLesson({
                        sessionId: sessionId,
                        milestone: "practice",
                        lesson: "0",
                        progress: 0,
                        language: lang,
                        milestoneLevel: "m1",
                      });
                      console.log("F3 A2 completion - M1 lesson added");
                    } catch (e) {
                      console.error(
                        "Error adding M1 lesson after F3 A2 completion:",
                        e
                      );
                    }

                    // Clear F3 flow data
                    setLocalData("f3FlowIndex", null);
                    setLocalData("f3FlowComplete", "true");
                    setLocalData("f3ApplySubStep", null);
                    // Clear practice progress
                    setLocalData("practiceProgress", null);
                    // Redirect to discover-start
                    navigate("/discover-start");
                    return;
                  }

                  // For A1 or other cases, use passRedirect (e.g., P6 for A1)
                  if (isF3FlowActive && passRedirect) {
                    // IMPORTANT: Clear any previous failRedirect flag and set passRedirect
                    // This ensures we redirect to P6 (passRedirect) not P1 (failRedirect)
                    const existingRedirect = getLocalData("f3FlowRedirect");
                    console.log(
                      `Memory Challenge - Clearing existing redirect (${existingRedirect}) and setting passRedirect to ${passRedirect}`
                    );
                    // Clear f3ApplySubStep to ensure clean transition
                    setLocalData("f3ApplySubStep", null);
                    // Set passRedirect (P6 for A1)
                    setLocalData("f3FlowRedirect", passRedirect);
                  }
                  if (handleNext) {
                    handleNext();
                  }
                }
              }}
              continueButtonText={
                hasMoreLevels
                  ? "Next Level"
                  : isAllLevelsComplete
                  ? "Continue"
                  : "Play Again"
              }
            />
          </div>
        </MainLayout>
      );
    }
  }

  const currentSequence = sequences[currentSequenceIndex];

  // Calculate progress and score
  // Progress should show completed sequences, not current sequence index
  const progress = completedSequences;
  const totalSequences = sequences.length;
  const score = correctCount;

  return (
    <MainLayout
      page={header}
      setPage={setPage}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
      progressData={progressData}
      showProgress={showProgress}
      points={points}
      vocabCount={vocabCount}
      wordCount={wordCount}
      handleBack={handleBack}
    >
      <div
        style={{
          padding: "0",
          height: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          position: "relative",
          background: "linear-gradient(to bottom, #87CEEB, #20B2AA)",
        }}
        className="memory-challenge-wrapper"
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
            <div
              style={{
                height: "100%",
                maxHeight: "100%",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                position: "relative",
                padding: "0.5rem 1rem",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  gap: "0.5rem",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={handleGameBack}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "0.375rem",
                    padding: "0.375rem 0.625rem",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  <span>←</span>
                  <span>Back</span>
                </button>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "white",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      margin: 0,
                    }}
                  >
                    Memory Challenge
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.625rem",
                      marginTop: "0.125rem",
                    }}
                  >
                    <span>↑</span>
                    <span>
                      Level {currentGameLevel} / {endLevel || 3}
                    </span>
                  </div>
                </div>

                {/* Spacer to balance layout */}
                <div style={{ width: "80px" }}></div>
              </div>

              {/* Main Content Card */}
              <div
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                {/* Progress Bar */}
                <div style={{ marginBottom: "0.5rem", flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem",
                      minHeight: "40px", // Ensure enough height for timer
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      Progress: {progress}/{totalSequences}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        minHeight: "40px", // Match parent min-height
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>⭐</span>
                        <span style={{ fontSize: "0.75rem", color: "#666" }}>
                          {score}
                        </span>
                      </div>
                      {/* Timer - Always reserve space to maintain consistent height */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          height: "100%",
                          minWidth: "60px", // Reserve space for timer
                        }}
                      >
                        {showSequence && !showTimeoutMessage && (
                          <div
                            style={{
                              transform: "scale(0.7)",
                              transformOrigin: "center",
                            }}
                          >
                            <ClockwiseTimer
                              timeRemaining={timeRemaining}
                              totalTime={getTimeLimit("simple")}
                              className="justify-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "#e5e7eb",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(progress / totalSequences) * 100}%`,
                        height: "100%",
                        background: "#3b82f6",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Time Up Button - Show when sequence display time expires */}
                {/* Always reserve space to maintain consistent height between phases */}
                <div
                  style={{
                    marginBottom: "0.5rem",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    minHeight: showTimeoutMessage ? "auto" : "0px", // Reserve space when shown
                  }}
                >
                  {showTimeoutMessage && (
                    <div
                      style={{
                        padding: "0.375rem 0.75rem",
                        background:
                          "linear-gradient(to right, #fef3c7, #fee2e2)",
                        border: "1px solid #fbbf24",
                        borderRadius: "0.25rem",
                        textAlign: "center",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.375rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem" }}>⏰</span>
                        <div
                          style={{
                            color: "#b45309",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                          }}
                        >
                          Time Up!
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Area */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    overflow: "auto",
                  }}
                >
                  {currentSequence && (
                    <MemoryGameCore
                      currentSequence={currentSequence}
                      mode="game"
                      selectedLanguage={initialLanguage}
                      currentLevel={currentGameLevel}
                      showSequence={showSequence}
                      showFeedback={showFeedback}
                      isCorrect={isCorrect}
                      userInput={userInput}
                      currentLetterOptions={currentLetterOptions}
                      onLetterClick={handleLetterClick}
                      onRemoveLast={handleRemoveLast}
                      onCheckSequence={handleCheckSequence}
                      onContinue={() => {
                        // This is handled by handleCheckSequence's setTimeout
                        // No need to do anything here to avoid conflicts
                      }}
                      showContinueButton={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </AudioLanguageProvider>
        </LanguageProvider>
      </div>
    </MainLayout>
  );
};

const MemoryChallengeMechanics = (props) => {
  return <MemoryChallengeMechanicsContent {...props} />;
};

export default MemoryChallengeMechanics;
