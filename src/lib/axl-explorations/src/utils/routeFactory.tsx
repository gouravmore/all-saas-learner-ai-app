import React, { Suspense, lazy } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { GAME_ROUTES, RoutedGameType } from './gameNavigation';
import { LoginDashboard } from "../components/LoginDashboard";

// Lazy load game components for better performance
const CombinedLetterGames = lazy(() => import('@/components/games/CombinedLetterGames'));
const CombinedWordGames = lazy(() => import('@/components/games/CombinedWordGames').then(module => ({ default: module.CombinedWordGames })));
const CombinedSentenceGames = lazy(() => import('@/components/games/CombinedSentenceGames').then(module => ({ default: module.CombinedSentenceGames })));
const LetterGame = lazy(() => import('@/components/games/LetterGame'));
const MemoryGame = lazy(() => import('@/components/games/MemoryGame').then(module => ({ default: module.MemoryGame })));
const TrueFalseGame = lazy(() => import('@/components/games/TrueFalseGame').then(module => ({ default: module.TrueFalseGame })));
const ROARWordGame = lazy(() => import('@/components/games/ROARWordGame').then(module => ({ default: module.ROARWordGame })));
const ROARPhonemeGame = lazy(() => import('@/components/games/ROARPhonemeGame').then(module => ({ default: module.ROARPhonemeGame })));
const ROARPictureVocabGame = lazy(() => import('@/components/games/ROARPictureVocabGame').then(module => ({ default: module.ROARPictureVocabGame })));
const ROARRapidVisualGame = lazy(() => import('@/components/games/ROARRapidVisualGame').then(module => ({ default: module.ROARRapidVisualGame })));
const SentenceGame = lazy(() => import('@/components/games/SentenceGame').then(module => ({ default: module.SentenceGame })));
const FillInBlanksGame = lazy(() => import('@/components/games/FillInBlanksGame'));
const CollectBadgeGame = lazy(() => import('@/components/games/CollectBadgeGame'));

// Game component mapping with lazy loading
const GAME_COMPONENTS = {
  combinedLetter: CombinedLetterGames,
  combinedWord: CombinedWordGames,
  combinedSentence: CombinedSentenceGames,
  letter: LetterGame,
  memory: MemoryGame,
  trueFalse: TrueFalseGame,
  roarWord: ROARWordGame,
  roarPhoneme: ROARPhonemeGame,
  roarPictureVocab: ROARPictureVocabGame,
  roarRapidVisual: ROARRapidVisualGame,
  sentence: SentenceGame,
  fillBlanks: FillInBlanksGame,
  collectBadge: CollectBadgeGame,
} as const;

// Loading component for lazy-loaded games
const GameLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading game...</p>
    </div>
  </div>
);

interface RouteFactoryProps {
  isAuthenticated: boolean;
  navigate: NavigateFunction;
  onLogin: (username: string) => void;
}

/**
 * Factory function to generate routes for all routed games
 */
export const generateGameRoutes = ({ isAuthenticated, navigate, onLogin }: RouteFactoryProps) => {
  const routes: React.ReactElement[] = [];

  // Combined games that should navigate to dashboard
  const combinedGames = ['combinedLetter', 'combinedWord', 'combinedSentence'];
  
  // Sub-routes that should navigate back to their parent
  const subRoutes = ['collectBadge'];

  // Generate routes for each game type
  Object.entries(GAME_ROUTES).forEach(([gameId, baseRoute]) => {
    const GameComponent = GAME_COMPONENTS[gameId as RoutedGameType];
    
    if (!GameComponent) {
      console.warn(`No component found for game: ${gameId}`);
      return;
    }

    // Determine back navigation path based on game type
    const isCombinedGame = combinedGames.includes(gameId);
    const isSubRoute = subRoutes.includes(gameId);
    
    let backToPath = '/all-activities';
    if (isCombinedGame) {
      backToPath = '/';
    } else if (isSubRoute) {
      // Sub-routes navigate back to their parent route
      if (gameId === 'collectBadge') {
        backToPath = '/combined-letter-games';
      }
    }

    // Level selector route
    routes.push(
      <Route 
        key={`${gameId}-selector`}
        path={baseRoute}
        element={
          isAuthenticated ? (
            <Suspense fallback={<GameLoadingFallback />}>
              <GameComponent onBack={() => navigate(backToPath)} />
            </Suspense>
          ) : (
            <LoginDashboard onLogin={onLogin} />
          )
        }
      />
    );

    // Level-specific route (skip for sub-routes like collect badge)
    if (!isSubRoute) {
      routes.push(
        <Route 
          key={`${gameId}-level`}
          path={`${baseRoute}/level/:level`}
          element={
            isAuthenticated ? (
              <Suspense fallback={<GameLoadingFallback />}>
                <GameComponent onBack={() => navigate(baseRoute)} />
              </Suspense>
            ) : (
              <LoginDashboard onLogin={onLogin} />
            )
          }
        />
      );
    }
  });

  return routes;
};

/**
 * Get all routed game paths for validation
 */
export const getAllGamePaths = (): string[] => {
  const paths: string[] = [];
  const subRoutes = ['collectBadge'];
  
  Object.entries(GAME_ROUTES).forEach(([gameId, baseRoute]) => {
    paths.push(baseRoute);
    // Only add level routes for non-sub-routes
    if (!subRoutes.includes(gameId)) {
      paths.push(`${baseRoute}/level/:level`);
    }
  });
  
  return paths;
};

/**
 * Check if a path is a game route
 */
export const isGameRoute = (path: string): boolean => {
  return getAllGamePaths().some(gamePath => {
    // Convert :level to regex pattern
    const pattern = gamePath.replace(':level', '[^/]+');
    return new RegExp(`^${pattern}$`).test(path);
  });
};

