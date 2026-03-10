import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Check, X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { GameIntroduction } from "../GameIntroduction";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { SentenceGameCore, type SentenceQuestion } from "./SentenceGameCore";
import { FillInBlanksGameCore, type FillInBlanksQuestion } from "./FillInBlanksGameCore";
import { TrueFalseGameCore, type TrueFalseQuestion } from "./TrueFalseGameCore";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio } from "../../utils/audioUtils";

interface CombinedSentenceGamesPreviewProps {
  onStartGame: () => void;
  onBack: () => void;
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedTime?: string;
  level?: number;
  hideHeader?: boolean;
}

type PreviewPhase = 
  | 'introduction'      // Show game introduction
  | 'countdown'         // Show countdown timer
  | 'demo'              // Show actual demo
  | 'completion';       // Show completion page with buttons

type DemoStep = 
  | 'instruction1'      // Show instruction 1, play narration
  | 'waitForReady'      // Wait for user to click "I'm Ready" (Sentence Builder)
  | 'showWords'         // Show the scrambled words after ready click (Sentence Builder)
  | 'instruction2'      // After action clicked, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

type GameType = 'sentenceBuilder' | 'fillInBlanks' | 'trueFalse';

const gameInstructions = {
  en: {
    title: "Sentence Games",
    description: "Experience three exciting sentence games in one adventure!",
    games: {
      sentenceBuilder: {
        title: "Sentence Builder",
        steps: [
          "📝 Look at the scrambled words",
          "🖱️ Click words in correct order",
          "📋 Build your sentence step by step",
          "✅ Complete the sentence!"
        ],
        instruction1: "Click 'I'm Ready' to see the scrambled words",
        instruction2: "Good! Now look at these scrambled words",
        instruction3: "Now click the words in the correct order to build a sentence",
        instruction4: "Perfect! You built a complete sentence!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "Click I'm Ready to see the scrambled words",
        narration2: "Good! Now look at these scrambled words",
        narration3: "Now click the words in the correct order to build a sentence",
        narration4: "Perfect! You built a complete sentence!",
        buildSentence: "Build your sentence!",
        readyButton: "I'm Ready",
        demo: {
          scrambledWords: ["is", "good", "Reading"],
          correctOrder: ["Reading", "is", "good"],
          correctSentence: "Reading is good",
          explanation: "Perfect! You arranged the words correctly!"
        }
      },
      fillInBlanks: {
        title: "Fill in the Blanks",
        steps: [
          "📝 Read the sentence carefully",
          "👀 Look at the sentence with a blank",
          "🎯 Choose the correct word to complete it",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Get ready! You'll see a sentence with a missing word. Click 'I'm Ready' when prepared",
        instruction2: "Good! Now read this sentence carefully",
        instruction3: "Now, choose the correct word to complete the sentence",
        instruction4: "Great job! You've completed the demo successfully!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "Get ready! You'll see a sentence with a missing word. Click I'm Ready when prepared",
        narration2: "Good! Now read this sentence carefully",
        narration3: "Now, choose the correct word to complete the sentence",
        narration4: "Great job! You've completed the demo successfully!",
        readyButton: "I'm Ready",
        demo: {
          audio: "The sun is shining bright",
          sentence: "The ____ is shining bright",
          options: ["some", "sun", "son", "sum"],
          correctAnswer: "sun",
          explanation: "The word 'sun' completes the sentence correctly!"
        }
      },
      trueFalse: {
        title: "True or False",
        steps: [
          "📝 Read the statement carefully",
          "👀 Read the statement carefully",
          "🎯 Choose True or False",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Get ready! You'll see a statement to evaluate. Click 'I'm Ready' when prepared",
        instruction2: "Good! Now read this statement carefully",
        instruction3: "Now, decide if this statement is true or false",
        instruction4: "Great job! You've completed the demo successfully!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "Get ready! You'll see a statement to evaluate. Click I'm Ready when prepared",
        narration2: "Good! Now read this statement carefully",
        narration3: "Now, decide if this statement is true or false",
        narration4: "Great job! You've completed the demo successfully!",
        readyButton: "I'm Ready",
        demo: {
          audio: "The sky is blue",
          statement: "The sky is blue",
          correctAnswer: true,
          explanation: "Correct! The sky is indeed blue."
        }
      }
    }
  },
  te: {
    title: "సంయుక్త వాక్య ఆటలు",
    description: "ఒక సాహసంలో మూడు ఉత్తేజకరమైన వాక్య ఆటలను అనుభవించండి!",
    games: {
      sentenceBuilder: {
        title: "వాక్య నిర్మాణం",
        steps: [
          "📝 గందరగోళ పదాలను చూడండి",
          "🖱️ సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
          "📋 దశలవారీగా మీ వాక్యాన్ని నిర్మించండి",
          "✅ వాక్యాన్ని పూర్తి చేయండి!"
        ],
        instruction1: "గందరగోళ పదాలను చూడటానికి 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ గందరగోళ పదాలను చూడండి",
        instruction3: "ఇప్పుడు వాక్యాన్ని నిర్మించడానికి సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
        instruction4: "పర్ఫెక్ట్! మీరు పూర్తి వాక్యాన్ని నిర్మించారు!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "గందరగోళ పదాలను చూడటానికి నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ గందరగోళ పదాలను చూడండి",
        narration3: "ఇప్పుడు వాక్యాన్ని నిర్మించడానికి సరైన క్రమంలో పదాలను క్లిక్ చేయండి",
        narration4: "పర్ఫెక్ట్! మీరు పూర్తి వాక్యాన్ని నిర్మించారు!",
        buildSentence: "మీ వాక్యాన్ని నిర్మించండి!",
        readyButton: "నేను సిద్ధంగా ఉన్నాను",
        demo: {
          scrambledWords: ["మంచిది", "చదవడం", "చాలా"],
          correctOrder: ["చదవడం", "చాలా", "మంచిది"],
          correctSentence: "చదవడం చాలా మంచిది",
          explanation: "పరిపూర్ణం! మీరు పదాలను సరిగ్గా అమర్చారు!"
        }
      },
      fillInBlanks: {
        title: "ఖాళీలు పూరించండి",
        steps: [
          "📝 వాక్యాన్ని జాగ్రత్తగా చదవండి",
          "👀 ఖాళీతో ఉన్న వాక్యాన్ని చూడండి",
          "🎯 దానిని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "సిద్ధంగా ఉండండి! మీరు తప్పిపోయిన పదంతో వాక్యాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
        instruction3: "ఇప్పుడు, వాక్యాన్ని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
        instruction4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "సిద్ధంగా ఉండండి! మీరు తప్పిపోయిన పదంతో వాక్యాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
        narration3: "ఇప్పుడు, వాక్యాన్ని పూర్తి చేయడానికి సరైన పదాన్ని ఎంచుకోండి",
        narration4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
        readyButton: "నేను సిద్ధంగా ఉన్నాను",
        demo: {
          audio: "సూర్యుడు ప్రకాశవంతంగా వెలుగుతోంది",
          sentence: "____ ప్రకాశవంతంగా వెలుగుతోంది",
          options: ["కొన్ని", "సూర్యుడు", "కుమారుడు", "మొత్తం"],
          correctAnswer: "సూర్యుడు",
          explanation: "పదం 'సూర్యుడు' వాక్యాన్ని సరిగ్గా పూర్తి చేస్తుంది!"
        }
      },
      trueFalse: {
        title: "సత్యం లేదా అసత్యం",
        steps: [
          "📝 వాక్యాన్ని జాగ్రత్తగా చదవండి",
          "👀 వాక్యాన్ని జాగ్రత్తగా చదవండి",
          "🎯 సత్యం లేదా అసత్యం ఎంచుకోండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "సిద్ధంగా ఉండండి! మీరు వాక్యాన్ని అంచనా వేయబోతున్నారు. సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
        instruction3: "ఇప్పుడు, ఈ వాక్యం సత్యమా లేదా అసత్యమా నిర్ణయించండి",
        instruction4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "సిద్ధంగా ఉండండి! మీరు వాక్యాన్ని అంచనా వేయబోతున్నారు. సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ వాక్యాన్ని జాగ్రత్తగా చదవండి",
        narration3: "ఇప్పుడు, ఈ వాక్యం సత్యమా లేదా అసత్యమా నిర్ణయించండి",
        narration4: "బాగా చేసారు! మీరు డెమోను విజయవంతంగా పూర్తి చేసారు!",
        readyButton: "నేను సిద్ధంగా ఉన్నాను",
        demo: {
          audio: "ఆకాశం నీలం రంగులో ఉంటుంది",
          statement: "ఆకాశం నీలం రంగులో ఉంటుంది",
          correctAnswer: true,
          explanation: "సరైనది! ఆకాశం నిజంగా నీలం రంగులో ఉంటుంది."
        }
      }
    }
  },
  kn: {
    title: "ಸಂಯೋಜಿತ ವಾಕ್ಯ ಆಟಗಳು",
    description: "ಒಂದು ಸಾಹಸದಲ್ಲಿ ಮೂರು ರೋಮಾಂಚಕ ವಾಕ್ಯ ಆಟಗಳನ್ನು ಅನುಭವಿಸಿ!",
    games: {
      sentenceBuilder: {
        title: "ವಾಕ್ಯ ನಿರ್ಮಾಣ",
        steps: [
          "📝 ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
          "🖱️ ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
          "📋 ಹಂತ ಹಂತವಾಗಿ ನಿಮ್ಮ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿ",
          "✅ ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ!"
        ],
        instruction1: "ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಲು 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
        instruction3: "ಈಗ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಲು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಸಂಪೂರ್ಣ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಲು ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗೊಂದಲದ ಪದಗಳನ್ನು ನೋಡಿ",
        narration3: "ಈಗ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಲು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಸಂಪೂರ್ಣ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿದ್ದೀರಿ!",
        buildSentence: "ನಿಮ್ಮ ವಾಕ್ಯವನ್ನು ನಿರ್ಮಿಸಿ!",
        readyButton: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ",
        demo: {
          scrambledWords: ["ಒಳ್ಳೆಯದು", "ಓದುವುದು", "ತುಂಬಾ"],
          correctOrder: ["ಓದುವುದು", "ತುಂಬಾ", "ಒಳ್ಳೆಯದು"],
          correctSentence: "ಓದುವುದು ತುಂಬಾ ಒಳ್ಳೆಯದು",
          explanation: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿದ್ದೀರಿ!"
        }
      },
      fillInBlanks: {
        title: "ಖಾಲಿ ತುಂಬಿಸಿ",
        steps: [
          "📝 ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
          "👀 ಖಾಲಿಯೊಂದಿಗೆ ಇರುವ ವಾಕ್ಯವನ್ನು ನೋಡಿ",
          "🎯 ಅದನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಕಾಣೆಯಾದ ಪದದೊಂದಿಗೆ ವಾಕ್ಯವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        instruction3: "ಈಗ, ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
        instruction4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಕಾಣೆಯಾದ ಪದದೊಂದಿಗೆ ವಾಕ್ಯವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        narration3: "ಈಗ, ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ",
        narration4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        readyButton: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ",
        demo: {
          audio: "ಸೂರ್ಯ ಪ್ರಕಾಶವಾಗಿ ಹೊಳೆಯುತ್ತಿದೆ",
          sentence: "____ ಪ್ರಕಾಶವಾಗಿ ಹೊಳೆಯುತ್ತಿದೆ",
          options: ["ಕೆಲವು", "ಸೂರ್ಯ", "ಮಗ", "ಮೊತ್ತ"],
          correctAnswer: "ಸೂರ್ಯ",
          explanation: "ಪದ 'ಸೂರ್ಯ' ವಾಕ್ಯವನ್ನು ಸರಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ!"
        }
      },
      trueFalse: {
        title: "ಸತ್ಯ ಅಥವಾ ಸುಳ್ಳು",
        steps: [
          "📝 ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
          "👀 ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
          "🎯 ಸತ್ಯ ಅಥವಾ ಸುಳ್ಳು ಆರಿಸಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಹೇಳಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಿದ್ದೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        instruction3: "ಈಗ, ಈ ಹೇಳಿಕೆ ಸತ್ಯವೇ ಅಥವಾ ಸುಳ್ಳೇ ನಿರ್ಧರಿಸಿ",
        instruction4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "ಸಿದ್ಧರಾಗಿರಿ! ನೀವು ಹೇಳಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಿದ್ದೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಹೇಳಿಕೆಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        narration3: "ಈಗ, ಈ ಹೇಳಿಕೆ ಸತ್ಯವೇ ಅಥವಾ ಸುಳ್ಳೇ ನಿರ್ಧರಿಸಿ",
        narration4: "ಅದ್ಭುತ! ನೀವು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        readyButton: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ",
        demo: {
          audio: "ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ",
          statement: "ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ",
          correctAnswer: true,
          explanation: "ಸರಿ! ಆಕಾಶ ನಿಜವಾಗಿಯೂ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ."
        }
      }
    }
  },
  mr: {
    title: "एकत्रित वाक्य खेळ",
    description: "एका साहसात तीन रोमांचक वाक्य खेळांचा अनुभव घ्या!",
    games: {
      sentenceBuilder: {
        title: "वाक्य बांधकाम",
        steps: [
          "📝 गोंधळलेले शब्द पहा",
          "🖱️ योग्य क्रमाने शब्दांवर क्लिक करा",
          "📋 टप्प्याटप्प्याने तुमचे वाक्य तयार करा",
          "✅ वाक्य पूर्ण करा!"
        ],
        instruction1: "गोंधळलेले शब्द पाहण्यासाठी 'मी तयार आहे' क्लिक करा",
        instruction2: "चांगले! आता ही गोंधळलेली शब्दे पहा",
        instruction3: "आता वाक्य तयार करण्यासाठी योग्य क्रमाने शब्दांवर क्लिक करा",
        instruction4: "उत्कृष्ट! तुम्ही पूर्ण वाक्य तयार केले!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "गोंधळलेले शब्द पाहण्यासाठी मी तयार आहे क्लिक करा",
        narration2: "चांगले! आता ही गोंधळलेली शब्दे पहा",
        narration3: "आता वाक्य तयार करण्यासाठी योग्य क्रमाने शब्दांवर क्लिक करा",
        narration4: "उत्कृष्ट! तुम्ही पूर्ण वाक्य तयार केले!",
        buildSentence: "तुमचे वाक्य तयार करा!",
        readyButton: "मी तयार आहे",
        demo: {
          scrambledWords: ["चांगले", "वाचन", "खूप"],
          correctOrder: ["वाचन", "खूप", "चांगले"],
          correctSentence: "वाचन खूप चांगले",
          explanation: "परिपूर्ण! तुम्ही शब्दांची योग्य मांडणी केली!"
        }
      },
      fillInBlanks: {
        title: "रिक्त जागा भरा",
        steps: [
          "📝 वाक्य काळजीपूर्वक वाचा",
          "👀 रिक्त जागेसह वाक्य पहा",
          "🎯 ते पूर्ण करण्यासाठी योग्य शब्द निवडा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "तयार रहा! तुम्ही गहाळ शब्दासह वाक्य पाहाल. तयार असताना 'मी तयार आहे' क्लिक करा",
        instruction2: "चांगले! आता हे वाक्य काळजीपूर्वक वाचा",
        instruction3: "आता, वाक्य पूर्ण करण्यासाठी योग्य शब्द निवडा",
        instruction4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "तयार रहा! तुम्ही गहाळ शब्दासह वाक्य पाहाल. तयार असताना मी तयार आहे क्लिक करा",
        narration2: "चांगले! आता हे वाक्य काळजीपूर्वक वाचा",
        narration3: "आता, वाक्य पूर्ण करण्यासाठी योग्य शब्द निवडा",
        narration4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
        readyButton: "मी तयार आहे",
        demo: {
          audio: "सूर्य तेजस्वीपणे चमकत आहे",
          sentence: "____ तेजस्वीपणे चमकत आहे",
          options: ["काही", "सूर्य", "मुलगा", "बेरीज"],
          correctAnswer: "सूर्य",
          explanation: "शब्द 'सूर्य' वाक्य योग्यरित्या पूर्ण करतो!"
        }
      },
      trueFalse: {
        title: "खरे किंवा खोटे",
        steps: [
          "📝 विधान काळजीपूर्वक वाचा",
          "👀 विधान काळजीपूर्वक वाचा",
          "🎯 खरे किंवा खोटे निवडा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "तयार रहा! तुम्ही विधानाचे मूल्यमापन करणार आहात. तयार असताना 'मी तयार आहे' क्लिक करा",
        instruction2: "चांगले! आता हे विधान काळजीपूर्वक वाचा",
        instruction3: "आता, हे विधान खरे आहे की खोटे ठरवा",
        instruction4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "तयार रहा! तुम्ही विधानाचे मूल्यमापन करणार आहात. तयार असताना मी तयार आहे क्लिक करा",
        narration2: "चांगले! आता हे विधान काळजीपूर्वक वाचा",
        narration3: "आता, हे विधान खरे आहे की खोटे ठरवा",
        narration4: "उत्कृष्ट! तुम्ही डेमो यशस्वीरित्या पूर्ण केले!",
        readyButton: "मी तयार आहे",
        demo: {
          audio: "आकाश निळ्या रंगाचे आहे",
          statement: "आकाश निळ्या रंगाचे आहे",
          correctAnswer: true,
          explanation: "बरोबर! आकाश खरोखर निळ्या रंगाचे आहे."
        }
      }
    }
  }
};

const games: GameType[] = ['sentenceBuilder', 'fillInBlanks', 'trueFalse'];

export function CombinedSentenceGamesPreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: CombinedSentenceGamesPreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('introduction');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [currentStep, setCurrentStep] = useState(0);
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  const [nextGameName, setNextGameName] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [showTransitionText, setShowTransitionText] = useState(false);
  const [allGamesCompleted, setAllGamesCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedBooleanAnswer, setSelectedBooleanAnswer] = useState<boolean | null>(null);
  const [showWords, setShowWords] = useState(false);
  
  const readyButtonRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const currentGame = games[currentGameIndex];
  const audioLanguage = (selectedAudioLanguage || 'en') as keyof typeof gameInstructions;
  const contentLanguage = (selectedLanguage || 'en') as keyof typeof gameInstructions;
  const instructions = gameInstructions[contentLanguage];
  const currentGameInstructions = instructions.games[currentGame];

  // Handle introduction continue
  const handleIntroductionContinue = () => {
    setPreviewPhase('countdown');
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };

  // Wrapper for GameIntroduction component (expects different signature)
  const playIntroductionNarration = async (text: string): Promise<void> => {
    const gameName = 'Combined Sentence Games';
    try {
      await playAudio({
        gameName,
        language: audioLanguage,
        type: 'introduction'
      }, text);
    } catch (error) {
      console.warn('Introduction audio playback failed, using TTS fallback:', error);
      await playTTS(text, audioLanguage);
    }
  };

  // Play narration using audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    setIsPlayingNarration(true);
    
    const gameName = 'Combined Sentence Games';
    const subGameMap = {
      'sentenceBuilder': 'Sentence Builder',
      'fillInBlanks': 'Fill in Blanks', 
      'trueFalse': 'True or False'
    };
    const subGame = subGameMap[currentGame];
    
    try {
      await playAudio({
        gameName,
        subGame,
        language: audioLanguage,
        type: 'narration',
        step
      }, text);
    } catch (error) {
      console.warn('Audio playback failed, using TTS fallback:', error);
      await playTTS(text, audioLanguage);
    }
    
    setIsPlayingNarration(false);
  };

  // Play audio sound
  const playAudioSound = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const langForTTS = audioLanguage as Language;
    utterance.lang = langForTTS === 'te' ? 'te-IN' : 
                    langForTTS === 'kn' ? 'kn-IN' : 
                    langForTTS === 'mr' ? 'mr-IN' : 
                    langForTTS === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    if (!isAudioStopped()) {
      speechSynthesis.speak(utterance);
    }
  };


  // Reset feedback states when game changes
  useEffect(() => {
    setShowFeedback(false);
    setIsCorrectAnswer(false);
  }, [currentGameIndex]);

  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case 'instruction1':
      case 'waitForReady':
      case 'showWords':
      case 'instruction2':
        setCurrentStep(1);
        break;
      case 'instruction3':
      case 'waitForAnswer':
        setCurrentStep(2);
        break;
      case 'instruction4':
      case 'complete':
        setCurrentStep(3);
        break;
    }
  }, [demoStep]);

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (previewPhase === 'demo' && demoStep === 'instruction1') {
      playNarration(currentGameInstructions.narration1, 1);
      setSelectedWords([]);
      setSelectedAnswer(null);
      setSelectedBooleanAnswer(null);
      setShowFeedback(false);
      setShowWords(false);
    }
  }, [previewPhase, demoStep, currentGameInstructions.narration1, currentGameIndex]);

  // When instruction 1 narration finishes, move to appropriate wait step
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
      const timer = setTimeout(() => {
        setDemoStep('waitForReady');
        setTimeout(() => {
          readyButtonRef.current?.focus();
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration, currentGame]);


  // Handle ready button click (All games)
  const handleReadyClick = async () => {
    if (demoStep !== 'waitForReady' || hasClickedReady) return;
    
    setHasClickedReady(true);
    
    // Show content based on game type
    if (currentGame === 'sentenceBuilder') {
      setShowWords(true);
      setDemoStep('showWords');
    } else {
      setDemoStep('instruction2');
    }
    
    // Wait a moment then show instruction 2
    setTimeout(async () => {
      setDemoStep('instruction2');
      await playNarration(currentGameInstructions.narration2, 2);
      
      setDemoStep('instruction3');
      await playNarration(currentGameInstructions.narration3, 3);
      
      setDemoStep('waitForAnswer');
      
      setTimeout(() => {
        optionsRef.current?.focus();
      }, 100);
    }, 1500);
  };

  // Handle word click (Sentence Builder)
  const handleWordClick = async (word: string) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    if (currentGame !== 'sentenceBuilder') return;
    
    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);
    
    if ('correctOrder' in currentGameInstructions.demo && newSelectedWords.length === currentGameInstructions.demo.correctOrder.length) {
      setShowFeedback(true);
      
      const isCorrect = JSON.stringify(newSelectedWords) === JSON.stringify(currentGameInstructions.demo.correctOrder);
      setIsCorrectAnswer(isCorrect);
      
      if (isCorrect) {
        await playSuccessSound(audioLanguage, { exactLanguage: true });
        
        setDemoStep('instruction4');
        await playNarration(currentGameInstructions.narration4, 4);
        
        const newCompletionCount = completionCount + 1;
        setCompletionCount(newCompletionCount);
        
        setDemoStep('complete');
        
        // Wait a moment, then move to next game or restart cycle
        setTimeout(() => {
          if (currentGameIndex < games.length - 1) {
            // Move to next game
            moveToNextGame();
          } else {
            // All games completed, show completion page
            setHasCompletedFirstCycle(true);
            setPreviewPhase('completion');
          }
        }, 2000);
      } else {
        await playFailureSound(audioLanguage, { exactLanguage: true });
        
        setTimeout(() => {
          setShowFeedback(false);
          setSelectedWords([]);
        }, 2000);
      }
    }
  };

  // Handle option click (Fill in Blanks)
  const handleOptionClick = async (option: string) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    if (currentGame !== 'fillInBlanks') return;
    
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    const isCorrect = 'correctAnswer' in currentGameInstructions.demo && option === currentGameInstructions.demo.correctAnswer;
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      
      setDemoStep('instruction4');
      await playNarration(currentGameInstructions.narration4, 4);
      
      const newCompletionCount = completionCount + 1;
      setCompletionCount(newCompletionCount);
      
      setDemoStep('complete');
      
        // Wait a moment, then move to next game or show completion page
        setTimeout(() => {
          if (currentGameIndex < games.length - 1) {
            // Move to next game
            moveToNextGame();
          } else {
            // All games completed, show completion page
            setHasCompletedFirstCycle(true);
            setPreviewPhase('completion');
          }
        }, 2000);
    } else {
      await playFailureSound(audioLanguage, { exactLanguage: true });
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Handle true/false click
  const handleBooleanClick = async (option: boolean) => {
    if (demoStep !== 'waitForAnswer' || showFeedback) return;
    if (currentGame !== 'trueFalse') return;
    
    setSelectedBooleanAnswer(option);
    setShowFeedback(true);
    
    const isCorrect = 'correctAnswer' in currentGameInstructions.demo && option === currentGameInstructions.demo.correctAnswer;
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      
      setDemoStep('instruction4');
      await playNarration(currentGameInstructions.narration4, 4);
      
      const newCompletionCount = completionCount + 1;
      setCompletionCount(newCompletionCount);
      
      setDemoStep('complete');
      
        // Wait a moment, then move to next game or show completion page
        setTimeout(() => {
          if (currentGameIndex < games.length - 1) {
            // Move to next game
            moveToNextGame();
          } else {
            // All games completed, show completion page
            setHasCompletedFirstCycle(true);
            setPreviewPhase('completion');
          }
        }, 2000);
    } else {
      await playFailureSound(audioLanguage, { exactLanguage: true });
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedBooleanAnswer(null);
      }, 2000);
    }
  };

  // Restart current game demo
  const restartCurrentGame = () => {
    // Stop any ongoing audio/TTS before resetting state
    stopAllAudio();
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setDemoStep('instruction1');
    setCurrentStep(0);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setSelectedWords([]);
    setSelectedAnswer(null);
    setSelectedBooleanAnswer(null);
    setShowWords(false);
  };

  // Restart current game demo
  const restartDemo = () => {
    // Stop any ongoing audio/TTS before resetting state
    stopAllAudio();
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setDemoStep('instruction1');
    setCurrentStep(0);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedReady(false);
    setSelectedWords([]);
    setSelectedAnswer(null);
    setSelectedBooleanAnswer(null);
    setShowWords(false);
    setCompletionCount(0);
  };

  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    onStartGame();
  };

  // Back handler
  const handleBack = () => {
    stopAllAudio();
    onBack();
  };

  // Move to next game
  const moveToNextGame = () => {
    if (currentGameIndex < games.length - 1) {
      // Ensure audio from current game is fully stopped before switching
      stopAllAudio();
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      // Set the next game name before showing transition
      const nextGame = games[currentGameIndex + 1] as GameType;
      setNextGameName(instructions.games[nextGame].title);
      
      setIsTransitioning(true);
      setShowTransitionText(true);
      
      setTimeout(() => {
        setCurrentGameIndex(prev => prev + 1);
        restartDemo();
        setIsTransitioning(false);
        
        setTimeout(() => {
          setShowTransitionText(false);
          setNextGameName('');
        }, 1000);
      }, 1000);
    } else {
      // All games completed
      setAllGamesCompleted(true);
      setDemoStep('complete');
    }
  };

  // Help button click - restart all demos from introduction
  const handleHelpClick = () => {
    stopAllAudio();
    setPreviewPhase('introduction');
    setCurrentGameIndex(0);
    setAllGamesCompleted(false);
    setSuccessfulRuns(0);
    setHasCompletedFirstCycle(false);
    restartCurrentGame();
  };

  // Manual navigation - Next game
  const handleNextGame = () => {
    if (currentGameIndex < games.length - 1 && !isTransitioning) {
      // Stop any ongoing audio/TTS when user manually navigates
      stopAllAudio();
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      // Set the next game name before showing transition
      const nextGame = games[currentGameIndex + 1] as GameType;
      setNextGameName(instructions.games[nextGame].title);
      
      setIsTransitioning(true);
      setShowTransitionText(true);
      
      setTimeout(() => {
        setCurrentGameIndex(prev => prev + 1);
        setSuccessfulRuns(0);
        restartCurrentGame();
        setIsTransitioning(false);
        
        setTimeout(() => {
          setShowTransitionText(false);
          setNextGameName('');
        }, 1000);
      }, 1000);
    }
  };

  // Manual navigation - Previous game
  const handlePreviousGame = () => {
    if (currentGameIndex > 0 && !isTransitioning) {
      // Stop any ongoing audio/TTS when user manually navigates
      stopAllAudio();
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      // Set the previous game name before showing transition
      const previousGame = games[currentGameIndex - 1] as GameType;
      setNextGameName(instructions.games[previousGame].title);
      
      setIsTransitioning(true);
      setShowTransitionText(true);
      
      setTimeout(() => {
        setCurrentGameIndex(prev => prev - 1);
        setSuccessfulRuns(0);
        restartCurrentGame();
        setIsTransitioning(false);
        
        setTimeout(() => {
          setShowTransitionText(false);
          setNextGameName('');
        }, 1000);
      }, 1000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const showReadyButton = (demoStep === 'waitForReady' || demoStep === 'instruction1') && !hasClickedReady;
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4';
  const showWordsDisplay = currentGame === 'sentenceBuilder' && showWords && (demoStep === 'showWords' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions;
  const showSentenceDisplay = currentGame === 'fillInBlanks' && (demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions;
  const showStatementDisplay = currentGame === 'trueFalse' && (demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions;

  // Render introduction phase
  if (previewPhase === 'introduction') {
    return (
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {!hideHeader && (
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <Button
                onClick={handleBack}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मागे'}
              </Button>
            </div>
          )}
          <GameIntroduction
            title={instructions.title}
            description={instructions.description}
            activityCount={games.length}
            onContinue={handleIntroductionContinue}
            playNarration={playIntroductionNarration}
            customIcon={<FileText className="h-10 w-10 text-white" />}
          />
        </div>
      </div>
    );
  }

  // Render countdown phase
  if (previewPhase === 'countdown') {
    return (
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {!hideHeader && (
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <Button
                onClick={handleBack}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मागे'}
              </Button>
            </div>
          )}
          <CountdownTimer
            initialCount={3}
            onComplete={handleCountdownComplete}
          />
        </div>
      </div>
    );
  }

  // Render completion phase
  if (previewPhase === 'completion') {
    const handleStartGame = () => {
      stopAllAudio();
      onStartGame();
    };

    const handleReplayDemo = () => {
      stopAllAudio();
      setCurrentGameIndex(0);
      setSuccessfulRuns(0);
      setHasCompletedFirstCycle(false);
      setPreviewPhase('countdown');
    };

    return (
      <DemoCompletionScreen
        language={contentLanguage}
        onStartGame={handleStartGame}
        onReplayDemo={handleReplayDemo}
        onBack={handleBack}
        hideHeader={hideHeader}
        totalDemos={games.length}
      />
    );
  }

  // Render demo phase
  return (
    <>
      <style>
        {`
          @keyframes pointToButton {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(10px);
            }
          }
        `}
      </style>
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
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
            
            <div className="text-center flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {instructions.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
                <Clock className="h-3 w-3" />
              <span>
                  {contentLanguage === 'en' ? 'Level' : contentLanguage === 'te' ? 'స్థాయి' : contentLanguage === 'kn' ? 'ಮಟ್ಟ' : 'पातळी'} {level} • {difficulty.toLowerCase()} • {estimatedTime}
              </span>
              </div>
            </div>

            {allGamesCompleted ? (
              <Button
                onClick={handleHelpClick}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {contentLanguage === 'en' ? 'Replay Demo' : contentLanguage === 'te' ? 'డెమోను మళ్లీ ఆడండి' : contentLanguage === 'kn' ? 'ಡೆಮೊವನ್ನು ಮತ್ತೆ ಆಡಿ' : 'डेमो पुन्हा खेळा'}
              </Button>
            ) : (
              <div className="w-16"></div>
            )}
          </div>
        )}

        {/* Main Content Card */}
        <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col rounded-2xl min-h-0">
          {/* How to Play Section - Centered */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold text-gray-800">
                  {contentLanguage === 'en' ? 'How to Play' : contentLanguage === 'te' ? 'ఎలా ఆడాలి' : contentLanguage === 'kn' ? 'ಹೇಗೆ ಆಡುವುದು' : 'कसे खेळायचे'}
                </h2>
                <div className="text-xs text-gray-600 mt-1">
                  {currentGameInstructions.title}
                </div>
              </div>
            </div>
            <Progress value={((currentStep + 1) / currentGameInstructions.steps.length) * 100} className="h-1.5 w-64" />
          </div>

          {/* Demo Panel - Full width */}
          <div className="flex-1 overflow-hidden">
              <div className="bg-blue-50 rounded-lg p-3 text-center flex flex-col justify-start relative h-[500px]">
                {/* Transition Text */}
                {showTransitionText && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 backdrop-blur-sm z-10 animate-fade-in">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800 mb-2">
                        {contentLanguage === 'en' ? 'Next Game:' : contentLanguage === 'te' ? 'తదుపరి గేమ్:' : contentLanguage === 'kn' ? 'ಮುಂದಿನ ಆಟ:' : 'पुढील खेळ:'}
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        {nextGameName}
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content Container */}
                <div className="flex flex-col h-full justify-center items-center space-y-2 py-3">
                   {/* Ready Button (All games) - Always visible but disabled initially */}
                   {showReadyButton && !showTransitionText && (
                     <div className="flex flex-col items-center justify-center space-y-1">
                       <div 
                         ref={readyButtonRef}
                         className={`inline-block p-2 sm:p-3 rounded-lg transition-all transform font-semibold ${
                           demoStep === 'waitForReady' 
                             ? 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:scale-105 ring-4 ring-blue-400 ring-opacity-50 animate-pulse' 
                             : demoStep === 'instruction1'
                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                             : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:scale-105'
                         }`}
                         onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                         tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                       >
                         {'readyButton' in currentGameInstructions ? currentGameInstructions.readyButton : (contentLanguage === 'en' ? "I'm Ready" : contentLanguage === 'te' ? 'నేను సిద్ధంగా ఉన్నాను' : contentLanguage === 'kn' ? 'ನಾನು ಸಿద్ధವಾಗಿದ್ದೇನೆ' : 'मी तयार आहे')}
                       </div>
                       {demoStep === 'waitForReady' && (
                         <div className="text-center animate-bounce">
                           <span className="text-2xl">👆</span>
                         </div>
                       )}
                     </div>
                   )}


                  {/* Scrambled Words Display (Sentence Builder) */}
                  {showWordsDisplay && !showTransitionText && (
                    <div className="flex flex-col items-center justify-center space-y-2 animate-fade-in">
                    <div className="inline-block p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex flex-wrap gap-2">
                        {'scrambledWords' in currentGameInstructions.demo && currentGameInstructions.demo.scrambledWords.map((word, index) => (
                          <span key={index} className="text-2xl sm:text-3xl font-bold text-gray-800 px-2 py-1 bg-white rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                  {/* Sentence Display (Fill in Blanks) */}
                  {currentGame === 'fillInBlanks' && showSentenceDisplay && !showTransitionText && (
                    <div className="flex flex-col items-center justify-center space-y-2 animate-fade-in">
                      <div className="inline-block p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                        <div className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
                          {'sentence' in currentGameInstructions.demo ? currentGameInstructions.demo.sentence : ''}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statement Display (True/False) */}
                  {showStatementDisplay && !showTransitionText && (
                    <div className="flex flex-col items-center justify-center space-y-2 animate-fade-in">
                      <div className="inline-block p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                        <div className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
                          {'statement' in currentGameInstructions.demo ? currentGameInstructions.demo.statement : ''}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Options/Sentence Building Area */}
                {showOptions && !showTransitionText && (
                  <div className="animate-fade-in">
                    {/* Sentence Builder */}
                    {currentGame === 'sentenceBuilder' && (
                      <SentenceGameCore
                        currentQuestion={{
                          words: 'scrambledWords' in currentGameInstructions.demo ? currentGameInstructions.demo.scrambledWords : [],
                          correct: 'correctOrder' in currentGameInstructions.demo ? currentGameInstructions.demo.correctOrder : [],
                          language: contentLanguage,
                          complexity: 'basic',
                          level: 1
                        }}
                        mode="preview"
                        selectedLanguage={contentLanguage}
                        arrangedWords={selectedWords}
                        availableWords={'scrambledWords' in currentGameInstructions.demo ? 
                          currentGameInstructions.demo.scrambledWords.filter((word: string) => !selectedWords.includes(word)) : []}
                        showFeedback={showFeedback}
                        isCorrect={isCorrectAnswer}
                        isPreview={true}
                        demoStep={demoStep}
                        showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                                  disabled={demoStep !== 'waitForAnswer' || showFeedback}
                        onWordClick={(word) => handleWordClick(word)}
                        onRemoveWord={() => {}}
                        onCheckAnswer={() => {}}
                        onContinue={() => {}}
                      />
                    )}

                    {/* Fill in Blanks */}
                    {currentGame === 'fillInBlanks' && (
                      <FillInBlanksGameCore
                        currentQuestion={{
                          sentence: 'sentence' in currentGameInstructions.demo ? currentGameInstructions.demo.sentence : '',
                          missingWord: 'correctAnswer' in currentGameInstructions.demo ? currentGameInstructions.demo.correctAnswer as string : '',
                          correctAnswer: 'correctAnswer' in currentGameInstructions.demo ? currentGameInstructions.demo.correctAnswer as string : '',
                          options: 'options' in currentGameInstructions.demo ? currentGameInstructions.demo.options : [],
                          language: contentLanguage,
                          complexity: 'basic',
                          level: 1
                        }}
                        mode="preview"
                        selectedLanguage={contentLanguage}
                        selectedAnswer={selectedAnswer}
                        showFeedback={showFeedback}
                        isCorrect={isCorrectAnswer}
                        isPreview={true}
                        demoStep={demoStep}
                        showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                                  disabled={demoStep !== 'waitForAnswer' || showFeedback}
                        onAnswerSelect={(answer) => handleOptionClick(answer)}
                        onCheckAnswer={() => {}}
                        onContinue={() => {}}
                      />
                    )}

                    {/* True/False */}
                    {currentGame === 'trueFalse' && (
                      <TrueFalseGameCore
                        currentQuestion={{
                          statement: 'statement' in currentGameInstructions.demo ? currentGameInstructions.demo.statement : '',
                          isTrue: 'correctAnswer' in currentGameInstructions.demo ? currentGameInstructions.demo.correctAnswer as boolean : false
                        }}
                        mode="preview"
                        selectedLanguage={contentLanguage}
                        selectedAnswer={selectedBooleanAnswer}
                        showFeedback={showFeedback}
                        isCorrect={isCorrectAnswer}
                        isPreview={true}
                        demoStep={demoStep}
                        showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                                  disabled={demoStep !== 'waitForAnswer' || showFeedback}
                        onAnswerSelect={(answer) => handleBooleanClick(answer)}
                        onCheckAnswer={() => {}}
                        onContinue={() => {}}
                      />
                    )}
                          </div>
                )}
                </div>
              </div>
            </div>

          {/* Bottom Section - All buttons in one row */}
          <div className="grid grid-cols-3 items-center gap-3 px-4 mt-auto flex-shrink-0">
            {/* Skip Demo Button */}
            <div className="flex justify-start">
              <Button
                onClick={handleSkipDemo}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                {contentLanguage === 'en' ? 'Skip Demo' : contentLanguage === 'te' ? 'డెమోను దాటవేయి' : contentLanguage === 'kn' ? 'ಡೆಮೊವನ್ನು ಬಿಟ್ಟುಬಿಡಿ' : 'डेमो वगळा'}
              </Button>
            </div>

            {/* Center - Previous/Next Navigation - Truly Centered */}
            <div className="flex items-center justify-center gap-3">
                {/* Previous Button */}
                <Button
                  onClick={handlePreviousGame}
                  disabled={currentGameIndex === 0 || isTransitioning}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-2 rounded-full border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    {contentLanguage === 'en' ? 'Previous' : contentLanguage === 'te' ? 'మునుపటి' : contentLanguage === 'kn' ? 'ಹಿಂದಿನ' : 'मागील'}
                  </span>
                </Button>

                {/* Game Indicators */}
                <div className="flex items-center gap-2">
                  {games.map((gameKey, index) => {
                    const isActive = index === currentGameIndex;
                    const isCompleted = index < currentGameIndex;
                    
                    return (
                      <div
                        key={gameKey}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500 scale-125' 
                            : isCompleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNextGame}
                  disabled={currentGameIndex === games.length - 1 || isTransitioning}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-2 rounded-full border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <span className="text-sm font-medium text-blue-600">
                    {contentLanguage === 'en' ? 'Next' : contentLanguage === 'te' ? 'తదుపరి' : contentLanguage === 'kn' ? 'ಮುಂದೆ' : 'पुढील'}
                  </span>
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                </Button>
              </div>

            {/* Right Side - Start Game Button */}
            <div className="relative flex items-center justify-end gap-3">
                {/* Hand Pointer - appears when button is enabled */}
                {hasCompletedFirstCycle && (
                  <div 
                    className="text-3xl"
                    style={{
                      animation: 'pointToButton 1s ease-in-out infinite'
                    }}
                  >
                    👉
                  </div>
                )}
                
                <Button
                  onClick={onStartGame}
                  disabled={!hasCompletedFirstCycle}
                  className={`px-4 py-2 font-semibold text-sm rounded-full shadow-lg transition-all duration-300 ${
                    hasCompletedFirstCycle 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {contentLanguage === 'en' ? 'Start Game' : contentLanguage === 'te' ? 'ఆటను ప్రారంభించండి' : contentLanguage === 'kn' ? 'ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸಿ' : 'खेळ सुरू करा'}
                  {!hasCompletedFirstCycle && (
                    <span className="ml-2 text-xs">({completionCount}/3)</span>
                  )}
                </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}

export default CombinedSentenceGamesPreview;

