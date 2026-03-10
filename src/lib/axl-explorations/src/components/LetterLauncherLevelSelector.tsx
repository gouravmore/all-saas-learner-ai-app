import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Rocket, Fuel, Star, Lock } from 'lucide-react';
import { SpaceBackground } from './SpaceBackground';
import { DetectiveBackground } from './DetectiveBackground';
import { SuperheroBackground } from './SuperheroBackground';
import { getFuelRequirement, getMissionDestination } from '../utils/fuelCalculation';
import { trackingAssessmentService } from '../utils/trackingAssessmentService';
import { sessionManager } from '../utils/sessionManager';
import { Language } from '../constants/languages';
import { SPACE_LEVEL_CONFIG, DETECTIVE_LEVEL_CONFIG, SUPERHERO_LEVEL_CONFIG } from './levelConfigs/levelConfigs';

interface LevelStats {
  level: number;
  highestScore?: number;
  totalMaxScore?: number;
  lastAttemptedOn?: string;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  color?: string;
  scorePercentage?: number;
}

interface LetterLauncherLevelSelectorProps {
  selectedLanguage: Language;
  currentLevel: number;
  maxLevels: number;
  onLevelSelect: (level: number) => void;
  onBack: () => void;
  onDemo?: () => void;
  gameKey: string;
  // NEW optional props with defaults matching Letter Launcher behavior
  theme?: 'space' | 'detective' | 'superhero';
  showStars?: boolean;
  showFuel?: boolean;
  title?: string;
}


// Level configurations are now imported from separate files in levelConfigs folder
// This allows for easier maintenance and adding new game themes in the future

// Helper function to get star count based on fuel earned vs thresholds (for speed games)
// Uses same logic as success screen: midpoint between required and max fuel
const getStarCount = (fuelEarned: number, level: number): number => {
  const { requiredFuel, maxFuel } = getFuelRequirement(level);
  
  // Same logic as Word Detective & Letter Launcher success screens
  if (fuelEarned < requiredFuel) return 0; // Failed - no stars (or 1 if they passed but barely)
  
  const midpoint = requiredFuel + (maxFuel - requiredFuel) / 2;
  if (fuelEarned > midpoint) return 3;
  return 2;
};

export function LetterLauncherLevelSelector({
  selectedLanguage,
  currentLevel,
  maxLevels,
  onLevelSelect,
  onBack,
  onDemo,
  gameKey,
  // NEW props with safe defaults (Letter Launcher behavior)
  theme = 'space',
  showStars = false,
  showFuel = true,
  title = 'Choose Your Mission'
}: LetterLauncherLevelSelectorProps) {
  const [levelStats, setLevelStats] = useState<Map<number, LevelStats>>(new Map());
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    const fetchLevelStats = async () => {
      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) return;

      setIsLoadingStats(true);
      const gameName = gameKey.split('_')[0];
      const statsMap = new Map<number, LevelStats>();

      const searchParams = {
        userId: currentUser.username,
        courseId: gameName,
        unitId: selectedLanguage
      };

      try {
        const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);

        // Handle object format (level1, level2, etc.)
        if (result.success && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
          for (let level = 1; level <= maxLevels; level++) {
            const levelKey = `level${level}`;
            const levelData = (result.data as any)[levelKey];
            
            // Process level if it exists in response (for speed games, all levels are returned)
            if (levelData) {
              const existingStats: LevelStats = {
                level,
                // Use backend's isUnlocked value directly (it handles speed game logic)
                // Backend sets isUnlocked correctly for speed games (1-3 always unlocked)
                isUnlocked: levelData.metadata?.isUnlocked ?? (level === 1),
                isCompleted: levelData.metadata?.isCompleted || false
              };

              // Extract fuel from highest score (totalScore) or metadata
              if (levelData.highest?.totalScore !== undefined && levelData.highest?.totalScore !== null) {
                existingStats.highestScore = levelData.highest.totalScore;
              } else if (levelData.metadata?.fuelEarned !== undefined) {
                existingStats.highestScore = levelData.metadata.fuelEarned;
              } else if (levelData.recent?.totalScore !== undefined) {
                existingStats.highestScore = levelData.recent.totalScore;
              }

              if (levelData.highest?.totalMaxScore !== undefined) {
                existingStats.totalMaxScore = levelData.highest.totalMaxScore;
              } else if (levelData.recent?.totalMaxScore !== undefined) {
                existingStats.totalMaxScore = levelData.recent.totalMaxScore;
              }

              if (levelData.metadata?.color) {
                existingStats.color = levelData.metadata.color;
              }

              // Extract lastAttemptedOn from highest or recent data
              if (levelData.highest?.createdOn) {
                existingStats.lastAttemptedOn = levelData.highest.createdOn;
              } else if (levelData.recent?.createdOn) {
                existingStats.lastAttemptedOn = levelData.recent.createdOn;
              }

              // Calculate score percentage for stars display
              if (existingStats.highestScore !== undefined && existingStats.totalMaxScore) {
                existingStats.scorePercentage = (existingStats.highestScore / existingStats.totalMaxScore) * 100;
              } else if (levelData.metadata?.scorePercentage !== undefined) {
                existingStats.scorePercentage = levelData.metadata.scorePercentage;
              }

              statsMap.set(level, existingStats);
            }
          }
        }
        // Handle array format (fallback for older API responses)
        else if (result && result.data && Array.isArray(result.data)) {
          result.data.forEach((item: any) => {
            const level = item.level || 1;
            const existingStats: LevelStats = statsMap.get(level) || {
              level,
              isUnlocked: true,
              isCompleted: false
            };

            if (item.totalScore !== undefined && item.totalScore !== null) {
              existingStats.highestScore = Math.max(
                existingStats.highestScore || 0,
                item.totalScore
              );
            }

            if (item.totalMaxScore !== undefined && item.totalMaxScore !== null) {
              existingStats.totalMaxScore = item.totalMaxScore;
            }

            if (item.createdAt) {
              const itemDate = new Date(item.createdAt);
              if (!existingStats.lastAttemptedOn || itemDate > new Date(existingStats.lastAttemptedOn)) {
                existingStats.lastAttemptedOn = item.createdAt;
              }
            }

            if (item.totalScore !== undefined && item.totalMaxScore !== undefined) {
              const percentage = (item.totalScore / item.totalMaxScore) * 100;
              if (percentage >= 80) {
                existingStats.isCompleted = true;
              }
            }

            statsMap.set(level, existingStats);
          });
        }
      } catch (error) {
        console.error('Error fetching level stats:', error);
      } finally {
        setIsLoadingStats(false);
        setLevelStats(statsMap);
      }
    };

    fetchLevelStats();
  }, [gameKey, selectedLanguage, maxLevels]);

  const handleLevelClick = (level: number) => {
    // All levels are now unlocked - allow navigation to any level
    onLevelSelect(level);
  };

  const getLevelFuelEarned = (level: number): number => {
    const stats = levelStats.get(level);
    return stats?.highestScore || 0;
  };

  const isLevelUnlocked = (level: number): boolean => {
    // Use backend isUnlocked value if available, otherwise default to unlocked
    const stats = levelStats.get(level);
    // Default: level 1 always unlocked, others depend on backend
    return stats?.isUnlocked ?? (level === 1);
  };

  // Get level card data based on theme (data-driven approach)
  const getLevelCardData = (level: number) => {
    const stats = levelStats.get(level);
    const { requiredFuel, maxFuel } = getFuelRequirement(level);
    const isCurrent = level === currentLevel;
    const isCompleted = stats?.isCompleted || false;

    if (theme === 'detective') {
      const detectiveConfig = DETECTIVE_LEVEL_CONFIG[level] || DETECTIVE_LEVEL_CONFIG[10];
      const levelFuelEarned = stats?.highestScore || 0;
      const hasBeenPlayed = stats?.lastAttemptedOn || (stats?.highestScore !== undefined && stats.highestScore > 0);
      
      return {
        icon: '🔍',
        name: detectiveConfig.name,
        scoreIconType: 'star', // 'star' for Star component, 'emoji' for string
        scoreIcon: '⭐',
        scoreEarned: hasBeenPlayed ? levelFuelEarned : 0,
        scoreRequired: requiredFuel,
        scoreColor: hasBeenPlayed 
          ? (levelFuelEarned >= requiredFuel ? 'text-green-400' : 'text-yellow-400')
          : 'text-white/60',
        image: detectiveConfig.image,
        imageAlt: detectiveConfig.name,
        imageWidth: 'clamp(140px, 20vw, 180px)',
        imageHeight: 'clamp(140px, 20vh, 180px)',
        imageLeft: '-20px',
        glowColor: 'rgba(234, 179, 8, 0.15)', // Yellow
        showScore: true,
        showFuel: false
      };
    }

    if (theme === 'superhero') {
      const superheroConfig = SUPERHERO_LEVEL_CONFIG[level] || SUPERHERO_LEVEL_CONFIG[10];
      const levelFuelEarned = stats?.highestScore || 0;
      const hasBeenPlayed = stats?.lastAttemptedOn || (stats?.highestScore !== undefined && stats.highestScore > 0);
      
      return {
        icon: '🦸',
        name: superheroConfig.name,
        scoreIconType: 'star', // 'star' for Star component, 'emoji' for string
        scoreIcon: '⭐',
        scoreEarned: hasBeenPlayed ? levelFuelEarned : 0,
        scoreRequired: requiredFuel,
        scoreColor: hasBeenPlayed 
          ? (levelFuelEarned >= requiredFuel ? 'text-green-400' : 'text-yellow-400')
          : 'text-white/60',
        image: superheroConfig.image,
        imageAlt: superheroConfig.name,
        imageWidth: 'clamp(140px, 21vw, 190px)',
        imageHeight: 'clamp(140px, 21vh, 190px)',
        imageLeft: '0px',
        glowColor: 'rgba(234, 179, 8, 0.15)', // Yellow
        showScore: true,
        showFuel: false
      };
    }

    // Space theme (default) - Letter Launcher
    const planetConfig = SPACE_LEVEL_CONFIG[level] || SPACE_LEVEL_CONFIG[10];
    const destination = getMissionDestination(level);
    const fuelEarned = getLevelFuelEarned(level);
    
    return {
      icon: '🚀',
      name: destination,
      scoreIconType: 'emoji', // 'star' for Star component, 'emoji' for string
      scoreIcon: '⛽',
      scoreEarned: fuelEarned,
      scoreRequired: requiredFuel,
      scoreColor: fuelEarned > 0 
        ? (fuelEarned >= requiredFuel ? 'text-green-400' : 'text-yellow-400')
        : 'text-white/60',
      image: planetConfig.image,
      imageAlt: destination,
      imageWidth: 'clamp(180px, 25vw, 240px)',
      imageHeight: 'clamp(200px, 28vh, 280px)',
      imageLeft: '-30px',
      glowColor: 'rgba(59, 130, 246, 0.2)', // Blue
      showScore: showFuel,
      showFuel: showFuel
    };
  };

  // Single reusable template for level card
  const renderLevelCard = (level: number) => {
    const cardData = getLevelCardData(level);
    const isCurrent = level === currentLevel;
    const stats = levelStats.get(level);
    const { requiredFuel } = getFuelRequirement(level);
    const fuelEarned = (theme === 'detective' || theme === 'superhero')
      ? (stats?.highestScore || 0)
      : getLevelFuelEarned(level);
    // Level is completed if backend says so OR if score meets requirement
    const isCompleted = stats?.isCompleted || (fuelEarned >= requiredFuel);
    // Check if level is locked (use backend value)
    const isLocked = !isLevelUnlocked(level);

    return (
      <div
        key={level}
        onClick={() => !isLocked && handleLevelClick(level)}
        className={`
          relative w-full h-[120px] sm:h-[130px]
          transition-all duration-300 overflow-hidden
          ${isLocked 
            ? 'cursor-not-allowed opacity-60' 
            : 'cursor-pointer hover:scale-105 hover:shadow-2xl'}
          ${isCurrent && !isLocked ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
        `}
        style={{
          background: isLocked
            ? 'rgba(0, 0, 0, 0.4)'
            : isCompleted 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'transparent',
          backdropFilter: (isCompleted || isLocked) ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: (isCompleted || isLocked) ? 'blur(10px)' : 'none',
          borderRadius: '15px',
          border: isLocked
            ? '2px solid rgba(255, 255, 255, 0.1)'
            : isCompleted 
              ? '2px solid rgba(255, 255, 255, 0.5)' 
              : '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isLocked
            ? 'none'
            : isCompleted 
              ? '0 8px 32px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
              : '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
        onMouseEnter={(e) => {
          if (!isLocked) {
            e.currentTarget.style.border = '2px solid white';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLocked) {
            e.currentTarget.style.border = isCompleted 
              ? '2px solid rgba(255, 255, 255, 0.5)' 
              : '2px solid rgba(255, 255, 255, 0.2)';
          }
        }}
      >
        {/* Content - Horizontal Layout: Text Left, Image Right */}
        <div className="h-full flex flex-row items-center justify-between p-3 sm:p-4 relative z-10">
          {/* Left Section - Text Content */}
          <div className="flex flex-col justify-center items-start gap-1.5 sm:gap-2 flex-shrink-0 z-10">
            <div className="flex flex-col items-start gap-1 text-white">
              {/* Icon + Name */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl">{cardData.icon}</span>
                <span className="text-sm sm:text-base font-bold">{cardData.name}</span>
              </div>
              
              {/* Score/Fuel Display */}
              {cardData.showScore && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {cardData.scoreIconType === 'star' ? (
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-500" />
                  ) : (
                    <span className="text-base sm:text-lg">{cardData.scoreIcon}</span>
                  )}
                  <span className="text-xs sm:text-sm font-semibold">
                    {isLoadingStats && theme === 'space' ? (
                      <span className="text-white/60">Loading...</span>
                    ) : (
                      <>
                        {cardData.scoreEarned > 0 ? (
                          <span className={`${cardData.scoreColor} font-extrabold text-base sm:text-lg drop-shadow-sm`}>
                            {cardData.scoreEarned}
                          </span>
                        ) : (
                          <span className="text-white font-medium">0</span>
                        )}
                        <span className="text-white font-medium"> / {cardData.scoreRequired}</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Level Image */}
        <div className="absolute right-0 top-0 bottom-0 w-[100px] sm:w-[120px] overflow-hidden" style={{ zIndex: 1 }}>
          <img
            src={cardData.image}
            alt={cardData.imageAlt}
            className="absolute object-contain drop-shadow-2xl"
            style={{
              filter: isLocked ? 'grayscale(100%) brightness(0.5)' : 'none',
              transition: 'filter 0.3s ease',
              width: cardData.imageWidth,
              height: cardData.imageHeight,
              maxWidth: 'none',
              maxHeight: 'none',
              objectFit: 'contain',
              left: cardData.imageLeft,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        {/* Glow Effect - only show for unlocked levels */}
        {!isLocked && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${cardData.glowColor} 0%, transparent 70%)`,
              opacity: isCurrent ? 0.6 : 0.3
            }}
          />
        )}

        {/* Lock Overlay for locked levels */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-black/50 rounded-full p-3">
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-white/80" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Common content (header + level grid)
  const renderContent = () => (
    <>
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-3 pb-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <Button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          {onDemo && (
            <Button
              onClick={onDemo}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
            >
              Watch Demo
            </Button>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mt-6 sm:mt-8 mb-0">
          {title}
        </h1>
      </div>

      {/* Level Boxes Container */}
      <div className="flex-1 flex flex-col items-start sm:items-center sm:justify-center px-4 sm:px-6 pt-4 pb-4 sm:pb-6 relative z-10 overflow-y-auto" style={{ color: 'white' }}>
        <div className={`w-full mx-auto ${
          theme === 'detective' 
            ? 'max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 sm:-mt-12' 
            : 'max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 sm:-mt-12'
        }`}>
          {Array.from({ length: maxLevels }, (_, i) => renderLevelCard(i + 1))}
        </div>
      </div>
    </>
  );

  // Render with appropriate background based on theme
  if (theme === 'detective') {
    return (
      <DetectiveBackground className="h-screen overflow-hidden">
        {/* Extra dark overlay for level selector page only */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="h-full flex flex-col relative z-10">
          {renderContent()}
        </div>
      </DetectiveBackground>
    );
  }

  if (theme === 'superhero') {
    return (
      <SuperheroBackground className="h-screen overflow-hidden">
        {/* Extra dark overlay for level selector page only */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="h-full flex flex-col relative z-10">
          {renderContent()}
        </div>
      </SuperheroBackground>
    );
  }

  return (
    <SpaceBackground className="h-screen overflow-hidden flex flex-col">
      {renderContent()}
    </SpaceBackground>
  );
}

