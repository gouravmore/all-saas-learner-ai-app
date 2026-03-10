import React, { useState, useEffect, useMemo } from "react";
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
import {
  updateLearnerProfile,
  getSetResultPractice,
} from "../services/learnerAi/learnerAiService";
import { addLesson } from "../services/orchestration/orchestrationService";

const theme = createTheme();

// Word Hunt (Sound Match) - Listen to Sound and choose the right word
const soundMatchContent = {
  en: {
    1: [
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.cookImg),
            text: "cook",
            audio: getAssetAudioUrl(s3Assets.cookAudio),
          },
          {
            img: getAssetUrl(s3Assets.godImg2),
            text: "god",
            audio: getAssetAudioUrl(s3Assets.godAudio2),
          },
          {
            img: getAssetUrl(s3Assets.badImg),
            text: "bad",
            audio: getAssetAudioUrl(s3Assets.badAudio),
          },
        ],
        correctWord: "bad",
        audio: getAssetAudioUrl(s3Assets.badAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.godImg2),
            text: "god",
            audio: getAssetAudioUrl(s3Assets.godAudio2),
          },
          {
            img: getAssetUrl(s3Assets.momImg),
            text: "mom",
            audio: getAssetAudioUrl(s3Assets.momAudio),
          },
          {
            img: getAssetUrl(s3Assets.goatImg),
            text: "goat",
            audio: getAssetAudioUrl(s3Assets.goatAudio),
          },
        ],
        correctWord: "mom",
        audio: getAssetAudioUrl(s3Assets.momAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.hopImg),
            text: "hop",
            audio: getAssetAudioUrl(s3Assets.hopAudio),
          },
          {
            img: getAssetUrl(s3Assets.fatImg),
            text: "fat",
            audio: getAssetAudioUrl(s3Assets.fatAudio),
          },
          {
            img: getAssetUrl(s3Assets.cookImg),
            text: "cook",
            audio: getAssetAudioUrl(s3Assets.cookAudio),
          },
        ],
        correctWord: "hop",
        audio: getAssetAudioUrl(s3Assets.hopAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.fatImg),
            text: "fat",
            audio: getAssetAudioUrl(s3Assets.fatAudio),
          },
          {
            img: getAssetUrl(s3Assets.momImg),
            text: "mom",
            audio: getAssetAudioUrl(s3Assets.momAudio),
          },
          {
            img: getAssetUrl(s3Assets.sadImg),
            text: "sad",
            audio: getAssetAudioUrl(s3Assets.sadAudio),
          },
        ],
        correctWord: "fat",
        audio: getAssetAudioUrl(s3Assets.fatAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.goatImg),
            text: "goat",
            audio: getAssetAudioUrl(s3Assets.goatAudio),
          },
          {
            img: getAssetUrl(s3Assets.nineImg),
            text: "nine",
            audio: getAssetAudioUrl(s3Assets.nineAudio),
          },
          {
            img: getAssetUrl(s3Assets.himImg),
            text: "him",
            audio: getAssetAudioUrl(s3Assets.himAudio),
          },
        ],
        correctWord: "him",
        audio: getAssetAudioUrl(s3Assets.himAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.godImg2),
            text: "god",
            audio: getAssetAudioUrl(s3Assets.godAudio2),
          },
          {
            img: getAssetUrl(s3Assets.fatImg),
            text: "fat",
            audio: getAssetAudioUrl(s3Assets.fatAudio),
          },
          {
            img: getAssetUrl(s3Assets.sadImg),
            text: "sad",
            audio: getAssetAudioUrl(s3Assets.sadAudio),
          },
        ],
        correctWord: "sad",
        audio: getAssetAudioUrl(s3Assets.sadAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.godImg2),
            text: "god",
            audio: getAssetAudioUrl(s3Assets.godAudio2),
          },
          {
            img: getAssetUrl(s3Assets.cookImg),
            text: "cook",
            audio: getAssetAudioUrl(s3Assets.cookAudio),
          },
          {
            img: getAssetUrl(s3Assets.goatImg),
            text: "goat",
            audio: getAssetAudioUrl(s3Assets.goatAudio),
          },
        ],
        correctWord: "cook",
        audio: getAssetAudioUrl(s3Assets.cookAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.godImg2),
            text: "god",
            audio: getAssetAudioUrl(s3Assets.godAudio2),
          },
          {
            img: getAssetUrl(s3Assets.nineImg),
            text: "nine",
            audio: getAssetAudioUrl(s3Assets.nineAudio),
          },
          {
            img: getAssetUrl(s3Assets.fatImg),
            text: "fat",
            audio: getAssetAudioUrl(s3Assets.fatAudio),
          },
        ],
        correctWord: "god",
        audio: getAssetAudioUrl(s3Assets.godAudio2),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.cookImg),
            text: "cook",
            audio: getAssetAudioUrl(s3Assets.cookAudio),
          },
          {
            img: getAssetUrl(s3Assets.nineImg),
            text: "nine",
            audio: getAssetAudioUrl(s3Assets.nineAudio),
          },
          {
            img: getAssetUrl(s3Assets.fatImg),
            text: "fat",
            audio: getAssetAudioUrl(s3Assets.fatAudio),
          },
        ],
        correctWord: "nine",
        audio: getAssetAudioUrl(s3Assets.nineAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.goatImg),
            text: "goat",
            audio: getAssetAudioUrl(s3Assets.goatAudio),
          },
          {
            img: getAssetUrl(s3Assets.badImg),
            text: "bad",
            audio: getAssetAudioUrl(s3Assets.badAudio),
          },
          {
            img: getAssetUrl(s3Assets.cookImg),
            text: "cook",
            audio: getAssetAudioUrl(s3Assets.cookAudio),
          },
        ],
        correctWord: "goat",
        audio: getAssetAudioUrl(s3Assets.goatAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.wideImg),
            text: "wide",
            audio: getAssetAudioUrl(s3Assets.wideAudio),
          },
          {
            img: getAssetUrl(s3Assets.noteImg),
            text: "note",
            audio: getAssetAudioUrl(s3Assets.noteAudio),
          },
          {
            img: getAssetUrl(s3Assets.buyImg),
            text: "buy",
            audio: getAssetAudioUrl(s3Assets.buyAudio),
          },
        ],
        correctWord: "buy",
        audio: getAssetAudioUrl(s3Assets.buyAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.happy2Img),
            text: "happy",
            audio: getAssetAudioUrl(s3Assets.happy3Audio),
          },
          {
            img: getAssetUrl(s3Assets.wideImg),
            text: "wide",
            audio: getAssetAudioUrl(s3Assets.wideAudio),
          },
          {
            img: getAssetUrl(s3Assets.fineImg),
            text: "fine",
            audio: getAssetAudioUrl(s3Assets.fineAudio),
          },
        ],
        correctWord: "fine",
        audio: getAssetAudioUrl(s3Assets.fineAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.kindImg),
            text: "kind",
            audio: getAssetAudioUrl(s3Assets.kindAudio),
          },
          {
            img: getAssetUrl(s3Assets.bodyImg),
            text: "body",
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
          },
          {
            img: getAssetUrl(s3Assets.buyImg),
            text: "buy",
            audio: getAssetAudioUrl(s3Assets.buyAudio),
          },
        ],
        correctWord: "kind",
        audio: getAssetAudioUrl(s3Assets.kindAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.fineImg),
            text: "fine",
            audio: getAssetAudioUrl(s3Assets.fineAudio),
          },
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
          {
            img: getAssetUrl(s3Assets.noteImg),
            text: "note",
            audio: getAssetAudioUrl(s3Assets.noteAudio),
          },
        ],
        correctWord: "note",
        audio: getAssetAudioUrl(s3Assets.noteAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.happy2Img),
            text: "happy",
            audio: getAssetAudioUrl(s3Assets.happy3Audio),
          },
          {
            img: getAssetUrl(s3Assets.wideImg),
            text: "wide",
            audio: getAssetAudioUrl(s3Assets.wideAudio),
          },
          {
            img: getAssetUrl(s3Assets.hideImg),
            text: "hide",
            audio: getAssetAudioUrl(s3Assets.hideAudio),
          },
        ],
        correctWord: "wide",
        audio: getAssetAudioUrl(s3Assets.wideAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
          {
            img: getAssetUrl(s3Assets.knowImg),
            text: "know",
            audio: getAssetAudioUrl(s3Assets.knowAudio),
          },
          {
            img: getAssetUrl(s3Assets.hideImg),
            text: "hide",
            audio: getAssetAudioUrl(s3Assets.hideAudio),
          },
        ],
        correctWord: "know",
        audio: getAssetAudioUrl(s3Assets.knowAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.fineImg),
            text: "fine",
            audio: getAssetAudioUrl(s3Assets.fineAudio),
          },
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
          {
            img: getAssetUrl(s3Assets.bodyImg),
            text: "body",
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
          },
        ],
        correctWord: "half",
        audio: getAssetAudioUrl(s3Assets.halfAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.buyImg),
            text: "buy",
            audio: getAssetAudioUrl(s3Assets.buyAudio),
          },
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
          {
            img: getAssetUrl(s3Assets.hideImg),
            text: "hide",
            audio: getAssetAudioUrl(s3Assets.hideAudio),
          },
        ],
        correctWord: "hide",
        audio: getAssetAudioUrl(s3Assets.hideAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.knowImg),
            text: "know",
            audio: getAssetAudioUrl(s3Assets.knowAudio),
          },
          {
            img: getAssetUrl(s3Assets.happy2Img),
            text: "happy",
            audio: getAssetAudioUrl(s3Assets.happy3Audio),
          },
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
        ],
        correctWord: "happy",
        audio: getAssetAudioUrl(s3Assets.happy3Audio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.halfImg),
            text: "half",
            audio: getAssetAudioUrl(s3Assets.halfAudio),
          },
          {
            img: getAssetUrl(s3Assets.bodyImg),
            text: "body",
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
          },
          {
            img: getAssetUrl(s3Assets.knowImg),
            text: "know",
            audio: getAssetAudioUrl(s3Assets.knowAudio),
          },
        ],
        correctWord: "body",
        audio: getAssetAudioUrl(s3Assets.bodyAudio),
        flowName: "S2",
        type: "soundMatch",
      },
    ],

    2: [
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.sonImg),
            text: "Son",
            audio: getAssetAudioUrl(s3Assets.sonAudio),
          },
          {
            img: getAssetUrl(s3Assets.chairImg),
            text: "chair",
            audio: getAssetAudioUrl(s3Assets.chairAudio),
          },
          {
            img: getAssetUrl(s3Assets.fairImg),
            text: "fair",
            audio: getAssetAudioUrl(s3Assets.fairAudio),
          },
        ],
        correctWord: "Son",
        audio: getAssetAudioUrl(s3Assets.sonAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.zigImg),
            text: "zig",
            audio: getAssetAudioUrl(s3Assets.zigAudio),
          },
          {
            img: getAssetUrl(s3Assets.fairImg),
            text: "fair",
            audio: getAssetAudioUrl(s3Assets.fairAudio),
          },
          {
            img: getAssetUrl(s3Assets.chatImg),
            text: "chat",
            audio: getAssetAudioUrl(s3Assets.chatAudio),
          },
        ],
        correctWord: "zig",
        audio: getAssetAudioUrl(s3Assets.zigAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.logImg),
            text: "log",
            audio: getAssetAudioUrl(s3Assets.logAudio),
          },
          {
            img: getAssetUrl(s3Assets.sonImg),
            text: "Son",
            audio: getAssetAudioUrl(s3Assets.sonAudio),
          },
          {
            img: getAssetUrl(s3Assets.birdImg2),
            text: "bird",
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
          },
        ],
        correctWord: "log",
        audio: getAssetAudioUrl(s3Assets.logAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.penImg),
            text: "pen",
            audio: getAssetAudioUrl(s3Assets.penAudio),
          },
          {
            img: getAssetUrl(s3Assets.nowImg),
            text: "now",
            audio: getAssetAudioUrl(s3Assets.nowAudio),
          },
          {
            img: getAssetUrl(s3Assets.fairImg),
            text: "fair",
            audio: getAssetAudioUrl(s3Assets.fairAudio),
          },
        ],
        correctWord: "now",
        audio: getAssetAudioUrl(s3Assets.nowAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.chatImg),
            text: "chat",
            audio: getAssetAudioUrl(s3Assets.chatAudio),
          },
          {
            img: getAssetUrl(s3Assets.sonImg),
            text: "Son",
            audio: getAssetAudioUrl(s3Assets.sonAudio),
          },
          {
            img: getAssetUrl(s3Assets.nowImg),
            text: "now",
            audio: getAssetAudioUrl(s3Assets.nowAudio),
          },
        ],
        correctWord: "chat",
        audio: getAssetAudioUrl(s3Assets.chatAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.logImg),
            text: "log",
            audio: getAssetAudioUrl(s3Assets.logAudio),
          },
          {
            img: getAssetUrl(s3Assets.chatImg),
            text: "chat",
            audio: getAssetAudioUrl(s3Assets.chatAudio),
          },
          {
            img: getAssetUrl(s3Assets.penImg),
            text: "pen",
            audio: getAssetAudioUrl(s3Assets.penAudio),
          },
        ],
        correctWord: "pen",
        audio: getAssetAudioUrl(s3Assets.penAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.nowImg),
            text: "now",
            audio: getAssetAudioUrl(s3Assets.nowAudio),
          },
          {
            img: getAssetUrl(s3Assets.birdImg2),
            text: "bird",
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
          },
          {
            img: getAssetUrl(s3Assets.fairImg),
            text: "fair",
            audio: getAssetAudioUrl(s3Assets.fairAudio),
          },
        ],
        correctWord: "fair",
        audio: getAssetAudioUrl(s3Assets.fairAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.birdImg2),
            text: "bird",
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
          },
          {
            img: getAssetUrl(s3Assets.careImg),
            text: "care",
            audio: getAssetAudioUrl(s3Assets.careAudio),
          },
          {
            img: getAssetUrl(s3Assets.zigImg),
            text: "zig",
            audio: getAssetAudioUrl(s3Assets.zigAudio),
          },
        ],
        correctWord: "care",
        audio: getAssetAudioUrl(s3Assets.careAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.zigImg),
            text: "zig",
            audio: getAssetAudioUrl(s3Assets.zigAudio),
          },
          {
            img: getAssetUrl(s3Assets.chatImg),
            text: "chat",
            audio: getAssetAudioUrl(s3Assets.chatAudio),
          },
          {
            img: getAssetUrl(s3Assets.birdImg2),
            text: "bird",
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
          },
        ],
        correctWord: "bird",
        audio: getAssetAudioUrl(s3Assets.birdAudio2),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.careImg),
            text: "care",
            audio: getAssetAudioUrl(s3Assets.careAudio),
          },
          {
            img: getAssetUrl(s3Assets.logImg),
            text: "log",
            audio: getAssetAudioUrl(s3Assets.logAudio),
          },
          {
            img: getAssetUrl(s3Assets.chairImg),
            text: "chair",
            audio: getAssetAudioUrl(s3Assets.chairAudio),
          },
        ],
        correctWord: "chair",
        audio: getAssetAudioUrl(s3Assets.chairAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.orangeImg),
            text: "orange",
            audio: getAssetAudioUrl(s3Assets.orangeAudio),
          },
          {
            img: getAssetUrl(s3Assets.turnImg),
            text: "turn",
            audio: getAssetAudioUrl(s3Assets.turnAudio),
          },
          {
            img: getAssetUrl(s3Assets.dearImg),
            text: "dear",
            audio: getAssetAudioUrl(s3Assets.dearAudio),
          },
        ],
        correctWord: "turn",
        audio: getAssetAudioUrl(s3Assets.turnAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.earthImg2),
            text: "earth",
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
          },
          {
            img: getAssetUrl(s3Assets.sootheImg),
            text: "soothe",
            audio: getAssetAudioUrl(s3Assets.sootheAudio),
          },
          {
            img: getAssetUrl(s3Assets.dearImg),
            text: "dear",
            audio: getAssetAudioUrl(s3Assets.dearAudio),
          },
        ],
        correctWord: "soothe",
        audio: getAssetAudioUrl(s3Assets.sootheAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.lazyImg),
            text: "lazy",
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
          },
          {
            img: getAssetUrl(s3Assets.perkImg),
            text: "perk",
            audio: getAssetAudioUrl(s3Assets.perkAudio),
          },
          {
            img: getAssetUrl(s3Assets.earImg),
            text: "ear",
            audio: getAssetAudioUrl(s3Assets.earAudio),
          },
        ],
        correctWord: "perk",
        audio: getAssetAudioUrl(s3Assets.perkAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.earthImg2),
            text: "earth",
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
          },
          {
            img: getAssetUrl(s3Assets.royalImg),
            text: "royal",
            audio: getAssetAudioUrl(s3Assets.royalAudio),
          },
          {
            img: getAssetUrl(s3Assets.dearImg),
            text: "dear",
            audio: getAssetAudioUrl(s3Assets.dearAudio),
          },
        ],
        correctWord: "dear",
        audio: getAssetAudioUrl(s3Assets.dearAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.perkImg),
            text: "perk",
            audio: getAssetAudioUrl(s3Assets.perkAudio),
          },
          {
            img: getAssetUrl(s3Assets.purpleImg2),
            text: "purple",
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          },
          {
            img: getAssetUrl(s3Assets.royalImg),
            text: "royal",
            audio: getAssetAudioUrl(s3Assets.royalAudio),
          },
        ],
        correctWord: "royal",
        audio: getAssetAudioUrl(s3Assets.royalAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.dearImg),
            text: "dear",
            audio: getAssetAudioUrl(s3Assets.dearAudio),
          },
          {
            img: getAssetUrl(s3Assets.earImg),
            text: "ear",
            audio: getAssetAudioUrl(s3Assets.earAudio),
          },
          {
            img: getAssetUrl(s3Assets.royalImg),
            text: "royal",
            audio: getAssetAudioUrl(s3Assets.royalAudio),
          },
        ],
        correctWord: "ear",
        audio: getAssetAudioUrl(s3Assets.earAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.lazyImg),
            text: "lazy",
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
          },
          {
            img: getAssetUrl(s3Assets.earthImg2),
            text: "earth",
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
          },
          {
            img: getAssetUrl(s3Assets.purpleImg2),
            text: "purple",
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          },
        ],
        correctWord: "lazy",
        audio: getAssetAudioUrl(s3Assets.lazyAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.sootheImg),
            text: "soothe",
            audio: getAssetAudioUrl(s3Assets.sootheAudio),
          },
          {
            img: getAssetUrl(s3Assets.perkImg),
            text: "perk",
            audio: getAssetAudioUrl(s3Assets.perkAudio),
          },
          {
            img: getAssetUrl(s3Assets.orangeImg),
            text: "orange",
            audio: getAssetAudioUrl(s3Assets.orangeAudio),
          },
        ],
        correctWord: "orange",
        audio: getAssetAudioUrl(s3Assets.orangeAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.earImg),
            text: "ear",
            audio: getAssetAudioUrl(s3Assets.earAudio),
          },
          {
            img: getAssetUrl(s3Assets.perkImg),
            text: "perk",
            audio: getAssetAudioUrl(s3Assets.perkAudio),
          },
          {
            img: getAssetUrl(s3Assets.purpleImg2),
            text: "purple",
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          },
        ],
        correctWord: "purple",
        audio: getAssetAudioUrl(s3Assets.purpleAudio2),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.purpleImg2),
            text: "purple",
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          },
          {
            img: getAssetUrl(s3Assets.earthImg2),
            text: "earth",
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
          },
          {
            img: getAssetUrl(s3Assets.lazyImg),
            text: "lazy",
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
          },
        ],
        correctWord: "earth",
        audio: getAssetAudioUrl(s3Assets.earthAudio2),
        flowName: "S2",
        type: "soundMatch",
      },
    ],
  },
  te: {
    1: [
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.జకImg),
            text: "జింక",
            audio: getAssetAudioUrl(s3Assets.జకAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఝషImg),
            text: "ఝషం",
            audio: getAssetAudioUrl(s3Assets.ఝషAudio),
          },
          {
            img: getAssetUrl(s3Assets.కజరImg),
            text: "కంజర",
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
          },
        ],
        correctWord: "ఝషం",
        audio: getAssetAudioUrl(s3Assets.ఝషAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.తలగడImg),
            text: "తలగడ",
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.మడImg),
            text: "మూడు",
            audio: getAssetAudioUrl(s3Assets.మడAudio),
          },
          {
            img: getAssetUrl(s3Assets.గటImg),
            text: "గంట",
            audio: getAssetAudioUrl(s3Assets.గటAudio),
          },
        ],
        correctWord: "గంట",
        audio: getAssetAudioUrl(s3Assets.గటAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.జమImg),
            text: "జామ",
            audio: getAssetAudioUrl(s3Assets.జమAudio),
          },
          {
            img: getAssetUrl(s3Assets.పడవImg),
            text: "పడవ",
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
          },
          {
            img: getAssetUrl(s3Assets.తలగడImg),
            text: "తలగడ",
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
          },
        ],
        correctWord: "పడవ",
        audio: getAssetAudioUrl(s3Assets.పడవAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.గటImg),
            text: "గంట",
            audio: getAssetAudioUrl(s3Assets.గటAudio),
          },
          {
            img: getAssetUrl(s3Assets.తలగడImg),
            text: "తలగడ",
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.దడImg),
            text: "దండం",
            audio: getAssetAudioUrl(s3Assets.దడAudio),
          },
        ],
        correctWord: "తలగడ",
        audio: getAssetAudioUrl(s3Assets.తలగడAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.జమImg),
            text: "జామ",
            audio: getAssetAudioUrl(s3Assets.జమAudio),
          },
          {
            img: getAssetUrl(s3Assets.దడImg),
            text: "దండం",
            audio: getAssetAudioUrl(s3Assets.దడAudio),
          },
          {
            img: getAssetUrl(s3Assets.పడవImg),
            text: "పడవ",
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
          },
        ],
        correctWord: "జామ",
        audio: getAssetAudioUrl(s3Assets.జమAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.కజరImg),
            text: "కంజర",
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
          },
          {
            img: getAssetUrl(s3Assets.జలImg),
            text: "జలం",
            audio: getAssetAudioUrl(s3Assets.జలAudio),
          },
          {
            img: getAssetUrl(s3Assets.పడవImg),
            text: "పడవ",
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
          },
        ],
        correctWord: "జలం",
        audio: getAssetAudioUrl(s3Assets.జలAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.జకImg),
            text: "జింక",
            audio: getAssetAudioUrl(s3Assets.జకAudio),
          },
          {
            img: getAssetUrl(s3Assets.గటImg),
            text: "గంట",
            audio: getAssetAudioUrl(s3Assets.గటAudio),
          },
          {
            img: getAssetUrl(s3Assets.పడవImg),
            text: "పడవ",
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
          },
        ],
        correctWord: "జింక",
        audio: getAssetAudioUrl(s3Assets.జకAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.దడImg),
            text: "దండం",
            audio: getAssetAudioUrl(s3Assets.దడAudio),
          },
          {
            img: getAssetUrl(s3Assets.జమImg),
            text: "జామ",
            audio: getAssetAudioUrl(s3Assets.జమAudio),
          },
          {
            img: getAssetUrl(s3Assets.జలImg),
            text: "జలం",
            audio: getAssetAudioUrl(s3Assets.జలAudio),
          },
        ],
        correctWord: "దండం",
        audio: getAssetAudioUrl(s3Assets.దడAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.మడImg),
            text: "మూడు",
            audio: getAssetAudioUrl(s3Assets.మడAudio),
          },
          {
            img: getAssetUrl(s3Assets.దడImg),
            text: "దండం",
            audio: getAssetAudioUrl(s3Assets.దడAudio),
          },
          {
            img: getAssetUrl(s3Assets.కజరImg),
            text: "కంజర",
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
          },
        ],
        correctWord: "కంజర",
        audio: getAssetAudioUrl(s3Assets.కజరAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పడవImg),
            text: "పడవ",
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
          },
          {
            img: getAssetUrl(s3Assets.మడImg),
            text: "మూడు",
            audio: getAssetAudioUrl(s3Assets.మడAudio),
          },
          {
            img: getAssetUrl(s3Assets.జలImg),
            text: "జలం",
            audio: getAssetAudioUrl(s3Assets.జలAudio),
          },
        ],
        correctWord: "మూడు",
        audio: getAssetAudioUrl(s3Assets.మడAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.ఏనగImg),
            text: "ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
          },
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పంజరం",
            audio: getAssetAudioUrl(s3Assets.పజర2Audio),
          },
          {
            img: getAssetUrl(s3Assets.కడImg),
            text: "కోడి",
            audio: getAssetAudioUrl(s3Assets.కడAudio),
          },
        ],
        correctWord: "కోడి",
        audio: getAssetAudioUrl(s3Assets.కడAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.తళImg),
            text: "తాళం",
            audio: getAssetAudioUrl(s3Assets.తళAudio),
          },
          {
            img: getAssetUrl(s3Assets.చయImg),
            text: "చేయి",
            audio: getAssetAudioUrl(s3Assets.చయAudio),
          },
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
        ],
        correctWord: "తాళం",
        audio: getAssetAudioUrl(s3Assets.తళAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చయImg),
            text: "చేయి",
            audio: getAssetAudioUrl(s3Assets.చయAudio),
          },
          {
            img: getAssetUrl(s3Assets.కలశImg),
            text: "కలశం",
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
          },
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
        ],
        correctWord: "చేయి",
        audio: getAssetAudioUrl(s3Assets.చయAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
          {
            img: getAssetUrl(s3Assets.చయImg),
            text: "చేయి",
            audio: getAssetAudioUrl(s3Assets.చయAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఉడతImg),
            text: "ఉడుత",
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
          },
        ],
        correctWord: "ఉడుత",
        audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.కతలImg),
            text: "కోతులు",
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
          },
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
          {
            img: getAssetUrl(s3Assets.ఏనగImg),
            text: "ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
          },
        ],
        correctWord: "కోతులు",
        audio: getAssetAudioUrl(s3Assets.కతలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.సనమImg),
            text: "సినిమా",
            audio: getAssetAudioUrl(s3Assets.సనమAudio),
          },
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
          {
            img: getAssetUrl(s3Assets.కలశImg),
            text: "కలశం",
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
          },
        ],
        correctWord: "సినిమా",
        audio: getAssetAudioUrl(s3Assets.సనమAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
          {
            img: getAssetUrl(s3Assets.కలశImg),
            text: "కలశం",
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
          },
          {
            img: getAssetUrl(s3Assets.కతలImg),
            text: "కోతులు",
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
          },
        ],
        correctWord: "నూరు",
        audio: getAssetAudioUrl(s3Assets.నరAudio2),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.కలశImg),
            text: "కలశం",
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
          },
          {
            img: getAssetUrl(s3Assets.నరImg2),
            text: "నూరు",
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
          },
          {
            img: getAssetUrl(s3Assets.కతలImg),
            text: "కోతులు",
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
          },
        ],
        correctWord: "కలశం",
        audio: getAssetAudioUrl(s3Assets.కలశAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.కతలImg),
            text: "కోతులు",
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఏనగImg),
            text: "ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఉడతImg),
            text: "ఉడుత",
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
          },
        ],
        correctWord: "ఏనుగు",
        audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.ఉడతImg),
            text: "ఉడుత",
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
          },
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పంజరం",
            audio: getAssetAudioUrl(s3Assets.పజర2Audio),
          },
          {
            img: getAssetUrl(s3Assets.ఏనగImg),
            text: "ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
          },
        ],
        correctWord: "పంజరం",
        audio: getAssetAudioUrl(s3Assets.పజర2Audio),
        flowName: "S2",
        type: "soundMatch",
      },
    ],
    2: [
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చకకImg),
            text: "చెక్క",
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.వమనImg),
            text: "విమానం",
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
          },
          {
            img: getAssetUrl(s3Assets.కరటImg),
            text: "కిరీటం",
            audio: getAssetAudioUrl(s3Assets.కరటAudio),
          },
        ],
        correctWord: "కిరీటం",
        audio: getAssetAudioUrl(s3Assets.కరటAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పూజారి",
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
          },
          {
            img: getAssetUrl(s3Assets.చకకImg),
            text: "చెక్క",
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.మకడImg),
            text: "మూకుడు",
            audio: getAssetAudioUrl(s3Assets.మకడAudio),
          },
        ],
        correctWord: "మూకుడు",
        audio: getAssetAudioUrl(s3Assets.మకడAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.మసలImg),
            text: "మొసలి",
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
          },
          {
            img: getAssetUrl(s3Assets.అభనయImg),
            text: "అభినయం",
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
          },
          {
            img: getAssetUrl(s3Assets.వమనImg),
            text: "విమానం",
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
          },
        ],
        correctWord: "అభినయం",
        audio: getAssetAudioUrl(s3Assets.అభనయAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పూజారి",
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
          },
          {
            img: getAssetUrl(s3Assets.తపపImg),
            text: "తప్పు",
            audio: getAssetAudioUrl(s3Assets.తపపAudio),
          },
          {
            img: getAssetUrl(s3Assets.కరటImg),
            text: "కిరీటం",
            audio: getAssetAudioUrl(s3Assets.కరటAudio),
          },
        ],
        correctWord: "తప్పు",
        audio: getAssetAudioUrl(s3Assets.తపపAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బడకయImg),
            text: "బెండకాయ",
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
          },
          {
            img: getAssetUrl(s3Assets.చకకImg),
            text: "చెక్క",
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.మకడImg),
            text: "మూకుడు",
            audio: getAssetAudioUrl(s3Assets.మకడAudio),
          },
        ],
        correctWord: "చెక్క",
        audio: getAssetAudioUrl(s3Assets.చకకAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.మసలImg),
            text: "మొసలి",
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
          },
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పూజారి",
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
          },
          {
            img: getAssetUrl(s3Assets.చకకImg),
            text: "చెక్క",
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
          },
        ],
        correctWord: "మొసలి",
        audio: getAssetAudioUrl(s3Assets.మసలAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బమమImg),
            text: "బొమ్మ",
            audio: getAssetAudioUrl(s3Assets.బమమAudio),
          },
          {
            img: getAssetUrl(s3Assets.అభనయImg),
            text: "అభినయం",
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
          },
          {
            img: getAssetUrl(s3Assets.బడకయImg),
            text: "బెండకాయ",
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
          },
        ],
        correctWord: "బెండకాయ",
        audio: getAssetAudioUrl(s3Assets.బడకయAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.వమనImg),
            text: "విమానం",
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
          },
          {
            img: getAssetUrl(s3Assets.తపపImg),
            text: "తప్పు",
            audio: getAssetAudioUrl(s3Assets.తపపAudio),
          },
          {
            img: getAssetUrl(s3Assets.మసలImg),
            text: "మొసలి",
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
          },
        ],
        correctWord: "విమానం",
        audio: getAssetAudioUrl(s3Assets.వమనAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చకకImg),
            text: "చెక్క",
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.బమమImg),
            text: "బొమ్మ",
            audio: getAssetAudioUrl(s3Assets.బమమAudio),
          },
          {
            img: getAssetUrl(s3Assets.మసలImg),
            text: "మొసలి",
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
          },
        ],
        correctWord: "బొమ్మ",
        audio: getAssetAudioUrl(s3Assets.బమమAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అభనయImg),
            text: "అభినయం",
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
          },
          {
            img: getAssetUrl(s3Assets.పజరImg),
            text: "పూజారి",
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
          },
          {
            img: getAssetUrl(s3Assets.బడకయImg),
            text: "బెండకాయ",
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
          },
        ],
        correctWord: "పూజారి",
        audio: getAssetAudioUrl(s3Assets.పజరAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.వదయలImg),
            text: "వాద్యాల",
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
          },
          {
            img: getAssetUrl(s3Assets.దరవజImg),
            text: "దర్వాజ",
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
          },
          {
            img: getAssetUrl(s3Assets.వకషImg),
            text: "వృక్షం",
            audio: getAssetAudioUrl(s3Assets.వకషAudio),
          },
        ],
        correctWord: "దర్వాజ",
        audio: getAssetAudioUrl(s3Assets.దరవజAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.వదయలImg),
            text: "వాద్యాల",
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
          },
          {
            img: getAssetUrl(s3Assets.దరవజImg),
            text: "దర్వాజ",
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
          },
          {
            img: getAssetUrl(s3Assets.వననలImg),
            text: "వెన్నెల",
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
          },
        ],
        correctWord: "వాద్యాల",
        audio: getAssetAudioUrl(s3Assets.వదయలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బరరకథImg),
            text: "బుర్రకథ",
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
          },
          {
            img: getAssetUrl(s3Assets.వదయలImg),
            text: "వాద్యాల",
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
          },
          {
            img: getAssetUrl(s3Assets.వకషImg),
            text: "వృక్షం",
            audio: getAssetAudioUrl(s3Assets.వకషAudio),
          },
        ],
        correctWord: "వృక్షం",
        audio: getAssetAudioUrl(s3Assets.వకషAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పరపచImg),
            text: "ప్రపంచం",
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఇలలImg),
            text: "ఇల్లు",
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.బరరకథImg),
            text: "బుర్రకథ",
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
          },
        ],
        correctWord: "ప్రపంచం",
        audio: getAssetAudioUrl(s3Assets.పరపచAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చననImg),
            text: "చిన్ని",
            audio: getAssetAudioUrl(s3Assets.చననAudio),
          },
          {
            img: getAssetUrl(s3Assets.సరమలలImg),
            text: "సిరిమల్లె",
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.దరవజImg),
            text: "దర్వాజ",
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
          },
        ],
        correctWord: "సిరిమల్లె",
        audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.వదయలImg),
            text: "వాద్యాల",
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
          },
          {
            img: getAssetUrl(s3Assets.బయయImg),
            text: "బియ్యం",
            audio: getAssetAudioUrl(s3Assets.బయయAudio),
          },
          {
            img: getAssetUrl(s3Assets.చననImg),
            text: "చిన్ని",
            audio: getAssetAudioUrl(s3Assets.చననAudio),
          },
        ],
        correctWord: "బియ్యం",
        audio: getAssetAudioUrl(s3Assets.బయయAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.ఇలలImg),
            text: "ఇల్లు",
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.వననలImg),
            text: "వెన్నెల",
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
          },
          {
            img: getAssetUrl(s3Assets.పరపచImg),
            text: "ప్రపంచం",
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
          },
        ],
        correctWord: "ఇల్లు",
        audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.సరమలలImg),
            text: "సిరిమల్లె",
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.చననImg),
            text: "చిన్ని",
            audio: getAssetAudioUrl(s3Assets.చననAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఇలలImg),
            text: "ఇల్లు",
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
          },
        ],
        correctWord: "చిన్ని",
        audio: getAssetAudioUrl(s3Assets.చననAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చననImg),
            text: "చిన్ని",
            audio: getAssetAudioUrl(s3Assets.చననAudio),
          },
          {
            img: getAssetUrl(s3Assets.ఇలలImg),
            text: "ఇల్లు",
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.బరరకథImg),
            text: "బుర్రకథ",
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
          },
        ],
        correctWord: "బుర్రకథ",
        audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పరపచImg),
            text: "ప్రపంచం",
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
          },
          {
            img: getAssetUrl(s3Assets.సరమలలImg),
            text: "సిరిమల్లె",
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.వననలImg),
            text: "వెన్నెల",
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
          },
        ],
        correctWord: "వెన్నెల",
        audio: getAssetAudioUrl(s3Assets.వననలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
    ],
    3: [
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.వపకచదImg),
            text: "వేపాకు చేదు",
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
          },
          {
            img: getAssetUrl(s3Assets.గననలపలImg),
            text: "గిన్నెలో పాలు",
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
          },
        ],
        correctWord: "వేపాకు చేదు",
        audio: getAssetAudioUrl(s3Assets.వపకచదAudio2),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.బవగరకImg),
            text: "బావి గిరక",
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
          },
          {
            img: getAssetUrl(s3Assets.పసరగరలImg),
            text: "పెసర గారెలు",
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
          },
        ],
        correctWord: "బావి గిరక",
        audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బవగరకImg),
            text: "బావి గిరక",
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
          },
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.పసరగరలImg),
            text: "పెసర గారెలు",
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
          },
        ],
        correctWord: "పెసర గారెలు",
        audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.ఎరరగలబImg),
            text: "ఎర్ర గులాబి",
            audio: getAssetAudioUrl(s3Assets.ఎరరగలబAudio),
          },
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.సవరతజడImg),
            text: "సవరంతో జడ",
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
          },
        ],
        correctWord: "అమల పలక",
        audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.వపకచదImg),
            text: "వేపాకు చేదు",
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
          },
          {
            img: getAssetUrl(s3Assets.సవరతజడImg),
            text: "సవరంతో జడ",
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
          },
        ],
        correctWord: "సవరంతో జడ",
        audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చతలగడగImg),
            text: "చేతిలో గొడుగు",
            audio: getAssetAudioUrl(s3Assets.చతలగడగAudio),
          },
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.తలలనఏనగImg),
            text: "తెల్లని ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.తలలనఏనగAudio),
          },
        ],
        correctWord: "చేతిలో గొడుగు",
        audio: getAssetAudioUrl(s3Assets.చతలగడగAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.గననలపలImg),
            text: "గిన్నెలో పాలు",
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
          },
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.పసరగరలImg),
            text: "పెసర గారెలు",
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
          },
        ],
        correctWord: "కొండమీద గుడి",
        audio: getAssetAudioUrl(s3Assets.కడమదగడAudio2),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.ఎరరగలబImg),
            text: "ఎర్ర గులాబి",
            audio: getAssetAudioUrl(s3Assets.ఎరరగలబAudio),
          },
          {
            img: getAssetUrl(s3Assets.సవరతజడImg),
            text: "సవరంతో జడ",
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
          },
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
        ],
        correctWord: "ఎర్ర గులాబి",
        audio: getAssetAudioUrl(s3Assets.ఎరరగలబAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.బవగరకImg),
            text: "బావి గిరక",
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
          },
          {
            img: getAssetUrl(s3Assets.గననలపలImg),
            text: "గిన్నెలో పాలు",
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
          },
        ],
        correctWord: "గిన్నెలో పాలు",
        audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అమలపలకImg),
            text: "అమల పలక",
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.పసరగరలImg),
            text: "పెసర గారెలు",
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
          },
          {
            img: getAssetUrl(s3Assets.తలలనఏనగImg),
            text: "తెల్లని ఏనుగు",
            audio: getAssetAudioUrl(s3Assets.తలలనఏనగAudio),
          },
        ],
        correctWord: "తెల్లని ఏనుగు",
        audio: getAssetAudioUrl(s3Assets.తలలనఏనగAudio),
        flowName: "S1",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.సననయపటImg),
            text: "సన్నాయి పాట",
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
          },
          {
            img: getAssetUrl(s3Assets.అకకజడImg),
            text: "అక్క జడ",
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
          },
          {
            img: getAssetUrl(s3Assets.వపకచదImg),
            text: "వేపాకు చేదు",
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
          },
        ],
        correctWord: "వేపాకు చేదు",
        audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.వపకచదImg),
            text: "వేపాకు చేదు",
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
          },
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
          {
            img: getAssetUrl(s3Assets.గడమదబలలImg),
            text: "గోడమీద బల్లి",
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
          },
        ],
        correctWord: "కొండమీద గుడి",
        audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.తలమదటపImg),
            text: "తలమీద టోపి",
            audio: getAssetAudioUrl(s3Assets.తలమదటపAudio),
          },
          {
            img: getAssetUrl(s3Assets.వపకచదImg),
            text: "వేపాకు చేదు",
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
          },
          {
            img: getAssetUrl(s3Assets.బదలనళలImg),
            text: "బిందెలో నీళ్లు",
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
          },
        ],
        correctWord: "తలమీద టోపి",
        audio: getAssetAudioUrl(s3Assets.తలమదటపAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.అకకజడImg),
            text: "అక్క జడ",
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
          },
          {
            img: getAssetUrl(s3Assets.చటటమలకImg),
            text: "చిట్టి మొలక",
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.సననయపటImg),
            text: "సన్నాయి పాట",
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
          },
        ],
        correctWord: "సన్నాయి పాట",
        audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చలకమకకImg),
            text: "చిలుక ముక్కు",
            audio: getAssetAudioUrl(s3Assets.చలకమకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.సననయపటImg),
            text: "సన్నాయి పాట",
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
          },
          {
            img: getAssetUrl(s3Assets.గడమదబలలImg),
            text: "గోడమీద బల్లి",
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
          },
        ],
        correctWord: "గోడమీద బల్లి",
        audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.పలలపటటImg),
            text: "పల్లి పట్టి",
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
          },
          {
            img: getAssetUrl(s3Assets.గడమదబలలImg),
            text: "గోడమీద బల్లి",
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.బదలనళలImg),
            text: "బిందెలో నీళ్లు",
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
          },
        ],
        correctWord: "పల్లి పట్టి",
        audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.చటటమలకImg),
            text: "చిట్టి మొలక",
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.అకకజడImg),
            text: "అక్క జడ",
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
          },
          {
            img: getAssetUrl(s3Assets.బదలనళలImg),
            text: "బిందెలో నీళ్లు",
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
          },
        ],
        correctWord: "అక్క జడ",
        audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బదలనళలImg),
            text: "బిందెలో నీళ్లు",
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
          },
          {
            img: getAssetUrl(s3Assets.చలకమకకImg),
            text: "చిలుక ముక్కు",
            audio: getAssetAudioUrl(s3Assets.చలకమకకAudio),
          },
          {
            img: getAssetUrl(s3Assets.కడమదగడImg),
            text: "కొండమీద గుడి",
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
          },
        ],
        correctWord: "చిలుక ముక్కు",
        audio: getAssetAudioUrl(s3Assets.చలకమకకAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.బదలనళలImg),
            text: "బిందెలో నీళ్లు",
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
          },
          {
            img: getAssetUrl(s3Assets.గడమదబలలImg),
            text: "గోడమీద బల్లి",
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
          },
          {
            img: getAssetUrl(s3Assets.పలలపటటImg),
            text: "పల్లి పట్టి",
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
          },
        ],
        correctWord: "బిందెలో నీళ్లు",
        audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
        flowName: "S2",
        type: "soundMatch",
      },
      {
        allwords: [
          {
            img: getAssetUrl(s3Assets.సననయపటImg),
            text: "సన్నాయి పాట",
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
          },
          {
            img: getAssetUrl(s3Assets.చటటమలకImg),
            text: "చిట్టి మొలక",
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
          },
          {
            img: getAssetUrl(s3Assets.పలలపటటImg),
            text: "పల్లి పట్టి",
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
          },
        ],
        correctWord: "చిట్టి మొలక",
        audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
        flowName: "S2",
        type: "soundMatch",
      },
    ],
  },
};

// Sound Hunt (Picture words) - Read the word and choose the right sound
const pictureWordsContent = {
  en: {
    1: [
      //S1
      {
        word: "bad",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.cookAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.godAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.badAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "mom",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.godAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.momAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.goatAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "hop",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.hopAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fatAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.cookAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "fat",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.fatAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.momAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.sadAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "him",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.goatAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.nineAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.himAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "sad",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.godAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fatAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.sadAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "cook",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.godAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.cookAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.goatAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "god",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.godAudio2),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.nineAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fatAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "nine",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.cookAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.nineAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fatAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "goat",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.goatAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.badAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.cookAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      //S2
      {
        word: "buy",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.wideAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.noteAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.buyAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "fine",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.happyAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.wideAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fineAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "kind",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.kindAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.buyAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "note",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.fineAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.noteAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "wide",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.happyAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.wideAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.hideAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "know",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.knowAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.hideAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "half",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.fineAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "hide",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.buyAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.hideAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "happy",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.knowAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.happyAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "body",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.halfAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.bodyAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.knowAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
    ],
    2: [
      {
        word: "Son",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.sonAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.chairAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fairAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "zig",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.zigAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fairAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.chatAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "log",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.logAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.sonAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "now",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.penAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.nowAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fairAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "chat",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.chatAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.sonAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.nowAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "pen",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.logAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.chatAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.penAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "fair",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.nowAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.fairAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "care",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.careAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.zigAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "bird",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.zigAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.chatAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.birdAudio2),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "chair",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.careAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.logAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.chairAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "turn",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.orangeAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.turnAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.dearAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "soothe",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.sootheAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.dearAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "perk",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.perkAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.earAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "dear",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.royalAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.dearAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "royal",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.perkAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.royalAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "ear",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.dearAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.earAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.royalAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "lazy",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "orange",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.sootheAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.perkAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.orangeAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "purple",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.earAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.perkAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "earth",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.purpleAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.earthAudio2),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.lazyAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
    ],
  },
  te: {
    1: [
      {
        word: "ఝషం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.జకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఝషAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "గంట",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గటAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "పడవ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.జమAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "తలగడ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.గటAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తలగడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "జామ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.జమAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "జలం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.జలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "జింక",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.జకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గటAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "దండం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.దడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.జమAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.జలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "కంజర",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.మడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కజరAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "మూడు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పడవAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.జలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "కోడి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "తాళం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.తళAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చయAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "చేయి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చయAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "ఉడుత",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చయAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "కోతులు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "సినిమా",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.సనమAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "నూరు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "కలశం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.కలశAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.నరAudio2),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "ఏనుగు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.కతలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "పంజరం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.ఉడతAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పజర2Audio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
    ],
    2: [
      {
        word: "కిరీటం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కరటAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "మూకుడు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మకడAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "అభినయం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "తప్పు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తపపAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కరటAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "చెక్క",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మకడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "మొసలి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "బెండకాయ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బమమAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "విమానం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.వమనAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తపపAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "బొమ్మ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చకకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బమమAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.మసలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "పూజారి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అభనయAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పజరAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బడకయAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "దర్వాజ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వకషAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "వాద్యాల",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "వృక్షం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వకషAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "ప్రపంచం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "సిరిమల్లె",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చననAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.దరవజAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "బియ్యం",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.వదయలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బయయAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చననAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "ఇల్లు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "చిన్ని",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చననAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "బుర్రకథ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చననAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.ఇలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బరరకథAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "వెన్నెల",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పరపచAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సరమలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వననలAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
    ],
    3: [
      {
        word: "వేపాకు చేదు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "బావి గిరక",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "పెసర గారెలు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "అమల పలక",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.ఎరరగలబAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "సవరంతో జడ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "చేతిలో గొడుగు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చతలగడగAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తలలనఏనగAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "కొండమీద గుడి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "ఎర్ర గులాబి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.ఎరరగలబAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సవరతజడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "గిన్నెలో పాలు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బవగరకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గననలపలAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "తెల్లని ఏనుగు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అమలపలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పసరగరలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.తలలనఏనగAudio),
            isCorrect: true,
          },
        ],
        flowName: "S1",
        type: "pictureWords",
      },
      {
        word: "వేపాకు చేదు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "కొండమీద గుడి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "తలమీద టోపి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.తలమదటపAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.వపకచదAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "సన్నాయి పాట",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "గోడమీద బల్లి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చలకమకకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
            isCorrect: true,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "పల్లి పట్టి",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "అక్క జడ",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.అకకజడAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "చిలుక ముక్కు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చలకమకకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.కడమదగడAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "బిందెలో నీళ్లు",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.బదలనళలAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.గడమదబలలAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
      {
        word: "చిట్టి మొలక",
        audioOptions: [
          {
            audio: getAssetAudioUrl(s3Assets.సననయపటAudio),
            isCorrect: false,
          },
          {
            audio: getAssetAudioUrl(s3Assets.చటటమలకAudio),
            isCorrect: true,
          },
          {
            audio: getAssetAudioUrl(s3Assets.పలలపటటAudio),
            isCorrect: false,
          },
        ],
        flowName: "S2",
        type: "pictureWords",
      },
    ],
  },
};

// Helper function to randomly select N items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
};

const SoundHuntS1Combined = ({
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
  currentLevel,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  startShowCase,
  setStartShowCase,
  handleBack,
  setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  rStep,
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [wrongAudioIndex, setWrongAudioIndex] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [scale, setScale] = useState(1);
  // Track word selections for ansSelectionStatus - now an array of objects
  const [ansSelectionStatus, setAnsSelectionStatus] = useState([]);
  // Track if an option has been selected (to show Next button)
  const [hasSelectedOption, setHasSelectedOption] = useState(false);
  // Track game over data for showcase end screen
  const [gameOverData, setGameOverData] = useState(null);
  // Track if S1 completion has been processed (to prevent multiple addLesson calls)
  const [isS1Completed, setIsS1Completed] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Get language from localStorage (accessible throughout component)
  const language = getLocalData("lang") || "en";

  // Filter content based on milestone level and randomly select questions
  // Content selection logic:
  // 1. Get milestone level (M1 or M2) from level prop
  // 2. Filter content by flowName based on milestone:
  //    - M1 (level 1): S1 step → show flowName "S1"
  //    - M2 (level 2): S1 step → show flowName "S2"
  // 3. Get language-specific content
  // 4. Filter by target flowName (S1 or S2)
  // 5. Randomly select 10 from each filtered list
  // 6. Combine: first 10 soundMatch, then 10 pictureWords
  const filteredContent = useMemo(() => {
    // Use language from component scope

    // Use currentLevel prop directly - it's already "S1" or "S2" or "P1", etc.
    const targetFlowName =
      currentLevel === "S1" ? "S1" : currentLevel === "S2" ? "S2" : "S1";

    // Get soundMatch content for the current language and level
    const soundMatchForLevel = soundMatchContent[language]?.[level] || [];

    // Filter soundMatch content by target flowName
    const soundMatchFiltered = soundMatchForLevel.filter(
      (item) => item.flowName === targetFlowName
    );

    // Get pictureWords content for the current language and level
    const pictureWordsForLevel = pictureWordsContent[language]?.[level] || [];

    // Filter pictureWords content by target flowName
    const pictureWordsFiltered = pictureWordsForLevel.filter(
      (item) => item.flowName === targetFlowName
    );

    // Randomly select 10 from soundMatch (or all if less than 10)
    const randomSoundMatch = getRandomItems(soundMatchFiltered, 10);

    // Randomly select 10 from pictureWords (or all if less than 10)
    const randomPictureWords = getRandomItems(pictureWordsFiltered, 10);

    // Combine: first 10 soundMatch, then 10 pictureWords
    return [...randomSoundMatch, ...randomPictureWords];
  }, [level, currentLevel, language]);

  // Audio recording state
  const mediaRecorderRef = React.useRef(null);
  const recordedChunksRef = React.useRef([]);
  const streamRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Use filteredContent instead of combinedContent
  const currentQuestion = filteredContent[currentQuestionIndex];
  const isSoundMatch = currentQuestion?.type === "soundMatch";
  const isPictureWords = currentQuestion?.type === "pictureWords";

  // Handle showcase end screen - call handleNext when user clicks button
  useEffect(() => {
    if (gameOverData && isShowCase && handleNext) {
      // When gameOverData is set, MainLayout will show end screen
      // When user clicks button, MainLayout navigates to "/_practice"
      // We'll handle this in the parent component or use a custom handler
      // For now, we'll set a flag that the parent can check
      console.log(
        "Showcase end screen shown - waiting for user to click button"
      );
    }
  }, [gameOverData, isShowCase, handleNext]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedWord(null);
    setSelectedAudioIndex(null);
    setWrongWord(null);
    setWrongAudioIndex(null);
    setShowConfetti(false);
    setRecording("no");
    setIsPlaying(false);
    setIsAudioPlayedOnce(false);
    setPlayingAudioIndex(null);
    setHasSelectedOption(false);

    // Stop any active recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [currentQuestionIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Handle Word Hunt (Sound Match) - Listen to Sound and choose the right word
  const handleWordClick = async (word) => {
    // Prevent multiple selections
    if (hasSelectedOption) {
      return;
    }

    setSelectedWord(word);
    const currentQuestion = filteredContent[currentQuestionIndex];
    const wordLower = word?.toLowerCase();
    const correctWordLower = currentQuestion.correctWord?.toLowerCase();
    // Use case-insensitive comparison to handle words like "Son" vs "son"
    const isCorrect = wordLower === correctWordLower;

    // Track selection status for ansSelectionStatus
    // Track only the selected word (one entry per question)
    let currentSelection = null;
    if (wordLower) {
      currentSelection = {
        text: wordLower,
        status: isCorrect,
        gameType: "SoundMatch",
      };
      setAnsSelectionStatus((prev) => {
        return [...prev, currentSelection];
      });
    }

    // Mark that an option has been selected
    setHasSelectedOption(true);

    // Automatically move to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex === filteredContent.length - 1) {
        // Last question - complete S1
        // Prevent multiple completion calls
        if (isS1Completed) {
          console.log("S1 already completed, skipping duplicate completion");
          return;
        }

        setIsS1Completed(true);

        try {
          // First update learner profile (this is called inside handleS1Complete)
          // Pass currentSelection to ensure it's included in the API call
          const result = await handleS1Complete(currentSelection);
          // handleS1Complete already calls updateLearnerProfileOnCompletion() first

          // Check sessionResult from API response
          const getSetData = result?.data || result;
          const sessionResult = getSetData?.sessionResult;
          const userWon = sessionResult?.toLowerCase() === "pass";
          const isFail = sessionResult?.toLowerCase() === "fail";

          // If pass, reset lesson progress and update milestone level
          if (userWon) {
            console.log(
              "S1 passed - resetting lesson progress and updating milestone level"
            );

            // Get milestoneLevel from getSetResult API response
            const milestoneLevelFromAPI =
              getSetData?.milestoneLevel ||
              getSetData?.milestone_level ||
              (level ? `m${level}` : "m1");

            const sessionId = getLocalData("sessionId");
            const lang = getLocalData("lang") || "en";

            // Reset lesson progress to 0 and update milestone level
            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "showcase", // S1 is a showcase step
                lesson: 0, // Reset lesson progress to 0
                progress: 0, // Reset progress to 0
                language: lang,
                milestoneLevel: milestoneLevelFromAPI, // Use milestoneLevel from getSetResult API
              });
              console.log(
                "addLesson completed - lesson progress reset and milestone level updated:",
                milestoneLevelFromAPI
              );
            } catch (addLessonError) {
              console.error("Error calling addLesson on pass:", addLessonError);
              // Continue even if addLesson fails
            }

            // For showcase mode, show end screen
            if (isShowCase) {
              console.log("S1 showcase passed - showing end screen");
              setGameOverData({
                userWon: true,
                link: "/_practice", // MainLayout will navigate here, parent will handle handleNext
              });
              return; // Don't navigate yet - wait for user to click button on end screen
            }

            // For non-showcase mode, navigate immediately
            console.log("S1 passed - navigating to discover-start");
            setLocalData("rFlow", false);
            setLocalData("mFail", false);
            setLocalData("rStep", 0);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          // If fail, call addLesson then show end screen or call handleNext
          if (isFail) {
            console.log("S1 failed - calling addLesson (once)");
            const sessionId = getLocalData("sessionId");
            const lang = getLocalData("lang") || "en";
            const milestoneLevel = level ? `m${level}` : "m1";

            // Find S1 step index in practiceSteps
            const s1StepIndex = practiceSteps.findIndex(
              (step) => step.title === "S1"
            );
            const stepIndex = progressData?.currentPracticeStep || 0;

            // Calculate progress (S1 is a showcase step)
            const totalSteps = practiceSteps.length;
            const progress = Math.round(
              ((stepIndex + 1) / (totalSteps * (steps || 1))) * 100
            );

            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "showcase", // S1 is a showcase step
                lesson: stepIndex == 9 ? 0 : stepIndex + 1,
                progress: Math.min(100, progress),
                language: lang,
                milestoneLevel: milestoneLevel,
              });
              console.log("addLesson completed successfully");
            } catch (addLessonError) {
              console.error("Error calling addLesson:", addLessonError);
              // Continue even if addLesson fails
            }

            // For showcase mode, show end screen
            if (isShowCase) {
              console.log("S1 showcase failed - showing end screen");
              setGameOverData({
                userWon: false,
                link: "/_practice", // MainLayout will navigate here, parent will handle handleNext
              });
              return; // Don't call handleNext yet - wait for user to click button on end screen
            }

            // For non-showcase mode, call handleNext immediately
            console.log("S1 failed - addLesson done - calling handleNext");
            if (handleNext && typeof handleNext === "function") {
              await handleNext(true);
            } else {
              // Fallback: navigate to discover-start if handleNext is not available
              console.log(
                "handleNext not available - navigating to discover-start"
              );
              setLocalData("rFlow", false);
              setLocalData("mFail", false);
              setLocalData("rStep", 0);
              if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                navigate("/");
              } else {
                navigate("/discover-start");
              }
            }
          }
        } catch (error) {
          console.error("Error handling S1 completion:", error);
          // On error, try to call handleNext if available
          if (handleNext && typeof handleNext === "function") {
            await handleNext(true);
          } else {
            // Fallback: navigate to discover-start
            setLocalData("rFlow", false);
            setLocalData("mFail", false);
            setLocalData("rStep", 0);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
          }
        }
      } else {
        // Move to next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedWord(null);
        setSelectedAudioIndex(null);
        setHasSelectedOption(false);
        setIsAudioPlayedOnce(false);
        setIsPlaying(false);
        setPlayingAudioIndex(null);
      }
    }, 500); // Small delay to show selection
  };

  // Handle Sound Hunt (Picture words) - Read the word and choose the right sound
  const handleAudioClick = async (audioIndex) => {
    // Prevent multiple selections
    if (hasSelectedOption) {
      return;
    }

    setSelectedAudioIndex(audioIndex);
    const currentQuestion = filteredContent[currentQuestionIndex];
    const selectedAudio = currentQuestion.audioOptions[audioIndex];
    const isCorrect = selectedAudio.isCorrect;
    const wordLower = currentQuestion.word?.toLowerCase();

    // Show visual feedback for correct/incorrect
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setWrongAudioIndex(audioIndex);
      setTimeout(() => setWrongAudioIndex(null), 1000);
    }

    // Track selection status for ansSelectionStatus
    let currentSelection = null;
    if (wordLower) {
      currentSelection = {
        text: wordLower,
        status: isCorrect,
        gameType: "PictureWords",
      };
      setAnsSelectionStatus((prev) => {
        return [...prev, currentSelection];
      });
    }

    // Mark that an option has been selected
    setHasSelectedOption(true);

    // Automatically move to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex === filteredContent.length - 1) {
        // Last question - complete S1
        // Prevent multiple completion calls
        if (isS1Completed) {
          console.log("S1 already completed, skipping duplicate completion");
          return;
        }

        setIsS1Completed(true);

        try {
          // First update learner profile (this is called inside handleS1Complete)
          // Pass currentSelection to ensure it's included in the API call
          const result = await handleS1Complete(currentSelection);
          // handleS1Complete already calls updateLearnerProfileOnCompletion() first

          // Check sessionResult from API response
          const getSetData = result?.data || result;
          const sessionResult = getSetData?.sessionResult;
          const userWon = sessionResult?.toLowerCase() === "pass";
          const isFail = sessionResult?.toLowerCase() === "fail";

          // If pass, reset lesson progress and update milestone level
          if (userWon) {
            console.log(
              "S1 passed - resetting lesson progress and updating milestone level"
            );

            // Get milestoneLevel from getSetResult API response
            const milestoneLevelFromAPI =
              getSetData?.currentLevel || (level ? `m${level}` : "m1");

            const sessionId = getLocalData("sessionId");
            const lang = getLocalData("lang") || "en";

            // Reset lesson progress to 0 and update milestone level
            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "practice", // S1 is a showcase step
                lesson: 0, // Reset lesson progress to 0
                progress: 0, // Reset progress to 0
                language: lang,
                milestoneLevel: milestoneLevelFromAPI, // Use milestoneLevel from getSetResult API
              });
              console.log(
                "addLesson completed - lesson progress reset and milestone level updated:",
                milestoneLevelFromAPI
              );
              if (level === 3 || level === 6 || level === 9) {
                setGameOverData({
                  userWon: true,
                  link: "/assesment-end",
                });
                setLocalData("tFlow", true);
                return; // Exit to show feedback screen for M3/M6/M9
              }
            } catch (addLessonError) {
              console.error("Error calling addLesson on pass:", addLessonError);
              // Continue even if addLesson fails
            }

            // For showcase mode, show end screen
            if (isShowCase) {
              console.log("S1 showcase passed - showing end screen");
              setGameOverData({
                userWon: true,
                link: "/_practice", // MainLayout will navigate here, parent will handle handleNext
              });
              return; // Don't navigate yet - wait for user to click button on end screen
            }

            // For non-showcase mode, navigate immediately
            console.log("S1 passed - navigating to discover-start");
            setLocalData("rFlow", false);
            setLocalData("mFail", false);
            setLocalData("rStep", 0);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          // If fail, call addLesson then show end screen or call handleNext
          if (isFail) {
            console.log("S1 failed - calling addLesson (once)");
            const sessionId = getLocalData("sessionId");
            const lang = getLocalData("lang") || "en";
            const milestoneLevel = level ? `m${level}` : "m1";

            // Find S1 step index in practiceSteps
            const s1StepIndex = practiceSteps.findIndex(
              (step) => step.title === "S1"
            );
            const stepIndex = progressData?.currentPracticeStep || 0;

            // Calculate progress (S1 is a showcase step)
            const totalSteps = practiceSteps.length;
            const progress = Math.round(
              (Math.min(stepIndex + 2, totalSteps) / totalSteps) * 100
            );

            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "practice", // S1 is a showcase step
                lesson: stepIndex == 9 ? 0 : stepIndex + 1,
                progress: stepIndex == 9 ? 0 : Math.min(100, progress),
                language: lang,
                milestoneLevel: milestoneLevel,
              });
              console.log("addLesson completed successfully");
            } catch (addLessonError) {
              console.error("Error calling addLesson:", addLessonError);
              // Continue even if addLesson fails
            }

            // For showcase mode, show end screen
            if (isShowCase) {
              console.log("S1 showcase failed - showing end screen");
              setGameOverData({
                userWon: false,
                link: "/_practice", // MainLayout will navigate here, parent will handle handleNext
              });
              return; // Don't call handleNext yet - wait for user to click button on end screen
            }

            // For non-showcase mode, call handleNext immediately
            console.log("S1 failed - addLesson done - calling handleNext");
            if (handleNext && typeof handleNext === "function") {
              await handleNext(true);
            } else {
              // Fallback: navigate to discover-start if handleNext is not available
              console.log(
                "handleNext not available - navigating to discover-start"
              );
              setLocalData("rFlow", false);
              setLocalData("mFail", false);
              setLocalData("rStep", 0);
              if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                navigate("/");
              } else {
                navigate("/discover-start");
              }
            }
          }
        } catch (error) {
          console.error("Error handling S1 completion:", error);
          // On error, try to call handleNext if available
          if (handleNext && typeof handleNext === "function") {
            await handleNext(true);
          } else {
            // Fallback: navigate to discover-start
            setLocalData("rFlow", false);
            setLocalData("mFail", false);
            setLocalData("rStep", 0);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
          }
        }
      } else {
        // Move to next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedWord(null);
        setSelectedAudioIndex(null);
        setHasSelectedOption(false);
        setIsAudioPlayedOnce(false);
        setIsPlaying(false);
        setPlayingAudioIndex(null);
      }
    }, 500); // Small delay to show selection
  };

  const handlePlayAudio = (audioIndex) => {
    const currentQuestion = filteredContent[currentQuestionIndex];
    const audioOption = currentQuestion.audioOptions[audioIndex];

    const audio = new Audio(audioOption.audio);
    setPlayingAudioIndex(audioIndex);

    audio.play();

    audio.onended = () => {
      setPlayingAudioIndex(null);
    };
  };

  const handlePlayMainAudio = () => {
    const currentQuestion = filteredContent[currentQuestionIndex];
    const audio = new Audio(currentQuestion.audio);

    audio.play();
    setIsPlaying(true);
    setIsAudioPlayedOnce(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const flowNames = [...new Set(filteredContent.map((item) => item.flowName))];
  const activeFlow =
    filteredContent[currentQuestionIndex]?.flowName || flowNames[0];

  // Convert blob to base64
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

  // Start audio recording
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log("Recording stopped event fired");
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop audio recording and process
  const stopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Stopping recording...");
      const recorder = mediaRecorderRef.current;
      recorder.stop();

      // Wait for the recorder to stop and process the audio
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (recorder.state === "inactive") {
            clearInterval(checkInterval);
            console.log("Recording stopped, processing audio...");

            // Just stop recording, don't call API here
            // API will be called on S1 completion
            resolve();

            mediaRecorderRef.current = null;
            recordedChunksRef.current = [];
          }
        }, 100);

        // Timeout after 2 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 2000);
      });
    } else {
      console.warn("No active recording to stop");
      return Promise.resolve();
    }
  };

  // Build ansSelectionStatus with all words from S1 questions
  const buildAnsSelectionStatus = (currentSelection = null) => {
    // If currentSelection is provided, include it in the array
    // This ensures the last selection is included even if state hasn't updated yet
    if (currentSelection) {
      return [...ansSelectionStatus, currentSelection];
    }
    // Return the array directly - it already contains all selections with gameType
    return ansSelectionStatus;
  };

  // Update learner profile after S1 completion
  const updateLearnerProfileOnCompletion = async (currentSelection = null) => {
    try {
      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");
      const sub_session_id = getLocalData("sub_session_id");

      // Build ansSelectionStatus with all words from S1
      // Include currentSelection if provided (for the last question)
      const ansSelectionStatusObj = buildAnsSelectionStatus(currentSelection);

      const requestBody = {
        original_text: "Char",
        audio: "",
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentType: "Char",
        mechanics_id: "",
        milestone: "B",
        is_nonAsr: true,
        ansSelectionStatus: ansSelectionStatusObj,
      };

      console.log("Calling updateLearnerProfile API on S1 completion:", {
        sessionId,
        sub_session_id,
        lang,
        ansSelectionStatus: ansSelectionStatusObj,
      });

      const result = await updateLearnerProfile(lang, requestBody);
      console.log(
        "✅ Learner profile updated successfully on S1 completion:",
        result
      );
      return result;
    } catch (error) {
      console.error("❌ Error updating learner profile on completion:", error);
      console.error("Error details:", error.response || error.message);
      throw error;
    }
  };

  // Get/Set result when S1 is complete
  const handleS1Complete = async (currentSelection = null) => {
    try {
      // First update learner profile
      // Pass currentSelection to ensure the last answer is included
      await updateLearnerProfileOnCompletion(currentSelection);

      // Then get/set result
      const sub_session_id = getLocalData("sub_session_id");
      const sessionId = getLocalData("sessionId");

      const result = await getSetResultPractice({
        subSessionId: sub_session_id,
        currentContentType: contentType || "Word",
        sessionId,
        totalSyllableCount: 20, // Total questions for S1 combined
        mechanism: { id: "soundHuntS1Combined", name: "soundHuntS1Combined" },
      });

      console.log("S1 result:", result);
      setLocalData("s1_complete", true);
      setLocalData("s1_result", JSON.stringify(result));

      // Return the result so caller can check sessionResult
      return result;
    } catch (error) {
      console.error("Error getting/setting S1 result:", error);
      throw error;
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m1"}
      parentWords={parentWords}
      flowNames={flowNames}
      activeFlow={activeFlow}
      rStep={rStep}
      isShowCase={isShowCase}
      startShowCase={startShowCase}
      setStartShowCase={setStartShowCase}
      gameOverData={gameOverData}
      {...{
        steps: filteredContent.length, // Use filteredContent length (should be 20)
        currentStep: currentQuestionIndex + 1, // Use internal currentQuestionIndex
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          background: "linear-gradient(180deg, #91E7EF 0%, #42C6FF 100%)",
          padding: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {recording === "no" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {[
                { top: "10%", left: "5%" },
                { top: "25%", left: "30%" },
                { top: "10%", left: "55%" },
                { top: "25%", left: "80%" },
              ].map((pos, index) => (
                <img
                  key={index}
                  src={Assets.cloudNewImg}
                  alt={`Cloud ${index + 1}`}
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "auto",
                    ...pos,
                  }}
                />
              ))}
            </div>

            {/* Word Hunt (Sound Match) - Listen to Sound and choose the right word */}
            {isSoundMatch && !isPictureWords && currentQuestion?.allwords && (
              <>
                <button
                  onClick={handlePlayMainAudio}
                  disabled={isPlaying}
                  style={{
                    position: "relative",
                    marginBottom: "75px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={
                      isPlaying ? Assets.pauseButtonImg : Assets.playButtonImg
                    }
                    alt="Audio"
                    style={{
                      width: "55px",
                      height: "55px",
                      transform: `scale(${scale})`,
                      transition: "transform 0.5s ease-in-out",
                    }}
                  />
                </button>

                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginTop: "24px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {currentQuestion?.allwords.map((item, index) => {
                    const isSelected = selectedWord === item.text;
                    const isCorrect =
                      item.text?.toLowerCase() ===
                      currentQuestion.correctWord?.toLowerCase();
                    const showCorrect = isSelected && isCorrect;
                    const showWrong = isSelected && !isCorrect;
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: showCorrect
                            ? "#4CAF50"
                            : showWrong
                            ? "#F44336"
                            : "#1897DE",
                          padding: isMobile ? "12px 16px" : "16px 24px",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          border: showCorrect
                            ? "5px solid #2E7D32"
                            : showWrong
                            ? "5px solid #C62828"
                            : "5px solid #10618E",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(56px)",
                          WebkitBackdropFilter: "blur(56px)",
                          cursor:
                            isAudioPlayedOnce && !hasSelectedOption
                              ? "pointer"
                              : "not-allowed",
                          opacity:
                            isAudioPlayedOnce && !hasSelectedOption ? 1 : 0.7,
                          transition: "background-color 0.3s ease-in-out",
                          minWidth: isMobile ? "80px" : "120px",
                          minHeight: isMobile ? "50px" : "60px",
                        }}
                        onClick={() => {
                          if (isAudioPlayedOnce && !hasSelectedOption) {
                            handleWordClick(item.text);
                          }
                        }}
                      >
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontWeight: language === "te" ? 400 : 600,
                            fontSize:
                              language === "te"
                                ? isMobile
                                  ? "24px"
                                  : "32px"
                                : isMobile
                                ? "20px"
                                : "28px",
                            fontFamily: getFontFamily(language),
                            textAlign: "center",
                          }}
                        >
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Sound Hunt (Picture words) - Read the word and choose the right sound */}
            {!isSoundMatch &&
              isPictureWords &&
              currentQuestion?.word &&
              currentQuestion?.audioOptions &&
              Array.isArray(currentQuestion.audioOptions) &&
              currentQuestion.audioOptions.length > 0 && (
                <>
                  {/* Display the word */}
                  <div
                    style={{
                      backgroundColor: "#1897DE",
                      padding: isMobile ? "16px 24px" : "20px 32px",
                      borderRadius: "12px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "5px solid #10618E",
                      marginBottom: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: isMobile ? "150px" : "200px",
                    }}
                  >
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontWeight: language === "te" ? 400 : 600,
                        fontSize:
                          language === "te"
                            ? isMobile
                              ? "38px"
                              : "54px"
                            : isMobile
                            ? "32px"
                            : "48px",
                        fontFamily: getFontFamily(language),
                        textAlign: "center",
                      }}
                    >
                      {currentQuestion.word}
                    </span>
                  </div>

                  {/* Audio options */}
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      marginTop: "24px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {currentQuestion?.audioOptions.map((audioOption, index) => {
                      const isPlaying = playingAudioIndex === index;
                      const isSelected = selectedAudioIndex === index;
                      const isCorrect = audioOption.isCorrect;
                      const isWrong = wrongAudioIndex === index;

                      // Determine background color and border based on state
                      let backgroundColor = "#FFFFFF";
                      let borderColor = "2px solid rgba(255, 255, 255, 0.5)";

                      if (isSelected && isCorrect) {
                        backgroundColor = "#E8F5E9";
                        borderColor = "3px solid #4CAF50";
                      } else if (isSelected && !isCorrect) {
                        backgroundColor = "#FFEBEE";
                        borderColor = "3px solid #F44336";
                      } else if (isWrong) {
                        backgroundColor = "#FFEBEE";
                        borderColor = "3px solid #F44336";
                      } else if (isSelected) {
                        backgroundColor = "#E3F2FD";
                        borderColor = "3px solid #2196F3";
                      }

                      return (
                        <div
                          key={index}
                          style={{
                            backgroundColor: backgroundColor,
                            padding: "16px",
                            borderRadius: "24px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            border: borderColor,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(56px)",
                            WebkitBackdropFilter: "blur(56px)",
                            cursor: hasSelectedOption
                              ? "not-allowed"
                              : "pointer",
                            opacity: hasSelectedOption && !isSelected ? 0.5 : 1,
                            transition: "all 0.3s ease-in-out",
                            minWidth: isMobile ? "100px" : "140px",
                            minHeight: isMobile ? "100px" : "140px",
                            position: "relative",
                          }}
                          onClick={() => {
                            if (!hasSelectedOption) {
                              handleAudioClick(index);
                            }
                          }}
                        >
                          {/* Checkbox indicator - shown when selected */}
                          {isSelected && (
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                width: isMobile ? "28px" : "32px",
                                height: isMobile ? "28px" : "32px",
                                backgroundColor: isCorrect
                                  ? "#4CAF50"
                                  : "#F44336",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                zIndex: 10,
                              }}
                            >
                              {isCorrect ? (
                                <span
                                  style={{
                                    color: "#FFFFFF",
                                    fontSize: isMobile ? "18px" : "20px",
                                    fontWeight: "bold",
                                    lineHeight: 1,
                                  }}
                                >
                                  ✓
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "#FFFFFF",
                                    fontSize: isMobile ? "18px" : "20px",
                                    fontWeight: "bold",
                                    lineHeight: 1,
                                  }}
                                >
                                  ✕
                                </span>
                              )}
                            </div>
                          )}

                          {/* Unselected checkbox indicator - shown when not selected and no option has been selected yet */}
                          {!isSelected && !hasSelectedOption && (
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                width: isMobile ? "24px" : "28px",
                                height: isMobile ? "24px" : "28px",
                                border: "2px solid #BDBDBD",
                                borderRadius: "4px",
                                backgroundColor: "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                              }}
                            >
                              {/* Empty checkbox */}
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasSelectedOption) {
                                handlePlayAudio(index);
                              }
                            }}
                            disabled={isPlaying || hasSelectedOption}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: hasSelectedOption
                                ? "not-allowed"
                                : "pointer",
                              marginBottom: "8px",
                              opacity:
                                hasSelectedOption && !isSelected ? 0.5 : 1,
                            }}
                          >
                            <img
                              src={
                                isPlaying
                                  ? Assets.pauseButtonImg
                                  : Assets.playButtonImg
                              }
                              alt="Play Audio"
                              style={{
                                width: isMobile ? "40px" : "50px",
                                height: isMobile ? "40px" : "50px",
                                transform: isPlaying
                                  ? `scale(${scale})`
                                  : "scale(1)",
                                transition: "transform 0.5s ease-in-out",
                                filter:
                                  hasSelectedOption && !isSelected
                                    ? "grayscale(100%)"
                                    : "none",
                              }}
                            />
                          </button>
                          <span
                            style={{
                              color:
                                isSelected && (isCorrect || !isCorrect)
                                  ? isCorrect
                                    ? "#2E7D32"
                                    : "#C62828"
                                  : "#666666",
                              fontWeight: isSelected ? 600 : 500,
                              fontSize:
                                language === "te"
                                  ? isMobile
                                    ? "14px"
                                    : "16px"
                                  : isMobile
                                  ? "12px"
                                  : "14px",
                              fontFamily: getFontFamily(language),
                              textAlign: "center",
                            }}
                          >
                            Sound {index + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

            {/* Next Button - hidden since we auto-advance after selection */}
            {false && hasSelectedOption && recording === "no" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={async () => {
                    console.log("Next button clicked");
                    // Note: This button should not be visible since we auto-advance after selection
                    // But if somehow clicked, just move to next question
                    if (currentQuestionIndex < filteredContent.length - 1) {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                      setSelectedWord(null);
                      setSelectedAudioIndex(null);
                      setHasSelectedOption(false);
                      setIsAudioPlayedOnce(false);
                      setIsPlaying(false);
                      setPlayingAudioIndex(null);
                    }
                    // Completion is handled automatically in handleWordClick/handleAudioClick
                  }}
                >
                  <NextButtonRound />
                </Box>
              </div>
            )}
          </>
        )}

        {recording === "recording" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "80px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1897DE",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "5px solid #10618E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
                minWidth: "120px",
                minHeight: "60px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: language === "te" ? 400 : 600,
                  fontSize: language === "te" ? "32px" : "28px",
                  fontFamily: getFontFamily(language),
                  textAlign: "center",
                }}
              >
                {isSoundMatch
                  ? currentQuestion.correctWord
                  : currentQuestion.word}
              </span>
            </div>
            <img
              onClick={async () => {
                await startRecording();
                setRecording("startRec");
              }}
              src={Assets.pzMic}
              alt="mic"
              style={{ width: "70px", height: "70px", cursor: "pointer" }}
            />
          </div>
        )}

        {recording === "startRec" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "80px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1897DE",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "5px solid #10618E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
                minWidth: "120px",
                minHeight: "60px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: language === "te" ? 400 : 600,
                  fontSize: language === "te" ? "32px" : "28px",
                  fontFamily: getFontFamily(language),
                  textAlign: "center",
                }}
              >
                {isSoundMatch
                  ? currentQuestion.correctWord
                  : currentQuestion.word}
              </span>
            </div>
            <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
              <RecordVoiceVisualizer />
            </Box>
            <img
              onClick={async () => {
                console.log("Stop button clicked");

                // Stop recording
                await stopRecording();

                const audio = new Audio(correctSound);
                audio.play();
                setRecording("no");
                setIsPlaying(false);
                setIsAudioPlayedOnce(false);
                setPlayingAudioIndex(null);

                // Note: Completion is handled automatically in handleWordClick/handleAudioClick
                // This button should only stop recording - auto-advance handles completion
                // If somehow on last question, completion logic in handleWordClick/handleAudioClick will handle it
              }}
              src={Assets.pause}
              alt="Stop"
              style={{ width: "60px", height: "60px", cursor: "pointer" }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SoundHuntS1Combined;
