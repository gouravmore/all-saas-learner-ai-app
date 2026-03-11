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
import { AudioButton } from "../AudioButton";
import MemoryGamePreview from "./MemoryGamePreview";
import { MemoryGameCore, MemoryQuestion } from "./MemoryGameCore";
import { ArrowLeft, ArrowRight, Globe, CheckCircle, Timer, RotateCcw, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { memoryGameDataLoader, type Language as MemoryGameLanguage, type MultilingualMemoryQuestion } from "../../utils/memoryGameDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";

// Extend the MultilingualMemoryQuestion to include MemoryQuestion properties
// Note: Using MemoryQuestion's language type (from constants) which includes 'hi'
interface ExtendedMultilingualMemoryQuestion extends Omit<MultilingualMemoryQuestion, 'language'>, MemoryQuestion {}

interface MemoryGameProps {
  onBack: () => void;
}

export function MemoryGame({ onBack }: MemoryGameProps) {
  const navigate = useNavigate();
  const { level } = useParams<{ level?: string }>();
  
  const { 
    startSession, 
    recordAnswer, 
    endSession, 
    getGameProgress, 
    getDifficultySettings,
    manuallyAdvanceLevel,
    currentSession 
  } = useLearningProgress();

  const { selectedLanguage } = useLanguage();
  
  // Determine if we're showing level selector or playing a specific level
  const isLevelSelector = !level || level === 'select';
  const selectedLevel = level && level !== 'select' ? parseInt(level) : null;
  const showLevelSelector = isLevelSelector;
  const [sequences, setSequences] = useState<ExtendedMultilingualMemoryQuestion[]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [sequenceTimer, setSequenceTimer] = useState(3);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [usedSequences, setUsedSequences] = useState<Set<string>>(new Set());
  const [levelFailed, setLevelFailed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [currentLetterOptions, setCurrentLetterOptions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false); // Track if level 1 has any percentage > 0%
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations
  const getLanguageLevels = (language: Language) => {
    switch (language) {
      case 'te':
        return {
          maxLevels: 10,
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
      case 'mr':
        return {
          maxLevels: 10,
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
      default:
        return {
          maxLevels: 10,
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
        };
    }
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `memoryChallenge_${selectedLanguage}` : 'memoryChallenge';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel || gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = selectedLanguage ? getLanguageLevels(selectedLanguage) : getLanguageLevels('en');

  // Get all available letters for the selected language from JSON
  // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (selectedLanguage === 'en' || selectedLanguage === 'te' || selectedLanguage === 'mr' || selectedLanguage === 'kn') 
      ? selectedLanguage 
      : 'en';
  const allLetters = selectedLanguage ? memoryGameDataLoader.getAllLetters(supportedLanguage) : [];

  // Initialize game session and sequences when language or level is selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        // Add a small delay to ensure state reset completes first
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const session = startSession(gameKey);
        setPreviousLevel(currentLevel);
        
        // Initialize tracking assessment
        const now = Date.now();
        setLevelStartTime(now);
        setQuestionStartTime(now);
        setQuestionSummaries([]);
        
        // Telemetry subsession
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        if (currentSubSession && currentSubSession.isActive) {
          await sessionTelemetryManager.endSubSession();
        }
        await sessionTelemetryManager.startSubSession(gameKey, currentLevel, selectedLanguage);
        
        // Generate unique sequences for this level/language using JSON data
        // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
        const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
          (selectedLanguage === 'en' || selectedLanguage === 'te' || selectedLanguage === 'mr' || selectedLanguage === 'kn') 
            ? selectedLanguage 
            : 'en';
        const newSequences = memoryGameDataLoader.generateMemoryQuestions(
          supportedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10
        );
        
        // Add display property to each sequence for compatibility with MemoryGameCore
        const extendedSequences = newSequences.map(seq => ({
          ...seq,
          display: seq.sequence.join(' - ')
        }));
        
        setSequences(extendedSequences);
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
          // Check if level 1 has any progress (> 0%) - for individual games only
          const level1Data = (result.data as any)['level1'];
          const level1Percent = level1Data?.metadata?.scorePercentage ?? 0;
          const level1Completed = level1Data?.metadata?.isCompleted ?? false;
          const hasLevel1Progress = level1Completed || level1Percent > 0;
          setLevel1HasProgress(hasLevel1Progress);

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
      setCurrentSequenceIndex(0);
      setScore(0);
      setTotalCorrect(0);
      setUserInput([]);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setShowSequence(true);
      setSequenceTimer(3);
      setTimeRemaining(0);
      setIsTimerRunning(false);
      setCurrentLetterOptions([]);
      setShowTimeoutMessage(false);
      setShowPreview(false); // Hide preview when level is selected
      
      // Clear any stored failed level when user navigates to a level
      const failedLevelKey = `failedLevel_${gameKey}`;
      localStorage.removeItem(failedLevelKey);
    }
  }, [selectedLevel, selectedLanguage]);

  const currentSequence = sequences[currentSequenceIndex];
  useEffect(() => {
    if (currentSequence) setQuestionStartTime(Date.now());
  }, [currentSequenceIndex]);

  // Get time limit for memory sequences based on complexity and level
  const getTimeLimit = (complexity: string) => {
    // Base time limits by complexity for memory sequences
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

  // Generate question-specific letter options (correct letters + distractors)
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

  // Generate letter options when question changes
  useEffect(() => {
    if (currentSequence && !showSequence) {
      const newOptions = generateQuestionLetterOptions(currentSequence.sequence);
      setCurrentLetterOptions(newOptions);
    }
  }, [currentSequenceIndex, currentSequence, showSequence, selectedLanguage]);

  // Timer effect for memory sequence display phase
  useEffect(() => {
    if (currentSequence && showSequence && !showFeedback && sequences.length > 0) {
      // Start timer when showing sequence
      const timeLimit = getTimeLimit(difficultySettings.complexity);
      setTimeRemaining(timeLimit);
      setIsTimerRunning(true);
      setShowTimeoutMessage(false); // Reset timeout message for new sequence
      
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
  }, [currentSequenceIndex, currentSequence, showSequence, showFeedback, difficultySettings.complexity, sequences.length]);


  const addLetterToInput = (letter: string) => {
    if (userInput.length < currentSequence.length) {
      setUserInput([...userInput, letter]);
      // Don't reset timeout message here - let it stay visible until user submits answer
    }
  };

  const removeLastLetter = () => {
    setUserInput(userInput.slice(0, -1));
  };

  const checkSequence = async () => {
    const correct = JSON.stringify(userInput) === JSON.stringify(currentSequence.sequence);
    setIsCorrect(correct);
    setShowFeedback(true);
    setShowTimeoutMessage(false);
    
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `memory_${currentLevel}_${currentSequenceIndex}`;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'memoryChallenge',
      userInput.join(''),
      currentSequence.sequence.join(''),
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'memoryChallenge',
      userAnswer: userInput.join(''),
      correctAnswer: currentSequence.sequence.join(''),
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentSequence.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(score + 1);
      setTotalCorrect(totalCorrect + 1);
    }

    // Don't auto-advance - player must manually continue
  };

  const handleContinue = useCallback(async () => {
    if (currentSequenceIndex < sequences.length - 1) {
      setCurrentSequenceIndex(currentSequenceIndex + 1);
      setUserInput([]);
      setShowFeedback(false);
      setShowSequence(true);
      setSequenceTimer(3);
      setShowTimeoutMessage(false);
    } else {
      // Level complete
      const finalCorrect = totalCorrect + (isCorrect ? 1 : 0);
      const scorePercentage = (finalCorrect / sequences.length) * 100;
      const canAdvance = true;
      
      // Calculate total time spent
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      
      // Send tracking assessment data (for both pass and fail attempts)
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
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
            gameTitle: 'Memory Challenge Game',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: sequences.length,
            correctAnswers: actualCorrect,
            totalScore: actualCorrect,
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: sessionId,
            subsessionId: subsessionId,
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: false,
              scorePercentage: scorePercentage
            }
          });
          return latestSummaries;
        });
      }
      
      // End telemetry subsession for both pass and fail
      await sessionTelemetryManager.endSubSession();
      
      if (canAdvance) {
        endSession();
        if (gameProgress.currentLevel < currentLevel) {
          setShowLevelUp(true);
        }
      }
      
      setLevelFailed(false);
      setIsGameComplete(true);
    }
  }, [currentSequenceIndex, sequences.length, totalCorrect, isCorrect, gameProgress.currentLevel, currentLevel]);


  const resetGame = () => {
    setCurrentSequenceIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setUserInput([]);
    setShowFeedback(false);
    setShowSequence(true);
    setSequenceTimer(3);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setCurrentLetterOptions([]);
    setShowTimeoutMessage(false); // Reset timeout message
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    // Start new session and regenerate sequences using JSON data
    if (selectedLanguage) {
      const session = startSession(gameKey);
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (selectedLanguage === 'en' || selectedLanguage === 'te' || selectedLanguage === 'mr' || selectedLanguage === 'kn') 
          ? selectedLanguage 
          : 'en';
      const newSequences = memoryGameDataLoader.generateMemoryQuestions(
        supportedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      
      // Add display property to each sequence for compatibility with MemoryGameCore
      const extendedSequences = newSequences.map(seq => ({
        ...seq,
        display: seq.sequence.join(' - ')
      }));
      
      setSequences(extendedSequences);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/memory-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/memory-game');
  };

  const handleBack = () => {
    // Navigate back to level selector
    navigate('/memory-game');
  };


  const handleReset = () => {
    // Reset the current game session
    resetGame();
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleNextLevel = () => {
    const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
    manuallyAdvanceLevel(gameKey, nextLevel);
    
    // Navigate to the next level URL
    navigate(`/memory-game/level/${nextLevel}`);
    
    setShowLevelUp(false);
    resetGame();
  };

  const calculateStars = () => {
    if (sequences.length === 0) return 0;
    const percentage = (totalCorrect / sequences.length) * 100;
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (sequences.length > 0) {
      if (totalCorrect === sequences.length) {
        achievements.push("Memory Master - Perfect Recall!");
      }
      if (totalCorrect >= Math.floor(sequences.length * 0.8)) {
        achievements.push("Brain Champion - Amazing Memory!");
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
  const shouldShowPreview = showPreview && selectedLanguage && 
    ((backendCurrentLevel === 1 && !level1HasProgress) || forcePreview);
  
  if (shouldShowPreview) {
    return (
      <MemoryGamePreview
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

  // Show level selector if level selector is requested (after preview)
  if (showLevelSelector) {
    return (
      <LevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={gameProgress.currentLevel}
        maxLevels={languageLevels.maxLevels}
        onLevelSelect={handleLevelSelect}
        onBack={() => {
          setShowPreview(true);
          onBack();
        }}// Go back to preview instead of main menu
        onDemo={() => {
          setForcePreview(true);
          setShowPreview(true);
        }}
        gameTitle="Memory Challenge"
        gameKey={gameKey}
        unlockAll={true}
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
          totalQuestions={sequences.length}
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
        gameTitle={`Memory Challenge - ${getNativeLanguageName(selectedLanguage)}`}
        score={totalCorrect}
        totalQuestions={sequences.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={handlePlayAgain}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={handleNextLevel}
      />
    );
  }

  // Main game screen
  if (!currentSequence) {
    return (
      <div className="min-h-screen bg-gradient-cool p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Loading Memory Challenge...</h1>
            <p>Setting up your sequences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={async () => {
              if (selectedLevel !== null && !showLevelSelector && !isGameComplete) {
                await sessionTelemetryManager.endSubSessionWithBackButton();
              }
              onBack();
            }}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Memory Challenge
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {selectedLevel !== null && selectedLevel !== gameProgress.currentLevel ? 
                  `Practice Level ${selectedLevel}` : 
                  `Level ${currentLevel} / ${languageLevels.maxLevels}`
                }
              </span>
            </div>
          </div>
          
          {/* <Button 
            variant="outline" 
            onClick={handleReset}
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
              current={currentSequenceIndex + 1} 
              total={sequences.length} 
              score={score}
              showCompleteMessage={false}
            />
          </div>

          {/* Timer - Only show during sequence display phase - Hide when time is up */}
          {showSequence && !showTimeoutMessage && (
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
          
          {/* Timeout Message - Show when time is up */}
          {showTimeoutMessage && (
            <div className="mb-1 flex-shrink-0 flex justify-center sm:justify-end">
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
          <MemoryGameCore
            currentSequence={currentSequence}
            mode="game"
            selectedLanguage={selectedLanguage!}
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
          />
        </Card>
      </div>
    </div>
  );
}
