import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "../utils/constants";
import { getFontFamily } from "../utils/fontUtils";
import { useNavigate } from "react-router-dom";
import { response } from "../services/telementryService";
import { Typography, Stack, IconButton } from "@mui/material";
import { ArrowRight, RotateCcw } from "lucide-react";
import trainImg from "../assets/trainImg.svg";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnalyser from "../utils/VoiceAnalyser";
import * as s3Assets from "../utils/rFlowS3Links";
import { getAssetUrl } from "../utils/rFlowS3Links";
import { getAssetAudioUrl } from "../utils/rFlowS3Links";
import { ArrowLeft } from "lucide-react"; // or your icon library
import hintimg from "../assets/hintsicon.svg";

const theme = createTheme();

const dataEn = [
  {
    letter: "E",
    items: [
      {
        id: 1,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Egg",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
      },
      {
        id: 2,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFourteenImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
      {
        id: 3,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
      },
    ],
  },
  {
    letter: "A",
    items: [
      {
        id: 4,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
      },
      {
        id: 5,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
      },
      {
        id: 6,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Pea",
        image: getAssetUrl(s3Assets.peaOneImg),
        audio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
      },
    ],
  },
  {
    letter: "O",
    items: [
      {
        id: 7,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Orange",
        image: getAssetUrl(s3Assets.orangeFifteenImg),
        audio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
      },
      {
        id: 8,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogSevenImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
      {
        id: 9,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
      },
    ],
  },
  {
    letter: "I",
    items: [
      {
        id: 10,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
      },
      {
        id: 11,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Pig",
        image: getAssetUrl(s3Assets.pigNineImg),
        audio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
      },
      {
        id: 12,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Chilly",
        image: getAssetUrl(s3Assets.chilliImg),
        audio: getAssetAudioUrl(s3Assets.chillyAud),
        singleAudio: getAssetAudioUrl(s3Assets.chillyAud),
      },
    ],
  },
  {
    letter: "U",
    items: [
      {
        id: 13,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Umbrella",
        image: getAssetUrl(s3Assets.umbrellaTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
      },
      {
        id: 14,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Dustbin",
        image: getAssetUrl(s3Assets.DustbinTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
      },
      {
        id: 15,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Laddu",
        image: getAssetUrl(s3Assets.LadduTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
      },
    ],
  },
  {
    letter: "T",
    items: [
      {
        id: 16,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
      },
      {
        id: 17,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Watch",
        image: getAssetUrl(s3Assets.watchTwentyImg),
        audio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
      },
      {
        id: 18,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Plant",
        image: getAssetUrl(s3Assets.plantTwentyImg),
        audio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
      },
    ],
  },
  {
    letter: "N",
    items: [
      {
        id: 19,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Nest",
        image: getAssetUrl(s3Assets.NestFourteenImg),
        audio: getAssetAudioUrl(s3Assets.nestPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.nestPhonemeAudio),
      },
      {
        id: 20,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Honey",
        image: getAssetUrl(s3Assets.HoneyFourteenImg),
        audio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
      },
      {
        id: 21,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
    ],
  },
  {
    letter: "S",
    items: [
      {
        id: 22,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Sun",
        image: getAssetUrl(s3Assets.sunNineteenImg),
        audio: getAssetAudioUrl(s3Assets.sunPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.sunPhonemeAudio),
      },
      {
        id: 23,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Horse",
        image: getAssetUrl(s3Assets.horseNineteenImg),
        audio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
      },
      {
        id: 24,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Bus",
        image: getAssetUrl(s3Assets.busNineteenImg),
        audio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
      },
    ],
  },
  {
    letter: "R",
    items: [
      {
        id: 25,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Rat",
        image: getAssetUrl(s3Assets.ratEighteenImg),
        audio: getAssetAudioUrl(s3Assets.ratPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ratPhonemeAudio),
      },
      {
        id: 26,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Carrot",
        image: getAssetUrl(s3Assets.carrotEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
      },
      {
        id: 27,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Car",
        image: getAssetUrl(s3Assets.carEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
      },
    ],
  },
  {
    letter: "H",
    items: [
      {
        id: 28,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Hand",
        image: getAssetUrl(s3Assets.handEightImg),
        audio: getAssetAudioUrl(s3Assets.handPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.handPhonemeAudio),
      },
      {
        id: 29,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Teacher",
        image: getAssetUrl(s3Assets.teacherEightImg),
        audio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
      },
      {
        id: 30,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Earth",
        image: getAssetUrl(s3Assets.earthEightImg),
        audio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
      },
    ],
  },
  {
    letter: "L",
    items: [
      {
        id: 31,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Lion",
        image: getAssetUrl(s3Assets.LionTwelveImg),
        audio: getAssetAudioUrl(s3Assets.lionPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lionPhonemeAudio),
      },
      {
        id: 32,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Balloon",
        image: getAssetUrl(s3Assets.ballTwoImg),
        audio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
      },
      {
        id: 33,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Bell",
        image: getAssetUrl(s3Assets.bellTwelveImg),
        audio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
      },
    ],
  },
  {
    letter: "D",
    items: [
      {
        id: 34,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
      {
        id: 35,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
      },
      {
        id: 36,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
      },
    ],
  },
  {
    letter: "C",
    items: [
      {
        id: 37,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
      },
      {
        id: 38,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
      },
      {
        id: 39,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Garlic",
        image: getAssetUrl(s3Assets.garlicThreeImg),
        audio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
      },
    ],
  },
  {
    letter: "M",
    items: [
      {
        id: 40,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
      },
      {
        id: 41,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Lemon",
        image: getAssetUrl(s3Assets.lemonThirteenImg),
        audio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
      },
      {
        id: 42,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
      },
    ],
  },
  {
    letter: "F",
    items: [
      {
        id: 43,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Fish",
        image: getAssetUrl(s3Assets.fishSixImg),
        audio: getAssetAudioUrl(s3Assets.fishPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fishPhonemeAudio),
      },
      {
        id: 44,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Giraffe",
        image: getAssetUrl(s3Assets.girraffeSixImg),
        audio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
      },
      {
        id: 45,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Leaf",
        image: getAssetUrl(s3Assets.LeafSixImg),
        audio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
      },
    ],
  },
  {
    letter: "Y",
    items: [
      {
        id: 46,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Yak",
        image: getAssetUrl(s3Assets.yakTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.yakPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.yakPhonemeAudio),
      },
      {
        id: 47,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Papaya",
        image: getAssetUrl(s3Assets.papayaTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
      },
      {
        id: 48,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Key",
        image: getAssetUrl(s3Assets.KeyTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
      },
    ],
  },
  {
    letter: "W",
    items: [
      {
        id: 49,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
      },
      {
        id: 50,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
      },
      {
        id: 51,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Crow",
        image: getAssetUrl(s3Assets.CrowTwentyThreeImg),
        audio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
      },
    ],
  },
  {
    letter: "G",
    items: [
      {
        id: 52,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Goat",
        image: getAssetUrl(s3Assets.goatSevenImg),
        audio: getAssetAudioUrl(s3Assets.goatPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.goatPhonemeAudio),
      },
      {
        id: 53,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
      },
      {
        id: 54,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
    ],
  },
  {
    letter: "P",
    items: [
      {
        id: 55,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
      {
        id: 56,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
      },
      {
        id: 57,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Cap",
        image: getAssetUrl(s3Assets.capSixteenImg),
        audio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
      },
    ],
  },
  {
    letter: "B",
    items: [
      {
        id: 58,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Ball",
        image: getAssetUrl(s3Assets.ballGif),
        audio: getAssetAudioUrl(s3Assets.ballPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ballPhonemeAudio),
      },
      {
        id: 59,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
      },
      {
        id: 60,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Cub",
        image: getAssetUrl(s3Assets.cubTwoImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
      },
    ],
  },
  {
    letter: "V",
    items: [
      {
        id: 61,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Van",
        image: getAssetUrl(s3Assets.VanTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.vanPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.vanPhonemeAudio),
      },
      {
        id: 62,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Guava",
        image: getAssetUrl(s3Assets.GuavaTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
      },
    ],
  },
  {
    letter: "K",
    items: [
      {
        id: 64,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
      },
      {
        id: 65,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Monkey",
        image: getAssetUrl(s3Assets.monkeyElevenImg),
        audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
      },
      {
        id: 66,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Book",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
      },
    ],
  },
  {
    letter: "J",
    items: [
      {
        id: 67,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
      },
      {
        id: 68,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "brinjal",
        image: getAssetUrl(s3Assets.brinjalTenImg),
        audio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
      },
    ],
  },
  {
    letter: "X",
    items: [
      {
        id: 70,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Xray",
        image: getAssetUrl(s3Assets.xrayTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.xrayPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.xrayPhonemeAudio),
      },
      {
        id: 71,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Textbook",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
      },
      {
        id: 72,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Fox",
        image: getAssetUrl(s3Assets.foxTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
      },
    ],
  },
  {
    letter: "Q",
    items: [
      {
        id: 73,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Queen",
        image: getAssetUrl(s3Assets.queenSixteenImg),
        audio: getAssetAudioUrl(s3Assets.queenPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.queenPhonemeAudio),
      },
      {
        id: 74,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Mosquito",
        image: getAssetUrl(s3Assets.mosquitoSeventeenImg),
        audio: getAssetAudioUrl(s3Assets.mosquitoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mosquitoPhonemeAudio),
      },
    ],
  },
  {
    letter: "Z",
    items: [
      {
        id: 76,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
      },
      {
        id: 77,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Puzzle",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
      },
      {
        id: 78,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Quiz",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
      },
    ],
  },
];

const dataKn = [
  {
    letter: "ಅ",
    items: [
      {
        id: 1,
        title: "ಸ್ವರಗಳು",
        letters: "ಅ",
        letter: "ಅ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.ಅರಸImg),
        audio: getAssetAudioUrl(s3Assets.ಅರಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅರಸSingleAudio),
      },
    ],
  },
  {
    letter: "ಆ",
    items: [
      {
        id: 2,
        title: "ಸ್ವರಗಳು",
        letters: "ಆ",
        letter: "ಆ",
        word: "ಆನೆ",
        image: getAssetUrl(s3Assets.ಆನೆImg),
        audio: getAssetAudioUrl(s3Assets.ಆನೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆನೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಇ",
    items: [
      {
        id: 3,
        title: "ಸ್ವರಗಳು",
        letters: "ಇ",
        letter: "ಇ",
        word: "ಇಲಿ",
        image: getAssetUrl(s3Assets.ಇಲಿImg),
        audio: getAssetAudioUrl(s3Assets.ಇಲಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಇಲಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಈ",
    items: [
      {
        id: 4,
        title: "ಸ್ವರಗಳು",
        letters: "ಈ",
        letter: "ಈ",
        word: "ಈಜು",
        image: getAssetUrl(s3Assets.ಈಜುImg),
        audio: getAssetAudioUrl(s3Assets.ಈಜುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಜುSingleAudio),
      },
    ],
  },
  {
    letter: "ಉ",
    items: [
      {
        id: 5,
        title: "ಸ್ವರಗಳು",
        letters: "ಉ",
        letter: "ಉ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.ಉದರImg),
        audio: getAssetAudioUrl(s3Assets.ಉದರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದರSingleAudio),
      },
    ],
  },
  {
    letter: "ಊ",
    items: [
      {
        id: 6,
        title: "ಸ್ವರಗಳು",
        letters: "ಊ",
        letter: "ಊ",
        word: "ಊಟ",
        image: getAssetUrl(s3Assets.ಊಟImg),
        audio: getAssetAudioUrl(s3Assets.ಊಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಊಟSingleAudio),
      },
    ],
  },
  {
    letter: "ಋ",
    items: [
      {
        id: 7,
        title: "ಸ್ವರಗಳು",
        letters: "ಋ",
        letter: "ಋ",
        word: "ಋಷಿ",
        image: getAssetUrl(s3Assets.ಋಷಿImg),
        audio: getAssetAudioUrl(s3Assets.ಋಷಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಋಷಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಎ",
    items: [
      {
        id: 8,
        title: "ಸ್ವರಗಳು",
        letters: "ಎ",
        letter: "ಎ",
        word: "ಎಲೆ",
        image: getAssetUrl(s3Assets.ಎಲೆImg),
        audio: getAssetAudioUrl(s3Assets.ಎಲೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಎಲೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಏ",
    items: [
      {
        id: 9,
        title: "ಸ್ವರಗಳು",
        letters: "ಏ",
        letter: "ಏ",
        word: "ಏಣಿ",
        image: getAssetUrl(s3Assets.ಏಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಏಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಏಣಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಐ",
    items: [
      {
        id: 10,
        title: "ಸ್ವರಗಳು",
        letters: "ಐ",
        letter: "ಐ",
        word: "ಐದು",
        image: getAssetUrl(s3Assets.ಐದುImg),
        audio: getAssetAudioUrl(s3Assets.ಐದುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಐದುSingleAudio),
      },
    ],
  },
  {
    letter: "ಒ",
    items: [
      {
        id: 11,
        title: "ಸ್ವರಗಳು",
        letters: "ಒ",
        letter: "ಒ",
        word: "ಒಂಟೆ",
        image: getAssetUrl(s3Assets.ಒಂಟೆImg),
        audio: getAssetAudioUrl(s3Assets.ಒಂಟೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಒಂಟೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಓ",
    items: [
      {
        id: 12,
        title: "ಸ್ವರಗಳು",
        letters: "ಓ",
        letter: "ಓ",
        word: "ಓಡು",
        image: getAssetUrl(s3Assets.ಓಡುImg),
        audio: getAssetAudioUrl(s3Assets.ಓಡುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಓಡುSingleAudio),
      },
    ],
  },
  {
    letter: "ಔ",
    items: [
      {
        id: 13,
        title: "ಸ್ವರಗಳು",
        letters: "ಔ",
        letter: "ಔ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧImg),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧSingleAudio),
      },
    ],
  },
  {
    letter: "ಅಂ",
    items: [
      {
        id: 14,
        title: "ಸ್ವರಗಳು",
        letters: "ಅಂ",
        letter: "ಅಂ",
        word: "ಅಂಗಡಿ",
        image: getAssetUrl(s3Assets.ಅಂಗಡಿImg),
        audio: getAssetAudioUrl(s3Assets.ಅಂಗಡಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅಂಗಡಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಅಃ",
    items: [
      {
        id: 15,
        title: "ಸ್ವರಗಳು",
        letters: "ಅಃ",
        letter: "ಅಃ",
        word: "ಅಃ",
        image: getAssetUrl(s3Assets.ಅಃImg),
        audio: getAssetAudioUrl(s3Assets.ಅಃAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅಃSingleAudio),
      },
    ],
  },
  {
    letter: "ಕ",
    items: [
      {
        id: 16,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.ಕಮಲImg),
        audio: getAssetAudioUrl(s3Assets.ಕಮಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಮಲSingleAudio),
      },
      {
        id: 17,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಏಕದಳ",
        image: getAssetUrl(s3Assets.ಏಕದಳImg),
        audio: getAssetAudioUrl(s3Assets.ಏಕದಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಏಕದಳSingleAudio),
      },
      {
        id: 18,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.ಪದಕImg),
        audio: getAssetAudioUrl(s3Assets.ಪದಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದಕSingleAudio),
      },
    ],
  },
  {
    letter: "ಖ",
    items: [
      {
        id: 19,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಖಡ್ಗ",
        image: getAssetUrl(s3Assets.ಖಡ್ಗImg),
        audio: getAssetAudioUrl(s3Assets.ಖಡ್ಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಖಡ್ಗSingleAudio),
      },
      {
        id: 20,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಲೇಖನಿ",
        image: getAssetUrl(s3Assets.ಲೇಖನಿImg),
        audio: getAssetAudioUrl(s3Assets.ಲೇಖನಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲೇಖನಿSingleAudio),
      },
      {
        id: 21,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಪಂಖ",
        image: getAssetUrl(s3Assets.ಪಂಖImg),
        audio: getAssetAudioUrl(s3Assets.ಪಂಖAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪಂಖSingleAudio),
      },
    ],
  },
  {
    letter: "ಗ",
    items: [
      {
        id: 22,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಗರಿ",
        image: getAssetUrl(s3Assets.ಗರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಗರಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗರಿSingleAudio),
      },
      {
        id: 23,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಆಗಸ",
        image: getAssetUrl(s3Assets.ಆಗಸImg),
        audio: getAssetAudioUrl(s3Assets.ಆಗಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಗಸSingleAudio),
      },
      {
        id: 24,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಉರಗ",
        image: getAssetUrl(s3Assets.ಉರಗImg),
        audio: getAssetAudioUrl(s3Assets.ಉರಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉರಗSingleAudio),
      },
    ],
  },
  {
    letter: "ಘ",
    items: [
      {
        id: 25,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಂಟೆ",
        image: getAssetUrl(s3Assets.ಘಂಟೆImg),
        audio: getAssetAudioUrl(s3Assets.ಘಂಟೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಘಂಟೆSingleAudio),
      },
      {
        id: 26,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಮಘಮ",
        image: getAssetUrl(s3Assets.ಘಮಘಮImg),
        audio: getAssetAudioUrl(s3Assets.ಘಮಘಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಘಮಘಮSingleAudio),
      },
      {
        id: 27,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಸಂಘ",
        image: getAssetUrl(s3Assets.ಸಂಘImg),
        audio: getAssetAudioUrl(s3Assets.ಸಂಘAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಂಘSingleAudio),
      },
    ],
  },
  {
    letter: "ಙ",
    items: [
      {
        id: 28,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಙ",
        letter: "ಙ",
        word: "ಙ",
        image: getAssetUrl(s3Assets.ಙImg),
        audio: getAssetAudioUrl(s3Assets.ಙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಙSingleAudio),
      },
    ],
  },
  {
    letter: "ಚ",
    items: [
      {
        id: 29,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಚಮಚ",
        image: getAssetUrl(s3Assets.ಚಮಚImg),
        audio: getAssetAudioUrl(s3Assets.ಚಮಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಚಮಚSingleAudio),
      },
      {
        id: 30,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.ಈಚಲImg),
        audio: getAssetAudioUrl(s3Assets.ಈಚಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಚಲSingleAudio),
      },
      {
        id: 31,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಮಂಚ",
        image: getAssetUrl(s3Assets.ಮಂಚImg),
        audio: getAssetAudioUrl(s3Assets.ಮಂಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮಂಚSingleAudio),
      },
    ],
  },
  {
    letter: "ಛ",
    items: [
      {
        id: 32,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಛ",
        letter: "ಛ",
        word: "ಛತ್ರಿ",
        image: getAssetUrl(s3Assets.ಛತ್ರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಛತ್ರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಛತ್ರಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಜ",
    items: [
      {
        id: 33,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಜನ",
        image: getAssetUrl(s3Assets.ಜನImg),
        audio: getAssetAudioUrl(s3Assets.ಜನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜನSingleAudio),
      },
      {
        id: 34,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಗೀಜಗ",
        image: getAssetUrl(s3Assets.ಗೀಜಗImg),
        audio: getAssetAudioUrl(s3Assets.ಗೀಜಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗೀಜಗSingleAudio),
      },
      {
        id: 35,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಭುಜ",
        image: getAssetUrl(s3Assets.ಭುಜImg),
        audio: getAssetAudioUrl(s3Assets.ಭುಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭುಜSingleAudio),
      },
    ],
  },
  {
    letter: "ಝ",
    items: [
      {
        id: 36,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಝ",
        letter: "ಝ",
        word: "ಝರಿ",
        image: getAssetUrl(s3Assets.ಝರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಝರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಝರಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಞ",
    items: [
      {
        id: 37,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಞ",
        letter: "ಞ",
        word: "ಞ",
        image: getAssetUrl(s3Assets.ಞImg),
        audio: getAssetAudioUrl(s3Assets.ಞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಞSingleAudio),
      },
    ],
  },
  {
    letter: "ಟ",
    items: [
      {
        id: 38,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಟಗರು",
        image: getAssetUrl(s3Assets.ಟಗರುImg),
        audio: getAssetAudioUrl(s3Assets.ಟಗರುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಟಗರುSingleAudio),
      },
      {
        id: 39,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಕಿಟಕಿ",
        image: getAssetUrl(s3Assets.ಕಿಟಕಿImg),
        audio: getAssetAudioUrl(s3Assets.ಕಿಟಕಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಿಟಕಿSingleAudio),
      },
      {
        id: 40,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಆಟ",
        image: getAssetUrl(s3Assets.ಆಟImg),
        audio: getAssetAudioUrl(s3Assets.ಆಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಟSingleAudio),
      },
    ],
  },
  {
    letter: "ಠ",
    items: [
      {
        id: 41,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಠಕ್ಕ",
        image: getAssetUrl(s3Assets.ಠಕ್ಕImg),
        audio: getAssetAudioUrl(s3Assets.ಠಕ್ಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಠಕ್ಕSingleAudio),
      },
      {
        id: 42,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕೊಠಡಿ",
        image: getAssetUrl(s3Assets.ಕೊಠಡಿImg),
        audio: getAssetAudioUrl(s3Assets.ಕೊಠಡಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೊಠಡಿSingleAudio),
      },
      {
        id: 43,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕಂಠ",
        image: getAssetUrl(s3Assets.ಕಂಠImg),
        audio: getAssetAudioUrl(s3Assets.ಕಂಠAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಂಠSingleAudio),
      },
    ],
  },
  {
    letter: "ಡ",
    items: [
      {
        id: 44,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಡಬ್ಬ",
        image: getAssetUrl(s3Assets.ಡಬ್ಬImg),
        audio: getAssetAudioUrl(s3Assets.ಡಬ್ಬAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಡಬ್ಬSingleAudio),
      },
      {
        id: 45,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಕಡಲು",
        image: getAssetUrl(s3Assets.ಕಡಲುImg),
        audio: getAssetAudioUrl(s3Assets.ಕಡಲುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಡಲುSingleAudio),
      },
      {
        id: 46,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಗಿಡ",
        image: getAssetUrl(s3Assets.ಗಿಡImg),
        audio: getAssetAudioUrl(s3Assets.ಗಿಡAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಿಡSingleAudio),
      },
    ],
  },
  {
    letter: "ಢ",
    items: [
      {
        id: 47,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಢಣಢಣ",
        image: getAssetUrl(s3Assets.ಢಣಢಣImg),
        audio: getAssetAudioUrl(s3Assets.ಢಣಢಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಢಣಢಣSingleAudio),
      },
      {
        id: 48,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಪ್ರೌಢಶಾಲೆ",
        image: getAssetUrl(s3Assets.ಪ್ರೌಢಶಾಲೆImg),
        audio: getAssetAudioUrl(s3Assets.ಪ್ರೌಢಶಾಲೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪ್ರೌಢಶಾಲೆSingleAudio),
      },
      {
        id: 49,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಗಾಢ",
        image: getAssetUrl(s3Assets.ಗಾಢImg),
        audio: getAssetAudioUrl(s3Assets.ಗಾಢAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಾಢSingleAudio),
      },
    ],
  },
  {
    letter: "ಣ",
    items: [
      {
        id: 50,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣ",
        image: getAssetUrl(s3Assets.ಹಣImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣSingleAudio),
      },
      {
        id: 51,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣತೆ",
        image: getAssetUrl(s3Assets.ಹಣತೆImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣತೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣತೆSingleAudio),
      },
    ],
  },
  {
    letter: "ತ",
    items: [
      {
        id: 52,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲImg),
        audio: getAssetAudioUrl(s3Assets.ತಬಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲSingleAudio),
      },
      {
        id: 53,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ಸಂತಸ",
        image: getAssetUrl(s3Assets.ಸಂತಸImg),
        audio: getAssetAudioUrl(s3Assets.ಸಂತಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಂತಸSingleAudio),
      },
      {
        id: 54,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ಗಣಿತ",
        image: getAssetUrl(s3Assets.ಗಣಿತImg),
        audio: getAssetAudioUrl(s3Assets.ಗಣಿತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಣಿತSingleAudio),
      },
    ],
  },
  {
    letter: "ಥ",
    items: [
      {
        id: 55,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥಳಥಳ",
        image: getAssetUrl(s3Assets.ಥಳಥಳImg),
        audio: getAssetAudioUrl(s3Assets.ಥಳಥಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಥಳಥಳSingleAudio),
      },
      {
        id: 56,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥರಥರ",
        image: getAssetUrl(s3Assets.ಥರಥರImg),
        audio: getAssetAudioUrl(s3Assets.ಥರಥರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಥರಥರSingleAudio),
      },
      {
        id: 57,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.ರಥImg),
        audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಥSingleAudio),
      },
    ],
  },
  {
    letter: "ದ",
    items: [
      {
        id: 58,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ದನ",
        image: getAssetUrl(s3Assets.ದನImg),
        audio: getAssetAudioUrl(s3Assets.ದನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದನSingleAudio),
      },
      {
        id: 59,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ಕೂದಲು",
        image: getAssetUrl(s3Assets.ಕೂದಲುImg),
        audio: getAssetAudioUrl(s3Assets.ಕೂದಲುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೂದಲುSingleAudio),
      },
      {
        id: 60,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ಕಾಗದ",
        image: getAssetUrl(s3Assets.ಕಾಗದImg),
        audio: getAssetAudioUrl(s3Assets.ಕಾಗದAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಾಗದSingleAudio),
      },
    ],
  },
  {
    letter: "ಧ",
    items: [
      {
        id: 61,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಧನ",
        image: getAssetUrl(s3Assets.ಧನImg),
        audio: getAssetAudioUrl(s3Assets.ಧನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಧನSingleAudio),
      },
      {
        id: 62,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಬುಧವಾರ",
        image: getAssetUrl(s3Assets.ಬುಧವಾರImg),
        audio: getAssetAudioUrl(s3Assets.ಬುಧವಾರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬುಧವಾರSingleAudio),
      },
      {
        id: 63,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧ2Img),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧ2SingleAudio),
      },
    ],
  },
  {
    letter: "ನ",
    items: [
      {
        id: 64,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ನರಿ",
        image: getAssetUrl(s3Assets.ನರಿImg),
        audio: getAssetAudioUrl(s3Assets.ನರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನರಿSingleAudio),
      },
      {
        id: 65,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ಕನಸು",
        image: getAssetUrl(s3Assets.ಕನಸುImg),
        audio: getAssetAudioUrl(s3Assets.ಕನಸುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕನಸುSingleAudio),
      },
      {
        id: 66,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ನಮನ",
        image: getAssetUrl(s3Assets.ನಮನImg),
        audio: getAssetAudioUrl(s3Assets.ನಮನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಮನSingleAudio),
      },
    ],
  },
  {
    letter: "ಪ",
    items: [
      {
        id: 67,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.ಪದಕ2Img),
        audio: getAssetAudioUrl(s3Assets.ಪದಕ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದಕ2SingleAudio),
      },
      {
        id: 68,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಗಾಳಿಪಟ",
        image: getAssetUrl(s3Assets.ಗಾಳಿಪಟImg),
        audio: getAssetAudioUrl(s3Assets.ಗಾಳಿಪಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಾಳಿಪಟSingleAudio),
      },
      {
        id: 69,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಕೋಪ",
        image: getAssetUrl(s3Assets.ಕೋಪImg),
        audio: getAssetAudioUrl(s3Assets.ಕೋಪAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೋಪSingleAudio),
      },
    ],
  },
  {
    letter: "ಫ",
    items: [
      {
        id: 70,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಫಲ",
        image: getAssetUrl(s3Assets.ಫಲImg),
        audio: getAssetAudioUrl(s3Assets.ಫಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಫಲSingleAudio),
      },
      {
        id: 71,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಸೌರಫಲಕ",
        image: getAssetUrl(s3Assets.ಸೌರಫಲಕImg),
        audio: getAssetAudioUrl(s3Assets.ಸೌರಫಲಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸೌರಫಲಕSingleAudio),
      },
      {
        id: 72,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಕಫ",
        image: getAssetUrl(s3Assets.ಕಫImg),
        audio: getAssetAudioUrl(s3Assets.ಕಫAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಫSingleAudio),
      },
    ],
  },
  {
    letter: "ಬ",
    items: [
      {
        id: 73,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಬಟಾಣಿ",
        image: getAssetUrl(s3Assets.ಬಟಾಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಬಟಾಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬಟಾಣಿSingleAudio),
      },
      {
        id: 74,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ತಬಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲ2SingleAudio),
      },
      {
        id: 75,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಕುಟುಂಬ",
        image: getAssetUrl(s3Assets.ಕುಟುಂಬImg),
        audio: getAssetAudioUrl(s3Assets.ಕುಟುಂಬAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕುಟುಂಬSingleAudio),
      },
    ],
  },
  {
    letter: "ಭ",
    items: [
      {
        id: 76,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಭರಣಿ",
        image: getAssetUrl(s3Assets.ಭರಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಭರಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭರಣಿSingleAudio),
      },
      {
        id: 77,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಆಭರಣ",
        image: getAssetUrl(s3Assets.ಆಭರಣImg),
        audio: getAssetAudioUrl(s3Assets.ಆಭರಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಭರಣSingleAudio),
      },
      {
        id: 78,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ವೃಷಭ",
        image: getAssetUrl(s3Assets.ವೃಷಭImg),
        audio: getAssetAudioUrl(s3Assets.ವೃಷಭAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವೃಷಭSingleAudio),
      },
    ],
  },
  {
    letter: "ಮ",
    items: [
      {
        id: 79,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಮರ",
        image: getAssetUrl(s3Assets.ಮರImg),
        audio: getAssetAudioUrl(s3Assets.ಮರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮರSingleAudio),
      },
      {
        id: 80,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.ಕಮಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ಕಮಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಮಲ2SingleAudio),
      },
      {
        id: 81,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಹಿಮ",
        image: getAssetUrl(s3Assets.ಹಿಮImg),
        audio: getAssetAudioUrl(s3Assets.ಹಿಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಿಮSingleAudio),
      },
    ],
  },
  {
    letter: "ಯ",
    items: [
      {
        id: 82,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಯಮ",
        image: getAssetUrl(s3Assets.ಯಮImg),
        audio: getAssetAudioUrl(s3Assets.ಯಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಯಮSingleAudio),
      },
      {
        id: 83,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಪಾಯಸ",
        image: getAssetUrl(s3Assets.ಪಾಯಸImg),
        audio: getAssetAudioUrl(s3Assets.ಪಾಯಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪಾಯಸSingleAudio),
      },
      {
        id: 84,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಭಯ",
        image: getAssetUrl(s3Assets.ಭಯImg),
        audio: getAssetAudioUrl(s3Assets.ಭಯAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭಯSingleAudio),
      },
    ],
  },
  {
    letter: "ರ",
    items: [
      {
        id: 85,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.ರಥ2Img),
        audio: getAssetAudioUrl(s3Assets.ರಥ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಥ2SingleAudio),
      },
      {
        id: 86,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ಬೆರಳು",
        image: getAssetUrl(s3Assets.ಬೆರಳುImg),
        audio: getAssetAudioUrl(s3Assets.ಬೆರಳುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬೆರಳುSingleAudio),
      },
      {
        id: 87,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.ಉದರ2Img),
        audio: getAssetAudioUrl(s3Assets.ಉದರ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದರ2SingleAudio),
      },
    ],
  },
  {
    letter: "ಲ",
    items: [
      {
        id: 88,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಲತೆ",
        image: getAssetUrl(s3Assets.ಲತೆImg),
        audio: getAssetAudioUrl(s3Assets.ಲತೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲತೆSingleAudio),
      },
      {
        id: 89,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಚಿಲಕ",
        image: getAssetUrl(s3Assets.ಚಿಲಕImg),
        audio: getAssetAudioUrl(s3Assets.ಚಿಲಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಚಿಲಕSingleAudio),
      },
      {
        id: 90,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಮೊಲ",
        image: getAssetUrl(s3Assets.ಮೊಲImg),
        audio: getAssetAudioUrl(s3Assets.ಮೊಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮೊಲSingleAudio),
      },
    ],
  },
  {
    letter: "ವ",
    items: [
      {
        id: 91,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ವನ",
        image: getAssetUrl(s3Assets.ವನImg),
        audio: getAssetAudioUrl(s3Assets.ವನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವನSingleAudio),
      },
      {
        id: 92,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ಲವಣ",
        image: getAssetUrl(s3Assets.ಲವಣImg),
        audio: getAssetAudioUrl(s3Assets.ಲವಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲವಣSingleAudio),
      },
      {
        id: 93,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ಶಿವ",
        image: getAssetUrl(s3Assets.ಶಿವImg),
        audio: getAssetAudioUrl(s3Assets.ಶಿವAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಶಿವSingleAudio),
      },
    ],
  },
  {
    letter: "ಶ",
    items: [
      {
        id: 94,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ಶಶಿ",
        image: getAssetUrl(s3Assets.ಶಶಿImg),
        audio: getAssetAudioUrl(s3Assets.ಶಶಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಶಶಿSingleAudio),
      },
      {
        id: 95,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದಶಕ",
        image: getAssetUrl(s3Assets.ದಶಕImg),
        audio: getAssetAudioUrl(s3Assets.ದಶಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದಶಕSingleAudio),
      },
      {
        id: 96,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದೇಶ",
        image: getAssetUrl(s3Assets.ದೇಶImg),
        audio: getAssetAudioUrl(s3Assets.ದೇಶAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದೇಶSingleAudio),
      },
    ],
  },
  {
    letter: "ಷ",
    items: [
      {
        id: 97,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಷಡ್ಭುಜ",
        image: getAssetUrl(s3Assets.ಷಡ್ಭುಜImg),
        audio: getAssetAudioUrl(s3Assets.ಷಡ್ಭುಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಷಡ್ಭುಜSingleAudio),
      },
      {
        id: 98,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧ3Img),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧ3Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧ3SingleAudio),
      },
      {
        id: 99,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಪುರುಷ",
        image: getAssetUrl(s3Assets.ಪುರುಷImg),
        audio: getAssetAudioUrl(s3Assets.ಪುರುಷAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪುರುಷSingleAudio),
      },
    ],
  },
  {
    letter: "ಸ",
    items: [
      {
        id: 100,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಸರ",
        image: getAssetUrl(s3Assets.ಸರImg),
        audio: getAssetAudioUrl(s3Assets.ಸರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸರSingleAudio),
      },
      {
        id: 101,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಮೊಸಳೆ",
        image: getAssetUrl(s3Assets.ಮೊಸಳೆImg),
        audio: getAssetAudioUrl(s3Assets.ಮೊಸಳೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮೊಸಳೆSingleAudio),
      },
      {
        id: 102,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಹಂಸ",
        image: getAssetUrl(s3Assets.ಹಂಸImg),
        audio: getAssetAudioUrl(s3Assets.ಹಂಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಂಸSingleAudio),
      },
    ],
  },
  {
    letter: "ಹ",
    items: [
      {
        id: 103,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಹಸು",
        image: getAssetUrl(s3Assets.ಹಸುImg),
        audio: getAssetAudioUrl(s3Assets.ಹಸುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಸುSingleAudio),
      },
      {
        id: 104,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ವಾಹನ",
        image: getAssetUrl(s3Assets.ವಾಹನImg),
        audio: getAssetAudioUrl(s3Assets.ವಾಹನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವಾಹನSingleAudio),
      },
      {
        id: 105,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಸಿಂಹ",
        image: getAssetUrl(s3Assets.ಸಿಂಹImg),
        audio: getAssetAudioUrl(s3Assets.ಸಿಂಹAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಿಂಹSingleAudio),
      },
    ],
  },
  {
    letter: "ಳ",
    items: [
      {
        id: 106,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಳ",
        letter: "ಳ",
        word: "ಹಳದಿ",
        image: getAssetUrl(s3Assets.ಹಳದಿImg),
        audio: getAssetAudioUrl(s3Assets.ಹಳದಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಳದಿSingleAudio),
      },
    ],
  },
];
const dataHi = [
  {
    letter: "अ",
    items: [
      {
        id: 1,
        title: "स्वर",
        letters: "अ",
        letter: "अ",
        word: "अनार",
        image: getAssetUrl(s3Assets.अनारImg),
        audio: getAssetAudioUrl(s3Assets.अनारAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अनारAudio),
      },
    ],
  },
  {
    letter: "आ",
    items: [
      {
        id: 2,
        title: "स्वर",
        letters: "आ",
        letter: "आ",
        word: "आम",
        image: getAssetUrl(s3Assets.आमImg),
        audio: getAssetAudioUrl(s3Assets.आमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आमAudio),
      },
      {
        id: 3,
        title: "स्वर",
        letters: "आ",
        letter: "आ",
        word: "कछुआ",
        image: getAssetUrl(s3Assets.कछुआImg),
        audio: getAssetAudioUrl(s3Assets.कछुआAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कछुआAudio),
      },
    ],
  },
  {
    letter: "इ",
    items: [
      {
        id: 4,
        title: "स्वर",
        letters: "इ",
        letter: "इ",
        word: "इमली",
        image: getAssetUrl(s3Assets.इमलीImg),
        audio: getAssetAudioUrl(s3Assets.इमलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इमलीAudio),
      },
      {
        id: 5,
        title: "स्वर",
        letters: "इ",
        letter: "इ",
        word: "साइकिल",
        image: getAssetUrl(s3Assets.साइकिलImg),
        audio: getAssetAudioUrl(s3Assets.साइकिलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.साइकिलAudio),
      },
    ],
  },
  {
    letter: "ई",
    items: [
      {
        id: 6,
        title: "स्वर",
        letters: "ई",
        letter: "ई",
        word: "ईख",
        image: getAssetUrl(s3Assets.ईखImg),
        audio: getAssetAudioUrl(s3Assets.ईखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ईखAudio),
      },
      {
        id: 7,
        title: "स्वर",
        letters: "ई",
        letter: "ई",
        word: "नई",
        image: getAssetUrl(s3Assets.नईImg),
        audio: getAssetAudioUrl(s3Assets.नईAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नईAudio),
      },
    ],
  },
  {
    letter: "उ",
    items: [
      {
        id: 8,
        title: "स्वर",
        letters: "उ",
        letter: "उ",
        word: "उड़",
        image: getAssetUrl(s3Assets.उड़Img),
        audio: getAssetAudioUrl(s3Assets.उड़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.उड़Audio),
      },
    ],
  },
  {
    letter: "ऊ",
    items: [
      {
        id: 9,
        title: "स्वर",
        letters: "ऊ",
        letter: "ऊ",
        word: "ऊपर",
        image: getAssetUrl(s3Assets.ऊपरImg),
        audio: getAssetAudioUrl(s3Assets.ऊपरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊपरAudio),
      },
    ],
  },
  {
    letter: "ऋ",
    items: [
      {
        id: 10,
        title: "स्वर",
        letters: "ऋ",
        letter: "ऋ",
        word: "ऋषि",
        image: getAssetUrl(s3Assets.ऋषिImg),
        audio: getAssetAudioUrl(s3Assets.ऋषिAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऋषिAudio),
      },
    ],
  },
  {
    letter: "ए",
    items: [
      {
        id: 11,
        title: "स्वर",
        letters: "ए",
        letter: "ए",
        word: "एड़ी",
        image: getAssetUrl(s3Assets.एड़ीImg),
        audio: getAssetAudioUrl(s3Assets.एड़ीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.एड़ीAudio),
      },
      {
        id: 12,
        title: "स्वर",
        letters: "ए",
        letter: "ए",
        word: "पढ़िए",
        image: getAssetUrl(s3Assets.पढ़िएImg),
        audio: getAssetAudioUrl(s3Assets.पढ़िएAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पढ़िएAudio),
      },
    ],
  },
  {
    letter: "ऐ",
    items: [
      {
        id: 13,
        title: "स्वर",
        letters: "ऐ",
        letter: "ऐ",
        word: "ऐनक",
        image: getAssetUrl(s3Assets.ऐनकImg),
        audio: getAssetAudioUrl(s3Assets.ऐनकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऐनकAudio),
      },
    ],
  },
  {
    letter: "ओ",
    items: [
      {
        id: 14,
        title: "स्वर",
        letters: "ओ",
        letter: "ओ",
        word: "ओखली",
        image: getAssetUrl(s3Assets.ओखलीImg),
        audio: getAssetAudioUrl(s3Assets.ओखलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ओखलीAudio),
      },
    ],
  },
  {
    letter: "औ",
    items: [
      {
        id: 15,
        title: "स्वर",
        letters: "औ",
        letter: "औ",
        word: "औरत",
        image: getAssetUrl(s3Assets.औरतImg),
        audio: getAssetAudioUrl(s3Assets.औरतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.औरतAudio),
      },
    ],
  },
  {
    letter: "अं",
    items: [
      {
        id: 16,
        title: "स्वर",
        letters: "अं",
        letter: "अं",
        word: "अंगूर",
        image: getAssetUrl(s3Assets.अंगूरImg),
        audio: getAssetAudioUrl(s3Assets.अंगूरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अंगूरAudio),
      },
    ],
  },
  {
    letter: "क",
    items: [
      {
        id: 17,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "कबूतर",
        image: getAssetUrl(s3Assets.कबूतरImg),
        audio: getAssetAudioUrl(s3Assets.कबूतरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कबूतरAudio),
      },
      {
        id: 18,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "बकरी",
        image: getAssetUrl(s3Assets.बकरीImg),
        audio: getAssetAudioUrl(s3Assets.बकरीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बकरीAudio),
      },
      {
        id: 19,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "नमक",
        image: getAssetUrl(s3Assets.नमकImg),
        audio: getAssetAudioUrl(s3Assets.नमकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नमकAudio),
      },
    ],
  },
  {
    letter: "ख",
    items: [
      {
        id: 20,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "खरगोश",
        image: getAssetUrl(s3Assets.खरगोशImg),
        audio: getAssetAudioUrl(s3Assets.खरगोशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खरगोशAudio),
      },
      {
        id: 21,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "लेखन",
        image: getAssetUrl(s3Assets.लेखनImg),
        audio: getAssetAudioUrl(s3Assets.लेखनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लेखनAudio),
      },
      {
        id: 22,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "भूख",
        image: getAssetUrl(s3Assets.भूखImg),
        audio: getAssetAudioUrl(s3Assets.भूखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भूखAudio),
      },
    ],
  },
  {
    letter: "ग",
    items: [
      {
        id: 23,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "गधा",
        image: getAssetUrl(s3Assets.गधाImg),
        audio: getAssetAudioUrl(s3Assets.गधाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गधाAudio),
      },
      {
        id: 24,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "नगर",
        image: getAssetUrl(s3Assets.नगरImg),
        audio: getAssetAudioUrl(s3Assets.नगरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नगरAudio),
      },
      {
        id: 25,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "लोग",
        image: getAssetUrl(s3Assets.लोगImg),
        audio: getAssetAudioUrl(s3Assets.लोगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लोगAudio),
      },
    ],
  },
  {
    letter: "घ",
    items: [
      {
        id: 26,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "घर",
        image: getAssetUrl(s3Assets.घरImg),
        audio: getAssetAudioUrl(s3Assets.घरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घरAudio),
      },
      {
        id: 27,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "घुँघरू",
        image: getAssetUrl(s3Assets.घुँघरूImg),
        audio: getAssetAudioUrl(s3Assets.घुँघरूAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घुँघरूAudio),
      },
      {
        id: 28,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "बाघ",
        image: getAssetUrl(s3Assets.बाघImg),
        audio: getAssetAudioUrl(s3Assets.बाघAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बाघAudio),
      },
    ],
  },
  {
    letter: "च",
    items: [
      {
        id: 29,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "चढ़",
        image: getAssetUrl(s3Assets.चढ़Img),
        audio: getAssetAudioUrl(s3Assets.चढ़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.चढ़Audio),
      },
      {
        id: 30,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "खिचड़ी",
        image: getAssetUrl(s3Assets.खिचड़ीImg),
        audio: getAssetAudioUrl(s3Assets.खिचड़ीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खिचड़ीAudio),
      },
      {
        id: 31,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "पाँच",
        image: getAssetUrl(s3Assets.पाँचImg),
        audio: getAssetAudioUrl(s3Assets.पाँचAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पाँचAudio),
      },
    ],
  },
  {
    letter: "छ",
    items: [
      {
        id: 32,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "छत",
        image: getAssetUrl(s3Assets.छतImg),
        audio: getAssetAudioUrl(s3Assets.छतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.छतAudio),
      },
      {
        id: 33,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछलीImg),
        audio: getAssetAudioUrl(s3Assets.मछलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मछलीAudio),
      },
      {
        id: 34,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "पूछ",
        image: getAssetUrl(s3Assets.पूछImg),
        audio: getAssetAudioUrl(s3Assets.पूछAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पूछAudio),
      },
    ],
  },
  {
    letter: "ज",
    items: [
      {
        id: 35,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "जग",
        image: getAssetUrl(s3Assets.जगImg),
        audio: getAssetAudioUrl(s3Assets.जगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जगAudio),
      },
      {
        id: 36,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "गाजर",
        image: getAssetUrl(s3Assets.गाजरImg),
        audio: getAssetAudioUrl(s3Assets.गाजरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गाजरAudio),
      },
      {
        id: 37,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "सूरज",
        image: getAssetUrl(s3Assets.सूरजImg),
        audio: getAssetAudioUrl(s3Assets.सूरजAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सूरजAudio),
      },
    ],
  },
  {
    letter: "झ",
    items: [
      {
        id: 38,
        title: "व्यंजन",
        letters: "झ",
        letter: "झ",
        word: "झण्डा",
        image: getAssetUrl(s3Assets.झण्डाImg),
        audio: getAssetAudioUrl(s3Assets.झण्डाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.झण्डाAudio),
      },
    ],
  },
  {
    letter: "ट",
    items: [
      {
        id: 39,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "टमाटर",
        image: getAssetUrl(s3Assets.टमाटरImg),
        audio: getAssetAudioUrl(s3Assets.टमाटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.टमाटरAudio),
      },
      {
        id: 40,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "मटर",
        image: getAssetUrl(s3Assets.मटरImg),
        audio: getAssetAudioUrl(s3Assets.मटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मटरAudio),
      },
      {
        id: 41,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "ऊँट",
        image: getAssetUrl(s3Assets.ऊँटImg),
        audio: getAssetAudioUrl(s3Assets.ऊँटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊँटAudio),
      },
    ],
  },
  {
    letter: "ठ",
    items: [
      {
        id: 42,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "ठठेरा",
        image: getAssetUrl(s3Assets.ठठेराImg),
        audio: getAssetAudioUrl(s3Assets.ठठेराAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ठठेराAudio),
      },
      {
        id: 43,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "गुठली",
        image: getAssetUrl(s3Assets.गुठलीImg),
        audio: getAssetAudioUrl(s3Assets.गुठलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गुठलीAudio),
      },
      {
        id: 44,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "आठ",
        image: getAssetUrl(s3Assets.आठImg),
        audio: getAssetAudioUrl(s3Assets.आठAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आठAudio),
      },
    ],
  },
  {
    letter: "ड",
    items: [
      {
        id: 45,
        title: "व्यंजन",
        letters: "ड",
        letter: "ड",
        word: "डमरू",
        image: getAssetUrl(s3Assets.डमरूImg),
        audio: getAssetAudioUrl(s3Assets.डमरूAudio),
        singleAudio: getAssetAudioUrl(s3Assets.डमरूAudio),
      },
      {
        id: 46,
        title: "व्यंजन",
        letters: "ड",
        letter: "ड",
        word: "पेड़",
        image: getAssetUrl(s3Assets.पेड़Img),
        audio: getAssetAudioUrl(s3Assets.पेड़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.पेड़Audio),
      },
    ],
  },
  {
    letter: "ढ",
    items: [
      {
        id: 47,
        title: "व्यंजन",
        letters: "ढ",
        letter: "ढ",
        word: "ढक्कन",
        image: getAssetUrl(s3Assets.ढक्कनImg),
        audio: getAssetAudioUrl(s3Assets.ढक्कनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ढक्कनAudio),
      },
      {
        id: 48,
        title: "व्यंजन",
        letters: "ढ",
        letter: "ढ",
        word: "मेंढक",
        image: getAssetUrl(s3Assets.मेंढकImg),
        audio: getAssetAudioUrl(s3Assets.मेंढकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मेंढकAudio),
      },
    ],
  },
  {
    letter: "ण",
    items: [
      {
        id: 49,
        title: "व्यंजन",
        letters: "ण",
        letter: "ण",
        word: "लवण",
        image: getAssetUrl(s3Assets.लवणImg),
        audio: getAssetAudioUrl(s3Assets.लवणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लवणAudio),
      },
    ],
  },
  {
    letter: "त",
    items: [
      {
        id: 50,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "तट",
        image: getAssetUrl(s3Assets.तटImg),
        audio: getAssetAudioUrl(s3Assets.तटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.तटAudio),
      },
      {
        id: 51,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "सुतली",
        image: getAssetUrl(s3Assets.सुतलीImg),
        audio: getAssetAudioUrl(s3Assets.सुतलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सुतलीAudio),
      },
      {
        id: 52,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "रात",
        image: getAssetUrl(s3Assets.रातImg),
        audio: getAssetAudioUrl(s3Assets.रातAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रातAudio),
      },
    ],
  },
  {
    letter: "थ",
    items: [
      {
        id: 53,
        title: "व्यंजन",
        letters: "थ",
        letter: "थ",
        word: "थक",
        image: getAssetUrl(s3Assets.थकImg),
        audio: getAssetAudioUrl(s3Assets.थकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.थकAudio),
      },
      {
        id: 54,
        title: "व्यंजन",
        letters: "थ",
        letter: "थ",
        word: "हाथ",
        image: getAssetUrl(s3Assets.हाथImg),
        audio: getAssetAudioUrl(s3Assets.हाथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हाथAudio),
      },
    ],
  },
  {
    letter: "द",
    items: [
      {
        id: 55,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "दरवाजा",
        image: getAssetUrl(s3Assets.दरवाजाImg),
        audio: getAssetAudioUrl(s3Assets.दरवाजाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दरवाजाAudio),
      },
      {
        id: 56,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "बादल",
        image: getAssetUrl(s3Assets.बादलImg),
        audio: getAssetAudioUrl(s3Assets.बादलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बादलAudio),
      },
      {
        id: 57,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "आनंद",
        image: getAssetUrl(s3Assets.आनंदImg),
        audio: getAssetAudioUrl(s3Assets.आनंदAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आनंदAudio),
      },
    ],
  },
  {
    letter: "ध",
    items: [
      {
        id: 58,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनुषImg),
        audio: getAssetAudioUrl(s3Assets.धनुषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.धनुषAudio),
      },
      {
        id: 59,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "इधर",
        image: getAssetUrl(s3Assets.इधरImg),
        audio: getAssetAudioUrl(s3Assets.इधरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इधरAudio),
      },
      {
        id: 60,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "दूध",
        image: getAssetUrl(s3Assets.दूधImg),
        audio: getAssetAudioUrl(s3Assets.दूधAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दूधAudio),
      },
    ],
  },
  {
    letter: "न",
    items: [
      {
        id: 61,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "नल",
        image: getAssetUrl(s3Assets.नलImg),
        audio: getAssetAudioUrl(s3Assets.नलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नलAudio),
      },
      {
        id: 62,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "जानवर",
        image: getAssetUrl(s3Assets.जानवरImg),
        audio: getAssetAudioUrl(s3Assets.जानवरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जानवरAudio),
      },
      {
        id: 63,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "बहन",
        image: getAssetUrl(s3Assets.बहनImg),
        audio: getAssetAudioUrl(s3Assets.बहनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बहनAudio),
      },
    ],
  },
  {
    letter: "प",
    items: [
      {
        id: 64,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "पतंग",
        image: getAssetUrl(s3Assets.पतंगImg),
        audio: getAssetAudioUrl(s3Assets.पतंगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पतंगAudio),
      },
      {
        id: 65,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "कपड़े",
        image: getAssetUrl(s3Assets.कपड़ेImg),
        audio: getAssetAudioUrl(s3Assets.कपड़ेAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कपड़ेAudio),
      },
      {
        id: 66,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "साँप",
        image: getAssetUrl(s3Assets.साँपImg),
        audio: getAssetAudioUrl(s3Assets.साँपAudio),
        singleAudio: getAssetAudioUrl(s3Assets.साँपAudio),
      },
    ],
  },
  {
    letter: "फ",
    items: [
      {
        id: 67,
        title: "व्यंजन",
        letters: "फ",
        letter: "फ",
        word: "फल",
        image: getAssetUrl(s3Assets.फलImg),
        audio: getAssetAudioUrl(s3Assets.फलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.फलAudio),
      },
      {
        id: 68,
        title: "व्यंजन",
        letters: "फ",
        letter: "फ",
        word: "बर्फ",
        image: getAssetUrl(s3Assets.बर्फImg),
        audio: getAssetAudioUrl(s3Assets.बर्फAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बर्फAudio),
      },
    ],
  },
  {
    letter: "ब",
    items: [
      {
        id: 69,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "बतख",
        image: getAssetUrl(s3Assets.बतखImg),
        audio: getAssetAudioUrl(s3Assets.बतखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बतखAudio),
      },
      {
        id: 70,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "सुबह",
        image: getAssetUrl(s3Assets.सुबहImg),
        audio: getAssetAudioUrl(s3Assets.सुबहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सुबहAudio),
      },
      {
        id: 71,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "सेब",
        image: getAssetUrl(s3Assets.सेबImg),
        audio: getAssetAudioUrl(s3Assets.सेबAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सेबAudio),
      },
    ],
  },
  {
    letter: "भ",
    items: [
      {
        id: 72,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "भय",
        image: getAssetUrl(s3Assets.भयImg),
        audio: getAssetAudioUrl(s3Assets.भयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भयAudio),
      },
      {
        id: 73,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "अनुभव",
        image: getAssetUrl(s3Assets.अनुभवImg),
        audio: getAssetAudioUrl(s3Assets.अनुभवAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अनुभवAudio),
      },
      {
        id: 74,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "नभ",
        image: getAssetUrl(s3Assets.नभImg),
        audio: getAssetAudioUrl(s3Assets.नभAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नभAudio),
      },
    ],
  },
  {
    letter: "म",
    items: [
      {
        id: 75,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछलीImg),
        audio: getAssetAudioUrl(s3Assets.मछलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मछलीAudio),
      },
      {
        id: 76,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "गमला",
        image: getAssetUrl(s3Assets.गमलाImg),
        audio: getAssetAudioUrl(s3Assets.गमलाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गमलाAudio),
      },
      {
        id: 77,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "कदम",
        image: getAssetUrl(s3Assets.कदमImg),
        audio: getAssetAudioUrl(s3Assets.कदमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कदमAudio),
      },
    ],
  },
  {
    letter: "य",
    items: [
      {
        id: 78,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "यह",
        image: getAssetUrl(s3Assets.यहImg),
        audio: getAssetAudioUrl(s3Assets.यहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.यहAudio),
      },
      {
        id: 79,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "पायल",
        image: getAssetUrl(s3Assets.पायलImg),
        audio: getAssetAudioUrl(s3Assets.पायलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पायलAudio),
      },
      {
        id: 80,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "गाय",
        image: getAssetUrl(s3Assets.गायImg),
        audio: getAssetAudioUrl(s3Assets.गायAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गायAudio),
      },
    ],
  },
  {
    letter: "र",
    items: [
      {
        id: 81,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "रथ",
        image: getAssetUrl(s3Assets.रथImg),
        audio: getAssetAudioUrl(s3Assets.रथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रथAudio),
      },
      {
        id: 82,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "भारत",
        image: getAssetUrl(s3Assets.भारतImg),
        audio: getAssetAudioUrl(s3Assets.भारतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भारतAudio),
      },
      {
        id: 83,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "चार",
        image: getAssetUrl(s3Assets.चारImg),
        audio: getAssetAudioUrl(s3Assets.चारAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चारAudio),
      },
    ],
  },
  {
    letter: "ल",
    items: [
      {
        id: 84,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "लड़का",
        image: getAssetUrl(s3Assets.लड़काImg),
        audio: getAssetAudioUrl(s3Assets.लड़काAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लड़काAudio),
      },
      {
        id: 85,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "चलना",
        image: getAssetUrl(s3Assets.चलनाImg),
        audio: getAssetAudioUrl(s3Assets.चलनाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चलनाAudio),
      },
      {
        id: 86,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "बाल",
        image: getAssetUrl(s3Assets.बालImg),
        audio: getAssetAudioUrl(s3Assets.बालAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बालAudio),
      },
    ],
  },
  {
    letter: "व",
    items: [
      {
        id: 87,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "वन",
        image: getAssetUrl(s3Assets.वनImg),
        audio: getAssetAudioUrl(s3Assets.वनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.वनAudio),
      },
      {
        id: 88,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "चावल",
        image: getAssetUrl(s3Assets.चावलImg),
        audio: getAssetAudioUrl(s3Assets.चावलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चावलAudio),
      },
      {
        id: 89,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "नाव",
        image: getAssetUrl(s3Assets.नावImg),
        audio: getAssetAudioUrl(s3Assets.नावAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नावAudio),
      },
    ],
  },
  {
    letter: "श",
    items: [
      {
        id: 90,
        title: "व्यंजन",
        letters: "श",
        letter: "श",
        word: "शहर",
        image: getAssetUrl(s3Assets.शहरImg),
        audio: getAssetAudioUrl(s3Assets.शहरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.शहरAudio),
      },
      {
        id: 91,
        title: "व्यंजन",
        letters: "श",
        letter: "श",
        word: "बारिश",
        image: getAssetUrl(s3Assets.बारिशImg),
        audio: getAssetAudioUrl(s3Assets.बारिशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बारिशAudio),
      },
    ],
  },
  {
    letter: "ष",
    items: [
      {
        id: 92,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "षट्कोण",
        image: getAssetUrl(s3Assets.षट्‌कोणImg),
        audio: getAssetAudioUrl(s3Assets.षट्‌कोणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.षट्‌कोणAudio),
      },
      {
        id: 93,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "विषय",
        image: getAssetUrl(s3Assets.विषयImg),
        audio: getAssetAudioUrl(s3Assets.विषयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.विषयAudio),
      },
      {
        id: 94,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनुषImg),
        audio: getAssetAudioUrl(s3Assets.धनुषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.धनुषAudio),
      },
    ],
  },
  {
    letter: "स",
    items: [
      {
        id: 95,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "समय",
        image: getAssetUrl(s3Assets.समयImg),
        audio: getAssetAudioUrl(s3Assets.समयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.समयAudio),
      },
      {
        id: 96,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "आसमान",
        image: getAssetUrl(s3Assets.आसमानImg),
        audio: getAssetAudioUrl(s3Assets.आसमानAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आसमानAudio),
      },
      {
        id: 97,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "घास",
        image: getAssetUrl(s3Assets.घासImg),
        audio: getAssetAudioUrl(s3Assets.घासAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घासAudio),
      },
    ],
  },
  {
    letter: "ह",
    items: [
      {
        id: 98,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "हाथी",
        image: getAssetUrl(s3Assets.हाथीImg),
        audio: getAssetAudioUrl(s3Assets.हाथीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हाथीAudio),
      },
      {
        id: 99,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "बाहर",
        image: getAssetUrl(s3Assets.बाहरImg),
        audio: getAssetAudioUrl(s3Assets.बाहरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बाहरAudio),
      },
      {
        id: 100,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "मुँह",
        image: getAssetUrl(s3Assets.मुँहImg),
        audio: getAssetAudioUrl(s3Assets.मुँहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मुँहAudio),
      },
    ],
  },
  {
    letter: "क्ष",
    items: [
      {
        id: 101,
        title: "व्यंजन",
        letters: "क्ष",
        letter: "क्ष",
        word: "क्षत्रिय",
        image: getAssetUrl(s3Assets.क्षत्रियImg),
        audio: getAssetAudioUrl(s3Assets.क्षत्रियAudio),
        singleAudio: getAssetAudioUrl(s3Assets.क्षत्रियAudio),
      },
      {
        id: 102,
        title: "व्यंजन",
        letters: "क्ष",
        letter: "क्ष",
        word: "अक्षर",
        image: getAssetUrl(s3Assets.अक्षरImg),
        audio: getAssetAudioUrl(s3Assets.अक्षरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अक्षरAudio),
      },
    ],
  },
  {
    letter: "त्र",
    items: [
      {
        id: 103,
        title: "व्यंजन",
        letters: "त्र",
        letter: "त्र",
        word: "त्रिशूल",
        image: getAssetUrl(s3Assets.त्रिशूलImg),
        audio: getAssetAudioUrl(s3Assets.त्रिशूलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.त्रिशूलAudio),
      },
      {
        id: 104,
        title: "व्यंजन",
        letters: "त्र",
        letter: "त्र",
        word: "चित्र",
        image: getAssetUrl(s3Assets.चित्रImg),
        audio: getAssetAudioUrl(s3Assets.चित्रAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चित्रAudio),
      },
    ],
  },
  {
    letter: "ज्ञ",
    items: [
      {
        id: 105,
        title: "व्यंजन",
        letters: "ज्ञ",
        letter: "ज्ञ",
        word: "ज्ञानी",
        image: getAssetUrl(s3Assets.ज्ञानीImg),
        audio: getAssetAudioUrl(s3Assets.ज्ञानीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ज्ञानीAudio),
      },
    ],
  },
];

const dataTe = [
  {
    letter: "అ",
    items: [
      {
        id: 1,
        title: "అచ్చులు",
        letters: "అ",
        letter: "అ",
        word: "అల",
        image: getAssetUrl(s3Assets.అలImg),
        audio: getAssetAudioUrl(s3Assets.అలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అలSingleAudio),
      },
    ],
  },
  {
    letter: "ఆ",
    items: [
      {
        id: 2,
        title: "అచ్చులు",
        letters: "ఆ",
        letter: "ఆ",
        word: "ఆట",
        image: getAssetUrl(s3Assets.ఆటImg),
        audio: getAssetAudioUrl(s3Assets.ఆటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆటSingleAudio),
      },
    ],
  },
  {
    letter: "ఇ",
    items: [
      {
        id: 3,
        title: "అచ్చులు",
        letters: "ఇ",
        letter: "ఇ",
        word: "ఇల",
        image: getAssetUrl(s3Assets.ఇలImg),
        audio: getAssetAudioUrl(s3Assets.ఇలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఇలSingleAudio),
      },
    ],
  },
  {
    letter: "ఈ",
    items: [
      {
        id: 4,
        title: "అచ్చులు",
        letters: "ఈ",
        letter: "ఈ",
        word: "ఈగ",
        image: getAssetUrl(s3Assets.ఈగImg),
        audio: getAssetAudioUrl(s3Assets.ఈగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈగSingleAudio),
      },
    ],
  },
  {
    letter: "ఉ",
    items: [
      {
        id: 5,
        title: "అచ్చులు",
        letters: "ఉ",
        letter: "ఉ",
        word: "ఉడుత",
        image: getAssetUrl(s3Assets.ఉడుతImg),
        audio: getAssetAudioUrl(s3Assets.ఉడుతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉడుతSingleAudio),
      },
    ],
  },
  {
    letter: "ఊ",
    items: [
      {
        id: 6,
        title: "అచ్చులు",
        letters: "ఊ",
        letter: "ఊ",
        word: "ఊయల",
        image: getAssetUrl(s3Assets.ఊయలImg),
        audio: getAssetAudioUrl(s3Assets.ఊయలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఊయలSingleAudio),
      },
    ],
  },
  {
    letter: "ఋ",
    items: [
      {
        id: 7,
        title: "అచ్చులు",
        letters: "ఋ",
        letter: "ఋ",
        word: "ఋషి",
        image: getAssetUrl(s3Assets.ఋషిImg),
        audio: getAssetAudioUrl(s3Assets.ఋషిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఋషిSingleAudio),
      },
    ],
  },
  {
    letter: "ౠ",
    items: [
      {
        id: 8,
        title: "అచ్చులు",
        letters: "ౠ",
        letter: "ౠ",
        word: "ౠక",
        image: getAssetUrl(s3Assets.ౠకImg),
        audio: getAssetAudioUrl(s3Assets.ౠకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ౠకSingleAudio),
      },
    ],
  },
  {
    letter: "ఎ",
    items: [
      {
        id: 9,
        title: "అచ్చులు",
        letters: "ఎ",
        letter: "ఎ",
        word: "ఎలుక",
        image: getAssetUrl(s3Assets.ఎలుకImg),
        audio: getAssetAudioUrl(s3Assets.ఎలుకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఎలుకSingleAudio),
      },
    ],
  },
  {
    letter: "ఏ",
    items: [
      {
        id: 10,
        title: "అచ్చులు",
        letters: "ఏ",
        letter: "ఏ",
        word: "ఏనుగు",
        image: getAssetUrl(s3Assets.ఏనుగుImg),
        audio: getAssetAudioUrl(s3Assets.ఏనుగుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఏనుగుSingleAudio),
      },
    ],
  },
  {
    letter: "ఐ",
    items: [
      {
        id: 11,
        title: "అచ్చులు",
        letters: "ఐ",
        letter: "ఐ",
        word: "ఐదు",
        image: getAssetUrl(s3Assets.ఐదుImg),
        audio: getAssetAudioUrl(s3Assets.ఐదుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఐదుSingleAudio),
      },
    ],
  },
  {
    letter: "ఒ",
    items: [
      {
        id: 12,
        title: "అచ్చులు",
        letters: "ఒ",
        letter: "ఒ",
        word: "ఒక",
        image: getAssetUrl(s3Assets.ఒకImg),
        audio: getAssetAudioUrl(s3Assets.ఒకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఒకSingleAudio),
      },
    ],
  },
  {
    letter: "ఓ",
    items: [
      {
        id: 13,
        title: "అచ్చులు",
        letters: "ఓ",
        letter: "ఓ",
        word: "ఓడ",
        image: getAssetUrl(s3Assets.ఓడImg),
        audio: getAssetAudioUrl(s3Assets.ఓడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఓడSingleAudio),
      },
    ],
  },
  {
    letter: "ఔ",
    items: [
      {
        id: 14,
        title: "అచ్చులు",
        letters: "ఔ",
        letter: "ఔ",
        word: "ఔషధం",
        image: getAssetUrl(s3Assets.ఔషధంImg),
        audio: getAssetAudioUrl(s3Assets.ఔషధంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఔషధంSingleAudio),
      },
    ],
  },
  {
    letter: "అం",
    items: [
      {
        id: 15,
        title: "అచ్చులు",
        letters: "అం",
        letter: "అం",
        word: "అంగడి",
        image: getAssetUrl(s3Assets.అంగడిImg),
        audio: getAssetAudioUrl(s3Assets.అంగడిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అంగడిSingleAudio),
      },
    ],
  },
  {
    letter: "అః",
    items: [
      {
        id: 16,
        title: "అచ్చులు",
        letters: "అః",
        letter: "అః",
        word: "అః",
        image: getAssetUrl(s3Assets.అఃImg),
        audio: getAssetAudioUrl(s3Assets.అఃAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అఃSingleAudio),
      },
    ],
  },
  {
    letter: "క",
    items: [
      {
        id: 17,
        title: "హల్లులు",
        letters: "క",
        letter: "క",
        word: "కల",
        image: getAssetUrl(s3Assets.కలImg),
        audio: getAssetAudioUrl(s3Assets.కలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కలSingleAudio),
      },
      {
        id: 18,
        title: "హల్లులు",
        letters: "క",
        letter: "క",
        word: "ఆకలి",
        image: getAssetUrl(s3Assets.ఆకలిImg),
        audio: getAssetAudioUrl(s3Assets.ఆకలిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆకలిSingleAudio),
      },
      {
        id: 19,
        title: "హల్లులు",
        letters: "క",
        letter: "క",
        word: "చిలుక",
        image: getAssetUrl(s3Assets.చిలుకImg),
        audio: getAssetAudioUrl(s3Assets.చిలుకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చిలుకSingleAudio),
      },
    ],
  },
  {
    letter: "ఖ",
    items: [
      {
        id: 20,
        title: "హల్లులు",
        letters: "ఖ",
        letter: "ఖ",
        word: "ఖరం",
        image: getAssetUrl(s3Assets.ఖరంImg),
        audio: getAssetAudioUrl(s3Assets.ఖరంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఖరంSingleAudio),
      },
    ],
  },
  {
    letter: "గ",
    items: [
      {
        id: 21,
        title: "హల్లులు",
        letters: "గ",
        letter: "గ",
        word: "గద",
        image: getAssetUrl(s3Assets.గదImg),
        audio: getAssetAudioUrl(s3Assets.గదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గదSingleAudio),
      },
      {
        id: 22,
        title: "హల్లులు",
        letters: "గ",
        letter: "గ",
        word: "ఉంగరం",
        image: getAssetUrl(s3Assets.ఉంగరంImg),
        audio: getAssetAudioUrl(s3Assets.ఉంగరంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉంగరంSingleAudio),
      },
      {
        id: 23,
        title: "హల్లులు",
        letters: "గ",
        letter: "గ",
        word: "పండుగ",
        image: getAssetUrl(s3Assets.పండుగImg),
        audio: getAssetAudioUrl(s3Assets.పండుగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పండుగSingleAudio),
      },
    ],
  },
  {
    letter: "ఘ",
    items: [
      {
        id: 24,
        title: "హల్లులు",
        letters: "ఘ",
        letter: "ఘ",
        word: "ఘటం",
        image: getAssetUrl(s3Assets.ఘటంImg),
        audio: getAssetAudioUrl(s3Assets.ఘటంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఘటంSingleAudio),
      },
      {
        id: 25,
        title: "హల్లులు",
        letters: "ఘ",
        letter: "ఘ",
        word: "మేఘం",
        image: getAssetUrl(s3Assets.మేఘంImg),
        audio: getAssetAudioUrl(s3Assets.మేఘంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మేఘంSingleAudio),
      },
    ],
  },
  {
    letter: "ఙ",
    items: [
      {
        id: 26,
        title: "హల్లులు",
        letters: "ఙ",
        letter: "ఙ",
        word: "ఙ",
        image: getAssetUrl(s3Assets.ఙImg),
        audio: getAssetAudioUrl(s3Assets.ఙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఙSingleAudio),
      },
    ],
  },
  {
    letter: "చ",
    items: [
      {
        id: 27,
        title: "హల్లులు",
        letters: "చ",
        letter: "చ",
        word: "చరకా",
        image: getAssetUrl(s3Assets.చరకాImg),
        audio: getAssetAudioUrl(s3Assets.చరకాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చరకాSingleAudio),
      },
      {
        id: 28,
        title: "హల్లులు",
        letters: "చ",
        letter: "చ",
        word: "రచన",
        image: getAssetUrl(s3Assets.రచనImg),
        audio: getAssetAudioUrl(s3Assets.రచనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రచనSingleAudio),
      },
      {
        id: 29,
        title: "హల్లులు",
        letters: "చ",
        letter: "చ",
        word: "కిచకిచ",
        image: getAssetUrl(s3Assets.కిచకిచImg),
        audio: getAssetAudioUrl(s3Assets.కిచకిచAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కిచకిచSingleAudio),
      },
    ],
  },
  {
    letter: "ఛ",
    items: [
      {
        id: 30,
        title: "హల్లులు",
        letters: "ఛ",
        letter: "ఛ",
        word: "ఛత్రము",
        image: getAssetUrl(s3Assets.ఛత్రముImg),
        audio: getAssetAudioUrl(s3Assets.ఛత్రముAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఛత్రముSingleAudio),
      },
    ],
  },
  {
    letter: "జ",
    items: [
      {
        id: 31,
        title: "హల్లులు",
        letters: "జ",
        letter: "జ",
        word: "జడ",
        image: getAssetUrl(s3Assets.జడImg),
        audio: getAssetAudioUrl(s3Assets.జడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జడSingleAudio),
      },
      {
        id: 32,
        title: "హల్లులు",
        letters: "జ",
        letter: "జ",
        word: "కంజర",
        image: getAssetUrl(s3Assets.కంజరImg),
        audio: getAssetAudioUrl(s3Assets.కంజరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కంజరSingleAudio),
      },
      {
        id: 33,
        title: "హల్లులు",
        letters: "జ",
        letter: "జ",
        word: "జలజ",
        image: getAssetUrl(s3Assets.జలజImg),
        audio: getAssetAudioUrl(s3Assets.జలజAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జలజSingleAudio),
      },
    ],
  },
  {
    letter: "ఝ",
    items: [
      {
        id: 34,
        title: "హల్లులు",
        letters: "ఝ",
        letter: "ఝ",
        word: "ఝషం",
        image: getAssetUrl(s3Assets.ఝషంImg),
        audio: getAssetAudioUrl(s3Assets.ఝషంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఝషంSingleAudio),
      },
    ],
  },
  {
    letter: "ఞ",
    items: [
      {
        id: 35,
        title: "హల్లులు",
        letters: "ఞ",
        letter: "ఞ",
        word: "ఞ",
        image: getAssetUrl(s3Assets.ఞImg),
        audio: getAssetAudioUrl(s3Assets.ఞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఞSingleAudio),
      },
    ],
  },
  {
    letter: "ట",
    items: [
      {
        id: 36,
        title: "హల్లులు",
        letters: "ట",
        letter: "ట",
        word: "టమాట",
        image: getAssetUrl(s3Assets.టమాటImg),
        audio: getAssetAudioUrl(s3Assets.టమాటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.టమాటSingleAudio),
      },
      {
        id: 37,
        title: "హల్లులు",
        letters: "ట",
        letter: "ట",
        word: "నాటకం",
        image: getAssetUrl(s3Assets.నాటకంImg),
        audio: getAssetAudioUrl(s3Assets.నాటకంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నాటకంSingleAudio),
      },
      {
        id: 38,
        title: "హల్లులు",
        letters: "ట",
        letter: "ట",
        word: "తోట",
        image: getAssetUrl(s3Assets.తోటImg),
        audio: getAssetAudioUrl(s3Assets.తోటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తోటSingleAudio),
      },
    ],
  },
  {
    letter: "ఠ",
    items: [
      {
        id: 39,
        title: "హల్లులు",
        letters: "ఠ",
        letter: "ఠ",
        word: "పాఠశాల",
        image: getAssetUrl(s3Assets.పాఠశాలImg),
        audio: getAssetAudioUrl(s3Assets.పాఠశాలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పాఠశాలSingleAudio),
      },
      {
        id: 40,
        title: "హల్లులు",
        letters: "ఠ",
        letter: "ఠ",
        word: "పాఠం",
        image: getAssetUrl(s3Assets.పాఠంImg),
        audio: getAssetAudioUrl(s3Assets.పాఠంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పాఠంSingleAudio),
      },
    ],
  },
  {
    letter: "డ",
    items: [
      {
        id: 41,
        title: "హల్లులు",
        letters: "డ",
        letter: "డ",
        word: "డబ్బా",
        image: getAssetUrl(s3Assets.డబ్బాImg),
        audio: getAssetAudioUrl(s3Assets.డబ్బాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.డబ్బాSingleAudio),
      },
      {
        id: 42,
        title: "హల్లులు",
        letters: "డ",
        letter: "డ",
        word: "అడవి",
        image: getAssetUrl(s3Assets.అడవిImg),
        audio: getAssetAudioUrl(s3Assets.అడవిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అడవిSingleAudio),
      },
      {
        id: 43,
        title: "హల్లులు",
        letters: "డ",
        letter: "డ",
        word: "బండ",
        image: getAssetUrl(s3Assets.బండImg),
        audio: getAssetAudioUrl(s3Assets.బండAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బండSingleAudio),
      },
    ],
  },
  {
    letter: "ఢ",
    items: [
      {
        id: 44,
        title: "హల్లులు",
        letters: "ఢ",
        letter: "ఢ",
        word: "ఢమఢమ",
        image: getAssetUrl(s3Assets.ఢమఢమImg),
        audio: getAssetAudioUrl(s3Assets.ఢమఢమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఢమఢమSingleAudio),
      },
    ],
  },
  {
    letter: "ణ",
    items: [
      {
        id: 45,
        title: "హల్లులు",
        letters: "ణ",
        letter: "ణ",
        word: "గణపతి",
        image: getAssetUrl(s3Assets.గణపతిImg),
        audio: getAssetAudioUrl(s3Assets.గణపతిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గణపతిSingleAudio),
      },
      {
        id: 46,
        title: "హల్లులు",
        letters: "ణ",
        letter: "ణ",
        word: "వీణ",
        image: getAssetUrl(s3Assets.వీణImg),
        audio: getAssetAudioUrl(s3Assets.వీణAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వీణSingleAudio),
      },
    ],
  },
  {
    letter: "త",
    items: [
      {
        id: 47,
        title: "హల్లులు",
        letters: "త",
        letter: "త",
        word: "తల",
        image: getAssetUrl(s3Assets.తలImg),
        audio: getAssetAudioUrl(s3Assets.తలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తలSingleAudio),
      },
      {
        id: 48,
        title: "హల్లులు",
        letters: "త",
        letter: "త",
        word: "జాతర",
        image: getAssetUrl(s3Assets.జాతరImg),
        audio: getAssetAudioUrl(s3Assets.జాతరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జాతరSingleAudio),
      },
      {
        id: 49,
        title: "హల్లులు",
        letters: "త",
        letter: "త",
        word: "ఈత",
        image: getAssetUrl(s3Assets.ఈతImg),
        audio: getAssetAudioUrl(s3Assets.ఈతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈతSingleAudio),
      },
    ],
  },
  {
    letter: "థ",
    items: [
      {
        id: 50,
        title: "హల్లులు",
        letters: "థ",
        letter: "థ",
        word: "థర్మోస్",
        image: getAssetUrl(s3Assets.థర్మోస్Img),
        audio: getAssetAudioUrl(s3Assets.థర్మోస్Audio),
        singleAudio: getAssetAudioUrl(s3Assets.థర్మోస్SingleAudio),
      },
      {
        id: 51,
        title: "హల్లులు",
        letters: "థ",
        letter: "థ",
        word: "రథము",
        image: getAssetUrl(s3Assets.రథముImg),
        audio: getAssetAudioUrl(s3Assets.రథముAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రథముSingleAudio),
      },
      {
        id: 52,
        title: "హల్లులు",
        letters: "థ",
        letter: "థ",
        word: "కథ",
        image: getAssetUrl(s3Assets.కథImg),
        audio: getAssetAudioUrl(s3Assets.కథAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కథSingleAudio),
      },
    ],
  },
  {
    letter: "ద",
    items: [
      {
        id: 53,
        title: "హల్లులు",
        letters: "ద",
        letter: "ద",
        word: "దవడ",
        image: getAssetUrl(s3Assets.దవడImg),
        audio: getAssetAudioUrl(s3Assets.దవడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దవడSingleAudio),
      },
      {
        id: 54,
        title: "హల్లులు",
        letters: "ద",
        letter: "ద",
        word: "ఉదయం",
        image: getAssetUrl(s3Assets.ఉదయంImg),
        audio: getAssetAudioUrl(s3Assets.ఉదయంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉదయంSingleAudio),
      },
      {
        id: 55,
        title: "హల్లులు",
        letters: "ద",
        letter: "ద",
        word: "కింద",
        image: getAssetUrl(s3Assets.కిందImg),
        audio: getAssetAudioUrl(s3Assets.కిందAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కిందSingleAudio),
      },
    ],
  },
  {
    letter: "ధ",
    items: [
      {
        id: 56,
        title: "హల్లులు",
        letters: "ధ",
        letter: "ధ",
        word: "ధనం",
        image: getAssetUrl(s3Assets.ధనంImg),
        audio: getAssetAudioUrl(s3Assets.ధనంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ధనంSingleAudio),
      },
      {
        id: 57,
        title: "హల్లులు",
        letters: "ధ",
        letter: "ధ",
        word: "బాధ",
        image: getAssetUrl(s3Assets.బాధImg),
        audio: getAssetAudioUrl(s3Assets.బాధAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బాధSingleAudio),
      },
    ],
  },
  {
    letter: "న",
    items: [
      {
        id: 58,
        title: "హల్లులు",
        letters: "న",
        letter: "న",
        word: "నగ",
        image: getAssetUrl(s3Assets.నగImg),
        audio: getAssetAudioUrl(s3Assets.నగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నగSingleAudio),
      },
      {
        id: 59,
        title: "హల్లులు",
        letters: "న",
        letter: "న",
        word: "అనప",
        image: getAssetUrl(s3Assets.అనపImg),
        audio: getAssetAudioUrl(s3Assets.అనపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అనపSingleAudio),
      },
      {
        id: 60,
        title: "హల్లులు",
        letters: "న",
        letter: "న",
        word: "వాన",
        image: getAssetUrl(s3Assets.వానImg),
        audio: getAssetAudioUrl(s3Assets.వానAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వానSingleAudio),
      },
    ],
  },
  {
    letter: "ప",
    items: [
      {
        id: 61,
        title: "హల్లులు",
        letters: "ప",
        letter: "ప",
        word: "పలక",
        image: getAssetUrl(s3Assets.పలకImg),
        audio: getAssetAudioUrl(s3Assets.పలకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పలకSingleAudio),
      },
      {
        id: 62,
        title: "హల్లులు",
        letters: "ప",
        letter: "ప",
        word: "చేపలు",
        image: getAssetUrl(s3Assets.చేపలుImg),
        audio: getAssetAudioUrl(s3Assets.చేపలుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చేపలుSingleAudio),
      },
      {
        id: 63,
        title: "హల్లులు",
        letters: "ప",
        letter: "ప",
        word: "పాప",
        image: getAssetUrl(s3Assets.పాపImg),
        audio: getAssetAudioUrl(s3Assets.పాపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పాపSingleAudio),
      },
    ],
  },
  {
    letter: "ఫ",
    items: [
      {
        id: 64,
        title: "హల్లులు",
        letters: "ఫ",
        letter: "ఫ",
        word: "ఫలము",
        image: getAssetUrl(s3Assets.ఫలముImg),
        audio: getAssetAudioUrl(s3Assets.ఫలముAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఫలముSingleAudio),
      },
    ],
  },
  {
    letter: "బ",
    items: [
      {
        id: 65,
        title: "హల్లులు",
        letters: "బ",
        letter: "బ",
        word: "బంతి",
        image: getAssetUrl(s3Assets.బంతిImg),
        audio: getAssetAudioUrl(s3Assets.బంతిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బంతిSingleAudio),
      },
      {
        id: 66,
        title: "హల్లులు",
        letters: "బ",
        letter: "బ",
        word: "తబల",
        image: getAssetUrl(s3Assets.తబలImg),
        audio: getAssetAudioUrl(s3Assets.తబలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తబలSingleAudio),
      },
    ],
  },
  {
    letter: "భ",
    items: [
      {
        id: 67,
        title: "హల్లులు",
        letters: "భ",
        letter: "భ",
        word: "భవనం",
        image: getAssetUrl(s3Assets.భవనంImg),
        audio: getAssetAudioUrl(s3Assets.భవనంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.భవనంSingleAudio),
      },
      {
        id: 68,
        title: "హల్లులు",
        letters: "భ",
        letter: "భ",
        word: "సభ",
        image: getAssetUrl(s3Assets.సభImg),
        audio: getAssetAudioUrl(s3Assets.సభAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సభSingleAudio),
      },
    ],
  },
  {
    letter: "మ",
    items: [
      {
        id: 69,
        title: "హల్లులు",
        letters: "మ",
        letter: "మ",
        word: "మర",
        image: getAssetUrl(s3Assets.మరImg),
        audio: getAssetAudioUrl(s3Assets.మరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మరSingleAudio),
      },
      {
        id: 70,
        title: "హల్లులు",
        letters: "మ",
        letter: "మ",
        word: "నెమలి",
        image: getAssetUrl(s3Assets.నెమలిImg),
        audio: getAssetAudioUrl(s3Assets.నెమలిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నెమలిSingleAudio),
      },
      {
        id: 71,
        title: "హల్లులు",
        letters: "మ",
        letter: "మ",
        word: "చీమ",
        image: getAssetUrl(s3Assets.చీమImg),
        audio: getAssetAudioUrl(s3Assets.చీమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చీమSingleAudio),
      },
    ],
  },
  {
    letter: "య",
    items: [
      {
        id: 72,
        title: "హల్లులు",
        letters: "య",
        letter: "య",
        word: "యద",
        image: getAssetUrl(s3Assets.యదImg),
        audio: getAssetAudioUrl(s3Assets.యదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.యదSingleAudio),
      },
      {
        id: 73,
        title: "హల్లులు",
        letters: "య",
        letter: "య",
        word: "కాయలు",
        image: getAssetUrl(s3Assets.కాయలుImg),
        audio: getAssetAudioUrl(s3Assets.కాయలుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కాయలుSingleAudio),
      },
      {
        id: 74,
        title: "హల్లులు",
        letters: "య",
        letter: "య",
        word: "వంకాయ",
        image: getAssetUrl(s3Assets.వంకాయImg),
        audio: getAssetAudioUrl(s3Assets.వంకాయAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వంకాయSingleAudio),
      },
    ],
  },
  {
    letter: "ర",
    items: [
      {
        id: 75,
        title: "హల్లులు",
        letters: "ర",
        letter: "ర",
        word: "రవి",
        image: getAssetUrl(s3Assets.రవిImg),
        audio: getAssetAudioUrl(s3Assets.రవిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రవిSingleAudio),
      },
      {
        id: 76,
        title: "హల్లులు",
        letters: "ర",
        letter: "ర",
        word: "గిరక",
        image: getAssetUrl(s3Assets.గిరకImg),
        audio: getAssetAudioUrl(s3Assets.గిరకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గిరకSingleAudio),
      },
      {
        id: 77,
        title: "హల్లులు",
        letters: "ర",
        letter: "ర",
        word: "చీర",
        image: getAssetUrl(s3Assets.చీరImg),
        audio: getAssetAudioUrl(s3Assets.చీరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చీరSingleAudio),
      },
    ],
  },
  {
    letter: "ల",
    items: [
      {
        id: 78,
        title: "హల్లులు",
        letters: "ల",
        letter: "ల",
        word: "లత",
        image: getAssetUrl(s3Assets.లతImg),
        audio: getAssetAudioUrl(s3Assets.లతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లతSingleAudio),
      },
      {
        id: 79,
        title: "హల్లులు",
        letters: "ల",
        letter: "ల",
        word: "బలపం",
        image: getAssetUrl(s3Assets.బలపంImg),
        audio: getAssetAudioUrl(s3Assets.బలపంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బలపంSingleAudio),
      },
      {
        id: 80,
        title: "హల్లులు",
        letters: "ల",
        letter: "ల",
        word: "వెల",
        image: getAssetUrl(s3Assets.వెలImg),
        audio: getAssetAudioUrl(s3Assets.వెలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వెలSingleAudio),
      },
    ],
  },
  {
    letter: "వ",
    items: [
      {
        id: 81,
        title: "హల్లులు",
        letters: "వ",
        letter: "వ",
        word: "వల",
        image: getAssetUrl(s3Assets.వలImg),
        audio: getAssetAudioUrl(s3Assets.వలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వలSingleAudio),
      },
      {
        id: 82,
        title: "హల్లులు",
        letters: "వ",
        letter: "వ",
        word: "లవణం",
        image: getAssetUrl(s3Assets.లవణంImg),
        audio: getAssetAudioUrl(s3Assets.లవణంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లవణంSingleAudio),
      },
      {
        id: 83,
        title: "హల్లులు",
        letters: "వ",
        letter: "వ",
        word: "పడవ",
        image: getAssetUrl(s3Assets.పడవImg),
        audio: getAssetAudioUrl(s3Assets.పడవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పడవSingleAudio),
      },
    ],
  },
  {
    letter: "శ",
    items: [
      {
        id: 84,
        title: "హల్లులు",
        letters: "శ",
        letter: "శ",
        word: "శకటం",
        image: getAssetUrl(s3Assets.శకటంImg),
        audio: getAssetAudioUrl(s3Assets.శకటంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.శకటంSingleAudio),
      },
      {
        id: 85,
        title: "హల్లులు",
        letters: "శ",
        letter: "శ",
        word: "దశమి",
        image: getAssetUrl(s3Assets.దశమిImg),
        audio: getAssetAudioUrl(s3Assets.దశమిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దశమిSingleAudio),
      },
      {
        id: 86,
        title: "హల్లులు",
        letters: "శ",
        letter: "శ",
        word: "దిశ",
        image: getAssetUrl(s3Assets.దిశImg),
        audio: getAssetAudioUrl(s3Assets.దిశAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దిశSingleAudio),
      },
    ],
  },
  {
    letter: "ష",
    items: [
      {
        id: 87,
        title: "హల్లులు",
        letters: "ష",
        letter: "ష",
        word: "షరాయి",
        image: getAssetUrl(s3Assets.షరాయిImg),
        audio: getAssetAudioUrl(s3Assets.షరాయిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.షరాయిSingleAudio),
      },
      {
        id: 88,
        title: "హల్లులు",
        letters: "ష",
        letter: "ష",
        word: "ఉష",
        image: getAssetUrl(s3Assets.ఉషImg),
        audio: getAssetAudioUrl(s3Assets.ఉషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉషSingleAudio),
      },
    ],
  },
  {
    letter: "స",
    items: [
      {
        id: 89,
        title: "హల్లులు",
        letters: "స",
        letter: "స",
        word: "సంత",
        image: getAssetUrl(s3Assets.సంతImg),
        audio: getAssetAudioUrl(s3Assets.సంతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సంతSingleAudio),
      },
      {
        id: 90,
        title: "హల్లులు",
        letters: "స",
        letter: "స",
        word: "దసరా",
        image: getAssetUrl(s3Assets.దసరాImg),
        audio: getAssetAudioUrl(s3Assets.దసరాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దసరాSingleAudio),
      },
      {
        id: 91,
        title: "హల్లులు",
        letters: "స",
        letter: "స",
        word: "పనస",
        image: getAssetUrl(s3Assets.పనసImg),
        audio: getAssetAudioUrl(s3Assets.పనసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పనసSingleAudio),
      },
    ],
  },
  {
    letter: "హ",
    items: [
      {
        id: 92,
        title: "హల్లులు",
        letters: "హ",
        letter: "హ",
        word: "హంస",
        image: getAssetUrl(s3Assets.హంసImg),
        audio: getAssetAudioUrl(s3Assets.హంసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.హంసSingleAudio),
      },
      {
        id: 93,
        title: "హల్లులు",
        letters: "హ",
        letter: "హ",
        word: "వాహనం",
        image: getAssetUrl(s3Assets.వాహనంImg),
        audio: getAssetAudioUrl(s3Assets.వాహనంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వాహనంSingleAudio),
      },
      {
        id: 94,
        title: "హల్లులు",
        letters: "హ",
        letter: "హ",
        word: "గుహ",
        image: getAssetUrl(s3Assets.గుహImg),
        audio: getAssetAudioUrl(s3Assets.గుహAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గుహSingleAudio),
      },
    ],
  },
  {
    letter: "ళ",
    items: [
      {
        id: 95,
        title: "హల్లులు",
        letters: "ళ",
        letter: "ళ",
        word: "తాళం",
        image: getAssetUrl(s3Assets.తాళంImg),
        audio: getAssetAudioUrl(s3Assets.తాళంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తాళంSingleAudio),
      },
      {
        id: 96,
        title: "హల్లులు",
        letters: "ళ",
        letter: "ళ",
        word: "కళ",
        image: getAssetUrl(s3Assets.కళImg),
        audio: getAssetAudioUrl(s3Assets.కళAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కళSingleAudio),
      },
    ],
  },
  {
    letter: "క్ష",
    items: [
      {
        id: 97,
        title: "హల్లులు",
        letters: "క్ష",
        letter: "క్ష",
        word: "క్షత్రియుడు",
        image: getAssetUrl(s3Assets.క్షత్రియుడుImg),
        audio: getAssetAudioUrl(s3Assets.క్షత్రియుడుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.క్షత్రియుడుSingleAudio),
      },
      {
        id: 98,
        title: "హల్లులు",
        letters: "క్ష",
        letter: "క్ష",
        word: "అక్షరం",
        image: getAssetUrl(s3Assets.అక్షరంImg),
        audio: getAssetAudioUrl(s3Assets.అక్షరంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అక్షరంSingleAudio),
      },
      {
        id: 99,
        title: "హల్లులు",
        letters: "క్ష",
        letter: "క్ష",
        word: "పరీక్ష",
        image: getAssetUrl(s3Assets.పరీక్షImg),
        audio: getAssetAudioUrl(s3Assets.పరీక్షAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పరీక్షSingleAudio),
      },
    ],
  },
  {
    letter: "ఱ",
    items: [
      {
        id: 100,
        title: "హల్లులు",
        letters: "ఱ",
        letter: "ఱ",
        word: "ఱంపం",
        image: getAssetUrl(s3Assets.ఱంపంImg),
        audio: getAssetAudioUrl(s3Assets.ఱంపంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఱంపంSingleAudio),
      },
    ],
  },
];

const R0 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  //enableNext,
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
  handleBack, // This might be going to homepage
  //setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  customLetters, // Array of letters to filter (e.g., ["a", "m", "s", "t"])
  //isNextButtonCalled,
  //setIsNextButtonCalled,
}) => {
  steps = 1;
  const lang = getLocalData("lang");
  let data;

  if (lang === "en") {
    data = dataEn;
  } else if (lang === "hi") {
    data = dataHi;
  } else if (lang === "te") {
    data = dataTe;
  } else if (lang === "kn") {
    data = dataKn;
  } else {
    data = dataEn; // fallback (English)
  }

  // Filter data based on customLetters if provided
  if (
    customLetters &&
    Array.isArray(customLetters) &&
    customLetters.length > 0
  ) {
    // Normalize customLetters to uppercase for comparison
    const normalizedCustomLetters = customLetters.map((letter) =>
      letter.toUpperCase()
    );
    data = data.filter((letterObj) => {
      // Check if the letter (uppercase) matches any of the custom letters
      return normalizedCustomLetters.includes(letterObj.letter.toUpperCase());
    });
  }

  const generatePlaylist = (data) => {
    const playlist = [];

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      block.forEach((letterObj) => {
        letterObj.items.forEach((item) => {
          playlist.push({
            type: "UI1",
            item,
            letter: letterObj.letter,
          });
        });
      });

      block.forEach((letterObj) => {
        if (letterObj.items.length > 0) {
          const firstItem = letterObj.items[0];
          playlist.push({
            type: "UI2",
            item: firstItem,
            letter: letterObj.letter,
          });
        }
      });
    }

    return playlist;
  };

  const playlist = generatePlaylist(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const batchIndex = Math.floor(currentIndex / 10);
  const stepInBatch = Math.floor((currentIndex % 10) / 5);
  const itemIndex = batchIndex * 5 + (currentIndex % 5);
  const item = playlist[currentIndex]?.item;
  const prevItem = itemIndex > 0 ? data[itemIndex - 1] : null;
  const blockStart = Math.floor(itemIndex / 5) * 5;
  const currentLetter = item?.letter || "";
  const [letters, setLetters] = useState([]);
  const COLORS = ["#8BC34A", "#9C27B0", "#E91E63", "#03A9F4", "#FF9800"];
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState(null);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const current = playlist[currentIndex];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const audioRef = useRef(null);

  const currentAudio =
    playlist[currentIndex]?.type === "UI2"
      ? null
      : playlist[currentIndex]?.item?.audio || null;

  const singleAudio = playlist[currentIndex]?.item?.singleAudio || null;

  //console.log("letters", singleAudio);

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

  const currentUI = useMemo(() => {
    return playlist[currentIndex]?.type;
  }, [currentIndex, playlist]);

  const handleNextWord = () => {
    const currentLetter = playlist[currentIndex]?.item?.letter || "";

    if (currentLetter && current.type === "UI1") {
      setLetters((prev) =>
        prev.includes(currentLetter) ? prev : [...prev, currentLetter]
      );
    }

    console.log("datas", currentIndex, playlist.length);

    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // If handleNext prop is provided (e.g., from F1), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default R0 behavior
        setLocalData("rStepZero", 1);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        console.log("finished r0");
      }
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      const currentLetter = playlist[currentIndex]?.item?.letter || "";
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
    if (currentIndex > 0) {
      handlePreviousWord();
    } else {
      if (handleBack) {
        handleBack();
      } else {
        navigate(-1);
      }
    }
  };

  const handleRetry = () => {
    console.log("audio playing!");
    playAudio(currentAudio);
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
  const blue = "#f28b1d";

  const flowNames = [...new Set(data.map((item) => item.id))];

  const renderUI = () => {
    const cycleIndex = Math.floor(currentIndex / 20);
    const positionInCycle = currentIndex % 20;

    const current = playlist[currentIndex];
    if (!current) return null;

    //console.log('ui?', currentIndex, block, isUI1, letters);

    const totalLetters = data.length;
    const completedLetters = letters.length;

    // Calculate total items in playlist
    const totalItemsInPlaylist = playlist.length;

    const completionPercentage =
      totalLetters > 0
        ? Math.round((completedLetters / totalLetters) * 100)
        : 0;
    const UI1 = () => {
      //console.log("ui1", item, current);

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
            <span style={{ color: "#FF0000", fontWeight: "bold" }}>
              {letter}
            </span>
            {after}
          </>
        );
      };

      let TOTAL_ITEMS = 0;

      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") {
          TOTAL_ITEMS = 101;
        } else if (lang === "hi") {
          TOTAL_ITEMS = 151;
        } else if (lang === "te") {
          TOTAL_ITEMS = 146;
        } else if (lang === "kn") {
          TOTAL_ITEMS = 142;
        } else {
          TOTAL_ITEMS = 100; // fallback default
        }
      }

      // FIXED: Use currentIndex + 1 instead of item?.id
      const currentItemNumber = currentIndex + 1;
      const completionPercentage = Math.round(
        (currentItemNumber / TOTAL_ITEMS) * 100
      );

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            height: "60vh",
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
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
              paddingTop: 4,
              minHeight: "50vh",
            }}
          >
            {/* Progress container - right side */}
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

            {/* Title container - left side */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "24px",
                padding: "14px 18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid #FF9800",
                zIndex: 10,
                backdropFilter: "blur(5px)",
                minWidth: "140px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: getFontFamily(lang),
                  fontWeight: lang === "te" ? 400 : 700,
                  fontSize: lang === "te" ? "23px" : "20px",
                  color: "#FF9800",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                mb: 0,
                mt: 0.5,
              }}
            >
              <img
                src={trainImg}
                alt="train"
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  maxHeight: "70px",
                  objectFit: "contain",
                  marginTop: "2px",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: "-11%",
                  left: "68%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 0.6,
                  justifyContent: "center",
                  width: "100%",
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
                          minWidth: 60,
                          minHeight: 60,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: COLORS[i % COLORS.length],
                          boxShadow: 2,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: getFontFamily(lang),
                            color: "#FFFFFF",
                            fontSize: lang === "te" ? "32px" : "28px",
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

            <Box
              sx={{
                width: "75%",
                maxWidth: 380,
                height: "auto",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1CB0F6",
                borderRadius: "14px",
                backgroundColor: "#F1FAFE",
                mb: 0.5,
                padding: "4px",
                marginTop: 1,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: red,
                  fontWeight: 500,
                  fontSize: { xs: 50, md: 75 },
                  lineHeight: 1,
                  fontFamily: getFontFamily(lang),
                  flex: 1,
                  textAlign: "center",
                  p: 0.2,
                }}
              >
                {item.letters.length > 1 ? (
                  <>
                    <span style={{ color: "#C93128" }}>{item.letters[0]}</span>
                    <span style={{ color: "#1c2752" }}>{item.letters[1]}</span>
                    {item.letters.slice(2)}
                  </>
                ) : (
                  <span style={{ color: "red" }}>{item.letters}</span>
                )}
              </Typography>

              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "#1CB0F6",
                  alignSelf: "stretch",
                }}
              />

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.2,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.word}
                  sx={{
                    width: { xs: 60, md: 85 },
                    height: { xs: 60, md: 85 },
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                mt: 3,
              }}
            >
              <span
                style={{
                  color: "#333F61",
                  fontWeight: lang === "te" ? 400 : 700,
                  fontSize: "50px",
                  lineHeight: "1",
                  letterSpacing: "2%",
                  fontFamily: getFontFamily(lang),
                }}
              >
                {renderHighlightedWord(item.word, item.letter)}
              </span>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                zIndex: 10,
                justifyContent: "center",
                alignItems: "flex-end",
                mb: 1,
                mt: 1,
              }}
            >
              <IconButton
                onClick={handleBackNavigation}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#1CB0F6",
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(28,176,246,0.35)",
                  "&:hover": { bgcolor: "#1AA3E3" },
                  transform: "translateY(-4px)",
                }}
              >
                <ArrowLeft size={22} />
              </IconButton>

              <IconButton
                onClick={handleRetry}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: pink,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(234,76,137,0.35)",
                  "&:hover": { bgcolor: pink },
                  transform: "translateY(-1px)",
                }}
              >
                <RotateCcw size={22} />
              </IconButton>

              {/* ➡️ Next button */}
              <IconButton
                onClick={handleNextWord}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: orange,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(242,139,29,0.35)",
                  "&:hover": { bgcolor: orange },
                }}
              >
                <ArrowRight size={22} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      );
    };
    const UI2 = () => {
      //console.log("ui2");

      let TOTAL_ITEMS = 0;
      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") TOTAL_ITEMS = 101;
        else if (lang === "kn") TOTAL_ITEMS = 142;
        else if (lang === "hi") TOTAL_ITEMS = 151;
        else if (lang === "te") TOTAL_ITEMS = 146;
        else TOTAL_ITEMS = 100; // fallback
      }
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
            <span style={{ color: "#FF0000", fontWeight: "bold" }}>
              {letter}
            </span>
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
              padding: "20px 0",
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
                marginTop: "10px",
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
                    fontFamily: "Quicksand",
                  }}
                >
                  {renderHighlightedWord(item.word, item.letter)}
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
                padding: "10px 10px",
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
                originalText={`R0-${item?.letter}`}
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
    if (current.type === "UI1") {
      return UI1(current.item);
    } else {
      return UI2(current.item);
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
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
                src={`https://www.youtube.com/embed/gfl-lcNz1QE?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        {renderUI()}
      </Box>
    </MainLayout>
  );
};

export default R0;
