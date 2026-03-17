import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  getLocalData,
  setLocalData,
  practiceSteps,
  levelGetContent,
} from "../../utils/constants";
import {
  addLesson,
  addPointer,
} from "../../services/orchestration/orchestrationService";
import { getF3FlowStep, advanceF3Flow, F3_FLOW } from "../../RFlow/F3";

// Import from library
import {
  LetterLauncherGameCore,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
  SpaceBackground,
  playLetterAudio,
  FuelProgressBar,
  getFuelRequirement,
  getMissionDestination,
  calculateFuel,
  TryAgain,
  SuccessScreen,
  memoryGameDataLoader,
} from "../../lib/axl-explorations/src/lib/index";
import { trackingAssessmentService } from "../../lib/axl-explorations/src/utils/trackingAssessmentService";
// Import preview components directly
import { CountdownTimer } from "../../lib/axl-explorations/src/components/CountdownTimer";
import { LetterLauncherGameStoryPreview } from "../../lib/axl-explorations/src/components/games/LetterLauncherGameStoryPreview";
import { Button } from "../../lib/axl-explorations/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
/**
 * Wrapper component that integrates axl-explorations ROARRapidVisualGameCore
 * into the Practice.jsx mechanics system for F3 flow Letter Launcher
 */
const LetterLauncherMechanicsContent = ({
  page,
  setPage,
  level, // Starting level (1, 2, 3, etc.)
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
  endLevel, // Optional: end level for level range
  startShowCase,
  setStartShowCase,
  setProgressData,
  setCurrentQuestion,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  contentType = "letter", // "letter" or "syllable"
  contentCount = 10,
  sessionId, // Optional: Session ID from parent
  confidentLetters, // Optional: Letters user is confident with (appear less frequently)
}) => {
  const [currentGameLevel, setCurrentGameLevel] = useState(level || 1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  // Track step start time for duration calculation
  const [stepStartTime, setStepStartTime] = useState(null);
  const navigate = useNavigate();

  // Preview states - only show preview for P1 step
  const isP1Step =
    isF3FlowActive &&
    f3FlowStep?.step?.type === "P" &&
    f3FlowStep?.step?.step === 1;
  const [showPreview, setShowPreview] = useState(isP1Step); // Show preview/countdown when first opening game (only for P1)
  const [showStoryPreview, setShowStoryPreview] = useState(false); // Show story preview after countdown
  const [level19HasProgress, setLevel19HasProgress] = useState(false);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);

  // Reset currentGameLevel when level prop changes (e.g., when step changes)
  useEffect(() => {
    if (level && level !== currentGameLevel) {
      // Don't reset if we're in an Apply step with multiple levels and:
      // 1. We've completed all levels (currentGameLevel >= endLevel), OR
      // 2. We're advancing levels (currentGameLevel > level)
      // This prevents resetting when advancing through levels or when moving to Memory Challenge
      if (isShowCase === true && endLevel) {
        if (currentGameLevel >= endLevel) {
          // All levels complete, don't reset - let handleNext handle the transition
          return;
        }
        if (currentGameLevel > level) {
          // We're advancing levels (e.g., level 20 > starting level 19), don't reset
          return;
        }
      }
      setCurrentGameLevel(level);
      // Reset preview states when level changes (preview only shows for P1)
      const isCurrentlyP1 =
        isF3FlowActive &&
        f3FlowStep?.step?.type === "P" &&
        f3FlowStep?.step?.step === 1;
      if (!isCurrentlyP1) {
        setShowPreview(false);
        setShowStoryPreview(false);
      } else {
        setShowPreview(true);
      }
    }
  }, [
    level,
    currentGameLevel,
    isF3FlowActive,
    f3FlowStep,
    isShowCase,
    endLevel,
  ]);

  // Update preview state when F3 flow step changes
  useEffect(() => {
    const isCurrentlyP1 =
      isF3FlowActive &&
      f3FlowStep?.step?.type === "P" &&
      f3FlowStep?.step?.step === 1;
    if (isCurrentlyP1) {
      setShowPreview(true);
      setShowStoryPreview(false);
    } else {
      setShowPreview(false);
      setShowStoryPreview(false);
    }
  }, [isF3FlowActive, f3FlowStep]);

  // Ensure isShowCase is a boolean (handle undefined case)
  const effectiveIsShowCase = isShowCase === true;

  // For Apply steps, initialize startShowCase to false if not provided
  // This ensures the start screen shows before the game begins
  const [localStartShowCase, setLocalStartShowCase] = useState(
    startShowCase !== undefined
      ? startShowCase
      : effectiveIsShowCase
      ? false
      : true
  );

  // Use prop if provided, otherwise use local state
  const effectiveStartShowCase =
    startShowCase !== undefined ? startShowCase : localStartShowCase;
  const effectiveSetStartShowCase = setStartShowCase || setLocalStartShowCase;

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

  // Game key for telemetry (matches LetterLauncherGame format)
  const gameKey = initialLanguage
    ? `letterLauncher_${initialLanguage}`
    : "letterLauncher";
  useEffect(() => {
    localStorage.setItem("selectedLanguage", initialLanguage);
    localStorage.setItem("selectedAudioLanguage", initialAudioLanguage);
  }, [initialLanguage, initialAudioLanguage]);

  // Initialize telemetry session before game starts
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
            "✅ Telemetry session initialized for Letter Launcher game"
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

    document.body.classList.add("letter-launcher-active");

    initializeSession();

    return () => {
      document.body.classList.remove("letter-launcher-active");
      clearTimeout(timeoutId);
    };
  }, []);

  const handleGameBack = async () => {
    // End telemetry subsession with back button (matches LetterGame pattern)
    try {
      await sessionTelemetryManager.endSubSessionWithBackButton();
      console.log(
        "✅ Letter Launcher telemetry subsession ended (back button)"
      );
    } catch (error) {
      console.error(
        "Error ending Letter Launcher telemetry subsession (back button):",
        error
      );
    }

    if (handleBack) {
      handleBack();
    }
  };

  // Helper function to map redirect string (e.g., "P1", "P6") to F3 flow index
  // F3_FLOW: P1(0), P2(1), P3(2), P4(3), P5(4), A1(5), P6(6), P7(7), P8(8), P9(9), P10(10), A2(11)
  const getF3FlowIndexFromRedirect = (redirect) => {
    if (!redirect || typeof redirect !== "string") return null;

    // Match "P" followed by a number (e.g., "P1", "P6")
    const match = redirect.match(/^P(\d+)$/);
    if (match) {
      const practiceNum = parseInt(match[1], 10);
      // F3_FLOW indices: P1=0, P2=1, P3=2, P4=3, P5=4, A1=5, P6=6, P7=7, P8=8, P9=9, P10=10, A2=11
      // So P1-P5 map to 0-4, P6-P10 map to 6-10
      if (practiceNum >= 1 && practiceNum <= 5) {
        return practiceNum - 1; // P1=0, P2=1, P3=2, P4=3, P5=4
      } else if (practiceNum >= 6 && practiceNum <= 10) {
        return practiceNum; // P6=6, P7=7, P8=8, P9=9, P10=10
      }
    }

    return null;
  };

  // Generate questions based on contentType and language
  const generateQuestions = () => {
    const questions = [];
    let letters = [];
    // Ensure only supported languages are passed
    const supportedLanguage =
      initialLanguage === "te" ||
      initialLanguage === "mr" ||
      initialLanguage === "kn" ||
      initialLanguage === "hi"
        ? initialLanguage
        : "en";

    if (contentType === "letter" || contentType === "syllable") {
      // For Telugu, Kannada, and Marathi, use exact level mapping
      if (
        supportedLanguage === "te" ||
        supportedLanguage === "kn" ||
        supportedLanguage === "mr" ||
        supportedLanguage === "en" ||
        supportedLanguage === "hi"
      ) {
        const levelKey = currentGameLevel.toString();
        letters = memoryGameDataLoader.getLettersByLevel(
          supportedLanguage,
          levelKey
        );

        console.log(
          `Letter Launcher - Using ${supportedLanguage} letters for level ${currentGameLevel}:`,
          {
            lettersCount: letters.length,
            sampleLetters: letters.slice(0, 10),
          }
        );
      }
    }

    // Fallback to English if no letters found (for non-English languages only)
    if (letters.length === 0 && initialLanguage !== "en") {
      console.warn(
        "Letter Launcher - No letters found for non-English language, falling back to English"
      );
      letters =
        contentType === "letter"
          ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
          : ["at", "an", "in", "on", "am", "it", "up", "en", "ed", "ot"];
    }

    // Build weighted letter array based on confidentLetters
    const buildWeightedLetterArray = (letters) => {
      if (
        !confidentLetters ||
        confidentLetters.length === 0 ||
        letters.length === 0
      ) {
        return letters;
      }

      // Normalize confident letters to uppercase
      const normalizedConfident = confidentLetters
        .map((letter) =>
          typeof letter === "string" ? letter.toUpperCase() : ""
        )
        .filter(Boolean);

      // Separate letters into confident and non-confident
      const confident = [];
      const nonConfident = [];

      letters.forEach((letter) => {
        const upperLetter = letter.toUpperCase();
        if (normalizedConfident.includes(upperLetter)) {
          confident.push(letter);
        } else {
          nonConfident.push(letter);
        }
      });

      // Build weighted array:
      // - Confident letters: appear 1 time (reduced frequency)
      // - Non-confident letters: appear 3 times (increased frequency for practice)
      const weightedArray = [];

      // Add confident letters once
      confident.forEach((letter) => {
        weightedArray.push(letter);
      });

      // Add non-confident letters multiple times (3x for more practice)
      for (let i = 0; i < 3; i++) {
        nonConfident.forEach((letter) => {
          weightedArray.push(letter);
        });
      }

      console.log("Letter Launcher - Weighted array with confident letters:", {
        totalLetters: letters.length,
        confidentLetters: confident,
        nonConfidentLetters: nonConfident,
        weightedArrayLength: weightedArray.length,
        confidentCount: confident.length,
        nonConfidentCount: nonConfident.length * 3,
      });

      return weightedArray.length > 0 ? weightedArray : letters;
    };

    // Apply weighted selection
    const weightedLetters = buildWeightedLetterArray(letters);

    console.log("Letter Launcher - Generating questions:", {
      contentCount,
      contentType,
      language: initialLanguage,
      level: currentGameLevel,
      availableLetters: letters.length,
      weightedLettersCount: weightedLetters.length,
      expectedQuestions: contentCount,
    });
    const matchesCount = Math.floor(contentCount / 2);
    const mismatchesCount = contentCount - matchesCount;

    // Create exact 50:50 match distribution
    const matchArray = [
      ...Array(matchesCount).fill(true),
      ...Array(mismatchesCount).fill(false),
    ];

    // Shuffle once
    matchArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < contentCount; i++) {
      // Select from weighted array instead of original letters array
      const audioLetter =
        weightedLetters[Math.floor(Math.random() * weightedLetters.length)];
      // Randomly decide if displayed letter matches audio (50% match, 50% mismatch)
      const isMatch = matchArray[i];
      const displayedLetter = isMatch
        ? audioLetter
        : weightedLetters.filter((l) => l !== audioLetter)[
            Math.floor(Math.random() * (weightedLetters.length - 1))
          ];
      const question = {
        audioLetter,
        displayedLetter,
        isMatch,
        complexity: "simple",
        language: initialLanguage,
      };
      // Verify isMatch is correct
      const actualMatch = audioLetter === displayedLetter;
      if (isMatch !== actualMatch) {
        // Question generation mismatch detected - this should not happen
      }

      questions.push(question);
    }

    console.log("Letter Launcher - Generated questions:", {
      generatedCount: questions.length,
      expectedCount: contentCount,
      match: questions.length === contentCount,
      language: initialLanguage,
      contentType,
      sampleQuestions: questions.slice(0, 3).map((q) => ({
        audioLetter: q.audioLetter,
        displayedLetter: q.displayedLetter,
        isMatch: q.isMatch,
      })),
    });

    return questions;
  };

  const [questions, setQuestions] = useState([]);
  // Ref to track questions array changes
  const questionsArrayIdRef = useRef(null);
  // Ref to track when currentQuestion changes
  const previousQuestionRef = useRef(null);
  // Ref to track the config that was used to generate current questions
  const questionsConfigRef = useRef(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  // Ref to prevent double audio playback (React StrictMode double-invocation)
  const isPlayingAudioRef = useRef(false);
  const currentQuestionAudioKeyRef = useRef(null);
  // Ref to store the exact question that was displayed, for validation
  const displayedQuestionRef = useRef(null);
  // Ref to track last logged question to avoid duplicate render logs
  const lastLoggedQuestionRef = useRef(null);
  // Ref to lock the question that audio is currently playing for (prevents questions array changes from affecting audio/display)
  const lockedQuestionForAudioRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentFuel, setCurrentFuel] = useState(0);
  const [fuelEarned, setFuelEarned] = useState(null);
  const [questionSummaries, setQuestionSummaries] = useState([]);
  const [levelStartTime, setLevelStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

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
    const lang = getLocalData("lang") || "en";
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

  // Reset step start time when F3 step changes
  useEffect(() => {
    if (isF3FlowActive && f3FlowStep?.index !== undefined) {
      setStepStartTime(Date.now());
    }
  }, [f3FlowStep?.index, isF3FlowActive]);

  // Helper function to get F3 step title
  const getF3StepTitle = (flowIndex) => {
    const lang = getLocalData("lang") || "en";
    const f3Config = levelGetContent[lang]?.["F3"];
    const stepConfig = f3Config?.[flowIndex];
    if (stepConfig?.title) {
      return stepConfig.title;
    }
    // Fallback: construct from F3_FLOW
    const flowStep = F3_FLOW[flowIndex];
    if (flowStep) {
      return `${flowStep.type}${flowStep.step}`;
    }
    return undefined;
  };

  // Helper function to calculate duration in seconds
  const calculateF3Duration = () => {
    if (!stepStartTime) return undefined;
    return Math.round((Date.now() - stepStartTime) / 1000); // Duration in seconds
  };

  const assessmentParams = getF3AssessmentParams();

  // Check if P1 step has progress (for preview display)
  useEffect(() => {
    const checkP1Progress = async () => {
      if (!initialLanguage) {
        setIsLoadingLevel(false);
        return;
      }

      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) {
        setIsLoadingLevel(false);
        return;
      }

      try {
        setIsLoadingLevel(true);
        // For P1 step, we can check progress if needed in the future
        setLevel19HasProgress(false);
      } catch (error) {
        console.error("Error checking P1 step progress:", error);
        setLevel19HasProgress(false);
      } finally {
        setIsLoadingLevel(false);
      }
    };

    // Only check progress if it's P1 step
    if (isP1Step) {
      checkP1Progress();
    } else {
      setIsLoadingLevel(false);
    }
  }, [initialLanguage, gameKey, isP1Step]);

  // Preview handlers
  const handleCountdownComplete = () => {
    console.log(
      "[LetterLauncherMechanics] Countdown complete, showing story preview"
    );
    // After countdown, show story preview
    setShowStoryPreview(true);
    // Also set showPreview to false to prevent countdown from showing again
    setShowPreview(false);
  };

  const handleStoryPreviewComplete = () => {
    setShowStoryPreview(false);
    // After story preview, start the game
    setShowPreview(false);
  };

  // Reset completion state when step changes (detected by f3FlowStep change)
  useEffect(() => {
    if (isF3FlowActive && f3FlowStep?.step) {
      setIsGameComplete(false);
      setLevelFailed(false);
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setCurrentFuel(0);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowLetter(false);
      setFuelEarned(null);
      setQuestionStartTime(null);
      // Reset to the starting level for the new step
      if (level) {
        setCurrentGameLevel(level);
      }
      if (sessionInitialized) {
        // Check if we need to regenerate questions (config changed or questions don't exist)
        // Use 'level' prop directly (not currentGameLevel state) since we're about to set it
        const levelToUse = level || currentGameLevel;
        const currentConfig = `${f3FlowStep?.step?.step}-${f3FlowStep?.step?.type}-${contentType}-${contentCount}-${levelToUse}`;
        const configChanged = questionsConfigRef.current !== currentConfig;
        const questionsEmpty = questions.length === 0;

        // Prevent question regeneration if audio is currently playing (lock protection)
        if (isPlayingAudioRef.current && lockedQuestionForAudioRef.current) {
        } else if (configChanged || questionsEmpty) {
          const newQuestions = generateQuestions();
          const newArrayId = `${Date.now()}-${newQuestions
            .map((q, i) => `${i}:${q.audioLetter}-${q.displayedLetter}`)
            .join("|")}`;

          questionsArrayIdRef.current = newArrayId;
          questionsConfigRef.current = currentConfig;
          setQuestions(newQuestions);
        }
      }
    }
  }, [
    isF3FlowActive,
    f3FlowStep?.step?.step,
    f3FlowStep?.step?.type,
    contentType,
    contentCount,
    sessionInitialized,
  ]);

  useEffect(() => {
    const initializeGameSession = async () => {
      if (sessionInitialized) {
        // Check if we need to regenerate questions (config changed or questions don't exist)
        const currentConfig = `${f3FlowStep?.step?.step}-${f3FlowStep?.step?.type}-${contentType}-${contentCount}-${currentGameLevel}`;
        const configChanged = questionsConfigRef.current !== currentConfig;
        const questionsEmpty = questions.length === 0;

        // Prevent question regeneration if audio is currently playing (lock protection)
        if (isPlayingAudioRef.current && lockedQuestionForAudioRef.current) {
        } else if (configChanged || questionsEmpty) {
          const generatedQuestions = generateQuestions();
          const newArrayId = `${Date.now()}-${generatedQuestions
            .map((q, i) => `${i}:${q.audioLetter}-${q.displayedLetter}`)
            .join("|")}`;

          questionsArrayIdRef.current = newArrayId;
          questionsConfigRef.current = currentConfig;
          setQuestions(generatedQuestions);
        } else {
        }

        // Initialize level start time and reset question summaries (always do this)
        const now = Date.now();
        setLevelStartTime(now);
        setQuestionSummaries([]);
        setTotalTimeSpent(0);

        // Start telemetry subsession when game starts
        // This matches the pattern used in LetterGame
        try {
          const currentSubSession =
            sessionTelemetryManager.getCurrentSubSession();
          if (currentSubSession && currentSubSession.isActive) {
            await sessionTelemetryManager.endSubSession();
          }
          await sessionTelemetryManager.startSubSession(
            gameKey,
            currentGameLevel,
            initialLanguage
          );
          console.log("✅ Letter Launcher telemetry subsession started:", {
            gameKey,
            level: currentGameLevel,
            language: initialLanguage,
          });
        } catch (error) {
          console.error(
            "Error starting Letter Launcher telemetry subsession:",
            error
          );
        }
      }
    };

    initializeGameSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInitialized, contentType, contentCount, currentGameLevel]);

  // Play audio and show letter after audio ends
  // For Apply steps, don't start until startShowCase is true
  useEffect(() => {
    if (
      !sessionInitialized ||
      questions.length === 0 ||
      showFeedback ||
      isGameComplete
    ) {
      return;
    }

    // For Apply steps, wait for start screen to be dismissed
    if (effectiveIsShowCase && !effectiveStartShowCase) {
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    // Create a unique key for this question's audio
    const audioKey = `${currentQuestionIndex}-${currentQuestion.audioLetter}-${currentQuestion.displayedLetter}`;

    // Prevent double audio playback: atomic check-and-set pattern
    // If already playing the same audio, skip immediately
    if (
      isPlayingAudioRef.current &&
      currentQuestionAudioKeyRef.current === audioKey
    ) {
      return;
    }

    // Atomic check-and-set: if ref is already true for a different audio, skip
    // This handles the case where we're transitioning between questions
    if (
      isPlayingAudioRef.current &&
      currentQuestionAudioKeyRef.current !== audioKey
    ) {
      return;
    }

    // Set refs SYNCHRONOUSLY and IMMEDIATELY before any async operations
    // This prevents React StrictMode double-invocation from both passing the check
    isPlayingAudioRef.current = true;
    currentQuestionAudioKeyRef.current = audioKey;
    // Lock the question that audio is playing for - prevents questions array changes from affecting this audio/display
    lockedQuestionForAudioRef.current = {
      ...currentQuestion,
      questionIndex: currentQuestionIndex,
    };

    const playQuestionAudio = async () => {
      setShowLetter(false);
      setIsPlayingAudio(true);

      // Play audio

      try {
        await playLetterAudio(currentQuestion.audioLetter, initialLanguage);
      } catch (error) {
        // If audio fails, reset refs so we don't get stuck
        isPlayingAudioRef.current = false;
        currentQuestionAudioKeyRef.current = null;
        lockedQuestionForAudioRef.current = null;
        setIsPlayingAudio(false);

        return; // Exit early if audio fails
      }

      // After audio ends, show the letter
      setShowLetter(true);
      setIsPlayingAudio(false);
      setQuestionStartTime(Date.now());

      // CRITICAL: Use the question from the ref (what was actually rendered) instead of re-reading from array
      // The ref is set during render and represents what's actually displayed on screen
      const refQuestion = displayedQuestionRef.current;
      const latestQuestion = questions[currentQuestionIndex];

      // Determine which question to use - prefer ref (what was rendered) over closure or array
      let questionToUse;
      if (refQuestion && refQuestion.questionIndex === currentQuestionIndex) {
        // Use ref question if it exists and matches current index (this is what was actually displayed)
        questionToUse = refQuestion;
      } else {
        // Fallback: use latest from array, or closure question
        questionToUse = latestQuestion || currentQuestion;
        // Update ref with the question we're using (for validation)
        displayedQuestionRef.current = {
          ...questionToUse,
          questionIndex: currentQuestionIndex,
        };
      }

      // Show what will happen for each option BEFORE user selects
      const correctAnswer = questionToUse.isMatch; // true = TICK, false = CROSS
      const ifSelectTick = true === questionToUse.isMatch;
      const ifSelectCross = false === questionToUse.isMatch;

      // Clear refs after audio completes
      isPlayingAudioRef.current = false;
      // Clear the lock after audio finishes and letter is shown
      lockedQuestionForAudioRef.current = null;
    };

    playQuestionAudio();

    // Cleanup function: if component unmounts or effect re-runs before audio completes,
    // we don't reset refs here (they'll be reset after audio completes or in handleContinue)
    // This prevents race conditions with React StrictMode double-invocation
    return () => {
      // Only cleanup if this is a true unmount (not just a re-run)
      // We can't easily detect this, so we rely on the ref check at the start of the effect
    };
  }, [
    sessionInitialized,
    questions,
    currentQuestionIndex,
    showFeedback,
    isGameComplete,
    effectiveIsShowCase,
    effectiveStartShowCase,
    initialLanguage,
  ]);

  // Track when currentQuestion changes
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionKey = currentQuestion
      ? `${currentQuestionIndex}-${currentQuestion.audioLetter}-${currentQuestion.displayedLetter}`
      : null;
    if (previousQuestionRef.current !== questionKey) {
      const previousKey = previousQuestionRef.current;
      previousQuestionRef.current = questionKey;
    }
  }, [questions, currentQuestionIndex]);

  // Note: We don't reset refs on currentQuestionIndex change here to avoid race conditions
  // Refs are reset in handleContinue (when user moves to next question) and after audio completes

  // Start timer when start screen is dismissed for Apply steps
  useEffect(() => {
    if (
      effectiveIsShowCase &&
      effectiveStartShowCase &&
      sessionInitialized &&
      questions.length > 0 &&
      !isGameComplete &&
      !isTimerRunning
    ) {
      setIsTimerRunning(true);
      setTimeRemaining(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveIsShowCase,
    effectiveStartShowCase,
    sessionInitialized,
    questions.length,
    isGameComplete,
  ]);

  // Handle timer expiration - wrapped in useCallback to prevent dependency issues
  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);

    // IMPORTANT: Don't complete the game immediately when timer expires
    // For Apply steps with timer: stop showing new questions, but allow current question to finish
    // The game will complete in handleAnswerSelect after the current question is answered
    // This ensures all questions that were started can be completed

    console.log(
      "Letter Launcher - Timer expired, stopping timer but allowing current question to complete:",
      {
        currentQuestionIndex,
        questionsLength: questions.length,
        totalQuestions: contentCount,
      }
    );
  }, [currentQuestionIndex, questions.length, contentCount]);

  // Timer countdown for Apply steps
  useEffect(() => {
    if (
      effectiveIsShowCase &&
      effectiveStartShowCase &&
      isTimerRunning &&
      timeRemaining > 0
    ) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    effectiveIsShowCase,
    effectiveStartShowCase,
    handleTimeUp,
    isTimerRunning,
    timeRemaining,
  ]);

  const handleAnswerSelect = async (isMatch) => {
    if (showFeedback || isPlayingAudio || !showLetter) return;

    // CRITICAL: Use the question from the ref (what was actually displayed) instead of reading from array
    // This ensures we validate against the exact question that was shown, even if questions array changed
    const displayedQuestion = displayedQuestionRef.current;
    const arrayQuestion = questions[currentQuestionIndex];

    // Determine which question to use for validation
    let currentQuestion;
    if (
      displayedQuestion &&
      displayedQuestion.questionIndex === currentQuestionIndex
    ) {
      // Use ref question if it exists and matches current index
      currentQuestion = displayedQuestion;
    } else {
      // Fallback to array question
      currentQuestion = arrayQuestion;
    }

    if (!currentQuestion) {
      return;
    }

    const isCorrectAnswer = isMatch === currentQuestion.isMatch;

    // Calculate fuel based on response time
    let fuelResult = null;
    let updatedFuel = currentFuel; // Track updated fuel to pass to handlers
    if (questionStartTime) {
      const responseTime = Date.now() - questionStartTime;
      fuelResult = calculateFuel(responseTime, isCorrectAnswer);
      if (isCorrectAnswer) {
        // Calculate updated fuel total including current question
        updatedFuel = currentFuel + fuelResult.fuelEarned;
        setCurrentFuel((prev) => prev + fuelResult.fuelEarned);
      }
    }

    setSelectedAnswer(isMatch);
    setShowFeedback(true);
    setIsCorrect(isCorrectAnswer);
    setFuelEarned(fuelResult);

    // Track question for assessment
    const responseTime = questionStartTime ? Date.now() - questionStartTime : 0;

    // Send telemetry ASSESS event (matches LetterLauncherGame format)
    // Format user answer as colon-separated string: "audioLetter:displayedLetter:userSelected"
    // Example: "A:A:true" (user selected match) or "A:B:false" (user selected non-match)
    const userAnswer = `${currentQuestion.audioLetter}:${
      currentQuestion.displayedLetter
    }:${isMatch ? "true" : "false"}`;

    // Format correct answer as colon-separated string: "audioLetter:displayedLetter:isMatch"
    // Example: "A:A:true" (is a match) or "A:B:false" (is not a match)
    const correctAnswer = `${currentQuestion.audioLetter}:${
      currentQuestion.displayedLetter
    }:${currentQuestion.isMatch ? "true" : "false"}`;

    const questionId = `letterLauncher_${currentGameLevel}_${currentQuestionIndex}`;

    try {
      await sessionTelemetryManager.sendAssessEvent(
        questionId,
        "letterLauncher",
        userAnswer,
        correctAnswer,
        isCorrectAnswer,
        responseTime
      );
      // Update subsession with correct/incorrect
      sessionTelemetryManager.updateSubSession(isCorrectAnswer);
      console.log("✅ Letter Launcher telemetry assess event sent:", {
        questionId,
        isCorrect: isCorrectAnswer,
        responseTime,
      });
    } catch (error) {
      console.error(
        "Error sending Letter Launcher telemetry assess event:",
        error
      );
    }

    const questionSummary = {
      questionId: questionId,
      questionType: "letterLauncher", // Required by QuestionSummary interface
      userAnswer: userAnswer, // Use colon-separated format for consistency
      correctAnswer: correctAnswer, // Use colon-separated format for consistency
      isCorrect: isCorrectAnswer,
      responseTime: responseTime,
      complexity: currentQuestion.complexity || "simple",
    };
    // CRITICAL: Use functional update to ensure we always have the latest state
    // This prevents race conditions when questions are answered quickly
    let updatedSummaries;
    setQuestionSummaries((prev) => {
      updatedSummaries = [...prev, questionSummary];
      return updatedSummaries;
    });

    if (isCorrectAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    // Move to next question after feedback
    // DO NOT update progress here - only update when ALL questions are complete
    setTimeout(() => {
      // Check if timer expired and we should stop showing new questions
      const timerExpired = !isTimerRunning && effectiveIsShowCase;

      // Check if all questions have been answered
      // When we answer question at index N, we've answered N+1 questions total
      // IMPORTANT: Use contentCount to determine completion, not questions.length
      // This ensures we complete after answering all contentCount questions
      const questionsAnswered = currentQuestionIndex + 1; // +1 because we just answered this question
      const allQuestionsAnswered = questionsAnswered >= contentCount;

      // Debug: Verify question count matches contentCount
      if (questions.length !== contentCount) {
        console.warn("Letter Launcher - Question count mismatch:", {
          questionsLength: questions.length,
          contentCount,
          expected: contentCount,
          actual: questions.length,
        });
      }

      console.log("Letter Launcher - After answer, checking completion:", {
        currentQuestionIndex,
        questionsLength: questions.length,
        totalQuestions: contentCount,
        questionsAnswered,
        allQuestionsAnswered,
        timerExpired,
        isTimerRunning,
        effectiveIsShowCase,
      });

      // IMPORTANT: Always complete if all questions are answered, regardless of timer
      if (allQuestionsAnswered) {
        // All questions answered - complete the game
        console.log(
          "Letter Launcher - All questions answered, completing game:",
          {
            currentQuestionIndex,
            questionsLength: questions.length,
            totalQuestions: contentCount,
            questionsAnswered,
            allQuestionsAnswered,
          }
        );

        // Check pass criteria before deciding what to do
        // CRITICAL: Use updatedFuel (includes last question) instead of currentFuel (stale state)
        const { requiredFuel } = getFuelRequirement(
          currentGameLevel,
          contentCount
        );
        const hasEnoughFuel = updatedFuel >= requiredFuel;
        const minCorrectThreshold = Math.max(7, Math.floor(contentCount * 0.7));
        const hasEnoughCorrect = correctCount >= minCorrectThreshold;

        // Debug logging
        console.log("Letter Launcher - Pass/Fail Check:", {
          correctCount,
          contentCount,
          minCorrectThreshold,
          hasEnoughCorrect,
          currentFuel,
          updatedFuel,
          requiredFuel,
          hasEnoughFuel,
          isShowCase,
          effectiveIsShowCase,
          isShowCaseType: typeof isShowCase,
          willUseFuelCheck: effectiveIsShowCase,
        });

        // For Apply steps (effectiveIsShowCase), pass if user has enough fuel
        // For Practice steps (!effectiveIsShowCase), pass if user has enough correct answers
        if (effectiveIsShowCase) {
          // For Apply steps: pass if user has enough fuel (fuel is the primary metric)
          // Fuel already accounts for both speed and accuracy
          if (hasEnoughFuel) {
            // User passed - show success screen for this level
            // The success screen will handle moving to next level or Memory Challenge
            console.log(
              `Letter Launcher - Level ${currentGameLevel} passed${
                endLevel && currentGameLevel < endLevel
                  ? `, more levels to complete`
                  : `, all levels complete`
              }`
            );
            handleLevelPass(updatedSummaries, updatedFuel);
          } else {
            // User failed - show failure screen, will redirect to P1 on "Try Again"
            // Level 1/2/3 fail → P1
            console.log(
              `Letter Launcher - Level ${currentGameLevel} failed, will redirect to ${
                failRedirect || "P1"
              } on Try Again`
            );
            handleLevelFail(updatedSummaries, updatedFuel);
          }
        } else {
          // Practice step: pass if user has enough fuel OR enough correct answers
          // Fuel is preferred metric, but also allow passing with good accuracy
          // Use the same threshold calculated above (70% accuracy, minimum 7)
          if (hasEnoughFuel) {
            // User passed - show success screen
            handleStepComplete(updatedSummaries, updatedFuel);
          } else {
            // User failed - show failure screen, do NOT advance
            handleLevelFail(updatedSummaries, updatedFuel);
          }
        }
      } else if (timerExpired && currentQuestionIndex < questions.length - 1) {
        // Timer expired but not all questions answered - complete with current progress
        console.log(
          "Letter Launcher - Timer expired, completing with current progress:",
          {
            currentQuestionIndex,
            questionsLength: questions.length,
            totalQuestions: contentCount,
            answeredQuestions: currentQuestionIndex + 1,
          }
        );

        // Check pass criteria before deciding what to do
        // CRITICAL: Use updatedFuel (includes last question) instead of currentFuel (stale state)
        const { requiredFuel } = getFuelRequirement(
          currentGameLevel,
          contentCount
        );
        const hasEnoughFuel = updatedFuel >= requiredFuel;
        const minCorrectThreshold = Math.max(7, Math.floor(contentCount * 0.7));
        const hasEnoughCorrect = correctCount >= minCorrectThreshold;

        // Debug logging
        console.log("Letter Launcher - Pass/Fail Check (Timer Expired):", {
          correctCount,
          contentCount,
          minCorrectThreshold,
          hasEnoughCorrect,
          currentFuel,
          updatedFuel,
          requiredFuel,
          hasEnoughFuel,
          effectiveIsShowCase,
        });

        // For Apply steps (effectiveIsShowCase), pass if user has enough fuel
        // For Practice steps (!effectiveIsShowCase), pass if user has enough correct answers
        if (effectiveIsShowCase) {
          if (hasEnoughFuel) {
            console.log(
              `Letter Launcher - Level ${currentGameLevel} passed (timer expired)`
            );
            handleLevelPass(updatedSummaries, updatedFuel);
          } else {
            console.log(
              `Letter Launcher - Level ${currentGameLevel} failed (timer expired)`
            );
            handleLevelFail(updatedSummaries, updatedFuel);
          }
        } else {
          if (hasEnoughFuel || hasEnoughCorrect) {
            handleStepComplete(updatedSummaries, updatedFuel);
          } else {
            handleLevelFail(updatedSummaries, updatedFuel);
          }
        }
      } else if (currentQuestionIndex < contentCount - 1 && !timerExpired) {
        // Move to next question - game is still in progress and timer hasn't expired
        // IMPORTANT: Use contentCount to ensure we show all questions
        console.log("Letter Launcher - Moving to next question:", {
          currentIndex: currentQuestionIndex,
          nextIndex: currentQuestionIndex + 1,
          totalQuestions: contentCount,
          questionsLength: questions.length,
        });
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setShowLetter(false);
        setFuelEarned(null);
        // Clear the displayed question ref when moving to next question
        displayedQuestionRef.current = null;
      }
    }, 2000);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowLetter(false);
      // Reset audio refs when moving to next question
      isPlayingAudioRef.current = false;
      currentQuestionAudioKeyRef.current = null;
      lockedQuestionForAudioRef.current = null;
      // Clear the displayed question ref when moving to next question
      displayedQuestionRef.current = null;
    }
  };

  const [levelFailed, setLevelFailed] = useState(false);

  const handleLevelPass = async (questionSummariesParam, fuelParam) => {
    setIsTimerRunning(false);
    setIsGameComplete(true);
    setLevelFailed(false);

    // CRITICAL: Always use the parameter as it contains the latest question
    // The parameter is always passed from handleAnswerSelect to ensure all questions are included
    const questionSummaries = questionSummariesParam || [];
    // CRITICAL: Use passed fuel parameter (includes last question) instead of stale currentFuel state
    const finalFuel = fuelParam !== undefined ? fuelParam : currentFuel;

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;
    setTotalTimeSpent((prev) => prev + timeSpent);

    // End telemetry subsession and flush events (matches LetterGame pattern)
    try {
      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();
      console.log("✅ Letter Launcher telemetry subsession ended and flushed");
    } catch (error) {
      console.error(
        "Error ending Letter Launcher telemetry subsession:",
        error
      );
    }

    // Call assessment API
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries && questionSummaries.length > 0) {
      const currentSession = sessionTelemetryManager.getCurrentSession();
      const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
      // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
      const effectiveSessionId = sessionId || currentSession?.sessionId;
      const subsessionId = currentSubSession?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        const assessmentResponse =
          await trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: `letterLauncher_${initialLanguage}`,
            gameTitle: "Letter Launcher",
            level: currentGameLevel,
            language: initialLanguage,
            totalQuestions: contentCount,
            correctAnswers: actualCorrect,
            totalScore: finalFuel,
            timeSpent: timeSpent,
            assessmentSummary: questionSummaries,
            sessionId: effectiveSessionId,
            subsessionId: subsessionId,
            sub_session_id: assessmentParams.sub_session_id,
            sub_milestone_level: assessmentParams.sub_milestone_level,
            apply_level: assessmentParams.apply_level,
            sub_apply_level: isF3FlowActive
              ? currentGameLevel
              : effectiveIsShowCase
              ? currentGameLevel
              : undefined,
            metadata: {
              difficulty: "simple",
              levelFailed: false,
              scorePercentage: (actualCorrect / questionSummaries.length) * 100,
              fuelEarned: finalFuel,
              fuelRequired: requiredFuel,
              missionDestination: missionDestination,
            },
          });
        console.log(
          "Letter Launcher assessment tracking created for level:",
          currentGameLevel
        );

        // Capture familiarity_syllables from API response and store in localStorage
        if (
          assessmentResponse?.data?.familiarity_syllables &&
          Array.isArray(assessmentResponse.data.familiarity_syllables)
        ) {
          setLocalData(
            "confidentLetters",
            JSON.stringify(assessmentResponse.data.familiarity_syllables)
          );
          console.log(
            "✅ Stored confidentLetters from API response (LetterLauncher - Pass):",
            assessmentResponse.data.familiarity_syllables
          );
        }
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // Show success screen - don't advance level yet
    // The SuccessScreen's Continue button will handle moving to next level or Memory Challenge
  };

  const handleLevelFail = async (questionSummariesParam, fuelParam) => {
    setIsTimerRunning(false);
    setIsGameComplete(true);
    setLevelFailed(true);

    // CRITICAL: Always use the parameter as it contains the latest question
    // The parameter is always passed from handleAnswerSelect to ensure all questions are included
    const questionSummaries = questionSummariesParam || [];
    // CRITICAL: Use passed fuel parameter (includes last question) instead of stale currentFuel state
    const finalFuel = fuelParam !== undefined ? fuelParam : currentFuel;

    // End telemetry subsession and flush events (matches LetterGame pattern)
    try {
      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();
      console.log(
        "✅ Letter Launcher telemetry subsession ended and flushed (failure)"
      );
    } catch (error) {
      console.error(
        "Error ending Letter Launcher telemetry subsession:",
        error
      );
    }

    if (effectiveIsShowCase && failRedirect && isF3FlowActive) {
      setLocalData("letterLauncherLevelFailed", "true");
      setLocalData("letterLauncherFailedLevel", currentGameLevel.toString());
      console.log(
        `Letter Launcher - Level ${currentGameLevel} failed in A${
          applyStep || 1
        }, will redirect to ${failRedirect}`
      );
    }

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;

    // Call assessment API for failed level
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries && questionSummaries.length > 0) {
      const currentSession = sessionTelemetryManager.getCurrentSession();
      const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
      // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
      const effectiveSessionId = sessionId || currentSession?.sessionId;
      const subsessionId = currentSubSession?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        const assessmentResponse =
          await trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: `letterLauncher_${initialLanguage}`,
            gameTitle: "Letter Launcher",
            level: currentGameLevel,
            language: initialLanguage,
            totalQuestions: contentCount,
            correctAnswers: actualCorrect,
            totalScore: finalFuel,
            timeSpent: timeSpent,
            assessmentSummary: questionSummaries,
            sessionId: effectiveSessionId,
            subsessionId: subsessionId,
            sub_session_id: assessmentParams.sub_session_id,
            sub_milestone_level: assessmentParams.sub_milestone_level,
            apply_level: assessmentParams.apply_level,
            sub_apply_level: isF3FlowActive
              ? currentGameLevel
              : effectiveIsShowCase
              ? currentGameLevel
              : undefined,
            metadata: {
              difficulty: "simple",
              levelFailed: true,
              scorePercentage: (actualCorrect / questionSummaries.length) * 100,
              fuelEarned: finalFuel,
              fuelRequired: requiredFuel,
              missionDestination: missionDestination,
            },
          });
        console.log(
          "Letter Launcher assessment tracking created for failed level:",
          currentGameLevel
        );

        // Capture familiarity_syllables from API response and store in localStorage
        if (
          assessmentResponse?.data?.familiarity_syllables &&
          Array.isArray(assessmentResponse.data.familiarity_syllables)
        ) {
          setLocalData(
            "confidentLetters",
            JSON.stringify(assessmentResponse.data.familiarity_syllables)
          );
          console.log(
            "✅ Stored confidentLetters from API response (LetterLauncher - Fail):",
            assessmentResponse.data.familiarity_syllables
          );
        }
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // Show failure screen - don't call handleNext immediately
    // User can choose to play again or go back
    // When user clicks "Try Again", resetGame() will redirect to P1
  };

  const handleStepComplete = async (questionSummariesParam, fuelParam) => {
    // Only mark as complete and update progress when ALL questions are answered
    // This function is only called when we've answered the last question
    setIsGameComplete(true);
    setLevelFailed(false);

    // CRITICAL: Always use the parameter as it contains the latest question
    // The parameter is always passed from handleAnswerSelect to ensure all questions are included
    const questionSummaries = questionSummariesParam || [];
    // CRITICAL: Use passed fuel parameter (includes last question) instead of stale currentFuel state
    const finalFuel = fuelParam !== undefined ? fuelParam : currentFuel;

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;

    // End telemetry subsession and flush events (matches LetterGame pattern)
    try {
      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();
      console.log(
        "✅ Letter Launcher telemetry subsession ended and flushed (step complete)"
      );
    } catch (error) {
      console.error(
        "Error ending Letter Launcher telemetry subsession:",
        error
      );
    }

    // Call assessment API for Practice steps
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries && questionSummaries.length > 0) {
      const currentSession = sessionTelemetryManager.getCurrentSession();
      const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
      // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
      const effectiveSessionId = sessionId || currentSession?.sessionId;
      const subsessionId = currentSubSession?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        const assessmentResponse =
          await trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: `letterLauncher_${initialLanguage}`,
            gameTitle: "Letter Launcher",
            level: currentGameLevel,
            language: initialLanguage,
            totalQuestions: contentCount,
            correctAnswers: actualCorrect,
            totalScore: finalFuel,
            timeSpent: timeSpent,
            assessmentSummary: questionSummaries,
            sessionId: effectiveSessionId,
            subsessionId: subsessionId,
            sub_session_id: assessmentParams.sub_session_id,
            sub_milestone_level: assessmentParams.sub_milestone_level,
            apply_level: assessmentParams.apply_level,
            metadata: {
              difficulty: "simple",
              levelFailed: false,
              scorePercentage: (actualCorrect / questionSummaries.length) * 100,
              fuelEarned: finalFuel,
              fuelRequired: requiredFuel,
              missionDestination: missionDestination,
            },
          });
        console.log(
          "Letter Launcher assessment tracking created for Practice step"
        );

        // Capture familiarity_syllables from API response and store in localStorage
        if (
          assessmentResponse?.data?.familiarity_syllables &&
          Array.isArray(assessmentResponse.data.familiarity_syllables)
        ) {
          setLocalData(
            "confidentLetters",
            JSON.stringify(assessmentResponse.data.familiarity_syllables)
          );
          console.log(
            "✅ Stored confidentLetters from API response (LetterLauncher - Practice):",
            assessmentResponse.data.familiarity_syllables
          );
        }
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // Show completion screen - don't call handleNext immediately
    // User can see results before proceeding
  };

  const resetGame = () => {
    // For Apply steps with failRedirect, redirect to Practice step when level fails
    // A1: Letter Launcher failure → P1 (failRedirect)
    // A2: Letter Launcher failure → P1 (different from Memory Challenge which goes to P6)
    // Check both state and localStorage flag to ensure we catch the failure
    const levelFailedFlag =
      getLocalData("letterLauncherLevelFailed") === "true";
    const shouldRedirect =
      effectiveIsShowCase &&
      failRedirect &&
      isF3FlowActive &&
      (levelFailed || levelFailedFlag);

    if (shouldRedirect) {
      const failedLevel =
        getLocalData("letterLauncherFailedLevel") || currentGameLevel;

      console.log(
        `Letter Launcher - Level ${failedLevel} failed in A${
          applyStep || 1
        }, redirecting to ${failRedirect}`
      );
      // Clear failure flags
      setLocalData("letterLauncherLevelFailed", null);
      setLocalData("letterLauncherFailedLevel", null);
      // Clear any sub-step state (e.g., memoryChallenge) to prevent moving to Memory Challenge
      setLocalData("f3ApplySubStep", null);
      // Store redirect info for Practice.jsx to handle
      setLocalData("f3FlowRedirect", failRedirect);
      // Reset state first
      setIsGameComplete(false);
      setLevelFailed(false);
      // Then redirect by calling handleNext
      // The handleNext in Practice.jsx will check for f3FlowRedirect first
      if (handleNext) {
        handleNext();
        return;
      }
    }

    // Reset game state for "Play Again" or "Try Again"
    // IMPORTANT: This does NOT advance the flow - user retries the same step
    setIsGameComplete(false);
    setLevelFailed(false);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentFuel(0);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setShowLetter(false);
    setFuelEarned(null);
    setQuestionStartTime(null);
    setQuestionSummaries([]);
    const now = Date.now();
    setLevelStartTime(now);
    setIsTimerRunning(false);
    setTimeRemaining(100);
    // Don't reset preview states on retry - preview should only show once
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);

    // Start new telemetry subsession for retry (matches LetterGame pattern)
    const startNewSubSession = async () => {
      try {
        const currentSubSession =
          sessionTelemetryManager.getCurrentSubSession();
        if (currentSubSession && currentSubSession.isActive) {
          await sessionTelemetryManager.endSubSession();
        }
        await sessionTelemetryManager.startSubSession(
          gameKey,
          currentGameLevel,
          initialLanguage
        );
        console.log(
          "✅ Letter Launcher telemetry subsession started (retry):",
          {
            gameKey,
            level: currentGameLevel,
            language: initialLanguage,
          }
        );
      } catch (error) {
        console.error(
          "Error starting Letter Launcher telemetry subsession (retry):",
          error
        );
      }
    };
    startNewSubSession();

    if (effectiveIsShowCase) {
      // Reset to the current level (don't change level - user retries same level)
      setCurrentGameLevel(currentGameLevel);
      // Show start screen again for Apply steps
      effectiveSetStartShowCase(false);
    }
  };

  if (!sessionInitialized || questions.length === 0 || isLoadingLevel) {
    return (
      <MainLayout
        page={header}
        showTimer={false}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        vocabCount={vocabCount}
        wordCount={wordCount}
        handleBack={handleBack}
        isShowCase={effectiveIsShowCase}
        startShowCase={effectiveStartShowCase}
        setStartShowCase={effectiveSetStartShowCase}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  // Show story preview after countdown (check this first)
  // Only show for P1 step
  const isP1StepForPreview =
    isF3FlowActive &&
    f3FlowStep?.step?.type === "P" &&
    f3FlowStep?.step?.step === 1;
  if (showStoryPreview && initialLanguage && isP1StepForPreview) {
    console.log(
      "[LetterLauncherMechanics] Rendering story preview, level:",
      currentGameLevel
    );
    return (
      <LanguageProvider initialLanguage={initialLanguage}>
        <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
          <MainLayout
            page={header}
            showTimer={false}
            setPage={setPage}
            level={milestoneLevel || "B"}
            flowNames={[]}
            activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
            progressData={progressData}
            showProgress={showProgress}
            points={points}
            vocabCount={vocabCount}
            wordCount={wordCount}
            handleBack={handleBack}
            isShowCase={effectiveIsShowCase}
            startShowCase={effectiveStartShowCase}
            setStartShowCase={effectiveSetStartShowCase}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <style>{`
                .letter-launcher-story-preview-container > div {
                  height: 100% !important;
                  max-height: 100% !important;
                  overflow: hidden !important;
                }
                .letter-launcher-story-preview-container [class*="h-screen"] {
                  height: 100% !important;
                  max-height: 100% !important;
                }
                .letter-launcher-story-preview-container img,
                .letter-launcher-story-preview-container [role="img"],
                .letter-launcher-story-preview-container [class*="planet"],
                .letter-launcher-story-preview-container [class*="Planet"] {
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  position: relative !important;
                  z-index: 10 !important;
                }
                .letter-launcher-story-preview-container [class*="absolute"] {
                  position: absolute !important;
                  z-index: 10 !important;
                }
              `}</style>
              <div
                className="letter-launcher-story-preview-container"
                style={{ height: "100%", width: "100%", overflow: "hidden" }}
              >
                <LetterLauncherGameStoryPreview
                  onStartGame={handleStoryPreviewComplete}
                  onBack={() => {
                    setShowStoryPreview(false);
                    setShowPreview(false);
                    handleGameBack();
                  }}
                  level={currentGameLevel}
                  hideHeader={true}
                />
              </div>
            </div>
          </MainLayout>
        </AudioLanguageProvider>
      </LanguageProvider>
    );
  }

  // Show countdown when first opening game (before game starts)
  // Only show for P1 step
  const shouldShowCountdown =
    showPreview &&
    initialLanguage &&
    !showStoryPreview &&
    isP1StepForPreview &&
    !level19HasProgress;

  if (shouldShowCountdown) {
    return (
      <LanguageProvider initialLanguage={initialLanguage}>
        <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
          <MainLayout
            page={header}
            showTimer={false}
            setPage={setPage}
            level={milestoneLevel || "B"}
            flowNames={[]}
            activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
            progressData={progressData}
            showProgress={showProgress}
            points={points}
            vocabCount={vocabCount}
            wordCount={wordCount}
            handleBack={handleBack}
            isShowCase={effectiveIsShowCase}
            startShowCase={effectiveStartShowCase}
            setStartShowCase={effectiveSetStartShowCase}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background:
                  "linear-gradient(to bottom, #1e3a8a, #3b82f6, #60a5fa)",
                padding: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  maxWidth: "1280px",
                  margin: "0 auto",
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  overflow: "hidden",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    flexShrink: 0,
                  }}
                >
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      handleGameBack();
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 0,
                  }}
                >
                  <CountdownTimer
                    initialCount={3}
                    onComplete={handleCountdownComplete}
                  />
                </div>
              </div>
            </div>
          </MainLayout>
        </AudioLanguageProvider>
      </LanguageProvider>
    );
  }

  // Use locked question if audio is playing, otherwise use questions array
  // This prevents questions array changes from affecting the question that audio is playing for
  const usingLockedQuestion =
    isPlayingAudioRef.current &&
    lockedQuestionForAudioRef.current &&
    lockedQuestionForAudioRef.current.questionIndex === currentQuestionIndex;
  const currentQuestion = usingLockedQuestion
    ? lockedQuestionForAudioRef.current
    : questions[currentQuestionIndex];

  // Get fuel requirements and mission destination
  const { requiredFuel, maxFuel } = getFuelRequirement(
    currentGameLevel,
    contentCount
  );
  const missionDestination = getMissionDestination(currentGameLevel);

  // Show completion screen when game is complete
  if (isGameComplete) {
    const finalFuel = currentFuel;
    const totalQuestions = questions.length;
    const totalCorrect = correctCount;

    // Check if level passed (for Apply steps, check fuel; for Practice, check if all questions answered)
    // For Apply steps: must have enough fuel to pass
    // For Practice steps: must have at least one correct answer
    const hasPassed = effectiveIsShowCase
      ? finalFuel >= requiredFuel
      : totalCorrect > 0; // Practice steps pass if at least one correct

    // Debug logging
    console.log("Letter Launcher - Completion Screen Check:", {
      isGameComplete,
      levelFailed,
      finalFuel,
      requiredFuel,
      hasPassed,
      effectiveIsShowCase,
      totalCorrect,
      totalQuestions,
    });

    // IMPORTANT: Check actual fuel value first - if user has enough fuel, they should pass
    // Override levelFailed state if fuel is actually sufficient
    const actuallyHasEnoughFuel = finalFuel >= requiredFuel;
    const shouldShowFailure = levelFailed && !actuallyHasEnoughFuel;

    // If user has enough fuel but levelFailed is true, correct the state
    if (actuallyHasEnoughFuel && levelFailed) {
      console.warn(
        `Letter Launcher - State mismatch: levelFailed is true but fuel ${finalFuel} >= required ${requiredFuel}. Correcting to pass.`
      );
      setLevelFailed(false);
    }

    // Show failure screen only if user actually failed (not enough fuel)
    if (shouldShowFailure) {
      // User actually failed - show failure screen
      // Show failure screen with fuel display
      return (
        <MainLayout
          page={header}
          setPage={setPage}
          level={milestoneLevel || "B"}
          flowNames={[]}
          showTimer={false}
          activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
          progressData={progressData}
          showProgress={showProgress}
          points={points}
          vocabCount={vocabCount}
          wordCount={wordCount}
          handleBack={handleBack}
          isShowCase={effectiveIsShowCase}
          startShowCase={effectiveStartShowCase}
          setStartShowCase={effectiveSetStartShowCase}
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
            }}
          >
            <TryAgain
              totalCorrect={totalCorrect}
              totalQuestions={totalQuestions}
              selectedLanguage={initialLanguage}
              currentLevel={currentGameLevel}
              gameKey={`letterLauncher_${initialLanguage}`}
              onTryAgain={resetGame}
              onBackToHome={handleGameBack}
              fuelMode={true}
              fuelCollected={finalFuel}
              fuelRequired={requiredFuel}
              destination={missionDestination}
              useSpaceBackground={true}
            />
          </div>
        </MainLayout>
      );
    }

    // Show success screen
    const starsEarned = effectiveIsShowCase
      ? finalFuel < requiredFuel
        ? 1
        : finalFuel - requiredFuel > (maxFuel - requiredFuel) / 2
        ? 3
        : 2
      : 3; // Practice steps always get 3 stars

    return (
      <MainLayout
        page={header}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        showTimer={false}
        vocabCount={vocabCount}
        wordCount={wordCount}
        handleBack={handleBack}
        isShowCase={effectiveIsShowCase}
        startShowCase={effectiveStartShowCase}
        setStartShowCase={effectiveSetStartShowCase}
      >
        <SpaceBackground
          className="h-full w-full"
          style={{ height: "100%", maxHeight: "100vh", overflow: "auto" }}
        >
          <div
            style={{
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <SuccessScreen
              gameTitle="Letter Launcher"
              score={totalCorrect}
              totalQuestions={totalQuestions}
              starsEarned={starsEarned}
              onPlayAgain={resetGame}
              onBackToHub={handleGameBack}
              hasNextLevel={true}
              onNextLevel={async () => {
                // Continue to next step/level - clear completion state
                setIsGameComplete(false);
                setLevelFailed(false);

                // For Apply steps: check if there are more levels or if all levels are complete
                if (effectiveIsShowCase && endLevel) {
                  if (currentGameLevel >= endLevel) {
                    // All levels passed - move to Memory Challenge
                    // The handleNext callback from Practice.jsx will handle moving to Memory Challenge
                    // and then redirecting to passRedirect after Memory Challenge completes
                    console.log(
                      `Letter Launcher - All ${endLevel} levels passed (Level ${currentGameLevel}), moving to Memory Challenge`
                    );
                    // Clear any redirect flags
                    setLocalData("f3FlowRedirect", null);
                    // Just call handleNext - it will handle moving to Memory Challenge
                    // Memory Challenge will then handle redirecting to passRedirect (e.g., P6)
                    if (handleNext) {
                      handleNext();
                    }
                    return;
                  } else {
                    // More levels to complete - advance to next level
                    const nextLevel = currentGameLevel + 1;
                    console.log(
                      `Letter Launcher - Level ${currentGameLevel} passed, moving to Level ${nextLevel}`
                    );
                    // Reset game state for next level
                    setCurrentGameLevel(nextLevel);
                    setCurrentQuestionIndex(0);
                    setCorrectCount(0);
                    setWrongCount(0);
                    setShowFeedback(false);
                    setSelectedAnswer(null);
                    setShowLetter(false);
                    setFuelEarned(null);
                    setCurrentFuel(0);
                    setQuestionSummaries([]);
                    const now = Date.now();
                    setLevelStartTime(now);
                    setIsTimerRunning(false);
                    const newQuestions = generateQuestions();
                    setQuestions(newQuestions);

                    // Start new telemetry subsession for next level (matches LetterGame pattern)
                    const startNextLevelSubSession = async () => {
                      try {
                        const currentSubSession =
                          sessionTelemetryManager.getCurrentSubSession();
                        if (currentSubSession && currentSubSession.isActive) {
                          await sessionTelemetryManager.endSubSession();
                        }
                        await sessionTelemetryManager.startSubSession(
                          gameKey,
                          nextLevel,
                          initialLanguage
                        );
                        console.log(
                          "✅ Letter Launcher telemetry subsession started (next level):",
                          {
                            gameKey,
                            level: nextLevel,
                            language: initialLanguage,
                          }
                        );
                      } catch (error) {
                        console.error(
                          "Error starting Letter Launcher telemetry subsession (next level):",
                          error
                        );
                      }
                    };
                    startNextLevelSubSession();

                    // Reset start screen for next level
                    if (effectiveIsShowCase) {
                      effectiveSetStartShowCase(false);
                    }
                    return;
                  }
                }

                // For Practice steps: advance F3 flow and save progress for the next step
                if (isF3FlowActive && f3FlowStep?.step) {
                  // IMPORTANT: Set flag FIRST to prevent duplicate addLesson calls
                  // This must be set before calling handleNext
                  setLocalData("f3FlowAdvancedByLetterLauncher", "true");

                  // Get current F3 flow step (the step that was just completed)
                  const currentF3FlowStep = getF3FlowStep();

                  // Advance F3 flow to the next step
                  const nextStep = advanceF3Flow();

                  // Get updated F3 flow step after advancement (this is the NEXT step where user will resume)
                  const updatedF3FlowStep = getF3FlowStep();

                  if (updatedF3FlowStep.step) {
                    // Save progress to backend for the NEXT step (where user will resume)
                    // This matches the pattern used in F1 and F2 flows
                    const lang = getLocalData("lang") || "en";
                    const sessionId = getLocalData("sessionId");
                    const totalF3Steps = F3_FLOW.length;

                    // Calculate progress for the NEXT step (where user will resume)
                    // Progress = (nextStepIndex + 1) / totalSteps * 100
                    const nextStepProgress = Math.round(
                      ((updatedF3FlowStep.index + 1) / totalF3Steps) * 100
                    );

                    try {
                      await addLesson({
                        sessionId: sessionId,
                        milestone: "practice",
                        lesson: (updatedF3FlowStep.index + 1).toString(), // Convert to 1-indexed for backend (matches F1/F2 pattern)
                        progress: nextStepProgress, // Progress for the next step
                        language: lang,
                        milestoneLevel: "B",
                        subMilestoneLevel: "F3",
                        duration: calculateF3Duration(),
                        applyLevel: getF3StepTitle(updatedF3FlowStep.index),
                      });
                      console.log(
                        "F3 flow progress saved by LetterLauncherMechanics (after step completion):",
                        {
                          completedStepIndex: currentF3FlowStep.index,
                          nextStepIndex: updatedF3FlowStep.index,
                          lessonSaved: (updatedF3FlowStep.index + 1).toString(), // 1-indexed
                          progress: nextStepProgress,
                        }
                      );
                    } catch (e) {
                      console.error(
                        "Error storing F3 flow progress in LetterLauncherMechanics:",
                        e
                      );
                    }

                    // Update points for F3 flow based on contentCount
                    if (!localStorage.getItem("contentSessionId")) {
                      try {
                        const f3Config = levelGetContent[lang]?.["F3"];
                        const completedStepContent =
                          f3Config?.[currentF3FlowStep.index];
                        const isApplyStep =
                          completedStepContent?.title?.startsWith("A");

                        let pointsToAdd;

                        if (isApplyStep) {
                          // For Apply steps: F3 A1 = 20 × 3 levels = 60 points, F3 A2 = contentCount (45)
                          if (
                            completedStepContent?.letterLauncherContentCount
                          ) {
                            const pointsPerLevel =
                              completedStepContent.letterLauncherContentCount;
                            const numLevels =
                              completedStepContent?.letterLauncherEndLevel -
                              completedStepContent?.letterLauncherLevel +
                              1;
                            pointsToAdd = pointsPerLevel * numLevels;
                          } else {
                            pointsToAdd =
                              completedStepContent?.contentCount || 1;
                          }
                        } else {
                          // For non-Apply steps, use contentCount
                          pointsToAdd =
                            completedStepContent?.letterLauncherContentCount ||
                            completedStepContent?.memoryChallengeContentCount ||
                            completedStepContent?.readAloudContentCount ||
                            completedStepContent?.contentCount ||
                            1;
                        }

                        await addPointer(pointsToAdd, "B");
                      } catch (error) {
                        console.error("Error updating F3 flow points:", error);
                      }
                    }

                    // Update local storage with NEXT step progress
                    const updatedPracticeProgress = {
                      currentQuestion: 0,
                      currentPracticeProgress: nextStepProgress,
                      currentPracticeStep: updatedF3FlowStep.index,
                    };
                    setLocalData(
                      "practiceProgress",
                      JSON.stringify(updatedPracticeProgress)
                    );

                    // Update parent state if setProgressData is provided
                    if (
                      setProgressData &&
                      typeof setProgressData === "function"
                    ) {
                      setProgressData(updatedPracticeProgress);
                    }

                    // Reset currentQuestion state to 0 so handleNext doesn't increment
                    if (
                      setCurrentQuestion &&
                      typeof setCurrentQuestion === "function"
                    ) {
                      setCurrentQuestion(0);
                    }
                  }
                }

                // Call handleNext to move to next step (it will skip addLesson if flag is set)
                if (handleNext) {
                  handleNext();
                }
              }}
              continueButtonText="Continue"
            />
          </div>
        </SpaceBackground>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      page={header}
      setPage={setPage}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
      progressData={progressData}
      showProgress={showProgress}
      points={points}
      vocabCount={vocabCount}
      wordCount={wordCount}
      handleBack={handleBack}
      isShowCase={isShowCase}
      startShowCase={effectiveStartShowCase}
      setStartShowCase={effectiveSetStartShowCase}
      showTimer={false}
    >
      <SpaceBackground
        className="h-full w-full p-2 sm:p-4 overflow-hidden flex flex-col"
        style={{ height: "100%", minHeight: "100%" }}
      >
        <div
          className="max-w-6xl mx-auto w-full flex-1 flex flex-col"
          style={{ height: "100%", minHeight: 0 }}
        >
          {/* Header */}
          <div className="relative flex flex-row items-center mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
            <button
              onClick={handleGameBack}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:text-white text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 z-10 rounded-md flex items-center"
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-full">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
                Letter Launcher
              </h1>
            </div>

            {/* Spacer to balance layout */}
            <div className="w-[100px] sm:w-[120px]"></div>
          </div>

          {/* Main Content Card */}
          <div
            className="flex-1 flex flex-col bg-transparent"
            style={{ minHeight: 0, height: "100%" }}
          >
            {/* Fuel Progress - Only show if showProgress is true */}
            {showProgress && (
              <div className="mb-2 sm:mb-3 flex-shrink-0">
                <FuelProgressBar
                  currentFuel={currentFuel}
                  requiredFuel={requiredFuel}
                  maxFuel={maxFuel}
                  hidePercentage={true}
                />
              </div>
            )}

            {/* Game Area */}
            <div
              className="flex-1 flex flex-col px-1 sm:px-2 py-2"
              style={{ minHeight: 0, overflow: "auto" }}
            >
              <div
                className="bg-transparent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex-1 flex flex-col"
                style={{ minHeight: 0 }}
              >
                <LanguageProvider initialLanguage={initialLanguage}>
                  <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
                    {currentQuestion &&
                      (() => {
                        const questionToPass = {
                          ...currentQuestion,
                          displayedLetter: showLetter
                            ? currentQuestion.displayedLetter
                            : "",
                        };

                        // CRITICAL: Store the exact question being rendered in the ref
                        // This ensures validation uses the same question that's displayed on screen
                        // We do this in render (not in async audio function) to match what's actually shown
                        if (
                          showLetter &&
                          displayedQuestionRef.current?.questionIndex !==
                            currentQuestionIndex
                        ) {
                          displayedQuestionRef.current = {
                            ...currentQuestion,
                            questionIndex: currentQuestionIndex,
                          };
                        }

                        // Only log when question actually changes (not on every re-render)
                        const questionKey = `${currentQuestionIndex}-${currentQuestion.audioLetter}-${currentQuestion.displayedLetter}-${showLetter}`;
                        if (lastLoggedQuestionRef.current !== questionKey) {
                          lastLoggedQuestionRef.current = questionKey;
                        }
                        return (
                          <LetterLauncherGameCore
                            key={`question-${currentQuestionIndex}`}
                            currentQuestion={questionToPass}
                            mode="game"
                            selectedLanguage={initialLanguage}
                            showFeedback={showFeedback}
                            isCorrect={isCorrect}
                            selectedAnswer={selectedAnswer}
                            fuelEarned={fuelEarned}
                            disabled={!showLetter || isPlayingAudio}
                            onAnswerSelect={handleAnswerSelect}
                            onContinue={handleContinue}
                          />
                        );
                      })()}
                  </AudioLanguageProvider>
                </LanguageProvider>
              </div>
            </div>
          </div>
        </div>
      </SpaceBackground>
    </MainLayout>
  );
};

const LetterLauncherMechanics = (props) => {
  return <LetterLauncherMechanicsContent {...props} />;
};

export default LetterLauncherMechanics;
