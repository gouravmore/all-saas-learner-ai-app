import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.svg";
// import Mic from "../assets/mikee.svg";
// import Stop from "../assets/pausse.svg";
import correctSound from "../assets/correct.wav";
import wrongSound from "../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
  sendTestRigScore,
} from "../utils/constants";
import { getFontFamily } from "../utils/fontUtils";
import { useNavigate } from "react-router-dom";
import { response } from "../services/telementryService";
import { Typography, Stack, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import trainImg from "../assets/trainImg.svg";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnalyser from "../utils/VoiceAnalyser";
import * as s3Assets from "../utils/rFlowS3Links";
import { getAssetUrl } from "../utils/rFlowS3Links";
import { getAssetAudioUrl } from "../utils/rFlowS3Links";
import { updateLearnerProfile } from "../services/learnerAi/learnerAiService";
import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../services/orchestration/orchestrationService";
import { fetchGetSetResult } from "../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../services/content/contentService";
import hintimg from "../assets/hintsicon.svg";

const theme = createTheme();

const dataEn = [
  {
    id: 1,
    title: "Phoneme",
    letter: "b",
    word: "ball",
    image: getAssetUrl(s3Assets.ballGif),
    audio: getAssetAudioUrl(s3Assets.ballPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.ballfullAudio),
  },
  {
    id: 2,
    title: "Phoneme",
    letter: "d",
    word: "drum",
    image: getAssetUrl(s3Assets.drums),
    audio: getAssetAudioUrl(s3Assets.drumPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.drumfullAudio),
  },
  {
    id: 3,
    title: "Phoneme",
    letter: "f",
    word: "fish",
    image: getAssetUrl(s3Assets.fishSixImg),
    audio: getAssetAudioUrl(s3Assets.fishPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.fishfullAudio),
  },
  {
    id: 4,
    title: "Phoneme",
    letter: "g",
    word: "grapes",
    image: getAssetUrl(s3Assets.grapes),
    audio: getAssetAudioUrl(s3Assets.grapesPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.grapesfullAudio),
  },
  {
    id: 5,
    title: "Phoneme",
    letter: "h",
    word: "hand",
    image: getAssetUrl(s3Assets.handEightImg),
    audio: getAssetAudioUrl(s3Assets.handPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.handfullAudio),
  },
  {
    id: 6,
    title: "Phoneme",
    letter: "j",
    word: "jam",
    image: getAssetUrl(s3Assets.jam),
    audio: getAssetAudioUrl(s3Assets.jamPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.jamfullAudio),
  },
  {
    id: 7,
    title: "Phoneme",
    letter: "k",
    word: "car",
    image: getAssetUrl(s3Assets.carEighteenImg),
    audio: getAssetAudioUrl(s3Assets.carPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.carfullAudio),
  },
  {
    id: 8,
    title: "Phoneme",
    letter: "l",
    word: "lollipop",
    image: getAssetUrl(s3Assets.lolipop),
    audio: getAssetAudioUrl(s3Assets.lollipopPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.lollipopfullAudio),
  },
  {
    id: 9,
    title: "Phoneme",
    letter: "m",
    word: "monkey",
    image: getAssetUrl(s3Assets.monkey),
    audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.monkeyfullAudio),
  },
  {
    id: 10,
    title: "Phoneme",
    letter: "n",
    word: "nest",
    image: getAssetUrl(s3Assets.nest),
    audio: getAssetAudioUrl(s3Assets.nestPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.nestfullAudio),
  },
  {
    id: 11,
    title: "Phoneme",
    letter: "p",
    word: "pumpkin",
    image: getAssetUrl(s3Assets.pumpkin),
    audio: getAssetAudioUrl(s3Assets.pumpkinPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.pumpkinfullAudio),
  },
  {
    id: 12,
    title: "Phoneme",
    letter: "r",
    word: "rainbow",
    image: getAssetUrl(s3Assets.rainbow),
    audio: getAssetAudioUrl(s3Assets.rainbowPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.rainbowfullAudio),
  },
  {
    id: 13,
    title: "Phoneme",
    letter: "s",
    word: "sun",
    image: getAssetUrl(s3Assets.sun),
    audio: getAssetAudioUrl(s3Assets.sunPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.sunfullAudio),
  },
  {
    id: 14,
    title: "Phoneme",
    letter: "zh",
    word: "treasure",
    image: getAssetUrl(s3Assets.treasure),
    audio: getAssetAudioUrl(s3Assets.treasurePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.treasurefullAudio),
  },
  {
    id: 15,
    title: "Phoneme",
    letter: "t",
    word: "tree",
    image: getAssetUrl(s3Assets.tree),
    audio: getAssetAudioUrl(s3Assets.treePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.treefullAudio),
  },
  {
    id: 16,
    title: "Phoneme",
    letter: "v",
    word: "van",
    image: getAssetUrl(s3Assets.van),
    audio: getAssetAudioUrl(s3Assets.vanPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.vanfullAudio),
  },
  {
    id: 17,
    title: "Phoneme",
    letter: "w",
    word: "window",
    image: getAssetUrl(s3Assets.window),
    audio: getAssetAudioUrl(s3Assets.windowPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.windowfullAudio),
  },
  {
    id: 18,
    title: "Phoneme",
    letter: "y",
    word: "yak",
    image: getAssetUrl(s3Assets.yak),
    audio: getAssetAudioUrl(s3Assets.yakPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.yakfullAudio),
  },
  {
    id: 19,
    title: "Phoneme",
    letter: "z",
    word: "zip",
    image: getAssetUrl(s3Assets.zip),
    audio: getAssetAudioUrl(s3Assets.zipPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.zipfullAudio),
  },
  {
    id: 20,
    title: "Phoneme",
    letter: "x",
    word: "fox",
    image: getAssetUrl(s3Assets.fox),
    audio: getAssetAudioUrl(s3Assets.foxPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.foxfullAudio),
  },
  {
    id: 21,
    title: "Phoneme",
    letter: "qu",
    word: "queen",
    image: getAssetUrl(s3Assets.queenSixteenImg),
    audio: getAssetAudioUrl(s3Assets.queenAud),
    phonemeAudio: getAssetAudioUrl(s3Assets.queenfullAudio),
  },
  {
    id: 22,
    title: "Phoneme",
    letter: "ch",
    word: "chain",
    image: getAssetUrl(s3Assets.chain),
    audio: getAssetAudioUrl(s3Assets.chainPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.chainfullAudio),
  },
  {
    id: 23,
    title: "Phoneme",
    letter: "sh",
    word: "sheep",
    image: getAssetUrl(s3Assets.sheep),
    audio: getAssetAudioUrl(s3Assets.sheepPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.sheepfullAudio),
  },
  {
    id: 24,
    title: "Phoneme",
    letter: "th",
    word: "mother",
    image: getAssetUrl(s3Assets.motherGif),
    audio: getAssetAudioUrl(s3Assets.motherPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.motherfullAudio),
  },
  {
    id: 25,
    title: "Phoneme",
    letter: "ng",
    word: "sing",
    image: getAssetUrl(s3Assets.sing),
    audio: getAssetAudioUrl(s3Assets.singPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.singfullAudio),
  },
  {
    id: 26,
    title: "Phoneme",
    letter: "a",
    word: "apple",
    image: getAssetUrl(s3Assets.apple),
    audio: getAssetAudioUrl(s3Assets.appleAud),
    phonemeAudio: getAssetAudioUrl(s3Assets.applefullAudio),
  },
  {
    id: 27,
    title: "Phoneme",
    letter: "e",
    word: "egg",
    image: getAssetUrl(s3Assets.egg),
    audio: getAssetAudioUrl(s3Assets.eggPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.eggfullAudio),
  },
  {
    id: 28,
    title: "Phoneme",
    letter: "i",
    word: "igloo",
    image: getAssetUrl(s3Assets.igloo),
    audio: getAssetAudioUrl(s3Assets.iglooPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.igloofullAudio),
  },
  {
    id: 29,
    title: "Phoneme",
    letter: "o",
    word: "orange",
    image: getAssetUrl(s3Assets.orange),
    audio: getAssetAudioUrl(s3Assets.orangePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.orangefullAudio),
  },
  {
    id: 30,
    title: "Phoneme",
    letter: "u",
    word: "umbrella",
    image: getAssetUrl(s3Assets.umbrella),
    audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.umbrellafullAudio),
  },
  {
    id: 31,
    title: "Phoneme",
    letter: "ai",
    word: "rain",
    image: getAssetUrl(s3Assets.rain),
    audio: getAssetAudioUrl(s3Assets.rainPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.rainfullAudio),
  },
  {
    id: 32,
    title: "Phoneme",
    letter: "ee",
    word: "bee",
    image: getAssetUrl(s3Assets.bee),
    audio: getAssetAudioUrl(s3Assets.beePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.beefullAudio),
  },
  {
    id: 33,
    title: "Phoneme",
    letter: "ie",
    word: "pie",
    image: getAssetUrl(s3Assets.pie),
    audio: getAssetAudioUrl(s3Assets.piePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.piefullAudio),
  },
  {
    id: 34,
    title: "Phoneme",
    letter: "oa",
    word: "boat",
    image: getAssetUrl(s3Assets.boat),
    audio: getAssetAudioUrl(s3Assets.boatPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.boatfullAudio),
  },
  {
    id: 35,
    title: "Phoneme",
    letter: "oo",
    word: "moon",
    image: getAssetUrl(s3Assets.moon),
    audio: getAssetAudioUrl(s3Assets.moonPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.moonfullAudio),
  },
  {
    id: 36,
    title: "Phoneme",
    letter: "oo",
    word: "book",
    image: getAssetUrl(s3Assets.book),
    audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
    phonemeAudio: getAssetAudioUrl(s3Assets.bookfullAudio),
  },
  {
    id: 37,
    title: "Phoneme",
    letter: "ou",
    word: "cloud",
    image: getAssetUrl(s3Assets.cloud),
    audio: getAssetAudioUrl(s3Assets.cloudPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.cloudfullAudio),
  },
  {
    id: 38,
    title: "Phoneme",
    letter: "oi",
    word: "coin",
    image: getAssetUrl(s3Assets.coin),
    audio: getAssetAudioUrl(s3Assets.coinPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.coinfullAudio),
  },
  {
    id: 39,
    title: "Phoneme",
    letter: "aw",
    word: "saw",
    image: getAssetUrl(s3Assets.saw),
    audio: getAssetAudioUrl(s3Assets.sawPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.sawfullAudio),
  },
  {
    id: 40,
    title: "Phoneme",
    letter: "ar",
    word: "star",
    image: getAssetUrl(s3Assets.star),
    audio: getAssetAudioUrl(s3Assets.starPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.starfullAudio),
  },
  {
    id: 41,
    title: "Phoneme",
    letter: "er",
    word: "sister",
    image: getAssetUrl(s3Assets.sister),
    audio: getAssetAudioUrl(s3Assets.sisterPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.sisterfullAudio),
  },
  {
    id: 42,
    title: "Phoneme",
    letter: "or",
    word: "corn",
    image: getAssetUrl(s3Assets.corn),
    audio: getAssetAudioUrl(s3Assets.cornPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.cornfullAudio),
  },
  {
    id: 43,
    title: "Phoneme",
    letter: "air",
    word: "chair",
    image: getAssetUrl(s3Assets.chair),
    audio: getAssetAudioUrl(s3Assets.chairPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.chairfullAudio),
  },
  {
    id: 45,
    title: "Phoneme",
    letter: "ear",
    word: "hear",
    image: getAssetUrl(s3Assets.hear),
    audio: getAssetAudioUrl(s3Assets.hearPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.hearfullAudio),
  },
];
const dataKn = [
  {
    id: 1,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R1_1),
      getAssetUrl(s3Assets.R1_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA1b),
      getAssetAudioUrl(s3Assets.RA1c),
    ],
  },
  {
    id: 2,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R2_1),
      getAssetUrl(s3Assets.R2_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA2b),
      getAssetAudioUrl(s3Assets.RA2c),
    ],
  },
  {
    id: 3,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R3_1),
      getAssetUrl(s3Assets.R3_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA3b),
      getAssetAudioUrl(s3Assets.RA3c),
    ],
  },
  {
    id: 4,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R4_1),
      getAssetUrl(s3Assets.R4_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA4b),
      getAssetAudioUrl(s3Assets.RA4c),
    ],
  },
  {
    id: 5,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R5_1),
      getAssetUrl(s3Assets.R5_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA5b),
      getAssetAudioUrl(s3Assets.RA5c),
    ],
  },
  {
    id: 6,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R6_1),
      getAssetUrl(s3Assets.R6_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA6b),
      getAssetAudioUrl(s3Assets.RA6c),
    ],
  },
  {
    id: 7,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R7_1),
      getAssetUrl(s3Assets.R7_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA7b),
      getAssetAudioUrl(s3Assets.RA7c),
    ],
  },
  {
    id: 8,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R8_1),
      getAssetUrl(s3Assets.R8_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA8b),
      getAssetAudioUrl(s3Assets.RA8c),
    ],
  },
  {
    id: 9,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R9_1),
      getAssetUrl(s3Assets.R9_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA9b),
      getAssetAudioUrl(s3Assets.RA9c),
    ],
  },
  {
    id: 10,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R10_1),
      getAssetUrl(s3Assets.R10_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA10b),
      getAssetAudioUrl(s3Assets.RA10c),
    ],
  },
  {
    id: 11,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R11_1),
      getAssetUrl(s3Assets.R11_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA11b),
      getAssetAudioUrl(s3Assets.RA11c),
    ],
  },
  {
    id: 12,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R12_1),
      getAssetUrl(s3Assets.R12_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA12b),
      getAssetAudioUrl(s3Assets.RA12c),
    ],
  },
  {
    id: 13,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R13_1),
      getAssetUrl(s3Assets.R13_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA13b),
      getAssetAudioUrl(s3Assets.RA13c),
    ],
  },
  {
    id: 14,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R14_1),
      getAssetUrl(s3Assets.R14_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA14b),
      getAssetAudioUrl(s3Assets.RA14c),
    ],
  },
  {
    id: 15,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R15_1),
      getAssetUrl(s3Assets.R15_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA15b),
      getAssetAudioUrl(s3Assets.RA15c),
    ],
  },
];

const R1 = ({
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
}) => {
  steps = 1;
  const lang = getLocalData("lang");
  let data;

  if (lang === "en") {
    data = dataEn;
  } else {
    data = dataKn;
  }

  // ✅ UI3 specific states for non-English languages
  const [itemIndexUi, setItemIndexUi] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const currentItem = dataKn[itemIndexUi];
  const sessionId = getLocalData("sessionId");
  const virtualId = getLocalData("virtualId");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // ✅ Add these variables for handleNextWord
  const totalSteps = Math.ceil(data.length / 5); // Assuming 5 items per block
  const blockSize = 10; // UI1 + UI2 for each item = 2 * 5 = 10

  const langWiseAnswers = {
    en: {
      c: true,
      j: true,
      x: true,
      k: true,
      h: true,
      n: true,
      p: true,
      u: true,
      s: true,
      o: true,
    },
    ta: {
      அ: true,
      ஆ: true,
      இ: true,
      ஈ: true,
      உ: true,
      ஊ: true,
      எ: true,
      ஏ: true,
      ஐ: true,
      ஒ: true,
    },
    te: {
      అ: true,
      ఆ: true,
      ఇ: true,
      ఈ: true,
      ఉ: true,
      ఊ: true,
      ఎ: true,
      ఏ: true,
      ఐ: true,
      ఒ: true,
    },
    kn: {
      ಅ: true,
      ಆ: true,
      ಇ: true,
      ಈ: true,
      ಉ: true,
      ಊ: true,
      ಎ: true,
      ಏ: true,
      ಐ: true,
      ಒ: true,
    },
    hi: {
      अ: true,
      आ: true,
      इ: true,
      ई: true,
      उ: true,
      ऊ: true,
      ए: true,
      ऐ: true,
      ओ: true,
      औ: true,
    },
  };

  const generatePlaylist = (data) => {
    const playlist = [];

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      block.forEach((item) => {
        playlist.push({
          type: "UI1",
          item: item,
          letter: item.letter,
        });
      });

      block.forEach((item) => {
        playlist.push({
          type: "UI2",
          item: item,
          letter: item.letter,
        });
      });
    }

    console.log("R1 Playlist generated:", playlist.length, "items");
    return playlist;
  };

  const playlist = generatePlaylist(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState(null);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [enableNext, setEnableNext] = useState(false);

  const current = playlist[currentIndex];
  const item = current?.item;
  const navigate = useNavigate();

  const audioRef = useRef(null);

  const currentAudio =
    current?.type === "UI2" ? null : current?.item?.audio || null;
  const singleAudio = current?.item?.phonemeAudio || null;

  const ui3Audio = lang !== "en" ? currentItem?.audios?.[imgIndex] : null;

  useEffect(() => {
    console.log("R1 - Current:", {
      currentIndex,
      current,
      item,
      currentAudio,
      singleAudio,
    });
  }, [currentIndex]);

  const playAudio = (src) => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(src);
    audioRef.current.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  };

  useEffect(() => {
    if (currentAudio) {
      playAudio(currentAudio);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentIndex]);
  // ✅ Your original handleNextWord function
  const handleNextWord = async () => {
    console.log(
      "handleNextWord called - currentIndex:",
      currentIndex,
      "playlist length:",
      playlist.length
    );

    if (lang !== "en") {
      // For non-English languages, use handleNextImage
      await handleNextImage();
    } else {
      // For English, navigate through playlist using currentIndex
      if (currentIndex < playlist.length - 1) {
        const currentLetter = current?.item?.letter || "";
        if (currentLetter && current.type === "UI1") {
          setLetters((prev) => [...prev, currentLetter]);
        }

        setCurrentIndex((i) => i + 1);
        // Also update stepIndex to keep your original logic
        setStepIndex((i) => i + 1);
      } else {
        // End of playlist - handle completion
        setLocalData("rFlow", false);
        setLocalData("mFail", false);
        if (level === "B") {
          await handleCompletion();
          navigate("/discover-end");
          return;
        }
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
      }
    }

    // Common reset for all UIs
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  // ✅ Update handleNextImage to use the same logic
  const handleNextImage = async () => {
    console.log(
      "handleNextImage called - imgIndex:",
      imgIndex,
      "itemIndexUi:",
      itemIndexUi
    );

    if (imgIndex < currentItem.images.length - 1) {
      setImgIndex((i) => i + 1);
    } else {
      if (itemIndexUi < dataKn.length - 1) {
        setItemIndexUi((i) => i + 1);
        setImgIndex(0);
      } else {
        if (level === "B") {
          await handleCompletion();
          navigate("/discover-end");
          return;
        }
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          navigate("/");
        } else {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          navigate("/discover-start");
        }
      }
    }
    // ✅ Same state updates as handleNextWord
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };
  useEffect(() => {
    if (level !== "B") return;

    (async () => {
      try {
        const lang = getLocalData("lang");
        // Fetch assessment data
        const resAssessment = await fetchAssessmentData(lang);
        const sentences = resAssessment?.data?.find(
          (elem) => elem.category === "Char"
        );

        if (!sentences?.collectionId) {
          console.error("No collection ID found for sentences.");
          return;
        }

        const resPagination = await fetchPaginatedContent(
          sentences.collectionId,
          10
        );

        setTotalSyllableCount(resPagination?.totalSyllableCount);
        setCurrentCollectionId(sentences?.collectionId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const handleCompletion = async () => {
    const sub_session_id = getLocalData("sub_session_id");
    let currentContentType = "Char";

    try {
      const milestoneLevel = "B";

      let requestBody = {
        original_text: "Char",
        audio: "",
        //user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId: contentId,
        contentType: "Char",
        mechanics_id: getLocalData("mechanism_id") || "",
        milestone: milestoneLevel,
        ansSelectionStatus: langWiseAnswers[lang],
      };

      const result = await updateLearnerProfile(lang, requestBody);
      console.log("Learner progress result:", result);
    } catch (error) {
      console.error("Error creating learner progress:", error);
    }

    try {
      const getSetResultRes = await fetchGetSetResult(
        sub_session_id,
        currentContentType,
        currentCollectionId,
        totalSyllableCount
      );
      console.log("GetSet result:", getSetResultRes);
    } catch (error) {
      console.error("Error fetching set result:", error);
    }

    if (!(localStorage.getItem("contentSessionId") !== null)) {
      let point = 1;
      let milestone = "B";

      if (point !== 1) {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }

      try {
        const result = await addPointer(point, milestone);
        const awardedPoints = result?.result?.points;
        if (awardedPoints !== 1) {
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          return;
        }
      } catch (error) {
        console.error("Error adding points:", error);
      }
    } else {
      sendTestRigScore(5);
    }
    navigate("/discover-start");
  };

  const handlePreviousImage = () => {
    if (imgIndex > 0) {
      setImgIndex((i) => i - 1);
    } else if (itemIndexUi > 0) {
      setItemIndexUi((i) => i - 1);
      setImgIndex(dataKn[itemIndexUi - 1]?.images?.length - 1 || 0);
    }
    setRecAudio(null);
    setIsNextButtonCalled(false);
    setEnableNext(false);
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      const currentLetter = current?.item?.letter || "";
      if (currentLetter && current.type === "UI1") {
        setLetters((prev) => prev.filter((letter) => letter !== currentLetter));
      }

      setCurrentIndex((i) => i - 1);
      setRecAudio(null);
      setIsNextButtonCalled(false);
      setEnableNext(false);
    }
  };

  const handleBackNavigation = () => {
    if (lang !== "en") {
      // UI3 back navigation
      if (imgIndex > 0 || itemIndexUi > 0) {
        handlePreviousImage();
      } else {
        if (handleBack) {
          handleBack();
        } else {
          navigate(-1);
        }
      }
    } else {
      if (currentIndex > 0) {
        handlePreviousWord();
      } else {
        if (handleBack) {
          handleBack();
        } else {
          navigate(-1);
        }
      }
    }
  };

  const handleRetry = () => {
    console.log("audio playing!");
    if (lang !== "en") {
      playAudio(ui3Audio);
    } else {
      playAudio(currentAudio);
    }
  };

  const updateStoredData = (audio, isCorrect) => {};

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio(null);
    }
  };

  const handleStartRecording = () => {
    setRecAudio(null);
  };

  const handleStopRecording = () => {
    setRecAudio(true);
    setLetters([]);
  };

  const navy = "#1c2752";
  const red = "#C93128";
  const pink = "#ea4c89";
  const orange = "#f28b1d";
  const COLORS = ["#8BC34A", "#9C27B0", "#E91E63", "#03A9F4", "#FF9800"];

  const flowNames = [...new Set(data.map((item) => item.id))];

  const UI1 = () => {
    console.log("R1 - UI1 - currentIndex:", currentIndex, "item:", item);

    const TOTAL_ITEMS = playlist.length;
    const currentItemNumber = currentIndex + 1;
    const completionPercentage = Math.round(
      (currentItemNumber / TOTAL_ITEMS) * 100
    );

    return (
      <Box>
        <Box
          sx={{
            position: "relative",
            mx: "auto",
            width: "min(100%, 900px)",
            borderRadius: 2,
            backgroundImage:
              "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 44px, #e6e9ef 46px)",
            backgroundColor: "#fff",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            pt: { xs: 2, md: 3 },
            pb: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "120px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "2px solid #1CB0F6",
                borderRadius: "50%",
                padding: "6px 12px",
                fontFamily: "Quicksand",
                fontWeight: 700,
                fontSize: "14px",
                color: "#000",
                position: "relative",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "-8px",
              }}
            >
              {currentItemNumber}/{TOTAL_ITEMS}
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "18px",
                backgroundColor: "#E3F2FD",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                zIndex: 1,
                border: "2px solid #BBDEFB",
              }}
            >
              <Box
                sx={{
                  width: `${completionPercentage}%`,
                  height: "100%",
                  backgroundColor: "#1CB0F6",
                  borderRadius: "20px",
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "2px solid #FF9800",
              zIndex: 10,
              backdropFilter: "blur(5px)",
              minWidth: "120px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Quicksand",
                fontWeight: 700,
                fontSize: "16px",
                color: "#FF9800",
                whiteSpace: "nowrap",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {item?.title}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              mb: 1,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <img
                src={trainImg}
                alt="train"
                style={{ width: "100%", maxWidth: "400px" }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: "28%",
                  left: "63%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "auto",
                }}
              >
                <AnimatePresence>
                  {letters?.map((ch, i) => (
                    <motion.div
                      key={ch + i}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                      <Box
                        sx={{
                          minWidth: 64,
                          minHeight: 64,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: COLORS[i % COLORS.length],
                          boxShadow: 1,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: getFontFamily(lang),
                            color: "#FFFFFF",
                            fontSize: lang === "te" ? "29px" : "25px",
                          }}
                        >
                          {ch}
                        </span>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              ml: "30%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: red,
                fontWeight: 500,
                fontSize:
                  lang === "te" ? { xs: 135, md: 180 } : { xs: 120, md: 160 },
                lineHeight: 1,
                ml: { xs: 1, md: 2 },
                fontFamily: "Quicksand",
              }}
            >
              {item?.letter}
            </Typography>

            <Box
              sx={{
                mt: { xs: 1, md: 1 },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                component="img"
                src={item?.image}
                alt={item?.word}
                sx={{
                  width: { xs: 160, md: 180 },
                  height: { xs: 160, md: 180 },
                  objectFit: "contain",
                  mr: { xs: 1, md: 2 },
                }}
              />
              <Typography
                sx={{
                  fontWeight: lang === "te" ? 400 : 800,
                  fontSize: { xs: 22, md: 32 },
                  mr: 2,
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: getFontFamily(lang),
                  gap: 0.3,
                  mt: 1,
                }}
              >
                {item?.word?.split("").map((ch, idx) => (
                  <Box
                    key={idx}
                    component="span"
                    sx={{
                      color:
                        ch.toLowerCase() === item?.letter?.toLowerCase()
                          ? red
                          : navy,
                    }}
                  >
                    {ch}
                  </Box>
                ))}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={handleBackNavigation}
              sx={{
                width: 55,
                height: 55,
                bgcolor: "#1CB0F6",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 6px 14px rgba(28,176,246,0.35)",
                "&:hover": { bgcolor: "#1AA3E3" },
              }}
            >
              <ArrowLeft size={26} />
            </IconButton>

            <IconButton
              onClick={handleRetry}
              sx={{
                width: 55,
                height: 55,
                bgcolor: pink,
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 6px 14px rgba(234,76,137,0.35)",
                "&:hover": { bgcolor: "#E63E7A" },
                transform: "translateY(-0px)",
              }}
            >
              <RotateCcw size={26} />
            </IconButton>

            {/* ➡️ Next Button */}
            <IconButton
              onClick={handleNextWord}
              sx={{
                width: 55,
                height: 55,
                bgcolor: orange,
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 6px 14px rgba(242,139,29,0.35)",
                "&:hover": { bgcolor: "#E27D10" },
              }}
            >
              <ArrowRight size={26} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  const UI2 = () => {
    console.log("R1 - UI2 - currentIndex:", currentIndex, "item:", item);

    const TOTAL_ITEMS = playlist.length;
    const currentItemNumber = currentIndex + 1;
    const completionPercentage = Math.round(
      (currentItemNumber / TOTAL_ITEMS) * 100
    );

    const renderHighlightedWord = (word, targetLetter) => {
      if (!word || !targetLetter) return word;

      const lowerWord = word.toLowerCase();
      const lowerTarget = targetLetter.toLowerCase();

      const letterIndex = lowerWord.indexOf(lowerTarget);

      if (letterIndex === -1) {
        return word;
      }

      const before = word.substring(0, letterIndex);
      const letter = word.substring(
        letterIndex,
        letterIndex + targetLetter.length
      );
      const after = word.substring(letterIndex + targetLetter.length);

      return (
        <>
          {before}
          <span style={{ color: "#FF0000", fontWeight: "bold" }}>{letter}</span>
          {after}
        </>
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: "70vh",
        }}
      >
        <Box
          sx={{
            position: "relative",
            mx: "auto",
            width: "min(100%, 1024px)",
            borderRadius: 2,
            backgroundColor: "#fff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "120px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "2px solid #1CB0F6",
                borderRadius: "50%",
                padding: "6px 12px",
                fontFamily: "Quicksand",
                fontWeight: 700,
                fontSize: "14px",
                color: "#000",
                position: "relative",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "-8px",
              }}
            >
              {currentItemNumber}/{TOTAL_ITEMS}
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "18px",
                backgroundColor: "#E3F2FD",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                zIndex: 1,
                border: "2px solid #BBDEFB",
              }}
            >
              <Box
                sx={{
                  width: `${completionPercentage}%`,
                  height: "100%",
                  backgroundColor: "#1CB0F6",
                  borderRadius: "20px",
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: recAudio ? "#1CB0F60F" : "#fff",
              border: recAudio ? "2px solid #58CC02" : "none",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 40px",
              marginBottom: "40px",
              maxWidth: "75%",
              height: "140px",
              width: "200px",
              minWidth: "200px",
              flexShrink: 0,
              marginTop: "60px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <span
                style={{
                  color: "#333F61",
                  fontWeight: 700,
                  fontSize: "50px",
                  lineHeight: "1",
                  letterSpacing: "2%",
                  fontFamily: getFontFamily(lang),
                }}
              >
                {renderHighlightedWord(item?.word, item?.letter)}
              </span>
            </Box>

            {recAudio && (
              <Box
                sx={{
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                  width: "100%",
                }}
              >
                <img
                  src={Assets.graph}
                  alt="graph"
                  style={{
                    height: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: "380px",
              height: "110px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "0px",
              padding: "14px 22px",
            }}
          >
            <VoiceAnalyser
              key={`voice-analyser-${currentIndex}`}
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              originalText={`R1-${item?.letter}`}
              handleNext={handleNextWord}
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              handleRecordingComplete={handleRecordingComplete}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              audioLink={singleAudio}
              noOffline={true}
              isNextButtonCalled={isNextButtonCalled}
              setIsNextButtonCalled={setIsNextButtonCalled}
              setEnableNext={setEnableNext}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "110px",
                maxHeight: "110px",
                borderRadius: "12px",
              }}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                setOpenMessageDialog,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const UI3 = () => {
    console.log("UI3 - currentItem:", currentItem, "imgIndex:", imgIndex);

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              ml: 8,
            }}
          >
            {currentItem?.images?.map((img, index) => (
              <React.Fragment key={index}>
                <img
                  src={img}
                  alt={`img-${index}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    opacity: index === imgIndex ? 1 : 0.3,
                    transition: "opacity 0.3s",
                  }}
                />
                {index < currentItem.images.length - 1 && (
                  <span
                    style={{
                      fontSize: "72px",
                      fontWeight: "500",
                      margin: "0 8px",
                      fontFamily: "Quicksand",
                    }}
                  >
                    {index === currentItem.images.length - 2 ? "=" : "+"}
                  </span>
                )}
              </React.Fragment>
            ))}
          </Box>

          <Box sx={{ width: "2px", backgroundColor: "#ccc", ml: 20 }} />

          <Box
            sx={{
              flex: 2,
              gap: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentItem?.images[imgIndex]}
                src={currentItem?.images[imgIndex]}
                alt="current"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                style={{
                  maxWidth: "180px",
                  maxHeight: "180px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={handleNextImage} // ✅ handleNextImage now has same logic as handleNextWord
              />
            </AnimatePresence>

            {/* VoiceAnalyser for UI3 */}
            <VoiceAnalyser
              key={`${itemIndexUi}-${imgIndex}`}
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              originalText={"R1"}
              handleNext={handleNextImage} // ✅ handleNextImage now has same logic as handleNextWord
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              handleRecordingComplete={handleRecordingComplete}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              audioLink={ui3Audio}
              noOffline={true}
              isNextButtonCalled={isNextButtonCalled}
              setIsNextButtonCalled={setIsNextButtonCalled}
              setEnableNext={setEnableNext}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                setOpenMessageDialog,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const renderUI = () => {
    if (lang !== "en") {
      return UI3();
    }

    if (!current) return null;

    if (current.type === "UI1") {
      return UI1();
    } else {
      return UI2();
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNextWord} // ✅ Using your handleNextWord
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
      flowNames={flowNames}
      handleBack={handleBackNavigation}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack: handleBackNavigation,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
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
            left: "0px",
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
                src={`https://www.youtube.com/embed/UIbZthEhrDk?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px", zIndex: 99999 }}
              ></iframe>
            </div>
          </div>
        )}
        {renderUI()}
      </Box>
    </MainLayout>
  );
};

export default R1;
