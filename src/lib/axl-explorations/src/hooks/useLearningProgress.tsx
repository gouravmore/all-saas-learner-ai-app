import { useState, useCallback, useEffect } from 'react';

export interface GameSession {
  gameType: string;
  level: number;
  questionsAnswered: number;
  correctAnswers: number;
  startTime: number;
  endTime?: number;
}

export interface LearningProgress {
  [gameType: string]: {
    currentLevel: number;
    totalSessions: number;
    totalCorrect: number;
    totalQuestions: number;
    successRate: number;
    lastPlayed: number;
    streak: number;
  };
}

const DIFFICULTY_THRESHOLDS = {
  ADVANCE: 0.8,  // 80% success rate to advance
  MAINTAIN: 0.6, // 60% success rate to maintain level
  REGRESS: 0.4   // Below 40% to go back a level
};

const MIN_QUESTIONS_FOR_LEVEL_CHANGE = 5; // Minimum questions before considering level change

// ✅ UNIFIED MAX LEVELS: All languages now have 10 levels
function getMaxLevelForGameType(gameType: string): number {
  // All games now have 10 levels regardless of language
  return 10;
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(() => {
    const stored = localStorage.getItem('learningProgress');
    return stored ? JSON.parse(stored) : {};
  });

  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  }, [progress]);

  const startSession = useCallback((gameType: string) => {
    const gameProgress = progress[gameType] || {
      currentLevel: 1,
      totalSessions: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      successRate: 0,
      lastPlayed: Date.now(),
      streak: 0
    };

    const session: GameSession = {
      gameType,
      level: gameProgress.currentLevel,
      questionsAnswered: 0,
      correctAnswers: 0,
      startTime: Date.now()
    };

    setCurrentSession(session);
    return session;
  }, [progress]);

  const recordAnswer = useCallback((isCorrect: boolean) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
      };
    });
  }, [currentSession]);

  const endSession = useCallback(() => {
    if (!currentSession) return;

    const sessionSuccessRate = currentSession.questionsAnswered > 0 
      ? currentSession.correctAnswers / currentSession.questionsAnswered 
      : 0;

    setProgress(prev => {
      const gameProgress = prev[currentSession.gameType] || {
        currentLevel: 1,
        totalSessions: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        successRate: 0,
        lastPlayed: Date.now(),
        streak: 0
      };

      const newTotalQuestions = gameProgress.totalQuestions + currentSession.questionsAnswered;
      const newTotalCorrect = gameProgress.totalCorrect + currentSession.correctAnswers;
      const newSuccessRate = newTotalQuestions > 0 ? newTotalCorrect / newTotalQuestions : 0;

      // Determine level adjustment
      let newLevel = gameProgress.currentLevel;
      if (currentSession.questionsAnswered >= MIN_QUESTIONS_FOR_LEVEL_CHANGE) {
        // ✅ LANGUAGE-SPECIFIC MAX LEVELS FIX: Use dynamic max level based on game type
        const maxLevel = getMaxLevelForGameType(currentSession.gameType);
        
        if (sessionSuccessRate >= DIFFICULTY_THRESHOLDS.ADVANCE && newSuccessRate >= DIFFICULTY_THRESHOLDS.ADVANCE) {
          newLevel = Math.min(gameProgress.currentLevel + 1, maxLevel); // Use language-specific max level
          console.log(`Level advancement: ${gameProgress.currentLevel} -> ${newLevel} (max: ${maxLevel}) for ${currentSession.gameType}`);
        } else if (sessionSuccessRate < DIFFICULTY_THRESHOLDS.REGRESS && newSuccessRate < DIFFICULTY_THRESHOLDS.REGRESS && gameProgress.totalSessions > 3) {
          // Only regress level if user has played multiple sessions and consistently performs poorly
          // This prevents level regression on first few attempts
          newLevel = Math.max(gameProgress.currentLevel - 1, 1); // Min level 1
          console.log(`Level regression: ${gameProgress.currentLevel} -> ${newLevel} for ${currentSession.gameType} (poor performance over multiple sessions)`);
        }
      }

      // Update streak
      const newStreak = sessionSuccessRate >= DIFFICULTY_THRESHOLDS.MAINTAIN 
        ? gameProgress.streak + 1 
        : 0;

      return {
        ...prev,
        [currentSession.gameType]: {
          currentLevel: newLevel,
          totalSessions: gameProgress.totalSessions + 1,
          totalCorrect: newTotalCorrect,
          totalQuestions: newTotalQuestions,
          successRate: newSuccessRate,
          lastPlayed: Date.now(),
          streak: newStreak
        }
      };
    });

    setCurrentSession(null);
  }, [currentSession]);

  const getGameProgress = useCallback((gameType: string) => {
    return progress[gameType] || {
      currentLevel: 1,
      totalSessions: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      successRate: 0,
      lastPlayed: 0,
      streak: 0
    };
  }, [progress]);

  const getDifficultySettings = useCallback((gameType: string, level: number) => {
    const baseSettings = {
      1: { optionsCount: 3, timeLimit: 30, complexity: 'basic' },
      2: { optionsCount: 4, timeLimit: 25, complexity: 'basic' },
      3: { optionsCount: 4, timeLimit: 20, complexity: 'intermediate' },
      4: { optionsCount: 5, timeLimit: 20, complexity: 'intermediate' },
      5: { optionsCount: 5, timeLimit: 15, complexity: 'advanced' },
      6: { optionsCount: 6, timeLimit: 15, complexity: 'advanced' },
      7: { optionsCount: 6, timeLimit: 12, complexity: 'expert' },
      8: { optionsCount: 7, timeLimit: 12, complexity: 'expert' },
      9: { optionsCount: 7, timeLimit: 10, complexity: 'master' },
      10: { optionsCount: 8, timeLimit: 10, complexity: 'master' }
    };

    return baseSettings[level as keyof typeof baseSettings] || baseSettings[10];
  }, []);

  // ✅ MANUAL LEVEL ADVANCEMENT: Function to manually set level (for "Next Level" button)
  const manuallyAdvanceLevel = useCallback((gameType: string, targetLevel: number) => {
    const maxLevel = getMaxLevelForGameType(gameType);
    const newLevel = Math.min(Math.max(targetLevel, 1), maxLevel);
    
    setProgress(prev => {
      const gameProgress = prev[gameType] || {
        currentLevel: 1,
        totalSessions: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        successRate: 0,
        lastPlayed: Date.now(),
        streak: 0
      };

      console.log(`Manually advancing ${gameType} from level ${gameProgress.currentLevel} to level ${newLevel}`);

      return {
        ...prev,
        [gameType]: {
          ...gameProgress,
          currentLevel: newLevel,
          lastPlayed: Date.now()
        }
      };
    });
  }, []);

  return {
    progress,
    currentSession,
    startSession,
    recordAnswer,
    endSession,
    getGameProgress,
    getDifficultySettings,
    manuallyAdvanceLevel
  };
}