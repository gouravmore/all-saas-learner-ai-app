import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FuelProgressBar } from "../FuelProgressBar";
import { SuccessScreen } from "../SuccessScreen";
import { LetterLauncherLevelSelector } from "../LetterLauncherLevelSelector";
import { SpaceBackground } from "../SpaceBackground";
import { PlanetWithRocketAnimation } from "../PlanetWithRocketAnimation";
import { TryAgain } from "../TryAgain";
import { PlanetIcon } from "../ui/PlanetIcon";
import { LetterLauncherGameCore, type LetterLauncherQuestion } from "./LetterLauncherGameCore";
import { ArrowLeft, RotateCcw, TrendingUp, Rocket, Fuel, Lock as LockIcon } from "lucide-react";
import { CountdownTimer } from "../CountdownTimer";
import { LetterLauncherGameStoryPreview } from "./LetterLauncherGameStoryPreview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";
import { playLetterAudio } from "../../utils/letterAudioUtils";
import { playSuccessSound } from "../../utils/audioUtils";
import { calculateFuel, getFuelRequirement, getMissionDestination, FuelCalculationResult } from "../../utils/fuelCalculation";

interface LetterLauncherGameProps {
  onBack: () => void;
  contentCount?: number; // Optional: number of questions per level (default: 30)
}

export function LetterLauncherGame({ onBack, contentCount = 30 }: LetterLauncherGameProps) {
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
  const { selectedAudioLanguage } = useAudioLanguage();
  
  // Determine if we're showing level selector or playing a specific level
  const isLevelSelector = !level || level === 'select';
  const selectedLevel = level && level !== 'select' ? parseInt(level) : null;
  const showLevelSelector = isLevelSelector;
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false);
  const [showPreview, setShowPreview] = useState(true); // Show preview/countdown when first opening game
  const [showStoryPreview, setShowStoryPreview] = useState(false); // Show story preview after countdown
  const [showMissionBriefing, setShowMissionBriefing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [gameSessionStarted, setGameSessionStarted] = useState(false); // Track if game session has actually started
  const [isStartingSession, setIsStartingSession] = useState(false); // Prevent double-start
  const [levelFuelStats, setLevelFuelStats] = useState<Map<number, number>>(new Map());
  const [isLoadingFuelStats, setIsLoadingFuelStats] = useState(true);
  const [levelUnlockStatus, setLevelUnlockStatus] = useState<Map<number, boolean>>(new Map());
  const levelUnlockStatusRef = useRef<Map<number, boolean>>(new Map());
  
  const [questions, setQuestions] = useState<LetterLauncherQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [levelFailed, setLevelFailed] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  
  // Fuel mechanics
  const [currentFuel, setCurrentFuel] = useState(0);
  const [displayedFuel, setDisplayedFuel] = useState(0); // Fuel displayed in progress bar (updates only after continue)
  const [fuelEarned, setFuelEarned] = useState<FuelCalculationResult | null>(null);
  const [showLetter, setShowLetter] = useState(false); // Control when letter appears (after audio)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioAbortRef = useRef<boolean>(false); // Ref to abort audio playback
  
  // Adaptive timer
  const [adaptiveTimer, setAdaptiveTimer] = useState<number>(3000); // Start at 3 seconds
  const [responseTimeHistory, setResponseTimeHistory] = useState<number[]>([]);
  
  // Telemetry state - use ref for questionStartTime to avoid React state update delays
  const questionStartTimeRef = useRef<number>(0);
  const [audioStartTime, setAudioStartTime] = useState<number>(0);
  // Use ref to track currentFuel to avoid stale closure values in handleContinue
  const currentFuelRef = useRef<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations - 10 levels
  const getLanguageLevels = (language: Language) => {
    return {
      maxLevels: 10,
      levelNames: ['Moon', 'Mars', 'Jupiter', 'Saturn', 'Venus', 'Uranus', 'Neptune', 'Mercury', 'Pluto', 'Sun']
    };
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `letterLauncher_${selectedLanguage}` : 'letterLauncher';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel || gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');
  const { requiredFuel, maxFuel } = getFuelRequirement(currentLevel, contentCount);
  const missionDestination = getMissionDestination(currentLevel);

  // Letter Launcher level to Letter Hunt levels mapping (configurable)
  // Each Letter Launcher level uses letters from specific Letter Hunt levels
  const LETTER_LAUNCHER_LEVEL_CONFIG: Record<number, number[]> = {
    1: [1, 2, 3],      // Moon - uses Letter Hunt L-1, L-2, L-3
    2: [4, 5, 6],      // Mars - uses Letter Hunt L-4, L-5, L-6
    3: [7, 8, 9, 10],  // Jupiter - uses Letter Hunt L-7, L-8, L-9, L-10
    4: [1, 2, 3],      // Saturn - uses Letter Hunt L-1, L-2, L-3
    5: [4, 5, 6],      // Venus - uses Letter Hunt L-4, L-5, L-6
    6: [7, 8, 9, 10],  // Uranus - uses Letter Hunt L-7, L-8, L-9, L-10
    7: [1, 2, 3],      // Neptune - uses Letter Hunt L-1, L-2, L-3
    8: [4, 5, 6],      // Mercury - uses Letter Hunt L-4, L-5, L-6
    9: [7, 8, 9, 10],  // Pluto - uses Letter Hunt L-7, L-8, L-9, L-10
    10: [10]           // Sun - only L-10 (most infrequent letters)
  };

  // Get level-appropriate letters
  const getLevelLetters = (language: Language, level: number): string[] => {
    const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
      (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
        ? language 
        : 'en';
    
    // Get the Letter Hunt levels to use for this Letter Launcher level
    const letterHuntLevels = LETTER_LAUNCHER_LEVEL_CONFIG[level] || [1, 2, 3];
    
    // For Telugu, Kannada, and Marathi, use levelLetters from multiple Letter Hunt levels
    if (supportedLanguage === 'te' || supportedLanguage === 'kn' || supportedLanguage === 'mr') {
      const allLetters: string[] = [];
      letterHuntLevels.forEach(huntLevel => {
        const letters = memoryGameDataLoader.getLettersByLevel(supportedLanguage, huntLevel.toString());
        allLetters.push(...letters);
      });
      // Remove duplicates
      return [...new Set(allLetters)];
    }
    
    // For English, map Letter Hunt levels to complexity
    // L-1,2,3 -> basic, L-4,5,6 -> intermediate, L-7,8,9,10 -> advanced/expert/master
    const allLetters: string[] = [];
    letterHuntLevels.forEach(huntLevel => {
      let complexity: string;
      if (huntLevel <= 3) {
        complexity = 'basic';
      } else if (huntLevel <= 6) {
        complexity = 'intermediate';
      } else if (huntLevel <= 8) {
        complexity = 'advanced';
      } else if (huntLevel <= 9) {
        complexity = 'expert';
      } else {
        complexity = 'master';
      }
      const letters = memoryGameDataLoader.getLetters(supportedLanguage, complexity);
      allLetters.push(...letters);
    });
    // Remove duplicates
    return [...new Set(allLetters)];
  };

  // Generate questions (configurable count per level, default: 30)
  const generateQuestions = (language: Language, level: number, complexity: string, count: number = contentCount): LetterLauncherQuestion[] => {
    const lettersToUse = getLevelLetters(language, level);
    const questions: LetterLauncherQuestion[] = [];
    
    if (lettersToUse.length === 0) {
      console.warn(`No letters available for ${language} level ${level}`);
      return [];
    }

    // Generate questions: 50% match, 50% non-match
    for (let i = 0; i < count; i++) {
      const audioLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
      const isMatch = Math.random() < 0.5; // 50% chance of match
      
      let displayedLetter: string;
      if (isMatch) {
        displayedLetter = audioLetter; // Match case
      } else {
        // Non-match: pick a different letter
        const otherLetters = lettersToUse.filter(l => l !== audioLetter);
        displayedLetter = otherLetters.length > 0 
          ? otherLetters[Math.floor(Math.random() * otherLetters.length)]
          : audioLetter; // Fallback if only one letter available
      }
      
      questions.push({
        audioLetter,
        displayedLetter,
        isMatch,
        complexity,
        language
      });
    }
    
    return questions;
  };

  // Calculate adaptive timer based on past performance
  const calculateAdaptiveTimer = async (language: Language, level: number): Promise<number> => {
    const currentUser = sessionManager.getCurrentUser();
    if (!currentUser) {
      return 3000; // Default 3 seconds
    }

    try {
      // Search for past performance data
      const gameName = gameKey.split('_')[0];
      const searchParams = {
        userId: currentUser.username,
        courseId: gameName,
        unitId: language,
        contentId: `level${level}`
      };
      
      const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
      
      if (result.success && result.data) {
        // Extract response times from assessment summaries
        const allResponseTimes: number[] = [];
        
        // Iterate through level data
        Object.keys(result.data).forEach((levelKey) => {
          if (!levelKey.startsWith('level')) return;
          const levelData = (result.data as any)[levelKey];
          const assessmentSummary = levelData?.assessmentSummary || [];
          
          assessmentSummary.forEach((section: any) => {
            if (section.data) {
              section.data.forEach((item: any) => {
                if (item.duration && item.pass === 'Yes') {
                  allResponseTimes.push(item.duration);
                }
              });
            }
          });
        });
        
        if (allResponseTimes.length > 0) {
          // Calculate average response time
          const avgResponseTime = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;
          // Set timer to average + 20% buffer, but minimum 2 seconds, maximum 5 seconds
          const calculatedTimer = Math.max(2000, Math.min(5000, avgResponseTime * 1.2));
          return calculatedTimer;
        }
      }
    } catch (error) {
      console.error('Error calculating adaptive timer:', error);
    }
    
    return 3000; // Default 3 seconds
  };


  // Initialize game session and questions when language or level is selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        console.log(`[LetterLauncher] Initialization useEffect running for level ${selectedLevel}, language ${selectedLanguage}`);
        
        // Abort any ongoing audio playback
        audioAbortRef.current = true;
        
        // Stop any playing audio first
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
        }
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const session = startSession(gameKey);
        setPreviousLevel(currentLevel);
        
        // Initialize tracking assessment - but DON'T set levelStartTime here
        // levelStartTime will be set when "Start Mission" is clicked to match telemetry timing
        questionStartTimeRef.current = 0; // Reset question start time
        setQuestionSummaries([]);
        
        // DON'T start telemetry subsession here - it will start when "Start Mission" is clicked
        // This prevents the sub-session from starting when mission briefing is shown
        
        // When selecting a level, always go to mission briefing (no countdown)
        setShowMissionBriefing(true);
        setShowCountdown(false);
        // Reset game session started flag - audio should not play until "Start Mission" is clicked
        setGameSessionStarted(false);
        // Keep abort flag set - it will be cleared when "Start Mission" is clicked
        
        // Calculate adaptive timer
        const timer = await calculateAdaptiveTimer(selectedLanguage, currentLevel);
        setAdaptiveTimer(timer);
        console.log(`Adaptive timer set to ${timer}ms`);
        
        // Generate questions (use contentCount prop, default: 30)
        const newQuestions = generateQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          contentCount
        );
        setQuestions(newQuestions);
        setCurrentFuel(0);
        currentFuelRef.current = 0; // Sync ref with state
        setDisplayedFuel(0);
        setCurrentQuestionIndex(0);
        setShowLetter(false);
        setIsPlayingAudio(false);
        // Reset feedback state when switching levels
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsCorrect(false);
        setFuelEarned(null);
        // Reset game completion states when switching levels
        setIsGameComplete(false);
        setLevelFailed(false);
        setShowLevelUp(false);
        setTotalCorrect(0);
        console.log(`Generated ${newQuestions.length} questions for level ${currentLevel}`);
      }
    };
    initializeGame();
  }, [selectedLanguage, selectedLevel, isGameComplete]); // Removed gameKey from dependencies to prevent double-run

  // Reset game state when navigating to a new level via URL (similar to other games)
  useEffect(() => {
    if (selectedLevel !== null) {
      // Reset game state when navigating to a specific level
      setIsGameComplete(false);
      setLevelFailed(false);
      setShowLevelUp(false);
      setCurrentQuestionIndex(0);
      setTotalCorrect(0);
      setCurrentFuel(0);
      currentFuelRef.current = 0; // Sync ref with state
      setDisplayedFuel(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setFuelEarned(null);
      setShowLetter(false);
      setIsPlayingAudio(false);
      setShowMissionBriefing(true);
      setShowCountdown(false);
      setGameSessionStarted(false);
      setResponseTimeHistory([]);
      
      // Reset tracking assessment state
      setLevelStartTime(Date.now());
      setQuestionSummaries([]);
    }
  }, [selectedLevel]);

  // Handle mission briefing continue -> game start
  const handleMissionBriefingContinue = async () => {
    setShowMissionBriefing(false);
    await startGameSession();
  };

  const handleCountdownComplete = async () => {
    console.log('[LetterLauncher] Countdown complete, showing story preview');
    setShowCountdown(false);
    // After countdown, show story preview
    setShowStoryPreview(true);
    // Also set showPreview to false to prevent countdown from showing again
    setShowPreview(false);
  };

  const handleStoryPreviewComplete = () => {
    setShowStoryPreview(false);
    // After story preview, show level selector
    setShowPreview(false);
  };

  const startGameSession = async () => {
    // Prevent double-start
    if (isStartingSession) {
      console.log(`[LetterLauncher] startGameSession already in progress, skipping`);
      return;
    }
    
    setIsStartingSession(true);
    
    try {
      // Start telemetry subsession when "Start Mission" is clicked (not when mission briefing is shown)
      const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
      if (currentSubSession && currentSubSession.isActive) {
        await sessionTelemetryManager.endSubSession();
      }
      await sessionTelemetryManager.startSubSession(gameKey, currentLevel, selectedLanguage!);
      
      // Set levelStartTime NOW (when gameplay actually starts) to match telemetry timing
      // This ensures tracking service and telemetry calculate duration from the same start point
      const now = Date.now();
      setLevelStartTime(now);
      questionStartTimeRef.current = now;
      
      // Clear abort flag and mark that game session has started (allows audio to play)
      audioAbortRef.current = false;
      setGameSessionStarted(true);
    } finally {
      setIsStartingSession(false);
    }
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
        
        const gameName = gameKey.split('_')[0];
        const searchParams = {
          userId: currentUser.username,
          courseId: gameName,
          unitId: selectedLanguage
        };
        
        const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
        
        if (result.success && result.data && typeof result.data === 'object') {
          const level1Data = (result.data as any)['level1'];
          const level1Percent = level1Data?.metadata?.scorePercentage ?? 0;
          const level1Completed = level1Data?.metadata?.isCompleted ?? false;
          const hasLevel1Progress = level1Completed || level1Percent > 0;
          setLevel1HasProgress(hasLevel1Progress);

          // Store unlock status for all levels
          const unlockMap = new Map<number, boolean>();
          let highestSuccessfulLevel = 0;
          Object.keys(result.data).forEach((levelKey) => {
            if (!levelKey.startsWith('level')) return;
            const levelNumber = parseInt(levelKey.replace('level', ''));
            if (Number.isNaN(levelNumber)) return;
            const levelData = (result.data as any)[levelKey];
            const percent = levelData?.metadata?.scorePercentage ?? 0;
            const completed = levelData?.metadata?.isCompleted ?? false;
            const isUnlocked = levelData?.metadata?.isUnlocked ?? (levelNumber === 1);
            unlockMap.set(levelNumber, isUnlocked);
            if (completed || percent > 0) {
              highestSuccessfulLevel = Math.max(highestSuccessfulLevel, levelNumber);
            }
          });
          setLevelUnlockStatus(unlockMap);
          levelUnlockStatusRef.current = unlockMap;

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

  const currentQuestion = questions[currentQuestionIndex];
  
  // Stop audio when mission briefing is shown
  useEffect(() => {
    if (showMissionBriefing) {
      // Abort any ongoing audio playback
      audioAbortRef.current = true;
      
      // Stop any playing audio when mission briefing is shown
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      setIsPlayingAudio(false);
      // Keep abort flag set - it will be cleared when "Start Mission" is clicked
    }
  }, [showMissionBriefing]);

  // Play audio and show letter after audio ends - Only after game session has started
  useEffect(() => {
    // Don't play audio if mission briefing is shown or game session hasn't started
    if (!currentQuestion || showFeedback || isGameComplete || !selectedLanguage || selectedLevel === null || showCountdown || showMissionBriefing || !gameSessionStarted || audioAbortRef.current) {
      // Stop any playing audio if conditions are not met
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      setIsPlayingAudio(false);
      return;
    }

    const playQuestionAudio = async () => {
      // Check if audio was aborted before starting
      if (audioAbortRef.current) {
        return;
      }
      
      setShowLetter(false);
      setIsPlayingAudio(true);
      const audioStart = Date.now();
      setAudioStartTime(audioStart);
      
      // Play audio
      await playLetterAudio(currentQuestion.audioLetter, selectedLanguage);
      
      // Check again if audio was aborted during playback
      if (audioAbortRef.current) {
        setIsPlayingAudio(false);
        return;
      }
      
      // Set question start time BEFORE showing the letter to ensure accurate timing
      // This is the moment the user can start responding
      // Use ref to ensure immediate access without React state update delay
      const letterAppearTime = Date.now();
      questionStartTimeRef.current = letterAppearTime;
      
      // After audio ends, show the letter
      setShowLetter(true);
      setIsPlayingAudio(false);
      
      // Debug log to verify timing
      console.log('[LetterLauncher] Letter appeared, questionStartTimeRef set to:', letterAppearTime);
    };
    
    playQuestionAudio();

    // Cleanup: stop audio if component unmounts or conditions change
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      setIsPlayingAudio(false);
    };
  }, [currentQuestionIndex, currentQuestion, showFeedback, isGameComplete, selectedLanguage, selectedLevel, showCountdown, showMissionBriefing, gameSessionStarted]);

  // Handle keyboard input (Left/W = Match, Right/M = Non-match)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showFeedback || isGameComplete || !currentQuestion || !showLetter || isPlayingAudio) return;
      
      if (event.key === 'ArrowLeft' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        handleAnswerSelect(true); // Match
      } else if (event.key === 'ArrowRight' || event.key === 'm' || event.key === 'M') {
        event.preventDefault();
        handleAnswerSelect(false); // Non-match
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, isGameComplete, currentQuestion, showLetter, isPlayingAudio]);

  // Fetch fuel stats for levels when showing level selector
  useEffect(() => {
    const fetchFuelStats = async () => {
      if (!showLevelSelector || !selectedLanguage) return;
      
      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) {
        setIsLoadingFuelStats(false);
        return;
      }

      try {
        setIsLoadingFuelStats(true);
        const gameName = gameKey.split('_')[0];
        const searchParams = {
          userId: currentUser.username,
          courseId: gameName,
          unitId: selectedLanguage
        };
        
        const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
        const fuelMap = new Map<number, number>();
        
        if (result.success && result.data && typeof result.data === 'object') {
          for (let level = 1; level <= 2; level++) {
            const levelKey = `level${level}`;
            const levelData = (result.data as any)[levelKey];
            if (levelData?.metadata?.fuelEarned) {
              fuelMap.set(level, levelData.metadata.fuelEarned);
            }
          }
        }
        
        setLevelFuelStats(fuelMap);
      } catch (error) {
        console.error('Error fetching fuel stats:', error);
      } finally {
        setIsLoadingFuelStats(false);
      }
    };
    
    fetchFuelStats();
  }, [showLevelSelector, selectedLanguage, gameKey]);

  const handleAnswerSelect = async (isMatch: boolean) => {
    if (showFeedback || !currentQuestion || !showLetter) return;
    
    // IMMEDIATELY capture response time before any async operations
    const now = Date.now();
    const questionStart = questionStartTimeRef.current;
    const responseTime = questionStart > 0 ? now - questionStart : 0;
    
    setSelectedAnswer(isMatch);
    const correct = isMatch === currentQuestion.isMatch;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Calculate fuel earned IMMEDIATELY (before any async operations)
    const fuelResult = calculateFuel(responseTime, correct);
    setFuelEarned(fuelResult);
    
    // Debug logging for fuel calculation
    console.log('[LetterLauncher] Fuel Calculation:', {
      questionStartTime: questionStart,
      currentTime: now,
      responseTime: `${responseTime}ms`,
      isCorrect: correct,
      fuelEarned: fuelResult.fuelEarned,
      speedTier: fuelResult.speedTier,
      currentFuel: currentFuel,
      newFuel: correct ? currentFuel + fuelResult.fuelEarned : currentFuel
    });
    
    // Play success sound for correct answers AFTER calculating fuel (non-blocking)
    // Use audio instruction language (not learning language)
    if (correct) {
      const audioLang = selectedAudioLanguage || selectedLanguage || 'en';
      playSuccessSound(audioLang, { exactLanguage: true }).catch(error => {
        console.warn('Success audio playback failed:', error);
      });
    }
    
    if (correct) {
      setCurrentFuel(prev => {
        const newFuel = prev + fuelResult.fuelEarned;
        console.log(`Fuel updated: ${prev} + ${fuelResult.fuelEarned} = ${newFuel}`);
        // Update ref to keep it in sync with state
        currentFuelRef.current = newFuel;
        // Update telemetry subsession with current fuel (for page refresh case)
        sessionTelemetryManager.updateSubSessionFuel(newFuel);
        return newFuel;
      });
      setTotalCorrect(prev => prev + 1);
      // Track response time for adaptive timer
      setResponseTimeHistory(prev => [...prev, responseTime]);
    } else {
      console.log('Incorrect answer - no fuel earned');
    }
    
    recordAnswer(correct);
    
    // Telemetry assess - pass fuel points for variable scoring (0, 1, 3, or 5)
    const questionId = `letterLauncher_${currentLevel}_${currentQuestionIndex}`;
    
    // Format user answer as colon-separated string: "audioLetter:displayedLetter:userSelected"
    // Example: "A:A:true" (user selected match) or "A:B:false" (user selected non-match)
    const userAnswer = `${currentQuestion.audioLetter}:${currentQuestion.displayedLetter}:${isMatch ? 'true' : 'false'}`;
    
    // Format correct answer as colon-separated string: "audioLetter:displayedLetter:isMatch"
    // Example: "A:A:true" (is a match) or "A:B:false" (is not a match)
    const correctAnswer = `${currentQuestion.audioLetter}:${currentQuestion.displayedLetter}:${currentQuestion.isMatch}`;
    
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'letterLauncher',
      userAnswer,
      correctAnswer,
      correct,
      responseTime,
      fuelResult.fuelEarned, // Pass fuel points for variable scoring in telemetry
      5 // Max score per question (maximum fuel points)
    );
    sessionTelemetryManager.updateSubSession(correct);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'letterLauncher',
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity,
      points: fuelResult.fuelEarned // Store fuel earned as points for tracking
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
  };

  const handleContinue = useCallback(async () => {
    // Update displayed fuel when continue is clicked (after answer is confirmed)
    // Use ref to get the latest fuel value to avoid stale closure issues
    const latestFuel = currentFuelRef.current;
    setDisplayedFuel(latestFuel);
    
    if (currentQuestionIndex < questions.length - 1) {
      // IMPORTANT: Reset showLetter to false BEFORE changing question index
      // This ensures the audio icon shows first, then letter appears after audio
      setShowLetter(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFuelEarned(null);
    } else {
      // Level complete - check fuel requirement
      // IMPORTANT: Use ref to get latest fuel value to avoid stale closure issues
      // currentFuelRef.current already includes the last question's fuel (updated in handleAnswerSelect)
      // So we should NOT add fuelEarned again - that would double count!
      const finalFuel = currentFuelRef.current; // Use ref to get latest value including last question
      const finalCorrect = totalCorrect + (isCorrect ? 1 : 0);
      const hasEnoughFuel = finalFuel >= requiredFuel;
      
      // Calculate total time spent
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      
      // Send tracking assessment data
      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        const sessionId = currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;
        
        // Build complete summaries array including last question
        const lastQuestionId = `letterLauncher_${currentLevel}_${currentQuestionIndex}`;
        const hasLastQuestion = questionSummaries.some(q => q.questionId === lastQuestionId);
        let allSummariesForTracking = [...questionSummaries];
        
        if (!hasLastQuestion && fuelEarned && currentQuestion) {
          // Format user answer as colon-separated string: "audioLetter:displayedLetter:userSelected"
          // Example: "A:A:true" (user selected match) or "A:B:false" (user selected non-match) or "A:A:unknown"
          const lastUserAnswer = selectedAnswer !== null 
            ? `${currentQuestion.audioLetter}:${currentQuestion.displayedLetter}:${selectedAnswer ? 'true' : 'false'}`
            : `${currentQuestion.audioLetter}:${currentQuestion.displayedLetter}:unknown`;
          
          // Format correct answer as colon-separated string: "audioLetter:displayedLetter:isMatch"
          // Example: "A:A:true" or "A:B:false"
          const lastCorrectAnswer = `${currentQuestion.audioLetter}:${currentQuestion.displayedLetter}:${currentQuestion.isMatch}`;
          
          const lastQuestionSummary: QuestionSummary = {
            questionId: lastQuestionId,
            questionType: 'letterLauncher',
            userAnswer: lastUserAnswer,
            correctAnswer: lastCorrectAnswer,
            isCorrect: isCorrect,
            responseTime: 0,
            complexity: currentQuestion.complexity,
            points: fuelEarned.fuelEarned
          };
          allSummariesForTracking = [...questionSummaries, lastQuestionSummary];
        }
        
        // Update state with complete summaries
        setQuestionSummaries(allSummariesForTracking);
        
        // Await the assessment tracking to ensure backend processes completion before refreshing unlock status
        const actualCorrect = allSummariesForTracking.filter(q => q.isCorrect).length;
        const totalScoreFromFuel = currentFuelRef.current;
        
        await trackingAssessmentService.createAssessmentTracking({
          userId: currentUser.username,
          gameKey: gameKey,
          gameTitle: 'Letter Launcher',
          level: currentLevel,
          language: selectedLanguage || 'en',
          totalQuestions: questions.length,
          correctAnswers: actualCorrect,
          totalScore: totalScoreFromFuel,
          timeSpent: totalTimeSpent,
          assessmentSummary: allSummariesForTracking,
          sessionId: sessionId,
          subsessionId: subsessionId,
          metadata: {
            difficulty: difficultySettings.complexity,
            levelFailed: !hasEnoughFuel,
            scorePercentage: (actualCorrect / questions.length) * 100,
            fuelEarned: finalFuel,
            fuelRequired: requiredFuel,
            missionDestination: missionDestination
          }
        });
      }
      
      // End telemetry subsession - pass total fuel earned and required fuel for Letter Launcher
      const finalFuelForTelemetry = currentFuelRef.current; // Use ref to get latest fuel value
      await sessionTelemetryManager.endSubSession(finalFuelForTelemetry, requiredFuel);
      await sessionTelemetryManager.flushAssessEventBatch();
      
      if (hasEnoughFuel) {
        console.log(`Letter Launcher completed for ${selectedLanguage}, previous level: ${previousLevel}`);
        endSession();
        const newProgress = getGameProgress(gameKey);
        if (newProgress.currentLevel > previousLevel) {
          setShowLevelUp(true);
        }
        setLevelFailed(false);
        
        // Refresh unlock status after level completion to get updated backend data
        // IMPORTANT: Await this before setting isGameComplete to ensure success screen has correct unlock status
        // Also add small delay to ensure backend has processed the completion
        if (currentUser) {
          try {
            // Small delay to ensure backend has processed the completion
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const gameName = gameKey.split('_')[0];
            const searchParams = {
              userId: currentUser.username,
              courseId: gameName,
              unitId: selectedLanguage
            };
            const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
            if (result.success && result.data && typeof result.data === 'object') {
              const unlockMap = new Map<number, boolean>();
              Object.keys(result.data).forEach((levelKey) => {
                if (!levelKey.startsWith('level')) return;
                const levelNumber = parseInt(levelKey.replace('level', ''));
                if (Number.isNaN(levelNumber)) return;
                const levelData = (result.data as any)[levelKey];
                const isUnlocked = levelData?.metadata?.isUnlocked ?? (levelNumber === 1);
                unlockMap.set(levelNumber, isUnlocked);
              });
              // Update both state and ref - ref is immediately available for success screen
              setLevelUnlockStatus(unlockMap);
              levelUnlockStatusRef.current = unlockMap;
            }
          } catch (error) {
            console.error('Error refreshing unlock status:', error);
          }
        }
      } else {
        setLevelFailed(true);
      }
      setIsGameComplete(true);
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, isCorrect, previousLevel, gameKey, currentFuel, fuelEarned, requiredFuel, missionDestination, currentLevel, selectedLanguage, currentQuestion, selectedAnswer, difficultySettings.complexity]);

  // Auto-advance to next question after feedback is shown
  useEffect(() => {
    if (!showFeedback || isGameComplete || !currentQuestion) return;

    // Auto-advance after 2 seconds (2000ms) to show feedback
    const autoAdvanceTimer = setTimeout(async () => {
      await handleContinue();
    }, 2000);

    // Cleanup timer if component unmounts or feedback changes
    return () => {
      clearTimeout(autoAdvanceTimer);
    };
  }, [showFeedback, isGameComplete, currentQuestion, handleContinue]);

  const handleBackClick = async () => {
    // Abort any ongoing audio playback
    audioAbortRef.current = true;
    
    // Stop any playing audio
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    // Stop any HTML audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // Reset game session started flag
    setGameSessionStarted(false);
    
    // End telemetry subsession - pass total fuel earned and required fuel for Letter Launcher (if available)
    const currentFuelForTelemetry = currentFuelRef.current; // Use ref to get latest fuel value
    await sessionTelemetryManager.endSubSessionWithBackButton(currentFuelForTelemetry, requiredFuel);
    setTimeout(() => onBack(), 100);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setCurrentFuel(0);
    currentFuelRef.current = 0; // Sync ref with state
    setDisplayedFuel(0);
    setFuelEarned(null);
    setShowLetter(false);
    setIsPlayingAudio(false);
    setResponseTimeHistory([]);
    setShowMissionBriefing(true);
    setShowCountdown(false);
    setGameSessionStarted(false);
    setIsStartingSession(false); // Reset the starting flag
    audioAbortRef.current = true;
    
    setUsedQuestions(new Set());
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        contentCount
      );
      setQuestions(newQuestions);
    }
  };

  const handleLevelSelect = (level: number) => {
    navigate(`/letter-launcher-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    navigate('/letter-launcher-game');
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (questions.length > 0) {
      if (totalCorrect === questions.length) {
        achievements.push("Speed Master - Perfect Score!");
      }
      if (currentFuel >= requiredFuel) {
        achievements.push(`Mission Success! Reached ${missionDestination}!`);
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
      <SpaceBackground className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </SpaceBackground>
    );
  }

  // Show story preview after countdown (check this first)
  if (showStoryPreview && selectedLanguage) {
    console.log('[LetterLauncher] Rendering story preview, level:', backendCurrentLevel);
    return (
      <LetterLauncherGameStoryPreview
        onStartGame={handleStoryPreviewComplete}
        onBack={() => {
          setShowStoryPreview(false);
          setShowPreview(false);
          onBack();
        }}
        level={backendCurrentLevel}
        hideHeader={false}
      />
    );
  }

  // Show countdown when first opening game (before level selector)
  // Only show if: (backend level is 1 AND level 1 has no progress) - same as other games
  const shouldShowCountdown = showPreview && selectedLanguage && !showStoryPreview &&
    ((backendCurrentLevel === 1 && !level1HasProgress));
  
  if (shouldShowCountdown) {
    return (
      <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <Button
              onClick={() => {
                setShowPreview(false);
                onBack();
              }}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
          </div>
          <CountdownTimer
            initialCount={3}
            onComplete={handleCountdownComplete}
          />
        </div>
      </div>
    );
  }

  // Show mission briefing screen - Visual and child-friendly
  if (showMissionBriefing && selectedLanguage && selectedLevel !== null) {
    return (
      <SpaceBackground className="h-screen overflow-hidden flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 p-2 sm:p-4">
          <div className="flex flex-row items-center justify-between mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
            <Button 
              onClick={handleBackClick}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
          </div>
          
          <Card className="flex-1 p-4 sm:p-6 md:p-8 bg-transparent border-0 shadow-none overflow-hidden flex flex-col items-center justify-center">
            <div className="text-center space-y-4 sm:space-y-6 max-w-lg">
              {/* Visual Elements */}
              <div className="space-y-3 sm:space-y-4">
                {/* Moon with orbiting rocket */}
                <div className="flex justify-center">
                  <PlanetWithRocketAnimation 
                    level={currentLevel}
                    planetSize="text-6xl sm:text-7xl md:text-8xl"
                    containerSize={{
                      width: 'clamp(120px, 30vw, 200px)',
                      height: 'clamp(120px, 30vw, 200px)'
                    }}
                    orbitSize={{
                      width: 'clamp(100px, 25vw, 180px)',
                      height: 'clamp(100px, 25vw, 180px)'
                    }}
                    rocketSize={{
                      width: 'clamp(20px, 5vw, 32px)',
                      height: 'clamp(28px, 7vw, 44px)'
                    }}
                  />
                </div>
                
                {/* Mission Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Reach {missionDestination}!
                </h1>
              </div>
              
              {/* Fuel Requirement */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 bg-blue-50/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 border-2 border-blue-200">
                  <Fuel className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 fill-blue-600" />
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                      {requiredFuel}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-700">
                      Fuel Needed
                    </div>
                  </div>
                </div>
                
                {/* Quick instruction */}
                <p className="text-sm sm:text-base text-white/80">
                  Answer fast = More fuel! 🚀
                </p>
              </div>
              
              {/* Start Button */}
              <div className="pt-2 sm:pt-4">
                <Button
                  onClick={handleMissionBriefingContinue}
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg"
                >
                  🚀 Start Mission
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </SpaceBackground>
    );
  }


  // Show level selection screen - Use custom LetterLauncherLevelSelector
  if (showLevelSelector && !shouldShowCountdown) {
    const levelSelectorCurrentLevel = gameProgress.currentLevel;
    
    return (
      <LetterLauncherLevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={levelSelectorCurrentLevel}
        maxLevels={languageLevels.maxLevels}
        onLevelSelect={handleLevelSelect}
        onBack={() => {
          setShowPreview(true);
          onBack();
        }}
        onDemo={() => {
          // Replay the story preview demo
          setShowStoryPreview(true);
          setShowPreview(false);
        }}
        gameKey={gameKey}
      />
    );
  }

  // Show success/failure screen when game is complete
  if (isGameComplete) {
      // IMPORTANT: Use ref to get latest fuel value to avoid stale closure issues
      // currentFuelRef.current already includes the last question's fuel (updated in handleAnswerSelect)
      // So we should NOT add fuelEarned again - that would double count!
      const finalFuel = currentFuelRef.current; // Use ref to get latest value including last question
    
    // Calculate stars based on fuel percentage
    // const fuelPercentage = (finalFuel / requiredFuel) * 100;
    const starsEarned = (finalFuel < requiredFuel) ? 1 : (finalFuel - requiredFuel > (maxFuel - requiredFuel) / 2 ? 3 : 2);
    
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
          fuelMode={true}
          fuelCollected={finalFuel}
          fuelRequired={requiredFuel}
          destination={missionDestination}
          useSpaceBackground={true}
        />
      );
    }
    
    return (
      <SuccessScreen
        gameTitle="Letter Launcher"
        score={totalCorrect}
        totalQuestions={questions.length}
        starsEarned={starsEarned}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels && (levelUnlockStatusRef.current.get(currentLevel + 1) ?? false)}
        onNextLevel={() => {
                      const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
                      console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage}`);
                      manuallyAdvanceLevel(gameKey, nextLevel);
                      navigate(`/letter-launcher-game/level/${nextLevel}`);
                    }}
        fuelMode={true}
        fuelCollected={finalFuel}
        fuelRequired={requiredFuel}
        destination={missionDestination}
        nextDestination={currentLevel < languageLevels.maxLevels ? getMissionDestination(currentLevel + 1) : ''}
        useSpaceBackground={true}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    return (
      <SpaceBackground className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </SpaceBackground>
    );
  }

  return (
    <SpaceBackground className="h-screen p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="relative flex flex-row items-center mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
            <Button 
              onClick={handleBackClick}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:text-white text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 z-10"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-full">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
                Letter Launcher
              </h1>
              <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
                <Rocket className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>
                  {selectedLevel !== null && selectedLevel !== gameProgress.currentLevel ? 
                    `Practice Level ${selectedLevel}` : 
                    `Level ${currentLevel} / ${languageLevels.maxLevels}`
                  } • Mission: {missionDestination}
                </span>
              </div>
            </div>
            
            {/* Spacer to balance layout */}
            <div className="w-[100px] sm:w-[120px]"></div>
          </div>

          {/* Main Content Card */}
          <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-transparent border-0 shadow-none overflow-hidden flex flex-col">
          {/* Fuel Progress */}
          <div className="mb-2 sm:mb-3 flex-shrink-0">
            <FuelProgressBar 
              currentFuel={displayedFuel}
              requiredFuel={requiredFuel}
              maxFuel={maxFuel}
              hidePercentage={true}
            />
          </div>

          {/* Game Area - transparent to show space background */}
          <div className="flex-1 flex flex-col px-1 sm:px-2 py-2">
            <div className="bg-transparent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
              <LetterLauncherGameCore
                currentQuestion={{
                  ...currentQuestion,
                  displayedLetter: showLetter ? currentQuestion.displayedLetter : ''
                }}
                mode="game"
                selectedLanguage={selectedLanguage!}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                selectedAnswer={selectedAnswer}
                fuelEarned={fuelEarned}
                disabled={!showLetter || isPlayingAudio}
                onAnswerSelect={handleAnswerSelect}
                onContinue={handleContinue}
              />
            </div>
          </div>
        </Card>
      </div>
    </SpaceBackground>
  );
}

export default LetterLauncherGame;

