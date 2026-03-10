import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AudioButton } from "../AudioButton";
import { ProgressBar } from "../ProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import ROARPhonemeGamePreview from "./ROARPhonemeGamePreview";
import { ROARPhonemeGameCore, type ROARPhonemeQuestion } from "./ROARPhonemeGameCore";
import { ArrowLeft, ArrowRight, RotateCcw, TrendingUp, Volume2, Globe, Sparkles } from "lucide-react";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { soundMatchDataLoader, Complexity } from "../../utils/soundMatchDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";

interface ROARPhonemeGameProps {
  onBack: () => void;
}

export function ROARPhonemeGame({ onBack }: ROARPhonemeGameProps) {
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
  const [questions, setQuestions] = useState<ROARPhonemeQuestion[]>([]);
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
  
  // ✅ QUESTION TRACKING: Track used questions to prevent repetition across levels
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  
  // Telemetry state
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations using JSON data
  const getLanguageLevels = (language: Language) => {
    // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    const maxLevels = soundMatchDataLoader.getMaxLevelForLanguage(supportedLanguage);
    return { maxLevels };
  };

  const languageLevels = selectedLanguage ? getLanguageLevels(selectedLanguage) : { maxLevels: 10 };
  const gameKey = selectedLanguage ? `soundMatch_${selectedLanguage}` : 'soundMatch';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel !== null ? selectedLevel : gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  
  // Debug level calculation
  console.log('🔍 Level calculation:', {
    selectedLevel,
    gameProgressCurrentLevel: gameProgress.currentLevel,
    calculatedCurrentLevel: currentLevel
  });

    // Enhanced audio function for different languages with improved voice selection
  const playAudio = (text: string, language: Language) => {
    // Cancel any ongoing speech to prevent overlapping
    speechSynthesis.cancel();
    
    // Small delay to ensure cancellation is complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Natural speech settings for clear pronunciation
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          utterance.rate = 1.0; // Normal natural speed
          utterance.pitch = 1.0; // Natural pitch
          utterance.volume = 1.0; // Clear volume
          break;
        case 'kn':
          utterance.lang = 'kn-IN';
          utterance.rate = 1.0; // Normal natural speed
          utterance.pitch = 1.0; // Natural pitch
          utterance.volume = 1.0; // Clear volume
          break;
        case 'mr':
          utterance.lang = 'mr-IN';
          utterance.rate = 1.0; // Normal natural speed
          utterance.pitch = 1.0; // Natural pitch
          utterance.volume = 1.0; // Clear volume
          break;
        default:
          utterance.lang = 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
      }
    
      // Simplified voice selection to prevent duplicate audio
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (language === 'te') {
        selectedVoice = 
          voices.find(voice => voice.lang === 'te-IN' || voice.lang === 'te') ||
          voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
          voices[0];
      } else if (language === 'mr') {
        selectedVoice = 
          voices.find(voice => voice.lang === 'mr-IN' || voice.lang === 'mr') ||
          voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'hi') ||
          voices[0];
      } else {
        selectedVoice = 
          voices.find(voice => voice.lang === 'en-US') ||
          voices.find(voice => voice.lang.startsWith('en')) ||
          voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      speechSynthesis.speak(utterance);
    }, 50);
  };



  // Initialize game session and questions when language/level selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
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
      
      // ✅ QUESTION TRACKING: Generate questions using tracking system
      console.log(`🎯 Generating questions for ${selectedLanguage} level ${currentLevel}`);
      const newQuestions = generateROARPhonemeQuestionsWithTracking(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      
      console.log(`📊 Generated ${newQuestions.length} questions`);
      if (newQuestions.length === 0) {
        console.error('❌ No questions generated! Trying fallback method...');
        // Fallback to original method
        const fallbackQuestions = generateROARPhonemeQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10,
          new Set()
      );
        console.log(`📊 Fallback generated ${fallbackQuestions.length} questions`);
        setQuestions(fallbackQuestions);
      } else {
      setQuestions(newQuestions);
      }
      
      // ✅ QUESTION TRACKING: Update used questions to prevent repetition (only target and correct answer)
      const newUsedQuestions = new Set<string>();
      newQuestions.forEach(q => {
        newUsedQuestions.add(q.target.word);
        // Find the correct answer (same phoneme as target) and mark it as used
        const correctAnswer = q.options.find(opt => opt.phoneme === q.target.phoneme && opt.word !== q.target.word);
        if (correctAnswer) {
          newUsedQuestions.add(correctAnswer.word);
        }
      });
      setUsedQuestions(newUsedQuestions);
      
      console.log(`🎮 Generated ${newQuestions.length} fresh questions for ${selectedLanguage} level ${currentLevel}`);
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

          // Compute backendCurrentLevel from tracking progress (score > 0 or completed advances next)
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
      setShowPreview(false); // Hide preview when level is selected
      setShowLevelUp(false);
      setLevelFailed(false);
      setUsedQuestions(new Set());
    }
  }, [selectedLevel, selectedLanguage]);

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
    };
    
    // Load voices immediately
    loadVoices();
    
    // Set up voice change listener
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Track question start time
  useEffect(() => {
    if (currentQuestion) setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Use the global child-friendly getQuestionText function defined at the bottom of the file

  // Auto-play audio when question changes (only during actual gameplay)
  useEffect(() => {
    console.log('🔊 Auto-play check:', {
      currentQuestion: !!currentQuestion,
      showFeedback,
      selectedLanguage,
      selectedLevel,
      questionsLength: questions.length,
      isGameComplete,
      currentLevel,
      currentQuestionIndex
    });
    
    if (currentQuestion && !showFeedback && selectedLanguage && selectedLevel && questions.length > 0 && !isGameComplete) {
      console.log(`🔊 Auto-playing: ${currentQuestion.target.word} for ${selectedLanguage}`);
      // Small delay to ensure component is rendered
      const timer = setTimeout(() => {
        playAudio(currentQuestion.target.word, selectedLanguage);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('🔊 Auto-play skipped - conditions not met');
    }
  }, [currentQuestionIndex, currentQuestion, showFeedback, selectedLanguage, selectedLevel, questions.length, isGameComplete, currentLevel]); // ✅ Added currentLevel dependency

  // Cleanup speech synthesis on component unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handleOptionSelect = async (optionWord: string) => {
    if (showFeedback) return;
    
    setSelectedOption(optionWord);
    const selectedOptionData = currentQuestion.options.find(opt => opt.word === optionWord);
    const correct = selectedOptionData?.phoneme === currentQuestion.target.phoneme;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `soundmatch_${currentLevel}_${currentQuestionIndex}`;
    // Find the correct answer - the word from options that matches the target phoneme
    const correctOption = currentQuestion.options.find(opt => opt.phoneme === currentQuestion.target.phoneme);
    const correctAnswerForTelemetry = correctOption?.word || currentQuestion.target.word;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'soundMatch',
      optionWord,
      correctAnswerForTelemetry,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'soundMatch',
      userAnswer: optionWord,
      correctAnswer: correctAnswerForTelemetry,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prev => prev + 1);
      setTotalCorrect(prev => prev + 1);
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
            gameTitle: 'Sound Match Game',
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
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    
    // ✅ UNIQUE QUESTIONS: Reset used questions cache
    setUsedQuestions(new Set());
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage && selectedLevel !== null) {
      // Start new session and regenerate questions
      const session = startSession(gameKey);
      
      // ✅ TRY AGAIN FIX: Reset question tracking for this level to allow retry
      const complexityLevel = soundMatchDataLoader.getComplexityForLevel(currentLevel);
      console.log(`🔄 Resetting game for ${selectedLanguage} level ${currentLevel} (${complexityLevel})`);
      
      // Reset tracking for this specific level to allow retry
      // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (selectedLanguage === 'en' || selectedLanguage === 'te' || selectedLanguage === 'mr' || selectedLanguage === 'kn') 
          ? selectedLanguage 
          : 'en';
      soundMatchDataLoader.resetQuestionTracking(supportedLanguage);
      
      // ✅ QUESTION TRACKING: Generate questions using tracking system with fallback
      const newQuestions = generateROARPhonemeQuestionsWithTracking(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      
      console.log(`📊 Reset generated ${newQuestions.length} questions`);
      if (newQuestions.length === 0) {
        console.error('❌ No questions generated on reset! Trying fallback method...');
        // Fallback to original method
        const fallbackQuestions = generateROARPhonemeQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10,
          new Set()
        );
        console.log(`📊 Fallback generated ${fallbackQuestions.length} questions`);
        setQuestions(fallbackQuestions);
      } else {
        setQuestions(newQuestions);
      }
      
      // ✅ QUESTION TRACKING: Update used questions to prevent repetition
      const newUsedQuestions = new Set<string>();
      const questionsToUse = newQuestions.length > 0 ? newQuestions : generateROARPhonemeQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10,
        new Set()
      );
      questionsToUse.forEach(q => {
        newUsedQuestions.add(q.target.word);
        q.options.forEach(opt => newUsedQuestions.add(opt.word));
      });
      setUsedQuestions(newUsedQuestions);
      
      console.log(`🎮 Reset complete: ${questionsToUse.length} fresh questions for ${selectedLanguage} level ${currentLevel}`);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL
    navigate(`/roar-phoneme-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/roar-phoneme-game');
  };

  const getAvailableLevels = () => {
    // ✅ ALL LEVELS OPEN: Return all levels as available
    return Array.from({ length: languageLevels.maxLevels }, (_, i) => i + 1);
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
        'ఫోనీమ్ మాస్టర్ - పరిపూర్ణ శబ్ద గుర్తింపు!' :
        selectedLanguage === 'mr' ? 
        'फोनीम मास्टर - परिपूर्ण आवाज ओळख!' :
        'Phoneme Master - Perfect Sound Recognition!';
      achievements.push(perfectMessage);
    }
    if (totalCorrect >= Math.floor(questions.length * 0.8)) {
      const detectiveMessage = selectedLanguage === 'te' ? 
        'శబ్ద డిటెక్టివ్ - అద్భుత ఫోనీమ్ కౌశల్యాలు!' :
        selectedLanguage === 'mr' ? 
        'आवाज डिटेक्टिव् - उत्तम फोनीम कौशल्य!' :
        'Sound Detective - Great Phoneme Skills!';
      achievements.push(detectiveMessage);
    }
    if (showLevelUp) {
      const levelUpMessage = selectedLanguage === 'te' ? 
        `లెవల్ అప్! ఇప్పుడు లెవల్ ${gameProgress.currentLevel}` :
        selectedLanguage === 'mr' ? 
        `लेव्हल अप! आता लेव्हल ${gameProgress.currentLevel}` :
        `Level Up! Now at Level ${gameProgress.currentLevel}`;
      achievements.push(levelUpMessage);
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
      <ROARPhonemeGamePreview
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

  // Show level selector if level not selected (after preview)
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
        gameTitle="Sound Match"
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
        gameTitle={`ROAR Phoneme Recognition - ${getNativeLanguageName(selectedLanguage)}`}
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          // ✅ MANUAL LEVEL ADVANCEMENT: Force advance to next level when user clicks "Next Level"
          const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
          
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage} (max: ${languageLevels.maxLevels})`);
          
          // Manually advance the level using the learning progress hook
          manuallyAdvanceLevel(gameKey, nextLevel);
          
          // Navigate to the next level URL
          navigate(`/roar-phoneme-game/level/${nextLevel}`);
          
          console.log(`✅ Level advancement: selectedLevel updated to ${nextLevel}`);
          
          // Reset game state for new level
          setCurrentQuestionIndex(0);
          setScore(0);
          setTotalCorrect(0);
          setSelectedOption(null);
          setShowFeedback(false);
          setIsGameComplete(false);
          setShowLevelUp(false);
          setLevelFailed(false);
          
          // ✅ SOUND FIX: Clear used questions to ensure fresh questions for new level
          setUsedQuestions(new Set());
          
          // ✅ NEXT LEVEL FIX: Generate new questions for the next level
          if (selectedLanguage && selectedLevel !== null) {
            console.log(`🎯 Generating questions for next level ${nextLevel}`);
            
            // Get difficulty settings for the next level
            const nextLevelDifficultySettings = getDifficultySettings(gameKey, nextLevel);
            
            // Generate questions for the next level
            const newQuestions = generateROARPhonemeQuestionsWithTracking(
              selectedLanguage,
              nextLevel,
              nextLevelDifficultySettings.complexity,
              10
            );
            
            console.log(`📊 Next level generated ${newQuestions.length} questions`);
            if (newQuestions.length === 0) {
              console.error('❌ No questions generated for next level! Trying fallback method...');
              // Fallback to original method
              const fallbackQuestions = generateROARPhonemeQuestions(
                selectedLanguage,
                nextLevel,
                nextLevelDifficultySettings.complexity,
                10,
                new Set()
              );
              console.log(`📊 Fallback generated ${fallbackQuestions.length} questions`);
              setQuestions(fallbackQuestions);
            } else {
              setQuestions(newQuestions);
            }
            
            // Update used questions for the new level
            const newUsedQuestions = new Set<string>();
            const questionsToUse = newQuestions.length > 0 ? newQuestions : generateROARPhonemeQuestions(
              selectedLanguage,
              nextLevel,
              nextLevelDifficultySettings.complexity,
              10,
              new Set()
            );
            questionsToUse.forEach(q => {
              newUsedQuestions.add(q.target.word);
              q.options.forEach(opt => newUsedQuestions.add(opt.word));
            });
            setUsedQuestions(newUsedQuestions);
            
            console.log(`🎮 Next level complete: ${questionsToUse.length} fresh questions for ${selectedLanguage} level ${nextLevel}`);
          }
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    console.log('🔍 Debug: No current question found');
    console.log('🔍 Debug: questions.length =', questions.length);
    console.log('🔍 Debug: currentQuestionIndex =', currentQuestionIndex);
    console.log('🔍 Debug: selectedLanguage =', selectedLanguage);
    console.log('🔍 Debug: selectedLevel =', selectedLevel);
    console.log('🔍 Debug: currentLevel =', currentLevel);
    console.log('🔍 Debug: levelFailed =', levelFailed);
    console.log('🔍 Debug: isGameComplete =', isGameComplete);
    
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">
          {questions.length === 0 ? 'Generating questions...' : 'Loading question...'}
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
              Sound Match
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
            <ROARPhonemeGameCore
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

// ✅ JSON-BASED: Generate unique ROAR Phoneme questions using JSON data
// ✅ QUESTION TRACKING: Enhanced question generation with tracking system
function generateROARPhonemeQuestionsWithTracking(language: Language, level: number, complexity: string, count: number = 10): ROARPhonemeQuestion[] {
  // ✅ INPUT VALIDATION: Validate parameters
  if (!language || !complexity || count <= 0) {
    console.error('❌ Invalid input parameters for question generation');
    return [];
  }

  // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';

  // ✅ LEVEL VALIDATION: Check if level is valid for the language
  if (!soundMatchDataLoader.isValidLevel(supportedLanguage, level)) {
    console.error(`❌ Invalid level ${level} for language ${language}`);
    return [];
  }

  // Get complexity level from JSON data
  const complexityLevel = soundMatchDataLoader.getComplexityForLevel(level);
  
  // ✅ QUESTION TRACKING: Get unused questions for this level
  const unusedItems = soundMatchDataLoader.getUnusedQuestionsForLevel(supportedLanguage, complexityLevel);
  
  // ✅ VALIDATE DATA: Ensure we have enough vocabulary
  if (!unusedItems || unusedItems.length === 0) {
    console.error(`❌ No unused vocabulary found for ${language} complexity ${complexityLevel}`);
    return [];
  }

  // ✅ AVAILABILITY CHECK: Check if we have enough questions
  if (unusedItems.length < count) {
    console.warn(`⚠️ Only ${unusedItems.length} unused questions available, requested ${count}`);
    // Reset tracking for this level if we run out of questions
    soundMatchDataLoader.resetQuestionTracking(supportedLanguage);
    const freshItems = soundMatchDataLoader.getItemsForComplexity(supportedLanguage, complexityLevel);
    if (freshItems.length >= count) {
      console.log(`🔄 Reset tracking for ${language} ${complexityLevel} level`);
      return generateROARPhonemeQuestionsWithTracking(language, level, complexity, count);
    }
  }

  const allItems = soundMatchDataLoader.getAllItemsForLanguage(supportedLanguage);
  const questions: ROARPhonemeQuestion[] = [];
  
  console.log(`🎯 Generating questions for ${language} level ${level} (${complexityLevel})`);
  console.log(`📊 Available unused items: ${unusedItems.length}, Requested: ${count}`);

  for (let i = 0; i < Math.min(count, unusedItems.length); i++) {
    const targetItem = unusedItems[i];
    
    // ✅ QUESTION TRACKING: Mark this question as used
    soundMatchDataLoader.markQuestionAsUsed(supportedLanguage, complexityLevel, targetItem.word);
    
    // Find items with the same phoneme for correct answers
    const samePhonemeItems = soundMatchDataLoader.findItemsWithSamePhoneme(
      supportedLanguage, 
      targetItem.phoneme,
      [targetItem.word]
    );
    
    // Find items with different phonemes for distractors
    const differentPhonemeItems = soundMatchDataLoader.findItemsWithDifferentPhoneme(
      supportedLanguage,
      targetItem.phoneme, 
      [targetItem.word]
    );
    
    // Create options array
    const options = [];
    
    // Add the target as the correct answer
    options.push({
      image: targetItem.image,
      word: targetItem.word,
      phoneme: targetItem.phoneme
    });
    
    // Add 3 distractors with different phonemes
    const shuffledDistractors = [...differentPhonemeItems].sort(() => Math.random() - 0.5);
    for (let j = 0; j < 3 && j < shuffledDistractors.length; j++) {
      const distractor = shuffledDistractors[j];
      options.push({
        image: distractor.image,
        word: distractor.word,
        phoneme: distractor.phoneme
      });
    }
    
    // Shuffle options so correct answer isn't always first
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    const question: ROARPhonemeQuestion = {
      target: {
        image: targetItem.image,
        word: targetItem.word,
        phoneme: targetItem.phoneme
      },
      options: shuffledOptions,
      audio: targetItem.word,
      complexity: complexityLevel
    };
    
    // ✅ VALIDATION: Validate the generated question
    const validation = soundMatchDataLoader.validateQuestion(question);
    if (validation.isValid) {
      questions.push(question);
      console.log(`✅ Generated question ${i + 1}: ${targetItem.word} (${targetItem.phoneme})`);
    } else {
      console.error(`❌ Invalid question generated:`, validation.errors);
    }
  }
  
  console.log(`🎉 Successfully generated ${questions.length} questions for ${language} level ${level}`);
  return questions;
}

function generateROARPhonemeQuestions(language: Language, level: number, complexity: string, count: number = 10, usedQuestions: Set<string> = new Set()): ROARPhonemeQuestion[] {
  // ✅ INPUT VALIDATION: Validate parameters
  if (!language || !complexity || count <= 0) {
    console.error('❌ Invalid input parameters for question generation');
    return [];
  }

  // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
  const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
    (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';

  // ✅ LEVEL VALIDATION: Check if level is valid for the language
  if (!soundMatchDataLoader.isValidLevel(supportedLanguage, level)) {
    console.error(`❌ Invalid level ${level} for language ${language}`);
    return [];
  }

  // Get complexity level from JSON data
  const complexityLevel = soundMatchDataLoader.getComplexityForLevel(level);
  const complexityItems = soundMatchDataLoader.getItemsForComplexity(supportedLanguage, complexityLevel);
  const allItems = soundMatchDataLoader.getAllItemsForLanguage(supportedLanguage);
  
  // ✅ VALIDATE DATA: Ensure we have enough vocabulary
  if (!complexityItems || complexityItems.length === 0) {
    console.error(`❌ No vocabulary found for ${language} complexity ${complexityLevel}`);
    return [];
  }
  
  console.log(`🎯 Generating questions for ${language} level ${level} with complexity: ${complexityLevel}`);
  console.log(`📊 Available words in ${complexityLevel}: ${complexityItems.length}`);
  
  // ✅ UNIQUE QUESTIONS: Filter out words already used in current session
  const availableItems = soundMatchDataLoader.filterUnusedItems(complexityItems, usedQuestions);
  
  // If we don't have enough unique words, reset the cache for this complexity level
  if (availableItems.length < count) {
    console.log(`Resetting question cache for ${language} ${complexityLevel} - only ${availableItems.length} unique words remaining`);
    
    // Remove only this complexity level's words from used questions
    const complexityWords = complexityItems.map(item => item.word);
    complexityWords.forEach(word => usedQuestions.delete(word));
    
    // Refresh available items
    const refreshedItems = soundMatchDataLoader.filterUnusedItems(complexityItems, usedQuestions);
    if (refreshedItems.length >= count) {
      console.log(`Cache reset successful - now have ${refreshedItems.length} unique words`);
    }
  }
  
  const questions: ROARPhonemeQuestion[] = [];
  const usedTargets: string[] = [];

  let questionsGenerated = 0;
  let maxAttempts = count * 3; // Allow more attempts to find valid targets
  
  while (questionsGenerated < count && maxAttempts > 0) {
    maxAttempts--;
    
    // ✅ INFINITE LOOP PREVENTION: Get a random target item that hasn't been used
    let target;
    let attempts = 0;
    const maxTargetAttempts = 20;
    
    // Use available items first, then fall back to all items
    const targetPool = availableItems.length > 0 ? availableItems : complexityItems;
    
    do {
      target = targetPool[Math.floor(Math.random() * targetPool.length)];
      attempts++;
    } while (usedTargets.includes(target.phoneme) && attempts < maxTargetAttempts);
    
    if (attempts >= maxTargetAttempts) {
      console.warn(`Could not find unique target after ${maxTargetAttempts} attempts`);
      // Use any available target as fallback
      target = targetPool[0];
    }
    
    usedTargets.push(target.phoneme);
    
    // Create options WITHOUT the target (only 3 distractors + 1 same sound item)
    let options = [];
    
    // Find ONE item that starts with the same sound as target
    // Ensure only supported languages are passed (soundMatchDataLoader doesn't support 'hi')
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    const sameSoundItems = soundMatchDataLoader.findItemsWithSamePhoneme(supportedLanguage, target.phoneme, [target.word]);
    
    // CRITICAL: Ensure we always have exactly one correct answer
    if (sameSoundItems.length > 0) {
      const sameSoundItem = sameSoundItems[Math.floor(Math.random() * sameSoundItems.length)];
      options.push(sameSoundItem);
    } else {
      // If no same-sound item found, log warning and skip this target
      console.warn(`No same-sound item found for "${target.word}" with phoneme "${target.phoneme}". Skipping this target.`);
      continue; // Skip to next iteration
    }
    
    // Add distractors with different phonemes to fill remaining slots
    // Prioritize distractors from the same complexity level for better difficulty scaling
    const sameLevelDistractors = complexityItems.filter(item => 
      item.phoneme !== target.phoneme && 
      item.word !== target.word && 
      !options.find(opt => opt.word === item.word) &&
      !options.find(opt => opt.image === item.image) // Check for duplicate images
    );
    
    const otherLevelDistractors = allItems.filter(item => 
      item.phoneme !== target.phoneme && 
      item.word !== target.word && 
      !options.find(opt => opt.word === item.word) &&
      !options.find(opt => opt.image === item.image) && // Check for duplicate images
      !sameLevelDistractors.find(opt => opt.word === item.word)
    );
    
    // First add same-level distractors, then other levels if needed
    let allDistractors = [...sameLevelDistractors, ...otherLevelDistractors];
    
    // Add random distractors to make total 4 options
    while (options.length < 4 && allDistractors.length > 0) {
      const randomIndex = Math.floor(Math.random() * allDistractors.length);
      const randomDistractor = allDistractors[randomIndex];
      if (!options.find(opt => opt.word === randomDistractor.word) && 
          !options.find(opt => opt.image === randomDistractor.image)) { // Check for duplicate images
        options.push(randomDistractor);
      }
      allDistractors.splice(randomIndex, 1); // Remove used distractor
    }
    
    // VALIDATION: Ensure we have exactly 4 options and 1 correct answer
    if (options.length !== 4) {
      console.warn(`Question ${questionsGenerated + 1}: Only ${options.length} options generated for target "${target.word}"`);
      // Fill remaining slots with any available items
      while (options.length < 4) {
        const fallbackItem = allItems.find(item => 
          !options.find(opt => opt.word === item.word)
        );
        if (fallbackItem) {
          options.push(fallbackItem);
        } else {
          break; // Prevent infinite loop
        }
      }
    }
    
    // Verify we have exactly one correct answer
    const correctAnswers = options.filter(opt => opt.phoneme === target.phoneme);
    if (correctAnswers.length !== 1) {
      console.error(`Question ${questionsGenerated + 1}: ${correctAnswers.length} correct answers found for target "${target.word}"`);
    }
    
    // Verify no duplicate images in options
    const imageCounts: Record<string, number> = {};
    options.forEach(opt => {
      imageCounts[opt.image] = (imageCounts[opt.image] || 0) + 1;
    });
    
    const duplicateImages = Object.entries(imageCounts).filter(([image, count]) => count > 1);
    if (duplicateImages.length > 0) {
      console.error(`Question ${questionsGenerated + 1}: Duplicate images found:`, duplicateImages);
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      target,
      options,
      audio: getTargetWordText(target.word),
      complexity
    });
    
    // ✅ TRACK USAGE: Only mark target and correct answer as used (allow distractors to be reused)
    usedQuestions.add(target.word);
    // Find the correct answer (same phoneme as target) and mark it as used
    const correctAnswer = options.find(opt => opt.phoneme === target.phoneme && opt.word !== target.word);
    if (correctAnswer) {
      usedQuestions.add(correctAnswer.word);
    }
    
    questionsGenerated++;
  }

  return questions;
}

// Helper function to get target word for pronunciation
function getTargetWordText(targetWord: string): string {
  return targetWord; // Just the word for clear pronunciation
}
