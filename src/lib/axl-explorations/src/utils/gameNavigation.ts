import { NavigateFunction } from "react-router-dom";

export type GameType = 'letter' | 'combinedLetter' | 'combinedWord' | 'combinedSentence' | 'roarWord' | 'roarPhoneme' | 'roarPictureVocab' | 'roarRapidVisual' | 'sentence' | 'fillBlanks' | 'memory' | 'trueFalse' | 'collectBadge';

// Game routing configuration - single source of truth
export const GAME_ROUTES = {
  combinedLetter: '/combined-letter-games',
  combinedWord: '/combined-word-games',
  combinedSentence: '/combined-sentence-games',
  letter: '/letter-game',
  memory: '/memory-game',
  trueFalse: '/true-false-game',
  roarWord: '/roar-word-game',
  roarPhoneme: '/roar-phoneme-game',
  roarPictureVocab: '/roar-picture-vocab-game',
  roarRapidVisual: '/roar-rapid-visual-game',
  sentence: '/sentence-game',
  fillBlanks: '/fill-blanks-game',
  collectBadge: '/combined-letter-games/collect-badge',
  // Add new routed games here
} as const;

export type RoutedGameType = keyof typeof GAME_ROUTES;

// Games that use state-based navigation (legacy)
export const STATE_BASED_GAMES: GameType[] = [
  // All games now use URL routing
];

/**
 * Check if a game uses URL routing
 */
export const isRoutedGame = (gameId: GameType): gameId is RoutedGameType => {
  return gameId in GAME_ROUTES;
};

/**
 * Check if a game uses state-based navigation
 */
export const isStateBasedGame = (gameId: GameType): boolean => {
  return STATE_BASED_GAMES.includes(gameId);
};

/**
 * Get the route for a routed game
 */
export const getGameRoute = (gameId: RoutedGameType): string => {
  return GAME_ROUTES[gameId];
};

/**
 * Validate if a game type is valid
 */
export const isValidGameType = (gameId: string): gameId is GameType => {
  return isRoutedGame(gameId as GameType) || isStateBasedGame(gameId as GameType);
};

/**
 * Handles game selection with consistent navigation logic
 * @param gameId - The game ID to navigate to
 * @param navigate - React Router navigate function
 * @param setCurrentGame - State setter for current game (for non-routed games)
 */
export const handleGameNavigation = (
  gameId: GameType,
  navigate: NavigateFunction,
  setCurrentGame?: (game: GameType | null) => void
) => {
  // Validate game type
  if (!isValidGameType(gameId)) {
    console.error(`Invalid game type: ${gameId}`);
    return;
  }

  // Check if game uses URL routing
  if (isRoutedGame(gameId)) {
    const route = getGameRoute(gameId);
    navigate(route);
    return;
  }
  
  // Games that use state-based navigation
  if (setCurrentGame && isStateBasedGame(gameId)) {
    setCurrentGame(gameId);
  }
};

/**
 * Gets the appropriate back handler for a game
 * @param gameId - The game ID
 * @param navigate - React Router navigate function
 * @param setCurrentGame - State setter for current game
 * @param backToPath - Path to navigate back to (default: '/')
 */
export const getGameBackHandler = (
  gameId: GameType,
  navigate: NavigateFunction,
  setCurrentGame?: (game: GameType | null) => void,
  backToPath: string = '/'
) => {
  if (isRoutedGame(gameId)) {
    return () => navigate(backToPath);
  }
  
  if (setCurrentGame && isStateBasedGame(gameId)) {
    return () => setCurrentGame(null);
  }
  
  return () => navigate(backToPath);
};

