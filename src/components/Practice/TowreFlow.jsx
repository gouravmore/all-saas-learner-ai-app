import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useMemo,
  useCallback,
} from "react";
import clockImg from "../../assets/clocck.svg";
import handImg from "../../assets/hand.svg";
import boxImg from "../../assets/box.svg";
import pauseImg from "../../assets/pauuse.svg";
import arrowImg from "../../assets/arrow.svg";
import pandaImg from "../../assets/panda.svg";
import nextImg from "../../assets/next.svg";
import activeboxImg from "../../assets/activeBox.svg";
import startImg from "../../assets/start.svg";
import pandaTimerImg from "../../assets/pandaTimer1.svg";
import timerBoxImg from "../../assets/timerBox.svg";
import initialMessageBoxImg from "../../assets/initialMessageBox.svg";
import { doubleMetaphone } from "double-metaphone";
import { Box, useMediaQuery, createTheme } from "@mui/material";
import reportBoyImg from "../../assets/monkeyReport.svg";
import reportStarsandcloudsImg from "../../assets/starsandclouds.png";
import speedometerImg from "../../assets/speedTimer.png";
import bookImg from "../../assets/newWord.svg";
import booksStackImg from "../../assets/totalWord.svg";
import reportPandaImg from "../../assets/pandaa.svg";
import reportImg from "../../assets/reportImg.svg";
import { setLocalData, getLocalData } from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts.jsx/MainLayout";
// Using native browser Speech Recognition API instead of library
import { addTowreRecord } from "../../services/learnerAi/learnerAiService";
import * as Assets from "../../utils/imageAudioLinks";
import S3Client from "../../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const allEnglishWords = [
  { title: "is", isCorrect: false },
  { title: "up", isCorrect: false },
  { title: "cat", isCorrect: false },
  { title: "red", isCorrect: false },
  { title: "me", isCorrect: false },
  { title: "to", isCorrect: false },
  { title: "no", isCorrect: false },
  { title: "we", isCorrect: false },
  { title: "he", isCorrect: false },
  { title: "the", isCorrect: false },
  { title: "and", isCorrect: false },
  { title: "yes", isCorrect: false },
  { title: "of", isCorrect: false },
  { title: "him", isCorrect: false },
  { title: "as", isCorrect: false },
  { title: "book", isCorrect: false },
  { title: "was", isCorrect: false },
  { title: "help", isCorrect: false },
  { title: "then", isCorrect: false },
  { title: "time", isCorrect: false },
  { title: "wood", isCorrect: false },
  { title: "let", isCorrect: false },
  { title: "men", isCorrect: false },
  { title: "baby", isCorrect: false },
  { title: "new", isCorrect: false },
  { title: "stop", isCorrect: false },
  { title: "work", isCorrect: false },
  { title: "jump", isCorrect: false },
  { title: "part", isCorrect: false },
  { title: "fast", isCorrect: false },
  { title: "fine", isCorrect: false },
  { title: "milk", isCorrect: false },
  { title: "back", isCorrect: false },
  { title: "lost", isCorrect: false },
  { title: "find", isCorrect: false },
  { title: "paper", isCorrect: false },
  { title: "open", isCorrect: false },
  { title: "kind", isCorrect: false },
  { title: "able", isCorrect: false },
  { title: "shoes", isCorrect: false },
  { title: "money", isCorrect: false },
  { title: "great", isCorrect: false },
  { title: "father", isCorrect: false },
  { title: "river", isCorrect: false },
  { title: "space", isCorrect: false },
  { title: "short", isCorrect: false },
  { title: "left", isCorrect: false },
  { title: "people", isCorrect: false },
  { title: "almost", isCorrect: false },
  { title: "waves", isCorrect: false },
  { title: "child", isCorrect: false },
  { title: "strong", isCorrect: false },
  { title: "crowd", isCorrect: false },
  { title: "better", isCorrect: false },
  { title: "inside", isCorrect: false },
  { title: "plane", isCorrect: false },
  { title: "pretty", isCorrect: false },
  { title: "famous", isCorrect: false },
  { title: "children", isCorrect: false },
  { title: "without", isCorrect: false },
  { title: "finally", isCorrect: false },
  { title: "strange", isCorrect: false },
  { title: "budget", isCorrect: false },
  { title: "repress", isCorrect: false },
  { title: "contain", isCorrect: false },
  { title: "justice", isCorrect: false },
  { title: "morning", isCorrect: false },
  { title: "resolve", isCorrect: false },
  { title: "describe", isCorrect: false },
  { title: "garment", isCorrect: false },
  { title: "business", isCorrect: false },
  { title: "qualify", isCorrect: false },
  { title: "potent", isCorrect: false },
  { title: "collapse", isCorrect: false },
  { title: "elements", isCorrect: false },
  { title: "pioneer", isCorrect: false },
  { title: "remember", isCorrect: false },
  { title: "dangerous", isCorrect: false },
  { title: "uniform", isCorrect: false },
  { title: "necessary", isCorrect: false },
  { title: "problems", isCorrect: false },
  { title: "absentee", isCorrect: false },
  { title: "advertise", isCorrect: false },
  { title: "pleasant", isCorrect: false },
  { title: "property", isCorrect: false },
  { title: "distress", isCorrect: false },
  { title: "information", isCorrect: false },
  { title: "recession", isCorrect: false },
  { title: "understand", isCorrect: false },
  { title: "emphasis", isCorrect: false },
  { title: "confident", isCorrect: false },
  { title: "intuition", isCorrect: false },
  { title: "boisterous", isCorrect: false },
  { title: "plausible", isCorrect: false },
  { title: "courageous", isCorrect: false },
  { title: "alienate", isCorrect: false },
  { title: "extinguish", isCorrect: false },
  { title: "prairie", isCorrect: false },
  { title: "limousine", isCorrect: false },
  { title: "valentine", isCorrect: false },
  { title: "detective", isCorrect: false },
  { title: "recently", isCorrect: false },
  { title: "instruction", isCorrect: false },
  { title: "transient", isCorrect: false },
  { title: "phenomenon", isCorrect: false },
  { title: "calculated", isCorrect: false },
  { title: "alternative", isCorrect: false },
  { title: "collective", isCorrect: false },
];

const teluguWords = [
  "అర",
  "జడ",
  "గద",
  "కల",
  "దడ",
  "లత",
  "ఒక",
  "జత",
  "ఈల",
  "పద",
  "ఏం",
  "మీ",
  "గోడ",
  "బడి",
  "పొగ",
  "చీర",
  "నది",
  "జలజ",
  "తబల",
  "ఇతర",
  "కలప",
  "రచన",
  "రుచి",
  "గాలి",
  "కాలు",
  "తాగు",
  "దండ",
  "బాతు",
  "ఎగరు",
  "గింజ",
  "బెడద",
  "ఈతడు",
  "మోసం",
  "బురద",
  "దోరగ",
  "బలం",
  "తలుపు",
  "కంఠం",
  "గుర్రం",
  "శక్తి",
  "ఎత్తు",
  "జన్మ",
  "పద్యం",
  "కడుగు",
  "బాలిక",
  "పెరుగు",
  "గుడారు",
  "ఇతరుల",
  "కదలరా",
  "తరగతి",
  "నిలకడ",
  "రచనలు",
  "ఊరేగింపు",
  "హిందువులు",
  "ఊరగాయ",
  "అత్తరు",
  "కట్నము",
  "వచ్చాయి",
  "వాకిళ్లు",
  "ఉత్తరం",
  "మెల్లన",
  "కృత్తిక",
  "సరస్వతి",
  "దశాబ్దము",
  "ముత్తాత",
  "పిన్నీసు",
  "శతబ్దం",
  "స్కూటరు",
  "బొమ్మలు",
  "అత్తెము",
  "సంరక్షణ",
  "ప్రయత్నం",
  "గ్రీష్మము",
  "వ్యాజ్యము",
  "ప్రత్యేకం",
  "తాత్పర్యం",
  "విద్యార్థి",
  "ఆధ్వర్యం",
  "మధ్యాహ్నం",
  "ప్రాధాన్యత",
  "వాత్సల్యం",
  "పరిశ్రమ",
  "సంస్కృతి",
  "ముఖ్యమంత్రి",
  "సముద్రము",
  "స్వాతంత్య్రం",
  "ప్రత్యక్షం",
  "గురుదక్షిణ",
  "పుణ్యక్షేత్రం",
  "కృతజ్ఞతలు",
  "కొల్పలము",
  "విరోధికృత్తు",
  "పురస్కారము",
  "అక్షధూర్తుడు",
  "విశ్వకర్ముడు",
  "ఇంద్రియార్థము",
  "సమయస్ఫూర్తి",
  "వార్షికోత్సవం",
  "ప్రధానమంత్రి",
  "ఆత్మవిశ్వాసం",
];

const allTeluguWords = teluguWords.map((word) => ({
  title: word,
  isCorrect: false,
}));

const kannadaWords = [
  "ಎಡ",
  "ಗರ",
  "ಬಲ",
  "ಲಯ",
  "ಈಗ",
  "ಕದ",
  "ಚಟ",
  "ತಪ",
  "ದಳ",
  "ಆಟ",
  "ಕೈ",
  "ಭೂ",
  "ಇಲಿ",
  "ದಾರ",
  "ನಗು",
  "ಅಳು",
  "ಚೀಲ",
  "ಕಡಗ",
  "ಈಚಲ",
  "ನಗರ",
  "ಪದಕ",
  "ಔತಣ",
  "ರುಚಿ",
  "ಕೋಣ",
  "ಬಾಯಿ",
  "ಕುಡಿ",
  "ಗೀರು",
  "ದಂಡೆ",
  "ಬಿಳಿ",
  "ಕಡಲು",
  "ಮಂಡಿ",
  "ಚಾದರ",
  "ಜೀವನ",
  "ತುಂಟ",
  "ನೀರಸ",
  "ಸಿಂಹ",
  "ಆರೋಪ",
  "ಒಂಟೆ",
  "ಶಬ್ದ",
  "ಖಡ್ಗ",
  "ಸ್ವರ",
  "ಇಷ್ಟ",
  "ಪದ್ಮ",
  "ಕಡುಬು",
  "ಬಾಲಕಿ",
  "ತಲುಪು",
  "ಚಿಮಣಿ",
  "ಹಸಿರು",
  "ಆಟಗಾರ",
  "ಜಾನಪದ",
  "ಗಡಿಯಾರ",
  "ತರಕಾರಿ",
  "ಸಂಪಾದಕ",
  "ಅಂತಃಕಲಹ",
  "ಸಹಕರಿಸು",
  "ಚಿನಕುರಳಿ",
  "ನಂದಗೋಕುಲ",
  "ಹಳೇಬೀಡು",
  "ಘನಾಕೃತಿ",
  "ಪುಳಿಯೋಗರೆ",
  "ರೇಖಾಕೃತಿ",
  "ಹಬ್ಬದೂಟ",
  "ಪರಸ್ಪರ",
  "ಕನ್ನಂಬಾಡಿ",
  "ಸ್ವರಚಿತ",
  "ಆಹ್ವಾನ",
  "ರಂಗಸ್ಥಳ",
  "ಸದ್ಬಳಕೆ",
  "ಶ್ರೀಮಂತ",
  "ತತ್ವಪದ",
  "ಸಮನ್ವಯ",
  "ಯಕ್ಷಗಾನ",
  "ಕೋಷ್ಟಕ",
  "ಕಾಮನಬಿಲ್ಲು",
  "ಶಬ್ದಕೋಶ",
  "ಪ್ರಾಸಪದ",
  "ಪರೀಕ್ಷೆ",
  "ಅದೃಷ್ಟ",
  "ಕಾಲ್ಚೀಲ",
  "ಪದ್ಯಭಾಗ",
  "ಸಂಕ್ರಾಂತಿ",
  "ರಾಜಾಜ್ಞೆ",
  "ಪ್ರಧಾನಿ",
  "ಸಂಗ್ರಹಾಲಯ",
  "ಅಪಪ್ರಚಾರ",
  "ಸೌಂದರ್ಯ",
  "ಸಾರ್ವಭೌಮ",
  "ಭಾಷಾಭ್ಯಾಸ",
  "ರಾಷ್ಟ್ರೀಯ",
  "ಕರವಸ್ತ್ರ",
  "ಚಿತ್ರಾನ್ನ",
  "ವಿದ್ಯಾರ್ಥಿ",
  "ಆತ್ಮವಿಶ್ವಾಸ",
  "ಮಾರ್ಗದರ್ಶನ",
  "ವಾರ್ಷಿಕೋತ್ಸವ",
  "ಗಣ್ಯವ್ಯಕ್ತಿ",
  "ಪುಣ್ಯಕ್ಷೇತ್ರ",
  "ಸ್ಪರ್ಧಾತ್ಮಕ",
  "ಪ್ರಶ್ನಾರ್ಥಕ",
  "ಕರ್ತವ್ಯನಿಷ್ಠೆ",
];

const allKannadaWords = kannadaWords.map((word) => ({
  title: word,
  isCorrect: false,
}));

const hindiWords = [
  "तल",
  "पर",
  "नर",
  "कम",
  "रस",
  "एक",
  "घर",
  "बल",
  "यह",
  "जब",
  "नौ",
  "दो",
  "आज",
  "गला",
  "दिन",
  "सास",
  "ताऊ",
  "नगर",
  "समय",
  "कमल",
  "अलग",
  "शहर",
  "जाति",
  "चीता",
  "पैसा",
  "जंतु",
  "गीला",
  "सेना",
  "अंक",
  "गणित",
  "बादल",
  "ऊँचा",
  "गाज़र",
  "सूरज",
  "घंटी",
  "लड़का",
  "कहाँ",
  "क्या",
  "जन्म",
  "अम्ल",
  "शब्द",
  "सत्य",
  "नाचना",
  "बाज़ार",
  "गुलाबी",
  "शारीर",
  "आकाश",
  "कबूतर",
  "उबलना",
  "सरकार",
  "दोपहर",
  "जरूरत",
  "चौंतीस",
  "सुनाओं",
  "औषधि",
  "मण्डल",
  "कम्बल",
  "प्रकार",
  "विकल्प",
  "अक्सर",
  "प्रगति",
  "उत्पाद",
  "बिस्तर",
  "व्यापार",
  "आरम्भ",
  "कारागृह",
  "संघर्ष",
  "मातृभाषा",
  "कामाख्या",
  "ज़िम्मेदार",
  "प्रतिलिपि",
  "मुस्कराना",
  "गणतंत्र",
  "पारस्परिक",
  "उपस्थिति",
  "प्राकृतिक",
  "परिस्थिती",
  "अध्यापक",
  "वैज्ञानिक",
  "सुरक्षित",
  "व्यवहार",
  "शब्दकोश",
  "राष्ट्रीय",
  "वर्णमाला",
  "कर्मचारी",
  "वर्तमान",
  "धन्यवाद",
  "महोत्सव",
  "निन्यानवे",
  "संग्रहालय",
  "चिकित्सालय",
  "निम्नलिखित",
  "सृजनात्मक",
  "आशीर्वाद",
  "परिवर्तन",
  "अभिनेत्री",
  "रक्षाबंधन",
  "पर्यावरण",
  "इन्द्रधनुष",
  "महत्वपूर्ण",
];

const allHindiWords = hindiWords.map((word) => ({
  title: word,
  isCorrect: false,
}));

const tamilWords = [
  "கல்",
  "பல்",
  "கண்",
  "மண்",
  "பழம்",
  "மரம்",
  "மணல்",
  "கடல்",
  "வனம்",
  "களம்",
  "தளம்",
  "எரி",
  "நெய்",
  "வரம்",
  "நலம்",
  "மனம்",
  "கனம்",
  "கணம்",
  "மழை",
  "சமம்",
  "வட்டம்",
  "கட்டம்",
  "பட்டம்",
  "திட்டம்",
  "பக்கம்",
  "மடம்",
  "கப்பல்",
  "படம்",
  "மணம்",
  "சரம்",
  "பலம்",
  "பலன்",
  "வளம்",
  "வண்ணம்",
  "அக்கா",
  "சட்டை",
  "மக்கள்",
  "ஓடம்",
  "மரணம்",
  "மகள்",
  "உரம்",
  "நகல்",
  "அச்சம்",
  "உலர்",
  "பந்தம்",
  "நடனம்",
  "நகரம்",
  "அச்சகம்",
  "பந்தல்",
  "கணவன்",
  "சங்கம்",
  "அங்கம்",
  "கரணம்",
  "இனம்",
  "கழகம்",
  "பண்டலம்",
  "இதயம்",
  "இடம்",
  "பதக்கம்",
  "அடக்கம்",
  "கதம்பம்",
  "உளம்",
  "நண்பர்",
  "மத்தளம்",
  "மஞ்சள்",
  "சக்கரம்",
  "பழக்கம்",
  "வழக்கம்",
  "வழங்கல்",
  "வசனம்",
  "வசந்தம்",
  "சமயம்",
  "சங்கடம்",
  "சந்தனம்",
  "சமரம்",
  "தகரம்",
  "கலகம்",
  "கலகலம்",
  "சலசலம்",
  "வரன்",
  "பொம்மை",
  "ஒட்டகம்",
  "இரதம்",
  "நண்பன்",
  "ஆலயம்",
  "இரக்கம்",
  "ஆக்கம்",
  "ஓணம்",
  "சம்பளம்",
  "நல்லவன்",
  "மண்டபம்",
  "வல்லவன்",
  "ஆலமரம்",
  "இலக்கம்",
  "நாங்கள்",
  "உறக்கம்",
  "தொடங்கு",
  "வணக்கம்",
  "ஊஞ்சல்",
  "ஊர்வலம்",
];

const allTamilWords = tamilWords.map((word) => ({
  title: word,
  isCorrect: false,
}));

const theme = createTheme();

const createWordSets = (words) => {
  const sets = [];
  const wordsPerSet = 12;
  const totalSets = Math.ceil(words.length / wordsPerSet);

  for (let i = 0; i < totalSets; i++) {
    const startIdx = i * wordsPerSet;
    const endIdx = startIdx + wordsPerSet;
    const setWords = words.slice(startIdx, endIdx);

    const rows = [];
    for (let j = 0; j < setWords.length; j += 4) {
      rows.push(setWords.slice(j, j + 4));
    }

    sets.push(rows);
  }

  return sets;
};

const CombinedReportPage = ({
  currentWordSetIndex,
  wordsAttempted,
  onReset,
  allWords,
  transcript,
  totalSec,
  wpm,
}) => {
  const [showWordList, setShowWordList] = useState(false);
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const wordCount = transcript.trim().split(/\s+/).length;
  //const wordsPerMinute = Math.round((wordCount / totalSec) * 60);
  const totalWordsInCurrentSets = (currentWordSetIndex + 1) * 12;

  const attemptedWordsCount = wordCount;
  const correctWordsCount = allWords.filter((word) => word.isCorrect).length;
  const wordsPerMinute = Math.round((correctWordsCount / totalSec) * 60);
  const unattemptedWordsCount = allWords.length - correctWordsCount;
  const newWordsLearnt = correctWordsCount;
  const totalWordsLearnt = Number(correctWordsCount || 0) + Number(wpm || 0);
  const renderResults = () => (
    <div
      style={{
        backgroundColor: "#fff",
        backgroundImage: `url(${reportStarsandcloudsImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "20px",
        width: "100%",
        //maxWidth: "1100px",
        //height: "470px",
        position: "relative",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={reportPandaImg}
        alt="Panda"
        style={{ width: isMobile ? "80px" : "100px", marginBottom: "10px" }}
      />

      <h2
        style={{
          color: "#FF7F36",
          textAlign: "center",
          margin: "0 0 5px 0",
          fontSize: isMobile ? "22px" : "28px",
          fontFamily: "Quicksand",
          fontWeight: "700",
        }}
      >
        Well done!
      </h2>
      <p
        style={{
          color: "#333F61",
          textAlign: "center",
          fontSize: isMobile ? "20px" : "26px",
          fontFamily: "Quicksand",
          marginBottom: "25px",
        }}
      >
        You're reading faster.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={speedometerImg}
            alt="speed"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#1CB0F6",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {wordsPerMinute}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            Words Per Minute
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src={bookImg}
            alt="book"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#9D4EDD",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {newWordsLearnt}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            New Words Learnt
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src={booksStackImg}
            alt="books"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#F72585",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {totalWordsLearnt}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            Total Words Learnt
          </div>
        </div>
      </div>

      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <button
            onClick={() => setShowWordList(true)}
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "12px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={reportImg}
              alt="Check Report"
              style={{ width: "110px" }}
            />
          </button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <button
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "12px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            //boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
          }}
          onClick={() => {
            setLocalData("tFlow", false);
            //window.location.reload();
            if (location.pathname.includes("/towre-flow")) {
              navigate("/discover-end");
            } else if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
          }}
        >
          <img src={nextImg} alt="Next" style={{ width: 50, height: 50 }} />
        </button>
      </Box>

      <div
        style={{
          position: "absolute",
          bottom: "-4px",
          right: "-30px",
          width: "230px",
          height: "auto",
        }}
      >
        {!isMobile && (
          <>
            <img
              src={reportBoyImg}
              alt="boy character"
              style={{ width: "200px", position: "relative", zIndex: 1 }}
            />

            <button
              onClick={() => setShowWordList(true)}
              style={{
                position: "absolute",
                bottom: "35px",
                right: "45px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <img
                src={reportImg}
                alt="Check Report"
                style={{ width: "110px" }}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderWordList = () => {
    const getWordStyle = (item) => {
      let color = "#002B52";
      let background = "#F3F4F8";
      let borderColor = "#002B52";

      if (item.isCorrect) {
        color = "#2DB200";
        background = "#F5FFF4";
        borderColor = "#2DB200";
      } else if (item.isAttempted && !item.isCorrect) {
        color = "#C27BFF";
        background = "#FCF7FF";
        borderColor = "#C27BFF";
      } else if (!item.isAttempted) {
        color = "#002B52";
        background = "#F3F4F8";
        borderColor = "#002B52";
      }

      return {
        color,
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "18px 9px",
        fontSize: isMobile ? "14px" : "17px",
        fontWeight: 500,
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      };
    };

    const statBoxCommon = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: isMobile ? 2 : 4,
      py: isMobile ? 1 : 2,
      borderRadius: "16px",
      backgroundColor: "#FFFFFF",
      fontWeight: 600,
      fontSize: isMobile ? 14 : 18,
      textAlign: "center",
      minWidth: isMobile ? "auto" : "170px",
    };

    const statStyles = {
      attempted: {
        ...statBoxCommon,
        color: "#A856FF",
        border: "1px solid #A856FF",
        boxShadow: "0 4px 0 #A856FF",
      },
      correct: {
        ...statBoxCommon,
        color: "#6CC227",
        border: "1px solid #6CC227",
        boxShadow: "0 4px 0 #6CC227",
      },
      unattempted: {
        ...statBoxCommon,
        color: "#002B52",
        border: "1px solid #002B52",
        boxShadow: "0 4px 0 #333F61",
      },
    };

    return (
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          p: isMobile ? 2 : 4,
          width: isMobile ? "95%" : "90%",
          //maxWidth: "1200px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 1 : 3,
            flexWrap: "wrap",
            mb: isMobile ? 2 : 4,
          }}
        >
          <Box sx={statStyles.attempted}>
            Attempted Words: {attemptedWordsCount}
          </Box>
          <Box sx={statStyles.correct}>Correct Words: {correctWordsCount}</Box>
          <Box sx={statStyles.unattempted}>
            Unattempted Words: {unattemptedWordsCount}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
            gap: "18px",
            mb: 4,
          }}
        >
          {allWords.map((item, index) => (
            <Box
              key={index}
              sx={{
                ...getWordStyle(item),
                width: isMobile ? "90px" : "150px",
                margin: "0 auto",
              }}
            >
              {item.title}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "12px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              //boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
            }}
            onClick={() => setShowWordList(false)}
          >
            <img src={nextImg} alt="Next" style={{ width: 50, height: 50 }} />
          </button>
        </Box>
      </Box>
    );
  };

  return (
    <div
      style={{
        backgroundColor: showWordList ? "#C6EDFF" : "#d8f0fc",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "0px" : "0px",
        alignContent: "center",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {showWordList ? renderWordList() : renderResults()}
    </div>
  );
};

const TowreFlow = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  //handleNext,
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
  //loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  fluency,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  isNextButtonCalled,
  setIsNextButtonCalled,
  vocabCount,
  wordCount,
}) => {
  const [activeSet, setActiveSet] = useState(0);
  const [currentWordSetIndex, setCurrentWordSetIndex] = useState(0);
  const [message, setMessage] = useState(
    "Look at the words.\nYou'll read them soon — left to right, top to bottom"
  );
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(3);
  const [showFinalWords, setShowFinalWords] = useState(false);
  const [completedAllSets, setCompletedAllSets] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(45);
  const [wordsAttempted, setWordsAttempted] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [transcripts, setTranscripts] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [totalSec, setTotalSec] = useState(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const lang = getLocalData("lang");

  // Map language codes to browser Speech Recognition format
  // Memoize to prevent function recreation on every render
  const getBrowserLanguage = useCallback((langCode) => {
    const browserLangMap = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN",
      ka: "kn-IN", // Kannada
      ta: "ta-IN",
    };
    return browserLangMap[langCode] || "en-US";
  }, []);

  // Check browser support for native Speech Recognition API
  const browserSupportsSpeechRecognition = useMemo(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  // Create recognition instance
  const recognitionRef = useRef(null);

  // Initialize recognition instance
  useEffect(() => {
    if (browserSupportsSpeechRecognition && !recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getBrowserLanguage(lang);

      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log("✅ Speech recognition started (onstart event)");
        setListening(true);
        recognitionStartedRef.current = true;
      };

      recognitionRef.current.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setTranscript((prev) => (prev + final).trim());
          setInterimTranscript("");
          console.log("✅ Final transcript received:", final.trim());
        } else if (interim) {
          setInterimTranscript(interim);
          console.log("📝 Interim transcript:", interim);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        if (event.error === "aborted") {
          console.log("ℹ️ Speech recognition aborted");
        } else if (event.error === "no-speech") {
          console.log("ℹ️ No speech detected");
        } else if (event.error === "network") {
          console.error(
            "❌ Network error - speech recognition requires internet connection"
          );
        }
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log("ℹ️ Speech recognition ended");
        setListening(false);

        // Auto-restart if we should be listening
        // Use refs to avoid stale closure issues
        if (shouldBeListeningRef.current) {
          setTimeout(() => {
            // Check current state via refs
            if (shouldBeListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                console.log("🔄 Auto-restarting speech recognition");
              } catch (error) {
                // Recognition might already be starting, ignore error
                console.log(
                  "ℹ️ Recognition restart attempt (may already be starting):",
                  error.message
                );
              }
            }
          }, 100);
        }
      };
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, [browserSupportsSpeechRecognition, lang, getBrowserLanguage]); // Only depend on these - recognition instance should persist

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
  }, []);

  // Memoize language-based word selection to prevent recalculation on every render
  const allWords = useMemo(() => {
    const wordsByLang = {
      en: allEnglishWords,
      hi: allHindiWords,
      te: allTeluguWords,
      ka: allKannadaWords,
      ta: allTamilWords,
    };
    return wordsByLang[lang] || allEnglishWords;
  }, [lang]);

  // Memoize word sets creation - only recalculate when words or currentWordSetIndex changes
  const allWordSets = useMemo(() => createWordSets(allWords), [allWords]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentWordSet = useMemo(
    () => allWordSets[currentWordSetIndex],
    [allWordSets, currentWordSetIndex]
  );
  const transcriptRef = useRef("");
  const location = useLocation();
  background = "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)";
  showTimer = false;

  useEffect(() => {
    // Always log to see what's happening
    if (listening) {
      console.log(
        `🎤 Listening - Transcript: "${transcript || ""}" | Interim: "${
          interimTranscript || ""
        }" | Listening: ${listening}`
      );

      // Log if we have interim results but no final transcript
      if (interimTranscript && !transcript) {
        console.log("📝 Interim transcript available:", interimTranscript);
        transcriptRef.current = interimTranscript;
      }

      // Log if we have final transcript
      if (transcript) {
        console.log("✅ Final transcript received:", transcript);
        transcriptRef.current = transcript;
      }

      // If listening but no transcript at all, log this to help debug
      if (!transcript && !interimTranscript) {
        console.log(
          "⚠️ Listening but no transcript yet - speak clearly into microphone"
        );
      }
    } else {
      console.log(
        `🔇 Not listening - Transcript: "${transcript || ""}" | Interim: "${
          interimTranscript || ""
        }" | Listening: ${listening}`
      );
    }

    // Combine transcript and interimTranscript for the most up-to-date value
    const combinedTranscript = transcript || interimTranscript || "";
    if (combinedTranscript && combinedTranscript.trim().length > 0) {
      transcriptRef.current = combinedTranscript;
    }
  }, [transcript, interimTranscript, listening]);

  // Track listening state changes and auto-restart if it stops unexpectedly
  const shouldBeListeningRef = useRef(false);
  const recognitionStartedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef(null);
  const isRestartingRef = useRef(false);
  const lastListeningStateRef = useRef(listening);
  const restartDebounceRef = useRef(null);

  useEffect(() => {
    // Only log if listening state actually changed
    if (lastListeningStateRef.current !== listening) {
      console.log("🎧 Speech recognition listening state changed:", listening);
      lastListeningStateRef.current = listening;

      // If we just started listening and we expected it to start, verify it's working
      if (listening && recognitionStartedRef.current) {
        console.log(
          "✅ Speech recognition confirmed active (listening state is true)"
        );

        // Check if transcript is updating after delays (helps verify the library is working)
        const transcriptCheckTimeout1 = setTimeout(() => {
          // Re-check current state in the transcript useEffect - it will log if still no transcript
          console.log(
            "⏱️ 3 seconds elapsed - checking if transcript is being received..."
          );
          console.log("📊 Current state:", {
            listening,
            transcript: transcript || "(empty)",
            interimTranscript: interimTranscript || "(empty)",
            transcriptLength: transcript?.length || 0,
            interimLength: interimTranscript?.length || 0,
          });

          if (listening && !transcript && !interimTranscript) {
            console.warn(
              "⚠️ Recognition is listening but no transcript received after 3 seconds."
            );
            console.warn("   Possible causes:");
            console.warn(
              "   1. Old handlers from hot-reload are interfering (do a hard refresh: Ctrl+Shift+R)"
            );
            console.warn(
              "   2. Microphone is not picking up audio - try speaking louder"
            );
            console.warn("   3. Browser speech recognition API issue");
            console.warn(
              "   4. Network connectivity issue (speech recognition uses cloud service)"
            );
            console.warn(
              "   💡 Try speaking clearly into the microphone - the API may need more time"
            );
          }
        }, 3000);

        // Check again after 10 seconds to see if results come in later
        const transcriptCheckTimeout2 = setTimeout(() => {
          console.log("⏱️ 10 seconds elapsed - final check...");
          console.log("📊 Final state:", {
            listening,
            transcript: transcript || "(empty)",
            interimTranscript: interimTranscript || "(empty)",
            transcriptLength: transcript?.length || 0,
            interimLength: interimTranscript?.length || 0,
          });

          if (listening && !transcript && !interimTranscript) {
            console.error(
              "❌ CRITICAL: Speech recognition is listening but NO transcript received after 10 seconds!"
            );
            console.error(
              "   This indicates the Web Speech API is not returning results."
            );
            console.error("   Solutions:");
            console.error(
              "   1. Check internet connection (Web Speech API requires network)"
            );
            console.error(
              "   2. Try a different browser (Chrome/Edge work best)"
            );
            console.error("   3. Check browser console for network errors");
            console.error("   4. Verify microphone is working in other apps");
            console.error("   5. Try restarting the browser");
          } else if (transcript || interimTranscript) {
            console.log(
              "✅ Transcript received! The API is working, it just took longer than expected."
            );
          }
        }, 10000);

        // Cleanup timeouts on unmount or state change
        return () => {
          clearTimeout(transcriptCheckTimeout1);
          clearTimeout(transcriptCheckTimeout2);
        };
      }
    }

    if (!listening && transcript) {
      console.log(
        "⚠️ Speech recognition stopped but transcript exists:",
        transcript
      );
    }

    // If we should be listening but we're not, try to restart with retry logic
    // Add debounce to prevent rapid restart attempts during re-renders
    if (
      shouldBeListeningRef.current &&
      !listening &&
      showFinalWords &&
      !showResults &&
      !isRestartingRef.current
    ) {
      // Clear any existing debounce timeout
      if (restartDebounceRef.current) {
        clearTimeout(restartDebounceRef.current);
      }

      // Debounce restart attempts to avoid rapid-fire restarts during re-renders
      restartDebounceRef.current = setTimeout(() => {
        // Double-check conditions after debounce delay
        if (
          shouldBeListeningRef.current &&
          !listening &&
          showFinalWords &&
          !showResults &&
          !isRestartingRef.current
        ) {
          isRestartingRef.current = true;

          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          const attemptRestart = (attemptNumber) => {
            if (
              browserSupportsSpeechRecognition &&
              shouldBeListeningRef.current &&
              attemptNumber <= maxRetries
            ) {
              // Check listening state right before attempting restart
              // If already listening, don't restart
              if (listening) {
                console.log(
                  "ℹ️ Recognition already listening, skipping restart"
                );
                isRestartingRef.current = false;
                retryCountRef.current = 0;
                return;
              }

              console.warn(
                `⚠️ Speech recognition stopped unexpectedly. Attempting restart ${attemptNumber}/${maxRetries}...`
              );
              try {
                resetTranscript();
                if (recognitionRef.current) {
                  recognitionRef.current.lang = getBrowserLanguage(lang);
                  recognitionRef.current.start();
                  console.log(
                    `🔄 Restart attempt ${attemptNumber} - command sent`
                  );
                }
                retryCountRef.current = attemptNumber;
                isRestartingRef.current = false; // Reset immediately, let useEffect handle next check

                // Don't check listening state here - it will be stale
                // Let the useEffect cycle naturally check if it started
                // If it didn't start, the useEffect will trigger again
              } catch (error) {
                console.error(
                  `❌ Error in restart attempt ${attemptNumber}:`,
                  error
                );
                isRestartingRef.current = false;
                if (attemptNumber < maxRetries) {
                  // Retry with exponential backoff: 1000ms, 2000ms, 4000ms
                  const delay = 1000 * Math.pow(2, attemptNumber - 1);
                  setTimeout(() => {
                    attemptRestart(attemptNumber + 1);
                  }, delay);
                } else {
                  retryCountRef.current = 0;
                  isRestartingRef.current = false;
                }
              }
            }
          };

          // Start retry sequence with delay
          retryTimeoutRef.current = setTimeout(() => {
            attemptRestart(1);
          }, 1000); // Increased debounce delay to 1 second
        }
      }, 1000); // Debounce delay to prevent rapid restarts during re-renders
    }
  }, [
    listening,
    transcript,
    showFinalWords,
    showResults,
    browserSupportsSpeechRecognition,
    lang,
  ]);

  // Cleanup retry timeouts when component unmounts or when activity ends
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (restartDebounceRef.current) {
        clearTimeout(restartDebounceRef.current);
        restartDebounceRef.current = null;
      }
    };
  }, []);

  // Reset retry count when activity ends
  useEffect(() => {
    if (showResults) {
      retryCountRef.current = 0;
      isRestartingRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (restartDebounceRef.current) {
        clearTimeout(restartDebounceRef.current);
        restartDebounceRef.current = null;
      }
    }
  }, [showResults]);

  // Reset component state when it first mounts to ensure clean start
  // This ensures TowreFlow starts fresh when rendered after M3 showcase
  useEffect(() => {
    // Reset all state to initial values when component mounts
    setIsStarted(false);
    setActiveSet(0);
    setCurrentWordSetIndex(0);
    setMessage(
      "Look at the words.\nYou'll read them soon — left to right, top to bottom"
    );
    setShowCountdown(false);
    setCount(3);
    setShowFinalWords(false);
    setCompletedAllSets(false);
    setShowResults(false);
    setTimer(45);
    setWordsAttempted(0);
    setWordsPerMinute(0);
    setHandPosition({ x: 0, y: 0 });
    setLoading(false);
    setCompleted(false);
    setRecordedAudioBlob(null);
    setTranscripts("");
    setStartTime(null);
    setTotalSec(null);
    setFinalTranscript("");

    // Reset refs
    transcriptRef.current = "";
    chunksRef.current = [];
    shouldBeListeningRef.current = false;
    recognitionStartedRef.current = false;
    retryCountRef.current = 0;
    isRestartingRef.current = false;

    // Stop any existing speech recognition and reset transcript
    try {
      if (listening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      resetTranscript();
    } catch (error) {
      // Ignore errors during cleanup
      console.log("ℹ️ Error during TowreFlow reset:", error);
    }

    console.log(
      "🔄 TowreFlow component mounted - state reset to initial values"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount (listening and resetTranscript are stable)

  // Check browser support on mount
  useEffect(() => {
    console.log(
      "🔍 Browser supports speech recognition:",
      browserSupportsSpeechRecognition
    );
    if (!browserSupportsSpeechRecognition) {
      console.error("❌ Speech recognition is not supported in this browser!");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    let interval;
    if (showFinalWords && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (showResults) {
            clearInterval(interval);
            return prevTimer;
          }

          if (prevTimer <= 1) {
            const endTime = Date.now();
            const elapsedSeconds = (endTime - startTime) / 1000;
            //console.log("testingg");
            setTotalSec(elapsedSeconds);
            clearInterval(interval);
            setShowResults(true);
            // Defer stopAudioRecording to avoid React warning about updating during render
            setTimeout(() => {
              stopAudioRecording();
              setLoading(true);
            }, 0);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showFinalWords, timer]);

  useEffect(() => {
    if (!showFinalWords && !showCountdown && !showResults) {
      const interval = setInterval(() => {
        setHandPosition((prev) => ({
          x: prev.x === 10 ? -10 : 10,
          y: 0,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showFinalWords, showCountdown, showResults]);

  const handleNext = () => {
    if (activeSet === 0) {
      setMessage("Here come your next words!");
      setActiveSet(1);
    } else if (activeSet === 1) {
      setMessage("Great job! Here come your next words.");
      setActiveSet(2);
    } else if (activeSet === 2) {
      setMessage(
        "You'll go to the next set of words, when you click the button below."
      );
      setActiveSet(3);
    } else if (activeSet === 3) {
      setMessage(
        "If you are not able to speak a word, You can move to the next word."
      );
      setActiveSet(4);
    } else if (activeSet === 4) {
      isMobile
        ? setMessage("Are You Ready? You'll have 45 seconds.")
        : setMessage("Are You Ready?⏱️ You'll have 45 seconds.");
      setActiveSet(5);
    } else if (activeSet === 5) {
      startCountdown();
    }
  };

  const handleNextWordSet = () => {
    if (currentWordSetIndex < allWordSets.length - 1) {
      setCurrentWordSetIndex(currentWordSetIndex + 1);
      setActiveSet(0);
      setMessage("Read the words out\nloud one by one!\nStart from top left");
    } else {
      const endTime = Date.now();
      const elapsedSeconds = (endTime - startTime) / 1000;
      setTotalSec(elapsedSeconds);
      setCompletedAllSets(true);
      setShowResults(true);
      // Defer stopAudioRecording to avoid React warning about updating during render
      setTimeout(() => {
        stopAudioRecording();
        setLoading(true);
      }, 0);
    }
  };

  const startCountdown = async () => {
    // Start countdown immediately - no delay needed since countdown provides timing
    setShowCountdown(true);

    // Start countdown
    let counter = 3;
    setCount(counter);
    const interval = setInterval(() => {
      if (counter > 1) {
        counter--;
        setCount(counter);
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          setShowCountdown(false);
          setShowFinalWords(true);
          setTimer(45);
          setStartTime(Date.now());

          const wpm = Math.round((wordsAttempted / 45) * 60);
          setWordsPerMinute(wpm);

          // Start speech recognition after countdown completes
          // Check browser support before starting
          if (!browserSupportsSpeechRecognition) {
            console.error(
              "❌ Cannot start speech recognition: Browser does not support it"
            );
            return;
          }

          // Check microphone permission
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            stream.getTracks().forEach((track) => track.stop()); // Stop immediately, we just needed permission
            console.log("✅ Microphone permission granted");
          } catch (error) {
            console.error("❌ Microphone permission denied or error:", error);
            alert(
              "Microphone access is required for speech recognition. Please allow microphone access and try again."
            );
            return;
          }

          // Start audio recording
          await startAudioRecording();

          // Reset transcript before starting
          resetTranscript();
          transcriptRef.current = "";

          console.log(
            "🎤 Starting speech recognition, language:",
            getBrowserLanguage(lang)
          );

          try {
            shouldBeListeningRef.current = true;
            retryCountRef.current = 0; // Reset retry count when starting fresh
            isRestartingRef.current = false; // Reset restart flag
            recognitionStartedRef.current = false; // Reset start flag

            // Always stop first if listening to ensure clean state
            // This prevents conflicts from previous sessions
            if (listening && recognitionRef.current) {
              try {
                console.log(
                  "🛑 Stopping existing recognition for clean restart"
                );
                recognitionRef.current.stop();
                // Wait for clean stop before starting again
                await new Promise((resolve) => setTimeout(resolve, 500));
              } catch (stopError) {
                console.log(
                  "ℹ️ Error stopping recognition (may already be stopped):",
                  stopError
                );
              }
            }

            // Reset transcript before starting fresh
            resetTranscript();
            transcriptRef.current = "";

            // Start recognition with a small delay to ensure clean state
            await new Promise((resolve) => setTimeout(resolve, 200));

            if (recognitionRef.current) {
              recognitionRef.current.lang = getBrowserLanguage(lang);
              recognitionRef.current.start();
              console.log("✅ Speech recognition start command sent");
            } else {
              console.error("❌ Recognition instance not initialized");
            }

            // Don't access the recognition instance - let the library handle everything
            // Accessing it can interfere with the library's internal handlers and prevent transcript updates
            // We'll rely on the listening state and transcript from the hook instead

            // Note: We don't check listening state here because it uses stale closure values
            // The listening state will be tracked by the useEffect that watches listening changes
            recognitionStartedRef.current = true;
          } catch (error) {
            console.error("❌ Error starting speech recognition:", error);
            shouldBeListeningRef.current = false;
          }
        }, 500);
      }
    }, 1000);
  };

  const resetActivity = () => {
    setCurrentWordSetIndex(0);
    setShowFinalWords(false);
    setActiveSet(0);
    setMessage("Read the words out\nloud one by one!\nStart from top left");
    setCompletedAllSets(false);
    setShowResults(false);
    setTimer(45);
    setWordsAttempted(0);
    setWordsPerMinute(0);
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .split(/\s+/);

  const getPhonetic = (word) => doubleMetaphone(word)[0];

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

  const startAudioRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        chunksRef.current = [];

        streamRef.current?.getTracks().forEach((track) => track.stop());

        // Validate audio blob before processing
        if (!audioBlob || audioBlob.size === 0) {
          setTranscripts(transcriptRef.current || "");
          const transcriptWords = normalize(transcriptRef.current || "").filter(
            (w) => w && w.trim().length > 0
          );
          const transcriptPhonetics = new Set(
            transcriptWords.map(getPhonetic).filter((ph) => ph && ph.length > 0)
          );

          allWords.forEach((word) => {
            const lower = word?.title?.toLowerCase()?.trim();

            if (!lower || lower.length === 0) {
              word.isCorrect = false;
              return;
            }

            const wordPhonetic = getPhonetic(lower);
            const hasValidPhonetic = wordPhonetic && wordPhonetic.length > 0;

            const isSpoken =
              transcriptWords.includes(lower) ||
              (hasValidPhonetic && transcriptPhonetics.has(wordPhonetic));

            word.isCorrect = isSpoken;
          });

          setLoading(false);
          setCompleted(true);
          return;
        }

        // Check minimum audio size (at least 1KB to ensure valid audio)
        const MIN_AUDIO_SIZE = 1024; // 1KB minimum
        if (audioBlob.size < MIN_AUDIO_SIZE) {
          console.warn(
            `Audio blob too small (${audioBlob.size} bytes), using fallback transcription`
          );
          setTranscripts(transcriptRef.current || "");
          const transcriptWords = normalize(transcriptRef.current || "").filter(
            (w) => w && w.trim().length > 0
          );
          const transcriptPhonetics = new Set(
            transcriptWords.map(getPhonetic).filter((ph) => ph && ph.length > 0)
          );

          allWords.forEach((word) => {
            const lower = word?.title?.toLowerCase()?.trim();

            if (!lower || lower.length === 0) {
              word.isCorrect = false;
              return;
            }

            const wordPhonetic = getPhonetic(lower);
            const hasValidPhonetic = wordPhonetic && wordPhonetic.length > 0;

            const isSpoken =
              transcriptWords.includes(lower) ||
              (hasValidPhonetic && transcriptPhonetics.has(wordPhonetic));

            word.isCorrect = isSpoken;
          });

          setLoading(false);
          setCompleted(true);
          return;
        }

        // Use browser speech recognition as primary method (it's already working!)
        // Browser SR captures transcript in real-time during recording via transcriptRef.current
        setLoading(true);

        // Get transcript from browser speech recognition (already captured during recording)
        const transcripts = transcriptRef.current || "";
        setTranscripts(transcripts);
        const transcriptWords = normalize(transcripts).filter(
          (w) => w && w.trim().length > 0
        ); // Filter out empty strings
        const transcriptPhonetics = new Set(
          transcriptWords.map(getPhonetic).filter((ph) => ph && ph.length > 0) // Filter out empty phonetic codes
        );

        allWords.forEach((word) => {
          const lower = word?.title?.toLowerCase()?.trim();

          // Skip empty or invalid words
          if (!lower || lower.length === 0) {
            word.isCorrect = false;
            return;
          }

          // Get phonetic code for the word (only if valid)
          const wordPhonetic = getPhonetic(lower);
          const hasValidPhonetic = wordPhonetic && wordPhonetic.length > 0;

          // Match only if:
          // 1. Exact match in transcript words, OR
          // 2. Phonetic match (only if both have valid phonetic codes)
          const isSpoken =
            transcriptWords.includes(lower) ||
            (hasValidPhonetic && transcriptPhonetics.has(wordPhonetic));

          word.isCorrect = isSpoken;
        });

        // Try to upload audio and save record (non-blocking - continue even if it fails)
        if (audioBlob && audioBlob.size > 0) {
          try {
            const base64Audio = await blobToBase64(audioBlob);

            const sessionId = getLocalData("sessionId");
            var audioFileName = "";
            let getContentId = "towre";
            audioFileName = `${
              process.env.REACT_APP_CHANNEL
            }/${sessionId}-${Date.now()}-${getContentId}.wav`;

            const command = new PutObjectCommand({
              Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
              Key: audioFileName,
              Body: Uint8Array.from(window.atob(base64Audio), (c) =>
                c.charCodeAt(0)
              ),
              ContentType: "audio/wav",
            });

            try {
              await S3Client.send(command);
            } catch (uploadErr) {
              // S3 upload failed (non-critical) - continue
            }

            try {
              await addTowreRecord(audioFileName, allWords, lang);
            } catch (apiErr) {
              // Error saving TOWRE record (non-critical) - continue
            }
          } catch (processErr) {
            // Error processing audio for upload (non-critical) - continue
            // Continue even if audio processing fails
          }
        }

        setLoading(false);
        setCompleted(true);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("🚨 Error starting audio recording:", error);
    }
  };

  const stopAudioRecording = () => {
    shouldBeListeningRef.current = false;
    retryCountRef.current = 0; // Reset retry count when stopping
    isRestartingRef.current = false; // Reset restart flag

    // Clear any pending retry timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Clear debounce timeout
    if (restartDebounceRef.current) {
      clearTimeout(restartDebounceRef.current);
      restartDebounceRef.current = null;
    }

    console.log(
      "🛑 Stopping speech recognition, final transcript:",
      transcriptRef.current
    );
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setFinalTranscript(transcriptRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  if (showResults && !loading) {
    return (
      <CombinedReportPage
        currentWordSetIndex={currentWordSetIndex}
        wordsAttempted={wordsAttempted}
        onReset={resetActivity}
        allWords={allWords}
        transcript={transcripts}
        totalSec={totalSec}
        wpm={vocabCount}
      />
    );
  }

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m8"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      fluency={false}
      lang={lang}
      //={recAudio}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress: false, // Hide progress bar for Towre Flow
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
          //backgroundColor: "#dff3fc",
          //minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!loading && isStarted && (
          <div
            style={{
              width: "95%",
              maxWidth: 1150,
              background: "#fff",
              borderRadius: 20,
              padding: "0 20px",
              position: "relative",
              overflow: "hidden",
              height: "530px",
            }}
          >
            {showCountdown && !loading ? (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px 0",
                }}
              >
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: "bold",
                      color: "#1d3557",
                    }}
                  >
                    Get ready to read the words!
                  </div>
                  <div style={{ fontSize: 16, color: "#444", marginTop: 6 }}>
                    Read the words out loud as fast as you can in 45 seconds.
                  </div>
                </div>

                <div style={{ flex: 1 }}></div>

                <div style={{ position: "relative", height: 180 }}>
                  <div
                    style={{
                      position: "absolute",
                      bottom: isMobile ? 150 : 116,
                      right: isMobile ? 140 : 237,
                      width: isMobile ? 150 : 183,
                      height: isMobile ? 100 : 120,
                    }}
                  >
                    <img
                      src={timerBoxImg}
                      alt="timerBox"
                      style={{ width: "100%", height: "100%" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "35%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 14,
                          fontWeight: "bold",
                        }}
                      >
                        Starts In
                      </div>
                      <div
                        style={{
                          fontSize: isMobile ? 24 : 28,
                          fontWeight: "bold",
                          color: "#ff6e00",
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>

                  <img
                    src={pandaTimerImg}
                    alt="panda"
                    style={{
                      height: isMobile ? 150 : 180,
                      position: "absolute",
                      right: 100,
                      bottom: 20,
                    }}
                  />
                </div>
              </div>
            ) : completedAllSets && !loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{ fontSize: 28, color: "#1d3557", marginBottom: 20 }}
                >
                  Activity Completed!
                </h2>
                <p style={{ fontSize: 18, marginBottom: 30 }}>
                  You've gone through all the word sets.
                </p>
                <button
                  onClick={() => setShowResults(true)}
                  style={{
                    backgroundColor: "#ff6e00",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 20,
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  View Results
                </button>
              </div>
            ) : showFinalWords && !loading ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={clockImg}
                      alt="clock"
                      style={{ width: isMobile ? 50 : 60 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {timer}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFDBDB",
                    borderRadius: 30,
                    padding: isMobile ? "6px 18px" : "6px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    position: "absolute",
                    right: 10,
                    top: 10,
                  }}
                >
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{
                      width: isMobile ? 12 : 14,
                      height: isMobile ? 12 : 14,
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#d00",
                      fontSize: isMobile ? 12 : 14,
                    }}
                  >
                    Recording
                  </span>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {currentWordSet.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: isMobile ? 7 : 5,
                        marginLeft: isMobile ? "2px" : "40px",
                        marginRight: isMobile ? "2px" : "40px",
                      }}
                    >
                      {row.map((wordObj, colIndex) => (
                        <div
                          key={colIndex}
                          style={{
                            position: "relative",
                            width: 180,
                            height: 85,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={boxImg}
                            alt="box"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              opacity: 1,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              fontWeight: 700,
                              fontSize:
                                lang === "te"
                                  ? isMobile
                                    ? 14
                                    : 24
                                  : isMobile
                                  ? 12
                                  : 20,
                              fontFamily: getFontFamily(lang),
                            }}
                          >
                            {wordObj.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: location.pathname.includes("/towre-flow") ? 55 : 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={handleNextWordSet}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <img src={nextImg} alt="next" style={{ width: 60 }} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "#FFDBDB",
                    borderRadius: 30,
                    padding: "6px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 2 : 10,
                    position: "absolute",
                    right: isMobile ? 4 : 20,
                    top: 20,
                  }}
                >
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{ width: 14, height: 14 }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#d00",
                      fontSize: isMobile ? 11 : 14,
                    }}
                  >
                    Recording
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={clockImg}
                      alt="clock"
                      style={{ width: isMobile ? 50 : 60 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      45
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {currentWordSet.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 6,
                        marginLeft: "40px",
                        marginRight: "40px",
                        position: "relative",
                      }}
                    >
                      {row.map((wordObj, colIndex) => {
                        const isActive =
                          activeSet < currentWordSet.length &&
                          rowIndex === activeSet;
                        const boxImage = isActive ? activeboxImg : boxImg;

                        return (
                          <div
                            key={colIndex}
                            style={{
                              position: "relative",
                              width: isMobile ? 200 : 180,
                              height: 100,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 10,
                            }}
                          >
                            {isActive && colIndex === 0 && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: -20,
                                  left: "29%",
                                  transform: `translateX(-50%) translate(${handPosition.x}px, ${handPosition.y}px)`,
                                  transition: "transform 0.3s ease",
                                  zIndex: 10,
                                }}
                              >
                                <img
                                  src={handImg}
                                  alt="hand"
                                  style={{
                                    width: 40,
                                    height: 40,
                                    filter:
                                      "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
                                  }}
                                />
                              </div>
                            )}
                            <img
                              src={boxImage}
                              alt="box"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                opacity: 1,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                color: isActive ? "#000" : "#aaa",
                                fontWeight: 600,
                                fontSize:
                                  lang === "te"
                                    ? isMobile
                                      ? 13
                                      : 24
                                    : isMobile
                                    ? 11
                                    : 20,
                                fontFamily: getFontFamily(lang),
                              }}
                            >
                              {wordObj.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 30,
                    right: 20,
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Message Bubble */}
                  <div
                    style={{
                      position: "relative",
                      width: isMobile ? "220px" : "250px",
                      height: isMobile ? "220px" : "180px",
                      marginRight: 10,
                      transform: "translateY(-40%)",
                    }}
                  >
                    <img
                      src={initialMessageBoxImg}
                      alt="message box"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: "absolute",
                      }}
                    />

                    {/* Hide arrow for this specific message */}
                    {message !==
                      "You'll go to the next set of words when you click the button below." &&
                      message !==
                        "If you are not able to speak a word, You can move to the next word." && (
                        <img
                          src={arrowImg}
                          alt="arrow"
                          style={{
                            width: isMobile ? "50px" : "80px",
                            position: "absolute",
                            top: "15px",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        />
                      )}

                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "pre-line",
                          fontSize: isMobile ? "11px" : "14px",
                          marginBottom: "15px",
                          lineHeight: "1.5",
                          color: "#333F61",
                          fontFamily: "Quicksand",
                          fontWeight: 600,
                        }}
                      >
                        {message}
                      </div>

                      {message ===
                      "You'll go to the next set of words\nwhen you click the button below." ? (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -30,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {/* <img
            src={handImg}
            alt="hand"
            style={{
              width: 40,
              height: 40,
              filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
              transform: "rotate(-30deg)",
            }}
          /> */}
                          <button
                            onClick={handleNext}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={Assets.startNewButtonImg}
                              alt="next"
                              style={{ width: isMobile ? "30px" : 60 }}
                            />
                          </button>
                        </div>
                      ) : message ===
                        "Are You Ready?⏱️ You'll have 45 seconds." ? (
                        <img
                          src={Assets.startNewButtonImg}
                          alt="start"
                          style={{
                            width: isMobile ? "30px" : "60px",
                            cursor: "pointer",
                          }}
                          onClick={startCountdown}
                        />
                      ) : (
                        <img
                          src={Assets.startNewButtonImg}
                          alt="next"
                          style={{
                            height: isMobile ? "30px" : "45px",
                            cursor: "pointer",
                          }}
                          onClick={handleNext}
                        />
                      )}
                    </div>
                  </div>

                  {/* Panda (stays in original position) */}
                  <img
                    src={pandaImg}
                    alt="panda"
                    style={{
                      height: isMobile ? 120 : 150,
                      marginBottom: "-15px",
                    }}
                  />
                </div>
                {message ===
                  "You'll go to the next set of words\nwhen you click the button below." && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      zIndex: 10,
                    }}
                  >
                    <img
                      src={handImg}
                      alt="hand"
                      style={{
                        width: 30,
                        height: 30,
                        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
                        transform: "rotate(0deg)",
                      }}
                    />
                    <button
                      onClick={handleNext}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={nextImg} alt="next" style={{ width: 40 }} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {!isStarted && (
          <div
            style={{
              width: "95%",
              maxWidth: 1150,
              backgroundImage: `url(${Assets.yellowLightImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 20,
              padding: "0 20px",
              position: "relative",
              overflow: "hidden",
              height: "530px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Assets.confettiImg}
              alt="Confetti"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 500,
                pointerEvents: "none",
              }}
            />

            <div style={{ textAlign: "center", zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: "Quicksand",
                  fontWeight: 1200,
                  fontSize: "54px",
                  lineHeight: "60px",
                  textAlign: "center",
                  color: "#FF9050",
                  marginBottom: "20px",
                }}
              >
                Towre Flow
              </h2>
              <img
                src={Assets.birthdayBoxImg}
                alt="Birthday Box"
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  marginBottom: "10px",
                }}
              />
              <img
                src={Assets.startButtonImg}
                alt="Start Button"
                style={{ maxWidth: "180px", width: "100%", cursor: "pointer" }}
                onClick={() => {
                  setIsStarted(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

// Memoize TowreFlow to prevent unnecessary re-renders
// Only re-render when props that affect speech recognition or component behavior change
// Note: Internal state changes (like transcript from useSpeechRecognition) will still trigger re-renders
const TowreFlowMemo = memo(TowreFlow, (prevProps, nextProps) => {
  // Props that should trigger re-render
  const criticalProps = [
    "level",
    "currentStep",
    "steps",
    "contentId",
    "contentType",
    "enableNext",
    "showTimer",
    "isShowCase",
    "loading",
    "disableScreen",
    "currentImg",
    "parentWords",
    "background",
  ];

  // Check if any critical props changed
  for (const prop of criticalProps) {
    if (prevProps[prop] !== nextProps[prop]) {
      return false; // Re-render
    }
  }

  // Check progressData.currentPracticeStep (the only part we actually use)
  const prevStep = prevProps.progressData?.currentPracticeStep;
  const nextStep = nextProps.progressData?.currentPracticeStep;
  if (prevStep !== nextStep) {
    return false; // Re-render
  }

  // Check function references that might affect behavior
  const functionProps = [
    "handleNext",
    "handleBack",
    "setOpenMessageDialog",
    "playTeacherAudio",
  ];

  for (const prop of functionProps) {
    if (prevProps[prop] !== nextProps[prop]) {
      return false; // Re-render
    }
  }

  // Ignore changes to these props (they change frequently but don't affect speech recognition)
  // vocabCount, wordCount, showProgress (we override it anyway)
  // These can change without causing a re-render
  // NOTE: Internal state from useSpeechRecognition (transcript, listening) will still
  // trigger re-renders because they're managed inside the component, not via props

  return true; // Don't re-render
});

export default TowreFlowMemo;
