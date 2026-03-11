import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import listenImg2 from "../../assets/listen.png";
import spinnerStop from "../../assets/pause.png";
import MainLayout from "../Layouts.jsx/MainLayout";
import clapImage from "../../assets/hand-ic.svg";
// import bulbHint from "../../assets/hint.svg";
// import bulbHintDisabled from "../../assets/DisabledHint.svg";
import * as Assets from "../../utils/imageAudioLinks";
import frame from "../../assets/frame.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import addSound from "../../assets/audio/add.mp3";
import removeSound from "../../assets/remove.wav";
import { filterBadWords } from "@tekdi/multilingual-profanity-filter";
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
  callTelemetryApi,
} from "../../utils/apiUtil";
import AudioTooltipModal from "./AudioTooltipModal";
import ZoomableImage from "./ZoomableImage";
import { doubleMetaphone } from "double-metaphone";
import loadingJson from "../../assets/loadingJson.json";
import Lottie from "lottie-react";
import {
  transliterateKannadaToLatin,
  compareWords,
} from "../../utils/textUtils";
import hintimg from "../../assets/hintsicon.svg";

// const isChrome =
//   /Chrome/.test(navigator.userAgent) &&
//   /Google Inc/.test(navigator.vendor) &&
//   !/Edg/.test(navigator.userAgent);

const isChrome = true;

const theme = createTheme();

const Mechanics7 = ({
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
  multilingual,
  enableMultilingual = true,
}) => {
  const [words, setWords] = useState(
    type === "word" ? [] : ["Friend", "She is", "My"]
  );
  const [recordingStates, setRecordingStates] = useState({});
  const [completeAudio, setCompleteAudio] = useState(null);
  const [open, setOpen] = useState(false);

  const Loader = () => {
    return (
      <Lottie
        animationData={loadingJson}
        loop
        autoplay
        style={{ width: 150, height: 120 }}
      />
    );
  };

  useEffect(() => {
    if (words && words?.length) {
      setRecordingStates(
        words.reduce((acc, word) => ({ ...acc, [word]: false }), {})
      );
      setCompleteAudio(currentImg?.audioUrl);
    }
  }, [words]);

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const transcriptRef = useRef("");

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

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  let currentLevel = practiceSteps?.[currentPracticeStep]?.title || "L1";

  let apiLevel = `M${level}-${currentLevel}`;

  useEffect(() => {
    transcriptRef.current = transcript;
    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      if (filteredText.includes("*")) {
        const count = parseInt(getLocalData("profanityCheck") || "0");

        if (count > 2) {
          setOpenMessageDialog({
            open: true,
            message: `Please speak properly.`,
            severity: "warning",
            isError: true,
          });
        }

        stopRecording();

        setLocalData("profanityCheck", (count + 1).toString());
      }
    }
  }, [transcript]);

  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const [recAudio, setRecAudio] = useState("");

  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentIsSelected, setCurrentIsSelected] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState({});
  const [isMicOn, setIsMicOn] = useState(false);
  const [syllAudios, setSyllAudios] = useState([]);
  const [isWordCorrect, setIsWordCorrect] = useState(false);
  const currentWordRef = useRef(currentWord);
  const currentIsSelectedRef = useRef(currentIsSelected);
  const wordsRef = useRef(words);
  const selectedWordsRef = useRef(selectedWords);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRecordingNew, setIsRecordingNew] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [run, setRun] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  //const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const chunksRef = useRef([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const syllableCount = parentWords?.syllable?.length || 0;
  const isLastSyllable = true;
  const [currentText, setCurrentText] = useState("");
  const sessionId = getLocalData("sessionId");
  const correctPracticeWords = getLocalData("correctPracticeWords");
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [showMultiLingual, setShowMultiLingual] = useState(false);
  const lang = getLocalData("lang") || "en";

  function sanitize(text) {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]'’]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function phoneticMatch(a, b) {
    const [a1, a2] = doubleMetaphone(a);
    const [b1, b2] = doubleMetaphone(b);
    return a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2;
  }

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setShowModal(true);
  };

  // Update currentText whenever currentImg or stepIndex changes
  useEffect(() => {
    const text = isLastSyllable
      ? currentImg?.text
      : parentWords?.syllable?.[stepIndex]?.text || "";
    setCurrentText(text);
    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      //console.log("filtered", filteredText);
      if (filteredText.includes("*")) {
        stopRecording();

        setOpenMessageDialog({
          open: true,
          message: `Please speak appropriately.`,
          severity: "warning",
          isError: true,
        });
      }
    }
  }, [currentImg, stepIndex, isLastSyllable, transcript]);

  // const currentText = isLastSyllable
  //   ? currentImg?.completeWord
  //   : currentImg?.syllablesAudio?.[stepIndex]?.name || "";

  const currentAudio = currentImg?.audioUrl || null;
  const [stepsIndex, setStepsIndex] = useState(0);

  //console.log("wordSyl", currentText);

  const startAudioRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          //console.log("📦 Chunk recorded:", event.data);
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        //console.log("✅ Blob created:", audioBlob);
        setRecordedAudioBlob(audioBlob);
        chunksRef.current = [];

        streamRef.current?.getTracks().forEach((track) => track.stop());

        if (isLastSyllable) {
          try {
            setIsLoading(true);

            // Use browser speech recognition transcript (already captured during recording)
            const transcripts = sanitize(transcriptRef.current || "");
            const target = sanitize(currentText);
            const isCorrect =
              transcripts.includes(target) ||
              phoneticMatch(transcripts, target);

            //console.log("Transcription resultss 1:", transcripts);
            //console.log("Transcription resultss 2:", target);

            setIsWordCorrect(isCorrect);

            setIsLoading(false);
            // setStatus("inactive");
          } catch (error) {
            console.error("Transcription error:", error);
            setIsLoading(false);
            setIsWordCorrect(false);
            // setStatus("inactive");
            // props.setIsCorrect?.(false);
          }
        }
      };

      mediaRecorder.start();
      //console.log("🎙️ Recording started...");
    } catch (error) {
      console.error("🚨 Error starting audio recording:", error);
    }
  };

  const stopAudioRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      //console.log("🛑 Stopping recording...");
      mediaRecorderRef.current.stop();
    }
  };

  const playAudioFromBlob = (blob) => {
    if (!(blob instanceof Blob)) {
      console.error("Invalid input: Expected a Blob or File.");
      return;
    }

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(blob);

    audio.src = objectUrl;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });

    audio.onended = () => {
      URL.revokeObjectURL(objectUrl);
      setIsPlaying(false);
    };
  };

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    await callTelemetryApi(
      currentText,
      sessionId,
      currentStep - 1,
      recAudio,
      responseStartTime,
      currentText,
      apiLevel
    );
  };

  const playWordAudio = (audio) => {
    if (audio) {
      audioRef.current.src = audio;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  const stopCompleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    currentWordRef.current = currentWord;
    currentIsSelectedRef.current = currentIsSelected;
    wordsRef.current = words;
    selectedWordsRef.current = selectedWords;
  }, [currentWord, currentIsSelected, words, selectedWords]);

  const initializeRecognition = () => {
    let recognitionInstance;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
    } else {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    if (recognitionInstance) {
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {};

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);

        handleWordsLogic(currentText, transcript, currentIsSelected);
        setIsProcessing(false);
        setIsMicOn(false);
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        setIsProcessing(false);
        setIsMicOn(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          // No speech detected
        } else if (event.error === "aborted") {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onend = () => {
        setIsProcessing(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, [recognition]);

  const startRecording = (word, isSelected) => {
    //console.log('recs', recognition);
    if (isChrome) {
      // if (!browserSupportsSpeechRecognition) {
      //   //alert("Speech recognition is not supported in your browser.");
      //   return;
      // }
      resetTranscript();
      startAudioRecording();
      setLanguage(language);
      setAbusiveFound(false);
      setDetectedWord("");
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: language || "en-US",
      });
    }
    setRecordingStates((prev) => ({
      ...prev,
      [word]: true,
    }));
    setIsRecording(true);
    setCurrentWord(word);
    setCurrentIsSelected(isSelected);
  };

  const stopRecording = (word) => {
    let audio = new Audio(correctSound);
    audio.play();
    if (isChrome) {
      SpeechRecognition.stopListening();
      stopAudioRecording();
      const finalTranscript = transcriptRef.current;
      setAbusiveFound(false);
      //console.log("textR", word, finalTranscript);
      const matchPercentage = phoneticMatch(word, finalTranscript);

      if (matchPercentage < 40) {
        setIncorrectWords((prevState) => ({
          ...prevState,
          [currentText]: true,
        }));
      } else {
        setIncorrectWords((prevState) => ({
          ...prevState,
          [currentText]: false,
        }));
      }

      handleWordsLogic(word, finalTranscript, currentIsSelected);
      setIsMicOn(false);
      setIsRecording(false);
      setIsProcessing(false);
    } else {
      if (recognition) {
        recognition.stop();
      }
      setIsProcessing(true);
    }
    setAbusiveFound(false);
    setRecordingStates((prev) => ({
      ...prev,
      [word]: false,
    }));
    setIsRecording(false);
  };

  useEffect(() => {
    if (isRecording && recognition && recognition.state !== "recording") {
      recognition.start();
    }
  }, [isRecording, recognition, currentWord]);

  useEffect(() => {
    if (!isChrome) {
      initializeRecognition();
    }
  }, []);

  const playAudio = (audioPath) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  const handlePlayAudio = (elem) => {
    const matchedSyllable = syllAudios.find(
      (syllable) => syllable.name.toLowerCase() === elem.toLowerCase()
    );

    if (matchedSyllable) {
      playAudio(matchedSyllable.audio);
    }
  };

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  useEffect(() => {
    setSelectedWords([]);
  }, [contentId]);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    setWordsAfterSplit(parentWords?.syllable?.map((s) => s.text));
    setWords(parentWords?.syllable?.map((s) => s.text));
    setSyllAudios(parentWords?.syllable);
    wordsRef.current = currentImg?.syllable;
  }, [currentImg]);

  const handleWordsLogic = (word, transcribedText, isSelected) => {
    //console.log("wordsZ", word, transcribedText);

    const matchPercentage = phoneticMatch(word, transcribedText);

    if (matchPercentage < 40) {
      setIncorrectWords((prevState) => ({
        ...prevState,
        [word]: true,
      }));
    } else {
      setIncorrectWords((prevState) => ({
        ...prevState,
        [word]: false,
      }));
    }

    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    if (
      selectedWordsRef.current?.length + 1 !== wordsAfterSplit?.length ||
      isSelected
    ) {
      setEnableNext(false);
    }

    if (isSelected) {
      // Remove the word from selectedWords and add it back to words
      let selectedWordsArr = [...selectedWordsRef.current];
      let index = selectedWordsArr.findIndex((elem) => elem === word);
      if (index !== -1) {
        selectedWordsArr.splice(index, 1);
        setSelectedWords(selectedWordsArr);
        selectedWordsRef.current = selectedWordsArr;

        // Add the word back to words only if it doesn't already exist
        if (!wordsRef.current.includes(word)) {
          const updatedWords = [...wordsRef.current, word];
          setWords(updatedWords);
          wordsRef.current = updatedWords;
        }
      }
    } else {
      // Remove the word from words and add it to selectedWords
      let wordsArr = [...wordsRef.current];
      let index = wordsArr.findIndex((elem) => elem === word);
      if (index !== -1) {
        wordsArr.splice(index, 1);
        setWords(wordsArr);
        wordsRef.current = wordsArr;
      }

      // Add the word to selectedWords only if it doesn't already exist
      if (!selectedWordsRef.current.includes(word)) {
        const updatedSelectedWords = [...selectedWordsRef.current, word];
        setSelectedWords(updatedSelectedWords);
        selectedWordsRef.current = updatedSelectedWords;
      }
    }
  };

  const handleWords = (word, isSelected) => {
    if (isMicOn) {
      stopRecording();
      setIsMicOn(false);
    } else {
      setIsMicOn(true);
    }
    startRecording(word, isSelected);
  };

  const answer =
    selectedWordsRef.current?.length !== wordsAfterSplit?.length
      ? ""
      : selectedWordsRef.current?.join(" ") === parentWords
      ? "correct"
      : "wrong";

  // useEffect(() => {
  //   const isWrong =
  //     selectedWordsRef.current?.length !== wordsAfterSplit?.length ||
  //     selectedWordsRef.current?.join(" ") !== parentWords;

  //   setIsCorrect(isWrong);
  // }, [selectedWordsRef.current, wordsAfterSplit, parentWords]);

  //console.log("ans", isLastSyllable, isWordCorrect);

  const getBorderColor = () => {
    if (answer === "correct") {
      return "#58CC02";
    } else if (answer === "wrong") {
      return "#C30303";
    } else if (
      !wordsRef.current?.length &&
      !!selectedWordsRef.current?.length &&
      type === "word"
    ) {
      return "#1897DE";
    }
    return "rgba(51, 63, 97, 0.10)";
  };

  const getBorder = () => {
    if (answer === "wrong") return "2px solid #C30303";
    if (answer === "correct") return "none";
    if (
      !wordsRef.current.length &&
      selectedWordsRef.current.length &&
      type === "word"
    ) {
      return "2px solid #1897DE";
    }
    return "none";
  };

  const getMarginLeft = (wIndex) => {
    return wIndex > 0 ? "150px!important" : undefined;
  };

  const getDynamicMarginLeft = (wIndex) => {
    return wordsRef.current.length === 1 && wIndex === 0 ? "250px" : "0px";
  };

  const getCircleHeight = (elem) => {
    return elem?.length < 3 ? 65 : 70;
  };

  const getColor = (type, isIncorrect, answer) => {
    if (type === "word") {
      if (isIncorrect) return "#C30303";
      if (answer === "correct") return "#58CC02";
      return "#1897DE";
    }
    if (answer === "wrong") return "#C30303";
    return "#333F61";
  };

  const isCorrectWord = incorrectWords[currentText] === false;
  const isIncorrectWord = incorrectWords[currentText] === true;

  const text = currentImg?.text || "";
  const search = currentText || "";

  const matchIndex = text.toLowerCase().indexOf(search.toLowerCase());

  let before = text;
  let match = "";
  let after = "";

  if (matchIndex !== -1 && search.length > 0) {
    before = text.slice(0, matchIndex);
    match = text.slice(matchIndex, matchIndex + search.length);
    after = text.slice(matchIndex + search.length);
  }

  //console.log("audios", completeAudio, answer);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      answer={answer}
      isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      recAudio={recAudio}
      isCorrect={true}
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
      {/* {isRecordingComplete && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <img
            src={Assets.frame}
            height={"110px"}
            alt="frame"
            width={"300px"}
            style={{ position: "relative", zIndex: 1 }}
          />
          <img
            src={currentImg?.img}
            alt="pencil"
            height={"85px"}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      )} */}
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            //alignItems: "center",
            justifyContent: "space-evenly",
            height: "80%",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <img
            src={hintimg}
            alt="hint"
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "20px",
              left: "20px",
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
                  src={`https://www.youtube.com/embed/uLG04uE6ZKA?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "8px" }}
                ></iframe>
              </div>
            </div>
          )}

          {/*         
        <Joyride
          steps={walkSteps}
          run={run}
          //stepIndex={stepsIndex}
          showSkipButton={false}
          showProgress={false}
          disableOverlayClose={true}
          disableCloseOnEsc={true}
          spotlightClicks={true}
          tooltipComponent={MyCustomTooltip}
          hideBackButton={true}
          styles={{
            options: {
              //arrowColor: "#fff",
              backgroundColor: "#fff",
              backgroundColor: 'transparent',
              arrowColor: 'transparent', 
              textColor: "#333",
              zIndex: 10000,
            },
          }}
          callback={(data) => {
            if (data.status === 'finished' || data.status === 'skipped') {
              setRun(false);
            }
          }}                  
        />
        */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              maskBorderWidth: 6,
              height: "200px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: isMobile ? "30px" : "50px",
                lineHeight: isMobile ? "60px" : "87px",
                letterSpacing: isMobile ? "1%" : "2%",
                fontFamily: "Quicksand",
                textTransform: "uppercase",
              }}
            >
              {before && <span style={{ color: "grey" }}>{before}</span>}
              {match && <span style={{ color: "#333F61" }}>{match}</span>}
              {after && <span style={{ color: "grey" }}>{after}</span>}
            </span>
            <ZoomableImage
              src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${parentWords?.image_url}`}
              alt="pencil"
              imageStyle={{
                height: "150px",
                width: "150px",
                zIndex: 2,
              }}
            />
          </Box>
          <Box
            sx={{
              width: isMobile ? "50vh" : "1px",
              backgroundColor: "#E0E2E7",
              height: isMobile ? "1px" : "50vh",
              border: "1px solid #E0E2E7",
              margin: isMobile ? "40px 0px" : "0px 0px",
              alignSelf: "center",
            }}
          />
          <Box
            textAlign="center"
            sx={{
              height: "350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Box
              sx={{
                marginTop: 3,
                backgroundColor: !isRecorded
                  ? "#1CB0F60F" // default background
                  : isIncorrectWord
                  ? "#58CC020F" // red FF7F360F
                  : "#58CC020F", // green background
                border: !isRecorded
                  ? "2px solid #1CB0F633" // default border
                  : isIncorrectWord
                  ? "2px solid #58CC02" // red FF7F36
                  : "2px solid #58CC02", // green border
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: isMobile ? "10px 20px" : "10px 70px",
                marginBottom: "16px",
                width: isMobile ? "300px" : "400px",
                height: "150px",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* {isRecorded && (
                  <img
                    //src={!isIncorrectWord ? Assets.tick : Assets.wrongTick}
                    src={Assets.tick}
                    alt="tick"
                    style={{
                      marginRight: "16px",
                      width: "56px",
                      height: "56px",
                    }}
                  />
                )} */}
                {isLastSyllable && isRecorded ? (
                  <span
                    style={{
                      color: !isRecorded
                        ? "#333F61"
                        : isIncorrectWord
                        ? "#58CC02"
                        : "#58CC02",
                      fontWeight: 700,
                      fontSize: isMobile ? "30px" : "50px",
                      lineHeight: isMobile ? "60px" : "70px",
                      letterSpacing: isMobile ? "1%" : "2%",
                      fontFamily: "Quicksand",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentText}
                  </span>
                ) : (
                  <span
                    style={{
                      color: !isRecorded
                        ? "#333F61"
                        : isIncorrectWord
                        ? "#58CC02"
                        : "#58CC02",
                      fontWeight: 700,
                      fontSize: isMobile ? "50px" : "50px",
                      lineHeight: isMobile ? "60px" : "70px",
                      letterSpacing: isMobile ? "1%" : "2%",
                      fontFamily: "Quicksand",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentText}
                  </span>
                )}
                {showMultiLingual && enableMultilingual && (
                  <AudioTooltipModal
                    audioSrc={multilingual?.[multilingualLangCode]?.audio_url}
                    description={currentText}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: "5px",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "2px solid #FF7F36",
                        borderRadius: "16px",
                        gap: "10px",
                        padding: "10px",
                        //width: "300px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {/* Kannada Letter Box */}
                      <Box
                        sx={{
                          backgroundColor: "#FEBC2F66",
                          borderRadius: "4px",
                          //width: "100px",
                          //height: "100px",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "35px",
                            fontWeight: "400",
                            color: "#333F61",
                            fontStyle: "Quicksand",
                          }}
                        >
                          ಕ
                        </span>
                      </Box>

                      <ListenButton height={40} width={40} />
                    </Box>
                  </AudioTooltipModal>
                )}
              </Box>
              {isRecorded && (!showMultiLingual || !enableMultilingual) && (
                <img
                  src={Assets.graph}
                  alt="graph"
                  style={{ height: "30px", margin: "10px" }}
                />
              )}
            </Box>

            {showMultiLingual && enableMultilingual && (
              <img
                src={Assets.graph}
                alt="graph"
                style={{ height: "40px", margin: "10px" }}
              />
            )}

            {showMultiLingual && enableMultilingual && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "40px",
                  marginTop: "30px",
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    transform: "translateY(-15px)",
                  }}
                  onClick={() => {
                    setShowMultiLingual(false);
                    setIsRecorded(false);
                    setIsRecording(true);
                    startRecording(currentText);
                  }}
                >
                  <RetryIcon height={50} width={50} />
                </Box>

                <Box
                  className="walkthrough-step-5"
                  mb={2}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsRecorded(false);
                    setShowMultiLingual(false);

                    const newWordData = {
                      original_text: currentText,
                      content_id: contentId,
                      milestone_level: "m1",
                      practice_level: currentLevel,
                      session_id: sessionId,
                      practiced: true,
                      learned: isWordCorrect ? true : false,
                      subsession_id: "session_123",
                    };

                    callTelemetry();
                    setLocalData("correctPracticeWords", [
                      ...(correctPracticeWords || []),
                      newWordData,
                    ]);
                    handleNext();
                    setStepIndex(0);
                  }}
                >
                  <NextButtonRound height={50} width={50} />
                </Box>
              </Box>
            )}

            {!isRecording &&
              !isRecorded &&
              (!showMultiLingual || !enableMultilingual) && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maskBorderWidth: 6,
                    gap: 5,
                    height: "250px",
                  }}
                >
                  {isPlaying ? (
                    <div>
                      <Box
                        sx={{
                          marginTop: "5px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                          marginLeft: getMarginLeft(0),
                        }}
                        onClick={stopCompleteAudio}
                      >
                        <StopButton height={50} width={50} />
                      </Box>
                    </div>
                  ) : (
                    <div>
                      <Box
                        className="walkthrough-step-1"
                        sx={{
                          marginTop: "5px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: `url(${clapImage}) 32 24, auto`,
                          marginLeft: getMarginLeft(0),
                        }}
                        onClick={() => {
                          playWordAudio(
                            `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${currentAudio}`
                          );
                        }}
                      >
                        <ListenButton height={50} width={50} />
                      </Box>
                    </div>
                  )}
                  <Box
                    className="walkthrough-step-2"
                    sx={{
                      position: "relative",
                      width: "90px",
                      height: "90px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "7px",
                      //marginLeft: getMarginLeft(0),
                      cursor: `url(${clapImage}) 32 24, auto`,
                    }}
                    onClick={() => {
                      setIsRecording(true);
                      startRecording(currentText);
                      //startAudioRecording();
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "90px",
                        height: "90px",
                        backgroundColor: "#58CC0233",
                        borderRadius: "50%",
                        animation: "pulse 1.2s linear infinite",
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
                      <SpeakButton height={50} width={50} />
                    </Box>
                  </Box>
                </Box>
              )}

            {isRecording && (!showMultiLingual || !enableMultilingual) && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  maskBorderWidth: 6,
                  height: "250px",
                }}
              >
                <Box style={{ marginTop: "10px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
                <Box
                  className="walkthrough-step-3"
                  sx={{
                    marginTop: "7px",
                    position: "relative",
                    display: "flex",
                    gap: "50px",
                    justifyContent: "center",
                    alignItems: "center",
                    //height: { xs: "30px", sm: "40px", md: "50px" },
                    minWidth: { xs: "50px", sm: "60px", md: "70px" },
                    cursor: `url(${clapImage}) 32 24, auto`,
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
                      //marginTop: "7px",
                      //marginLeft: getMarginLeft(0),
                      cursor: `url(${clapImage}) 32 24, auto`,
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      setIsRecording(false);
                      setIsRecorded(true);
                      stopRecording(currentText);
                      //stopAudioRecording();
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "90px",
                        height: "90px",
                        backgroundColor: "#FF4B4B33",
                        borderRadius: "50%",
                        animation: "pulse 1.2s linear infinite",
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
                      <StopButton height={50} width={50} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {abusiveFound && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                }}
              >
                Warning: Inappropriate word detected ({detectedWord})
              </div>
            )}

            {isRecorded &&
              (!showMultiLingual || !enableMultilingual) &&
              (isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "250px",
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "30px",
                    gap: "10px",
                    height: "250px",
                    //maskBorderWidth: 6,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                      marginRight: "5px",
                      //maskBorderWidth: 6,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        maskBorderWidth: 6,
                        gap: 5,
                      }}
                    >
                      {isPlaying ? (
                        <div>
                          <Box
                            sx={{
                              //marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: "pointer",
                              marginLeft: getMarginLeft(0),
                            }}
                            onClick={stopCompleteAudio}
                          >
                            <img
                              src={spinnerStop}
                              alt="Audio"
                              style={{
                                height: "50px",
                                width: "50px",
                                cursor: "pointer",
                              }}
                            />
                            {/* <StopButton height={50} width={50} /> */}
                          </Box>
                        </div>
                      ) : (
                        <div>
                          <Box
                            className="walkthrough-step-4"
                            sx={{
                              //marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: `url(${clapImage}) 32 24, auto`,
                              //marginLeft: getMarginLeft(0),
                            }}
                            onClick={() => {
                              playAudioFromBlob(recordedAudioBlob);
                            }}
                          >
                            <img
                              src={listenImg2}
                              alt="Audio"
                              style={{
                                height: "50px",
                                width: "50px",
                                cursor: "pointer",
                              }}
                            />
                            {/* <ListenButton height={50} width={50} /> */}
                          </Box>
                        </div>
                      )}
                    </Box>
                    <div
                      onClick={() => {
                        setIsRecorded(false);
                        setIsRecording(true);
                        startRecording(currentText);
                      }}
                      style={{
                        //marginTop: "-10px",
                        cursor: "pointer",
                        //marginLeft: "30px",
                      }}
                    >
                      <RetryIcon height={50} width={50} />
                    </div>
                  </Box>
                  <Box
                    className="walkthrough-step-5"
                    mb={2}
                    onClick={() => {
                      if (isLastSyllable && enableMultilingual) {
                        setShowMultiLingual(true);
                      } else if (isLastSyllable && !enableMultilingual) {
                        // If multilingual is disabled, proceed to next content
                        const newWordData = {
                          original_text: currentText,
                          content_id: contentId,
                          milestone_level: "m1",
                          practice_level: currentLevel,
                          session_id: sessionId,
                          practiced: true,
                          learned: isWordCorrect ? true : false,
                          subsession_id: "session_123",
                        };

                        callTelemetry();
                        setLocalData("correctPracticeWords", [
                          ...(correctPracticeWords || []),
                          newWordData,
                        ]);
                        handleNext();
                        setStepIndex(0);
                        setIsRecorded(false);
                      } else {
                        setStepIndex((prev) => prev + 1);
                        setIsRecorded(false);
                      }
                    }}
                    sx={{
                      marginTop: "30px",
                      cursor: "pointer",
                      //marginLeft: "30px",
                    }}
                  >
                    <NextButtonRound height={50} width={50} />
                  </Box>
                </Box>
              ))}
            <audio
              ref={audioRef}
              onEnded={handleAudioEnd}
              src={completeAudio}
              hidden
            />
          </Box>
          <LanguageModalNew
            show={showModal}
            word={selectedWord}
            onClose={() => setShowModal(false)}
          />
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default Mechanics7;
