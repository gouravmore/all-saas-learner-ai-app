import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ProgressBar } from "../ProgressBar";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Globe, Eye, EyeOff, Volume2, SkipForward, Timer, Sparkles, BookOpen, Brain, CheckCircle } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { gameSessionTracker } from "../../utils/gameSessionTracker";
import { sessionManager } from "../../utils/sessionManager";
import { sunbirdTelemetryService, createGameSessionData, createQuestionResponseData, createGameEndSessionData, type GameSessionData } from "../../utils/sunbirdTelemetryService";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { teluguAudioManager } from "../../utils/teluguAudioManager";
import { kannadaAudioManager } from "../../utils/kannadaAudioManager";
import { marathiAudioManager } from "../../utils/marathiAudioManager";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, LANGUAGES as SHARED_LANGUAGES } from "../../constants/languages";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { CombinedLetterGamesPreview } from "./CombinedLetterGamesPreview";
import { LetterHuntGameCore } from "./LetterHuntGameCore";
import { ROARRapidVisualGameCore } from "./ROARRapidVisualGameCore";
import { MemoryGameCore } from "./MemoryGameCore";
type GameType = 'letterHunt' | 'quickSight' | 'memoryChallenge';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

// Get languages from JSON data
const LANGUAGES: LanguageOption[] = memoryGameDataLoader.getLanguages();

interface CombinedQuestion {
  id: string;
  type: GameType;
  target: string;
  options?: string[];
  letters?: string[];
  targetPosition?: number;
  sequence?: string[];
  audio: string;
  audioText: string;
  language: Language;
  complexity: string;
}

interface CombinedLetterGamesProps {
  onBack: () => void;
}

function CombinedLetterGames({ onBack }: CombinedLetterGamesProps) {
  const navigate = useNavigate();
  const { level } = useParams<{ level?: string }>();
  
  const { 
    startSession, 
    recordAnswer, 
    endSession, 
    getGameProgress, 
    getDifficultySettings,
    manuallyAdvanceLevel
  } = useLearningProgress();

  const { selectedLanguage } = useLanguage();
  
  // Determine if we're showing level selector or playing a specific level
  const isLevelSelector = !level || level === 'select';
  const selectedLevel = level && level !== 'select' ? parseInt(level) : null;
  const showLevelSelector = isLevelSelector;
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [questions, setQuestions] = useState<CombinedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSequence, setShowSequence] = useState(true);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [sequenceTimer, setSequenceTimer] = useState(3);
  const [levelFailed, setLevelFailed] = useState(false);
  const [showQuickSightTarget, setShowQuickSightTarget] = useState(true);
  const [currentLetterOptions, setCurrentLetterOptions] = useState<string[]>([]);
  const [showQuickSightOptions, setShowQuickSightOptions] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  // Telemetry state
  const [telemetrySessionData, setTelemetrySessionData] = useState<GameSessionData | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations
  const getLanguageLevels = (language: Language) => {
    switch (language) {
      case 'te':
        return {
          maxLevels: 10, // Standardized to 10 levels for Telugu
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
      case 'mr':
        return {
          maxLevels: 10, // Standardized to 10 levels for Marathi
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
      case 'kn':
        return {
          maxLevels: 10, // Standardized to 10 levels for Kannada
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
      default:
        return {
          maxLevels: 10, // Standard levels for English
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
    }
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `combinedLetter_${selectedLanguage}` : 'combinedLetter';
  
  // Get current user and session-based level
  const currentUser = sessionManager.getCurrentUser();
  const sessionGameProgress = currentUser ? gameSessionTracker.getGameProgress(currentUser.username, gameKey) : null;
  const sessionCurrentLevel = sessionGameProgress ? gameSessionTracker.getCurrentLevel(currentUser.username, gameKey) : 1;
  
  // Use session-based level instead of old progress system
  const currentLevel = selectedLevel || sessionCurrentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');

  // Fetch backend current level on mount
  useEffect(() => {
    const fetchBackendLevel = async () => {
      if (!selectedLanguage) return;
      
      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) {
        setIsLoadingLevel(false);
        return;
      }

      try {
        setIsLoadingLevel(true);
        
        // Extract game name without language suffix
        const gameName = gameKey.split('_')[0];
        
        // Search for level stats using current user
        const searchParams = {
          userId: currentUser.username,
          courseId: gameName,
          unitId: selectedLanguage
        };
        
        const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
        
        // Handle the enhanced backend response format
        if (result.success && result.data && typeof result.data === 'object') {
          // Extract metadata (currentLevel from backend)
          if (result.metadata?.currentLevel) {
            setBackendCurrentLevel(result.metadata.currentLevel);
          }
        }
      } catch (error) {
        console.error('Error fetching backend level:', error);
      } finally {
        setIsLoadingLevel(false);
      }
    };

    fetchBackendLevel();
  }, [selectedLanguage, gameKey]);

  // Reset game state when navigating to a new level via URL
  useEffect(() => {
    if (selectedLevel !== null) {
      setShowPreview(false); // Hide preview when level is selected
      setIsGameComplete(false);
      setScore(0);
      setTotalCorrect(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setLevelFailed(false);
    }
  }, [selectedLevel, selectedLanguage]);

  // Get language letters from JSON data - now includes matras and compound letters
  // Note: memoryGameDataLoader only supports en, te, mr, kn (not hi)
  const getLanguageLetters = (language: Language): string[] => {
    // Ensure only supported languages are passed (fallback to 'en' if somehow 'hi' is passed)
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    return memoryGameDataLoader.getAllLetters(supportedLanguage);
  };

  // Get level progression percentages
  const getLevelProgression = (level: number) => {
    if (level <= 4) {
      return {
        letterHunt: 50,
        quickSight: 30,
        memoryChallenge: 20
      };
    } else if (level <= 7) {
      return {
        letterHunt: 30,
        quickSight: 30,
        memoryChallenge: 40
      };
    } else {
      return {
        letterHunt: 20,
        quickSight: 20,
        memoryChallenge: 60
      };
    }
  };

  // Generate Letter Hunt questions with proper level-based letter sets
  const generateLetterHuntQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    // Get level-appropriate letter set from JSON data
    const getLevelLetters = (language: Language, level: number): string[] => {
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
          ? language 
          : 'en';
      
      // For Telugu, Kannada, and Marathi, use exact level mapping
      if (supportedLanguage === 'te' || supportedLanguage === 'kn' || supportedLanguage === 'mr') {
        const levelKey = level.toString();
        return memoryGameDataLoader.getLettersByLevel(supportedLanguage, levelKey);
      }
      
      // For other languages, map 10 levels to complexity levels
      if (level <= 2) return memoryGameDataLoader.getLetters(supportedLanguage, 'basic');
      if (level <= 4) return memoryGameDataLoader.getLetters(supportedLanguage, 'intermediate');
      if (level <= 6) return memoryGameDataLoader.getLetters(supportedLanguage, 'advanced');
      if (level <= 8) return memoryGameDataLoader.getLetters(supportedLanguage, 'expert');
      return memoryGameDataLoader.getLetters(supportedLanguage, 'master');
    };
    
    const lettersToUse = getLevelLetters(language, level);
    const questions: CombinedQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const target = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
      const options = [target];
      
      while (options.length < 4) {
        const randomLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        if (!options.includes(randomLetter)) {
          options.push(randomLetter);
        }
      }
      
      // Shuffle options
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }

      questions.push({
        id: `lh_${i}`,
        type: 'letterHunt',
        target,
        options,
        audio: target,
        audioText: target,
        language,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate Quick Sight questions with proper level-based letter sets
  const generateQuickSightQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    // Get level-appropriate letter set from JSON data
    const getLevelLetters = (language: Language, level: number): string[] => {
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
          ? language 
          : 'en';
      
      // For Telugu and Kannada, use exact level mapping
      if (supportedLanguage === 'te' || supportedLanguage === 'kn') {
        const levelKey = level.toString();
        return memoryGameDataLoader.getLettersByLevel(supportedLanguage, levelKey);
      }
      
      // For other languages, map 10 levels to complexity levels
      if (level <= 2) return memoryGameDataLoader.getLetters(supportedLanguage, 'basic');
      if (level <= 4) return memoryGameDataLoader.getLetters(supportedLanguage, 'intermediate');
      if (level <= 6) return memoryGameDataLoader.getLetters(supportedLanguage, 'advanced');
      if (level <= 8) return memoryGameDataLoader.getLetters(supportedLanguage, 'expert');
      return memoryGameDataLoader.getLetters(supportedLanguage, 'master');
    };
    
    const availableLetters = getLevelLetters(language, level);
    const questions: CombinedQuestion[] = [];
    
    // For Quick Sight, we need at least 6 unique letters
    let lettersToUse = availableLetters;
    if (lettersToUse.length < 6) {
      // If not enough letters, use all available
      lettersToUse = availableLetters;
    } else {
      // Use a subset for variety, but ensure we have enough
      lettersToUse = availableLetters.slice(0, Math.min(18, availableLetters.length));
    }

    console.log('Letters to use:', lettersToUse);
    console.log('Letters to use length:', lettersToUse.length);

    const usedTargets: string[] = [];

    for (let i = 0; i < count; i++) {
      // Get a random target letter that hasn't been used
      let target;
      let attempts = 0;
      
      do {
        target = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        attempts++;
      } while (usedTargets.includes(target) && attempts < 20);
      
      // Fallback if we can't find a unique target
      if (attempts >= 20) {
        console.warn(`Could not find unique target after ${attempts} attempts, using first available letter`);
        target = lettersToUse[0];
      }
      
      usedTargets.push(target);
      
      // Create 6 letter positions with target in random position
      const targetPosition = Math.floor(Math.random() * 6);
      const letters = Array(6).fill('');
      
      // Place target letter
      letters[targetPosition] = target;
      
      // Fill other positions with smart confusing letters from JSON (avoiding target)
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
          ? language 
          : 'en';
      const confusingLetters = memoryGameDataLoader.getConfusingLetters(supportedLanguage, target);
      const usedDistractors = new Set<string>();
      
      for (let j = 0; j < 6; j++) {
        if (j !== targetPosition) {
          let randomLetter;
          let distractorAttempts = 0;
          
          // First try to use confusing letters from JSON
          if (confusingLetters.length > 0 && usedDistractors.size < confusingLetters.length) {
            const availableConfusing = confusingLetters.filter(letter => 
              letter !== target && 
              !letters.includes(letter) && 
              !usedDistractors.has(letter)
            );
            
            if (availableConfusing.length > 0) {
              randomLetter = availableConfusing[Math.floor(Math.random() * availableConfusing.length)];
              usedDistractors.add(randomLetter);
            }
          }
          
          // Fallback to random letters if no confusing letters available
          if (!randomLetter) {
            do {
              randomLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
              distractorAttempts++;
            } while ((randomLetter === target || letters.includes(randomLetter)) && distractorAttempts < 10);
            
            // Final fallback
            if (distractorAttempts >= 10) {
              randomLetter = lettersToUse.find(l => l !== target && !letters.includes(l)) || lettersToUse[0];
            }
          }
          
          letters[j] = randomLetter;
        }
      }

      console.log(`Question ${i + 1}: Final sequence =`, letters, 'Target position =', targetPosition);

      questions.push({
        id: `qs_${i}`,
        type: 'quickSight',
        target,
        letters: letters,
        targetPosition,
        audio: target,
        audioText: target,
        language,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate Memory Challenge questions using JSON data
  const generateMemoryChallengeQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Use JSON data loader to generate memory sequences
    // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    const memorySequences = memoryGameDataLoader.generateMemoryQuestions(
      supportedLanguage,
      level,
      difficultySettings.complexity,
      count
    );

    for (let i = 0; i < memorySequences.length; i++) {
      const sequence = memorySequences[i];
      
      questions.push({
        id: `mc_${i}`,
        type: 'memoryChallenge',
        target: sequence.sequence.join(''),
        sequence: sequence.sequence,
        audio: sequence.audioText,
        audioText: sequence.audioText,
        language,
        complexity: sequence.complexity
      });
    }

    return questions;
  };

  // Generate combined questions based on level progression
  const generateCombinedQuestions = (language: Language, level: number): CombinedQuestion[] => {
    const progression = getLevelProgression(level);
    const totalQuestions = 10;
    
    const letterHuntCount = Math.round((progression.letterHunt / 100) * totalQuestions);
    const quickSightCount = Math.round((progression.quickSight / 100) * totalQuestions);
    const memoryChallengeCount = totalQuestions - letterHuntCount - quickSightCount;

    const letterHuntQuestions = generateLetterHuntQuestions(language, level, letterHuntCount);
    const quickSightQuestions = generateQuickSightQuestions(language, level, quickSightCount);
    const memoryChallengeQuestions = generateMemoryChallengeQuestions(language, level, memoryChallengeCount);

    // Combine questions in order: Letter Hunt first, then Quick Sight, then Memory Challenge
    const allQuestions = [...letterHuntQuestions, ...quickSightQuestions, ...memoryChallengeQuestions];

    return allQuestions;
  };

  // Initialize game session and questions
  useEffect(() => {
    const initializeGame = async () => {
    if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
      
      // Add a small delay to ensure state reset completes first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const session = startSession(gameKey);
      setPreviousLevel(selectedLevel);
      
      // Initialize tracking assessment
      const now = Date.now();
      setLevelStartTime(now);
      setQuestionStartTime(now); // Initialize for first question
      setQuestionSummaries([]);
      
      // Start session tracking
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        gameSessionTracker.startLevelSession(
          currentUser.username, 
          gameKey, 
          'Combined Letter Games', 
          selectedLevel
        );
        
        // End any existing subsession before starting a new one
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        if (currentSubSession && currentSubSession.isActive) {
          await sessionTelemetryManager.endSubSession();
        }
        
        // Start telemetry subsession (only once per level)
        await sessionTelemetryManager.startSubSession(gameKey, selectedLevel, selectedLanguage);
      }
      
      const newQuestions = generateCombinedQuestions(selectedLanguage, selectedLevel);
      
      // Initialize telemetry session data (for backward compatibility)
      if (currentUser) {
        const gameSessionData = createGameSessionData(
          gameKey,
          "Combined Letter Games",
          "combinedLetter",
          selectedLevel,
          selectedLanguage,
          difficultySettings.complexity,
          currentUser.username,
          true // isCombinedGame
        );
        setTelemetrySessionData(gameSessionData);
      }
      setQuestions(newQuestions);
      
      // Initialize user input array for memory challenge
      setUserInput([]);
      setShowSequence(true);
    }
    };
    
    initializeGame();
  }, [selectedLanguage, selectedLevel, gameKey, isGameComplete]);

  // Reset game state when URL changes
  useEffect(() => {
    if (selectedLevel !== null) {
      // Reset game state when navigating to a specific level
      setCurrentQuestionIndex(0);
      setScore(0);
      setTotalCorrect(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setShowTimeoutMessage(false);
      setUserInput([]);
      setShowSequence(true);
      setShowQuickSightTarget(true);
      setShowQuickSightOptions(false);
      setCurrentLetterOptions([]);
      
      // Reset tracking assessment state
      setLevelStartTime(Date.now());
      setQuestionSummaries([]);
    }
  }, [selectedLevel]);

  // Note: Page refresh is handled in App.tsx via beforeunload event
  // The initializeGame useEffect above will automatically start a new subsession after refresh

  const currentQuestion = questions[currentQuestionIndex];
  // Track question start time for telemetry
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  // Debug current question
  useEffect(() => {
    if (currentQuestion) {
      console.log('Current question:', currentQuestion);
      if (currentQuestion.type === 'quickSight') {
        console.log('Quick Sight question details:', {
          target: currentQuestion.target,
          letters: currentQuestion.letters,
          targetPosition: currentQuestion.targetPosition,
          lettersLength: currentQuestion.letters?.length,
          lettersType: typeof currentQuestion.letters,
          lettersIsArray: Array.isArray(currentQuestion.letters)
        });
      }
    }
  });
  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setSelectedAnswer(-1); // -1 indicates time up
    setIsCorrect(false);
    setShowFeedback(false); // Don't show feedback immediately
    setShowTimeoutMessage(true); // Show timeout message
    
    // Send telemetry RESPONSE event for timeout
    // if (telemetrySessionData) {
    //   const responseTime = Date.now() - questionStartTime;
    //   const responseData = createQuestionResponseData(
    //     currentQuestion.id,
    //     currentQuestion.type,
    //     -1, // timeout answer
    //     currentQuestion.target,
    //     false, // incorrect due to timeout
    //     responseTime,
    //     1, // attempts
    //     currentQuestion.complexity
    //   );
    //   telemetryService.sendResponseEvent(telemetrySessionData, responseData);
    // }
    
    recordAnswer(false);
    
    // For Quick Sight, hide target letter and show selection options
    if (currentQuestion && currentQuestion.type === 'quickSight') {
      setShowQuickSightTarget(false);
      setShowQuickSightOptions(true);
    }
  }, [currentQuestion]);

  // Timer functionality for Quick Sight (same as original)
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'quickSight' && !showFeedback && questions.length > 0) {
      // Always reset timer state for new question
      const timeLimit = getTimeLimit(difficultySettings.complexity);
      setTimeRemaining(timeLimit);
      setIsTimerRunning(true);
      setShowQuickSightTarget(true);
      setShowQuickSightOptions(false);
      setShowTimeoutMessage(false); // Reset timeout message for new question
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto-submit wrong answer
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        setIsTimerRunning(false);
      };
    }
  }, [currentQuestionIndex, currentQuestion, showFeedback, difficultySettings.complexity, questions.length]);

  // Get time limit for Quick Sight and Memory Challenge (same as MemoryGame)
  const getTimeLimit = (complexity: string) => {
    // Base time limits by complexity
    const baseTime = {
      basic: 8,
      intermediate: 6,
      advanced: 5,
      expert: 4,
      master: 3
    };
    
    // Additional level-based time reduction for higher levels
    const levelBonus = Math.max(0, Math.floor((currentLevel - 1) * 0.2));
    
    return Math.max(3, baseTime[complexity as keyof typeof baseTime] - levelBonus);
  };

  // Enhanced audio function for different languages
  const playAudio = async (text: string, language: Language) => {
    // For Telugu, try to use local audio files first
    if (language === 'te') {
      const audioPlayed = await teluguAudioManager.playAudio(text);
      if (audioPlayed) {
        return; // Successfully played audio file
      }
    }
    
    // For Kannada, try to use local audio files first
    if (language === 'kn') {
      const audioPlayed = await kannadaAudioManager.playAudio(text);
      if (audioPlayed) {
        return; // Successfully played audio file
      }
    }
    
    // For Marathi, try to use local audio files first
    if (language === 'mr') {
      const audioPlayed = await marathiAudioManager.playAudio(text);
      if (audioPlayed) {
        return; // Successfully played audio file
      }
    }
    
    // Fallback to TTS for all languages
    playTTSAudio(text, language);
  };

  const playTTSAudio = (text: string, language: Language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Language-specific settings
    switch (language) {
      case 'te':
        utterance.lang = 'te-IN';
        utterance.rate = 0.6; // Slower for Telugu
        utterance.pitch = 0.9;
        utterance.volume = 0.9;
        break;
      case 'mr':
        utterance.lang = 'mr-IN';
        utterance.rate = 0.6; // Slower for Marathi
        utterance.pitch = 0.9;
        utterance.volume = 0.9;
        break;
      case 'kn':
        utterance.lang = 'kn-IN';
        utterance.rate = 0.6; // Slower for Kannada
        utterance.pitch = 0.9;
        utterance.volume = 0.9;
        break;
      default:
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
    }

    // Try to find the best voice (with fallback for voice loading)
    const findAndSetVoice = () => {
      const voices = speechSynthesis.getVoices();
      let bestVoice = null;

      if (voices.length === 0) return;

      if (language === 'te') {
        bestVoice = voices.find(voice => 
          voice.lang.includes('te') || 
          voice.lang.includes('hi-IN') || 
          voice.lang.includes('en-IN')
        );
      } else if (language === 'mr') {
        bestVoice = voices.find(voice => 
          voice.lang.includes('mr') || 
          voice.lang.includes('hi-IN') || 
          voice.lang.includes('en-IN')
        );
      } else if (language === 'kn') {
        bestVoice = voices.find(voice => 
          voice.lang.includes('kn') || 
          voice.lang.includes('hi-IN') || 
          voice.lang.includes('en-IN')
        );
      } else {
        bestVoice = voices.find(voice => 
          voice.lang.includes('en-US') || 
          voice.lang.includes('en-GB')
        );
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    };

    findAndSetVoice();
    speechSynthesis.speak(utterance);
  };

  // Auto-play / setup for memory challenge only; Letter Hunt audio is handled by its core
  useEffect(() => {
    if (currentQuestion && !showFeedback && selectedLanguage && 
        selectedLevel !== null && !showLevelSelector) {
      const timer = setTimeout(() => {
        // For memory challenge, show sequence for 3 seconds then hide
        if (currentQuestion.type === 'memoryChallenge') {
          setShowSequence(true);
          setSequenceTimer(3);
          setUserInput([]);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, currentQuestion, showFeedback, selectedLanguage, selectedLevel, showLevelSelector]);

  // Generate question-specific letter options (correct letters + distractors) - same as MemoryGame
  const generateQuestionLetterOptions = (sequence: string[]) => {
    const correctLetters = [...sequence];
    const numDistractors = correctLetters.length; // Same number of distractors as correct letters
    
    // Get all available letters for the language
    // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (selectedLanguage === 'en' || selectedLanguage === 'te' || selectedLanguage === 'mr' || selectedLanguage === 'kn') 
        ? selectedLanguage 
        : 'en';
    const availableLetters = selectedLanguage ? memoryGameDataLoader.getAllLetters(supportedLanguage) : [];
    
    // Filter out correct letters to get potential distractors
    const potentialDistractors = availableLetters.filter(letter => !correctLetters.includes(letter));
    
    // Shuffle and select distractors
    const shuffledDistractors = potentialDistractors.sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, numDistractors);
    
    // Combine correct letters and distractors, then shuffle
    const allOptions = [...correctLetters, ...selectedDistractors];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  // Generate letter options when question changes - same as MemoryGame
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'memoryChallenge' && !showSequence) {
      const newOptions = generateQuestionLetterOptions(currentQuestion.sequence || []);
      setCurrentLetterOptions(newOptions);
    }
  }, [currentQuestionIndex, currentQuestion, showSequence, selectedLanguage]);

  // Timer for showing sequence (same as MemoryGame)
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'memoryChallenge' && showSequence && !showFeedback && questions.length > 0) {
      // Start timer when showing sequence
      const timeLimit = getTimeLimit(difficultySettings.complexity);
      setTimeRemaining(timeLimit);
      setIsTimerRunning(true);
      setShowTimeoutMessage(false); // Reset timeout message for new question
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - automatically move to input phase
            setIsTimerRunning(false);
            setShowSequence(false);
            setSequenceTimer(3);
            setShowTimeoutMessage(true); // Show timeout message
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        setIsTimerRunning(false);
      };
    }
  }, [currentQuestionIndex, currentQuestion, showSequence, showFeedback, difficultySettings.complexity, questions.length]);

  // Handle different game type answers (same logic as original games)
  const handleAnswer = async (answer: string | number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    let correct = false;

    switch (currentQuestion.type) {
      case 'letterHunt':
        correct = answer === currentQuestion.target;
        break;
      case 'quickSight':
        if (!currentQuestion) return;
        setIsTimerRunning(false);
        correct = answer === currentQuestion.targetPosition;
        if (correct) {
          setScore(prevScore => prevScore + 1);
        }
        break;
      case 'memoryChallenge':
        correct = answer === currentQuestion.target;
        break;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setShowTimeoutMessage(false);
    
    // Send telemetry ASSESS event
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    
    // For quick sight, send the actual letter instead of position index
    let telemetryAnswer = answer;
    if (currentQuestion.type === 'quickSight' && typeof answer === 'number' && currentQuestion.letters) {
      telemetryAnswer = currentQuestion.letters[answer] || answer;
    }
    
    await sessionTelemetryManager.sendAssessEvent(
      currentQuestion.id,
      currentQuestion.type,
      telemetryAnswer,
      currentQuestion.target,
      correct,
      responseTime
    );
    
    // Update subsession with question attempt
    sessionTelemetryManager.updateSubSession(correct);
    recordAnswer(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      userAnswer: telemetryAnswer,
      correctAnswer: currentQuestion.target,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    // Update session tracking
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser) {
      gameSessionTracker.updateLevelSession(
        currentUser.username,
        gameKey,
        currentLevel,
        currentQuestionIndex + 1,
        totalCorrect + (correct ? 1 : 0)
      );
    }
    
    if (correct && currentQuestion.type !== 'quickSight') {
      setScore(prevScore => prevScore + 10);
      setTotalCorrect(prevTotal => prevTotal + 1);
    } else if (correct && currentQuestion.type === 'quickSight') {
      setTotalCorrect(prevTotal => prevTotal + 1);
    }

    // Don't auto-advance - player must manually continue (same as original games)
    // This ensures they see feedback and can't skip questions
  };

  const handleContinue = useCallback(async () => {
    // Player manually continues to next question (no retry for Memory Challenge)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setUserInput([]);
      setShowSequence(true);
      setSequenceTimer(3);
      setTimeRemaining(0);
      setIsTimerRunning(false);
      setShowQuickSightTarget(true);
      setShowQuickSightOptions(false);
      setCurrentLetterOptions([]);
      setShowTimeoutMessage(false); // Reset timeout message for next question
    } else {
      // Level complete - check if player can advance
      // Calculate score percentage for level completion
      const scorePercentage = (totalCorrect / questions.length) * 100;
      const canAdvance = scorePercentage >= 80; // Minimum 80% to advance
      
      // Calculate total time spent
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000); // Convert to seconds
      
      // End session tracking
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        gameSessionTracker.endLevelSession(
          currentUser.username,
          gameKey,
          currentLevel,
          questions.length,
          totalCorrect
        );
        
        // Send tracking assessment data to backend
        console.log('📊 Sending tracking assessment data for level completion...');
        
        // Get current session and subsession IDs from telemetry manager
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        const sessionId = currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;
        
        // Use ref or capture latest state to ensure all questions are included
        setQuestionSummaries((latestSummaries) => {
          // Calculate actual correct count from summaries for accuracy
          const actualCorrect = latestSummaries.filter(q => q.isCorrect).length;
          
          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Letter Games',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: questions.length,
            correctAnswers: actualCorrect,
            totalScore: actualCorrect,
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: sessionId,
            subsessionId: subsessionId,
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: !canAdvance,
              scorePercentage: scorePercentage
            }
          });
          return latestSummaries;
        });
      }
      
      // End telemetry subsession
      await sessionTelemetryManager.endSubSession();
      
      if (canAdvance) {
        // Session tracker handles level advancement automatically
        // Check if level was advanced by comparing with previous level
        if (currentUser) {
          const newSessionProgress = gameSessionTracker.getGameProgress(currentUser.username, gameKey);
          if (newSessionProgress && newSessionProgress.currentLevel > previousLevel) {
            setShowLevelUp(true);
          }
        }
      }
      
      // Show success screen for all completions (like individual games)
      setLevelFailed(!canAdvance);
      setIsGameComplete(true);
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, gameKey, currentLevel]);

  const addLetterToInput = (letter: string) => {
    if (userInput.length < (currentQuestion.sequence?.length || 0)) {
      setUserInput([...userInput, letter]);
    }
  };

  const removeLastLetter = () => {
    setUserInput(userInput.slice(0, -1));
  };

  const checkSequence = async () => {
    const correct = JSON.stringify(userInput) === JSON.stringify(currentQuestion.sequence);
    setIsCorrect(correct);
    setShowFeedback(true);
    setShowTimeoutMessage(false);
    
    // Send telemetry ASSESS event
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    await sessionTelemetryManager.sendAssessEvent(
      currentQuestion.id,
      currentQuestion.type,
      userInput.join(""),
      currentQuestion.target,
      correct,
      responseTime
    );
    
    // Update subsession with question attempt
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      userAnswer: userInput.join(""),
      correctAnswer: currentQuestion.target,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    // Record answer for progress tracking
    recordAnswer(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 30);
      setTotalCorrect(prevTotal => prevTotal + 1);
    }

    // Don't auto-advance - player must manually click "Next" button
    // This ensures they see feedback and can't skip questions

    // Don't auto-advance - player must manually click "Next" button
    // This ensures they see feedback and can't skip questions
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setUserInput([]);
    setShowSequence(true);
    setShowQuickSightTarget(true);
    setShowQuickSightOptions(false);
    setCurrentLetterOptions([]);
    setShowTimeoutMessage(false); // Reset timeout message
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateCombinedQuestions(selectedLanguage, selectedLevel);
      setQuestions(newQuestions);
    }
  };

  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/combined-letter-games/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/combined-letter-games');
  };

  const handleCollectBadge = () => {
    navigate('/combined-letter-games/collect-badge');
  };

  // Handle back button with telemetry
  const handleBackWithTelemetry = async () => {
    // Only send telemetry if we're in the middle of a level (not level selector)
    if (selectedLevel !== null && !showLevelSelector && !isGameComplete) {
      console.log('📊 Back button clicked during level play - sending telemetry events');
      
      // End current telemetry subsession with back button context
      await sessionTelemetryManager.endSubSessionWithBackButton();
      
      // Update session tracking to mark level as incomplete
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        gameSessionTracker.endLevelSession(
          currentUser.username,
          gameKey,
          currentLevel,
          currentQuestionIndex, // Questions attempted so far
          totalCorrect
        );
      }
    }
    
    // Call the original onBack function
    onBack();
  };

  const calculateStars = () => {
    if (questions.length === 0) return 0;
    const percentage = (totalCorrect / questions.length) * 100;
    
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0; // Below 50% = 0 stars
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (questions.length > 0) {
      if (totalCorrect === questions.length) {
        achievements.push("Letter Master - Perfect Score!");
      }
      if (totalCorrect >= Math.floor(questions.length * 0.8)) {
        achievements.push("Quick Learner - Great Progress!");
      }
    }
    if (showLevelUp) {
      achievements.push(`Level Up! Advanced to next level!`);
    }
    return achievements;
  };


  // Show loading state while fetching backend level
  if (isLoadingLevel && selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show preview screen first (before level selector) - only if backend level is 1, OR if forcePreview is true (for demo)
  if (showPreview && selectedLanguage && (backendCurrentLevel === 1 || forcePreview)) {
    return (
      <CombinedLetterGamesPreview
        onStartGame={() => {
          setShowPreview(false);
          setForcePreview(false);
        }}
        onBack={() => {
          setForcePreview(false);
          onBack();
        }}
        difficulty={difficultySettings.complexity as "Easy" | "Medium" | "Hard"}
        estimatedTime="5-8 min"
        level={currentLevel}
      />
    );
  }

  // Show level selection screen
  if (showLevelSelector) {
    // Check if there's a failed level stored in localStorage for this game
    const failedLevelKey = `failedLevel_${gameKey}`;
    const failedLevel = localStorage.getItem(failedLevelKey);
    
    // Use the actual current level being played
    // Priority: failedLevel > sessionCurrentLevel
    const levelSelectorCurrentLevel = failedLevel ? parseInt(failedLevel) : sessionCurrentLevel;
    
    return (
      <LevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={levelSelectorCurrentLevel}
        maxLevels={languageLevels.maxLevels}
        onLevelSelect={handleLevelSelect}
        onBack={() => {
          setShowPreview(true);
          onBack();
        }}
        onDemo={() => {
          setForcePreview(true);
          setShowPreview(true);
        }}
        gameTitle="Combined Letter Games"
        showBadge={true}
        onCollectBadge={handleCollectBadge}
        badgeTooltip="Memory Card Challenge"
        gameKey={gameKey}
      />
    );
  }


  // Show success screen when game is complete
  if (isGameComplete) {
    // If level failed, show try again screen
    if (levelFailed) {
      return (
        <TryAgain
          totalCorrect={totalCorrect}
          totalQuestions={questions.length}
          selectedLanguage={selectedLanguage!}
          currentLevel={currentLevel}
          gameKey={gameKey}
          onTryAgain={resetGame}
          onBackToHome={onBack}
        />
      );
    }
    
    // If level passed, show success screen
    return (
      <SuccessScreen
        gameTitle={`Combined Letter Games - ${LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}`}
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          const nextLevel = currentLevel + 1;
          // Navigate to the next level
          navigate(`/combined-letter-games/level/${nextLevel}`);
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    return (
      <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Loading Combined Letter Games...</h1>
              <p className="text-sm sm:text-base">Setting up your questions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game interface based on question type (same UI as original games)
  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handleBackWithTelemetry}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Combined Letter Games
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {selectedLevel !== null && selectedLevel !== sessionCurrentLevel ? 
                  `Practice Level ${selectedLevel}` : 
                  `Level ${currentLevel} / ${languageLevels.maxLevels}`
                } • {difficultySettings.complexity}
              </span>
            </div>
          </div>
          
          {/* <Button 
            variant="outline" 
            onClick={resetGame}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button> */}
        </div>

        {/* Main Content Card */}
        <Card className="flex-1 p-2 sm:p-3 md:p-3 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col">
          {/* Progress */}
          <div className="mb-1 flex-shrink-0">
            <ProgressBar 
              current={currentQuestionIndex + 1} 
              total={questions.length} 
              score={totalCorrect}
              showCompleteMessage={false}
            />
          </div>

          {/* Timer with Clockwise Timer for Quick Sight and Memory Challenge - Hide when time is up or feedback is shown */}
          {currentQuestion && (
            (currentQuestion.type === 'quickSight') || 
            (currentQuestion.type === 'memoryChallenge' && showSequence)
          ) && !showTimeoutMessage && !showFeedback && (
            <div className="mb-1 flex-shrink-0 flex justify-center sm:justify-end">
              <div className="flex flex-col items-center gap-1">
                <div className="scale-[0.7] sm:scale-[0.72] md:scale-[0.75] origin-center">
                  <ClockwiseTimer 
                    timeRemaining={timeRemaining}
                    totalTime={getTimeLimit(difficultySettings.complexity)}
                    className="justify-center"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Timeout Message - Show when time is up, keep space when hidden during feedback */}
          {timeRemaining === 0 && (
            <div className="mb-1 flex-shrink-0 flex justify-center sm:justify-end" style={{ visibility: showTimeoutMessage ? 'visible' : 'hidden' }}>
              <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm sm:text-base">⏰</span>
                  <div className="text-orange-700 font-bold text-xs sm:text-sm">
                    {selectedLanguage === 'te' ? 'ముగిసింది!' :
                     selectedLanguage === 'mr' ? 'संपला!' :
                     selectedLanguage === 'kn' ? 'ಮುಗಿಯಿತು!' :
                     "Time Up!"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Area */}
          <div className="flex-1 flex flex-col justify-start px-1 sm:px-2">
            {/* Game Type Indicator - Hide during Memory Challenge input phase */}
            {!(currentQuestion.type === 'memoryChallenge' && !showSequence) && (
              <div className="text-center mb-1 flex-shrink-0 mt-0 sm:mt-1">
                <div className="flex items-center justify-center gap-1.5">
                  {currentQuestion.type === 'letterHunt' && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                  {currentQuestion.type === 'quickSight' && <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
                  {currentQuestion.type === 'memoryChallenge' && <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />}
                  <span className="font-semibold text-sm sm:text-base">
                    {currentQuestion.type === 'letterHunt' && 'Letter Hunt'}
                    {currentQuestion.type === 'quickSight' && 'Quick Sight'}
                    {currentQuestion.type === 'memoryChallenge' && 'Memory Challenge'}
                  </span>
                </div>
              </div>
            )}

          {/* Game-specific content via shared cores */}
            {currentQuestion.type === 'letterHunt' && (
            <LetterHuntGameCore
              questions={[{
                target: currentQuestion.target,
                options: currentQuestion.options || [],
                audio: currentQuestion.audioText,
                audioText: currentQuestion.audioText,
                language: currentQuestion.language,
                complexity: currentQuestion.complexity
              }]}
              currentQuestionIndex={0}
              selectedAnswer={typeof selectedAnswer === 'string' ? selectedAnswer : null}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              mode="game"
              onAnswerSelect={(ans) => handleAnswer(ans)}
              onContinue={handleContinue}
              showSpeaker={true}
              showContinueButton={true}
              showProgress={false}
              isPreview={false}
                      disabled={showFeedback}
              className="bg-transparent shadow-none border-0 p-0"
              useContainer="none"
            />
            )}

            {currentQuestion.type === 'quickSight' && (
            <ROARRapidVisualGameCore
              currentQuestion={{
                target: currentQuestion.target,
                letters: currentQuestion.letters || [],
                targetPosition: currentQuestion.targetPosition || 0,
                complexity: currentQuestion.complexity,
                language: currentQuestion.language
              }}
              mode="game"
              selectedLanguage={selectedLanguage || 'en'}
              timeRemaining={timeRemaining}
              isTimerRunning={isTimerRunning}
              showTargetLetter={showQuickSightTarget}
              showSelectionGrid={showQuickSightOptions}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              selectedPosition={typeof selectedAnswer === 'number' ? selectedAnswer as number : null}
              onPositionSelect={(pos) => handleAnswer(pos)}
              onContinue={handleContinue}
              className=""
            />
            )}

            {currentQuestion.type === 'memoryChallenge' && (
            <MemoryGameCore
              currentSequence={{
                sequence: currentQuestion.sequence || [],
                display: (currentQuestion.sequence || []).join('-'),
                complexity: currentQuestion.complexity,
                language: currentQuestion.language
              }}
              mode="game"
              selectedLanguage={selectedLanguage || 'en'}
              currentLevel={currentLevel}
              showSequence={showSequence}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              userInput={userInput}
              currentLetterOptions={currentLetterOptions}
              onLetterClick={addLetterToInput}
              onRemoveLast={removeLastLetter}
              onCheckSequence={checkSequence}
              onContinue={handleContinue}
              className=""
            />
            )}

            {/* Feedback and continue are rendered by core components */}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CombinedLetterGames;