import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import R0 from "./R0";
import {
  getLocalData,
  setLocalData,
  levelGetContent,
  practiceSteps,
} from "../utils/constants";

/**
 * F1 Flow sequence:
 * L=Learn (Letter Train), P=Practice (Letter Hunt), A=Apply (Letter Hunt with 3 levels)
 *
 * Structure:
 * Learn 1 -> Practice 1 -> Learn 2 -> Practice 2 -> Learn 3 -> Practice 3 -> Apply 1 ->
 * Learn 4 -> Practice 4 -> Learn 5 -> Practice 5 -> Learn 6 -> Practice 6 -> Apply 2 ->
 * Learn 7 -> Practice 7 -> Learn 8 -> Practice 8 -> Learn 9 -> Practice 9 -> Apply 3
 *
 * Apply steps have special handling:
 * - Apply 1: 3 levels, if fail at any level → Learn 1, if pass all → Learn 4
 * - Apply 2: 3 levels, if fail at any level → Learn 4, if pass all → Learn 7
 * - Apply 3: 3 levels, if fail at any level → Learn 7, if pass all → F2
 */
export const F1_FLOW = [
  { type: "L", step: 1 }, // Learn 1 - Letter Train
  { type: "P", step: 1 }, // Practice 1 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 2 }, // Learn 2 - Letter Train
  { type: "P", step: 2 }, // Practice 2 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 3 }, // Learn 3 - Letter Train
  { type: "P", step: 3 }, // Practice 3 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 1, failRedirect: "L1", passRedirect: "L4" }, // Apply 1 - Letter Hunt (3 levels, 13 content per level)
  { type: "L", step: 4 }, // Learn 4 - Letter Train
  { type: "P", step: 4 }, // Practice 4 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 5 }, // Learn 5 - Letter Train
  { type: "P", step: 5 }, // Practice 5 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 6 }, // Learn 6 - Letter Train
  { type: "P", step: 6 }, // Practice 6 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 2, failRedirect: "L4", passRedirect: "L7" }, // Apply 2 - Letter Hunt (3 levels, 13 content per level)
  { type: "L", step: 7 }, // Learn 7 - Letter Train
  { type: "P", step: 7 }, // Practice 7 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 8 }, // Learn 8 - Letter Train
  { type: "P", step: 8 }, // Practice 8 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 9 }, // Learn 9 - Letter Train
  { type: "P", step: 9 }, // Practice 9 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 3, failRedirect: "L7", passRedirect: "F2" }, // Apply 3 - Letter Hunt (3 levels, 13 content per level)
];

/**
 * Get current F1 flow step
 */
export const getF1FlowStep = () => {
  const savedIndex = getLocalData("f1FlowIndex");
  const flowIndex = savedIndex ? Number(savedIndex) : 0;
  return {
    index: flowIndex,
    step: F1_FLOW[flowIndex] || null,
    isLast: flowIndex === F1_FLOW.length - 1,
  };
};

/**
 * Advance to next F1 flow step
 */
export const advanceF1Flow = () => {
  const current = getF1FlowStep();
  if (current.isLast) {
    setLocalData("f1FlowIndex", null);
    return null;
  }
  const nextIndex = current.index + 1;
  setLocalData("f1FlowIndex", nextIndex);
  return F1_FLOW[nextIndex];
};

/**
 * Reset F1 flow
 */
export const resetF1Flow = () => {
  setLocalData("f1FlowIndex", null);
};

const F1 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
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
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  customLetters,
}) => {
  const navigate = useNavigate();
  const lang = getLocalData("lang") || "en";

  // Get current flow step from localStorage or default to 0
  const [currentFlowIndex, setCurrentFlowIndex] = useState(() => {
    const savedIndex = getLocalData("f1FlowIndex");
    return savedIndex ? Number(savedIndex) : 0;
  });

  const currentFlowStep = F1_FLOW[currentFlowIndex];
  const isLastStep = currentFlowIndex === F1_FLOW.length - 1;

  // Save flow index to localStorage
  useEffect(() => {
    setLocalData("f1FlowIndex", currentFlowIndex);
  }, [currentFlowIndex]);

  // Handle completion of current step
  const handleStepComplete = () => {
    if (isLastStep) {
      // Flow complete - mark F1 as complete to trigger letter hunt
      setLocalData("f1FlowIndex", null); // Reset flow
      setLocalData("f1FlowComplete", "true"); // Mark F1 as complete
      setLocalData("rStepZero", null); // Clear rStepZero to prevent showing R1
      // Don't navigate away - let Practice.jsx handle showing letter hunt
      // Practice.jsx will detect f1FlowComplete and show letter hunt
    } else {
      // Move to next step
      setCurrentFlowIndex((prev) => prev + 1);
    }
  };

  // Handle Learn (L) step completion
  const handleLearnComplete = () => {
    // Clear rStepZero that R0 might have set
    setLocalData("rStepZero", null);
    handleStepComplete();
  };

  // Render Learn step (Letter Train - uses LetterTrain component, not R0)
  const renderLearnStep = () => {
    const learnStepNumber = currentFlowStep.step;

    // Get custom letters from F1 config
    // Learn steps map directly: L1->P1, L2->P4, L3->P7, L4->P10, L5->P13, L6->P16, L7->P19, L8->P22, L9->P25
    // But in practiceSteps, they're: L1->index 0, L2->index 3, L3->index 6, etc.
    const f1Steps = levelGetContent[lang]?.F1 || [];
    // Map Learn step number to practiceSteps index: L1->0, L2->3, L3->6, L4->9, L5->12, L6->15, L7->18, L8->21, L9->24
    const practiceStepIndex = (learnStepNumber - 1) * 3; // 0, 3, 6, 9, 12, 15, 18, 21, 24
    const stepConfig = f1Steps.find(
      (elem) => elem.title === practiceSteps?.[practiceStepIndex]?.name
    );
    const stepCustomLetters = stepConfig?.customLetters || customLetters;

    // Learn steps use LetterTrain component (not R0)
    // Return null here - LetterTrain will be rendered by Practice.jsx based on mechanism
    return null;
  };

  // Main render logic
  if (!currentFlowStep) {
    // F1 flow complete - return null so Practice.jsx can show letter hunt
    if (getLocalData("f1FlowComplete") === "true") {
      return null;
    }
    return <div>Flow step not found</div>;
  }

  // For Learn, Practice, and Apply steps, return null
  // These will be handled by the Practice component based on mechanism
  // F1 component just tracks the flow index
  return null;
};

export default F1;
