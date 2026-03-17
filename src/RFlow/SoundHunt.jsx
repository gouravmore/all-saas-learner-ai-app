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
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const content = {
  en: [
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "hot",
      audio: getAssetAudioUrl(s3Assets.hotAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
      ],
      correctWord: "boat",
      audio: getAssetAudioUrl(s3Assets.boatAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
        {
          img: getAssetUrl(s3Assets.tapImg),
          text: "tap",
          audio: getAssetAudioUrl(s3Assets.tapAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "coat",
      audio: getAssetAudioUrl(s3Assets.coatAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.matImg),
          text: "mat",
          audio: getAssetAudioUrl(s3Assets.matAudio),
        },
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "toad",
      audio: getAssetAudioUrl(s3Assets.toadAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
      ],
      correctWord: "bike",
      audio: getAssetAudioUrl(s3Assets.bikeAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
      ],
      correctWord: "cat",
      audio: getAssetAudioUrl(s3Assets.catAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.tapImg),
          text: "tap",
          audio: getAssetAudioUrl(s3Assets.tapAudio),
        },
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
      ],
      correctWord: "tap",
      audio: getAssetAudioUrl(s3Assets.tapAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.matImg),
          text: "mat",
          audio: getAssetAudioUrl(s3Assets.matAudio),
        },
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "mat",
      audio: getAssetAudioUrl(s3Assets.matAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "pot",
      audio: getAssetAudioUrl(s3Assets.potAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "god",
      audio: getAssetAudioUrl(s3Assets.godAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toeImg),
          text: "toe",
          audio: getAssetAudioUrl(s3Assets.toeAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.packImg),
          text: "pack",
          audio: getAssetAudioUrl(s3Assets.packAudio),
        },
      ],
      correctWord: "toe",
      audio: getAssetAudioUrl(s3Assets.toeAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
        {
          img: getAssetUrl(s3Assets.timeImg),
          text: "time",
          audio: getAssetAudioUrl(s3Assets.timeAudio),
        },
      ],
      correctWord: "time",
      audio: getAssetAudioUrl(s3Assets.timeAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "pine",
      audio: getAssetAudioUrl(s3Assets.pineAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
      ],
      correctWord: "tie",
      audio: getAssetAudioUrl(s3Assets.tieAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "bin",
      audio: getAssetAudioUrl(s3Assets.binAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toeImg),
          text: "toe",
          audio: getAssetAudioUrl(s3Assets.toeAudio),
        },
        {
          img: getAssetUrl(s3Assets.packImg),
          text: "pack",
          audio: getAssetAudioUrl(s3Assets.packAudio),
        },
        {
          img: getAssetUrl(s3Assets.pondImg),
          text: "pond",
          audio: getAssetAudioUrl(s3Assets.pondAudio),
        },
      ],
      correctWord: "pack",
      audio: getAssetAudioUrl(s3Assets.packAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "palm",
      audio: getAssetAudioUrl(s3Assets.palmAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pondImg),
          text: "pond",
          audio: getAssetAudioUrl(s3Assets.pondAudio),
        },
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
      ],
      correctWord: "pond",
      audio: getAssetAudioUrl(s3Assets.pondAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
      ],
      correctWord: "pit",
      audio: getAssetAudioUrl(s3Assets.pitAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
        {
          img: getAssetUrl(s3Assets.timeImg),
          text: "time",
          audio: getAssetAudioUrl(s3Assets.timeAudio),
        },
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
      ],
      correctWord: "night",
      audio: getAssetAudioUrl(s3Assets.nightAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
      ],
      correctWord: "jump",
      audio: getAssetAudioUrl(s3Assets.jumpAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "sing",
      audio: getAssetAudioUrl(s3Assets.singAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
      ],
      correctWord: "ring",
      audio: getAssetAudioUrl(s3Assets.ringAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.wingImg),
          text: "wing",
          audio: getAssetAudioUrl(s3Assets.wingAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
      ],
      correctWord: "wing",
      audio: getAssetAudioUrl(s3Assets.wingAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
      ],
      correctWord: "path",
      audio: getAssetAudioUrl(s3Assets.pathAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "math",
      audio: getAssetAudioUrl(s3Assets.mathAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.wingImg),
          text: "wing",
          audio: getAssetAudioUrl(s3Assets.wingAudio),
        },
        {
          img: getAssetUrl(s3Assets.furImg),
          text: "fur",
          audio: getAssetAudioUrl(s3Assets.furAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "breathe",
      audio: getAssetAudioUrl(s3Assets.breatheAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.runImg),
          text: "run",
          audio: getAssetAudioUrl(s3Assets.runAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
      ],
      correctWord: "run",
      audio: getAssetAudioUrl(s3Assets.runAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio),
        },
      ],
      correctWord: "bird",
      audio: getAssetAudioUrl(s3Assets.birdAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.furImg),
          text: "fur",
          audio: getAssetAudioUrl(s3Assets.furAudio),
        },
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio),
        },
      ],
      correctWord: "fur",
      audio: getAssetAudioUrl(s3Assets.furAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
        {
          img: getAssetUrl(s3Assets.thumbImg),
          text: "thumb",
          audio: getAssetAudioUrl(s3Assets.thumbAudio),
        },
      ],
      correctWord: "thumb",
      audio: getAssetAudioUrl(s3Assets.thumbAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.mother2Img),
          text: "mother",
          audio: getAssetAudioUrl(s3Assets.motherAudio),
        },
      ],
      correctWord: "mother",
      audio: getAssetAudioUrl(s3Assets.motherAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fatherImg),
          text: "father",
          audio: getAssetAudioUrl(s3Assets.fatherAudio),
        },
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.mother2Img),
          text: "mother",
          audio: getAssetAudioUrl(s3Assets.motherAudio),
        },
      ],
      correctWord: "father",
      audio: getAssetAudioUrl(s3Assets.fatherAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
      ],
      correctWord: "three",
      audio: getAssetAudioUrl(s3Assets.threeAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.rabbitImg),
          text: "rabbit",
          audio: getAssetAudioUrl(s3Assets.rabbitAudio),
        },
      ],
      correctWord: "rabbit",
      audio: getAssetAudioUrl(s3Assets.rabbitAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
      ],
      correctWord: "river",
      audio: getAssetAudioUrl(s3Assets.riverAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.rabbitImg),
          text: "rabbit",
          audio: getAssetAudioUrl(s3Assets.rabbitAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
      ],
      correctWord: "purple",
      audio: getAssetAudioUrl(s3Assets.purpleAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.fatherImg),
          text: "father",
          audio: getAssetAudioUrl(s3Assets.fatherAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
      ],
      correctWord: "dinner",
      audio: getAssetAudioUrl(s3Assets.dinner2Audio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.thumbImg),
          text: "thumb",
          audio: getAssetAudioUrl(s3Assets.thumbAudio),
        },
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
      ],
      correctWord: "earth",
      audio: getAssetAudioUrl(s3Assets.earthAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
      ],
      correctWord: "magic",
      audio: getAssetAudioUrl(s3Assets.magicAudio),
      flowName: "P4",
    },
  ],
  te: [
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
        {
          img: getAssetUrl(s3Assets.హసImg),
          text: "హంస",
          audio: getAssetAudioUrl(s3Assets.హసAudio),
        },
        {
          img: getAssetUrl(s3Assets.పలకImg),
          text: "పలక",
          audio: getAssetAudioUrl(s3Assets.పలకAudio),
        },
      ],
      correctWord: "హంస",
      audio: getAssetAudioUrl(s3Assets.హసAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.బడImg),
          text: "బండ",
          audio: getAssetAudioUrl(s3Assets.బడAudio),
        },
        {
          img: getAssetUrl(s3Assets.హసImg),
          text: "హంస",
          audio: getAssetAudioUrl(s3Assets.హసAudio),
        },
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
      ],
      correctWord: "బండ",
      audio: getAssetAudioUrl(s3Assets.బడAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.నడకImg),
          text: "నడక",
          audio: getAssetAudioUrl(s3Assets.నడకAudio),
        },
        {
          img: getAssetUrl(s3Assets.పలకImg),
          text: "పలక",
          audio: getAssetAudioUrl(s3Assets.పలకAudio),
        },
        {
          img: getAssetUrl(s3Assets.వనImg),
          text: "వనం",
          audio: getAssetAudioUrl(s3Assets.వనAudio),
        },
      ],
      correctWord: "వనం",
      audio: getAssetAudioUrl(s3Assets.వనAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.రథImg),
          text: "రథం",
          audio: getAssetAudioUrl(s3Assets.రథAudio),
        },
        {
          img: getAssetUrl(s3Assets.తబలImg),
          text: "తబల",
          audio: getAssetAudioUrl(s3Assets.తబలAudio),
        },
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
      ],
      correctWord: "రథం",
      audio: getAssetAudioUrl(s3Assets.రథAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ఫలImg),
          text: "ఫలం",
          audio: getAssetAudioUrl(s3Assets.ఫలAudio),
        },
        {
          img: getAssetUrl(s3Assets.బడImg),
          text: "బండ",
          audio: getAssetAudioUrl(s3Assets.బడAudio),
        },
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
      ],
      correctWord: "ఫలం",
      audio: getAssetAudioUrl(s3Assets.ఫలAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పలకImg),
          text: "పలక",
          audio: getAssetAudioUrl(s3Assets.పలకAudio),
        },
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
        {
          img: getAssetUrl(s3Assets.వనImg),
          text: "వనం",
          audio: getAssetAudioUrl(s3Assets.వనAudio),
        },
      ],
      correctWord: "పలక",
      audio: getAssetAudioUrl(s3Assets.పలకAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.తబలImg),
          text: "తబల",
          audio: getAssetAudioUrl(s3Assets.తబలAudio),
        },
        {
          img: getAssetUrl(s3Assets.వనImg),
          text: "వనం",
          audio: getAssetAudioUrl(s3Assets.వనAudio),
        },
        {
          img: getAssetUrl(s3Assets.రథImg),
          text: "రథం",
          audio: getAssetAudioUrl(s3Assets.రథAudio),
        },
      ],
      correctWord: "తబల",
      audio: getAssetAudioUrl(s3Assets.తబలAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.రథImg),
          text: "రథం",
          audio: getAssetAudioUrl(s3Assets.రథAudio),
        },
        {
          img: getAssetUrl(s3Assets.బడImg),
          text: "బండ",
          audio: getAssetAudioUrl(s3Assets.బడAudio),
        },
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
      ],
      correctWord: "శనగ",
      audio: getAssetAudioUrl(s3Assets.శనగAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.శనగImg),
          text: "శనగ",
          audio: getAssetAudioUrl(s3Assets.శనగAudio),
        },
        {
          img: getAssetUrl(s3Assets.బడImg),
          text: "బండ",
          audio: getAssetAudioUrl(s3Assets.బడAudio),
        },
        {
          img: getAssetUrl(s3Assets.నడకImg),
          text: "నడక",
          audio: getAssetAudioUrl(s3Assets.నడకAudio),
        },
      ],
      correctWord: "నడక",
      audio: getAssetAudioUrl(s3Assets.నడకAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ఔషధImg),
          text: "ఔషధ",
          audio: getAssetAudioUrl(s3Assets.ఔషధAudio),
        },
        {
          img: getAssetUrl(s3Assets.ఫలImg),
          text: "ఫలం",
          audio: getAssetAudioUrl(s3Assets.ఫలAudio),
        },
        {
          img: getAssetUrl(s3Assets.నడకImg),
          text: "నడక",
          audio: getAssetAudioUrl(s3Assets.నడకAudio),
        },
      ],
      correctWord: "ఔషధ",
      audio: getAssetAudioUrl(s3Assets.ఔషధAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.తనImg),
          text: "తేనె",
          audio: getAssetAudioUrl(s3Assets.తనAudio),
        },
        {
          img: getAssetUrl(s3Assets.వరImg),
          text: "వేరు",
          audio: getAssetAudioUrl(s3Assets.వరAudio),
        },
        {
          img: getAssetUrl(s3Assets.కదImg),
          text: "కింద",
          audio: getAssetAudioUrl(s3Assets.కదAudio),
        },
      ],
      correctWord: "కింద",
      audio: getAssetAudioUrl(s3Assets.కదAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.గడImg),
          text: "గుడి",
          audio: getAssetAudioUrl(s3Assets.గడAudio),
        },
        {
          img: getAssetUrl(s3Assets.నరImg),
          text: "నూరు",
          audio: getAssetAudioUrl(s3Assets.నరAudio),
        },
        {
          img: getAssetUrl(s3Assets.పలImg),
          text: "పులి",
          audio: getAssetAudioUrl(s3Assets.పలAudio),
        },
      ],
      correctWord: "గుడి",
      audio: getAssetAudioUrl(s3Assets.గడAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.వరImg),
          text: "వేరు",
          audio: getAssetAudioUrl(s3Assets.వరAudio),
        },
        {
          img: getAssetUrl(s3Assets.మడImg2),
          text: "మూడు",
          audio: getAssetAudioUrl(s3Assets.మడAudio2),
        },
        {
          img: getAssetUrl(s3Assets.బవImg),
          text: "బావి",
          audio: getAssetAudioUrl(s3Assets.బవAudio),
        },
      ],
      correctWord: "వేరు",
      audio: getAssetAudioUrl(s3Assets.వరAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పలImg),
          text: "పులి",
          audio: getAssetAudioUrl(s3Assets.పలAudio),
        },
        {
          img: getAssetUrl(s3Assets.గడImg),
          text: "గుడి",
          audio: getAssetAudioUrl(s3Assets.గడAudio),
        },
        {
          img: getAssetUrl(s3Assets.దగImg),
          text: "దొంగ",
          audio: getAssetAudioUrl(s3Assets.దగAudio),
        },
      ],
      correctWord: "పులి",
      audio: getAssetAudioUrl(s3Assets.పలAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.బవImg),
          text: "బావి",
          audio: getAssetAudioUrl(s3Assets.బవAudio),
        },
        {
          img: getAssetUrl(s3Assets.రణImg),
          text: "రాణి",
          audio: getAssetAudioUrl(s3Assets.రణAudio),
        },
        {
          img: getAssetUrl(s3Assets.నరImg),
          text: "నూరు",
          audio: getAssetAudioUrl(s3Assets.నరAudio),
        },
      ],
      correctWord: "రాణి",
      audio: getAssetAudioUrl(s3Assets.రణAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.తనImg),
          text: "తేనె",
          audio: getAssetAudioUrl(s3Assets.తనAudio),
        },
        {
          img: getAssetUrl(s3Assets.కదImg),
          text: "కింద",
          audio: getAssetAudioUrl(s3Assets.కదAudio),
        },
        {
          img: getAssetUrl(s3Assets.గడImg),
          text: "గుడి",
          audio: getAssetAudioUrl(s3Assets.గడAudio),
        },
      ],
      correctWord: "తేనె",
      audio: getAssetAudioUrl(s3Assets.తనAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.మడImg2),
          text: "మూడు",
          audio: getAssetAudioUrl(s3Assets.మడAudio2),
        },
        {
          img: getAssetUrl(s3Assets.రణImg),
          text: "రాణి",
          audio: getAssetAudioUrl(s3Assets.రణAudio),
        },
        {
          img: getAssetUrl(s3Assets.తనImg),
          text: "తేనె",
          audio: getAssetAudioUrl(s3Assets.తనAudio),
        },
      ],
      correctWord: "మూడు",
      audio: getAssetAudioUrl(s3Assets.మడAudio2),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.కదImg),
          text: "కింద",
          audio: getAssetAudioUrl(s3Assets.కదAudio),
        },
        {
          img: getAssetUrl(s3Assets.బవImg),
          text: "బావి",
          audio: getAssetAudioUrl(s3Assets.బవAudio),
        },
        {
          img: getAssetUrl(s3Assets.నరImg),
          text: "నూరు",
          audio: getAssetAudioUrl(s3Assets.నరAudio),
        },
      ],
      correctWord: "నూరు",
      audio: getAssetAudioUrl(s3Assets.నరAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.గడImg),
          text: "గుడి",
          audio: getAssetAudioUrl(s3Assets.గడAudio),
        },
        {
          img: getAssetUrl(s3Assets.దగImg),
          text: "దొంగ",
          audio: getAssetAudioUrl(s3Assets.దగAudio),
        },
        {
          img: getAssetUrl(s3Assets.మడImg2),
          text: "మూడు",
          audio: getAssetAudioUrl(s3Assets.మడAudio2),
        },
      ],
      correctWord: "దొంగ",
      audio: getAssetAudioUrl(s3Assets.దగAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.గడImg),
          text: "గుడి",
          audio: getAssetAudioUrl(s3Assets.గడAudio),
        },
        {
          img: getAssetUrl(s3Assets.బవImg),
          text: "బావి",
          audio: getAssetAudioUrl(s3Assets.బవAudio),
        },
        {
          img: getAssetUrl(s3Assets.రణImg),
          text: "రాణి",
          audio: getAssetAudioUrl(s3Assets.రణAudio),
        },
      ],
      correctWord: "బావి",
      audio: getAssetAudioUrl(s3Assets.బవAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.నపపImg),
          text: "నిప్పు",
          audio: getAssetAudioUrl(s3Assets.నపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.అననImg),
          text: "అన్నం",
          audio: getAssetAudioUrl(s3Assets.అననAudio),
        },
        {
          img: getAssetUrl(s3Assets.డబబImg),
          text: "డబ్బు",
          audio: getAssetAudioUrl(s3Assets.డబబAudio),
        },
      ],
      correctWord: "నిప్పు",
      audio: getAssetAudioUrl(s3Assets.నపపAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.అననImg),
          text: "అన్నం",
          audio: getAssetAudioUrl(s3Assets.అననAudio),
        },
        {
          img: getAssetUrl(s3Assets.ధనయImg),
          text: "ధాన్యం",
          audio: getAssetAudioUrl(s3Assets.ధనయAudio),
        },
        {
          img: getAssetUrl(s3Assets.బససImg),
          text: "బస్సు",
          audio: getAssetAudioUrl(s3Assets.బససAudio),
        },
      ],
      correctWord: "ధాన్యం",
      audio: getAssetAudioUrl(s3Assets.ధనయAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ధనయImg),
          text: "ధాన్యం",
          audio: getAssetAudioUrl(s3Assets.ధనయAudio),
        },
        {
          img: getAssetUrl(s3Assets.డబబImg),
          text: "డబ్బు",
          audio: getAssetAudioUrl(s3Assets.డబబAudio),
        },
        {
          img: getAssetUrl(s3Assets.బససImg),
          text: "బస్సు",
          audio: getAssetAudioUrl(s3Assets.బససAudio),
        },
      ],
      correctWord: "బస్సు",
      audio: getAssetAudioUrl(s3Assets.బససAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.బససImg),
          text: "బస్సు",
          audio: getAssetAudioUrl(s3Assets.బససAudio),
        },
        {
          img: getAssetUrl(s3Assets.మకకImg),
          text: "ముక్కు",
          audio: getAssetAudioUrl(s3Assets.మకకAudio),
        },
      ],
      correctWord: "పప్పు",
      audio: getAssetAudioUrl(s3Assets.పపపAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.డబబImg),
          text: "డబ్బు",
          audio: getAssetAudioUrl(s3Assets.డబబAudio),
        },
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.బటటImg),
          text: "బుట్ట",
          audio: getAssetAudioUrl(s3Assets.బటటAudio),
        },
      ],
      correctWord: "డబ్బు",
      audio: getAssetAudioUrl(s3Assets.డబబAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.బవవImg),
          text: "బువ్వ",
          audio: getAssetAudioUrl(s3Assets.బవవAudio),
        },
        {
          img: getAssetUrl(s3Assets.మలలImg),
          text: "మల్లె",
          audio: getAssetAudioUrl(s3Assets.మలలAudio),
        },
      ],
      correctWord: "బువ్వ",
      audio: getAssetAudioUrl(s3Assets.బవవAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.బటటImg),
          text: "బుట్ట",
          audio: getAssetAudioUrl(s3Assets.బటటAudio),
        },
        {
          img: getAssetUrl(s3Assets.అననImg),
          text: "అన్నం",
          audio: getAssetAudioUrl(s3Assets.అననAudio),
        },
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
      ],
      correctWord: "అన్నం",
      audio: getAssetAudioUrl(s3Assets.అననAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.మలలImg),
          text: "మల్లె",
          audio: getAssetAudioUrl(s3Assets.మలలAudio),
        },
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.అననImg),
          text: "అన్నం",
          audio: getAssetAudioUrl(s3Assets.అననAudio),
        },
      ],
      correctWord: "మల్లె",
      audio: getAssetAudioUrl(s3Assets.మలలAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.డబబImg),
          text: "డబ్బు",
          audio: getAssetAudioUrl(s3Assets.డబబAudio),
        },
        {
          img: getAssetUrl(s3Assets.మకకImg),
          text: "ముక్కు",
          audio: getAssetAudioUrl(s3Assets.మకకAudio),
        },
        {
          img: getAssetUrl(s3Assets.బటటImg),
          text: "బుట్ట",
          audio: getAssetAudioUrl(s3Assets.బటటAudio),
        },
      ],
      correctWord: "బుట్ట",
      audio: getAssetAudioUrl(s3Assets.బటటAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.బవవImg),
          text: "బువ్వ",
          audio: getAssetAudioUrl(s3Assets.బవవAudio),
        },
        {
          img: getAssetUrl(s3Assets.పపపImg),
          text: "పప్పు",
          audio: getAssetAudioUrl(s3Assets.పపపAudio),
        },
        {
          img: getAssetUrl(s3Assets.మకకImg),
          text: "ముక్కు",
          audio: getAssetAudioUrl(s3Assets.మకకAudio),
        },
      ],
      correctWord: "ముక్కు",
      audio: getAssetAudioUrl(s3Assets.మకకAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పలలలImg),
          text: "పుల్లలు",
          audio: getAssetAudioUrl(s3Assets.పలలలAudio),
        },
        {
          img: getAssetUrl(s3Assets.గమమడImg),
          text: "గుమ్మడి",
          audio: getAssetAudioUrl(s3Assets.గమమడAudio),
        },
        {
          img: getAssetUrl(s3Assets.మదదబతImg),
          text: "ముద్దబంతి",
          audio: getAssetAudioUrl(s3Assets.మదదబతAudio),
        },
      ],
      correctWord: "పుల్లలు",
      audio: getAssetAudioUrl(s3Assets.పలలలAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.వరణమలImg),
          text: "వర్ణమాల",
          audio: getAssetAudioUrl(s3Assets.వరణమలAudio),
        },
        {
          img: getAssetUrl(s3Assets.గమమడImg),
          text: "గుమ్మడి",
          audio: getAssetAudioUrl(s3Assets.గమమడAudio),
        },
        {
          img: getAssetUrl(s3Assets.పటటకImg),
          text: "పట్టిక",
          audio: getAssetAudioUrl(s3Assets.పటటకAudio),
        },
      ],
      correctWord: "పట్టిక",
      audio: getAssetAudioUrl(s3Assets.పటటకAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.వరషలImg),
          text: "వర్షాలు",
          audio: getAssetAudioUrl(s3Assets.వరషలAudio),
        },
        {
          img: getAssetUrl(s3Assets.బతకమమImg),
          text: "బతుకమ్మ",
          audio: getAssetAudioUrl(s3Assets.బతకమమAudio),
        },
        {
          img: getAssetUrl(s3Assets.కయలడరImg),
          text: "క్యాలెండర్",
          audio: getAssetAudioUrl(s3Assets.కయలడరAudio),
        },
      ],
      correctWord: "వర్షాలు",
      audio: getAssetAudioUrl(s3Assets.వరషలAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.మదదబతImg),
          text: "ముద్దబంతి",
          audio: getAssetAudioUrl(s3Assets.మదదబతAudio),
        },
        {
          img: getAssetUrl(s3Assets.గమమడImg),
          text: "గుమ్మడి",
          audio: getAssetAudioUrl(s3Assets.గమమడAudio),
        },
        {
          img: getAssetUrl(s3Assets.చలకమమImg),
          text: "చిలకమ్మ",
          audio: getAssetAudioUrl(s3Assets.చలకమమAudio),
        },
      ],
      correctWord: "గుమ్మడి",
      audio: getAssetAudioUrl(s3Assets.గమమడAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.కయలడరImg),
          text: "క్యాలెండర్",
          audio: getAssetAudioUrl(s3Assets.కయలడరAudio),
        },
        {
          img: getAssetUrl(s3Assets.బతకమమImg),
          text: "బతుకమ్మ",
          audio: getAssetAudioUrl(s3Assets.బతకమమAudio),
        },
        {
          img: getAssetUrl(s3Assets.పలపటటImg),
          text: "పాలపిట్ట",
          audio: getAssetAudioUrl(s3Assets.పలపటటAudio),
        },
      ],
      correctWord: "బతుకమ్మ",
      audio: getAssetAudioUrl(s3Assets.బతకమమAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.బతకమమImg),
          text: "బతుకమ్మ",
          audio: getAssetAudioUrl(s3Assets.బతకమమAudio),
        },
        {
          img: getAssetUrl(s3Assets.వరణమలImg),
          text: "వర్ణమాల",
          audio: getAssetAudioUrl(s3Assets.వరణమలAudio),
        },
        {
          img: getAssetUrl(s3Assets.పలపటటImg),
          text: "పాలపిట్ట",
          audio: getAssetAudioUrl(s3Assets.పలపటటAudio),
        },
      ],
      correctWord: "పాలపిట్ట",
      audio: getAssetAudioUrl(s3Assets.పలపటటAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.వరణమలImg),
          text: "వర్ణమాల",
          audio: getAssetAudioUrl(s3Assets.వరణమలAudio),
        },
        {
          img: getAssetUrl(s3Assets.పటటకImg),
          text: "పట్టిక",
          audio: getAssetAudioUrl(s3Assets.పటటకAudio),
        },
        {
          img: getAssetUrl(s3Assets.గమమడImg),
          text: "గుమ్మడి",
          audio: getAssetAudioUrl(s3Assets.గమమడAudio),
        },
      ],
      correctWord: "వర్ణమాల",
      audio: getAssetAudioUrl(s3Assets.వరణమలAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.గమమడImg),
          text: "గుమ్మడి",
          audio: getAssetAudioUrl(s3Assets.గమమడAudio),
        },
        {
          img: getAssetUrl(s3Assets.కయలడరImg),
          text: "క్యాలెండర్",
          audio: getAssetAudioUrl(s3Assets.కయలడరAudio),
        },
        {
          img: getAssetUrl(s3Assets.మదదబతImg),
          text: "ముద్దబంతి",
          audio: getAssetAudioUrl(s3Assets.మదదబతAudio),
        },
      ],
      correctWord: "ముద్దబంతి",
      audio: getAssetAudioUrl(s3Assets.మదదబతAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.పలపటటImg),
          text: "పాలపిట్ట",
          audio: getAssetAudioUrl(s3Assets.పలపటటAudio),
        },
        {
          img: getAssetUrl(s3Assets.చలకమమImg),
          text: "చిలకమ్మ",
          audio: getAssetAudioUrl(s3Assets.చలకమమAudio),
        },
        {
          img: getAssetUrl(s3Assets.వరషలImg),
          text: "వర్షాలు",
          audio: getAssetAudioUrl(s3Assets.వరషలAudio),
        },
      ],
      correctWord: "చిలకమ్మ",
      audio: getAssetAudioUrl(s3Assets.చలకమమAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.వరణమలImg),
          text: "వర్ణమాల",
          audio: getAssetAudioUrl(s3Assets.వరణమలAudio),
        },
        {
          img: getAssetUrl(s3Assets.కయలడరImg),
          text: "క్యాలెండర్",
          audio: getAssetAudioUrl(s3Assets.కయలడరAudio),
        },
        {
          img: getAssetUrl(s3Assets.బతకమమImg),
          text: "బతుకమ్మ",
          audio: getAssetAudioUrl(s3Assets.బతకమమAudio),
        },
      ],
      correctWord: "క్యాలెండర్",
      audio: getAssetAudioUrl(s3Assets.కయలడరAudio),
      flowName: "P4",
      type: "soundMatch",
    },
  ],
  kn: [
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವನImg),
          text: "ವನ",
          audio: getAssetAudioUrl(s3Assets.ವನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಜImg),
          text: "ಮಜ",
          audio: getAssetAudioUrl(s3Assets.ಮಜAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
      ],
      correctWord: "ವನ",
      audio: getAssetAudioUrl(s3Assets.ವನAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ದನImg),
          text: "ದನ",
          audio: getAssetAudioUrl(s3Assets.ದನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಜImg),
          text: "ಮಜ",
          audio: getAssetAudioUrl(s3Assets.ಮಜAudio),
        },
        {
          img: getAssetUrl(s3Assets.ರಥImg),
          text: "ರಥ",
          audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        },
      ],
      correctWord: "ರಥ",
      audio: getAssetAudioUrl(s3Assets.ರಥAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವನImg),
          text: "ವನ",
          audio: getAssetAudioUrl(s3Assets.ವನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಪಟImg),
          text: "ಪಟ",
          audio: getAssetAudioUrl(s3Assets.ಪಟAudio),
        },
      ],
      correctWord: "ಪಟ",
      audio: getAssetAudioUrl(s3Assets.ಪಟAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ರಸImg),
          text: "ರಸ",
          audio: getAssetAudioUrl(s3Assets.ರಸAudio),
        },
        {
          img: getAssetUrl(s3Assets.ದನImg),
          text: "ದನ",
          audio: getAssetAudioUrl(s3Assets.ದನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವನImg),
          text: "ವನ",
          audio: getAssetAudioUrl(s3Assets.ವನAudio),
        },
      ],
      correctWord: "ರಸ",
      audio: getAssetAudioUrl(s3Assets.ರಸAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಜImg),
          text: "ಮಜ",
          audio: getAssetAudioUrl(s3Assets.ಮಜAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಫಲಕImg),
          text: "ಫಲಕ",
          audio: getAssetAudioUrl(s3Assets.ಫಲಕAudio),
        },
      ],
      correctWord: "ಮಜ",
      audio: getAssetAudioUrl(s3Assets.ಮಜAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವನImg),
          text: "ವನ",
          audio: getAssetAudioUrl(s3Assets.ವನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ರಥImg),
          text: "ರಥ",
          audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        },
        {
          img: getAssetUrl(s3Assets.ದನImg),
          text: "ದನ",
          audio: getAssetAudioUrl(s3Assets.ದನAudio),
        },
      ],
      correctWord: "ದನ",
      audio: getAssetAudioUrl(s3Assets.ದನAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಶರImg),
          text: "ಶರ",
          audio: getAssetAudioUrl(s3Assets.ಶರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಗರImg),
          text: "ನಗರ",
          audio: getAssetAudioUrl(s3Assets.ನಗರAudio),
        },
      ],
      correctWord: "ಶರ",
      audio: getAssetAudioUrl(s3Assets.ಶರAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವನImg),
          text: "ವನ",
          audio: getAssetAudioUrl(s3Assets.ವನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ರಥImg),
          text: "ರಥ",
          audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಫಲಕImg),
          text: "ಫಲಕ",
          audio: getAssetAudioUrl(s3Assets.ಫಲಕAudio),
        },
      ],
      correctWord: "ಫಲಕ",
      audio: getAssetAudioUrl(s3Assets.ಫಲಕAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಶರImg),
          text: "ಶರ",
          audio: getAssetAudioUrl(s3Assets.ಶರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಗರImg),
          text: "ನಗರ",
          audio: getAssetAudioUrl(s3Assets.ನಗರAudio),
        },
      ],
      correctWord: "ನಗರ",
      audio: getAssetAudioUrl(s3Assets.ನಗರAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಶರImg),
          text: "ಶರ",
          audio: getAssetAudioUrl(s3Assets.ಶರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸಮಯImg),
          text: "ಸಮಯ",
          audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ರಸImg),
          text: "ರಸ",
          audio: getAssetAudioUrl(s3Assets.ರಸAudio),
        },
      ],
      correctWord: "ಸಮಯ",
      audio: getAssetAudioUrl(s3Assets.ಸಮಯAudio),
      flowName: "P1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಶಲImg),
          text: "ಶಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಶಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನರImg),
          text: "ನೀರು",
          audio: getAssetAudioUrl(s3Assets.ನರAudio),
        },
      ],
      correctWord: "ಶಾಲೆ",
      audio: getAssetAudioUrl(s3Assets.ಶಲAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ತಟImg),
          text: "ತುಟಿ",
          audio: getAssetAudioUrl(s3Assets.ತಟAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಭನImg),
          text: "ಭಾನು",
          audio: getAssetAudioUrl(s3Assets.ಭನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಡImg),
          text: "ನೋಡು",
          audio: getAssetAudioUrl(s3Assets.ನಡAudio),
        },
      ],
      correctWord: "ಭಾನು",
      audio: getAssetAudioUrl(s3Assets.ಭನAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಸದರImg),
          text: "ಸುಂದರ",
          audio: getAssetAudioUrl(s3Assets.ಸದರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನರImg),
          text: "ನೀರು",
          audio: getAssetAudioUrl(s3Assets.ನರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮರImg),
          text: "ಮೂರು",
          audio: getAssetAudioUrl(s3Assets.ಮರAudio),
        },
      ],
      correctWord: "ಮೂರು",
      audio: getAssetAudioUrl(s3Assets.ಮರAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಮಲImg),
          text: "ಮಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಮಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನರImg),
          text: "ನೀರು",
          audio: getAssetAudioUrl(s3Assets.ನರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಎರಡImg),
          text: "ಎರಡು",
          audio: getAssetAudioUrl(s3Assets.ಎರಡAudio),
        },
      ],
      correctWord: "ನೀರು",
      audio: getAssetAudioUrl(s3Assets.ನರAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಡImg),
          text: "ನೋಡು",
          audio: getAssetAudioUrl(s3Assets.ನಡAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನರImg),
          text: "ನೀರು",
          audio: getAssetAudioUrl(s3Assets.ನರAudio),
        },
      ],
      correctWord: "ನೋಡು",
      audio: getAssetAudioUrl(s3Assets.ನಡAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಸದರImg),
          text: "ಸುಂದರ",
          audio: getAssetAudioUrl(s3Assets.ಸದರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮರImg),
          text: "ಮೂರು",
          audio: getAssetAudioUrl(s3Assets.ಮರAudio),
        },
      ],
      correctWord: "ಕಾಗೆ",
      audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಡImg),
          text: "ನೋಡು",
          audio: getAssetAudioUrl(s3Assets.ನಡAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಲImg),
          text: "ಮಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಮಲAudio),
        },
      ],
      correctWord: "ಮಾಲೆ",
      audio: getAssetAudioUrl(s3Assets.ಮಲAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ತಟImg),
          text: "ತುಟಿ",
          audio: getAssetAudioUrl(s3Assets.ತಟAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಲImg),
          text: "ಮಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಮಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಶಲImg),
          text: "ಶಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಶಲAudio),
        },
      ],
      correctWord: "ತುಟಿ",
      audio: getAssetAudioUrl(s3Assets.ತಟAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಶಲImg),
          text: "ಶಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಶಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸದರImg),
          text: "ಸುಂದರ",
          audio: getAssetAudioUrl(s3Assets.ಸದರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
      ],
      correctWord: "ಸುಂದರ",
      audio: getAssetAudioUrl(s3Assets.ಸದರAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಎರಡImg),
          text: "ಎರಡು",
          audio: getAssetAudioUrl(s3Assets.ಎರಡAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಭನImg),
          text: "ಭಾನು",
          audio: getAssetAudioUrl(s3Assets.ಭನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಗImg),
          text: "ಕಾಗೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಗAudio),
        },
      ],
      correctWord: "ಎರಡು",
      audio: getAssetAudioUrl(s3Assets.ಎರಡAudio),
      flowName: "P3",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕಪಪImg),
          text: "ಕಪ್ಪೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಪಪAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಪರಕತImg),
          text: "ಪ್ರಕೃತಿ",
          audio: getAssetAudioUrl(s3Assets.ಪರಕತAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಲಲImg),
          text: "ಹುಲ್ಲು",
          audio: getAssetAudioUrl(s3Assets.ಹಲಲAudio),
        },
      ],
      correctWord: "ಕಪ್ಪೆ",
      audio: getAssetAudioUrl(s3Assets.ಕಪಪAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕಮಮರImg),
          text: "ಕಮ್ಮಾರ",
          audio: getAssetAudioUrl(s3Assets.ಕಮಮರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಬಬImg),
          text: "ಹಬ್ಬ",
          audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಅವವImg),
          text: "ಅವ್ವ",
          audio: getAssetAudioUrl(s3Assets.ಅವವAudio),
        },
      ],
      correctWord: "ಹಬ್ಬ",
      audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಹಬಬImg),
          text: "ಹಬ್ಬ",
          audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಮಮರImg),
          text: "ಕಮ್ಮಾರ",
          audio: getAssetAudioUrl(s3Assets.ಕಮಮರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಉಯಯಲImg),
          text: "ಉಯ್ಯಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಉಯಯಲAudio),
        },
      ],
      correctWord: "ಕಮ್ಮಾರ",
      audio: getAssetAudioUrl(s3Assets.ಕಮಮರAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಉಯಯಲImg),
          text: "ಉಯ್ಯಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಉಯಯಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಅವವImg),
          text: "ಅವ್ವ",
          audio: getAssetAudioUrl(s3Assets.ಅವವAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಲಲImg),
          text: "ಹುಲ್ಲು",
          audio: getAssetAudioUrl(s3Assets.ಹಲಲAudio),
        },
      ],
      correctWord: "ಉಯ್ಯಾಲೆ",
      audio: getAssetAudioUrl(s3Assets.ಉಯಯಲAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಹಬಬImg),
          text: "ಹಬ್ಬ",
          audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಪಪImg),
          text: "ಕಪ್ಪೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಪಪAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಚದರImg),
          text: "ಚಂದ್ರ",
          audio: getAssetAudioUrl(s3Assets.ಚದರAudio),
        },
      ],
      correctWord: "ಚಂದ್ರ",
      audio: getAssetAudioUrl(s3Assets.ಚದರAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಹಲಲImg),
          text: "ಹುಲ್ಲು",
          audio: getAssetAudioUrl(s3Assets.ಹಲಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕಪಪImg),
          text: "ಕಪ್ಪೆ",
          audio: getAssetAudioUrl(s3Assets.ಕಪಪAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಬಬImg),
          text: "ಹಬ್ಬ",
          audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
        },
      ],
      correctWord: "ಹುಲ್ಲು",
      audio: getAssetAudioUrl(s3Assets.ಹಲಲAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಚದರImg),
          text: "ಚಂದ್ರ",
          audio: getAssetAudioUrl(s3Assets.ಚದರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಅವವImg),
          text: "ಅವ್ವ",
          audio: getAssetAudioUrl(s3Assets.ಅವವAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಬಸಸImg),
          text: "ಬಸ್ಸು",
          audio: getAssetAudioUrl(s3Assets.ಬಸಸAudio),
        },
      ],
      correctWord: "ಅವ್ವ",
      audio: getAssetAudioUrl(s3Assets.ಅವವAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಅವವImg),
          text: "ಅವ್ವ",
          audio: getAssetAudioUrl(s3Assets.ಅವವAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಳಳImg),
          text: "ಹಳ್ಳ",
          audio: getAssetAudioUrl(s3Assets.ಹಳಳAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಬಸಸImg),
          text: "ಬಸ್ಸು",
          audio: getAssetAudioUrl(s3Assets.ಬಸಸAudio),
        },
      ],
      correctWord: "ಬಸ್ಸು",
      audio: getAssetAudioUrl(s3Assets.ಬಸಸAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಉಯಯಲImg),
          text: "ಉಯ್ಯಾಲೆ",
          audio: getAssetAudioUrl(s3Assets.ಉಯಯಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಳಳImg),
          text: "ಹಳ್ಳ",
          audio: getAssetAudioUrl(s3Assets.ಹಳಳAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಚದರImg),
          text: "ಚಂದ್ರ",
          audio: getAssetAudioUrl(s3Assets.ಚದರAudio),
        },
      ],
      correctWord: "ಹಳ್ಳ",
      audio: getAssetAudioUrl(s3Assets.ಹಳಳAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಹಬಬImg),
          text: "ಹಬ್ಬ",
          audio: getAssetAudioUrl(s3Assets.ಹಬಬAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಪರಕತImg),
          text: "ಪ್ರಕೃತಿ",
          audio: getAssetAudioUrl(s3Assets.ಪರಕತAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಹಳಳImg),
          text: "ಹಳ್ಳ",
          audio: getAssetAudioUrl(s3Assets.ಹಳಳAudio),
        },
      ],
      correctWord: "ಪ್ರಕೃತಿ",
      audio: getAssetAudioUrl(s3Assets.ಪರಕತAudio),
      flowName: "P2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವಯಯಮImg),
          text: "ವ್ಯಾಯಾಮ",
          audio: getAssetAudioUrl(s3Assets.ವಯಯಮAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಳಯದಲImg),
          text: "ವೀಳ್ಯೆದೆಲೆ",
          audio: getAssetAudioUrl(s3Assets.ವಳಯದಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸರಯImg),
          text: "ಸೂರ್ಯ",
          audio: getAssetAudioUrl(s3Assets.ಸರಯAudio),
        },
      ],
      correctWord: "ಸೂರ್ಯ",
      audio: getAssetAudioUrl(s3Assets.ಸರಯAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಅಕಷರImg),
          text: "ಅಕ್ಷರ",
          audio: getAssetAudioUrl(s3Assets.ಅಕಷರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಯಯಮImg),
          text: "ವ್ಯಾಯಾಮ",
          audio: getAssetAudioUrl(s3Assets.ವಯಯಮAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಜಞನImg),
          text: "ವಿಜ್ಞಾನ",
          audio: getAssetAudioUrl(s3Assets.ವಜಞನAudio),
        },
      ],
      correctWord: "ಅಕ್ಷರ",
      audio: getAssetAudioUrl(s3Assets.ಅಕಷರAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಅಕಷರImg),
          text: "ಅಕ್ಷರ",
          audio: getAssetAudioUrl(s3Assets.ಅಕಷರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಉತಖನನImg),
          text: "ಉತ್ಖನನ",
          audio: getAssetAudioUrl(s3Assets.ಉತಖನನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಅಣಕಟಟImg),
          text: "ಅಣೆಕಟ್ಟು",
          audio: getAssetAudioUrl(s3Assets.ಅಣಕಟಟAudio),
        },
      ],
      correctWord: "ಉತ್ಖನನ",
      audio: getAssetAudioUrl(s3Assets.ಉತಖನನAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವಜಞನImg),
          text: "ವಿಜ್ಞಾನ",
          audio: getAssetAudioUrl(s3Assets.ವಜಞನAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಷಕರImg),
          text: "ಮುಷ್ಕರ",
          audio: getAssetAudioUrl(s3Assets.ಮಷಕರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಮಸಕರImg),
          text: "ನಮಸ್ಕಾರ",
          audio: getAssetAudioUrl(s3Assets.ನಮಸಕರAudio),
        },
      ],
      correctWord: "ಮುಷ್ಕರ",
      audio: getAssetAudioUrl(s3Assets.ಮಷಕರAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವಯಯಮImg),
          text: "ವ್ಯಾಯಾಮ",
          audio: getAssetAudioUrl(s3Assets.ವಯಯಮAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸರಯImg),
          text: "ಸೂರ್ಯ",
          audio: getAssetAudioUrl(s3Assets.ಸರಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಮಸಕರImg),
          text: "ನಮಸ್ಕಾರ",
          audio: getAssetAudioUrl(s3Assets.ನಮಸಕರAudio),
        },
      ],
      correctWord: "ವ್ಯಾಯಾಮ",
      audio: getAssetAudioUrl(s3Assets.ವಯಯಮAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕರನಟಕImg),
          text: "ಕರ್ನಾಟಕ",
          audio: getAssetAudioUrl(s3Assets.ಕರನಟಕAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಳಯದಲImg),
          text: "ವೀಳ್ಯೆದೆಲೆ",
          audio: getAssetAudioUrl(s3Assets.ವಳಯದಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಮಷಕರImg),
          text: "ಮುಷ್ಕರ",
          audio: getAssetAudioUrl(s3Assets.ಮಷಕರAudio),
        },
      ],
      correctWord: "ಕರ್ನಾಟಕ",
      audio: getAssetAudioUrl(s3Assets.ಕರನಟಕAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಅಕಷರImg),
          text: "ಅಕ್ಷರ",
          audio: getAssetAudioUrl(s3Assets.ಅಕಷರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕರನಟಕImg),
          text: "ಕರ್ನಾಟಕ",
          audio: getAssetAudioUrl(s3Assets.ಕರನಟಕAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಅಣಕಟಟImg),
          text: "ಅಣೆಕಟ್ಟು",
          audio: getAssetAudioUrl(s3Assets.ಅಣಕಟಟAudio),
        },
      ],
      correctWord: "ಅಣೆಕಟ್ಟು",
      audio: getAssetAudioUrl(s3Assets.ಅಣಕಟಟAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ನಮಸಕರImg),
          text: "ನಮಸ್ಕಾರ",
          audio: getAssetAudioUrl(s3Assets.ನಮಸಕರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಕರನಟಕImg),
          text: "ಕರ್ನಾಟಕ",
          audio: getAssetAudioUrl(s3Assets.ಕರನಟಕAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಳಯದಲImg),
          text: "ವೀಳ್ಯೆದೆಲೆ",
          audio: getAssetAudioUrl(s3Assets.ವಳಯದಲAudio),
        },
      ],
      correctWord: "ನಮಸ್ಕಾರ",
      audio: getAssetAudioUrl(s3Assets.ನಮಸಕರAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ಕರನಟಕImg),
          text: "ಕರ್ನಾಟಕ",
          audio: getAssetAudioUrl(s3Assets.ಕರನಟಕAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸರಯImg),
          text: "ಸೂರ್ಯ",
          audio: getAssetAudioUrl(s3Assets.ಸರಯAudio),
        },
        {
          img: getAssetUrl(s3Assets.ವಜಞನImg),
          text: "ವಿಜ್ಞಾನ",
          audio: getAssetAudioUrl(s3Assets.ವಜಞನAudio),
        },
      ],
      correctWord: "ವಿಜ್ಞಾನ",
      audio: getAssetAudioUrl(s3Assets.ವಜಞನAudio),
      flowName: "P4",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ವಳಯದಲImg),
          text: "ವೀಳ್ಯೆದೆಲೆ",
          audio: getAssetAudioUrl(s3Assets.ವಳಯದಲAudio),
        },
        {
          img: getAssetUrl(s3Assets.ನಮಸಕರImg),
          text: "ನಮಸ್ಕಾರ",
          audio: getAssetAudioUrl(s3Assets.ನಮಸಕರAudio),
        },
        {
          img: getAssetUrl(s3Assets.ಸರಯImg),
          text: "ಸೂರ್ಯ",
          audio: getAssetAudioUrl(s3Assets.ಸರಯAudio),
        },
      ],
      correctWord: "ವೀಳ್ಯೆದೆಲೆ",
      audio: getAssetAudioUrl(s3Assets.ವಳಯದಲAudio),
      flowName: "P4",
      type: "soundMatch",
    },
  ],
};

const SoundHunt = ({
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
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [scale, setScale] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Filter content based on milestone level, step title, and steps prop (from API/config)
  // Content selection logic:
  // 1. Get milestone level (M1 or M2) from level prop
  // 2. Get current step title from progressData (e.g., "P1", "P2", "P3", "P6", "P7")
  // 3. Map step to flowNames based on milestone:
  //    - M1: Steps P1, P2, P6, P7 → show flowName P1, P3
  //    - M2: Steps P1, P2, P6, P7 → show flowName P2, P4
  //    - Other steps: use step title as flowName (e.g., P3 → flowName P3)
  // 4. Limit by steps (contentCount from config)
  const filteredContent = useMemo(() => {
    // Get milestone level (level prop is number like 1, 2, etc.)
    const milestoneLevel = level ? `m${level}` : null;
    const language = getLocalData("lang");

    // Get current step title from progressData
    const currentStepTitle =
      progressData?.currentPracticeStep !== undefined
        ? practiceSteps?.[progressData.currentPracticeStep]?.title
        : null;

    // Determine which flowNames to show based on milestone and step
    let validFlowNames = null;

    if (
      milestoneLevel === "m1" &&
      currentStepTitle &&
      ["P1", "P2", "P6", "P7"].includes(currentStepTitle)
    ) {
      // M1: Steps P1, P2, P6, P7 → show flowName P1, P3
      validFlowNames = ["P1", "P3"];
    } else if (
      milestoneLevel === "m2" &&
      currentStepTitle &&
      ["P1", "P2", "P6", "P7"].includes(currentStepTitle)
    ) {
      // M2: Steps P1, P2, P6, P7 → show flowName P2, P4
      validFlowNames = ["P2", "P4"];
    } else if (currentStepTitle) {
      // For other steps, use step title as flowName (e.g., P3 → flowName P3, P4 → flowName P4)
      validFlowNames = [currentStepTitle];
    }

    // Filter content by valid flowNames
    let stepContent = content[language];
    if (validFlowNames && validFlowNames.length > 0) {
      stepContent = content[language].filter((item) =>
        validFlowNames.includes(item.flowName)
      );
    }

    // If no content found, fallback to all content
    if (stepContent.length === 0) {
      stepContent = content[language];
    }

    // Limit by steps (contentCount from config) if provided
    if (steps && steps > 0) {
      return stepContent.slice(0, steps);
    }

    // Default: return all filtered content for the step
    return stepContent;
  }, [steps, progressData, level]);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    const currentQuestion = filteredContent[currentQuestionIndex];

    if (word === currentQuestion.correctWord) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongWord(null);
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedWord(null);
        // setCurrentQuestionIndex(
        //   (prevIndex) => (prevIndex + 1) % content.L1.length
        // );
        setRecording("recording");
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 2000);
    }
  };

  const currentQuestion = filteredContent[currentQuestionIndex];

  const flowNames = [...new Set(filteredContent.map((item) => item.flowName))];
  const activeFlow =
    filteredContent[currentQuestionIndex]?.flowName || flowNames[0];

  const correctImage = currentQuestion?.allwords?.find(
    (word) => word.text === currentQuestion?.correctWord
  )?.img;

  let currentAudio = null;

  const handlePlayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    currentAudio = new Audio(filteredContent[currentQuestionIndex].audio);

    currentAudio.play();
    setIsPlaying(true);
    setIsAudioPlayedOnce(true);

    currentAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m1"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
      rStep={rStep}
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
      {currentQuestion?.allwords ? (
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
              {showConfetti && <Confetti />}

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

              {selectedWord === currentQuestion?.correctWord ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    marginBottom: "75px",
                  }}
                >
                  <img
                    src={Assets.tickImg}
                    alt="Tick"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ) : wrongWord ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "60%",
                    backgroundColor: "rgba(255, 127, 54, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "4px solid #FFFFFF",
                    marginBottom: "75px",
                  }}
                >
                  <img
                    src={Assets.xImg}
                    alt="Wrong"
                    style={{ width: "25px", height: "25px" }}
                  />
                </div>
              ) : (
                <button
                  onClick={handlePlayAudio}
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
              )}

              <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
                {currentQuestion?.allwords.map((item, index) => {
                  const isCorrect =
                    selectedWord === currentQuestion?.correctWord &&
                    item.text === selectedWord;
                  const isWrong = wrongWord === item.text;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: isCorrect
                          ? "rgba(117, 209, 0, 0.6)"
                          : isWrong
                          ? "rgba(255, 127, 54, 0.8)"
                          : "#FFFFFF",
                        padding: "8px",
                        borderRadius: "24px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                        width: isMobile ? "60px" : "128px",
                        height: isMobile ? "60px" : "128px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(56px)",
                        WebkitBackdropFilter: "blur(56px)",
                        cursor: isAudioPlayedOnce ? "pointer" : "not-allowed",
                        opacity: isAudioPlayedOnce ? 1 : 0.7,
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      onClick={() => {
                        if (isAudioPlayedOnce) {
                          handleWordClick(item.text);
                        }
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.text}
                        style={{
                          width: isMobile ? "55px" : "110px",
                          height: isMobile ? "55px" : "110px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
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
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <img
                onClick={() => {
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
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
                <RecordVoiceVisualizer />
              </Box>
              <img
                onClick={async () => {
                  const audio = new Audio(correctSound);
                  audio.play();
                  setRecording("no");
                  setIsPlaying(false);
                  setIsAudioPlayedOnce(false);
                  await handleNext();
                  if (currentQuestionIndex === filteredContent.length - 1) {
                    return;
                  }
                  // if (currentQuestionIndex === filteredContent.length - 1) {
                  //   // If handleNext prop is provided (e.g., from Practice flow), use it to update progress
                  //   if (handleNext && typeof handleNext === "function") {
                  //     // Call handleNext(true) to indicate mechanism is complete and trigger progress update
                  //     await handleNext();
                  //     return;
                  //   } else {
                  //     // Standalone mode - navigate to discover-start
                  //     setLocalData("rFlow", false);
                  //     setLocalData("mFail", false);
                  //     setLocalData("rStep", 0);
                  //     if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                  //       navigate("/");
                  //     } else {
                  //       navigate("/discover-start");
                  //     }
                  //   }
                  // } else {
                  setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                  // }
                }}
                src={Assets.pause}
                alt="Stop"
                style={{ width: "60px", height: "60px", cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px" }}>{currentQuestion?.correctWord}</h2>
          {correctImage && (
            <img
              src={correctImage}
              alt={currentQuestion?.correctWord}
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
                  onClick={async () => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    setIsPlaying(false);
                    if (currentQuestionIndex === filteredContent.length - 1) {
                      // If handleNext prop is provided (e.g., from Practice flow), use it to update progress
                      if (handleNext && typeof handleNext === "function") {
                        // Call handleNext(true) to indicate mechanism is complete and trigger progress update
                        await handleNext();
                        return;
                      } else {
                        // Standalone mode - navigate to discover-start
                        setLocalData("rFlow", false);
                        setLocalData("mFail", false);
                        setLocalData("rStep", 0);
                        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                          navigate("/");
                        } else {
                          navigate("/discover-start");
                        }
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

export default SoundHunt;
