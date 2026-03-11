import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import Confetti from "react-confetti";
import listenImg from "../../assets/listen.png";
import pause from "../../assets/pause.png";
import Mic from "../../assets/mikee.svg";
import Stop from "../../assets/pausse.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import { filterBadWords } from "@tekdi/multilingual-profanity-filter";
import hintimg from "../../assets/hintsicon.svg";

import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  ListenButton,
  StopButton,
  setLocalData,
} from "../../utils/constants";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import AudioTooltipModal from "./AudioTooltipModal";
import { Log } from "../../services/telementryService";

const theme = createTheme();

const PhrasesInAction = ({
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
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);
  //const [currentSteps, setCurrentSteps] = useState(getInitialStep(currentLevel));
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [isCorrectImageSelected, setIsCorrectImageSelected] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [recAudio, setRecAudio] = useState("");

  // Get native language symbol based on nativeLang
  const getNativeLangSymbol = () => {
    const nativeLang = getLocalData("nativeLang");
    const langSymbolMap = {
      ka: "ಕ", // Kannada (from LanguageModal)
      kn: "ಕ", // Kannada (from AllLanguages)
      tn: "இ", // Tamil (from AllLanguages, using "ta" symbol)
      ta: "இ", // Tamil (from AllLanguages)
      te: "ఈ", // Telugu (from AllLanguages)
      hi: "क", // Hindi (from AllLanguages)
      gu: "ક", // Gujarati (from AllLanguages)
      or: "କ", // Odia (from AllLanguages)
    };
    return langSymbolMap[nativeLang] || "ಕ"; // Default to Kannada if not found
  };
  const nativeLangSymbol = getNativeLangSymbol();

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
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  function convertToStepFormat(rawData, audioFile, contentSourceData) {
    // If rawData has options (mechanics_data format), use it
    if (rawData && rawData.options && rawData.options.length > 0) {
      const correctOption = rawData.options.find((opt) => opt.isAns);

      const step1 = {
        allwords: [
          {
            img: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${correctOption.image_url}`,
            text: correctOption.text,
          },
        ],
        audio: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${audioFile}`,
      };

      const step2 = {
        allwordsTwo: rawData.options.map((opt) => ({
          img: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${opt.image_url}`,
          text: opt.text,
        })),
        correctWordTwo: correctOption.text,
        audio: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${audioFile}`,
      };

      return { step1, step2 };
    }

    // Fallback: If contentSourceData is available (simple template format)
    if (contentSourceData && contentSourceData.text) {
      const imageUrl =
        contentSourceData.image_url || contentSourceData.imageUrl;
      const audioUrl =
        audioFile || contentSourceData.audio_url || contentSourceData.audioUrl;
      const text = contentSourceData.text;

      const step1 = {
        allwords: [
          {
            img: imageUrl
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${imageUrl}`
              : contentSourceData.image || "",
            text: text,
          },
        ],
        audio: audioUrl
          ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${audioUrl}`
          : contentSourceData.audio || "",
      };

      // For step2, we'll use the same content (can be enhanced later if needed)
      const step2 = {
        allwordsTwo: [
          {
            img: imageUrl
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${imageUrl}`
              : contentSourceData.image || "",
            text: text,
          },
        ],
        correctWordTwo: text,
        audio: audioUrl
          ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${audioUrl}`
          : contentSourceData.audio || "",
      };

      return { step1, step2 };
    }

    return {};
  }

  let levelDataRaw = convertToStepFormat(
    parentWords,
    currentImg?.audioUrl,
    currentImg
  );

  // Note: currentSteps is declared later, so we can't use it here yet

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const mimeType = "audio/webm;codecs=opus";
  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;

    // Only check if there's new content and we're not already in abusive state
    if (transcript && !abusiveFound) {
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

        stopAudioRecording();

        setLocalData("profanityCheck", (count + 1).toString());
      }
    }
  }, [transcript]);

  const startAudioRecording = useCallback(async () => {
    setRecordedBlob(null);
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
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.error("MIME type not supported:", mimeType);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordedChunksRef.current.length === 0) {
          setRecordedBlob(null);
          return;
        }

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Emit data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData(); // Flush remaining data
      recorder.stop();
      setFinalTranscript(transcriptRef.current);
      setAbusiveFound(false);

      setIsRecording(false);
    }
    SpeechRecognition.stopListening();
  }, []);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

  let currentLevel = practiceSteps?.[currentPracticeStep]?.titleNew || "L1";

  let apiLevel = `M${level}-${currentLevel}`;

  if (
    String(level) === "10" ||
    String(level) === "12" ||
    String(level) === "13"
  ) {
    currentLevel = practiceSteps?.[currentPracticeStep]?.name;
  }

  const getInitialStep = (stepLevel, milestoneLevel) => {
    // For M3 (milestoneLevel 3), determine step based on the new structure:
    // Phrase Reading/Repeat Phrase (step1): L1, L2, L3, P1, P3, P4, S1, S2
    // Correct Image Phrase (step2): P2, L4
    if (String(milestoneLevel) === "3") {
      // For M3, use step1 for most steps, step2 only for P2 and L4
      const isStep2 = stepLevel === "L2" || stepLevel === "L4";
      return isStep2 ? "step2" : "step1";
    }
    // For other levels, use original logic
    return stepLevel === "L1" || stepLevel === "L3" ? "step1" : "step2";
  };

  const [currentSteps, setCurrentSteps] = useState(
    getInitialStep(currentLevel, level)
  );

  // Note: levelData is computed later

  const levelContent = {
    length: 10,
    en: {
      L1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            correctWordTwo: "The Sun Shines",
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            correctWordTwo: "Fish Swims",
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            correctWordTwo: "Birds Fly",
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
            ],
            correctWordTwo: "She Smiles",
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            correctWordTwo: "They Laugh",
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
        },
      ],

      L2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.wePlayAudio) || Assets.wePlayAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "Sun Shines",
              },
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
            ],
            correctWordTwo: "We Play",
            audio: getAssetAudioUrl(s3Assets.wePlayAudio) || Assets.wePlayAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.heDancesAudio) || Assets.heDancesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img:
                  getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
                text: "Clocks Tick",
              },
              {
                img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
                text: "She Sings",
              },
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
            ],
            correctWordTwo: "He Dances",
            audio:
              getAssetAudioUrl(s3Assets.heDancesAudio) || Assets.heDancesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
                text: "She Sings",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sheSingsAudio) || Assets.sheSingsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
                text: "She Sings",
              },
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            correctWordTwo: "She Sings",
            audio:
              getAssetAudioUrl(s3Assets.sheSingsAudio) || Assets.sheSingsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            correctWordTwo: "Dogs Bark",
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            correctWordTwo: "It Rains",
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
        },
      ],

      P1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            correctWordTwo: "The Sun Shines",
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            correctWordTwo: "Fish Swims",
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            correctWordTwo: "Birds Fly",
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
            ],
            correctWordTwo: "She Smiles",
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            correctWordTwo: "They Laugh",
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            correctWordTwo: "Dogs Bark",
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            correctWordTwo: "It Rains",
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            correctWordTwo: "You Swim",
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
              {
                img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
                text: "Fire Burns",
              },
            ],
            correctWordTwo: "I Sleep",
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
            ],
            correctWordTwo: "We Win",
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
        },
      ],

      P2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
                text: "He Dances",
              },
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "The Sun Shines",
              },
            ],
            correctWordTwo: "The Sun Shines",
            audio:
              getAssetAudioUrl(s3Assets.sunShinesAudio) ||
              Assets.sunShinesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
                text: "Fish Swims",
              },
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            correctWordTwo: "Fish Swims",
            audio:
              getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            correctWordTwo: "Birds Fly",
            audio:
              getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
                text: "She Smiles",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
            ],
            correctWordTwo: "She Smiles",
            audio:
              getAssetAudioUrl(s3Assets.sheSmilesAudio) ||
              Assets.sheSmilesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
              {
                img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
                text: "We Play",
              },
              {
                img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
                text: "They Laugh",
              },
            ],
            correctWordTwo: "They Laugh",
            audio:
              getAssetAudioUrl(s3Assets.theyLaughAudio) ||
              Assets.theyLaughAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            correctWordTwo: "Dogs Bark",
            audio:
              getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
                text: "It Rains",
              },
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            correctWordTwo: "It Rains",
            audio:
              getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            correctWordTwo: "You Swim",
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
              {
                img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
                text: "Fire Burns",
              },
            ],
            correctWordTwo: "I Sleep",
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
            ],
            correctWordTwo: "We Win",
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
        },
      ],

      L3: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
            ],
            correctWordTwo: "You Swim",
            audio:
              getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
              {
                img:
                  getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
                text: "Clocks Tick",
              },
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "Sun Shines",
              },
            ],
            correctWordTwo: "I Sleep",
            audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.heEatsAudio) || Assets.heEatsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
                text: "He Eats",
              },
            ],
            correctWordTwo: "He Eats",
            audio: getAssetAudioUrl(s3Assets.heEatsAudio) || Assets.heEatsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.sheReadsAudio) || Assets.sheReadsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            correctWordTwo: "She Reads",
            audio:
              getAssetAudioUrl(s3Assets.sheReadsAudio) || Assets.sheReadsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img:
                  getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
                text: "Clocks Tick",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.clocksTickAudio) ||
              Assets.clocksTickAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
                text: "She Sings",
              },
              {
                img:
                  getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
                text: "Clocks Tick",
              },
              {
                img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
                text: "I Sleep",
              },
            ],
            correctWordTwo: "Clocks Tick",
            audio:
              getAssetAudioUrl(s3Assets.clocksTickAudio) ||
              Assets.clocksTickAudio,
          },
        },
      ],

      L4: [
        {
          step1: {
            allwords: [
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.flowersBloomAudio) ||
              Assets.flowersBloomAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
              {
                img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
                text: "You Swim",
              },
              {
                img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
                text: "Fire Burns",
              },
            ],
            correctWordTwo: "Flowers Bloom",
            audio:
              getAssetAudioUrl(s3Assets.flowersBloomAudio) ||
              Assets.flowersBloomAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
                text: "Fire Burns",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.fireBurnsAudio) ||
              Assets.fireBurnsAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
                text: "Fire Burns",
              },
            ],
            correctWordTwo: "Fire Burns",
            audio:
              getAssetAudioUrl(s3Assets.fireBurnsAudio) ||
              Assets.fireBurnsAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.babyCriesAudio) ||
              Assets.babyCriesAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
                text: "Sun Shines",
              },
              {
                img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
                text: "Baby Cries",
              },
            ],
            correctWordTwo: "Baby Cries",
            audio:
              getAssetAudioUrl(s3Assets.babyCriesAudio) ||
              Assets.babyCriesAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
            ],
            audio:
              getAssetAudioUrl(s3Assets.youCookAudio) || Assets.youCookAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
                text: "Birds Fly",
              },
              {
                img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
                text: "You Cook",
              },
              {
                img:
                  getAssetUrl(s3Assets.flowersBloomImg) ||
                  Assets.flowersBloomImg,
                text: "Flowers Bloom",
              },
            ],
            correctWordTwo: "You Cook",
            audio:
              getAssetAudioUrl(s3Assets.youCookAudio) || Assets.youCookAudio,
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
                text: "We Win",
              },
              {
                img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
                text: "Dogs Bark",
              },
              {
                img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
                text: "She Reads",
              },
            ],
            correctWordTwo: "We Win",
            audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
          },
        },
      ],

      P4: [
        {
          step1: {
            allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
            audio: "openTextbookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "textbookImg", text: "Open Textbooks" },
              { img: "classroomImg", text: "Classroom" },
              { img: "teacherImg", text: "Teacher" },
            ],
            correctWordTwo: "Open Textbooks",
            audio: "openTextbookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "listenImg", text: "Listen Carefully" }],
            audio: "listenAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "listenImg", text: "Listen Carefully" },
              { img: "blackboardImg", text: "Blackboard" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Listen Carefully",
            audio: "listenAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
            audio: "raiseHandAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "raiseHandImg", text: "Raise Hand" },
              { img: "deskImg", text: "Desk" },
              { img: "studentImg", text: "Students" },
            ],
            correctWordTwo: "Raise Hand",
            audio: "raiseHandAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
            audio: "workPairAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "workPairImg", text: "Work in Pairs" },
              { img: "exerciseImg", text: "Exercise" },
              { img: "classroomImg", text: "Classroom" },
            ],
            correctWordTwo: "Work in Pairs",
            audio: "workPairAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "writeDateImg", text: "Write Date" }],
            audio: "writeDateAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "writeDateImg", text: "Write Date" },
              { img: "notebookImg", text: "Notebook" },
              { img: "penImg", text: "Pen" },
            ],
            correctWordTwo: "Write Date",
            audio: "writeDateAudio",
          },
        },
      ],

      P3: [
        {
          step1: {
            allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
            audio: "schoolCourtyardAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "schoolCourtyardImg", text: "School Courtyard" },
              { img: "busImg", text: "Bus" },
              { img: "lunchBoxImg", text: "Lunch Box" },
            ],
            correctWordTwo: "School Courtyard",
            audio: "schoolCourtyardAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "busImg", text: "Open Bus" }],
            audio: "busAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "ticketImg", text: "Ticket" },
              { img: "busImg", text: "Bus" },
              { img: "trainImg", text: "Train" },
            ],
            correctWordTwo: "Bus",
            audio: "busAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "airplaneImg", text: "Airplane" }],
            audio: "airplaneAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "airplaneImg", text: "Airplane" },
              { img: "boardingPassImg", text: "Boarding Pass" },
              { img: "trainStationImg", text: "Train Station" },
            ],
            correctWordTwo: "Airplane",
            audio: "airplaneAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "shoppingCartImg", text: "Shopping Cart" },
              { img: "discountTagImg", text: "Discount Tag" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "exitSignAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "hospitalImg", text: "Hospital" },
              { img: "exitSignImg", text: "Exit Sign" },
              { img: "ambulanceImg", text: "Ambulance" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "exitSignAudio",
          },
        },
      ],

      P7: [
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "fruitsImg", text: "Fruits" },
              { img: "vegetablesImg", text: "Vegetables" },
              { img: "discountTagImg", text: "Discount Tag" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
            audio: "grilledSalmonAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "salmonDishImg", text: "Grilled Salmon" },
              { img: "potatoesImg", text: "Mashed Potatoes" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Grilled Salmon",
            audio: "grilledSalmonAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "libraryClosingAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "libraryImg", text: "Library" },
              { img: "bookImg", text: "Book" },
              { img: "exitSignImg", text: "Exit Sign" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "libraryClosingAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "trainImg", text: "Train" }],
            audio: "trainArrivalAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "trainImg", text: "Train" },
              { img: "platformImg", text: "Platform" },
              { img: "ticketImg", text: "Ticket" },
            ],
            correctWordTwo: "Train",
            audio: "trainArrivalAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
            audio: "concertAnnouncementAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "audienceImg", text: "Audience" },
              { img: "concertStageImg", text: "Concert Stage" },
              { img: "TelephoneNewImg", text: "Mobile Phone" },
            ],
            correctWordTwo: "Concert Stage",
            audio: "concertAnnouncementAudio",
          },
        },
      ],

      P8: [
        {
          step1: {
            allwords: [
              { img: "underlineImg", text: "Underline Important Points" },
            ],
            audio: "underlineAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "underlineImg", text: "Underline Important Points" },
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Notebook",
            audio: "underlineAudio",
          },
        },
        {
          step1: {
            allwords: [
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            audio: "readInstructionsAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "pencilImg", text: "Question Paper" },
              { img: "penImg", text: "Pen" },
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            correctWordTwo: "Read Instructions Carefully",
            audio: "readInstructionsAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
            audio: "sitProperlyAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "deskImg", text: "Desk" },
              { img: "pillowImg", text: "Pillow" },
            ],
            correctWordTwo: "Sit Properly",
            audio: "sitProperlyAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
            audio: "noteBookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "penImg", text: "Pen" },
              { img: "notebookImg", text: "Take Out Notebooks" },
              { img: "textbookImg", text: "Textbook" },
            ],
            correctWordTwo: "Take Out Notebooks",
            audio: "noteBookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
            audio: "submitHomeworkAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "submitHomeworkImg", text: "Submit Homework" },
              { img: "bellImg", text: "Bell" },
              { img: "questionPaperImg", text: "Teacher’s Desk" },
            ],
            correctWordTwo: "Submit Homework",
            audio: "submitHomeworkAudio",
          },
        },
      ],
    },
    hi: {
      L1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.peechaakarnaM3Hin),
                text: "पीछा करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.peechakarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.pakadlenaaM3Hin),
                text: "पकड़ लेना",
              },
              {
                img: getAssetUrl(s3Assets.soochiitkarnaM3Hin),
                text: "सूचित करना",
              },
              {
                img: getAssetUrl(s3Assets.peechaakarnaM3Hin),
                text: "पीछा करना",
              },
            ],
            correctWordTwo: "पीछा करना",
            audio: getAssetAudioUrl(s3Assets.peechakarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.chotlagnaaM3Hin),
                text: "चोट लगना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.chotlagnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.chotlagnaaM3Hin),
                text: "चोट लगना",
              },
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वाजं करना",
              },
              {
                img: getAssetUrl(s3Assets.aananndkarnaM3Hin),
                text: "आनंद करना",
              },
            ],
            correctWordTwo: "चोट लगना",
            audio: getAssetAudioUrl(s3Assets.chotlagnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.paashucharanaM3Hin),
                text: "पशु चराना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.pashucharanaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.paashucharanaM3Hin),
                text: "पशु चराना",
              },
              {
                img: getAssetUrl(s3Assets.gaaramkarnaM3Hin),
                text: "गरम करना",
              },
              {
                img: getAssetUrl(s3Assets.baandkarnaM3Hin),
                text: "बांध करना",
              },
            ],
            correctWordTwo: "पशु चराना",
            audio: getAssetAudioUrl(s3Assets.pashucharanaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.paarichaykarnaM3Hin),
                text: "परिचय करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.parichaykarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.kanghiikarnaM3Hin),
                text: "कंघी करना",
              },
              {
                img: getAssetUrl(s3Assets.paarichaykarnaM3Hin),
                text: "परिचय करना",
              },
              {
                img: getAssetUrl(s3Assets.mootorgaadiM3Hin),
                text: "मोटर गाड़ी",
              },
            ],
            correctWordTwo: "परिचय करना",
            audio: getAssetAudioUrl(s3Assets.parichaykarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.gaoonkamandirM3Hin),
                text: "गाँव का मंदिर",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.gaonkamandirM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.gaoonkamandirM3Hin),
                text: "गाँव का मंदिर",
              },
              {
                img: getAssetUrl(s3Assets.khelkasamaayM3Hin),
                text: "खेल का समय",
              },
              {
                img: getAssetUrl(s3Assets.pakadlenaaM3Hin),
                text: "पकड़ लेना",
              },
            ],
            correctWordTwo: "गाँव का मंदिर",
            audio: getAssetAudioUrl(s3Assets.gaonkamandirM3Hin),
          },
        },
      ],

      L2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.pakadlenaaM3Hin),
                text: "पकड़ लेना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.pakadlenaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.peechaakarnaM3Hin),
                text: "पीछा करना",
              },
              {
                img: getAssetUrl(s3Assets.pakadlenaaM3Hin),
                text: "पकड़ लेना",
              },
              {
                img: getAssetUrl(s3Assets.soochiitkarnaM3Hin),
                text: "सूचित करना",
              },
            ],
            correctWordTwo: "पकड़ लेना",
            audio: getAssetAudioUrl(s3Assets.pakadlenaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.soochiitkarnaM3Hin),
                text: "सूचित करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.soochitkarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.soochiitkarnaM3Hin),
                text: "सूचित करना",
              },
              {
                img: getAssetUrl(s3Assets.bhaagleenaM3Hin),
                text: "भाग लेना",
              },
              {
                img: getAssetUrl(s3Assets.gaapshapM3Hin),
                text: "गपशप",
              },
            ],
            correctWordTwo: "सूचित करना",
            audio: getAssetAudioUrl(s3Assets.soochitkarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.gaapshapM3Hin),
                text: "गपशप",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.gapshapM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.meleekamajaM3Hin),
                text: "मेले का मजा",
              },
              {
                img: getAssetUrl(s3Assets.aananndkarnaM3Hin),
                text: "आनंद करना",
              },
              {
                img: getAssetUrl(s3Assets.gaapshapM3Hin),
                text: "गपशप",
              },
            ],
            correctWordTwo: "गपशप",
            audio: getAssetAudioUrl(s3Assets.gapshapM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वजन करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.vajankarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वजन करना",
              },
              {
                img: getAssetUrl(s3Assets.baandkarnaM3Hin),
                text: "बांध करना",
              },
              {
                img: getAssetUrl(s3Assets.kanghiikarnaM3Hin),
                text: "कंघी करना",
              },
            ],
            correctWordTwo: "वजन करना",
            audio: getAssetAudioUrl(s3Assets.vajankarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.aananndkarnaM3Hin),
                text: "आनंद करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.aanandkarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.aananndkarnaM3Hin),
                text: "आनंद करना",
              },
              {
                img: getAssetUrl(s3Assets.paashucharanaM3Hin),
                text: "पास हो जाना",
              },
              {
                img: getAssetUrl(s3Assets.heybhagwanM3Hin),
                text: "हे भगवान",
              },
            ],
            correctWordTwo: "आनंद करना",
            audio: getAssetAudioUrl(s3Assets.aanandkarnaM3Hin),
          },
        },
      ],

      L3: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.chalookhelenM3Hin),
                text: "चलो खेलें",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.chalokhelenM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.mootorgaadiM3Hin),
                text: "मोटर गाड़ी",
              },
              {
                img: getAssetUrl(s3Assets.chalookhelenM3Hin),
                text: "चलो खेलें",
              },
              {
                img: getAssetUrl(s3Assets.gaaramkarnaM3Hin),
                text: "गरम करना",
              },
            ],
            correctWordTwo: "चलो खेलें",
            audio: getAssetAudioUrl(s3Assets.chalokhelenM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.heybhagwanM3Hin),
                text: "हे भगवान",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.hebhagwanM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.bhaagleenaM3Hin),
                text: "भाग लेना",
              },
              {
                img: getAssetUrl(s3Assets.heybhagwanM3Hin),
                text: "हे भगवान",
              },
              {
                img: getAssetUrl(s3Assets.peechaakarnaM3Hin),
                text: "पीछा करना",
              },
            ],
            correctWordTwo: "हे भगवान",
            audio: getAssetAudioUrl(s3Assets.hebhagwanM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.mootorgaadiM3Hin),
                text: "मोटर गाड़ी",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.motorgaadiM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.meleekamajaM3Hin),
                text: "मेले का मजा",
              },
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वाजं करना",
              },
              {
                img: getAssetUrl(s3Assets.mootorgaadiM3Hin),
                text: "मोटर गाड़ी",
              },
            ],
            correctWordTwo: "मोटर गाड़ी",
            audio: getAssetAudioUrl(s3Assets.motorgaadiM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.gaaramkarnaM3Hin),
                text: "गरम करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.garamkarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.gaaramkarnaM3Hin),
                text: "गरम करना",
              },
              {
                img: getAssetUrl(s3Assets.khelkasamaayM3Hin),
                text: "खेल का समय",
              },
              {
                img: getAssetUrl(s3Assets.kanghiikarnaM3Hin),
                text: "कंघी करना",
              },
            ],
            correctWordTwo: "गरम करना",
            audio: getAssetAudioUrl(s3Assets.garamkarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.bhaagleenaM3Hin),
                text: "भाग लेना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.bhaaglenaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.gaapshapM3Hin),
                text: "गपशप",
              },
              {
                img: getAssetUrl(s3Assets.bhaagleenaM3Hin),
                text: "भाग लेना",
              },
              {
                img: getAssetUrl(s3Assets.heybhagwanM3Hin),
                text: "हे भगवान",
              },
            ],
            correctWordTwo: "भाग लेना",
            audio: getAssetAudioUrl(s3Assets.bhaaglenaM3Hin),
          },
        },
      ],

      L4: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.meleekamajaM3Hin),
                text: "मेले का मजा",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.melekamajaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.meleekamajaM3Hin),
                text: "मेले का मजा",
              },
              {
                img: getAssetUrl(s3Assets.chalookhelenM3Hin),
                text: "चलो खेलें",
              },
              {
                img: getAssetUrl(s3Assets.badibehaanM3Hin),
                text: "बड़ी बहन",
              },
            ],
            correctWordTwo: "मेले का मजा",
            audio: getAssetAudioUrl(s3Assets.melekamajaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.badibehaanM3Hin),
                text: "बड़ी बहन",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.badibehanM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.paashucharanaM3Hin),
                text: "पास हो जाना",
              },
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वाजं करना",
              },
              {
                img: getAssetUrl(s3Assets.badibehaanM3Hin),
                text: "बड़ी बहन",
              },
            ],
            correctWordTwo: "बड़ी बहन",
            audio: getAssetAudioUrl(s3Assets.badibehanM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.kanghiikarnaM3Hin),
                text: "कंघी करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.kanghikarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.baandkarnaM3Hin),
                text: "बांध करना",
              },
              {
                img: getAssetUrl(s3Assets.peechaakarnaM3Hin),
                text: "पीछा करना",
              },
              {
                img: getAssetUrl(s3Assets.kanghiikarnaM3Hin),
                text: "कंघी करना",
              },
            ],
            correctWordTwo: "कंघी करना",
            audio: getAssetAudioUrl(s3Assets.kanghikarnaM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.khelkasamaayM3Hin),
                text: "खेल का समय",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.khelkasamayM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.khelkasamaayM3Hin),
                text: "खेल का समय",
              },
              {
                img: getAssetUrl(s3Assets.paashucharanaM3Hin),
                text: "पास हो जाना",
              },
              {
                img: getAssetUrl(s3Assets.meleekamajaM3Hin),
                text: "मेले का मैदान",
              },
            ],
            correctWordTwo: "खेल का समय",
            audio: getAssetAudioUrl(s3Assets.khelkasamayM3Hin),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.baandkarnaM3Hin),
                text: "बंद करना",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.bandkarnaM3Hin),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.vaajankarnaM3Hin),
                text: "वाजं करना",
              },
              {
                img: getAssetUrl(s3Assets.baandkarnaM3Hin),
                text: "बंद करना",
              },
              {
                img: getAssetUrl(s3Assets.gaaramkarnaM3Hin),
                text: "गरम करना",
              },
            ],
            correctWordTwo: "बंद करना",
            audio: getAssetAudioUrl(s3Assets.bandkarnaM3Hin),
          },
        },
      ],

      P4: [
        {
          step1: {
            allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
            audio: "openTextbookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "textbookImg", text: "Open Textbooks" },
              { img: "classroomImg", text: "Classroom" },
              { img: "teacherImg", text: "Teacher" },
            ],
            correctWordTwo: "Open Textbooks",
            audio: "openTextbookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "listenImg", text: "Listen Carefully" }],
            audio: "listenAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "listenImg", text: "Listen Carefully" },
              { img: "blackboardImg", text: "Blackboard" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Listen Carefully",
            audio: "listenAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
            audio: "raiseHandAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "raiseHandImg", text: "Raise Hand" },
              { img: "deskImg", text: "Desk" },
              { img: "studentImg", text: "Students" },
            ],
            correctWordTwo: "Raise Hand",
            audio: "raiseHandAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
            audio: "workPairAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "workPairImg", text: "Work in Pairs" },
              { img: "exerciseImg", text: "Exercise" },
              { img: "classroomImg", text: "Classroom" },
            ],
            correctWordTwo: "Work in Pairs",
            audio: "workPairAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "writeDateImg", text: "Write Date" }],
            audio: "writeDateAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "writeDateImg", text: "Write Date" },
              { img: "notebookImg", text: "Notebook" },
              { img: "penImg", text: "Pen" },
            ],
            correctWordTwo: "Write Date",
            audio: "writeDateAudio",
          },
        },
      ],

      P3: [
        {
          step1: {
            allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
            audio: "schoolCourtyardAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "schoolCourtyardImg", text: "School Courtyard" },
              { img: "busImg", text: "Bus" },
              { img: "lunchBoxImg", text: "Lunch Box" },
            ],
            correctWordTwo: "School Courtyard",
            audio: "schoolCourtyardAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "busImg", text: "Open Bus" }],
            audio: "busAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "ticketImg", text: "Ticket" },
              { img: "busImg", text: "Bus" },
              { img: "trainImg", text: "Train" },
            ],
            correctWordTwo: "Bus",
            audio: "busAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "airplaneImg", text: "Airplane" }],
            audio: "airplaneAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "airplaneImg", text: "Airplane" },
              { img: "boardingPassImg", text: "Boarding Pass" },
              { img: "trainStationImg", text: "Train Station" },
            ],
            correctWordTwo: "Airplane",
            audio: "airplaneAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "shoppingCartImg", text: "Shopping Cart" },
              { img: "discountTagImg", text: "Discount Tag" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "exitSignAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "hospitalImg", text: "Hospital" },
              { img: "exitSignImg", text: "Exit Sign" },
              { img: "ambulanceImg", text: "Ambulance" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "exitSignAudio",
          },
        },
      ],

      P7: [
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "fruitsImg", text: "Fruits" },
              { img: "vegetablesImg", text: "Vegetables" },
              { img: "discountTagImg", text: "Discount Tag" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
            audio: "grilledSalmonAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "salmonDishImg", text: "Grilled Salmon" },
              { img: "potatoesImg", text: "Mashed Potatoes" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Grilled Salmon",
            audio: "grilledSalmonAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "libraryClosingAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "libraryImg", text: "Library" },
              { img: "bookImg", text: "Book" },
              { img: "exitSignImg", text: "Exit Sign" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "libraryClosingAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "trainImg", text: "Train" }],
            audio: "trainArrivalAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "trainImg", text: "Train" },
              { img: "platformImg", text: "Platform" },
              { img: "ticketImg", text: "Ticket" },
            ],
            correctWordTwo: "Train",
            audio: "trainArrivalAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
            audio: "concertAnnouncementAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "audienceImg", text: "Audience" },
              { img: "concertStageImg", text: "Concert Stage" },
              { img: "TelephoneNewImg", text: "Mobile Phone" },
            ],
            correctWordTwo: "Concert Stage",
            audio: "concertAnnouncementAudio",
          },
        },
      ],

      P8: [
        {
          step1: {
            allwords: [
              { img: "underlineImg", text: "Underline Important Points" },
            ],
            audio: "underlineAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "underlineImg", text: "Underline Important Points" },
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Notebook",
            audio: "underlineAudio",
          },
        },
        {
          step1: {
            allwords: [
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            audio: "readInstructionsAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "pencilImg", text: "Question Paper" },
              { img: "penImg", text: "Pen" },
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            correctWordTwo: "Read Instructions Carefully",
            audio: "readInstructionsAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
            audio: "sitProperlyAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "deskImg", text: "Desk" },
              { img: "pillowImg", text: "Pillow" },
            ],
            correctWordTwo: "Sit Properly",
            audio: "sitProperlyAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
            audio: "noteBookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "penImg", text: "Pen" },
              { img: "notebookImg", text: "Take Out Notebooks" },
              { img: "textbookImg", text: "Textbook" },
            ],
            correctWordTwo: "Take Out Notebooks",
            audio: "noteBookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
            audio: "submitHomeworkAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "submitHomeworkImg", text: "Submit Homework" },
              { img: "bellImg", text: "Bell" },
              { img: "questionPaperImg", text: "Teacher’s Desk" },
            ],
            correctWordTwo: "Submit Homework",
            audio: "submitHomeworkAudio",
          },
        },
      ],
    },
    ta: {
      L1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.turtleswimingintheriverM3Tam),
                text: "ஆற்றில் நீந்தும் ஆமை",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.turtleswimingintheriverM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.turtleswimingintheriverM3Tam),
                text: "ஆற்றில் நீந்தும் ஆமை",
              },
              {
                img: getAssetUrl(s3Assets.flowerfruitforestM3Tam),
                text: "மலர் பழம் வனம்",
              },
              {
                img: getAssetUrl(s3Assets.makegheericeM3Tam),
                text: "நெய் சோறு செய்",
              },
            ],
            correctWordTwo: "ஆற்றில் நீந்தும் ஆமை",
            audio: getAssetAudioUrl(s3Assets.turtleswimingintheriverM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.brothersphoneinhandM3Tam),
                text: "அண்ணன் கையில் அலைபேசி",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.brothersphoneinhandM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.holdwaterM3Tam),
                text: "தண்ணீர் பிடி",
              },
              {
                img: getAssetUrl(s3Assets.brothersphoneinhandM3Tam),
                text: "அண்ணன் கையில் அலைபேசி",
              },
              {
                img: getAssetUrl(s3Assets.eyesoilM3Tam),
                text: "கண் மண்",
              },
            ],
            correctWordTwo: "அண்ணன் கையில் அலைபேசி",
            audio: getAssetAudioUrl(s3Assets.brothersphoneinhandM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.letsplayontheswingM3Tam),
                text: "ஊஞ்சலிலே ஆடலாம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.letsplayontheswingM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.letsplayontheswingM3Tam),
                text: "ஊஞ்சலிலே ஆடலாம்",
              },
              {
                img: getAssetUrl(s3Assets.hepickedthefruitsM3Tam),
                text: "பழங்களைப் பறித்தான்",
              },
              {
                img: getAssetUrl(s3Assets.glassbowlM3Tam),
                text: "கண்ணாடி கிண்ணம்",
              },
            ],
            correctWordTwo: "ஊஞ்சலிலே ஆடலாம்",
            audio: getAssetAudioUrl(s3Assets.letsplayontheswingM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.hedrovefastM3Tam),
                text: "வேகமாக ஓட்டினார்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.hedrovefastM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.momcomehereM3Tam),
                text: "அம்மா இங்கே வா வா",
              },
              {
                img: getAssetUrl(s3Assets.hedrovefastM3Tam),
                text: "வேகமாக ஓட்டினார்",
              },
              {
                img: getAssetUrl(s3Assets.putriceontheleafM3Tam),
                text: "இலையில் சோறு போட்டு",
              },
            ],
            correctWordTwo: "வேகமாக ஓட்டினார்",
            audio: getAssetAudioUrl(s3Assets.hedrovefastM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.eatwithpleasureM3Tam),
                text: "மகிழ்வுடன் தின்றன",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.eatwithpleasureM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.steelswordM3Tam),
                text: "எஃகு வாள்",
              },
              {
                img: getAssetUrl(s3Assets.readingisagoodthingM3Tam),
                text: "ஓதும் செயலே நலமாம்",
              },
              {
                img: getAssetUrl(s3Assets.eatwithpleasureM3Tam),
                text: "மகிழ்வுடன் தின்றன",
              },
            ],
            correctWordTwo: "மகிழ்வுடன் தின்றன",
            audio: getAssetAudioUrl(s3Assets.eatwithpleasureM3TamAudio),
          },
        },
      ],

      L2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.flowerfruitforestM3Tam),
                text: "மலர் பழம் வனம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.flowerfruitforestM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.flowerfruitforestM3Tam),
                text: "மலர் பழம் வனம்",
              },
              {
                img: getAssetUrl(s3Assets.aboatstandingontheshoreM3Tam),
                text: "ஓரம் நிற்கும் ஓடம்",
              },
              {
                img: getAssetUrl(s3Assets.greenbeanM3Tam),
                text: "பச்சை நிற மொச்சை",
              },
            ],
            correctWordTwo: "மலர் பழம் வனம்",
            audio: getAssetAudioUrl(s3Assets.flowerfruitforestM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.letsrundanceandsingM3Tam),
                text: "ஓடி ஆடிப் பாடிடுவோம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.letsrundanceandsingM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.nothinghereM3Tam),
                text: "ஏதும் இங்கே இல்லை",
              },
              {
                img: getAssetUrl(s3Assets.letsrundanceandsingM3Tam),
                text: "ஓடி ஆடிப் பாடிடுவோம்",
              },
              {
                img: getAssetUrl(s3Assets.hedrovefastM3Tam),
                text: "வேகமாக ஓட்டினார்",
              },
            ],
            correctWordTwo: "ஓடி ஆடிப் பாடிடுவோம்",
            audio: getAssetAudioUrl(s3Assets.letsrundanceandsingM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.putriceontheleafM3Tam),
                text: "இலையில் சோறு போட்டு",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.putriceontheleafM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.makegheericeM3Tam),
                text: "நெய் சோறு செய்",
              },
              {
                img: getAssetUrl(s3Assets.momcomehereM3Tam),
                text: "அம்மா இங்கே வா வா",
              },
              {
                img: getAssetUrl(s3Assets.putriceontheleafM3Tam),
                text: "இலையில் சோறு போட்டு",
              },
            ],
            correctWordTwo: "இலையில் சோறு போட்டு",
            audio: getAssetAudioUrl(s3Assets.putriceontheleafM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.eyesoilM3Tam),
                text: "கண் மண்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.eyesoilM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.eyesoilM3Tam),
                text: "கண் மண்",
              },
              {
                img: getAssetUrl(s3Assets.hepickedthefruitsM3Tam),
                text: "பழங்களைப் பறித்தான்",
              },
              {
                img: getAssetUrl(s3Assets.readingisagoodthingM3Tam),
                text: "ஓதும் செயலே நலமாம்",
              },
            ],
            correctWordTwo: "கண் மண்",
            audio: getAssetAudioUrl(s3Assets.eyesoilM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.nothinghereM3Tam),
                text: "ஏதும் இங்கே இல்லை",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.nothinghereM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.nothinghereM3Tam),
                text: "ஏதும் இங்கே இல்லை",
              },
              {
                img: getAssetUrl(s3Assets.holdwaterM3Tam),
                text: "தண்ணீர் பிடி",
              },
              {
                img: getAssetUrl(s3Assets.steelswordM3Tam),
                text: "எஃகு வாள்",
              },
            ],
            correctWordTwo: "ஏதும் இங்கே இல்லை",
            audio: getAssetAudioUrl(s3Assets.nothinghereM3TamAudio),
          },
        },
      ],
      L3: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.makegheericeM3Tam),
                text: "நெய் சோறு செய்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.makegheericeM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.makegheericeM3Tam),
                text: "நெய் சோறு செய்",
              },
              {
                img: getAssetUrl(s3Assets.glassbowlM3Tam),
                text: "கண்ணாடி கிண்ணம்",
              },
              {
                img: getAssetUrl(s3Assets.aboatstandingontheshoreM3Tam),
                text: "ஓரம் நிற்கும் ஓடம்",
              },
            ],
            correctWordTwo: "நெய் சோறு செய்",
            audio: getAssetAudioUrl(s3Assets.makegheericeM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.momcomehereM3Tam),
                text: "அம்மா இங்கே வா வா",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.momcomehereM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.letsrundanceandsingM3Tam),
                text: "ஓடி ஆடிப் பாடிடுவோம்",
              },
              {
                img: getAssetUrl(s3Assets.greenbeanM3Tam),
                text: "பச்சை நிற மொச்சை",
              },
              {
                img: getAssetUrl(s3Assets.momcomehereM3Tam),
                text: "அம்மா இங்கே வா வா",
              },
            ],
            correctWordTwo: "அம்மா இங்கே வா வா",
            audio: getAssetAudioUrl(s3Assets.momcomehereM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.readingisagoodthingM3Tam),
                text: "ஓதும் செயலே நலமாம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.readingisagoodthingM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.turtleswimingintheriverM3Tam),
                text: "ஆற்றில் நீந்தும் ஆமை",
              },
              {
                img: getAssetUrl(s3Assets.readingisagoodthingM3Tam),
                text: "ஓதும் செயலே நலமாம்",
              },
              {
                img: getAssetUrl(s3Assets.eatwithpleasureM3Tam),
                text: "மகிழ்வுடன் தின்றன",
              },
            ],
            correctWordTwo: "ஓதும் செயலே நலமாம்",
            audio: getAssetAudioUrl(s3Assets.readingisagoodthingM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.aboatstandingontheshoreM3Tam),
                text: "ஓரம் நிற்கும் ஓடம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.aboatstandingontheshoreM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.brothersphoneinhandM3Tam),
                text: "அண்ணன் கையில் அலைபேசி",
              },
              {
                img: getAssetUrl(s3Assets.aboatstandingontheshoreM3Tam),
                text: "ஓரம் நிற்கும் ஓடம்",
              },
              {
                img: getAssetUrl(s3Assets.letsplayontheswingM3Tam),
                text: "ஊஞ்சலிலே ஆடலாம்",
              },
            ],
            correctWordTwo: "ஓரம் நிற்கும் ஓடம்",
            audio: getAssetAudioUrl(s3Assets.aboatstandingontheshoreM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.hepickedthefruitsM3Tam),
                text: "பழங்களைப் பறித்தான்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.hepickedthefruitsM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.hepickedthefruitsM3Tam),
                text: "பழங்களைப் பறித்தான்",
              },
              {
                img: getAssetUrl(s3Assets.flowerfruitforestM3Tam),
                text: "மலர் பழம் வனம்",
              },
              {
                img: getAssetUrl(s3Assets.nothinghereM3Tam),
                text: "ஏதும் இங்கே இல்லை",
              },
            ],
            correctWordTwo: "பழங்களைப் பறித்தான்",
            audio: getAssetAudioUrl(s3Assets.hepickedthefruitsM3TamAudio),
          },
        },
      ],

      L4: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.greenbeanM3Tam),
                text: "பச்சை நிற மொச்சை",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.greenbeanM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.hedrovefastM3Tam),
                text: "வேகமாக ஓட்டினார்",
              },
              {
                img: getAssetUrl(s3Assets.greenbeanM3Tam),
                text: "பச்சை நிற மொச்சை",
              },
              {
                img: getAssetUrl(s3Assets.eyesoilM3Tam),
                text: "கண் மண்",
              },
            ],
            correctWordTwo: "பச்சை நிற மொச்சை",
            audio: getAssetAudioUrl(s3Assets.greenbeanM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.steelswordM3Tam),
                text: "எஃகு வாள்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.steelswordM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.steelswordM3Tam),
                text: "எஃகு வாள்",
              },
              {
                img: getAssetUrl(s3Assets.putriceontheleafM3Tam),
                text: "இலையில் சோறு போட்டு",
              },
              {
                img: getAssetUrl(s3Assets.momcomehereM3Tam),
                text: "அம்மா இங்கே வா வா",
              },
            ],
            correctWordTwo: "எஃகு வாள்",
            audio: getAssetAudioUrl(s3Assets.steelswordM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.holdwaterM3Tam),
                text: "தண்ணீர் பிடி",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.holdwaterM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.readingisagoodthingM3Tam),
                text: "ஓதும் செயலே நலமாம்",
              },
              {
                img: getAssetUrl(s3Assets.makegheericeM3Tam),
                text: "நெய் சோறு செய்",
              },
              {
                img: getAssetUrl(s3Assets.holdwaterM3Tam),
                text: "தண்ணீர் பிடி",
              },
            ],
            correctWordTwo: "தண்ணீர் பிடி",
            audio: getAssetAudioUrl(s3Assets.holdwaterM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.glassbowlM3Tam),
                text: "கண்ணாடி கிண்ணம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.glassbowlM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.glassbowlM3Tam),
                text: "கண்ணாடி கிண்ணம்",
              },
              {
                img: getAssetUrl(s3Assets.turtleswimingintheriverM3Tam),
                text: "ஆற்றில் நீந்தும் ஆமை",
              },
              {
                img: getAssetUrl(s3Assets.hepickedthefruitsM3Tam),
                text: "பழங்களைப் பறித்தான்",
              },
            ],
            correctWordTwo: "கண்ணாடி கிண்ணம்",
            audio: getAssetAudioUrl(s3Assets.glassbowlM3TamAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.letsplayontheswingM3Tam),
                text: "ஊஞ்சலிலே ஆடலாம்",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.letsplayontheswingM3TamAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.letsplayontheswingM3Tam),
                text: "ஊஞ்சலிலே ஆடலாம்",
              },
              {
                img: getAssetUrl(s3Assets.eatwithpleasureM3Tam),
                text: "மகிழ்வுடன் தின்றன",
              },
              {
                img: getAssetUrl(s3Assets.flowerfruitforestM3Tam),
                text: "மலர் பழம் வனம்",
              },
            ],
            correctWordTwo: "ஊஞ்சலிலே ஆடலாம்",
            audio: getAssetAudioUrl(s3Assets.letsplayontheswingM3TamAudio),
          },
        },
      ],

      P4: [
        {
          step1: {
            allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
            audio: "openTextbookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "textbookImg", text: "Open Textbooks" },
              { img: "classroomImg", text: "Classroom" },
              { img: "teacherImg", text: "Teacher" },
            ],
            correctWordTwo: "Open Textbooks",
            audio: "openTextbookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "listenImg", text: "Listen Carefully" }],
            audio: "listenAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "listenImg", text: "Listen Carefully" },
              { img: "blackboardImg", text: "Blackboard" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Listen Carefully",
            audio: "listenAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
            audio: "raiseHandAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "raiseHandImg", text: "Raise Hand" },
              { img: "deskImg", text: "Desk" },
              { img: "studentImg", text: "Students" },
            ],
            correctWordTwo: "Raise Hand",
            audio: "raiseHandAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
            audio: "workPairAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "workPairImg", text: "Work in Pairs" },
              { img: "exerciseImg", text: "Exercise" },
              { img: "classroomImg", text: "Classroom" },
            ],
            correctWordTwo: "Work in Pairs",
            audio: "workPairAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "writeDateImg", text: "Write Date" }],
            audio: "writeDateAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "writeDateImg", text: "Write Date" },
              { img: "notebookImg", text: "Notebook" },
              { img: "penImg", text: "Pen" },
            ],
            correctWordTwo: "Write Date",
            audio: "writeDateAudio",
          },
        },
      ],

      P3: [
        {
          step1: {
            allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
            audio: "schoolCourtyardAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "schoolCourtyardImg", text: "School Courtyard" },
              { img: "busImg", text: "Bus" },
              { img: "lunchBoxImg", text: "Lunch Box" },
            ],
            correctWordTwo: "School Courtyard",
            audio: "schoolCourtyardAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "busImg", text: "Open Bus" }],
            audio: "busAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "ticketImg", text: "Ticket" },
              { img: "busImg", text: "Bus" },
              { img: "trainImg", text: "Train" },
            ],
            correctWordTwo: "Bus",
            audio: "busAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "airplaneImg", text: "Airplane" }],
            audio: "airplaneAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "airplaneImg", text: "Airplane" },
              { img: "boardingPassImg", text: "Boarding Pass" },
              { img: "trainStationImg", text: "Train Station" },
            ],
            correctWordTwo: "Airplane",
            audio: "airplaneAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "shoppingCartImg", text: "Shopping Cart" },
              { img: "discountTagImg", text: "Discount Tag" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "exitSignAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "hospitalImg", text: "Hospital" },
              { img: "exitSignImg", text: "Exit Sign" },
              { img: "ambulanceImg", text: "Ambulance" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "exitSignAudio",
          },
        },
      ],

      P7: [
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "fruitsImg", text: "Fruits" },
              { img: "vegetablesImg", text: "Vegetables" },
              { img: "discountTagImg", text: "Discount Tag" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
            audio: "grilledSalmonAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "salmonDishImg", text: "Grilled Salmon" },
              { img: "potatoesImg", text: "Mashed Potatoes" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Grilled Salmon",
            audio: "grilledSalmonAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "libraryClosingAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "libraryImg", text: "Library" },
              { img: "bookImg", text: "Book" },
              { img: "exitSignImg", text: "Exit Sign" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "libraryClosingAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "trainImg", text: "Train" }],
            audio: "trainArrivalAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "trainImg", text: "Train" },
              { img: "platformImg", text: "Platform" },
              { img: "ticketImg", text: "Ticket" },
            ],
            correctWordTwo: "Train",
            audio: "trainArrivalAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
            audio: "concertAnnouncementAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "audienceImg", text: "Audience" },
              { img: "concertStageImg", text: "Concert Stage" },
              { img: "TelephoneNewImg", text: "Mobile Phone" },
            ],
            correctWordTwo: "Concert Stage",
            audio: "concertAnnouncementAudio",
          },
        },
      ],

      P8: [
        {
          step1: {
            allwords: [
              { img: "underlineImg", text: "Underline Important Points" },
            ],
            audio: "underlineAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "underlineImg", text: "Underline Important Points" },
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Notebook",
            audio: "underlineAudio",
          },
        },
        {
          step1: {
            allwords: [
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            audio: "readInstructionsAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "pencilImg", text: "Question Paper" },
              { img: "penImg", text: "Pen" },
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            correctWordTwo: "Read Instructions Carefully",
            audio: "readInstructionsAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
            audio: "sitProperlyAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "deskImg", text: "Desk" },
              { img: "pillowImg", text: "Pillow" },
            ],
            correctWordTwo: "Sit Properly",
            audio: "sitProperlyAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
            audio: "noteBookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "penImg", text: "Pen" },
              { img: "notebookImg", text: "Take Out Notebooks" },
              { img: "textbookImg", text: "Textbook" },
            ],
            correctWordTwo: "Take Out Notebooks",
            audio: "noteBookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
            audio: "submitHomeworkAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "submitHomeworkImg", text: "Submit Homework" },
              { img: "bellImg", text: "Bell" },
              { img: "questionPaperImg", text: "Teacher’s Desk" },
            ],
            correctWordTwo: "Submit Homework",
            audio: "submitHomeworkAudio",
          },
        },
      ],
    },
    kn: {
      L1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.sunriseM3Kan),
                text: "ರವಿ ಮೂಡಿದ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.sunriseM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.friendstalkingM3Kan),
                text: "ಗೆಳೆಯರ ಮಾತುಕತೆ",
              },
              {
                img: getAssetUrl(s3Assets.thisisudayahomeM3Kan),
                text: "ಉದಯನ ಮನೆ",
              },
              {
                img: getAssetUrl(s3Assets.sunriseM3Kan),
                text: "ರವಿ ಮೂಡಿದ",
              },
            ],
            correctWordTwo: "ರವಿ ಮೂಡಿದ",
            audio: getAssetAudioUrl(s3Assets.sunriseM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.mangotreeM3Kan),
                text: "ಮಾವಿನ ಮರ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.mangoTreeM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.mangotreeM3Kan),
                text: "ಮಾವಿನ ಮರ",
              },
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
              {
                img: getAssetUrl(s3Assets.closethewindowM3Kan),
                text: "ಕಿಟಕಿ ಹಾಕು",
              },
            ],
            correctWordTwo: "ಮಾವಿನ ಮರ",
            audio: getAssetAudioUrl(s3Assets.mangoTreeM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.elephantstailM3Kan),
                text: "ಆನೆಯ ಬಾಲ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.elephantsTailM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.beautifulnecklaceM3Kan),
                text: "ಅಂದದ ಸರ",
              },
              {
                img: getAssetUrl(s3Assets.elephantstailM3Kan),
                text: "ಆನೆಯ ಬಾಲ",
              },
              {
                img: getAssetUrl(s3Assets.khokhogameM3Kan),
                text: "ಖೋ ಖೋ ಆಟ",
              },
            ],
            correctWordTwo: "ಆನೆಯ ಬಾಲ",
            audio: getAssetAudioUrl(s3Assets.elephantsTailM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.marigoldflowerM3Kan),
                text: "ಚೆಂಡು ಹೂ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.marigoldFlowerM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.twogoatsM3Kan),
                text: "ಎರಡು ಆಡುಗಳು",
              },
              {
                img: getAssetUrl(s3Assets.fillthewaterM3Kan),
                text: "ನೀರು ತುಂಬು",
              },
              {
                img: getAssetUrl(s3Assets.marigoldflowerM3Kan),
                text: "ಚೆಂಡು ಹೂ",
              },
            ],
            correctWordTwo: "ಚೆಂಡು ಹೂ",
            audio: getAssetAudioUrl(s3Assets.marigoldFlowerM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.treesinthewoodM3Kan),
                text: "ಕಾಡಿನ ಮರಗಳು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.treesInTheWoodM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.theglasscupM3Kan),
                text: "ಗಾಜಿನ ಲೋಟ",
              },
              {
                img: getAssetUrl(s3Assets.treesinthewoodM3Kan),
                text: "ಕಾಡಿನ ಮರಗಳು",
              },
              {
                img: getAssetUrl(s3Assets.friendstalkingM3Kan),
                text: "ಗೆಳೆಯರ ಮಾತುಕತೆ",
              },
            ],
            correctWordTwo: "ಕಾಡಿನ ಮರಗಳು",
            audio: getAssetAudioUrl(s3Assets.treesInTheWoodM3KanAudio),
          },
        },
      ],

      L2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.friendstalkingM3Kan),
                text: "ಗೆಳೆಯರ ಮಾತುಕತೆ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.friendsTalkingM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.friendstalkingM3Kan),
                text: "ಗೆಳೆಯರ ಮಾತುಕತೆ",
              },
              {
                img: getAssetUrl(s3Assets.sunriseM3Kan),
                text: "ರವಿ ಮೂಡಿದ",
              },
              {
                img: getAssetUrl(s3Assets.thisisudayahomeM3Kan),
                text: "ಉದಯನ ಮನೆ",
              },
            ],
            correctWordTwo: "ಗೆಳೆಯರ ಮಾತುಕತೆ",
            audio: getAssetAudioUrl(s3Assets.friendsTalkingM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.thisisudayahomeM3Kan),
                text: "ಉದಯನ ಮನೆ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.thisIsUdaysHomeM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.thisisudayahomeM3Kan),
                text: "ಉದಯನ ಮನೆ",
              },
              {
                img: getAssetUrl(s3Assets.thatisatempleM3Kan),
                text: "ಅದು ಗುಡಿ",
              },
              {
                img: getAssetUrl(s3Assets.listentothesongM3Kan),
                text: "ಹಾಡು ಕೇಳು",
              },
            ],
            correctWordTwo: "ಉದಯನ ಮನೆ",
            audio: getAssetAudioUrl(s3Assets.thisIsUdaysHomeM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.listentothesongM3Kan),
                text: "ಹಾಡು ಕೇಳು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.listenToTheSongM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.listentothesongM3Kan),
                text: "ಹಾಡು ಕೇಳು",
              },
              {
                img: getAssetUrl(s3Assets.moonraisedM3Kan),
                text: "ಚಂದಿರ ಬಂದ",
              },
              {
                img: getAssetUrl(s3Assets.closethewindowM3Kan),
                text: "ಕಿಟಕಿ ಹಾಕು",
              },
            ],
            correctWordTwo: "ಹಾಡು ಕೇಳು",
            audio: getAssetAudioUrl(s3Assets.listenToTheSongM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.indiaCountryM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.khokhogameM3Kan),
                text: "ಖೋ ಖೋ ಆಟ",
              },
              {
                img: getAssetUrl(s3Assets.twogoatsM3Kan),
                text: "ಎರಡು ಆಡುಗಳು",
              },
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
            ],
            correctWordTwo: "ಭಾರತ ದೇಶ",
            audio: getAssetAudioUrl(s3Assets.indiaCountryM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.closethewindowM3Kan),
                text: "ಕಿಟಕಿ ಹಾಕು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.closeTheWindowM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.elephantstailM3Kan),
                text: "ಆನೆಯ ಬಾಲ",
              },
              {
                img: getAssetUrl(s3Assets.closethewindowM3Kan),
                text: "ಕಿಟಕಿ ಹಾಕು",
              },
              {
                img: getAssetUrl(s3Assets.crispyvadaM3Kan),
                text: "ಗರಿಗರಿ ವಡೆ",
              },
            ],
            correctWordTwo: "ಕಿಟಕಿ ಹಾಕು",
            audio: getAssetAudioUrl(s3Assets.closeTheWindowM3KanAudio),
          },
        },
      ],

      L3: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.therousterHenM3Kan),
                text: "ಕೋಳಿ ಕೂಗಿತು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.rousterhen),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.therousterHenM3Kan),
                text: "ಕೋಳಿ ಕೂಗಿತು",
              },
              {
                img: getAssetUrl(s3Assets.fillthewaterM3Kan),
                text: "ನೀರು ತುಂಬು",
              },
              {
                img: getAssetUrl(s3Assets.beautifulnecklaceM3Kan),
                text: "ಅಂದದ ಸರ",
              },
            ],
            correctWordTwo: "ಕೋಳಿ ಕೂಗಿತು",
            audio: getAssetAudioUrl(s3Assets.rousterhen),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.crispyvadaM3Kan),
                text: "ಗರಿಗರಿ ವಡೆ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.crispyVadaM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.crispyvadaM3Kan),
                text: "ಗರಿಗರಿ ವಡೆ",
              },
              {
                img: getAssetUrl(s3Assets.thatisatempleM3Kan),
                text: "ಅದು ಗುಡಿ",
              },
              {
                img: getAssetUrl(s3Assets.sunriseM3Kan),
                text: "ರವಿ ಮೂಡಿದ",
              },
            ],
            correctWordTwo: "ಗರಿಗರಿ ವಡೆ",
            audio: getAssetAudioUrl(s3Assets.crispyVadaM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.fillthewaterM3Kan),
                text: "ನೀರು ತುಂಬು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.fillTheWaterM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.fillthewaterM3Kan),
                text: "ನೀರು ತುಂಬು",
              },
              {
                img: getAssetUrl(s3Assets.moonraisedM3Kan),
                text: "ಚಂದಿರ ಬಂದ",
              },
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
            ],
            correctWordTwo: "ನೀರು ತುಂಬು",
            audio: getAssetAudioUrl(s3Assets.fillTheWaterM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.beautifulnecklaceM3Kan),
                text: "ಅಂದದ ಸರ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.AndadaSaraBeautifulNecklace),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.theglasscupM3Kan),
                text: "ಗಾಜಿನ ಲೋಟ",
              },
              {
                img: getAssetUrl(s3Assets.beautifulnecklaceM3Kan),
                text: "ಅಂದದ ಸರ",
              },
              {
                img: getAssetUrl(s3Assets.twogoatsM3Kan),
                text: "ಎರಡು ಆಡುಗಳು",
              },
            ],
            correctWordTwo: "ಅಂದದ ಸರ",
            audio: getAssetAudioUrl(s3Assets.NecklaceinBingosheetKan),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.thatisatempleM3Kan),
                text: "ಅದು ಗುಡಿ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.thatIsATempleM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.listentothesongM3Kan),
                text: "ಹಾಡು ಕೇಳು",
              },
              {
                img: getAssetUrl(s3Assets.crispyvadaM3Kan),
                text: "ಗರಿಗರಿ ವಡೆ",
              },
              {
                img: getAssetUrl(s3Assets.thatisatempleM3Kan),
                text: "ಅದು ಗುಡಿ",
              },
            ],
            correctWordTwo: "ಅದು ಗುಡಿ",
            audio: getAssetAudioUrl(s3Assets.thatIsATempleM3KanAudio),
          },
        },
      ],
      L4: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.moonraisedM3Kan),
                text: "ಚಂದಿರ ಬಂದ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.moonRaisedM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.fillthewaterM3Kan),
                text: "ನೀರು ತುಂಬು",
              },
              {
                img: getAssetUrl(s3Assets.thisisamosqueM3Kan),
                text: "ಇದು ಮಸೀದಿ",
              },
              {
                img: getAssetUrl(s3Assets.moonraisedM3Kan),
                text: "ಚಂದಿರ ಬಂದ",
              },
            ],
            correctWordTwo: "ಚಂದಿರ ಬಂದ",
            audio: getAssetAudioUrl(s3Assets.moonRaisedM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.thisisamosqueM3Kan),
                text: "ಇದು ಮಸೀದಿ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.thisIsMosqueM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.elephantstailM3Kan),
                text: "ಆನೆಯ ಬಾಲ",
              },
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
              {
                img: getAssetUrl(s3Assets.thisisamosqueM3Kan),
                text: "ಇದು ಮಸೀದಿ",
              },
            ],
            correctWordTwo: "ಇದು ಮಸೀದಿ",
            audio: getAssetAudioUrl(s3Assets.thisIsMosqueM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.twogoatsM3Kan),
                text: "ಎರಡು ಆಡುಗಳು",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.twoGoatsM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.khokhogameM3Kan),
                text: "ಖೋ ಖೋ ಆಟ",
              },
              {
                img: getAssetUrl(s3Assets.twogoatsM3Kan),
                text: "ಎರಡು ಆಡುಗಳು",
              },
              {
                img: getAssetUrl(s3Assets.sunriseM3Kan),
                text: "ರವಿ ಮೂಡಿದ",
              },
            ],
            correctWordTwo: "ಎರಡು ಆಡುಗಳು",
            audio: getAssetAudioUrl(s3Assets.twoGoatsM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.theglasscupM3Kan),
                text: "ಗಾಜಿನ ಲೋಟ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.theGlassCupM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.theglasscupM3Kan),
                text: "ಗಾಜಿನ ಲೋಟ",
              },
              {
                img: getAssetUrl(s3Assets.elephantstailM3Kan),
                text: "ಆನೆಯ ಬಾಲ",
              },
              {
                img: getAssetUrl(s3Assets.moonraisedM3Kan),
                text: "ಚಂದಿರ ಬಂದ",
              },
            ],
            correctWordTwo: "ಗಾಜಿನ ಲೋಟ",
            audio: getAssetAudioUrl(s3Assets.theGlassCupM3KanAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.khokhogameM3Kan),
                text: "ಖೋ ಖೋ ಆಟ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.khoKhoGameM3KanAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.khokhogameM3Kan),
                text: "ಖೋ ಖೋ ಆಟ",
              },
              {
                img: getAssetUrl(s3Assets.indiacountryM3Kan),
                text: "ಭಾರತ ದೇಶ",
              },
              {
                img: getAssetUrl(s3Assets.beautifulnecklaceM3Kan),
                text: "ಅಂದದ ಸರ",
              },
            ],
            correctWordTwo: "ಖೋ ಖೋ ಆಟ",
            audio: getAssetAudioUrl(s3Assets.khoKhoGameM3KanAudio),
          },
        },
      ],
      P4: [
        {
          step1: {
            allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
            audio: "openTextbookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "textbookImg", text: "Open Textbooks" },
              { img: "classroomImg", text: "Classroom" },
              { img: "teacherImg", text: "Teacher" },
            ],
            correctWordTwo: "Open Textbooks",
            audio: "openTextbookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "listenImg", text: "Listen Carefully" }],
            audio: "listenAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "listenImg", text: "Listen Carefully" },
              { img: "blackboardImg", text: "Blackboard" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Listen Carefully",
            audio: "listenAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
            audio: "raiseHandAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "raiseHandImg", text: "Raise Hand" },
              { img: "deskImg", text: "Desk" },
              { img: "studentImg", text: "Students" },
            ],
            correctWordTwo: "Raise Hand",
            audio: "raiseHandAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
            audio: "workPairAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "workPairImg", text: "Work in Pairs" },
              { img: "exerciseImg", text: "Exercise" },
              { img: "classroomImg", text: "Classroom" },
            ],
            correctWordTwo: "Work in Pairs",
            audio: "workPairAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "writeDateImg", text: "Write Date" }],
            audio: "writeDateAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "writeDateImg", text: "Write Date" },
              { img: "notebookImg", text: "Notebook" },
              { img: "penImg", text: "Pen" },
            ],
            correctWordTwo: "Write Date",
            audio: "writeDateAudio",
          },
        },
      ],

      P3: [
        {
          step1: {
            allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
            audio: "schoolCourtyardAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "schoolCourtyardImg", text: "School Courtyard" },
              { img: "busImg", text: "Bus" },
              { img: "lunchBoxImg", text: "Lunch Box" },
            ],
            correctWordTwo: "School Courtyard",
            audio: "schoolCourtyardAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "busImg", text: "Open Bus" }],
            audio: "busAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "ticketImg", text: "Ticket" },
              { img: "busImg", text: "Bus" },
              { img: "trainImg", text: "Train" },
            ],
            correctWordTwo: "Bus",
            audio: "busAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "airplaneImg", text: "Airplane" }],
            audio: "airplaneAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "airplaneImg", text: "Airplane" },
              { img: "boardingPassImg", text: "Boarding Pass" },
              { img: "trainStationImg", text: "Train Station" },
            ],
            correctWordTwo: "Airplane",
            audio: "airplaneAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "shoppingCartImg", text: "Shopping Cart" },
              { img: "discountTagImg", text: "Discount Tag" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "exitSignAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "hospitalImg", text: "Hospital" },
              { img: "exitSignImg", text: "Exit Sign" },
              { img: "ambulanceImg", text: "Ambulance" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "exitSignAudio",
          },
        },
      ],

      P7: [
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "fruitsImg", text: "Fruits" },
              { img: "vegetablesImg", text: "Vegetables" },
              { img: "discountTagImg", text: "Discount Tag" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
            audio: "grilledSalmonAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "salmonDishImg", text: "Grilled Salmon" },
              { img: "potatoesImg", text: "Mashed Potatoes" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Grilled Salmon",
            audio: "grilledSalmonAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "libraryClosingAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "libraryImg", text: "Library" },
              { img: "bookImg", text: "Book" },
              { img: "exitSignImg", text: "Exit Sign" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "libraryClosingAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "trainImg", text: "Train" }],
            audio: "trainArrivalAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "trainImg", text: "Train" },
              { img: "platformImg", text: "Platform" },
              { img: "ticketImg", text: "Ticket" },
            ],
            correctWordTwo: "Train",
            audio: "trainArrivalAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
            audio: "concertAnnouncementAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "audienceImg", text: "Audience" },
              { img: "concertStageImg", text: "Concert Stage" },
              { img: "TelephoneNewImg", text: "Mobile Phone" },
            ],
            correctWordTwo: "Concert Stage",
            audio: "concertAnnouncementAudio",
          },
        },
      ],

      P8: [
        {
          step1: {
            allwords: [
              { img: "underlineImg", text: "Underline Important Points" },
            ],
            audio: "underlineAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "underlineImg", text: "Underline Important Points" },
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Notebook",
            audio: "underlineAudio",
          },
        },
        {
          step1: {
            allwords: [
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            audio: "readInstructionsAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "pencilImg", text: "Question Paper" },
              { img: "penImg", text: "Pen" },
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            correctWordTwo: "Read Instructions Carefully",
            audio: "readInstructionsAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
            audio: "sitProperlyAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "deskImg", text: "Desk" },
              { img: "pillowImg", text: "Pillow" },
            ],
            correctWordTwo: "Sit Properly",
            audio: "sitProperlyAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
            audio: "noteBookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "penImg", text: "Pen" },
              { img: "notebookImg", text: "Take Out Notebooks" },
              { img: "textbookImg", text: "Textbook" },
            ],
            correctWordTwo: "Take Out Notebooks",
            audio: "noteBookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
            audio: "submitHomeworkAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "submitHomeworkImg", text: "Submit Homework" },
              { img: "bellImg", text: "Bell" },
              { img: "questionPaperImg", text: "Teacher’s Desk" },
            ],
            correctWordTwo: "Submit Homework",
            audio: "submitHomeworkAudio",
          },
        },
      ],
    },
    te: {
      L1: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.aantM3Tel),
                text: "ఒక చీమ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.aantM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.stubbornrockM3Tel),
                text: "మొండి బండ",
              },
              {
                img: getAssetUrl(s3Assets.aantM3Tel),
                text: "ఒక చీమ",
              },
              {
                img: getAssetUrl(s3Assets.stripespalateM3Tel),
                text: "గీతల అంగి",
              },
            ],
            correctWordTwo: "ఒక చీమ",
            audio: getAssetAudioUrl(s3Assets.aantM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.peacockfeatherM3Tel),
                text: "నెమలి ఈక",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.peacockfeatherM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.peacockfeatherM3Tel),
                text: "నెమలి ఈక",
              },
              {
                img: getAssetUrl(s3Assets.babyplayedM3Tel),
                text: " పాప ఆడింది",
              },
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
            ],
            correctWordTwo: "నెమలి ఈక",
            audio: getAssetAudioUrl(s3Assets.peacockfeatherM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.diamondringM3Tel),
                text: "రతనాల ఉంగరం",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.diamondringM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.chilipowderM3Tel),
                text: " మిరప పొడి",
              },
              {
                img: getAssetUrl(s3Assets.thisismosqueM3Tel),
                text: "ఇది మసీదు",
              },
              {
                img: getAssetUrl(s3Assets.diamondringM3Tel),
                text: "రతనాల ఉంగరం",
              },
            ],
            correctWordTwo: "రతనాల ఉంగరం",
            audio: getAssetAudioUrl(s3Assets.diamondringM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.elephanttailM3Tel),
                text: "ఏనుగు తోక",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.elephanttailM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.dearjumpedM3Tel),
                text: "జింక దూకింది",
              },
              {
                img: getAssetUrl(s3Assets.elephanttailM3Tel),
                text: "ఏనుగు తోక",
              },
              {
                img: getAssetUrl(s3Assets.withbrickswallM3Tel),
                text: "ఇటుకలతో గోడ",
              },
            ],
            correctWordTwo: " ఏనుగు తోక",
            audio: getAssetAudioUrl(s3Assets.elephanttailM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.mustacheuncleM3Tel),
                text: " మీసాల మామ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.mustacheuncleM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.lionroarsM3Tel),
                text: " సింహం గర్జించింది",
              },
              {
                img: getAssetUrl(s3Assets.mustacheuncleM3Tel),
                text: "మీసాల మామ",
              },
              {
                img: getAssetUrl(s3Assets.birdsflyingM3Tel),
                text: "పక్షులు ఎగురుతున్నాయి",
              },
            ],
            correctWordTwo: " మీసాల మామ",
            audio: getAssetAudioUrl(s3Assets.mustacheuncleM3TelAudio),
          },
        },
      ],
      L2: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.thisismosqueM3Tel),
                text: "ఇది మసీదు",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.thisismosqueM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.withbrickswallM3Tel),
                text: "ఇటుకలతో గోడ",
              },
              {
                img: getAssetUrl(s3Assets.lionroarsM3Tel),
                text: "సింహం గర్జించింది",
              },
              {
                img: getAssetUrl(s3Assets.thisismosqueM3Tel),
                text: "ఇది మసీదు",
              },
            ],
            correctWordTwo: "ఇది మసీదు",
            audio: getAssetAudioUrl(s3Assets.thisismosqueM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.dentistM3Tel),
                text: "దంతవైద్యుడు",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.dentistM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.intheskytherearestarsM3Tel),
                text: "ఆకాశంలో నక్షత్రాలున్నాయి",
              },
              {
                img: getAssetUrl(s3Assets.tothegametablaM3Tel),
                text: "ఆటకు తబల",
              },
              {
                img: getAssetUrl(s3Assets.dentistM3Tel),
                text: "దంతవైద్యుడు",
              },
            ],
            correctWordTwo: "దంతవైద్యుడు",
            audio: getAssetAudioUrl(s3Assets.dentistM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.birdsflyingM3Tel),
                text: "పక్షులు ఎగురుతున్నాయి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.birdsflyingM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.birdsflyingM3Tel),
                text: "పక్షులు ఎగురుతున్నాయి",
              },
              {
                img: getAssetUrl(s3Assets.mustacheuncleM3Tel),
                text: "మీసాల మామ",
              },
              {
                img: getAssetUrl(s3Assets.elephanttailM3Tel),
                text: "ఏనుగు తోక",
              },
            ],
            correctWordTwo: "పక్షులు ఎగురుతున్నాయి",
            audio: getAssetAudioUrl(s3Assets.birdsflyingM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.stripespalateM3Tel),
                text: "గీతల అంగి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.stripespalateM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.stripespalateM3Tel),
                text: "గీతల అంగి",
              },
              {
                img: getAssetUrl(s3Assets.stubbornrockM3Tel),
                text: "మొండి బండ",
              },
              {
                img: getAssetUrl(s3Assets.aantM3Tel),
                text: "ఒక చీమ",
              },
            ],
            correctWordTwo: "గీతల అంగి",
            audio: getAssetAudioUrl(s3Assets.stripespalateM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.songlistenM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.babyplayedM3Tel),
                text: "పాప ఆడింది",
              },
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
              {
                img: getAssetUrl(s3Assets.peacockfeatherM3Tel),
                text: "నెమలి ఈక",
              },
            ],
            correctWordTwo: "పాట వినండి",
            audio: getAssetAudioUrl(s3Assets.songlistenM3TelAudio),
          },
        },
      ],
      L3: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.twogoatsM3Tel),
                text: "రెండు మేకలు",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.twogoatsM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.thisearthwormM3Tel),
                text: "ఇది వానపాము",
              },
              {
                img: getAssetUrl(s3Assets.birdsflyingM3Tel),
                text: "పక్షులు ఎగురుతున్నాయి",
              },
              {
                img: getAssetUrl(s3Assets.twogoatsM3Tel),
                text: "రెండు మేకలు",
              },
            ],
            correctWordTwo: "రెండు మేకలు",
            audio: getAssetAudioUrl(s3Assets.twogoatsM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.chilipowderM3Tel),
                text: "మిరప పొడి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.chilipowderM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.chilipowderM3Tel),
                text: "మిరప పొడి",
              },
              {
                img: getAssetUrl(s3Assets.stubbornrockM3Tel),
                text: "మొండి బండ",
              },
              {
                img: getAssetUrl(s3Assets.stripespalateM3Tel),
                text: "గీతల అంగి",
              },
            ],
            correctWordTwo: "మిరప పొడి",
            audio: getAssetAudioUrl(s3Assets.chilipowderM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.babyplayedM3Tel),
                text: "పాప ఆడింది",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.babyplayedM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
              {
                img: getAssetUrl(s3Assets.dearjumpedM3Tel),
                text: "జింక దూకింది",
              },
              {
                img: getAssetUrl(s3Assets.babyplayedM3Tel),
                text: "పాప ఆడింది",
              },
            ],
            correctWordTwo: "పాప ఆడింది",
            audio: getAssetAudioUrl(s3Assets.babyplayedM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.intheskytherearestarsM3Tel),
                text: "ఆకాశంలో నక్షత్రాలున్నాయి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.intheskytherearestarsM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.intheskytherearestarsM3Tel),
                text: "ఆకాశంలో నక్షత్రాలున్నాయి",
              },
              {
                img: getAssetUrl(s3Assets.tothegametablaM3Tel),
                text: "ఆటకు తబల",
              },
              {
                img: getAssetUrl(s3Assets.dentistM3Tel),
                text: "దంతవైద్యుడు",
              },
            ],
            correctWordTwo: "ఆకాశంలో నక్షత్రాలున్నాయి",
            audio: getAssetAudioUrl(s3Assets.intheskytherearestarsM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.lionroarsM3Tel),
                text: "సింహం గర్జించింది",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.lionroarsM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.mustacheuncleM3Tel),
                text: "మీసాల మామ",
              },
              {
                img: getAssetUrl(s3Assets.lionroarsM3Tel),
                text: "సింహం గర్జించింది",
              },
              {
                img: getAssetUrl(s3Assets.elephanttailM3Tel),
                text: "ఏనుగు తోక",
              },
            ],
            correctWordTwo: "సింహం గర్జించింది",
            audio: getAssetAudioUrl(s3Assets.lionroarsM3TelAudio),
          },
        },
      ],
      L4: [
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.thisearthwormM3Tel),
                text: "ఇది వానపాము",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.thisearthwormM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.thisearthwormM3Tel),
                text: "ఇది వానపాము",
              },
              {
                img: getAssetUrl(s3Assets.twogoatsM3Tel),
                text: "రెండు మేకలు",
              },
              {
                img: getAssetUrl(s3Assets.aantM3Tel),
                text: "ఒక చీమ",
              },
            ],
            correctWordTwo: "ఇది వానపాము",
            audio: getAssetAudioUrl(s3Assets.thisearthwormM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.songlistenM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.peacockfeatherM3Tel),
                text: "నెమలి ఈక",
              },
              {
                img: getAssetUrl(s3Assets.diamondringM3Tel),
                text: "రతనాల ఉంగరం",
              },
              {
                img: getAssetUrl(s3Assets.songlistenM3Tel),
                text: "పాట వినండి",
              },
            ],
            correctWordTwo: "పాట వినండి",
            audio: getAssetAudioUrl(s3Assets.songlistenM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.tothegametablaM3Tel),
                text: "ఆటకు తబల",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.tothegametablaM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.intheskytherearestarsM3Tel),
                text: "ఆకాశంలో నక్షత్రాలున్నాయి",
              },
              {
                img: getAssetUrl(s3Assets.tothegametablaM3Tel),
                text: "ఆటకు తబల",
              },
              {
                img: getAssetUrl(s3Assets.withbrickswallM3Tel),
                text: "ఇటుకలతో గోడ",
              },
            ],
            correctWordTwo: "ఆటకు తబల",
            audio: getAssetAudioUrl(s3Assets.tothegametablaM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.withbrickswallM3Tel),
                text: "ఇటుకలతో గోడ",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.withbrickswallM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.thisismosqueM3Tel),
                text: "ఇది మసీదు",
              },
              {
                img: getAssetUrl(s3Assets.withbrickswallM3Tel),
                text: "ఇటుకలతో గోడ",
              },
              {
                img: getAssetUrl(s3Assets.dearjumpedM3Tel),
                text: "జింక దూకింది",
              },
            ],
            correctWordTwo: "ఇటుకలతో గోడ",
            audio: getAssetAudioUrl(s3Assets.withbrickswallM3TelAudio),
          },
        },
        {
          step1: {
            allwords: [
              {
                img: getAssetUrl(s3Assets.dearjumpedM3Tel),
                text: "జింక దూకింది",
              },
            ],
            audio: getAssetAudioUrl(s3Assets.dearjumpedM3TelAudio),
          },
          step2: {
            allwordsTwo: [
              {
                img: getAssetUrl(s3Assets.dearjumpedM3Tel),
                text: "జింక దూకింది",
              },
              {
                img: getAssetUrl(s3Assets.elephanttailM3Tel),
                text: "ఏనుగు తోక",
              },
              {
                img: getAssetUrl(s3Assets.mustacheuncleM3Tel),
                text: "మీసాల మామ",
              },
            ],
            correctWordTwo: "జింక దూకింది",
            audio: getAssetAudioUrl(s3Assets.dearjumpedM3TelAudio),
          },
        },
      ],

      P4: [
        {
          step1: {
            allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
            audio: "openTextbookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "textbookImg", text: "Open Textbooks" },
              { img: "classroomImg", text: "Classroom" },
              { img: "teacherImg", text: "Teacher" },
            ],
            correctWordTwo: "Open Textbooks",
            audio: "openTextbookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "listenImg", text: "Listen Carefully" }],
            audio: "listenAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "listenImg", text: "Listen Carefully" },
              { img: "blackboardImg", text: "Blackboard" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Listen Carefully",
            audio: "listenAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
            audio: "raiseHandAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "raiseHandImg", text: "Raise Hand" },
              { img: "deskImg", text: "Desk" },
              { img: "studentImg", text: "Students" },
            ],
            correctWordTwo: "Raise Hand",
            audio: "raiseHandAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
            audio: "workPairAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "workPairImg", text: "Work in Pairs" },
              { img: "exerciseImg", text: "Exercise" },
              { img: "classroomImg", text: "Classroom" },
            ],
            correctWordTwo: "Work in Pairs",
            audio: "workPairAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "writeDateImg", text: "Write Date" }],
            audio: "writeDateAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "writeDateImg", text: "Write Date" },
              { img: "notebookImg", text: "Notebook" },
              { img: "penImg", text: "Pen" },
            ],
            correctWordTwo: "Write Date",
            audio: "writeDateAudio",
          },
        },
      ],

      P3: [
        {
          step1: {
            allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
            audio: "schoolCourtyardAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "schoolCourtyardImg", text: "School Courtyard" },
              { img: "busImg", text: "Bus" },
              { img: "lunchBoxImg", text: "Lunch Box" },
            ],
            correctWordTwo: "School Courtyard",
            audio: "schoolCourtyardAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "busImg", text: "Open Bus" }],
            audio: "busAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "ticketImg", text: "Ticket" },
              { img: "busImg", text: "Bus" },
              { img: "trainImg", text: "Train" },
            ],
            correctWordTwo: "Bus",
            audio: "busAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "airplaneImg", text: "Airplane" }],
            audio: "airplaneAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "airplaneImg", text: "Airplane" },
              { img: "boardingPassImg", text: "Boarding Pass" },
              { img: "trainStationImg", text: "Train Station" },
            ],
            correctWordTwo: "Airplane",
            audio: "airplaneAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "shoppingCartImg", text: "Shopping Cart" },
              { img: "discountTagImg", text: "Discount Tag" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "exitSignAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "hospitalImg", text: "Hospital" },
              { img: "exitSignImg", text: "Exit Sign" },
              { img: "ambulanceImg", text: "Ambulance" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "exitSignAudio",
          },
        },
      ],

      P7: [
        {
          step1: {
            allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
            audio: "discountTagAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "fruitsImg", text: "Fruits" },
              { img: "vegetablesImg", text: "Vegetables" },
              { img: "discountTagImg", text: "Discount Tag" },
            ],
            correctWordTwo: "Discount Tag",
            audio: "discountTagAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
            audio: "grilledSalmonAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "salmonDishImg", text: "Grilled Salmon" },
              { img: "potatoesImg", text: "Mashed Potatoes" },
              { img: "restaurantImg", text: "Restaurant" },
            ],
            correctWordTwo: "Grilled Salmon",
            audio: "grilledSalmonAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
            audio: "libraryClosingAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "libraryImg", text: "Library" },
              { img: "bookImg", text: "Book" },
              { img: "exitSignImg", text: "Exit Sign" },
            ],
            correctWordTwo: "Exit Sign",
            audio: "libraryClosingAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "trainImg", text: "Train" }],
            audio: "trainArrivalAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "trainImg", text: "Train" },
              { img: "platformImg", text: "Platform" },
              { img: "ticketImg", text: "Ticket" },
            ],
            correctWordTwo: "Train",
            audio: "trainArrivalAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
            audio: "concertAnnouncementAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "audienceImg", text: "Audience" },
              { img: "concertStageImg", text: "Concert Stage" },
              { img: "TelephoneNewImg", text: "Mobile Phone" },
            ],
            correctWordTwo: "Concert Stage",
            audio: "concertAnnouncementAudio",
          },
        },
      ],

      P8: [
        {
          step1: {
            allwords: [
              { img: "underlineImg", text: "Underline Important Points" },
            ],
            audio: "underlineAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "underlineImg", text: "Underline Important Points" },
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "notebookImg", text: "Notebook" },
            ],
            correctWordTwo: "Notebook",
            audio: "underlineAudio",
          },
        },
        {
          step1: {
            allwords: [
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            audio: "readInstructionsAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "pencilImg", text: "Question Paper" },
              { img: "penImg", text: "Pen" },
              {
                img: "readInstructionsImg",
                text: "Read Instructions Carefully",
              },
            ],
            correctWordTwo: "Read Instructions Carefully",
            audio: "readInstructionsAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
            audio: "sitProperlyAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "sitProperlyImg", text: "Sit Properly" },
              { img: "deskImg", text: "Desk" },
              { img: "pillowImg", text: "Pillow" },
            ],
            correctWordTwo: "Sit Properly",
            audio: "sitProperlyAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
            audio: "noteBookAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "penImg", text: "Pen" },
              { img: "notebookImg", text: "Take Out Notebooks" },
              { img: "textbookImg", text: "Textbook" },
            ],
            correctWordTwo: "Take Out Notebooks",
            audio: "noteBookAudio",
          },
        },
        {
          step1: {
            allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
            audio: "submitHomeworkAudio",
          },
          step2: {
            allwordsTwo: [
              { img: "submitHomeworkImg", text: "Submit Homework" },
              { img: "bellImg", text: "Bell" },
              { img: "questionPaperImg", text: "Teacher’s Desk" },
            ],
            correctWordTwo: "Submit Homework",
            audio: "submitHomeworkAudio",
          },
        },
      ],
    },
  };

  const content = levelContent[language];

  //const levelData = content?.[currentLevel][currentWordIndex][currentSteps];
  let levelData;

  // First try to use API data (levelDataRaw)
  if (currentSteps === "step1") {
    levelData = levelDataRaw?.step1;
  } else {
    levelData = levelDataRaw?.step2;
  }

  // Fallback to hardcoded content if API data is not available
  if (
    !levelData ||
    (currentSteps === "step1" && !levelData?.allwords) ||
    (currentSteps === "step2" && !levelData?.allwordsTwo)
  ) {
    const hardcodedContent = content?.[currentLevel]?.[currentWordIndex];
    if (hardcodedContent) {
      if (currentSteps === "step1") {
        levelData = hardcodedContent.step1;
      } else {
        levelData = hardcodedContent.step2;
      }
    } else {
      console.error("PhrasesInAction - No hardcoded content found for:", {
        currentLevel,
        currentWordIndex,
        availableKeys: Object.keys(content || {}),
        contentForLevel: content?.[currentLevel]
          ? `exists with ${content[currentLevel].length} items`
          : "does not exist",
      });
    }
  }

  let audioElement = new Audio(levelData?.audio);

  useEffect(() => {
    //setStartGame(true);
    setCurrentSteps(getInitialStep(currentLevel, level));
    setCurrentWordIndex(0);
    setSelectedDiv(null); // Reset selection
    setIncorrectWords([]); // Clear incorrect words
    setIsCorrectImageSelected(false); // Reset selection status
    setIsMatched(false); // Reset matching status
    setTextColor("#1a1a1a"); // Reset text color
    setIsAnswerIncorrect(false); // Reset incorrect answer flag
    setIsRecording(false); // Reset recording
    setIsRecordingStopped(false); // Reset recording stop state
    setIsRecording2(false); // Reset second recording state
    setIsRecordingStopped2(false); // Reset second recording stop state
    setSelectedDiv2(null);
  }, [currentLevel]);

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);
    //console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      currentSteps === "step1"
        ? levelData?.allwords[0]?.text
        : levelData?.correctWordTwo,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      currentSteps === "step1"
        ? levelData?.allwords[0]?.text
        : levelData?.correctWordTwo,
      apiLevel
    );
  };

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      startAudioRecording();
      setIsRecordingStopped(false);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setIsRecording(false);
      stopAudioRecording();
      setIsRecordingStopped(true);
    }
  };

  const playAudio = () => {
    audioElement.play();
    setIsAudioPlaying(true);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    audioElement.pause();
    setIsAudioPlaying(false);
    setIsPaused(true);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playRecordedAudio = () => {
    if (!recordedBlob) {
      return;
    }

    // Stop any currently playing recorded audio
    if (recordedAudioInstance) {
      recordedAudioInstance.pause();
      recordedAudioInstance.currentTime = 0;
    }

    const audioUrl = URL.createObjectURL(recordedBlob);
    const audio = new Audio(audioUrl);
    setRecordedAudioInstance(audio);
    setIsPlayingRecordedAudio(true);

    audio.play().catch((error) => {
      console.error("Error playing recorded audio:", error);
      setIsPlayingRecordedAudio(false);
    });

    audio.onended = () => {
      setIsPlayingRecordedAudio(false);
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = () => {
      setIsPlayingRecordedAudio(false);
      URL.revokeObjectURL(audioUrl);
    };
  };

  const stopRecordedAudio = () => {
    if (recordedAudioInstance) {
      recordedAudioInstance.pause();
      recordedAudioInstance.currentTime = 0;
      setIsPlayingRecordedAudio(false);
    }
  };

  const goToNextStep = () => {
    if (currentWordIndex < levelContent["length"] - 1) {
      callTelemetry();
      handleNext();
      //setCurrentSteps(getInitialStep(currentLevel));
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedDiv(null); // Reset selection
      setIncorrectWords([]); // Clear incorrect words
      setIsCorrectImageSelected(false); // Reset selection status
      setIsMatched(false); // Reset matching status
      setTextColor("#1a1a1a"); // Reset text color
      setIsAnswerIncorrect(false); // Reset incorrect answer flag
      setIsRecording(false); // Reset recording
      setIsRecordingStopped(false); // Reset recording stop state
      setIsRecording2(false); // Reset second recording state
      setIsRecordingStopped2(false); // Reset second recording stop state
      setSelectedDiv2(null);
    } else {
      // Last item completed - check if this is a showcase step (S1 or S2)
      callTelemetry();

      // Get current practice step info to determine if it's a showcase
      let practiceProgress = getLocalData("practiceProgress");
      if (typeof practiceProgress === "string") {
        practiceProgress = JSON.parse(practiceProgress);
      }
      const currentPracticeStep = practiceProgress?.currentPracticeStep;
      const stepTitle = practiceSteps?.[currentPracticeStep]?.title;
      const isShowcaseStep = stepTitle === "S1" || stepTitle === "S2";

      // Only pass isGameOver=true for showcase steps (S1/S2)
      // For regular steps (L1, P1, L2, etc.), just call handleNext() to continue to next step
      if (isShowcaseStep) {
        handleNext(true); // Pass true to indicate showcase completion
      } else {
        handleNext(); // Regular step completion - just continue to next step
      }

      setSelectedDiv(null); // Reset selection
      setIncorrectWords([]); // Clear incorrect words
      setIsCorrectImageSelected(false); // Reset selection status
      setIsMatched(false); // Reset matching status
      setTextColor("#1a1a1a"); // Reset text color
      setIsAnswerIncorrect(false); // Reset incorrect answer flag
      setIsRecording(false); // Reset recording
      setIsRecordingStopped(false); // Reset recording stop state
      setIsRecording2(false); // Reset second recording state
      setIsRecordingStopped2(false); // Reset second recording stop state
      setSelectedDiv2(null);
    }
  };

  const [isRecording2, setIsRecording2] = useState(false);
  const [selectedDiv2, setSelectedDiv2] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [textColor, setTextColor] = useState("#1a1a1a");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isRecordingStopped2, setIsRecordingStopped2] = useState(false);
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  const [recordedAudioInstance, setRecordedAudioInstance] = useState(null);

  const handleMicClick2 = () => {
    if (!isRecording2) {
      setIsRecording2(true);
      startAudioRecording();
      setIsRecordingStopped2(false);
    } else {
      setIsRecording2(false);
      stopAudioRecording();
      setIsRecordingStopped2(true);
    }
  };

  const handleDivClick = (divText) => {
    if (divText === levelData?.correctWordTwo) {
      setSelectedDiv(divText);
      setIsMatched(false);
      const audio = new Audio(correctSound);
      audio.play();

      setTimeout(() => {
        setIsMatched(true);
        setTextColor("#333F61");
        setIsCorrectImageSelected(true);

        if (currentLevelIndex < content[currentLevel].length - 1) {
          setCurrentLevelIndex(currentLevelIndex + 1);
        } else {
          // goToNextStep();
        }
      }, 1000);
    } else {
      const tempSelectedDiv = selectedDiv;
      setSelectedDiv(divText);
      const audio = new Audio(wrongSound);
      audio.play();

      setTimeout(() => {
        setSelectedDiv(tempSelectedDiv);
      }, 1000);
    }
  };

  const playAudio2 = () => {
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    } else {
      const audioElement = new Audio(
        level === 3
          ? levelData?.audio
          : getAssetAudioUrl(s3Assets[levelData?.audio]) ||
            Assets[levelData?.audio]
      );
      audioElement.play();
      setAudioInstance(audioElement);
      setIsPlaying(true);
      audioElement.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  // Step 3
  const [selectedWords, setSelectedWords] = useState([]);
  const [shuffledWords] = useState(
    currentSteps === "step3"
      ? [...levelData?.allsentence].sort(() => Math.random() - 0.5)
      : []
  );
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording3, setIsRecording3] = useState(false);
  const [isRecordingStopped3, setIsRecordingStopped3] = useState(false);

  useEffect(() => {
    if (
      currentSteps === "step3" &&
      selectedWords.length === levelData?.allsentence.length
    ) {
      const userSentence = selectedWords.join(" ");
      if (userSentence === levelData?.allwordsthree[0].correctSentence) {
        setIsCorrect(true);
        setIsAnswerIncorrect(false);
        setIncorrectWords([]);
      } else {
        setIsCorrect(false);
        setIsAnswerIncorrect(true);
        const incorrect = selectedWords.filter(
          (word, index) => word !== levelData?.allsentence[index]
        );
        setIncorrectWords(incorrect);
        setTimeout(() => {
          setIncorrectWords([]);
          setSelectedWords([]);
          setIsAnswerIncorrect(false);
        }, 2000);
      }
    }
  }, [selectedWords]);

  const handleWordClick = (word) => {
    if (
      currentSteps === "step3" &&
      selectedWords.length < levelData?.allsentence.length
    ) {
      setSelectedWords((prevSelectedWords) => {
        if (!prevSelectedWords.includes(word)) {
          return [...prevSelectedWords, word];
        }
        return prevSelectedWords;
      });
    }
  };

  const handleMicClick3 = () => {
    if (isRecording3) {
      setIsRecordingStopped3(true);
    }
    setIsRecording3((prev) => !prev);
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      lang={language}
      //={recAudio}
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
            width: "100%",
            height: "65vh",
            backgroundColor: "#eae6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0px",
          }}
        >
          {/* Hint Icon */}
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
                  src={`https://www.youtube.com/embed/JvVsqNiWnE4?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "8px" }}
                ></iframe>
              </div>
            </div>
          )}
          <div
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #d9d2fc",
              padding: "50px 0px",
            }}
          >
            {/* <img
            src={levelImg}
            alt="Level"
            style={{
              position: "absolute",
              top: isMobile ? "14px" : "36px",
              left: "65px",
              width: isMobile ? "180px" : "220px",

              height: "auto",
            }}
          /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {currentSteps === "step1" && (
                <>
                  {!isRecordingStopped && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#1a1a1a",
                        letterSpacing: "3px",
                        position: "relative",
                        marginBottom: "-5px",
                      }}
                    >
                      <span style={{ margin: "0 10px" }}>
                        {levelData?.allwords[0]?.text}
                      </span>
                      {isPlaying ? (
                        <Box
                          sx={{
                            marginTop: "7px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: { xs: "50px", sm: "60px", md: "70px" },
                            cursor: "pointer",
                          }}
                          onClick={playAudio2}
                        >
                          <StopButton height={45} width={45} />
                        </Box>
                      ) : (
                        <Box
                          //className="walkthrough-step-1"
                          sx={{
                            marginTop: "7px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: { xs: "50px", sm: "60px", md: "70px" },
                            cursor: "pointer",
                            //cursor: `url(${clapImage}) 32 24, auto`,
                          }}
                          onClick={playAudio2}
                        >
                          <ListenButton height={50} width={50} />
                        </Box>
                      )}
                    </div>
                  )}

                  {isRecordingStopped && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={Assets.tickImg}
                          alt="Tick"
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            color: "#1a1a1a",
                            letterSpacing: "3px",
                          }}
                        >
                          {levelData?.allwords[0]?.text}
                        </p>
                        {/* Show multilingual box only for English on step1 */}
                        {language === "en" && (
                          <AudioTooltipModal
                            audioSrc={
                              multilingual?.[multilingualLangCode]?.audio_url
                            }
                            description={levelData?.allwords[0]?.text}
                          >
                            <Box
                              sx={{
                                marginLeft: "10px",
                                display: "flex",
                                marginTop: "5px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "2px solid #FF7F36",
                                borderRadius: "16px",
                                gap: "10px",
                                padding: "15px",
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
                                    fontSize: "40px",
                                    fontWeight: "400",
                                    color: "#333F61",
                                    fontStyle: "Quicksand",
                                  }}
                                >
                                  {nativeLangSymbol}
                                </span>
                              </Box>

                              <ListenButton height={50} width={50} />
                            </Box>
                          </AudioTooltipModal>
                        )}
                      </div>
                      {/* Listen to recorded audio button - step1, 2nd page, for all languages except English */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "20px",
                          marginTop: "30px",
                        }}
                      >
                        {language !== "en" && recordedBlob && (
                          <div
                            onClick={
                              isPlayingRecordedAudio
                                ? stopRecordedAudio
                                : playRecordedAudio
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {isPlayingRecordedAudio ? (
                              <StopButton height={50} width={50} />
                            ) : (
                              <ListenButton height={50} width={50} />
                            )}
                          </div>
                        )}
                        <div
                          onClick={goToNextStep}
                          style={{ cursor: "pointer" }}
                        >
                          <NextButtonRound height={50} width={50} />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isRecordingStopped && !isPaused && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        margin: "20px 0",
                      }}
                    >
                      {levelData?.allwords && levelData.allwords.length > 0 ? (
                        levelData.allwords.map((item) => (
                          <div
                            key={item.text}
                            style={{
                              width: "180px",
                              height: "190px",
                              border: "1px solid #000",
                              margin: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              flexDirection: "column",
                              marginBottom: "30px",
                            }}
                            onClick={() => setSelectedDiv(item.text)}
                          >
                            <img
                              src={
                                level === 3
                                  ? item.img
                                  : getAssetUrl(s3Assets[item.img]) ||
                                    Assets[item.img]
                              }
                              alt={item.text}
                              style={{
                                width: "180px",
                                height: "200px",
                                objectFit: "contain",
                                border: "1px solid #00000033",
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#666",
                          }}
                        >
                          <p style={{ fontSize: "20px", marginBottom: "10px" }}>
                            ⚠️ No content available
                          </p>
                          <p style={{ fontSize: "14px" }}>
                            Debug: currentLevel={currentLevel}, currentSteps=
                            {currentSteps}, currentWordIndex={currentWordIndex}
                          </p>
                          <p style={{ fontSize: "14px" }}>
                            hasLevelData={String(!!levelData)}, hasAllwords=
                            {String(!!levelData?.allwords)}, allwordsLength=
                            {levelData?.allwords?.length || 0}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {isRecording && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <Box
                          style={{ marginTop: "-45px", marginBottom: "55px" }}
                        >
                          <RecordVoiceVisualizer />
                        </Box>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "-18px",
                          }}
                          onClick={handleMicClick}
                        >
                          <img
                            src={Assets.pause}
                            alt="Stop Recording"
                            style={{ width: "45px", height: "45px" }}
                          />
                        </button>
                      </div>
                    )}

                    {!isRecording && !isRecordingStopped && (
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "0px",
                        }}
                        onClick={handleMicClick}
                      >
                        <img
                          src={Assets.mic}
                          alt="Start Recording"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </button>
                    )}
                  </div>
                </>
              )}

              {currentSteps === "step2" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {!isRecordingStopped2 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: isMobile
                            ? "24px"
                            : isTablet
                            ? "30px"
                            : "30px",
                          fontWeight: "bold",
                          color: "#1a1a1a",
                          letterSpacing: "3px",
                          position: "relative",
                          marginBottom: "5px",
                        }}
                      >
                        <span style={{ margin: "0 10px", color: textColor }}>
                          {levelData?.correctWordTwo}
                        </span>
                        {isPlaying ? (
                          <Box
                            sx={{
                              marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: "pointer",
                            }}
                            onClick={playAudio2}
                          >
                            <StopButton height={45} width={45} />
                          </Box>
                        ) : (
                          <Box
                            //className="walkthrough-step-1"
                            sx={{
                              marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: "pointer",
                              //cursor: `url(${clapImage}) 32 24, auto`,
                            }}
                            onClick={playAudio2}
                          >
                            <ListenButton height={50} width={50} />
                          </Box>
                        )}
                      </div>

                      {isMatched ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            margin: "20px 0",
                          }}
                        >
                          <div
                            style={{
                              width: isMobile
                                ? "110px"
                                : isTablet
                                ? "150px"
                                : "200px",
                              height: isMobile
                                ? "170px"
                                : isTablet
                                ? "200px"
                                : "190px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              flexDirection: "column",
                              background: "none",
                              border: "none",
                            }}
                          >
                            <img
                              src={
                                level === 3
                                  ? levelData?.allwordsTwo.find(
                                      (item) =>
                                        item.text === levelData?.correctWordTwo
                                    ).img
                                  : getAssetUrl(
                                      s3Assets[
                                        levelData?.allwordsTwo.find(
                                          (item) =>
                                            item.text ===
                                            levelData?.correctWordTwo
                                        ).img
                                      ]
                                    ) ||
                                    Assets[
                                      levelData?.allwordsTwo.find(
                                        (item) =>
                                          item.text ===
                                          levelData?.correctWordTwo
                                      ).img
                                    ]
                              }
                              alt={levelData?.correctWordTwo}
                              style={{
                                width: isMobile
                                  ? "110px"
                                  : isTablet
                                  ? "150px"
                                  : "200px",
                                height: isMobile
                                  ? "170px"
                                  : isTablet
                                  ? "200px"
                                  : "230px",
                                objectFit: "contain",
                                border: "1px solid #00000033",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <Grid
                          container
                          spacing={isMobile ? 2 : isTablet ? 2 : 4}
                          justifyContent="center"
                          style={{
                            margin: isMobile
                              ? "-10px 0"
                              : isTablet
                              ? "0"
                              : "8px 0",
                            paddingLeft: isMobile ? "40px" : "0",
                          }}
                        >
                          {levelData?.allwordsTwo?.map((item) => (
                            <Grid item key={item.text} xs={6} sm={4} md={4}>
                              <div
                                style={{
                                  width: isMobile ? "58%" : "95%",
                                  height: isMobile
                                    ? "123px"
                                    : isTablet
                                    ? "170px"
                                    : "220px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  flexDirection: "column",
                                  background:
                                    selectedDiv === item.text
                                      ? item.text === levelData?.correctWordTwo
                                        ? "linear-gradient(90deg, rgba(88, 204, 2, 0.2) 0%, rgba(88, 204, 2, 0) 100%)"
                                        : "linear-gradient(90deg, rgba(255, 127, 54, 0.2) 0%, rgba(255, 127, 54, 0) 100%)"
                                      : "none",
                                  border:
                                    selectedDiv === item.text
                                      ? item.text === levelData?.correctWordTwo
                                        ? "1.3px solid #58CC02"
                                        : "1.3px solid #FF7F36"
                                      : "none",
                                }}
                                onClick={() => handleDivClick(item.text)}
                              >
                                <img
                                  src={
                                    level === 3
                                      ? item.img
                                      : getAssetUrl(s3Assets[item.img]) ||
                                        Assets[item.img]
                                  }
                                  alt={item.text}
                                  style={{
                                    width: isMobile
                                      ? "110px"
                                      : isTablet
                                      ? "150px"
                                      : "198px",
                                    height: isMobile
                                      ? "130px"
                                      : isTablet
                                      ? "170px"
                                      : "230px",
                                    objectFit: "contain",
                                    border: "1px solid #00000033",
                                  }}
                                />
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      marginTop: isMatched
                        ? isMobile
                          ? "30px"
                          : isTablet
                          ? "40px"
                          : "50px"
                        : "20px",
                    }}
                  >
                    {isRecording2 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <Box
                          style={{ marginTop: "-25px", marginBottom: "67px" }}
                        >
                          <RecordVoiceVisualizer />
                        </Box>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "-25px",
                          }}
                          onClick={handleMicClick2}
                        >
                          <img
                            src={Assets.pause}
                            alt="Stop Recording"
                            style={{
                              width: "49px",
                              height: "49px",
                            }}
                          />
                        </button>
                      </div>
                    )}

                    {isCorrectImageSelected &&
                      !isRecording2 &&
                      !isRecordingStopped2 && (
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "10px",
                          }}
                          onClick={handleMicClick2}
                        >
                          <img
                            src={Assets.mic}
                            alt="Start Recording"
                            style={{
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        </button>
                      )}
                  </div>

                  {isRecordingStopped2 && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={Assets.tickImg}
                          alt="Tick"
                          style={{
                            width: isMobile
                              ? "40px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            height: isMobile
                              ? "40px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            marginRight: "10px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: isMobile
                              ? "24px"
                              : isTablet
                              ? "28px"
                              : "36px",
                            fontWeight: "bold",
                            color: "#1a1a1a",
                            letterSpacing: "3px",
                          }}
                        >
                          {levelData?.correctWordTwo}
                        </p>
                        {/* Show multilingual box only for English on step2 */}
                        {language === "en" && (
                          <AudioTooltipModal
                            audioSrc={
                              multilingual?.[multilingualLangCode]?.audio_url
                            }
                            description={levelData?.correctWordTwo}
                          >
                            <Box
                              sx={{
                                marginLeft: "10px",
                                display: "flex",
                                marginTop: "5px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "2px solid #FF7F36",
                                borderRadius: "16px",
                                gap: "10px",
                                padding: "15px",
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
                                    fontSize: "40px",
                                    fontWeight: "400",
                                    color: "#333F61",
                                    fontStyle: "Quicksand",
                                  }}
                                >
                                  {nativeLangSymbol}
                                </span>
                              </Box>

                              <ListenButton height={50} width={50} />
                            </Box>
                          </AudioTooltipModal>
                        )}
                      </div>
                      {/* Listen to recorded audio button - step2, 2nd page, for all languages except English */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "20px",
                          marginTop: "30px",
                        }}
                      >
                        {language !== "en" && recordedBlob && (
                          <div
                            onClick={
                              isPlayingRecordedAudio
                                ? stopRecordedAudio
                                : playRecordedAudio
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {isPlayingRecordedAudio ? (
                              <StopButton height={50} width={50} />
                            ) : (
                              <ListenButton height={50} width={50} />
                            )}
                          </div>
                        )}
                        <div
                          onClick={goToNextStep}
                          style={{ cursor: "pointer" }}
                        >
                          <NextButtonRound height={50} width={50} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default PhrasesInAction;
