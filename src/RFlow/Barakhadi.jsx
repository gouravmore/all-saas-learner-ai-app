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
import { ArrowRight, RotateCcw } from "lucide-react";
import trainImg from "../assets/trainImg.svg";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnalyser from "../utils/VoiceAnalyser";
import * as s3Assets from "../utils/rFlowS3Links";
import { getAssetUrl } from "../utils/rFlowS3Links";
import { getAssetAudioUrl } from "../utils/rFlowS3Links";

import ballonImg from "../assets/ballon.svg";
import bearImg from "../assets/bear.svg";
import boyImg from "../assets/boy.svg";
import deleteImg from "../assets/delete.svg";
import eraseImg from "../assets/erase.svg";
import listenImgBox from "../assets/listenimgbox.svg";
import boyballonflyImg from "../assets/boyballonfly.svg";
import wordbanaoImg from "../assets/wordbanao.svg";
import dottimg from "../assets/dottimg.svg";
import nextImg from "../assets/nextImg.svg";
import closebuttonImg from "../assets/closebtn.svg";
import { callTelemetryDiscovery } from "../utils/apiUtil";
import audiowaveImg from "../assets/audiowave.svg";
import hintimg from "../assets/hintsicon.svg";

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
import { updateLearnerProfile } from "../services/learnerAi/learnerAiService";

const theme = createTheme();

const vowelsData = {
  hi: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],

  ta: [
    "அ",
    "ஆ",
    "இ",
    "ஈ",
    "உ",
    "ஊ",
    "எ",
    "ஏ",
    "ஐ",
    "ஒ",
    "ஓ",
    "ஔ",
    "ஃ",
    "ஂ",
    "஁",
  ],

  te: [
    "అ",
    "ఆ",
    "ఇ",
    "ఈ",
    "ఉ",
    "ఊ",
    "ఋ",
    "ఎ",
    "ఏ",
    "ఐ",
    "ఒ",
    "ఓ",
    "ఔ",
    "అం",
    "అః",
  ],

  kn: [
    "ಅ",
    "ಆ",
    "ಇ",
    "ಈ",
    "ಉ",
    "ಊ",
    "ಋ",
    "ಎ",
    "ಏ",
    "ಐ",
    "ಒ",
    "ಓ",
    "ಔ",
    "ಅಂ",
    "ಅಃ",
  ],
};

const barakhadiCharts = {
  hi: {
    क: [
      "क",
      "का",
      "कि",
      "की",
      "कु",
      "कू",
      "कृ",
      "के",
      "कै",
      "को",
      "कौ",
      "कं",
      "कः",
    ],
    ख: [
      "ख",
      "खा",
      "खि",
      "खी",
      "खु",
      "खू",
      "खृ",
      "खे",
      "खै",
      "खो",
      "खौ",
      "खं",
      "खः",
    ],
    ग: [
      "ग",
      "गा",
      "गि",
      "गी",
      "गु",
      "गू",
      "गृ",
      "गे",
      "गै",
      "गो",
      "गौ",
      "गं",
      "गः",
    ],
    घ: [
      "घ",
      "घा",
      "घि",
      "घी",
      "घु",
      "घू",
      "घृ",
      "घे",
      "घै",
      "घो",
      "घौ",
      "घं",
      "घः",
    ],
    ङ: [
      "ङ",
      "ङा",
      "ङि",
      "ङी",
      "ङु",
      "ङू",
      "ङृ",
      "ङे",
      "ङै",
      "ङो",
      "ङौ",
      "ङं",
      "ङः",
    ],

    च: [
      "च",
      "चा",
      "चि",
      "ची",
      "चु",
      "चू",
      "चृ",
      "चे",
      "चै",
      "चो",
      "चौ",
      "चं",
      "चः",
    ],
    छ: [
      "छ",
      "छा",
      "छि",
      "छी",
      "छु",
      "छू",
      "छृ",
      "छे",
      "छै",
      "छो",
      "छौ",
      "छं",
      "छः",
    ],
    ज: [
      "ज",
      "जा",
      "जि",
      "जी",
      "जु",
      "जू",
      "जृ",
      "जे",
      "जै",
      "जो",
      "जौ",
      "जं",
      "जः",
    ],
    झ: [
      "झ",
      "झा",
      "झि",
      "झी",
      "झु",
      "झू",
      "झृ",
      "झे",
      "झै",
      "झो",
      "झौ",
      "झं",
      "झः",
    ],
    ञ: [
      "ञ",
      "ञा",
      "ञि",
      "ञी",
      "ञु",
      "ञू",
      "ञृ",
      "ञे",
      "ञै",
      "ञो",
      "ञौ",
      "ञं",
      "ञः",
    ],

    ट: [
      "ट",
      "टा",
      "टि",
      "टी",
      "टु",
      "टू",
      "टृ",
      "टे",
      "टै",
      "टो",
      "टौ",
      "टं",
      "टः",
    ],
    ठ: [
      "ठ",
      "ठा",
      "ठि",
      "ठी",
      "ठु",
      "ठू",
      "ठृ",
      "ठे",
      "ठै",
      "ठो",
      "ठौ",
      "ठं",
      "ठः",
    ],
    ड: [
      "ड",
      "डा",
      "डि",
      "डी",
      "डु",
      "डू",
      "डृ",
      "डे",
      "डै",
      "डो",
      "डौ",
      "डं",
      "डः",
    ],
    ढ: [
      "ढ",
      "ढा",
      "ढि",
      "ढी",
      "ढु",
      "ढू",
      "ढृ",
      "ढे",
      "ढै",
      "ढो",
      "ढौ",
      "ढं",
      "ढः",
    ],
    ण: [
      "ण",
      "णा",
      "णि",
      "णी",
      "णु",
      "णू",
      "णृ",
      "णे",
      "णै",
      "णो",
      "णौ",
      "णं",
      "णः",
    ],

    त: [
      "त",
      "ता",
      "ति",
      "ती",
      "तु",
      "तू",
      "तृ",
      "ते",
      "तै",
      "तो",
      "तौ",
      "तं",
      "तः",
    ],
    थ: [
      "थ",
      "था",
      "थि",
      "थी",
      "थु",
      "थू",
      "थृ",
      "थे",
      "थै",
      "थो",
      "थौ",
      "थं",
      "थः",
    ],
    द: [
      "द",
      "दा",
      "दि",
      "दी",
      "दु",
      "दू",
      "दृ",
      "दे",
      "दै",
      "दो",
      "दौ",
      "दं",
      "दः",
    ],
    ध: [
      "ध",
      "धा",
      "धि",
      "धी",
      "धु",
      "धू",
      "धृ",
      "धे",
      "धै",
      "धो",
      "धौ",
      "धं",
      "धः",
    ],
    न: [
      "न",
      "ना",
      "नि",
      "नी",
      "नु",
      "नू",
      "नृ",
      "ने",
      "नै",
      "नो",
      "नौ",
      "नं",
      "नः",
    ],

    प: [
      "प",
      "पा",
      "पि",
      "पी",
      "पु",
      "पू",
      "पृ",
      "पे",
      "पै",
      "पो",
      "पौ",
      "पं",
      "पः",
    ],
    फ: [
      "फ",
      "फा",
      "फि",
      "फी",
      "फु",
      "फू",
      "फृ",
      "फे",
      "फै",
      "फो",
      "फौ",
      "फं",
      "फः",
    ],
    ब: [
      "ब",
      "बा",
      "बि",
      "बी",
      "बु",
      "बू",
      "बृ",
      "बे",
      "बै",
      "बो",
      "बौ",
      "बं",
      "बः",
    ],
    भ: [
      "भ",
      "भा",
      "भि",
      "भी",
      "भु",
      "भू",
      "भृ",
      "भे",
      "भै",
      "भो",
      "भौ",
      "भं",
      "भः",
    ],
    म: [
      "म",
      "मा",
      "मि",
      "मी",
      "मु",
      "मू",
      "मृ",
      "मे",
      "मै",
      "मो",
      "मौ",
      "मं",
      "मः",
    ],

    य: [
      "य",
      "या",
      "यि",
      "यी",
      "यु",
      "यू",
      "यृ",
      "ये",
      "यै",
      "यो",
      "यौ",
      "यं",
      "यः",
    ],
    र: [
      "र",
      "रा",
      "रि",
      "री",
      "रु",
      "रू",
      "रृ",
      "रे",
      "रै",
      "रो",
      "रौ",
      "रं",
      "रः",
    ],
    ल: [
      "ल",
      "ला",
      "लि",
      "ली",
      "लु",
      "लू",
      "लृ",
      "ले",
      "लै",
      "लो",
      "लौ",
      "लं",
      "लः",
    ],
    व: [
      "व",
      "वा",
      "वि",
      "वी",
      "वु",
      "वू",
      "वृ",
      "वे",
      "वै",
      "वो",
      "वौ",
      "वं",
      "वः",
    ],

    श: [
      "श",
      "शा",
      "शि",
      "शी",
      "शु",
      "शू",
      "शृ",
      "शे",
      "शै",
      "शो",
      "शौ",
      "शं",
      "शः",
    ],
    ष: [
      "ष",
      "षा",
      "षि",
      "षी",
      "षु",
      "षू",
      "षृ",
      "षे",
      "ষৈ",
      "ষো",
      "ষৌ",
      "ষং",
      "ষঃ",
    ],
    स: [
      "स",
      "सा",
      "सि",
      "सी",
      "सु",
      "सू",
      "सृ",
      "से",
      "सै",
      "सो",
      "सौ",
      "सं",
      "सः",
    ],
    ह: [
      "ह",
      "हा",
      "हि",
      "ही",
      "हु",
      "हू",
      "हृ",
      "हे",
      "है",
      "हो",
      "हौ",
      "हं",
      "हः",
    ],
  },

  ta: {
    க: [
      "க",
      "கா",
      "கி",
      "கீ",
      "கு",
      "கூ",
      "கெ",
      "கே",
      "கை",
      "கொ",
      "கோ",
      "கௌ",
      "கஂ",
      "கஃ",
      "க஁",
    ],
    ங: [
      "ங",
      "ஙா",
      "ஙி",
      "ஙீ",
      "ஙு",
      "ஙூ",
      "ஙெ",
      "ஙே",
      "ஙை",
      "ஙொ",
      "ஙோ",
      "ஙௌ",
      "ஙஂ",
      "ஙஃ",
      "ங஁",
    ],
    ச: [
      "ச",
      "சா",
      "சி",
      "சீ",
      "சு",
      "சூ",
      "செ",
      "சே",
      "சை",
      "சொ",
      "சோ",
      "சௌ",
      "சஂ",
      "சஃ",
      "ச஁",
    ],
    ஞ: [
      "ஞ",
      "ஞா",
      "ஞி",
      "ஞீ",
      "ஞு",
      "ஞூ",
      "ஞெ",
      "ஞே",
      "ஞை",
      "ஞொ",
      "ஞோ",
      "ஞௌ",
      "ஞஂ",
      "ஞஃ",
      "ஞ஁",
    ],
    ட: [
      "ட",
      "டா",
      "டி",
      "டீ",
      "டு",
      "டூ",
      "டெ",
      "டே",
      "டை",
      "டொ",
      "டோ",
      "டௌ",
      "டஂ",
      "டஃ",
      "ட஁",
    ],
    ண: [
      "ண",
      "ணா",
      "ணி",
      "ணீ",
      "ணு",
      "ணூ",
      "ணெ",
      "ணே",
      "ணை",
      "ணொ",
      "ணோ",
      "ணௌ",
      "ணஂ",
      "ணஃ",
      "ண஁",
    ],
    த: [
      "த",
      "தா",
      "தி",
      "தீ",
      "து",
      "தூ",
      "தெ",
      "தே",
      "தை",
      "தொ",
      "தோ",
      "தௌ",
      "தஂ",
      "தஃ",
      "த஁",
    ],
    ந: [
      "ந",
      "நா",
      "நி",
      "நீ",
      "நு",
      "நூ",
      "நெ",
      "நே",
      "நை",
      "நொ",
      "நோ",
      "நௌ",
      "நஂ",
      "நஃ",
      "ந஁",
    ],
    ப: [
      "ப",
      "பா",
      "பி",
      "பீ",
      "பு",
      "பூ",
      "பெ",
      "பே",
      "பை",
      "பொ",
      "போ",
      "பௌ",
      "பஂ",
      "பஃ",
      "ப஁",
    ],
    ம: [
      "ம",
      "மா",
      "மி",
      "மீ",
      "மு",
      "மூ",
      "மெ",
      "மே",
      "மை",
      "மொ",
      "மோ",
      "மௌ",
      "மஂ",
      "மஃ",
      "ம஁",
    ],
    ய: [
      "ய",
      "யா",
      "யி",
      "யீ",
      "யு",
      "யூ",
      "யெ",
      "யே",
      "யை",
      "யொ",
      "யோ",
      "யௌ",
      "யஂ",
      "யஃ",
      "ய஁",
    ],
    ர: [
      "ர",
      "ரா",
      "ரி",
      "ரீ",
      "ரு",
      "ரூ",
      "ரெ",
      "ரே",
      "ரை",
      "ரொ",
      "ரோ",
      "ரௌ",
      "ரஂ",
      "ரஃ",
      "ர஁",
    ],
    ல: [
      "ல",
      "லா",
      "லி",
      "லீ",
      "லு",
      "லூ",
      "லெ",
      "லே",
      "லை",
      "லொ",
      "லோ",
      "லௌ",
      "லஂ",
      "லஃ",
      "ல஁",
    ],
    வ: [
      "வ",
      "வா",
      "வி",
      "வீ",
      "வு",
      "வூ",
      "வெ",
      "வே",
      "வை",
      "வொ",
      "வோ",
      "வௌ",
      "வஂ",
      "வஃ",
      "வ஁",
    ],
    ழ: [
      "ழ",
      "ழா",
      "ழி",
      "ழீ",
      "ழு",
      "ழூ",
      "ழெ",
      "ழே",
      "ழை",
      "ழொ",
      "ழோ",
      "ழௌ",
      "ழஂ",
      "ழஃ",
      "ழ஁",
    ],
    ள: [
      "ள",
      "ளா",
      "ளி",
      "ளீ",
      "ளு",
      "ளூ",
      "ளெ",
      "ளே",
      "ளை",
      "ளொ",
      "ளோ",
      "ளௌ",
      "ளஂ",
      "ளஃ",
      "ள஁",
    ],
    ற: [
      "ற",
      "றா",
      "றி",
      "றீ",
      "று",
      "றூ",
      "றெ",
      "றே",
      "றை",
      "றொ",
      "றோ",
      "றௌ",
      "றஂ",
      "றஃ",
      "ற஁",
    ],
    ன: [
      "ன",
      "னா",
      "னி",
      "னீ",
      "னு",
      "னூ",
      "னெ",
      "னே",
      "னை",
      "னொ",
      "னோ",
      "னௌ",
      "னஂ",
      "னஃ",
      "ன஁",
    ],
  },

  te: {
    క: [
      "క",
      "కా",
      "కి",
      "కీ",
      "కు",
      "కూ",
      "కృ",
      "కె",
      "కే",
      "కై",
      "కొ",
      "కో",
      "కౌ",
      "కం",
      "కః",
    ],
    ఖ: [
      "ఖ",
      "ఖా",
      "ఖి",
      "ఖీ",
      "ఖు",
      "ఖూ",
      "ఖృ",
      "ఖె",
      "ఖే",
      "ఖై",
      "ఖొ",
      "ఖో",
      "ఖౌ",
      "ఖం",
      "ఖః",
    ],
    గ: [
      "గ",
      "గా",
      "గి",
      "గీ",
      "గు",
      "గూ",
      "గృ",
      "గె",
      "గే",
      "గై",
      "గొ",
      "గో",
      "గౌ",
      "గం",
      "గః",
    ],
    ఘ: [
      "ఘ",
      "ఘా",
      "ఘి",
      "ఘీ",
      "ఘు",
      "ఘూ",
      "ఘృ",
      "ఘె",
      "ఘే",
      "ఘై",
      "ఘొ",
      "ఘో",
      "ఘౌ",
      "ఘం",
      "ఘః",
    ],
    ఙ: [
      "ఙ",
      "ఙా",
      "ఙి",
      "ఙీ",
      "ఙు",
      "ఙూ",
      "ఙృ",
      "ఙె",
      "ఙే",
      "ఙై",
      "ఙొ",
      "ఙో",
      "ఙౌ",
      "ఙం",
      "ఙః",
    ],
    చ: [
      "చ",
      "చా",
      "చి",
      "చీ",
      "చు",
      "చూ",
      "చృ",
      "చె",
      "చే",
      "చై",
      "చొ",
      "చో",
      "చౌ",
      "చం",
      "చః",
    ],
    ఛ: [
      "ఛ",
      "ఛా",
      "ఛి",
      "ఛీ",
      "ఛు",
      "ఛూ",
      "ఛృ",
      "ఛె",
      "ఛే",
      "ఛై",
      "ఛొ",
      "ఛో",
      "ఛౌ",
      "ఛం",
      "ఛః",
    ],
    జ: [
      "జ",
      "జా",
      "జి",
      "జీ",
      "జు",
      "జూ",
      "జృ",
      "జె",
      "జే",
      "జై",
      "జొ",
      "జో",
      "జౌ",
      "జం",
      "జః",
    ],
    ఝ: [
      "ఝ",
      "ఝా",
      "ఝి",
      "ఝీ",
      "ఝు",
      "ఝూ",
      "ఝృ",
      "ఝె",
      "ఝే",
      "ఝై",
      "ఝొ",
      "ఝో",
      "ఝౌ",
      "ఝం",
      "ఝః",
    ],
    ఞ: [
      "ఞ",
      "ఞా",
      "ఞి",
      "ఞీ",
      "ఞు",
      "ఞూ",
      "ఞృ",
      "ఞె",
      "ఞే",
      "ఞై",
      "ఞొ",
      "ఞో",
      "ఞౌ",
      "ఞం",
      "ఞః",
    ],
    ట: [
      "ట",
      "టా",
      "టి",
      "టీ",
      "టు",
      "టూ",
      "టృ",
      "టె",
      "టే",
      "టై",
      "టొ",
      "టో",
      "టౌ",
      "టం",
      "టః",
    ],
    ఠ: [
      "ఠ",
      "ఠా",
      "ఠి",
      "ఠీ",
      "ఠు",
      "ఠూ",
      "ఠృ",
      "ఠె",
      "ఠే",
      "ఠై",
      "ఠొ",
      "ఠో",
      "ఠౌ",
      "ఠం",
      "ఠః",
    ],
    డ: [
      "డ",
      "డా",
      "డి",
      "డీ",
      "డు",
      "డూ",
      "డృ",
      "డె",
      "డే",
      "డై",
      "డొ",
      "డో",
      "డౌ",
      "డం",
      "డః",
    ],
    ఢ: [
      "ఢ",
      "ఢా",
      "ఢి",
      "ఢీ",
      "ఢు",
      "ఢూ",
      "ఢృ",
      "ఢె",
      "ఢే",
      "ఢై",
      "ఢొ",
      "ఢో",
      "ఢౌ",
      "ఢం",
      "ఢః",
    ],
    ణ: [
      "ణ",
      "ణా",
      "ణి",
      "ణీ",
      "ణు",
      "ణూ",
      "ణృ",
      "ణె",
      "ణే",
      "ణై",
      "ణొ",
      "ణో",
      "ణౌ",
      "ణం",
      "ణః",
    ],
    త: [
      "త",
      "తా",
      "తి",
      "తీ",
      "తు",
      "తూ",
      "తృ",
      "తె",
      "తే",
      "తై",
      "తొ",
      "తో",
      "తౌ",
      "తం",
      "తః",
    ],
    థ: [
      "థ",
      "థా",
      "థి",
      "థీ",
      "థు",
      "థూ",
      "థృ",
      "థె",
      "థే",
      "థై",
      "థొ",
      "థో",
      "థౌ",
      "థం",
      "థః",
    ],
    ద: [
      "ద",
      "దా",
      "ది",
      "దీ",
      "దు",
      "దూ",
      "దృ",
      "దె",
      "దే",
      "దై",
      "దొ",
      "దో",
      "దౌ",
      "దం",
      "దః",
    ],
    ధ: [
      "ధ",
      "ధా",
      "ధి",
      "ధీ",
      "ధు",
      "ధూ",
      "ధృ",
      "ధె",
      "ధే",
      "ధై",
      "ధొ",
      "ధో",
      "ధౌ",
      "ధం",
      "ధః",
    ],
    న: [
      "న",
      "నా",
      "ని",
      "నీ",
      "ను",
      "నూ",
      "నృ",
      "నె",
      "నే",
      "నై",
      "నొ",
      "నో",
      "నౌ",
      "నం",
      "నః",
    ],
    ప: [
      "ప",
      "పా",
      "పి",
      "పీ",
      "పు",
      "పూ",
      "పృ",
      "పె",
      "పే",
      "పై",
      "పొ",
      "పో",
      "పౌ",
      "పం",
      "పః",
    ],
    ఫ: [
      "ఫ",
      "ఫా",
      "ఫి",
      "ఫీ",
      "ఫు",
      "ఫూ",
      "ఫృ",
      "ఫె",
      "ఫే",
      "ఫై",
      "ఫొ",
      "ఫో",
      "ఫౌ",
      "ఫం",
      "ఫః",
    ],
    బ: [
      "బ",
      "బా",
      "బి",
      "బీ",
      "బు",
      "బూ",
      "బృ",
      "బె",
      "బే",
      "బై",
      "బొ",
      "బో",
      "బౌ",
      "బం",
      "బః",
    ],
    భ: [
      "భ",
      "భా",
      "భి",
      "భీ",
      "భు",
      "భూ",
      "భృ",
      "భె",
      "భే",
      "భై",
      "భొ",
      "భో",
      "భౌ",
      "భం",
      "భః",
    ],
    మ: [
      "మ",
      "మా",
      "మి",
      "మీ",
      "ము",
      "మూ",
      "మృ",
      "మె",
      "మే",
      "మై",
      "మొ",
      "మో",
      "మౌ",
      "మం",
      "మః",
    ],
    య: [
      "య",
      "యా",
      "యి",
      "యీ",
      "యు",
      "యూ",
      "యృ",
      "యె",
      "యే",
      "యై",
      "యొ",
      "యో",
      "యౌ",
      "యం",
      "యః",
    ],
    ర: [
      "ర",
      "రా",
      "రి",
      "రీ",
      "రు",
      "రూ",
      "రృ",
      "రె",
      "రే",
      "రై",
      "రొ",
      "రో",
      "రౌ",
      "రం",
      "రః",
    ],
    ల: [
      "ల",
      "లా",
      "లి",
      "లీ",
      "లు",
      "లూ",
      "లృ",
      "లె",
      "లే",
      "లై",
      "లొ",
      "లో",
      "లౌ",
      "లం",
      "లః",
    ],
    వ: [
      "వ",
      "వా",
      "వి",
      "వీ",
      "వు",
      "వూ",
      "వృ",
      "వె",
      "వే",
      "వై",
      "వొ",
      "వో",
      "వౌ",
      "వం",
      "వః",
    ],
    శ: [
      "శ",
      "శా",
      "శి",
      "శీ",
      "శు",
      "శూ",
      "శృ",
      "శె",
      "శే",
      "శై",
      "శొ",
      "శో",
      "శౌ",
      "శం",
      "శః",
    ],
    ష: [
      "ష",
      "షా",
      "షి",
      "షీ",
      "షు",
      "షూ",
      "షృ",
      "షె",
      "షే",
      "షై",
      "షొ",
      "షో",
      "షౌ",
      "షం",
      "షః",
    ],
    స: [
      "స",
      "సా",
      "సి",
      "సీ",
      "సు",
      "సూ",
      "సృ",
      "సె",
      "సే",
      "సై",
      "సొ",
      "సో",
      "సౌ",
      "సం",
      "సః",
    ],
    హ: [
      "హ",
      "హా",
      "హి",
      "హీ",
      "హు",
      "హూ",
      "హృ",
      "హె",
      "హే",
      "హై",
      "హొ",
      "హో",
      "హౌ",
      "హం",
      "హః",
    ],
    ళ: [
      "ళ",
      "ళా",
      "ళి",
      "ళీ",
      "ళు",
      "ళూ",
      "ళృ",
      "ళె",
      "ళే",
      "ళై",
      "ళొ",
      "ళో",
      "ళౌ",
      "ళం",
      "ళః",
    ],
  },

  kn: {
    ಕ: [
      "ಕ",
      "ಕಾ",
      "ಕಿ",
      "ಕೀ",
      "ಕು",
      "ಕೂ",
      "ಕೃ",
      "ಕೆ",
      "ಕೇ",
      "ಕೈ",
      "ಕೊ",
      "ಕೋ",
      "ಕೌ",
      "ಕಂ",
      "ಕಃ",
    ],
    ಖ: [
      "ಖ",
      "ಖಾ",
      "ಖಿ",
      "ಖೀ",
      "ಖು",
      "ಖೂ",
      "ಖೃ",
      "ಖೆ",
      "ಖೇ",
      "ಖೈ",
      "ಖೊ",
      "ಖೋ",
      "ಖೌ",
      "ಖಂ",
      "ಖಃ",
    ],
    ಗ: [
      "ಗ",
      "ಗಾ",
      "ಗಿ",
      "ಗೀ",
      "ಗು",
      "ಗೂ",
      "ಗೃ",
      "ಗೆ",
      "ಗೇ",
      "ಗೈ",
      "ಗೊ",
      "ಗೋ",
      "ಗೌ",
      "ಗಂ",
      "ಗಃ",
    ],
    ಘ: [
      "ಘ",
      "ಘಾ",
      "ಘಿ",
      "ಘೀ",
      "ಘು",
      "ಘೂ",
      "ಘೃ",
      "ಘೆ",
      "ಘೇ",
      "ಘೈ",
      "ಘೊ",
      "ಘೋ",
      "ಘೌ",
      "ಘಂ",
      "ಘಃ",
    ],
    ಙ: [
      "ಙ",
      "ಙಾ",
      "ಙಿ",
      "ಙೀ",
      "ಙು",
      "ಙೂ",
      "ಙೃ",
      "ಙೆ",
      "ಙೇ",
      "ಙೈ",
      "ಙೊ",
      "ಙೋ",
      "ಙೌ",
      "ಙಂ",
      "ಙಃ",
    ],
    ಚ: [
      "ಚ",
      "ಚಾ",
      "ಚಿ",
      "ಚೀ",
      "ಚು",
      "ಚೂ",
      "ಚೃ",
      "ಚೆ",
      "ಚೇ",
      "ಚೈ",
      "ಚೊ",
      "ಚೋ",
      "ಚೌ",
      "ಚಂ",
      "ಚಃ",
    ],
    ಛ: [
      "ಛ",
      "ಛಾ",
      "ಛಿ",
      "ಛೀ",
      "ಛು",
      "ಛೂ",
      "ಛೃ",
      "ಛೆ",
      "ಛೇ",
      "ಛೈ",
      "ಛೊ",
      "ಛೋ",
      "ಛೌ",
      "ಛಂ",
      "ಛಃ",
    ],
    ಜ: [
      "ಜ",
      "ಜಾ",
      "ಜಿ",
      "ಜೀ",
      "ಜು",
      "ಜೂ",
      "ಜೃ",
      "ಜೆ",
      "ಜೇ",
      "ಜೈ",
      "ಜೊ",
      "ಜೋ",
      "ಜೌ",
      "ಜಂ",
      "ಜಃ",
    ],
    ಝ: [
      "ಝ",
      "ಝಾ",
      "ಝಿ",
      "ಝೀ",
      "ಝು",
      "ಝೂ",
      "ಝೃ",
      "ಝೆ",
      "ಝೇ",
      "ಝೈ",
      "ಝೊ",
      "ಝೋ",
      "ಝೌ",
      "ಝಂ",
      "ಝಃ",
    ],
    ಞ: [
      "ಞ",
      "ಞಾ",
      "ಞಿ",
      "ಞೀ",
      "ಞು",
      "ಞೂ",
      "ಞೃ",
      "ಞೆ",
      "ಞೇ",
      "ಞೈ",
      "ಞೊ",
      "ಞೋ",
      "ಞೌ",
      "ಞಂ",
      "ಞಃ",
    ],
    ಟ: [
      "ಟ",
      "ಟಾ",
      "ಟಿ",
      "ಟೀ",
      "ಟು",
      "ಟೂ",
      "ಟೃ",
      "ಟೆ",
      "ಟೇ",
      "ಟೈ",
      "ಟೊ",
      "ಟೋ",
      "ಟೌ",
      "ಟಂ",
      "ಟಃ",
    ],
    ಠ: [
      "ಠ",
      "ಠಾ",
      "ಠಿ",
      "ಠೀ",
      "ಠು",
      "ಠೂ",
      "ಠೃ",
      "ಠೆ",
      "ಠೇ",
      "ಠೈ",
      "ಠೊ",
      "ಠೋ",
      "ಠೌ",
      "ಠಂ",
      "ಠಃ",
    ],
    ಡ: [
      "ಡ",
      "ಡಾ",
      "ಡಿ",
      "ಡೀ",
      "ಡು",
      "ಡೂ",
      "ಡೃ",
      "ಡೆ",
      "ಡೇ",
      "ಡೈ",
      "ಡೊ",
      "ಡೋ",
      "ಡೌ",
      "ಡಂ",
      "ಡಃ",
    ],
    ಢ: [
      "ಢ",
      "ಢಾ",
      "ಢಿ",
      "ಢೀ",
      "ಢು",
      "ಢೂ",
      "ಢೃ",
      "ಢೆ",
      "ಢೇ",
      "ಢೈ",
      "ಢೊ",
      "ಢೋ",
      "ಢೌ",
      "ಢಂ",
      "ಢಃ",
    ],
    ಣ: [
      "ಣ",
      "ಣಾ",
      "ಣಿ",
      "ಣೀ",
      "ಣು",
      "ಣೂ",
      "ಣೃ",
      "ಣೆ",
      "ಣೇ",
      "ಣೈ",
      "ಣೊ",
      "ಣೋ",
      "ಣೌ",
      "ಣಂ",
      "ಣಃ",
    ],
    ತ: [
      "ತ",
      "ತಾ",
      "ತಿ",
      "ತೀ",
      "ತು",
      "ತೂ",
      "ತೃ",
      "ತೆ",
      "ತೇ",
      "ತೈ",
      "ತೊ",
      "ತೋ",
      "ತೌ",
      "ತಂ",
      "ತಃ",
    ],
    ಥ: [
      "ಥ",
      "ಥಾ",
      "ಥಿ",
      "ಥೀ",
      "ಥು",
      "ಥೂ",
      "ಥೃ",
      "ಥೆ",
      "ಥೇ",
      "ಥೈ",
      "ಥೊ",
      "ಥೋ",
      "ಥೌ",
      "ಥಂ",
      "ಥಃ",
    ],
    ದ: [
      "ದ",
      "ದಾ",
      "ದಿ",
      "ದೀ",
      "ದು",
      "ದೂ",
      "ದೃ",
      "ದೆ",
      "ದೇ",
      "ದೈ",
      "ದೊ",
      "ದೋ",
      "ದೌ",
      "ದಂ",
      "ದಃ",
    ],
    ಧ: [
      "ಧ",
      "ಧಾ",
      "ಧಿ",
      "ಧೀ",
      "ಧು",
      "ಧೂ",
      "ಧೃ",
      "ಧೆ",
      "ಧೇ",
      "ಧೈ",
      "ಧೊ",
      "ಧೋ",
      "ಧೌ",
      "ಧಂ",
      "ಧಃ",
    ],
    ನ: [
      "ನ",
      "ನಾ",
      "ನಿ",
      "ನೀ",
      "ನು",
      "ನೂ",
      "ನೃ",
      "ನೆ",
      "ನೇ",
      "ನೈ",
      "ನೊ",
      "ನೋ",
      "ನೌ",
      "ನಂ",
      "ನಃ",
    ],
    ಪ: [
      "ಪ",
      "ಪಾ",
      "ಪಿ",
      "ಪೀ",
      "ಪು",
      "ಪೂ",
      "ಪೃ",
      "ಪೆ",
      "ಪೇ",
      "ಪೈ",
      "ಪೊ",
      "ಪೋ",
      "ಪೌ",
      "ಪಂ",
      "ಪಃ",
    ],
    ಫ: [
      "ಫ",
      "ಫಾ",
      "ಫಿ",
      "ಫೀ",
      "ಫು",
      "ಫೂ",
      "ಫೃ",
      "ಫೆ",
      "ಫೇ",
      "ಫೈ",
      "ಫೊ",
      "ಫೋ",
      "ಫೌ",
      "ಫಂ",
      "ಫಃ",
    ],
    ಬ: [
      "ಬ",
      "ಬಾ",
      "ಬಿ",
      "ಬೀ",
      "ಬು",
      "ಬೂ",
      "ಬೃ",
      "ಬೆ",
      "ಬೇ",
      "ಬೈ",
      "ಬೊ",
      "ಬೋ",
      "ಬೌ",
      "ಬಂ",
      "ಬಃ",
    ],
    ಭ: [
      "ಭ",
      "ಭಾ",
      "ಭಿ",
      "ಭೀ",
      "ಭು",
      "ಭೂ",
      "ಭೃ",
      "ಭೆ",
      "ಭೇ",
      "ಭೈ",
      "ಭೊ",
      "ಭೋ",
      "ಭೌ",
      "ಭಂ",
      "ಭಃ",
    ],
    ಮ: [
      "ಮ",
      "ಮಾ",
      "ಮಿ",
      "ಮೀ",
      "ಮು",
      "ಮೂ",
      "ಮೃ",
      "ಮೆ",
      "ಮೇ",
      "ಮೈ",
      "ಮೊ",
      "ಮೋ",
      "ಮೌ",
      "ಮಂ",
      "ಮಃ",
    ],
    ಯ: [
      "ಯ",
      "ಯಾ",
      "ಯಿ",
      "ಯೀ",
      "ಯು",
      "ಯೂ",
      "ಯೃ",
      "ಯೆ",
      "ಯೇ",
      "ಯೈ",
      "ಯೊ",
      "ಯೋ",
      "ಯೌ",
      "ಯಂ",
      "ಯಃ",
    ],
    ರ: [
      "ರ",
      "ರಾ",
      "ರಿ",
      "ರೀ",
      "ರು",
      "ರೂ",
      "ರೃ",
      "ರೆ",
      "ರೇ",
      "ರೈ",
      "ರೊ",
      "ರೋ",
      "ರೌ",
      "ರಂ",
      "ರಃ",
    ],
    ಲ: [
      "ಲ",
      "ಲಾ",
      "ಲಿ",
      "ಲೀ",
      "ಲು",
      "ಲೂ",
      "ಲೃ",
      "ಲೆ",
      "ಲೇ",
      "ಲೈ",
      "ಲೊ",
      "ಲೋ",
      "ಲೌ",
      "ಲಂ",
      "ಲಃ",
    ],
    ವ: [
      "ವ",
      "ವಾ",
      "ವಿ",
      "ವೀ",
      "ವು",
      "ವೂ",
      "ವೃ",
      "ವೆ",
      "ವೇ",
      "ವೈ",
      "ವೊ",
      "ವೋ",
      "ವೌ",
      "ವಂ",
      "ವಃ",
    ],
    ಶ: [
      "ಶ",
      "ಶಾ",
      "ಶಿ",
      "ಶೀ",
      "ಶು",
      "ಶೂ",
      "ಶೃ",
      "ಶೆ",
      "ಶೇ",
      "ಶೈ",
      "ಶೊ",
      "ಶೋ",
      "ಶೌ",
      "ಶಂ",
      "ಶಃ",
    ],
    ಷ: [
      "ಷ",
      "ಷಾ",
      "ಷಿ",
      "ಷೀ",
      "ಷು",
      "ಷೂ",
      "ಷೃ",
      "ಷೆ",
      "ಷೇ",
      "ಷೈ",
      "ಷೊ",
      "ಷೋ",
      "ಷೌ",
      "ಷಂ",
      "ಷಃ",
    ],
    ಸ: [
      "ಸ",
      "ಸಾ",
      "ಸಿ",
      "ಸೀ",
      "ಸು",
      "ಸೂ",
      "ಸೃ",
      "ಸೆ",
      "ಸೇ",
      "ಸೈ",
      "ಸೊ",
      "ಸೋ",
      "ಸೌ",
      "ಸಂ",
      "ಸಃ",
    ],
    ಹ: [
      "ಹ",
      "ಹಾ",
      "ಹಿ",
      "ಹೀ",
      "ಹು",
      "ಹೂ",
      "ಹೃ",
      "ಹೆ",
      "ಹೇ",
      "ಹೈ",
      "ಹೊ",
      "ಹೋ",
      "ಹೌ",
      "ಹಂ",
      "ಹಃ",
    ],
    ಳ: [
      "ಳ",
      "ಳಾ",
      "ಳಿ",
      "ಳೀ",
      "ಳು",
      "ಳೂ",
      "ಳೃ",
      "ಳೆ",
      "ಳೇ",
      "ಳೈ",
      "ಳೊ",
      "ಳೋ",
      "ಳೌ",
      "ಳಂ",
      "ಳಃ",
    ],
  },
};

export const wordData = {
  hi: [
    {
      text: "कार",
      audio: "ed1a6a41-893f-49e6-9e9f-dba1e89f7480.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कारAudio),
    },
    {
      text: "रात",
      audio: "5a49dd77-a776-4862-a38b-dcff186befe3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रातAudio),
    },
    {
      text: "पिता",
      audio: "004dfced-6aa6-47cb-8369-03e8fe9e5762.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पिताAudio),
    },
    {
      text: "किला",
      audio: "d8e9b508-93a9-4f27-bece-15935d16fe03.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.किलाAudio),
    },
    {
      text: "तीर",
      audio: "184e3253-8e03-425c-991a-3071943aa704.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तीरAudio),
    },
    {
      text: "गीत",
      audio: "fd38e29a-123a-4c49-9cce-8b51fd1fcd45.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गीतAudio),
    },
    {
      text: "सुख",
      audio: "22aa573a-3123-4dba-ba0f-dd285509a8e3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सुखAudio),
    },
    {
      text: "रुक",
      audio: "56ba2119-6d54-403b-b4e9-8ea8d2339917.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुकAudio),
    },
    {
      text: "मुख",
      audio: "57b73b9b-ab7e-4cc9-be80-24430a7d0124.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मुखAudio),
    },
    {
      text: "फूल",
      audio: "7b1613c9-34c3-4ed8-b365-31fb58ae8ef5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.फूलAudio),
    },
    {
      text: "रूह",
      audio: "1cdaf044-2ef5-4f52-b6e9-0fa0b9393492.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रूहAudio),
    },
    {
      text: "गृह",
      audio: "0d485e95-9904-4236-8624-d8e948380cba.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गृहAudio),
    },
    {
      text: "कृपा",
      audio: "88dd1023-c26d-41e8-9fae-65138b6752e8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कृपाAudio),
    },
    {
      text: "तेल",
      audio: "cb29f1ee-ccfe-4d41-836a-ad69272fda1d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तेलAudio),
    },
    {
      text: "केला",
      audio: "60458bcf-df7e-4f4d-af23-40c1f5563581.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.केलाAudio),
    },
    {
      text: "बैठ",
      audio: "197a75bc-811d-4e6e-8108-f3a2cd3fedbd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बैठAudio),
    },
    {
      text: "कैसे",
      audio: "c7138dbb-94aa-49a8-b8fb-d4ca41079b58.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कैसेAudio),
    },
    {
      text: "शोर",
      audio: "086593d8-15d2-4c14-a743-38ac7a382bbe.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.शोरAudio),
    },
    {
      text: "मोर",
      audio: "1f568831-522b-4b82-b4aa-deb7b97f9768.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मोरAudio),
    },
    {
      text: "कौन",
      audio: "8d5b767d-acc0-4916-a75b-19eee1269f27.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कौनAudio),
    },
    {
      text: "मौज",
      audio: "7c1f7f39-b75e-431d-b468-0310c655f2ca.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मौजAudio),
    },
    {
      text: "हंस",
      audio: "4c80a8a6-b55a-45a7-b7f6-6bbf18e05561.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.हंसAudio),
    },
    {
      text: "नमः",
      audio: "dfdc7273-12ae-45e1-81cf-dd3bfe096ff3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.नमःAudio),
    },
    {
      text: "पानी",
      audio: "f676c2e5-b49c-451a-b6fa-42bb5d137030.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पानीAudio),
    },
    {
      text: "रुचि",
      audio: "07bd5d45-e2fc-442d-b1cc-ff1cd510a710.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुचिAudio),
    },
    {
      text: "सामने",
      audio: "7bc800b1-5caa-4df5-9a63-20dc77ba3107.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सामनेAudio),
    },
    {
      text: "शुरू",
      audio: "0e11f925-1006-4a7e-ae36-7d103b528b41.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.शुरूAudio),
    },
    {
      text: "होगा",
      audio: "65535afd-3e4f-40cf-98ff-22bd72e6405a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.होगाAudio),
    },
    {
      text: "दिशा",
      audio: "8de794ff-dcb0-483c-991e-f2d09dce8893.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.दिशाAudio),
    },
    {
      text: "कितने",
      audio: "0ca4f842-0f54-4cf5-a649-ec4b3cf05d7f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कितनेAudio),
    },
    {
      text: "चिड़िया",
      audio: "06969b26-1588-4064-aa61-fb8c3a7d665f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.चिड़ियाAudio),
    },
    {
      text: "सुना",
      audio: "5ca9dc01-e318-4201-8a97-bce48ec89d22.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सुनाAudio),
    },
    {
      text: "रुपया",
      audio: "e2b6df09-04e1-4fbc-b363-796e783169b9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुपयाAudio),
    },
    {
      text: "कविता",
      audio: "21ba9b0b-a4e9-493a-8fa8-72573476724c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कविताAudio),
    },
    {
      text: "मिला",
      audio: "a3c77ef0-6998-4568-ac96-8663d37d8e06.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मिलाAudio),
    },
    {
      text: "सोमारू",
      audio: "f8ae8f6e-7146-4255-92fc-f855715496c9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सोमारूAudio),
    },
    {
      text: "पहेली",
      audio: "760ed308-04f2-4be6-9e04-767fe5b6503d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पहेलीAudio),
    },
    {
      text: "कहानी",
      audio: "3e8c5933-8d58-46b2-81b6-f146d9dc03b2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कहानीAudio),
    },
    {
      text: "तोसिया",
      audio: "65f320e0-a177-4278-a4c9-8342c69f64d8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तोसियाAudio),
    },
    {
      text: "बारिश",
      audio: "02907e35-3140-4549-bcd5-0440c5e3f091.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बारिशAudio),
    },
    {
      text: "कटोरी",
      audio: "87751809-a287-48f7-ab21-d9927a27b10e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कटोरीAudio),
    },
    {
      text: "थाली",
      audio: "5e379647-9f49-4c9f-99ce-bb07d13aa5ec.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.थालीAudio),
    },
    {
      text: "मुझे",
      audio: "e0f54b9e-257c-4412-8f18-3da880f84016.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मुझेAudio),
    },
    {
      text: "तैरना",
      audio: "c4a15974-7f17-4cee-99f4-e7d1e8e30aad.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तैरनाAudio),
    },
    {
      text: "पिताजी",
      audio: "b9fcd2fe-063d-479e-9bee-87bc27f8ee8d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पिताजीAudio),
    },
  ],

  ta: [
    {
      text: "மலை",
      audio: "bf0f13d5-f206-4fe2-b0fc-39462362b948.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மலைAudio),
    },
    {
      text: "நதி",
      audio: "47c2b4ee-88bf-4b4f-92e6-07716978b021.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நதிAudio),
    },
    {
      text: "புழு",
      audio: "49500432-222b-475c-81c9-d331adfbca3a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.புழுAudio),
    },
    {
      text: "வலி",
      audio: "5c7cdc08-b216-4317-80e2-a2995aeb1239.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வலிAudio),
    },
    {
      text: "தலை",
      audio: "e782655f-6da9-4dc8-9f36-ce404c4c53c2.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.தலைAudio),
    },
    {
      text: "நாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நாடுAudio),
    },
    {
      text: "மாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மாடுAudio),
    },
    {
      text: "மழை",
      audio: "0d6e3293-7cd1-40ac-a971-46062a2c5bda.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மழைAudio),
    },
    {
      text: "கடை",
      audio: "81bf37f3-4517-4af1-94d6-d8f801e20534.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.கடைAudio),
    },
    {
      text: "வீடு",
      audio: "7837a882-d5c5-40b6-b4d2-3d72d42427c7.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வீடுAudio),
    },
  ],

  te: [
    {
      text: "గది",
      audio: "99be1000-4455-456b-aec4-7bb64eb03357.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గదిAudio),
      image: "a412d0ae-c80b-42b2-aa37-d0d01cd35478.png",
    },
    {
      text: "చేను",
      audio: "5cb22860-042d-4faa-972d-d9f5c51f9616.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చేనుAudio),
      image: "6d77c3e7-096d-404d-87ad-a374bcbc5274.png",
    },
    {
      text: "చీర",
      audio: "b3fd1e21-d332-4c24-b57b-875343e509cc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చీరAudio),
      image: "fc0b7594-ea85-4c4b-bd23-724b1fff54ec.png",
    },
    {
      text: "గెల",
      audio: "12fc97c2-ed14-4ed5-b3e0-5830e083977b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గెలAudio),
      image: "de4b43c5-67a0-4689-b39c-7c8b3f45d0f3.png",
    },
    {
      text: "సౌధం",
      audio: "b8238760-b23f-48a7-836b-5d9a383b42d2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సౌధంAudio),
      image: "d35e6253-d1a9-431c-acd0-b28acbb708f8.png",
    },
    {
      text: "గృహం",
      audio: "152bb7b3-89e5-4d38-a57e-a389ebf62571.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గృహంAudio),
      image: "91234a7f-da48-41a0-a792-0393882716bf.png",
    },
    {
      text: "జాతర",
      audio: "09412f04-c180-4411-bab4-c1ba07eef7c4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జాతరAudio),
      image: "11d8d43d-2906-42cf-aac2-e2e9cd0f77d7.png",
    },
    {
      text: "గీరు",
      audio: "76a165f2-960e-4445-9c60-89ac34197a2b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గీరుAudio),
      image: "1734e535-62d4-4c73-8fb5-9a3b6d7c6247.png",
    },
    {
      text: "జైలు",
      audio: "84ac6622-8ec6-4634-94f7-2a6fd1cc2dcf.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జైలుAudio),
      image: "833f3cf5-0a7a-44c2-86a0-5c5ad68ba01d.png",
    },
    {
      text: "కోకిల",
      audio: "adfb12ce-cc02-447d-bea6-c75455fa4eb3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కోకిలAudio),
      image: "3e136472-4fc9-4acc-9582-5f7118c9f983.png",
    },
    {
      text: "నౌక",
      audio: "99db1186-5a62-4ae2-9987-1b10e5288107.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నౌకAudio),
      image: "e624459d-ec03-4d3c-9138-6826c1561b5b.png",
    },
    {
      text: "నీకు",
      audio: "d767350b-192c-46ab-8794-c23936999100.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నీకుAudio),
      image: "b94ad383-8a3b-4b0d-972c-4028a5fa0d9a.png",
    },
    {
      text: "పోరు",
      audio: "78868085-2c81-4c3b-ad59-79efa6d8d4b0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పోరుAudio),
      image: "ee3484f6-b1cd-4deb-884d-51c3bbb89f2c.png",
    },
    {
      text: "మెడ",
      audio: "87961184-a658-4be4-912f-6b6209535e00.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మెడAudio),
      image: "4bbc1ce5-b04a-4ffc-8cd4-81e4688e4fe3.png",
    },
    {
      text: "టోపీ",
      audio: "cfa1ccfd-7d25-409d-a5f9-95479d761229.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.టోపీAudio),
      image: "e2369a79-5712-4360-9a29-15a4bdd78ab4.png",
    },
    {
      text: "డైరీ",
      audio: "bba5dbcf-9587-4a06-9fe2-999aed9e32c5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.డైరీAudio),
      image: "f42a9d60-2521-482d-80b5-c1c53d0ee7e0.png",
    },
    {
      text: "రోకలి",
      audio: "0ce83c53-9c18-407f-804f-223dfa032061.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రోకలిAudio),
      image: "cc334694-4d70-41a2-8e25-f727d0d62a67.png",
    },
    {
      text: "సూది",
      audio: "73e2d863-5038-41ff-95bf-98529ac03fa8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సూదిAudio),
      image: "4d2a8a6a-f875-4a90-aee4-43f78a8ea152.png",
    },
    {
      text: "జౌళి",
      audio: "a058121e-cf67-487c-8c87-9ce17e85ab78.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జౌళిAudio),
      image: "51cfde8d-121c-422f-a114-5d1e16103a0f.png",
    },
    {
      text: "సీసా",
      audio: "e4f2e7f1-0089-4364-9073-277f18bcb06f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సీసాAudio),
      image: "f19063f9-be03-499e-bbe6-515242967a59.png",
    },
    {
      text: "బంతి",
      audio: "0fc8d70e-4c08-4404-985e-607d2ddd4d5c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బంతిAudio),
      image: "7df79593-184f-4cd0-9afe-cea8cf089b8b.png",
    },
    {
      text: "టౌను",
      audio: "e1f8bfe3-bbad-4f8b-ae88-55fe53364e2e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.టౌనుAudio),
      image: "3cd85cd7-2b7a-454b-8f35-779f22fd394a.png",
    },
    {
      text: "బాలిక",
      audio: "5a661a20-5587-4a05-8b04-7bb80c78af7f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బాలికAudio),
      image: "5a305c06-d14e-4d24-adae-f7186211f62b.png",
    },
    {
      text: "నెమలి",
      audio: "ba2d7442-074d-454e-9c24-2780eb6f2e59.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నెమలిsplitAudio),
      image: "dca125fa-2293-4f78-ac7d-f89879d99bc8.png",
    },
    {
      text: "పశువు",
      audio: "b19ed5da-a06f-4d28-8736-b56ccf2b81ea.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పశువుAudio),
      image: "890c0bd7-4b36-4302-9926-22de387e7c91.png",
    },
    {
      text: "బూడిద",
      audio: "222cf053-ce7d-43e6-9e5d-0e573a110b31.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బూడిదAudio),
      image: "cca211fe-c2c7-40a8-8786-4cbee2db69df.png",
    },
    {
      text: "నుదురు",
      audio: "3e27d58d-72c3-4cc3-8886-e0444293f576.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నుదురుAudio),
      image: "e88113f6-dfce-412c-9a74-0fbbd9197381.png",
    },
    {
      text: "మైదానం",
      audio: "62d51ed5-c606-435e-a23d-cee6cbd5446d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మైదానంAudio),
      image: "15d25aa8-be33-45f8-99a4-4a82dfd87583.png",
    },
    {
      text: "నొసలు",
      audio: "b94dff85-d1c9-474c-a067-b458c7560347.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నొసలుAudio),
      image: "c556a6b5-487a-4917-b2d8-abf8293175b1.png",
    },
    {
      text: "పొదుపు",
      audio: "f714b74a-f9ba-4bf3-a09a-0a984a7696c6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పొదుపుAudio),
      image: "e54e4cef-714c-41dc-8f73-80561416ff94.png",
    },
    {
      text: "జెండా",
      audio: "f5129861-6aa7-4849-988d-dfa1831e3a75.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జెండాAudio),
      image: "a16f477e-182b-4688-8a14-aea49be252c5.png",
    },
    {
      text: "పెరుగు",
      audio: "ae7f1913-1652-4979-8323-7a1c9fa83c56.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పెరుగుAudio),
      image: "e9435fac-5d6b-4769-b3af-afd1de59a36e.png",
    },
    {
      text: "భూకంపం",
      audio: "0bf66c03-37ba-49c8-86bf-7dad77bf4395.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.భూకంపంAudio),
      image: "6d3f703e-e1ed-44f3-83ee-51ec68b72d05.png",
    },
    {
      text: "పావురం",
      audio: "e346c5ad-7bb6-4b64-81bd-359ac7ef566f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పావురంAudio),
      image: "710a4d93-ddcd-4487-a829-c2eb9017ca38.png",
    },
    {
      text: "జూకాలు",
      audio: "c6f92ef1-874e-48c6-9417-b58b3c7ac707.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జూకాలుAudio),
      image: "4f2c3ffd-8d5d-4a91-a8fb-16345b040ee2.png",
    },
    {
      text: "పసిడి",
      audio: "f1838fba-64c7-4768-a9e7-7750a250a4c6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పసిడిAudio),
      image: "a0c79728-e6ea-42ad-9a7b-6c37eaba02f1.png",
    },
    {
      text: "గాజులు",
      audio: "2d938405-8a58-4650-b174-d15988d930e5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గాజులుAudio),
      image: "5515f309-6a1c-407c-b598-64745ca1df32.png",
    },
    {
      text: "నృపతి",
      audio: "35db88d9-bd7f-4d6c-b966-fd32f9a2e791.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నృపతిAudio),
      image: "4024439e-aaf3-4334-8f4c-18a73f06e535.png",
    },
    {
      text: "పైసలు",
      audio: "1f15e531-f83f-440b-b037-b7ec15ab2ba3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పైసలుAudio),
      image: "62f77432-0424-4996-8c96-32c9c235027e.png",
    },
    {
      text: "మొదలు",
      audio: "06b635ed-ee50-4979-bf3d-6120053e423c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మొదలుAudio),
      image: "673c3eb9-d7d2-41bd-a493-dc76d745d7e7.png",
    },
    {
      text: "మాటలు",
      audio: "7ff704dc-f1f0-48d0-8ab3-6fa3de08c68e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మాటలుAudio),
      image: "d9e87544-c93f-4c00-a6f9-cfe951fa7528.png",
    },
    {
      text: "వివాహం",
      audio: "80f926b8-3fa2-4d18-838a-9ef3d6b04b45.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.వివాహంAudio),
      image: "8ddc1a76-9d67-4d1e-a13f-f1d4b8cd0842.png",
    },
    {
      text: "మూకుడు",
      audio: "ea8f4894-3848-44a9-98d0-b133b76942ce.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మూకుడుAudio),
      image: "051f14a1-9841-4f86-909d-e0b4406868b1.png",
    },
    {
      text: "హృదయం",
      audio: "20d376c1-453f-4b9b-b573-08016932afde.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.హృదయంAudio),
      image: "6b1569b0-f4dc-44c4-ac06-618ff0737979.png",
    },
    {
      text: "బేడీలు",
      audio: "be6164c1-4529-4862-8586-a714b2b88652.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బేడీలుAudio),
      image: "d21c747d-17cf-45ff-84c2-1107dd1a1f6b.png",
    },
    {
      text: "శైశవం",
      audio: "aec28d63-9afe-4b42-bd37-5ceef3255def.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.శైశవంAudio),
      image: "aba49865-3b6b-4a4f-a55b-a0ad217c2486.png",
    },
    {
      text: "గొడుగు",
      audio: "dc4638d0-11b6-4270-b9a2-0056fea38ad5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గొడుగుAudio),
      image: "6af4fdbf-f682-4ea4-8892-3c604254b8a4.png",
    },
    {
      text: "పొడవైన",
      audio: "4a9a9fe9-643a-4a95-bd60-ffa1d5cd2981.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పొడవైనAudio),
      image: "cb45acc9-82b5-4229-bac6-7d3f5b38ba09.png",
    },
    {
      text: "సొరకాయ",
      audio: "336d1c4f-0858-4afb-811b-121576a5cc97.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సొరకాయAudio),
      image: "06288e6d-5de0-48c0-93f7-62396c781901.png",
    },
    {
      text: "జలపాతం",
      audio: "4ea80f33-49fc-44bb-b16a-65db31c46495.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జలపాతంAudio),
      image: "d3d85f0b-0b28-4794-b6a3-a93b19ec933b.png",
    },
    {
      text: "గిజిగాడు",
      audio: "b9bf7602-1ac2-4101-b45e-4ee2c7d0f99e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గిజిగాడుAudio),
      image: "07b0c519-e7cb-4672-8cda-1fd21543b813.png",
    },
    {
      text: "ఊరేగింపు",
      audio: "2c66e48d-3b6a-4df5-842a-b95a041a3741.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ఊరేగింపుAudio),
      image: "7d1e1579-63c6-4181-8d8b-d3f357dda882.png",
    },
    {
      text: "చూడలేదు",
      audio: "41640d7e-a923-4cc2-a174-072f27000c31.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చూడలేదుAudio),
      image: "0456a5d0-e645-4bb7-839a-0c0e01d05ec5.png",
    },
    {
      text: "గులాబీలు",
      audio: "74b1483a-2701-4608-9f5c-572fa8e3bbe2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గులాబీలుAudio),
      image: "1d9a6c6b-7879-41e8-8d1a-40631dda2891.png",
    },
    {
      text: "మీగడ",
      audio: "c669e1a0-18c7-4531-ad23-8dca74ad2803.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మీగడAudio),
      image: "0b46d98e-dbdd-485d-8472-51e93fd73d47.png",
    },
    {
      text: "చీపురు",
      audio: "8277b035-401b-488d-a113-8f9cf226c118.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చీపురుAudio),
      image: "80bed291-3043-46ae-8b4a-da909d464147.png",
    },
    {
      text: "రెండు",
      audio: "5679c906-2d8c-4ff7-9c6a-2861f6cbe1a7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రెండుAudio),
      image: "5a576136-cc9c-4c95-80b1-f2de07a6194d.png",
    },
    {
      text: "మేఘం",
      audio: "ab6251b6-aff3-475f-af7f-841e8068b978.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మేఘంAudio),
      image: "d59582fd-2d76-4498-81f6-73e0c963ffda.png",
    },
    {
      text: "నేల",
      audio: "07510b3c-1efd-4cc9-9a0d-7cf68640fd5e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నేలAudio),
      image: "3dc59fdc-08e0-4d82-bbb4-404759377fc7.png",
    },
    {
      text: "తోలు",
      audio: "a661db28-f049-4268-99a2-6cbf10ba23c0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.తోలుAudio),
      image: "53a752bd-4f2b-431a-abad-b16c3adf4878.png",
    },
  ],

  kn: [
    {
      text: "ಕಾಲ",
      audio: "f31a89b1-f62d-4cc3-b76b-e4ad095684f6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕಾಲAudio),
    },
    {
      text: "ಗರಿ",
      audio: "9c7e3401-75c2-4483-9331-b33b39eb2dfd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗರಿAudio),
    },
    {
      text: "ಚೀಲ",
      audio: "ab0a83be-db8c-4dd8-8b98-3866076cfc72.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಚೀಲAudio),
    },
    {
      text: "ಗುಡಿ",
      audio: "9e7cc061-cb02-4327-9e5e-a034cbb91bd2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗುಡಿAudio),
    },
    {
      text: "ಮೂರು",
      audio: "d0945859-5602-4a9f-ab5b-df7791ac6ae4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೂರುAudio),
    },
    {
      text: "ಗೃಹ",
      audio: "d6e9ac19-2cfa-48b4-84d9-9bdd95a85307.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೃಹAudio),
    },
    {
      text: "ಬೆಳೆ",
      audio: "a5995386-87d3-4a2e-abc4-577db248f99a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೆಳೆAudio),
    },
    {
      text: "ಸೇರು",
      audio: "4209cedb-fcf0-4bec-a823-bdb3b26c0508.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೇರುAudio),
    },
    {
      text: "ಪೈರು",
      audio: "5c7e9327-e34b-4c66-8210-a470b113feeb.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪೈರುAudio),
    },
    {
      text: "ಯಾವುದು",
      audio: "6b2422e4-949e-4526-9bdc-1a5403c4434e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯಾವುದುAudio),
    },
    {
      text: "ಗಾಳಿ",
      audio: "3c94be48-8b7a-4f33-9062-d3ddca86aa95.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗಾಳಿAudio),
    },
    {
      text: "ಮೂಲೆ",
      audio: "15808038-7f45-4f0c-a219-8dfc34812d49.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೂಲೆAudio),
    },
    {
      text: "ಕೋತಿ",
      audio: "ed82c06a-9412-42f8-84ac-5282e348a191.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೋತಿAudio),
    },
    {
      text: "ನಾಯಿ",
      audio: "d91c4d7d-b1b7-4f9f-9f6c-61cf0d5adf5a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನಾಯಿAudio),
    },
    {
      text: "ಕೌದಿ",
      audio: "cd3dff10-4fa5-4fe3-8495-7585ac663bb4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೌದಿAudio),
    },
    {
      text: "ಕೇಳು",
      audio: "42be3ba2-f225-47fa-b7c7-e206b2d51c1e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೇಳುAudio),
    },
    {
      text: "ಯಾರು",
      audio: "2ffb7662-1dcf-427c-845c-084e19378396.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯಾರುAudio),
    },
    {
      text: "ಮಾಲಿ",
      audio: "eeb300b1-79b2-454f-b96d-79f8e584e17d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮಾಲಿAudio),
    },
    {
      text: "ಹುಳಿ",
      audio: "8d3e415d-20d2-453f-b0af-dbd3461721d9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹುಳಿAudio),
    },
    {
      text: "ನೋಡು",
      audio: "79f5c439-dde3-4d7f-a76b-0fe818f795f1.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೋಡುAudio),
    },
    {
      text: "ಕುದುರೆ",
      audio: "2668deb3-715f-4b53-9fe2-6bd49554cacc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕುದುರೆAudio),
    },
    {
      text: "ಮಾದರಿ",
      audio: "73357888-777b-4924-9176-cc7b6617e582.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮಾದರಿAudio),
    },
    {
      text: "ಕಿಶೋರ",
      audio: "3c46290b-c944-41ec-a3c9-de56975b665b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕಿಶೋರAudio),
    },
    {
      text: "ಲೇಖನಿ",
      audio: "ef5ddfe7-9e63-4017-8861-ad8837529652.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಲೇಖನಿAudio),
    },
    {
      text: "ಕೊಠಡಿ",
      audio: "7c0fb7ba-8565-47cb-be7a-ce227f26094b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೊಠಡಿAudio),
    },
  ],
};

export const TeluguGunithas = [
  {
    audio: "ka.wav",
    image: "ka1.png",
  },
  {
    audio: "Kaa.wav",
    image: "kaa2.png",
  },
  {
    audio: "Ke.wav",
    image: "ki1.png",
  },
  {
    audio: "Kee.wav",
    image: "kii2.png",
  },
  {
    audio: "Ku.wav",
    image: "ku1.png",
  },
  {
    audio: "Koo.wav",
    image: "ku2.png",
  },
  {
    audio: "Kru.wav",
    image: "kru.png",
  },
  {
    audio: "Kroo.wav",
    image: "kru2.png",
  },
  {
    audio: "ke1.wav",
    image: "ke1.png",
  },
  {
    audio: "Kee1.wav",
    image: "ke2.png",
  },
  {
    audio: "Kai.wav",
    image: "kai.png",
  },
  {
    audio: "Ko.wav",
    image: "ko1.png",
  },
  {
    audio: "Koo1.wav",
    image: "ko2.png",
  },
  {
    audio: "Kau.wav",
    image: "kau.png",
  },
  {
    audio: "Kam.wav",
    image: "kam.png",
  },
  {
    audio: "Kaha.wav",
    image: "kaha.png",
  },
  {
    audio: "Ju.wav",
    image: "ju.png",
  },
  {
    audio: "Joo.wav",
    image: "joo2.png",
  },
  {
    audio: "Yaa.wav",
    image: "yaa-second.png",
  },
  {
    audio: "yi.wav",
    image: "yi1.png",
  },
  {
    audio: "yee.wav",
    image: "yi-second.png",
  },
  {
    audio: "Paa.wav",
    image: "paa-second.png",
  },
  {
    audio: "saa.wav",
    image: "saa-second.png",
  },
  {
    audio: "pu.wav",
    image: "Pu1.png",
  },
  {
    audio: "poo.wav",
    image: "pu2.png",
  },
  {
    audio: "vu.wav",
    image: "vu1.png",
  },
  {
    audio: "voo.wav",
    image: "vu2.png",
  },
  {
    audio: "po.wav",
    image: "po1.png",
  },
  {
    audio: "poo1.wav",
    image: "po2nd.png",
  },
  {
    audio: "mo.wav",
    image: "mo1.png",
  },
  {
    audio: "moo.wav",
    image: "mo2nd.png",
  },
  {
    audio: "sau.wav",
    image: "Sau.png",
  },
];

function getScriptFromLang(lang) {
  const scriptMap = {
    hi: "devanagari",
    kn: "kannada",
    te: "telugu",
    ta: "tamil",
  };
  return scriptMap[lang] || "devanagari";
}

function getConsonantsFromWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return [];

  const consonants = Object.keys(chart);
  return Array.from(word).filter((char) => consonants.includes(char));
}

function getBarakhadiForWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return {};

  const wordConsonants = getConsonantsFromWord(word, lang);
  const allConsonants = Object.keys(chart);

  let selectedConsonants = [...wordConsonants];
  const needed = 4 - selectedConsonants.length;

  if (needed > 0) {
    const availableConsonants = allConsonants.filter(
      (c) => !selectedConsonants.includes(c)
    );
    const randomConsonants = availableConsonants
      .sort(() => Math.random() - 0.5)
      .slice(0, needed);
    selectedConsonants = [...selectedConsonants, ...randomConsonants];
  } else if (selectedConsonants.length > 4) {
    selectedConsonants = selectedConsonants.slice(0, 4);
  }

  selectedConsonants = selectedConsonants.sort(() => Math.random() - 0.5);

  const barakhadi = {};
  selectedConsonants.forEach((consonant) => {
    barakhadi[consonant] = chart[consonant] || [];
  });

  return barakhadi;
}

const playAudio = (audioUrl) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }
};

const Barakhadi = ({
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
  customWords, // Array of words to filter (e.g., ["నది", "చేప", "చీర"] for Telugu F2)
}) => {
  steps = 1;

  const [word, setWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFullChart, setShowFullChart] = useState(false);
  const [currentBarakhadi, setCurrentBarakhadi] = useState({});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [incorrectCell, setIncorrectCell] = useState(null);
  const [isWordWrong, setIsWordWrong] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const navigate = useNavigate();
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);
  const lang = getLocalData("lang") || "hi";
  const [showAudioWave, setShowAudioWave] = useState(false);
  const [showWordAudioWave, setShowWordAudioWave] = useState(false);
  const sessionId = getLocalData("sessionId");
  const virtualId = getLocalData("virtualId");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [open, setOpen] = useState(false);

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

  const swar = vowelsData[lang] || vowelsData.hi;
  const vowels = vowelsData[lang] || vowelsData.hi;

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
        console.log(
          "Voices loaded successfully:",
          voices.map((v) => ({ name: v.name, lang: v.lang }))
        );

        const hasTamil = voices.some(
          (v) => v.lang === "ta-IN" || v.lang.startsWith("ta")
        );
        if (!hasTamil && lang === "ta") {
          setVoiceStatus("Tamil voice not available. Using Hindi instead.");
        } else {
          setVoiceStatus("");
        }
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const getWordData = () => {
    return wordData[lang] || wordData.hi;
  };

  // Get all words for the language
  let wordDataList = getWordData();

  // Filter wordDataList based on customWords if provided (similar to how LetterTrain filters with customLetters)
  if (customWords && Array.isArray(customWords) && customWords.length > 0) {
    // Normalize customWords for comparison (trim whitespace)
    const normalizedCustomWords = customWords
      .map((word) => (word && typeof word === "string" ? word.trim() : ""))
      .filter(Boolean);

    console.log("Barakhadi - Filtering words based on customWords:", {
      customWords,
      normalizedCustomWords,
      totalWordsBeforeFilter: wordDataList.length,
    });

    // Filter wordDataList to only include words that match customWords
    wordDataList = wordDataList.filter((wordItem) => {
      const wordText = wordItem?.text;
      if (!wordText || typeof wordText !== "string") {
        return false;
      }
      // Check if the word text matches any of the custom words
      return normalizedCustomWords.includes(wordText.trim());
    });

    console.log("Barakhadi - Filtered wordDataList:", {
      filteredWordsCount: wordDataList.length,
      filteredWords: wordDataList.map((item) => item.text),
    });
  } else {
    console.log("Barakhadi - No customWords provided, using all words:", {
      totalWords: wordDataList.length,
    });
  }

  const getTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் பாராகடி சார்ட்",
      te: "తెలుగు గుణింతాలు చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getButtonTexts = () => {
    const texts = {
      hi: {
        listen: "सुनो",
        delete: "पिछला मिटाओ",
        erase: "सब मिटाओ",
        viewChart: "पूरा चार्ट देखें",
      },
      ta: {
        listen: "கேள்",
        delete: "கடைசியை நீக்கு",
        erase: "அனைத்தையும் துடை",
        viewChart: "முழு விளக்கப்படத்தைக் காண்க",
      },
      te: {
        listen: "వినండి",
        delete: "చివరిది తొలగించు",
        erase: "అన్నీ తొలగించు",
        viewChart: "పూర్తి చార్ట్ చూడండి",
      },
      kn: {
        listen: "ಕೇಳಿ",
        delete: "ಕೊನೆಯದನ್ನು ಅಳಿಸಿ",
        erase: "ಎಲ್ಲಾ ಅಳಿಸಿ",
        viewChart: "ಪೂರ್ಣ ಚಾರ್ಟ್ ನೋಡಿ",
      },
    };
    return texts[lang] || texts.hi;
  };

  const buttonTexts = getButtonTexts();

  const getChartTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் மெய்யெழுத்துக்கள்",
      te: "తెలుగు గుణింతాలు చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getSpeechLang = () => {
    const langCodes = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
    };

    const requestedCode = langCodes[lang] || "hi-IN";
    const voices = speechSynthesis.getVoices();

    const isVoiceAvailable = voices.some(
      (voice) =>
        voice.lang === requestedCode ||
        voice.lang.startsWith(requestedCode.split("-")[0])
    );

    console.log("Voice availability check:", {
      requested: requestedCode,
      available: isVoiceAvailable,
      allVoices: voices.map((v) => v.lang),
    });

    if (!isVoiceAvailable) {
      console.log(`Voice for ${requestedCode} not available, using fallback`);

      if (voices.some((v) => v.lang === "hi-IN" || v.lang.startsWith("hi"))) {
        return "hi-IN";
      } else if (
        voices.some((v) => v.lang === "en-US" || v.lang.startsWith("en"))
      ) {
        return "en-US";
      } else if (voices.length > 0) {
        return voices[0].lang;
      }
    }

    return requestedCode;
  };

  const getInstructionAltText = () => {
    const altTexts = {
      hi: "शब्द",
      ta: "சொல்",
      te: "పదం",
      kn: "ಪದ",
    };
    return altTexts[lang] || altTexts.hi;
  };

  useEffect(() => {
    // Only set initial word if wordDataList has items
    if (wordDataList && wordDataList.length > 0) {
      const initialTargetWord = wordDataList[0].text;
      setTargetWord(initialTargetWord);
      const barakhadi = getBarakhadiForWord(initialTargetWord, lang);
      setCurrentBarakhadi(barakhadi);
      setCurrentWordIndex(0); // Reset word index when word list changes
    } else {
      console.warn(
        "Barakhadi - wordDataList is empty, cannot set initial target word"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, customWords]); // wordDataList is computed from lang and customWords, so we don't need it in deps

  useEffect(() => {
    if (targetWord) {
      const barakhadi = getBarakhadiForWord(targetWord, lang);
      setCurrentBarakhadi(barakhadi);
    }
  }, [targetWord, lang]);

  useEffect(() => {
    // Removed unnecessary getAssessment & Pagination API calls
    console.log(
      "Barakhadi component mounted - skipping assessment/pagination API calls"
    );
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

    // Removed fetchGetSetResult call since currentCollectionId and totalSyllableCount

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

  const handleNextWord = () => {
    // Safety check: ensure wordDataList has items
    if (!wordDataList || wordDataList.length === 0) {
      console.warn("Barakhadi - handleNextWord: wordDataList is empty");
      // If handleNext prop is provided (e.g., from F2 flow), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default behavior for non-flow usage
        setLocalData("rFlow", false);
        setLocalData("mFail", false);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        callTelemetryDiscovery("R1-Barakhadi");
      }
      return;
    }

    console.log("Barakhadi handleNextWord:", {
      currentWordIndex,
      wordDataListLength: wordDataList.length,
      isLastItem: currentWordIndex >= wordDataList.length - 1,
      customWords,
      hasHandleNext: !!handleNext,
    });

    const nextIndex = currentWordIndex + 1;

    // Check if we've reached the end of the word list
    if (nextIndex < wordDataList.length) {
      // Safety check: ensure nextIndex is valid and has text property
      if (wordDataList[nextIndex] && wordDataList[nextIndex].text) {
        // Move to next word
        setCurrentWordIndex(nextIndex);
        setTargetWord(wordDataList[nextIndex].text);
        setWord("");
        setShowConfetti(false);
        setIncorrectCell(null);
        setIsWordWrong(false);
      } else {
        console.warn(
          "Barakhadi - handleNextWord: Invalid nextIndex or missing text",
          {
            nextIndex,
            wordDataListLength: wordDataList.length,
            wordDataListNextIndex: wordDataList[nextIndex],
          }
        );
        // If invalid, treat as completion
        if (handleNext && typeof handleNext === "function") {
          handleNext();
        } else {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          callTelemetryDiscovery("R1-Barakhadi");
        }
      }
    } else {
      // Reached end of word list - complete the Barakhadi step
      console.log(
        "Barakhadi completed - all customWords done. Calling handleNext."
      );
      // If handleNext prop is provided (e.g., from F2 flow), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default behavior for non-flow usage (R0, R1, etc.)
        setLocalData("rFlow", false);
        setLocalData("mFail", false);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        callTelemetryDiscovery("R1-Barakhadi");
      }
      // Don't continue - exit here
      return;
    }
  };

  const handleLetterClick = (letter, rowIndex, colIndex) => {
    const remainingTarget = targetWord.slice(word.length);

    const isCorrect = remainingTarget.startsWith(letter);

    const newWord = word + letter;
    setWord(newWord);

    if (isCorrect) {
      setIsWordWrong(false);
      if (newWord === targetWord) {
        correctAudio.play();
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    } else {
      // when user seclect wrong option then colour is red.
      wrongAudio.play();
      setIsWordWrong(true);
      setIncorrectCell({ rowIndex, colIndex });
      setTimeout(() => {
        setIncorrectCell(null);
      }, 500);
    }
  };

  const handleErase = () => {
    setWord("");
    setIncorrectCell(null);
    setIsWordWrong(false);
  };

  const handleDelete = () => {
    const newWord = word.slice(0, -1);
    setWord(newWord);
    setIncorrectCell(null);
    // Check if the remaining word is still wrong
    if (newWord.length > 0) {
      setIsWordWrong(!targetWord.startsWith(newWord));
    } else {
      setIsWordWrong(false);
    }
  };
  const handleListen = () => {
    if (word.length > 0) {
      console.log("Playing audio for user-typed word:", word);

      if (word === targetWord) {
        if (currentWordData) {
          playSegmentedAudio(currentWordData);
        } else {
          playTTS(word);
        }
      } else {
        playTTS(word);
      }
    }
  };

  const playTTS = (textToSpeak) => {
    if (!voicesReady) {
      console.log("Voices not loaded yet, retrying in 500ms...");
      setTimeout(() => playTTS(textToSpeak), 500);
      return;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const requestedLang = getSpeechLang();
      const voices = speechSynthesis.getVoices();

      // Find the best available voice
      let selectedVoice = null;

      // First try: Exact match
      selectedVoice = voices.find((voice) => voice.lang === requestedLang);

      // Second try: Language family match (e.g., ta-IN for ta)
      if (!selectedVoice) {
        const langFamily = requestedLang.split("-")[0];
        selectedVoice = voices.find((voice) =>
          voice.lang.startsWith(langFamily)
        );
      }

      // Third try: Hindi fallback
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "hi-IN" || voice.lang.startsWith("hi")
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "en-US" || voice.lang.startsWith("en")
        );
      }

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
      } else {
        utterance.lang = requestedLang;
        console.log("No suitable voice found, using default");
      }

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("TTS Final Settings:", {
        text: textToSpeak,
        requestedLang: requestedLang,
        actualLang: utterance.lang,
        voice: utterance.voice?.name,
      });

      utterance.onstart = () => {
        console.log("TTS started successfully");
        setShowAudioWave(true);
      };

      utterance.onend = () => {
        console.log("TTS ended");
        setShowAudioWave(false);
      };

      utterance.onerror = (event) => {
        console.error("TTS error:", event);
        setShowAudioWave(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const playSegmentedAudio = (wordData) => {
    if (wordData && wordData.segmentedAudio) {
      setShowAudioWave(true);

      const audio = new Audio(wordData.segmentedAudio);

      audio.play().catch((error) => {
        console.error("Error playing segmented audio:", error);
        setShowAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        setShowAudioWave(false);
      };

      setTimeout(() => {
        setShowAudioWave(false);
      }, 5000);
    } else {
      playTTS(wordData.text);
    }
  };

  const playWordAudio = (wordData) => {
    if (wordData && wordData.audio) {
      setShowWordAudioWave(true);

      const audioUrl = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${wordData.audio}`;
      console.log("Attempting to play audio from:", audioUrl);

      const audio = new Audio(audioUrl);

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setShowWordAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        console.log("Audio playback completed");
        setShowWordAudioWave(false);
      };

      audio.onerror = (e) => {
        console.error("Audio element error:", e);
        setShowWordAudioWave(false);
      };
    } else {
      console.log("No audio found, using TTS");
      playTTS(wordData.text);
    }
  };

  const debugVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log("=== VOICE DEBUG INFO ===");
    console.log("Total voices:", voices.length);
    console.log(
      "Available languages:",
      [...new Set(voices.map((v) => v.lang))].sort()
    );
    console.log(
      "Detailed voices:",
      voices.map((v) => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
        default: v.default,
      }))
    );
  };

  // Safety check: ensure wordDataList has items before accessing
  const currentWordData =
    wordDataList && wordDataList.length > 0
      ? wordDataList.find((item) => item.text === targetWord) || wordDataList[0]
      : null;
  const vyajan = Object.keys(currentBarakhadi);

  const generateFullBarakhadi = () => {
    return barakhadiCharts[lang] || {};
  };

  const containerStyle = {
    fontFamily: "sans-serif",
    background: "#f2fbe9",
    padding: "0px",
    textAlign: "center",
    overflow: "hidden",
  };

  const cardStyle = {
    background: "#fff",
    padding: "23px",
    borderRadius: "12px",
    display: "inline-block",
    position: "relative",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    width: "95%",
    maxWidth: "1200px",
    height: "70vh",
  };

  const titleStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "rgba(51, 63, 97, 1)",
    marginBottom: "10px",
    marginTop: "-12px",
    fontFamily: "Quicksand",
    gap: "10px",
  };

  const wordBoxStyle = {
    border: "1px dashed #ff9800",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    zIndex: 1000,
    background: "#FFF9ED",
    height: "130px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  };

  const btnRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "200px",
    marginTop: "auto",
    flexShrink: 0,
  };

  const buttonStyle = {
    padding: "8px 30px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    height: "35px",
    flexDirection: "column",
  };

  const disabledButtonStyle = {
    padding: "8px 30px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    boxShadow: "0px 4px 6px rgba(0, 128, 0, 0.3)",
    opacity: 0.6,
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    height: "35px",
  };

  const tableStyle = {
    marginTop: "50px",
    borderCollapse: "collapse",
    width: "100%",
    tableLayout: "fixed",
    position: "relative",
  };

  const tdStyle = {
    padding: "4px",
    border: "1px solid #ccc",
    fontSize: lang === "te" ? "28px" : "23px",
    textAlign: "center",
    width: "58px",
    cursor: "pointer",
    fontWeight: lang === "te" ? 400 : 800,
    fontFamily: getFontFamily(lang),
    transition: "background-color 0.3s ease",
  };

  const circleStyle = {
    width: lang === "te" ? "28px" : "22px",
    height: lang === "te" ? "28px" : "22px",
    borderRadius: "50%",
    background: "#2c3e50",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: lang === "te" ? "normal" : "bold",
    fontSize: lang === "te" ? "16px" : "12px",
    fontFamily: getFontFamily(lang),
    lineHeight: "1",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    margin: "0 auto",
    marginBottom: "4px",
  };

  const leftCircleStyle = {
    position: "absolute",
    width: lang === "te" ? "34px" : "28px",
    height: lang === "te" ? "34px" : "28px",
    borderRadius: "50%",
    background: "#ffeb3b",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: lang === "te" ? "normal" : "bold",
    fontSize: lang === "te" ? "18px" : "12px",
    fontFamily: getFontFamily(lang),
    lineHeight: "1",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    border: "1px solid black",
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
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
      <div style={containerStyle}>
        {showConfetti && <Confetti />}
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
                src={`https://www.youtube.com/embed/GrPT4e_aTvM?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px", zIndex: 99999 }}
              ></iframe>
            </div>
          </div>
        )}
        {voiceStatus && (
          <div
            style={{
              position: "fixed",
              bottom: 10,
              left: 10,
              background: "yellow",
              padding: "5px",
              fontSize: "12px",
              borderRadius: "5px",
              border: "1px solid orange",
            }}
          >
            {voiceStatus}
          </div>
        )}

        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(0.6);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
          `}
        </style>

        {showFullChart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              zIndex: 10000,
              margin: "20px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                padding: "10px",
                width: "100%",
                maxWidth: "1100px",
                margin: "0 auto",
                position: "relative",
                minHeight: "auto",
              }}
            >
              <img
                src={closebuttonImg}
                alt="Close"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => setShowFullChart(false)}
              />

              <h2
                style={{
                  textAlign: "center",
                  color: "rgba(51, 63, 97, 1)",
                  marginBottom: "20px",
                  fontSize: "30px",
                  fontWeight: 700,
                  marginRight: "30px",
                  marginTop: "10px",
                  fontFamily: "Quicksand",
                }}
              >
                {getChartTitle()}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Vowels Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "10px",
                    width: `${vowels.length * 52}px`,
                    marginLeft: "142px",
                    gap: "2px",
                  }}
                >
                  {vowels.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        width: lang === "te" ? "56px" : "50px",
                        height: lang === "te" ? "56px" : "50px",
                        borderRadius: "50%",
                        background: "#1a237e",
                        color: "white",
                        border: "1px solid #999",
                        fontWeight: lang === "te" ? "normal" : "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 2px",
                        fontSize: lang === "te" ? "28px" : "18px",
                        flexShrink: 0,
                        fontFamily: getFontFamily(lang),
                        lineHeight: "1",
                        textAlign: "center",
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px",
                      gap: "3px",
                    }}
                  >
                    {Object.keys(generateFullBarakhadi()).map(
                      (consonant, index) => (
                        <div
                          key={index}
                          style={{
                            width: lang === "te" ? "52px" : "45px",
                            height: lang === "te" ? "52px" : "45px",
                            borderRadius: "50%",
                            background: "#fbc02d",
                            border: "1px solid black",
                            fontWeight: lang === "te" ? "normal" : "bold",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "4px 0",
                            fontSize: lang === "te" ? "28px" : "18px",
                            flexShrink: 0,
                            fontFamily: getFontFamily(lang),
                            lineHeight: "1",
                            textAlign: "center",
                          }}
                        >
                          {consonant}
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      <tbody>
                        {Object.entries(generateFullBarakhadi()).map(
                          ([consonant, syllables], rowIdx) => (
                            <tr key={rowIdx}>
                              {syllables.map((syllable, idx) => (
                                <td
                                  key={idx}
                                  style={{
                                    width: 55,
                                    height: 55,
                                    border: "1px solid #ccc",
                                    fontSize: lang === "te" ? "28px" : "18px",
                                    fontWeight:
                                      lang === "te" ? "normal" : "bold",
                                    minWidth: "55px",
                                    fontFamily: getFontFamily(lang),
                                  }}
                                >
                                  {syllable}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <div style={titleStyle}>
            <span
              style={{
                fontSize: lang === "te" ? "30px" : "22px",
                fontWeight: lang === "te" ? "400" : "700",
                color: "#333F61",
                fontFamily: getFontFamily(lang),
              }}
            >
              {lang === "hi"
                ? "शब्द बनाओ"
                : lang === "ta"
                ? "சொல்லை உருவாக்கு"
                : lang === "te"
                ? "తెలుగు గుణింతాలు చార్ట్"
                : lang === "kn"
                ? "ಪದವನ್ನು ರಚಿಸಿ"
                : "Make a Word"}
            </span>
          </div>

          <div
            style={{
              ...wordBoxStyle,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "105px",
              padding: "15px 20px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    background: "rgba(51, 63, 97, 1)",
                    color: "#fff",
                    padding: lang === "te" ? "0px 24px 8px 24px" : "2px 24px",
                    borderRadius: "6px",
                    minWidth: "80px",
                    textAlign: "center",
                    display: "inline-block",
                    fontFamily: getFontFamily(lang),
                    fontSize: lang === "te" ? "28px" : "20px",
                    fontWeight: "normal",
                    lineHeight: lang === "te" ? "1.1" : "normal",
                    verticalAlign: "middle",
                  }}
                >
                  {currentWordData?.text || ""}
                </span>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {showWordAudioWave ? (
                    <img
                      src={audiowaveImg}
                      alt="audio playing"
                      style={{
                        width: "90px",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={listenImg}
                        alt="listen"
                        style={{
                          width: "39px",
                          cursor: "pointer",
                          position: "relative",
                          zIndex: 1,
                        }}
                        onClick={() =>
                          currentWordData && playWordAudio(currentWordData)
                        }
                      />
                      <div
                        style={{
                          position: "absolute",
                          width: "45px",
                          height: "45px",
                          backgroundColor: "#A856FF",
                          borderRadius: "50%",
                          animation: "pulse 1.2s linear infinite",
                          top: "-9%",
                          left: "9%",
                          transform: "translate(-50%, -50%)",
                          zIndex: -1,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  border: "1px solid orange",
                  borderRadius: "10px",
                  height: "50px",
                  width: "65%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  fontSize: lang === "te" ? "26px" : "22px",
                  fontWeight: lang === "te" ? "normal" : "bold",
                  color:
                    word === targetWord
                      ? "#27ae60"
                      : isWordWrong
                      ? "#d32f2f"
                      : "#2c3e50",
                  background:
                    word === targetWord
                      ? "#E8F5E8"
                      : isWordWrong
                      ? "#FFE8E8"
                      : "#FFFFFF",
                  paddingLeft: "20px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "background 0.3s ease, color 0.3s ease",
                  marginBottom: "60px",
                  fontFamily: getFontFamily(lang),
                }}
              >
                {word ? word : <span style={{ opacity: 0.4 }}></span>}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "22px",
                  width: "40%",
                  marginBottom: "80px",
                }}
              >
                <button
                  style={
                    word.length === 0
                      ? {
                          ...disabledButtonStyle,
                          boxShadow: "3px 4px 6px rgba(0, 128, 0, 0.3)",
                          backgroundColor: "#E4F5FF",
                          border: "2px solid #1CB0F6",
                          color: "#333F61",
                          width: "85px",
                          height: "40px",
                          flexDirection: "row",
                        }
                      : {
                          ...buttonStyle,
                          boxShadow: "3px 4px 6px rgba(0, 128, 0, 1.6)",
                          backgroundColor: "#E4F5FF",
                          color: "#333F61",
                          width: "85px",
                          height: "40px",
                          flexDirection: "row",
                        }
                  }
                  onClick={handleListen}
                  disabled={word.length === 0}
                >
                  <img
                    src={listenImgBox}
                    alt="listen"
                    style={{ height: "30px" }}
                  />
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "white",
                    color: "#333F61",
                    width: "85px",
                    height: "40px",
                    flexDirection: "row",
                    boxShadow: "3px 4px 6px rgba(255, 165, 0, 1.6)",
                  }}
                  onClick={handleDelete}
                >
                  <img src={eraseImg} alt="delete" style={{ height: "30px" }} />
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "white",
                    color: "#333F61",
                    width: "85px",
                    height: "40px",
                    flexDirection: "row",
                    boxShadow: "3px 4px 6px rgba(255, 0, 0, 1.6)",
                  }}
                  onClick={handleErase}
                >
                  <img src={deleteImg} alt="erase" style={{ height: "30px" }} />
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              paddingLeft: "60px",
              marginTop: "30px",
              //height: "300px",
            }}
          >
            {vyajan.map((v, i) => (
              <div
                key={i}
                style={{
                  ...leftCircleStyle,
                  left: "19px",
                  top: `${i * 45 + 25}px`,
                }}
              >
                {v}
              </div>
            ))}

            <table style={tableStyle}>
              <thead>
                <tr>
                  {swar.map((v, i) => (
                    <th key={i}>
                      <div style={circleStyle}>{v}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vyajan.map((consonant, rowIndex) => (
                  <tr key={rowIndex}>
                    {currentBarakhadi[consonant]?.map((cell, colIndex) => {
                      const isIncorrectCell =
                        incorrectCell?.rowIndex === rowIndex &&
                        incorrectCell?.colIndex === colIndex;
                      return (
                        <td
                          key={colIndex}
                          style={{
                            ...tdStyle,
                            backgroundColor: isIncorrectCell
                              ? "#FFE8E8"
                              : tdStyle.backgroundColor || "transparent",
                            transition: "background-color 0.3s ease",
                          }}
                          onClick={() =>
                            handleLetterClick(cell, rowIndex, colIndex)
                          }
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                padding: "0 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#F8FBFF",
                  border: "1px solid rgba(231, 232, 236, 1)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => setShowFullChart(true)}
              >
                <img src={dottimg} alt="dots" style={{ height: "24px" }} />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "rgba(51,63,97,1)",
                    fontFamily: "Quicksand",
                  }}
                >
                  {buttonTexts.viewChart}
                </span>
              </div>

              <img
                src={nextImg}
                alt="next"
                style={{ height: "32px", cursor: "pointer" }}
                onClick={handleNextWord}
              />
            </div>
          </div>

          <img
            src={boyballonflyImg}
            alt="boy balloon"
            style={{
              position: "absolute",
              top: "10px",
              right: "120px",
              width: "60px",
              zIndex: 1,
            }}
          />

          <img
            src={boyImg}
            alt="boy"
            style={{
              position: "absolute",
              top: "48px",
              right: "60px",
              width: "60px",
            }}
          />
          <img
            src={bearImg}
            alt="bear"
            style={{
              position: "absolute",
              bottom: "-40px",
              right: "-10px",
              width: "170px",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Barakhadi;
