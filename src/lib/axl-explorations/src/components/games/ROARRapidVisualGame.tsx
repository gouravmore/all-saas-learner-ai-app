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
import ROARRapidVisualGamePreview from "./ROARRapidVisualGamePreview";
import { ROARRapidVisualGameCore, type ROARRapidVisualQuestion } from "./ROARRapidVisualGameCore";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Timer, Globe, Sparkles, EyeOff } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";

// ROARRapidVisualQuestion interface is now imported from ROARRapidVisualGameCore

interface ROARRapidVisualGameProps {
  onBack: () => void;
}

export function ROARRapidVisualGame({ onBack }: ROARRapidVisualGameProps) {
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
  const [questions, setQuestions] = useState<ROARRapidVisualQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTargetLetter, setShowTargetLetter] = useState(true);
  const [showSelectionGrid, setShowSelectionGrid] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false); // Track if level 1 has any percentage > 0%
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);
  
  // ✅ CHILD-FRIENDLY: Track used questions to prevent repetition
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  // Language-specific level configurations - All languages have 10 levels
  const getLanguageLevels = (language: Language) => {
    return { maxLevels: 10 };
  };

  const languageLevels = selectedLanguage ? getLanguageLevels(selectedLanguage) : { maxLevels: 10 };
  const gameKey = selectedLanguage ? `quickSight_${selectedLanguage}` : 'quickSight';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel !== null ? selectedLevel : gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);

  // Initialize game session and questions when language/level selected
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
        
        const newQuestions = generateROARRapidVisualQuestions(
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
      setCurrentQuestionIndex(0);
      setScore(0);
      setTotalCorrect(0);
      setSelectedPosition(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setShowTimeoutMessage(false);
      setShowPreview(false); // Hide preview when level is selected
      setUsedQuestions(new Set());
    }
  }, [selectedLevel, selectedLanguage]);

  const currentQuestion = questions[currentQuestionIndex];
  useEffect(() => {
    if (currentQuestion) setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

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
    
    return Math.max(2, baseTime[complexity as keyof typeof baseTime] - levelBonus);
  };

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setSelectedPosition(-1); // -1 indicates time up
    setIsCorrect(false);
    setShowFeedback(false); // Don't show feedback immediately
    setShowTimeoutMessage(true); // Show timeout message
    recordAnswer(false);
    
    // Hide target letter and show selection grid
    setShowTargetLetter(false);
    setShowSelectionGrid(true);
    
    // Don't auto-advance - player must manually click to continue
    // This ensures they can't skip questions by waiting
  }, []);

  const handlePositionSelect = useCallback(async (position: number) => {
    if (showFeedback || !currentQuestion) return;
    
    setIsTimerRunning(false);
    setSelectedPosition(position);
    const correct = position === currentQuestion.targetPosition;
    setIsCorrect(correct);
    setShowFeedback(true);
    setShowTimeoutMessage(false);
    
    // Record the answer for adaptive learning
    recordAnswer(correct);
    // Telemetry assess - send actual letters instead of position indices
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `quicksight_${currentLevel}_${currentQuestionIndex}`;
    const userAnswerLetter = currentQuestion.letters[position] || '';
    const correctAnswerLetter = currentQuestion.letters[currentQuestion.targetPosition] || currentQuestion.target;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'quickSight',
      userAnswerLetter,
      correctAnswerLetter,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'quickSight',
      userAnswer: userAnswerLetter,
      correctAnswer: correctAnswerLetter,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      setTotalCorrect(prevTotal => prevTotal + 1);
    }

    // Don't auto-advance - player must manually continue
    // This ensures they see feedback and can't skip questions
  }, [showFeedback, currentQuestion, timeRemaining]);

  // Timer effect for rapid visual processing
  useEffect(() => {
    if (currentQuestion && !showFeedback && questions.length > 0) {
      // Always reset timer state for new question
      const timeLimit = getTimeLimit(difficultySettings.complexity);
      setTimeRemaining(timeLimit);
      setIsTimerRunning(true);
      setShowTargetLetter(true);
      setShowSelectionGrid(false);
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


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/roar-rapid-visual-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/roar-rapid-visual-game');
  };

  const getAvailableLevels = () => {
    return Array.from({ length: languageLevels.maxLevels }, (_, i) => i + 1);
  };

  const handleContinue = useCallback(async () => {
    // Player manually continues to next question
    if (currentQuestionIndex < questions.length - 1) {
      advanceToNextQuestion();
    } else {
      // Level complete - check if player can advance
      const finalCorrect = totalCorrect + (isCorrect ? 1 : 0);
      const scorePercentage = (finalCorrect / questions.length) * 100;
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
            gameTitle: 'Quick Sight Game',
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
        const newProgress = getGameProgress(gameKey);
        if (newProgress.currentLevel > previousLevel) {
          setShowLevelUp(true);
        }
      }
      
      setLevelFailed(false);
      setIsGameComplete(true);
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, isCorrect, previousLevel, gameKey]);

  const advanceToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedPosition(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setTimeRemaining(0);
      setIsTimerRunning(false);
      setShowTargetLetter(true);
      setShowSelectionGrid(false);
      setShowTimeoutMessage(false); // Reset timeout message for next question
    }
  }, [currentQuestionIndex, questions.length]);

  const resetGame = () => {
    // Reset all game state
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedPosition(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setShowTimeoutMessage(false); // Reset timeout message
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage && selectedLevel !== null) {
      // Start new session for the CURRENT level (not previous level)
      const session = startSession(gameKey);
      
      // Generate new questions for the current level
      const newQuestions = generateROARRapidVisualQuestions(
        selectedLanguage,
        currentLevel, // Use currentLevel state, not gameProgress.currentLevel
        difficultySettings.complexity,
        10
      );
      setQuestions(newQuestions);
    }
    
    // Reset game completion state
    setIsGameComplete(false);
  };

  const retryLevel = () => {
    // Complete reset for retry - same as resetGame but ensures fresh start
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedPosition(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setTimeRemaining(0);
    setIsTimerRunning(false);
    setIsGameComplete(false);
    
    if (selectedLanguage && selectedLevel !== null) {
      // Start fresh session for current level
      const session = startSession(gameKey);
      
      // Generate completely new questions for retry
      const newQuestions = generateROARRapidVisualQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      setQuestions(newQuestions);
    }
  };

  const calculateStars = () => {
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
    if (totalCorrect === questions.length) {
      const perfectMessage = selectedLanguage === 'te' ? 
        'విజువల్ ప్రాసెసింగ్ మాస్టర్ - పరిపూర్ణ వేగ గుర్తింపు!' :
        selectedLanguage === 'mr' ? 
        'विज्युअल प्रोसेसिंग मास्टर - परिपूर्ण वेग ओळख!' :
        'Visual Processing Master - Perfect Speed Recognition!';
      achievements.push(perfectMessage);
    }
    if (totalCorrect >= Math.floor(questions.length * 0.8)) {
      const speedMessage = selectedLanguage === 'te' ? 
        'వేగ డెమన్ - అద్భుత విజువల్ ప్రాసెసింగ్ నైపుణ్యాలు!' :
        selectedLanguage === 'mr' ? 
        'वेग डेमन - उत्तम विज्युअल प्रोसेसिंग कौशल्य!' :
        'Speed Demon - Great Visual Processing Skills!';
      achievements.push(speedMessage);
    }
    if (showLevelUp) {
      const levelUpMessage = selectedLanguage === 'te' ? 
        `లెవల్ అప్! ఇప్పుడు లెవల్ ${gameProgress.currentLevel}` :
        selectedLanguage === 'mr' ? 
        `लेव्हल अप! आता लेव्हल ${gameProgress.currentLevel}` :
        `Level Up! Now at Level ${gameProgress.currentLevel}`;
      achievements.push(levelUpMessage);
    }
    
    // Add level completion achievement
    const scorePercentage = (totalCorrect / questions.length) * 100;
    if (scorePercentage >= 60) {
      const completeMessage = selectedLanguage === 'te' ? 
        'లెవల్ పూర్తయింది - తదుపరి సవాలు కోసం సిద్ధంగా ఉంది!' :
        selectedLanguage === 'mr' ? 
        'लेव्हल पूर्ण झाले - पुढच्या आव्हानासाठी तयार!' :
        'Level Complete - Ready for Next Challenge!';
      achievements.push(completeMessage);
    } else {
      const attemptedMessage = selectedLanguage === 'te' ? 
        'లెవల్ ప్రయత్నించారు - ముందుకు వెళ్లడానికి మరింత సాధన చేయండి!' :
        selectedLanguage === 'mr' ? 
        'लेव्हल प्रयत्न केले - पुढे जाण्यासाठी अधिक सराव करा!' :
        'Level Attempted - Practice More to Advance!';
      achievements.push(attemptedMessage);
    }
    
    return achievements;
  };

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
        gameTitle={`ROAR Rapid Visual Processing - ${getNativeLanguageName(selectedLanguage)}`}
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={retryLevel}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          // Advance to next level by updating the session
          const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
          
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage} (max: ${languageLevels.maxLevels})`);
          
          // Manually advance the level using the learning progress hook
          manuallyAdvanceLevel(gameKey, nextLevel);
          
          // Navigate to the next level URL
          navigate(`/roar-rapid-visual-game/level/${nextLevel}`);
        }}
      />
    );
  }

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
      <ROARRapidVisualGamePreview
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
    const availableLevels = getAvailableLevels();
    
    return (
      <LevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={gameProgress.currentLevel}
        maxLevels={languageLevels.maxLevels}
        onLevelSelect={handleLevelSelect}
        onBack={() => {
          setShowPreview(true);
          onBack();
        }} // Go back to preview instead of main menu
        onDemo={() => {
          setForcePreview(true);
          setShowPreview(true);
        }}
        gameTitle="Quick Sight"
        gameKey={gameKey}
        unlockAll={true}
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
              Quick Sight
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Level {currentLevel} • {difficultySettings.complexity}</span>
            </div>
          </div>
          
          {/* <Button 
            variant="outline" 
            onClick={resetGame}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">
              {selectedLanguage === 'te' ? 'రీసెట్' :
               selectedLanguage === 'mr' ? 'रीसेट' :
               'Reset'}
            </span>
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

          {/* Timer - Clock bar with time outside - Hide when time is up or feedback is shown */}
          {!showTimeoutMessage && !showFeedback && (
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
                     "Time Up!"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Area */}
          <ROARRapidVisualGameCore
            currentQuestion={currentQuestion}
            mode="game"
            selectedLanguage={selectedLanguage!}
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            showTargetLetter={showTargetLetter}
            showSelectionGrid={showSelectionGrid}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            selectedPosition={selectedPosition}
            onPositionSelect={handlePositionSelect}
            onContinue={handleContinue}
          />
        </Card>
      </div>
    </div>
  );
}

// Generate ROAR Rapid Visual Processing questions
function generateROARRapidVisualQuestions(language: Language, level: number, complexity: string, count: number = 10): ROARRapidVisualQuestion[] {
  // Language-specific letter sets for progressive difficulty - now uses comprehensive data
  const getLanguageLetterSets = (language: Language) => {
    // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    const allLetters = memoryGameDataLoader.getAllLetters(supportedLanguage);
    
    // Create progressive subsets based on complexity
    const getSubset = (start: number, end: number) => {
      return allLetters.slice(start, Math.min(end, allLetters.length));
    };
    
    switch (supportedLanguage) {
      case 'te':
        // For Telugu, use exact level mapping instead of complexity
        const levelKey = level.toString();
        const levelLetters = memoryGameDataLoader.getLettersByLevel(supportedLanguage, levelKey);
        return {
          basic: levelLetters,
          intermediate: levelLetters,
          advanced: levelLetters,
          expert: levelLetters,
          master: levelLetters
        };
      case 'kn':
        // For Kannada, use exact level mapping instead of complexity
        const kannadaLevelKey = level.toString();
        const kannadaLevelLetters = memoryGameDataLoader.getLettersByLevel(supportedLanguage, kannadaLevelKey);
        return {
          basic: kannadaLevelLetters,
          intermediate: kannadaLevelLetters,
          advanced: kannadaLevelLetters,
          expert: kannadaLevelLetters,
          master: kannadaLevelLetters
        };
      case 'mr':
        return {
          basic: getSubset(0, 20),        // First 20 letters (basic vowels + consonants)
          intermediate: getSubset(0, 35), // First 35 letters (includes some matras)
          advanced: getSubset(0, 50),     // First 50 letters (more matras)
          expert: getSubset(0, 70),       // First 70 letters (most matras)
          master: allLetters              // All letters including compound letters
        };
      default: // English
        return {
          basic: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          intermediate: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          advanced: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          expert: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          master: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        };
    }
  };

  const letterSets = getLanguageLetterSets(language);

  const letterSet = letterSets[complexity as keyof typeof letterSets] || letterSets.basic;
  
  // Error handling: Check if letter set is empty
  if (!letterSet || letterSet.length === 0) {
    console.error(`No letters available for language: ${language}, complexity: ${complexity}`);
    return [];
  }
  
  const questions: ROARRapidVisualQuestion[] = [];
  const usedTargets: string[] = [];

  for (let i = 0; i < count; i++) {
    // Get a random target letter that hasn't been used
    let target;
    let attempts = 0;
    
    do {
      target = letterSet[Math.floor(Math.random() * letterSet.length)];
      attempts++;
    } while (usedTargets.includes(target) && attempts < 20);
    
    // Fallback if we can't find a unique target
    if (attempts >= 20) {
      console.warn(`Could not find unique target after ${attempts} attempts, using first available letter`);
      target = letterSet[0];
    }
    
    usedTargets.push(target);
    
    // Create 6 letter positions with target in random position
    const targetPosition = Math.floor(Math.random() * 6);
    const letters = Array(6).fill('');
    
    // Place target letter
    letters[targetPosition] = target;
    
    // Fill other positions with random letters (avoiding target)
    // For higher levels, use more similar-looking letters to increase difficulty
    const similarLetters = getSimilarLetters(target, level, language);
    
    for (let j = 0; j < 6; j++) {
      if (j !== targetPosition) {
        let randomLetter;
        let distractorAttempts = 0;
        
        do {
          // Higher levels have higher chance of similar-looking letters
          if (level >= 7 && Math.random() < 0.4 && similarLetters.length > 0) {
            randomLetter = similarLetters[Math.floor(Math.random() * similarLetters.length)];
          } else {
            randomLetter = letterSet[Math.floor(Math.random() * letterSet.length)];
          }
          distractorAttempts++;
        } while ((randomLetter === target || letters.includes(randomLetter)) && distractorAttempts < 10);
        
        // Fallback if we can't find a unique distractor
        if (distractorAttempts >= 10) {
          console.warn(`Could not find unique distractor for position ${j}, using first available letter`);
          randomLetter = letterSet.find(l => l !== target && !letters.includes(l)) || letterSet[0];
        }
        
        letters[j] = randomLetter;
      }
    }
    
    questions.push({
      target,
      letters,
      targetPosition,
      complexity,
      language
    });
  }

  return questions;
}

// Helper function to get similar-looking letters for higher difficulty
function getSimilarLetters(target: string, level: number, language: Language): string[] {
  // Only use similar letters for higher levels (7+)
  if (level < 7) return [];
  
  const similarLetterGroups = {
    // English similar letters
    'A': ['R', 'H', 'V'],
    'B': ['P', 'R', 'D'],
    'C': ['G', 'O', 'Q'],
    'D': ['B', 'P', 'O'],
    'E': ['F', 'B', 'P'],
    'F': ['E', 'P', 'T'],
    'G': ['C', 'O', 'Q'],
    'H': ['A', 'N', 'M'],
    'I': ['L', 'T', 'J'],
    'J': ['I', 'L', 'T'],
    'K': ['R', 'X', 'Y'],
    'L': ['I', 'T', 'J'],
    'M': ['N', 'H', 'W'],
    'N': ['M', 'H', 'U'],
    'O': ['C', 'G', 'Q'],
    'P': ['B', 'R', 'D'],
    'Q': ['O', 'G', 'C'],
    'R': ['P', 'B', 'K'],
    'S': ['Z', '5', '2'],
    'T': ['I', 'L', 'J'],
    'U': ['V', 'N', 'Y'],
    'V': ['U', 'A', 'Y'],
    'W': ['M', 'V', 'U'],
    'X': ['K', 'Y', 'Z'],
    'Y': ['V', 'U', 'X'],
    'Z': ['S', '2', '7'],
    
    // Telugu similar letters
    'అ': ['ఆ', 'ఇ', 'ఈ'],
    'ఆ': ['అ', 'ఇ', 'ఈ'],
    'ఇ': ['ఈ', 'అ', 'ఆ'],
    'ఈ': ['ఇ', 'అ', 'ఆ'],
    'ఉ': ['ఊ', 'ఎ', 'ఏ'],
    'ఊ': ['ఉ', 'ఎ', 'ఏ'],
    'ఎ': ['ఏ', 'ఐ', 'ఉ'],
    'ఏ': ['ఎ', 'ఐ', 'ఉ'],
    'ఐ': ['ఎ', 'ఏ', 'ఒ'],
    'ఒ': ['ఓ', 'ఔ', 'ఐ'],
    'ఓ': ['ఒ', 'ఔ', 'ఐ'],
    'ఔ': ['ఒ', 'ఓ', 'ఐ'],
    'క': ['ఖ', 'గ', 'ఘ'],
    'ఖ': ['క', 'గ', 'ఘ'],
    'గ': ['క', 'ఖ', 'ఘ'],
    'ఘ': ['క', 'ఖ', 'గ'],
    'చ': ['ఛ', 'జ', 'ఝ'],
    'ఛ': ['చ', 'జ', 'ఝ'],
    'జ': ['చ', 'ఛ', 'ఝ'],
    'ఝ': ['చ', 'ఛ', 'జ'],
    'ట': ['ఠ', 'డ', 'ఢ'],
    'ఠ': ['ట', 'డ', 'ఢ'],
    'డ': ['ట', 'ఠ', 'ఢ'],
    'ఢ': ['ట', 'ఠ', 'డ'],
    'త': ['థ', 'ద', 'ధ'],
    'థ': ['త', 'ద', 'ధ'],
    'ద': ['త', 'థ', 'ధ'],
    'ధ': ['త', 'థ', 'ద'],
    'న': ['ప', 'ఫ', 'బ'],
    'ప': ['ఫ', 'బ', 'భ'],
    'ఫ': ['ప', 'బ', 'భ'],
    'బ': ['ప', 'ఫ', 'భ'],
    'భ': ['ప', 'ఫ', 'బ'],
    'మ': ['య', 'ర', 'ల'],
    'య': ['ర', 'ల', 'వ'],
    'ర': ['ల', 'వ', 'య'],
    'ల': ['వ', 'య', 'ర'],
    'వ': ['శ', 'ష', 'స'],
    'శ': ['ష', 'స', 'హ'],
    'ష': ['స', 'హ', 'శ'],
    'స': ['హ', 'శ', 'ష'],
    'హ': ['ళ', 'క్ష', 'స'],
    
    // Marathi similar letters
    'अ': ['आ', 'इ', 'ई'],
    'आ': ['अ', 'इ', 'ई'],
    'इ': ['ई', 'अ', 'आ'],
    'ई': ['इ', 'अ', 'आ'],
    'उ': ['ऊ', 'ए', 'ऐ'],
    'ऊ': ['उ', 'ए', 'ऐ'],
    'ए': ['ऐ', 'ओ', 'औ'],
    'ऐ': ['ए', 'ओ', 'औ'],
    'ओ': ['औ', 'ए', 'ऐ'],
    'औ': ['ओ', 'ए', 'ऐ'],
    'क': ['ख', 'ग', 'घ'],
    'ख': ['क', 'ग', 'घ'],
    'ग': ['क', 'ख', 'घ'],
    'घ': ['क', 'ख', 'ग'],
    'च': ['छ', 'ज', 'झ'],
    'छ': ['च', 'ज', 'झ'],
    'ज': ['च', 'छ', 'झ'],
    'झ': ['च', 'छ', 'ज'],
    'ट': ['ठ', 'ड', 'ढ'],
    'ठ': ['ट', 'ड', 'ढ'],
    'ड': ['ट', 'ठ', 'ढ'],
    'ढ': ['ट', 'ठ', 'ड'],
    'त': ['थ', 'द', 'ध'],
    'थ': ['त', 'द', 'ध'],
    'द': ['त', 'थ', 'ध'],
    'ध': ['त', 'थ', 'द'],
    'न': ['प', 'फ', 'ब'],
    'प': ['फ', 'ब', 'भ'],
    'फ': ['प', 'ब', 'भ'],
    'ब': ['प', 'फ', 'भ'],
    'भ': ['प', 'फ', 'ब'],
    'म': ['य', 'र', 'ल'],
    'य': ['र', 'ल', 'व'],
    'र': ['ल', 'व', 'य'],
    'ल': ['व', 'य', 'र'],
    'व': ['श', 'ष', 'स'],
    'श': ['ष', 'स', 'ह'],
    'ष': ['स', 'ह', 'श'],
    'स': ['ह', 'श', 'ष'],
    'ह': ['ळ', 'क्ष', 'स']
  };
  
  return similarLetterGroups[target as keyof typeof similarLetterGroups] || [];
}
