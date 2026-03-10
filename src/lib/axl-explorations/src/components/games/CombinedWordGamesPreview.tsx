import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Eye, Timer, Brain, ChevronLeft, ChevronRight, BookOpen, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { GameIntroduction } from "../GameIntroduction";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio, attachSlowLoadToast } from "../../utils/audioUtils";
import { ROARWordGameCore } from "./ROARWordGameCore";
import { ROARPhonemeGameCore } from "./ROARPhonemeGameCore";
import { ROARPictureVocabGameCore } from "./ROARPictureVocabGameCore";

interface CombinedWordGamesPreviewProps {
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
  | 'waitForSpeaker'    // Show speaker icon, wait for user click (Sound Match)
  | 'waitForReady'      // Show "I'm Ready" button, wait for user click (Word Detective & Picture Words)
  | 'showWord'          // Show word for a few seconds (Word Detective & Picture Words)
  | 'showTarget'        // Show target picture for Sound Match
  | 'instruction2'      // After action clicked, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

type GameType = 'wordDetective' | 'soundMatch' | 'pictureWords';

const gameInstructions = {
  en: {
    title: "Word Games",
    description: "Experience three exciting word games in one adventure!",
    games: {
      wordDetective: {
        title: "Word Detective",
        steps: [
          "📖 Look at the word carefully",
          "🤔 Think about whether it's real or fake",
          "✅ Click 'Real Word' or 'Fake Word'",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Get ready! You'll see a word. Click 'Show Word' when you're prepared",
        instruction2: "Good! Now read this word carefully",
        instruction3: "Decide: Is this a real word or a fake word?",
        instruction4: "Perfect! You identified the word correctly!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Try again!",
        narration1: "Get ready! You'll see a word. Click Show Word when you're prepared",
        narration2: "Good! Now read this word carefully",
        narration3: "Decide: Is this a real word or a fake word?",
        narration4: "Perfect! You identified the word correctly!",
        showWordButton: "Show Word",
        demo: {
          word: "CAT",
          correctAnswer: "Real Word",
          explanation: "CAT is a real word - it's an animal!"
        }
      },
      soundMatch: {
        title: "Sound Match",
        steps: [
          "🔊 Click the speaker to hear the sound",
          "👀 Look at the picture options",
          "🎯 Click the matching picture",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Click the speaker icon to hear a word sound",
        instruction2: "Good! Now look at this target picture carefully",
        instruction3: "Now find which picture starts with the same letter sound",
        instruction4: "Perfect! You matched the sounds correctly!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Try again!",
        narration1: "Click the speaker icon to hear a word sound",
        narration2: "Good! Now look at this target picture carefully",
        narration3: "Now find which picture starts with the same letter sound",
        narration4: "Perfect! You matched the sounds correctly!",
        demo: {
          target: "🍞",
          targetSound: "BREAD",
          options: ["🍊", "🚲", "4️⃣", "🦵"],
          correctIndex: 1,
          explanation: "BREAD starts with 'B' and BICYCLE also starts with 'B'!"
        }
      },
      pictureWords: {
        title: "Picture Words",
        steps: [
          "👀 Look at the picture carefully",
          "🤔 Think about what the word should be",
          "🎯 Click the correct word",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Click 'I'm Ready' to see the word",
        instruction2: "Good! Now read this word carefully",
        instruction3: "Now find which picture matches this word",
        instruction4: "Perfect! You matched the word with the correct picture!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Try again!",
        narration1: "Click I'm Ready to see the word",
        narration2: "Good! Now read this word carefully",
        narration3: "Now find which picture matches this word",
        narration4: "Perfect! You matched the word with the correct picture!",
        readyButton: "I'm Ready",
        demo: {
          word: "CAT",
          options: ["🐱", "🐶", "🐭", "🐰"],
          correctIndex: 0,
          explanation: "The word 'CAT' matches the cat picture!"
        }
      }
    }
  },
  te: {
    title: "సంయుక్త పద ఆటలు",
    description: "ఒక సాహసంలో మూడు ఉత్తేజకరమైన పద ఆటలను అనుభవించండి!",
    games: {
      wordDetective: {
        title: "పద డిటెక్టివ్",
        steps: [
          "📖 పదాన్ని జాగ్రత్తగా చూడండి",
          "🤔 అది నిజమైనదా లేదా కల్పితమైనదా ఆలోచించండి",
          "✅ 'నిజమైన పదం' లేదా 'కల్పిత పదం' క్లిక్ చేయండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "సిద్ధంగా ఉండండి! మీరు ఒక పదాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు 'పదం చూపించు' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
        instruction3: "నిర్ణయించండి: ఇది నిజమైన పదమా లేదా నకిలీ పదమా?",
        instruction4: "పర్ఫెక్ట్! మీరు పదాన్ని సరిగ్గా గుర్తించారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        narration1: "సిద్ధంగా ఉండండి! మీరు ఒక పదాన్ని చూస్తారు. సిద్ధంగా ఉన్నప్పుడు పదం చూపించు క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
        narration3: "నిర్ణయించండి: ఇది నిజమైన పదమా లేదా నకిలీ పదమా?",
        narration4: "పర్ఫెక్ట్! మీరు పదాన్ని సరిగ్గా గుర్తించారు!",
        showWordButton: "పదం చూపించు",
        demo: {
          word: "పిల్లి",
          correctAnswer: "Real Word",
          explanation: "పిల్లి ఒక నిజమైన పదం - ఇది ఒక జంతువు!"
        }
      },
      soundMatch: {
        title: "ధ్వని మ్యాచ్",
        steps: [
          "🔊 ధ్వనిని వినడానికి స్పీకర్ క్లిక్ చేయండి",
          "👀 చిత్ర ఎంపికలను చూడండి",
          "🎯 సరిపోయే చిత్రాన్ని క్లిక్ చేయండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "పద ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ లక్ష్య చిత్రాన్ని జాగ్రత్తగా చూడండి",
        instruction3: "ఇప్పుడు ఏ చిత్రం అదే అక్షర ధ్వనితో ప్రారంభమవుతుందో కనుగొనండి",
        instruction4: "పర్ఫెక్ట్! మీరు ధ్వనులను సరిగ్గా సరిపోల్చారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        narration1: "పద ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ లక్ష్య చిత్రాన్ని జాగ్రత్తగా చూడండి",
        narration3: "ఇప్పుడు ఏ చిత్రం అదే అక్షర ధ్వనితో ప్రారంభమవుతుందో కనుగొనండి",
        narration4: "పర్ఫెక్ట్! మీరు ధ్వనులను సరిగ్గా సరిపోల్చారు!",
        demo: {
          target: "🐦",
          targetSound: "పక్షి",
          options: ["📚", "🚀", "👕", "🎈"],
          correctIndex: 0,
          explanation: "పక్షి 'ప' అక్షరంతో మొదలవుతుంది మరియు పుస్తకం కూడా 'ప' అక్షరంతో మొదలవుతుంది!"
        }
      },
      pictureWords: {
        title: "చిత్ర పదాలు",
        steps: [
          "👀 చిత్రాన్ని జాగ్రత్తగా చూడండి",
          "🤔 పదం ఏమైనా అని ఆలోచించండి",
          "🎯 సరైన పదాన్ని క్లిక్ చేయండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "పదాన్ని చూడటానికి 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
        instruction3: "ఇప్పుడు ఈ పదానికి సరిపోయే చిత్రాన్ని కనుగొనండి",
        instruction4: "పర్ఫెక్ట్! మీరు పదాన్ని సరైన చిత్రంతో సరిపోల్చారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        narration1: "పదాన్ని చూడటానికి నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఈ పదాన్ని జాగ్రత్తగా చదవండి",
        narration3: "ఇప్పుడు ఈ పదానికి సరిపోయే చిత్రాన్ని కనుగొనండి",
        narration4: "పర్ఫెక్ట్! మీరు పదాన్ని సరైన చిత్రంతో సరిపోల్చారు!",
        readyButton: "నేను సిద్ధంగా ఉన్నాను",
        demo: {
          word: "పిల్లి",
          options: ["🐱", "🐶", "🐭", "🐰"],
          correctIndex: 0,
          explanation: "పదం 'పిల్లి' పిల్లి చిత్రంతో సరిపోతుంది!"
        }
      }
    }
  },
  kn: {
    title: "ಸಂಯೋಜಿತ ಪದ ಆಟಗಳು",
    description: "ಒಂದು ಸಾಹಸದಲ್ಲಿ ಮೂರು ರೋಮಾಂಚಕ ಪದ ಆಟಗಳನ್ನು ಅನುಭವಿಸಿ!",
    games: {
      wordDetective: {
        title: "ಪದ ಡಿಟೆಕ್ಟಿವ್",
        steps: [
          "📖 ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
          "🤔 ಅದು ನಿಜವಾದದ್ದು ಅಥವಾ ನಕಲಿ ಎಂದು ಯೋಚಿಸಿ",
          "✅ 'ನಿಜವಾದ ಪದ' ಅಥವಾ 'ನಕಲಿ ಪದ' ಕ್ಲಿಕ್ ಮಾಡಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ತಯಾರಾಗಿ! ನೀವು ಒಂದು ಪದವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ಪದ ತೋರಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        instruction3: "ನಿರ್ಧರಿಸಿ: ಇದು ನಿಜವಾದ ಪದವೇ ಅಥವಾ ನಕಲಿ ಪದವೇ?",
        instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        narration1: "ತಯಾರಾಗಿ! ನೀವು ಒಂದು ಪದವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ಪದ ತೋರಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        narration3: "ನಿರ್ಧರಿಸಿ: ಇದು ನಿಜವಾದ ಪದವೇ ಅಥವಾ ನಕಲಿ ಪದವೇ?",
        narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಿದ್ದೀರಿ!",
        showWordButton: "ಪದ ತೋರಿಸಿ",
        demo: {
          word: "ಬೆಕ್ಕು",
          correctAnswer: "Real Word",
          explanation: "ಬೆಕ್ಕು ಒಂದು ನಿಜವಾದ ಪದ - ಅದು ಒಂದು ಪ್ರಾಣಿ!"
        }
      },
      soundMatch: {
        title: "ಶಬ್ದ ಹೊಂದಾಣಿಕೆ",
        steps: [
          "🔊 ಧ್ವನಿಯನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
          "👀 ಚಿತ್ರ ಐಚ್ಛಿಕಗಳನ್ನು ನೋಡಿ",
          "🎯 ಹೊಂದಿಕೆಯಾಗುವ ಚಿತ್ರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ಪದ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗುರಿ ಚಿತ್ರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
        instruction3: "ಈಗ ಯಾವ ಚಿತ್ರ ಅದೇ ಅಕ್ಷರ ಶಬ್ದದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಎಂದು ಹುಡುಕಿ",
        instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಶಬ್ದಗಳನ್ನು ಸರಿಯಾಗಿ ಹೊಂದಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        narration1: "ಪದ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಗುರಿ ಚಿತ್ರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
        narration3: "ಈಗ ಯಾವ ಚಿತ್ರ ಅದೇ ಅಕ್ಷರ ಶಬ್ದದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಎಂದು ಹುಡುಕಿ",
        narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಶಬ್ದಗಳನ್ನು ಸರಿಯಾಗಿ ಹೊಂದಿಸಿದ್ದೀರಿ!",
        demo: {
          target: "🐦",
          targetSound: "ಪಕ್ಷಿ",
          options: ["📚", "🚀", "👕", "🎈"],
          correctIndex: 0,
          explanation: "ಪಕ್ಷಿ 'ಪ' ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ ಮತ್ತು ಪುಸ್ತಕ ಕೂಡ 'ಪ' ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ!"
        }
      },
      pictureWords: {
        title: "ಚಿತ್ರ ಪದಗಳು",
        steps: [
          "👀 ಚಿತ್ರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
          "🤔 ಪದವು ಏನಾಗಿರಬೇಕೆಂದು ಯೋಚಿಸಿ",
          "🎯 ಸರಿಯಾದ ಪದವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ಪದವನ್ನು ನೋಡಲು 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        instruction3: "ಈಗ ಈ ಪದಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ",
        instruction4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾದ ಚಿತ್ರದೊಂದಿಗೆ ಹೊಂದಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        narration1: "ಪದವನ್ನು ನೋಡಲು ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಈ ಪದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ",
        narration3: "ಈಗ ಈ ಪದಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯ ಚಿತ್ರವನ್ನು ಹುಡುಕಿ",
        narration4: "ಪರಿಪೂರ್ಣ! ನೀವು ಪದವನ್ನು ಸರಿಯಾದ ಚಿತ್ರದೊಂದಿಗೆ ಹೊಂದಿಸಿದ್ದೀರಿ!",
        readyButton: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ",
        demo: {
          word: "ಬೆಕ್ಕು",
          options: ["🐱", "🐶", "🐭", "🐰"],
          correctIndex: 0,
          explanation: "ಪದ 'ಬೆಕ್ಕು' ಬೆಕ್ಕಿನ ಚಿತ್ರದೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ!"
        }
      }
    }
  },
  mr: {
    title: "एकत्रित शब्द खेळ",
    description: "एका साहसात तीन रोमांचक शब्द खेळांचा अनुभव घ्या!",
    games: {
      wordDetective: {
        title: "शब्द डिटेक्टिव्ह",
        steps: [
          "📖 शब्दाकडे काळजीपूर्वक पहा",
          "🤔 तो खरा आहे की नकली याचा विचार करा",
          "✅ 'खरा शब्द' किंवा 'नकली शब्द' क्लिक करा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "तयार व्हा! तुम्हाला एक शब्द दिसेल. तयार असाल तेव्हा 'शब्द दाखवा' क्लिक करा",
        instruction2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
        instruction3: "ठरवा: हा खरा शब्द आहे की नकली?",
        instruction4: "परिपूर्ण! तुम्ही शब्दाची योग्य ओळख केली!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        narration1: "तयार व्हा! तुम्हाला एक शब्द दिसेल. तयार असाल तेव्हा शब्द दाखवा क्लिक करा",
        narration2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
        narration3: "ठरवा: हा खरा शब्द आहे की नकली?",
        narration4: "परिपूर्ण! तुम्ही शब्दाची योग्य ओळख केली!",
        showWordButton: "शब्द दाखवा",
        demo: {
          word: "मांजर",
          correctAnswer: "Real Word",
          explanation: "मांजर हा खरा शब्द आहे - तो एक प्राणी आहे!"
        }
      },
      soundMatch: {
        title: "आवाज जुळणी",
        steps: [
          "🔊 आवाज ऐकण्यासाठी स्पीकर क्लिक करा",
          "👀 चित्र पर्यायांकडे पहा",
          "🎯 जुळणारे चित्र क्लिक करा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "शब्द आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        instruction2: "चांगले! आता हे लक्ष्य चित्र काळजीपूर्वक पहा",
        instruction3: "आता कोणते चित्र त्याच अक्षराच्या आवाजाने सुरू होते ते शोधा",
        instruction4: "परिपूर्ण! तुम्ही आवाजांची योग्य जुळणी केली!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        narration1: "शब्द आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        narration2: "चांगले! आता हे लक्ष्य चित्र काळजीपूर्वक पहा",
        narration3: "आता कोणते चित्र त्याच अक्षराच्या आवाजाने सुरू होते ते शोधा",
        narration4: "परिपूर्ण! तुम्ही आवाजांची योग्य जुळणी केली!",
        demo: {
          target: "🍎",
          targetSound: "सफरचंद",
          options: ["☀️", "🚀", "👕", "📚"],
          correctIndex: 0,
          explanation: "सफरचंद 'स' अक्षराने सुरू होतो आणि सूर्य देखील 'स' अक्षराने सुरू होतो!"
        }
      },
      pictureWords: {
        title: "चित्र शब्द",
        steps: [
          "👀 चित्राकडे काळजीपूर्वक पहा",
          "🤔 शब्द काय असावा याचा विचार करा",
          "🎯 योग्य शब्द क्लिक करा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "शब्द पाहण्यासाठी 'मी तयार आहे' क्लिक करा",
        instruction2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
        instruction3: "आता या शब्दाशी जुळणारे चित्र शोधा",
        instruction4: "परिपूर्ण! तुम्ही शब्दाची योग्य चित्राशी जुळणी केली!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        narration1: "शब्द पाहण्यासाठी मी तयार आहे क्लिक करा",
        narration2: "चांगले! आता हा शब्द काळजीपूर्वक वाचा",
        narration3: "आता या शब्दाशी जुळणारे चित्र शोधा",
        narration4: "परिपूर्ण! तुम्ही शब्दाची योग्य चित्राशी जुळणी केली!",
        readyButton: "मी तयार आहे",
        demo: {
          word: "मांजर",
          options: ["🐱", "🐶", "🐭", "🐰"],
          correctIndex: 0,
          explanation: "शब्द 'मांजर' मांजराच्या चित्राशी जुळते!"
        }
      }
    }
  }
};

const games: GameType[] = ['wordDetective', 'soundMatch', 'pictureWords'];

export function CombinedWordGamesPreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: CombinedWordGamesPreviewProps) {
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
  const [hasClickedSpeaker, setHasClickedSpeaker] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [showTransitionText, setShowTransitionText] = useState(false);
  const [allGamesCompleted, setAllGamesCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [showTargetState, setShowTargetState] = useState(false);
  
  const speakerButtonRef = useRef<HTMLDivElement>(null);
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

  const handleReadyClick = async () => {
    if (demoStep !== 'waitForReady' || isPlayingNarration || hasClickedReady) return;
    
    setHasClickedReady(true);
    
    if (currentGame === 'wordDetective' || currentGame === 'pictureWords') {
      setDemoStep('showWord');
      setTimeout(async () => {
        setDemoStep('instruction2');
        setCurrentStep(1);
        await playNarration(currentGameInstructions.narration2, 2);
        
        setDemoStep('instruction3');
        setCurrentStep(2);
        await playNarration(currentGameInstructions.narration3, 3);
        
        setDemoStep('waitForAnswer');
      }, 2000);
    }
  };

  const handleSpeakerClick = async () => {
    if (demoStep !== 'waitForSpeaker' || hasClickedSpeaker) return;
    
    setHasClickedSpeaker(true);
    playWordSound((currentGameInstructions.demo as any).targetSound);
    
    // Show target image
    setShowTargetState(true);
    setDemoStep('showTarget');
    
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

  const handleOptionClick = async (option: string) => {
    if (demoStep !== 'waitForAnswer' || isPlayingNarration) return;
    
    setShowFeedback(true);
    
    let isCorrect = false;
    if (currentGame === 'wordDetective' && 'correctAnswer' in currentGameInstructions.demo) {
      isCorrect = option === currentGameInstructions.demo.correctAnswer;
    } else if (currentGame === 'soundMatch' && 'correctIndex' in currentGameInstructions.demo) {
      // For soundMatch, option is the word, so check if it matches the correct word
      const demoOptions = getDemoOptions();
      const correctWord = demoOptions[currentGameInstructions.demo.correctIndex]?.word;
      isCorrect = option === correctWord;
    } else if (currentGame === 'pictureWords' && 'correctIndex' in currentGameInstructions.demo) {
      const optionIndex = currentGameInstructions.demo.options.indexOf(option);
      isCorrect = optionIndex === currentGameInstructions.demo.correctIndex;
    }
    
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      setDemoStep('instruction4');
      setCurrentStep(3);
      await playNarration(currentGameInstructions.narration4,4);
      setShowFeedback(false);
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
      }, 500);
    } else {
      await playFailureSound(audioLanguage, { exactLanguage: true });
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

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
    setHasClickedSpeaker(false);
    setHasClickedReady(false);
    setShowTargetState(false);
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
    setHasClickedSpeaker(false);
    setHasClickedReady(false);
    setShowTargetState(false);
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

  const handleHelpClick = () => {
    stopAllAudio();
    setPreviewPhase('introduction');
    restartCurrentGame();
    setAllGamesCompleted(false);
    setCurrentGameIndex(0);
    setSuccessfulRuns(0);
    setHasCompletedFirstCycle(false);
  };

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

  // Wrapper for GameIntroduction component (expects different signature)
  const playIntroductionNarration = async (text: string): Promise<void> => {
    const gameName = 'Combined Word Games';
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

  const playNarration = async (text: string, step: number): Promise<void> => {
    setIsPlayingNarration(true);
    
    const gameName = 'Combined Word Games';
    const subGameMap = {
      'wordDetective': 'Word Detective',
      'soundMatch': 'Sound Match', 
      'pictureWords': 'Picture Words'
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

  // Get demo options with proper words for soundMatch game
  const getDemoOptions = () => {
    const lang = contentLanguage;
    const demo = (currentGameInstructions.demo as any);
    
    if (!demo || !demo.options || currentGame !== 'soundMatch') {
      return [];
    }
    
    if (lang === 'te') {
      // Telugu: పక్షి (bird) matches with 📚 (పుస్తకం - book)
      const emojiToWord: Record<string, string> = {
        "📚": "పుస్తకం",
        "🚀": "రాకెట్",
        "👕": "చొక్కా",
        "🎈": "బలూన్"
      };
      return demo.options.map((emoji: string, index: number) => ({
        image: emoji,
        word: emojiToWord[emoji] || emoji,
        phoneme: emoji === demo.options[demo.correctIndex] ? "ప" : "X"
      }));
    } else if (lang === 'kn') {
      // Kannada: ಪಕ್ಷಿ (bird) matches with 📚 (ಪುಸ್ತಕ - book)
      const emojiToWord: Record<string, string> = {
        "📚": "ಪುಸ್ತಕ",
        "🚀": "ರಾಕೆಟ್",
        "👕": "ಅಂಗಿ",
        "🎈": "ಬಲೂನ್"
      };
      return demo.options.map((emoji: string, index: number) => ({
        image: emoji,
        word: emojiToWord[emoji] || emoji,
        phoneme: emoji === demo.options[demo.correctIndex] ? "ಪ" : "X"
      }));
    } else if (lang === 'mr') {
      // Marathi: सफरचंद (apple) matches with ☀️ (सूर्य - sun)
      const emojiToWord: Record<string, string> = {
        "☀️": "सूर्य",
        "🚀": "रॉकेट",
        "👕": "शर्ट",
        "📚": "पुस्तक"
      };
      return demo.options.map((emoji: string, index: number) => ({
        image: emoji,
        word: emojiToWord[emoji] || emoji,
        phoneme: emoji === demo.options[demo.correctIndex] ? "स" : "X"
      }));
    } else {
      // English: BREAD matches with BICYCLE
      const emojiToWord: Record<string, string> = {
        "🍊": "ORANGE",
        "🚲": "BICYCLE",
        "4️⃣": "FOUR",
        "🦵": "LEG"
      };
      return demo.options.map((emoji: string, index: number) => ({
        image: emoji,
        word: emojiToWord[emoji] || emoji,
        phoneme: emoji === demo.options[demo.correctIndex] ? "B" : "X"
      }));
    }
  };

  // Play word sound - tries audio files first, then TTS (for sound-match game)
  const playWordSound = async (text: string) => {
    const language = contentLanguage as Language;
    
    // Only use audio files for soundMatch game, otherwise use TTS directly
    if (currentGame !== 'soundMatch') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 
                      language === 'kn' ? 'kn-IN' : 
                      language === 'mr' ? 'mr-IN' : 
                      language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (!isAudioStopped()) {
        speechSynthesis.speak(utterance);
      }
      return;
    }
    
    // For soundMatch game, try to play audio file from sound-match folder first
    const word = text.toLowerCase().trim();
    const audioPath = `/audio/audio-preview/combined-word-games/sound-match/${language}/${word}.wav`;
    
    try {
      const audio = new Audio(audioPath);
      attachSlowLoadToast(audio);
      
      // Try to play the audio file
      await new Promise<void>((resolve, reject) => {
        audio.onloadeddata = () => {
          audio.play().then(() => {
            audio.onended = () => resolve();
          }).catch(() => {
            // If playback fails, fall through to TTS
            reject();
          });
        };
        
        audio.onerror = () => {
          // If file doesn't exist or fails to load, fall through to TTS
          reject();
        };
        
        // Set a timeout to prevent hanging
        setTimeout(() => {
          if (!audio.ended && audio.readyState < 2) {
            reject();
          }
        }, 2000);
      });
      
      // Successfully played audio file
      return;
    } catch (error) {
      // Fall back to TTS if audio file doesn't exist or fails
      console.warn(`Audio file not found: ${audioPath}, falling back to TTS`);
    }
    
    // Fallback to TTS
    const utterance = new SpeechSynthesisUtterance(text);
    const langForTTS = language as Language;
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
    setShowTargetState(false);
  }, [currentGameIndex]);

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (previewPhase === 'demo' && demoStep === 'instruction1') {
      playNarration(currentGameInstructions.narration1, 1);
    }
  }, [previewPhase, demoStep, currentGameInstructions.narration1, currentGameIndex]);

  // When instruction 1 narration finishes, move to appropriate wait step
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
      const timer = setTimeout(() => {
        if (currentGame === 'soundMatch') {
          setDemoStep('waitForSpeaker');
        } else if (currentGame === 'wordDetective' || currentGame === 'pictureWords') {
          setDemoStep('waitForReady');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration, currentGame]);

  // Focus management for accessibility
  useEffect(() => {
    if (speakerButtonRef.current && (demoStep === 'waitForReady' || demoStep === 'waitForSpeaker')) {
      speakerButtonRef.current.focus();
    }
  }, [demoStep]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const showSpeaker = currentGame === 'soundMatch' && (demoStep === 'waitForSpeaker' || demoStep === 'instruction1');
  const showReadyButton = (currentGame === 'wordDetective' || currentGame === 'pictureWords') && (demoStep === 'waitForReady' || demoStep === 'instruction1') && !hasClickedReady;
  const showWord = (currentGame === 'wordDetective' && (demoStep === 'showWord' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4')) || (currentGame === 'pictureWords' && (demoStep === 'showWord' || demoStep === 'instruction2' || demoStep === 'instruction3' || demoStep === 'waitForAnswer' || demoStep === 'instruction4'));
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete';
  const showTarget = currentGame === 'soundMatch' && showTargetState && (demoStep === 'showTarget' || demoStep === 'instruction2' || demoStep === 'instruction3') && !showOptions;

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
             customIcon={<BookOpen className="h-10 w-10 text-white" />}
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

            <div className="w-16"></div>
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
              <div className="bg-blue-50 rounded-lg p-3 text-center flex flex-col justify-start relative h-[450px] pb-6 overflow-y-auto">
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
                <div className="flex flex-col h-full justify-start space-y-1 py-2">
                  
                    {!showTransitionText && (
                      <>
                        {/* Show Word Button for Word Detective and Picture Words */}
                        {showReadyButton && (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-center mb-6">
                              <div className="text-3xl mb-2">
                                <Eye className={`h-16 w-16 mx-auto transition-colors ${
                          demoStep === 'waitForReady' 
                                    ? 'text-blue-600 animate-pulse' 
                            : demoStep === 'instruction1'
                                    ? 'text-gray-400'
                                    : 'text-blue-600'
                                }`} />
                              </div>
                              <Button
                        onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                                disabled={demoStep !== 'waitForReady'}
                                className={`px-6 py-3 font-bold text-base rounded-full shadow-lg transition-all duration-300 ${
                                  demoStep === 'waitForReady' 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform ring-4 ring-blue-400 ring-opacity-50' 
                                    : demoStep === 'instruction1'
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform'
                                }`}
                        tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                      >
                                {(currentGameInstructions as any).showWordButton || 'Show Word'}
                              </Button>
                      {demoStep === 'waitForReady' && (
                                <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                                  <span className="text-xl">👆</span>
                        </div>
                      )}
                    </div>
                    </div>
                  )}

                        {/* Speaker Button for Sound Match */}
                        {showSpeaker && (
                          <div className="flex flex-col items-center justify-start h-full pt-8">
                            <div className="text-center">
                              <div className="mb-3">
                                <div 
                                  className={`inline-block p-2 sm:p-3 rounded-lg cursor-pointer transition-all transform ${
                          demoStep === 'waitForSpeaker' 
                                      ? 'bg-blue-100 hover:bg-blue-200 hover:scale-110 ring-4 ring-blue-400 ring-opacity-50 animate-pulse' 
                            : demoStep === 'instruction1'
                            ? 'bg-gray-100 cursor-not-allowed opacity-50'
                                      : 'bg-blue-100 hover:bg-blue-200 hover:scale-110'
                        }`}
                        onClick={demoStep === 'waitForSpeaker' ? handleSpeakerClick : undefined}
                        tabIndex={demoStep === 'waitForSpeaker' ? 0 : -1}
                      >
                        <span className="text-xl sm:text-2xl">🔊</span>
                                </div>
                      </div>
                      {demoStep === 'waitForSpeaker' && (
                                <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                                  <span className="text-xl">👆</span>
                        </div>
                      )}
                      </div>
                    </div>
                  )}

                        {currentGame === 'wordDetective' && !showReadyButton && (
                          <>
                          <ROARWordGameCore
                          currentQuestion={{
                            word: (currentGameInstructions as any).demo.word || '',
                            isReal: (currentGameInstructions as any).demo.correctAnswer === 'Real Word',
                            complexity: 'easy',
                            language: contentLanguage
                          }}
                          mode="preview"
                          selectedLanguage={contentLanguage}
                          showFeedback={showFeedback}
                          isCorrect={isCorrectAnswer}
                          selectedAnswer={null}
                          isPreview={true}
                          demoStep={demoStep}
                          showHandPointer={showOptions && demoStep === 'waitForAnswer' && !showFeedback}
                          disabled={!(demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete') || showFeedback}
                          onAnswerSelect={(isReal) => handleOptionClick(isReal ? 'Real Word' : 'Fake Word')}
                          className="bg-transparent shadow-none border-0 p-0 h-full"
                        />
                    
                        {/* {showFeedback && (
                          <div className="text-center animate-fade-in">
                            <div className={isCorrectAnswer ? 'text-green-600' : 'text-red-600'}>
                              <p className="text-lg sm:text-xl font-bold">
                                {isCorrectAnswer ? '🎉 Correct!' : '😢 Oops! Wrong!'}
                              </p>
                            </div>
                          </div>
                        )} */}
                        
                      </>
                      )}

                      {currentGame === 'soundMatch' && !showSpeaker && (
                        <>
                          {/* Target Display - Show after speaker click */}
                          {showTarget && (
                            <div className="flex flex-col items-center justify-start animate-fade-in pt-4">
                              <div className="inline-block p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                                <div className="text-4xl sm:text-5xl">{(currentGameInstructions as any).demo.target}</div>
                      </div>
                          </div>
                        )}
                        
                          {/* Options Grid - Show after instruction 3 */}
                          {showOptions && (
                            <ROARPhonemeGameCore
                              currentQuestion={{
                                target: {
                                  image: (currentGameInstructions as any).demo.target || '',
                                  word: (currentGameInstructions as any).demo.targetSound || '',
                                  phoneme: ((currentGameInstructions as any).demo.targetSound || '').charAt(0).toUpperCase() || 'B'
                                },
                                options: getDemoOptions(),
                                audio: (currentGameInstructions as any).demo.targetSound || '',
                                complexity: 'easy'
                              }}
                              mode="preview"
                              selectedLanguage={contentLanguage}
                              showFeedback={showFeedback}
                              isCorrect={isCorrectAnswer}
                              selectedOption={null}
                              isPreview={true}
                              demoStep={demoStep}
                              showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                              disabled={demoStep !== 'waitForAnswer'}
                              onOptionSelect={(optionWord) => handleOptionClick(optionWord)}
                              onContinue={() => {}}
                              className="bg-transparent shadow-none border-0 p-0 h-full"
                            />
                          )}
                            </>
                          )}
                          
                        {currentGame === 'pictureWords' && !showReadyButton && (
                          <ROARPictureVocabGameCore
                          currentQuestion={{
                            target: {
                              image: '🐱', // Default image for demo
                              word: (currentGameInstructions as any).demo.word || '',
                              category: 'animals'
                            },
                            options: (currentGameInstructions as any).demo.options?.map((option: string, index: number) => ({
                              image: option,
                              word: option,
                              category: 'animals'
                            })) || [],
                            audio: (currentGameInstructions as any).demo.word || '',
                            complexity: 'easy',
                            language: contentLanguage
                          }}
                          mode="preview"
                          selectedLanguage={contentLanguage}
                          showFeedback={showFeedback}
                          isCorrect={isCorrectAnswer}
                          selectedOption={null}
                          isPreview={true}
                          demoStep={demoStep}
                          showHandPointer={showOptions && demoStep === 'waitForAnswer' && !showFeedback}
                          disabled={!(demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete') || showFeedback}
                          onOptionSelect={(optionWord) => handleOptionClick(optionWord)}
                          className="bg-transparent shadow-none border-0 p-0 h-full"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - All buttons in one row */}
            <div className="grid grid-cols-3 items-center gap-3 px-4 mt-auto flex-shrink-0">
               {/* Left Side - Skip Demo Button */}
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

               {/* Right Side - Placeholder */}
               <div className="w-24"></div>
             
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}

export default CombinedWordGamesPreview;