export interface GameSessionData {
  gameId: string;
  gameName: string;
  username: string;
  currentLevel: number;
  maxLevel: number;
  completedLevels: number[];
  totalTimeSpent: number; // in minutes
  lastPlayed: number;
  totalSessions: number;
  successRate: number;
  totalCorrect: number;
  totalQuestions: number;
}

export interface LevelSessionData {
  level: number;
  startTime: number;
  endTime?: number;
  timeSpent: number; // in minutes
  questionsAnswered: number;
  correctAnswers: number;
  completed: boolean;
  attempts: number;
}

export interface UserGameProgress {
  [username: string]: {
    [gameId: string]: GameSessionData;
  };
}

class GameSessionTracker {
  private readonly STORAGE_KEY = 'axl_game_session_tracker';
  private readonly MAX_LEVELS = 10; // All games have 10 levels

  // Get all user game progress from localStorage
  private getUserGameProgress(): UserGameProgress {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const result = data ? JSON.parse(data) : {};
      console.log('Retrieved user game progress:', result);
      return result;
    } catch (error) {
      console.error('Error reading game session data:', error);
      return {};
    }
  }

  // Save user game progress to localStorage
  private saveUserGameProgress(data: UserGameProgress): void {
    try {
      console.log('Saving user game progress:', data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving game session data:', error);
    }
  }

  // Initialize game data for a user if it doesn't exist
  private initializeGameData(username: string, gameId: string, gameName: string): GameSessionData {
    console.log(`Creating new game data for ${username} - ${gameId}`);
    
    const gameData: GameSessionData = {
      gameId,
      gameName,
      username,
      currentLevel: 1,
      maxLevel: this.MAX_LEVELS,
      completedLevels: [],
      totalTimeSpent: 0,
      lastPlayed: Date.now(),
      totalSessions: 0,
      successRate: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };

    const userProgress = this.getUserGameProgress();
    if (!userProgress[username]) {
      userProgress[username] = {};
    }
    
    userProgress[username][gameId] = gameData;
    this.saveUserGameProgress(userProgress);
    
    console.log(`Game data initialized for ${username} - ${gameId}:`, gameData);
    return gameData;
  }

  // Start a level session
  startLevelSession(username: string, gameId: string, gameName: string, level: number): void {
    const userProgress = this.getUserGameProgress();
    
    if (!userProgress[username]) {
      userProgress[username] = {};
    }
    
    if (!userProgress[username][gameId]) {
      userProgress[username][gameId] = this.initializeGameData(username, gameId, gameName);
    }

    // Initialize level session data
    const levelSessionKey = `level_${level}_session`;
    const levelSessionData: LevelSessionData = {
      level,
      startTime: Date.now(),
      timeSpent: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      completed: false,
      attempts: 1
    };

    // Store level session data
    const sessionKey = `${username}_${gameId}_${levelSessionKey}`;
    localStorage.setItem(sessionKey, JSON.stringify(levelSessionData));

    this.saveUserGameProgress(userProgress);
  }

  // End a level session and update progress
  endLevelSession(username: string, gameId: string, level: number, questionsAnswered: number, correctAnswers: number): void {
    const userProgress = this.getUserGameProgress();
    
    if (!userProgress[username] || !userProgress[username][gameId]) {
      console.warn(`No game data found for user ${username} and game ${gameId}`);
      return;
    }

    const sessionKey = `${username}_${gameId}_level_${level}_session`;
    const sessionDataStr = localStorage.getItem(sessionKey);
    
    if (!sessionDataStr) {
      console.warn(`No session data found for ${sessionKey}`);
      return;
    }

    const sessionData: LevelSessionData = JSON.parse(sessionDataStr);
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - sessionData.startTime) / (1000 * 60)); // Convert to minutes

    // Update session data
    sessionData.endTime = endTime;
    sessionData.timeSpent = timeSpent;
    sessionData.questionsAnswered = questionsAnswered;
    sessionData.correctAnswers = correctAnswers;
    sessionData.completed = true;

    // Update user game progress
    const gameData = userProgress[username][gameId];
    gameData.totalTimeSpent += timeSpent;
    gameData.totalSessions += 1;
    gameData.totalQuestions += questionsAnswered;
    gameData.totalCorrect += correctAnswers;
    
    // Ensure success rate doesn't exceed 100%
    gameData.successRate = gameData.totalQuestions > 0 ? 
      Math.min(gameData.totalCorrect / gameData.totalQuestions, 1) : 0;
    gameData.lastPlayed = Date.now();

    // Check if level was completed successfully (50% or higher)
    const levelSuccessRate = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
    if (levelSuccessRate >= 0.5 && !gameData.completedLevels.includes(level)) {
      gameData.completedLevels.push(level);
      
      // Advance to next level if not already at max
      if (level >= gameData.currentLevel && gameData.currentLevel < gameData.maxLevel) {
        gameData.currentLevel = Math.min(level + 1, gameData.maxLevel);
      }
    }

    // Save updated data
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    this.saveUserGameProgress(userProgress);
  }

  // Get game progress for a specific user and game
  getGameProgress(username: string, gameId: string): GameSessionData | null {
    const userProgress = this.getUserGameProgress();
    
    if (!userProgress[username] || !userProgress[username][gameId]) {
      return null;
    }

    return userProgress[username][gameId];
  }

  // Get all games progress for a user
  getUserGamesProgress(username: string): { [gameId: string]: GameSessionData } {
    const userProgress = this.getUserGameProgress();
    return userProgress[username] || {};
  }

  // Calculate progress percentage for a game
  getProgressPercentage(username: string, gameId: string): number {
    const gameData = this.getGameProgress(username, gameId);
    if (!gameData) {
      return 0;
    }
    
    return Math.round((gameData.completedLevels.length / gameData.maxLevel) * 100);
  }

  // Get current level for a game (next level to play)
  getCurrentLevel(username: string, gameId: string): number {
    const gameData = this.getGameProgress(username, gameId);
    if (!gameData) return 1;
    
    // If user has completed levels, current level is the next uncompleted level
    // Otherwise, it's the currentLevel from the data
    const nextUncompletedLevel = gameData.completedLevels.length + 1;
    return Math.min(nextUncompletedLevel, gameData.maxLevel);
  }

  // Get total time spent on a game in minutes
  getTotalTimeSpent(username: string, gameId: string): number {
    const gameData = this.getGameProgress(username, gameId);
    if (!gameData) return 0;
    
    return gameData.totalTimeSpent;
  }

  // Format time in a readable format
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }

  // Get level session data
  getLevelSessionData(username: string, gameId: string, level: number): LevelSessionData | null {
    const sessionKey = `${username}_${gameId}_level_${level}_session`;
    const sessionDataStr = localStorage.getItem(sessionKey);
    
    if (!sessionDataStr) return null;
    
    try {
      return JSON.parse(sessionDataStr);
    } catch (error) {
      console.error('Error parsing level session data:', error);
      return null;
    }
  }

  // Update level session data during gameplay
  updateLevelSession(username: string, gameId: string, level: number, questionsAnswered: number, correctAnswers: number): void {
    const sessionKey = `${username}_${gameId}_level_${level}_session`;
    const sessionDataStr = localStorage.getItem(sessionKey);
    
    if (!sessionDataStr) return;
    
    try {
      const sessionData: LevelSessionData = JSON.parse(sessionDataStr);
      sessionData.questionsAnswered = questionsAnswered;
      sessionData.correctAnswers = correctAnswers;
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error updating level session data:', error);
    }
  }

  // Get game name from game ID
  getGameName(gameId: string): string {
    const gameNames: { [key: string]: string } = {
      'combinedLetter': 'Combined Letter Games',
      'combinedWord': 'Combined Word Games', 
      'combinedSentence': 'Combined Sentence Games'
    };
    return gameNames[gameId] || gameId;
  }

  // Clear all data for a user (useful for testing or user deletion)
  clearUserData(username: string): void {
    const userProgress = this.getUserGameProgress();
    delete userProgress[username];
    this.saveUserGameProgress(userProgress);
    
    // Also clear level session data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`${username}_`)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get game statistics for dashboard
  getGameStatistics(username: string, gameId: string): {
    progressPercentage: number;
    currentLevel: number;
    totalTimeSpent: string;
    completedLevels: number;
    totalLevels: number;
    successRate: number;
    totalSessions: number;
  } {
    let gameData = this.getGameProgress(username, gameId);
    
    // If no game data exists, initialize it
    if (!gameData) {
      console.log(`Initializing game data for ${username} - ${gameId}`);
      this.initializeGameData(username, gameId, this.getGameName(gameId));
      gameData = this.getGameProgress(username, gameId);
    }
    
    if (!gameData) {
      console.error(`Failed to initialize game data for ${username} - ${gameId}`);
      return {
        progressPercentage: 0,
        currentLevel: 1,
        totalTimeSpent: '0m',
        completedLevels: 0,
        totalLevels: this.MAX_LEVELS,
        successRate: 0,
        totalSessions: 0
      };
    }

    return {
      progressPercentage: this.getProgressPercentage(username, gameId),
      currentLevel: this.getCurrentLevel(username, gameId),
      totalTimeSpent: this.formatTime(gameData.totalTimeSpent),
      completedLevels: gameData.completedLevels.length,
      totalLevels: gameData.maxLevel,
      successRate: Math.min(Math.round(gameData.successRate * 100), 100),
      totalSessions: gameData.totalSessions
    };
  }
}

// Export singleton instance
export const gameSessionTracker = new GameSessionTracker();
