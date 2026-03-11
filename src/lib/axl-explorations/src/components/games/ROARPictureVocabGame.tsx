import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Globe } from "lucide-react";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import ROARPictureVocabGamePreview from "./ROARPictureVocabGamePreview";
import { pictureWordsDataLoader } from "../../utils/pictureWordsDataLoader";
import { ROARPictureVocabGameCore, type ROARPictureVocabQuestion } from "./ROARPictureVocabGameCore";

// ROARPictureVocabQuestion interface is now imported from ROARPictureVocabGameCore

interface ROARPictureVocabGameProps {
  onBack: () => void;
}

export function ROARPictureVocabGame({ onBack }: ROARPictureVocabGameProps) {
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
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false); // Track if level 1 has any percentage > 0%
  const [questions, setQuestions] = useState<ROARPictureVocabQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [levelFailed, setLevelFailed] = useState(false);
  
  // ✅ CHILD-FRIENDLY: Track used questions to prevent repetition
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  
  // Telemetry state
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
  const gameKey = selectedLanguage ? `pictureWords_${selectedLanguage}` : 'pictureWords';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel !== null ? selectedLevel : gameProgress.currentLevel || 1;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = selectedLanguage ? getLanguageLevels(selectedLanguage) : { maxLevels: 10 };

  // Debug logging for Marathi level display
  if (selectedLanguage === 'mr') {
    console.log('🔍 Marathi Level Debug:', {
      selectedLevel,
      gameProgressCurrentLevel: gameProgress.currentLevel,
      calculatedCurrentLevel: currentLevel,
      gameKey,
      languageLevels
    });
  }

  // Initialize game session and questions when language/level selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel && !isGameComplete) {
        try {
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
        
        // ✅ IMPROVED: Generate unique questions with level-specific seed
        const uniqueSeed = `${selectedLanguage}_${currentLevel}_${Date.now()}`;
        const newQuestions = generateROARPictureVocabQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10,
          new Set() // Always start with fresh questions
        );
        
        // ✅ ADDED: Validate questions before setting
        if (newQuestions && newQuestions.length > 0) {
          setQuestions(newQuestions);
          // ✅ FIXED: Reset used questions for new session
          setUsedQuestions(new Set());
          console.log(`🎮 Starting ${selectedLanguage} game at level ${currentLevel} with complexity: ${difficultySettings.complexity}`);
          console.log(`🎯 Generated ${newQuestions.length} unique questions for session: ${uniqueSeed}`);
        } else {
          console.error(`❌ Failed to generate questions for ${selectedLanguage} level ${currentLevel}`);
          // Fallback: generate basic questions
          const fallbackQuestions = generateROARPictureVocabQuestions(
            selectedLanguage,
            1, // Fallback to level 1
            'basic',
            10,
            new Set()
          );
            setQuestions(fallbackQuestions);
          }
        } catch (error) {
          console.error('❌ Error initializing game session:', error);
          // Fallback to basic questions
          const fallbackQuestions = generateROARPictureVocabQuestions(
            selectedLanguage,
            1,
            'basic',
            10,
            new Set()
          );
          setQuestions(fallbackQuestions);
        }
      } else if (selectedLanguage && !selectedLevel) {
        // ✅ ADDED: Clear questions when language is selected but no level yet
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTotalCorrect(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsCorrect(false);
        setShowLevelUp(false);
        setIsGameComplete(false);
        setUsedQuestions(new Set());
        console.log(`🎮 Language ${selectedLanguage} selected, waiting for level selection`);
      }
    };
    initializeGame();
  }, [selectedLanguage, selectedLevel, gameKey, isGameComplete]);

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

          // Compute backendCurrentLevel from progress (score > 0 or completed advances next)
          let highestSuccessfulLevel = 0;
          Object.keys(result.data).forEach((levelKey) => {
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
          const computedNextLevel = Math.min(Math.max(1, (highestSuccessfulLevel > 0 ? highestSuccessfulLevel + 1 : 1)), languageLevels.maxLevels);
          const backendProvided = result.metadata?.currentLevel || 1;
          const effectiveCurrentLevel = Math.min(Math.max(computedNextLevel, backendProvided), languageLevels.maxLevels);
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

  // Note: Page refresh is handled in App.tsx via beforeunload event
  // The initializeGame useEffect above will automatically start a new subsession after refresh

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
      setSelectedOption(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setShowPreview(false); // Hide preview when level is selected
      setUsedQuestions(new Set());
    }
  }, [selectedLevel, selectedLanguage]);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Track question start time
  useEffect(() => {
    if (currentQuestion) setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleOptionSelect = async (optionWord: string) => {
    if (showFeedback) return;
    
    setSelectedOption(optionWord);
    const correct = optionWord === currentQuestion.target.word;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `picturewords_${currentLevel}_${currentQuestionIndex}`;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'pictureWords',
      optionWord,
      currentQuestion.target.word,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'pictureWords',
      userAnswer: optionWord,
      correctAnswer: currentQuestion.target.word,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      setTotalCorrect(prevTotal => prevTotal + 1);
    }
  };

  const handleContinue = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
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
            gameTitle: 'Picture Words Game',
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

  const handleBackClick = async () => {
    await sessionTelemetryManager.endSubSessionWithBackButton();
    setTimeout(() => onBack(), 100);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setIsGameComplete(false); // ✅ FIXED: Reset game completion state
    
    // ✅ FIXED: Reset session cache for completely fresh questions
    setUsedQuestions(new Set());
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    // ✅ IMPROVED: Handle different reset scenarios
    if (selectedLanguage && selectedLevel) {
      // Scenario 1: Reset current level with fresh questions
      try {
        const session = startSession(gameKey);
        // ✅ IMPROVED: Generate fresh questions with timestamp for uniqueness
        const resetSeed = `${selectedLanguage}_${currentLevel}_reset_${Date.now()}`;
        const newQuestions = generateROARPictureVocabQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10,
          new Set()  // Fresh start with no used questions
        );
        
        // ✅ ADDED: Validate questions before setting
        if (newQuestions && newQuestions.length > 0) {
          setQuestions(newQuestions);
          console.log(`🔄 Reset game with ${newQuestions.length} fresh questions for session: ${resetSeed}`);
        } else {
          console.error(`❌ Failed to generate questions for reset game`);
          // Fallback to basic questions
          const fallbackQuestions = generateROARPictureVocabQuestions(
            selectedLanguage,
            1,
            'basic',
            10,
            new Set()
          );
          setQuestions(fallbackQuestions);
        }
      } catch (error) {
        console.error('❌ Error resetting game:', error);
        // Fallback to basic questions
        const fallbackQuestions = generateROARPictureVocabQuestions(
          selectedLanguage,
          1,
          'basic',
          10,
          new Set()
        );
        setQuestions(fallbackQuestions);
      }
    } else if (selectedLanguage && !selectedLevel) {
      // Scenario 2: All levels completed, restart from beginning
      console.log('🔄 All levels completed, restarting from beginning');
      navigate('/roar-picture-vocab-game/level/1'); // Navigate to level 1
      
      // Generate questions for level 1
      try {
        const session = startSession(gameKey);
        const newQuestions = generateROARPictureVocabQuestions(
          selectedLanguage,
          1, // Start from level 1
          'basic', // Start with basic complexity
          10,
          new Set()
        );
        
        if (newQuestions && newQuestions.length > 0) {
          setQuestions(newQuestions);
          console.log(`🔄 Restarted game from level 1 with ${newQuestions.length} questions`);
        } else {
          console.error('❌ Failed to generate questions for restart');
          setQuestions([]);
        }
      } catch (error) {
        console.error('❌ Error restarting game:', error);
        setQuestions([]);
      }
    } else {
      // Scenario 3: No language selected, clear everything
      setQuestions([]);
      console.log('🔄 Reset game: No language selected, clearing questions');
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/roar-picture-vocab-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/roar-picture-vocab-game');
  };

  // ✅ ADDED: Missing function to map complexity to vocabulary set
  const mapComplexityToVocabSet = (complexity: string): string => {
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
      achievements.push("Vocabulary Master - Perfect Word Recognition!");
    }
    if (totalCorrect >= Math.floor(questions.length * 0.8)) {
      achievements.push("Word Detective - Great Vocabulary Skills!");
    }
    if (showLevelUp) {
      achievements.push(`Level Up! Now at Level ${gameProgress.currentLevel}`);
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
      <ROARPictureVocabGamePreview
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
    const languageLevels = getLanguageLevels(selectedLanguage);
    const levels = Array.from({ length: languageLevels.maxLevels }, (_, i) => i + 1);
    
    // Ensure current level is properly bounded for Marathi
    const levelSelectorCurrentLevel = Math.max(1, Math.min(gameProgress.currentLevel || 1, languageLevels.maxLevels));
    
    return (
      <LevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={levelSelectorCurrentLevel}
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
        gameTitle="Picture Words"
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
        gameTitle={`ROAR Picture Vocabulary - ${getNativeLanguageName(selectedLanguage)}`}
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          // ✅ FIXED: Proper level advancement using manuallyAdvanceLevel
          const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
          
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage} (max: ${languageLevels.maxLevels})`);
          
          // Manually advance the level using the learning progress hook
          manuallyAdvanceLevel(gameKey, nextLevel);
          
          // Navigate to the next level URL
          navigate(`/roar-picture-vocab-game/level/${nextLevel}`);
          
          // Reset game state for new level
          setCurrentQuestionIndex(0);
          setScore(0);
          setTotalCorrect(0);
          setSelectedOption(null);
          setShowFeedback(false);
          setIsCorrect(false);
          setShowLevelUp(false);
          setLevelFailed(false);
          setIsGameComplete(false);
          
          // ✅ FIXED: Reset used questions for new level
          setUsedQuestions(new Set());
          
          // ✅ ADDED: If all levels completed, show completion message
          if (nextLevel >= languageLevels.maxLevels) {
            console.log('🎉 All levels completed for this language!');
          }
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion && selectedLanguage && selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show level selector if language is selected but no level yet
  if (selectedLanguage && !selectedLevel && !showLevelSelector) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please select a level to start playing</div>
          <Button
            onClick={handleShowLevelSelector}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Select Level
          </Button>
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
            onClick={handleBackClick}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Picture Words
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                Level {currentLevel} • {difficultySettings.complexity}
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
            <ROARPictureVocabGameCore
              currentQuestion={currentQuestion}
              mode="game"
              selectedLanguage={selectedLanguage!}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              onContinue={handleContinue}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Generate ROAR Picture Vocab questions with language-specific content
function generateROARPictureVocabQuestions(
  language: Language,
  level: number,
  complexity: string,
  count: number,
  usedQuestions: Set<string>
): ROARPictureVocabQuestion[] {
  // ✅ ADDED: Input validation
  if (!language || !complexity || count <= 0) {
    console.error('❌ Invalid input parameters for question generation');
    return [];
  }

  // ✅ ADDED: Validate level range
  const maxLevels = language === 'te' ? 15 : language === 'mr' ? 12 : language === 'kn' ? 10 : 10;
  if (level < 1 || level > maxLevels) {
    console.error(`❌ Invalid level ${level} for language ${language}`);
    return [];
  }

  // Map level to complexity level
  const mapLevelToComplexity = (level: number): 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master' => {
    if (level <= 2) return 'basic';
    if (level <= 4) return 'intermediate';
    if (level <= 6) return 'advanced';
    if (level <= 8) return 'expert';
    return 'master';
  };

  const complexityLevel = mapLevelToComplexity(level);
  
  // Use JSON data loader instead of hardcoded content
  // Ensure only supported languages are passed (pictureWordsDataLoader doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';
  const vocabData = pictureWordsDataLoader.getPictureWords(supportedLanguage, complexityLevel);
  
  if (!vocabData || vocabData.length === 0) {
    console.warn(`⚠️ No vocabulary data found for language: ${language}, complexity: ${complexityLevel}`);
    return [];
  }

  // Filter out already used questions
  const availableVocab = vocabData.filter(item => !usedQuestions.has(item.word));
  
  if (availableVocab.length === 0) {
    console.warn(`⚠️ All vocabulary items have been used for ${language} at ${complexityLevel} level`);
    return [];
  }

  // Shuffle and limit vocabulary
  const shuffledVocab = availableVocab.sort(() => Math.random() - 0.5);
  const selectedVocab = shuffledVocab.slice(0, Math.min(count, shuffledVocab.length));

  // Generate questions with options
  const questions: ROARPictureVocabQuestion[] = [];
  
  for (let i = 0; i < selectedVocab.length; i++) {
    const target = selectedVocab[i];
    
    // Generate 3 distractors from the same vocabulary set
    const distractors = availableVocab
      .filter(item => item.word !== target.word && item.category !== target.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // If not enough distractors from different categories, add from same category
    const finalDistractors = distractors.length >= 3 ? distractors : 
      availableVocab.filter(item => item.word !== target.word);
    
    const shuffledDistractors = finalDistractors.sort(() => Math.random() - 0.5);
    
    const options = [target];
    for (let j = 0; j < 3 && j < shuffledDistractors.length; j++) {
      options.push(shuffledDistractors[j]);
    }
    
    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      target: {
        image: target.image,
        word: target.word,
        category: target.category
      },
      options: shuffledOptions.map(opt => ({
        image: opt.image,
        word: opt.word,
        category: opt.category
      })),
      audio: target.word,
      complexity,
      language
    });
  }
  
  // ✅ ADDED: Validate final question set
  if (questions.length < count) {
    console.warn(`⚠️ Only generated ${questions.length}/${count} questions due to vocabulary constraints`);
  }
  
  return questions;
}