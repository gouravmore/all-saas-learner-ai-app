import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, TrendingUp, Globe, Sparkles } from "lucide-react";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { cn } from "../../lib/utils";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import fillInBlanksData from "../../data/fillInBlanksData.json";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import FillInBlanksGamePreview from "./FillInBlanksGamePreview";
import { FillInBlanksGameCore, type FillInBlanksQuestion } from "./FillInBlanksGameCore";

// FillInBlanksQuestion interface is now imported from FillInBlanksGameCore

interface FillInBlanksGameProps {
  onBack: () => void;
}

export function FillInBlanksGame({ onBack }: FillInBlanksGameProps) {
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
  const [questions, setQuestions] = useState<FillInBlanksQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [levelFailed, setLevelFailed] = useState(false);
  
  // Telemetry state
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations
  const getLanguageLevels = (language: Language) => {
    return {
      maxLevels: 10,
      levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
    };
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `fillInBlanks_${selectedLanguage}` : 'fillInBlanks';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel || gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');

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

  // Initialize game session and questions when language or level is selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log(`Starting fill-in-blanks game session for ${selectedLanguage}, level: ${currentLevel}`);
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
      
      const newQuestions = generateFillInBlanksQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10,
        usedQuestions
      );
      setQuestions(newQuestions);
      console.log(`Generated ${newQuestions.length} fill-in-blanks questions for level ${currentLevel}`);
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

          // Compute effective current level from progress (score > 0 or completed)
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
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setUsedQuestions(new Set());
    }
  }, [selectedLevel, selectedLanguage]);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Track question start time
  useEffect(() => {
    if (currentQuestion) setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Enhanced audio function for different languages - REMOVED
  // const playAudio = (text: string, language: Language) => {
  //   speechSynthesis.cancel();
    
  //   setTimeout(() => {
  //     const utterance = new SpeechSynthesisUtterance(text);
      
  //     switch (language) {
  //       case 'te':
  //         utterance.lang = 'te-IN';
  //         utterance.rate = 0.8;
  //         utterance.pitch = 1.0;
  //         utterance.volume = 1.0;
  //         break;
  //       case 'mr':
  //         utterance.lang = 'mr-IN';
  //         utterance.rate = 0.8;
  //         utterance.pitch = 1.0;
  //         utterance.volume = 1.0;
  //         break;
  //       default:
  //         utterance.lang = 'en-US';
  //         utterance.rate = 0.8;
  //         utterance.pitch = 1.0;
  //         utterance.volume = 0.9;
  //     }

  //     const voices = speechSynthesis.getVoices();
  //     let selectedVoice = null;
      
  //     if (language === 'te') {
  //       selectedVoice = 
  //         voices.find(voice => voice.lang === 'te-IN' || voice.lang === 'te') ||
  //         voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
  //         voices[0];
  //     } else if (language === 'mr') {
  //       selectedVoice = 
  //         voices.find(voice => voice.lang === 'mr-IN' || voice.lang === 'mr') ||
  //         voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
  //         voices[0];
  //     } else {
  //       selectedVoice = 
  //         voices.find(voice => voice.lang === 'en-US') ||
  //         voices.find(voice => voice.lang.startsWith('en')) ||
  //         voices[0];
  //     }

  //     if (selectedVoice) {
  //       utterance.voice = selectedVoice;
  //     }

  //     speechSynthesis.speak(utterance);
  //   }, 50);
  // };

  // Auto-play audio when question changes - REMOVED
  // useEffect(() => {
  //   if (currentQuestion && !showFeedback && !isGameComplete && selectedLanguage && 
  //       selectedLevel !== null && !showLevelSelector) {
  //     const timer = setTimeout(() => {
  //       if (currentQuestion && !showFeedback && !isGameComplete && selectedLanguage) {
  //         playAudio(currentQuestion.sentence, selectedLanguage);
  //       }
  //     }, 500);
      
  //     return () => {
  //       clearTimeout(timer);
  //       speechSynthesis.cancel();
  //     };
  //   }
  // }, [currentQuestionIndex, currentQuestion, showFeedback, isGameComplete, selectedLanguage, selectedLevel, showLevelSelector]);

  // Cleanup speech synthesis on component unmount - REMOVED
  // useEffect(() => {
  //   return () => {
  //     speechSynthesis.cancel();
  //   };
  // }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const checkAnswer = async () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `fillinblanks_${currentLevel}_${currentQuestionIndex}`;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'fillInBlanks',
      selectedAnswer,
      currentQuestion.correctAnswer,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'fillInBlanks',
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(score + 1);
      setTotalCorrect(totalCorrect + 1);
    }
  };

  const handleContinue = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
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
            gameTitle: 'Fill In Blanks Game',
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
        console.log(`Fill-in-blanks game completed for ${selectedLanguage}, previous level: ${previousLevel}`);
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
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    
    setUsedQuestions(new Set());
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateFillInBlanksQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10,
        new Set()
      );
      setQuestions(newQuestions);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/fill-blanks-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/fill-blanks-game');
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
        achievements.push("Fill-in-Blanks Master - Perfect Score!");
      }
      if (totalCorrect >= Math.floor(questions.length * 0.8)) {
        achievements.push("Word Detective - Great Listening!");
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
      <FillInBlanksGamePreview
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

  // Show level selector if level selector is requested
  if (showLevelSelector) {
    const levelSelectorCurrentLevel = gameProgress.currentLevel;
    
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
        gameTitle="Fill in the Blanks"
        gameKey={gameKey}
        unlockAll={true}
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
        gameTitle={`Fill in the Blanks - ${getNativeLanguageName(selectedLanguage)}`}
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage}`);
          manuallyAdvanceLevel(gameKey, nextLevel);
          navigate(`/fill-blanks-game/level/${nextLevel}`);
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
              Fill in the Blanks
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {selectedLevel !== null && selectedLevel !== gameProgress.currentLevel ? 
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
          <div className="flex-1 flex flex-col px-1 sm:px-2 py-2">
            <FillInBlanksGameCore
              currentQuestion={currentQuestion}
              mode="game"
              selectedLanguage={selectedLanguage!}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onAnswerSelect={handleAnswerSelect}
              onCheckAnswer={checkAnswer}
              onContinue={handleContinue}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper function to map complexity to sentence difficulty
function mapComplexityToSentenceLevel(complexity: string): string {
  switch (complexity.toLowerCase()) {
    case 'easy':
    case 'beginner':
      return 'basic';
    case 'medium':
      return 'intermediate';
    case 'hard':
      return 'advanced';
    case 'expert':
      return 'expert';
    case 'master':
      return 'master';
    default:
      return 'basic';
  }
}

// Generate fill-in-the-blanks questions from JSON data
function generateFillInBlanksQuestions(
  language: Language, 
  level: number, 
  complexity: string, 
  count: number = 10, 
  usedQuestions: Set<string> = new Set()
): FillInBlanksQuestion[] {
  
  // Get questions from JSON data
  // Ensure only supported languages are passed (fillInBlanksData doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';
  const languageData = fillInBlanksData[supportedLanguage];
  if (!languageData) {
    console.warn(`No data found for language: ${language}`);
    return [];
  }

  const levelKey = mapComplexityToSentenceLevel(complexity);
  const questionSet = languageData[levelKey as keyof typeof languageData] || languageData.basic;
  
  const questions: FillInBlanksQuestion[] = [];
  const localUsedQuestions: string[] = [];
  
  // Filter out questions already used in this session
  const availableQuestions = questionSet.filter(question => 
    !usedQuestions.has(question.sentence)
  );
  
  // Reset session cache if we've exhausted most questions
  let workingQuestions = [...availableQuestions];
  if (workingQuestions.length < count) {
    console.log(`🔄 Resetting fill-in-blanks cache for ${language} ${complexity} - only ${workingQuestions.length} fresh questions remaining`);
    questionSet.forEach(question => usedQuestions.delete(question.sentence));
    workingQuestions = [...questionSet];
  }
  
  const actualCount = Math.min(count, workingQuestions.length);
  console.log(`🎮 Generating ${actualCount} UNIQUE fill-in-blanks questions for ${language} level ${level} (${complexity})`);

  for (let i = 0; i < actualCount; i++) {
    // Filter out questions already used in this question set
    const unusedQuestions = workingQuestions.filter(question => 
      !localUsedQuestions.includes(question.sentence)
    );
    
    if (unusedQuestions.length === 0) {
      console.warn(`⚠️ No more fill-in-blanks options available for ${language} ${complexity}`);
      break;
    }
    
    // Pick a random question from unused questions
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const question = unusedQuestions[randomIndex];
    
    // Track usage
    const questionKey = question.sentence;
    localUsedQuestions.push(questionKey);
    usedQuestions.add(questionKey);
    
    questions.push({
      sentence: question.sentence,
      missingWord: question.missingWord,
      correctAnswer: question.correctAnswer,
      options: [...question.options].sort(() => Math.random() - 0.5), // Shuffle options
      language,
      complexity,
      level
    });
  }

  // Shuffle questions to randomize order
  return questions.sort(() => Math.random() - 0.5);
}

export default FillInBlanksGame;
