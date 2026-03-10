import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AudioButton } from "../AudioButton";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Globe, Volume2, Sparkles, BookOpen, Eye, EyeOff, Trash2 } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { wordDetectiveDataLoader, type Language as WordDetectiveLanguage, type ROARWordQuestion } from "../../utils/wordDetectiveDataLoader";
import { soundMatchDataLoader, type ROARPhonemeQuestion } from "../../utils/soundMatchDataLoader";
import { gameSessionTracker } from "../../utils/gameSessionTracker";
import { sessionManager } from "../../utils/sessionManager";
import { sunbirdTelemetryService, createGameSessionData, createQuestionResponseData, createGameEndSessionData, type GameSessionData } from "../../utils/sunbirdTelemetryService";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language } from "../../constants/languages";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { pictureWordsDataLoader } from "../../utils/pictureWordsDataLoader";
import CombinedWordGamesPreview from "./CombinedWordGamesPreview";
import { ROARWordGameCore } from "./ROARWordGameCore";
import { ROARPhonemeGameCore } from "./ROARPhonemeGameCore";
import { ROARPictureVocabGameCore } from "./ROARPictureVocabGameCore";

type GameType = 'wordDetective' | 'soundMatch' | 'pictureWords';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

// Get languages from JSON data
const LANGUAGES: LanguageOption[] = wordDetectiveDataLoader.getLanguages();

interface CombinedQuestion {
  id: string;
  type: GameType;
  // Word Detective fields
  word?: string;
  isReal?: boolean;
  // Sound Match fields
  target?: {
    image: string;
    word: string;
    phoneme: string;
  };
  options?: Array<{
    image: string;
    word: string;
    phoneme: string;
  }>;
  // Picture Words fields
  pictureTarget?: {
    image: string;
    word: string;
    category: string;
  };
  pictureOptions?: Array<{
    image: string;
    word: string;
    category: string;
  }>;
  audio: string;
  audioText: string;
  language: Language;
  complexity: string;
}

interface CombinedWordGamesProps {
  onBack: () => void;
}

export function CombinedWordGames({ onBack }: CombinedWordGamesProps) {
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
  
  // Preview state
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  
  // Determine if we're showing level selector or playing a specific level
  const isLevelSelector = !level || level === 'select';
  const selectedLevel = level && level !== 'select' ? parseInt(level) : null;
  const showLevelSelector = isLevelSelector;
  const [questions, setQuestions] = useState<CombinedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [levelFailed, setLevelFailed] = useState(false);
  // Telemetry state
  const [telemetrySessionData, setTelemetrySessionData] = useState<GameSessionData | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations - All languages have 10 levels
  const getLanguageLevels = (language: Language) => {
    return {
      maxLevels: 10,
      levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
    };
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `combinedWord_${selectedLanguage}` : 'combinedWord';
  
  // Get current user and session-based level
  const currentUser = sessionManager.getCurrentUser();
  const sessionGameProgress = currentUser ? gameSessionTracker.getGameProgress(currentUser.username, gameKey) : null;
  const sessionCurrentLevel = sessionGameProgress ? gameSessionTracker.getCurrentLevel(currentUser.username, gameKey) : 1;
  
  // Use session-based level instead of old progress system
  const currentLevel = selectedLevel || sessionCurrentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = selectedLanguage ? getLanguageLevels(selectedLanguage) : { maxLevels: 10, levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] };
  
  // Debug logging for Marathi
  if (selectedLanguage === 'mr') {
    console.log('🔍 Marathi Debug:', {
      selectedLanguage,
      gameKey,
      sessionGameProgress,
      currentLevel,
      languageLevels,
      selectedLevel
    });
  }

  // Get level progression percentages
  const getLevelProgression = (level: number) => {
    if (level <= 4) {
      return {
        pictureWords: 50,
        soundMatch: 30,
        wordDetective: 20
      };
    } else if (level <= 7) {
      return {
        pictureWords: 30,
        soundMatch: 30,
        wordDetective: 40
      };
    } else {
      return {
        pictureWords: 20,
        soundMatch: 20,
        wordDetective: 60
      };
    }
  };

  // Generate Word Detective questions using JSON data
  const generateWordDetectiveQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Use JSON data loader for Word Detective
    // Ensure only supported languages are passed (wordDetectiveDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    const wordQuestions = wordDetectiveDataLoader.generateWordQuestions(
      supportedLanguage,
      level,
      difficultySettings.complexity,
      count,
      new Set()
    );

    for (let i = 0; i < wordQuestions.length; i++) {
      const question = wordQuestions[i];
      
      questions.push({
        id: `wd_${i}`,
        type: 'wordDetective',
        word: question.word,
        isReal: question.isReal,
        audio: question.word,
        audioText: question.word,
        language,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate Sound Match questions using JSON data with tracking (same as individual game)
  const generateSoundMatchQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    console.log(`🎯 Sound Match Generation: Language=${language}, Level=${level}, Count=${count}`);
    
    // Use JSON data loader for Sound Match with tracking
    const complexityLevel = soundMatchDataLoader.getComplexityForLevel(level);
    console.log(`🎯 Complexity Level: ${complexityLevel}`);
    
    // ✅ QUESTION TRACKING: Get unused questions for this level
    const unusedItems = soundMatchDataLoader.getUnusedQuestionsForLevel(supportedLanguage, complexityLevel);
    console.log(`🎯 Unused Items: ${unusedItems.length} items found`);
    
    if (unusedItems.length === 0) {
      console.error(`❌ No unused items found for ${language} ${complexityLevel}`);
      return [];
    }
    
    console.log(`🎯 Sound Match: Level ${level}, Available unused items: ${unusedItems.length}, Requested: ${count}`);
    
    // Generate questions using the same logic as ROARPhonemeGame
    for (let i = 0; i < Math.min(count, unusedItems.length); i++) {
      const target = unusedItems[i];
      console.log(`🎯 Processing target: ${target.word} (${target.phoneme})`);
      
      // ✅ QUESTION TRACKING: Mark this question as used
      soundMatchDataLoader.markQuestionAsUsed(supportedLanguage, complexityLevel, target.word);
      
      // Find items with the same phoneme for correct answers (search across ALL levels)
      const samePhonemeItems = soundMatchDataLoader.findItemsWithSamePhoneme(
        supportedLanguage, 
        target.phoneme, 
        [target.word]
      );
      console.log(`🎯 Same phoneme items: ${samePhonemeItems.length} found`);
      
      // Find items with different phonemes for distractors (search across ALL levels)
      const differentPhonemeItems = soundMatchDataLoader.findItemsWithDifferentPhoneme(
        supportedLanguage, 
        target.phoneme, 
        [target.word]
      );
      console.log(`🎯 Different phoneme items: ${differentPhonemeItems.length} found`);
      
      // Create options array
      const options = [];
      const usedOptions = new Set<string>();
      
      // Add one item with the same phoneme as the correct answer (not the target)
      // Filter out already used options
      const unusedSamePhonemeItems = samePhonemeItems.filter(item => !usedOptions.has(item.word));
      
      if (unusedSamePhonemeItems.length > 0) {
        const correctAnswer = unusedSamePhonemeItems[0];
        console.log(`🎯 Sound Match: Target "${target.word}" (${target.phoneme}) -> Correct answer "${correctAnswer.word}" (${correctAnswer.phoneme})`);
        options.push({
          image: correctAnswer.image,
          word: correctAnswer.word,
          phoneme: correctAnswer.phoneme
        });
        usedOptions.add(correctAnswer.word);
        // Mark the correct answer as used in tracking
        soundMatchDataLoader.markQuestionAsUsed(supportedLanguage, complexityLevel, correctAnswer.word);
      } else {
        console.log(`⚠️ Sound Match: No unused same phoneme items found for "${target.word}" (${target.phoneme}), using target as fallback`);
        // Fallback: if no same phoneme items, use the target itself
        options.push({
          image: target.image,
          word: target.word,
          phoneme: target.phoneme
        });
        usedOptions.add(target.word);
      }
      
      // Add 3 distractors with different phonemes - filter out used options
      const unusedDifferentPhonemeItems = differentPhonemeItems.filter(item => !usedOptions.has(item.word));
      const shuffledDistractors = [...unusedDifferentPhonemeItems].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < 3 && j < shuffledDistractors.length; j++) {
        const distractor = shuffledDistractors[j];
        options.push({
          image: distractor.image,
          word: distractor.word,
          phoneme: distractor.phoneme
        });
        usedOptions.add(distractor.word);
        // Mark each distractor as used in tracking
        soundMatchDataLoader.markQuestionAsUsed(supportedLanguage, complexityLevel, distractor.word);
      }
      
      console.log(`🔍 Options selected for "${target.word}":`, options.map(opt => `${opt.word} (${opt.phoneme})`));
      
      // Shuffle options so correct answer isn't always first
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      
      console.log(`📋 Sound Match Options for "${target.word}":`, shuffledOptions.map(opt => `${opt.word} (${opt.phoneme})`));
      
      questions.push({
        id: `sm_${i}`,
        type: 'soundMatch',
        target: {
          image: target.image,
          word: target.word,
          phoneme: target.phoneme
        },
        options: shuffledOptions,
        audio: target.word,
        audioText: target.word,
        language,
        complexity: complexityLevel
      });
    }

    console.log(`🎯 Sound Match Generation Complete: Generated ${questions.length} questions`);
    return questions;
  };

  // Generate Picture Words questions using child-friendly hardcoded data
  const generatePictureWordsQuestions = (language: Language, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Generate picture vocabulary questions with child-friendly approach
    const pictureQuestions = generateChildFriendlyPictureQuestions(
      language,
      level,
      difficultySettings.complexity,
      count,
      new Set()
    );

    for (let i = 0; i < pictureQuestions.length; i++) {
      const question = pictureQuestions[i];
      
      questions.push({
        id: `pw_${i}`,
        type: 'pictureWords',
        pictureTarget: question.target,
        pictureOptions: question.options,
        audio: question.target.word,
        audioText: question.target.word,
        language,
        complexity: question.complexity,
      });
    }

    return questions;
  };

  // Generate combined questions based on level progression
  const generateCombinedQuestions = (language: Language, level: number): CombinedQuestion[] => {
    const progression = getLevelProgression(level);
    const totalQuestions = 10;
    
    // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    // Reset question tracking for Sound Match to ensure fresh questions
    soundMatchDataLoader.resetQuestionTracking(supportedLanguage);
    console.log(`🔄 Reset Sound Match tracking for ${language}`);
    
    const pictureWordsCount = Math.round((progression.pictureWords / 100) * totalQuestions);
    const soundMatchCount = Math.round((progression.soundMatch / 100) * totalQuestions);
    const wordDetectiveCount = totalQuestions - pictureWordsCount - soundMatchCount;

    const pictureWordsQuestions = generatePictureWordsQuestions(language, level, pictureWordsCount);
    const soundMatchQuestions = generateSoundMatchQuestions(language, level, soundMatchCount);
    const wordDetectiveQuestions = generateWordDetectiveQuestions(language, level, wordDetectiveCount);

    // Combine questions in order: Picture Words first, then Sound Match, then Word Detective
    const allQuestions = [...pictureWordsQuestions, ...soundMatchQuestions, ...wordDetectiveQuestions];

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
            'Combined Word Games', 
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
            "Combined Word Games",
            "combinedWord",
            selectedLevel,
            selectedLanguage,
            difficultySettings.complexity,
            currentUser.username,
            true // isCombinedGame
          );
          setTelemetrySessionData(gameSessionData);
        }
        
        console.log('Generated combined word questions:', newQuestions);
        setQuestions(newQuestions);
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

  // Enhanced audio function
  const playAudio = (text: string, language: Language) => {
    speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          utterance.rate = 0.9; // ✅ OPTIMIZED: Faster, more natural speed for Telugu
          utterance.pitch = 1.0; // ✅ NATURAL: Normal pitch for Telugu
          utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
          break;
        case 'mr':
          utterance.lang = 'mr-IN';
          utterance.rate = 0.9; // ✅ OPTIMIZED: Faster, more natural speed for Marathi
          utterance.pitch = 1.0; // ✅ NATURAL: Normal pitch for Marathi
          utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
          break;
        case 'kn':
          utterance.lang = 'kn-IN';
          utterance.rate = 0.9; // ✅ OPTIMIZED: Faster, more natural speed for Kannada
          utterance.pitch = 1.0; // ✅ NATURAL: Normal pitch for Kannada
          utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
          break;
        case 'en':
        default:
          utterance.lang = 'en-US';
          utterance.rate = 0.9; // ✅ OPTIMIZED: Consistent speed for English
          utterance.pitch = 1.0; // ✅ NATURAL: Normal pitch
          utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
          break;
      }

      // ✅ ENHANCED: Better voice selection with fallbacks
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      // First try: Exact language match
      selectedVoice = voices.find(voice => voice.lang === utterance.lang);
      
      // Second try: Language family match
      if (!selectedVoice && language) {
        const langCode = utterance.lang.split('-')[0];
        selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
      }
      
      // Third try: Regional variations with better fallbacks
      if (!selectedVoice && language === 'te') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('te') || voice.lang.includes('Telugu') || 
          voice.lang.includes('hi-IN') || voice.lang.includes('hi')
        );
      }
      
      if (!selectedVoice && language === 'mr') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('mr') || voice.lang.includes('Marathi') || 
          voice.lang.includes('hi-IN') || voice.lang.includes('hi')
        );
      }
      
      if (!selectedVoice && language === 'en') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en-US') || voice.lang.includes('en-GB') ||
          voice.lang.includes('en-IN') || voice.lang.includes('en')
        );
      }
      
      // Final fallback: Use first available voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      speechSynthesis.speak(utterance);
    }, 100);
  };

  // Auto-play audio when question changes (excluding wordDetective)
  useEffect(() => {
    if (currentQuestion && !showFeedback && selectedLanguage && 
        selectedLevel !== null && !showLevelSelector) {
      const timer = setTimeout(() => {
        // Play audio for soundMatch only (wordDetective audio removed)
        if (currentQuestion.type === 'soundMatch') {
          playAudio(currentQuestion.audioText, selectedLanguage);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, currentQuestion, showFeedback, selectedLanguage, selectedLevel, showLevelSelector]);



  // Handle different game type answers
  const handleAnswer = async (answer: string | boolean) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    let correct = false;

    switch (currentQuestion.type) {
      case 'wordDetective':
        correct = answer === currentQuestion.isReal;
        break;
      case 'soundMatch':
        const selectedOption = currentQuestion.options?.find(opt => opt.word === answer);
        correct = selectedOption?.phoneme === currentQuestion.target?.phoneme;
        break;
      case 'pictureWords':
        correct = answer === currentQuestion.pictureTarget?.word;
        break;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Send telemetry ASSESS event
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    
    // Determine the correct answer for telemetry based on game type
    let correctAnswerForTelemetry;
    switch (currentQuestion.type) {
      case 'wordDetective':
        // For word detective, include both the word and whether it's real
        correctAnswerForTelemetry = `${currentQuestion.word}: ${currentQuestion.isReal ? 'real' : 'fake'}`;
        break;
      case 'soundMatch':
        // For sound match, the correct answer should be the word that matches the target phoneme
        const correctOption = currentQuestion.options?.find(opt => opt.phoneme === currentQuestion.target?.phoneme);
        correctAnswerForTelemetry = correctOption?.word || currentQuestion.target?.word;
        break;
      case 'pictureWords':
        correctAnswerForTelemetry = currentQuestion.pictureTarget?.word;
        break;
      default:
        correctAnswerForTelemetry = answer;
    }
    
    await sessionTelemetryManager.sendAssessEvent(
      currentQuestion.id,
      currentQuestion.type,
      answer,
      correctAnswerForTelemetry,
      correct,
      responseTime
    );
    
    // Update subsession with question attempt
    sessionTelemetryManager.updateSubSession(correct);
    recordAnswer(correct);
    
    // Store question summary for tracking assessment
    const userAnswerForTracking = typeof answer === 'boolean' ? String(answer) : answer;
    const questionSummary: QuestionSummary = {
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      userAnswer: userAnswerForTracking,
      correctAnswer: correctAnswerForTelemetry,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      setTotalCorrect(prevTotal => prevTotal + 1);
    }

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

    // Don't auto-advance - player must manually continue
  };

  // Handle keyboard input for Word Detective game only
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only work for Word Detective game and when not showing feedback
      if (showFeedback || isGameComplete || !currentQuestion || currentQuestion.type !== 'wordDetective') return;
      
      // Left arrow = Real Word, Right arrow = Fake Word
      if (event.key === 'ArrowLeft') {
        handleAnswer(true); // Real Word
      } else if (event.key === 'ArrowRight') {
        handleAnswer(false); // Fake Word
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, isGameComplete, currentQuestion, handleAnswer]);

  const handleContinue = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Level complete - check if player can advance
      const scorePercentage = (totalCorrect / questions.length) * 100;
      const canAdvance = scorePercentage >= 80; // Minimum 80% to advance
      
      // Calculate total time spent
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      
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
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        const sessionId = currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;
        
        setQuestionSummaries((latestSummaries) => {
          // Calculate actual correct count from summaries for accuracy
          const actualCorrect = latestSummaries.filter(q => q.isCorrect).length;
          
          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Combined Word Games',
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
      
      setLevelFailed(!canAdvance);
      setIsGameComplete(true);
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, gameKey, currentLevel]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateCombinedQuestions(selectedLanguage, currentLevel);
      setQuestions(newQuestions);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Hide preview and navigate to the specific level URL
    setShowPreview(false);
    navigate(`/combined-word-games/level/${level}`);
  };


  const handleShowLevelSelector = () => {
    navigate('/combined-word-games');
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
          questions.length,
          totalCorrect
        );
      }
    }
    
    // Navigate back
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
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (questions.length > 0) {
      if (totalCorrect === questions.length) {
        achievements.push("Word Master - Perfect Score!");
      }
      if (totalCorrect >= Math.floor(questions.length * 0.8)) {
        achievements.push("Word Detective - Great Progress!");
      }
    }
    if (showLevelUp) {
      achievements.push(`Level Up! Advanced to next level!`);
    }
    return achievements;
  };

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

  // Show loading state while fetching backend level
  if (isLoadingLevel && selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show preview if enabled - only if backend level is 1, OR if forcePreview is true (for demo)
  if (showPreview && selectedLanguage && (backendCurrentLevel === 1 || forcePreview)) {
    return (
      <CombinedWordGamesPreview
        onStartGame={() => {
          setShowPreview(false);
          setForcePreview(false);
        }}
        onBack={() => {
          setForcePreview(false);
          onBack();
        }}
        difficulty="Easy"
        estimatedTime="5-8 min"
        level={1}
      />
    );
  }

  // Show level selection screen
  if (showLevelSelector) {
    const failedLevelKey = `failedLevel_${gameKey}`;
    const failedLevel = localStorage.getItem(failedLevelKey);
    
    // Fix level calculation - ensure it's within bounds and has proper fallback
    let levelSelectorCurrentLevel = failedLevel ? parseInt(failedLevel) : sessionCurrentLevel || 1;
    
    // Ensure level is within valid range (1 to maxLevels)
    levelSelectorCurrentLevel = Math.max(1, Math.min(levelSelectorCurrentLevel, languageLevels.maxLevels));
    
    // Debug logging for Marathi
    if (selectedLanguage === 'mr') {
      console.log('🔍 Marathi Level Selector Debug:', {
        selectedLevel,
        failedLevel,
        sessionCurrentLevel: sessionCurrentLevel,
        levelSelectorCurrentLevel,
        languageLevels: languageLevels.maxLevels
      });
    }
    
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
        gameTitle="Word Games"
        showBadge={true}
        onCollectBadge={() => {}} // Disabled - shows "Coming Soon" tooltip
        badgeTooltip="Coming Soon"
        gameKey={gameKey}
      />
    );
  }


  // Show success screen when game is complete
  if (isGameComplete) {
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
    
    return (
      <SuccessScreen
        gameTitle={`Combined Word Games - ${LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}`}
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
          navigate(`/combined-word-games/level/${nextLevel}`);
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Render game interface based on question type
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
              Combined Word Games
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
        <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col">
          {/* Progress */}
          <div className="mb-2 sm:mb-3 flex-shrink-0">
            <ProgressBar 
              current={currentQuestionIndex + 1} 
              total={questions.length} 
              score={score}
            />
          </div>

          {/* Game Area */}
          <div className="flex-1 flex flex-col justify-center px-1 sm:px-2">
            {/* Game Type Indicator */}
            <div className="text-center mb-3 sm:mb-4 flex-shrink-0">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {currentQuestion.type === 'wordDetective' && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                {currentQuestion.type === 'soundMatch' && <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
                {currentQuestion.type === 'pictureWords' && <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />}
                <span className="font-semibold text-sm sm:text-base">
                  {currentQuestion.type === 'wordDetective' && 'Word Detective'}
                  {currentQuestion.type === 'soundMatch' && 'Sound Match'}
                  {currentQuestion.type === 'pictureWords' && 'Picture Words'}
                </span>
              </div>
            </div>

            {/* Game-specific content via shared cores */}
            {currentQuestion.type === 'wordDetective' && (
              <ROARWordGameCore
                currentQuestion={{
                  word: currentQuestion.word || '',
                  isReal: currentQuestion.isReal || false,
                  complexity: currentQuestion.complexity,
                  language: currentQuestion.language
                }}
                mode="game"
                selectedLanguage={selectedLanguage || 'en'}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                selectedAnswer={typeof selectedAnswer === 'boolean' ? selectedAnswer : null}
                onAnswerSelect={(isReal) => handleAnswer(isReal)}
                onContinue={handleContinue}
                className="bg-transparent shadow-none border-0 p-0"
              />
          )}

          {currentQuestion.type === 'soundMatch' && (
              <ROARPhonemeGameCore
                currentQuestion={{
                  target: currentQuestion.target || { image: '', word: '', phoneme: '' },
                  options: currentQuestion.options || [],
                  audio: currentQuestion.audioText,
                  complexity: currentQuestion.complexity
                }}
                mode="game"
                selectedLanguage={selectedLanguage || 'en'}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                selectedOption={typeof selectedAnswer === 'string' ? selectedAnswer : null}
                onOptionSelect={(optionWord) => handleAnswer(optionWord)}
                onContinue={handleContinue}
                className="bg-transparent shadow-none border-0 p-0"
              />
          )}

          {currentQuestion.type === 'pictureWords' && (
              <ROARPictureVocabGameCore
                currentQuestion={{
                  target: currentQuestion.pictureTarget || { image: '', word: '', category: '' },
                  options: currentQuestion.pictureOptions || [],
                  audio: currentQuestion.audioText,
                  complexity: currentQuestion.complexity,
                  language: currentQuestion.language
                }}
                mode="game"
                selectedLanguage={selectedLanguage || 'en'}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                selectedOption={typeof selectedAnswer === 'string' ? selectedAnswer : null}
                onOptionSelect={(optionWord) => handleAnswer(optionWord)}
                onContinue={handleContinue}
                className="bg-transparent shadow-none border-0 p-0"
              />
            )}

            {/* Feedback and continue are rendered by core components */}
          </div>
        </Card>
      </div>
    </div>
  );
}
// Generate Child-Friendly Picture Vocabulary questions using JSON data
function generateChildFriendlyPictureQuestions(
  language: Language,
  level: number,
  complexity: string,
  count: number,
  usedQuestions: Set<string>
): Array<{
  target: { image: string; word: string; category: string };
  options: Array<{ image: string; word: string; category: string }>;
  complexity: string;
}> {
  // Use JSON data loader instead of hardcoded content
  // Ensure only supported languages are passed (pictureWordsDataLoader doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';
  return pictureWordsDataLoader.generatePictureWordQuestions(
    supportedLanguage,
    level,
    complexity,
    count,
    usedQuestions
  );
}

// Legacy function removed - now using JSON data via pictureWordsDataLoader
// File cleaned - hardcoded content removed, now uses JSON data
