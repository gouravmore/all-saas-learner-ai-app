import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { LetterGamePreview } from "./LetterGamePreview";
import { LetterHuntGameCore, type LetterHuntQuestion } from "./LetterHuntGameCore";
import { ArrowLeft, RotateCcw, TrendingUp, Globe } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { type LetterQuestion } from "../../utils/gameDataGenerators";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";

// Extended question interface for multilingual support
interface MultilingualLetterQuestion extends LetterHuntQuestion {
  // Additional properties can be added here if needed
}

interface LetterGameProps {
  onBack: () => void;
  initialLevel?: number; // Optional: set initial level when used without routing
  startLevel?: number; // Optional: start level for level range (takes precedence over initialLevel)
  endLevel?: number; // Optional: end level for level range
  disableNavigation?: boolean; // Optional: disable React Router navigation
  onLevelComplete?: (level: number) => void; // Optional: callback when level completes successfully (called when endLevel is reached)
  isShowcase?: boolean; // Optional: if true and level 1 fails, navigate to P1 instead of showing TryAgain
  onLevel1Failure?: () => void; // Optional: callback when level 1 fails in showcase mode (deprecated, use onLevelFailure)
  onLevelFailure?: (level: number) => void; // Optional: callback when any level fails in showcase mode
  customLetters?: string[]; // Optional: custom letters to use instead of level-based letters
  sub_session_id?: string; // Optional: Sub session ID for F1 flow
  sessionId?: string; // Optional: Session ID
  sub_milestone_level?: string; // Optional: Sub milestone level (e.g., "F1")
  apply_level?: string; // Optional: Apply level (e.g., "A1", "A2", "A3")
  sub_apply_level?: number; // Optional: Sub apply level (1, 2, or 3 - the level within the Apply step)
  onA3Pass?: () => void; // Optional: callback when A3 passes and sessionResult is "Pass"
  skipPreview?: boolean; // Optional: if true, skip the game preview/demo
}

export function LetterGame({ onBack, initialLevel, startLevel, endLevel, disableNavigation = false, onLevelComplete, isShowcase = false, onLevel1Failure, onLevelFailure, customLetters, sub_session_id,sessionId, sub_milestone_level, apply_level, sub_apply_level, onA3Pass, skipPreview = false }: LetterGameProps) {
  const navigate = useNavigate();
  const params = useParams<{ level?: string }>();
  const { level: urlLevel } = params || {};
  
  // Use startLevel if provided, otherwise use initialLevel
  const effectiveStartLevel = startLevel !== undefined ? startLevel : (initialLevel || null);
  
  // Use internal state for level when disableNavigation is true or no URL level
  const [internalLevel, setInternalLevel] = useState<number | null>(effectiveStartLevel);
  
  // Use URL level if available and navigation is enabled, otherwise use internal state
  const level = disableNavigation ? (internalLevel?.toString() || undefined) : urlLevel;
  
  // Override navigate function when navigation is disabled
  const navigateHandler = disableNavigation 
    ? (path: string) => {
        // Extract level from path like "/letter-game/level/1"
        const match = path.match(/\/level\/(\d+)/);
        if (match) {
          const newLevel = parseInt(match[1]);
          setInternalLevel(newLevel);
        }
      }
    : navigate;
  
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
  const [questions, setQuestions] = useState<MultilingualLetterQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [shouldExitImmediately, setShouldExitImmediately] = useState(false); // Flag to exit without showing SuccessScreen
  const [totalCorrect, setTotalCorrect] = useState(0);
  // New state for retry flow: track current displayed question (may be retry with shuffled options)
  const [currentDisplayedQuestion, setCurrentDisplayedQuestion] = useState<MultilingualLetterQuestion | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0); // Track total attempts including retries
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [levelFailed, setLevelFailed] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false); // Track if level 1 has any percentage > 0%
  const [lives, setLives] = useState<number>(3); // Lives system: 3 red hearts
  const [gameEndedByLives, setGameEndedByLives] = useState(false); // Track if game ended due to lives lost
  const [assessmentTrackingCreated, setAssessmentTrackingCreated] = useState(false); // Track if assessment tracking has been created for this level completion
  const assessmentTrackingCreatedRef = useRef(false); // Use ref for synchronous tracking to prevent race conditions
  
  // Telemetry state
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations (using English names for all languages)
  const getLanguageLevels = (language: Language) => {
    switch (language) {
      case 'te':
        return {
          maxLevels: 10, // Standardized to 10 levels for Telugu
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      case 'mr':
        return {
          maxLevels: 10, // Standardized to 10 levels for Marathi
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      case 'kn':
        return {
          maxLevels: 10, // Standardized to 10 levels for Kannada
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      default:
        return {
          maxLevels: 10, // Standard levels for English
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
    }
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `letterHunt_${selectedLanguage}` : 'letterHunt';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel || gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');

  // Language data - now uses comprehensive letter sets from JSON
  // Note: memoryGameDataLoader only supports en, te, mr, kn (not hi)
  // Since selectedLanguage can never be 'hi' (LanguageContext blocks it), this is safe
  const getLanguageLetters = (language: Language): string[] => {
    // Ensure only supported languages are passed (fallback to 'en' if somehow 'hi' is passed)
    const supportedLanguage = (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';
    return memoryGameDataLoader.getAllLetters(supportedLanguage);
  };

  const getAudioText = (language: Language, letter: string): string => {
    // Just return the letter itself for direct pronunciation
    return letter;
  };

  // Helper function to get corresponding short/long vowel for Indic languages
  const getCorrespondingVowel = (language: Language, letter: string): string | null => {
    // Vowel pairs for Indic languages (short/long)
    const vowelPairs: Record<string, Record<string, string>> = {
      te: {
        'అ': 'ఆ', 'ఆ': 'అ',  // a/aa
        'ఇ': 'ఈ', 'ఈ': 'ఇ',  // i/ii
        'ఉ': 'ఊ', 'ఊ': 'ఉ',  // u/uu
        'ఎ': 'ఏ', 'ఏ': 'ఎ',  // e/ee
        'ఒ': 'ఓ', 'ఓ': 'ఒ',  // o/oo
      },
      kn: {
        'ಅ': 'ಆ', 'ಆ': 'ಅ',  // a/aa
        'ಇ': 'ಈ', 'ಈ': 'ಇ',  // i/ii
        'ಉ': 'ಊ', 'ಊ': 'ಉ',  // u/uu
        'ಎ': 'ಏ', 'ಏ': 'ಎ',  // e/ee
        'ಒ': 'ಓ', 'ಓ': 'ಒ',  // o/oo
      },
      mr: {
        'अ': 'आ', 'आ': 'अ',  // a/aa
        'इ': 'ई', 'ई': 'इ',  // i/ii
        'उ': 'ऊ', 'ऊ': 'उ',  // u/uu
        'ए': 'ऐ', 'ऐ': 'ए',  // e/ai
        'ओ': 'औ', 'औ': 'ओ',  // o/au
        'कि':'की', 'की':'कि',
        'गि':'गी', 'गी':'गि',
        'ति':'ती', 'ती':'ति',
        'लु':'लू', 'लू':'लु',
      }
    };

    if (language === 'te' || language === 'kn' || language === 'mr') {
      return vowelPairs[language]?.[letter] || null;
    }
    return null;
  };

  const generateMultilingualQuestions = (language: Language, level: number, complexity: string, count: number = 10): MultilingualLetterQuestion[] => {
    // Get level-appropriate letter set from JSON data
    const getLevelLetters = (language: Language, level: number): string[] => {
      // If customLetters are provided, use them instead of level-based letters
      if (customLetters && customLetters.length > 0) {
        return customLetters;
      }
      
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      // Since selectedLanguage can never be 'hi' (LanguageContext blocks it), this is a safety check
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' | 'hi' = 
        (language === 'en' || language === 'te' || language === 'mr' || language === 'kn' || language === 'hi') 
          ? language 
          : 'en';
      
      // For Telugu, Kannada, and Marathi, use exact level mapping
      if (supportedLanguage === 'te' || supportedLanguage === 'kn' || supportedLanguage === 'mr' || supportedLanguage === 'en' || supportedLanguage === 'hi') {
        const levelKey = level.toString();
        return memoryGameDataLoader.getLettersByLevel(supportedLanguage, levelKey);
      }
      
      // For other languages, use complexity mapping
      if (level <= 2) return memoryGameDataLoader.getLetters(supportedLanguage, 'basic');
      if (level <= 4) return memoryGameDataLoader.getLetters(supportedLanguage, 'intermediate');
      if (level <= 6) return memoryGameDataLoader.getLetters(supportedLanguage, 'advanced');
      if (level <= 8) return memoryGameDataLoader.getLetters(supportedLanguage, 'expert');
      return memoryGameDataLoader.getLetters(supportedLanguage, 'master');
    };
    
    const lettersToUse = getLevelLetters(language, level);
    const questions: MultilingualLetterQuestion[] = [];
    
    // Strategy:
    // 1. If we have >= count letters: use all unique letters
    // 2. If we have < count letters: use all unique letters first, then fill remaining with random unique selections
    const availableUniqueCount = Math.min(lettersToUse.length, count);
    const remainingCount = count - availableUniqueCount;
    
    // First phase: Use all available unique letters (shuffled)
    const shuffledLetters = [...lettersToUse].sort(() => Math.random() - 0.5);
    const uniqueTargets = shuffledLetters.slice(0, availableUniqueCount);
    
    // Second phase: For remaining questions, select randomly but ensure no duplicates among remaining ones
    const remainingTargets: string[] = [];
    const remainingUsed = new Set<string>();
    
    for (let i = 0; i < remainingCount; i++) {
      let target: string;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Select a random letter that hasn't been used in the remaining batch
      do {
        target = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        attempts++;
      } while (remainingUsed.has(target) && attempts < maxAttempts);
      
      remainingTargets.push(target);
      remainingUsed.add(target);
    }
    
    // Combine all targets
    const allTargets = [...uniqueTargets, ...remainingTargets];
    
    for (let i = 0; i < count; i++) {
      const target = allTargets[i];
      
      // Get corresponding vowel to exclude (for Indic languages)
      const correspondingVowel = getCorrespondingVowel(language, target);
      
      // Create options (target + 3 random unique letters)
      const options = [target];
      let attempts = 0;
      const maxAttempts = lettersToUse.length * 3; // Reasonable upper bound
      
      while (options.length < 4 ) { // && attempts < maxAttempts
        const randomLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        // Exclude if already in options or if it's the corresponding vowel (for Indic languages)
        const isExcluded = options.includes(randomLetter) || 
                          (correspondingVowel && randomLetter === correspondingVowel);
        if (!isExcluded) {
          options.push(randomLetter);
        }
        attempts++;
      }
      
      // Shuffle options
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }

      questions.push({
        target,
        options,
        audio: getAudioText(language, target),
        audioText: getAudioText(language, target),
        language,
        complexity
      });
    }

    return questions;
  };

  // Initialize game session and questions when language or level is selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        // Add a small delay to ensure state reset completes first
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Reset assessment tracking flag when starting a new level
        assessmentTrackingCreatedRef.current = false;
        setAssessmentTrackingCreated(false);
        
        const session = startSession(gameKey);
        setPreviousLevel(currentLevel);
        
        // Initialize tracking assessment
        const now = Date.now();
        setLevelStartTime(now);
        setQuestionStartTime(now);
        setQuestionSummaries([]);
        
        // Start telemetry subsession
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        if (currentSubSession && currentSubSession.isActive) {
          await sessionTelemetryManager.endSubSession();
        }
        await sessionTelemetryManager.startSubSession(gameKey, currentLevel, selectedLanguage);
        
        const newQuestions = generateMultilingualQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10
        );
        setQuestions(newQuestions);
      }
    };
    initializeGame();
  }, [selectedLanguage, selectedLevel, gameKey, isGameComplete]);

  // Note: Page refresh is handled in App.tsx via beforeunload event
  // The initializeGame useEffect above will automatically start a new subsession after refresh

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
          // Check if level 1 has any progress (> 0%)
          const level1Data = (result.data as any)['level1'];
          const level1Percent = level1Data?.metadata?.scorePercentage ?? 0;
          const level1Completed = level1Data?.metadata?.isCompleted ?? false;
          const hasLevel1Progress = level1Completed || level1Percent > 0;
          setLevel1HasProgress(hasLevel1Progress);

          // Compute effective current level based on successful progress only
          let highestSuccessfulLevel = 0;
          Object.keys(result.data).forEach((levelKey: string) => {
            if (!levelKey.startsWith('level')) return;
            const levelNumber = parseInt(levelKey.replace('level', ''));
            if (Number.isNaN(levelNumber)) return;
            const levelData = (result.data as any)[levelKey];
            const percent = levelData?.metadata?.scorePercentage ?? 0;
            const completed = levelData?.metadata?.isCompleted ?? false;
            if (completed || percent > 0) {
              highestSuccessfulLevel = Math.max(highestSuccessfulLevel, levelNumber);
            }
          });

          const computedFromProgress = Math.min(
            Math.max(1, (highestSuccessfulLevel > 0 ? highestSuccessfulLevel + 1 : 1)),
            languageLevels.maxLevels
          );
          const backendProvided = result.metadata?.currentLevel || 1;
          const effectiveCurrentLevel = Math.min(
            Math.max(computedFromProgress, backendProvided),
            languageLevels.maxLevels
          );
          setBackendCurrentLevel(effectiveCurrentLevel);
        }
      } catch (error) {
        console.error('Error fetching backend level:', error);
      } finally {
        setIsLoadingLevel(false);
      }
    };

    fetchBackendLevel();
  }, [selectedLanguage, gameKey]);

  // Auto-show level selector when component loads
  useEffect(() => {
    if (selectedLanguage && selectedLevel === null) {
      // Level selector is now controlled by URL routing
      // No need to set showLevelSelector state
    }
  }, [selectedLanguage, selectedLevel]);

  // Reset game state when navigating to a new level via URL
  useEffect(() => {
    if (selectedLevel !== null) {
      // Reset game state when navigating to a specific level
      setCurrentQuestionIndex(0);
      setScore(0);
      setTotalCorrect(0);
      setTotalAttempts(0);
      setSelectedLetter(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setCurrentDisplayedQuestion(null);
      setLives(3); // Reset lives to 3
      setGameEndedByLives(false); // Reset lives lost flag
      
      // Clear any stored failed level when user navigates to a level
      const failedLevelKey = `failedLevel_${gameKey}`;
      localStorage.removeItem(failedLevelKey);
    }
  }, [selectedLevel, selectedLanguage, gameKey]);

  // Helper function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Helper function to create a question with shuffled options
  const createQuestionWithShuffledOptions = useCallback((question: MultilingualLetterQuestion): MultilingualLetterQuestion => {
    return {
      ...question,
      options: shuffleArray(question.options)
    };
  }, [shuffleArray]);

  // Get the current question to display (either from original questions or retry with shuffled options)
  const currentQuestion = currentDisplayedQuestion || questions[currentQuestionIndex];
  const progressCurrent = questions.length === 0
    ? 0
    : Math.min(currentQuestionIndex + 1, questions.length);

  // Initialize currentDisplayedQuestion when questions are loaded or question index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const originalQuestion = questions[currentQuestionIndex];
      // Create question with shuffled options for new question
      setCurrentDisplayedQuestion(createQuestionWithShuffledOptions(originalQuestion));
    }
  }, [questions, currentQuestionIndex, createQuestionWithShuffledOptions]);

  // Track question start time
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentDisplayedQuestion]);

  // Handle feedback audio completion - if lives reached 0, end game after audio completes
  const handleFeedbackAudioComplete = useCallback(() => {
    if (lives === 0 && !isGameComplete) {
      setGameEndedByLives(true);
    }
  }, [lives, isGameComplete]);

  // Handle game end when all lives are lost - trigger after audio completes
  useEffect(() => {
    const handleGameEndByLives = async () => {
      if (!gameEndedByLives || isGameComplete || assessmentTrackingCreatedRef.current) return; // Prevent multiple calls
      
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      const currentUser = sessionManager.getCurrentUser();
      
      if (currentUser) {
        // Set flag BEFORE calling API to prevent duplicate calls (use ref for synchronous check)
        assessmentTrackingCreatedRef.current = true;
        setAssessmentTrackingCreated(true);

        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
        const effectiveSessionId = sessionId || currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;

        // For lives lost scenario: maxScore = totalCorrect, totalScore = totalAttempts
        const totalQuestionCount = Math.max(1, currentQuestionIndex + 1); // Questions attempted
        const scorePercentage = totalQuestionCount > 0 ? (totalCorrect / totalQuestionCount) * 100 : 0;

        // Get latest question summaries
        setQuestionSummaries((latestSummaries) => {
          // For F1/F2 flow Apply steps, sub_apply_level should be the current level being played (1, 2, or 3)
          // Use currentLevel (the actual level being played) instead of the prop value
          const effectiveSubApplyLevel = apply_level ? currentLevel : undefined;
          
          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Letter Hunt Game',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: totalCorrect, // This becomes totalMaxScore (max possible score = number of correct answers)
            correctAnswers: 0, // Not used when totalScore is provided, but required by interface
            totalScore: totalAttempts, // This becomes totalScore (actual score = number of attempts)
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: effectiveSessionId,
            subsessionId: subsessionId,
            sub_session_id: sub_session_id, // Pass F1/F2 flow sub session ID
            sub_milestone_level: sub_milestone_level, // Pass F1/F2 flow sub milestone level ("F1" or "F2")
            apply_level: apply_level, // Pass apply level (A1, A2, A3) from config
            sub_apply_level: effectiveSubApplyLevel, // Pass current level within Apply step (1, 2, or 3)
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: true,
              scorePercentage: scorePercentage,
              totalAttempts: totalAttempts,
              totalQuestionsAttempted: totalQuestionCount, // Store actual questions attempted
              gameEndedByLives: true, // Flag indicating game ended due to lives lost
              livesLost: true
            }
          });
          return latestSummaries;
        });
      }

      // End telemetry subsession and flush events
      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();

      endSession();
      setLevelFailed(true);
      setIsGameComplete(true);
    };

    if (gameEndedByLives && lives === 0 && !isGameComplete) {
      handleGameEndByLives();
    }
  }, [gameEndedByLives, lives, isGameComplete, assessmentTrackingCreated, currentQuestionIndex, totalCorrect, totalAttempts, levelStartTime, selectedLanguage, currentLevel, difficultySettings.complexity, gameKey, endSession]);

  const handleLetterSelect = async (letter: string) => {
    if (showFeedback || isGameComplete) return;
    
    setSelectedLetter(letter);
    const correct = letter === currentQuestion.target;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Increment total attempts (including retries)
    setTotalAttempts(prev => prev + 1);
    
    // Record the answer for adaptive learning
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `letter_${currentLevel}_${currentQuestionIndex}`;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'letterHunt',
      letter,
      currentQuestion.target,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct, totalAttempts + 1);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'letterHunt',
      userAnswer: letter,
      correctAnswer: currentQuestion.target,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity || 'medium'
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prevScore => prevScore + 10);
      setTotalCorrect(prevTotal => prevTotal + 1);
    } else {
      // Lose a life on incorrect answer
      // If lives reach 0, feedback audio will play and then handleFeedbackAudioComplete will end the game
      setLives(prevLives => Math.max(0, prevLives - 1));
    }

    // Don't auto-advance - player must manually continue
  };

  const handleContinue = useCallback(async () => {
    // If game already ended by lives, don't process continue
    if (gameEndedByLives || lives === 0) {
      return;
    }

    const totalQuestionCount = questions.length || 1;
    const hasCompletedAllQuestions = totalCorrect >= totalQuestionCount && isCorrect;

      if (hasCompletedAllQuestions) {
      // Prevent duplicate assessment tracking calls (use ref for synchronous check)
      if (assessmentTrackingCreatedRef.current) {
        console.log("Assessment tracking already created for this level, skipping duplicate call");
        return;
      }

      const attemptsForPercentage = Math.max(totalAttempts, 1);
      const scorePercentage = (totalCorrect / attemptsForPercentage) * 100;
      const canAdvance = true;

      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);

      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        // Use sessionId prop if provided, otherwise fallback to telemetry sessionId
        const effectiveSessionId = sessionId || currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;

        // Set flag BEFORE calling API to prevent duplicate calls (use ref for synchronous check)
        assessmentTrackingCreatedRef.current = true;
        setAssessmentTrackingCreated(true);

        setQuestionSummaries((latestSummaries) => {
          const actualCorrect = latestSummaries.filter(q => q.isCorrect).length;
          const totalAttemptsLogged = latestSummaries.length;

          // For F1 flow Apply steps, sub_apply_level should be the current level being played (1, 2, or 3)
          // Use currentLevel (the actual level being played) instead of the prop value
          const effectiveSubApplyLevel = apply_level ? currentLevel : undefined;
          
          // Call assessment tracking and check for A3 pass asynchronously
          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Letter Hunt Game',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: totalCorrect, // This becomes totalMaxScore (max possible score = correct answers)
            correctAnswers: totalAttempts, // This becomes totalScore (actual score = attempts)
            totalScore: totalAttempts, // Also pass explicitly (though service calculates from correctAnswers)
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: effectiveSessionId,
            subsessionId: subsessionId,
            sub_session_id: sub_session_id, // Pass F1 flow sub session ID
            sub_milestone_level: sub_milestone_level, // Pass F1 flow sub milestone level ("F1")
            apply_level: apply_level, // Pass apply level (A1, A2, A3) from config
            sub_apply_level: effectiveSubApplyLevel, // Pass current level within Apply step (1, 2, or 3)
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: false,
              scorePercentage: scorePercentage,
              totalAttempts: totalAttemptsLogged,
              gameEndedByLives: false
            }
          }).then((assessmentResponse) => {
            // Check if this is A3 and sessionResult is "Pass"
            if (apply_level === "A3" && assessmentResponse?.data?.sessionResult === "Pass" && onA3Pass) {
              console.log("A3 passed with sessionResult: Pass - calling onA3Pass callback");
              onA3Pass();
            }
          }).catch((error) => {
            console.error("Error in assessment tracking:", error);
          });
          
          return latestSummaries;
        });
      }

      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();

      if (canAdvance) {
        endSession();
        const newProgress = getGameProgress(gameKey);
        if (newProgress.currentLevel > previousLevel) {
          setShowLevelUp(true);
        }
      }

      setLevelFailed(!canAdvance);
      setIsGameComplete(true);
      
      // Call onLevelComplete callback only when endLevel is reached (or if no endLevel specified)
      // For showcase mode with endLevel, show success screen after each level and only call onLevelComplete when all levels are done
      if (onLevelComplete && canAdvance && !levelFailed) {
        // Only call if we've reached the end level, or if no endLevel is specified
        if (endLevel === undefined || currentLevel >= endLevel) {
          // If no endLevel, exit immediately without showing SuccessScreen
          // This allows the game to exit and move to next P level
          if (endLevel === undefined) {
            setShouldExitImmediately(true); // Set flag to prevent SuccessScreen from showing
            onLevelComplete(currentLevel);
            return; // Exit immediately, don't show SuccessScreen
          } else {
            // If endLevel is reached, delay calling onLevelComplete to allow success screen to show first
            // The success screen will render, and after a delay, we'll call onLevelComplete to trigger redirect
            setTimeout(() => {
              if (onLevelComplete) {
                onLevelComplete(currentLevel);
              }
            }, 2000); // 2 second delay to ensure success screen is visible before redirect
          }
        }
        // If endLevel is specified but we haven't reached it yet, don't call onLevelComplete
        // The success screen will show and user can click "Next Level" to continue
      }
      
      return;
    }

    // If answer was incorrect and lives remain, show same question with shuffled options (retry)
    if (!isCorrect && lives > 0 && currentQuestionIndex < questions.length) {
      const originalQuestion = questions[currentQuestionIndex];
      // Create new question with shuffled options for retry
      const retryQuestion = createQuestionWithShuffledOptions(originalQuestion);
      setCurrentDisplayedQuestion(retryQuestion);
      setSelectedLetter(null);
      setShowFeedback(false);
      // Reset question start time for retry
      setQuestionStartTime(Date.now());
      return;
    }
    
    // If answer was correct, move to next original question
    if (isCorrect) {
      // Move to next original question if available
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedLetter(null);
        setShowFeedback(false);
        // Reset displayed question for next question
        setCurrentDisplayedQuestion(null);
      } else {
        // No more original questions, but we haven't reached 10 attempts yet
        // All questions answered correctly but continue was triggered before state updated
        setShowFeedback(false);
        setQuestionStartTime(Date.now());
      }
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, totalAttempts, isCorrect, previousLevel, gameKey, createQuestionWithShuffledOptions, levelStartTime, selectedLanguage, currentLevel, difficultySettings.complexity, getGameProgress, endSession, lives, gameEndedByLives]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setTotalAttempts(0);
    setSelectedLetter(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShouldExitImmediately(false); // Reset exit flag
    setShowLevelUp(false);
    setLevelFailed(false);
    setCurrentDisplayedQuestion(null);
    setLives(3); // Reset lives to 3
    setGameEndedByLives(false); // Reset lives lost flag
    setAssessmentTrackingCreated(false); // Reset assessment tracking flag
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    // Start new session and regenerate questions
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateMultilingualQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      setQuestions(newQuestions);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL or update internal state
    navigateHandler(`/letter-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    // Navigate to level selector or reset internal state
    navigateHandler('/letter-game');
  };

  // Handle back button with telemetry
  const handleBackWithTelemetry = async () => {
    if (selectedLevel !== null && !showLevelSelector && !isGameComplete) {
      await sessionTelemetryManager.endSubSessionWithBackButton();
    }
    onBack();
  };



  const calculateStars = () => {
    // Determine stars based on accuracy using actual attempts as the denominator
    const attemptsUsed = Math.max(totalAttempts || questions.length || 0, 1);
    const percentage = (totalCorrect / attemptsUsed) * 100;
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (questions.length > 0) { // Only calculate achievements if there are questions
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

  // Show preview screen first (before level selector)
  // For individual games: Hide preview for level 2+ if level 1 has any progress > 0%
  // Show preview only if: (backend level is 1 AND level 1 has no progress) OR forcePreview is true
  // skipPreview allows parent to override and skip preview entirely (e.g., for F1 P2+, F2 P2+)
  const shouldShowPreview = !skipPreview && showPreview && selectedLanguage && 
    ((backendCurrentLevel === 1 && !level1HasProgress) || forcePreview);
  
  if (shouldShowPreview) {
    return (
      <LetterGamePreview
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

  // Show level selection screen if level not selected (after preview)
  if (showLevelSelector) {
    // Use the actual current level being played, not just the stored progress level
    const levelSelectorCurrentLevel = selectedLevel || gameProgress.currentLevel;
    
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
        gameTitle="Letter Recognition"
        gameKey={gameKey}
        unlockAll={true}
      />
    );
  }


  // If we should exit immediately (no endLevel, onLevelComplete called), don't show SuccessScreen
  if (shouldExitImmediately) {
    return null; // Exit immediately, onLevelComplete will handle navigation
  }

  // Show success screen when game is complete
  if (isGameComplete) {
    // If level failed or ended by lives, show try again screen
    if (levelFailed || gameEndedByLives) {
      // For lives lost scenario: totalQuestions = questions attempted
      const displayQuestions = gameEndedByLives ? Math.max(1, currentQuestionIndex + 1) : questions.length;
        
        // If level fails in showcase mode, clicking "Play Again" should exit to Learn step
        // Check if it's the start level (could be startLevel or initialLevel or currentLevel === 1)
        const effectiveStartLevel = startLevel !== undefined ? startLevel : (initialLevel !== undefined ? initialLevel : 1);
        const isStartLevel = currentLevel === effectiveStartLevel;
        
        // Determine if we should exit (showcase mode + callback provided)
        // Use onLevelFailure if provided (for Apply steps), otherwise fall back to onLevel1Failure for backward compatibility
        const hasFailureCallback = isShowcase && (onLevelFailure || (isStartLevel && onLevel1Failure));
        const shouldExitOnFailure = hasFailureCallback;
        
        // Debug logging
        console.log("TryAgain - isShowcase:", isShowcase, "currentLevel:", currentLevel, "effectiveStartLevel:", effectiveStartLevel, "isStartLevel:", isStartLevel, "onLevelFailure:", !!onLevelFailure, "onLevel1Failure:", !!onLevel1Failure, "shouldExitOnFailure:", shouldExitOnFailure);
        
        // Create handleTryAgain function - ensure it's stable and calls the right handler
        // IMPORTANT: For showcase mode, we should exit immediately without resetting
        const handleTryAgain = () => {
          if (shouldExitOnFailure) {
            // Exit to Learn step instead of restarting - call immediately without resetting game
            console.log(`Showcase level ${currentLevel} failed - redirecting to Learn step (calling failure callback)`);
            // Set a flag to prevent any game reset logic from running
            setLevelFailed(false); // Clear the failed flag so TryAgain screen disappears
            setIsGameComplete(false); // Clear game complete flag
            // Call the failure handler which will exit and redirect
            // Prefer onLevelFailure (includes level number), fall back to onLevel1Failure for backward compatibility
            if (onLevelFailure) {
              onLevelFailure(currentLevel);
            } else if (onLevel1Failure && isStartLevel) {
              onLevel1Failure();
            }
          } else {
            // Normal reset for non-showcase or no callback
            console.log("Normal reset - not showcase or no failure callback");
            resetGame();
          }
        };
      
      return (
        <TryAgain
          totalCorrect={totalCorrect}
          totalQuestions={displayQuestions}
          selectedLanguage={selectedLanguage!}
          currentLevel={currentLevel}
          gameKey={gameKey}
            onTryAgain={handleTryAgain}
          onBackToHome={onBack}
          livesLost={gameEndedByLives}
        />
      );
    }
    
    // If level passed, show success screen
    // Determine if there's a next level (respecting endLevel if specified)
    const maxAllowedLevel = endLevel !== undefined ? endLevel : languageLevels.maxLevels;
    const hasNextLevelInRange = currentLevel < maxAllowedLevel;
    
    // For Apply steps (isShowcase with endLevel), when all levels are complete, show "Continue" to redirect
    const isApplyStepComplete = isShowcase && endLevel !== undefined && currentLevel >= endLevel && apply_level;
    const shouldShowContinue = isApplyStepComplete && onLevelComplete;
    
    return (
      <SuccessScreen
        gameTitle={'letterHunt'}
        score={totalCorrect}
        totalQuestions={questions.length}
        totalAttempts={totalAttempts}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={shouldShowContinue ? true : hasNextLevelInRange}
        onNextLevel={() => {
          // If Apply step is complete, call onLevelComplete to trigger redirect
          if (shouldShowContinue && onLevelComplete) {
            console.log(`Apply step ${apply_level} completed - calling onLevelComplete to redirect`);
            onLevelComplete(currentLevel);
            return;
          }
          
          // ✅ MANUAL LEVEL ADVANCEMENT: Force advance to next level when user clicks "Next Level"
          const nextLevel = Math.min(currentLevel + 1, maxAllowedLevel);
          
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage} (max: ${maxAllowedLevel}${endLevel !== undefined ? `, range: ${startLevel || initialLevel || 1}-${endLevel}` : ''})`);
          
          // Manually advance the level using the learning progress hook
          manuallyAdvanceLevel(gameKey, nextLevel);
          
          // Navigate to the next level URL or update internal state
          if (disableNavigation) {
            setInternalLevel(nextLevel);
          } else {
            navigateHandler(`/letter-game/level/${nextLevel}`);
          }
          
          // Clear any stored failed level when user advances to next level
          const failedLevelKey = `failedLevel_${gameKey}`;
          localStorage.removeItem(failedLevelKey);
          
          // Reset game state for new level
          setCurrentQuestionIndex(0);
          setScore(0);
          setTotalCorrect(0);
          setSelectedLetter(null);
          setShowFeedback(false);
          setIsCorrect(false);
          setShowLevelUp(false);
          setLevelFailed(false);
          setIsGameComplete(false);
          setCurrentDisplayedQuestion(null);
          setLives(3);
          setGameEndedByLives(false);
          
          // Reset tracking assessment state
          setLevelStartTime(Date.now());
          setQuestionSummaries([]);
          
          // Regenerate questions for the next level if within endLevel range
          if (selectedLanguage && (endLevel === undefined || nextLevel <= endLevel)) {
            const session = startSession(gameKey);
            const newQuestions = generateMultilingualQuestions(
              selectedLanguage,
              nextLevel,
              difficultySettings.complexity,
              10
            );
            setQuestions(newQuestions);
          }
          
          // Don't call onLevelComplete here - it should only be called when the level is actually completed
          // (handled in the level completion logic around line 699)
          // The "Next Level" button is for transitioning TO the next level, not completing it
        }}
        continueButtonText={shouldShowContinue ? "Continue" : undefined}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    // Log debug info to help diagnose blank screen issues
    console.log("LetterGame - No currentQuestion, showing loading:", {
      questionsLength: questions.length,
      currentQuestionIndex,
      selectedLanguage,
      selectedLevel,
      currentLevel,
      customLetters,
      lettersToUse: customLetters && customLetters.length > 0 ? customLetters : 'using level-based',
    });
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-row items-center justify-center mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
          {/* Back button removed - using justify-center instead of justify-between */}
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Letter Recognition
            </h1>
            {/* <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-sm sm:text-base md:text-lg mt-0.5">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>
                {selectedLevel !== null && selectedLevel !== gameProgress.currentLevel ? 
                  `Level ${selectedLevel}` : 
                  `Level ${currentLevel}`
                }
              </span>
            </div> */}
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
        <div className="flex-1 flex flex-col min-h-0">
          {/* Game Core Component */}
          <LetterHuntGameCore
            questions={currentDisplayedQuestion ? [currentDisplayedQuestion] : questions}
            currentQuestionIndex={0}
            selectedAnswer={selectedLetter}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            mode="game"
            onAnswerSelect={handleLetterSelect}
            onContinue={handleContinue}
            onFeedbackAudioComplete={handleFeedbackAudioComplete}
            showSpeaker={true}
            showContinueButton={true}
            showProgress={true}
            progress={{
              current: progressCurrent,
              total: questions.length,
              score: totalCorrect
            }}
            isPreview={false}
            disabled={showFeedback}
            lives={lives}
            maxLives={3}
          />
        </div>
      </div>
    </div>
  );
}

export default LetterGame;