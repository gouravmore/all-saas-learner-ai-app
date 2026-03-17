import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ReplayButton } from "../ui/ReplayButton";
import { PlanetIcon } from "../ui/PlanetIcon";
import { ResourceRequirementCard } from "../ui/ResourceRequirementCard";
import { PlanetWithRocketAnimation } from "../PlanetWithRocketAnimation";
import { ArrowLeft, Rocket, Fuel } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { playAudio, playTTS, playSuccessSound, stopAllAudio, attachSlowLoadToast } from "../../utils/audioUtils";
import { LetterLauncherGameCore, type LetterLauncherQuestion } from "./LetterLauncherGameCore";
import { getFuelRequirement, getMissionDestination } from "../../utils/fuelCalculation";
import { playLetterAudio } from "../../utils/letterAudioUtils";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { SpaceBackground } from "../SpaceBackground";

interface LetterLauncherGameStoryPreviewProps {
  onStartGame: () => void;
  onBack: () => void;
  level?: number;
  hideHeader?: boolean;
}

type StoryPhase = 
  | 'intro'           // Captain Rahi introduction
  | 'riloAppears'     // Rilo robot appears and explains mission
  | 'practice1'       // First practice round
  | 'practice2'       // Second practice round
  | 'practice3'       // Third practice round (optional)
  | 'fuelExplanation' // Explain fuel system
  | 'readyToStart';   // Final encouragement

const storyScript = {
  en: {
    intro: {
      narrator: "You are Captain Rahi, a brave little astronaut.",
      rocket: "Your rocket is waiting on the launchpad, shining and humming quietly.",
      destination: "Today, you're going on a space trip",
      planet: "🌙"
    },
    riloAppears: {
      rilo: "Captain Rahi! Our rocket is ready to fly but it needs fuel!",
      fuelRequirement: "We need fuel units to travel through the galaxy.",
      fuelExplanation: "We can make fuel using your super listening ears!",
      gameExplanation: "You'll hear a sound, you'll see a letter, and if they match, we get fuel for the rocket!",
      rocket: "🚀"
    },
    practice: {
      intro: "Let's practice a tiny bit before our real trip!",
      question: "Do they sound the same?",
      controls: "You can choose in your own way!\n\nIf you think they match,\npress ← key.\n\nIf you think they do not match,\npress → key.\n\nOr you can just click the ✓ or ✗ buttons!\n\nWhatever feels easiest,\nyou're the Captain of the rocket!",
      correctFeedback: "Yay! That helped us!",
      wrongFeedback: "It's okay! Let's try again!",
      greatJob: "Great job, Captain Rahi! You're ready!",
      amazing: "You're doing amazing!",
      allReady: "All ready!"
    },
    fuelExplanation: {
      rilo: "Everytime you listen and choose, your rocket gets more fuel! The faster you answer a question, the more fuel you get!",
      fuelMeter: "Let's fill the tank, and explore the galaxy!!"
    },
    readyToStart: {
      rilo: "Are you ready to start your space trip, Captain?",
      button: "🚀 Start Space Trip"
    }
  },
  te: {
    intro: {
      narrator: "మీరు కెప్టెన్ రాహి, ఒక ధైర్యవంతమైన చిన్న అంతరిక్ష యాత్రికుడు!",
      rocket: "మీ రాకెట్ లాంచ్ ప్యాడ్‌లో వేచి ఉంది, మెరుస్తూ మరియు నిశ్శబ్దంగా గుణగుణిస్తూ.",
      destination: "ఈరోజు, మీరు అంతరిక్ష ప్రయాణం చేస్తున్నారు!",
      planet: "🌙"
    },
    riloAppears: {
      rilo: "కెప్టెన్ రాహి! మన రాకెట్ ఫ్లై చేయడానికి సిద్ధంగా ఉంది కానీ దానికి ఇంధనం కావాలి!",
      fuelRequirement: "మనకు గెలాక్సీ ద్వారా ప్రయాణించడానికి ఇంధన యూనిట్‌లు కావాలి.",
      fuelExplanation: "మీ సూపర్ వినే చెవులను ఉపయోగించి మనం ఇంధనాన్ని తయారు చేయవచ్చు!",
      gameExplanation: "మీరు ఒక ధ్వనిని వింటారు, మీరు ఒక అక్షరాన్ని చూస్తారు, మరియు అవి సరిపోతే, మనకు రాకెట్‌కు ఇంధనం లభిస్తుంది!",
      rocket: "🚀"
    },
    practice: {
      intro: "మన నిజమైన ప్రయాణానికి ముందు కొంచెం ప్రాక్టీస్ చేద్దాం!",
      question: "అవి ఒకే ధ్వనిని ఇస్తాయా?",
      controls: "మీరు మీ స్వంత మార్గంలో ఎంచుకోవచ్చు!\n\nమీరు అవి సరిపోతాయని అనుకుంటే,\n← కీ నొక్కండి.\n\nమీరు అవి సరిపోవు అని అనుకుంటే,\n→ కీ నొక్కండి.\n\nలేదా మీరు ✓ లేదా ✗ బటన్‌లను క్లిక్ చేయవచ్చు!\n\nఏది సులభంగా అనిపిస్తుందో,\nమీరు రాకెట్‌కు కెప్టెన్!",
      correctFeedback: "యే! అది మాకు సహాయపడింది!",
      wrongFeedback: "పరవాలేదు! మళ్లీ ప్రయత్నిద్దాం!",
      greatJob: "చాలా బాగుంది, కెప్టెన్ రాహి! మీరు సిద్ధంగా ఉన్నారు!",
      amazing: "మీరు అద్భుతంగా చేస్తున్నారు!",
      allReady: "అన్నీ సిద్ధం!"
    },
    fuelExplanation: {
      rilo: "మీరు ప్రతిసారీ విని ఎంచుకున్నప్పుడు, మీ రాకెట్‌కు మరింత ఇంధనం లభిస్తుంది! మీరు ప్రశ్నకు వేగంగా సమాధానం ఇస్తే, మీకు ఎక్కువ ఇంధనం లభిస్తుంది!",
      fuelMeter: "ట్యాంక్‌ను నింపుదాం, మరియు గెలాక్సీని అన్వేషిద్దాం!!"
    },
    readyToStart: {
      rilo: "మీరు మీ అంతరిక్ష ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా ఉన్నారా, కెప్టెన్?",
      button: "🚀 అంతరిక్ష ప్రయాణం ప్రారంభించండి"
    }
  },
  kn: {
    intro: {
      narrator: "ನೀವು ಕ್ಯಾಪ್ಟನ್ ರಾಣಿ, ಸಾಹಸಿ ಹಾಗೂ ಯುವ ಬಾಹ್ಯಾಕಾಶ ಯಾತ್ರಿ.",
      rocket: "ನಿಮ್ಮ ಹೊಳೆಯುವ ರಾಕೆಟ್ ಲಾಂಚ್ ಪ್ಯಾಡ್‌ನಲ್ಲಿ ಮೌನವಾಗಿ ನಿಮಗಾಗಿ ಕಾಯುತ್ತಿದೆ.",
      destination: "ಇಂದು, ನೀವು ಬಾಹ್ಯಾಕಾಶ ಪ್ರಯಾಣ ಮಾಡುತ್ತೀರಿ!",
      planet: "🌙"
    },
    riloAppears: {
      rilo: "ಕ್ಯಾಪ್ಟನ್ ರಾಣಿ! ನಮ್ಮ ರಾಕೆಟ್ ಹಾರಲು ಸಿದ್ಧವಾಗಿದೆ, ಆದರೆ ಅದಕ್ಕೆ ಇಂಧನ ಬೇಕು!",
      fuelRequirement: "ನಮಗೆ ಗೆಲಾಕ್ಸಿಯ ಮೂಲಕ ಪ್ರಯಾಣಿಸಲು ಇಂಧನದ ಘಟಕಗಳು ಬೇಕು.",
      fuelExplanation: "ಅಕ್ಷರಗಳ ಧ್ವನಿಯನ್ನು ಚೆನ್ನಾಗಿ ಕೇಳುತ್ತ ನೀವು ಇಂಧನವನ್ನು ತಯಾರಿಸಬಹುದು!",
      gameExplanation: "ನೀವು ಮೊದಲು ಒಂದು ಧ್ವನಿ ಕೇಳುವಿರಿ, ಆಮೇಲೆ ಒಂದು ಅಕ್ಷರ ನೋಡುವಿರಿ. ಅವೆರಡೂ ಹೊಂದಿಕೆ ಆಗುತ್ತಾ ಅಥವಾ ಇಲ್ಲವಾ  ಅಂತ ಬೇಗನೆ ಹೇಳಿದ್ರೆ ನಿಮಗೆ ಹೆಚ್ಚು ಇಂಧನ ಸಿಗುತ್ತೆ!",
      rocket: "🚀"
    },
    practice: {
      intro: "ನಿಜವಾದ ಪ್ರಯಾಣ ಶುರು ಮಾಡಕ್ಕೆ ಮೊದಲು ಸ್ವಲ್ಪ ಅಭ್ಯಾಸ ಮಾಡೋಣ!",
      question: "ಅವು ಒಂದೇ ಧ್ವನಿಯನ್ನು ನೀಡುತ್ತವೆಯೇ?",
      controls: "ನಿಮಗೆ ಬೇಕೆನ್ನಿಸಿದಂತೆ ಆಯ್ಕೆ ಮಾಡಬಹುದು!\n\nಧ್ವನಿ ಮತ್ತು ಅಕ್ಷರ ಹೊಂದಿಕೆಯಾಗುತ್ತೆ ಅಂತ ಅನ್ನಿಸಿದರೆ\n← ಕೀಯನ್ನು ಒತ್ತಿ.\n\nಅವು ಹೊಂದಿಕೆ ಆಗುವುದಿಲ್ಲ ಅಂತ ಅನ್ನಿಸಿದರೆ\n→ ಕೀಯನ್ನು ಒತ್ತಿ.\n\nಅಥವಾ ನೀವು ✓ ಅಥವಾ ✗ ಬಟನ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬಹುದು!\n\nನಿಮಗೆ ಸುಲಭವೆಂದು ಅನ್ನಿಸಿದ್ದು ಮಾಡಿ. ನೀವೇ ಈಗ ರಾಕೆಟ್‌ಗೆ ಕ್ಯಾಪ್ಟನ್!",
      correctFeedback: "ಯೇ! ಅದು ನಮಗೆ ಸಹಾಯ ಮಾಡಿತು!",
      wrongFeedback: "ಪರವಾಗಿಲ್ಲ! ಮತ್ತೆ ಪ್ರಯತ್ನಿಸೋಣ!",
      greatJob: "ಉತ್ತಮ ಕೆಲಸ, ಕ್ಯಾಪ್ಟನ್ ರಾಹಿ! ನೀವು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!",
      amazing: "ನೀವು ಅದ್ಭುತವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!",
      allReady: "ಎಲ್ಲವೂ ಸಿದ್ಧವಾಗಿದೆ!"
    },
    fuelExplanation: {
      rilo: "ನೀವು ಪ್ರತಿ ಬಾರಿ ಧ್ವನಿ ಕೇಳಿ ಆಯ್ಕೆ ಮಾಡಿದಾಗ, ನಿಮ್ಮ ರಾಕೆಟ್‌ಗೆ ಹೆಚ್ಚು ಇಂಧನ ಸಿಗುತ್ತದೆ! ನೀವು ಪ್ರಶ್ನೆಗೆ ಬಹಳ ಬೇಗನೆ ಉತ್ತರಿಸಿದರೆ, ನಿಮಗೆ ಹೆಚ್ಚು ಇಂಧನ ಸಿಗುತ್ತದೆ!",
      fuelMeter: "ಈಗ ಟ್ಯಾಂಕ್ ತುಂಬಿಸೋಣ, ಮತ್ತು ಗೆಲಾಕ್ಸಿಯನ್ನು ಅನ್ವೇಷಿಸೋಣ!!"
    },
    readyToStart: {
      rilo: "ನೀವು ಈಗ ಬಾಹ್ಯಾಕಾಶ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಾ, ಕ್ಯಾಪ್ಟನ್?",
      button: "🚀 ಬಾಹ್ಯಾಕಾಶ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ"
    }
  },
  mr: {
    intro: {
      narrator: "तुम्ही कॅप्टन राही आहात, एक धैर्यशील लहान अंतराळ यात्री.",
      rocket: "तुमचा रॉकेट लॉन्च पॅडवर वाट पाहत आहे, चमकत आहे आणि शांतपणे गुणगुणत आहे.",
      destination: "आज, तुम्ही अंतराळ प्रवास करत आहात!",
      planet: "🌙"
    },
    riloAppears: {
      rilo: "कॅप्टन राही! आपला रॉकेट उडण्यासाठी तयार आहे पण त्याला इंधन हवे आहे!",
      fuelRequirement: "आपल्याला गॅलॅक्सीमधून प्रवास करण्यासाठी इंधन युनिट्स हवे आहेत.",
      fuelExplanation: "तुमच्या सुपर ऐकणाऱ्या कानांचा वापर करून आपण इंधन बनवू शकतो!",
      gameExplanation: "तुम्ही एक आवाज ऐकाल, तुम्ही एक अक्षर पाहाल, आणि जर ते जुळत असतील, आपल्याला रॉकेटसाठी इंधन मिळेल!",
      rocket: "🚀"
    },
    practice: {
      intro: "आपल्या खऱ्या प्रवासापूर्वी थोडे सराव करूया!",
      question: "ते समान आवाज देतात का?",
      controls: "तुम्ही तुमच्या स्वतःच्या मार्गाने निवडू शकता!\n\nजर तुम्हाला वाटत असेल की ते जुळतात,\n← की दाबा.\n\nजर तुम्हाला वाटत असेल की ते जुळत नाहीत,\n→ की दाबा.\n\nकिंवा तुम्ही फक्त ✓ किंवा ✗ बटणे क्लिक करू शकता!\n\nजे सर्वात सोपे वाटते,\nतुम्ही रॉकेटचे कॅप्टन आहात!",
      correctFeedback: "होय! त्याने आम्हाला मदत केली!",
      wrongFeedback: "ठीक आहे! पुन्हा प्रयत्न करूया!",
      greatJob: "छान काम, कॅप्टन राही! तुम्ही तयार आहात!",
      amazing: "तुम्ही खूप छान करत आहात!",
      allReady: "सर्व तयार!"
    },
    fuelExplanation: {
      rilo: "जेव्हा तुम्ही ऐकता आणि निवडता, तेव्हा तुमच्या रॉकेटला अधिक इंधन मिळते! तुम्ही प्रश्नाला जितक्या वेगाने उत्तर द्याल, तितके अधिक इंधन मिळेल!",
      fuelMeter: "टँक भरूया, आणि गॅलॅक्सीचा शोध घेऊया!!"
    },
    readyToStart: {
      rilo: "तुम्ही तुमचा अंतराळ प्रवास सुरू करण्यासाठी तयार आहात, कॅप्टन?",
      button: "🚀 अंतराळ प्रवास सुरू करा"
    }
  },
  hi: {
    intro: {
      narrator: "तुम कैप्टन राही हो, एक बहादुर छोटे अंतरिक्ष यात्री।",
      rocket: "तुम्हारा रॉकेट लॉन्च पैड पर इंतजार कर रहा है, चमक रहा है और धीरे-धीरे गुनगुना रहा है।",
      destination: "आज, तुम अंतरिक्ष की यात्रा पर जा रहे हो!",
      planet: "🌙"
    },
    riloAppears: {
      rilo: "कैप्टन राही! हमारा रॉकेट उड़ने के लिए तैयार है लेकिन इसे ईंधन चाहिए!",
      fuelRequirement: "हमें आकाशगंगा में यात्रा करने के लिए ईंधन यूनिट्स चाहिए।",
      fuelExplanation: "हम तुम्हारे सुपर सुनने वाले कानों का उपयोग करके ईंधन बना सकते हैं!",
      gameExplanation: "तुम एक आवाज़ सुनोगे, तुम एक अक्षर देखोगे, और अगर वे मेल खाते हैं, तो हमें रॉकेट के लिए ईंधन मिलेगा!",
      rocket: "🚀"
    },
    practice: {
      intro: "चलो असली यात्रा से पहले थोड़ा अभ्यास करते हैं!",
      question: "क्या ये एक जैसे लगते हैं?",
      controls: "तुम अपने तरीके से चुन सकते हो!\n\nअगर तुम्हें लगता है कि वे मेल खाते हैं,\n← की दबाओ।\n\nअगर तुम्हें लगता है कि वे मेल नहीं खाते,\n→ की दबाओ।\n\nया तुम बस ✓ या ✗ बटन पर क्लिक कर सकते हो!\n\nजो भी सबसे आसान लगे,\nतुम रॉकेट के कैप्टन हो!",
      correctFeedback: "वाह! इसने हमारी मदद की!",
      wrongFeedback: "कोई बात नहीं! फिर से कोशिश करते हैं!",
      greatJob: "बहुत बढ़िया, कैप्टन राही! तुम तैयार हो!",
      amazing: "तुम बहुत अच्छा कर रहे हो!",
      allReady: "सब तैयार!"
    },
    fuelExplanation: {
      rilo: "हर बार जब तुम सुनते हो और चुनते हो, तुम्हारे रॉकेट को और ईंधन मिलता है! जितनी जल्दी तुम जवाब दोगे, उतना ज्यादा ईंधन मिलेगा!",
      fuelMeter: "चलो टैंक भरते हैं, और आकाशगंगा की खोज करते हैं!!"
    },
    readyToStart: {
      rilo: "क्या तुम अपनी अंतरिक्ष यात्रा शुरू करने के लिए तैयार हो, कैप्टन?",
      button: "🚀 अंतरिक्ष यात्रा शुरू करो"
    }
  }
};

export function LetterLauncherGameStoryPreview({ 
  onStartGame, 
  onBack,
  level = 1,
  hideHeader = false
}: LetterLauncherGameStoryPreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [storyPhase, setStoryPhase] = useState<StoryPhase>('intro');
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [showRilo, setShowRilo] = useState(false);
  const [showRahi, setShowRahi] = useState(true);
  const [practiceRound, setPracticeRound] = useState(0);
  const [practiceQuestion, setPracticeQuestion] = useState<LetterLauncherQuestion | null>(null);
  const [showPracticeLetter, setShowPracticeLetter] = useState(false);
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState<boolean | null>(null);
  const [showPracticeFeedback, setShowPracticeFeedback] = useState(false);
  const [isPracticeCorrect, setIsPracticeCorrect] = useState(false);
  const [showControlsInstruction, setShowControlsInstruction] = useState(false);
  const [controlsInstructionComplete, setControlsInstructionComplete] = useState(false);
  const [highlightLeftButton, setHighlightLeftButton] = useState(false);
  const [highlightRightButton, setHighlightRightButton] = useState(false);
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0); // Track which speech bubble to show
  const [visibleSpeechBubbles, setVisibleSpeechBubbles] = useState<number[]>([]); // Track visible bubbles
  const [showPracticeCompletionMessage, setShowPracticeCompletionMessage] = useState(false);
  const [practiceCompletionText, setPracticeCompletionText] = useState('');
  const [successfulPracticeAttempts, setSuccessfulPracticeAttempts] = useState(0); // Track successful attempts
  const [showPracticeIntro, setShowPracticeIntro] = useState(false); // Track practice intro message
  const [showFuelFlashMessages, setShowFuelFlashMessages] = useState(false); // Track fuel flash messages
  const [visibleFlashNumber, setVisibleFlashNumber] = useState<number | null>(null); // Track which flash number to show: 5, 3, or 1
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false); // Track if autoplay is blocked
  const [isWaitingForInteraction, setIsWaitingForInteraction] = useState(false); // Track if we're waiting for user interaction
  
  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const story = storyScript[contentLanguage] || storyScript.en;
  const requiredFuel = getFuelRequirement(level);
  const missionDestination = getMissionDestination(level);

  // Generate practice questions
  const generatePracticeQuestion = (): LetterLauncherQuestion => {
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (contentLanguage === 'en' || contentLanguage === 'te' || contentLanguage === 'mr' || contentLanguage === 'kn') 
        ? contentLanguage 
        : 'en';
    
    const lettersToUse = memoryGameDataLoader.getLetters(supportedLanguage, 'basic');
    if (lettersToUse.length === 0) {
      // Fallback
      return {
        audioLetter: 'A',
        displayedLetter: 'A',
        isMatch: true,
        complexity: 'basic',
        language: contentLanguage
      };
    }

    const audioLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
    const isMatch = Math.random() < 0.5;
    const displayedLetter = isMatch 
      ? audioLetter 
      : lettersToUse.filter(l => l !== audioLetter)[Math.floor(Math.random() * (lettersToUse.length - 1))] || audioLetter;

    return {
      audioLetter,
      displayedLetter,
      isMatch,
      complexity: 'basic',
      language: contentLanguage
    };
  };

  // Audio file mapping for story narration
  const storyAudioMap: Record<string, string> = {
    // Intro phase
    [story.intro.narrator]: 'intro_narrator.wav',
    [story.intro.rocket]: 'intro_rocket.wav',
    [story.intro.destination]: 'intro_destination.wav',
    // Rilo appears phase
    [story.riloAppears.rilo]: 'rilo_appears.wav',
    [story.riloAppears.fuelRequirement]: 'fuel_requirement.wav',
    [story.riloAppears.fuelExplanation]: 'fuel_explanation.wav',
    [story.riloAppears.gameExplanation]: 'game_explanation.wav',
    // Practice phase
    [story.practice.intro]: 'practice_intro.wav',
    [story.practice.question]: 'practice_question.wav',
    [story.practice.controls]: 'practice_controls.wav',
    [story.practice.correctFeedback]: 'correct_feedback.wav',
    [story.practice.wrongFeedback]: 'wrong_feedback.wav',
    [story.practice.greatJob]: 'great_job.wav',
    [story.practice.amazing]: 'amazing.wav',
    [story.practice.allReady]: 'all_ready.wav',
    // Fuel explanation phase
    [story.fuelExplanation.rilo]: 'fuel_rilo.wav',
    [story.fuelExplanation.fuelMeter]: 'fuel_meter.wav',
    // Ready to start phase
    [story.readyToStart.rilo]: 'ready_to_start.wav',
  };

  // Reference to current audio element for cleanup
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  // Reference to track if we're in a replay operation to prevent double audio
  const isReplayingRef = useRef(false);
  // Reference to track if narration is actually playing (more reliable than state)
  const isPlayingNarrationRef = useRef(false);

  // Play audio file from public folder
  const playAudioFile = async (filename: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audioPath = `/audio/audio-preview/combined-letter-games/letter-launcher-story/${audioLanguage}/${filename}`;
      const audio = new Audio(audioPath);
      // attach the slow audio toast
      attachSlowLoadToast(audio);
      currentAudioRef.current = audio;
      
      let resolved = false;
      let audioStarted = false;
      
      const cleanup = () => {
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
        audio.onloadeddata = null;
        audio.oncanplay = null;
        audio.onplay = null;
        audio.onended = null;
        audio.onerror = null;
      };
      
      // Timeout to prevent hanging if audio never loads (15 seconds)
      // BUT: if audio has started playing, don't timeout - wait for it to finish
      const timeout = setTimeout(() => {
        if (!resolved) {
          // Check if audio is actually playing (check both flag and actual audio state)
          // This handles race conditions where audio might be playing but flag not set yet
          const isActuallyPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
          if (audioStarted || isActuallyPlaying) {
            // Audio is playing or about to play, so wait for it to finish naturally
            // Don't resolve yet, let the onended handler handle it
            // But set up a longer safety timeout in case audio never ends
            setTimeout(() => {
              if (!resolved) {
                resolved = true;
                console.warn(`Audio playback extended timeout: ${audioPath}`);
                cleanup();
                resolve(true); // Resolve as true since audio was playing
              }
            }, 30000); // Additional 30 seconds for audio to finish
            return;
          }
          // Audio hasn't started, so it's a real timeout
          resolved = true;
          console.warn(`Audio load timeout: ${audioPath}`);
          audio.pause();
          audio.currentTime = 0;
          cleanup();
          resolve(false);
        }
      }, 15000);
      
      const tryPlay = () => {
        if (resolved) return;
        audio.play().then(() => {
          audioStarted = true;
          // Set up ended handler
          audio.onended = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              cleanup();
              resolve(true);
            }
          };
          // Set up error handler for playback errors
          audio.onerror = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              console.warn(`Audio play failed: ${audioPath}`);
              cleanup();
              resolve(false);
            }
          };
        }).catch((error) => {
          if (!resolved) {
            // Check if error is due to autoplay policy (user interaction required)
            const isAutoplayError = error.name === 'NotAllowedError' || 
                                   (error as Error).message?.includes('user didn\'t interact') ||
                                   (error as Error).message?.includes('play() failed');
            
            if (isAutoplayError) {
              // Set flag to indicate we need user interaction
              setNeedsUserInteraction(true);
              setIsWaitingForInteraction(true);
              
              // Store audio reference for retry after interaction
              // Don't cleanup yet - we'll retry after user interaction
              // Resolve as false so playNarration can handle the retry
              resolved = true;
              clearTimeout(timeout);
              // Don't cleanup - keep audio reference for retry
              resolve(false);
              return;
            }
            
            // Other errors - resolve as false
            resolved = true;
            clearTimeout(timeout);
            console.warn(`Audio play failed: ${audioPath}`, error);
            cleanup();
            resolve(false);
          }
        });
      };
      
      // Wait for audio data to load before playing
      audio.onloadeddata = () => {
        if (resolved) return;
        tryPlay();
      };
      
      // Also listen for canplay event as fallback (some browsers fire this instead)
      audio.oncanplay = () => {
        if (!audioStarted && !resolved) {
          tryPlay();
        }
      };
      
      // Track when audio actually starts playing
      audio.onplay = () => {
        audioStarted = true;
        // Clear the timeout since audio has started - it will finish naturally
        clearTimeout(timeout);
      };
      
      // Handle loading errors
      audio.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          console.warn(`Audio file not found or failed to load: ${audioPath}`);
          cleanup();
          resolve(false);
        }
      };
      
      // Explicitly start loading the audio
      audio.load();
    });
  };

  // Wait for speech synthesis voices to load (important for refresh)
  const waitForVoices = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      
      // Check if voices are already loaded
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }
      
      // Wait for voiceschanged event
      const onVoicesChanged = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          speechSynthesis.onvoiceschanged = null;
          resolve();
        }
      };
      
      // Remove any existing listener first
      if (speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = null;
      }
      
      speechSynthesis.onvoiceschanged = onVoicesChanged;
      
      // Trigger voices check (some browsers need this)
      speechSynthesis.getVoices();
      
      // Fallback timeout in case voiceschanged never fires
      setTimeout(() => {
        if (speechSynthesis.onvoiceschanged === onVoicesChanged) {
          speechSynthesis.onvoiceschanged = null;
        }
        resolve(); // Resolve even if no voices found to prevent hanging
      }, 2000);
    });
  };

  // Fallback to Web Speech API
  const playWebSpeechFallback = async (text: string): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Wait for voices to load (important for refresh)
    await waitForVoices();

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = audioLanguage === 'te' ? 'te-IN' : 
                      audioLanguage === 'kn' ? 'kn-IN' : 
                      audioLanguage === 'mr' ? 'mr-IN' : 
                      audioLanguage === 'hi' ? 'hi-IN' : 'en-US';
      
      // Child-friendly speech rates (slower for clarity)
      switch (audioLanguage) {
        case 'te':
        case 'kn':
        case 'mr':
        case 'hi':
          utterance.rate = 0.75;
          utterance.pitch = 0.95;
          utterance.volume = 1.0;
          break;
        default:
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
      }

      // Try to find the best voice
      const voices = speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => voice.lang === utterance.lang);
      
      if (!selectedVoice) {
        const langCode = utterance.lang.split('-')[0];
        selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      speechSynthesis.speak(utterance);
    });
  };

  // Play narration - tries audio file first, falls back to Web Speech API
  const playNarration = async (text: string) => {
    // Cancel any existing audio/speech before starting new one
    // This ensures we can start new narration even if previous one is finishing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Reset the playing state (both ref and state) after canceling existing audio
    // This ensures we can start new narration even if previous one was finishing
    isPlayingNarrationRef.current = false;
    setIsPlayingNarration(false);
    
    // Small delay to ensure cleanup is complete and state updates propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set both ref and state to track playing status
    // We don't need to check here because we already canceled everything above
    isPlayingNarrationRef.current = true;
    setIsPlayingNarration(true);
    try {
      // Get the audio filename for this text
      const audioFilename = storyAudioMap[text];
      
      if (audioFilename) {
        // Try to play the audio file
        const success = await playAudioFile(audioFilename);
        if (success) {
          isPlayingNarrationRef.current = false;
          setIsPlayingNarration(false);
          return;
        }
        
        // If autoplay was blocked, wait for user interaction and retry
        if (needsUserInteraction || isWaitingForInteraction) {
          // Wait for user interaction
          while (needsUserInteraction || isWaitingForInteraction) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Try playing the existing audio element first (if it exists and is valid)
          if (currentAudioRef.current && !currentAudioRef.current.ended) {
            try {
              await currentAudioRef.current.play();
              // Audio started playing, wait for it to finish
              await new Promise<void>((resolve) => {
                const audio = currentAudioRef.current;
                if (!audio) {
                  resolve();
                  return;
                }
                
                const onEnded = () => {
                  audio.removeEventListener('ended', onEnded);
                  resolve();
                };
                
                const onError = () => {
                  audio.removeEventListener('error', onError);
                  resolve();
                };
                
                audio.addEventListener('ended', onEnded);
                audio.addEventListener('error', onError);
                
                // Safety timeout
                setTimeout(() => {
                  audio.removeEventListener('ended', onEnded);
                  audio.removeEventListener('error', onError);
                  resolve();
                }, 30000);
              });
              
              isPlayingNarrationRef.current = false;
              setIsPlayingNarration(false);
              return;
            } catch (error) {
              // Failed to play existing audio, create new one
              console.warn('Retry with existing audio failed, creating new audio element');
            }
          }
          
          // Retry playing the audio file after interaction (create new audio element)
          const retrySuccess = await playAudioFile(audioFilename);
          if (retrySuccess) {
            isPlayingNarrationRef.current = false;
            setIsPlayingNarration(false);
            return;
          }
        }
        
        // Check if audio is actually playing even though playAudioFile returned false
        // This can happen if audio started playing but timed out during load
        if (currentAudioRef.current && !currentAudioRef.current.paused && !currentAudioRef.current.ended) {
          // Audio is playing, wait for it to finish
          await new Promise<void>((resolve) => {
            const audio = currentAudioRef.current;
            if (!audio) {
              resolve();
              return;
            }
            
            const onEnded = () => {
              audio.removeEventListener('ended', onEnded);
              resolve();
            };
            
            const onError = () => {
              audio.removeEventListener('error', onError);
              resolve();
            };
            
            audio.addEventListener('ended', onEnded);
            audio.addEventListener('error', onError);
            
            // Safety timeout in case audio never ends
            setTimeout(() => {
              audio.removeEventListener('ended', onEnded);
              audio.removeEventListener('error', onError);
              resolve();
            }, 30000); // 30 second max wait
          });
          
          isPlayingNarrationRef.current = false;
          setIsPlayingNarration(false);
          return;
        }
      }
      
      // Fallback to Web Speech API if audio file not found or failed
      console.log('Using Web Speech API fallback for:', text.substring(0, 50) + '...');
      await playWebSpeechFallback(text);
    } catch (error) {
      console.warn('Narration playback failed:', error);
    } finally {
      isPlayingNarrationRef.current = false;
      setIsPlayingNarration(false);
    }
  };

  // Handle story phase progression
  useEffect(() => {
    let mounted = true;
    
    const handlePhase = async () => {
      // Skip if we're in the middle of a replay operation (preventing double audio)
      if (isReplayingRef.current && storyPhase === 'readyToStart') {
        return;
      }
      
      // Wait for user interaction if autoplay is blocked (important for refresh)
      if (needsUserInteraction || isWaitingForInteraction) {
        // Wait for user interaction before proceeding
        while (needsUserInteraction || isWaitingForInteraction) {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (!mounted) return;
        }
      }
      
      // Wait for any ongoing narration to complete before proceeding (important for refresh)
      if (isPlayingNarration) {
        // Wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 100));
        if (isPlayingNarration) {
          // Still playing, skip this cycle
          return;
        }
      }
      
      // On initial mount (especially after refresh), add a small delay to ensure audio is ready
      if (storyPhase === 'intro' && !isReplayingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!mounted) return;
      }
      
      switch (storyPhase) {
        case 'intro':
          if (!mounted) return;
          // Clear replay flag when starting intro
          isReplayingRef.current = false;
          // Show narrator bubble and start audio
          setCurrentSpeechIndex(0);
          setVisibleSpeechBubbles([0]);
          await playNarration(story.intro.narrator);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Show rocket bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(1);
          setVisibleSpeechBubbles([1]); // Only show current bubble
          await playNarration(story.intro.rocket);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Show Captain Rahi and destination bubble, start audio (clear previous)
          if (!mounted) return;
          setShowRahi(true);
          setCurrentSpeechIndex(2);
          setVisibleSpeechBubbles([2]); // Only show current bubble
          await playNarration(story.intro.destination);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (mounted) {
            setCurrentSpeechIndex(0);
            setVisibleSpeechBubbles([]);
            setStoryPhase('riloAppears');
          }
          break;
        case 'riloAppears':
          if (!mounted) return;
          // Show both Rahi and Rilo for the conversation
          setShowRahi(true);
          setShowRilo(true);
          setCurrentSpeechIndex(0);
          setVisibleSpeechBubbles([]);
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // First Rilo speech - show bubble and start audio
          if (!mounted) return;
          setCurrentSpeechIndex(0);
          setVisibleSpeechBubbles([0]); // Only show current bubble
          await playNarration(story.riloAppears.rilo);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Second Rilo speech - show bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(1);
          setVisibleSpeechBubbles([1]); // Only show current bubble
          await playNarration(story.riloAppears.fuelRequirement);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Third Rilo speech - show bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(2);
          setVisibleSpeechBubbles([2]); // Only show current bubble
          await playNarration(story.riloAppears.fuelExplanation);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Fourth Rilo speech - show bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(3);
          setVisibleSpeechBubbles([3]); // Only show current bubble
          await playNarration(story.riloAppears.gameExplanation);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Fifth Rilo speech - "Let's practice a tiny bit..." - show bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(4);
          setVisibleSpeechBubbles([4]); // Only show current bubble
          await playNarration(story.practice.intro);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (mounted) {
            setCurrentSpeechIndex(0);
            setVisibleSpeechBubbles([]);
            setStoryPhase('practice1');
          }
          break;
        case 'practice1':
        case 'practice2':
        case 'practice3':
          if (!mounted) return;
          const roundNum = storyPhase === 'practice1' ? 1 : storyPhase === 'practice2' ? 2 : 3;
          setPracticeRound(roundNum);
          const question = generatePracticeQuestion();
          setPracticeQuestion(question);
          setShowPracticeLetter(false);
          setPracticeAnswer(null);
          setShowPracticeFeedback(false);
          setShowControlsInstruction(false);
          setControlsInstructionComplete(false);
          setHighlightLeftButton(false);
          setHighlightRightButton(false);
          setShowPracticeCompletionMessage(false);
          setPracticeCompletionText('');
          setShowPracticeIntro(false);
          
          // Reset successful attempts counter only when starting practice1
          if (roundNum === 1) {
            setSuccessfulPracticeAttempts(0);
          }
          
          // Ensure Rilo is visible for practice rounds
          setShowRilo(true);
          setShowRahi(false);
          
          // For rounds 2 and 3, enable question window immediately (no controls instruction)
          if (roundNum > 1) {
            setControlsInstructionComplete(true);
          }
          
          if (roundNum === 1) {
            // Skip practice intro (already shown in riloAppears phase) and go straight to controls instruction
            setShowPracticeIntro(false);
            setShowControlsInstruction(true);
            setControlsInstructionComplete(false);
            
            // Play audio letter while controls are visible
            setIsPlayingPracticeAudio(true);
            await playLetterAudio(question.audioLetter, contentLanguage);
            if (!mounted) return;
            setIsPlayingPracticeAudio(false);
            setShowPracticeLetter(true);
            
            // Now speak the controls instruction
            await playNarration(story.practice.controls);
            if (!mounted) return;
            // After narration completes, enable the question window
            setControlsInstructionComplete(true);
            // After narration, show hand pointer and highlight buttons sequentially
            await new Promise(resolve => setTimeout(resolve, 500));
            setHighlightLeftButton(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setHighlightLeftButton(false);
            await new Promise(resolve => setTimeout(resolve, 300));
            setHighlightRightButton(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setHighlightRightButton(false);
            // Keep instruction visible but remove highlights
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            // Rounds 2 and 3 - just play audio and show letter
            setIsPlayingPracticeAudio(true);
            await playLetterAudio(question.audioLetter, contentLanguage);
            if (!mounted) return;
            setIsPlayingPracticeAudio(false);
            setShowPracticeLetter(true);
          }
          break;
        case 'fuelExplanation':
          if (!mounted) return;
          // Ensure Rilo is visible
          setShowRilo(true);
          setShowRahi(false);
          
          // First Rilo speech - show bubble and start audio
          setCurrentSpeechIndex(0);
          setVisibleSpeechBubbles([0]); // Only show current bubble
          setShowFuelFlashMessages(true); // Show flash messages
          setVisibleFlashNumber(null); // Reset flash number
          await playNarration(story.fuelExplanation.rilo);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Show flash messages sequentially: +5, then +3, then +1
          if (mounted) {
            // Show +5
            setVisibleFlashNumber(5);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!mounted) return;
            
            // Show +3
            setVisibleFlashNumber(3);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!mounted) return;
            
            // Show +1
            setVisibleFlashNumber(1);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!mounted) return;
          }
          
          // Second Rilo speech - show bubble and start audio (clear previous)
          if (!mounted) return;
          setCurrentSpeechIndex(1);
          setVisibleSpeechBubbles([1]); // Only show current bubble
          setShowFuelFlashMessages(false); // Hide flash messages
          setVisibleFlashNumber(null); // Reset flash number
          await playNarration(story.fuelExplanation.fuelMeter);
          if (!mounted) return;
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (mounted) {
            setCurrentSpeechIndex(0);
            setVisibleSpeechBubbles([]);
            setStoryPhase('readyToStart');
          }
          break;
        case 'readyToStart':
          if (!mounted) return;
          // Ensure Rilo is visible
          setShowRilo(true);
          setShowRahi(false);
          
          // Show Rilo speech bubble and start audio
          setCurrentSpeechIndex(0);
          setVisibleSpeechBubbles([0]);
          await playNarration(story.readyToStart.rilo);
          break;
      }
    };
    
    handlePhase();
    
    return () => {
      mounted = false;
      // Stop any ongoing audio when phase changes
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      // Cancel any speech synthesis
      if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      isPlayingNarrationRef.current = false;
      setIsPlayingNarration(false);
    };
  }, [storyPhase, story, contentLanguage, audioLanguage, needsUserInteraction, isWaitingForInteraction]);

  // Handle practice answer
  const handlePracticeAnswer = useCallback(async (isMatch: boolean) => {
    if (!practiceQuestion || showPracticeFeedback || isPlayingPracticeAudio) return;
    
    setPracticeAnswer(isMatch);
    const isCorrect = isMatch === practiceQuestion.isMatch;
    setIsPracticeCorrect(isCorrect);
    setShowPracticeFeedback(true);
    
    // Show feedback message
    let newSuccessfulCount = successfulPracticeAttempts;
    if (isCorrect) {
      // Play success sound like Letter Hunt game
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      // Increment successful attempts counter
      newSuccessfulCount = successfulPracticeAttempts + 1;
      setSuccessfulPracticeAttempts(newSuccessfulCount);
    } else {
      await playNarration(story.practice.wrongFeedback);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowPracticeFeedback(false);
    
    // Move to next phase - use current storyPhase from state
    const currentPhase = storyPhase;
    if (currentPhase === 'practice1') {
      // Only move to practice2 if we have at least 1 successful attempt
      if (newSuccessfulCount >= 1) {
        setStoryPhase('practice2');
      } else {
        // Stay in practice1 - generate new question for retry
        // Don't show controls instruction again, enable immediately
        setControlsInstructionComplete(true);
        const newQuestion = generatePracticeQuestion();
        setPracticeQuestion(newQuestion);
        setShowPracticeLetter(false);
        setPracticeAnswer(null);
        setShowPracticeFeedback(false);
        // Play audio and show letter again
        setIsPlayingPracticeAudio(true);
        await playLetterAudio(newQuestion.audioLetter, contentLanguage);
        setIsPlayingPracticeAudio(false);
        setShowPracticeLetter(true);
      }
    } else if (currentPhase === 'practice2') {
      // Only move to practice3 if we have at least 2 successful attempts
      if (newSuccessfulCount >= 2) {
        setStoryPhase('practice3');
      } else {
        // Stay in practice2 - generate new question for retry
        const newQuestion = generatePracticeQuestion();
        setPracticeQuestion(newQuestion);
        setShowPracticeLetter(false);
        setPracticeAnswer(null);
        setShowPracticeFeedback(false);
        // Play audio and show letter again
        setIsPlayingPracticeAudio(true);
        await playLetterAudio(newQuestion.audioLetter, contentLanguage);
        setIsPlayingPracticeAudio(false);
        setShowPracticeLetter(true);
      }
    } else if (currentPhase === 'practice3') {
      // After practice3, only move forward if we have 3 successful attempts
      if (newSuccessfulCount >= 3) {
        // Hide the practice question window first
        setPracticeQuestion(null);
        setShowPracticeLetter(false);
        
        // Show completion conversation after 3 successful attempts
        setPracticeCompletionText(story.practice.allReady);
        setShowPracticeCompletionMessage(true);
        await playNarration(story.practice.allReady);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowPracticeCompletionMessage(false);
        setStoryPhase('fuelExplanation');
      } else {
        // Stay in practice3 - generate new question for retry
        const newQuestion = generatePracticeQuestion();
        setPracticeQuestion(newQuestion);
        setShowPracticeLetter(false);
        setPracticeAnswer(null);
        setShowPracticeFeedback(false);
        // Play audio and show letter again
        setIsPlayingPracticeAudio(true);
        await playLetterAudio(newQuestion.audioLetter, contentLanguage);
        setIsPlayingPracticeAudio(false);
        setShowPracticeLetter(true);
      }
    }
  }, [practiceQuestion, showPracticeFeedback, isPlayingPracticeAudio, storyPhase, story, audioLanguage, successfulPracticeAttempts]);

  // Handle keyboard input for practice rounds (Left/W = Match, Right/M = Non-match)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showPracticeFeedback || !practiceQuestion || !showPracticeLetter || isPlayingPracticeAudio) return;
      
      // For practice round 1, only allow input after instruction conversation completes
      if (practiceRound === 1 && !controlsInstructionComplete) return;
      
      if (event.key === 'ArrowLeft' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        handlePracticeAnswer(true); // Match
      } else if (event.key === 'ArrowRight' || event.key === 'm' || event.key === 'M') {
        event.preventDefault();
        handlePracticeAnswer(false); // Non-match
      }
    };

    // Only add listener during practice rounds
    if (storyPhase === 'practice1' || storyPhase === 'practice2' || storyPhase === 'practice3') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [storyPhase, showPracticeFeedback, practiceQuestion, showPracticeLetter, isPlayingPracticeAudio, handlePracticeAnswer, practiceRound, controlsInstructionComplete]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Replay story handler
  const handleReplayStory = async () => {
    // Stop all audio first
    stopAllAudio();
    
    // Clear audio ref
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    // Cancel any speech synthesis and wait for it to fully stop
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        // Wait a bit for speech synthesis to fully cancel
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    
    // Reset all state to beginning
    isPlayingNarrationRef.current = false;
    setIsPlayingNarration(false);
    setNeedsUserInteraction(false);
    setIsWaitingForInteraction(false);
    setShowRilo(false);
    setShowRahi(true);
    setPracticeRound(0);
    setPracticeQuestion(null);
    setShowPracticeLetter(false);
    setIsPlayingPracticeAudio(false);
    setPracticeAnswer(null);
    setShowPracticeFeedback(false);
    setIsPracticeCorrect(false);
    setShowControlsInstruction(false);
    setControlsInstructionComplete(false);
    setHighlightLeftButton(false);
    setHighlightRightButton(false);
    setShowPracticeCompletionMessage(false);
    setPracticeCompletionText('');
    setSuccessfulPracticeAttempts(0);
    setShowPracticeIntro(false);
    setShowFuelFlashMessages(false);
    setVisibleFlashNumber(null);
    
    // Reset story phase and speech bubble state
    // Set replay flag to prevent double audio during phase transition
    isReplayingRef.current = true;
    setCurrentSpeechIndex(0);
    
    if (storyPhase === 'intro') {
      // Temporarily set to different phase to force useEffect to re-run
      setStoryPhase('readyToStart');
      setVisibleSpeechBubbles([]);
      // Use a delay to ensure the phase change is processed and any cleanup runs
      // This prevents double audio by ensuring the intermediate phase doesn't play audio
      setTimeout(() => {
        // Clear flag and set phase in separate updates to ensure smooth transition
        isReplayingRef.current = false;
        // Use requestAnimationFrame to ensure flag is cleared before phase change renders
        requestAnimationFrame(() => {
          setStoryPhase('intro');
        });
      }, 100);
    } else {
      // Set initial visibility immediately to prevent blank screen
      setVisibleSpeechBubbles([0]);
      isReplayingRef.current = false; // Clear flag immediately for non-intro case
      setStoryPhase('intro');
    }
  };

  // Back handler with audio cleanup
  const handleBack = () => {
    stopAllAudio();
    
    // Clear audio ref
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Cancel any speech synthesis
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    onBack();
  };

  // Start game handler
  const handleStartGame = () => {
    stopAllAudio();
    onStartGame();
  };

  // Render speech bubble with smooth fade animation (no shrink/wobble)
  const SpeechBubble = ({ text, character, position = 'left', index, isVisible = true }: { text: string; character: 'rahi' | 'rilo' | 'narrator'; position?: 'left' | 'right' | 'center'; index?: number; isVisible?: boolean }) => {
    const characterEmoji = character === 'rahi' ? '👨‍🚀' : character === 'rilo' ? '🤖' : '✨';
    const characterName = character === 'rahi' ? 'Captain Rahi' : character === 'rilo' ? 'Rilo' : '';
    
    if (!text) return null;
    
    return (
      <div 
        className={`flex ${position === 'left' ? 'justify-start' : position === 'right' ? 'justify-end' : 'justify-center'}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          visibility: isVisible ? 'visible' : 'hidden'
        }}
      >
        <div className="relative w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[220px] md:max-w-sm lg:max-w-md xl:max-w-lg">
          {/* Speech bubble */}
          <div className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-2.5 md:p-3 lg:p-4 shadow-lg border-2 ${
            character === 'rahi' ? 'border-blue-300' : 
            character === 'rilo' ? 'border-purple-300' : 
            'border-yellow-300'
          }`}>
            <p className="text-[10px] xs:text-[11px] sm:text-sm md:text-base lg:text-lg text-gray-800 leading-tight sm:leading-relaxed whitespace-pre-line text-center break-words">
              {text}
            </p>
          </div>
          {/* Arrow pointing DOWN to character below */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 sm:-bottom-2 md:-bottom-3">
            <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] sm:border-l-[8px] sm:border-r-[8px] sm:border-t-[10px] md:border-l-[10px] md:border-r-[10px] md:border-t-[12px] lg:border-l-[12px] lg:border-r-[12px] lg:border-t-[14px] ${
              character === 'rahi' ? 'border-l-transparent border-r-transparent border-t-blue-300' : 
              character === 'rilo' ? 'border-l-transparent border-r-transparent border-t-purple-300' : 
              'border-l-transparent border-r-transparent border-t-yellow-300'
            }`}></div>
          </div>
        </div>
      </div>
    );
  };

  // Render character with smooth fade only (no scale/wobble)
  const CharacterDisplay = ({ character, show }: { character: 'rahi' | 'rilo'; show: boolean }) => {
    const emoji = character === 'rahi' ? '👨‍🚀' : '🤖';
    // Fixed sizes for consistency
    const size = character === 'rahi' 
      ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-5xl sm:text-6xl md:text-7xl' 
      : 'w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 text-4xl sm:text-5xl md:text-6xl';
    
    return (
      <div 
        className={`flex items-center justify-center ${size}`}
        style={{
          opacity: show ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out'
        }}
      >
        {emoji}
      </div>
    );
  };

  return (
    <SpaceBackground className="h-screen p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 relative z-10">
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <Button
              onClick={handleBack}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मागे'}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStartGame}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
              >
                {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమో దాటవేయి' : contentLanguage === 'kn' ? 'ಡೆಮೊ ಬಿಟ್ಟುಬಿಡಿ' : 'डेमो वगळा'}
              </Button>
              <ReplayButton
                onClick={handleReplayStory}
                language={contentLanguage}
              />
            </div>
          </div>
        )}

        {/* User Interaction Required Overlay */}
        {needsUserInteraction && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
            onClick={() => {
              setNeedsUserInteraction(false);
              setIsWaitingForInteraction(false);
            }}
          >
            <Card 
              className="p-6 sm:p-8 max-w-md mx-4 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {contentLanguage === 'en' ? 'Click to Start' : 
                   contentLanguage === 'te' ? 'ప్రారంభించడానికి క్లిక్ చేయండి' :
                   contentLanguage === 'kn' ? 'ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ' :
                   contentLanguage === 'mr' ? 'प्रारंभ करण्यासाठी क्लिक करा' :
                   'Click to Start'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {contentLanguage === 'en' ? 'Please click anywhere to start the preview' :
                   contentLanguage === 'te' ? 'దయచేసి ప్రివ్యూ ప్రారంభించడానికి ఎక్కడైనా క్లిక్ చేయండి' :
                   contentLanguage === 'kn' ? 'ದಯವಿಟ್ಟು ಪೂರ್ವವೀಕ್ಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಯಾವುದೇ ಸ್ಥಳದಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ' :
                   contentLanguage === 'mr' ? 'कृपया पूर्वावलोकन सुरू करण्यासाठी कुठेही क्लिक करा' :
                   'Please click anywhere to start the preview'}
                </p>
                <Button
                  onClick={() => {
                    setNeedsUserInteraction(false);
                    setIsWaitingForInteraction(false);
                  }}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {contentLanguage === 'en' ? 'Start Preview' :
                   contentLanguage === 'te' ? 'ప్రివ్యూ ప్రారంభించండి' :
                   contentLanguage === 'kn' ? 'ಪೂರ್ವವೀಕ್ಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ' :
                   contentLanguage === 'mr' ? 'पूर्वावलोकन सुरू करा' :
                   'Start Preview'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Main Story Content */}
        <Card className="flex-1 p-4 sm:p-6 md:p-8 bg-transparent border-0 shadow-none overflow-hidden flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Story Scene - Conversation Layout */}
            {/* Hide content during replay transition to prevent flash */}
            {!isReplayingRef.current && (storyPhase === 'intro' || storyPhase === 'riloAppears') && (
              <div className="w-full max-w-4xl relative px-2 sm:px-4 flex flex-col items-center justify-center h-full min-h-[400px] sm:min-h-[500px]">
                {/* Intro Phase - Character FIXED position with speech bubble above */}
                {storyPhase === 'intro' && (
                  <>
                    {/* Planet destination - positioned top right - lower z-index to be behind speech bubble */}
                    {visibleSpeechBubbles.length > 0 && (
                      <div className="absolute top-0 right-0 sm:top-1 sm:right-1 md:top-2 md:right-2 lg:top-3 lg:right-3 z-0" style={{ maxWidth: 'calc(50% - 1rem)' }}>
                        <div className="flex flex-col items-center">
                          <PlanetWithRocketAnimation 
                            level={level}
                            planetSize="text-4xl sm:text-6xl md:text-9xl lg:text-[10rem]"
                            containerSize={{
                              width: 'clamp(120px, 30vw, 260px)',
                              height: 'clamp(120px, 30vw, 260px)'
                            }}
                            orbitSize={{
                              width: 'clamp(100px, 25vw, 210px)',
                              height: 'clamp(100px, 25vw, 210px)'
                            }}
                            rocketSize={{
                              width: 'clamp(16px, 4vw, 24px)',
                              height: 'clamp(22px, 5.5vw, 32px)'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Character FIXED in center - speech bubble positioned absolutely above */}
                    <div className="flex flex-col items-center justify-center relative px-2 sm:px-0 mt-20 sm:mt-24 md:mt-28 lg:mt-32 xl:mt-36">
                      {/* Speech bubble - positioned absolutely above character, doesn't affect layout */}
                      <div 
                        className="absolute bottom-full mb-2 sm:mb-3 md:mb-4 lg:mb-5 left-1/2 -translate-x-1/2 z-30"
                        style={{ 
                          opacity: visibleSpeechBubbles.length > 0 ? 1 : 0, 
                          transition: 'opacity 0.5s ease-in-out',
                          pointerEvents: visibleSpeechBubbles.length > 0 ? 'auto' : 'none',
                          width: 'clamp(160px, 80vw, 320px)',
                          maxWidth: 'calc(100vw - 1rem)'
                        }}
                      >
                        <SpeechBubble 
                          text={visibleSpeechBubbles.includes(0) ? story.intro.narrator : 
                                visibleSpeechBubbles.includes(1) ? story.intro.rocket : 
                                visibleSpeechBubbles.includes(2) ? story.intro.destination : ''} 
                          character="narrator"
                          position="center" 
                          index={0} 
                          isVisible={visibleSpeechBubbles.length > 0} 
                        />
                      </div>
                      
                      {/* Character FIXED in center of screen */}
                      <div className="flex flex-col items-center">
                        <CharacterDisplay character="rahi" show={visibleSpeechBubbles.length > 0} />
                      </div>
                      
                      {/* Planets image with orbiting rocket - only show after "Today, you're going on a space trip" conversation, below Rahi */}
                      {/* Commented out - can be uncommented later if needed */}
                      {/* {visibleSpeechBubbles.includes(2) && (
                        <div className="mt-4 sm:mt-6 md:mt-8 z-10 relative" style={{ opacity: 1, transition: 'opacity 0.5s ease-in-out', width: 'clamp(120px, 30vw, 200px)', height: 'clamp(120px, 30vw, 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* Planets image */}
                          {/* <img 
                            src="/images/planets.png" 
                            alt="Planets" 
                            className="w-auto h-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px] object-contain relative z-10"
                          /> */}
                          {/* Orbit path */}
                          {/* <div 
                            className="absolute rounded-full border border-white/10"
                            style={{ width: 'clamp(140px, 35vw, 240px)', height: 'clamp(140px, 35vw, 240px)' }}
                          /> */}
                          {/* Orbiting rocket container */}
                          {/* <div 
                            className="absolute rocket-orbit"
                            style={{ width: 'clamp(140px, 35vw, 240px)', height: 'clamp(140px, 35vw, 240px)' }}
                          > */}
                            {/* Rocket positioned at edge, pointing tangent to orbit */}
                            {/* <div 
                              className="absolute"
                              style={{ 
                                top: '50%', 
                                left: '100%', 
                                transform: 'translate(-50%, -50%)'
                              }}
                            > */}
                              {/* <svg width="clamp(10px, 2.5vw, 16px)" height="clamp(14px, 3.5vw, 22px)" viewBox="0 0 20 28" fill="none"> */}
                                {/* Rocket body */}
                                {/* <ellipse cx="10" cy="12" rx="5" ry="9" fill="#e0e7ff"/> */}
                                {/* <ellipse cx="10" cy="12" rx="4" ry="7" fill="#c7d2fe"/> */}
                                {/* Nose cone */}
                                {/* <path d="M10 1L14 8H6L10 1Z" fill="#f87171"/> */}
                                {/* Window */}
                                {/* <circle cx="10" cy="10" r="2.5" fill="#60a5fa"/> */}
                                {/* <circle cx="10" cy="10" r="1.5" fill="#bfdbfe"/> */}
                                {/* Fins */}
                                {/* <path d="M5 17L1 22L6 19Z" fill="#f87171"/> */}
                                {/* <path d="M15 17L19 22L14 19Z" fill="#f87171"/> */}
                                {/* Flame */}
                                {/* <g className="flame-flicker" style={{ transformOrigin: '10px 22px' }}> */}
                                  {/* <ellipse cx="10" cy="23" rx="3" ry="4" fill="#fbbf24"/> */}
                                  {/* <ellipse cx="10" cy="24" rx="2" ry="3" fill="#fb923c"/> */}
                                  {/* <ellipse cx="10" cy="25" rx="1" ry="2" fill="#fef3c7"/> */}
                                {/* </g> */}
                              {/* </svg> */}
                            {/* </div> */}
                          {/* </div> */}
                        {/* </div> */}
                      {/* )} */}
                    </div>
                  </>
                )}

                {/* Rilo Appears Phase - Characters with speech bubble pointing to Rilo */}
                {storyPhase === 'riloAppears' && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center sm:justify-end pb-4 sm:pb-20 md:pb-24 lg:pb-28" style={{ minHeight: 'clamp(400px, 100vh, 600px)' }}>
                    {/* Moon and rocket animation - fixed position top right corner */}
                    <div className="absolute top-0 right-0 sm:top-1 sm:right-1 md:top-2 md:right-2 lg:top-3 lg:right-3 z-0" style={{ maxWidth: 'calc(50% - 1rem)' }}>
                      <div className="flex flex-col items-center">
                        <PlanetWithRocketAnimation 
                          level={level}
                          planetSize="text-4xl sm:text-6xl md:text-9xl lg:text-[10rem]"
                          containerSize={{
                            width: 'clamp(120px, 30vw, 260px)',
                            height: 'clamp(120px, 30vw, 260px)'
                          }}
                          orbitSize={{
                            width: 'clamp(100px, 25vw, 210px)',
                            height: 'clamp(100px, 25vw, 210px)'
                          }}
                          rocketSize={{
                            width: 'clamp(16px, 4vw, 24px)',
                            height: 'clamp(22px, 5.5vw, 32px)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Characters on same row - Rahi left, Rilo right */}
                    <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                      {/* Captain Rahi - FIXED position on LEFT */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div style={{ opacity: showRahi ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            👨‍🚀
                          </div>
                        </div>
                      </div>
                      
                      {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                      <div className="flex flex-col items-center relative flex-shrink-0 -ml-28 sm:ml-0">
                        {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                        {/* Centered above Rilo, but constrained to stay within viewport on mobile */}
                        <div 
                          className="absolute bottom-full mb-1 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-30"
                          style={{ 
                            opacity: visibleSpeechBubbles.length > 0 ? 1 : 0, 
                            transition: 'opacity 0.5s ease-in-out',
                            pointerEvents: visibleSpeechBubbles.length > 0 ? 'auto' : 'none',
                            width: 'clamp(120px, 70vw, 300px)',
                            maxWidth: 'min(calc(100vw - 3rem), 300px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            // On mobile, ensure it doesn't overflow right edge
                            right: 'auto'
                          }}
                        >
                          <SpeechBubble 
                            text={visibleSpeechBubbles.includes(0) ? story.riloAppears.rilo : 
                                  visibleSpeechBubbles.includes(1) ? story.riloAppears.fuelRequirement : 
                                  visibleSpeechBubbles.includes(2) ? story.riloAppears.fuelExplanation : 
                                  visibleSpeechBubbles.includes(3) ? story.riloAppears.gameExplanation : 
                                  visibleSpeechBubbles.includes(4) ? story.practice.intro : ''} 
                            character="rilo" 
                            position="center" 
                            index={0} 
                            isVisible={visibleSpeechBubbles.length > 0} 
                          />
                        </div>
                        
                        {/* Rilo character - same vertical position as Rahi */}
                        <div style={{ opacity: showRilo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            🤖
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Practice Rounds */}
            {(storyPhase === 'practice1' || storyPhase === 'practice2' || storyPhase === 'practice3') && (practiceQuestion || showPracticeCompletionMessage || showPracticeIntro) && (
              <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                {/* Practice intro message - "Let's practice a tiny bit" */}
                {showPracticeIntro && (
                  <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                    {/* Characters on same row - Rahi left, Rilo right */}
                    <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                      {/* Captain Rahi - FIXED position on LEFT */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div style={{ opacity: showRahi ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            👨‍🚀
                          </div>
                        </div>
                      </div>
                      
                      {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                      <div className="flex flex-col items-center relative flex-shrink-0 -ml-28 sm:ml-0">
                        {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                        {/* Centered above Rilo, but constrained to stay within viewport on mobile */}
                        <div 
                          className="absolute bottom-full mb-1 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-30"
                          style={{ 
                            opacity: 1, 
                            transition: 'opacity 0.5s ease-in-out',
                            pointerEvents: 'auto',
                            width: 'clamp(120px, 70vw, 300px)',
                            maxWidth: 'min(calc(100vw - 3rem), 300px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            right: 'auto'
                          }}
                        >
                          <SpeechBubble 
                            text={story.practice.intro} 
                            character="rilo" 
                            position="center" 
                            index={0} 
                            isVisible={true} 
                          />
                        </div>
                        
                        {/* Rilo character - same vertical position as Rahi */}
                        <div style={{ opacity: showRilo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            🤖
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion message - centered full width when no practice question */}
                {showPracticeCompletionMessage && practiceCompletionText && !practiceQuestion && !showPracticeIntro && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center sm:justify-end pb-4 sm:pb-20 md:pb-24 lg:pb-28" style={{ minHeight: 'clamp(400px, 100vh, 600px)' }}>
                    {/* Characters on same row - Rahi left, Rilo right */}
                    <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                      {/* Captain Rahi - FIXED position on LEFT */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                          👨‍🚀
                        </div>
                      </div>
                      
                      {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                      <div className="flex flex-col items-center relative flex-shrink-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8 -ml-28 sm:ml-0">
                        {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                        {/* Centered above Rilo, but constrained to stay within viewport on mobile */}
                        <div 
                          className="absolute bottom-full mb-1 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-30"
                          style={{ 
                            opacity: 1, 
                            transition: 'opacity 0.5s ease-in-out',
                            pointerEvents: 'auto',
                            width: 'clamp(120px, 70vw, 300px)',
                            maxWidth: 'min(calc(100vw - 3rem), 300px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            right: 'auto'
                          }}
                        >
                          <SpeechBubble 
                            text={practiceCompletionText} 
                            character="rilo" 
                            position="center" 
                            index={0} 
                            isVisible={true} 
                          />
                        </div>
                        
                        {/* Rilo character - same vertical position as Rahi */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                          🤖
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Practice with conversation - Grid layout for round 1 */}
                {practiceQuestion && practiceRound === 1 && showControlsInstruction && !showPracticeIntro && (
                <div className="w-full max-w-full px-1 sm:px-2 md:px-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full">
                    {/* Left side - Question Box */}
                    <div className="order-1 w-full mb-24 sm:mb-4 md:mb-0">
                      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 lg:p-4 border-2 border-blue-200 w-full relative max-w-full overflow-hidden">
                        <div className="relative">
                          <LetterLauncherGameCore
                            className="[&>div]:space-y-1.5 sm:[&>div]:space-y-2 md:[&>div]:space-y-3 lg:[&>div]:space-y-4 [&>div>div:first-child]:min-h-[60px] sm:[&>div>div:first-child]:min-h-[70px] md:[&>div>div:first-child]:min-h-[90px] lg:[&>div>div:first-child]:min-h-[110px] [&>div>div:last-child]:min-h-[70px] sm:[&>div>div:last-child]:min-h-[80px] md:[&>div>div:last-child]:min-h-[100px] lg:[&>div>div:last-child]:min-h-[120px]"
                            currentQuestion={{
                              ...practiceQuestion,
                              displayedLetter: showPracticeLetter ? practiceQuestion.displayedLetter : ''
                            }}
                            mode="preview"
                            selectedLanguage={contentLanguage}
                            showFeedback={showPracticeFeedback}
                            isCorrect={isPracticeCorrect}
                            selectedAnswer={practiceAnswer}
                            isPreview={true}
                            disabled={showPracticeFeedback || isPlayingPracticeAudio || !showPracticeLetter || !controlsInstructionComplete}
                            onAnswerSelect={handlePracticeAnswer}
                          />
                          
                          {/* Hand pointer pointing to buttons after instruction completes */}
                          {controlsInstructionComplete && showPracticeLetter && !showPracticeFeedback && (
                            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                              <div className="flex flex-col items-center animate-bounce">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">👆</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Empty space for conversation bubble */}
                    <div className="order-2 w-full">
                      {/* Space reserved for conversation bubble positioned above Rilo */}
                    </div>
                  </div>
                  
                  {/* Characters at bottom - Rahi left, Rilo right */}
                  <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full mt-4">
                    {/* Captain Rahi - FIXED position on LEFT */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        👨‍🚀
                      </div>
                    </div>
                    
                    {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                    <div className="flex flex-col items-center relative flex-shrink-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8 -ml-28 sm:ml-0">
                      {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                      {/* On mobile: positioned higher to avoid overlap with game card */}
                      <div 
                        className="absolute bottom-full mb-2 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-20"
                        style={{ 
                          opacity: 1, 
                          transition: 'opacity 0.5s ease-in-out',
                          pointerEvents: 'auto',
                          width: 'clamp(120px, 70vw, 320px)',
                          maxWidth: 'min(calc(100vw - 3rem), 320px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          right: 'auto'
                        }}
                      >
                        <SpeechBubble 
                          text={story.practice.controls} 
                          character="rilo" 
                          position="center"
                          index={0}
                          isVisible={true}
                        />
                      </div>
                      
                      {/* Rilo character */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        🤖
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Practice without conversation - Centered game area for rounds 2 and 3 only */}
                {practiceQuestion && !showPracticeIntro && practiceRound > 1 && (
                <div className="w-full max-w-full px-1 sm:px-2 md:px-0">
                  {/* Centered Question Container */}
                  <div className="flex justify-center w-full mb-4">
                    <div className="w-full max-w-lg">
                      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 lg:p-4 border-2 border-blue-200 w-full relative overflow-hidden">
                        <div className="relative">
                          <LetterLauncherGameCore
                            className="[&>div]:space-y-1.5 sm:[&>div]:space-y-2 md:[&>div]:space-y-3 lg:[&>div]:space-y-4 [&>div>div:first-child]:min-h-[60px] sm:[&>div>div:first-child]:min-h-[70px] md:[&>div>div:first-child]:min-h-[90px] lg:[&>div>div:first-child]:min-h-[110px] [&>div>div:last-child]:min-h-[70px] sm:[&>div>div:last-child]:min-h-[80px] md:[&>div>div:last-child]:min-h-[100px] lg:[&>div>div:last-child]:min-h-[120px]"
                            currentQuestion={{
                              ...practiceQuestion,
                              displayedLetter: showPracticeLetter ? practiceQuestion.displayedLetter : ''
                            }}
                            mode="preview"
                            selectedLanguage={contentLanguage}
                            showFeedback={showPracticeFeedback}
                            isCorrect={isPracticeCorrect}
                            selectedAnswer={practiceAnswer}
                            isPreview={true}
                            disabled={showPracticeFeedback || isPlayingPracticeAudio || !showPracticeLetter}
                            onAnswerSelect={handlePracticeAnswer}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Characters at bottom - Rahi left, Rilo right */}
                  <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                    {/* Captain Rahi - FIXED position on LEFT */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        👨‍🚀
                      </div>
                    </div>
                    
                    {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                    <div className="flex flex-col items-center relative flex-shrink-0 -ml-28 sm:ml-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        🤖
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            )}

            {/* Fuel Explanation */}
            {storyPhase === 'fuelExplanation' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center sm:justify-end pb-4 sm:pb-20 md:pb-24 lg:pb-28" style={{ minHeight: 'clamp(400px, 100vh, 600px)' }}>
                {/* Moon with rocket animation - centered */}
                <div className="absolute left-1/2 top-2 sm:top-8 -translate-x-1/2 flex flex-col items-center justify-center z-10">
                  <div className="relative" style={{ width: 'clamp(120px, 30vw, 260px)', height: 'clamp(120px, 30vw, 260px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlanetWithRocketAnimation 
                      level={level}
                      planetSize="text-4xl sm:text-6xl md:text-9xl lg:text-[10rem]"
                      containerSize={{
                        width: 'clamp(120px, 30vw, 260px)',
                        height: 'clamp(120px, 30vw, 260px)'
                      }}
                      orbitSize={{
                        width: 'clamp(100px, 25vw, 210px)',
                        height: 'clamp(100px, 25vw, 210px)'
                      }}
                      rocketSize={{
                        width: 'clamp(16px, 4vw, 24px)',
                        height: 'clamp(22px, 5.5vw, 32px)'
                      }}
                    />
                  </div>
                </div>

                {/* Flash messages for fuel amounts - centered between characters, below moon */}
                {showFuelFlashMessages && visibleSpeechBubbles.includes(0) && (
                  <div className="absolute left-1/2 top-[200px] sm:top-[240px] md:top-[280px] lg:top-[320px] -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-30 whitespace-nowrap">
                    {visibleFlashNumber === 5 && (
                      <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 animate-fade-in-out" style={{ animationDuration: '1s' }}>+5</span>
                    )}
                    {visibleFlashNumber === 3 && (
                      <>
                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600">+5</span>
                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 animate-fade-in-out" style={{ animationDuration: '1s' }}>+3</span>
                      </>
                    )}
                    {visibleFlashNumber === 1 && (
                      <>
                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600">+5</span>
                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600">+3</span>
                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 animate-fade-in-out" style={{ animationDuration: '1s' }}>+1</span>
                      </>
                    )}
                  </div>
                )}

                {/* Characters on same row - Rahi left, Rilo right, Fuel card in center (desktop) or below (mobile) */}
                <div className="relative w-full">
                  <div className="flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                    {/* Captain Rahi - FIXED position on LEFT */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        👨‍🚀
                      </div>
                    </div>
                    
                    {/* Fuel meter visualization - in center between characters on desktop only */}
                    {visibleSpeechBubbles.includes(1) && (
                      <div className="hidden sm:flex flex-1 justify-center items-end">
                        <ResourceRequirementCard
                          leftIcon={<Fuel className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-blue-600 fill-blue-600" />}
                          label="Fuel Needed"
                          rightIcon={<PlanetIcon level={level} className="text-4xl sm:text-5xl md:text-6xl" />}
                          alignment="end"
                        />
                              </div>
                    )}
                    
                    {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                    <div className="flex flex-col items-center relative flex-shrink-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8 -ml-28 sm:ml-0">
                      {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                      {/* Centered above Rilo, but constrained to stay within viewport on mobile */}
                      <div 
                        className="absolute bottom-full mb-1 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-20"
                        style={{ 
                          opacity: visibleSpeechBubbles.length > 0 ? 1 : 0, 
                          transition: 'opacity 0.5s ease-in-out',
                          pointerEvents: visibleSpeechBubbles.length > 0 ? 'auto' : 'none',
                            width: 'clamp(120px, 70vw, 320px)',
                            maxWidth: 'min(calc(100vw - 3rem), 320px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          right: 'auto'
                        }}
                      >
                        {/* Speech bubbles - show progressively */}
                        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 relative">
                          {visibleSpeechBubbles.includes(0) && (
                            <SpeechBubble text={story.fuelExplanation.rilo} character="rilo" position="center" index={0} isVisible={true} />
                          )}
                          {visibleSpeechBubbles.includes(1) && (
                            <SpeechBubble text={story.fuelExplanation.fuelMeter} character="rilo" position="center" index={1} isVisible={true} />
                          )}
                        </div>
                      </div>
                      
                      {/* Rilo character - same vertical position as Rahi */}
                      <div style={{ opacity: showRilo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                          🤖
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile: Fuel card below characters */}
                  {visibleSpeechBubbles.includes(1) && (
                    <div className="flex sm:hidden justify-center items-center w-full mt-4 px-2 z-30">
                      <ResourceRequirementCard
                        leftIcon={<Fuel className="h-10 w-10 text-blue-600 fill-blue-600" />}
                        label="Fuel Needed"
                        rightIcon={<PlanetIcon level={level} className="text-5xl" />}
                        alignment="end"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ready to Start */}
            {/* Hide during replay transition to prevent flash */}
            {storyPhase === 'readyToStart' && !isReplayingRef.current && (
              <div className="w-full h-full relative flex flex-col items-center justify-center sm:justify-end pb-4 sm:pb-20 md:pb-24 lg:pb-28" style={{ minHeight: 'clamp(400px, 100vh, 600px)' }}>
                {/* Moon with rocket animation - centered */}
                <div className="absolute left-1/2 top-2 sm:top-8 -translate-x-1/2 flex flex-col items-center justify-center z-10">
                  <div className="relative" style={{ width: 'clamp(120px, 30vw, 260px)', height: 'clamp(120px, 30vw, 260px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlanetWithRocketAnimation 
                      level={level}
                      planetSize="text-4xl sm:text-6xl md:text-9xl lg:text-[10rem]"
                      containerSize={{
                        width: 'clamp(120px, 30vw, 260px)',
                        height: 'clamp(120px, 30vw, 260px)'
                      }}
                      orbitSize={{
                        width: 'clamp(100px, 25vw, 210px)',
                        height: 'clamp(100px, 25vw, 210px)'
                      }}
                      rocketSize={{
                        width: 'clamp(16px, 4vw, 24px)',
                        height: 'clamp(22px, 5.5vw, 32px)'
                      }}
                    />
                  </div>
                </div>

                {/* Characters on same row - Rahi left, Rilo right */}
                <div className="relative flex items-end justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full max-w-full">
                  {/* Captain Rahi - FIXED position on LEFT */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                      👨‍🚀
                    </div>
                  </div>
                  
                  {/* Rilo - FIXED position on RIGHT - shifted left on mobile for better visibility */}
                  <div className="flex flex-col items-center relative flex-shrink-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8 -ml-28 sm:ml-0">
                    {/* Speech bubble - positioned absolutely above Rilo, pointing to Rilo */}
                    {/* Centered above Rilo, but constrained to stay within viewport on mobile */}
                    <div 
                      className="absolute bottom-full mb-1 sm:mb-3 md:mb-4 left-1/2 -translate-x-1/2 z-20"
                      style={{ 
                        opacity: visibleSpeechBubbles.length > 0 ? 1 : 0, 
                        transition: 'opacity 0.5s ease-in-out',
                        pointerEvents: visibleSpeechBubbles.length > 0 ? 'auto' : 'none',
                            width: 'clamp(120px, 70vw, 320px)',
                            maxWidth: 'min(calc(100vw - 3rem), 320px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        right: 'auto'
                      }}
                    >
                      {visibleSpeechBubbles.includes(0) && (
                        <SpeechBubble text={story.readyToStart.rilo} character="rilo" position="center" index={0} isVisible={true} />
                      )}
                    </div>
                    
                    {/* Rilo character - same vertical position as Rahi */}
                    <div style={{ opacity: showRilo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        🤖
                      </div>
                    </div>
                  </div>
                </div>

                {/* Start button centered at bottom */}
                <div className="absolute bottom-32 sm:bottom-44 md:bottom-48 lg:bottom-52 left-1/2 -translate-x-1/2 px-2 sm:px-0 z-30" style={{ maxWidth: 'calc(100% - 1rem)' }}>
                  <Button
                    onClick={handleStartGame}
                    size="lg"
                    className="text-base sm:text-xl md:text-2xl px-4 sm:px-8 py-3 sm:py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg whitespace-nowrap"
                  >
                    {story.readyToStart.button}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <style>{`
        /* Star twinkle animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes twinkleSlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        /* Nebula drift animations */
        .nebula-drift {
          animation: nebulaDrift 25s ease-in-out infinite;
        }
        .nebula-drift-reverse {
          animation: nebulaDrift 30s ease-in-out infinite reverse;
        }
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          33% { transform: translate(25px, -15px) scale(1.03); opacity: 0.28; }
          66% { transform: translate(-15px, 10px) scale(0.97); opacity: 0.22; }
        }
        
        /* Aurora wave animations */
        .aurora-wave {
          animation: auroraWave 8s ease-in-out infinite;
        }
        .aurora-wave-2 {
          animation: auroraWave 10s ease-in-out infinite reverse;
        }
        @keyframes auroraWave {
          0%, 100% { opacity: 0.6; transform: skewY(-3deg) translateX(0); }
          50% { opacity: 1; transform: skewY(-2deg) translateX(20px); }
        }
        
        /* Cosmic dust float */
        .dust-float {
          animation: dustFloat linear infinite;
        }
        @keyframes dustFloat {
          0% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(60px, -25px); opacity: 0.4; }
          100% { transform: translate(120px, 10px); opacity: 0; }
        }
        
        /* Shooting star with trail */
        .shooting-star {
          animation: shootingStarTrail linear infinite;
        }
        @keyframes shootingStarTrail {
          0% { transform: translate(0, 0) rotate(-45deg) scale(0); opacity: 0; }
          5% { transform: translate(15px, 15px) rotate(-45deg) scale(1); opacity: 1; }
          100% { transform: translate(350px, 350px) rotate(-45deg) scale(0.3); opacity: 0; }
        }
        
        /* Galaxy rotation */
        .galaxy-rotate {
          animation: galaxyRotate 100s linear infinite;
        }
        @keyframes galaxyRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Depth layers for perspective */
        .depth-layer-far {
          transform: translateZ(-100px) scale(1.1);
          transform-style: preserve-3d;
        }
        .depth-layer-mid {
          transform: translateZ(-50px) scale(1.05);
          transform-style: preserve-3d;
        }
        
        /* Light rays */
        .light-ray {
          animation: lightRayPulse 6s ease-in-out infinite;
        }
        .light-ray-2 {
          animation: lightRayPulse 8s ease-in-out infinite;
        }
        @keyframes lightRayPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        /* Floating light orbs */
        .light-orb {
          animation: orbFloat ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -20px) scale(1.1); opacity: 0.5; }
          50% { transform: translate(-10px, -30px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(20px, -15px) scale(1.05); opacity: 0.45; }
        }
        
        /* Fade in animation for flash messages - stays visible after animation */
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-10px) scale(0.8); }
          50% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 1s ease-in-out forwards;
        }
        
        /* Sparkle bursts */
        .sparkle-burst {
          animation: sparkleBurst 3s ease-in-out infinite;
        }
        @keyframes sparkleBurst {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        /* Comet animation */
        .comet {
          animation: cometFly 12s linear infinite;
        }
        @keyframes cometFly {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(120vw, 40vh); opacity: 0; }
        }
        
        /* Constellation twinkle */
        .constellation {
          animation: constellationGlow 4s ease-in-out infinite;
        }
        @keyframes constellationGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        /* Tiny galaxies */
        .tiny-galaxy {
          animation: galaxyTwinkle 5s ease-in-out infinite;
        }
        @keyframes galaxyTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        
        /* Smooth conversation transitions */
        .conversation-container {
          transition: all 0.4s ease-in-out;
        }
        
        /* Prevent layout shifts */
        .character-container {
          min-width: 80px;
          min-height: 100px;
        }
        
        @media (min-width: 640px) {
          .character-container {
            min-width: 96px;
            min-height: 120px;
          }
        }
        
        @media (min-width: 768px) {
          .character-container {
            min-width: 112px;
            min-height: 140px;
          }
        }
      `}</style>
    </SpaceBackground>
  );
}

export default LetterLauncherGameStoryPreview;

