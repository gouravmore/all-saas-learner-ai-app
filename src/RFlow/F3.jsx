import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLocalData,
  setLocalData,
  levelGetContent,
  practiceSteps,
} from "../utils/constants";

/**
 * F3 Flow sequence:
 * P=Practice (Letter Launcher), A=Apply (Letter Launcher + Memory Challenge + Read Aloud)
 *
 * Structure:
 * Practice 1 (Letter Speed) -> Practice 2 (Letter Speed) -> Practice 3 (Letter Speed) ->
 * Practice 4 (Letter Speed) -> Practice 5 (Letter Speed) -> Apply 1 (Letter Speed 3 levels + Memory Challenge 3 levels) ->
 * Practice 6 (Syllable Speed) -> Practice 7 (Syllable Speed) -> Practice 8 (Syllable Speed) ->
 * Practice 9 (Syllable Speed) -> Practice 10 (Syllable Speed) -> Apply 2 (Syllable Speed 1 level + Memory Challenge 3 levels + Read Aloud)
 *
 * Apply steps have special handling:
 * - Apply 1: Letter Speed (3 levels) -> Memory Challenge (3 levels)
 *   - If fail at any level → Practice 1
 *   - If pass all → Practice 6
 * - Apply 2: Syllable Speed (1 level) -> Memory Challenge (3 levels) -> Read Aloud
 *   - If fail at any level → Practice 6
 *   - If pass all → Complete F3
 */
export const F3_FLOW = [
  { type: "P", step: 1, mechanism: "letterLauncher", contentType: "letter" }, // Practice 1 - Letter Speed (Letter Launcher)
  { type: "P", step: 2, mechanism: "letterLauncher", contentType: "letter" }, // Practice 2 - Letter Speed (Letter Launcher)
  { type: "P", step: 3, mechanism: "letterLauncher", contentType: "letter" }, // Practice 3 - Letter Speed (Letter Launcher)
  { type: "P", step: 4, mechanism: "letterLauncher", contentType: "letter" }, // Practice 4 - Letter Speed (Letter Launcher)
  { type: "P", step: 5, mechanism: "letterLauncher", contentType: "letter" }, // Practice 5 - Letter Speed (Letter Launcher)
  {
    type: "A",
    step: 1,
    mechanism: "letterLauncher",
    contentType: "letter",
    failRedirect: "P1",
    passRedirect: "P6",
  }, // Apply 1 - Letter Speed (3 levels) + Memory Challenge (3 levels)
  { type: "P", step: 6, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 6 - Syllable Speed (Letter Launcher)
  { type: "P", step: 7, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 7 - Syllable Speed (Letter Launcher)
  { type: "P", step: 8, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 8 - Syllable Speed (Letter Launcher)
  { type: "P", step: 9, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 9 - Syllable Speed (Letter Launcher)
  { type: "P", step: 10, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 10 - Syllable Speed (Letter Launcher)
  {
    type: "A",
    step: 2,
    mechanism: "letterLauncher",
    contentType: "syllable",
    failRedirect: "P6",
    passRedirect: "complete",
  }, // Apply 2 - Syllable Speed (1 level) + Memory Challenge (3 levels) + Read Aloud
];

/**
 * Get current F3 flow step
 */
export const getF3FlowStep = () => {
  const savedIndex = getLocalData("f3FlowIndex");
  const flowIndex = savedIndex ? Number(savedIndex) : 0;
  return {
    index: flowIndex,
    step: F3_FLOW[flowIndex] || null,
    isLast: flowIndex === F3_FLOW.length - 1,
  };
};

/**
 * Advance to next F3 flow step
 */
export const advanceF3Flow = () => {
  const current = getF3FlowStep();
  if (current.isLast) {
    setLocalData("f3FlowIndex", null);
    return null;
  }
  const nextIndex = current.index + 1;
  setLocalData("f3FlowIndex", nextIndex);
  return F3_FLOW[nextIndex];
};

/**
 * Reset F3 flow
 */
export const resetF3Flow = () => {
  setLocalData("f3FlowIndex", null);
};

const F3 = ({
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
    const savedIndex = getLocalData("f3FlowIndex");
    return savedIndex ? Number(savedIndex) : 0;
  });

  const currentFlowStep = F3_FLOW[currentFlowIndex];
  const isLastStep = currentFlowIndex === F3_FLOW.length - 1;

  // Save flow index to localStorage
  useEffect(() => {
    setLocalData("f3FlowIndex", currentFlowIndex);
  }, [currentFlowIndex]);

  // Handle completion of current step
  const handleStepComplete = () => {
    if (isLastStep) {
      // Flow complete - mark F3 as complete
      setLocalData("f3FlowIndex", null); // Reset flow
      setLocalData("f3FlowComplete", "true"); // Mark F3 as complete
    } else {
      // Move to next step
      setCurrentFlowIndex((prev) => prev + 1);
    }
  };

  // Main render logic
  if (!currentFlowStep) {
    // F3 flow complete - return null so Practice.jsx can handle next flow
    if (getLocalData("f3FlowComplete") === "true") {
      return null;
    }
    return <div>Flow step not found</div>;
  }

  // For Practice and Apply steps, return null
  // These will be handled by the Practice component based on mechanism
  // F3 component just tracks the flow index
  return null;
};

export default F3;
