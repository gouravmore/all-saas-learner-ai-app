import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { CombinedSentenceGamesPreview } from "./CombinedSentenceGamesPreview";
import { SentenceGameCore, type SentenceQuestion } from "./SentenceGameCore";
import { FillInBlanksGameCore, type FillInBlanksQuestion } from "./FillInBlanksGameCore";
import { TrueFalseGameCore, type TrueFalseQuestion } from "./TrueFalseGameCore";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Globe, CheckCircle, BookOpen, FileText, HelpCircle, Check, X } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { loadSentenceData, type Language, type SentenceData } from "../../utils/sentenceDataLoader";
import fillInBlanksData from "../../data/fillInBlanksData.json";
import { loadTrueFalseQuestions, TrueFalseQuestion as TrueFalseDataQuestion, DifficultyLevel } from "../../utils/trueFalseDataLoader";
import { gameSessionTracker } from "../../utils/gameSessionTracker";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { sunbirdTelemetryService, createGameSessionData, type GameSessionData } from "../../utils/sunbirdTelemetryService";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language as LanguageType, LANGUAGES } from "../../constants/languages";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";

// Language types
type GameType = 'sentenceBuilder' | 'fillInBlanks' | 'trueFalse';

interface CombinedQuestion {
  id: string;
  type: GameType;
  // Sentence Builder fields
  words?: string[];
  correct?: string[];
  // Fill in Blanks fields
  sentence?: string;
  missingWord?: string;
  correctAnswer?: string;
  options?: string[];
  // True/False fields
  statement?: string;
  isTrue?: boolean;
  explanation?: string;
  audio: string;
  audioText: string;
  language: Language;
  complexity: string;
}

interface CombinedSentenceGamesProps {
  onBack: () => void;
}

export function CombinedSentenceGames({ onBack }: CombinedSentenceGamesProps) {
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
  
  // Sentence Builder specific state
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  
  // Drag and drop state
  const [draggedElement, setDraggedElement] = useState<{word: string, index: number, type: 'available' | 'arranged'} | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  
  // Removed global cross-category de-duplication to ensure consistent question counts per level

  // Language-specific level configurations
  const getLanguageLevels = (language: LanguageType) => {
    return {
      maxLevels: 10,
      levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
    };
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `combinedSentence_${selectedLanguage}` : 'combinedSentence';
  
  // Get current user and session-based level
  const currentUser = sessionManager.getCurrentUser();
  const sessionGameProgress = currentUser ? gameSessionTracker.getGameProgress(currentUser.username, gameKey) : null;
  const sessionCurrentLevel = sessionGameProgress ? gameSessionTracker.getCurrentLevel(currentUser.username, gameKey) : 1;
  
  // Use session-based level instead of old progress system
  const currentLevel = selectedLevel || sessionCurrentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');

  // Get level progression percentages as specified
  const getLevelProgression = (level: number) => {
    if (level <= 4) {
      return {
        sentenceBuilder: 50,
        fillInBlanks: 30,
        trueFalse: 20
      };
    } else if (level <= 7) {
      return {
        sentenceBuilder: 30,
        fillInBlanks: 30,
        trueFalse: 40
      };
    } else {
      return {
        sentenceBuilder: 20,
        fillInBlanks: 20,
        trueFalse: 60
      };
    }
  };

  // Generate Sentence Builder questions using JSON data
  const generateSentenceBuilderQuestions = (language: LanguageType, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Ensure only supported languages are passed (sentenceDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    // Load sentence data from JSON
    const sentenceData = loadSentenceData(supportedLanguage, difficultySettings.complexity);
    
    if (sentenceData.length === 0) {
      console.warn(`No sentence data found for ${language} ${difficultySettings.complexity}`);
      return [];
    }
    
    const localUsedSentences: string[] = [];
    const actualCount = Math.min(count, sentenceData.length);
    
    for (let i = 0; i < actualCount; i++) {
      // Filter out sentences already used in this question set (allow reuse across categories)
      const unusedSentences = sentenceData.filter(sentence => {
        const sentenceKey = sentence.correct.join(' ');
        return !localUsedSentences.includes(sentenceKey);
      });
      
      if (unusedSentences.length === 0) {
        console.warn(`⚠️ No more sentence options available for ${language} ${difficultySettings.complexity}`);
        break;
      }
      
      // Pick a random sentence from unused sentences
      const randomIndex = Math.floor(Math.random() * unusedSentences.length);
      const sentence = unusedSentences[randomIndex];
      
      // Track usage locally (no global de-duplication)
      const sentenceKey = sentence.correct.join(' ');
      localUsedSentences.push(sentenceKey);
      
      // Create properly shuffled words for the challenge
      const shuffledWords = [...sentence.words].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: `sb_${i}`,
        type: 'sentenceBuilder',
        words: shuffledWords,
        correct: [...sentence.correct],
        audio: sentence.correct.join(' '),
        audioText: sentence.correct.join(' '),
        language: supportedLanguage,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate Fill in Blanks questions using JSON data
  const generateFillInBlanksQuestions = (language: LanguageType, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Ensure only supported languages are passed (fillInBlanksData doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    // Get questions from JSON data
    const languageData = fillInBlanksData[supportedLanguage];
    if (!languageData) {
      console.warn(`No data found for language: ${language}`);
      return [];
    }

    const levelKey = mapComplexityToSentenceLevel(difficultySettings.complexity);
    const questionSet = languageData[levelKey as keyof typeof languageData] || languageData.basic;
    
    const localUsedQuestions: string[] = [];
    const actualCount = Math.min(count, questionSet.length);
    
    for (let i = 0; i < actualCount; i++) {
      // Filter out questions already used in this question set (allow reuse across categories)
      const unusedQuestions = questionSet.filter(question => {
        const questionKey = question.sentence;
        return !localUsedQuestions.includes(questionKey);
      });
      
      if (unusedQuestions.length === 0) {
        console.warn(`⚠️ No more fill-in-blanks options available for ${language} ${difficultySettings.complexity}`);
        break;
      }
      
      // Pick a random question from unused questions
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      const question = unusedQuestions[randomIndex];
      
      // Track usage locally (no global de-duplication)
      const questionKey = question.sentence;
      localUsedQuestions.push(questionKey);
      
      questions.push({
        id: `fib_${i}`,
        type: 'fillInBlanks',
        sentence: question.sentence,
        missingWord: question.missingWord,
        correctAnswer: question.correctAnswer,
        options: [...question.options].sort(() => Math.random() - 0.5), // Shuffle options
        audio: question.sentence,
        audioText: question.sentence,
        language: supportedLanguage,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate True/False questions using JSON data
  const generateTrueFalseQuestions = (language: LanguageType, level: number, count: number): CombinedQuestion[] => {
    const questions: CombinedQuestion[] = [];
    
    // Ensure only supported languages are passed (trueFalseDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    const trueFalseQuestions = loadTrueFalseQuestions(
      supportedLanguage,
      difficultySettings.complexity as DifficultyLevel,
      count,
      new Set()
    );

    const localUsedQuestions: string[] = [];
    
    for (let i = 0; i < trueFalseQuestions.length; i++) {
      const question = trueFalseQuestions[i];
      
      // Track usage locally (no global de-duplication)
      localUsedQuestions.push(question.statement);
      
      questions.push({
        id: `tf_${i}`,
        type: 'trueFalse',
        statement: question.statement,
        isTrue: question.isTrue,
        explanation: question.explanation,
        audio: question.statement,
        audioText: question.statement,
        language: supportedLanguage,
        complexity: difficultySettings.complexity
      });
    }

    return questions;
  };

  // Generate combined questions based on level progression
  const generateCombinedQuestions = (language: LanguageType, level: number): CombinedQuestion[] => {
    const progression = getLevelProgression(level);
    const totalQuestions = 10;
    
    const sentenceBuilderCount = Math.round((progression.sentenceBuilder / 100) * totalQuestions);
    const fillInBlanksCount = Math.round((progression.fillInBlanks / 100) * totalQuestions);
    const trueFalseCount = totalQuestions - sentenceBuilderCount - fillInBlanksCount;

    const sentenceBuilderQuestions = generateSentenceBuilderQuestions(language, level, sentenceBuilderCount);
    const fillInBlanksQuestions = generateFillInBlanksQuestions(language, level, fillInBlanksCount);
    const trueFalseQuestions = generateTrueFalseQuestions(language, level, trueFalseCount);

    // Combine questions in order: Sentence Builder first, then Fill in Blanks, then True/False
    const allQuestions = [...sentenceBuilderQuestions, ...fillInBlanksQuestions, ...trueFalseQuestions];

    return allQuestions;
  };

  // Initialize game session and questions
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        // small delay to ensure reset state settles first
        await new Promise(resolve => setTimeout(resolve, 100));
        const session = startSession(gameKey);
        setPreviousLevel(currentLevel);
        
        // Initialize tracking assessment
        const now = Date.now();
        setLevelStartTime(now);
        setQuestionStartTime(now);
        setQuestionSummaries([]);
        
        // Start session tracking
        if (currentUser) {
          gameSessionTracker.startLevelSession(
            currentUser.username, 
            gameKey, 
            'Combined Sentence Games', 
            currentLevel
          );
          // End any existing subsession before starting a new one
          const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
          if (currentSubSession && currentSubSession.isActive) {
            await sessionTelemetryManager.endSubSession();
          }
          // Start telemetry subsession (only once per level)
          await sessionTelemetryManager.startSubSession(gameKey, currentLevel, selectedLanguage);
        }
        
        const newQuestions = generateCombinedQuestions(selectedLanguage, currentLevel);
        
        // Initialize telemetry session data (for backward compatibility)
        if (currentUser) {
          const gameSessionData = createGameSessionData(
            gameKey,
            'Combined Sentence Games',
            'combinedSentence',
            currentLevel,
            selectedLanguage,
            difficultySettings.complexity,
            currentUser.username,
            true
          );
          setTelemetrySessionData(gameSessionData);
        }
        setQuestions(newQuestions);
      }
    };
    initializeGame();
  }, [selectedLanguage, selectedLevel, gameKey, currentLevel, isGameComplete]);

  // Note: Page refresh is handled in App.tsx via beforeunload event
  // The initializeGame useEffect above will automatically start a new subsession after refresh

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
      setArrangedWords([]);
      setAvailableWords([]);
    }
  }, [selectedLevel]);

  const currentQuestion = questions[currentQuestionIndex];

  // Track question start time for telemetry
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  // Initialize sentence builder state when question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'sentenceBuilder') {
      // Shuffle words initially
      const shuffled = [...(currentQuestion.words || [])].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setArrangedWords([]);
    }
  }, [currentQuestion]);

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
      
      // Second try: Language family match (e.g., 'te' for 'te-IN')
      if (!selectedVoice && language) {
        const langCode = utterance.lang.split('-')[0];
        selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
      }
      
      // Third try: Regional variations with better fallbacks
      if (!selectedVoice && language === 'te') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('te') || voice.lang.includes('Telugu') || 
          voice.lang.includes('hi-IN') || voice.lang.includes('hi') // Hindi fallback
        );
      }
      
      if (!selectedVoice && language === 'mr') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('mr') || voice.lang.includes('Marathi') || 
          voice.lang.includes('hi-IN') || voice.lang.includes('hi') // Hindi fallback
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

  // Handle keyboard input for arrow keys (True or False only)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showFeedback || isGameComplete || !currentQuestion || currentQuestion.type !== 'trueFalse') return;
      
      if (event.key === 'ArrowRight') {
        handleAnswer(true);
      } else if (event.key === 'ArrowLeft') {
        handleAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, isGameComplete, currentQuestion]);


  // Sentence Builder helper functions
  const addWordToSentence = (word: string, index: number) => {
    setArrangedWords([...arrangedWords, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };

  const removeWordFromSentence = (index: number) => {
    const word = arrangedWords[index];
    setAvailableWords([...availableWords, word]);
    setArrangedWords(arrangedWords.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, word: string, index: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ word, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { word, index } = data;
    
    // Only add if the word is still in available words
    if (availableWords[index] === word) {
      addWordToSentence(word, index);
    }
  };

  const handleWordDragStart = (e: React.DragEvent, word: string, index: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ word, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleWordDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleWordDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { word, index } = data;
    
    // If dropping on an existing word, replace it
    if (targetIndex !== undefined) {
      const newArrangedWords = [...arrangedWords];
      const removedWord = newArrangedWords[targetIndex];
      newArrangedWords[targetIndex] = word;
      setArrangedWords(newArrangedWords);
      
      // Add the removed word back to available words
      if (removedWord) {
        setAvailableWords([...availableWords, removedWord]);
      }
      
      // Remove the dragged word from available words
      setAvailableWords(availableWords.filter((_, i) => i !== index));
    }
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent, word: string, index: number, type: 'available' | 'arranged') => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedElement({ word, index, type });
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedElement || !touchStartPos) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // Only start drag if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedElement) return;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Check if dropped on sentence building area
    const sentenceArea = element?.closest('[data-drop-zone="sentence"]');
    if (sentenceArea && draggedElement.type === 'available') {
      // Only add if the word is still in available words
      if (availableWords[draggedElement.index] === draggedElement.word) {
        addWordToSentence(draggedElement.word, draggedElement.index);
      }
    }
    
    // Check if dropped on another word
    const wordElement = element?.closest('[data-word-index]');
    if (wordElement && draggedElement.type === 'available') {
      const targetIndex = parseInt(wordElement.getAttribute('data-word-index') || '0');
      if (targetIndex !== undefined && availableWords[draggedElement.index] === draggedElement.word) {
        const newArrangedWords = [...arrangedWords];
        const removedWord = newArrangedWords[targetIndex];
        newArrangedWords[targetIndex] = draggedElement.word;
        setArrangedWords(newArrangedWords);
        
        if (removedWord) {
          setAvailableWords([...availableWords, removedWord]);
        }
        
        setAvailableWords(availableWords.filter((_, i) => i !== draggedElement.index));
      }
    }
    
    setDraggedElement(null);
    setTouchStartPos(null);
  };

  // Handle different game type answers
  const handleAnswer = async (answer: string | boolean) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    let correct = false;

    switch (currentQuestion.type) {
      case 'sentenceBuilder':
        correct = JSON.stringify(arrangedWords) === JSON.stringify(currentQuestion.correct);
        break;
      case 'fillInBlanks':
        correct = answer === currentQuestion.correctAnswer;
        break;
      case 'trueFalse':
        correct = answer === currentQuestion.isTrue;
        break;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Prepare user answer for telemetry
    let userAnswerForTelemetry: any = answer;
    switch (currentQuestion.type) {
      case 'sentenceBuilder':
        userAnswerForTelemetry = arrangedWords.join(' ');
        break;
      case 'fillInBlanks':
        userAnswerForTelemetry = answer;
        break;
      case 'trueFalse':
        userAnswerForTelemetry = answer;
        break;
    }

    // Send telemetry ASSESS event
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    let correctAnswerForTelemetry: any = undefined;
    switch (currentQuestion.type) {
      case 'sentenceBuilder':
        correctAnswerForTelemetry = currentQuestion.correct?.join(' ');
        break;
      case 'fillInBlanks':
        correctAnswerForTelemetry = currentQuestion.correctAnswer;
        break;
      case 'trueFalse':
        correctAnswerForTelemetry = currentQuestion.isTrue;
        break;
    }
    await sessionTelemetryManager.sendAssessEvent(
      currentQuestion.id,
      currentQuestion.type,
      userAnswerForTelemetry,
      correctAnswerForTelemetry,
      correct,
      responseTime
    );
    // Update subsession with question attempt
    sessionTelemetryManager.updateSubSession(correct);
    
    recordAnswer(correct);
    
    // Store question summary for tracking assessment
    const userAnswerForTracking = typeof userAnswerForTelemetry === 'boolean' ? String(userAnswerForTelemetry) : userAnswerForTelemetry;
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

  const handleContinue = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setArrangedWords([]);
      setAvailableWords([]);
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
            gameTitle: 'Combined Sentence Games',
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
  }, [currentQuestionIndex, questions.length, totalCorrect, gameKey]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setArrangedWords([]);
    setAvailableWords([]);
    
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
    // Navigate to the specific level URL
    navigate(`/combined-sentence-games/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/combined-sentence-games');
  };

  // Handle back button with telemetry
  const handleBackWithTelemetry = async () => {
    if (selectedLevel !== null && !showLevelSelector && !isGameComplete) {
      await sessionTelemetryManager.endSubSessionWithBackButton();
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        gameSessionTracker.endLevelSession(
          currentUser.username,
          gameKey,
          currentLevel,
          currentQuestionIndex + 1,
          totalCorrect
        );
      }
    }
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
        achievements.push("Sentence Master - Perfect Score!");
      }
      if (totalCorrect >= Math.floor(questions.length * 0.8)) {
        achievements.push("Language Expert - Great Progress!");
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
      <CombinedSentenceGamesPreview
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
        gameTitle="Sentence Games"
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
        gameTitle={`Combined Sentence Games - ${LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}`}
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
          navigate(`/combined-sentence-games/level/${nextLevel}`);
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
              Combined Sentence Games
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
          <div className="text-center mb-2 sm:mb-3">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              {currentQuestion.type === 'sentenceBuilder' && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
              {currentQuestion.type === 'fillInBlanks' && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
              {currentQuestion.type === 'trueFalse' && <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />}
              <span className="font-semibold text-sm sm:text-base">
                {currentQuestion.type === 'sentenceBuilder' && 'Sentence Builder'}
                {currentQuestion.type === 'fillInBlanks' && 'Fill in the Blanks'}
                {currentQuestion.type === 'trueFalse' && 'True or False'}
              </span>
            </div>
          </div>

          {/* Game-specific content */}
          {currentQuestion.type === 'sentenceBuilder' && (
            <SentenceGameCore
              currentQuestion={{
                words: currentQuestion.words || [],
                correct: currentQuestion.correct || [],
                language: currentQuestion.language,
                complexity: currentQuestion.complexity,
                level: currentLevel
              }}
              mode="game"
              selectedLanguage={selectedLanguage!}
              arrangedWords={arrangedWords}
              availableWords={availableWords}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onWordClick={addWordToSentence}
              onRemoveWord={removeWordFromSentence}
              onCheckAnswer={() => handleAnswer('')}
              onContinue={handleContinue}
            />
          )}

          {currentQuestion.type === 'fillInBlanks' && (
            <FillInBlanksGameCore
              currentQuestion={{
                sentence: currentQuestion.sentence || '',
                missingWord: currentQuestion.missingWord || '',
                correctAnswer: currentQuestion.correctAnswer || '',
                options: currentQuestion.options || [],
                language: currentQuestion.language,
                complexity: currentQuestion.complexity,
                level: currentLevel
              }}
              mode="game"
              selectedLanguage={selectedLanguage!}
              selectedAnswer={selectedAnswer as string}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onAnswerSelect={(answer) => setSelectedAnswer(answer)}
              onCheckAnswer={() => handleAnswer(selectedAnswer)}
              onContinue={handleContinue}
            />
          )}

          {currentQuestion.type === 'trueFalse' && (
            <TrueFalseGameCore
              currentQuestion={{
                statement: currentQuestion.statement || '',
                isTrue: currentQuestion.isTrue || false
              }}
              mode="game"
              selectedLanguage={selectedLanguage!}
              selectedAnswer={selectedAnswer as boolean}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onAnswerSelect={(answer) => setSelectedAnswer(answer)}
              onCheckAnswer={(answer) => handleAnswer(answer)}
              onContinue={handleContinue}
            />
          )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper function to map complexity to sentence difficulty
function mapComplexityToSentenceLevel(complexity: string): string {
  switch (complexity.toLowerCase()) {
    case 'basic':
      return 'basic';
    case 'intermediate':
      return 'intermediate';
    case 'advanced':
      return 'advanced';
    case 'expert':
      return 'expert';
    case 'master':
      return 'master';
    default:
      return 'basic';
  }
}
