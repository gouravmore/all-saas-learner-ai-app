import React, { useEffect, useState, useMemo } from "react";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";
import BingoCard from "../../components/Practice/BingoCard";
import SyllablePuzzle from "../../components/Practice/SyllablePuzzle";
import ReadAloud from "../../components/Practice/ReadAloud";
import R3 from "../../components/Practice/R3";
import R0 from "../../RFlow/R0";
import R1 from "../../RFlow/R1";
import LetterTrain from "../../RFlow/LetterTrain";
import R2 from "../../RFlow/R2";
import F1, { getF1FlowStep, advanceF1Flow, F1_FLOW } from "../../RFlow/F1";
import F2, { getF2FlowStep, advanceF2Flow, F2_FLOW } from "../../RFlow/F2";
import F3, { getF3FlowStep, advanceF3Flow, F3_FLOW } from "../../RFlow/F3";
import Barakhadi from "../../RFlow/Barakhadi";
import R3Flow from "../../RFlow/R3";
import R4 from "../../RFlow/R4";
import SoundHunt from "../../RFlow/SoundHunt";
import SoundHuntS1Combined from "../../RFlow/SoundHuntS1Combined";
import TowreFlow from "../../components/Practice/TowreFlow";
import McqFlow from "../../components/Practice/McqFlow";
import JumbledWord from "../../components/Practice/JumbledWord";
import AskMoreM14 from "../../components/Practice/AskMoreM14";
import ActOutM13 from "../../components/Practice/ActOutM13";
import PhoneConversation from "../../components/Practice/PhoneConversation";
import PhrasesInAction from "../../components/Practice/PhrasesInAction";
import WhatsMissing from "../../components/Practice/WhatsMissing";
import ArrangePicture from "../../components/Practice/ArrangePicture";
import AnouncementFlow from "../../components/Practice/AnouncementFlow";
import { useNavigate, useLocation } from "react-router-dom";
import {
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  sendTestRigScore,
  setLocalData,
} from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import axios from "axios";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { splitGraphemes } from "split-graphemes";
import { Typography, Box, CircularProgress } from "@mui/material";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../../components/Assesment/Assesment";
import { RetryDialog } from "../../components/Practice/RetryDialog";
import { Log } from "../../services/telementryService";
import Mechanics6 from "../../components/Practice/Mechanics6";
import Mechanics7 from "../../components/Practice/Mechanics7";
import FluencyP1 from "../../components/Practice/FluencyP1";
import LetterHuntMechanics from "../../components/Practice/LetterHuntMechanics";
import LetterLauncherMechanics from "../../components/Practice/LetterLauncherMechanics";
import MemoryChallengeMechanics from "../../components/Practice/MemoryChallengeMechanics";
import FluencyP2 from "../../components/Practice/FluencyP2";
import FluencyP3 from "../../components/Practice/FluencyP3";
import FluencyP4 from "../../components/Practice/FluencyP4";
import FluencyP5 from "../../components/Practice/FluencyP5";
import ParagraphFlow from "../../components/Practice/ParagraphFlow";
import AserFlow from "../../components/Practice/AserFlow";
import ReadMatch from "../../components/Practice/ReadMatch";
import WordWall from "../../components/Practice/WordWall";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import { PutBucketInventoryConfigurationRequestFilterSensitiveLog } from "@aws-sdk/client-s3";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { levelMapping } from "../../utils/levelData";
import { jwtDecode } from "jwt-decode";

import {
  addLesson,
  addPointer,
  addCorrectPracticeWords,
  fetchUserPoints,
  createLearnerProgress,
  getLessonProgressByID,
} from "../../services/orchestration/orchestrationService";
import {
  getContent,
  getContentNew,
  getFetchMilestoneDetails,
  getSetResultPractice,
} from "../../services/learnerAi/learnerAiService";

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [parentWords, setParentWords] = useState({});
  const [levelOneWord, setLevelOneWord] = useState("");
  const [level, setLevel] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  // M4 to M9 milestone levels should show 10 contents instead of 5
  const limit = useMemo(() => (level >= 4 && level <= 9 ? 10 : 5), [level]);
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");
  const [refAudio, setRefAudio] = useState("");
  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [retryDialogMessage, setRetryDialogMessage] = useState("");
  const lang = getLocalData("lang");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [fluency, setFluency] = useState(false);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [rStep, setRStep] = useState(() => {
    return Number(getLocalData("rStep")) || 2;
  });
  const [isAlphabetDemoActive, setIsAlphabetDemoActive] = useState(false);

  // Sync isAlphabetDemoActive state with localStorage
  useEffect(() => {
    const checkAlphabetDemoStatus = () => {
      const demoState = getLocalData("showAlphabetDemo");
      const isActive = demoState === "true";
      if (isActive !== isAlphabetDemoActive) {
        setIsAlphabetDemoActive(isActive);
      }
    };

    // Check immediately
    checkAlphabetDemoStatus();

    // Listen for storage events
    const handleStorageChange = (e) => {
      if (e.key === "showAlphabetDemo") {
        checkAlphabetDemoStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Poll periodically to catch internal changes (since storage event doesn't fire in the same window)
    const interval = setInterval(checkAlphabetDemoStatus, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isAlphabetDemoActive]);

  const [rStepZero, setRStepZero] = useState(() => {
    return Number(getLocalData("rStepZero"));
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRStepZero(Number(getLocalData("rStepZero")));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  //console.log("practice rStepZero", rStepZero);

  const levels = {
    en: {
      L1: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.basketM1),
          syllablesAudio: [
            { name: "Bas", audio: getAssetAudioUrl(s3Assets.basM1Eng) },
            { name: "ket", audio: getAssetAudioUrl(s3Assets.ketM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.basketM1Eng),
        },
        {
          completeWord: "Puzzle",
          syllable: ["Puz", "zle"],
          img: getAssetUrl(s3Assets.puzzleM1),
          syllablesAudio: [
            { name: "Puz", audio: getAssetAudioUrl(s3Assets.puzM1Eng) },
            { name: "zle", audio: getAssetAudioUrl(s3Assets.zleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.puzzleM1Eng),
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyM1),
          syllablesAudio: [
            { name: "Hap", audio: getAssetAudioUrl(s3Assets.hapM1Eng) },
            { name: "py", audio: getAssetAudioUrl(s3Assets.pyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.happyM1Eng),
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilM1),
          syllablesAudio: [
            { name: "Pen", audio: getAssetAudioUrl(s3Assets.penM1Eng) },
            { name: "cil", audio: getAssetAudioUrl(s3Assets.cilM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.pencilM1Eng),
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.tigerM1),
          syllablesAudio: [
            { name: "Ti", audio: getAssetAudioUrl(s3Assets.tiM1Eng) },
            { name: "ger", audio: getAssetAudioUrl(s3Assets.gerM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tigerM1Eng),
        },
      ],
      L2: [
        {
          completeWord: "Spider",
          syllable: ["Spi", "der"],
          img: getAssetUrl(s3Assets.spiderM1),
          syllablesAudio: [
            { name: "Spi", audio: getAssetAudioUrl(s3Assets.spiM1Eng) },
            { name: "der", audio: getAssetAudioUrl(s3Assets.derM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spiderM1Eng),
        },
        {
          completeWord: "Banana",
          syllable: ["Ba", "na", "na"],
          img: getAssetUrl(s3Assets.bananaM1),
          syllablesAudio: [
            { name: "Ba", audio: getAssetAudioUrl(s3Assets.baM1Eng) },
            { name: "na", audio: getAssetAudioUrl(s3Assets.naM1Eng) },
            { name: "na", audio: getAssetAudioUrl(s3Assets.naM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bananaM1Eng),
        },
        {
          completeWord: "Orange",
          syllable: ["Or", "ange"],
          img: getAssetUrl(s3Assets.orangeM1),
          syllablesAudio: [
            { name: "Or", audio: getAssetAudioUrl(s3Assets.orM1Eng) },
            { name: "ange", audio: getAssetAudioUrl(s3Assets.angeM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.orangeM1Eng),
        },
        {
          completeWord: "Table",
          syllable: ["Ta", "ble"],
          img: getAssetUrl(s3Assets.tableM1),
          syllablesAudio: [
            { name: "Ta", audio: getAssetAudioUrl(s3Assets.taM1Eng) },
            { name: "ble", audio: getAssetAudioUrl(s3Assets.bleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tableM1Eng),
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.windowM1),
          syllablesAudio: [
            { name: "Win", audio: getAssetAudioUrl(s3Assets.winM1Eng) },
            { name: "dow", audio: getAssetAudioUrl(s3Assets.dowM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.windowM1Eng),
        },
      ],
      P1: [
        {
          completeWord: "Coconut",
          syllable: ["Coco", "nut"],
          audio: "coconutM1Eng",
        },
        {
          completeWord: "Peacock",
          syllable: ["Pea", "cock"],
          audio: "peacockM1Eng",
        },
        { completeWord: "Puppy", syllable: ["Pup", "py"], audio: "puppyM1Eng" },
        { completeWord: "Clock", syllable: ["clo", "ck"], audio: "clockM1Eng" },
        {
          completeWord: "Grapes",
          syllable: ["grape", "s"],
          audio: "grapesM1Eng",
        },
      ],
      P2: [
        {
          completeWord: "Tongue",
          syllable: ["Tong", "ue"],
          audio: "tongueM1Eng",
        },
        { completeWord: "Money", syllable: ["Mon", "ey"], audio: "moneyM1Eng" },
        { completeWord: "Phone", syllable: ["Pho", "ne"], audio: "phoneM1Eng" },
        {
          completeWord: "Vegetables",
          syllable: ["Vege", "tables"],
          audio: "vegetablesM1Eng",
        },
        { completeWord: "Cards", syllable: ["Car", "ds"], audio: "cardsM1Eng" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.appleM1),
          syllablesAudio: [
            { name: "Ap", audio: getAssetAudioUrl(s3Assets.apM1Eng) },
            { name: "ple", audio: getAssetAudioUrl(s3Assets.pleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.appleM1Eng),
        },
        {
          completeWord: "Coconut",
          syllable: ["Co", "co", "nut"],
          img: getAssetUrl(s3Assets.coconutM1),
          syllablesAudio: [
            { name: "Co", audio: getAssetAudioUrl(s3Assets.coM1Eng) },
            { name: "Co", audio: getAssetAudioUrl(s3Assets.coM1Eng) },
            { name: "nut", audio: getAssetAudioUrl(s3Assets.nutM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.coconutM1Eng),
        },
        {
          completeWord: "Turtle",
          syllable: ["Tur", "tle"],
          img: getAssetUrl(s3Assets.turtleM1),
          syllablesAudio: [
            { name: "Tur", audio: getAssetAudioUrl(s3Assets.turM1Eng) },
            { name: "tle", audio: getAssetAudioUrl(s3Assets.tleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.turtleM1Eng),
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.numberM1),
          syllablesAudio: [
            { name: "Num", audio: getAssetAudioUrl(s3Assets.numM1Eng) },
            { name: "ber", audio: getAssetAudioUrl(s3Assets.berM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.numberM1Eng),
        },
        {
          completeWord: "Money",
          syllable: ["Mon", "ey"],
          img: getAssetUrl(s3Assets.moneyM1),
          syllablesAudio: [
            { name: "Mon", audio: getAssetAudioUrl(s3Assets.monM1Eng) },
            { name: "ey", audio: getAssetAudioUrl(s3Assets.eyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.moneyM1Eng),
        },
      ],
      L4: [
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyM1),
          syllablesAudio: [
            { name: "Hap", audio: getAssetAudioUrl(s3Assets.hapM1Eng) },
            { name: "py", audio: getAssetAudioUrl(s3Assets.pyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.happyM1Eng),
        },
        {
          completeWord: "Puzzle",
          syllable: ["Puz", "zle"],
          img: getAssetUrl(s3Assets.puzzleM1),
          syllablesAudio: [
            { name: "Puz", audio: getAssetAudioUrl(s3Assets.puzM1Eng) },
            { name: "zle", audio: getAssetAudioUrl(s3Assets.zleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.puzzleM1Eng),
        },
        {
          completeWord: "Balloon",
          syllable: ["Bal", "loon"],
          img: getAssetUrl(s3Assets.balloonM1),
          syllablesAudio: [
            { name: "Bal", audio: getAssetAudioUrl(s3Assets.balM1Eng) },
            { name: "loon", audio: getAssetAudioUrl(s3Assets.loonM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.balloonM1Eng),
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.doctorM1),
          syllablesAudio: [
            { name: "Doc", audio: getAssetAudioUrl(s3Assets.docM1Eng) },
            { name: "tor", audio: getAssetAudioUrl(s3Assets.torM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.doctorM1Eng),
        },
        {
          completeWord: "Dustbin",
          syllable: ["Dust", "bin"],
          img: getAssetUrl(s3Assets.dustbinM1),
          syllablesAudio: [
            { name: "Dust", audio: getAssetAudioUrl(s3Assets.dustM1Eng) },
            { name: "bin", audio: getAssetAudioUrl(s3Assets.binM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dustbinM1Eng),
        },
      ],
      P3: [
        {
          completeWord: "Stones",
          syllable: ["Stone", "s"],
          audio: "stonesM1Eng",
        },
        {
          completeWord: "Turtle",
          syllable: ["Tur", "tle"],
          audio: "turtleM1Eng",
        },
        { completeWord: "Key", syllable: ["K", "ey"], audio: "keyM1Eng" },
        { completeWord: "Hands", syllable: ["Han", "ds"], audio: "handsM1Eng" },
        {
          completeWord: "Fruits",
          syllable: ["Fruit", "s"],
          audio: "fruitsM1Eng",
        },
      ],
      P4: [
        {
          completeWord: "Spider",
          syllable: ["Spi", "der"],
          audio: "spiderM1Eng",
        },
        { completeWord: "Happy", syllable: ["Hap", "py"], audio: "happyM1Eng" },
        {
          completeWord: "Plants",
          syllable: ["Plant", "s"],
          audio: "plantsM1Eng",
        },
        {
          completeWord: "Family",
          syllable: ["Fa", "mily"],
          audio: "familyM1Eng",
        },
        {
          completeWord: "Dustbin",
          syllable: ["Dust", "bin"],
          audio: "dustbinM1Eng",
        },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
    hi: {
      L1: [
        {
          completeWord: "बादल",
          syllable: ["बा", "दल"],
          img: getAssetUrl(s3Assets.badalM1Hin),
          syllablesAudio: [
            { name: "बा", audio: getAssetAudioUrl(s3Assets.baaM1Hin) },
            { name: "दल", audio: getAssetAudioUrl(s3Assets.dalM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.baadalM1Hin),
        },
        {
          completeWord: "संतरा",
          syllable: ["सं", "तरा"],
          img: getAssetUrl(s3Assets.santraM1HinI),
          syllablesAudio: [
            { name: "सं", audio: getAssetAudioUrl(s3Assets.sanM1Hin) },
            { name: "तरा", audio: getAssetAudioUrl(s3Assets.traM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.santraM1Hin),
        },
        {
          completeWord: "चावल",
          syllable: ["चा", "वल"],
          img: getAssetUrl(s3Assets.chawalM1Hin),
          syllablesAudio: [
            { name: "चा", audio: getAssetAudioUrl(s3Assets.chaaM1Hin) },
            { name: "वल", audio: getAssetAudioUrl(s3Assets.valM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.chaavalM1Hin),
        },
        {
          completeWord: "कोयल",
          syllable: ["को", "यल"],
          img: getAssetUrl(s3Assets.koyalM1Hin),
          syllablesAudio: [
            { name: "को", audio: getAssetAudioUrl(s3Assets.koM1Hin) },
            { name: "यल", audio: getAssetAudioUrl(s3Assets.elM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.koelM1Hin),
        },
        {
          completeWord: "कलम",
          syllable: ["क", "लम"],
          img: getAssetUrl(s3Assets.kalamM1HinI),
          syllablesAudio: [
            { name: "क", audio: getAssetAudioUrl(s3Assets.kaM1Hin) },
            { name: "लम", audio: getAssetAudioUrl(s3Assets.lamM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kalamM1Hin),
        },
      ],
      L2: [
        {
          completeWord: "मटर",
          syllable: ["म", "टर"],
          img: getAssetUrl(s3Assets.matarM2Hin),
          syllablesAudio: [
            { name: "म", audio: getAssetAudioUrl(s3Assets.maM1Hin) },
            { name: "टर", audio: getAssetAudioUrl(s3Assets.tarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.matarM1Hin),
        },
        {
          completeWord: "पलंग",
          syllable: ["प", "लंग"],
          img: getAssetUrl(s3Assets.palangM2Hin),
          syllablesAudio: [
            { name: "प", audio: getAssetAudioUrl(s3Assets.paM1Hin) },
            { name: "लंग", audio: getAssetAudioUrl(s3Assets.langM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.palangM1Hin),
        },
        {
          completeWord: "मटका",
          syllable: ["मट", "का"],
          img: getAssetUrl(s3Assets.matkaM2Hin),
          syllablesAudio: [
            { name: "मट", audio: getAssetAudioUrl(s3Assets.matM1Hin) },
            { name: "का", audio: getAssetAudioUrl(s3Assets.kaM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.matkaM1Hin),
        },
        {
          completeWord: "मंदिर",
          syllable: ["मं", "दिर"],
          img: getAssetUrl(s3Assets.mandirM2Hin),
          syllablesAudio: [
            { name: "मं", audio: getAssetAudioUrl(s3Assets.manM1Hin) },
            { name: "दिर", audio: getAssetAudioUrl(s3Assets.dirM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.mandirM1Hin),
        },
        {
          completeWord: "गाजर",
          syllable: ["गा", "जर"],
          img: getAssetUrl(s3Assets.gajarM1Hin),
          syllablesAudio: [
            { name: "गा", audio: getAssetAudioUrl(s3Assets.gaaM1Hin) },
            { name: "जर", audio: getAssetAudioUrl(s3Assets.jarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.gaajarM1Hin),
        },
      ],
      P1: [
        { completeWord: "मूँछ", syllable: ["मूँ", "छ"], audio: "moochM1Hin" },
        { completeWord: "लौकी", syllable: ["लौ", "की"], audio: "laukiM1Hin" },
        { completeWord: "टॉवर", syllable: ["टॉ", "वर"], audio: "towerM1Hin" },
        { completeWord: "नानी", syllable: ["ना", "नी"], audio: "naniM1Hin" },
        { completeWord: "मटर", syllable: ["म", "टर"], audio: "matarM1Hin" },
      ],
      P2: [
        { completeWord: "केला", syllable: ["के", "ला"], audio: "kelaM1Hin" },
        { completeWord: "भालू", syllable: ["भा", "लू"], audio: "bhaluM1Hin" },
        { completeWord: "गोभी", syllable: ["गो", "भी"], audio: "gobhiM1Hin" },
        { completeWord: "चूहा", syllable: ["चू", "हा"], audio: "chuhaM1Hin" },
        { completeWord: "घोड़ा", syllable: ["घो", "ड़ा"], audio: "ghodaM1Hin" },
      ],
      S1: [
        { completeWord: "मटर", syllable: ["Ti", "ger"] },
        { completeWord: "पलंग", syllable: ["Rock", "et"] },
        { completeWord: "लौकी", syllable: ["Le", "mon"] },
        { completeWord: "संतरा", syllable: ["To", "ma", "to"] },
        { completeWord: "चूहा", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "तबला",
          syllable: ["तब", "ला"],
          img: getAssetUrl(s3Assets.tablaM1HinI),
          syllablesAudio: [
            { name: "तब", audio: getAssetAudioUrl(s3Assets.tabM1Hin) },
            { name: "ला", audio: getAssetAudioUrl(s3Assets.laM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tablaM1Hin),
        },
        {
          completeWord: "बोतल",
          syllable: ["बो", "तल"],
          img: getAssetUrl(s3Assets.glassM1),
          syllablesAudio: [
            { name: "बो", audio: getAssetAudioUrl(s3Assets.botM1Hin) },
            { name: "तल", audio: getAssetAudioUrl(s3Assets.tleM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bottleM1Hin),
        },
        {
          completeWord: "बकरा",
          syllable: ["बक", "रा"],
          img: getAssetUrl(s3Assets.bakraM1HinI),
          syllablesAudio: [
            { name: "बक", audio: getAssetAudioUrl(s3Assets.bakM1Hin) },
            { name: "रा", audio: getAssetAudioUrl(s3Assets.raM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bakraM1Hin),
        },
        {
          completeWord: "अचार",
          syllable: ["अ", "चार"],
          img: getAssetUrl(s3Assets.acharM1Hin),
          syllablesAudio: [
            { name: "अ", audio: getAssetAudioUrl(s3Assets.aM1Hin) },
            { name: "चार", audio: getAssetAudioUrl(s3Assets.chaarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.achaarM1Hin),
        },
        {
          completeWord: "डमरू",
          syllable: ["डम", "रू"],
          img: getAssetUrl(s3Assets.damruM1Hin),
          syllablesAudio: [
            { name: "डम", audio: getAssetAudioUrl(s3Assets.dumM1Hin) },
            { name: "रू", audio: getAssetAudioUrl(s3Assets.rooM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dumrooM1Hin),
        },
      ],
      L4: [
        {
          completeWord: "तकिया",
          syllable: ["त", "किया"],
          img: getAssetUrl(s3Assets.takiyaM1Hin),
          syllablesAudio: [
            { name: "त", audio: getAssetAudioUrl(s3Assets.taM1Hin) },
            { name: "किया", audio: getAssetAudioUrl(s3Assets.kiaM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.takiaM1Hin),
        },
        {
          completeWord: "टीचर",
          syllable: ["टी", "चर"],
          img: getAssetUrl(s3Assets.teacherM1HinI),
          syllablesAudio: [
            { name: "टी", audio: getAssetAudioUrl(s3Assets.teaM1Hin) },
            { name: "चर", audio: getAssetAudioUrl(s3Assets.cherM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.teacherM1Hin),
        },
        {
          completeWord: "बंदर",
          syllable: ["बं", "दर"],
          img: getAssetUrl(s3Assets.banarM1Hin),
          syllablesAudio: [
            { name: "बं", audio: getAssetAudioUrl(s3Assets.banM1Hin) },
            { name: "दर", audio: getAssetAudioUrl(s3Assets.darM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bandarM1Hin),
        },
        {
          completeWord: "लंगूर",
          syllable: ["लं", "गूर"],
          img: getAssetUrl(s3Assets.langurM1Hin),
          syllablesAudio: [
            { name: "लं", audio: getAssetAudioUrl(s3Assets.lanM1Hin) },
            { name: "गूर", audio: getAssetAudioUrl(s3Assets.goorM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.langoorM1Hin),
        },
        {
          completeWord: "कद्दू",
          syllable: ["कद्", "दू"],
          img: getAssetUrl(s3Assets.kadduM2Hin),
          syllablesAudio: [
            { name: "कद्", audio: getAssetAudioUrl(s3Assets.kadM1Hin) },
            { name: "दू", audio: getAssetAudioUrl(s3Assets.duM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kadduM1Hin),
        },
      ],
      P3: [
        { completeWord: "रोटी", syllable: ["रो", "टी"], audio: "rotiM1Hin" },
        { completeWord: "मूली", syllable: ["मू", "ली"], audio: "mooliM1Hin" },
        { completeWord: "लीची", syllable: ["ली", "ची"], audio: "lichiM1Hin" },
        {
          completeWord: "नींबू",
          syllable: ["नीं", "बू"],
          audio: "neembuM1Hin",
        },
        { completeWord: "होली", syllable: ["हो", "ली"], audio: "holiM1Hin" },
      ],
      P4: [
        { completeWord: "पैसा", syllable: ["पै", "सा"], audio: "paisaM1Hin" },
        {
          completeWord: "चींटी",
          syllable: ["चीन", "टी"],
          audio: "cheentiM1Hin",
        },
        { completeWord: "खीरा", syllable: ["खी", "रा"], audio: "kheeraM1Hin" },
        { completeWord: "भेड़", syllable: ["भे", "ड़"], audio: "bheD_M1Hin" },
        { completeWord: "चाबी", syllable: ["चा", "बी"], audio: "chabiM1Hin" },
      ],
      S2: [
        { completeWord: "बोतल", syllable: ["Bas", "ket"] },
        { completeWord: "मूली", syllable: ["Tab", "let"] },
        { completeWord: "टीचर", syllable: ["Sun", "set"] },
        { completeWord: "डमरू", syllable: ["But", "ton"] },
        { completeWord: "पैसा", syllable: ["Win", "dow"] },
      ],
    },
    ta: {
      L1: [
        {
          completeWord: "யுவ",
          syllable: ["யு", "வ"],
          img: getAssetUrl(s3Assets.youngM1Tam),
          syllablesAudio: [
            { name: "யு", audio: getAssetAudioUrl(s3Assets.youth1M1SylTam) },
            { name: "வ", audio: getAssetAudioUrl(s3Assets.youth2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.youngAudio),
        },
        {
          completeWord: "குருடன்",
          syllable: ["கு", "று", "டன்"],
          img: getAssetUrl(s3Assets.blindM1TamI),
          syllablesAudio: [
            {
              name: "கு",
              audio: getAssetAudioUrl(s3Assets.kurudanWord1Audio),
            },
            {
              name: "று",
              audio: getAssetAudioUrl(s3Assets.kurudanWord2Audio),
            },
            {
              name: "டன்",
              audio: getAssetAudioUrl(s3Assets.kurudanWord3Audio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kurudanAudio),
        },
        {
          completeWord: "விவசாயி",
          syllable: ["வி", "வ", "சாயி"],
          img: getAssetUrl(s3Assets.farmerM1),
          syllablesAudio: [
            { name: "வி", audio: getAssetAudioUrl(s3Assets.farmerWord1Audio) },
            { name: "வ", audio: getAssetAudioUrl(s3Assets.farmerWord2Audio) },
            {
              name: "சாயி",
              audio: getAssetAudioUrl(s3Assets.farmerWord3Audio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.farmerAudio),
        },
        {
          completeWord: "கிண்ணம்",
          syllable: ["கி", "ண்", "ணம்"],
          img: getAssetUrl(s3Assets.glassBowl),
          syllablesAudio: [
            { name: "கி", audio: getAssetAudioUrl(s3Assets.bowlWord1Audio) },
            { name: "ண்", audio: getAssetAudioUrl(s3Assets.bowlWord2Audio) },
            { name: "ணம்", audio: getAssetAudioUrl(s3Assets.bowlWord3Audio) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bowlAudio),
        },
        {
          completeWord: "காளான்",
          syllable: ["கா", "ளான்"],
          img: getAssetUrl(s3Assets.mushroomM1TamI),
          syllablesAudio: [
            { name: "கா", audio: getAssetAudioUrl(s3Assets.mushroom1M1SylTam) },
            {
              name: "ளான்",
              audio: getAssetAudioUrl(s3Assets.mushroom2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.mushroomM1Tam),
        },
      ],
      L2: [
        {
          completeWord: "உணவு",
          syllable: ["உ", "ண", "வு"],
          img: getAssetUrl(s3Assets.foodM1Tam),
          syllablesAudio: [
            { name: "உ", audio: getAssetAudioUrl(s3Assets.food1M1SylTam) },
            { name: "ண", audio: getAssetAudioUrl(s3Assets.food2M1SylTam) },
            { name: "வு", audio: getAssetAudioUrl(s3Assets.food3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.FoodM1Tam),
        },
        {
          completeWord: "அரிசி",
          syllable: ["அ", "ரி", "சி"],
          img: getAssetUrl(s3Assets.riceM1Tam),
          syllablesAudio: [
            { name: "அ", audio: getAssetAudioUrl(s3Assets.rice1M1SylTam) },
            { name: "ரி", audio: getAssetAudioUrl(s3Assets.rice2M1SylTam) },
            { name: "சி", audio: getAssetAudioUrl(s3Assets.rice3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RiceM1Tam),
        },
        {
          completeWord: "குதிரை",
          syllable: ["கு", "தி", "ரை"],
          img: getAssetUrl(s3Assets.horseM1Tam),
          syllablesAudio: [
            { name: "கு", audio: getAssetAudioUrl(s3Assets.horse1M1SylTam) },
            { name: "தி", audio: getAssetAudioUrl(s3Assets.horse2M1SylTam) },
            { name: "ரை", audio: getAssetAudioUrl(s3Assets.horse3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.HorseM1Tam),
        },
        {
          completeWord: "கோப்பை",
          syllable: ["கோ", "ப்பை"],
          img: getAssetUrl(s3Assets.mugM1Tam),
          syllablesAudio: [
            { name: "கோ", audio: getAssetAudioUrl(s3Assets.mug1M1SylTam) },
            { name: "ப்பை", audio: getAssetAudioUrl(s3Assets.mug2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.koppaiAudio),
        },
        {
          completeWord: "கேரட்",
          syllable: ["கே", "ரட்"],
          img: getAssetUrl(s3Assets.carrotM1Tam),
          syllablesAudio: [
            { name: "கே", audio: getAssetAudioUrl(s3Assets.carrot1M1SylTam) },
            { name: "ரட்", audio: getAssetAudioUrl(s3Assets.carrot2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.CarrotM1Tam),
        },
      ],
      P1: [
        { completeWord: "முகம்", syllable: ["மு", "கம்"], audio: "FaceM1Tam" },
        { completeWord: "புயல்", syllable: ["பு", "யல்"], audio: "stormM1Tam" },
        {
          completeWord: "எருமை",
          syllable: ["எ", "ருமை"],
          audio: "BuffaloM1Tam",
        },
        {
          completeWord: "புதினா",
          syllable: ["பு", "தினா"],
          audio: "MintM1Tam",
        },
        {
          completeWord: "பாலம்",
          syllable: ["பா", "லம்"],
          audio: "bridgeM1Tam",
        },
      ],
      P2: [
        {
          completeWord: "ரூபாய்",
          syllable: ["ரூ", "பாய்"],
          audio: "RupeesM1Tam",
        },
        {
          completeWord: "தாகம்",
          syllable: ["தா", "கம்"],
          audio: "thirstM1Tam",
        },
        { completeWord: "மாதம்", syllable: ["மா", "தம்"], audio: "MONTHM1Tam" },
        { completeWord: "குழாய்", syllable: ["கு", "ழாய்"], audio: "TapM1Tam" },
        { completeWord: "கடல்", syllable: ["க", "டல்"], audio: "oceanM1Tam" },
      ],
      S1: [
        { completeWord: "யுவ", syllable: ["Ti", "ger"] },
        { completeWord: "அரிசி", syllable: ["Rock", "et"] },
        { completeWord: "பாலம்", syllable: ["Le", "mon"] },
        { completeWord: "ரூபாய்", syllable: ["To", "ma", "to"] },
        { completeWord: "காளான்", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "அணில்",
          syllable: ["அ", "ணில்"],
          img: getAssetUrl(s3Assets.squirrelMTam),
          syllablesAudio: [
            { name: "அ", audio: getAssetAudioUrl(s3Assets.squirrel1M1SylTam) },
            {
              name: "ணில்",
              audio: getAssetAudioUrl(s3Assets.squirrel2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.SquirrelM1Tam),
        },
        {
          completeWord: "மாதுளை",
          syllable: ["மா", "து", "ளை"],
          img: getAssetUrl(s3Assets.pomegranateM1Tam),
          syllablesAudio: [
            {
              name: "ದಾமா",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord1Audio),
            },
            {
              name: "து",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord2Audio),
            },
            {
              name: "ளை",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord3Audio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.pomegranateAudio),
        },
        {
          completeWord: "மரம்",
          syllable: ["ம", "ரம்"],
          img: getAssetUrl(s3Assets.treeM1Tam),
          syllablesAudio: [
            { name: "ம", audio: getAssetAudioUrl(s3Assets.tree1M1SylTam) },
            { name: "ரம்", audio: getAssetAudioUrl(s3Assets.tree2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.TREEM1Tam),
        },
        {
          completeWord: "மயில்",
          syllable: ["ம", "யில்"],
          img: getAssetUrl(s3Assets.peacockM1Tam),
          syllablesAudio: [
            { name: "ம", audio: getAssetAudioUrl(s3Assets.peacock1M1SylTam) },
            {
              name: "யில்",
              audio: getAssetAudioUrl(s3Assets.peacock2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.PeacockM1Tam),
        },
        {
          completeWord: "தாமரை",
          syllable: ["தா", "ம", "ரை"],
          img: getAssetUrl(s3Assets.lotusM1Tam),
          syllablesAudio: [
            { name: "தா", audio: getAssetAudioUrl(s3Assets.lotus1M1SylTam) },
            { name: "ம", audio: getAssetAudioUrl(s3Assets.lotus2M1SylTam) },
            { name: "ரை", audio: getAssetAudioUrl(s3Assets.lotus3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.LotusM1Tam),
        },
      ],
      L4: [
        {
          completeWord: "காலுறை",
          syllable: ["கா", "லு", "றை"],
          img: getAssetUrl(s3Assets.socksM1Tam),
          syllablesAudio: [
            { name: "கா", audio: getAssetAudioUrl(s3Assets.socks1) },
            { name: "லு", audio: getAssetAudioUrl(s3Assets.socks2) },
            { name: "றை", audio: getAssetAudioUrl(s3Assets.socks3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.socksAudio),
        },
        {
          completeWord: "ஆகாயம்",
          syllable: ["ஆ", "கா", "யம்"],
          img: getAssetUrl(s3Assets.skyM1Tam),
          syllablesAudio: [
            { name: "ஆ", audio: getAssetAudioUrl(s3Assets.sky1M1SylTam) },
            { name: "கா", audio: getAssetAudioUrl(s3Assets.sky2M1SylTam) },
            { name: "யம்", audio: getAssetAudioUrl(s3Assets.sky3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.SkyM1Tam),
        },
        {
          completeWord: "நேரம்",
          syllable: ["நே", "ரம்"],
          img: getAssetUrl(s3Assets.timeM1TamI),
          syllablesAudio: [
            { name: "நே", audio: getAssetAudioUrl(s3Assets.time1M1SylTam) },
            { name: "ரம்", audio: getAssetAudioUrl(s3Assets.time2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.timeM1Tam),
        },
        {
          completeWord: "கதவு",
          syllable: ["க", "த", "வு"],
          img: getAssetUrl(s3Assets.doorM1Tam),
          syllablesAudio: [
            { name: "க", audio: getAssetAudioUrl(s3Assets.door1M1SylTam) },
            { name: "த", audio: getAssetAudioUrl(s3Assets.door2M1SylTam) },
            { name: "வு", audio: getAssetAudioUrl(s3Assets.door3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.DoorM1Tam),
        },
        {
          completeWord: "கோதுமை",
          syllable: ["கோ", "து", "மை"],
          img: getAssetUrl(s3Assets.wheatM1Tam),
          syllablesAudio: [
            { name: "கோ", audio: getAssetAudioUrl(s3Assets.wheat1M1SylTam) },
            { name: "து", audio: getAssetAudioUrl(s3Assets.wheat2M1SylTam) },
            { name: "மை", audio: getAssetAudioUrl(s3Assets.wheat3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.WheatM1Tam),
        },
      ],
      P3: [
        { completeWord: "தயிர்", syllable: ["த", "யிர்"], audio: "CurdM1Tam" },
        { completeWord: "மேகம்", syllable: ["மே", "கம்"], audio: "CloudM1Tam" },
        { completeWord: "குடில்", syllable: ["கு", "டில்"], audio: "hutM1Tam" },
        {
          completeWord: "மாலை",
          syllable: ["மா", "லை"],
          audio: "necklaceM1Tam",
        },
        { completeWord: "கொடரி", syllable: ["கொ", "டரி"], audio: "AxeM1Tam" },
      ],
      P4: [
        { completeWord: "முரலி", syllable: ["மு", "ரலி"], audio: "FluteM1Tam" },
        { completeWord: "சிறகு", syllable: ["சி", "றகு"], audio: "wingM1Tam" },
        {
          completeWord: "கோபம்",
          syllable: ["கோ", "பம்"],
          audio: "anngryAudio",
        },
        {
          completeWord: "நிழல்",
          syllable: ["நி", "ழல்"],
          audio: "shadowM1Tam",
        },
        {
          completeWord: "கோலம்",
          syllable: ["கோ", "லம்"],
          audio: "rangoliM1Tam",
        },
      ],
      S2: [
        { completeWord: "அணில்", syllable: ["Bas", "ket"] },
        { completeWord: "சிறகு", syllable: ["Tab", "let"] },
        { completeWord: "குடில்", syllable: ["Sun", "set"] },
        { completeWord: "நேரம்", syllable: ["But", "ton"] },
        { completeWord: "மரம்", syllable: ["Win", "dow"] },
      ],
    },
    kn: {
      L1: [
        {
          completeWord: "ಕಮಲ",
          syllable: ["ಕ", "ಮ", "ಲ"],
          img: getAssetUrl(s3Assets.lotusM1KanI),
          syllablesAudio: [
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.lotus1M1SylKan) },
            { name: "ಮ", audio: getAssetAudioUrl(s3Assets.lotus2M1SylKan) },
            { name: "ಲ", audio: getAssetAudioUrl(s3Assets.lotus3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lotusM1Kan),
        },
        {
          completeWord: "ಚಮಚ",
          syllable: ["ಚ", "ಮ", "ಚ"],
          img: getAssetUrl(s3Assets.spoonM1KanI),
          syllablesAudio: [
            { name: "ಚ", audio: getAssetAudioUrl(s3Assets.spoon1M1SylKan) },
            { name: "ಮ", audio: getAssetAudioUrl(s3Assets.spoon2M1SylKan) },
            { name: "ಚ", audio: getAssetAudioUrl(s3Assets.spoon3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spoonM1Kan),
        },
        {
          completeWord: "ಕರಡಿ",
          syllable: ["ಕ", "ರ", "ಡಿ"],
          img: getAssetUrl(s3Assets.bearM1KanI),
          syllablesAudio: [
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.bear1Kan) },
            { name: "ರ", audio: getAssetAudioUrl(s3Assets.bear2Kan) },
            { name: "ಡಿ", audio: getAssetAudioUrl(s3Assets.bear3Kan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bearM1Kan),
        },
        {
          completeWord: "ಹಡಗು",
          syllable: ["ಹ", "ಡ", "ಗು"],
          img: getAssetUrl(s3Assets.shipM1KanI),
          syllablesAudio: [
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.ship1M1SylKan) },
            { name: "ಡ", audio: getAssetAudioUrl(s3Assets.ship2M1SylKan) },
            { name: "ಗು", audio: getAssetAudioUrl(s3Assets.ship3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.shipM1Kan),
        },
        {
          completeWord: "ತಬಲಾ",
          syllable: ["ತ", "ಬ", "ಲಾ"],
          img: getAssetUrl(s3Assets.tabalaM1KanI),
          syllablesAudio: [
            { name: "ತ", audio: getAssetAudioUrl(s3Assets.tabala1M1SylKan) },
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.tabala2M1SylKan) },
            { name: "ಲಾ", audio: getAssetAudioUrl(s3Assets.tabala3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tabalaM1Kan),
        },
      ],
      L2: [
        {
          completeWord: "ಗಾಯಕ",
          syllable: ["ಗಾ", "ಯ", "ಕ"],
          img: getAssetUrl(s3Assets.singerM1KanI),
          syllablesAudio: [
            { name: "ಗಾ", audio: getAssetAudioUrl(s3Assets.singer1M1SylKan) },
            { name: "ಯ", audio: getAssetAudioUrl(s3Assets.singer2M1SylKan) },
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.singer3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.singerM1Kan),
        },
        {
          completeWord: "ಅಗಸ",
          syllable: ["ಅ", "ಗ", "ಸ"],
          img: getAssetUrl(s3Assets.dhobiM1KanI),
          syllablesAudio: [
            { name: "ಅ", audio: getAssetAudioUrl(s3Assets.washerman1M1SylKan) },
            { name: "ಗ", audio: getAssetAudioUrl(s3Assets.washerman2M1SylKan) },
            { name: "ಸ", audio: getAssetAudioUrl(s3Assets.washerman3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dhobiM1Kan),
        },
        {
          completeWord: "ಅರಸ",
          syllable: ["ಅ", "ರ", "ಸ"],
          img: getAssetUrl(s3Assets.kingM1KanI),
          syllablesAudio: [
            { name: "ಅ", audio: getAssetAudioUrl(s3Assets.king1M1SylKan) },
            { name: "ರ", audio: getAssetAudioUrl(s3Assets.king2M1SylKan) },
            { name: "ಸ", audio: getAssetAudioUrl(s3Assets.king3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kingM1Kan),
        },
        {
          completeWord: "ಗಣಿತ",
          syllable: ["ಗ", "ಣಿ", "ತ"],
          img: getAssetUrl(s3Assets.mathematicsM1KanI),
          syllablesAudio: [
            {
              name: "ಗ",
              audio: getAssetAudioUrl(s3Assets.Math1Kan),
            },
            {
              name: "ಣಿ",
              audio: getAssetAudioUrl(s3Assets.Math2Kan),
            },
            {
              name: "ತ",
              audio: getAssetAudioUrl(s3Assets.Math3Kan),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.MathKan),
        },
        {
          completeWord: "ಹಲಸು",
          syllable: ["ಹ", "ಲ", "ಸು"],
          img: getAssetUrl(s3Assets.jackfruitM1KanI),
          syllablesAudio: [
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.jackfruit1M1SylKan) },
            { name: "ಲ", audio: getAssetAudioUrl(s3Assets.jackfruit2M2SylKan) },
            {
              name: "ಸು",
              audio: getAssetAudioUrl(s3Assets.jackfruit3M1SylKan),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jackfruitM1Kan),
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಬೀಗ", syllable: ["ಬೀ", "ಗ"], audio: "lockM1KanA" },
        { completeWord: "ಚರಕ", syllable: ["ಚರಕ", "ಕ"], audio: "spindleM1KanA" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaKan",
        },
        {
          completeWord: "ಹೂವು",
          syllable: ["ಹೂ", "ವು"],
          audio: "FlowerKan",
        },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatKan" },
        {
          completeWord: "ಚೇಳು",
          syllable: ["ಚೇ", "ಳು"],
          audio: "scorpionKan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "ಕಮಲ", syllable: ["Ti", "ger"] },
        { completeWord: "ಗೋಧಿ", syllable: ["Rock", "et"] },
        { completeWord: "ಊಟ", syllable: ["Me", "al"] },
        { completeWord: "ಅಗಸ", syllable: ["To", "ma", "to"] },
        { completeWord: "ಹಡಗು", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "ಹುಡುಗ",
          syllable: ["ಹು", "ಡು", "ಗ"],
          img: getAssetUrl(s3Assets.boyM1KanI),
          syllablesAudio: [
            { name: "ಹು", audio: getAssetAudioUrl(s3Assets.Boy1Kan) },
            { name: "ಡು", audio: getAssetAudioUrl(s3Assets.Boy2Kan) },
            { name: "ಗ", audio: getAssetAudioUrl(s3Assets.Boy3Kan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BoyKan),
        },
        {
          completeWord: "ಬಟಾಣಿ",
          syllable: ["ಬ", "ಟಾ", "ಣಿ"],
          img: getAssetUrl(s3Assets.peasM1KanI),
          syllablesAudio: [
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.Peas1) },
            { name: "ಟಾ", audio: getAssetAudioUrl(s3Assets.Peas2) },
            { name: "ಣಿ", audio: getAssetAudioUrl(s3Assets.Peas3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.Peas),
        },
        {
          completeWord: "ಮೀನು",
          syllable: ["ಮೀ", "ನು"],
          img: getAssetUrl(s3Assets.fishM1KanI),
          syllablesAudio: [
            { name: "ಮೀ", audio: getAssetAudioUrl(s3Assets.fish1M1SylKan) },
            { name: "ನು", audio: getAssetAudioUrl(s3Assets.fish2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.fishM1Kan),
        },
        {
          completeWord: "ನಿಂಬೆ",
          syllable: ["ನಿಂ", "ಬೆ"],
          img: getAssetUrl(s3Assets.lemonM1KanI),
          syllablesAudio: [
            { name: "ನಿಂ", audio: getAssetAudioUrl(s3Assets.lemon1M1SylKan) },
            { name: "ಬೆ", audio: getAssetAudioUrl(s3Assets.lemon2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lemonM1Kan),
        },
        {
          completeWord: "ಕುಟುಂಬ",
          syllable: ["ಕು", "ಟುಂ", "ಬ"],
          img: getAssetUrl(s3Assets.familyM1KanI),
          syllablesAudio: [
            { name: "ಕು", audio: getAssetAudioUrl(s3Assets.family1M1SylKan) },
            { name: "ಟುಂ", audio: getAssetAudioUrl(s3Assets.family2M1SylKan) },
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.family3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.familyM1Kan),
        },
      ],
      L4: [
        {
          completeWord: "ಮಾನವ",
          syllable: ["ಮಾ", "ನ", "ವ"],
          img: getAssetUrl(s3Assets.humanM1KanI),
          syllablesAudio: [
            { name: "ಮಾ", audio: getAssetAudioUrl(s3Assets.human1M1SylKan) },
            { name: "ನ", audio: getAssetAudioUrl(s3Assets.human2M1SylKan) },
            { name: "ವ", audio: getAssetAudioUrl(s3Assets.human3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.humanM1Kan),
        },
        {
          completeWord: "ವಾಹನ",
          syllable: ["ವಾ", "ಹ", "ನ"],
          img: getAssetUrl(s3Assets.vehicleM1KanI),
          syllablesAudio: [
            { name: "ವಾ", audio: getAssetAudioUrl(s3Assets.vehicle1M1SylKan) },
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.vehicle2M1SylKan) },
            { name: "ನ", audio: getAssetAudioUrl(s3Assets.vehicle3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.vehicleM1Kan),
        },
        {
          completeWord: "ಹೂಕೋಸು",
          syllable: ["ಹೂ", "ಕೋ", "ಸು"],
          img: getAssetUrl(s3Assets.cabbageM1KanI),
          syllablesAudio: [
            { name: "ಹೂ", audio: getAssetAudioUrl(s3Assets.Cauliflower_1) },
            { name: "ಕೋ", audio: getAssetAudioUrl(s3Assets.Cauliflower_2) },
            { name: "ಸು", audio: getAssetAudioUrl(s3Assets.Cauliflower_3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.Cauliflower),
        },
        {
          completeWord: "ಭೂಮಿ",
          syllable: ["ಭೂ", "ಮಿ"],
          img: getAssetUrl(s3Assets.earthM1KanI),
          syllablesAudio: [
            { name: "ಭೂ", audio: getAssetAudioUrl(s3Assets.earth1M1SylKan) },
            { name: "ಮಿ", audio: getAssetAudioUrl(s3Assets.earth2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earthM1Kan),
        },
        {
          completeWord: "ಕಾಫಿ",
          syllable: ["ಕಾ", "ಫಿ"],
          img: getAssetUrl(s3Assets.coffeeM1KanI),
          syllablesAudio: [
            { name: "ಕಾ", audio: getAssetAudioUrl(s3Assets.coffee1M1SylKan) },
            { name: "ಫಿ", audio: getAssetAudioUrl(s3Assets.coffee2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.coffeeM1Kan),
        },
      ],
      P3: [
        { completeWord: "ಒಂದು", syllable: ["ಒಂ", "ದು"], audio: "oneM1KanA" },
        {
          completeWord: "ಆರು",
          syllable: ["ಆರು", "ರು"],
          audio: "sixM1KanA",
        },
        { completeWord: "ಓಡು", syllable: ["ಓಡು", "ಡು"], audio: "runM1KanA" },
        { completeWord: "ಈಜು", syllable: ["ಈಜು", "ಜು"], audio: "swimM1KanA" },
        {
          completeWord: "ಜನ",
          syllable: ["ಜನ", "ನ"],
          audio: "peopleM1KanA",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಮಂಚ",
          syllable: ["ಮಂ", "ಚ"],
          audio: "cotKan",
        },
        {
          completeWord: "ಸರ",
          syllable: ["ಸರ", "ರ"],
          audio: "necklaceKan",
        },
        { completeWord: "ಐದು", syllable: ["ಐದು", "ದು"], audio: "fiveM1KanA" },
      ],
      S2: [
        { completeWord: "ಹುಡುಗ", syllable: ["Bas", "ket"] },
        { completeWord: "ಕಾಗೆ", syllable: ["Cr", "ow"] },
        { completeWord: "ವಾಹನ", syllable: ["Sun", "set"] },
        { completeWord: "ನಿಂಬೆ", syllable: ["But", "ton"] },
        { completeWord: "ತೋಳ", syllable: ["Wo", "lf"] },
      ],
    },
    te: {
      L1: [
        {
          completeWord: "పనస",
          syllable: ["ప", "న", "స"],
          img: getAssetUrl(s3Assets.jackfruitM1TelI),
          syllablesAudio: [
            { name: "ప", audio: getAssetAudioUrl(s3Assets.jackfruit1M3Tel) },
            { name: "న", audio: getAssetAudioUrl(s3Assets.jackfruit2M3Tel) },
            { name: "స", audio: getAssetAudioUrl(s3Assets.jackfrui31M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jackfruitM1Tel),
        },
        {
          completeWord: "ఉడత",
          syllable: ["ఉ", "డ", "త"],
          img: getAssetUrl(s3Assets.squirrelM1TelI),
          syllablesAudio: [
            { name: "ఉ", audio: getAssetAudioUrl(s3Assets.squirrel1M3Tel) },
            { name: "డ", audio: getAssetAudioUrl(s3Assets.squirrel2M3Tel) },
            { name: "త", audio: getAssetAudioUrl(s3Assets.squirrel3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.squirrelM1Tel),
        },
        {
          completeWord: "ఎలుక",
          syllable: ["ఎ", "లు", "క"],
          img: getAssetUrl(s3Assets.ratM1TelI),
          syllablesAudio: [
            { name: "ఎ", audio: getAssetAudioUrl(s3Assets.rat1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.rat2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.rat3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.ratM1Tel),
        },
        {
          completeWord: "పడవ",
          syllable: ["ప", "డ", "వ"],
          img: getAssetUrl(s3Assets.boatM1TelI),
          syllablesAudio: [
            { name: "ప", audio: getAssetAudioUrl(s3Assets.boat1M3Tel) },
            { name: "డ", audio: getAssetAudioUrl(s3Assets.boat2M3Tel) },
            { name: "వ", audio: getAssetAudioUrl(s3Assets.boat3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.boatM1Tel),
        },
        {
          completeWord: "ఉంగరం",
          syllable: ["ఉం", "గ", "రం"],
          img: getAssetUrl(s3Assets.ringM1TelI),
          syllablesAudio: [
            { name: "ఉం", audio: getAssetAudioUrl(s3Assets.ring1M3Tel) },
            { name: "గ", audio: getAssetAudioUrl(s3Assets.ring2M3Tel) },
            { name: "రం", audio: getAssetAudioUrl(s3Assets.ring3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.ringM1Tel),
        },
      ],
      L2: [
        {
          completeWord: "అరటి",
          syllable: ["అ", "ర", "టి"],
          img: getAssetUrl(s3Assets.bananaM1TelI),
          syllablesAudio: [
            { name: "అ", audio: getAssetAudioUrl(s3Assets.banana1M3Tel) },
            { name: "ర", audio: getAssetAudioUrl(s3Assets.banana2M3Tel) },
            { name: "టి", audio: getAssetAudioUrl(s3Assets.banana3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bananaM1Tel),
        },
        {
          completeWord: "గాడిద",
          syllable: ["గా", "డి", "ద"],
          img: getAssetUrl(s3Assets.donkeyM1TelI),
          syllablesAudio: [
            { name: "గా", audio: getAssetAudioUrl(s3Assets.donkey1M3Tel) },
            { name: "డి", audio: getAssetAudioUrl(s3Assets.donkey2M3Tel) },
            { name: "ద", audio: getAssetAudioUrl(s3Assets.donkey3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.donkeyM1Tel),
        },
        {
          completeWord: "తలుపు",
          syllable: ["త", "లు", "పు"],
          img: getAssetUrl(s3Assets.doorM1TelI),
          syllablesAudio: [
            { name: "త", audio: getAssetAudioUrl(s3Assets.door1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.door2M3Tel) },
            { name: "పు", audio: getAssetAudioUrl(s3Assets.door3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.doorM1Tel),
        },
        {
          completeWord: "చిలుక",
          syllable: ["చి", "లు", "క"],
          img: getAssetUrl(s3Assets.parrotM1TelI),
          syllablesAudio: [
            { name: "చి", audio: getAssetAudioUrl(s3Assets.parrot1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.parrot2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.parrot3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.parrotM1Tel),
        },
        {
          completeWord: "పిచుక",
          syllable: ["పి", "చు", "క"],
          img: getAssetUrl(s3Assets.sparrowM1TelI),
          syllablesAudio: [
            { name: "పి", audio: getAssetAudioUrl(s3Assets.sparrow1M3Tel) },
            { name: "చు", audio: getAssetAudioUrl(s3Assets.sparrow2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.sparrow3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.sparrowM1Tel),
        },
      ],
      P1: [
        {
          completeWord: "కాఫీ",
          syllable: ["కా", "ఫీ"],
          audio: "coffee_M1Audio",
        },
        {
          completeWord: "వీధి",
          syllable: ["వీ", "ధి"],
          audio: "street_M1Audio",
        },
        {
          completeWord: "నలుపు",
          syllable: ["న", "లుపు"],
          audio: "black_M1Audio",
        },
        {
          completeWord: "అరటి",
          syllable: ["అ", "రటి"],
          audio: "banana_M1Audio",
        },
        {
          completeWord: "నగరం",
          syllable: ["న", "గరం"],
          audio: "city_M1Audio",
        },
      ],
      P2: [
        {
          completeWord: "దారం",
          syllable: ["దా", "రం"],
          audio: "thread_M1Audio",
        },
        {
          completeWord: "ఎరుపు",
          syllable: ["ఎ", "రుపు"],
          audio: "red_M1Audio",
        },
        {
          completeWord: "కుంచె",
          syllable: ["కు", "ంచె"],
          audio: "brush_M1Audio",
        },
        { completeWord: "గీయు", syllable: ["గీ", "యు"], audio: "drawM1Tel" },
        { completeWord: "ఎముక", syllable: ["ఎ", "ముక"], audio: "boneM1Tel" },
      ],
      S1: [
        {
          completeWord: "నగ",
          syllable: ["నగ"],
        },
        {
          completeWord: "బడి",
          syllable: ["బ", "డి"],
        },
        {
          completeWord: "కల",
          syllable: ["కల"],
        },
        {
          completeWord: "ఈత",
          syllable: ["ఈ", "త"],
        },
        {
          completeWord: "దండ",
          syllable: ["దం", "డ"],
        },
      ],
      L3: [
        {
          completeWord: "తామర",
          syllable: ["తా", "మ", "ర"],
          img: getAssetUrl(s3Assets.lotusM1TelI),
          syllablesAudio: [
            { name: "తా", audio: getAssetAudioUrl(s3Assets.lotus1M3Tel) },
            { name: "మ", audio: getAssetAudioUrl(s3Assets.lotus2M3Tel) },
            { name: "ర", audio: getAssetAudioUrl(s3Assets.lotus3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lotusM1Tel),
        },
        {
          completeWord: "నాలుక",
          syllable: ["నా", "లు", "క"],
          img: getAssetUrl(s3Assets.tongueM1TelI),
          syllablesAudio: [
            { name: "నా", audio: getAssetAudioUrl(s3Assets.tongue1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.tongue2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.tongue3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tongueM1Tel),
        },
        {
          completeWord: "కంగారు",
          syllable: ["కం", "గా", "రు"],
          img: getAssetUrl(s3Assets.kangarooM1TelI),
          syllablesAudio: [
            { name: "కం", audio: getAssetAudioUrl(s3Assets.kangaroo1M3Tel) },
            { name: "గా", audio: getAssetAudioUrl(s3Assets.kangaroo2M3Tel) },
            { name: "రు", audio: getAssetAudioUrl(s3Assets.kangaroo3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kangarooM1Tel),
        },
        {
          completeWord: "చెంచా",
          syllable: ["చెం", "చా"],
          img: getAssetUrl(s3Assets.spoonM1TelI),
          syllablesAudio: [
            { name: "చెం", audio: getAssetAudioUrl(s3Assets.spoon1M3Tel) },
            { name: "చా", audio: getAssetAudioUrl(s3Assets.spoon2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spoonM1Tel),
        },
        {
          completeWord: "చెవి",
          syllable: ["చె", "వి"],
          img: getAssetUrl(s3Assets.earM1TelI),
          syllablesAudio: [
            { name: "చె", audio: getAssetAudioUrl(s3Assets.ear1M3Tel) },
            { name: "వి", audio: getAssetAudioUrl(s3Assets.ear2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earM1Tel),
        },
      ],
      L4: [
        {
          completeWord: "చేయి",
          syllable: ["చె", "యి"],
          img: getAssetUrl(s3Assets.handM1TelI),
          syllablesAudio: [
            { name: "చె", audio: getAssetAudioUrl(s3Assets.hand1M3Tel) },
            { name: "యి", audio: getAssetAudioUrl(s3Assets.hand2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.handM1Tel),
        },
        {
          completeWord: "జాడీ",
          syllable: ["జా", "డీ"],
          img: getAssetUrl(s3Assets.jarM1TelI),
          syllablesAudio: [
            { name: "జా", audio: getAssetAudioUrl(s3Assets.jar1M3Tel) },
            { name: "డీ", audio: getAssetAudioUrl(s3Assets.jar2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jarM1Tel),
        },
        {
          completeWord: "సీసా",
          syllable: ["సీ", "సా"],
          img: getAssetUrl(s3Assets.bottleM1TelI),
          syllablesAudio: [
            { name: "సీ", audio: getAssetAudioUrl(s3Assets.bottle1M3Tel) },
            { name: "సా", audio: getAssetAudioUrl(s3Assets.bottle2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bottleM1Tel),
        },
        {
          completeWord: "రోటీ",
          syllable: ["రో", "టీ"],
          img: getAssetUrl(s3Assets.rotiM1TelI),
          syllablesAudio: [
            { name: "రో", audio: getAssetAudioUrl(s3Assets.roti1M3Tel) },
            { name: "టీ", audio: getAssetAudioUrl(s3Assets.roti2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.rotiM1Tel),
        },
        {
          completeWord: "భూమి",
          syllable: ["భూ", "మి"],
          img: getAssetUrl(s3Assets.earthM1TelI),
          syllablesAudio: [
            { name: "భూ", audio: getAssetAudioUrl(s3Assets.earth1M3Tel) },
            { name: "మి", audio: getAssetAudioUrl(s3Assets.earth2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earthM1Tel),
        },
      ],
      P3: [
        { completeWord: "ఇటుక", syllable: ["ఇ", "టుక"], audio: "brickM1Tel" },
        {
          completeWord: "పండుగ",
          syllable: ["పం", "డుగ"],
          audio: "festivalM1Tel",
        },
        {
          completeWord: "కంబళి",
          syllable: ["కం", "బళి"],
          audio: "blanketM1Tel",
        },
        { completeWord: "గడియ", syllable: ["గ", "డియ"], audio: "boltM1Tel" },
        { completeWord: "చాకలి", syllable: ["చా", "కలి"], audio: "dhobiM1Tel" },
      ],
      P4: [
        {
          completeWord: "మిడత",
          syllable: ["మి", "డత"],
          audio: "grasshopperM1Tel",
        },
        { completeWord: "టోపీ", syllable: ["టో", "పీ"], audio: "capM1Tel" },
        {
          completeWord: "గది",
          syllable: ["గ", "ది"],
          audio: "room_M1Audio",
        },
        {
          completeWord: "తల",
          syllable: ["త", "ల"],
          audio: "head_M1Audio",
        },
        {
          completeWord: "నేల",
          syllable: ["నే", "ల"],
          audio: "floor_M1Audio",
        },
      ],
      S2: [
        {
          completeWord: "గోడ",
          syllable: ["గో", "డ"],
        },
        {
          completeWord: "తోట",
          syllable: ["తో", "ట"],
        },
        {
          completeWord: "దీపం",
          syllable: ["దీ", "పం"],
        },
        {
          completeWord: "నది",
          syllable: ["న", "ది"],
        },
        {
          completeWord: "కల",
          syllable: ["కల"],
        },
      ],
    },
    gu: {
      L1: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.Apple) || Assets.Apple,
          syllablesAudio: [
            {
              name: "Ap",
              audio: getAssetAudioUrl(s3Assets.apAudio) || Assets.apAudio,
            },
            {
              name: "ple",
              audio: getAssetAudioUrl(s3Assets.pleAudio) || Assets.pleAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.appleAudio) || Assets.appleAudio,
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.TigerNewImg) || Assets.TigerNewImg,
          syllablesAudio: [
            {
              name: "Ti",
              audio: getAssetAudioUrl(s3Assets.tiAudio) || Assets.tiAudio,
            },
            {
              name: "ger",
              audio: getAssetAudioUrl(s3Assets.gerAudio) || Assets.gerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tigerAudio) || Assets.tigerAudio,
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyImg) || Assets.happyImg,
          syllablesAudio: [
            {
              name: "Hap",
              audio: getAssetAudioUrl(s3Assets.hapAudio) || Assets.hapAudio,
            },
            {
              name: "py",
              audio: getAssetAudioUrl(s3Assets.pyAudio) || Assets.pyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.happyAudio) || Assets.happyAudio,
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilImg) || Assets.pencilImg,
          syllablesAudio: [
            {
              name: "Pen",
              audio: Assets.penAudio,
            },
            {
              name: "cil",
              audio: getAssetAudioUrl(s3Assets.cilAudio) || Assets.cilAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pencilAudio) || Assets.pencilAudio,
        },
        {
          completeWord: "Rocket",
          syllable: ["Rock", "et"],
          img: getAssetUrl(s3Assets.RocketNewImg) || Assets.RocketNewImg,
          syllablesAudio: [
            {
              name: "Rock",
              audio: getAssetAudioUrl(s3Assets.Rock) || Assets.Rock,
            },
            { name: "Et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RocketS) || Assets.RocketS,
        },
      ],
      L2: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.Basket) || Assets.Basket,
          syllablesAudio: [
            {
              name: "Bas",
              audio: getAssetAudioUrl(s3Assets.Bas) || Assets.Bas,
            },
            { name: "Ket", audio: Assets.Ket },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BasketS) || Assets.BasketS,
        },
        {
          completeWord: "Dinner",
          syllable: ["Din", "ner"],
          img: getAssetUrl(s3Assets.DinnerNewImg) || Assets.DinnerNewImg,
          syllablesAudio: [
            {
              name: "Din",
              audio: getAssetAudioUrl(s3Assets.dinAudio) || Assets.dinAudio,
            },
            {
              name: "ner",
              audio: getAssetAudioUrl(s3Assets.nerAudio) || Assets.nerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.dinnerAudio) || Assets.dinnerAudio,
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.WindowNewImg) || Assets.WindowNewImg,
          syllablesAudio: [
            {
              name: "Win",
              audio: getAssetAudioUrl(s3Assets.winAudio) || Assets.winAudio,
            },
            {
              name: "dow",
              audio: getAssetAudioUrl(s3Assets.dowAudio) || Assets.dowAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.windowAudio) || Assets.windowAudio,
        },
        {
          completeWord: "Magnet",
          syllable: ["Mag", "net"],
          img: getAssetUrl(s3Assets.MagnetNewImg) || Assets.MagnetNewImg,
          syllablesAudio: [
            {
              name: "Mag",
              audio: getAssetAudioUrl(s3Assets.magAudio) || Assets.magAudio,
            },
            {
              name: "net",
              audio: getAssetAudioUrl(s3Assets.netAudio) || Assets.netAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.magnetAudio) || Assets.magnetAudio,
        },
        {
          completeWord: "Tennis",
          syllable: ["Ten", "nis"],
          img: getAssetUrl(s3Assets.TennisNewImg) || Assets.TennisNewImg,
          syllablesAudio: [
            {
              name: "Ten",
              audio: getAssetAudioUrl(s3Assets.tenAudio) || Assets.tenAudio,
            },
            {
              name: "nis",
              audio: getAssetAudioUrl(s3Assets.nisAudio) || Assets.nisAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tennisAudio) || Assets.tennisAudio,
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಹಲ್ಲು", syllable: ["ಹಲ್", "ಲು"], audio: "teethM1Kan" },
        { completeWord: "ಕೋಪ", syllable: ["코", "ಪ"], audio: "angerM1Kan" },
        { completeWord: "ಕಪ್ಪೆ", syllable: ["ಕಪ್", "ಪೆ"], audio: "frogM1Kan" },
        { completeWord: "ಉಪ್ಪು", syllable: ["ಉಪ್", "ಪು"], audio: "saltM1Kan" },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatM1Kan" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaM1Kan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Picture",
          syllable: ["Pic", "ture"],
          img: getAssetUrl(s3Assets.PictureNewImg) || Assets.PictureNewImg,
          syllablesAudio: [
            {
              name: "Pic",
              audio: getAssetAudioUrl(s3Assets.picAudio) || Assets.picAudio,
            },
            {
              name: "ture",
              audio: getAssetAudioUrl(s3Assets.tureAudio) || Assets.tureAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pictureAudio) || Assets.pictureAudio,
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.NumberNewImg) || Assets.NumberNewImg,
          syllablesAudio: [
            {
              name: "Num",
              audio: getAssetAudioUrl(s3Assets.numAudio) || Assets.numAudio,
            },
            {
              name: "ber",
              audio: getAssetAudioUrl(s3Assets.berAudio) || Assets.berAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.numberAudio) || Assets.numberAudio,
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.DoctorNewImg) || Assets.DoctorNewImg,
          syllablesAudio: [
            {
              name: "Doc",
              audio: getAssetAudioUrl(s3Assets.docAudio) || Assets.docAudio,
            },
            {
              name: "tor",
              audio: getAssetAudioUrl(s3Assets.torAudio) || Assets.torAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.doctorAudio) || Assets.doctorAudio,
        },
        {
          completeWord: "Paper",
          syllable: ["Pa", "per"],
          img:
            getAssetUrl(s3Assets.questionPaperImg) || Assets.questionPaperImg,
          syllablesAudio: [
            {
              name: "Pa",
              audio: getAssetAudioUrl(s3Assets.paAudio) || Assets.paAudio,
            },
            {
              name: "per",
              audio: getAssetAudioUrl(s3Assets.perAudio) || Assets.perAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.paperAudio) || Assets.paperAudio,
        },
        {
          completeWord: "Monkey",
          syllable: ["Mon", "key"],
          img: getAssetUrl(s3Assets.MonkeyNewImg) || Assets.MonkeyNewImg,
          syllablesAudio: [
            {
              name: "Mon",
              audio: getAssetAudioUrl(s3Assets.monAudio) || Assets.monAudio,
            },
            {
              name: "key",
              audio: getAssetAudioUrl(s3Assets.keyAudio) || Assets.keyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.monkeyAudio) || Assets.monkeyAudio,
        },
      ],
      L4: [
        {
          completeWord: "Garden",
          syllable: ["Gar", "den"],
          img: getAssetUrl(s3Assets.gardenImg) || Assets.GardenNewImg,
          syllablesAudio: [
            {
              name: "Gar",
              audio: getAssetAudioUrl(s3Assets.garAudio) || Assets.garAudio,
            },
            {
              name: "den",
              audio: getAssetAudioUrl(s3Assets.denAudio) || Assets.denAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.GardenAudio) || Assets.GardenAudio,
        },
        {
          completeWord: "Helmet",
          syllable: ["Hel", "met"],
          img: getAssetUrl(s3Assets.helmetImg) || Assets.helmetImg,
          syllablesAudio: [
            {
              name: "Hel",
              audio: getAssetAudioUrl(s3Assets.helAudio) || Assets.helAudio,
            },
            {
              name: "met",
              audio: getAssetAudioUrl(s3Assets.metAudio) || Assets.metAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.helmetAudio) || Assets.helmetAudio,
        },
        {
          completeWord: "Kitten",
          syllable: ["Kit", "ten"],
          img: getAssetUrl(s3Assets.catImage) || Assets.catImage,
          syllablesAudio: [
            {
              name: "Kit",
              audio: getAssetAudioUrl(s3Assets.Kit) || Assets.Kit,
            },
            {
              name: "ten",
              audio: getAssetAudioUrl(s3Assets.Ten) || Assets.Ten,
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.KittenS) || Assets.KittenS,
        },
        {
          completeWord: "Jacket",
          syllable: ["Jack", "et"],
          img: getAssetUrl(s3Assets.Jacket) || Assets.Jacket,
          syllablesAudio: [
            {
              name: "Jack",
              audio: getAssetAudioUrl(s3Assets.Jack) || Assets.Jack,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.JacketS) || Assets.JacketS,
        },
        {
          completeWord: "Pocket",
          syllable: ["Pock", "et"],
          img: getAssetUrl(s3Assets.pocketImage) || Assets.pocketImage,
          syllablesAudio: [
            {
              name: "Pock",
              audio: getAssetAudioUrl(s3Assets.Pock) || Assets.Pock,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.PocketS) || Assets.PocketS,
        },
      ],
      P3: [
        { completeWord: "ಹಕ್ಕಿ", syllable: ["ಹಕ್", "ಕಿ"], audio: "birdM1Kan" },
        {
          completeWord: "ಗುಬ್ಬಿ",
          syllable: ["ಗುಬ್", "ಬಿ"],
          audio: "sparrowM1Kan",
        },
        { completeWord: "ಹಣ್ಣು", syllable: ["ಹಣ್", "ಣು"], audio: "fruitM1Kan" },
        { completeWord: "ಸುಣ್ಣ", syllable: ["ಸುಣ್", "ಣ"], audio: "limeM1Kan" },
        {
          completeWord: "ಬುಟ್ಟಿ",
          syllable: ["ಬುಟ್", "ಟಿ"],
          audio: "basketM1Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಹಬ್ಬ",
          syllable: ["ಹಬ್", "ಬ"],
          audio: "festivalM1Kan",
        },
        { completeWord: "ಲಡ್ಡು", syllable: ["ಲಡ್", "ಡು"], audio: "ladduM1Kan" },
        { completeWord: "ಹದ್ದು", syllable: ["ಹದ್", "ದು"], audio: "eagleM1Kan" },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
    or: {
      L1: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.Apple) || Assets.Apple,
          syllablesAudio: [
            {
              name: "Ap",
              audio: getAssetAudioUrl(s3Assets.apAudio) || Assets.apAudio,
            },
            {
              name: "ple",
              audio: getAssetAudioUrl(s3Assets.pleAudio) || Assets.pleAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.appleAudio) || Assets.appleAudio,
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.TigerNewImg) || Assets.TigerNewImg,
          syllablesAudio: [
            {
              name: "Ti",
              audio: getAssetAudioUrl(s3Assets.tiAudio) || Assets.tiAudio,
            },
            {
              name: "ger",
              audio: getAssetAudioUrl(s3Assets.gerAudio) || Assets.gerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tigerAudio) || Assets.tigerAudio,
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyImg) || Assets.happyImg,
          syllablesAudio: [
            {
              name: "Hap",
              audio: getAssetAudioUrl(s3Assets.hapAudio) || Assets.hapAudio,
            },
            {
              name: "py",
              audio: getAssetAudioUrl(s3Assets.pyAudio) || Assets.pyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.happyAudio) || Assets.happyAudio,
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilImg) || Assets.pencilImg,
          syllablesAudio: [
            {
              name: "Pen",
              audio: Assets.penAudio,
            },
            {
              name: "cil",
              audio: getAssetAudioUrl(s3Assets.cilAudio) || Assets.cilAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pencilAudio) || Assets.pencilAudio,
        },
        {
          completeWord: "Rocket",
          syllable: ["Rock", "et"],
          img: getAssetUrl(s3Assets.RocketNewImg) || Assets.RocketNewImg,
          syllablesAudio: [
            {
              name: "Rock",
              audio: getAssetAudioUrl(s3Assets.Rock) || Assets.Rock,
            },
            { name: "Et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RocketS) || Assets.RocketS,
        },
      ],
      L2: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.Basket) || Assets.Basket,
          syllablesAudio: [
            {
              name: "Bas",
              audio: getAssetAudioUrl(s3Assets.Bas) || Assets.Bas,
            },
            { name: "Ket", audio: Assets.Ket },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BasketS) || Assets.BasketS,
        },
        {
          completeWord: "Dinner",
          syllable: ["Din", "ner"],
          img: getAssetUrl(s3Assets.DinnerNewImg) || Assets.DinnerNewImg,
          syllablesAudio: [
            {
              name: "Din",
              audio: getAssetAudioUrl(s3Assets.dinAudio) || Assets.dinAudio,
            },
            {
              name: "ner",
              audio: getAssetAudioUrl(s3Assets.nerAudio) || Assets.nerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.dinnerAudio) || Assets.dinnerAudio,
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.WindowNewImg) || Assets.WindowNewImg,
          syllablesAudio: [
            {
              name: "Win",
              audio: getAssetAudioUrl(s3Assets.winAudio) || Assets.winAudio,
            },
            {
              name: "dow",
              audio: getAssetAudioUrl(s3Assets.dowAudio) || Assets.dowAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.windowAudio) || Assets.windowAudio,
        },
        {
          completeWord: "Magnet",
          syllable: ["Mag", "net"],
          img: getAssetUrl(s3Assets.MagnetNewImg) || Assets.MagnetNewImg,
          syllablesAudio: [
            {
              name: "Mag",
              audio: getAssetAudioUrl(s3Assets.magAudio) || Assets.magAudio,
            },
            {
              name: "net",
              audio: getAssetAudioUrl(s3Assets.netAudio) || Assets.netAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.magnetAudio) || Assets.magnetAudio,
        },
        {
          completeWord: "Tennis",
          syllable: ["Ten", "nis"],
          img: getAssetUrl(s3Assets.TennisNewImg) || Assets.TennisNewImg,
          syllablesAudio: [
            {
              name: "Ten",
              audio: getAssetAudioUrl(s3Assets.tenAudio) || Assets.tenAudio,
            },
            {
              name: "nis",
              audio: getAssetAudioUrl(s3Assets.nisAudio) || Assets.nisAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tennisAudio) || Assets.tennisAudio,
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಹಲ್ಲು", syllable: ["ಹಲ್", "ಲು"], audio: "teethM1Kan" },
        { completeWord: "ಕೋಪ", syllable: ["코", "ಪ"], audio: "angerM1Kan" },
        { completeWord: "ಕಪ್ಪೆ", syllable: ["ಕಪ್", "ಪೆ"], audio: "frogM1Kan" },
        { completeWord: "ಉಪ್ಪು", syllable: ["ಉಪ್", "ಪು"], audio: "saltM1Kan" },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatM1Kan" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaM1Kan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Picture",
          syllable: ["Pic", "ture"],
          img: getAssetUrl(s3Assets.PictureNewImg) || Assets.PictureNewImg,
          syllablesAudio: [
            {
              name: "Pic",
              audio: getAssetAudioUrl(s3Assets.picAudio) || Assets.picAudio,
            },
            {
              name: "ture",
              audio: getAssetAudioUrl(s3Assets.tureAudio) || Assets.tureAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pictureAudio) || Assets.pictureAudio,
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.NumberNewImg) || Assets.NumberNewImg,
          syllablesAudio: [
            {
              name: "Num",
              audio: getAssetAudioUrl(s3Assets.numAudio) || Assets.numAudio,
            },
            {
              name: "ber",
              audio: getAssetAudioUrl(s3Assets.berAudio) || Assets.berAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.numberAudio) || Assets.numberAudio,
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.DoctorNewImg) || Assets.DoctorNewImg,
          syllablesAudio: [
            {
              name: "Doc",
              audio: getAssetAudioUrl(s3Assets.docAudio) || Assets.docAudio,
            },
            {
              name: "tor",
              audio: getAssetAudioUrl(s3Assets.torAudio) || Assets.torAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.doctorAudio) || Assets.doctorAudio,
        },
        {
          completeWord: "Paper",
          syllable: ["Pa", "per"],
          img:
            getAssetUrl(s3Assets.questionPaperImg) || Assets.questionPaperImg,
          syllablesAudio: [
            {
              name: "Pa",
              audio: getAssetAudioUrl(s3Assets.paAudio) || Assets.paAudio,
            },
            {
              name: "per",
              audio: getAssetAudioUrl(s3Assets.perAudio) || Assets.perAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.paperAudio) || Assets.paperAudio,
        },
        {
          completeWord: "Monkey",
          syllable: ["Mon", "key"],
          img: getAssetUrl(s3Assets.MonkeyNewImg) || Assets.MonkeyNewImg,
          syllablesAudio: [
            {
              name: "Mon",
              audio: getAssetAudioUrl(s3Assets.monAudio) || Assets.monAudio,
            },
            {
              name: "key",
              audio: getAssetAudioUrl(s3Assets.keyAudio) || Assets.keyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.monkeyAudio) || Assets.monkeyAudio,
        },
      ],
      L4: [
        {
          completeWord: "Garden",
          syllable: ["Gar", "den"],
          img: getAssetUrl(s3Assets.gardenImg) || Assets.GardenNewImg,
          syllablesAudio: [
            {
              name: "Gar",
              audio: getAssetAudioUrl(s3Assets.garAudio) || Assets.garAudio,
            },
            {
              name: "den",
              audio: getAssetAudioUrl(s3Assets.denAudio) || Assets.denAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.GardenAudio) || Assets.GardenAudio,
        },
        {
          completeWord: "Helmet",
          syllable: ["Hel", "met"],
          img: getAssetUrl(s3Assets.helmetImg) || Assets.helmetImg,
          syllablesAudio: [
            {
              name: "Hel",
              audio: getAssetAudioUrl(s3Assets.helAudio) || Assets.helAudio,
            },
            {
              name: "met",
              audio: getAssetAudioUrl(s3Assets.metAudio) || Assets.metAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.helmetAudio) || Assets.helmetAudio,
        },
        {
          completeWord: "Kitten",
          syllable: ["Kit", "ten"],
          img: getAssetUrl(s3Assets.catImage) || Assets.catImage,
          syllablesAudio: [
            {
              name: "Kit",
              audio: getAssetAudioUrl(s3Assets.Kit) || Assets.Kit,
            },
            {
              name: "ten",
              audio: getAssetAudioUrl(s3Assets.Ten) || Assets.Ten,
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.KittenS) || Assets.KittenS,
        },
        {
          completeWord: "Jacket",
          syllable: ["Jack", "et"],
          img: getAssetUrl(s3Assets.Jacket) || Assets.Jacket,
          syllablesAudio: [
            {
              name: "Jack",
              audio: getAssetAudioUrl(s3Assets.Jack) || Assets.Jack,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.JacketS) || Assets.JacketS,
        },
        {
          completeWord: "Pocket",
          syllable: ["Pock", "et"],
          img: getAssetUrl(s3Assets.pocketImage) || Assets.pocketImage,
          syllablesAudio: [
            {
              name: "Pock",
              audio: getAssetAudioUrl(s3Assets.Pock) || Assets.Pock,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.PocketS) || Assets.PocketS,
        },
      ],
      P3: [
        { completeWord: "ಹಕ್ಕಿ", syllable: ["ಹಕ್", "ಕಿ"], audio: "birdM1Kan" },
        {
          completeWord: "ಗುಬ್ಬಿ",
          syllable: ["ಗುಬ್", "ಬಿ"],
          audio: "sparrowM1Kan",
        },
        { completeWord: "ಹಣ್ಣು", syllable: ["ಹಣ್", "ಣು"], audio: "fruitM1Kan" },
        { completeWord: "ಸುಣ್ಣ", syllable: ["ಸುಣ್", "ಣ"], audio: "limeM1Kan" },
        {
          completeWord: "ಬುಟ್ಟಿ",
          syllable: ["ಬುಟ್", "ಟಿ"],
          audio: "basketM1Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಹಬ್ಬ",
          syllable: ["ಹಬ್", "ಬ"],
          audio: "festivalM1Kan",
        },
        { completeWord: "ಲಡ್ಡು", syllable: ["ಲಡ್", "ಡು"], audio: "ladduM1Kan" },
        { completeWord: "ಹದ್ದು", syllable: ["ಹದ್", "ದು"], audio: "eagleM1Kan" },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
  };

  const levelTwo = {
    en: {
      P1: [
        {
          completeWord: "Joyful",
          syllable: ["Joy", "ful"],
          audio: "joyfulM2Eng",
        },
        {
          completeWord: "Brothers",
          syllable: ["Bro", "thers"],
          audio: "brothersM2Eng",
        },
        { completeWord: "Cheer", syllable: ["Che", "er"], audio: "cheerM2Eng" },
        {
          completeWord: "Stitch",
          syllable: ["Sti", "tch"],
          audio: "stichM2Eng",
        },
        {
          completeWord: "Monument",
          syllable: ["Monu", "ment"],
          audio: "monumentM2Eng",
        },
      ],
      P2: [
        {
          completeWord: "Lecturer",
          syllable: ["Lec", "turer"],
          audio: "lecturerM2Eng",
        },
        {
          completeWord: "Curious",
          syllable: ["Cu", "rious"],
          audio: "curiousM2Eng",
        },
        {
          completeWord: "Notebook",
          syllable: ["Note", "book"],
          audio: "notebookM2Eng",
        },
        {
          completeWord: "Grandfather",
          syllable: ["Grand", "father"],
          audio: "grandfatherM2Eng",
        },
        { completeWord: "House", syllable: ["Hou", "se"], audio: "houseM2Eng" },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        { completeWord: "Sound", syllable: ["Sou", "nd"], audio: "soundM2Eng" },
        { completeWord: "Women", syllable: ["Wo", "men"], audio: "womenM2Eng" },
        { completeWord: "Beach", syllable: ["Bea", "ch"], audio: "beachM2Eng" },
        {
          completeWord: "Jackfruit",
          syllable: ["Jack", "fruit"],
          audio: "jackfruitM2Eng",
        },
        {
          completeWord: "Branch",
          syllable: ["Bra", "nch"],
          audio: "branchM2Eng",
        },
      ],
      P4: [
        {
          completeWord: "Mathematics",
          syllable: ["Mathe", "matics"],
          audio: "mathematicsM2Eng",
        },
        {
          completeWord: "Warriors",
          syllable: ["War", "riors"],
          audio: "warriorsM2Eng",
        },
        {
          completeWord: "Sandcastle",
          syllable: ["Sand", "castle"],
          audio: "sandcastleM2Eng",
        },
        {
          completeWord: "Cooking",
          syllable: ["Cook", "ing"],
          audio: "cookingM2Eng",
        },
        {
          completeWord: "Champion",
          syllable: ["Cham", "pion"],
          audio: "championM2Eng",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    hi: {
      P1: [
        {
          completeWord: "पृथ्वी",
          syllable: ["पृथ्", "वी"],
          audio: "prithviM2Hin",
        },
        {
          completeWord: "शिक्षक",
          syllable: ["शिक्ष", "क"],
          audio: "shikshakM2Hin",
        },
        { completeWord: "सर्दी", syllable: ["सर", "दी"], audio: "sardiM2Hin" },
        {
          completeWord: "चिकित्सा",
          syllable: ["चि", "कित्सा"],
          audio: "chikitsaM2Hin",
        },
        {
          completeWord: "मुर्गा",
          syllable: ["मुर", "गा"],
          audio: "murgaM2Hin",
        },
      ],
      P2: [
        {
          completeWord: "बत्तख",
          syllable: ["बत्", "तख"],
          audio: "battakhM2Hin",
        },
        {
          completeWord: "पत्थर",
          syllable: ["पत्", "थर"],
          audio: "pattharM2Hin",
        },
        {
          completeWord: "बिस्किट",
          syllable: ["बिस्", "किट"],
          audio: "biscuitM2Hin",
        },
        {
          completeWord: "कुल्फी",
          syllable: ["कुल", "फी"],
          audio: "kulfiM2Hin",
        },
        {
          completeWord: "बिस्तर",
          syllable: ["बिस्", "तर"],
          audio: "bistarM2Hin",
        },
      ],
      S1: [
        { completeWord: "शिक्षक", syllable: ["Rai", "ny"] },
        { completeWord: "मोबाइल", syllable: ["Pic", "ture"] },
        { completeWord: "बत्तख", syllable: ["Sun", "day"] },
        { completeWord: "पुष्प", syllable: ["Mor", "ning"] },
        { completeWord: "डॉक्टर", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "खरगोश",
          syllable: ["खर", "गोश"],
          audio: "khargoshM2Hin",
        },
        {
          completeWord: "फूलदान",
          syllable: ["फूल", "दान"],
          audio: "phooldanM2Hin",
        },
        {
          completeWord: "गिलहरी",
          syllable: ["गिल", "हरी"],
          audio: "gilhariM2Hin",
        },
        {
          completeWord: "इलायची",
          syllable: ["इला", "इची"],
          audio: "elaichiM2Hin",
        },
        {
          completeWord: "खरबूज़ा",
          syllable: ["खर", "बूज़ा"],
          audio: "kharboozaM2Hin",
        },
      ],
      P4: [
        {
          completeWord: "नारियल",
          syllable: ["ना", "रियल"],
          audio: "nariyalM2Hin",
        },
        {
          completeWord: "चॉकलेट",
          syllable: ["चॉक", "लेट"],
          audio: "chocolateM2Hin",
        },
        {
          completeWord: "साइकिल",
          syllable: ["साइ", "किल"],
          audio: "cycleM2Hin",
        },
        {
          completeWord: "फुटबॉल",
          syllable: ["फुट", "बॉल"],
          audio: "footballM2Hin",
        },
        {
          completeWord: "लहसुन",
          syllable: ["लह", "सुन"],
          audio: "lahsunM2Hin",
        },
      ],
      S2: [
        { completeWord: "फूलदान", syllable: ["Cow", "ard"] },
        { completeWord: "चॉकलेट", syllable: ["Lad", "der"] },
        { completeWord: "कृष्ण", syllable: ["Ri", "ver"] },
        { completeWord: "सर्कस", syllable: ["Peo", "ple"] },
        { completeWord: "मिर्च", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    ta: {
      P1: [
        {
          completeWord: "கொட்டை",
          syllable: ["கொ", "ட்டை"],
          audio: "castleM2Tam",
        },
        { completeWord: "தங்கு", syllable: ["தங்", "கு"], audio: "bearM2Tam" },
        { completeWord: "நர்ஸ்", syllable: ["நர்", "ஸ்"], audio: "nurseM2Tam" },
        { completeWord: "லட்டு", syllable: ["லட்", "டு"], audio: "ladduM2Tam" },
        {
          completeWord: "பாட்டு",
          syllable: ["பா", "ட்டு"],
          audio: "songM2Tam",
        },
      ],
      P2: [
        {
          completeWord: "சைக்கிள்",
          syllable: ["சை", "க்கிள்"],
          audio: "cycleM2Tam",
        },
        {
          completeWord: "புட்டி",
          syllable: ["பு", "ட்டி"],
          audio: "bottleM2Tam",
        },
        {
          completeWord: "மிட்டாய்",
          syllable: ["மிட்", "டாய்"],
          audio: "sweetsM2Tam",
        },
        {
          completeWord: "காத்தாடி",
          syllable: ["காத்", "தாடி"],
          audio: "kiteM2Tam",
        },
        {
          completeWord: "வேப்பிலை",
          syllable: ["வேப்", "பிலை"],
          audio: "neemM2Tam",
        },
      ],
      S1: [
        { completeWord: "தங்கு", syllable: ["Rai", "ny"] },
        { completeWord: "புட்டி", syllable: ["Pic", "ture"] },
        { completeWord: "மூன்று", syllable: ["Sun", "day"] },
        { completeWord: "சீப்பு", syllable: ["Mor", "ning"] },
        { completeWord: "உப்பு", syllable: ["Eve", "ning"] },
      ],
      P3: [
        { completeWord: "தொப்பி", syllable: ["தொப்", "பி"], audio: "capM2Tam" },
        {
          completeWord: "பல்லி",
          syllable: ["பல்", "லி"],
          audio: "lizardM2Tam",
        },
        {
          completeWord: "பூண்டு",
          syllable: ["பூண்", "டு"],
          audio: "garlicM2Tam",
        },
        { completeWord: "பெட்டி", syllable: ["பெட்", "டி"], audio: "boxM2Tam" },
        {
          completeWord: "போர்வை",
          syllable: ["போர்", "வை"],
          audio: "blanketM2Tam",
        },
      ],
      P4: [
        {
          completeWord: "குர்தா",
          syllable: ["குர்", "தா"],
          audio: "kurtaM2Tam",
        },
        {
          completeWord: "நெற்றி",
          syllable: ["நெ", "ற்றி"],
          audio: "foreheadM2Tam",
        },
        { completeWord: "பந்து", syllable: ["பன்", "து"], audio: "ballM2Tam" },
        {
          completeWord: "பூட்டு",
          syllable: ["பூ", "ட்டு"],
          audio: "lockM2Tam",
        },
        {
          completeWord: "குச்சி",
          syllable: ["கு", "ச்சி"],
          audio: "stickM2Tam",
        },
      ],
      S2: [
        { completeWord: "பூண்டு", syllable: ["Cow", "ard"] },
        { completeWord: "பந்து", syllable: ["Lad", "der"] },
        { completeWord: "கத்தி", syllable: ["Ri", "ver"] },
        { completeWord: "பாம்பு", syllable: ["Peo", "ple"] },
        { completeWord: "தட்டு", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    kn: {
      P1: [
        { completeWord: "ರವಿ", syllable: ["ರ", "ವಿ"], audio: "Ravi_Sun" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ಹಸಿರು", syllable: ["ಹಸಿ", "ರು"], audio: "greenKan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["Rai", "ny"] },
        { completeWord: "ವಾಚ್", syllable: ["Pic", "ture"] },
        { completeWord: "ತರಕಾರಿ", syllable: ["Sun", "day"] },
        { completeWord: "ಗಾಳಿಪಟ", syllable: ["Mor", "ning"] },
        { completeWord: "ದಾಸವಾಳ", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "ಉಣ್ಣೆ", syllable: ["Cow", "ard"] },
        { completeWord: "ಕತ್ತೆ", syllable: ["Lad", "der"] },
        { completeWord: "ಪುಸ್ತಕ", syllable: ["Ri", "ver"] },
        { completeWord: "ಬೆಕ್ಕು", syllable: ["Peo", "ple"] },
        { completeWord: "ಜೀಬ್ರಾ", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    te: {
      P1: [
        { completeWord: "పక్షి", syllable: ["ప", "క్షి"], audio: "birdM2Tel" },
        {
          completeWord: "బొప్పాయి",
          syllable: ["బొ", "ప్పాయి"],
          audio: "papayaM2Tel",
        },
        {
          completeWord: "కుమ్మరి",
          syllable: ["కుమ్", "మరి"],
          audio: "potterM2Tel",
        },
        {
          completeWord: "చాకలెట్టు",
          syllable: ["చా", "కలెట్టు"],
          audio: "chocolateM2Tel",
        },
        {
          completeWord: "ఉల్లిపాయ",
          syllable: ["ఉల్లి", "పాయ"],
          audio: "onionM2Tel",
        },
      ],
      P2: [
        {
          completeWord: "జీబ్రా",
          syllable: ["జీ", "బ్రా"],
          audio: "zebraM2Tel",
        },
        {
          completeWord: "దానిమ్మ",
          syllable: ["దా", "నిమ్మ"],
          audio: "pomegranateM2Tel",
        },
        { completeWord: "అంగడి", syllable: ["అం", "గడి"], audio: "shopM2Tel" },
        {
          completeWord: "నొప్పి",
          syllable: ["నొ", "ప్పి"],
          audio: "painM2Tel",
        },
        {
          completeWord: "బియ్యం",
          syllable: ["బియ్", "యం"],
          audio: "riceM2Tel",
        },
      ],
      S1: [
        { completeWord: "తేనెటీగ", syllable: ["తేనె", "టీగ"] },
        { completeWord: "పన్ను", syllable: ["పన్", "ను"] },
        { completeWord: "ముక్కు", syllable: ["ముక్", "కు"] },
        { completeWord: "చొక్కా", syllable: ["చొ", "క్కా"] },
        { completeWord: "పిల్లి", syllable: ["పిల్", "లి"] },
      ],
      P3: [
        {
          completeWord: "దువ్వెన",
          syllable: ["దు", "వ్వెన"],
          audio: "combM2Tel",
        },
        {
          completeWord: "జీలకర్ర",
          syllable: ["జీ", "లకర్ర"],
          audio: "cuminjeeraM2Tel",
        },
        {
          completeWord: "ఉయ్యాల",
          syllable: ["ఉ", "య్యాల"],
          audio: "swingM2Tel",
        },
        {
          completeWord: "గొర్రె",
          syllable: ["గొ", "ర్రె"],
          audio: "sheepM2Tel",
        },
        {
          completeWord: "గిన్నె",
          syllable: ["గి", "న్నె"],
          audio: "vesselM2Tel",
        },
      ],
      P4: [
        {
          completeWord: "కత్తెర",
          syllable: ["కత్", "తెర"],
          audio: "scissorsM2Tel",
        },
        {
          completeWord: "అబ్బాయి",
          syllable: ["అబ్", "బాయి"],
          audio: "boyM2Tel",
        },
        {
          completeWord: "మల్లె",
          syllable: ["మల్", "లె"],
          audio: "jasmineM2Tel",
        },
        { completeWord: "ఖడ్గం", syllable: ["ఖడ్", "గం"], audio: "swordM2Tel" },
        { completeWord: "పెట్టె", syllable: ["పె", "ట్టె"], audio: "boxM2Tel" },
      ],
      S2: [
        { completeWord: "గొడ్డలి", syllable: ["గొడ్", "డలి"] },
        { completeWord: "అత్తి", syllable: ["అత్", "తి"] },
        { completeWord: "కొబ్బరి", syllable: ["కొబ్", "బరి"] },
        { completeWord: "సున్నం", syllable: ["సున్", "నం"] },
        { completeWord: "సుత్తి", syllable: ["సుత్", "తి"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    gu: {
      P1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["ಸೂ", "ರ್ಯ"], audio: "sunM2Kan" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ವಾಚ್", syllable: ["ವಾ", "ಚ್"], audio: "watchM2Kan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    or: {
      P1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["ಸೂ", "ರ್ಯ"], audio: "sunM2Kan" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ವಾಚ್", syllable: ["ವಾ", "ಚ್"], audio: "watchM2Kan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
  };

  const levelThree = {
    en: {
      P1: [
        { completeWord: "I run.", syllable: ["I", "run."], audio: "iRun" },
        {
          completeWord: "We play.",
          syllable: ["We", "play."],
          audio: "wePlay",
        },
        {
          completeWord: "She reads.",
          syllable: ["She", "reads."],
          audio: "sheReads",
        },
        {
          completeWord: "He eats.",
          syllable: ["He", "eats."],
          audio: "heEats",
        },
        {
          completeWord: "They jump.",
          syllable: ["They", "jump."],
          audio: "theyJump",
        },
      ],
      P2: [
        {
          completeWord: "We walk.",
          syllable: ["We", "walk."],
          audio: "weWalk",
        },
        {
          completeWord: "I sleep.",
          syllable: ["I", "sleep."],
          audio: "iSleep",
        },
        {
          completeWord: "You swim.",
          syllable: ["You", "swim."],
          audio: "youSwim",
        },
        {
          completeWord: "She sings.",
          syllable: ["She", "sings."],
          audio: "sheSings",
        },
        {
          completeWord: "He dances.",
          syllable: ["He", "dances."],
          audio: "heDances",
        },
      ],
      P3: [
        {
          completeWord: "It rains.",
          syllable: ["It", "rains."],
          audio: "itRains",
        },
        { completeWord: "We win.", syllable: ["We", "win."], audio: "weWin" },
        {
          completeWord: "You cook.",
          syllable: ["You", "cook."],
          audio: "youCook",
        },
        {
          completeWord: "They laugh.",
          syllable: ["They", "laugh."],
          audio: "theyLaugh",
        },
        {
          completeWord: "I dream.",
          syllable: ["I", "dream."],
          audio: "iDream",
        },
      ],
      P4: [
        {
          completeWord: "You learn.",
          syllable: ["You", "learn."],
          audio: "youLearn",
        },
        {
          completeWord: "We talk.",
          syllable: ["We", "talk."],
          audio: "weTalks",
        },
        {
          completeWord: "He listens.",
          syllable: ["He", "listens."],
          audio: "heListens",
        },
        {
          completeWord: "She smiles.",
          syllable: ["She", "smiles."],
          audio: "sheSmiles",
        },
        {
          completeWord: "Birds fly.",
          syllable: ["Birds", "fly."],
          audio: "birdsFly",
        },
      ],
      S1: [
        { completeWord: "Cats meow.", syllable: ["Cats", "meow."] },
        { completeWord: "Dogs bark.", syllable: ["Dogs", "bark."] },
        { completeWord: "Fish swims.", syllable: ["Fish", "swims."] },
        { completeWord: "The sun shines.", syllable: ["Sun", "shines."] },
        { completeWord: "Stars twinkle.", syllable: ["Stars", "twinkle."] },
      ],
      S2: [
        { completeWord: "Baby cries.", syllable: ["Baby", "cries."] },
        { completeWord: "Fire burns.", syllable: ["Fire", "burns."] },
        { completeWord: "Flowers bloom.", syllable: ["Flowers", "bloom."] },
        { completeWord: "Wind blows.", syllable: ["Wind", "blows."] },
        { completeWord: "Bells ring.", syllable: ["Bells", "ring."] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    hi: {
      P1: [
        {
          completeWord: "शहर का बग़ीचा",
          syllable: ["शहर का", "बग़ीचा"],
          audio: "shaharkabageechaM3Hin",
        },
        {
          completeWord: "खेतों की सैर",
          syllable: ["खेतों की", "सैर"],
          audio: "khetonkisairM3Hin",
        },
        {
          completeWord: "इकट्ठा करना",
          syllable: ["इकट्ठा", "करना"],
          audio: "ikathhakarnaM3Hin",
        },
        {
          completeWord: "हवाई अड्डा",
          syllable: ["हवाई", "अड्डा"],
          audio: "hawaiaddaM3Hin",
        },
        {
          completeWord: "ऑटो रिक्शा",
          syllable: ["ऑटो", "रिक्शा"],
          audio: "autorickshawM3Hin",
        },
      ],
      P2: [
        {
          completeWord: "शयन कक्ष",
          syllable: ["शयन", "कक्ष"],
          audio: "shayankakshM3Hin",
        },
        {
          completeWord: "ब्रश करना",
          syllable: ["ब्रश", "करना"],
          audio: "brushkarnaM3Hin",
        },
        {
          completeWord: "माचिस की डिब्बी",
          syllable: ["माचिस की", "डिब्बी"],
          audio: "machiskidibbiM3Hin",
        },
        {
          completeWord: "लोहे का बक्सा",
          syllable: ["लोहे का", "बक्सा"],
          audio: "lohekabaksaM3Hin",
        },
        {
          completeWord: "बड़ों को प्रणाम",
          syllable: ["बड़ों को", "प्रणाम"],
          audio: "badonkopranamM3Hin",
        },
      ],
      P3: [
        {
          completeWord: "आधी रात",
          syllable: ["आधी", "रात"],
          audio: "aadhiraatM3Hin",
        },
        {
          completeWord: "उदास करना",
          syllable: ["उदास", "करना"],
          audio: "udaaskarnaM3Hin",
        },
        {
          completeWord: "सूख जाना",
          syllable: ["सूख", "जाना"],
          audio: "sookhjanaM3Hin",
        },
        {
          completeWord: "तैयार करना",
          syllable: ["तैयार", "करना"],
          audio: "taiyarkarnaM3Hin",
        },
        {
          completeWord: "कितने बजे हैं?",
          syllable: ["कितने", "बजे हैं?"],
          audio: "kitnebajehainM3Hin",
        },
      ],
      P4: [
        {
          completeWord: "चिड़िया छोटी है",
          syllable: ["चिड़िया", "छोटी है"],
          audio: "chidiyachhotihaiM3Hin",
        },
        {
          completeWord: "प्रतीक्षा करना",
          syllable: ["प्रतीक्षा", "करना"],
          audio: "prateekshakarnaM3Hin",
        },
        {
          completeWord: "तुम्हारा मित्र",
          syllable: ["तुम्हारा", "मित्र"],
          audio: "tumharamitraM3Hin",
        },
        {
          completeWord: "स्कूल की छुट्टी",
          syllable: ["स्कूल की", "छुट्टी"],
          audio: "schoolkichhuttiM3Hin",
        },
        {
          completeWord: "आशीर्वाद देना",
          syllable: ["आशीर्वाद", "देना"],
          audio: "aashirvaaddenaM3Hin",
        },
      ],
      S1: [
        { completeWord: "गपशप", syllable: ["गप", "शप"] },
        { completeWord: "गरम करना", syllable: ["गरम", "करना"] },
        { completeWord: "वजन करना", syllable: ["वजन", "करना"] },
        { completeWord: "बंद करना", syllable: ["बंद", "करना"] },
        { completeWord: "चोट लगना", syllable: ["चोट", "लगना"] },
      ],
      S2: [
        { completeWord: "आनंद करना", syllable: ["आनंद", "करना"] },
        { completeWord: "पीछा करना", syllable: ["पीछा", "करना"] },
        { completeWord: "परिचय करना", syllable: ["परिचय", "करना"] },
        { completeWord: "पशु चराना", syllable: ["पशु", "चराना"] },
        { completeWord: "मोटर गाड़ी", syllable: ["मोटर", "गाड़ी"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    ta: {
      P1: [
        {
          completeWord: "ஈர மண்",
          syllable: ["ஈர", "மண்"],
          audio: "wetsoilM3Tam",
        },
        {
          completeWord: "உடல்நிலை குறைவு",
          syllable: ["உடல்நிலை", "குறைவு"],
          audio: "poorhealthM3Tam",
        },
        {
          completeWord: "சுவையான உணவு",
          syllable: ["சுவையான", "உணவு"],
          audio: "adeliciousmealM3Tam",
        },
        {
          completeWord: "அவன் பால் குடித்தான்",
          syllable: ["அவன் பால்", "குடித்தான்"],
          audio: "hedrankmilkM3Tam",
        },
        {
          completeWord: "அவள் பூக்களைப் பறித்தாள்",
          syllable: ["அவள் பூக்களைப்", "பறித்தாள்"],
          audio: "shepickedflowersM3Tam",
        },
      ],
      P2: [
        {
          completeWord: "நாய் குரைக்கிறது",
          syllable: ["நாய்", "குரைக்கிறது"],
          audio: "thedogisbarkingM3Tam",
        },
        {
          completeWord: "நன்றி நண்பா",
          syllable: ["நன்றி", "நண்பா"],
          audio: "thankyoufriendM3Tam",
        },
        {
          completeWord: "நான் வருகிறேன்",
          syllable: ["நான்", "வருகிறேன்"],
          audio: "iamcomingM3Tam",
        },
        {
          completeWord: "தவளை வந்தது",
          syllable: ["தவளை", "வந்தது"],
          audio: "thefrogcameM3Tam",
        },
        {
          completeWord: "ஒரு கழுதை வந்தது",
          syllable: ["ஒரு கழுதை", "வந்தது"],
          audio: "adonkeycameM3Tam",
        },
      ],
      P3: [
        {
          completeWord: "நெய் தோசை",
          syllable: ["நெய்", "தோசை"],
          audio: "gheedosaM3Tam",
        },
        {
          completeWord: "அவன் தண்ணீர் குடித்தான்",
          syllable: ["அவன் தண்ணீர்", "குடித்தான்"],
          audio: "hedrankwaterM3Tam",
        },
        {
          completeWord: "யானை கர்ஜிக்கிறது",
          syllable: ["யானை", "கர்ஜிக்கிறது"],
          audio: "elephantroarsM3Tam",
        },
        {
          completeWord: "அவர் அதை ஏழைகளுக்கு கொடுத்தார்",
          syllable: ["அவர் அதை", "ஏழைகளுக்கு கொடுத்தார்"],
          audio: "hegaveittothepoorM3Tam",
        },
        {
          completeWord: "பாடல் பாடுதல்",
          syllable: ["பாடல்", "பாடுதல்"],
          audio: "singingasongM3Tam",
        },
      ],
      P4: [
        {
          completeWord: "ஆமை வந்தது",
          syllable: ["ஆமை", "வந்தது"],
          audio: "theturtlecameM3Tam",
        },
        {
          completeWord: "புழு வந்தது",
          syllable: ["புழு", "வந்தது"],
          audio: "thewormcameM3Tam",
        },
        {
          completeWord: "முத்துச் சிப்பிபோல",
          syllable: ["முத்துச்", "சிப்பிபோல"],
          audio: "likeapearlM3Tam",
        },
        {
          completeWord: "தேனீ",
          syllable: ["தே", "னீ"],
          audio: "honeybeeM3Tam",
        },
        {
          completeWord: "சக்கரமும் சுழன்றோட",
          syllable: ["சக்கரமும்", "சுழன்றோட"],
          audio: "thewheelisspinningM3Tam",
        },
      ],
      S1: [
        { completeWord: "ஊஞ்சலிலே ஆடலாம்", syllable: ["ஊஞ்சலிலே", "ஆடலாம்"] },
        {
          completeWord: "ஆற்றில் நீந்தும் ஆமை",
          syllable: ["ஆற்றில்", "நீந்தும் ஆமை"],
        },
        { completeWord: "எஃகு வாள்", syllable: ["எஃகு", "வாள்"] },
        {
          completeWord: "அண்ணன் கையில் அலைபேசி",
          syllable: ["அண்ணன் கையில்", "அலைபேசி"],
        },
        {
          completeWord: "ஓரம் நிற்கும் ஓடம்",
          syllable: ["ஓரம்", "நிற்கும் ஓடம்"],
        },
      ],
      S2: [
        {
          completeWord: "அம்மா இங்கே வா வா",
          syllable: ["அம்மா", "இங்கே வா வா"],
        },
        {
          completeWord: "ஓதும் செயலே நலமாம்",
          syllable: ["ஓதும்", "செயலே நலமாம்"],
        },
        {
          completeWord: "ஏதும் இங்கே இல்லை",
          syllable: ["ஏதும்", "இங்கே இல்லை"],
        },
        {
          completeWord: "இலையில் சோறு போட்டு",
          syllable: ["இலையில்", "சோறு போட்டு"],
        },
        { completeWord: "பச்சை நிற மொச்சை", syllable: ["பச்சை நிற", "மொச்சை"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    kn: {
      P1: [
        {
          completeWord: "ರಾಜನ ಕಿರೀಟ",
          syllable: ["ರಾಜನ", "ಕಿರೀಟ"],
          audio: "kingsCrown",
        },
        {
          completeWord: "ಕೊತ್ತುಂಬರಿ ಸೊಪ್ಪು",
          syllable: ["ಕೊತ್ತುಂಬರಿ", "ಸೊಪ್ಪು"],
          audio: "coriander",
        },
        {
          completeWord: "ಅದು ಎರೆಹುಳು",
          syllable: ["ಅದು", "ಎರೆಹುಳು"],
          audio: "thatIsEarthworm",
        },
        {
          completeWord: "ಮಲಗುವ ಕೋಣೆ",
          syllable: ["ಮಲಗುವ", "ಕೋಣೆ"],
          audio: "bedRoom",
        },
        {
          completeWord: "ಕಸದ ಬುಟ್ಟಿ",
          syllable: ["ಕಸದ", "ಬುಟ್ಟಿ"],
          audio: "theDustbin",
        },
      ],
      P2: [
        {
          completeWord: "ನಾಯಿ ಓಡುತಿದೆ",
          syllable: ["ನಾಯಿ", "ಓಡುತಿದೆ"],
          audio: "dogIsRunning1",
        },
        {
          completeWord: "ಆಮೆ ಈಜುವುದು",
          syllable: ["ಆಮೆ", "ಈಜುವುದು"],
          audio: "turtleSwims",
        },
        {
          completeWord: "ಚೆಂಡು ಎಸೆದನು",
          syllable: ["ಚೆಂಡು", "ಎಸೆದನು"],
          audio: "throwedballKan",
        },
        {
          completeWord: "ಫೌಂಟನ್ ಪೆನ್ನು",
          syllable: ["ಫೌಂಟನ್", "ಪೆನ್ನು"],
          audio: "aFountainPen",
        },
        {
          completeWord: "ವಿಮಾನ ನಿಲ್ದಾಣ",
          syllable: ["ವಿಮಾನ", "ನಿಲ್ದಾಣ"],
          audio: "airport",
        },
      ],
      P3: [
        {
          completeWord: "ಮಂಗನ ಬಾಲ",
          syllable: ["ಮಂಗನ", "ಬಾಲ"],
          audio: "monkeysTail",
        },
        {
          completeWord: "ಐದು ಬಳೆಗಳು",
          syllable: ["ಐದು", "ಬಳೆಗಳು"],
          audio: "fiveBangles",
        },
        {
          completeWord: "ಕಮಲ ಈಜಿದಳು",
          syllable: ["ಕಮಲ", "ಈಜಿದಳು"],
          audio: "kamalaIsSwimming",
        },
        {
          completeWord: "ಹುಲಿ ಬಂತು, ಹುಲಿ!",
          syllable: ["ಹುಲಿ ಬಂತು", "ಹುಲಿ!"],
          audio: "tigerCameTiger",
        },
        {
          completeWord: "ಹರಳಿನ ಉಂಗುರ",
          syllable: ["ಹರಳಿನ", "ಉಂಗುರ"],
          audio: "stoneFingerRing",
        },
      ],
      P4: [
        {
          completeWord: "ಆಗಸದ ತಾರೆ",
          syllable: ["ಆಗಸದ", "ತಾರೆ"],
          audio: "starsInTheSky",
        },
        {
          completeWord: "ಹೂವಿನ ತೋಟ",
          syllable: ["ಹೂವಿನ", "ತೋಟ"],
          audio: "flowerArcade",
        },
        {
          completeWord: "ನೀಲಿಯ ಆಕಾಶ",
          syllable: ["ನೀಲಿಯ", "ಆಕಾಶ"],
          audio: "blueSky",
        },
        {
          completeWord: "ಹೂವಿನ ಎಸಳು",
          syllable: ["ಹೂವಿನ", "ಎಸಳು"],
          audio: "petalsOfAFlower",
        },
        {
          completeWord: "ಅರಸನ ಅರಮನೆ",
          syllable: ["ಅರಸನ", "ಅರಮನೆ"],
          audio: "kingsPalace",
        },
      ],
      S1: [
        { completeWord: "ಅಂದದ ಸರ", syllable: ["ಅಂದದ", "ಸರ"] },
        { completeWord: "ಚಂದಿರ ಬಂದ", syllable: ["ಚಂದಿರ", "ಬಂದ"] },
        { completeWord: "ಮರ ಒಣಗಿದೆ", syllable: ["ಮರ", "ಒಣಗಿದೆ"] },
        { completeWord: "ಅದು ಗುಡಿ", syllable: ["ಅದು", "ಗುಡಿ"] },
        { completeWord: "ಚೆಂಡು ಹೂ", syllable: ["ಚೆಂಡು", "ಹೂ"] },
      ],
      S2: [
        { completeWord: "ಮಾವಿನ ಮರ", syllable: ["ಮಾವಿನ", "ಮರ"] },
        { completeWord: "ಗೆಳೆಯರ ಮಾತುಕತೆ", syllable: ["ಗೆಳೆಯರ", "ಮಾತುಕತೆ"] },
        { completeWord: "ಇದು ಮಸೀದಿ", syllable: ["ಇದು", "ಮಸೀದಿ"] },
        { completeWord: "ಉದಯನ ಮನೆ", syllable: ["ಉದಯನ", "ಮನೆ"] },
        { completeWord: "ಖೋ ಖೋ ಆಟ", syllable: ["ಖೋ ಖೋ", "ಆಟ"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    te: {
      P1: [
        {
          completeWord: "పసుపురంగు పూవు",
          syllable: ["పసుపురంగు", "పూవు"],
          audio: "yellowFlower",
        },
        {
          completeWord: "అన్నం తినడం",
          syllable: ["అన్నం", "తినడం"],
          audio: "eatingRice",
        },
        {
          completeWord: "గూడు కట్టింది",
          syllable: ["గూడు", "కట్టింది"],
          audio: "birdsMadeNest",
        },
        {
          completeWord: "పచ్చి గడ్డి",
          syllable: ["పచ్చి", "గడ్డి"],
          audio: "greenGrass",
        },
        {
          completeWord: "అందమైన ఇల్లు",
          syllable: ["అందమైన", "ఇల్లు"],
          audio: "beautifulHouse",
        },
      ],
      P2: [
        {
          completeWord: "మీసాల తాతయ్య",
          syllable: ["మీసాల", "తాతయ్య"],
          audio: "mustacheGrandfather",
        },
        {
          completeWord: "మామిడి చెట్టు",
          syllable: ["మామిడి", "చెట్టు"],
          audio: "mangoTree",
        },
        {
          completeWord: "నువ్వు ఆలోచించు",
          syllable: ["నువ్వు", "ఆలోచించు"],
          audio: "youThink",
        },
        {
          completeWord: "అటవీ చెట్లు",
          syllable: ["అటవీ", "చెట్లు"],
          audio: "forestTrees",
        },
        {
          completeWord: "ఇస్త్రీ పెట్టె",
          syllable: ["ఇస్త్రీ", "పెట్టె"],
          audio: "ironingBox",
        },
      ],
      P3: [
        {
          completeWord: "నీలిరంగు చీర",
          syllable: ["నీలిరంగు", "చీర"],
          audio: "blueSaree",
        },
        {
          completeWord: "పరుగు తీసింది",
          syllable: ["పరుగు", "తీసింది"],
          audio: "runningTookIt",
        },
        {
          completeWord: "గాజు కప్పు",
          syllable: ["గాజు", "కప్పు"],
          audio: "glassCup",
        },
        {
          completeWord: "రంగోలి వేయండి",
          syllable: ["రంగోలి", "వేయండి"],
          audio: "rangoliPutIt",
        },
        {
          completeWord: "పతంగి చేసింది",
          syllable: ["పతంగి", "చేసింది"],
          audio: "makingKite",
        },
      ],
      P4: [
        {
          completeWord: "చెత్త కుండీ",
          syllable: ["చెత్త", "కుండీ"],
          audio: "garbagePot",
        },
        {
          completeWord: "అది బొప్పాయి",
          syllable: ["అది", "బొప్పాయి"],
          audio: "thatPapaya",
        },
        {
          completeWord: "తల దువ్వుకోవడం",
          syllable: ["తల", "దువ్వుకోవడం"],
          audio: "headCombing",
        },
        {
          completeWord: "ఎర్రనైన టమాట",
          syllable: ["ఎర్రనైన", "టమాట"],
          audio: "redTomato",
        },
        {
          completeWord: "పులి వచ్చింది, పులి",
          syllable: ["పులి వచ్చింది", "పులి"],
          audio: "tigerHereItComes",
        },
      ],
      S1: [
        { completeWord: "ఒక చీమ", syllable: ["ఒక", "చీమ"] },
        { completeWord: "మొండి బండ", syllable: ["మొండి", "బండ"] },
        { completeWord: "గీతల అంగి", syllable: ["గీతల", "అంగి"] },
        { completeWord: "నెమలి ఈక", syllable: ["నెమలి", "ఈక"] },
        { completeWord: "పాప ఆడింది", syllable: ["పాప", "ఆడింది"] },
      ],
      S2: [
        { completeWord: "పాట వినండి", syllable: ["పాట", "వినండి"] },
        { completeWord: "రతనాల ఉంగరం", syllable: ["రతనాల", "ఉంగరం"] },
        { completeWord: "మిరప పొడి", syllable: ["మిరప", "పొడి"] },
        { completeWord: "ఇది మసీదు", syllable: ["ఇది", "మసీదు"] },
        { completeWord: "ఏనుగు తోక", syllable: ["ఏనుగు", "తోక"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
  };

  const handleComplete = (nextStep) => {
    setRStep(nextStep);
    setLocalData("rStep", nextStep);
  };

  let progressDatas = getLocalData("practiceProgress");

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.title || "P1";
  const milestoneType = ["S1", "S2"].includes(currentLevel)
    ? "showcase"
    : "practice";

  //console.log("prog", progressDatas);

  // Get milestone_level to determine flow initialization
  const getMilestoneDataForInit = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneDataForInit = getMilestoneDataForInit();
  const milestoneLevelForInit =
    milestoneDataForInit?.data?.milestone_level || null;

  // Initialize F1 flow if milestone_level is B
  if (milestoneLevelForInit === "B" && rStepZero !== 1) {
    setLocalData("mFail", true);
    // Initialize F1 flow - only if no existing progress (preserve progress on relogin)
    const f1Step = getF1FlowStep();
    const existingF1Index = getLocalData("f1FlowIndex");
    // Only initialize to 0 if there's no existing F1 flow index (first time)
    if (!f1Step.step && existingF1Index === null) {
      setLocalData("f1FlowIndex", 0);
    }
    // Also set rFlow for backward compatibility
    // setLocalData("rFlow", true);
  } else if (
    (level === "B" || level === 1) &&
    rStepZero !== 1 &&
    milestoneLevelForInit !== "B"
  ) {
    // Legacy R0/R1 flow (only if milestone_level is not F1)
    setLocalData("mFail", true);
    // setLocalData("rFlow", true);
    setLocalData("rStepZero", 0);
  }

  const rFlow = String(getLocalData("rFlow"));
  const tFlow = String(getLocalData("tFlow"));
  const readMatch = String(getLocalData("readMatch"));
  //const setWordWall = setLocalData("wordWall", true);
  const wordWallFlow = String(getLocalData("wordWall"));

  // Get milestone_level from API response to determine which flow to show
  const getMilestoneData = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneData = getMilestoneData();
  const milestoneLevel = milestoneData?.data?.milestone_level || null;
  const subMilestoneLevel = milestoneData?.data?.sub_milestone_level || null;

  // Check if F1 flow should be active based on milestone_level
  // F1 flow is triggered when milestone_level is "B" and sub_milestone_level is "F1"
  const shouldShowF1 = milestoneLevel === "B" && subMilestoneLevel === "F1";
  // F2 flow is triggered when milestone_level is "B" and sub_milestone_level is "F2"
  const shouldShowF2 = milestoneLevel === "B" && subMilestoneLevel === "F2";
  // F3 flow is triggered when milestone_level is "B" and sub_milestone_level is "F3"
  const shouldShowF3 = milestoneLevel === "B" && subMilestoneLevel === "F3";

  // Track F1 flow index in state to trigger re-renders
  const [f1FlowIndexState, setF1FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f1FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // Track F2 flow index in state to trigger re-renders
  const [f2FlowIndexState, setF2FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f2FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // Track F3 flow index in state to trigger re-renders
  const [f3FlowIndexState, setF3FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f3FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // Sync F1 state with localStorage when it changes externally
  useEffect(() => {
    const checkF1FlowIndex = () => {
      const savedIndex = getLocalData("f1FlowIndex");
      if (savedIndex !== null) {
        const index = Number(savedIndex);
        if (index !== f1FlowIndexState) {
          setF1FlowIndexState(index);
        }
      }
    };

    // Check immediately
    checkF1FlowIndex();

    // Also listen for storage events to sync when localStorage changes
    const handleStorageChange = () => {
      checkF1FlowIndex();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also poll periodically to catch changes from same window
    const interval = setInterval(checkF1FlowIndex, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [f1FlowIndexState]);

  // Sync F2 state with localStorage when it changes externally
  useEffect(() => {
    const checkF2FlowIndex = () => {
      const savedIndex = getLocalData("f2FlowIndex");
      if (savedIndex !== null) {
        const index = Number(savedIndex);
        if (index !== f2FlowIndexState) {
          setF2FlowIndexState(index);
        }
      }
    };

    // Check immediately
    checkF2FlowIndex();

    // Also listen for storage events to sync when localStorage changes
    const handleStorageChange = () => {
      checkF2FlowIndex();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also poll periodically to catch changes from same window
    // Use shorter interval (50ms) for faster sync during initial load
    const interval = setInterval(checkF2FlowIndex, 50);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [f2FlowIndexState]);

  // Sync F3 state with localStorage when it changes externally
  useEffect(() => {
    const checkF3FlowIndex = () => {
      const savedIndex = getLocalData("f3FlowIndex");
      if (savedIndex !== null) {
        const index = Number(savedIndex);
        if (index !== f3FlowIndexState) {
          setF3FlowIndexState(index);
        }
      }
    };

    // Check immediately
    checkF3FlowIndex();

    // Also listen for storage events to sync when localStorage changes
    const handleStorageChange = () => {
      checkF3FlowIndex();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also poll periodically to catch changes from same window
    const interval = setInterval(checkF3FlowIndex, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [f3FlowIndexState]);

  // Check if F1 flow is active (replaces R0/R1)
  // Use state to ensure re-renders when flow advances
  const f1FlowStep = {
    index: f1FlowIndexState,
    step: F1_FLOW[f1FlowIndexState] || null,
    isLast: f1FlowIndexState === F1_FLOW.length - 1,
  };
  const isF1FlowActive = shouldShowF1 && f1FlowStep.step !== null;
  const isF1LearnStep = isF1FlowActive && f1FlowStep.step?.type === "L";
  const isF1PracticeStep = isF1FlowActive && f1FlowStep.step?.type === "P";
  const isF1ApplyStep = isF1FlowActive && f1FlowStep.step?.type === "A";

  // Check if F2 flow is active
  // Use state to ensure re-renders when flow advances
  // Also check localStorage as fallback in case state hasn't updated yet (e.g., during fetchDetails)
  const f2FlowIndexFromStorage = getLocalData("f2FlowIndex");
  const effectiveF2FlowIndex =
    f2FlowIndexFromStorage !== null
      ? Number(f2FlowIndexFromStorage)
      : f2FlowIndexState;
  const f2FlowStep = {
    index: effectiveF2FlowIndex,
    step: F2_FLOW[effectiveF2FlowIndex] || null,
    isLast: effectiveF2FlowIndex === F2_FLOW.length - 1,
  };
  const isF2FlowActive = shouldShowF2 && f2FlowStep.step !== null;

  // Log for debugging if there's a mismatch
  if (
    shouldShowF2 &&
    f2FlowIndexFromStorage !== null &&
    Number(f2FlowIndexFromStorage) !== f2FlowIndexState
  ) {
    // Force state update to match localStorage immediately
    setF2FlowIndexState(Number(f2FlowIndexFromStorage));
  }

  if (shouldShowF2) {
    // F2 flow is active
  }

  // Check if F3 flow is active
  // Use state to ensure re-renders when flow advances
  const f3FlowStep = {
    index: f3FlowIndexState,
    step: F3_FLOW[f3FlowIndexState] || null,
    isLast: f3FlowIndexState === F3_FLOW.length - 1,
  };
  const isF3FlowActive = shouldShowF3 && f3FlowStep.step !== null;

  // Helper function to map redirect strings to F3 flow indices
  // "P1" -> 0, "P2" -> 1, "P3" -> 2, "P4" -> 3, "P5" -> 4, "P6" -> 6, etc.
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
  const isF2LearnStep = isF2FlowActive && f2FlowStep.step?.type === "L";
  const isF2PracticeStep = isF2FlowActive && f2FlowStep.step?.type === "P";
  const isF2ApplyStep = isF2FlowActive && f2FlowStep.step?.type === "A";

  // Map F1 flow index to practiceSteps index
  // F1_FLOW index directly maps to practiceSteps index (0->0, 1->1, 2->2, etc.)
  const getF1PracticeStepIndex = () => {
    if (!isF1FlowActive) return progressData?.currentPracticeStep || 0;
    return f1FlowStep.index; // F1 flow index directly maps to practiceSteps index
  };

  const f1PracticeStepIndex = getF1PracticeStepIndex();

  // Check if F1 flow is complete and should show letter hunt
  const f1FlowComplete = String(getLocalData("f1FlowComplete")) === "true";

  // Use state to track f1FlowComplete so component re-renders when it changes
  const [f1FlowCompleteState, setF1FlowCompleteState] =
    useState(f1FlowComplete);

  // useEffect(() => {
  //   if (lang !== "en") {
  //     setLocalData("rFlow", false);
  //   }
  // }, [lang]);

  useEffect(() => {
    // 🎬 Trigger alphabet demo for F1 flow at specific milestones
    // Milestone indices: L1=0,A1=6,A2=13,A3=20
    const immediateMilestones = F1_FLOW.reduce((acc, step, idx) => {
      if (step.type === "L" && step.step === 1) acc.push(idx);
      return acc;
    }, []);
    const deferredMilestones = F1_FLOW.reduce((acc, step, idx) => {
      if (step.type === "A") acc.push(idx);
      return acc;
    }, []);

    const handleTrigger = (index) => {
      const milestoneIndices = [...immediateMilestones, ...deferredMilestones];
      if (isF1FlowActive && milestoneIndices.includes(index)) {
        const playedIndicesRaw = getLocalData("playedAlphabetDemoIndices");
        let playedIndices = [];
        try {
          playedIndices = playedIndicesRaw ? JSON.parse(playedIndicesRaw) : [];
        } catch (e) {
          playedIndices = [];
        }

        if (!playedIndices.includes(index)) {
          // console.log(
          //   "Practice - Triggering Alphabet Demo for F1 milestone:",
          //   index
          // );
          const updatedPlayedIndices = [...playedIndices, index];
          setLocalData(
            "playedAlphabetDemoIndices",
            JSON.stringify(updatedPlayedIndices)
          );
          setLocalData("showAlphabetDemo", "true");
          window.dispatchEvent(new Event("alphabetDemoComplete"));
        }
      }
    };

    // 1. Immediate trigger for non-showcase milestones
    if (immediateMilestones.includes(f1FlowIndexState)) {
      handleTrigger(f1FlowIndexState);
    }

    // 2. Listener for deferred trigger (e.g., from MainLayout "Start Game" button)
    const handleTriggerRequest = () => {
      if (deferredMilestones.includes(f1FlowIndexState)) {
        handleTrigger(f1FlowIndexState);
      }
    };
    window.addEventListener("alphabetDemoTriggerRequest", handleTriggerRequest);

    return () => {
      window.removeEventListener(
        "alphabetDemoTriggerRequest",
        handleTriggerRequest
      );
    };
  }, [f1FlowIndexState, isF1FlowActive]);

  // useEffect(() => {
  //   setLocalData("rFlow", true)
  // }, []);

  useEffect(() => {
    //console.log("levelsssss", level, rFlow, rStep);

    let currentLevelMap;
    let currentImageMap;

    if (level === 2) {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.titleNew || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleNew || "P1";
    } else if (level === 3) {
      currentLevelMap =
        practiceSteps?.[currentPracticeStep]?.titleThree || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleThree || "P1";
    } else {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.title || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.title || "P1";
    }

    if (
      progressData?.currentPracticeStep !== undefined &&
      progressData?.currentPracticeStep !== null
    ) {
      const selectedLevels =
        level === 2
          ? levelTwo[lang]
          : level === 3
          ? levelThree[lang]
          : levels[lang];

      const levelData = selectedLevels[currentLevelMap];
      const levelImage = selectedLevels[currentImageMap];
      //console.log("levelsNew", level, levelData);
      const currentWord = levelData[currentQuestion];

      setCurrentImage(levelImage[currentQuestion]);
      setParentWords(currentWord?.syllable?.join(" "));
      setLevelOneWord(levelImage[currentQuestion]?.completeWord);
      setRefAudio(levelImage[currentQuestion]?.audio);
    }
  }, [progressData]);

  const gameOver = (data, isUserPass) => {
    const userWon = isUserPass;
    const meetsFluencyCriteria = livesData?.meetsFluencyCriteria;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria });
  };
  //console.log("data", currentImage, parentWords);

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);

  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);

  const callConfettiAndPlay = () => {
    const audio = new Audio(levelCompleteAudioSrc);
    audio.play();
    callConfetti();
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion === 0 &&
      !fromBack
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        const step = practiceSteps[currentPracticeStep];
        let stepName;

        if (level === 1) {
          stepName = step.fullNameMOne;
        } else if (level === 2) {
          stepName = step.fullNameMTwo;
        } else if (level === 3) {
          stepName = step.fullNameMThree;
        } else {
          stepName = step.fullName;
        }
        setOpenMessageDialog({
          message: `You have successfully completed ${stepName} `,
        });
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText === "profanity") {
      setOpenMessageDialog({
        message: `Please speak appropriately.`,
        severity: "warning",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setVoiceText("");
    }
  }, [voiceText]);

  const checkFluency = (contentType, fluencyScore) => {
    switch (contentType.toLowerCase()) {
      case "word":
        setFluency(fluencyScore < 2);
        break;
      case "sentence":
        setFluency(fluencyScore < 6);
        break;
      case "paragraph":
        setFluency(fluencyScore < 10);
        break;
      default:
        setFluency(true);
    }
  };

  // Handle LetterTrain completion for F1/F2 flow Learn steps
  const handleLetterTrainComplete = async () => {
    const isF2LearnStep = isF2FlowActive && f2FlowStep.step?.type === "L";
    if (
      (!isF1FlowActive && !isF2FlowActive) ||
      (!isF1LearnStep && !isF2LearnStep)
    ) {
      // Not F1/F2 flow or not a Learn step, use regular handleNext
      return handleNext(false);
    }

    try {
      const lang = getLocalData("lang");
      const sessionId = getLocalData("sessionId");

      // Handle F2 flow Learn step completion
      if (isF2FlowActive && isF2LearnStep) {
        // Get current F2 flow step BEFORE advancement
        const currentF2FlowStep = getF2FlowStep();

        // Advance F2 flow - this updates localStorage
        const nextStep = advanceF2Flow();

        // Get the updated F2 flow step AFTER advancement
        let updatedF2FlowStep = getF2FlowStep();

        // Verify the index was actually incremented
        if (updatedF2FlowStep.index === currentF2FlowStep.index) {
          console.error(
            "F2 flow index did not advance! Current:",
            currentF2FlowStep.index,
            "Updated:",
            updatedF2FlowStep.index
          );
          // Force advance if it didn't work
          const forcedIndex = currentF2FlowStep.index + 1;
          setLocalData("f2FlowIndex", forcedIndex);
          updatedF2FlowStep = getF2FlowStep();
        }

        // Update state to trigger re-render
        setF2FlowIndexState(updatedF2FlowStep.index);

        // Store F2 flow progress in backend
        if (updatedF2FlowStep.step) {
          const calculatedProgress =
            ((updatedF2FlowStep.index + 1) / F2_FLOW.length) * 100;
          const cappedProgress = Math.min(100, Math.round(calculatedProgress));
          try {
            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: (updatedF2FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
              progress: cappedProgress,
              language: lang,
              milestoneLevel: "B",
              subMilestoneLevel: "F2",
            });
          } catch (e) {
            console.error("Error storing F2 flow progress:", e);
          }
        }

        // Update practice progress to reflect new F2 flow step
        const newPracticeStep = updatedF2FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newPracticeStep + 1) / F2_FLOW.length) * 100,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // Update points for F2 flow based on contentCount
        // Skip for Apply steps - they handle points after all 3 levels complete
        if (
          updatedF2FlowStep.step &&
          !localStorage.getItem("contentSessionId")
        ) {
          try {
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            const currentStepContent = f2Config?.[currentF2FlowStep.index];
            const isApplyStep = currentStepContent?.title?.startsWith("A");

            // Only add points for non-Apply steps (L and P steps)
            // Apply steps add points after all 3 levels are completed
            if (!isApplyStep) {
              const contentCount =
                currentStepContent?.contentCount || questions.length || 1;
              const result = await addPointer(contentCount, "B");

              if (result?.result?.totalLanguagePoints) {
                setPoints(result.result.totalLanguagePoints);
              }
            }
          } catch (error) {
            console.error("Error updating F2 flow points:", error);
          }
        }

        // Get content for the next step using the updated F2 flow index
        let nextStepContent = null;
        if (isF2FlowActive) {
          const effectiveLang = lang || "en";
          const f2Config = levelGetContent[effectiveLang]?.["F2"];

          if (
            f2Config &&
            Array.isArray(f2Config) &&
            f2Config[updatedF2FlowStep.index]
          ) {
            nextStepContent = f2Config[updatedF2FlowStep.index];
          }
        }

        // If next step is LetterTrain, mechanism is already set above
        // Force re-render by updating state
        const nextStepType = updatedF2FlowStep.step?.type;
        const isIndicLanguage = lang !== "en"; // Any language other than English uses barakhadi

        if (nextStepType === "P" || nextStepType === "A") {
          // Next step is Practice or Apply - use LetterHunt
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
        } else if (nextStepType === "L") {
          // Next step is Learn - use barakhadi for Indic, letterTrain for English
          const mechanismName = isIndicLanguage ? "barakhadi" : "letterTrain";
          setMechanism({ id: mechanismName, name: mechanismName });
        }
        setProgressData(practiceProgress);

        return; // Exit early for F2 flow
      }

      // Handle F1 flow Learn step completion (existing logic)
      // Get current F1 flow step BEFORE advancement
      const currentF1FlowStep = getF1FlowStep();

      // Advance F1 flow - this updates localStorage
      const nextStep = advanceF1Flow();

      // Get the updated F1 flow step AFTER advancement
      let updatedF1FlowStep = getF1FlowStep();

      // Verify the index was actually incremented
      if (updatedF1FlowStep.index === currentF1FlowStep.index) {
        console.error(
          "F1 flow index did not advance! Current:",
          currentF1FlowStep.index,
          "Updated:",
          updatedF1FlowStep.index
        );
        // Force advance if it didn't work
        const forcedIndex = currentF1FlowStep.index + 1;
        setLocalData("f1FlowIndex", forcedIndex);
        updatedF1FlowStep = getF1FlowStep();
        console.log("Forced F1 flow step:", updatedF1FlowStep);
      }

      // Update state to trigger re-render
      setF1FlowIndexState(updatedF1FlowStep.index);

      // Store F1 flow progress in backend
      // Save the next step index (1-indexed) so user resumes from the next step on relogin
      // Example: L1 (index 0) completes → advances to P1 (index 1) → save lesson "2" (1-indexed)
      if (updatedF1FlowStep.step) {
        try {
          // Ensure progress doesn't exceed 100%
          const calculatedProgress =
            ((updatedF1FlowStep.index + 1) / F1_FLOW.length) * 100;
          const cappedProgress = Math.min(100, Math.round(calculatedProgress));

          await addLesson({
            sessionId,
            milestone: "practice",
            lesson: (updatedF1FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
            progress: cappedProgress,
            language: lang,
            milestoneLevel: "B",
            subMilestoneLevel: "F1",
          });
          console.log("F1 Learn step progress saved:", {
            completedStepIndex: currentF1FlowStep.index,
            nextStepIndex: updatedF1FlowStep.index,
            lessonSaved: (updatedF1FlowStep.index + 1).toString(), // 1-indexed
          });
        } catch (e) {
          console.error("Error storing F1 flow progress:", e);
        }
      }

      // Update practice progress to reflect new F1 flow step
      const newPracticeStep = updatedF1FlowStep.index;
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
      practiceProgress = {
        ...practiceProgress,
        currentQuestion: 0,
        currentPracticeProgress: ((newPracticeStep + 1) / F1_FLOW.length) * 100,
        currentPracticeStep: newPracticeStep,
      };
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress);
      setCurrentQuestion(0);

      // Update points for F1 flow Learn step based on contentCount
      // Skip for Apply steps - they handle points after all 3 levels complete
      if (currentF1FlowStep.step && !localStorage.getItem("contentSessionId")) {
        try {
          const lang = getLocalData("lang") || "en";
          const f1Config = levelGetContent[lang]?.["F1"];
          const completedStepContent = f1Config?.[currentF1FlowStep.index];
          const isApplyStep = completedStepContent?.title?.startsWith("A");

          // Only add points for non-Apply steps
          if (!isApplyStep) {
            const contentCount =
              completedStepContent?.contentCount || questions.length || 1;
            const result = await addPointer(contentCount, "B");

            if (result?.result?.totalLanguagePoints) {
              setPoints(result.result.totalLanguagePoints);
            }
          }
        } catch (error) {
          console.error("Error updating F1 Learn step points:", error);
        }
      }

      // Get content for the next step using the updated F1 flow index
      // For F1 flow, directly access the config array using the updated F1 flow index
      // This avoids using getCurrentContent which relies on stale state values
      let nextStepContent = null;
      if (isF1FlowActive) {
        // For F1 flow, directly access the F1 config array using the updated index
        // The F1 config array index directly corresponds to F1_FLOW index
        // Ensure we use the correct language (default to "en" if lang is not available)
        const effectiveLang = lang || "en";
        const f1Config = levelGetContent[effectiveLang]?.["F1"];
        console.log("F1 config lookup:", {
          lang: effectiveLang,
          hasF1Config: !!f1Config,
          f1ConfigLength: f1Config?.length,
          targetIndex: updatedF1FlowStep.index,
          f1FlowStep: updatedF1FlowStep.step,
          availableLanguages: Object.keys(levelGetContent || {}),
        });

        if (
          f1Config &&
          Array.isArray(f1Config) &&
          f1Config[updatedF1FlowStep.index]
        ) {
          nextStepContent = f1Config[updatedF1FlowStep.index];
          console.log("F1 next step content from config:", {
            index: updatedF1FlowStep.index,
            title: nextStepContent?.title,
            mechanism: nextStepContent?.mechanism,
            customLetters: nextStepContent?.customLetters,
          });

          // Validate that the mechanism matches the F1_FLOW step type
          const f1StepType = updatedF1FlowStep.step?.type;
          const expectedMechanism =
            f1StepType === "L" ? "letterTrain" : "letterHunt";
          if (nextStepContent?.mechanism?.name !== expectedMechanism) {
            console.warn(
              "F1 config mechanism mismatch! Expected:",
              expectedMechanism,
              "Got:",
              nextStepContent?.mechanism?.name
            );
            // Override with correct mechanism based on F1_FLOW step type
            if (nextStepContent) {
              nextStepContent.mechanism = {
                id: expectedMechanism,
                name: expectedMechanism,
              };
              console.log("Corrected mechanism to:", nextStepContent.mechanism);
            }
          }
        } else {
          console.error("F1 config not found!", {
            index: updatedF1FlowStep.index,
            f1ConfigExists: !!f1Config,
            f1ConfigIsArray: Array.isArray(f1Config),
            f1ConfigLength: f1Config?.length,
            levelGetContentKeys: levelGetContent
              ? Object.keys(levelGetContent)
              : null,
            f1ConfigForLang: levelGetContent[effectiveLang]
              ? Object.keys(levelGetContent[effectiveLang])
              : null,
          });
          // Don't use getCurrentContent fallback - it uses wrong logic for F1
          // Instead, return null and let the component handle it
          nextStepContent = null;
        }
      } else {
        // For non-F1 flows, use getCurrentContent
        nextStepContent = getCurrentContent(newPracticeStep);
      }

      // If F1 config is not found, determine mechanism from F1_FLOW step type
      if (!nextStepContent && isF1FlowActive) {
        console.warn(
          "F1 config not found, determining mechanism from F1_FLOW step type"
        );
        const f1StepType = updatedF1FlowStep.step?.type;
        if (f1StepType === "L") {
          // Learn step - LetterTrain
          nextStepContent = {
            mechanism: { id: "letterTrain", name: "letterTrain" },
          };
        } else if (f1StepType === "P" || f1StepType === "A") {
          // Practice or Apply step - LetterHunt
          nextStepContent = {
            mechanism: { id: "letterHunt", name: "letterHunt" },
          };
        } else {
          console.error("Unknown F1 step type:", f1StepType);
          return; // Don't proceed if we can't determine the mechanism
        }
      }

      if (!nextStepContent) {
        console.error(
          "No next step content found! Cannot proceed to next step."
        );
        return; // Don't proceed if we don't have content
      }

      // Validate and set mechanism - ensure it matches F1_FLOW step type
      const f1StepType = updatedF1FlowStep.step?.type;

      // For F1 flow, ALWAYS determine mechanism from F1_FLOW step type (ignore config mechanism)
      // Use updatedF1FlowStep directly since we just advanced the flow
      let finalMechanism;
      const f1StepTypeForMechanism = updatedF1FlowStep.step?.type;
      console.log(
        "Determining mechanism - level:",
        level,
        "isF1FlowActive:",
        isF1FlowActive,
        "f1StepType:",
        f1StepTypeForMechanism,
        "updatedF1FlowStep:",
        updatedF1FlowStep
      );

      // Always determine mechanism from F1_FLOW step type if we have a valid step
      if (f1StepTypeForMechanism) {
        // Always use F1_FLOW step type to determine mechanism, not the config
        if (f1StepTypeForMechanism === "L") {
          finalMechanism = { id: "letterTrain", name: "letterTrain" };
        } else if (
          f1StepTypeForMechanism === "P" ||
          f1StepTypeForMechanism === "A"
        ) {
          finalMechanism = { id: "letterHunt", name: "letterHunt" };
        } else {
          console.error("Unknown F1 step type:", f1StepTypeForMechanism);
          return; // Don't proceed if we can't determine the mechanism
        }
        console.log(
          "F1 flow mechanism determined from step type:",
          f1StepTypeForMechanism,
          "->",
          finalMechanism.name
        );
      } else if (nextStepContent?.mechanism) {
        // Fallback: use mechanism from config if F1 step type is not available
        finalMechanism = nextStepContent.mechanism;
        console.log(
          "Using mechanism from config (no F1 step type):",
          finalMechanism
        );
      } else {
        console.error(
          "Cannot determine mechanism - no F1 step type and no config mechanism"
        );
        return; // Don't proceed if we can't determine the mechanism
      }

      // Update mechanism first - this is critical for re-rendering the correct component
      console.log(
        "Setting mechanism to:",
        finalMechanism,
        "for F1 step type:",
        f1StepTypeForMechanism
      );
      setMechanism(finalMechanism);

      // LetterHunt generates its own content, so we don't need to fetch questions
      if (finalMechanism.name === "letterHunt") {
        // LetterHunt will generate its own content based on config
        // Just ensure questions array is set (can be empty, LetterHunt will handle it)
        setQuestions([]);
      } else if (nextStepContent?.mechanism?.name !== "letterTrain") {
        // For other mechanisms (not LetterTrain or LetterHunt), fetch questions
        // Add null check for nextStepContent
        if (!nextStepContent) {
          console.error(
            "handleNext - nextStepContent is undefined for F1 flow"
          );
          return;
        }

        // M3 should always use getContent, not recommendation API
        // Check both level (number) and level as string "3" to be safe
        const isM3 = level === 3 || level === "3" || String(level) === "3";
        const getContentFn = isM3
          ? getContent
          : nextStepContent?.mechanism ||
            ((level === 1 || level === 2) && lang === "en")
          ? getContent
          : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
            lang === "en"
          ? getContentNew
          : getContent;

        console.log("handleNext (F1 flow) - API selection for M3:", {
          level,
          levelType: typeof level,
          isM3,
          step: nextStepContent?.title,
          usingRecommendationAPI: getContentFn === getContentNew,
          usingGetContent: getContentFn === getContent,
          hasMechanism: !!nextStepContent?.mechanism,
          recommendationAPIEnabled:
            process.env.REACT_APP_USE_RECOMMENDATION_API === "true",
          lang,
        });

        try {
          // Only fetch if criteria exists (LetterHunt doesn't have criteria)
          if (nextStepContent?.criteria) {
            const resWord = await getContentFn(
              nextStepContent.criteria,
              lang,
              limit,
              {
                mechanismId: nextStepContent?.mechanism?.id,
                competency: nextStepContent?.competency,
                tags: nextStepContent?.tags,
                storyMode: nextStepContent?.storyMode,
                CEFR_level: nextStepContent?.CEFR_level,
                multilingual: nextStepContent?.multilingual,
              },
              level
            );

            if (resWord && resWord.length > 0) {
              setQuestions(resWord);
            }
          }
        } catch (e) {
          console.error("Error fetching content for next step:", e);
        }
      }
      // If next step is LetterTrain, mechanism is already set above

      // Force re-render by updating state
      // Update progressData to trigger re-render
      setProgressData(practiceProgress);

      // Log for debugging
      console.log("LetterTrain completed, next step:", {
        newPracticeStep,
        nextStepContent,
        mechanism: nextStepContent?.mechanism,
        f1FlowStep: updatedF1FlowStep,
        f1FlowIndexState: updatedF1FlowStep.index,
        f1ConfigLength:
          levels === "B" ? levelGetContent[lang]?.["F1"]?.length : null,
        currentMechanismState: mechanism, // Log current mechanism state for comparison
      });

      // The component will automatically re-render when:
      // - f1FlowIndexState changes (via setF1FlowIndexState) - this updates f1FlowStep
      // - mechanism changes (via setMechanism) - this determines which component to render
      // - progressData changes (via setProgressData) - this updates progress
      // React will batch these state updates and re-render once with all new values
    } catch (error) {
      console.error("Error in handleLetterTrainComplete:", error);
    }
  };

  const handleNext = async (isGameOver) => {
    setIsNextButtonCalled(true);
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      if (levelMapping[virtualId] !== undefined) {
        setLevel(levelMapping[virtualId]);
      } else {
        const token = getLocalData("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const emisUsername = String(decoded.emis_username);
            //console.log("emu", emisUsername);

            if (levelMapping[emisUsername] !== undefined) {
              setLevel(levelMapping[emisUsername]);
            }
          } catch (error) {
            console.error("Error decoding JWT token:", error);
          }
        }
      }

      //console.log("Assigned LEVEL:", level);
      const token = getLocalData("token");
      let emisUsername = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          emisUsername = String(decoded.emis_username);
          //console.log("emu", emisUsername);
        } catch (error) {
          console.error("Error decoding JWT token:", error);
        }
      }

      let updatedLevel;

      if (levelMapping[virtualId] || levelMapping[emisUsername]) {
        updatedLevel = levelMapping[virtualId] || levelMapping[emisUsername];

        setLevel(updatedLevel);
      }

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress) {
        currentPracticeStep = practiceProgress.currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      let newPracticeStep =
        currentQuestion === questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      newPracticeStep = Number(newPracticeStep);
      let newQuestionIndex =
        currentQuestion === questions.length - 1 ? 0 : currentQuestion + 1;

      // Handle F1 flow advancement when any F1 step completes (Learn, Practice, or Apply)
      // Check if F1 flow is active by checking milestone level
      const currentF1FlowStepBeforeAdvance = getF1FlowStep();
      const isF1FlowActiveCheck =
        milestoneLevel === "B" && currentF1FlowStepBeforeAdvance.step !== null;
      let updatedF1FlowStep = null;

      // For F1 flow, check if we should advance (either questions completed or game over)
      // NOTE: LetterHuntMechanics already advances F1 flow before calling handleNext,
      // so we should NOT advance again here. We just need to read the current state.
      // Check if LetterHuntMechanics already advanced the flow
      const f1FlowAdvancedByLetterHunt =
        getLocalData("f1FlowAdvancedByLetterHunt") === "true";

      // Only advance if this is NOT from LetterHunt (questions.length > 0 means it's not LetterHunt)
      // AND LetterHuntMechanics hasn't already advanced it
      const shouldAdvanceF1 =
        isF1FlowActiveCheck &&
        !f1FlowAdvancedByLetterHunt && // Don't advance if LetterHuntMechanics already did
        questions.length > 0 && // Not LetterHunt (LetterHunt has empty questions array)
        (currentQuestion === questions.length - 1 || isGameOver);

      if (shouldAdvanceF1) {
        console.log(
          "handleNext - F1 flow step before advance:",
          currentF1FlowStepBeforeAdvance
        );

        // Advance F1 flow first
        advanceF1Flow();

        // Get updated F1 flow step after advancement
        updatedF1FlowStep = getF1FlowStep();
        console.log(
          "handleNext - F1 flow step after advance:",
          updatedF1FlowStep,
          "step type:",
          updatedF1FlowStep.step?.type
        );

        // Update state to trigger re-render
        setF1FlowIndexState(updatedF1FlowStep.index);

        // Store F1 flow progress in backend when step completes
        // Store the NEW index (after advancement) as 1-indexed so user resumes from next step on relogin
        // Example: L1 (index 0) completes → advances to P1 (index 1) → save lesson "2" (1-indexed)
        if (updatedF1FlowStep.step) {
          try {
            // Ensure progress doesn't exceed 100%
            const calculatedProgress =
              ((updatedF1FlowStep.index + 1) / F1_FLOW.length) * 100;
            const cappedProgress = Math.min(
              100,
              Math.round(calculatedProgress)
            );

            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: (updatedF1FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
              progress: cappedProgress,
              language: lang,
              milestoneLevel: "B", // F1 flow is for milestone level B
              subMilestoneLevel: "F1",
            });
            console.log("F1 flow progress saved (handleNext):", {
              completedStepIndex: currentF1FlowStepBeforeAdvance.index,
              nextStepIndex: updatedF1FlowStep.index,
              lessonSaved: (updatedF1FlowStep.index + 1).toString(), // 1-indexed
            });
          } catch (e) {
            console.error("Error storing F1 flow progress:", e);
          }
        }

        // Update practiceProgress for F1 flow
        const newF1FlowIndex = updatedF1FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newF1FlowIndex + 1) / F1_FLOW.length) * 100,
          currentPracticeStep: newF1FlowIndex,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // Update points for F1 flow based on contentCount (use COMPLETED step, not next step)
        // Skip for Apply steps - they handle points after all 3 levels complete
        if (
          currentF1FlowStepBeforeAdvance.step &&
          !localStorage.getItem("contentSessionId")
        ) {
          try {
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            const completedStepContent =
              f1Config?.[currentF1FlowStepBeforeAdvance.index];
            const isApplyStep = completedStepContent?.title?.startsWith("A");

            // Only add points for non-Apply steps (L and P steps)
            // Apply steps add points after all 3 levels are completed
            if (!isApplyStep) {
              const contentCount =
                completedStepContent?.contentCount || questions.length || 1;
              const result = await addPointer(contentCount, "B");

              if (result?.result?.totalLanguagePoints) {
                setPoints(result.result.totalLanguagePoints);
              }
            }
          } catch (error) {
            console.error("Error updating F1 flow points:", error);
          }
        }
      }

      // For F3 flow, always check current F3 flow step from localStorage (may have been advanced by LetterLauncherMechanics)
      // Check if F3 flow is active
      const currentF3FlowStepFromStorage = getF3FlowStep();
      const isF3FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F3" &&
        currentF3FlowStepFromStorage.step !== null;

      // For F2 flow, always check current F2 flow step from localStorage (may have been advanced by LetterHuntMechanics)
      // Check if F2 flow is active
      const f2FlowAdvancedByLetterHunt =
        getLocalData("f2FlowAdvancedByLetterHunt") === "true";
      const currentF2FlowStepFromStorage = getF2FlowStep();
      const isF2FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F2" &&
        currentF2FlowStepFromStorage.step !== null;

      // For F1 flow, always check current F1 flow step from localStorage (may have been advanced by LetterHuntMechanics)
      // Check if F1 flow is active by checking milestone level
      const isF1FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F1" &&
        !isF2FlowByMilestone &&
        !isF3FlowByMilestone;
      let currentGetContent;

      // Handle F3 flow first (takes precedence over F2 and F1)
      // Check if F3 flow was already advanced by LetterLauncherMechanics
      const f3FlowAdvancedByLetterLauncher =
        getLocalData("f3FlowAdvancedByLetterLauncher") === "true";

      if (isF3FlowByMilestone) {
        // Check if there's a redirect request (e.g., from failed level)
        const f3FlowRedirect = getLocalData("f3FlowRedirect");
        if (f3FlowRedirect) {
          const targetIndex = getF3FlowIndexFromRedirect(f3FlowRedirect);
          if (targetIndex !== null) {
            console.log(
              `F3 flow redirect requested: ${f3FlowRedirect} -> index ${targetIndex}`
            );
            // Set F3 flow index to target
            setLocalData("f3FlowIndex", targetIndex);
            setF3FlowIndexState(targetIndex);
            // Clear redirect flag
            setLocalData("f3FlowRedirect", null);
            // Clear f3ApplySubStep to ensure A1 starts from Letter Launcher, not Memory Challenge
            setLocalData("f3ApplySubStep", null);

            // Update practice progress
            const lang = getLocalData("lang") || "en";
            const sessionId = getLocalData("sessionId");
            const totalF3Steps = F3_FLOW.length;
            const currentPracticeProgress = Math.round(
              ((targetIndex + 1) / totalF3Steps) * 100
            );

            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "practice",
                lesson: (targetIndex + 1).toString(), // Convert to 1-indexed for backend (matches F1/F2/F3 pattern)
                progress: currentPracticeProgress,
                language: lang,
                milestoneLevel: "B",
                subMilestoneLevel: "F3",
              });
              console.log("F3 flow redirect progress saved:", {
                index: targetIndex,
                lessonSaved: (targetIndex + 1).toString(), // 1-indexed
                progress: currentPracticeProgress,
              });
            } catch (e) {
              console.error("Error storing F3 flow redirect progress:", e);
            }

            // Update local practice progress
            let practiceProgress = getLocalData("practiceProgress");
            practiceProgress = practiceProgress
              ? JSON.parse(practiceProgress)
              : {};
            practiceProgress = {
              ...practiceProgress,
              currentQuestion: 0,
              currentPracticeProgress: currentPracticeProgress,
              currentPracticeStep: targetIndex,
            };
            setLocalData("practiceProgress", JSON.stringify(practiceProgress));
            setProgressData(practiceProgress);
            setCurrentQuestion(0);

            // Return early - redirect handled
            return;
          } else {
            console.warn(
              `F3 flow redirect failed: could not map "${f3FlowRedirect}" to flow index`
            );
            setLocalData("f3FlowRedirect", null);
          }
        }

        // Always get current F3 flow step from localStorage (it may have been advanced by LetterLauncherMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF3Index = getLocalData("f3FlowIndex");
        const f3IndexFromStorage =
          savedF3Index !== null ? Number(savedF3Index) : 0;
        const currentF3FlowStep = {
          index: f3IndexFromStorage,
          step: F3_FLOW[f3IndexFromStorage] || null,
          isLast: f3IndexFromStorage === F3_FLOW.length - 1,
        };

        console.log("handleNext - F3 flow active, current step from storage:", {
          f3IndexFromStorage,
          step: currentF3FlowStep.step,
          stepType: currentF3FlowStep.step?.type,
          f3FlowIndexState,
          f3FlowAdvancedByLetterLauncher,
        });

        // Update state to ensure UI reflects current F3 flow index
        if (currentF3FlowStep.index !== f3FlowIndexState) {
          console.log(
            "handleNext - Updating f3FlowIndexState from",
            f3FlowIndexState,
            "to",
            currentF3FlowStep.index
          );
          setF3FlowIndexState(currentF3FlowStep.index);
        }

        // Only store F3 flow progress in backend if LetterLauncherMechanics hasn't already done it
        // IMPORTANT: Check flag FIRST to prevent duplicate addLesson calls
        if (f3FlowAdvancedByLetterLauncher) {
          console.log(
            "F3 flow progress already saved by LetterLauncherMechanics, skipping addLesson in handleNext"
          );
          // Clear the flag after a short delay to allow it to be used again for next step
          setTimeout(() => {
            setLocalData("f3FlowAdvancedByLetterLauncher", "false");
          }, 500);
        } else if (currentF3FlowStep.step) {
          // Only call addLesson if flag is NOT set (LetterLauncherMechanics hasn't already called it)
          try {
            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: currentF3FlowStep.index.toString(),
              progress: ((currentF3FlowStep.index + 1) / F3_FLOW.length) * 100,
              language: lang,
              milestoneLevel: "B",
              subMilestoneLevel: "F3",
            });
            console.log("F3 flow progress saved to backend by handleNext:", {
              index: currentF3FlowStep.index,
              progress: ((currentF3FlowStep.index + 1) / F3_FLOW.length) * 100,
            });
          } catch (e) {
            console.error("Error storing F3 flow progress:", e);
          }
        }

        // Update practice progress to reflect new F3 flow step
        const newF3PracticeStep = currentF3FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newF3PracticeStep + 1) / F3_FLOW.length) * 100,
          currentPracticeStep: newF3PracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // F3 flow points are handled entirely by LetterLauncherMechanics component
        // Do not add points here to avoid duplicates

        // Use F3 flow index to get content from F3 config
        const effectiveLang = lang || "en";
        const f3Config = levelGetContent[effectiveLang]?.["F3"];
        console.log(
          "handleNext - Fetching F3 content for index:",
          currentF3FlowStep.index,
          "step type:",
          currentF3FlowStep.step?.type,
          "title should be:",
          currentF3FlowStep.step?.type === "P"
            ? `P${currentF3FlowStep.step?.step}`
            : `A${currentF3FlowStep.step?.step}`
        );

        if (
          f3Config &&
          Array.isArray(f3Config) &&
          f3Config[currentF3FlowStep.index]
        ) {
          currentGetContent = f3Config[currentF3FlowStep.index];
          console.log("handleNext - F3 content from config:", {
            index: currentF3FlowStep.index,
            title: currentGetContent?.title,
            mechanism: currentGetContent?.mechanism,
          });
        } else {
          // Fallback: determine mechanism from F3_FLOW step type
          const f3StepType = currentF3FlowStep.step?.type;
          console.log(
            "handleNext - F3 config not found, using step type:",
            f3StepType
          );
          if (f3StepType === "P" || f3StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterLauncher", name: "letterLauncher" },
            };
          }
          console.log("handleNext - F3 content fallback:", currentGetContent);
        }

        // Set mechanism based on F3_FLOW step type
        const f3StepTypeForMechanism = currentF3FlowStep.step?.type;
        console.log(
          "handleNext - Setting mechanism for F3 step type:",
          f3StepTypeForMechanism,
          "at index:",
          currentF3FlowStep.index
        );
        if (f3StepTypeForMechanism === "P" || f3StepTypeForMechanism === "A") {
          setMechanism({ id: "letterLauncher", name: "letterLauncher" });
          setQuestions([]); // LetterLauncher generates its own content
          console.log(
            "handleNext - Mechanism set to letterLauncher for F3 index",
            currentF3FlowStep.index
          );
        }
      } else if (isF2FlowByMilestone) {
        // Handle F2 flow (takes precedence over F1)
        // Always get current F2 flow step from localStorage (it may have been advanced by LetterHuntMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF2Index = getLocalData("f2FlowIndex");
        const f2IndexFromStorage =
          savedF2Index !== null ? Number(savedF2Index) : 0;
        const currentF2FlowStep = {
          index: f2IndexFromStorage,
          step: F2_FLOW[f2IndexFromStorage] || null,
          isLast: f2IndexFromStorage === F2_FLOW.length - 1,
        };

        console.log("handleNext - F2 flow active, current step from storage:", {
          f2IndexFromStorage,
          step: currentF2FlowStep.step,
          stepType: currentF2FlowStep.step?.type,
          f2FlowIndexState,
          f2FlowAdvancedByLetterHunt,
        });

        // Update state to ensure UI reflects current F2 flow index
        if (currentF2FlowStep.index !== f2FlowIndexState) {
          console.log(
            "handleNext - Updating f2FlowIndexState from",
            f2FlowIndexState,
            "to",
            currentF2FlowStep.index
          );
          setF2FlowIndexState(currentF2FlowStep.index);
        }

        // Use F2 flow index to get content from F2 config
        const effectiveLang = lang || "en";
        const f2Config = levelGetContent[effectiveLang]?.["F2"];
        console.log(
          "handleNext - Fetching F2 content for index:",
          currentF2FlowStep.index,
          "step type:",
          currentF2FlowStep.step?.type,
          "title should be:",
          currentF2FlowStep.step?.type === "L"
            ? `L${currentF2FlowStep.step?.step}`
            : currentF2FlowStep.step?.type === "P"
            ? `P${currentF2FlowStep.step?.step}`
            : `A${currentF2FlowStep.step?.step}`
        );

        if (
          f2Config &&
          Array.isArray(f2Config) &&
          f2Config[currentF2FlowStep.index]
        ) {
          currentGetContent = f2Config[currentF2FlowStep.index];
          // Add null check for currentGetContent
          if (!currentGetContent) {
            console.error(
              "handleNext - F2 config entry is null/undefined at index:",
              currentF2FlowStep.index
            );
            // Fallback to step type
            const f2StepType = currentF2FlowStep.step?.type;
            if (f2StepType === "L") {
              currentGetContent = {
                mechanism: { id: "letterTrain", name: "letterTrain" },
              };
            } else if (f2StepType === "P" || f2StepType === "A") {
              currentGetContent = {
                mechanism: { id: "letterHunt", name: "letterHunt" },
              };
            }
          } else {
            console.log("handleNext - F2 content from config:", {
              index: currentF2FlowStep.index,
              title: currentGetContent?.title,
              mechanism: currentGetContent?.mechanism,
              customLetters: currentGetContent?.customLetters,
            });
          }
        } else {
          // Fallback: determine mechanism from F2_FLOW step type
          const f2StepType = currentF2FlowStep.step?.type;
          console.log(
            "handleNext - F2 config not found, using step type:",
            f2StepType
          );
          if (f2StepType === "L") {
            currentGetContent = {
              mechanism: { id: "letterTrain", name: "letterTrain" },
            };
          } else if (f2StepType === "P" || f2StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterHunt", name: "letterHunt" },
            };
          }
          console.log("handleNext - F2 content fallback:", currentGetContent);
        }

        // ALWAYS set mechanism based on F2_FLOW step type (ignore config mechanism)
        const f2StepTypeForMechanism = currentF2FlowStep.step?.type;
        const isIndicLanguage = lang !== "en";
        console.log(
          "handleNext - Setting mechanism for F2 step type:",
          f2StepTypeForMechanism,
          "at index:",
          currentF2FlowStep.index
        );
        if (f2StepTypeForMechanism === "L") {
          const mechanismName = isIndicLanguage ? "barakhadi" : "letterTrain";
          setMechanism({ id: mechanismName, name: mechanismName });
          console.log(
            "handleNext - Mechanism set to letterTrain for F2 index",
            currentF2FlowStep.index
          );
        } else if (
          f2StepTypeForMechanism === "P" ||
          f2StepTypeForMechanism === "A"
        ) {
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
          console.log(
            "handleNext - Mechanism set to letterHunt for F2 index",
            currentF2FlowStep.index
          );
        } else {
          console.error(
            "handleNext - Unknown F2 step type:",
            f2StepTypeForMechanism,
            "at index:",
            currentF2FlowStep.index
          );
        }
      } else if (isF1FlowByMilestone) {
        // Always get current F1 flow step from localStorage (it may have been advanced by LetterHuntMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF1Index = getLocalData("f1FlowIndex");
        let f1IndexFromStorage =
          savedF1Index !== null ? Number(savedF1Index) : 0;

        // Validate that the index is within bounds
        if (f1IndexFromStorage < 0 || f1IndexFromStorage >= F1_FLOW.length) {
          console.error(
            "handleNext - Invalid F1 flow index from localStorage:",
            f1IndexFromStorage,
            "resetting to 0"
          );
          f1IndexFromStorage = 0;
          setLocalData("f1FlowIndex", 0);
        }

        const currentF1FlowStep = {
          index: f1IndexFromStorage,
          step: F1_FLOW[f1IndexFromStorage] || null,
          isLast: f1IndexFromStorage === F1_FLOW.length - 1,
        };

        console.log("handleNext - F1 flow active, current step from storage:", {
          f1IndexFromStorage,
          step: currentF1FlowStep.step,
          stepType: currentF1FlowStep.step?.type,
          f1FlowIndexState,
          f1FlowAdvancedByLetterHunt,
        });

        // Update state to ensure UI reflects current F1 flow index
        if (currentF1FlowStep.index !== f1FlowIndexState) {
          console.log(
            "handleNext - Updating f1FlowIndexState from",
            f1FlowIndexState,
            "to",
            currentF1FlowStep.index
          );
          setF1FlowIndexState(currentF1FlowStep.index);
        }

        // Use F1 flow index to get content from F1 config
        const effectiveLang = lang || "en";
        const f1Config = levelGetContent[effectiveLang]?.["F1"];
        console.log(
          "handleNext - Fetching F1 content for index:",
          currentF1FlowStep.index,
          "step type:",
          currentF1FlowStep.step?.type,
          "title should be:",
          currentF1FlowStep.step?.type === "L"
            ? `L${currentF1FlowStep.step?.step}`
            : currentF1FlowStep.step?.type === "P"
            ? `P${currentF1FlowStep.step?.step}`
            : `A${currentF1FlowStep.step?.step}`
        );

        if (
          f1Config &&
          Array.isArray(f1Config) &&
          f1Config[currentF1FlowStep.index]
        ) {
          currentGetContent = f1Config[currentF1FlowStep.index];
          // Add null check for currentGetContent
          if (!currentGetContent) {
            console.error(
              "handleNext - F1 config entry is null/undefined at index:",
              currentF1FlowStep.index,
              "f1Config length:",
              f1Config.length,
              "f1Config keys:",
              Object.keys(f1Config)
            );
            // Fallback to step type
            const f1StepType = currentF1FlowStep.step?.type;
            if (f1StepType === "L") {
              currentGetContent = {
                mechanism: { id: "letterTrain", name: "letterTrain" },
              };
            } else if (f1StepType === "P" || f1StepType === "A") {
              currentGetContent = {
                mechanism: { id: "letterHunt", name: "letterHunt" },
              };
            }
          } else {
            console.log("handleNext - F1 content from config:", {
              index: currentF1FlowStep.index,
              title: currentGetContent?.title,
              mechanism: currentGetContent?.mechanism,
              customLetters: currentGetContent?.customLetters,
            });
          }
        } else {
          // Fallback: determine mechanism from F1_FLOW step type
          const f1StepType = currentF1FlowStep.step?.type;
          console.error(
            "handleNext - F1 config not found for index:",
            currentF1FlowStep.index,
            "f1Config exists:",
            !!f1Config,
            "f1Config is array:",
            Array.isArray(f1Config),
            "f1Config length:",
            f1Config?.length,
            "using step type:",
            f1StepType
          );
          if (f1StepType === "L") {
            currentGetContent = {
              mechanism: { id: "letterTrain", name: "letterTrain" },
            };
          } else if (f1StepType === "P" || f1StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterHunt", name: "letterHunt" },
            };
          }
          console.log("handleNext - F1 content fallback:", currentGetContent);
        }

        // ALWAYS set mechanism based on F1_FLOW step type (ignore config mechanism)
        const f1StepTypeForMechanism = currentF1FlowStep.step?.type;
        console.log(
          "handleNext - Setting mechanism for F1 step type:",
          f1StepTypeForMechanism,
          "at index:",
          currentF1FlowStep.index
        );
        if (f1StepTypeForMechanism === "L") {
          setMechanism({ id: "letterTrain", name: "letterTrain" });
          console.log(
            "handleNext - Mechanism set to letterTrain for index",
            currentF1FlowStep.index
          );
        } else if (
          f1StepTypeForMechanism === "P" ||
          f1StepTypeForMechanism === "A"
        ) {
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
          console.log(
            "handleNext - Mechanism set to letterHunt for index",
            currentF1FlowStep.index
          );
        } else {
          console.error(
            "handleNext - Unknown F1 step type:",
            f1StepTypeForMechanism,
            "at index:",
            currentF1FlowStep.index
          );
        }
      }

      // // Add null check for currentGetContent
      // if (!currentGetContent) {
      //   console.error(
      //     "handleNext - currentGetContent is undefined for newPracticeStep:",
      //     newPracticeStep
      //   );
      //   return;
      // }

      // M3 should always use getContent, not recommendation API
      // Check both level (number) and level as string "3" to be safe
      const isM3 = level === 3 || level === "3" || String(level) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((level === 1 || level === 2) && lang === "en")
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
          lang === "en"
        ? getContentNew
        : getContent;

      console.log("handleNext - API selection for M3:", {
        level,
        levelType: typeof level,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled:
          process.env.REACT_APP_USE_RECOMMENDATION_API === "true",
        lang,
      });

      //console.log("cqer", currentQuestion, questions, level);

      // if(updatedLevel === 14){
      //   setCurrentQuestion(currentQuestion + 1);
      // }else{

      // For F1/F2 flow, if we've already set the mechanism correctly above, skip the content fetching logic
      // This prevents overriding the mechanism and content that were set above
      // Check if this is F1/F2 flow and if we've already processed it (f1FlowAdvancedByLetterHunt/f2FlowAdvancedByLetterHunt flag)
      const shouldSkipContentFetch =
        (isF2FlowByMilestone && f2FlowAdvancedByLetterHunt) ||
        (isF1FlowByMilestone && f1FlowAdvancedByLetterHunt);

      // Update UI points for F1/F2/F3 flows when they complete via LetterHuntMechanics/LetterLauncherMechanics
      // LetterHuntMechanics/LetterLauncherMechanics already updated points in backend, we just need to fetch and update UI
      if (
        (currentQuestion === questions.length - 1 || isGameOver) &&
        shouldSkipContentFetch &&
        !localStorage.getItem("contentSessionId")
      ) {
        // LetterHuntMechanics already called addPointer, so we just need to fetch updated points
        // to update the UI. Don't call addPointer again to avoid duplicate points.
        if (f1FlowAdvancedByLetterHunt || f2FlowAdvancedByLetterHunt) {
          try {
            const updatedPoints = await fetchUserPoints();
            setPoints(updatedPoints || 0);
            console.log(
              "F1/F2 flow points UI updated (LetterHuntMechanics already updated backend):",
              {
                flow: f1FlowAdvancedByLetterHunt ? "F1" : "F2",
                totalPoints: updatedPoints,
              }
            );
          } catch (error) {
            console.error(
              "Error fetching updated points after LetterHuntMechanics completion:",
              error
            );
          }
        } else if (isF3FlowByMilestone) {
          // F3 flow points are handled entirely by LetterLauncherMechanics
          // Just fetch the updated points from backend to update UI
          try {
            const userPointsRes = await fetchUserPoints();
            const totalPoints = userPointsRes?.result?.totalLanguagePoints || 0;
            setPoints(totalPoints);
          } catch (error) {
            console.error(
              "Error fetching F3 flow points (shouldSkipContentFetch):",
              error
            );
          }
        }
      }

      // Check if all questions are completed
      // For M3 S2, ensure we check completion correctly
      const isAllQuestionsCompleted =
        currentQuestion === questions.length - 1 ||
        isGameOver ||
        (level === 3 &&
          questions.length > 0 &&
          currentQuestion >= questions.length - 1);

      console.log("handleNext - Completion check:", {
        level,
        currentQuestion,
        questionsLength: questions.length,
        isGameOver,
        isAllQuestionsCompleted,
        shouldSkipContentFetch,
        step:
          practiceSteps?.[practiceProgress?.currentPracticeStep]?.title ||
          practiceSteps?.[practiceProgress?.currentPracticeStep]?.titleThree,
        currentPracticeStep: practiceProgress?.currentPracticeStep,
      });

      if (isAllQuestionsCompleted && !shouldSkipContentFetch) {
        let currentPracticeStep = practiceProgress.currentPracticeStep;
        let isShowCase = currentPracticeStep === 4 || currentPracticeStep === 9; // P4 or P8

        if (localStorage.getItem("contentSessionId") !== null) {
          setPoints(1);
          if (isShowCase) {
            sendTestRigScore(5);
          }
        } else {
          // Get contentCount from config for the COMPLETED step
          let points = 1; // Default fallback
          try {
            const lang = getLocalData("lang") || "en";
            const levelKey = `m${level}`;
            const levelConfig = levelGetContent[lang]?.[levelKey];
            const completingStepTitle =
              practiceSteps?.[currentPracticeStep]?.title ||
              practiceSteps?.[currentPracticeStep]?.name;
            const completedStepContent = levelConfig?.find(
              (step) => step.title === completingStepTitle
            );
            const contentCount = completedStepContent?.contentCount;

            // Use contentCount if available, otherwise fallback to 1
            if (contentCount && contentCount > 0) {
              points = contentCount;
            }

            console.log("Points calculation for completed step:", {
              currentPracticeStep,
              completingStepTitle,
              contentCount,
              points,
              levelKey,
            });
          } catch (error) {
            console.error("Error getting contentCount for points:", error);
            // Keep default points = 1
          }

          let milestone = `m${level}`;

          // Validate that points is a valid positive number
          if (!points || points <= 0) {
            console.error("Invalid points value:", points);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          if ([1, 2, 4, 5, 6, 7, 8, 9].includes(level)) {
            const addCorrectWords = await addCorrectPracticeWords();
          }

          const result = await addPointer(points, milestone);
          const awardedPoints = result?.result?.points;

          // Validate that the awarded points match what we expected to add
          if (awardedPoints !== points) {
            console.warn("Points mismatch:", {
              expected: points,
              awarded: awardedPoints,
              milestone,
            });
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }
          setPoints(result?.result?.totalLanguagePoints || 0);
          console.log("Points updated successfully:", {
            pointsAdded: points,
            totalPoints: result?.result?.totalLanguagePoints,
            milestone,
          });
        }

        // Check if this is a showcase step (S1 or S2) or game over
        // For M3, S1 is at index 4, S2 is at index 9
        // Calculate currentLevel from the step we're completing (currentPracticeStep, not newPracticeStep)
        const completingStepLevel =
          practiceSteps?.[currentPracticeStep]?.title || currentLevel;
        const isShowcaseStep =
          completingStepLevel === "S1" || completingStepLevel === "S2";
        const shouldShowFeedback = isShowCase || isGameOver || isShowcaseStep;

        console.log("handleNext - Showcase check:", {
          isShowCase,
          isGameOver,
          isShowcaseStep,
          currentLevel,
          completingStepLevel,
          currentPracticeStep,
          shouldShowFeedback,
          level,
          practiceStepTitle: practiceSteps?.[currentPracticeStep]?.title,
          practiceStepName: practiceSteps?.[currentPracticeStep]?.name,
        });

        if (shouldShowFeedback) {
          console.log("handleNext - Entering feedback logic for:", {
            currentLevel,
            completingStepLevel,
            level,
            isM3S1: level === 3 && completingStepLevel === "S1",
            isM3S2: level === 3 && completingStepLevel === "S2",
          });
          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await getSetResultPractice({
            subSessionId: sub_session_id,
            currentContentType,
            sessionId,
            totalSyllableCount,
            mechanism,
          });
          const { data: getSetData } = getSetResultRes;

          const data = JSON.stringify(getSetData);
          Log(data, "practice", "ET");
          setPercentage(getSetData?.percentage);
          checkFluency(currentContentType, getSetData?.fluency);
          if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
            await createLearnerProgress(
              sub_session_id,
              getSetData?.currentLevel,
              totalSyllableCount
            );
          }
          //setLocalData("previous_level", getSetData.data.previous_level);
          setLocalData("previous_level", getSetData.previous_level);

          try {
            const lang = getLocalData("lang");
            const getMilestoneDetails = await getFetchMilestoneDetails(lang);
            setVocabCount(
              getMilestoneDetails?.data?.extra?.vocabulary_count || 0
            );
            setWordCount(
              getMilestoneDetails?.data?.extra?.latest_towre_data
                ?.wordsPerMinute || 0
            );
          } catch (e) {
            // catch error
          }

          if (getSetData.sessionResult === "pass") {
            // Skip this block for F1/F2/F3 flows (milestoneLevel "B")
            // These flows handle their own progress saving
            if (
              milestoneLevel === "B" ||
              isF1FlowActive ||
              isF2FlowActive ||
              isF3FlowActive
            ) {
              console.log(
                "Skipping assessment completion addLesson for F1/F2/F3 flow",
                {
                  milestoneLevel,
                  isF1FlowActive,
                  isF2FlowActive,
                  isF3FlowActive,
                }
              );
            } else {
              if (
                level === 15 &&
                (currentLevel === "S1" || currentLevel === "S2")
              ) {
                setLocalData("allCompleted", true);
                gameOver({ link: "/assesment-end" }, true);
                return;
              }
              if (
                (lang === "en" || lang === "te") &&
                (level === 3 || level === 6 || level === 9)
              ) {
                try {
                  await addLesson({
                    sessionId,
                    milestone: milestoneType,
                    lesson: "0",
                    progress: 0,
                    language: lang,
                    milestoneLevel: getSetData.currentLevel,
                  });
                } catch (e) {
                  // catch error
                }
                gameOver({ link: "/assesment-end" }, true);
                setLocalData("tFlow", true);
                //setLocalData("wordWall", true);
                return; // Exit to show feedback screen for M3/M6/M9
              }
              if (lang === "en" || lang === "te") {
                try {
                  await addLesson({
                    sessionId,
                    milestone: milestoneType,
                    lesson: "0",
                    progress: 0,
                    language: lang,
                    milestoneLevel: getSetData.currentLevel,
                  });
                } catch (e) {
                  // catch error
                }
                gameOver({ link: "/assesment-end" }, true);
                setLocalData("wordWall", true);
                return; // Exit to show feedback screen
              }

              try {
                await addLesson({
                  sessionId,
                  milestone: milestoneType,
                  lesson: "0",
                  progress: 0,
                  language: lang,
                  milestoneLevel: getSetData.currentLevel,
                });
                gameOver({ link: "/assesment-end" }, true);
                return;
              } catch (e) {
                // catch error
              }
            }
          } else if (currentLevel === "S2" && (level === 1 || level === 2)) {
            setLocalData("mFail", true);
            // setTimeout(() => {
            //   // setLocalData("rFlow", true);
            //   setLocalData("rStepZero", 0);
            // }, 7000);
          }
        }

        let quesArr = [];

        if (newPracticeStep === 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }

        // Skip addLesson for F1/F2/F3 flows - they handle their own progress saving
        // Check if F1/F2/F3 flow is active and has already been advanced by LetterHuntMechanics
        const f1FlowAdvancedByLetterHunt =
          getLocalData("f1FlowAdvancedByLetterHunt") === "true";
        const f2FlowAdvancedByLetterHunt =
          getLocalData("f2FlowAdvancedByLetterHunt") === "true";
        const isF1FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F1";
        const isF2FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F2";
        const isF3FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F3";

        const shouldSkipAddLesson =
          (isF1FlowByMilestone && f1FlowAdvancedByLetterHunt) ||
          (isF2FlowByMilestone && f2FlowAdvancedByLetterHunt) ||
          isF3FlowByMilestone; // F3 flow always handles its own progress

        if (!shouldSkipAddLesson) {
          // Determine milestone type based on the NEXT step (newPracticeStep), not the current step
          // This ensures that when P2 completes and next is S1, milestone is "showcase"
          const nextStepTitle = practiceSteps?.[newPracticeStep]?.title || "";
          const nextStepMilestoneType = ["S1", "S2"].includes(nextStepTitle)
            ? "showcase"
            : "practice";

          await addLesson({
            sessionId: sessionId,
            milestone: nextStepMilestoneType,
            lesson: newPracticeStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: `m${level}`,
          });
        } else {
          console.log(
            "Skipping addLesson in handleNext - F1/F2/F3 flow already handled progress saving",
            {
              isF1FlowByMilestone,
              f1FlowAdvancedByLetterHunt,
              isF2FlowByMilestone,
              f2FlowAdvancedByLetterHunt,
              isF3FlowByMilestone,
            }
          );
        }

        if (newPracticeStep === 0 || newPracticeStep === 5 || isGameOver) {
          gameOver();
          return;
        }

        // Get content config for the NEXT step (newPracticeStep)
        const currentGetContent = getCurrentContent(newPracticeStep);

        if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
          // For M4-M9, always use limit (10), otherwise use contentCount from config if available
          // Force limit to 10 for M4-M9 regardless of config
          const contentLimit =
            level >= 4 && level <= 9
              ? 10
              : currentGetContent?.contentCount || limit;

          // Determine which API function to use for the next step
          const isM3 = level === 3 || level === "3" || String(level) === "3";
          const getContentFn = isM3
            ? getContent
            : currentGetContent?.mechanism ||
              ((level === 1 || level === 2) && lang === "en")
            ? getContent
            : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
              lang === "en"
            ? getContentNew
            : getContent;

          console.log("handleNext - Content fetch for next step:", {
            level,
            levelType: typeof level,
            step: currentGetContent?.title,
            contentCount: currentGetContent?.contentCount,
            contentLimit,
            computedLimit: limit,
            isM4ToM9: level >= 4 && level <= 9,
            hasMechanism: !!currentGetContent?.mechanism,
            mechanismName: currentGetContent?.mechanism?.name,
            criteria: currentGetContent.criteria,
            tags: currentGetContent?.tags,
          });
          const resGetContent = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );
          console.log("handleNext - API response for next step:", {
            level,
            contentCount: resGetContent?.content?.length,
            requestedLimit: contentLimit,
            expectedCount: contentLimit,
            actualCount: resGetContent?.content?.length,
            content: resGetContent?.content,
          });

          // Verify we got the expected number of items
          if (
            level >= 4 &&
            level <= 9 &&
            resGetContent?.content?.length !== 10
          ) {
            console.warn(
              "handleNext - M4-M9: Expected 10 items but got:",
              resGetContent?.content?.length
            );
          }

          setTotalSyllableCount(resGetContent?.totalSyllableCount);
          setLivesData({
            ...livesData,
            totalTargets: resGetContent?.totalSyllableCount,
            targetsForLives:
              resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE,
            targetPerLive:
              (resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE) /
              LIVES,
          });

          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);
          // TODO: API returns contents if 200 status
          quesArr = [...quesArr, ...(resGetContent?.content || [])];
          setCurrentContentType(resGetContent?.content?.[0]?.contentType);
          setCurrentCollectionId(resGetContent?.content?.[0]?.collectionId);

          // // TODO: API returns contents if 200 status
          // quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
          // setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
          // setCurrentCollectionId(
          //   resGetContent?.data?.content?.[0]?.collectionId
          // );

          // TODO: not required - not using this anywhere
          setAssessmentResponse(resGetContent);

          setCurrentQuestion(0);
          // TODO: not required - we are geting this data from API
          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);
          setLocalData("storyTitle", resGetContent?.name);

          // // TODO: not required - we are geting this data from API
          // practiceProgress = {
          //   currentQuestion: newQuestionIndex,
          //   currentPracticeProgress,
          //   currentPracticeStep: newPracticeStep,
          // };
          // setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          // setProgressData(practiceProgress);
          // localStorage.setItem("storyTitle", resGetContent?.name);

          setQuestions(quesArr);

          // Set mechanism for the next step
          // if (currentGetContent?.mechanism) {
          setMechanism(currentGetContent?.mechanism || {});
          // }
        }

        if (["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);
          setCurrentQuestion(0);

          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);

          const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
            id: `dummy-${i + 1}`,
          }));

          setQuestions(dummyQuestions);

          // Set mechanism for the NEXT step (newPracticeStep) for M10-M15
          const currentGetContent = getCurrentContent(newPracticeStep);
          setMechanism(currentGetContent?.mechanism || {});
        }

        if (levelMapping[virtualId] !== undefined) {
          setLevel(levelMapping[virtualId]);
        } else {
          const token = getLocalData("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const emisUsername = String(decoded.emis_username);
              //console.log("emu", emisUsername);

              if (levelMapping[emisUsername] !== undefined) {
                setLevel(levelMapping[emisUsername]);
              }
            } catch (error) {
              console.error("Error decoding JWT token:", error);
            }
          }
        }

        //console.log("Assigned LEVEL:", level);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        practiceProgress = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
      } else {
        newPracticeStep =
          practiceSteps.length - 1 === practiceProgress.currentPracticeStep
            ? 0
            : practiceProgress.currentPracticeStep + 1;
        const currentGetContent = getCurrentContent(newPracticeStep);

        // Fetch content for the next step if not F1/F2/F3 flow
        if (
          !["B", 0, 10, 11, 12, 13, 14, 15].includes(level) &&
          currentGetContent?.criteria
        ) {
          try {
            // For M4-M9, always use 10, otherwise use contentCount from config if available
            const contentLimit =
              level >= 4 && level <= 9
                ? 10
                : currentGetContent?.contentCount || limit;

            const isM3 = level === 3 || level === "3" || String(level) === "3";
            const getContentFn = isM3
              ? getContent
              : currentGetContent?.mechanism ||
                ((level === 1 || level === 2) && lang === "en")
              ? getContent
              : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
                lang === "en"
              ? getContentNew
              : getContent;

            const resGetContent = await getContentFn(
              currentGetContent.criteria,
              lang,
              contentLimit,
              {
                mechanismId: currentGetContent?.mechanism?.id,
                competency: currentGetContent?.competency,
                tags: currentGetContent?.tags,
                storyMode: currentGetContent?.storyMode,
                CEFR_level: currentGetContent?.CEFR_level,
                multilingual: currentGetContent?.multilingual,
              },
              level
            );

            if (resGetContent?.content && resGetContent.content.length > 0) {
              setCurrentContentType(resGetContent?.content?.[0]?.contentType);
              setCurrentCollectionId(resGetContent?.content?.[0]?.collectionId);
              setAssessmentResponse(resGetContent);
              setQuestions(resGetContent.content);
              setCurrentQuestion(0);
              setLocalData("storyTitle", resGetContent?.name);
            }
          } catch (error) {
            console.error("Error fetching content in else block:", error);
          }
        }

        // if (currentGetContent?.mechanism) {
        setMechanism(currentGetContent?.mechanism || {});
        // }

        // Skip addLesson for F1/F2/F3 flows - they handle their own progress saving
        const f1FlowAdvancedByLetterHunt =
          getLocalData("f1FlowAdvancedByLetterHunt") === "true";
        const f2FlowAdvancedByLetterHunt =
          getLocalData("f2FlowAdvancedByLetterHunt") === "true";
        const isF1FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F1";
        const isF2FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F2";
        const isF3FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F3";

        const shouldSkipAddLesson =
          (isF1FlowByMilestone && f1FlowAdvancedByLetterHunt) ||
          (isF2FlowByMilestone && f2FlowAdvancedByLetterHunt) ||
          isF3FlowByMilestone; // F3 flow always handles its own progress

        if (!shouldSkipAddLesson) {
          await addLesson({
            sessionId: sessionId,
            milestone: milestoneType,
            lesson: newPracticeStep,
            progress: Math.round(
              (newPracticeStep / (practiceSteps.length * limit)) * 100
            ),
            language: lang,
            milestoneLevel: `m${level}`,
          });
        } else {
          console.log(
            "Skipping addLesson in handleNext - F1/F2/F3 flow already handled progress saving",
            {
              isF1FlowByMilestone,
              f1FlowAdvancedByLetterHunt,
              isF2FlowByMilestone,
              f2FlowAdvancedByLetterHunt,
              isF3FlowByMilestone,
            }
          );
        }

        practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: Math.round(
            (newPracticeStep / (practiceSteps.length * limit)) * 100
          ),
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    let audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
        )
      );
    });
  };

  const fetchDetails = async () => {
    let quesArr = [];
    try {
      setLoading(true);
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      let sessionId = getLocalData("sessionId");

      if (!sessionId) {
        sessionId = uniqueId();
        setLocalData("sessionId", sessionId);
      }
      const getMilestoneDetails = await getFetchMilestoneDetails(lang);

      // TODO: validate the getMilestoneDetails API return
      setLocalData("getMilestone", JSON.stringify({ ...getMilestoneDetails }));
      setVocabCount(
        getMilestoneDetails?.data?.extra?.vocabulary_count +
          getMilestoneDetails?.data?.extra?.learned_voc_count || 0
      );
      setWordCount(
        getMilestoneDetails?.data?.extra?.latest_towre_data?.wordsPerMinute || 0
      );
      const levels = getMilestoneDetails?.data?.milestone_level;
      let newLevel = levels?.startsWith("m")
        ? Number(levels.replace("m", ""))
        : levels;
      setLevel(
        levels?.startsWith("m") ? Number(levels.replace("m", "")) : levels
      );
      console.log("newLevel", levels);

      const resLessons = await getLessonProgressByID(lang);

      // Check if lesson progress is available
      const hasLessonProgress =
        resLessons?.result?.lesson !== null &&
        resLessons?.result?.lesson !== undefined &&
        Number.isInteger(Number(resLessons?.result?.lesson));

      if (
        process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
        (localStorage.getItem("contentSessionId") !== null ||
          process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true")
      ) {
        fetchUserPoints()
          .then((points) => {
            setPoints(points);
          })
          .catch((error) => {
            console.error("Error fetching user points:", error);
            setPoints(0);
          });
      }

      let userState = hasLessonProgress
        ? Number(resLessons.result?.lesson)
        : null; // Set to null initially to trigger fallback check

      // TODO: revisit this - looks like not required
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      // For F1/F2/F3 flow (milestone_level === "B"), restore flow index from backend
      // This ensures progress is restored on relogin (localStorage is cleared on logout)
      if (levels === "B") {
        const subMilestoneLevel =
          getMilestoneDetails?.data?.sub_milestone_level;

        // If userState is null (no lesson progress), initialize to 0 for fallback
        if (userState === null) {
          userState = 0;
        }

        if (subMilestoneLevel === "F1") {
          // For F1 flow, lesson number from backend is 1-indexed (1-21)
          // But F1_FLOW array is 0-indexed (0-20), so convert: lesson 21 = index 20 (A3)
          // Convert 1-indexed lesson to 0-indexed flow index
          const f1FlowIndex = userState > 0 ? userState - 1 : 0;

          // Check if this is a valid F1 flow index (0 to F1_FLOW.length - 1)
          if (f1FlowIndex >= 0 && f1FlowIndex < F1_FLOW.length) {
            // Additional validation: Check if the restored index makes sense
            // If the index is too high (e.g., 20 for A3 when user should be at P3 or A1),
            // it might be an old/stale progress. Log a warning but still restore it.
            if (f1FlowIndex > 10) {
              console.warn(
                `Restoring F1 flow progress from high index: lesson ${userState} (1-indexed) -> flow index ${f1FlowIndex} (0-indexed) -> ${
                  F1_FLOW[f1FlowIndex]?.type
                }${
                  F1_FLOW[f1FlowIndex]?.step || ""
                }. This might be stale progress.`
              );
            }
            // Restore F1 flow index from backend
            console.log(
              `Restoring F1 flow progress: lesson ${userState} (1-indexed) -> flow index ${f1FlowIndex} (0-indexed) -> ${
                F1_FLOW[f1FlowIndex]?.type
              }${F1_FLOW[f1FlowIndex]?.step || ""}`
            );
            setLocalData("f1FlowIndex", f1FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            setF1FlowIndexState(f1FlowIndex);
            // Update userState to match the flow index for practiceProgress calculation
            userState = f1FlowIndex;
          } else {
            // If backend doesn't have valid F1 flow index, start from beginning
            console.warn(
              `Invalid F1 flow index ${f1FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          }
        } else if (subMilestoneLevel === "F2") {
          // For F2 flow, lesson number from backend is 1-indexed (1-21)
          // But F2_FLOW array is 0-indexed (0-20), so convert
          const f2FlowIndex = userState > 0 ? userState - 1 : 0;

          // Always restore F2 flow index from backend lesson value
          // The backend is the source of truth, especially after browser refresh/relogin when localStorage is cleared
          if (f2FlowIndex >= 0 && f2FlowIndex < F2_FLOW.length) {
            console.log(
              `Restoring F2 flow progress: lesson ${userState} (1-indexed) -> flow index ${f2FlowIndex} (0-indexed) -> ${
                F2_FLOW[f2FlowIndex]?.type
              }${F2_FLOW[f2FlowIndex]?.step || ""}`
            );
            setLocalData("f2FlowIndex", f2FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            // Update state immediately and synchronously
            console.log(
              `Setting F2 flow index state from ${f2FlowIndexState} to ${f2FlowIndex} (lesson ${userState} -> index ${f2FlowIndex} -> ${
                F2_FLOW[f2FlowIndex]?.type
              }${F2_FLOW[f2FlowIndex]?.step || ""})`
            );
            setF2FlowIndexState(f2FlowIndex);
            userState = f2FlowIndex;
          } else {
            console.warn(
              `Invalid F2 flow index ${f2FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f2FlowIndex", 0);
            // IMPORTANT: Update state to trigger re-render
            setF2FlowIndexState(0);
            userState = 0;
          }
        } else if (subMilestoneLevel === "F3") {
          // For F3 flow, lesson number from backend is 1-indexed (1-12)
          // But F3_FLOW array is 0-indexed (0-11), so convert
          const f3FlowIndex = userState > 0 ? userState - 1 : 0;

          if (f3FlowIndex >= 0 && f3FlowIndex < F3_FLOW.length) {
            console.log(
              `Restoring F3 flow progress: lesson ${userState} (1-indexed) -> flow index ${f3FlowIndex} (0-indexed) -> ${
                F3_FLOW[f3FlowIndex]?.type
              }${F3_FLOW[f3FlowIndex]?.step || ""}`
            );
            setLocalData("f3FlowIndex", f3FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            setF3FlowIndexState(f3FlowIndex);
            userState = f3FlowIndex;
          } else {
            console.warn(
              `Invalid F3 flow index ${f3FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f3FlowIndex", 0);
            userState = 0;
          }
        }
      }

      // Ensure userState is a number before calculating progress
      // If userState is still null at this point, it will be set in the fallback logic below
      const finalUserState = userState !== null ? userState : 0;

      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress: (finalUserState / practiceSteps.length) * 100,
        currentPracticeStep: finalUserState,
      };

      const getCurrentContent = (stepKey) => {
        // Handle null stepKey
        if (stepKey === null || stepKey === undefined) {
          return null;
        }

        const lang = getLocalData("lang") || "en";
        console.log("curGetCont2", lang, levels);
        // For F1 flow (levels === "B"), use "F1" as the level key
        const levelKey = levels === "B" ? "F1" : newLevel;

        if (levels === "B") {
          // For F1 flow, stepKey is the F1 flow index (0-20)
          // The F1 config array has titles "P1", "P2", "P3", etc. in order
          // So we can directly use stepKey as the array index
          const f1Config = levelGetContent[lang]?.[levelKey];
          if (f1Config && f1Config[stepKey]) {
            return f1Config[stepKey];
          }
          return null;
        } else {
          // For non-F1 flows, use practiceSteps mapping
          return levelGetContent[lang]?.[levelKey]?.find(
            (elem) => elem.title === practiceSteps?.[stepKey]?.name
          );
        }
      };

      let currentGetContent = getCurrentContent(userState);

      console.log("curContent", currentGetContent, userState);
      console.log(
        "Initial load - About to fetch questions. Level:",
        level,
        "Type:",
        typeof level,
        "newLevel:",
        newLevel
      );

      // Fallback: If lesson steps are not available, check milestone level and load first step
      if (!currentGetContent) {
        console.warn(
          "currentGetContent is undefined for userState:",
          userState,
          "level:",
          newLevel,
          "levels:",
          levels,
          "- Attempting fallback to first step of milestone level"
        );

        // Determine fallback step based on milestone level
        if (levels === "B") {
          // For milestone level "B" (F1/F2/F3 flows), start at index 0
          const subMilestoneLevel =
            getMilestoneDetails?.data?.sub_milestone_level;

          if (subMilestoneLevel === "F1") {
            console.log("Fallback: Loading first step of F1 flow (index 0)");
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          } else if (subMilestoneLevel === "F2") {
            console.log("Fallback: Loading first step of F2 flow (index 0)");
            setLocalData("f2FlowIndex", 0);
            userState = 0;
          } else if (subMilestoneLevel === "F3") {
            console.log("Fallback: Loading first step of F3 flow (index 0)");
            setLocalData("f3FlowIndex", 0);
            userState = 0;
          } else {
            // Default to F1 if sub_milestone_level is not specified
            console.log(
              "Fallback: Loading first step of F1 flow (default for milestone B)"
            );
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          }

          // Try to get content again with fallback userState
          currentGetContent = getCurrentContent(userState);

          // Update practiceProgress for F1/F2/F3 flows
          // For F flows, progress is based on flow length, not practiceSteps.length
          let flowLength = 0;
          if (subMilestoneLevel === "F1") {
            flowLength = F1_FLOW.length;
          } else if (subMilestoneLevel === "F2") {
            flowLength = F2_FLOW.length;
          } else if (subMilestoneLevel === "F3") {
            flowLength = F3_FLOW.length;
          } else {
            flowLength = F1_FLOW.length; // Default to F1
          }

          practiceProgress = {
            currentQuestion: 0,
            currentPracticeProgress:
              flowLength > 0 ? ((userState + 1) / flowLength) * 100 : 0,
            currentPracticeStep: userState,
          };
        } else {
          // For other milestone levels (m1, m2, etc.), find first step in that level's config
          const lang = getLocalData("lang") || "en";
          const levelKey = newLevel;
          const levelConfig = levelGetContent[lang]?.[levelKey];

          if (
            levelConfig &&
            Array.isArray(levelConfig) &&
            levelConfig.length > 0
          ) {
            // Find first step that matches a practice step
            const firstStep = levelConfig.find((step) => {
              // Check if step title matches any practice step name
              return practiceSteps?.some((ps) => ps.name === step.title);
            });

            if (firstStep) {
              // Find the practice step index that matches
              const practiceStepIndex = practiceSteps?.findIndex(
                (ps) => ps.name === firstStep.title
              );

              if (practiceStepIndex !== -1 && practiceStepIndex !== undefined) {
                console.log(
                  `Fallback: Loading first step of milestone level ${levels} (${firstStep.title}, index ${practiceStepIndex})`
                );
                userState = practiceStepIndex;
                currentGetContent = firstStep;
              } else {
                // If no matching practice step found, use first config item
                console.log(
                  `Fallback: Loading first config item of milestone level ${levels} (${levelConfig[0]?.title})`
                );
                userState = 0;
                currentGetContent = levelConfig[0];
              }
            } else {
              // If no matching step found, use first config item
              console.log(
                `Fallback: Loading first config item of milestone level ${levels} (${levelConfig[0]?.title})`
              );
              userState = 0;
              currentGetContent = levelConfig[0];
            }

            // Update practiceProgress for non-F flows
            practiceProgress = {
              currentQuestion: 0,
              currentPracticeProgress: (userState / practiceSteps.length) * 100,
              currentPracticeStep: userState,
            };
          } else {
            console.error(
              `Fallback failed: No config found for milestone level ${levels} (key: ${levelKey})`
            );
            setLoading(false);
            return;
          }
        }

        // Save updated progress to localStorage and state
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        console.log("Fallback: Updated practiceProgress:", practiceProgress);
      }

      // Final check: If still no content, error out
      if (!currentGetContent) {
        console.error(
          "Failed to load content even after fallback. userState:",
          userState,
          "level:",
          newLevel,
          "levels:",
          levels
        );
        setLoading(false);
        return;
      }

      // M3 should always use getContent, not recommendation API
      // Use newLevel instead of level state, as level state might not be updated yet
      const levelToCheck = newLevel || level;
      // Check both levelToCheck (number) and as string "3" to be safe
      const isM3 =
        levelToCheck === 3 ||
        levelToCheck === "3" ||
        String(levelToCheck) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((levelToCheck === 1 || levelToCheck === 2) && lang === "en")
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
          lang === "en"
        ? getContentNew
        : getContent;

      console.log("Initial load - API selection for M3:", {
        level,
        newLevel,
        levelToCheck,
        levelToCheckType: typeof levelToCheck,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled:
          process.env.REACT_APP_USE_RECOMMENDATION_API === "true",
        lang,
      });

      //console.log("curGetCont", userState, currentGetContent);
      console.log("Initial load - Level check:", {
        level,
        newLevel,
        levelToCheck,
        levelType: typeof levelToCheck,
        isInExcludedList: ["B", 0, 10, 11, 12, 13, 14, 15].includes(
          levelToCheck
        ),
        willFetch: !["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck),
      });

      if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck)) {
        try {
          // For M4-M9, always use 10, otherwise use contentCount from config if available
          const contentLimit =
            levelToCheck >= 4 && levelToCheck <= 9
              ? 10
              : currentGetContent?.contentCount || limit;
          console.log(
            "Initial load - Fetching questions for level:",
            levelToCheck,
            "criteria:",
            currentGetContent.criteria,
            "contentLimit:",
            contentLimit
          );
          const resWord = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );

          console.log("Initial load - resWord:", resWord);
          console.log("Initial load - resWord?.content:", resWord?.content);
          console.log(
            "Initial load - Array.isArray(resWord):",
            Array.isArray(resWord)
          );

          if (!resWord) {
            console.error("Initial load - resWord is null/undefined");
          } else {
            setTotalSyllableCount(resWord?.totalSyllableCount);
            setLivesData({
              ...livesData,
              totalTargets: resWord?.totalSyllableCount,
              targetsForLives:
                resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
              targetPerLive:
                (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
            });

            // Handle both cases: resWord as array or resWord.content as array
            if (Array.isArray(resWord)) {
              quesArr = [...quesArr, ...resWord];
            } else if (resWord?.content && Array.isArray(resWord.content)) {
              quesArr = [...quesArr, ...resWord.content];
            } else if (resWord && !Array.isArray(resWord)) {
              // If resWord is an object but doesn't have content, use it as a single question
              quesArr = [...quesArr, resWord];
            }

            console.log("Initial load - quesArr after processing:", quesArr);

            if (quesArr.length === 0) {
              console.warn(
                "Initial load - quesArr is empty after processing resWord"
              );
            }

            setCurrentContentType(currentGetContent.criteria);

            setCurrentCollectionId(
              Array.isArray(resWord)
                ? resWord[0]?.collectionId
                : resWord?.content?.[0]?.collectionId
            );
            setAssessmentResponse(resWord);

            setLocalData("storyTitle", resWord?.name);

            localStorage.setItem("storyTitle", resWord?.name);

            setQuestions(quesArr);
            console.log(
              "Initial load - setQuestions called with:",
              quesArr,
              "length:",
              quesArr.length
            );
          }
        } catch (error) {
          console.error("Initial load - Error fetching questions:", error);
          setQuestions([]);
        }
      }

      if ([10, 11, 12, 13, 14, 15].includes(levelToCheck)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }
      // Add null check before accessing mechanism
      // Only set mechanism after questions are loaded (for non-F1 flows)
      // This prevents race condition where component renders before data is ready
      if (
        questions.length > 0 ||
        ["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck)
      ) {
        setMechanism(currentGetContent?.mechanism || {});
        console.log(
          "Initial load - Mechanism set to:",
          currentGetContent?.mechanism
        );
      } else {
        console.warn(
          "Initial load - Mechanism not set yet, questions not loaded. Questions length:",
          questions.length
        );
        // Set mechanism anyway, but log a warning
        setMechanism(currentGetContent?.mechanism || {});
      }

      // if (virtualId === "6760800019" || level == 12) {
      //   //setMechanism({ id: "read_aloud", name: "readAloud" });
      // }

      // if (virtualId === "1621936833" || level == 13) {
      //   setMechanism({ id: "r3", name: "r3" });
      // }

      let showcaseLevel =
        levels !== "B" && (userState === 4 || userState === 9);
      setIsShowCase(showcaseLevel);
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    setLocalData("correctPracticeWords", null);
  }, []);

  useEffect(() => {
    setLocalData("mechanism_id", (mechanism && mechanism.id) || "");
  }, [mechanism]);

  // Reset startShowCase to false when entering an Apply step (to show "Hurray!!! Ready for Challenge?" screen)
  useEffect(() => {
    const isF1ApplyStep = isF1FlowActive && f1FlowStep.step?.type === "A";
    const isF2ApplyStep = isF2FlowActive && f2FlowStep.step?.type === "A";
    const isF3ApplyStep = isF3FlowActive && f3FlowStep.step?.type === "A";

    if (isF1ApplyStep || isF2ApplyStep || isF3ApplyStep) {
      // Reset startShowCase to false when entering an Apply step
      // This ensures the "Hurray!!! Ready for Challenge?" screen is shown
      setStartShowCase(false);
    }
  }, [
    isF1FlowActive,
    f1FlowStep.step?.type,
    isF2FlowActive,
    f2FlowStep.step?.type,
    isF3FlowActive,
    f3FlowStep.step?.type,
  ]);

  const getCurrentContent = (stepKey) => {
    const lang = getLocalData("lang") || "en";

    // For F1, use "F1" as the level key
    const levelKey = shouldShowF1 ? "F1" : level;

    // If F1 flow is active, use the F1 flow index to get the correct step
    const actualStepKey = isF1FlowActive ? f1PracticeStepIndex : stepKey;

    return levelGetContent[lang]?.[levelKey]?.find(
      (elem) => elem.title === practiceSteps?.[actualStepKey]?.name
    );
  };

  const handleBack = async () => {
    const virtualId = getLocalData("virtualId");
    const sessionId = getLocalData("sessionId");
    const lang = getLocalData("lang");

    // Check if F1 flow is active by checking milestone level and F1 flow step
    const currentF1FlowStep = getF1FlowStep();
    const isF1FlowActiveCheck =
      milestoneLevel === "B" && currentF1FlowStep.step !== null;

    // Handle F1 flow back navigation
    if (isF1FlowActiveCheck) {
      const currentF1Index = currentF1FlowStep.index;
      if (currentF1Index > 0) {
        const newF1Index = currentF1Index - 1;
        setLocalData("f1FlowIndex", newF1Index);
        setF1FlowIndexState(newF1Index);

        // Get the F1 config for the previous step
        const f1Config = levelGetContent[lang]?.["F1"];
        const previousF1Step = f1Config?.[newF1Index];
        const previousF1FlowStep = F1_FLOW[newF1Index];

        // Determine mechanism from F1 flow step type
        let mechanismToSet;
        if (previousF1FlowStep?.type === "L") {
          mechanismToSet = { id: "letterTrain", name: "letterTrain" };
        } else if (
          previousF1FlowStep?.type === "P" ||
          previousF1FlowStep?.type === "A"
        ) {
          mechanismToSet = { id: "letterHunt", name: "letterHunt" };
        } else {
          mechanismToSet = previousF1Step?.mechanism || {
            id: "letterTrain",
            name: "letterTrain",
          };
        }

        // Update progress
        const practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: ((newF1Index + 1) / F1_FLOW.length) * 100,
          currentPracticeStep: newF1Index,
          fromBack: true,
        };

        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: newF1Index.toString(),
          progress: Math.min(
            100,
            Math.round(((newF1Index + 1) / F1_FLOW.length) * 100)
          ),
          language: lang,
          milestoneLevel: "B",
          subMilestoneLevel: "F1",
        });

        setProgressData(practiceProgress);
        setMechanism(mechanismToSet);
        setCurrentQuestion(0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));

        // For F1 flow, we don't need to fetch questions - they're handled by the components
        return;
      } else {
        // Can't go back further in F1 flow
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }
    }

    // Non-F1 flow back navigation
    if (progressData.currentPracticeStep > 0) {
      let practiceProgress = {};

      // Non-F1 flow back navigation
      let newCurrentPracticeStep =
        progressData.currentPracticeStep === 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };
      await addLesson({
        sessionId: sessionId,
        milestone: milestoneType,
        lesson: newCurrentPracticeStep,
        progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
        language: lang,
        milestoneLevel: `m${level}`,
      });

      setProgressData(practiceProgress);

      const currentGetContent = getCurrentContent(newCurrentPracticeStep);

      // Add safety check for undefined currentGetContent
      if (!currentGetContent) {
        console.error(
          "handleBack: currentGetContent is undefined for step:",
          newCurrentPracticeStep
        );
        setCurrentQuestion(practiceProgress?.currentQuestion || 0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        return;
      }

      // M3 should always use getContent, not recommendation API
      // Check both level (number) and level as string "3" to be safe
      const isM3 = level === 3 || level === "3" || String(level) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((level === 1 || level === 2) && lang === "en")
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true" &&
          lang === "en"
        ? getContentNew
        : getContent;

      console.log("handleBack - API selection for M3:", {
        level,
        levelType: typeof level,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled:
          process.env.REACT_APP_USE_RECOMMENDATION_API === "true",
        lang,
      });

      let quesArr = [];

      if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
        // Add safety check for criteria
        if (currentGetContent?.criteria) {
          // For M4-M9, always use 10, otherwise use contentCount from config if available
          const contentLimit =
            level >= 4 && level <= 9
              ? 10
              : currentGetContent?.contentCount || limit;
          console.log("fetchDetails - M3 S1 content fetch:", {
            step: currentGetContent?.title,
            contentCount: currentGetContent?.contentCount,
            contentLimit,
            defaultLimit: limit,
            hasMechanism: !!currentGetContent?.mechanism,
            mechanismName: currentGetContent?.mechanism?.name,
            criteria: currentGetContent.criteria,
            tags: currentGetContent?.tags,
            currentGetContent: currentGetContent, // Full config object for debugging
            level: level,
            practiceStep: currentPracticeStep,
          });

          // Force contentLimit to 10 for M3 S1 if config has it
          if (
            level === 3 &&
            currentGetContent?.title === "S1" &&
            currentGetContent?.contentCount
          ) {
            const forcedLimit = currentGetContent.contentCount;
            console.log(
              "fetchDetails - Forcing contentLimit to config value for M3 S1:",
              forcedLimit
            );
            // contentLimit is already set above, but let's ensure it's used
          }
          const resWord = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );
          console.log("fetchDetails - M3 S1 API response:", {
            contentCount: resWord?.content?.length,
            requestedLimit: contentLimit,
            content: resWord?.content,
          });
          setTotalSyllableCount(resWord?.totalSyllableCount);
          setLivesData({
            ...livesData,
            totalTargets: resWord?.totalSyllableCount,
            targetsForLives:
              resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
            targetPerLive:
              (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
          });
          quesArr = [...quesArr, ...(resWord?.content || [])];

          // Log the actual content received
          console.log("fetchDetails - M3 S1 final quesArr:", {
            quesArrLength: quesArr.length,
            resWordContentLength: resWord?.content?.length,
            requestedLimit: contentLimit,
            actualReceived: quesArr.length,
            expected: contentLimit,
          });

          // If we got fewer items than requested, log a warning
          if (
            quesArr.length < contentLimit &&
            level === 3 &&
            currentGetContent?.title === "S1"
          ) {
            console.warn(
              "fetchDetails - M3 S1: Received fewer items than requested!",
              {
                requested: contentLimit,
                received: quesArr.length,
                resWordContent: resWord?.content,
              }
            );
          }

          setCurrentContentType(currentGetContent.criteria);
          setCurrentCollectionId(resWord?.content?.[0]?.collectionId);
          setAssessmentResponse(resWord);

          setLocalData("storyTitle", resWord?.name);
          setQuestions(quesArr);
        }
      }

      if (["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }

      setTimeout(() => {
        // Add safety check for mechanism
        // if (currentGetContent?.mechanism) {
        setMechanism(currentGetContent?.mechanism || {});
        // }
        // else{
        //   renderMechanics();
        // }
      }, 1000);
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
  };

  useEffect(() => {
    if (livesData?.scoreData) {
      if (livesData?.redLivesToShow <= 0) {
        handleNext(true);
      }
    }
  }, [livesData]);

  function highlightWords(sentence, matchedChar, color) {
    const words = sentence.split(" ");
    matchedChar.sort(function (str1, str2) {
      return str2.length - str1.length;
    });

    let type = currentContentType?.toLowerCase();
    if (type === "char" || type === "word") {
      const word = splitGraphemes(words[0].toLowerCase()).filter(
        (item) => item !== "‌" && item !== "" && item !== " "
      );
      let highlightedString = [];
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length = splitGraphemes(matchedChar[j]).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    fontSize:
                      lang === "te"
                        ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                        : "clamp(1.6rem, 2.5vw, 3.8rem)",
                    fontWeight: lang === "te" ? 400 : 700,
                    fontFamily: getFontFamily(lang),
                    lineHeight: "50px",
                    background: "#FFF0BD",
                    color: color,
                  }}
                >
                  {i === 0 ? substr.toUpperCase() : substr}
                </Typography>
              </React.Fragment>
            );
            i += length - 1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(
            <React.Fragment key={i}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: color,
                  fontSize:
                    lang === "te"
                      ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                      : "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: getFontFamily(lang),
                  lineHeight: "50px",
                }}
              >
                {i === 0 ? word[i].toUpperCase() : word[i]}
              </Typography>
            </React.Fragment>
          );
        }
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some((char) =>
          word.toLowerCase().includes(char)
        );
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <Typography
                variant="h5"
                component="h4"
                ml={1}
                sx={{
                  fontSize:
                    lang === "te"
                      ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                      : "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: getFontFamily(lang),
                  lineHeight: "50px",
                  background: "#FFF0BD",
                }}
              >
                {word}
              </Typography>{" "}
            </React.Fragment>
          );
        } else {
          return (
            <Typography
              variant="h5"
              component="h4"
              ml={1}
              sx={{
                color: color,
                fontSize:
                  lang === "te"
                    ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                    : "clamp(1.6rem, 2.5vw, 3.8rem)",
                fontWeight: 700,
                fontFamily: getFontFamily(lang),
                lineHeight: "50px",
              }}
              key={index}
            >
              {word + " "}
            </Typography>
          );
        }
      });
      return highlightedSentence;
    }
  }

  useEffect(() => {
    if (questions[currentQuestion]?.contentSourceData) {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        const contentSourceData =
          questions[currentQuestion]?.contentSourceData || [];
        const stringLengths = contentSourceData.map((item) => item.text.length);
        const length =
          questions[currentQuestion]?.mechanics_data &&
          (questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
            "mechanic_2" ||
            questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
              "mechanic_1")
            ? 500
            : stringLengths[0];
        window.parent.postMessage(
          { type: "stringLengths", length },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
      }
    }
  }, [questions[currentQuestion]]);

  //console.log("mecc", wordWallFlow);

  const renderMechanics = () => {
    // IMPORTANT: For non-F flows (m1, m2, etc.), use mechanism from config as-is
    // Don't override mechanisms for milestone levels that are not "B"
    const isNonFFlow =
      milestoneLevel &&
      milestoneLevel !== "B" &&
      typeof milestoneLevel === "string" &&
      milestoneLevel.startsWith("m");

    // For F3 flow, ensure mechanism matches F3_FLOW step type
    // F3 flow takes precedence over F2 and F1 flows
    // F3 Practice steps use Letter Launcher, F3 Apply steps use Letter Launcher + Memory Challenge + Read Aloud
    if (
      !isNonFFlow &&
      isF3FlowActive &&
      f3FlowStep?.step &&
      milestoneLevel === "B"
    ) {
      const currentF3Step = getF3FlowStep();
      const f3StepType = currentF3Step.step?.type;
      const expectedMechanism =
        f3StepType === "P" || f3StepType === "A"
          ? "letterLauncher" // F3 Practice and Apply steps use Letter Launcher
          : null;

      // If mechanism doesn't match expected, fix it immediately
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - F3 flow mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f3StepType,
              f3FlowIndexState,
              currentF3StepIndex: currentF3Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately
        if (expectedMechanism === "letterLauncher") {
          console.log(
            "renderMechanics - Setting mechanism to letterLauncher for F3 step"
          );
          setMechanism({ id: "letterLauncher", name: "letterLauncher" });
        }
      }
    }
    // For F2 flow, ensure mechanism matches F2_FLOW step type
    // F2 flow takes precedence over F1 flow when both conditions might be true
    // F2 Learn steps use LetterTrain, F2 Practice and Apply steps use LetterHunt
    else if (
      !isNonFFlow &&
      isF2FlowActive &&
      f2FlowStep?.step &&
      milestoneLevel === "B"
    ) {
      const currentF2Step = getF2FlowStep();
      const f2StepType = currentF2Step.step?.type;
      const isIndicLanguage = lang !== "en";
      const expectedMechanism =
        f2StepType === "L"
          ? isIndicLanguage
            ? "barakhadi"
            : "letterTrain" // F2 Learn steps use LetterTrain
          : f2StepType === "P" || f2StepType === "A"
          ? "letterHunt" // F2 Practice and Apply steps use LetterHunt
          : null;

      // If mechanism doesn't match expected, fix it immediately
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - F2 flow mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f2StepType,
              f2FlowIndexState,
              currentF2StepIndex: currentF2Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately
        if (expectedMechanism === "barakhadi") {
          console.log(
            "renderMechanics - Setting mechanism to barakhadi for F2 Learn step (Indic language)"
          );
          setMechanism({ id: "barakhadi", name: "barakhadi" });
        } else if (expectedMechanism === "letterTrain") {
          console.log(
            "renderMechanics - Setting mechanism to letterTrain for F2 Learn step (English)"
          );
          setMechanism({ id: "letterTrain", name: "letterTrain" });
        } else if (expectedMechanism === "letterHunt") {
          console.log(
            "renderMechanics - Setting mechanism to letterHunt for F2 step"
          );
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
      }
    }
    // For F1 flow, ensure mechanism matches F1_FLOW step type
    // This prevents rendering the wrong component due to stale mechanism state
    // Only run this for F1 flow (level "B") to avoid interfering with other flows
    // F1 flow should only be active if F2 flow is not active
    else if (
      !isNonFFlow &&
      isF1FlowActive &&
      f1FlowStep?.step &&
      milestoneLevel === "B" &&
      !isF2FlowActive
    ) {
      const currentF1Step = getF1FlowStep();
      const f1StepType = currentF1Step.step?.type;
      const expectedMechanism =
        f1StepType === "L"
          ? "letterTrain"
          : f1StepType === "P" || f1StepType === "A"
          ? "letterHunt"
          : null;

      // If mechanism doesn't match expected, fix it immediately
      // Only log warning if mechanism exists but is wrong (not just undefined during initialization)
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect (not just undefined/empty)
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - Mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f1StepType,
              f1FlowIndexState,
              currentF1StepIndex: currentF1Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately (this will happen even if mechanism is undefined/empty during initialization)
        if (expectedMechanism === "letterTrain") {
          console.log("renderMechanics - Setting mechanism to letterTrain");
          setMechanism({ id: "letterTrain", name: "letterTrain" });
        } else if (expectedMechanism === "letterHunt") {
          console.log("renderMechanics - Setting mechanism to letterHunt");
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
      }
    }

    // Check F1 completion FIRST - highest priority
    // Use state value which is kept in sync with localStorage
    // For F1 flow with Learn steps (LetterTrain), skip this check and go to LetterTrain
    const isF1LearnStepForRender =
      isF1FlowActive &&
      milestoneLevel === "B" &&
      shouldShowF1 &&
      getF1FlowStep()?.step?.type === "L";
    // Check if mechanism is empty - handle both string and object types
    const isMechanismEmpty =
      !mechanism ||
      (typeof mechanism === "string" && mechanism === "") ||
      (typeof mechanism === "object" && !mechanism.id && !mechanism.name);

    // For non-F flows (m1, m2, etc.), if no mechanism from config, render WordsOrImage
    // For F flows, use existing logic
    // IMPORTANT: Always check for special flows (tFlow, wordWallFlow, etc.) before falling back to WordsOrImage
    if (
      !isF1LearnStepForRender &&
      ((isNonFFlow &&
        isMechanismEmpty &&
        rFlow !== "true" &&
        tFlow !== "true" &&
        readMatch !== "true" &&
        wordWallFlow !== "true") ||
        (!isNonFFlow &&
          ((isMechanismEmpty &&
            rFlow !== "true" &&
            tFlow !== "true" &&
            readMatch !== "true" &&
            wordWallFlow !== "true") ||
            (mechanism &&
              typeof mechanism === "object" &&
              mechanism?.id === "mechanic_15" &&
              rFlow !== "true" &&
              tFlow !== "true" &&
              readMatch !== "true" &&
              wordWallFlow !== "true"))))
    ) {
      const mechanics_data = questions[currentQuestion]?.mechanics_data;

      return (
        <WordsOrImage
          {...{
            level: level,
            audioLink: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${questions[currentQuestion]?.contentId}.wav`,
            mechanism_id: mechanism?.id,
            header:
              mechanism?.id &&
              (mechanism?.id === "mechanic_15"
                ? "Read the question and record your response"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`),
            words:
              mechanism?.id === "mechanic_15"
                ? questions[currentQuestion]?.mechanics_data?.[0]?.text
                : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            hints: questions[currentQuestion]?.mechanics_data?.[0]?.hints?.text,
            multilingual: questions[currentQuestion]?.multilingual,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            image:
              mechanism?.id === "mechanic_15"
                ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${questions[currentQuestion]?.mechanics_data[0]?.image_url}`
                : "",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            startShowCase,
            setStartShowCase,
            handleBack: !isShowCase && handleBack,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            loading,
            percentage,
            fluency,
            setOpenMessageDialog,
            setEnableNext,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (tFlow === "true") {
      // Note: React.memo with custom comparison in TowreFlow will prevent
      // unnecessary re-renders even if props object is recreated
      return (
        <TowreFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      (mechanism.name === "r0" ||
        mechanism.name === "r1" ||
        mechanism.name === "r2" ||
        mechanism.name === "r3" ||
        mechanism.name === "r4")
    ) {
      // R0, R1, R2, R3, R4 mechanisms from config
      const getCurrentContentForR = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForR?.customLetters;

      // Common props for all R components
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? `Guess the below image`
            : `Speak the below word`,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: questions?.length,
        currentStep: currentQuestion + 1,
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      // Render appropriate R component based on mechanism name
      if (mechanism.name === "r0") {
        return <R0 {...commonProps} customLetters={customLetters} />;
      } else if (mechanism.name === "r1") {
        return <R1 {...commonProps} />;
      } else if (mechanism.name === "r2") {
        return <R2 {...commonProps} />;
      } else if (mechanism.name === "r3") {
        return <R3 {...commonProps} />;
      } else if (mechanism.name === "r4") {
        return <R4 {...commonProps} />;
      }
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "soundHunt"
    ) {
      // SoundHunt mechanism from config
      const getCurrentContentForSoundHunt = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForSoundHunt?.customLetters;

      // Common props for SoundHunt component
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? `Guess the below image`
            : `Speak the below word`,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: questions?.length,
        currentStep: currentQuestion + 1,
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      return (
        <SoundHunt
          isShowCase={false}
          {...commonProps}
          customLetters={customLetters}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "soundHuntS1Combined"
    ) {
      // SoundHuntS1Combined mechanism - handles both Word Hunt and Sound Hunt for m1 s1
      // This component uses its own filteredContent (10 soundMatch + 10 pictureWords = 20 items)
      // So we need to set steps to 20, not questions?.length
      const getCurrentContentForCombined = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForCombined?.customLetters;

      // Common props for SoundHuntS1Combined component
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? `Guess the below image`
            : `Speak the below word`,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: 20, // SoundHuntS1Combined always has 20 items (10 soundMatch + 10 pictureWords)
        currentStep: currentQuestion + 1, // This will be updated by the component internally
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase: true,
        startShowCase,
        setStartShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      return (
        <SoundHuntS1Combined {...commonProps} customLetters={customLetters} />
      );
    } else if (readMatch === "true") {
      return (
        <ReadMatch
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (wordWallFlow === "true") {
      return (
        <WordWall
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            multilingual: questions[currentQuestion]?.multilingual,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    }
    // Removed F1 component check - LetterTrain should be used instead for F1 Learn steps
    // The LetterTrain check below will handle F1 Learn steps
    else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 0 &&
      !isF1FlowActive
    ) {
      // Legacy R0 flow (deprecated - use F1 instead)
      // Get currentGetContent to access customLetters
      const currentGetContentForR0 = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = currentGetContentForR0?.customLetters;

      return (
        <R0
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            setIsNextButtonCalled,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customLetters: customLetters,
          }}
        />
      );
    } else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 1 &&
      lang === "en" &&
      !isF1FlowActive &&
      !f1FlowComplete
    ) {
      // Legacy R1 flow (deprecated - use F1 instead)
      return (
        <R1
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 1 &&
      lang !== "en"
    ) {
      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (rFlow === "true" && level === 2 && [2, 3, 4].includes(rStep)) {
      return (
        <R2
          page={page}
          setPage={setPage}
          rStep={rStep}
          //onComplete={() => handleComplete(3)}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      mechanism.name === "fillInTheBlank" &&
      mechanism.id !== ""
    ) {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "formAWord2"
    ) {
      // Get the multilingual config from the step config
      const currentStepConfig = getCurrentContent(
        progressData?.currentPracticeStep
      );
      const enableMultilingual = currentStepConfig?.multilingual !== false;

      return (
        <Mechanics7
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: questions[currentQuestion]?.contentSourceData?.[0],
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            multilingual: questions[currentQuestion]?.multilingual,
            enableMultilingual: enableMultilingual,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "bingoCard") {
      return (
        <BingoCard
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP1") {
      return (
        <FluencyP1
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData:
              questions[currentQuestion]?.contentSourceData?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP2") {
      // Check if questions array has data
      if (
        !questions ||
        questions.length === 0 ||
        currentQuestion >= questions.length
      ) {
        console.warn(
          "FluencyP2 - Questions not loaded yet or invalid currentQuestion",
          {
            questionsLength: questions?.length,
            currentQuestion,
            questions: questions,
          }
        );
        // Return loading state or null until questions are loaded
        return null;
      }

      // Get contentSourceData with fallback
      const currentQuestionData = questions[currentQuestion];
      console.log("FluencyP2 - currentQuestionData:", currentQuestionData);
      console.log("FluencyP2 - questions array:", questions);
      console.log("FluencyP2 - currentQuestion index:", currentQuestion);

      // Try to get contentSourceData from various possible locations
      let contentSourceDataForP2 = currentQuestionData?.contentSourceData?.[0];

      // If not found, try alternative structures
      if (!contentSourceDataForP2) {
        if (currentQuestionData?.text) {
          // Text might be directly on the question object
          contentSourceDataForP2 = {
            text: currentQuestionData.text,
            audioUrl:
              currentQuestionData.audioUrl ||
              currentQuestionData.audio_url ||
              "",
          };
        } else if (
          currentQuestionData?.contentSourceData &&
          Array.isArray(currentQuestionData.contentSourceData) &&
          currentQuestionData.contentSourceData.length > 0
        ) {
          contentSourceDataForP2 = currentQuestionData.contentSourceData[0];
        }
      }

      console.log(
        "FluencyP2 - contentSourceDataForP2:",
        contentSourceDataForP2
      );

      // If still no data, show retry dialog
      if (!contentSourceDataForP2) {
        console.warn(
          "FluencyP2 - No contentSourceData found, showing retry dialog"
        );
        if (!showRetryDialog) {
          setRetryDialogMessage("Unable to load content. Please retry.");
          setShowRetryDialog(true);
        }
        return null;
      }

      return (
        <FluencyP2
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: contentSourceDataForP2,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP3") {
      return (
        <FluencyP3
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP4") {
      return (
        <FluencyP4
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: isShowCase
              ? "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
              : undefined,
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase ? handleBack : undefined,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP5") {
      return (
        <FluencyP5
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData:
              questions[currentQuestion]?.contentSourceData?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP6") {
      return (
        <ParagraphFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions[currentQuestion],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "syllablePuzzle") {
      return (
        <SyllablePuzzle
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "readTheImage") {
      const options = questions[currentQuestion]?.mechanics_data
        ? questions[currentQuestion]?.mechanics_data[0]?.options
        : [];
      const audioLink =
        options && options.length > 0
          ? options.find((option) => option.isAns === true)?.audio_url || null
          : null;

      const mechanics_data = questions[currentQuestion]?.mechanics_data;
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism?.id === "mechanic_16"
                ? "Read the question and select correct answer"
                : "Look at the picture and speak the correct answer from below",
            parentWords: mechanics_data
              ? mechanics_data[0].text
              : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            question_audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                mechanics_data[0].audio_url
              : questions[currentQuestion]?.contentSourceData?.[0]?.audio_url,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            options: options,
            correctness: mechanics_data ? mechanics_data[0]?.correctness : null,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            mechanism: mechanism?.id,
            image: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                mechanics_data[0]?.image_url
              : null,

            audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                audioLink
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "formASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: "Form a sentence using the words and speak",
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            jumbled_text:
              questions[currentQuestion]?.mechanics_data?.[0]?.jumbled_text,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            // image: elephant,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "readAloud") {
      return (
        <ReadAloud
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "jumbledWord") {
      return (
        <JumbledWord
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "askMore") {
      return (
        <AskMoreM14
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "actOut") {
      return (
        <ActOutM13
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "ReadAloudMcqM10") {
      return (
        <PhoneConversation
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "WhatsMissing") {
      return (
        <WhatsMissing
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "arrangePicture") {
      return (
        <ArrangePicture
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "barakhadi" &&
      isF2FlowActive &&
      milestoneLevel === "B" &&
      getF2FlowStep()?.step?.type === "L"
    ) {
      // Render Barakhadi for F2 Learn steps in Indic languages
      const lang = getLocalData("lang") || "en";

      // Check if this is a F2 Learn step for render
      const currentF2StepForBarakhadi = getF2FlowStep();
      const isF2LearnStepForBarakhadi =
        currentF2StepForBarakhadi?.step?.type === "L";

      // Get current F2 flow step to extract customWords (customLetters from config)
      const currentF2Step = getF2FlowStep();
      const f2IndexToUse = currentF2Step?.index ?? f2FlowIndexState;

      // Get F2 config from constants
      const f2Config = levelGetContent[lang]?.["F2"];
      let currentGetContentForF2;

      if (
        f2Config &&
        Array.isArray(f2Config) &&
        f2IndexToUse >= 0 &&
        f2IndexToUse < f2Config.length
      ) {
        currentGetContentForF2 = f2Config[f2IndexToUse];
      } else {
        // Fallback: try to get content using getCurrentContent
        const currentF2FlowStep = getF2FlowStep();
        if (currentF2FlowStep?.step?.title) {
          currentGetContentForF2 = getCurrentContent(
            level,
            currentF2FlowStep.step.title,
            lang
          );
        }
      }

      // Extract customWords from F2 config (customLetters contains words for F2 Learn steps)
      const customWordsForF2 = currentGetContentForF2?.customLetters;

      console.log("Barakhadi render - F2 Learn step for Indic language:", {
        mechanism: mechanism?.name,
        isF2FlowActive,
        milestoneLevel,
        f2StepType: getF2FlowStep()?.step?.type,
        lang,
        f2IndexToUse,
        customWordsForF2,
        currentGetContentForF2,
      });

      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header: `Speak the below word`,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext: isF2LearnStepForBarakhadi
              ? handleLetterTrainComplete
              : handleNext, // Use same conditional pattern as LetterTrain
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customWords: customWordsForF2, // Pass customWords from F2 config (customLetters contains words)
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "barakhadi" &&
      isF2FlowActive &&
      milestoneLevel === "B" &&
      getF2FlowStep()?.step?.type === "L"
    ) {
      // Render Barakhadi for F2 Learn steps in Indic languages
      const lang = getLocalData("lang") || "en";

      // Check if this is a F2 Learn step for render
      const currentF2StepForBarakhadi = getF2FlowStep();
      const isF2LearnStepForBarakhadi =
        currentF2StepForBarakhadi?.step?.type === "L";

      // Get current F2 flow step to extract customWords (customLetters from config)
      const currentF2Step = getF2FlowStep();
      const f2IndexToUse = currentF2Step?.index ?? f2FlowIndexState;

      // Get F2 config from constants
      const f2Config = levelGetContent[lang]?.["F2"];
      let currentGetContentForF2;

      if (
        f2Config &&
        Array.isArray(f2Config) &&
        f2IndexToUse >= 0 &&
        f2IndexToUse < f2Config.length
      ) {
        currentGetContentForF2 = f2Config[f2IndexToUse];
      } else {
        // Fallback: try to get content using getCurrentContent
        const currentF2FlowStep = getF2FlowStep();
        if (currentF2FlowStep?.step?.title) {
          currentGetContentForF2 = getCurrentContent(
            level,
            currentF2FlowStep.step.title,
            lang
          );
        }
      }

      // Extract customWords from F2 config (customLetters contains words for F2 Learn steps)
      const customWordsForF2 = currentGetContentForF2?.customLetters;

      console.log("Barakhadi render - F2 Learn step for Indic language:", {
        mechanism: mechanism?.name,
        isF2FlowActive,
        milestoneLevel,
        f2StepType: getF2FlowStep()?.step?.type,
        lang,
        f2IndexToUse,
        customWordsForF2,
        currentGetContentForF2,
      });

      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header: `Speak the below word`,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext: isF2LearnStepForBarakhadi
              ? handleLetterTrainComplete
              : handleNext, // Use same conditional pattern as LetterTrain
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customWords: customWordsForF2, // Pass customWords from F2 config (customLetters contains words)
          }}
        />
      );
    } else if (
      (mechanism &&
        typeof mechanism === "object" &&
        mechanism.name === "letterTrain") ||
      (isF2FlowActive &&
        milestoneLevel === "B" &&
        shouldShowF2 &&
        getF2FlowStep()?.step?.type === "L") || // F2 Learn steps use LetterTrain
      (isF1FlowActive &&
        milestoneLevel === "B" &&
        shouldShowF1 &&
        !isF2FlowActive && // Don't render LetterTrain for F1 if F2 flow is active
        getF1FlowStep()?.step?.type === "L")
    ) {
      console.log("LetterTrain render - Condition matched, entering block", {
        mechanismMatch:
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name === "letterTrain",
        f1FlowMatch:
          isF1FlowActive &&
          milestoneLevel === "B" &&
          shouldShowF1 &&
          getF1FlowStep()?.step?.type === "L",
        mechanism: typeof mechanism === "object" ? mechanism?.name : mechanism,
        isF1FlowActive,
        milestoneLevel,
        shouldShowF1,
        f1StepType: getF1FlowStep()?.step?.type,
      });

      // Only render LetterTrain for F1 flow (milestone level "B")
      // Double-check that this is actually F1 flow, not other milestones
      if (isF1FlowActive && milestoneLevel !== "B") {
        console.warn(
          "LetterTrain render - isF1FlowActive is true but milestoneLevel is not 'B':",
          milestoneLevel
        );
        // Don't render LetterTrain for non-F1 milestones - skip this block
      } else {
        console.log("LetterTrain render - Entering LetterTrain block", {
          mechanism:
            typeof mechanism === "object" ? mechanism?.name : mechanism,
          mechanismType: typeof mechanism,
          isF1FlowActive,
          milestoneLevel,
          shouldShowF1,
          f1FlowIndexState,
          f1StepType: isF1FlowActive ? getF1FlowStep()?.step?.type : null,
        });

        // Get currentGetContent to access customLetters
        // For F1 flow, directly access F1 config array using f1FlowIndexState
        let currentGetContentForLetterTrain;
        let customLetters;

        // Check if this is an F2 Learn step (takes precedence)
        const currentF2StepForLetterTrain = isF2FlowActive
          ? getF2FlowStep()
          : null;
        const isF2LearnStepForRender =
          currentF2StepForLetterTrain?.step?.type === "L";

        // Check if this is an F1 Learn step
        const currentF1StepForLetterTrain =
          isF1FlowActive && !isF2FlowActive ? getF1FlowStep() : null;
        const isF1LearnStepForRender =
          currentF1StepForLetterTrain?.step?.type === "L";

        console.log("LetterTrain render - F1/F2 step check", {
          currentF1Step: currentF1StepForLetterTrain,
          currentF2Step: currentF2StepForLetterTrain,
          isF1LearnStepForRender,
          isF2LearnStepForRender,
          f1StepType: currentF1StepForLetterTrain?.step?.type,
          f2StepType: currentF2StepForLetterTrain?.step?.type,
        });

        // If it's F1/F2 flow but not a Learn step, don't render LetterTrain - let it fall through to LetterHunt
        // Also check that milestoneLevel is actually "B" to prevent rendering for other milestones
        if (
          (isF2FlowActive && !isF2LearnStepForRender) ||
          (isF1FlowActive && !isF1LearnStepForRender) ||
          ((isF1FlowActive || isF2FlowActive) && milestoneLevel !== "B")
        ) {
          if (isF1FlowActive && milestoneLevel !== "B") {
            console.warn(
              "LetterTrain render - Blocked: isF1FlowActive but milestoneLevel is not 'B':",
              milestoneLevel
            );
          } else {
            console.log(
              "LetterTrain render - Not a Learn step, will fall through to LetterHunt"
            );
          }
          // Don't render LetterTrain for Practice/Apply steps or non-F1 milestones
          // This will fall through to LetterHunt rendering or other mechanisms
          // Don't return null here - let it continue to check other mechanisms
        } else {
          // Ensure mechanism is set correctly for F1/F2 flow Learn steps
          if (
            (isF2FlowActive || isF1FlowActive) &&
            (isF2LearnStepForRender || isF1LearnStepForRender) &&
            mechanism?.name !== "letterTrain"
          ) {
            console.log(
              "LetterTrain render - Setting mechanism to letterTrain for F1/F2 Learn step"
            );
            setMechanism({ id: "letterTrain", name: "letterTrain" });
          }

          if (isF2FlowActive) {
            // For F2 flow, use currentF2Step.index (from localStorage) instead of f2FlowIndexState
            // This ensures we always use the most up-to-date index
            const f2IndexToUse = currentF2StepForLetterTrain.index;
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
              currentGetContentForLetterTrain = f2Config[f2IndexToUse];
              customLetters = currentGetContentForLetterTrain?.customLetters;
              console.log(
                "LetterTrain render - F2 config for index:",
                f2IndexToUse,
                "customLetters:",
                customLetters
              );
            } else {
              console.error(
                "LetterTrain render - F2 config not found for index:",
                f2IndexToUse,
                "f2FlowIndexState:",
                f2FlowIndexState
              );
              currentGetContentForLetterTrain = null;
              customLetters = null;
            }
          } else if (isF1FlowActive) {
            // For F1 flow, use currentF1Step.index (from localStorage) instead of f1FlowIndexState
            // This ensures we always use the most up-to-date index
            const currentF1Step = getF1FlowStep();
            const f1IndexToUse = currentF1Step.index;
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
              currentGetContentForLetterTrain = f1Config[f1IndexToUse];
              customLetters = currentGetContentForLetterTrain?.customLetters;
              console.log(
                "LetterTrain render - F1 config for index:",
                f1IndexToUse,
                "customLetters:",
                customLetters
              );
            } else {
              console.error(
                "LetterTrain render - F1 config not found for index:",
                f1IndexToUse,
                "f1FlowIndexState:",
                f1FlowIndexState
              );
              currentGetContentForLetterTrain = null;
              customLetters = null;
            }
          } else {
            // For non-F1 flow, use getCurrentContent
            const stepIndexForContent = progressData?.currentPracticeStep || 0;
            currentGetContentForLetterTrain =
              getCurrentContent(stepIndexForContent);
            customLetters = currentGetContentForLetterTrain?.customLetters;
          }

          // Only render LetterTrain if we have customLetters (for F1/F2 Learn steps)
          // If customLetters is undefined, it means we're not in a Learn step, so don't render
          console.log("LetterTrain render - Checking customLetters", {
            customLetters,
            isF1FlowActive,
            isF2FlowActive,
            currentGetContent: currentGetContentForLetterTrain,
            f1FlowIndexState,
            f2FlowIndexState,
            f1IndexToUse: isF1FlowActive ? getF1FlowStep().index : null,
            f2IndexToUse: isF2FlowActive ? getF2FlowStep().index : null,
          });

          // If customLetters is still undefined, try to get it from currentGetContent (the one logged as curContent)
          if (!customLetters && isF2FlowActive) {
            // Try to get customLetters from the current F2 content that was loaded
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            const currentF2Step = getF2FlowStep();
            const f2IndexToUse = currentF2Step.index;
            if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
              const fallbackContent = f2Config[f2IndexToUse];
              if (fallbackContent?.customLetters) {
                console.log(
                  "LetterTrain render - Found customLetters in F2 fallback content:",
                  fallbackContent.customLetters
                );
                customLetters = fallbackContent.customLetters;
                currentGetContentForLetterTrain = fallbackContent;
              }
            }
          } else if (!customLetters && isF1FlowActive) {
            // Try to get customLetters from the current F1 content that was loaded
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            const currentF1Step = getF1FlowStep();
            const f1IndexToUse = currentF1Step.index;
            if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
              const fallbackContent = f1Config[f1IndexToUse];
              if (fallbackContent?.customLetters) {
                console.log(
                  "LetterTrain render - Found customLetters in F1 fallback content:",
                  fallbackContent.customLetters
                );
                customLetters = fallbackContent.customLetters;
                currentGetContentForLetterTrain = fallbackContent;
              }
            }
          }

          if (!customLetters && (isF2FlowActive || isF1FlowActive)) {
            console.warn(
              "LetterTrain render blocked: customLetters is undefined for F1/F2 flow step",
              {
                stepIndex: isF2FlowActive
                  ? f2FlowIndexState
                  : isF1FlowActive
                  ? f1FlowIndexState
                  : progressData?.currentPracticeStep || 0,
                f1FlowIndexState,
                f2FlowIndexState,
                f1FlowStep: f1FlowStep?.step,
                f2FlowStep: f2FlowStep?.step,
                currentGetContent: currentGetContentForLetterTrain,
              }
            );
            // Don't render LetterTrain if we don't have customLetters in F1 flow
            // Don't return null - let it fall through to check other mechanisms or show loading
            // Returning null causes blank screen
          } else if (customLetters) {
            console.log(
              "LetterTrain render - Rendering LetterTrain with customLetters:",
              customLetters
            );
            return (
              <LetterTrain
                page={page}
                setPage={setPage}
                isAlphabetDemoActive={isAlphabetDemoActive}
                {...{
                  level: level,
                  header:
                    questions[currentQuestion]?.contentType === "image"
                      ? `Guess the below image`
                      : `Speak the below word`,
                  currentImg: currentImage,
                  parentWords: parentWords,
                  contentType: currentContentType,
                  contentId: questions[currentQuestion]?.contentId,
                  setVoiceText,
                  setRecordedAudio,
                  setVoiceAnimate,
                  storyLine,
                  handleNext:
                    isF2LearnStepForRender || isF1LearnStep
                      ? handleLetterTrainComplete
                      : handleNext,
                  type: "word",
                  enableNext,
                  showTimer: false,
                  points,
                  steps: questions?.length,
                  currentStep: currentQuestion + 1,
                  progressData,
                  showProgress: true,
                  background:
                    isShowCase &&
                    "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
                  playTeacherAudio,
                  callUpdateLearner: isShowCase,
                  disableScreen,
                  isShowCase,
                  handleBack: !isShowCase && handleBack,
                  setEnableNext,
                  loading,
                  setOpenMessageDialog,
                  vocabCount,
                  wordCount,
                  customLetters: customLetters,
                }}
              />
            );
          }
        }
      }
    } else if (mechanism && mechanism.name === "letterLauncher") {
      // F3 flow uses Letter Launcher for Practice and Apply steps
      if (isF3FlowActive && f3FlowStep?.step && milestoneLevel === "B") {
        const currentF3Step = getF3FlowStep();
        const f3StepType = currentF3Step.step?.type;
        console.log("LetterLauncher render - F3 flow check:", {
          f3FlowIndexState,
          currentF3StepIndex: currentF3Step.index,
          f3StepType,
          mechanism: mechanism?.name,
          step: currentF3Step.step,
          hasStep: !!currentF3Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF3Step.step) {
          console.warn(
            "LetterLauncher render - No F3 step found at index:",
            currentF3Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage("Unable to load F3 flow step. Please retry.");
            setShowRetryDialog(true);
          }
          return null;
        }

        // Get F3 config
        const lang = getLocalData("lang") || "en";
        const f3Config = levelGetContent[lang]?.["F3"];
        const f3IndexToUse = currentF3Step.index;
        let currentGetContentForF3;
        if (f3Config && Array.isArray(f3Config) && f3Config[f3IndexToUse]) {
          currentGetContentForF3 = f3Config[f3IndexToUse];
          console.log(
            "LetterLauncher render - F3 config for index:",
            f3IndexToUse,
            "content:",
            currentGetContentForF3
          );
        } else {
          console.error(
            "LetterLauncher render - F3 config not found for index:",
            f3IndexToUse
          );
          return (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>F3 Flow - Letter Launcher</h2>
              <p>Letter Launcher component not yet implemented.</p>
              <p>
                Step: {f3StepType}
                {currentF3Step.step?.step}
              </p>
            </div>
          );
        }

        // Extract config values
        const letterLauncherLevel =
          currentGetContentForF3?.letterLauncherLevel || 1;
        const letterLauncherEndLevel =
          currentGetContentForF3?.letterLauncherEndLevel;
        const letterLauncherContentCount =
          currentGetContentForF3?.letterLauncherContentCount || 10;
        const contentType =
          currentF3Step.step?.contentType ||
          currentGetContentForF3?.contentType ||
          "letter";
        const isShowcase = currentGetContentForF3?.isShowcase || false;
        const applyStep = currentGetContentForF3?.applyStep;
        const failRedirect = currentGetContentForF3?.failRedirect;
        const passRedirect = currentGetContentForF3?.passRedirect;
        const memoryChallengeLevel =
          currentGetContentForF3?.memoryChallengeLevel;
        const memoryChallengeEndLevel =
          currentGetContentForF3?.memoryChallengeEndLevel;
        const memoryChallengeContentCount =
          currentGetContentForF3?.memoryChallengeContentCount || 5;
        const readAloudContentCount =
          currentGetContentForF3?.readAloudContentCount;
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;
        const sessionId = getLocalData("sessionId");

        // Track which sub-step we're on for Apply steps (Letter Launcher -> Memory Challenge -> Read Aloud)
        const f3ApplySubStepState =
          getLocalData("f3ApplySubStep") || "letterLauncher";

        // For Apply steps, check if we need to show Memory Challenge or Read Aloud
        if (f3StepType === "A" && isShowcase) {
          // Apply step - check sub-step
          if (
            f3ApplySubStepState === "memoryChallenge" &&
            memoryChallengeLevel
          ) {
            // Show Memory Challenge
            return (
              <MemoryChallengeMechanics
                page={page}
                setPage={setPage}
                level={memoryChallengeLevel}
                endLevel={memoryChallengeEndLevel || 3}
                contentCount={memoryChallengeContentCount}
                sessionId={sessionId}
                handleNext={() => {
                  // Check for redirect request first
                  const f3FlowRedirect = getLocalData("f3FlowRedirect");
                  if (f3FlowRedirect) {
                    // Redirect is handled by Practice.jsx's handleNext
                    if (handleNext) {
                      handleNext();
                    }
                    return;
                  }

                  // After Memory Challenge, check if we need Read Aloud
                  if (readAloudContentCount && applyStep === 2) {
                    // A2: Show Read Aloud after Memory Challenge
                    setLocalData("f3ApplySubStep", "readAloud");
                    // Force re-render by updating mechanism
                    setMechanism({ id: "readAloud", name: "readAloud" });
                  } else {
                    // A1: Complete after Memory Challenge
                    setLocalData("f3ApplySubStep", null);
                    if (handleNext) {
                      handleNext();
                    }
                  }
                }}
                handleBack={handleBack}
                applyStep={applyStep}
                failRedirect={failRedirect}
                passRedirect={passRedirect}
                isF3FlowActive={isF3FlowActive}
                f3FlowStep={f3FlowStep}
                isShowCase={isShowcase}
                header="Memory Challenge"
                points={points}
                steps={memoryChallengeContentCount}
                currentStep={1}
                progressData={progressData}
                showProgress={true}
                background="#FFB31F"
                enableNext={enableNext}
                setEnableNext={setEnableNext}
                loading={loading}
                setOpenMessageDialog={setOpenMessageDialog}
                vocabCount={vocabCount}
                wordCount={wordCount}
                showTimer={false}
                milestoneLevel={milestoneLevelValue}
                setProgressData={setProgressData}
                setCurrentQuestion={setCurrentQuestion}
              />
            );
          } else if (
            f3ApplySubStepState === "readAloud" &&
            readAloudContentCount
          ) {
            // Show Read Aloud (for A2)
            // ReadAloud component already exists, use it
            return (
              <ReadAloud
                page={page}
                setPage={setPage}
                handleNext={() => {
                  // Complete A2 - check if we should redirect to discover-start
                  setLocalData("f3ApplySubStep", null);

                  // Check if A2 is complete and should redirect to discover-start
                  // A2 is the last step in F3 flow (index 13), and passRedirect is "complete"
                  if (
                    applyStep === 2 &&
                    passRedirect === "complete" &&
                    f3FlowStep?.isLast
                  ) {
                    console.log(
                      "A2 completed successfully - F3 flow complete, redirecting to discover-start"
                    );
                    // Clear F3 flow data
                    setLocalData("f3FlowIndex", null);
                    setLocalData("f3FlowComplete", "true");
                    // Clear practice progress
                    setLocalData("practiceProgress", null);
                    // Redirect to discover-start
                    navigate("/discover-start");
                    return;
                  }

                  if (handleNext) {
                    handleNext();
                  }
                }}
                handleBack={handleBack}
                // ... other ReadAloud props
              />
            );
          }
          // Default: Show Letter Launcher for Apply step
        }

        // Render Letter Launcher using library component
        return (
          <LetterLauncherMechanics
            page={page}
            setPage={setPage}
            level={letterLauncherLevel}
            endLevel={letterLauncherEndLevel}
            contentType={contentType}
            contentCount={letterLauncherContentCount}
            isShowCase={isShowcase}
            sessionId={sessionId}
            handleNext={() => {
              // FIRST: Check if there's a redirect request (e.g., from failed level)
              // This takes priority over moving to Memory Challenge
              const f3FlowRedirect = getLocalData("f3FlowRedirect");
              if (f3FlowRedirect) {
                console.log(
                  `Letter Launcher handleNext - Redirect flag found: ${f3FlowRedirect}, redirecting instead of moving to Memory Challenge`
                );
                // Call the main handleNext which will handle the redirect
                if (handleNext) {
                  handleNext();
                }
                return;
              }

              // SECOND: For Apply steps, after Letter Launcher completes successfully, move to Memory Challenge
              // Only move to Memory Challenge if there's no redirect flag
              if (f3StepType === "A" && isShowcase && memoryChallengeLevel) {
                console.log(
                  `Letter Launcher handleNext - All levels passed, moving to Memory Challenge`
                );
                setLocalData("f3ApplySubStep", "memoryChallenge");
                // Trigger re-render by updating mechanism
                setMechanism({
                  id: "memoryChallenge",
                  name: "memoryChallenge",
                });
              } else {
                // Practice step or no Memory Challenge - complete normally
                // Clear sub-step if set
                setLocalData("f3ApplySubStep", null);
                if (handleNext) {
                  handleNext();
                }
              }
            }}
            handleBack={handleBack}
            applyStep={applyStep}
            failRedirect={failRedirect}
            passRedirect={passRedirect}
            isF3FlowActive={isF3FlowActive}
            f3FlowStep={f3FlowStep}
            header={
              f3StepType === "A"
                ? `Apply ${applyStep} - Letter Speed`
                : `Practice ${currentF3Step.step?.step} - Letter Speed`
            }
            points={points}
            steps={letterLauncherContentCount}
            currentStep={1}
            progressData={progressData}
            showProgress={true}
            background="#FFB31F"
            enableNext={enableNext}
            setEnableNext={setEnableNext}
            loading={loading}
            setOpenMessageDialog={setOpenMessageDialog}
            vocabCount={vocabCount}
            wordCount={wordCount}
            showTimer={false}
            milestoneLevel={milestoneLevelValue}
            setProgressData={setProgressData}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
      } else {
        // Non-F3 flow - Letter Launcher not yet implemented for other flows
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Letter Launcher</h2>
            <p>Letter Launcher component not yet implemented.</p>
          </div>
        );
      }
    } else if (mechanism && mechanism.name === "letterHunt") {
      // For F2 flow, all steps (Learn, Practice, Apply) use LetterHunt
      // F2 flow takes precedence over F1 flow
      if (isF2FlowActive) {
        // Use effectiveF2FlowIndex from component level (which uses localStorage fallback)
        // instead of getF2FlowStep() which might use stale state
        const currentF2Step = {
          index: effectiveF2FlowIndex,
          step: F2_FLOW[effectiveF2FlowIndex] || null,
          isLast: effectiveF2FlowIndex === F2_FLOW.length - 1,
        };
        const f2StepType = currentF2Step.step?.type;
        console.log("LetterHunt render - F2 flow check:", {
          f2FlowIndexState,
          effectiveF2FlowIndex,
          f2FlowIndexFromStorage,
          currentF2StepIndex: currentF2Step.index,
          f2StepType,
          mechanism: mechanism?.name,
          step: currentF2Step.step,
          hasStep: !!currentF2Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF2Step.step) {
          console.warn(
            "LetterHunt render - No F2 step found at index:",
            currentF2Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage("Unable to load F2 flow step. Please retry.");
            setShowRetryDialog(true);
          }
          return null;
        }

        if (f2StepType === "L") {
          console.warn(
            "LetterHunt render blocked: F2 flow step type is 'L' (Learn) but mechanism is letterHunt. This is incorrect - Learn steps use LetterTrain.",
            {
              f2FlowIndexState,
              currentF2Step: currentF2Step.step,
              mechanism,
            }
          );
          // Don't render LetterHunt if it's actually a Learn step (should use LetterTrain)
          return null;
        } else if (f2StepType === "P" || f2StepType === "A") {
          // F2 Practice and Apply steps use LetterHunt
          // Ensure mechanism is set correctly for F2 flow
          if (mechanism?.name !== "letterHunt") {
            console.log(
              "LetterHunt render - Setting mechanism to letterHunt for F2 step type:",
              f2StepType
            );
            setMechanism({ id: "letterHunt", name: "letterHunt" });
          }
          // For F2 flow, use F2 config directly
          let currentGetContentForF2;
          const f2IndexToUse = currentF2Step.index;
          const lang = getLocalData("lang") || "en";
          const f2Config = levelGetContent[lang]?.["F2"];
          if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
            currentGetContentForF2 = f2Config[f2IndexToUse];
            console.log(
              "LetterHunt render - F2 config for index:",
              f2IndexToUse,
              "content:",
              currentGetContentForF2
            );
          } else {
            console.error(
              "LetterHunt render - F2 config not found for index:",
              f2IndexToUse,
              "f2FlowIndexState:",
              f2FlowIndexState,
              "f2Config length:",
              f2Config?.length
            );
            // Fallback to getCurrentContent if F2 config not found
            currentGetContentForF2 = getCurrentContent(
              progressData?.currentPracticeStep || 0
            );
          }

          // Add null check for currentGetContentForF2
          if (!currentGetContentForF2) {
            console.error(
              "LetterHunt render - currentGetContentForF2 is null/undefined for index:",
              f2IndexToUse
            );
            // Create a minimal config object for Apply steps
            if (f2StepType === "A") {
              const applyStepNum = currentF2Step.step?.step || 1;
              currentGetContentForF2 = {
                title: `A${applyStepNum}`,
                letterHuntLevel: 1,
                letterHuntEndLevel: 3,
                isShowcase: true,
                applyStep: applyStepNum,
                failRedirect:
                  applyStepNum === 1 ? "L1" : applyStepNum === 2 ? "L4" : "L7",
                passRedirect:
                  applyStepNum === 1 ? "L4" : applyStepNum === 2 ? "L7" : "F3",
              };
              console.log(
                "LetterHunt render - Created fallback config for F2 Apply step:",
                currentGetContentForF2
              );
            } else {
              // For Practice steps, create minimal config
              const practiceStepNum = currentF2Step.step?.step || 1;
              currentGetContentForF2 = {
                title: `P${practiceStepNum}`,
                letterHuntLevel: 1,
                isShowcase: false,
              };
              console.log(
                "LetterHunt render - Created fallback config for F2 Practice step:",
                currentGetContentForF2
              );
            }
          }

          const letterHuntLevel = currentGetContentForF2?.letterHuntLevel || 1;
          const letterHuntIsShowcase =
            currentGetContentForF2?.isShowcase || false;
          const letterHuntEndLevel = currentGetContentForF2?.letterHuntEndLevel;
          const letterHuntContentCount =
            currentGetContentForF2?.letterHuntContentCount || 10; // Content count per level
          const applyStep = currentGetContentForF2?.applyStep;
          const failRedirect = currentGetContentForF2?.failRedirect;
          const passRedirect = currentGetContentForF2?.passRedirect;
          const customLettersForF2 = currentGetContentForF2?.customLetters; // Extract customLetters from F2 config (can be words/syllables or letters)
          const milestoneLevelValue = "B";
          // For Letter Hunt, questions are generated by LetterGame, so use letterHuntContentCount for steps
          const letterHuntSteps =
            questions?.length > 0
              ? questions.length
              : letterHuntIsShowcase
              ? letterHuntContentCount * (letterHuntEndLevel || 1)
              : letterHuntContentCount;

          return (
            <LetterHuntMechanics
              page={page}
              setPage={setPage}
              isAlphabetDemoActive={isAlphabetDemoActive}
              {...{
                level: letterHuntIsShowcase
                  ? letterHuntLevel || 1
                  : letterHuntLevel,
                header:
                  questions[currentQuestion]?.contentType === "image"
                    ? `Guess the below image`
                    : `Letter Recognition`,
                points,
                steps: letterHuntSteps || 10, // Ensure steps is never 0 or undefined
                currentStep: (currentQuestion || 0) + 1,
                progressData,
                showProgress: true,
                background: "#FFB31F",
                handleNext,
                handleBack: !letterHuntIsShowcase && handleBack,
                enableNext,
                setEnableNext,
                isShowCase: letterHuntIsShowcase,
                loading,
                setOpenMessageDialog,
                vocabCount,
                wordCount,
                showTimer: false,
                milestoneLevel: milestoneLevelValue,
                endLevel: letterHuntEndLevel,
                startShowCase,
                setStartShowCase,
                setProgressData,
                setCurrentQuestion,
                applyStep,
                failRedirect,
                passRedirect,
                isF1FlowActive: false, // F2 flow is active, not F1
                f1FlowStep: null,
                isF2FlowActive, // Pass F2 flow active flag
                f2FlowStep, // Pass F2 flow step info
                customLetters: customLettersForF2, // Pass customLetters from F2 config
              }}
            />
          );
        } else {
          // F2 flow step type is neither L, P, nor A - this shouldn't happen
          console.error(
            "LetterHunt render - Unknown F2 step type:",
            f2StepType,
            "at index:",
            currentF2Step.index
          );
          return null;
        }
      }
      // For F1 flow, verify that this is actually a Practice or Apply step, not a Learn step
      // If mechanism is letterHunt but F1 flow step type is "L", something is wrong - don't render
      else if (isF1FlowActive && !isF2FlowActive) {
        // Also check if we should render LetterHunt based on F1 step type, even if mechanism isn't set yet
        const currentF1StepCheck = getF1FlowStep();
        const f1StepTypeCheck = currentF1StepCheck.step?.type;
        if (
          (f1StepTypeCheck === "P" || f1StepTypeCheck === "A") &&
          mechanism?.name !== "letterHunt"
        ) {
          console.log(
            "LetterHunt render - F1 step type is",
            f1StepTypeCheck,
            "but mechanism is",
            mechanism?.name,
            "- setting mechanism"
          );
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
        const currentF1Step = getF1FlowStep();
        const f1StepType = currentF1Step.step?.type;
        console.log("LetterHunt render - F1 flow check:", {
          f1FlowIndexState,
          currentF1StepIndex: currentF1Step.index,
          f1StepType,
          mechanism: mechanism?.name,
          step: currentF1Step.step,
          hasStep: !!currentF1Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF1Step.step) {
          console.warn(
            "LetterHunt render - No F1 step found at index:",
            currentF1Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage("Unable to load F1 flow step. Please retry.");
            setShowRetryDialog(true);
          }
          return null;
        }

        if (f1StepType === "L") {
          console.warn(
            "LetterHunt render blocked: F1 flow step type is 'L' (Learn) but mechanism is letterHunt. This is incorrect.",
            {
              f1FlowIndexState,
              currentF1Step: currentF1Step.step,
              mechanism,
            }
          );
          // Don't render LetterHunt if it's actually a Learn step
          // Return null to prevent rendering, but the mechanism should be corrected on next render
          return null;
        } else if (f1StepType === "P" || f1StepType === "A") {
          // Ensure mechanism is set correctly for F1 flow
          if (mechanism?.name !== "letterHunt") {
            console.log(
              "LetterHunt render - Setting mechanism to letterHunt for F1 step type:",
              f1StepType
            );
            setMechanism({ id: "letterHunt", name: "letterHunt" });
          }
          // Only proceed with LetterHunt rendering if step type is P or A
          // For F1 flow, use F1 config directly
          let currentGetContentForF1;
          // For F1 flow, use currentF1Step.index (from localStorage) instead of f1FlowIndexState
          // This ensures we always use the most up-to-date index
          const f1IndexToUse = currentF1Step.index;
          const lang = getLocalData("lang") || "en";
          const f1Config = levelGetContent[lang]?.["F1"];
          if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
            currentGetContentForF1 = f1Config[f1IndexToUse];
            console.log(
              "LetterHunt render - F1 config for index:",
              f1IndexToUse,
              "content:",
              currentGetContentForF1
            );
          } else {
            console.error(
              "LetterHunt render - F1 config not found for index:",
              f1IndexToUse,
              "f1FlowIndexState:",
              f1FlowIndexState,
              "f1Config length:",
              f1Config?.length
            );
            // Fallback to getCurrentContent if F1 config not found
            currentGetContentForF1 = getCurrentContent(
              progressData?.currentPracticeStep || 0
            );
          }

          // Add null check for currentGetContentForF1
          if (!currentGetContentForF1) {
            console.error(
              "LetterHunt render - currentGetContentForF1 is null/undefined for index:",
              f1IndexToUse
            );
            // Create a minimal config object for Apply steps
            if (f1StepType === "A") {
              const applyStepNum = currentF1Step.step?.step || 1;
              currentGetContentForF1 = {
                title: `A${applyStepNum}`,
                letterHuntLevel: 1,
                letterHuntEndLevel: 3,
                isShowcase: true,
                applyStep: applyStepNum,
                failRedirect:
                  applyStepNum === 1 ? "L1" : applyStepNum === 2 ? "L4" : "L7",
                passRedirect:
                  applyStepNum === 1 ? "L4" : applyStepNum === 2 ? "L7" : "F2",
              };
              console.log(
                "LetterHunt render - Created fallback config for Apply step:",
                currentGetContentForF1
              );
            } else {
              // For Practice steps, create minimal config
              const practiceStepNum = currentF1Step.step?.step || 1;
              currentGetContentForF1 = {
                title: `P${practiceStepNum}`,
                letterHuntLevel: 1,
                isShowcase: false,
              };
              console.log(
                "LetterHunt render - Created fallback config for Practice step:",
                currentGetContentForF1
              );
            }
          }

          const letterHuntLevel = currentGetContentForF1?.letterHuntLevel || 1;
          const letterHuntIsShowcase =
            currentGetContentForF1?.isShowcase || false; // Get isShowcase from config
          const letterHuntEndLevel = currentGetContentForF1?.letterHuntEndLevel; // Optional end level
          const letterHuntContentCount =
            currentGetContentForF1?.letterHuntContentCount || 10; // Content count per level
          const applyStep = currentGetContentForF1?.applyStep; // Apply step number (1, 2, or 3)
          const failRedirect = currentGetContentForF1?.failRedirect; // e.g., "L1", "L4", "L7"
          const passRedirect = currentGetContentForF1?.passRedirect; // e.g., "L4", "L7", "F2"
          const customLettersForF1 = currentGetContentForF1?.customLetters; // Extract customLetters from F1 config (can be words/syllables or letters)
          // For F1/F2/F3 flows, always use "B" as milestoneLevel
          const milestoneLevelValue = "B";
          // For showcase mode (Apply steps), we still need to pass startLevel and endLevel
          // For non-showcase mode, pass level to use default behavior
          // Use isShowcase from config (constants.js) - this is the source of truth
          // For Letter Hunt, questions are generated by LetterGame, so use letterHuntContentCount for steps
          // For showcase mode (Apply steps), calculate total steps: contentCount * endLevel
          // For non-showcase mode, use contentCount
          const letterHuntSteps =
            questions?.length > 0
              ? questions.length
              : letterHuntIsShowcase && letterHuntEndLevel
              ? letterHuntContentCount * letterHuntEndLevel
              : letterHuntContentCount || 10; // Ensure minimum of 10 if undefined

          console.log("LetterHunt render - F1 A2 config:", {
            f1IndexToUse,
            letterHuntLevel,
            letterHuntEndLevel,
            letterHuntContentCount,
            letterHuntIsShowcase,
            letterHuntSteps,
            currentGetContentForF1,
          });

          return (
            <LetterHuntMechanics
              page={page}
              setPage={setPage}
              isAlphabetDemoActive={isAlphabetDemoActive}
              {...{
                level: letterHuntIsShowcase
                  ? letterHuntLevel || 1
                  : letterHuntLevel, // For showcase, pass startLevel (1) for Apply steps; for non-showcase, pass the level
                header:
                  questions[currentQuestion]?.contentType === "image"
                    ? `Guess the below image`
                    : `Letter Recognition`,
                points,
                steps: letterHuntSteps,
                currentStep: (currentQuestion || 0) + 1,
                progressData,
                showProgress: true,
                background: "#FFB31F",
                handleNext,
                handleBack: !letterHuntIsShowcase && handleBack,
                enableNext,
                setEnableNext,
                isShowCase: letterHuntIsShowcase, // Use isShowcase from config (constants.js)
                loading,
                setOpenMessageDialog,
                vocabCount,
                wordCount,
                showTimer: false,
                milestoneLevel: milestoneLevelValue,
                endLevel: letterHuntEndLevel, // Pass end level if specified in config
                startShowCase,
                setStartShowCase,
                setProgressData, // Pass setProgressData to update state when resetting to P1
                setCurrentQuestion, // Pass setCurrentQuestion to reset currentQuestion state when resetting to P1
                setPoints, // Pass setPoints to update UI when points are added
                applyStep, // Pass Apply step number
                failRedirect, // Pass fail redirect (e.g., "L1", "L4", "L7")
                passRedirect, // Pass pass redirect (e.g., "L4", "L7", "F2")
                isF1FlowActive, // Pass F1 flow active flag
                f1FlowStep, // Pass F1 flow step info
                isF2FlowActive, // Pass F2 flow active flag
                f2FlowStep, // Pass F2 flow step info
                customLetters: customLettersForF1, // Pass customLetters from F1 config
              }}
            />
          );
        } else {
          // F1 flow step type is neither L, P, nor A - this shouldn't happen
          console.error(
            "LetterHunt render - Unknown F1 step type:",
            f1StepType,
            "at index:",
            currentF1Step.index
          );
          return null;
        }
      } else {
        // For non-F1 flow, use getCurrentContent
        let currentGetContentForF1 = getCurrentContent(
          progressData?.currentPracticeStep || 0
        );

        const letterHuntLevel = currentGetContentForF1?.letterHuntLevel || 1;
        const letterHuntIsShowcase =
          currentGetContentForF1?.isShowcase || false;
        const letterHuntEndLevel = currentGetContentForF1?.letterHuntEndLevel;
        const applyStep = currentGetContentForF1?.applyStep;
        const failRedirect = currentGetContentForF1?.failRedirect;
        const passRedirect = currentGetContentForF1?.passRedirect;
        const customLettersForNonF1 = currentGetContentForF1?.customLetters; // Extract customLetters from config
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;

        return (
          <LetterHuntMechanics
            page={page}
            setPage={setPage}
            isAlphabetDemoActive={isAlphabetDemoActive}
            {...{
              level: letterHuntIsShowcase
                ? letterHuntLevel || 1
                : letterHuntLevel,
              header:
                questions[currentQuestion]?.contentType === "image"
                  ? `Guess the below image`
                  : `Letter Recognition`,
              points,
              steps: questions?.length,
              currentStep: currentQuestion + 1,
              progressData,
              showProgress: true,
              background:
                isShowCase &&
                "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
              handleNext,
              handleBack: !letterHuntIsShowcase && handleBack,
              enableNext,
              setEnableNext,
              isShowCase: letterHuntIsShowcase,
              loading,
              setOpenMessageDialog,
              vocabCount,
              wordCount,
              showTimer: false,
              milestoneLevel: milestoneLevelValue,
              endLevel: letterHuntEndLevel,
              startShowCase,
              setStartShowCase,
              setProgressData,
              setCurrentQuestion,
              setPoints, // Pass setPoints to update UI when points are added
              applyStep,
              failRedirect,
              passRedirect,
              isF1FlowActive,
              f1FlowStep,
              isF2FlowActive,
              f2FlowStep,
              customLetters: customLettersForNonF1, // Pass customLetters from config
            }}
          />
        );
      }
    } else if (mechanism && mechanism.name === "memoryChallenge") {
      // Memory Challenge for F3 Apply steps
      if (isF3FlowActive && f3FlowStep?.step && milestoneLevel === "B") {
        const currentF3Step = getF3FlowStep();
        const lang = getLocalData("lang") || "en";
        const f3Config = levelGetContent[lang]?.["F3"];
        const f3IndexToUse = currentF3Step.index;
        const currentGetContentForF3 = f3Config?.[f3IndexToUse];

        if (!currentGetContentForF3) {
          return null;
        }

        const memoryChallengeLevel =
          currentGetContentForF3?.memoryChallengeLevel || 1;
        const memoryChallengeEndLevel =
          currentGetContentForF3?.memoryChallengeEndLevel || 3;
        const memoryChallengeContentCount =
          currentGetContentForF3?.memoryChallengeContentCount || 5;
        const readAloudContentCount =
          currentGetContentForF3?.readAloudContentCount;
        const applyStep = currentGetContentForF3?.applyStep;
        const failRedirect = currentGetContentForF3?.failRedirect;
        const passRedirect = currentGetContentForF3?.passRedirect;
        const isShowcase = currentGetContentForF3?.isShowcase || false;
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;
        const sessionId = getLocalData("sessionId");

        return (
          <MemoryChallengeMechanics
            page={page}
            setPage={setPage}
            level={memoryChallengeLevel}
            endLevel={memoryChallengeEndLevel}
            contentCount={memoryChallengeContentCount}
            sessionId={sessionId}
            handleNext={() => {
              // Check for redirect request first
              const f3FlowRedirect = getLocalData("f3FlowRedirect");
              if (f3FlowRedirect) {
                // Redirect is handled by Practice.jsx's handleNext
                if (handleNext) {
                  handleNext();
                }
                return;
              }

              // After Memory Challenge, check if we need Read Aloud
              if (readAloudContentCount && applyStep === 2) {
                // A2: Show Read Aloud after Memory Challenge
                setLocalData("f3ApplySubStep", "readAloud");
                setMechanism({ id: "readAloud", name: "readAloud" });
              } else {
                // A1: Complete after Memory Challenge
                setLocalData("f3ApplySubStep", null);
                if (handleNext) {
                  handleNext();
                }
              }
            }}
            handleBack={handleBack}
            applyStep={applyStep}
            failRedirect={failRedirect}
            passRedirect={passRedirect}
            isF3FlowActive={isF3FlowActive}
            f3FlowStep={f3FlowStep}
            isShowCase={isShowcase}
            header="Memory Challenge"
            points={points}
            steps={memoryChallengeContentCount}
            currentStep={1}
            progressData={progressData}
            showProgress={true}
            background="#FFB31F"
            enableNext={enableNext}
            setEnableNext={setEnableNext}
            loading={loading}
            setOpenMessageDialog={setOpenMessageDialog}
            vocabCount={vocabCount}
            wordCount={wordCount}
            showTimer={false}
            milestoneLevel={milestoneLevelValue}
            setProgressData={setProgressData}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
      }
    } else if (mechanism && mechanism.name === "AnouncementFlow") {
      return (
        <AnouncementFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "PhrasesInAction") {
      return (
        <PhrasesInAction
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: questions[currentQuestion]?.contentSourceData?.[0],
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            multilingual: questions[currentQuestion]?.multilingual,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "McqFlow") {
      return (
        <McqFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      (mechanism && mechanism.name === "audio") ||
      (mechanism && mechanism.name === "fillInTheBlank" && mechanism.id === "")
    ) {
      return (
        <Mechanics6
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (page === 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }

    // Fallback: If no conditions match, show loading or default to WordsOrImage
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    // Default fallback - render WordsOrImage if questions are available
    if (questions && questions.length > 0 && questions[currentQuestion]) {
      return (
        <WordsOrImage
          {...{
            level: level,
            audioLink: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${questions[currentQuestion]?.contentId}.wav`,
            mechanism_id: mechanism?.id,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    }

    // Final fallback - return null if nothing can be rendered
    return null;
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
            setDisableScreen(false);
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {showRetryDialog && (
        <RetryDialog
          message={retryDialogMessage}
          onRetry={() => {
            setShowRetryDialog(false);
            setRetryDialogMessage("");
            // Redirect to discover-start route
            navigate("/discover-start", { replace: true });
          }}
          onClose={() => {
            setShowRetryDialog(false);
            setRetryDialogMessage("");
          }}
        />
      )}
      {renderMechanics()}
    </>
  );
};

export default Practice;
