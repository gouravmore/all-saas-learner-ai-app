import React, { useEffect, useState, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import listenImg2 from "../../assets/listen.png";
import Confetti from "react-confetti";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";

import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
} from "../../utils/constants";
import spinnerStop from "../../assets/pause.png";
import raMic from "../../assets/listen.png";
import raStop from "../../assets/pause.png";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import { Modal } from "@mui/material";
import ZoomableImage from "./ZoomableImage";
import { filterBadWords } from "@tekdi/multilingual-profanity-filter";

import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const theme = createTheme();

const McqFlow = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
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
  vocabCount,
  wordCount,
}) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [conversationData, setConversationData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [step, setStep] = useState("initiate");
  const utteranceRef = useRef(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState("");
  const [completeAudio, setCompleteAudio] = useState(null);
  const [imageData, setImageData] = useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  const handleStartRecording = () => {
    setRecAudio(null);
    resetTranscript();
    setIsRecording(true);
    setLanguage(language);
    setAbusiveFound(false);
    setDetectedWord("");
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: language || "en-US",
    });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcriptRef.current);
    setAbusiveFound(false);

    setIsRecording(false);
    //console.log("Final Transcript:", transcriptRef.current)
  };

  const playAudioCorrect = () => {
    const audio = new Audio(correctSound);
    audio.play();
  };

  const playAudioWrong = () => {
    const audio = new Audio(wrongSound);
    audio.play();
  };

  steps = 5;

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data || [];
  };

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.name || "P1";

  const conversation = getConversation(level, currentLevel);

  useEffect(() => {
    setConversationData(conversation?.instructions?.content);
    setCompleteAudio(conversation?.instructions?.content[0]?.audio);
    setTasks(conversation?.tasks);
    setCurrentTaskIndex(0);
  }, []);

  useEffect(() => {
    setConversationData(conversation?.instructions?.content || []);
    setImageData(conversation?.instructions);
    setTasks(conversation?.tasks || []);
    setCurrentTaskIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowConfetti(false);
    setShowQuestion(false);
  }, [currentLevel]);

  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
    console.log("Live Transcript:", transcript);

    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      if (filteredText.includes("*")) {
        const count = parseInt(getLocalData("profanityCheck") || "0");

        if (count > 2) {
          setOpenMessageDialog({
            open: true,
            message: `Please speak appropriately.`,
            severity: "warning",
            isError: true,
          });
        }

        handleStopRecording();

        setLocalData("profanityCheck", (count + 1).toString());
      }
    }
  }, [transcript]);

  const task = conversation?.tasks[currentStep - 1];
  const correctAnswer = task?.options.find(
    (option) => option.id === task.answer
  )?.value;

  console.log("mcqFlow", correctAnswer);

  const resetState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const loadNextTask = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    //console.log("apiResp", responseText);
    await callTelemetryApi(
      correctAnswer,
      sessionId,
      currentStep - 1,
      recAudio,
      responseStartTime,
      responseText?.responseText || ""
    );
    setRecAudio(null);
    handleNext();
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      resetState();
    } else {
      setCurrentTaskIndex(0);
      resetState();
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
      parentWords={parentWords}
      lang={language}
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
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            //justifyContent: "center",
            alignItems: "center",
            //gap: "20px",
            //margin: "30px 30px",
          }}
        >
          {conversation?.instruction?.content[0]?.text && (
            <span
              style={{
                fontFamily: "Quicksand",
                fontWeight: "600",
                fontSize: isMobile ? "14px" : "28px",
                marginTop: "30px",
              }}
            >
              {conversation?.instruction?.content[0]?.text}
            </span>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: "20px",
              width: "90%",
              margin: "30px 30px",
            }}
          >
            {/* Image on the left */}

            {conversation?.instruction?.content[0]?.value && (
              // <img
              //   src={Assets[conversation?.instruction?.content[0]?.value]}
              //   alt="Children's Day"
              //   style={{ width: "250px", height: "250px", borderRadius: "15px" }}
              // />
              <ZoomableImage
                src={
                  getAssetUrl(
                    s3Assets[conversation?.instruction?.content[0]?.value]
                  ) || Assets[conversation?.instruction?.content[0]?.value]
                }
                alt="contentImage"
                imageStyle={{
                  height: "250px",
                }}
                iconPosition="bottom-right"
                useCustomIcon={true}
              />
            )}

            {!conversation?.instruction?.content[0]?.text && (
              <Box
                style={{
                  width: isMobile ? "80%" : "1px",
                  backgroundColor: "#E0E2E7",
                  height: isMobile ? "1px" : "280px",
                  margin: "0px 30px",
                  border: "1px solid #E0E2E7",
                }}
              />
            )}

            {/* MCQ Section on the right */}
            <div style={{ width: isMobile ? "80%" : "50%" }}>
              {typeof tasks?.[currentStep - 1]?.question === "string" ? (
                <h3
                  style={{
                    fontFamily: "Quicksand",
                    fontSize: isMobile ? "16px" : "22px",
                    fontWeight: "800",
                  }}
                >
                  {tasks[currentStep - 1].question}
                </h3>
              ) : null}

              <div>
                {conversation?.tasks?.[currentStep - 1]?.options.map(
                  (option) => (
                    <div
                      key={option.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <input
                        type="radio"
                        name="mcq"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => {
                          setSelectedOption(option.id);
                          if (
                            option.id ===
                            conversation?.tasks[currentStep - 1]?.answer
                          ) {
                            playAudioCorrect();
                          } else {
                            playAudioWrong();
                          }
                        }}
                        style={{
                          marginRight: "10px",
                          transform: "scale(1.5)",
                          cursor: "pointer",
                        }}
                      />
                      <label
                        style={{
                          fontSize: isMobile ? "14px" : "17px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontFamily: "Quicksand",
                        }}
                      >
                        {option.value}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {selectedOption && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop:
                  currentLevel === "S1" || currentLevel === "S2"
                    ? "30px"
                    : "10px",
                gap: "10px",
              }}
            >
              <VoiceAnalyser
                pageName={"m8"}
                setVoiceText={setVoiceText}
                onAudioProcessed={handleRecordingComplete}
                setRecordedAudio={setRecordedAudio}
                setVoiceAnimate={setVoiceAnimate}
                storyLine={storyLine}
                dontShowListen={true}
                handleNext={handleNext}
                enableNext={enableNext}
                originalText={parentWords}
                audioLink={audio ? audio : completeAudio}
                buttonAnimation={selectedOption}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                {...{
                  contentId,
                  contentType,
                  currentLine: currentStep - 1,
                  playTeacherAudio,
                  callUpdateLearner,
                  isShowCase,
                  setEnableNext,
                  //showOnlyListen: answer !== "correct",
                  showOnlyListen: false,
                  setOpenMessageDialog,
                }}
              />
              {currentLevel !== "S1" && currentLevel !== "S2"
                ? selectedOption !== null &&
                  recAudio && (
                    <div
                      onClick={loadNextTask}
                      style={{ cursor: "pointer", marginLeft: "23px" }}
                    >
                      <NextButtonRound height={45} width={45} />
                    </div>
                  )
                : recAudio && (
                    <div
                      onClick={loadNextTask}
                      style={{ cursor: "pointer", marginLeft: "23px" }}
                    >
                      <NextButtonRound height={45} width={45} />
                    </div>
                  )}
            </div>
          )}
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default McqFlow;
