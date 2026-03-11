import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import * as s3Assets from "../utils/s3Links";
import { getAssetUrl } from "../utils/s3Links";
import { getAssetAudioUrl } from "../utils/s3Links";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.png";
// import Mic from "assets/mikee.svg";
// import Stop from "assets/pausse.svg";
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
import chairImg from "../assets/chair.svg";
import correctTick from "../assets/correctTick.svg";
import r3Next from "../assets/r3Next.svg";
import dogGif from "../assets/dogGif.gif";
import r3Reset from "../assets/r3Reset.svg";
import r3WrongTick from "../assets/r3WrongTick.svg";
import mikeImg from "../assets/mikeee.svg";
import pauseImg from "../assets/paaauuse.svg";
import effectImg from "../assets/effects.svg";
import buttonImg from "../assets/buton.png";
import coinsImg from "../assets/coiins.svg";
import headerImg from "../assets/headers.svg";
import shipImg from "../assets/sheep.svg";
import shipAudio1 from "../assets/ship1.mp3";
import shipAudio from "../assets/ship.wav";
import shipAudio2 from "../assets/ship2.mp3";
import shipAudio3 from "../assets/ship3.mp3";
import audioIcon from "../assets/audioIcon.svg";
import handIconGif from "../assets/handIconGif.gif";
import musicIcon from "../assets/musicIcon.svg";
import stepThreeTextR from "../assets/stepThreeTextR.svg";
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
} from "../utils/levelData";
import { response } from "../services/telementryService";

const theme = createTheme();

const levelData = {
  en: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.foilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.foilR2Eng),
        options: [
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
          {
            id: "foilR2Eng",
            value: getAssetAudioUrl(s3Assets.foilR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.footR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.footR2Eng),
        options: [
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
          {
            id: "boyR2Eng",
            value: getAssetAudioUrl(s3Assets.boyR2Eng),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.toysR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.toysR2Eng),
        options: [
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "toysR2Eng",
            value: getAssetAudioUrl(s3Assets.toysR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boyR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boyR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "boyR2Eng",
            value: getAssetAudioUrl(s3Assets.boyR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.soilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.soilR2Eng),
        options: [
          {
            id: "soilR2Eng",
            value: getAssetAudioUrl(s3Assets.soilR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cowR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cowR2Eng),
        options: [
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "fullR2Eng",
            value: getAssetAudioUrl(s3Assets.fullR2Eng),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.booksR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.booksR2Eng),
        options: [
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.woodR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.woodR2Eng),
        options: [
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.owlR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.owlR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.watchR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.watchR2Eng),
        options: [
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fullR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.glassRAudio),
        options: [
          {
            id: "glassRAudio",
            value: getAssetAudioUrl(s3Assets.glassRAudio),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
          {
            id: "foilR2Eng",
            value: getAssetAudioUrl(s3Assets.foilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.yawnR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.yawnR2Eng),
        options: [
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cookR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cookR2Eng),
        options: [
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boilR2Eng),
        options: [
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.loudR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.loudR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chopR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chopR2Eng),
        options: [
          {
            id: "chopR2Eng",
            value: getAssetAudioUrl(s3Assets.chopR2Eng),
            type: "audio",
          },
          {
            id: "crownR2Eng",
            value: getAssetAudioUrl(s3Assets.crownR2Eng),
            type: "audio",
          },
          {
            id: "youngR2Eng",
            value: getAssetAudioUrl(s3Assets.youngR2Eng),
            type: "audio",
          },
        ],
        flowName: "P16",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sourR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sourR2Eng),
        options: [
          {
            id: "sourR2Eng",
            value: getAssetAudioUrl(s3Assets.sourR2Eng),
            type: "audio",
          },
          {
            id: "outR2Eng",
            value: getAssetAudioUrl(s3Assets.outR2Eng),
            type: "audio",
          },
          {
            id: "cubeR2Eng",
            value: getAssetAudioUrl(s3Assets.cubeR2Eng),
            type: "audio",
          },
        ],
        flowName: "P17",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.roofR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.roofR2Eng),
        options: [
          {
            id: "roofR2Eng",
            value: getAssetAudioUrl(s3Assets.roofR2Eng),
            type: "audio",
          },
          {
            id: "woodenR2Eng",
            value: getAssetAudioUrl(s3Assets.woodenR2Eng),
            type: "audio",
          },
          {
            id: "goodR2Eng",
            value: getAssetAudioUrl(s3Assets.goodR2Eng),
            type: "audio",
          },
        ],
        flowName: "P18",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.yellowR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.yellowR2Eng),
        options: [
          {
            id: "yellowR2Eng",
            value: getAssetAudioUrl(s3Assets.yellowR2Eng),
            type: "audio",
          },
          {
            id: "fewR2Eng",
            value: getAssetAudioUrl(s3Assets.fewR2Eng),
            type: "audio",
          },
          {
            id: "hugeR2Eng",
            value: getAssetAudioUrl(s3Assets.hugeR2Eng),
            type: "audio",
          },
        ],
        flowName: "P19",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.woodenR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.woodenR2Eng),
        options: [
          {
            id: "woodenR2Eng",
            value: getAssetAudioUrl(s3Assets.woodenR2Eng),
            type: "audio",
          },
          {
            id: "cowsR2Eng",
            value: getAssetAudioUrl(s3Assets.cowsR2Eng),
            type: "audio",
          },
          {
            id: "chewR2Eng",
            value: getAssetAudioUrl(s3Assets.chewR2Eng),
            type: "audio",
          },
        ],
        flowName: "P20",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.crownR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.crownR2Eng),
        options: [
          {
            id: "crownR2Eng",
            value: getAssetAudioUrl(s3Assets.crownR2Eng),
            type: "audio",
          },
          {
            id: "withR2Eng",
            value: getAssetAudioUrl(s3Assets.withR2Eng),
            type: "audio",
          },
          {
            id: "cloudR2Eng",
            value: getAssetAudioUrl(s3Assets.cloudR2Eng),
            type: "audio",
          },
        ],
        flowName: "P21",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cubeR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cubeR2Eng),
        options: [
          {
            id: "cubeR2Eng",
            value: getAssetAudioUrl(s3Assets.cubeR2Eng),
            type: "audio",
          },
          {
            id: "thinkR2Eng",
            value: getAssetAudioUrl(s3Assets.thinkR2Eng),
            type: "audio",
          },
          {
            id: "yearR2Eng",
            value: getAssetAudioUrl(s3Assets.yearR2Eng),
            type: "audio",
          },
        ],
        flowName: "P22",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hugeR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hugeR2Eng),
        options: [
          {
            id: "hugeR2Eng",
            value: getAssetAudioUrl(s3Assets.hugeR2Eng),
            type: "audio",
          },
          {
            id: "woolR2Eng",
            value: getAssetAudioUrl(s3Assets.woolR2Eng),
            type: "audio",
          },
          {
            id: "enjoyR2Eng",
            value: getAssetAudioUrl(s3Assets.enjoyR2Eng),
            type: "audio",
          },
        ],
        flowName: "P23",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cowsR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cowsR2Eng),
        options: [
          {
            id: "cowsR2Eng",
            value: getAssetAudioUrl(s3Assets.cowsR2Eng),
            type: "audio",
          },
          {
            id: "richR2Eng",
            value: getAssetAudioUrl(s3Assets.richR2Eng),
            type: "audio",
          },
          {
            id: "joyR2Eng",
            value: getAssetAudioUrl(s3Assets.joyR2Eng),
            type: "audio",
          },
        ],
        flowName: "P24",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chewR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chewR2Eng),
        options: [
          {
            id: "chewR2Eng",
            value: getAssetAudioUrl(s3Assets.chewR2Eng),
            type: "audio",
          },
          {
            id: "youR2Eng",
            value: getAssetAudioUrl(s3Assets.youR2Eng),
            type: "audio",
          },
          {
            id: "aloudR2Eng",
            value: getAssetAudioUrl(s3Assets.aloudR2Eng),
            type: "audio",
          },
        ],
        flowName: "P25",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.withR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.withR2Eng),
        options: [
          {
            id: "withR2Eng",
            value: getAssetAudioUrl(s3Assets.withR2Eng),
            type: "audio",
          },
          {
            id: "togetherR2Eng",
            value: getAssetAudioUrl(s3Assets.togetherR2Eng),
            type: "audio",
          },
          {
            id: "matchR2Eng",
            value: getAssetAudioUrl(s3Assets.matchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P26",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cloudR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cloudR2Eng),
        options: [
          {
            id: "cloudR2Eng",
            value: getAssetAudioUrl(s3Assets.cloudR2Eng),
            type: "audio",
          },
          {
            id: "thinR2Eng",
            value: getAssetAudioUrl(s3Assets.thinR2Eng),
            type: "audio",
          },
          {
            id: "choiceR2Eng",
            value: getAssetAudioUrl(s3Assets.choiceR2Eng),
            type: "audio",
          },
        ],
        flowName: "P27",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.thinkR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.thinkR2Eng),
        options: [
          {
            id: "thinkR2Eng",
            value: getAssetAudioUrl(s3Assets.thinkR2Eng),
            type: "audio",
          },
          {
            id: "childR2Eng",
            value: getAssetAudioUrl(s3Assets.childR2Eng),
            type: "audio",
          },
          {
            id: "nowR2Eng",
            value: getAssetAudioUrl(s3Assets.nowR2Eng),
            type: "audio",
          },
        ],
        flowName: "P28",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.yearR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.yearR2Eng),
        options: [
          {
            id: "yearR2Eng",
            value: getAssetAudioUrl(s3Assets.yearR2Eng),
            type: "audio",
          },
          {
            id: "fewR2Eng",
            value: getAssetAudioUrl(s3Assets.fewR2Eng),
            type: "audio",
          },
          {
            id: "reuseR2Eng",
            value: getAssetAudioUrl(s3Assets.reuseR2Eng),
            type: "audio",
          },
        ],
        flowName: "P29",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.woolR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.woolR2Eng),
        options: [
          {
            id: "woolR2Eng",
            value: getAssetAudioUrl(s3Assets.woolR2Eng),
            type: "audio",
          },
          {
            id: "goodR2Eng",
            value: getAssetAudioUrl(s3Assets.goodR2Eng),
            type: "audio",
          },
          {
            id: "valuesR2Eng",
            value: getAssetAudioUrl(s3Assets.valuesR2Eng),
            type: "audio",
          },
        ],
        flowName: "P30",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.enjoyR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.enjoyR2Eng),
        options: [
          {
            id: "enjoyR2Eng",
            value: getAssetAudioUrl(s3Assets.enjoyR2Eng),
            type: "audio",
          },
          {
            id: "chartR2Eng",
            value: getAssetAudioUrl(s3Assets.chartR2Eng),
            type: "audio",
          },
          {
            id: "outR2Eng",
            value: getAssetAudioUrl(s3Assets.outR2Eng),
            type: "audio",
          },
        ],
        flowName: "P31",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.richR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.richR2Eng),
        options: [
          {
            id: "richR2Eng",
            value: getAssetAudioUrl(s3Assets.richR2Eng),
            type: "audio",
          },
          {
            id: "lookR2Eng",
            value: getAssetAudioUrl(s3Assets.lookR2Eng),
            type: "audio",
          },
          {
            id: "bothR2Eng",
            value: getAssetAudioUrl(s3Assets.bothR2Eng),
            type: "audio",
          },
        ],
        flowName: "P32",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.joyR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.joyR2Eng),
        options: [
          {
            id: "joyR2Eng",
            value: getAssetAudioUrl(s3Assets.joyR2Eng),
            type: "audio",
          },
          {
            id: "youngR2Eng",
            value: getAssetAudioUrl(s3Assets.youngR2Eng),
            type: "audio",
          },
          {
            id: "youR2Eng",
            value: getAssetAudioUrl(s3Assets.youR2Eng),
            type: "audio",
          },
        ],
        flowName: "P33",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.youR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.youR2Eng),
        options: [
          {
            id: "youR2Eng",
            value: getAssetAudioUrl(s3Assets.youR2Eng),
            type: "audio",
          },
          {
            id: "aloudR2Eng",
            value: getAssetAudioUrl(s3Assets.aloudR2Eng),
            type: "audio",
          },
          {
            id: "togetherR2Eng",
            value: getAssetAudioUrl(s3Assets.togetherR2Eng),
            type: "audio",
          },
        ],
        flowName: "P34",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.aloudR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.aloudR2Eng),
        options: [
          {
            id: "aloudR2Eng",
            value: getAssetAudioUrl(s3Assets.aloudR2Eng),
            type: "audio",
          },
          {
            id: "matchR2Eng",
            value: getAssetAudioUrl(s3Assets.matchR2Eng),
            type: "audio",
          },
          {
            id: "thinR2Eng",
            value: getAssetAudioUrl(s3Assets.thinR2Eng),
            type: "audio",
          },
        ],
        flowName: "P35",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.togetherR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.togetherR2Eng),
        options: [
          {
            id: "togetherR2Eng",
            value: getAssetAudioUrl(s3Assets.togetherR2Eng),
            type: "audio",
          },
          {
            id: "choiceR2Eng",
            value: getAssetAudioUrl(s3Assets.choiceR2Eng),
            type: "audio",
          },
          {
            id: "childR2Eng",
            value: getAssetAudioUrl(s3Assets.childR2Eng),
            type: "audio",
          },
        ],
        flowName: "P36",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.matchR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.matchR2Eng),
        options: [
          {
            id: "matchR2Eng",
            value: getAssetAudioUrl(s3Assets.matchR2Eng),
            type: "audio",
          },
          {
            id: "nowR2Eng",
            value: getAssetAudioUrl(s3Assets.nowR2Eng),
            type: "audio",
          },
          {
            id: "fewR2Eng",
            value: getAssetAudioUrl(s3Assets.fewR2Eng),
            type: "audio",
          },
        ],
        flowName: "P37",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.thinR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.thinR2Eng),
        options: [
          {
            id: "thinR2Eng",
            value: getAssetAudioUrl(s3Assets.thinR2Eng),
            type: "audio",
          },
          {
            id: "reuseR2Eng",
            value: getAssetAudioUrl(s3Assets.reuseR2Eng),
            type: "audio",
          },
          {
            id: "goodR2Eng",
            value: getAssetAudioUrl(s3Assets.goodR2Eng),
            type: "audio",
          },
        ],
        flowName: "P38",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.choiceR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.choiceR2Eng),
        options: [
          {
            id: "choiceR2Eng",
            value: getAssetAudioUrl(s3Assets.choiceR2Eng),
            type: "audio",
          },
          {
            id: "valuesR2Eng",
            value: getAssetAudioUrl(s3Assets.valuesR2Eng),
            type: "audio",
          },
          {
            id: "chartR2Eng",
            value: getAssetAudioUrl(s3Assets.chartR2Eng),
            type: "audio",
          },
        ],
        flowName: "P39",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.childR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.childR2Eng),
        options: [
          {
            id: "childR2Eng",
            value: getAssetAudioUrl(s3Assets.childR2Eng),
            type: "audio",
          },
          {
            id: "outR2Eng",
            value: getAssetAudioUrl(s3Assets.outR2Eng),
            type: "audio",
          },
          {
            id: "lookR2Eng",
            value: getAssetAudioUrl(s3Assets.lookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P40",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.nowR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.nowR2Eng),
        options: [
          {
            id: "nowR2Eng",
            value: getAssetAudioUrl(s3Assets.nowR2Eng),
            type: "audio",
          },
          {
            id: "bothR2Eng",
            value: getAssetAudioUrl(s3Assets.bothR2Eng),
            type: "audio",
          },
          {
            id: "youngR2Eng",
            value: getAssetAudioUrl(s3Assets.youngR2Eng),
            type: "audio",
          },
        ],
        flowName: "P41",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fewR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fewR2Eng),
        options: [
          {
            id: "fewR2Eng",
            value: getAssetAudioUrl(s3Assets.fewR2Eng),
            type: "audio",
          },
          {
            id: "youR2Eng",
            value: getAssetAudioUrl(s3Assets.youR2Eng),
            type: "audio",
          },
          {
            id: "aloudR2Eng",
            value: getAssetAudioUrl(s3Assets.aloudR2Eng),
            type: "audio",
          },
        ],
        flowName: "P42",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.reuseR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.reuseR2Eng),
        options: [
          {
            id: "reuseR2Eng",
            value: getAssetAudioUrl(s3Assets.reuseR2Eng),
            type: "audio",
          },
          {
            id: "togetherR2Eng",
            value: getAssetAudioUrl(s3Assets.togetherR2Eng),
            type: "audio",
          },
          {
            id: "matchR2Eng",
            value: getAssetAudioUrl(s3Assets.matchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P43",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.goodR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.goodR2Eng),
        options: [
          {
            id: "goodR2Eng",
            value: getAssetAudioUrl(s3Assets.goodR2Eng),
            type: "audio",
          },
          {
            id: "thinR2Eng",
            value: getAssetAudioUrl(s3Assets.thinR2Eng),
            type: "audio",
          },
          {
            id: "choiceR2Eng",
            value: getAssetAudioUrl(s3Assets.choiceR2Eng),
            type: "audio",
          },
        ],
        flowName: "P44",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.valuesR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.valuesR2Eng),
        options: [
          {
            id: "valuesR2Eng",
            value: getAssetAudioUrl(s3Assets.valuesR2Eng),
            type: "audio",
          },
          {
            id: "childR2Eng",
            value: getAssetAudioUrl(s3Assets.childR2Eng),
            type: "audio",
          },
          {
            id: "nowR2Eng",
            value: getAssetAudioUrl(s3Assets.nowR2Eng),
            type: "audio",
          },
        ],
        flowName: "P45",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chartR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chartR2Eng),
        options: [
          {
            id: "chartR2Eng",
            value: getAssetAudioUrl(s3Assets.chartR2Eng),
            type: "audio",
          },
          {
            id: "fewR2Eng",
            value: getAssetAudioUrl(s3Assets.fewR2Eng),
            type: "audio",
          },
          {
            id: "reuseR2Eng",
            value: getAssetAudioUrl(s3Assets.reuseR2Eng),
            type: "audio",
          },
        ],
        flowName: "P46",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.outR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.outR2Eng),
        options: [
          {
            id: "outR2Eng",
            value: getAssetAudioUrl(s3Assets.outR2Eng),
            type: "audio",
          },
          {
            id: "goodR2Eng",
            value: getAssetAudioUrl(s3Assets.goodR2Eng),
            type: "audio",
          },
          {
            id: "valuesR2Eng",
            value: getAssetAudioUrl(s3Assets.valuesR2Eng),
            type: "audio",
          },
        ],
        flowName: "P47",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lookR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lookR2Eng),
        options: [
          {
            id: "lookR2Eng",
            value: getAssetAudioUrl(s3Assets.lookR2Eng),
            type: "audio",
          },
          {
            id: "chartR2Eng",
            value: getAssetAudioUrl(s3Assets.chartR2Eng),
            type: "audio",
          },
          {
            id: "outR2Eng",
            value: getAssetAudioUrl(s3Assets.outR2Eng),
            type: "audio",
          },
        ],
        flowName: "P48",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bothR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bothR2Eng),
        options: [
          {
            id: "bothR2Eng",
            value: getAssetAudioUrl(s3Assets.bothR2Eng),
            type: "audio",
          },
          {
            id: "lookR2Eng",
            value: getAssetAudioUrl(s3Assets.lookR2Eng),
            type: "audio",
          },
          {
            id: "youngR2Eng",
            value: getAssetAudioUrl(s3Assets.youngR2Eng),
            type: "audio",
          },
        ],
        flowName: "P49",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.youngR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.youngR2Eng),
        options: [
          {
            id: "youngR2Eng",
            value: getAssetAudioUrl(s3Assets.youngR2Eng),
            type: "audio",
          },
          {
            id: "youR2Eng",
            value: getAssetAudioUrl(s3Assets.youR2Eng),
            type: "audio",
          },
          {
            id: "aloudR2Eng",
            value: getAssetAudioUrl(s3Assets.aloudR2Eng),
            type: "audio",
          },
        ],
        flowName: "P50",
      },
    ],
  },
  hi: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.karelaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.karelaR2HinAud),
        options: [
          {
            id: "karelaR2Hin",
            value: getAssetAudioUrl(s3Assets.karelaR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kitabR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kitabR2HinAud),
        options: [
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.manabR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.manavR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.dholakR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.dholakR2HinAud),
        options: [
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ladkaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
        options: [
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hridayR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hridayR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.baiganR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bainganR2HinAud),
        options: [
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.jharnaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
        options: [
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.machisR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.machisR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "rupyaR2Hin",
            value: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
            type: "audio",
          },
          {
            id: "kisanR2Hin",
            value: getAssetAudioUrl(s3Assets.kisanR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.makdiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.makdiR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kisanR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kisanR2HinAud),
        options: [
          {
            id: "kisanR2Hin",
            value: getAssetAudioUrl(s3Assets.kisanR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.idliR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.idliR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.rupyaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
        options: [
          {
            id: "rupyaR2Hin",
            value: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.dawaiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
        options: [
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tarajuR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.parathaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.parathaR2HinAudio),
        options: [
          {
            id: "parathaR2Hin",
            value: getAssetAudioUrl(s3Assets.parathaR2HinAudio),
            type: "audio",
          },
          {
            id: "marijR2Hin",
            value: getAssetAudioUrl(s3Assets.mareezR2HinAudio),
            type: "audio",
          },
          {
            id: "chidiyaR2Hin",
            value: getAssetAudioUrl(s3Assets.chidiyaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P16",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.marijR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mareezR2HinAudio),
        options: [
          {
            id: "hasnaR2Hin",
            value: getAssetAudioUrl(s3Assets.hansnaR2HinAudio),
            type: "audio",
          },
          {
            id: "marijR2Hin",
            value: getAssetAudioUrl(s3Assets.mareezR2HinAudio),
            type: "audio",
          },
          {
            id: "dukanR2Hin",
            value: getAssetAudioUrl(s3Assets.dukaanR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P17",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chidiyaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chidiyaR2HinAudio),
        options: [
          {
            id: "chidiyaR2Hin",
            value: getAssetAudioUrl(s3Assets.chidiyaR2HinAudio),
            type: "audio",
          },
          {
            id: "pahadR2Hin",
            value: getAssetAudioUrl(s3Assets.pahadR2HinAudio),
            type: "audio",
          },
          {
            id: "hathodiR2Hin",
            value: getAssetAudioUrl(s3Assets.hathodaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P18",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hasnaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hansnaR2HinAudio),
        options: [
          {
            id: "windowR2Hin",
            value: getAssetAudioUrl(s3Assets.khidkiR2HinAudio),
            type: "audio",
          },
          {
            id: "hasnaR2Hin",
            value: getAssetAudioUrl(s3Assets.hansnaR2HinAudio),
            type: "audio",
          },
          {
            id: "kechuaR2Hin",
            value: getAssetAudioUrl(s3Assets.kenchuaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P19",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.dukanR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.dukaanR2HinAudio),
        options: [
          {
            id: "dukanR2Hin",
            value: getAssetAudioUrl(s3Assets.dukaanR2HinAudio),
            type: "audio",
          },
          {
            id: "parindaR2Hin",
            value: getAssetAudioUrl(s3Assets.parindaR2HinAudio),
            type: "audio",
          },
          {
            id: "machliR2Hin",
            value: getAssetAudioUrl(s3Assets.machhliR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P20",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pahadR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pahadR2HinAudio),
        options: [
          {
            id: "papadR2Hin",
            value: getAssetAudioUrl(s3Assets.papadR2HinAudio),
            type: "audio",
          },
          {
            id: "pahadR2Hin",
            value: getAssetAudioUrl(s3Assets.pahadR2HinAudio),
            type: "audio",
          },
          {
            id: "kamijR2Hin",
            value: getAssetAudioUrl(s3Assets.kameezR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P21",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hathodiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hathodaR2HinAudio),
        options: [
          {
            id: "hathodiR2Hin",
            value: getAssetAudioUrl(s3Assets.hathodaR2HinAudio),
            type: "audio",
          },
          {
            id: "pencilR2Hin",
            value: getAssetAudioUrl(s3Assets.pencilR2HinAudio),
            type: "audio",
          },
          {
            id: "kachuaR2Hin",
            value: getAssetAudioUrl(s3Assets.kachhuaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P22",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.windowR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.khidkiR2HinAudio),
        options: [
          {
            id: "lekhakR2Hin",
            value: getAssetAudioUrl(s3Assets.lekhakR2HinAudio),
            type: "audio",
          },
          {
            id: "windowR2Hin",
            value: getAssetAudioUrl(s3Assets.khidkiR2HinAudio),
            type: "audio",
          },
          {
            id: "batakR2Hin",
            value: getAssetAudioUrl(s3Assets.batakhR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P23",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kechuaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kenchuaR2HinAudio),
        options: [
          {
            id: "kechuaR2Hin",
            value: getAssetAudioUrl(s3Assets.kenchuaR2HinAudio),
            type: "audio",
          },
          {
            id: "sangitR2Hin",
            value: getAssetAudioUrl(s3Assets.sangeetR2HinAudio),
            type: "audio",
          },
          {
            id: "chimtaR2Hin",
            value: getAssetAudioUrl(s3Assets.chimtaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P24",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.parindaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.parindaR2HinAudio),
        options: [
          {
            id: "bhojanR2Hin",
            value: getAssetAudioUrl(s3Assets.bhojanR2HinAudio),
            type: "audio",
          },
          {
            id: "parindaR2Hin",
            value: getAssetAudioUrl(s3Assets.parindaR2HinAudio),
            type: "audio",
          },
          {
            id: "bhedR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P25",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.machliR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.machhliR2HinAudio),
        options: [
          {
            id: "machliR2Hin",
            value: getAssetAudioUrl(s3Assets.machhliR2HinAudio),
            type: "audio",
          },
          {
            id: "pagadiR2Hin",
            value: getAssetAudioUrl(s3Assets.pagdiR2HinAudio),
            type: "audio",
          },
          {
            id: "baiiganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P26",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.papadR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.papadR2HinAudio),
        options: [
          {
            id: "papadR2Hin",
            value: getAssetAudioUrl(s3Assets.papadR2HinAudio),
            type: "audio",
          },
          {
            id: "jamunR2Hin",
            value: getAssetAudioUrl(s3Assets.jamunR2HinAudio),
            type: "audio",
          },
          {
            id: "wolfR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P27",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kamijR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kameezR2HinAudio),
        options: [
          {
            id: "kamijR2Hin",
            value: getAssetAudioUrl(s3Assets.kameezR2HinAudio),
            type: "audio",
          },
          {
            id: "ladakaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAudio),
            type: "audio",
          },
          {
            id: "lakdiR2Hin",
            value: getAssetAudioUrl(s3Assets.lakdiR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P28",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pencilR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pencilR2HinAudio),
        options: [
          {
            id: "pencilR2Hin",
            value: getAssetAudioUrl(s3Assets.pencilR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P29",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kachuaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kachhuaR2HinAudio),
        options: [
          {
            id: "kachuaR2Hin",
            value: getAssetAudioUrl(s3Assets.kachhuaR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
          {
            id: "lekhakR2Hin",
            value: getAssetAudioUrl(s3Assets.lekhakR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P30",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lekhakR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lekhakR2HinAudio),
        options: [
          {
            id: "lekhakR2Hin",
            value: getAssetAudioUrl(s3Assets.lekhakR2HinAudio),
            type: "audio",
          },
          {
            id: "batakR2Hin",
            value: getAssetAudioUrl(s3Assets.batakhR2HinAudio),
            type: "audio",
          },
          {
            id: "sangitR2Hin",
            value: getAssetAudioUrl(s3Assets.sangeetR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P31",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.batakR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.batakhR2HinAudio),
        options: [
          {
            id: "batakR2Hin",
            value: getAssetAudioUrl(s3Assets.batakhR2HinAudio),
            type: "audio",
          },
          {
            id: "chimtaR2Hin",
            value: getAssetAudioUrl(s3Assets.chimtaR2HinAudio),
            type: "audio",
          },
          {
            id: "bhojanR2Hin",
            value: getAssetAudioUrl(s3Assets.bhojanR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P32",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sangitR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sangeetR2HinAudio),
        options: [
          {
            id: "sangitR2Hin",
            value: getAssetAudioUrl(s3Assets.sangeetR2HinAudio),
            type: "audio",
          },
          {
            id: "bhedR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
          {
            id: "pagadiR2Hin",
            value: getAssetAudioUrl(s3Assets.pagdiR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P33",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chimtaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chimtaR2HinAudio),
        options: [
          {
            id: "chimtaR2Hin",
            value: getAssetAudioUrl(s3Assets.chimtaR2HinAudio),
            type: "audio",
          },
          {
            id: "baiiganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAudio),
            type: "audio",
          },
          {
            id: "jamunR2Hin",
            value: getAssetAudioUrl(s3Assets.jamunR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P34",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bhojanR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bhojanR2HinAudio),
        options: [
          {
            id: "bhojanR2Hin",
            value: getAssetAudioUrl(s3Assets.bhojanR2HinAudio),
            type: "audio",
          },
          {
            id: "wolfR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
          {
            id: "ladakaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P35",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bhedR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
        options: [
          {
            id: "bhedR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
          {
            id: "lakdiR2Hin",
            value: getAssetAudioUrl(s3Assets.lakdiR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P36",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pagadiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pagdiR2HinAudio),
        options: [
          {
            id: "pagadiR2Hin",
            value: getAssetAudioUrl(s3Assets.pagdiR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P37",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.baiiganR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bainganR2HinAudio),
        options: [
          {
            id: "baiiganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAudio),
            type: "audio",
          },
          {
            id: "jamunR2Hin",
            value: getAssetAudioUrl(s3Assets.jamunR2HinAudio),
            type: "audio",
          },
          {
            id: "wolfR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P38",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.jamunR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.jamunR2HinAudio),
        options: [
          {
            id: "jamunR2Hin",
            value: getAssetAudioUrl(s3Assets.jamunR2HinAudio),
            type: "audio",
          },
          {
            id: "ladakaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAudio),
            type: "audio",
          },
          {
            id: "lakdiR2Hin",
            value: getAssetAudioUrl(s3Assets.lakdiR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P39",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.wolfR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
        options: [
          {
            id: "wolfR2Hin",
            value: getAssetAudioUrl(s3Assets.bhediyaR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P40",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ladakaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ladkaR2HinAudio),
        options: [
          {
            id: "ladakaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P41",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lakdiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lakdiR2HinAudio),
        options: [
          {
            id: "lakdiR2Hin",
            value: getAssetAudioUrl(s3Assets.lakdiR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P42",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.gulabR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
        options: [
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P43",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sainikR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
        options: [
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P44",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tirangaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
        options: [
          {
            id: "tirangaR2Hin",
            value: getAssetAudioUrl(s3Assets.tirangaR2HinAudio),
            type: "audio",
          },
          {
            id: "sainikR2Hin",
            value: getAssetAudioUrl(s3Assets.sainikR2HinAudio),
            type: "audio",
          },
          {
            id: "gulabR2Hin",
            value: getAssetAudioUrl(s3Assets.gulabR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P45",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.anghutaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.anguthaR2HinAudio),
        options: [
          {
            id: "anghutaR2Hin",
            value: getAssetAudioUrl(s3Assets.anguthaR2HinAudio),
            type: "audio",
          },
          {
            id: "policeR2Hin",
            value: getAssetAudioUrl(s3Assets.policeR2HinAudio),
            type: "audio",
          },
          {
            id: "mithaiR2Hin",
            value: getAssetAudioUrl(s3Assets.mithaiR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P46",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.policeR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.policeR2HinAudio),
        options: [
          {
            id: "policeR2Hin",
            value: getAssetAudioUrl(s3Assets.policeR2HinAudio),
            type: "audio",
          },
          {
            id: "nahanaR2Hin",
            value: getAssetAudioUrl(s3Assets.nahanaR2HinAudio),
            type: "audio",
          },
          {
            id: "ungliR2Hin",
            value: getAssetAudioUrl(s3Assets.anguliR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P47",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mithaiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mithaiR2HinAudio),
        options: [
          {
            id: "mithaiR2Hin",
            value: getAssetAudioUrl(s3Assets.mithaiR2HinAudio),
            type: "audio",
          },
          {
            id: "bagulaR2Hin",
            value: getAssetAudioUrl(s3Assets.bagulaR2HinAudio),
            type: "audio",
          },
          {
            id: "suarR2Hin",
            value: getAssetAudioUrl(s3Assets.suarR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P48",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.nahanaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.nahanaR2HinAudio),
        options: [
          {
            id: "nahanaR2Hin",
            value: getAssetAudioUrl(s3Assets.nahanaR2HinAudio),
            type: "audio",
          },
          {
            id: "ghoslaR2Hin",
            value: getAssetAudioUrl(s3Assets.ghoslaR2HinAudio),
            type: "audio",
          },
          {
            id: "mendakR2Hin",
            value: getAssetAudioUrl(s3Assets.mendhakR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P49",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ungliR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.anguliR2HinAudio),
        options: [
          {
            id: "ungliR2Hin",
            value: getAssetAudioUrl(s3Assets.anguliR2HinAudio),
            type: "audio",
          },
          {
            id: "daudnaR2Hin",
            value: getAssetAudioUrl(s3Assets.daudnaR2HinAudio),
            type: "audio",
          },
          {
            id: "morniR2Hin",
            value: getAssetAudioUrl(s3Assets.morniR2HinAudio),
            type: "audio",
          },
        ],
        flowName: "P50",
      },
    ],
  },
  ta: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bearR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bearR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boatR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boatR2Tam),
        options: [
          {
            id: "boatR2Tam",
            value: getAssetAudioUrl(s3Assets.boatR2Tam),
            type: "audio",
          },
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "chilliR2Tam",
            value: getAssetAudioUrl(s3Assets.chilliR2Tam),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.birdR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.birdR2Tam),
        options: [
          {
            id: "birdR2Tam",
            value: getAssetAudioUrl(s3Assets.birdR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.humanR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.humanR2Tam),
        options: [
          {
            id: "danceR2Tam",
            value: getAssetAudioUrl(s3Assets.danceR2Tam),
            type: "audio",
          },
          {
            id: "humanR2Tam",
            value: getAssetAudioUrl(s3Assets.humanR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tabalaR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tabalaR2Tam),
        options: [
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ringR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ringR2Tam),
        options: [
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chilliR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chilliR2Tam),
        options: [
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "chilliR2Tam",
            value: getAssetAudioUrl(s3Assets.chilliR2Tam),
            type: "audio",
          },
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.slowR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.slowR2Tam),
        options: [
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "slowR2Tam",
            value: getAssetAudioUrl(s3Assets.slowR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hotR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hotR2Tam),
        options: [
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.donkeyR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.donkeyR2Tam),
        options: [
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.danceR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.danceR2Tam),
        options: [
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "danceR2Tam",
            value: getAssetAudioUrl(s3Assets.danceR2Tam),
            type: "audio",
          },
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fruitR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fruitR2Tam),
        options: [
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "boatR2Tam",
            value: getAssetAudioUrl(s3Assets.boatR2Tam),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sunR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sunR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "slowR2Tam",
            value: getAssetAudioUrl(s3Assets.slowR2Tam),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.oldR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.oldR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "oldR2Tam",
            value: getAssetAudioUrl(s3Assets.oldR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.frogR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.frogR2Tam),
        options: [
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.respectR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.respectR2TamAudio),
        options: [
          {
            id: "respectR2Tam",
            value: getAssetAudioUrl(s3Assets.respectR2TamAudio),
            type: "audio",
          },
          {
            id: "prayR2Tam",
            value: getAssetAudioUrl(s3Assets.prayR2TamAudio),
            type: "audio",
          },
          {
            id: "kingR2Tam",
            value: getAssetAudioUrl(s3Assets.kingR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P16",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.towerR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.towerR2TamAudio),
        options: [
          {
            id: "towerR2Tam",
            value: getAssetAudioUrl(s3Assets.towerR2TamAudio),
            type: "audio",
          },
          {
            id: "cityR2Tam",
            value: getAssetAudioUrl(s3Assets.cityR2TamAudio),
            type: "audio",
          },
          {
            id: "earthR2Tam",
            value: getAssetAudioUrl(s3Assets.earthR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P17",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cityR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cityR2TamAudio),
        options: [
          {
            id: "merchantR2Tam",
            value: getAssetAudioUrl(s3Assets.merchantR2TamAudio),
            type: "audio",
          },
          {
            id: "cityR2Tam",
            value: getAssetAudioUrl(s3Assets.cityR2TamAudio),
            type: "audio",
          },
          {
            id: "barberR2Tam",
            value: getAssetAudioUrl(s3Assets.barberR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P18",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.earthR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.earthR2TamAudio),
        options: [
          {
            id: "earthR2Tam",
            value: getAssetAudioUrl(s3Assets.earthR2TamAudio),
            type: "audio",
          },
          {
            id: "shapeR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
          {
            id: "farmerR2Tam",
            value: getAssetAudioUrl(s3Assets.farmerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P19",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.barberR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.barberR2TamAudio),
        options: [
          {
            id: "barberR2Tam",
            value: getAssetAudioUrl(s3Assets.barberR2TamAudio),
            type: "audio",
          },
          {
            id: "potterR2Tam",
            value: getAssetAudioUrl(s3Assets.potterR2TamAudio),
            type: "audio",
          },
          {
            id: "officerR2Tam",
            value: getAssetAudioUrl(s3Assets.officerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P20",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.poetR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.poetR2TamAudio),
        options: [
          {
            id: "singerR2Tam",
            value: getAssetAudioUrl(s3Assets.singerR2TamAudio),
            type: "audio",
          },
          {
            id: "poetR2Tam",
            value: getAssetAudioUrl(s3Assets.poetR2TamAudio),
            type: "audio",
          },
          {
            id: "artistR2Tam",
            value: getAssetAudioUrl(s3Assets.artistR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P21",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.merchantR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.merchantR2TamAudio),
        options: [
          {
            id: "merchantR2Tam",
            value: getAssetAudioUrl(s3Assets.merchantR2TamAudio),
            type: "audio",
          },
          {
            id: "farmerR2Tam",
            value: getAssetAudioUrl(s3Assets.farmerR2TamAudio),
            type: "audio",
          },
          {
            id: "studentR2Tam",
            value: getAssetAudioUrl(s3Assets.studentR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P22",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.telephoneR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.telephoneR2TamAudio),
        options: [
          {
            id: "computerR2Tam",
            value: getAssetAudioUrl(s3Assets.computerR2TamAudio),
            type: "audio",
          },
          {
            id: "telephoneR2Tam",
            value: getAssetAudioUrl(s3Assets.telephoneR2TamAudio),
            type: "audio",
          },
          {
            id: "aeroplaneR2Tam",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P23",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.computerR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.computerR2TamAudio),
        options: [
          {
            id: "computerR2Tam",
            value: getAssetAudioUrl(s3Assets.computerR2TamAudio),
            type: "audio",
          },
          {
            id: "letterR2Tam",
            value: getAssetAudioUrl(s3Assets.letterR2TamAudio),
            type: "audio",
          },
          {
            id: "lipR2Tam",
            value: getAssetAudioUrl(s3Assets.lipR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P24",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bangleR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bangleR2TamAudio),
        options: [
          {
            id: "bangleR2Tam",
            value: getAssetAudioUrl(s3Assets.bangleR2TamAudio),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2TamAudio),
            type: "audio",
          },
          {
            id: "featherR2Tam",
            value: getAssetAudioUrl(s3Assets.featherR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P25",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.officerR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.officerR2TamAudio),
        options: [
          {
            id: "officerR2Tam",
            value: getAssetAudioUrl(s3Assets.officerR2TamAudio),
            type: "audio",
          },
          {
            id: "kingR2Tam",
            value: getAssetAudioUrl(s3Assets.kingR2TamAudio),
            type: "audio",
          },
          {
            id: "studentR2Tam",
            value: getAssetAudioUrl(s3Assets.studentR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P26",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.featherR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.featherR2TamAudio),
        options: [
          {
            id: "featherR2Tam",
            value: getAssetAudioUrl(s3Assets.featherR2TamAudio),
            type: "audio",
          },
          {
            id: "pillowR2Tam",
            value: getAssetAudioUrl(s3Assets.pillowR2TamAudio),
            type: "audio",
          },
          {
            id: "birdR2Tam",
            value: getAssetAudioUrl(s3Assets.birdR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P27",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.wheatR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.wheatR2TamAudio),
        options: [
          {
            id: "wheatR2Tam",
            value: getAssetAudioUrl(s3Assets.wheatR2TamAudio),
            type: "audio",
          },
          {
            id: "grainsR2Tam",
            value: getAssetAudioUrl(s3Assets.grainsR2TamAudio),
            type: "audio",
          },
          {
            id: "cuminR2Tam",
            value: getAssetAudioUrl(s3Assets.cuminR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P28",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.speciesR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.speciesR2TamAudio),
        options: [
          {
            id: "speciesR2Tam",
            value: getAssetAudioUrl(s3Assets.speciesR2TamAudio),
            type: "audio",
          },
          {
            id: "shapeR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
          {
            id: "societyR2Tam",
            value: getAssetAudioUrl(s3Assets.societyR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P29",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.shapeR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
        options: [
          {
            id: "shapeR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
          {
            id: "bigR2Tam",
            value: getAssetAudioUrl(s3Assets.bigR2TamAudio),
            type: "audio",
          },
          {
            id: "earthR2Tam",
            value: getAssetAudioUrl(s3Assets.earthR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P30",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.farmerR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.farmerR2TamAudio),
        options: [
          {
            id: "farmerR2Tam",
            value: getAssetAudioUrl(s3Assets.farmerR2TamAudio),
            type: "audio",
          },
          {
            id: "potterR2Tam",
            value: getAssetAudioUrl(s3Assets.potterR2TamAudio),
            type: "audio",
          },
          {
            id: "barberR2Tam",
            value: getAssetAudioUrl(s3Assets.barberR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P31",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.artistR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.artistR2TamAudio),
        options: [
          {
            id: "artistR2Tam",
            value: getAssetAudioUrl(s3Assets.artistR2TamAudio),
            type: "audio",
          },
          {
            id: "singerR2Tam",
            value: getAssetAudioUrl(s3Assets.singerR2TamAudio),
            type: "audio",
          },
          {
            id: "poetR2Tam",
            value: getAssetAudioUrl(s3Assets.poetR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P32",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pillowR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pillowR2TamAudio),
        options: [
          {
            id: "pillowR2Tam",
            value: getAssetAudioUrl(s3Assets.pillowR2TamAudio),
            type: "audio",
          },
          {
            id: "featherR2Tam",
            value: getAssetAudioUrl(s3Assets.featherR2TamAudio),
            type: "audio",
          },
          {
            id: "shapeR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P33",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.societyR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.societyR2TamAudio),
        options: [
          {
            id: "societyR2Tam",
            value: getAssetAudioUrl(s3Assets.societyR2TamAudio),
            type: "audio",
          },
          {
            id: "cityR2Tam",
            value: getAssetAudioUrl(s3Assets.cityR2TamAudio),
            type: "audio",
          },
          {
            id: "armyR2Tam",
            value: getAssetAudioUrl(s3Assets.armyR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P34",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.eagleR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.eagleR2TamAudio),
        options: [
          {
            id: "eagleR2Tam",
            value: getAssetAudioUrl(s3Assets.eagleR2TamAudio),
            type: "audio",
          },
          {
            id: "birdR2Tam",
            value: getAssetAudioUrl(s3Assets.birdR2TamAudio),
            type: "audio",
          },
          {
            id: "featherR2Tam",
            value: getAssetAudioUrl(s3Assets.featherR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P35",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.aeroplaneR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.aeroplaneR2TamAudio),
        options: [
          {
            id: "aeroplaneR2Tam",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2TamAudio),
            type: "audio",
          },
          {
            id: "telephoneR2Tam",
            value: getAssetAudioUrl(s3Assets.telephoneR2TamAudio),
            type: "audio",
          },
          {
            id: "computerR2Tam",
            value: getAssetAudioUrl(s3Assets.computerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P36",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bigR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bigR2TamAudio),
        options: [
          {
            id: "bigR2Tam",
            value: getAssetAudioUrl(s3Assets.bigR2TamAudio),
            type: "audio",
          },
          {
            id: "shapeR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
          {
            id: "towerR2Tam",
            value: getAssetAudioUrl(s3Assets.towerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P37",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.coughR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.coughR2TamAudio),
        options: [
          {
            id: "coughR2Tam",
            value: getAssetAudioUrl(s3Assets.coughR2TamAudio),
            type: "audio",
          },
          {
            id: "lipR2Tam",
            value: getAssetAudioUrl(s3Assets.lipR2TamAudio),
            type: "audio",
          },
          {
            id: "letterR2Tam",
            value: getAssetAudioUrl(s3Assets.letterR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P38",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.armyR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.armyR2TamAudio),
        options: [
          {
            id: "armyR2Tam",
            value: getAssetAudioUrl(s3Assets.armyR2TamAudio),
            type: "audio",
          },
          {
            id: "societyR2Tam",
            value: getAssetAudioUrl(s3Assets.societyR2TamAudio),
            type: "audio",
          },
          {
            id: "cityR2Tam",
            value: getAssetAudioUrl(s3Assets.cityR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P39",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.achievementR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.achievementR2TamAudio),
        options: [
          {
            id: "achievementR2Tam",
            value: getAssetAudioUrl(s3Assets.achievementR2TamAudio),
            type: "audio",
          },
          {
            id: "respectR2Tam",
            value: getAssetAudioUrl(s3Assets.respectR2TamAudio),
            type: "audio",
          },
          {
            id: "prayR2Tam",
            value: getAssetAudioUrl(s3Assets.prayR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P40",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.studentR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.studentR2TamAudio),
        options: [
          {
            id: "studentR2Tam",
            value: getAssetAudioUrl(s3Assets.studentR2TamAudio),
            type: "audio",
          },
          {
            id: "poetR2Tam",
            value: getAssetAudioUrl(s3Assets.poetR2TamAudio),
            type: "audio",
          },
          {
            id: "officerR2Tam",
            value: getAssetAudioUrl(s3Assets.officerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P41",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.potterR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.potterR2TamAudio),
        options: [
          {
            id: "potterR2Tam",
            value: getAssetAudioUrl(s3Assets.potterR2TamAudio),
            type: "audio",
          },
          {
            id: "farmerR2Tam",
            value: getAssetAudioUrl(s3Assets.farmerR2TamAudio),
            type: "audio",
          },
          {
            id: "barberR2Tam",
            value: getAssetAudioUrl(s3Assets.barberR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P42",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cuminR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cuminR2TamAudio),
        options: [
          {
            id: "cuminR2Tam",
            value: getAssetAudioUrl(s3Assets.cuminR2TamAudio),
            type: "audio",
          },
          {
            id: "wheatR2Tam",
            value: getAssetAudioUrl(s3Assets.wheatR2TamAudio),
            type: "audio",
          },
          {
            id: "grainsR2Tam",
            value: getAssetAudioUrl(s3Assets.grainsR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P43",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mathematicsR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
        options: [
          {
            id: "grainsR2Tam",
            value: getAssetAudioUrl(s3Assets.shapeR2TamAudio),
            type: "audio",
          },
          {
            id: "wheatR2Tam",
            value: getAssetAudioUrl(s3Assets.wheatR2TamAudio),
            type: "audio",
          },
          {
            id: "cuminR2Tam",
            value: getAssetAudioUrl(s3Assets.cuminR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P44",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.singerR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.singerR2TamAudio),
        options: [
          {
            id: "singerR2Tam",
            value: getAssetAudioUrl(s3Assets.singerR2TamAudio),
            type: "audio",
          },
          {
            id: "poetR2Tam",
            value: getAssetAudioUrl(s3Assets.poetR2TamAudio),
            type: "audio",
          },
          {
            id: "artistR2Tam",
            value: getAssetAudioUrl(s3Assets.artistR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P45",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lipR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lipR2TamAudio),
        options: [
          {
            id: "lipR2Tam",
            value: getAssetAudioUrl(s3Assets.lipR2TamAudio),
            type: "audio",
          },
          {
            id: "coughR2Tam",
            value: getAssetAudioUrl(s3Assets.coughR2TamAudio),
            type: "audio",
          },
          {
            id: "letterR2Tam",
            value: getAssetAudioUrl(s3Assets.letterR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P46",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.letterR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.letterR2TamAudio),
        options: [
          {
            id: "letterR2Tam",
            value: getAssetAudioUrl(s3Assets.letterR2TamAudio),
            type: "audio",
          },
          {
            id: "lipR2Tam",
            value: getAssetAudioUrl(s3Assets.lipR2TamAudio),
            type: "audio",
          },
          {
            id: "computerR2Tam",
            value: getAssetAudioUrl(s3Assets.computerR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P47",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kingR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kingR2TamAudio),
        options: [
          {
            id: "kingR2Tam",
            value: getAssetAudioUrl(s3Assets.kingR2TamAudio),
            type: "audio",
          },
          {
            id: "officerR2Tam",
            value: getAssetAudioUrl(s3Assets.officerR2TamAudio),
            type: "audio",
          },
          {
            id: "respectR2Tam",
            value: getAssetAudioUrl(s3Assets.respectR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P48",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.prayR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.prayR2TamAudio),
        options: [
          {
            id: "prayR2Tam",
            value: getAssetAudioUrl(s3Assets.prayR2TamAudio),
            type: "audio",
          },
          {
            id: "respectR2Tam",
            value: getAssetAudioUrl(s3Assets.respectR2TamAudio),
            type: "audio",
          },
          {
            id: "achievementR2Tam",
            value: getAssetAudioUrl(s3Assets.achievementR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P49",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.poetR2TamImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.poetR2TamAudio),
        options: [
          {
            id: "grainsR2Tam",
            value: getAssetAudioUrl(s3Assets.poetR2TamAudio),
            type: "audio",
          },
          {
            id: "wheatR2Tam",
            value: getAssetAudioUrl(s3Assets.wheatR2TamAudio),
            type: "audio",
          },
          {
            id: "cuminR2Tam",
            value: getAssetAudioUrl(s3Assets.cuminR2TamAudio),
            type: "audio",
          },
        ],
        flowName: "P50",
      },
    ],
  },
  kn: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.batR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.batR2Kan),
        options: [
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.flagR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.flagR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.authorR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.authorR2Kan),
        options: [
          {
            id: "authorR2Kan",
            value: getAssetAudioUrl(s3Assets.authorR2Kan),
            type: "audio",
          },
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.heartR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.heartR2Kan),
        options: [
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
          {
            id: "roseR2Kan",
            value: getAssetAudioUrl(s3Assets.roseR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.medicineR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.medicineR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "medicineR2Kan",
            value: getAssetAudioUrl(s3Assets.medicineR2Kan),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.PeacockR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.peacockR2Kan),
        options: [
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.familyR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.familyR2Kan),
        options: [
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "flightR2Kan",
            value: getAssetAudioUrl(s3Assets.flightR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.squirrelR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.squirrelR2Kan),
        options: [
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "humanR2Kan",
            value: getAssetAudioUrl(s3Assets.humanR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.humanR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.humanR2Kan),
        options: [
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
          {
            id: "humanR2Kan",
            value: getAssetAudioUrl(s3Assets.humanR2Kan),
            type: "audio",
          },
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.antR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.antR2Kan),
        options: [
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.flightR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.flightR2Kan),
        options: [
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
          {
            id: "flightR2Kan",
            value: getAssetAudioUrl(s3Assets.flightR2Kan),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fingerR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fingerR2Kan),
        options: [
          {
            id: "fingerR2Kan",
            value: getAssetAudioUrl(s3Assets.fingerR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mushroomR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mushroomR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "authorR2Kan",
            value: getAssetAudioUrl(s3Assets.authorR2Kan),
            type: "audio",
          },
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.roseR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.roseR2Kan),
        options: [
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "roseR2Kan",
            value: getAssetAudioUrl(s3Assets.roseR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.potterR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.potterR2Kan),
        options: [
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "medicineR2Kan",
            value: getAssetAudioUrl(s3Assets.medicineR2Kan),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.musicR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.MusicR2KanAudio),
        options: [
          {
            id: "MusicR2Kan",
            value: getAssetAudioUrl(s3Assets.MusicR2KanAudio),
            type: "audio",
          },
          {
            id: "HorseR2Kan",
            value: getAssetAudioUrl(s3Assets.HorseR2KanAudio),
            type: "audio",
          },
          {
            id: "GreenR2Kan",
            value: getAssetAudioUrl(s3Assets.GreenR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P16",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.rangoliR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.rangoliR2KanAudio),
        options: [
          {
            id: "OfficeR2Kan",
            value: getAssetAudioUrl(s3Assets.OfficeR2KanAudio),
            type: "audio",
          },
          {
            id: "rangoliR2Kan",
            value: getAssetAudioUrl(s3Assets.rangoliR2KanAudio),
            type: "audio",
          },
          {
            id: "DeviceR2Kan",
            value: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P17",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.soapR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.SoapR2KanAudio),
        options: [
          {
            id: "SoapR2Kan",
            value: getAssetAudioUrl(s3Assets.SoapR2KanAudio),
            type: "audio",
          },
          {
            id: "RaddishAudio",
            value: getAssetAudioUrl(s3Assets.RaddishAudio),
            type: "audio",
          },
          {
            id: "ToungeR2Kan",
            value: getAssetAudioUrl(s3Assets.ToungeR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P18",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.marriageR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.MarriageR2KanAudio),
        options: [
          {
            id: "CurdR2Kan",
            value: getAssetAudioUrl(s3Assets.CurdR2KanAudio),
            type: "audio",
          },
          {
            id: "MarriageR2Kan",
            value: getAssetAudioUrl(s3Assets.MarriageR2KanAudio),
            type: "audio",
          },
          {
            id: "DoorR2Kan",
            value: getAssetAudioUrl(s3Assets.DoorR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P19",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hairR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.HairR2KanAudio),
        options: [
          {
            id: "RespectR2Kan",
            value: getAssetAudioUrl(s3Assets.RespectR2KanAudio),
            type: "audio",
          },
          {
            id: "HairR2Kan",
            value: getAssetAudioUrl(s3Assets.HairR2KanAudio),
            type: "audio",
          },
          {
            id: "KangarooR2Kan",
            value: getAssetAudioUrl(s3Assets.KangarooR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P20",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bearR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bearR2KanAudio),
        options: [
          {
            id: "FryingpanR2Kan",
            value: getAssetAudioUrl(s3Assets.FryingpanR2KanAudio),
            type: "audio",
          },
          {
            id: "bearR2Kan",
            value: getAssetAudioUrl(s3Assets.bearR2KanAudio),
            type: "audio",
          },
          {
            id: "CauliflowerR2Kan",
            value: getAssetAudioUrl(s3Assets.CauliflowerR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P21",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.respectR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.RespectR2KanAudio),
        options: [
          {
            id: "RespectR2Kan",
            value: getAssetAudioUrl(s3Assets.RespectR2KanAudio),
            type: "audio",
          },
          {
            id: "MonthR2Kan",
            value: getAssetAudioUrl(s3Assets.MonthR2KanAudio),
            type: "audio",
          },
          {
            id: "MusicR2Kan",
            value: getAssetAudioUrl(s3Assets.MusicR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P22",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kangarooR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.KangarooR2KanAudio),
        options: [
          {
            id: "KangarooR2Kan",
            value: getAssetAudioUrl(s3Assets.KangarooR2KanAudio),
            type: "audio",
          },
          {
            id: "SoapR2Kan",
            value: getAssetAudioUrl(s3Assets.SoapR2KanAudio),
            type: "audio",
          },
          {
            id: "MarriageR2Kan",
            value: getAssetAudioUrl(s3Assets.MarriageR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P23",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fryingpanR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.FryingpanR2KanAudio),
        options: [
          {
            id: "HappyR2Kan",
            value: getAssetAudioUrl(s3Assets.HappyR2KanAudio),
            type: "audio",
          },
          {
            id: "FryingpanR2Kan",
            value: getAssetAudioUrl(s3Assets.FryingpanR2KanAudio),
            type: "audio",
          },
          {
            id: "GiraffeR2Kan",
            value: getAssetAudioUrl(s3Assets.GiraffeR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P24",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.monthR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.MonthR2KanAudio),
        options: [
          {
            id: "SpinachR2Kan",
            value: getAssetAudioUrl(s3Assets.SpinachR2KanAudio),
            type: "audio",
          },
          {
            id: "MonthR2Kan",
            value: getAssetAudioUrl(s3Assets.MonthR2KanAudio),
            type: "audio",
          },
          {
            id: "NailR2Kan",
            value: getAssetAudioUrl(s3Assets.NailR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P25",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cauliflowerR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.CauliflowerR2KanAudio),
        options: [
          {
            id: "CauliflowerR2Kan",
            value: getAssetAudioUrl(s3Assets.CauliflowerR2KanAudio),
            type: "audio",
          },
          {
            id: "SocietyR2Kan",
            value: getAssetAudioUrl(s3Assets.SocietyR2KanAudio),
            type: "audio",
          },
          {
            id: "BedR2Kan",
            value: getAssetAudioUrl(s3Assets.BedR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P26",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.towerR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.towerR2KanAudio),
        options: [
          {
            id: "TomatoR2Kan",
            value: getAssetAudioUrl(s3Assets.TomatoR2KanAudio),
            type: "audio",
          },
          {
            id: "towerR2Kan",
            value: getAssetAudioUrl(s3Assets.towerR2KanAudio),
            type: "audio",
          },
          {
            id: "girlR2Kan",
            value: getAssetAudioUrl(s3Assets.girlR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P27",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bucketR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bucketR2KanAudio),
        options: [
          {
            id: "cheetahR2Kan",
            value: getAssetAudioUrl(s3Assets.cheetahR2KanAudio),
            type: "audio",
          },
          {
            id: "bucketR2Kan",
            value: getAssetAudioUrl(s3Assets.bucketR2KanAudio),
            type: "audio",
          },
          {
            id: "WeaponR2Kan",
            value: getAssetAudioUrl(s3Assets.WeaponR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P28",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.vehicleR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.vehicleR2KanAudio),
        options: [
          {
            id: "fluteR2Kan",
            value: getAssetAudioUrl(s3Assets.fluteR2KanAudio),
            type: "audio",
          },
          {
            id: "vehicleR2Kan",
            value: getAssetAudioUrl(s3Assets.vehicleR2KanAudio),
            type: "audio",
          },
          {
            id: "HorseR2Kan",
            value: getAssetAudioUrl(s3Assets.HorseR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P29",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.spinachR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.SpinachR2KanAudio),
        options: [
          {
            id: "SpinachR2Kan",
            value: getAssetAudioUrl(s3Assets.SpinachR2KanAudio),
            type: "audio",
          },
          {
            id: "GreenR2Kan",
            value: getAssetAudioUrl(s3Assets.GreenR2KanAudio),
            type: "audio",
          },
          {
            id: "OfficeR2Kan",
            value: getAssetAudioUrl(s3Assets.OfficeR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P30",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.nailR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.NailR2KanAudio),
        options: [
          {
            id: "NailR2Kan",
            value: getAssetAudioUrl(s3Assets.NailR2KanAudio),
            type: "audio",
          },
          {
            id: "DeviceR2Kan",
            value: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
            type: "audio",
          },
          {
            id: "RaddishAudio",
            value: getAssetAudioUrl(s3Assets.RaddishAudio),
            type: "audio",
          },
        ],
        flowName: "P31",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.societyR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.SocietyR2KanAudio),
        options: [
          {
            id: "SocietyR2Kan",
            value: getAssetAudioUrl(s3Assets.SocietyR2KanAudio),
            type: "audio",
          },
          {
            id: "ToungeR2Kan",
            value: getAssetAudioUrl(s3Assets.ToungeR2KanAudio),
            type: "audio",
          },
          {
            id: "CurdR2Kan",
            value: getAssetAudioUrl(s3Assets.CurdR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P32",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bedR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.BedR2KanAudio),
        options: [
          {
            id: "BedR2Kan",
            value: getAssetAudioUrl(s3Assets.BedR2KanAudio),
            type: "audio",
          },
          {
            id: "DoorR2Kan",
            value: getAssetAudioUrl(s3Assets.DoorR2KanAudio),
            type: "audio",
          },
          {
            id: "RespectR2Kan",
            value: getAssetAudioUrl(s3Assets.RespectR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P33",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tomatoR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.TomatoR2KanAudio),
        options: [
          {
            id: "TomatoR2Kan",
            value: getAssetAudioUrl(s3Assets.TomatoR2KanAudio),
            type: "audio",
          },
          {
            id: "KangarooR2Kan",
            value: getAssetAudioUrl(s3Assets.KangarooR2KanAudio),
            type: "audio",
          },
          {
            id: "FryingpanR2Kan",
            value: getAssetAudioUrl(s3Assets.FryingpanR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P34",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fluteR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fluteR2KanAudio),
        options: [
          {
            id: "fluteR2Kan",
            value: getAssetAudioUrl(s3Assets.fluteR2KanAudio),
            type: "audio",
          },
          {
            id: "HairR2Kan",
            value: getAssetAudioUrl(s3Assets.HairR2KanAudio),
            type: "audio",
          },
          {
            id: "CauliflowerR2Kan",
            value: getAssetAudioUrl(s3Assets.CauliflowerR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P35",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.happyR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.HappyR2KanAudio),
        options: [
          {
            id: "HappyR2Kan",
            value: getAssetAudioUrl(s3Assets.HappyR2KanAudio),
            type: "audio",
          },
          {
            id: "MonthR2Kan",
            value: getAssetAudioUrl(s3Assets.MonthR2KanAudio),
            type: "audio",
          },
          {
            id: "MusicR2Kan",
            value: getAssetAudioUrl(s3Assets.MusicR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P36",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cheetahR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cheetahR2KanAudio),
        options: [
          {
            id: "cheetahR2Kan",
            value: getAssetAudioUrl(s3Assets.cheetahR2KanAudio),
            type: "audio",
          },
          {
            id: "SoapR2Kan",
            value: getAssetAudioUrl(s3Assets.SoapR2KanAudio),
            type: "audio",
          },
          {
            id: "MarriageR2Kan",
            value: getAssetAudioUrl(s3Assets.MarriageR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P37",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.giraffeR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.GiraffeR2KanAudio),
        options: [
          {
            id: "bearR2Kan",
            value: getAssetAudioUrl(s3Assets.bearR2KanAudio),
            type: "audio",
          },
          {
            id: "GiraffeR2Kan",
            value: getAssetAudioUrl(s3Assets.GiraffeR2KanAudio),
            type: "audio",
          },
          {
            id: "towerR2Kan",
            value: getAssetAudioUrl(s3Assets.towerR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P38",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.greenR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.GreenR2KanAudio),
        options: [
          {
            id: "GreenR2Kan",
            value: getAssetAudioUrl(s3Assets.GreenR2KanAudio),
            type: "audio",
          },
          {
            id: "girlR2Kan",
            value: getAssetAudioUrl(s3Assets.girlR2KanAudio),
            type: "audio",
          },
          {
            id: "WeaponR2Kan",
            value: getAssetAudioUrl(s3Assets.WeaponR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P39",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.horseR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.HorseR2KanAudio),
        options: [
          {
            id: "HorseR2Kan",
            value: getAssetAudioUrl(s3Assets.HorseR2KanAudio),
            type: "audio",
          },
          {
            id: "vehicleR2Kan",
            value: getAssetAudioUrl(s3Assets.vehicleR2KanAudio),
            type: "audio",
          },
          {
            id: "OfficeR2Kan",
            value: getAssetAudioUrl(s3Assets.OfficeR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P40",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.aeroplaneR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.aeroplaneR2KanAudio),
        options: [
          {
            id: "aeroplaneR2Kan",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2KanAudio),
            type: "audio",
          },
          {
            id: "DeviceR2Kan",
            value: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
            type: "audio",
          },
          {
            id: "RaddishAudio",
            value: getAssetAudioUrl(s3Assets.RaddishAudio),
            type: "audio",
          },
        ],
        flowName: "P41",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.raddishR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.RaddishAudio),
        options: [
          {
            id: "RaddishAudio",
            value: getAssetAudioUrl(s3Assets.RaddishAudio),
            type: "audio",
          },
          {
            id: "ToungeR2Kan",
            value: getAssetAudioUrl(s3Assets.ToungeR2KanAudio),
            type: "audio",
          },
          {
            id: "CurdR2Kan",
            value: getAssetAudioUrl(s3Assets.CurdR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P42",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.girlR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.girlR2KanAudio),
        options: [
          {
            id: "girlR2Kan",
            value: getAssetAudioUrl(s3Assets.girlR2KanAudio),
            type: "audio",
          },
          {
            id: "DoorR2Kan",
            value: getAssetAudioUrl(s3Assets.DoorR2KanAudio),
            type: "audio",
          },
          {
            id: "RespectR2Kan",
            value: getAssetAudioUrl(s3Assets.RespectR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P43",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.weaponR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.WeaponR2KanAudio),
        options: [
          {
            id: "WeaponR2Kan",
            value: getAssetAudioUrl(s3Assets.WeaponR2KanAudio),
            type: "audio",
          },
          {
            id: "KangarooR2Kan",
            value: getAssetAudioUrl(s3Assets.KangarooR2KanAudio),
            type: "audio",
          },
          {
            id: "FryingpanR2Kan",
            value: getAssetAudioUrl(s3Assets.FryingpanR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P44",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.toungeR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ToungeR2KanAudio),
        options: [
          {
            id: "ToungeR2Kan",
            value: getAssetAudioUrl(s3Assets.ToungeR2KanAudio),
            type: "audio",
          },
          {
            id: "HairR2Kan",
            value: getAssetAudioUrl(s3Assets.HairR2KanAudio),
            type: "audio",
          },
          {
            id: "CauliflowerR2Kan",
            value: getAssetAudioUrl(s3Assets.CauliflowerR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P45",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.doorR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.DoorR2KanAudio),
        options: [
          {
            id: "DoorR2Kan",
            value: getAssetAudioUrl(s3Assets.DoorR2KanAudio),
            type: "audio",
          },
          {
            id: "MonthR2Kan",
            value: getAssetAudioUrl(s3Assets.MonthR2KanAudio),
            type: "audio",
          },
          {
            id: "MusicR2Kan",
            value: getAssetAudioUrl(s3Assets.MusicR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P46",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.curdR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.CurdR2KanAudio),
        options: [
          {
            id: "CurdR2Kan",
            value: getAssetAudioUrl(s3Assets.CurdR2KanAudio),
            type: "audio",
          },
          {
            id: "SoapR2Kan",
            value: getAssetAudioUrl(s3Assets.SoapR2KanAudio),
            type: "audio",
          },
          {
            id: "MarriageR2Kan",
            value: getAssetAudioUrl(s3Assets.MarriageR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P47",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.agricultureR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.agricultureR2KanAudio),
        options: [
          {
            id: "agricultureR2Kan",
            value: getAssetAudioUrl(s3Assets.agricultureR2KanAudio),
            type: "audio",
          },
          {
            id: "bearR2Kan",
            value: getAssetAudioUrl(s3Assets.bearR2KanAudio),
            type: "audio",
          },
          {
            id: "GiraffeR2Kan",
            value: getAssetAudioUrl(s3Assets.GiraffeR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P48",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.deviceR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
        options: [
          {
            id: "DeviceR2Kan",
            value: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
            type: "audio",
          },
          {
            id: "girlR2Kan",
            value: getAssetAudioUrl(s3Assets.girlR2KanAudio),
            type: "audio",
          },
          {
            id: "WeaponR2Kan",
            value: getAssetAudioUrl(s3Assets.WeaponR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P49",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.officeR2KanImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.OfficeR2KanAudio),
        options: [
          {
            id: "OfficeR2Kan",
            value: getAssetAudioUrl(s3Assets.OfficeR2KanAudio),
            type: "audio",
          },
          {
            id: "vehicleR2Kan",
            value: getAssetAudioUrl(s3Assets.vehicleR2KanAudio),
            type: "audio",
          },
          {
            id: "DeviceR2Kan",
            value: getAssetAudioUrl(s3Assets.DeviceR2KanAudio),
            type: "audio",
          },
        ],
        flowName: "P50",
      },
    ],
  },
  te: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.aeroplaneR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
        options: [
          {
            id: "aeroplaneR2Tel",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.brainR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.brainR2Tel),
        options: [
          {
            id: "brainR2Tel",
            value: getAssetAudioUrl(s3Assets.brainR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.rabbitR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.rabbitR2Tel),
        options: [
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.windowR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.windowR2Tel),
        options: [
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.brinjalR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.brinjalR2Tel),
        options: [
          {
            id: "brinjalR2Tel",
            value: getAssetAudioUrl(s3Assets.brinjalR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.elephantR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.elephantR2Tel),
        options: [
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "elephantR2Tel",
            value: getAssetAudioUrl(s3Assets.elephantR2Tel),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.crocodileR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.crocodileR2Tel),
        options: [
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cycleR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cycleR2Tel),
        options: [
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
          {
            id: "aeroplaneR2Tel",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.animalR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.animalR2Tel),
        options: [
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
          {
            id: "brainR2Tel",
            value: getAssetAudioUrl(s3Assets.brainR2Tel),
            type: "audio",
          },
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bearR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bearR2Tel),
        options: [
          {
            id: "elephantR2Tel",
            value: getAssetAudioUrl(s3Assets.elephantR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.appleR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.appleR2Tel),
        options: [
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
          {
            id: "brinjalR2Tel",
            value: getAssetAudioUrl(s3Assets.brinjalR2Tel),
            type: "audio",
          },
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pigeonR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pigeonR2Tel),
        options: [
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tomatoR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tomatoR2Tel),
        options: [
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.peacockR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.peacockR2Tel),
        options: [
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.heartR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.heartR2Tel),
        options: [
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.umbrellaR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.umbrellaR2TelAudio),
        options: [
          {
            id: "umbrellaR2Tel",
            value: getAssetAudioUrl(s3Assets.umbrellaR2TelAudio),
            type: "audio",
          },
          {
            id: "mangoR2Tel",
            value: getAssetAudioUrl(s3Assets.mangoR2TelAudio),
            type: "audio",
          },
          {
            id: "boilR2Tel",
            value: getAssetAudioUrl(s3Assets.boilR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P16",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mangoR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mangoR2TelAudio),
        options: [
          {
            id: "tortoiseR2Tel",
            value: getAssetAudioUrl(s3Assets.tortoiseR2TelAudio),
            type: "audio",
          },
          {
            id: "mangoR2Tel",
            value: getAssetAudioUrl(s3Assets.mangoR2TelAudio),
            type: "audio",
          },
          {
            id: "coinR2Tel",
            value: getAssetAudioUrl(s3Assets.coinR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P17",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boilR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boilR2TelAudio),
        options: [
          {
            id: "chapathiR2Tel",
            value: getAssetAudioUrl(s3Assets.chapathiR2TelAudio),
            type: "audio",
          },
          {
            id: "boilR2Tel",
            value: getAssetAudioUrl(s3Assets.boilR2TelAudio),
            type: "audio",
          },
          {
            id: "tallR2Tel",
            value: getAssetAudioUrl(s3Assets.tallR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P18",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tortoiseR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tortoiseR2TelAudio),
        options: [
          {
            id: "pineappleR2Tel",
            value: getAssetAudioUrl(s3Assets.pineappleR2TelAudio),
            type: "audio",
          },
          {
            id: "readR2Tel",
            value: getAssetAudioUrl(s3Assets.readR2TelAudio),
            type: "audio",
          },
          {
            id: "tortoiseR2Tel",
            value: getAssetAudioUrl(s3Assets.tortoiseR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P19",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.coinR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.coinR2TelAudio),
        options: [
          {
            id: "coinR2Tel",
            value: getAssetAudioUrl(s3Assets.coinR2TelAudio),
            type: "audio",
          },
          {
            id: "pondR2Tel",
            value: getAssetAudioUrl(s3Assets.pondR2TelAudio),
            type: "audio",
          },
          {
            id: "countryR2Tel",
            value: getAssetAudioUrl(s3Assets.countryR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P20",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chapathiR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chapathiR2TelAudio),
        options: [
          {
            id: "lipR2Tel",
            value: getAssetAudioUrl(s3Assets.lipR2TelAudio),
            type: "audio",
          },
          {
            id: "chapathiR2Tel",
            value: getAssetAudioUrl(s3Assets.chapathiR2TelAudio),
            type: "audio",
          },
          {
            id: "sweetsR2Tel",
            value: getAssetAudioUrl(s3Assets.sweetsR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P21",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tallR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tallR2TelAudio),
        options: [
          {
            id: "lightningR2Tel",
            value: getAssetAudioUrl(s3Assets.lightningR2TelAudio),
            type: "audio",
          },
          {
            id: "barkR2Tel",
            value: getAssetAudioUrl(s3Assets.barkR2TelAudio),
            type: "audio",
          },
          {
            id: "tallR2Tel",
            value: getAssetAudioUrl(s3Assets.tallR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P22",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pineappleR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pineappleR2TelAudio),
        options: [
          {
            id: "pineappleR2Tel",
            value: getAssetAudioUrl(s3Assets.pineappleR2TelAudio),
            type: "audio",
          },
          {
            id: "broomR2Tel",
            value: getAssetAudioUrl(s3Assets.broomR2TelAudio),
            type: "audio",
          },
          {
            id: "foreheadR2Tel",
            value: getAssetAudioUrl(s3Assets.foreheadR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P23",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.readR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.readR2TelAudio),
        options: [
          {
            id: "drawR2Tel",
            value: getAssetAudioUrl(s3Assets.drawR2TelAudio),
            type: "audio",
          },
          {
            id: "readR2Tel",
            value: getAssetAudioUrl(s3Assets.readR2TelAudio),
            type: "audio",
          },
          {
            id: "radioR2Tel",
            value: getAssetAudioUrl(s3Assets.radioR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P24",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pondR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pondR2TelAudio),
        options: [
          {
            id: "hutR2Tel",
            value: getAssetAudioUrl(s3Assets.hutR2TelAudio),
            type: "audio",
          },
          {
            id: "pondR2Tel",
            value: getAssetAudioUrl(s3Assets.pondR2TelAudio),
            type: "audio",
          },
          {
            id: "ironR2Tel",
            value: getAssetAudioUrl(s3Assets.ironR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P25",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.countryR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.countryR2TelAudio),
        options: [
          {
            id: "wolfR2Tel",
            value: getAssetAudioUrl(s3Assets.wolfR2TelAudio),
            type: "audio",
          },
          {
            id: "countryR2Tel",
            value: getAssetAudioUrl(s3Assets.countryR2TelAudio),
            type: "audio",
          },
          {
            id: "jamunR2Tel",
            value: getAssetAudioUrl(s3Assets.jamunR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P26",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lipR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lipR2TelAudio),
        options: [
          {
            id: "lipR2Tel",
            value: getAssetAudioUrl(s3Assets.lipR2TelAudio),
            type: "audio",
          },
          {
            id: "policemanR2Tel",
            value: getAssetAudioUrl(s3Assets.policemanR2TelAudio),
            type: "audio",
          },
          {
            id: "wheatR2Tel",
            value: getAssetAudioUrl(s3Assets.wheatR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P27",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sweetsR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sweetsR2TelAudio),
        options: [
          {
            id: "giraffeR2Tel",
            value: getAssetAudioUrl(s3Assets.giraffeR2TelAudio),
            type: "audio",
          },
          {
            id: "sweetsR2Tel",
            value: getAssetAudioUrl(s3Assets.sweetsR2TelAudio),
            type: "audio",
          },
          {
            id: "happyR2Tel",
            value: getAssetAudioUrl(s3Assets.happyR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P28",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.lightningR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.lightningR2TelAudio),
        options: [
          {
            id: "babyR2Tel",
            value: getAssetAudioUrl(s3Assets.babyR2TelAudio),
            type: "audio",
          },
          {
            id: "lightningR2Tel",
            value: getAssetAudioUrl(s3Assets.lightningR2TelAudio),
            type: "audio",
          },
          {
            id: "familyR2Tel",
            value: getAssetAudioUrl(s3Assets.familyR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P29",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.barkR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.barkR2TelAudio),
        options: [
          {
            id: "barkR2Tel",
            value: getAssetAudioUrl(s3Assets.barkR2TelAudio),
            type: "audio",
          },
          {
            id: "guestR2Tel",
            value: getAssetAudioUrl(s3Assets.guestR2TelAudio),
            type: "audio",
          },
          {
            id: "skyR2Tel",
            value: getAssetAudioUrl(s3Assets.skyR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P30",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.broomR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.broomR2TelAudio),
        options: [
          {
            id: "broomR2Tel",
            value: getAssetAudioUrl(s3Assets.broomR2TelAudio),
            type: "audio",
          },
          {
            id: "papadR2Tel",
            value: getAssetAudioUrl(s3Assets.papadR2TelAudio),
            type: "audio",
          },
          {
            id: "mealR2Tel",
            value: getAssetAudioUrl(s3Assets.mealR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P31",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.foreheadR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.foreheadR2TelAudio),
        options: [
          {
            id: "foreheadR2Tel",
            value: getAssetAudioUrl(s3Assets.foreheadR2TelAudio),
            type: "audio",
          },
          {
            id: "hibiscusR2Tel",
            value: getAssetAudioUrl(s3Assets.hibiscusR2TelAudio),
            type: "audio",
          },
          {
            id: "throatR2Tel",
            value: getAssetAudioUrl(s3Assets.throatR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P32",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.drawR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.drawR2TelAudio),
        options: [
          {
            id: "drawR2Tel",
            value: getAssetAudioUrl(s3Assets.drawR2TelAudio),
            type: "audio",
          },
          {
            id: "umbrellaR2Tel",
            value: getAssetAudioUrl(s3Assets.umbrellaR2TelAudio),
            type: "audio",
          },
          {
            id: "mangoR2Tel",
            value: getAssetAudioUrl(s3Assets.mangoR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P33",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.radioR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.radioR2TelAudio),
        options: [
          {
            id: "radioR2Tel",
            value: getAssetAudioUrl(s3Assets.radioR2TelAudio),
            type: "audio",
          },
          {
            id: "boilR2Tel",
            value: getAssetAudioUrl(s3Assets.boilR2TelAudio),
            type: "audio",
          },
          {
            id: "tortoiseR2Tel",
            value: getAssetAudioUrl(s3Assets.tortoiseR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P34",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hutR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hutR2TelAudio),
        options: [
          {
            id: "hutR2Tel",
            value: getAssetAudioUrl(s3Assets.hutR2TelAudio),
            type: "audio",
          },
          {
            id: "coinR2Tel",
            value: getAssetAudioUrl(s3Assets.coinR2TelAudio),
            type: "audio",
          },
          {
            id: "chapathiR2Tel",
            value: getAssetAudioUrl(s3Assets.chapathiR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P35",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ironR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ironR2TelAudio),
        options: [
          {
            id: "ironR2Tel",
            value: getAssetAudioUrl(s3Assets.ironR2TelAudio),
            type: "audio",
          },
          {
            id: "tallR2Tel",
            value: getAssetAudioUrl(s3Assets.tallR2TelAudio),
            type: "audio",
          },
          {
            id: "pineappleR2Tel",
            value: getAssetAudioUrl(s3Assets.pineappleR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P36",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.wolfR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.wolfR2TelAudio),
        options: [
          {
            id: "wolfR2Tel",
            value: getAssetAudioUrl(s3Assets.wolfR2TelAudio),
            type: "audio",
          },
          {
            id: "readR2Tel",
            value: getAssetAudioUrl(s3Assets.readR2TelAudio),
            type: "audio",
          },
          {
            id: "pondR2Tel",
            value: getAssetAudioUrl(s3Assets.pondR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P37",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.jamunR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.jamunR2TelAudio),
        options: [
          {
            id: "jamunR2Tel",
            value: getAssetAudioUrl(s3Assets.jamunR2TelAudio),
            type: "audio",
          },
          {
            id: "countryR2Tel",
            value: getAssetAudioUrl(s3Assets.countryR2TelAudio),
            type: "audio",
          },
          {
            id: "lipR2Tel",
            value: getAssetAudioUrl(s3Assets.lipR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P38",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.policemanR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.policemanR2TelAudio),
        options: [
          {
            id: "policemanR2Tel",
            value: getAssetAudioUrl(s3Assets.policemanR2TelAudio),
            type: "audio",
          },
          {
            id: "sweetsR2Tel",
            value: getAssetAudioUrl(s3Assets.sweetsR2TelAudio),
            type: "audio",
          },
          {
            id: "lightningR2Tel",
            value: getAssetAudioUrl(s3Assets.lightningR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P39",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.wheatR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.wheatR2TelAudio),
        options: [
          {
            id: "wheatR2Tel",
            value: getAssetAudioUrl(s3Assets.wheatR2TelAudio),
            type: "audio",
          },
          {
            id: "barkR2Tel",
            value: getAssetAudioUrl(s3Assets.barkR2TelAudio),
            type: "audio",
          },
          {
            id: "broomR2Tel",
            value: getAssetAudioUrl(s3Assets.broomR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P40",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.giraffeR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.giraffeR2TelAudio),
        options: [
          {
            id: "giraffeR2Tel",
            value: getAssetAudioUrl(s3Assets.giraffeR2TelAudio),
            type: "audio",
          },
          {
            id: "foreheadR2Tel",
            value: getAssetAudioUrl(s3Assets.foreheadR2TelAudio),
            type: "audio",
          },
          {
            id: "drawR2Tel",
            value: getAssetAudioUrl(s3Assets.drawR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P41",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.happyR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.happyR2TelAudio),
        options: [
          {
            id: "happyR2Tel",
            value: getAssetAudioUrl(s3Assets.happyR2TelAudio),
            type: "audio",
          },
          {
            id: "radioR2Tel",
            value: getAssetAudioUrl(s3Assets.radioR2TelAudio),
            type: "audio",
          },
          {
            id: "hutR2Tel",
            value: getAssetAudioUrl(s3Assets.hutR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P42",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.babyR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.babyR2TelAudio),
        options: [
          {
            id: "babyR2Tel",
            value: getAssetAudioUrl(s3Assets.babyR2TelAudio),
            type: "audio",
          },
          {
            id: "ironR2Tel",
            value: getAssetAudioUrl(s3Assets.ironR2TelAudio),
            type: "audio",
          },
          {
            id: "wolfR2Tel",
            value: getAssetAudioUrl(s3Assets.wolfR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P43",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.familyR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.familyR2TelAudio),
        options: [
          {
            id: "familyR2Tel",
            value: getAssetAudioUrl(s3Assets.familyR2TelAudio),
            type: "audio",
          },
          {
            id: "jamunR2Tel",
            value: getAssetAudioUrl(s3Assets.jamunR2TelAudio),
            type: "audio",
          },
          {
            id: "policemanR2Tel",
            value: getAssetAudioUrl(s3Assets.policemanR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P44",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.guestR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.guestR2TelAudio),
        options: [
          {
            id: "guestR2Tel",
            value: getAssetAudioUrl(s3Assets.guestR2TelAudio),
            type: "audio",
          },
          {
            id: "wheatR2Tel",
            value: getAssetAudioUrl(s3Assets.wheatR2TelAudio),
            type: "audio",
          },
          {
            id: "giraffeR2Tel",
            value: getAssetAudioUrl(s3Assets.giraffeR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P45",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.skyR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.skyR2TelAudio),
        options: [
          {
            id: "skyR2Tel",
            value: getAssetAudioUrl(s3Assets.skyR2TelAudio),
            type: "audio",
          },
          {
            id: "happyR2Tel",
            value: getAssetAudioUrl(s3Assets.happyR2TelAudio),
            type: "audio",
          },
          {
            id: "babyR2Tel",
            value: getAssetAudioUrl(s3Assets.babyR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P46",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.papadR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.papadR2TelAudio),
        options: [
          {
            id: "papadR2Tel",
            value: getAssetAudioUrl(s3Assets.papadR2TelAudio),
            type: "audio",
          },
          {
            id: "familyR2Tel",
            value: getAssetAudioUrl(s3Assets.familyR2TelAudio),
            type: "audio",
          },
          {
            id: "guestR2Tel",
            value: getAssetAudioUrl(s3Assets.guestR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P47",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mealR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mealR2TelAudio),
        options: [
          {
            id: "mealR2Tel",
            value: getAssetAudioUrl(s3Assets.mealR2TelAudio),
            type: "audio",
          },
          {
            id: "skyR2Tel",
            value: getAssetAudioUrl(s3Assets.skyR2TelAudio),
            type: "audio",
          },
          {
            id: "papadR2Tel",
            value: getAssetAudioUrl(s3Assets.papadR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P48",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hibiscusR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hibiscusR2TelAudio),
        options: [
          {
            id: "hibiscusR2Tel",
            value: getAssetAudioUrl(s3Assets.hibiscusR2TelAudio),
            type: "audio",
          },
          {
            id: "mealR2Tel",
            value: getAssetAudioUrl(s3Assets.mealR2TelAudio),
            type: "audio",
          },
          {
            id: "throatR2Tel",
            value: getAssetAudioUrl(s3Assets.throatR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P49",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.throatR2TelImg),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.throatR2TelAudio),
        options: [
          {
            id: "throatR2Tel",
            value: getAssetAudioUrl(s3Assets.throatR2TelAudio),
            type: "audio",
          },
          {
            id: "hibiscusR2Tel",
            value: getAssetAudioUrl(s3Assets.hibiscusR2TelAudio),
            type: "audio",
          },
          {
            id: "umbrellaR2Tel",
            value: getAssetAudioUrl(s3Assets.umbrellaR2TelAudio),
            type: "audio",
          },
        ],
        flowName: "P50",
      },
    ],
  },
};

const colors = ["#4CDAFE", "#FC8AFF", "#FFB213"];

const styles = [
  {
    background: "linear-gradient(279.15deg, #0780B9 0%, #4CC5FF 90.43%)",
    boxShadow: "0px 0px 20px 8px #40B9F357",
  },
  {
    background: "linear-gradient(278.71deg, #C20281 0%, #FF4BC2 84.1%)",
    boxShadow: "0px 0px 20px 8px #FF4BC257",
  },
  {
    background: "linear-gradient(279.36deg, #710EDC 0%, #A856FF 100%)",
    boxShadow: "0px 0px 24px 8px #8224E757",
  },
];

const R2 = ({
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
  rStep,
  //onComplete,
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("1");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMatch, setIsMatch] = useState(null);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [step3Correct, setStep3Correct] = useState(false);
  const [step3Wrong, setStep3Wrong] = useState(false);
  //const [showConfetti, setShowConfetti] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTextThree, setSelectedTextThree] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lang = getLocalData("lang");
  const [handPhase, setHandPhase] = useState("audio");
  const [audioInstance, setAudioInstance] = useState(null);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const content = levelData[lang];

  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  steps = 1;

  const currentQuestion = content?.L1[currentQuestionIndex];

  const correctAnswerIndex = currentQuestion?.options?.findIndex(
    (option) => option.value === currentQuestion.answer
  );

  const correctAnswerPosition =
    correctAnswerIndex !== -1 ? correctAnswerIndex + 1 : null;

  const flowNames = [...new Set(content?.L1?.map((item) => item.flowName))];
  const activeFlow =
    content?.L1[currentQuestionIndex]?.flowName || flowNames[0];

  const stopLoader = () => {
    setSelectedCheckbox(null);
    setIsMatch(false);
    setShowRecordButton(true);
    setTimeout(() => {
      setShowReset(true);
    }, 3000);
  };

  //console.log("cq", currentQuestion, rStep);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) =>
  //       prev < content?.L1[currentQuestionIndex + 1]?.options.length - 1
  //         ? prev + 1
  //         : 0
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          stopLoader();
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const handleCheckboxChange = (text) => {
    setSelectedCheckbox(text);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (selectedCheckbox) {
      setProgress(0);
      handleAudioClick(selectedCheckbox);
      setShowNextButton(false);
    }
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const playAudio = (audioKey) => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (audioKey) {
      const audioElement = new Audio(audioKey);
      setHandPhase("audio");
      audioElement.play();
      setTimeout(() => {
        setHandPhase("checkbox");
      }, 1500);
      setAudioInstance(audioElement);
      setIsAudioPlaying(true);
      //audioElement.onended = () => setIsAudioPlaying(false);
      audioElement.onended = () => {
        setIsAudioPlaying(false);
        setTimeout(() => {
          setActiveIndex(
            (prev) =>
              (prev + 1) % content?.L1[currentQuestionIndex]?.options.length
          );
          setHandPhase("audio");
        }, 1500);
      };
    } else {
      console.error("Audio file not found:", audioKey);
    }
  };

  const reset = () => {
    setIsMatch(null);
    setSelectedText(null);
    setShowReset(false);
    setShowRecordButton(false);
    setProgress(0);
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const handleAudioClick = (text) => {
    setSelectedText(text);
    setSelectedCheckbox(null);
    if (text === content?.L1[currentQuestionIndex]?.answer) {
      setIsMatch(true);
      setShowConfetti(true);
      setShowRecordButton(true);
      const audio = new Audio(correctSound);
      audio.play();
      setRecording("no");
      setTimeout(() => {
        setIsMatch(null);
        setSelectedText(null);
        setShowConfetti(false);
        setShowRecordButton(false);
        if (currentQuestionIndex === content?.L1.length - 1) {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          setLocalData("rStep", 0);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
        } else {
          console.log("contents", content);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          response(
            {
              // Required
              target: "", // Required. Target of the response
              //"qid": "", // Required. Unique assessment/question id
              type: "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
              values: [
                { original_text: correctAnswerPosition },
                { level: "R2" },
                { isCorrect: "true" },
              ],
            },
            "ET"
          );
        }
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setSelectedCheckbox(null);
      setIsMatch(false);
      setShowRecordButton(true);
      setTimeout(() => {
        setShowReset(true);
      }, 3000);
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
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
      rStep={rStep}
      lang={lang}
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
      {currentQuestion?.question ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // background:
            //   "linear-gradient(128.49deg, rgb(158, 197, 255) 0%, rgb(225, 166, 248) 100%)",
            backgroundColor: "#FFFFFF",
          }}
        >
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}

          {step === "1" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {!showRecordButton && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  {/* Dog Image - Moves with Progress */}
                  <img
                    src={Assets.dogGif}
                    alt="Dog"
                    style={{
                      position: "relative",
                      left: `${(progress / 100) * 260}px`,
                      width: isMobile ? "45px" : "50px",
                      height: isMobile ? "50px" : "55px",
                      transition: "left 0.2s linear",
                      marginBottom: "-10px",
                      marginLeft: "-10px",
                    }}
                  />

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "280px",
                      height: "15px",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #F39F27",
                      position: "relative",
                    }}
                  >
                    {/* Progress Fill */}
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(0deg, #F19920 0%, #F39F27 23%, #F7B03B 58%, #FECC5C 100%)",
                        transition: "width 0.2s linear",
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  background: "#FF7F361A",
                  borderRadius: "20px",
                  padding: "20px 50px",
                  maxWidth: "50%",
                  height: "120px",
                  border: "2px dotted var(--Button-Orange, #FF7F36)",
                  //boxShadow: "0px 6px 0px 1px rgb(245, 245, 255)",
                  // boxShadow:
                  //   "rgb(245, 245, 255) 0px 6px 0px 1px, rgb(102, 102, 133) 0px 11px 0px 1px",
                }}
              >
                {/* <img
                        src={content.L1[0].stepOne.img}
                        alt="Ship"
                        style={{ width: "210px", height: "auto" }}
                      /> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    maxWidth: isMobile ? "90%" : "80%",
                    textAlign: "center",
                  }}
                >
                  {/* <span
                          style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            fontStyle: "Digitalt",
                            color: "#08B9FF",
                          }}
                        >
                          {content?.L1[currentQuestionIndex]?.question?.text}

                        </span> */}
                  <img
                    src={content?.L1[currentQuestionIndex]?.question?.img}
                    alt="Hint"
                    style={{
                      //position: "absolute",
                      //top: "-40px",
                      //left: "-30px",
                      //transform: "rotate(-45deg)",
                      height: "100px",
                    }}
                  />
                  {/* <img
                          src={listenImg}
                          alt="Listen"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={() => playAudio(content.L1[0].stepOne.correctAudio)}
                        /> */}
                </div>
              </div>

              {!showRecordButton &&
                content?.L1[currentQuestionIndex]?.options?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: isMobile ? "5px" : "50px",
                      marginTop: "20px",
                    }}
                  >
                    {content?.L1[currentQuestionIndex]?.options.map(
                      (audio, index) => {
                        const style = styles[index % styles.length];

                        return (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {index === activeIndex && (
                              <img
                                src={Assets.hintGif}
                                alt="Hint"
                                style={{
                                  position: "absolute",
                                  ...(handPhase === "audio"
                                    ? {
                                        bottom: "40px",
                                        left: "-30px",
                                        transform: "rotate(-120deg)",
                                      }
                                    : {
                                        bottom: "-50px",
                                        left: "-30px",
                                        transform: "rotate(-120deg)",
                                      }),
                                  height: isMobile ? "70px" : "80px",
                                  zIndex: "9999",
                                  transition: "all 0.3s ease",
                                }}
                              />
                            )}
                            <div
                              style={{
                                display: "flex",
                                //border: "2px solid white",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "#000000",
                                  fontFamily: "Quicksand",
                                  fontWeight: 700,
                                  fontSize: isMobile ? "20px" : "36px",
                                  lineHeight: "60px",
                                  letterSpacing: "0%",
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                {index + 1}
                              </span>
                              <div
                                style={{
                                  gap: "5px",
                                  width: isMobile ? "50px" : "80px",
                                  height: isMobile ? "50px" : "80px",
                                  background:
                                    selectedText === audio.value
                                      ? isMatch
                                        ? "#58CC02"
                                        : "#FF0000"
                                      : style.background,
                                  borderRadius: "50%",
                                  display: "flex",
                                  //border: "2px solid white",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  boxShadow:
                                    selectedText === audio.value
                                      ? "none"
                                      : style.boxShadow,
                                  cursor: "pointer",
                                  color: "#FFFFFF",
                                  filter:
                                    activeIndex !== index
                                      ? "brightness(50%)"
                                      : "none",
                                  transition: "filter 0.3s ease",
                                }}
                                onClick={() => {
                                  setActiveIndex(index);
                                  playAudio(audio.value);
                                }}
                              >
                                <img
                                  src={Assets.musicIcon}
                                  alt="Mike"
                                  style={{
                                    width: isMobile ? "30px" : "40px",
                                    height: isMobile ? "30px" : "40px",
                                    cursor: "pointer",
                                  }}
                                />
                                {/* {index + 1} */}
                              </div>
                            </div>
                            {/* <input
                              type="checkbox"
                              id={`checkbox-${audio.id}`}
                              checked={selectedCheckbox === audio.value}
                              onChange={() => handleCheckboxChange(audio.value)}
                              style={{
                                width: "60px",
                                height: "60px",
                                appearance: "none",
                                backgroundColor:
                                  selectedCheckbox === audio.value
                                    ? "#58CC02"
                                    : "#BB81D066",
                                border: "2px solid white",
                                borderRadius: "8px",
                                cursor: "pointer",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                                marginLeft: "30px",
                              }}
                            /> */}
                            <div
                              style={{
                                width: isMobile ? "50px" : "60px",
                                height: isMobile ? "50px" : "60px",
                                backgroundColor:
                                  selectedCheckbox === audio.value
                                    ? "#58CC02"
                                    : "#BB81D066",
                                border: "2px solid white",
                                borderRadius: "8px",
                                cursor: "pointer",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                                marginLeft: isMobile ? "20px" : "30px",
                              }}
                              onClick={() => handleCheckboxChange(audio.value)}
                            >
                              <input
                                type="checkbox"
                                id={`checkbox-${audio.id}`}
                                checked={selectedCheckbox === audio.value}
                                readOnly
                                style={{
                                  display: "none", // hide the native checkbox
                                }}
                              />
                              {/* {selectedCheckbox === audio.value && ( */}
                              <span
                                style={{
                                  fontSize: isMobile ? "24px" : "36px",
                                  fontWeight: "900",
                                  color: "white",
                                  lineHeight: 1,
                                }}
                              >
                                ✓
                              </span>
                              {/* )} */}
                            </div>

                            {/* {selectedCheckbox === audio.text && (
                            <div
                              style={{
                                position: "absolute",
                                width: "60px",
                                height: "245px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )} */}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {showNextButton && (
                <div
                  style={{
                    position: isMobile ? "none" : "fixed",
                    bottom: "180px",
                    right: "60px",
                    zIndex: 1000,
                  }}
                >
                  <div onClick={handleNextClick} style={{ cursor: "pointer" }}>
                    <NextButtonRound
                      height={isMobile ? 45 : 60}
                      width={isMobile ? 45 : 60}
                    />
                  </div>
                </div>
              )}

              {showRecordButton && !showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={isMatch ? Assets.correctTick : Assets.r3WrongTick}
                    alt="Effect"
                    style={{
                      height: isMobile ? "45px" : "80px",
                      transition: "opacity 0.4s ease-in-out",
                    }}
                  />
                </div>
              )}

              {showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={Assets.r3Reset}
                    alt="Effect"
                    style={{
                      height: isMobile ? "45px" : "80px",
                      transition: "opacity 0.4s ease-in-out",
                      cursor: "pointer",
                    }}
                    onClick={reset}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px" }}>{currentQuestion.word}</h2>
          {currentQuestion.img && (
            <img
              src={currentQuestion.img}
              alt={currentQuestion.word}
              style={{ width: "120px", height: "120px" }}
            />
          )}
          <div style={{ marginTop: "20px" }}>
            {recording === "no" ? (
              <img
                onClick={() => setRecording("startRec")}
                src={Assets.mic}
                alt="Start Recording"
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "80px",
                  margin: "20px 20px",
                }}
              >
                <RecordVoiceVisualizer />
                <img
                  onClick={() => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    if (currentQuestionIndex === content.L1.length - 1) {
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      setLocalData("rStep", 0);
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
                      }
                    } else {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    }
                  }}
                  src={Assets.pause}
                  alt="Stop Recording"
                  style={{ width: "60px", height: "60px", cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default R2;
