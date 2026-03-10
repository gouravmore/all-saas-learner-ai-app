import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowLeft, Volume2, Sparkles, Clock, CheckCircle, Gamepad2, RotateCcw, Eye, Timer, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { GameIntroduction } from "../GameIntroduction";
import { CountdownTimer } from "../CountdownTimer";
import { DemoCompletionScreen } from "../DemoCompletionScreen";
import { playAudio, playTTS, playSuccessSound, playFailureSound, stopAllAudio, isAudioStopped, trackAudio, attachSlowLoadToast } from "../../utils/audioUtils";
import { LetterHuntGameCore } from "./LetterHuntGameCore";
import { ROARRapidVisualGameCore } from "./ROARRapidVisualGameCore";
import { MemoryGameCore } from "./MemoryGameCore";

interface CombinedLetterGamesPreviewProps {
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
  | 'waitForSpeaker'    // Show speaker icon, wait for user click (Letter Hunt)
  | 'waitForReady'      // Show "I'm Ready" button, wait for user click (Quick Sight & Memory)
  | 'showTarget'        // Show target letter with timer (Quick Sight)
  | 'showSequence'      // Show sequence for a few seconds (Memory)
  | 'instruction2'      // After action clicked, show instruction 2, play narration
  | 'instruction3'      // After instruction 2, show instruction 3, play narration
  | 'waitForAnswer'     // Show options, wait for user to select
  | 'waitForInput'      // Show input area for sequence building (Memory)
  | 'wrongAnswer'       // User selected wrong answer
  | 'instruction4'      // After correct answer, show final instruction
  | 'complete';         // Demo run complete

type GameType = 'letterHunt' | 'quickSight' | 'memoryChallenge';

const gameInstructions = {
  en: {
    title: "Letter Games",
    description: "Experience three exciting letter games in one adventure!",
    games: {
      letterHunt: {
        title: "Letter Hunt",
        steps: [
          "🔊 Click the speaker to hear the letter sound",
          "👀 Look at all the letter options",
          "🎯 Click on the correct letter",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Click the speaker icon to hear the letter sound",
        instruction2: "Listen carefully to the letter sound",
        instruction3: "Now, click on the matching letter from the options below",
        instruction4: "Great job! You've completed the Letter Hunt demo!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        narration1: "Click the speaker icon to hear the letter sound",
        narration2: "Listen carefully to the letter sound",
        narration3: "Now, click on the matching letter from the options below",
        narration4: "Great job! You've completed the Letter Hunt demo!",
        demo: {
          audio: "A",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          explanation: "The sound 'A' matches the letter A!"
        }
      },
      quickSight: {
        title: "Quick Sight",
        steps: [
          "👁️ Look at the target letter carefully",
          "⏱️ Remember it before time runs out",
          "🔍 Find the letter position in the grid",
          "✨ Click the correct position!"
        ],
        instruction1: "Get ready! You'll see a target letter. Click 'I'm Ready' when you're prepared",
        instruction2: "Good! Now remember where that letter was",
        instruction3: "Now find the target letter in the grid below",
        instruction4: "Excellent! You found the correct position!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        readyButton: "I'm Ready",
        narration1: "Get ready! You'll see a target letter. Click I'm Ready when you're prepared",
        narration2: "Good! Now remember where that letter was",
        narration3: "Now find the target letter in the grid below",
        narration4: "Excellent! You found the correct position!",
        rememberText: "Remember this letter!",
        findPositionText: "Find the Letter Position",
        demo: {
          target: "A",
          options: ["A", "B", "C", "D", "E", "F"],
          correctPosition: 0,
          explanation: "The letter 'A' was at position 1!"
        }
      },
      memoryChallenge: {
        title: "Memory Challenge",
        steps: [
          "👀 Watch the letter sequence carefully",
          "🧠 Remember the order of letters",
          "🎯 Click letters in the correct sequence",
          "✨ Get points for correct answers!"
        ],
        instruction1: "Get ready! You'll see a sequence of letters. Click 'I'm Ready' when prepared",
        instruction2: "Good! Now remember that sequence",
        instruction3: "Now recreate the sequence by clicking the letters in order",
        instruction4: "Perfect! You remembered the sequence correctly!",
        successMessage: "🎉 Correct!",
        failureMessage: "😢 Oops! Wrong!",
        readyButton: "I'm Ready",
        checkButton: "Check Sequence",
        narration1: "Get ready! You'll see a sequence of letters. Click I'm Ready when prepared",
        narration2: "Good! Now remember that sequence",
        narration3: "Now recreate the sequence by clicking the letters in order",
        narration4: "Perfect! You remembered the sequence correctly!",
        rememberText: "Watch & Remember",
        clickLettersText: "Click letters below...",
        whatWasSequence: "What was the sequence?",
        demo: {
          sequence: ["A", "B", "C"],
          options: ["A", "B", "C", "D", "E", "F"],
        }
      }
    }
  },
  te: {
    title: "సంయుక్త అక్షర ఆటలు",
    description: "ఒక సాహసంలో మూడు ఉత్తేజకరమైన అక్షర ఆటలను అనుభవించండి!",
    games: {
      letterHunt: {
        title: "అక్షర వేట",
        steps: [
          "🔊 స్పీకర్‌ను క్లిక్ చేసి అక్షర ధ్వనిని వినండి",
          "👀 అన్ని అక్షర ఎంపికలను చూడండి",
          "🎯 సరైన అక్షరాన్ని క్లిక్ చేయండి",
          "✨ సరైన సమాధానాలకు పాయింట్లు పొందండి!"
        ],
        instruction1: "అక్షర ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        instruction2: "అక్షర ధ్వనిని జాగ్రత్తగా వినండి",
        instruction3: "ఇప్పుడు, క్రింది ఎంపికల నుండి సరిపోయే అక్షరంపై క్లిక్ చేయండి",
        instruction4: "బాగా చేసారు! మీరు అక్షర వేట డెమోను పూర్తి చేసారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        narration1: "అక్షర ధ్వనిని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        narration2: "అక్షర ధ్వనిని జాగ్రత్తగా వినండి",
        narration3: "ఇప్పుడు, క్రింది ఎంపికల నుండి సరిపోయే అక్షరంపై క్లిక్ చేయండి",
        narration4: "బాగా చేసారు! మీరు అక్షర వేట డెమోను పూర్తి చేసారు!",
        demo: {
          audio: "అ",
          options: ["అ", "ఆ", "ఇ", "ఈ"],
          correctAnswer: "అ",
          explanation: "ధ్వని 'అ' అక్షరం 'అ'కు సరిపోతుంది!"
        }
      },
      quickSight: {
        title: "ROAR రాపిడ్ విజువల్",
        steps: [
          "👁️ లక్ష్య అక్షరాన్ని జాగ్రత్తగా చూడండి",
          "⏱️ సమయం ముగిసే ముందు దానిని గుర్తుంచుకోండి",
          "🔍 గ్రిడ్‌లో అక్షర స్థానాన్ని కనుగొనండి",
          "✨ సరైన స్థానాన్ని క్లిక్ చేయండి!"
        ],
        instruction1: "సిద్ధంగా ఉండండి! మీరు లక్ష్య అక్షరాన్ని చూస్తారు. మీరు సిద్ధంగా ఉన్నప్పుడు 'నేను సిద్ధంగా ఉన్నాను' క్లిక్ చేయండి",
        instruction2: "మంచిది! ఇప్పుడు ఆ అక్షరం ఎక్కడ ఉందో గుర్తుంచుకోండి",
        instruction3: "ఇప్పుడు క్రింది గ్రిడ్‌లో లక్ష్య అక్షరాన్ని కనుగొనండి",
        instruction4: "అద్భుతం! మీరు సరైన స్థానాన్ని కనుగొన్నారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        readyButton: "నేను సిద్ధంగా ఉన్నాను",
        narration1: "సిద్ధంగా ఉండండి! మీరు లక్ష్య అక్షరాన్ని చూస్తారు. మీరు సిద్ధంగా ఉన్నప్పుడు నేను సిద్ధంగా ఉన్నాను క్లిక్ చేయండి",
        narration2: "మంచిది! ఇప్పుడు ఆ అక్షరం ఎక్కడ ఉందో గుర్తుంచుకోండి",
        narration3: "ఇప్పుడు క్రింది గ్రిడ్‌లో లక్ష్య అక్షరాన్ని కనుగొనండి",
        narration4: "అద్భుతం! మీరు సరైన స్థానాన్ని కనుగొన్నారు!",
        rememberText: "ఈ అక్షరాన్ని గుర్తుంచుకోండి!",
        findPositionText: "అక్షర స్థానాన్ని కనుగొనండి",
        demo: {
          target: "అ",
          options: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ"],
          correctPosition: 0,
          explanation: "అక్షరం 'అ' స్థానం 1లో ఉంది!"
        }
      },
      memoryChallenge: {
        title: "జ్ఞాపక సవాల్",
        steps: [
          "🔊 స్పీకర్‌ను క్లిక్ చేసి అక్షర క్రమాన్ని వినండి",
          "👀 అక్షరాలు కనిపించేటప్పుడు చూడండి",
          "🎯 క్రమాన్ని గుర్తుంచుకోండి",
          "✨ మీ జ్ఞాపక నైపుణ్యాలను పరీక్షించండి!"
        ],
        instruction1: "అక్షర క్రమాన్ని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        instruction2: "అక్షరాలు కనిపించేటప్పుడు జాగ్రత్తగా చూడండి",
        instruction3: "ఇప్పుడు, సరైన క్రమంలో అక్షరాలను క్లిక్ చేయండి",
        instruction4: "బాగా చేసారు! మీరు జ్ఞాపక సవాల్ డెమోను పూర్తి చేసారు!",
        successMessage: "🎉 సరైనది!",
        failureMessage: "😢 అయ్యో! తప్పు!",
        narration1: "అక్షర క్రమాన్ని వినడానికి స్పీకర్ చిహ్నంపై క్లిక్ చేయండి",
        narration2: "అక్షరాలు కనిపించేటప్పుడు జాగ్రత్తగా చూడండి",
        narration3: "ఇప్పుడు, సరైన క్రమంలో అక్షరాలను క్లిక్ చేయండి",
        narration4: "బాగా చేసారు! మీరు జ్ఞాపక సవాల్ డెమోను పూర్తి చేసారు!",
        demo: {
          audio: "అ-ఆ",
          sequence: ["అ", "ఆ", "ఇ"],
          options: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ"],
          correctAnswer: "అ",
          explanation: "క్రమం 'అ-ఆ' అక్షరం 'అ'తో ప్రారంభమవుతుంది!"
        }
      }
    }
  },
  kn: {
    title: "ಸಂಯೋಜಿತ ಅಕ್ಷರ ಆಟಗಳು",
    description: "ಒಂದು ಸಾಹಸದಲ್ಲಿ ಮೂರು ರೋಮಾಂಚಕ ಅಕ್ಷರ ಆಟಗಳನ್ನು ಅನುಭವಿಸಿ!",
    games: {
      letterHunt: {
        title: "ಅಕ್ಷರ ಬೇಟೆ",
        steps: [
          "🔊 ಸ್ಪೀಕರ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಿ",
          "👀 ಎಲ್ಲಾ ಅಕ್ಷರ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಿ",
          "🎯 ಸರಿಯಾದ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
          "✨ ಸರಿಯಾದ ಉತ್ತರಗಳಿಗೆ ಅಂಕಗಳನ್ನು ಪಡೆಯಿರಿ!"
        ],
        instruction1: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ",
        instruction3: "ಈಗ, ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಿಂದ ಹೊಂದಿಕೆಯಾಗುವ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction4: "ಅದ್ಭುತ! ನೀವು ಅಕ್ಷರ ಬೇಟೆ ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        narration1: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಅಕ್ಷರ ಶಬ್ದವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ",
        narration3: "ಈಗ, ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಿಂದ ಹೊಂದಿಕೆಯಾಗುವ ಅಕ್ಷರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration4: "ಅದ್ಭುತ! ನೀವು ಅಕ್ಷರ ಬೇಟೆ ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        demo: {
          audio: "ಅಂ",
          options: ["ಅಂ", "ಆ", "ಇ", "ಈ"],
          correctAnswer: "ಅಂ",
          explanation: "ಶಬ್ದ 'ಅ' ಅಕ್ಷರ 'ಅ'ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ!"
        }
      },
      quickSight: {
        title: "ROAR ರಾಪಿಡ್ ವಿಜುವಲ್",
        steps: [
          "👁️ ಗುರಿ ಅಕ್ಷರವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
          "⏱️ ಸಮಯ ಮುಗಿಯುವ ಮೊದಲು ಅದನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
          "🔍 ಗ್ರಿಡ್‌ನಲ್ಲಿ ಅಕ್ಷರ ಸ್ಥಾನವನ್ನು ಹುಡುಕಿ",
          "✨ ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!"
        ],
        instruction1: "ತಯಾರಾಗಿ! ನೀವು ಗುರಿ ಅಕ್ಷರವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ 'ನಾನು ಸಿದ್ಧ' ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅಕ್ಷರ ಎಲ್ಲಿ ಇತ್ತು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
        instruction3: "ಈಗ ಕೆಳಗಿನ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಗುರಿ ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ",
        instruction4: "ಅದ್ಭುತ! ನೀವು ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        readyButton: "ನಾನು ಸಿದ್ಧ",
        narration1: "ತಯಾರಾಗಿ! ನೀವು ಗುರಿ ಅಕ್ಷರವನ್ನು ನೋಡುತ್ತೀರಿ. ಸಿದ್ಧರಾದಾಗ ನಾನು ಸಿದ್ಧ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಒಳ್ಳೆಯದು! ಈಗ ಆ ಅಕ್ಷರ ಎಲ್ಲಿ ಇತ್ತು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
        narration3: "ಈಗ ಕೆಳಗಿನ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಗುರಿ ಅಕ್ಷರವನ್ನು ಹುಡುಕಿ",
        narration4: "ಅದ್ಭುತ! ನೀವು ಸರಿಯಾದ ಸ್ಥಾನವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
        rememberText: "ಈ ಅಕ್ಷರವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ!",
        findPositionText: "ಅಕ್ಷರ ಸ್ಥಾನವನ್ನು ಹುಡುಕಿ",
        demo: {
          target: "ಅ",
          options: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ"],
          correctPosition: 0,
          explanation: "ಅಕ್ಷರ 'ಅ' ಸ್ಥಾನ 1ರಲ್ಲಿ ಇತ್ತು!"
        }
      },
      memoryChallenge: {
        title: "ನೆನಪಿನ ಸವಾಲು",
        steps: [
          "🔊 ಸ್ಪೀಕರ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಕ್ಷರ ಅನುಕ್ರಮವನ್ನು ಕೇಳಿ",
          "👀 ಅಕ್ಷರಗಳು ಕಾಣಿಸುವಾಗ ವೀಕ್ಷಿಸಿ",
          "🎯 ಅನುಕ್ರಮ ಕ್ರಮವನ್ನು ನೆನಪಿಡಿ",
          "✨ ನಿಮ್ಮ ನೆನಪಿನ ಕೌಶಲ್ಯಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ!"
        ],
        instruction1: "ಅಕ್ಷರ ಅನುಕ್ರಮವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction2: "ಅಕ್ಷರಗಳು ಕಾಣಿಸುವಾಗ ಎಚ್ಚರಿಕೆಯಿಂದ ವೀಕ್ಷಿಸಿ",
        instruction3: "ಈಗ, ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        instruction4: "ಅದ್ಭುತ! ನೀವು ನೆನಪಿನ ಸವಾಲು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        successMessage: "🎉 ಸರಿ!",
        failureMessage: "😢 ಅಯ್ಯೋ! ತಪ್ಪು!",
        narration1: "ಅಕ್ಷರ ಅನುಕ್ರಮವನ್ನು ಕೇಳಲು ಸ್ಪೀಕರ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration2: "ಅಕ್ಷರಗಳು ಕಾಣಿಸುವಾಗ ಎಚ್ಚರಿಕೆಯಿಂದ ವೀಕ್ಷಿಸಿ",
        narration3: "ಈಗ, ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        narration4: "ಅದ್ಭುತ! ನೀವು ನೆನಪಿನ ಸವಾಲು ಡೆಮೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
        demo: {
          audio: "ಅಂ-ಆ",
          sequence: ["ಅಂ", "ಆ", "ಇ"],
          options: ["ಅಂ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ"],
          correctAnswer: "ಅಂ",
          explanation: "ಅನುಕ್ರಮ 'ಅ-ಆ' ಅಕ್ಷರ 'ಅ'ದೊಂದಿಗೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ!"
        }
      }
    }
  },
  mr: {
    title: "एकत्रित अक्षर खेळ",
    description: "एका साहसात तीन रोमांचक अक्षर खेळांचा अनुभव घ्या!",
    games: {
      letterHunt: {
        title: "अक्षर शोध",
        steps: [
          "🔊 स्पीकरवर क्लिक करून अक्षर आवाज ऐका",
          "👀 सर्व अक्षर पर्याय पहा",
          "🎯 योग्य अक्षरावर क्लिक करा",
          "✨ योग्य उत्तरांसाठी गुण मिळवा!"
        ],
        instruction1: "अक्षर आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        instruction2: "अक्षर आवाज काळजीपूर्वक ऐका",
        instruction3: "आता, खालील पर्यायांमधून जुळणारे अक्षर क्लिक करा",
        instruction4: "उत्कृष्ट! तुम्ही अक्षर शोध डेमो यशस्वीरित्या पूर्ण केले!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        narration1: "अक्षर आवाज ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        narration2: "अक्षर आवाज काळजीपूर्वक ऐका",
        narration3: "आता, खालील पर्यायांमधून जुळणारे अक्षर क्लिक करा",
        narration4: "उत्कृष्ट! तुम्ही अक्षर शोध डेमो यशस्वीरित्या पूर्ण केले!",
        demo: {
          audio: "अ",
          options: ["अ", "आ", "इ", "ई"],
          correctAnswer: "अ",
          explanation: "आवाज 'अ' अक्षर 'अ'शी जुळते!"
        }
      },
      quickSight: {
        title: "ROAR रॅपिड व्हिज्युअल",
        steps: [
          "👁️ लक्ष्य अक्षर काळजीपूर्वक पहा",
          "⏱️ वेळ संपण्यापूर्वी ते लक्षात ठेवा",
          "🔍 ग्रिडमध्ये अक्षर स्थान शोधा",
          "✨ योग्य स्थानावर क्लिक करा!"
        ],
        instruction1: "तयार व्हा! तुम्हाला लक्ष्य अक्षर दिसेल. तयार असाल तेव्हा 'मी तयार आहे' क्लिक करा",
        instruction2: "चांगले! आता ते अक्षर कुठे होते लक्षात ठेवा",
        instruction3: "आता खालील ग्रिडमध्ये लक्ष्य अक्षर शोधा",
        instruction4: "उत्कृष्ट! तुम्हाला योग्य स्थान सापडले!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        readyButton: "मी तयार आहे",
        narration1: "तयार व्हा! तुम्हाला लक्ष्य अक्षर दिसेल. तयार असाल तेव्हा मी तयार आहे क्लिक करा",
        narration2: "चांगले! आता ते अक्षर कुठे होते लक्षात ठेवा",
        narration3: "आता खालील ग्रिडमध्ये लक्ष्य अक्षर शोधा",
        narration4: "उत्कृष್ಟ! तुम्ही द्रुत दृष्टी डेमो यशस्वीरित्या पूर्ण केले!",
        demo: {
          target: "अ",
          options: ["अ", "आ", "इ", "ई", "उ", "ऊ"],
          correctPosition: 0,
          explanation: "अक्षर 'अ' स्थान 1 वर होते!"
        },
        rememberText: "हे अक्षर लक्षात ठेवा!",
        findPositionText: "अक्षर स्थान शोधा"
      },
      memoryChallenge: {
        title: "स्मरणशक्ती आव्हान",
        steps: [
          "🔊 स्पीकरवर क्लिक करून अक्षर क्रम ऐका",
          "👀 अक्षरे दिसत असताना पहा",
          "🎯 क्रम क्रम लक्षात ठेवा",
          "✨ तुमची स्मरणशक्ती कौशल्ये तपासा!"
        ],
        instruction1: "अक्षर क्रम ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        instruction2: "अक्षरे दिसत असताना काळजीपूर्वक पहा",
        instruction3: "आता, योग्य क्रमाने अक्षरे क्लिक करा",
        instruction4: "उत्कृष्ट! तुम्ही स्मरणशक्ती आव्हान डेमो यशस्वीरित्या पूर्ण केले!",
        successMessage: "🎉 बरोबर!",
        failureMessage: "😢 अरेच्या! चुकीचे!",
        narration1: "अक्षर क्रम ऐकण्यासाठी स्पीकर चिन्हावर क्लिक करा",
        narration2: "अक्षरे दिसत असताना काळजीपूर्वक पहा",
        narration3: "आता, योग्य क्रमाने अक्षरे क्लिक करा",
        narration4: "उत्कृष्ट! तुम्ही स्मरणशक्ती आव्हान डेमो यशस्वीरित्या पूर्ण केले!",
        demo: {
          audio: "अ-आ",
          sequence: ["अ", "आ", "इ"],
          options: ["अ", "आ", "इ", "ई", "उ", "ऊ"],
          correctAnswer: "अ",
          explanation: "क्रम 'अ-आ' अक्षर 'अ'ने सुरू होतो!"
        }
      }
    }
  }
};

export function CombinedLetterGamesPreview({ 
  onStartGame, 
  onBack,
  difficulty = "Easy",
  estimatedTime = "5-8 min",
  level = 1,
  hideHeader = false
}: CombinedLetterGamesPreviewProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>('introduction');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [demoStep, setDemoStep] = useState<DemoStep>('instruction1');
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [hasClickedSpeaker, setHasClickedSpeaker] = useState(false);
  const [hasClickedReady, setHasClickedReady] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionText, setShowTransitionText] = useState(false);
  const [allGamesCompleted, setAllGamesCompleted] = useState(false);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showTarget, setShowTarget] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sequenceTimer, setSequenceTimer] = useState(3);
  const [completionCount, setCompletionCount] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  const [nextGameName, setNextGameName] = useState<string>('');
  
  const speakerButtonRef = useRef<HTMLButtonElement>(null);
  const speakerDivRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const audioLanguage = selectedAudioLanguage || 'en';
  const contentLanguage = selectedLanguage || 'en';
  const instructions = gameInstructions[contentLanguage];
  const games = Object.keys(instructions.games) as GameType[];
  const currentGame = games[currentGameIndex] as GameType;
  const currentGameInstructions = instructions.games[currentGame];

  // Play narration using audio files with TTS fallback
  const playNarration = async (text: string, step: number) => {
    // Prevent multiple simultaneous narration calls
    if (isPlayingNarration) {
      console.warn('Narration already playing, skipping...');
      return;
    }
    
    setIsPlayingNarration(true);
    
    const gameName = 'Combined Letter Games';
    const subGameMap = {
      'letterHunt': 'Letter Hunt',
      'quickSight': 'Quick Sight', 
      'memoryChallenge': 'Memory Challenge'
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
      // Stop any existing speech synthesis before starting new one
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      await playTTS(text, audioLanguage);
    }
    
    setIsPlayingNarration(false);
  };

  // Play audio sound from .wav files with TTS fallback
  const playAudioSound = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Determine the correct audio path based on language
      let audioPath = '';
      if (contentLanguage === 'te') {
        audioPath = `/audio/telugu/letter/${text}.wav`;
      } else if (contentLanguage === 'kn') {
        audioPath = `/audio/kannada/letter/${text}.wav`;
      } else if (contentLanguage === 'mr') {
        audioPath = `/audio/marathi/letter/${text}.wav`;
      } else {
        // Default to English for other languages
        audioPath = `/audio/english/letter/${text}.wav`;
      }
      
      const audio = new Audio(audioPath);
      attachSlowLoadToast(audio);
      
      audio.play().then(() => {
        // Wait for audio to finish playing
        audio.onended = () => {
          resolve();
        };
        audio.onerror = () => {
          console.warn(`Audio file not found: ${audioPath}, falling back to TTS`);
          // Fallback to TTS if .wav file doesn't exist
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = contentLanguage === 'te' ? 'te-IN' : 
                          contentLanguage === 'kn' ? 'kn-IN' : 
                          contentLanguage === 'mr' ? 'mr-IN' : 
                          contentLanguage === 'hi' ? 'hi-IN' : 'en-US';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          
          utterance.onend = () => {
            resolve();
          };
          
          speechSynthesis.speak(utterance);
        };
      }).catch((error) => {
        console.warn(`Audio file not found: ${audioPath}, falling back to TTS`);
        // Fallback to TTS if .wav file doesn't exist
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = contentLanguage === 'te' ? 'te-IN' : 
                        contentLanguage === 'kn' ? 'kn-IN' : 
                        contentLanguage === 'mr' ? 'mr-IN' : 
                        contentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      });
    });
  };

  // Success and failure sounds are now handled by audioUtils

  // Wrapper for GameIntroduction component (expects different signature)
  const playIntroductionNarration = async (text: string): Promise<void> => {
    const gameName = 'Combined Letter Games';
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

  // Update current step based on demo step
  useEffect(() => {
    switch (demoStep) {
      case 'instruction1':
      case 'waitForSpeaker':
      case 'waitForReady':
        setCurrentStep(0);
        break;
      case 'showTarget':
      case 'showSequence':
      case 'instruction2':
        setCurrentStep(1);
        break;
      case 'instruction3':
      case 'waitForAnswer':
      case 'waitForInput':
        // For Letter Hunt, skip step 1 (instruction2) since we removed it
        setCurrentStep(currentGame === 'letterHunt' ? 1 : 2);
        break;
      case 'instruction4':
      case 'complete':
        // For Letter Hunt, adjust final step since we removed instruction2
        setCurrentStep(currentGame === 'letterHunt' ? 2 : 3);
        break;
    }
  }, [demoStep, currentGame]);

  // Handle introduction continue
  const handleIntroductionContinue = () => {
    setPreviewPhase('countdown');
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setPreviewPhase('demo');
    setDemoStep('instruction1');
  };

  // Initialize demo - play instruction 1
  useEffect(() => {
    if (previewPhase === 'demo' && demoStep === 'instruction1') {
      playNarration(currentGameInstructions.narration1, 1);
      setHasClickedSpeaker(false);
      setHasClickedReady(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setUserSequence([]);
      setShowTarget(false);
      setShowSequence(false);
      setTimeRemaining(3);
      setIsTimerRunning(false);
      setSequenceTimer(3);
    }
  }, [previewPhase, demoStep, currentGameInstructions.narration1, currentGameIndex]);

  // When instruction 1 narration finishes, move to appropriate wait step
  useEffect(() => {
    if (demoStep === 'instruction1' && !isPlayingNarration) {
      // Add a minimum delay to ensure button shows as disabled for a moment
      const timer = setTimeout(() => {
        if (currentGame === 'letterHunt') {
          setDemoStep('waitForSpeaker');
          setTimeout(() => {
            speakerDivRef.current?.focus();
          }, 100);
        } else if (currentGame === 'quickSight') {
          setDemoStep('waitForReady');
          setTimeout(() => {
            speakerButtonRef.current?.focus();
          }, 100);
        } else if (currentGame === 'memoryChallenge') {
          setDemoStep('waitForReady');
          setTimeout(() => {
            speakerButtonRef.current?.focus();
          }, 100);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [demoStep, isPlayingNarration, currentGame]);

  // Timer logic for Quick Sight
  useEffect(() => {
    if (showTarget && isTimerRunning) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showTarget, isTimerRunning]);

  // When Quick Sight timer reaches 0, hide target and show instruction 2
  useEffect(() => {
    if (showTarget && !isTimerRunning && timeRemaining === 0) {
      const handleTimerEnd = async () => {
        setShowTarget(false);
        setDemoStep('instruction2');
        await playNarration(currentGameInstructions.narration2, 2);
        
        setDemoStep('instruction3');
        await playNarration(currentGameInstructions.narration3, 3);
        
        setDemoStep('waitForAnswer');
        
        setTimeout(() => {
          optionsRef.current?.focus();
        }, 100);
      };
      
      handleTimerEnd();
    }
  }, [showTarget, isTimerRunning, timeRemaining]);

  // Timer logic for Memory Challenge
  useEffect(() => {
    if (showSequence && sequenceTimer > 0) {
      const timer = setInterval(() => {
        setSequenceTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showSequence, sequenceTimer]);

  // When Memory Challenge sequence timer ends, move to instruction 2
  useEffect(() => {
    if (showSequence && sequenceTimer === 0) {
      const handleSequenceEnd = async () => {
        setShowSequence(false);
        setDemoStep('instruction2');
        await playNarration(currentGameInstructions.narration2, 2);
        
        setDemoStep('instruction3');
        await playNarration(currentGameInstructions.narration3, 3);
        
        setDemoStep('waitForInput');
        
        setTimeout(() => {
          optionsRef.current?.focus();
        }, 100);
      };
      
      handleSequenceEnd();
    }
  }, [showSequence, sequenceTimer]);

  // Handle speaker button click (Letter Hunt)
  const handleSpeakerClick = async () => {
    if (demoStep !== 'waitForSpeaker' || hasClickedSpeaker) return;
    
    setHasClickedSpeaker(true);
    if (currentGame === 'letterHunt' && 'audio' in currentGameInstructions.demo) {
      // Wait for the audio to finish playing before proceeding
      await playAudioSound(currentGameInstructions.demo.audio);
    }
    
    // Skip instruction2 for Letter Hunt - go directly to instruction3
    setDemoStep('instruction3');
    await playNarration(currentGameInstructions.narration3, 3);
    
    setDemoStep('waitForAnswer');
    
    setTimeout(() => {
      optionsRef.current?.focus();
    }, 100);
  };

  // Handle ready button click (Quick Sight & Memory)
  const handleReadyClick = () => {
    if (demoStep !== 'waitForReady' || hasClickedReady) return;
    
    setHasClickedReady(true);
    
    if (currentGame === 'quickSight') {
      setShowTarget(true);
      setDemoStep('showTarget');
      setTimeRemaining(3);
      setIsTimerRunning(true);
      
    } else if (currentGame === 'memoryChallenge') {
      setShowSequence(true);
      setDemoStep('showSequence');
      setSequenceTimer(3);
    }
  };

  // Handle option click
  const handleOptionClick = async (option: string) => {
    if (demoStep === 'waitForAnswer' && !showFeedback) {
      // Letter Hunt and Quick Sight games
      setSelectedAnswer(option);
      setShowFeedback(true);
      
      let isCorrect = false;
      if (currentGame === 'letterHunt' && 'correctAnswer' in currentGameInstructions.demo) {
        isCorrect = option === currentGameInstructions.demo.correctAnswer;
      } else if (currentGame === 'quickSight' && 'correctPosition' in currentGameInstructions.demo) {
        isCorrect = option === currentGameInstructions.demo.options[currentGameInstructions.demo.correctPosition];
      }
      
      setIsCorrectAnswer(isCorrect);
      
      if (isCorrect) {
        await playSuccessSound(audioLanguage, { exactLanguage: true });
        
        setDemoStep('instruction4');
        await playNarration(currentGameInstructions.narration4, 4);
        
        const newSuccessfulRuns = successfulRuns + 1;
        setSuccessfulRuns(newSuccessfulRuns);
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
        // Incorrect answer handling
        if (currentGame === 'letterHunt') {
          // For letterHunt: Play failure sound first, then feedback message audio will play after
          // The feedback audio is handled by LetterHuntGameCore component
          // We reset feedback UI only after feedback audio completes (via onFeedbackAudioComplete callback)
          await playFailureSound(audioLanguage, { exactLanguage: true });
          // Note: Feedback UI reset happens in onFeedbackAudioComplete callback (see LetterHuntGameCore usage below)
        } else {
          // For other games: Play failure sound and reset feedback after delay
          await playFailureSound(audioLanguage, { exactLanguage: true });
          setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
          }, 2000);
        }
      }
    } else if (demoStep === 'waitForInput') {
      // Memory Challenge - add letter to sequence (only if not complete)
      if ('sequence' in currentGameInstructions.demo && userSequence.length < currentGameInstructions.demo.sequence.length) {
        setUserSequence(prev => [...prev, option]);
      }
    }
  };

  // Handle sequence check for Memory Challenge
  const handleCheckSequence = async () => {
    if (currentGame !== 'memoryChallenge' || demoStep !== 'waitForInput') return;
    
    const isCorrect = 'sequence' in currentGameInstructions.demo && JSON.stringify(userSequence) === JSON.stringify(currentGameInstructions.demo.sequence);
    setIsCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      await playSuccessSound(audioLanguage, { exactLanguage: true });
      
      setDemoStep('instruction4');
      await playNarration(currentGameInstructions.narration4, 4);
      
      const newSuccessfulRuns = successfulRuns + 1;
      setSuccessfulRuns(newSuccessfulRuns);
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
        setUserSequence([]);
      }, 2000);
    }
  };

  // Remove last letter from sequence
  const removeLastLetter = () => {
    if (userSequence.length > 0) {
      setUserSequence(prev => prev.slice(0, -1));
    }
  };

  // Restart current game demo
  const restartDemo = () => {
    // Stop any ongoing audio/TTS before resetting state
    stopAllAudio();
    setIsPlayingNarration(false);
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setDemoStep('instruction1');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setHasClickedSpeaker(false);
    setHasClickedReady(false);
    setUserSequence([]);
    setShowTarget(false);
    setShowSequence(false);
    setTimeRemaining(3);
    setIsTimerRunning(false);
    setSequenceTimer(3);
    setCurrentStep(0);
    setCompletionCount(0);
  };

  // Skip demo handler
  const handleSkipDemo = () => {
    stopAllAudio();
    setIsPlayingNarration(false);
    onStartGame();
  };

  // Back handler
  const handleBack = () => {
    stopAllAudio();
    setIsPlayingNarration(false);
    onBack();
  };

  // Move to next game
  const moveToNextGame = () => {
    if (currentGameIndex < games.length - 1) {
      // Ensure audio from current game is fully stopped before switching
      stopAllAudio();
      setIsPlayingNarration(false);
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

  // Manual navigation - Next game
  const handleNextGame = () => {
    if (currentGameIndex < games.length - 1 && !isTransitioning) {
      // Stop any ongoing audio/TTS when user manually navigates
      stopAllAudio();
      setIsPlayingNarration(false);
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
        restartDemo();
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
      setIsPlayingNarration(false);
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
        restartDemo();
        setIsTransitioning(false);
        
        setTimeout(() => {
          setShowTransitionText(false);
          setNextGameName('');
        }, 1000);
      }, 1000);
    }
  };

  // Help button click - restart all demos from introduction
  const handleHelpClick = () => {
    stopAllAudio();
    setIsPlayingNarration(false);
    setPreviewPhase('introduction');
    setCurrentGameIndex(0);
    setAllGamesCompleted(false);
    setSuccessfulRuns(0);
    setHasCompletedFirstCycle(false);
    restartDemo();
  };

  // Cleanup on unmount and game changes
  useEffect(() => {
    return () => {
      stopAllAudio();
      // Stop any ongoing speech synthesis
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech synthesis when game changes
  useEffect(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlayingNarration(false);
  }, [currentGameIndex]);

  const showSpeaker = currentGame === 'letterHunt' && (
    demoStep === 'waitForSpeaker' ||
    demoStep === 'instruction1' ||
    demoStep === 'instruction3' ||
    demoStep === 'waitForAnswer' ||
    demoStep === 'instruction4' ||
    demoStep === 'complete'
  );
  const showReadyButton = (currentGame === 'quickSight' || currentGame === 'memoryChallenge') && (demoStep === 'waitForReady' || demoStep === 'instruction1') && !hasClickedReady;
  const showTargetLetter = currentGame === 'quickSight' && (showTarget || demoStep === 'showTarget');
  const showSequenceDisplay = currentGame === 'memoryChallenge' && (showSequence || demoStep === 'showSequence');
  const showOptions = demoStep === 'waitForAnswer' || demoStep === 'waitForInput' || demoStep === 'instruction4';

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
             customIcon={<Sparkles className="h-10 w-10 text-white" />}
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
                {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मड़े'}
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
            {contentLanguage === 'en' ? 'Back' : contentLanguage === 'te' ? 'వెనుకకు' : contentLanguage === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'मड़े'}
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
          <div className="flex flex-col items-center mb-1.5 sm:mb-2 px-2">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-800 whitespace-nowrap">
                  {contentLanguage === 'en' ? 'How to Play' : contentLanguage === 'te' ? 'ఎలా ఆడాలి' : contentLanguage === 'kn' ? 'ಹೇಗೆ ಆಡುವುದು' : 'कसे खेळायचे'}
                </h2>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-600 mt-0.5">
                  {currentGameInstructions.title}
                </div>
              </div>
            </div>
            <Progress value={((currentStep + 1) / currentGameInstructions.steps.length) * 100} className="h-0.5 sm:h-1 w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] mt-0.5" />
          </div>

          {/* Demo Panel - Full width */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-blue-50 rounded-lg p-4 text-center flex flex-col justify-start relative min-h-[550px] max-h-[700px] overflow-y-auto">
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

                {/* Optimized Layout Structure */}
                <div className="flex flex-col h-full justify-start space-y-4 py-4">
                  {!showTransitionText && (
                    <>
                      {currentGame === 'letterHunt' && (
                        <LetterHuntGameCore
                          questions={[{
                            target: (currentGameInstructions as any).demo.correctAnswer,
                            options: (currentGameInstructions as any).demo.options,
                            audio: (currentGameInstructions as any).demo.audio,
                            audioText: (currentGameInstructions as any).demo.audio,
                            language: contentLanguage,
                            complexity: 'easy'
                          }]}
                          currentQuestionIndex={0}
                          selectedAnswer={selectedAnswer}
                          showFeedback={showFeedback}
                          isCorrect={isCorrectAnswer}
                          mode="preview"
                          onAnswerSelect={handleOptionClick}
                          onContinue={() => {}}
                          onSpeakerClick={handleSpeakerClick}
                          onFeedbackAudioComplete={() => {
                            /**
                             * Callback: Called when feedback audio sequence completes
                             * This ensures UI resets only after full feedback message audio finishes playing
                             * Sequence: failure sound → feedback1 ("chosen letter is") → selected letter → feedback2 ("try again")
                             */
                            setShowFeedback(false);
                            setSelectedAnswer(null);
                          }}
                          showSpeaker={showSpeaker}
                          showContinueButton={false}
                          showProgress={false}
                          isPreview={true}
                          demoStep={demoStep}
                          hasClickedSpeaker={hasClickedSpeaker}
                          speakerButtonRef={speakerDivRef}
                          optionsRef={optionsRef}
                          showHandPointer={showOptions && demoStep === 'waitForAnswer' && !showFeedback}
                          disabled={!(demoStep === 'waitForAnswer' || demoStep === 'instruction4' || demoStep === 'complete') || showFeedback}
                          className="bg-transparent shadow-none border-0 p-0 h-full"
                          useContainer="none"
                          audioLanguageOverride={audioLanguage}
                        />
                      )}

                      {currentGame === 'quickSight' && (
                        showReadyButton ? (
                          <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <div className="text-4xl mb-2">
                              <Eye className={`h-16 w-16 mx-auto transition-colors ${
                                demoStep === 'waitForReady' 
                                  ? 'text-blue-600 animate-pulse' 
                                  : demoStep === 'instruction1'
                                  ? 'text-gray-400'
                                  : 'text-blue-600'
                              }`} />
                            </div>
                            <Button
                        ref={speakerButtonRef}
                              onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                              disabled={demoStep !== 'waitForReady'}
                              className={`px-6 py-3 font-semibold text-base rounded-full shadow-lg transition-all duration-300 ${
                          demoStep === 'waitForReady' 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform ring-4 ring-blue-400 ring-opacity-50' 
                            : demoStep === 'instruction1'
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform'
                        }`}
                        tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                      >
                          {(currentGameInstructions as any).readyButton || (contentLanguage === 'en' ? "I'm Ready" : contentLanguage === 'te' ? 'నేను సిద్ధంగా ఉన్నాను' : contentLanguage === 'kn' ? 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' : 'मी तयार आहे')}
                            </Button>
                      {demoStep === 'waitForReady' && (
                              <div className="text-center animate-bounce">
                          <span className="text-2xl">👆</span>
                        </div>
                      )}
                    </div>
                        ) : (
                        <ROARRapidVisualGameCore
                          currentQuestion={{
                            target: (currentGameInstructions as any).demo.target,
                            letters: (currentGameInstructions as any).demo.options,
                            targetPosition: (currentGameInstructions as any).demo.correctPosition,
                            complexity: 'easy',
                            language: contentLanguage
                          }}
                          mode="preview"
                          selectedLanguage={contentLanguage}
                            timeRemaining={timeRemaining}
                          isTimerRunning={isTimerRunning}
                          showTargetLetter={showTargetLetter}
                          showSelectionGrid={demoStep === 'waitForAnswer'}
                          showFeedback={showFeedback}
                          isCorrect={isCorrectAnswer}
                          selectedPosition={null}
                          onPositionSelect={(pos) => handleOptionClick((currentGameInstructions as any).demo.options[pos])}
                          className=""
                          isPreview={true}
                          demoStep={demoStep}
                          showHandPointer={demoStep === 'waitForAnswer' && !showFeedback}
                          disabled={demoStep !== 'waitForAnswer' || showFeedback}
                        />
                        )
                      )}

                      {currentGame === 'memoryChallenge' && (
                        showReadyButton ? (
                          <div className="flex flex-col items-center justify-center h-full space-y-3">
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
                              ref={speakerButtonRef}
                              onClick={demoStep === 'waitForReady' ? handleReadyClick : undefined}
                              disabled={demoStep !== 'waitForReady'}
                              className={`px-6 py-3 font-bold text-base rounded-full shadow-lg transition-all duration-300 ${
                                demoStep === 'waitForReady' 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform ring-4 ring-blue-400 ring-opacity-50' 
                                  : demoStep === 'instruction1'
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform'
                              }`}
                              tabIndex={demoStep === 'waitForReady' ? 0 : -1}
                            >
                              {(currentGameInstructions as any).readyButton || (contentLanguage === 'en' ? "I'm Ready" : contentLanguage === 'te' ? 'నేను సిద్ధంగా ఉన్నాను' : contentLanguage === 'kn' ? 'ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ' : 'मी तयार आहे')}
                            </Button>
                            {demoStep === 'waitForReady' && (
                              <div className="text-center mt-2 text-blue-600 font-medium animate-bounce">
                                <span className="text-xl">👆</span>
                        </div>
                      )}
                            </div>
                        ) : (
                        <MemoryGameCore
                          currentSequence={{
                            sequence: (currentGameInstructions as any).demo.sequence,
                            display: (currentGameInstructions as any).demo.sequence.join('-'),
                            complexity: 'easy',
                            language: contentLanguage
                          }}
                          mode="preview"
                          selectedLanguage={contentLanguage}
                          currentLevel={level}
                          showSequence={showSequenceDisplay}
                          showFeedback={showFeedback}
                          isCorrect={isCorrectAnswer}
                          userInput={userSequence}
                          currentLetterOptions={(currentGameInstructions as any).demo.options}
                          onLetterClick={(letter) => handleOptionClick(letter)}
                          onRemoveLast={removeLastLetter}
                          onCheckSequence={handleCheckSequence}
                          onContinue={() => {}}
                          className=""
                          isPreview={true}
                          demoStep={demoStep}
                          showHandPointer={demoStep === 'waitForInput' && !showFeedback && userSequence.length < (currentGameInstructions as any).demo.sequence.length}
                          disabled={demoStep !== 'waitForInput' || showFeedback}
                          sequenceTimer={sequenceTimer}
                        />
                        )
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
