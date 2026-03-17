import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
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
import { getF1FlowStep, advanceF1Flow, F1_FLOW } from "../../RFlow/F1";
import { getF2FlowStep, advanceF2Flow, F2_FLOW } from "../../RFlow/F2";
import { F3_FLOW } from "../../RFlow/F3";

// Import from library
import {
  LetterGame,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
} from "../../lib/axl-explorations/src/lib/index";

/**
 * Wrapper component that integrates axl-explorations LetterGame
 * into the Practice.jsx mechanics system
 */
const LetterHuntMechanicsContent = ({
  isAlphabetDemoActive,
  page,
  setPage,
  level, // Letter hunt game level (1, 2, 3, etc.) - start level
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
  milestoneLevel, // Milestone level (B, 1, 2, etc.) - passed from Practice.jsx
  endLevel, // Optional: end level for level range
  startShowCase, // Optional: startShowCase state
  setStartShowCase, // Optional: setStartShowCase function
  setProgressData, // Optional: function to update progressData state in parent
  setCurrentQuestion, // Optional: function to reset currentQuestion state in parent
  setPoints, // Optional: function to update points state in parent
  applyStep, // Optional: Apply step number (1, 2, or 3) for F1 flow
  failRedirect, // Optional: Redirect target on failure (e.g., "L1", "L4", "L7")
  passRedirect, // Optional: Redirect target on pass (e.g., "L4", "L7", "F2")
  isF1FlowActive, // Optional: Whether F1 flow is active
  f1FlowStep, // Optional: Current F1 flow step info
  isF2FlowActive, // Optional: Whether F2 flow is active
  f2FlowStep, // Optional: Current F2 flow step info
  customLetters, // Optional: Custom letters to use for Letter Hunt (from F1/F2 config)
  confidentLetters, // Optional: Letters user is confident with (appear less frequently)
}) => {
  // Store the current level being played for failure handling
  const [currentGameLevel, setCurrentGameLevel] = useState(1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const a3PassHandledRef = useRef(false);
  const navigate = useNavigate();

  // Track step start time for duration calculation
  const [stepStartTime, setStepStartTime] = useState(null);

  // Reset step start time when step changes
  useEffect(() => {
    setStepStartTime(Date.now());
  }, [f1FlowStep?.index, f2FlowStep?.index, isF1FlowActive, isF2FlowActive]);

  // Helper function to get step title from flow index
  const getStepTitleFromFlowIndex = (flowIndex, flowType) => {
    const lang = getLocalData("lang") || "en";

    if (flowType === "F1") {
      const f1Config = levelGetContent[lang]?.["F1"];
      const stepConfig = f1Config?.[flowIndex];
      if (stepConfig?.title) {
        return stepConfig.title;
      }
      // Fallback: construct from F1_FLOW
      const flowStep = F1_FLOW[flowIndex];
      if (flowStep) {
        return `${flowStep.type}${flowStep.step}`;
      }
    } else if (flowType === "F2") {
      const f2Config = levelGetContent[lang]?.["F2"];
      const stepConfig = f2Config?.[flowIndex];
      if (stepConfig?.title) {
        return stepConfig.title;
      }
      // Fallback: construct from F2_FLOW
      const flowStep = F2_FLOW[flowIndex];
      if (flowStep) {
        return `${flowStep.type}${flowStep.step}`;
      }
    } else if (flowType === "F3") {
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
    }
    return undefined;
  };

  // Helper function to calculate duration in seconds
  const calculateDuration = () => {
    if (!stepStartTime) return undefined;
    return Math.round((Date.now() - stepStartTime) / 1000); // Duration in seconds
  };

  // Calculate skipPreview: show demo only for F1 P1 and F2 P1
  const skipPreview = React.useMemo(() => {
    const currentF1Step = getF1FlowStep();
    const currentF2Step = getF2FlowStep();
    const isF1P1 = currentF1Step.index === 1; // F1 P1
    const isF2P1 = currentF2Step.index === 1; // F2 P1
    return !(isF1P1 || isF2P1); // Skip preview if NOT F1 P1 or F2 P1
  }, []); // Empty deps - only calculate once on mount

  // Handle A3 pass - redirect to discovery start (for F1) or next flow (for F2)
  const handleA3Pass = async () => {
    if (a3PassHandledRef.current) {
      return;
    }
    a3PassHandledRef.current = true;

    if (isF1FlowActive) {
      console.log("F1 A3 passed - saving progress and redirecting to F2");

      // Save F1 A3 completion progress before transitioning to F2
      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      // Clear F1 flow index to reset for F2
      setLocalData("f1FlowIndex", null);

      // IMPORTANT: Reset F2 flow index to 0 to start from F2-A1 (not F2-A3)
      // This ensures F2 starts fresh after F1 completes
      setLocalData("f2FlowIndex", 0);

      // Save F2 progress as lesson 1 (index 0) to ensure backend knows to start F2 from beginning
      try {
        const f2TotalSteps = F2_FLOW.length;
        const f2Progress = Math.round(((0 + 1) / f2TotalSteps) * 100); // Index 0 = lesson 1, progress = 1/21 * 100

        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: "1", // F2 starts at index 0, so 1-indexed is 1
          progress: f2Progress,
          language: lang,
          milestoneLevel: "B",
          subMilestoneLevel: "F2",
          duration: calculateDuration(),
          applyLevel: getStepTitleFromFlowIndex(0, "F2"),
        });
        console.log(
          "F2 flow initialized at lesson 1 (index 0) after F1 completion"
        );
      } catch (error) {
        console.error("Error initializing F2 flow progress:", error);
      }

      // Clear practice progress for F2 to start fresh
      setLocalData("practiceProgress", null);

      // Also clear any F2 flow completion flags
      setLocalData("f2FlowComplete", null);

      console.log(
        "F1 A3 passed - F1 flow cleared, F2 flow reset to index 0, redirecting to discovery start"
      );
      // Redirect to discovery start (which will detect F2 flow and start from F2-A1)
      navigate("/discover-start");
    } else if (isF2FlowActive) {
      console.log("F2 A3 passed - saving progress and redirecting to F3");

      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      setLocalData("f2FlowIndex", null);
      setLocalData("f2FlowComplete", "true");
      setLocalData("f3FlowIndex", 0);

      if (sessionId && lang) {
        try {
          const f3TotalSteps = F3_FLOW.length;
          const f3Progress = Math.round(((0 + 1) / f3TotalSteps) * 100); // Index 0 = lesson 1

          await addLesson({
            sessionId: sessionId,
            milestone: "practice",
            lesson: "1", // F3 starts at index 0, so 1-indexed is 1
            progress: f3Progress,
            language: lang,
            milestoneLevel: "B",
            subMilestoneLevel: "F3",
            duration: calculateDuration(),
            applyLevel: getStepTitleFromFlowIndex(0, "F3"),
          });
          console.log(
            "F3 flow initialized at lesson 1 (index 0) after F2 completion"
          );
        } catch (error) {
          console.error("Error initializing F3 flow progress:", error);
        }
      }

      // Clear practice progress for F3 to start fresh
      setLocalData("practiceProgress", null);

      console.log(
        "F2 A3 passed - F2 flow cleared, F3 flow initialized to index 0, redirecting to discover-start"
      );
      // Redirect to discover-start (which will detect F3 flow and start from F3-P1)
      navigate("/discover-start");
    }
  };

  // Get F1 flow assessment parameters from config
  const getF1AssessmentParams = () => {
    if (!isF1FlowActive || !f1FlowStep?.step) {
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

    // For F1 flow, sub_milestone_level is always "F1"
    const sub_milestone_level = "F1";

    // Get step title from F1 config
    const lang = getLocalData("lang") || "en";
    const f1Config = levelGetContent[lang]?.["F1"];
    const f1StepConfig =
      f1Config && Array.isArray(f1Config) && f1Config[f1FlowStep.index]
        ? f1Config[f1FlowStep.index]
        : null;
    const stepTitle =
      f1StepConfig?.title ||
      (f1FlowStep.step?.type === "A"
        ? `A${f1FlowStep.step?.step}`
        : f1FlowStep.step?.type === "P"
        ? `P${f1FlowStep.step?.step}`
        : f1FlowStep.step?.type === "L"
        ? `L${f1FlowStep.step?.step}`
        : null);

    // Determine apply_level - use step title for all F1 flow steps
    // For Apply steps, this will be "A1", "A2", "A3"
    // For Practice steps, this will be "P1", "P2", etc. (though backend might only use it for Apply steps)
    const apply_level = stepTitle || undefined;

    // sub_apply_level will be passed dynamically based on currentGameLevel
    // This represents the level within the Apply step (1, 2, or 3)

    return {
      sub_session_id,
      sub_milestone_level,
      apply_level,
      // sub_apply_level will be set dynamically when calling LetterGame
    };
  };

  // Get F2 flow assessment parameters from config
  const getF2AssessmentParams = () => {
    if (!isF2FlowActive || !f2FlowStep?.step) {
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

    // For F2 flow, sub_milestone_level is always "F2"
    const sub_milestone_level = "F2";

    // Get step title from F2 config
    const lang = getLocalData("lang") || "en";
    const f2Config = levelGetContent[lang]?.["F2"];
    const f2StepConfig =
      f2Config && Array.isArray(f2Config) && f2Config[f2FlowStep.index]
        ? f2Config[f2FlowStep.index]
        : null;
    const stepTitle =
      f2StepConfig?.title ||
      (f2FlowStep.step?.type === "A"
        ? `A${f2FlowStep.step?.step}`
        : f2FlowStep.step?.type === "P"
        ? `P${f2FlowStep.step?.step}`
        : f2FlowStep.step?.type === "L"
        ? `L${f2FlowStep.step?.step}`
        : null);

    // Determine apply_level - use step title for all F2 flow steps
    // For Apply steps, this will be "A1", "A2", "A3"
    // For Practice steps, this will be "P1", "P2", etc. (though backend might only use it for Apply steps)
    const apply_level = stepTitle || undefined;

    // sub_apply_level will be passed dynamically based on currentGameLevel
    // This represents the level within the Apply step (1, 2, or 3)

    return {
      sub_session_id,
      sub_milestone_level,
      apply_level,
      // sub_apply_level will be set dynamically when calling LetterGame
    };
  };

  // Get assessment params based on active flow
  const f1AssessmentParams = getF1AssessmentParams();
  const f2AssessmentParams = getF2AssessmentParams();

  // Use F2 params if F2 is active, otherwise use F1 params, or default empty object
  const assessmentParams = isF2FlowActive
    ? f2AssessmentParams
    : isF1FlowActive
    ? f1AssessmentParams
    : {
        sub_session_id: undefined,
        sub_milestone_level: undefined,
        apply_level: undefined,
      };

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
          console.log("✅ Telemetry session initialized for Letter Hunt game");
        }

        setSessionInitialized(true);
      } catch (error) {
        console.warn("Failed to initialize telemetry session:", error);
        setSessionInitialized(true);
      }
    };

    // Add timeout fallback to ensure session initializes even if there's an error
    const timeoutId = setTimeout(() => {
      console.warn("Session initialization timeout - proceeding anyway");
      setSessionInitialized(true);
    }, 3000); // 3 second timeout

    // Add class to body to prevent scrolling
    document.body.classList.add("letter-hunt-active");

    initializeSession();

    // Cleanup: remove class when component unmounts and clear timeout
    return () => {
      document.body.classList.remove("letter-hunt-active");
      clearTimeout(timeoutId);
    };
  }, []);

  const handleGameBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  // Helper function to map redirect string (e.g., "L1", "L4", "L7") to F1 flow index
  const getF1FlowIndexFromRedirect = (redirect) => {
    if (!redirect) return null;

    // Map Learn step redirects to F1 flow indices
    // F1_FLOW: L1(0), P1(1), L2(2), P2(3), L3(4), P3(5), A1(6), L4(7), P4(8), L5(9), P5(10), L6(11), P6(12), A2(13), L7(14), P7(15), L8(16), P8(17), L9(18), P9(19), A3(20)
    const redirectMap = {
      L1: 0, // Learn 1
      L2: 2, // Learn 2
      L3: 4, // Learn 3
      L4: 7, // Learn 4
      L5: 9, // Learn 5
      L6: 11, // Learn 6
      L7: 14, // Learn 7
      L8: 16, // Learn 8
      L9: 18, // Learn 9
    };

    return redirectMap[redirect] !== undefined ? redirectMap[redirect] : null;
  };

  // Helper function to map redirect string (e.g., "L1", "L4", "L7") to F2 flow index
  const getF2FlowIndexFromRedirect = (redirect) => {
    if (!redirect) return null;

    // Map Learn step redirects to F2 flow indices
    // F2_FLOW: L1(0), P1(1), L2(2), P2(3), L3(4), P3(5), A1(6), L4(7), P4(8), L5(9), P5(10), L6(11), P6(12), A2(13), L7(14), P7(15), L8(16), P8(17), L9(18), P9(19), A3(20)
    const redirectMap = {
      L1: 0, // Learn 1
      L2: 2, // Learn 2
      L3: 4, // Learn 3
      L4: 7, // Learn 4
      L5: 9, // Learn 5
      L6: 11, // Learn 6
      L7: 14, // Learn 7
      L8: 16, // Learn 8
      L9: 18, // Learn 9
    };

    return redirectMap[redirect] !== undefined ? redirectMap[redirect] : null;
  };

  // Backward compatibility: handleLevel1Failure for level 1 only
  const handleLevel1Failure = async () => {
    return handleLevelFailure(1);
  };

  // Handle level failure in showcase mode - redirect based on Apply step rules
  // For Apply steps:
  // - Level 1 or 2 fail: go to failRedirect (e.g., "L1" for Apply 1)
  // - Level 3 fail: go to failRedirect (e.g., "L1" for Apply 1)
  // - Level 3 pass: go to passRedirect (e.g., "L4" for Apply 1)
  const handleLevelFailure = async (failedLevel) => {
    console.log(
      "handleLevelFailure called - failedLevel:",
      failedLevel,
      "isShowCase:",
      isShowCase,
      "applyStep:",
      applyStep,
      "failRedirect:",
      failRedirect,
      "isF1FlowActive:",
      isF1FlowActive,
      "isF2FlowActive:",
      isF2FlowActive
    );
    try {
      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      let targetStep = 0; // Default to P1
      let targetFlowIndex = null;

      // If this is an Apply step with a failRedirect, use it
      // Check for F1 flow first
      if (applyStep && failRedirect && isF1FlowActive) {
        targetFlowIndex = getF1FlowIndexFromRedirect(failRedirect);
        if (targetFlowIndex !== null) {
          // Set F1 flow index to the target Learn step
          setLocalData("f1FlowIndex", targetFlowIndex);
          targetStep = targetFlowIndex; // Use flow index as practice step index for F1
          console.log(
            `F1 Apply step ${applyStep} - Level ${failedLevel} failed - redirecting to ${failRedirect} (F1 flow index ${targetFlowIndex})`
          );
        } else {
          console.error(
            `Failed to map failRedirect "${failRedirect}" to F1 flow index`
          );
        }
      }
      // Check for F2 flow
      else if (applyStep && failRedirect && isF2FlowActive) {
        targetFlowIndex = getF2FlowIndexFromRedirect(failRedirect);
        if (targetFlowIndex !== null) {
          // Set F2 flow index to the target Learn step
          setLocalData("f2FlowIndex", targetFlowIndex);
          targetStep = targetFlowIndex; // Use flow index as practice step index for F2
          console.log(
            `F2 Apply step ${applyStep} - Level ${failedLevel} failed - redirecting to ${failRedirect} (F2 flow index ${targetFlowIndex})`
          );
        } else {
          console.error(
            `Failed to map failRedirect "${failRedirect}" to F2 flow index`
          );
        }
      } else {
        console.warn("handleLevelFailure - Missing required conditions:", {
          applyStep: !!applyStep,
          failRedirect: !!failRedirect,
          isF1FlowActive: !!isF1FlowActive,
          isF2FlowActive: !!isF2FlowActive,
        });
      }

      // If we have a valid targetFlowIndex, proceed with redirect
      if (targetFlowIndex !== null) {
        // For F1/F2 flows, use F1_FLOW.length or F2_FLOW.length instead of practiceSteps.length
        // Ensure progress doesn't exceed 100%
        const totalSteps = isF1FlowActive
          ? F1_FLOW.length
          : isF2FlowActive
          ? F2_FLOW.length
          : practiceSteps?.length || 21;
        const calculatedProgress = (targetStep + 1 / totalSteps) * 100;
        const currentPracticeProgress = Math.min(
          100,
          Math.round(calculatedProgress)
        );

        // Update learner progress via addLesson
        // Convert to 1-indexed for backend
        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: (targetStep + 1).toString(), // Convert to 1-indexed for backend
          progress: currentPracticeProgress,
          language: lang,
          milestoneLevel: milestoneLevel || "B",
          subMilestoneLevel: isF1FlowActive
            ? "F1"
            : isF2FlowActive
            ? "F2"
            : undefined,
          duration: calculateDuration(),
          applyLevel: getStepTitleFromFlowIndex(
            targetStep,
            isF1FlowActive ? "F1" : "F2"
          ),
        });

        // Update local storage
        const updatedPracticeProgress = {
          currentQuestion: 0,
          currentPracticeProgress: currentPracticeProgress,
          currentPracticeStep: targetStep,
        };
        setLocalData(
          "practiceProgress",
          JSON.stringify(updatedPracticeProgress)
        );
        console.log("Updated localStorage with:", updatedPracticeProgress);

        // Update parent state if setProgressData is provided
        if (setProgressData && typeof setProgressData === "function") {
          setProgressData(updatedPracticeProgress);
          console.log("Updated progressData state");
        }

        // Reset currentQuestion state in parent to 0 so handleNext doesn't increment
        if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
          setCurrentQuestion(0);
          console.log("Reset currentQuestion to 0");
        }

        // Clear any F1/F2 flow advancement flag to ensure handleNext processes the redirect
        if (isF1FlowActive) {
          setLocalData("f1FlowAdvancedByLetterHunt", "false");
        } else if (isF2FlowActive) {
          setLocalData("f2FlowAdvancedByLetterHunt", "false");
        }

        // Use a small delay to ensure localStorage and state are updated before handleNext reads them
        setTimeout(() => {
          console.log("Calling handleNext to exit and redirect to Learn step");
          if (handleNext) {
            handleNext(false);
          } else if (handleBack) {
            handleBack();
          }
        }, 100);
      } else {
        console.error(
          "handleLevelFailure - No valid targetFlowIndex, cannot redirect"
        );
        // Still try to exit the game
        setTimeout(() => {
          if (handleNext) {
            handleNext(false);
          } else if (handleBack) {
            handleBack();
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error redirecting after level failure:", error);
      // Still exit the game even if progress update fails
      setTimeout(() => {
        if (handleNext) {
          handleNext(false);
        } else if (handleBack) {
          handleBack();
        }
      }, 100);
    }
  };

  // Handle level completion - update learner progress and exit
  const handleLevelComplete = async (completedLevel) => {
    try {
      console.log("handleLevelComplete called:", {
        completedLevel,
        isShowCase,
        applyStep,
        endLevel,
        passRedirect,
        isF1FlowActive,
        isF2FlowActive,
      });

      // For Apply steps in showcase mode, check if all levels are complete
      if (isShowCase && applyStep && endLevel && completedLevel >= endLevel) {
        // All levels passed - redirect to passRedirect
        console.log(
          `Apply step ${applyStep} completed all levels (${completedLevel}/${endLevel}) - will redirect to ${passRedirect} after success screen`
        );

        // Add points for Apply step completion (all 3 levels completed)
        // This must happen BEFORE redirect logic to ensure points are added for all Apply steps
        if (!localStorage.getItem("contentSessionId")) {
          try {
            const lang = getLocalData("lang") || "en";
            let pointsToAdd = 30; // Default for Apply steps

            if (isF1FlowActive) {
              const f1Config = levelGetContent[lang]?.["F1"];
              const currentF1FlowStep = getF1FlowStep();
              const completedStepContent = f1Config?.[currentF1FlowStep.index];
              pointsToAdd = completedStepContent?.contentCount || 30;
            } else if (isF2FlowActive) {
              const f2Config = levelGetContent[lang]?.["F2"];
              const currentF2FlowStep = getF2FlowStep();
              const completedStepContent = f2Config?.[currentF2FlowStep.index];
              pointsToAdd = completedStepContent?.contentCount || 30;
            }

            const result = await addPointer(pointsToAdd, "B");

            if (
              result?.result?.totalLanguagePoints !== undefined &&
              setPoints
            ) {
              setPoints(result.result.totalLanguagePoints);
            }
          } catch (error) {
            console.error("Error adding Apply step points:", error);
          }
        }

        // Store redirect info to execute after success screen is shown
        const executeRedirect = async () => {
          if (passRedirect === "F2" || passRedirect === "F3") {
            if (!a3PassHandledRef.current) {
              await handleA3Pass();
            } else {
              navigate("/discover-start");
            }
            return;
          }

          // For F1 flow, redirect to the specified Learn step
          if (isF1FlowActive) {
            const targetFlowIndex = getF1FlowIndexFromRedirect(passRedirect);
            if (targetFlowIndex !== null) {
              setLocalData("f1FlowIndex", targetFlowIndex);
              const targetStep = targetFlowIndex;
              const lang = getLocalData("lang") || "en";
              const sessionId = getLocalData("sessionId");

              // Calculate progress using F1_FLOW.length, matching F1's pattern
              // Ensure progress doesn't exceed 100%
              const calculatedProgress =
                ((targetStep + 1) / F1_FLOW.length) * 100;
              const cappedProgress = Math.min(
                100,
                Math.round(calculatedProgress)
              );

              // Convert to 1-indexed for backend
              await addLesson({
                sessionId: sessionId,
                milestone: "practice",
                lesson: (targetStep + 1).toString(),
                progress: cappedProgress,
                language: lang,
                milestoneLevel: milestoneLevel,
                subMilestoneLevel: "F1",
                duration: calculateDuration(),
                applyLevel: getStepTitleFromFlowIndex(targetStep, "F1"),
              });

              const updatedPracticeProgress = {
                currentQuestion: 0,
                currentPracticeProgress: cappedProgress,
                currentPracticeStep: targetStep,
              };
              setLocalData(
                "practiceProgress",
                JSON.stringify(updatedPracticeProgress)
              );

              if (setProgressData && typeof setProgressData === "function") {
                setProgressData(updatedPracticeProgress);
              }

              if (
                setCurrentQuestion &&
                typeof setCurrentQuestion === "function"
              ) {
                setCurrentQuestion(0);
              }

              // Set a flag to indicate F1 flow was already advanced by LetterHuntMechanics
              // This prevents handleNext from making duplicate addLesson calls
              setLocalData("f1FlowAdvancedByLetterHunt", "true");

              // Delay redirect to allow success screen to show first (4 seconds)
              setTimeout(() => {
                if (handleNext) {
                  handleNext(false);
                }
                // Clear the flag after a short delay
                setTimeout(() => {
                  setLocalData("f1FlowAdvancedByLetterHunt", "false");
                }, 500);
              }, 4000); // 4 second delay to ensure success screen is visible
              return;
            }
          }

          // For F2 flow, redirect to the specified Learn step
          if (isF2FlowActive) {
            const targetFlowIndex = getF2FlowIndexFromRedirect(passRedirect);
            if (targetFlowIndex !== null) {
              console.log(
                `F2 Apply step ${applyStep} passed - redirecting to ${passRedirect} (F2 flow index ${targetFlowIndex})`
              );
              setLocalData("f2FlowIndex", targetFlowIndex);
              const targetStep = targetFlowIndex;
              const lang = getLocalData("lang") || "en";
              const sessionId = getLocalData("sessionId");

              // Calculate progress using F2_FLOW.length, matching F1's pattern
              // Ensure progress doesn't exceed 100%
              const calculatedProgress =
                ((targetStep + 1) / F2_FLOW.length) * 100;
              const cappedProgress = Math.min(
                100,
                Math.round(calculatedProgress)
              );

              // Convert to 1-indexed for backend
              await addLesson({
                sessionId: sessionId,
                milestone: "practice",
                lesson: (targetStep + 1).toString(),
                progress: cappedProgress,
                language: lang,
                milestoneLevel: milestoneLevel,
                subMilestoneLevel: "F2",
                duration: calculateDuration(),
                applyLevel: getStepTitleFromFlowIndex(targetStep, "F2"),
              });

              const updatedPracticeProgress = {
                currentQuestion: 0,
                currentPracticeProgress: cappedProgress,
                currentPracticeStep: targetStep,
              };
              setLocalData(
                "practiceProgress",
                JSON.stringify(updatedPracticeProgress)
              );

              if (setProgressData && typeof setProgressData === "function") {
                setProgressData(updatedPracticeProgress);
              }

              if (
                setCurrentQuestion &&
                typeof setCurrentQuestion === "function"
              ) {
                setCurrentQuestion(0);
              }

              // Set a flag to indicate F2 flow was already advanced by LetterHuntMechanics
              // This prevents handleNext from making duplicate addLesson calls
              setLocalData("f2FlowAdvancedByLetterHunt", "true");

              // Delay redirect to allow success screen to show first (4 seconds)
              setTimeout(() => {
                if (handleNext) {
                  handleNext(false);
                }
                // Clear the flag after a short delay
                setTimeout(() => {
                  setLocalData("f2FlowAdvancedByLetterHunt", "false");
                }, 500);
              }, 4000); // 4 second delay to ensure success screen is visible
              return;
            }
          }

          console.warn(
            `Could not redirect: passRedirect="${passRedirect}", isF1FlowActive=${isF1FlowActive}, isF2FlowActive=${isF2FlowActive}`
          );
        };

        // Execute redirect after a delay to allow success screen to render
        executeRedirect();
        return;
      }

      // For showcase mode with endLevel but not all levels complete yet, don't exit
      // Let the user continue to the next level via the "Next Level" button
      if (isShowCase && endLevel && completedLevel < endLevel) {
        console.log(
          `Apply step ${applyStep} - Level ${completedLevel} completed, but not all levels done (${completedLevel}/${endLevel}). Continuing to next level.`
        );
        // Don't exit - let the game continue to the next level
        return;
      }

      // For showcase mode without endLevel or non-Apply steps, exit
      if (isShowCase && (!endLevel || !applyStep)) {
        // In showcase mode without endLevel, just exit without updating progress
        if (handleNext) {
          handleNext();
        } else if (handleBack) {
          handleBack();
        }
        return;
      }

      // For non-showcase mode, update progress and move to next step
      // Only proceed if handleNext and milestoneLevel are provided
      if (!handleNext || !milestoneLevel) {
        // If no handleNext, just return - completion is handled elsewhere
        return;
      }

      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      // Validate required fields
      if (!sessionId) {
        console.error(
          "LetterHuntMechanics - sessionId is missing, cannot save progress"
        );
        return;
      }
      if (!lang) {
        console.error(
          "LetterHuntMechanics - language is missing, cannot save progress"
        );
        return;
      }

      // Check if this is F2 flow - if so, advance F2 flow index instead of practice step
      if (isF2FlowActive && f2FlowStep?.step) {
        console.log("F2 flow Practice step completed - advancing F2 flow");

        // Get current F2 flow step
        const currentF2FlowStep = getF2FlowStep();
        console.log("Current F2 flow step before advance:", currentF2FlowStep);

        // Advance F2 flow
        const nextStep = advanceF2Flow();
        console.log("advanceF2Flow returned:", nextStep);

        // Get updated F2 flow step
        const updatedF2FlowStep = getF2FlowStep();
        console.log("Updated F2 flow step after advance:", updatedF2FlowStep);

        if (updatedF2FlowStep.step) {
          // Update learner progress with new F2 flow index
          const newF2FlowIndex = updatedF2FlowStep.index;
          const totalF2Steps = F2_FLOW.length; // Total F2 flow steps
          // Ensure progress doesn't exceed 100%
          const calculatedProgress =
            ((newF2FlowIndex + 1) / totalF2Steps) * 100;
          const currentPracticeProgress = Math.min(
            100,
            Math.round(calculatedProgress)
          );

          // Convert to 1-indexed for backend (same as Learn step completion)
          await addLesson({
            sessionId: sessionId,
            milestone: "practice",
            lesson: (newF2FlowIndex + 1).toString(), // Convert to 1-indexed for backend
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: "B",
            subMilestoneLevel: "F2",
            duration: calculateDuration(),
            applyLevel: getStepTitleFromFlowIndex(newF2FlowIndex, "F2"),
          });
          console.log(
            "F2 Practice step progress saved by LetterHuntMechanics:",
            {
              completedStepIndex: currentF2FlowStep.index,
              nextStepIndex: newF2FlowIndex,
              lessonSaved: (newF2FlowIndex + 1).toString(), // 1-indexed
              progress: currentPracticeProgress,
            }
          );

          // Update points for F2 flow based on contentCount
          // For Apply steps (A1, A2, A3), points are added separately after all 3 levels are completed
          // For other steps (L1-L7, P1-P3), add points here
          if (!localStorage.getItem("contentSessionId")) {
            const f2Config = levelGetContent[lang]?.["F2"];
            const completedStepContent = f2Config?.[currentF2FlowStep.index];
            const isApplyStep = completedStepContent?.title?.startsWith("A");

            // Skip point addition for Apply steps - they're handled after all 3 levels are complete
            if (!isApplyStep) {
              try {
                const contentCount = completedStepContent?.contentCount || 1;
                const result = await addPointer(contentCount, "B");

                if (
                  result?.result?.totalLanguagePoints !== undefined &&
                  setPoints
                ) {
                  setPoints(result.result.totalLanguagePoints);
                }
              } catch (error) {
                console.error("Error updating F2 flow points:", error);
              }
            }
          }

          // Update local storage
          const updatedPracticeProgress = {
            currentQuestion: 0,
            currentPracticeProgress: currentPracticeProgress,
            currentPracticeStep: newF2FlowIndex,
          };
          setLocalData(
            "practiceProgress",
            JSON.stringify(updatedPracticeProgress)
          );

          // Update parent state if setProgressData is provided
          if (setProgressData && typeof setProgressData === "function") {
            setProgressData(updatedPracticeProgress);
          }

          // Reset currentQuestion state to 0 so handleNext doesn't increment
          if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
            setCurrentQuestion(0);
          }

          // Set a flag to indicate F2 flow was already advanced by LetterHuntMechanics
          // This prevents handleNext from advancing again
          setLocalData("f2FlowAdvancedByLetterHunt", "true");

          // Exit the game by calling handleNext (will move to next F2 flow step)
          setTimeout(() => {
            handleNext(false);
            // Clear the flag after a short delay
            setTimeout(() => {
              setLocalData("f2FlowAdvancedByLetterHunt", "false");
            }, 500);
          }, 100);
          return;
        } else {
          console.error("F2 flow advance failed - no next step available");
        }
      }

      // Check if this is F1 flow - if so, advance F1 flow index instead of practice step
      if (isF1FlowActive && f1FlowStep?.step) {
        console.log("F1 flow Practice step completed - advancing F1 flow");

        // Get current F1 flow step
        const currentF1FlowStep = getF1FlowStep();
        console.log("Current F1 flow step before advance:", currentF1FlowStep);

        // Advance F1 flow
        const nextStep = advanceF1Flow();
        console.log("advanceF1Flow returned:", nextStep);

        // Get updated F1 flow step
        const updatedF1FlowStep = getF1FlowStep();
        console.log("Updated F1 flow step after advance:", updatedF1FlowStep);

        // Validate that the flow advanced correctly
        if (updatedF1FlowStep.index === currentF1FlowStep.index) {
          console.error(
            "F1 flow did not advance! Current index:",
            currentF1FlowStep.index,
            "Updated index:",
            updatedF1FlowStep.index
          );
          // Force advance if it didn't work
          const forcedIndex = currentF1FlowStep.index + 1;
          if (forcedIndex < F1_FLOW.length) {
            setLocalData("f1FlowIndex", forcedIndex);
            const forcedStep = getF1FlowStep();
            console.log("Forced F1 flow step:", forcedStep);
            if (forcedStep.step) {
              // Use the forced step
              updatedF1FlowStep.index = forcedStep.index;
              updatedF1FlowStep.step = forcedStep.step;
              updatedF1FlowStep.isLast = forcedStep.isLast;
            }
          }
        }

        if (updatedF1FlowStep.step) {
          // Update learner progress with new F1 flow index
          const newF1FlowIndex = updatedF1FlowStep.index;
          const totalF1Steps = F1_FLOW.length; // Use actual F1_FLOW length
          // Ensure progress doesn't exceed 100%
          const calculatedProgress =
            ((newF1FlowIndex + 1) / totalF1Steps) * 100;
          const currentPracticeProgress = Math.min(
            100,
            Math.round(calculatedProgress)
          );

          // Convert to 1-indexed for backend (same as Learn step completion)
          // Example: P1 (index 1) completes → advances to P2 (index 2) → save lesson "3" (1-indexed)
          await addLesson({
            sessionId: sessionId,
            milestone: "practice",
            lesson: (newF1FlowIndex + 1).toString(), // Convert to 1-indexed for backend
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: "B",
            subMilestoneLevel: "F1",
            duration: calculateDuration(),
            applyLevel: getStepTitleFromFlowIndex(newF1FlowIndex, "F1"),
          });
          console.log(
            "F1 Practice step progress saved by LetterHuntMechanics:",
            {
              completedStepIndex: currentF1FlowStep.index,
              nextStepIndex: newF1FlowIndex,
              lessonSaved: (newF1FlowIndex + 1).toString(), // 1-indexed
              progress: currentPracticeProgress,
            }
          );

          // Update points for F1 flow based on contentCount
          // For Apply steps (A1, A2, A3), points are added separately after all 3 levels are completed
          // For other steps (L1-L7, P1-P3), add points here
          if (!localStorage.getItem("contentSessionId")) {
            const f1Config = levelGetContent[lang]?.["F1"];
            const completedStepContent = f1Config?.[currentF1FlowStep.index];
            const isApplyStep = completedStepContent?.title?.startsWith("A");

            // Skip point addition for Apply steps - they're handled after all 3 levels are complete
            if (!isApplyStep) {
              try {
                const contentCount = completedStepContent?.contentCount || 1;
                const result = await addPointer(contentCount, "B");

                if (
                  result?.result?.totalLanguagePoints !== undefined &&
                  setPoints
                ) {
                  setPoints(result.result.totalLanguagePoints);
                }
              } catch (error) {
                console.error("Error updating F1 flow points:", error);
              }
            }
          }

          // Update local storage
          const updatedPracticeProgress = {
            currentQuestion: 0,
            currentPracticeProgress: currentPracticeProgress,
            currentPracticeStep: newF1FlowIndex,
          };
          setLocalData(
            "practiceProgress",
            JSON.stringify(updatedPracticeProgress)
          );

          // Update parent state if setProgressData is provided
          if (setProgressData && typeof setProgressData === "function") {
            setProgressData(updatedPracticeProgress);
          }

          // Reset currentQuestion state to 0 so handleNext doesn't increment
          if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
            setCurrentQuestion(0);
          }

          // Set a flag to indicate F1 flow was already advanced by LetterHuntMechanics
          // This prevents handleNext from advancing again
          setLocalData("f1FlowAdvancedByLetterHunt", "true");

          // Exit the game by calling handleNext (will move to next F1 flow step)
          setTimeout(() => {
            handleNext(false);
            // Clear the flag after a short delay
            setTimeout(() => {
              setLocalData("f1FlowAdvancedByLetterHunt", "false");
            }, 500);
          }, 100);
          return;
        } else {
          console.error("F1 flow advance failed - no next step available");
        }
      }

      // For non-F1 flow, use regular practice step advancement
      // Get current practice step from progressData
      const currentPracticeStep = progressData?.currentPracticeStep || 0;
      const newPracticeStep = currentPracticeStep + 1;

      // Calculate progress percentage
      // Use practiceSteps length if available, otherwise use a default
      const totalSteps = practiceSteps?.length || 10;
      const limit = 1; // Default limit
      const currentPracticeProgress = Math.round(
        (newPracticeStep / (totalSteps * limit)) * 100
      );

      // Determine milestone type
      const currentLevelTitle = practiceSteps?.[newPracticeStep]?.title || "P1";
      const milestoneType = ["S1", "S2"].includes(currentLevelTitle)
        ? "showcase"
        : "practice";

      // Update learner progress via addLesson
      await addLesson({
        sessionId: sessionId,
        milestone: milestoneType,
        lesson: newPracticeStep,
        progress: currentPracticeProgress,
        language: lang,
        milestoneLevel: milestoneLevel,
      });

      // Update points for non-F flows based on contentCount
      if (!localStorage.getItem("contentSessionId")) {
        try {
          // Get contentCount from current step config
          const lang = getLocalData("lang") || "en";
          const levelKey =
            milestoneLevel === "B"
              ? "F1"
              : `m${milestoneLevel?.replace("m", "") || "1"}`;
          const levelConfig = levelGetContent[lang]?.[levelKey];
          const currentStepContent = levelConfig?.find(
            (step) => step.title === currentLevelTitle
          );
          const contentCount = currentStepContent?.contentCount || 1;

          const pointsToAdd = contentCount;
          const milestone = milestoneLevel || "m1";

          const result = await addPointer(pointsToAdd, milestone);
          const awardedPoints = result?.result?.points;

          if (awardedPoints === pointsToAdd) {
            console.log("LetterHunt points updated (handleLevelComplete):", {
              stepTitle: currentLevelTitle,
              pointsAdded: pointsToAdd,
              contentCount,
              totalPoints: result?.result?.totalLanguagePoints,
            });
          }
        } catch (error) {
          console.error("Error updating points in handleLevelComplete:", error);
        }
      }

      // Update local storage
      const updatedPracticeProgress = {
        currentQuestion: 0,
        currentPracticeProgress: currentPracticeProgress,
        currentPracticeStep: newPracticeStep,
      };
      setLocalData("practiceProgress", JSON.stringify(updatedPracticeProgress));

      // Update parent state if setProgressData is provided
      if (setProgressData && typeof setProgressData === "function") {
        setProgressData(updatedPracticeProgress);
      }

      // Reset currentQuestion state to 0 so handleNext doesn't increment
      if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
        setCurrentQuestion(0);
      }

      // Exit the game by calling handleNext (will move to next P level)
      setTimeout(() => {
        handleNext(false);
      }, 100);
    } catch (error) {
      console.error(
        "Error updating learner progress after letter hunt completion:",
        error
      );
      // Still exit the game even if progress update fails
      if (handleNext) {
        setTimeout(() => {
          handleNext(false);
        }, 100);
      }
    }
  };

  // Use getLocalData("lang") as the primary source for language
  // This ensures the main app's language setting takes precedence over the library's selectedLanguage
  const lang = getLocalData("lang") || "en";
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
  const sessionId = getLocalData("sessionId");
  useEffect(() => {
    localStorage.setItem("selectedLanguage", initialLanguage);
    localStorage.setItem("selectedAudioLanguage", initialAudioLanguage);
  }, [initialLanguage, initialAudioLanguage]);

  if (!sessionInitialized) {
    return (
      <MainLayout
        page={page}
        setPage={setPage}
        header={header || "Letter Hunt"}
        points={points}
        steps={steps}
        currentStep={currentStep}
        progressData={progressData}
        showProgress={showProgress}
        handleBack={handleBack}
        isShowCase={isShowCase}
        loading={true}
        background={background}
        showTimer={showTimer}
        startShowCase={startShowCase}
        setStartShowCase={setStartShowCase}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      page={page}
      setPage={setPage}
      header={header || "Letter Hunt"}
      points={points}
      steps={steps}
      currentStep={currentStep}
      progressData={progressData}
      showProgress={showProgress}
      handleBack={handleBack}
      isShowCase={isShowCase}
      loading={loading}
      background={background}
      showTimer={showTimer}
      startShowCase={startShowCase}
      setStartShowCase={setStartShowCase}
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
        }}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
            {isAlphabetDemoActive ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="60vh"
              >
                <CircularProgress size={60} thickness={4.5} />
              </Box>
            ) : (
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
                }}
                className="letter-hunt-wrapper"
              >
                <LetterGame
                  onBack={handleGameBack}
                  startLevel={level || 1}
                  endLevel={endLevel}
                  disableNavigation={true}
                  onLevelComplete={handleLevelComplete}
                  isShowcase={isShowCase || false} // Pass isShowCase flag to LetterGame
                  onLevel1Failure={() => handleLevelFailure(1)} // Backward compatibility for level 1 only
                  onLevelFailure={handleLevelFailure} // New callback for any level failure (includes level number)
                  customLetters={customLetters} // Pass customLetters from F1 config
                  confidentLetters={confidentLetters} // Pass confidentLetters from F1/F2 config
                  sub_session_id={assessmentParams.sub_session_id} // Pass sub session ID from telemetry
                  sub_milestone_level={assessmentParams.sub_milestone_level} // Pass "F1" or "F2" based on active flow
                  apply_level={assessmentParams.apply_level} // Pass apply level (A1, A2, A3) from config
                  onA3Pass={handleA3Pass} // Callback when A3 passes
                  sessionId={sessionId}
                  skipPreview={skipPreview}
                  // sub_apply_level is calculated dynamically in LetterGame based on currentLevel
                />
              </div>
            )}
          </AudioLanguageProvider>
        </LanguageProvider>
      </div>
    </MainLayout>
  );
};

const LetterHuntMechanics = (props) => {
  return (
    <LetterHuntMechanicsContent
      isAlphabetDemoActive={props.isAlphabetDemoActive}
      {...props}
    />
  );
};

export default LetterHuntMechanics;
